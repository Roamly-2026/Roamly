import { Prisma } from '@prisma/client';
import prisma from '../../prisma';
import { PERMISSIONS } from '../../constants/permission.constants';
import { MEMORY_REACTION_EMOJIS, MemoryReactionEmoji } from '../../constants/memories.constants';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../utils/ServerError';
import { commentSelect, MemoryComment, MemoryReactionSummary } from '../../types/memories.types';
import { assertPermission, loadPermissionContext } from '../shared/permissions.service';
import { createCommentSchema } from './memories.validation';

export const listComments = async (userUuid: string, fileId: number): Promise<MemoryComment[]> => {
  await validateMemoryAccess(userUuid, fileId);

  return prisma.media_comments.findMany({
    where: {
      file_id: fileId,
    },
    orderBy: [{ created_at: 'asc' }, { comment_id: 'asc' }],
    select: commentSelect,
  });
};

export const createComment = async (
  userUuid: string,
  fileId: number,
  content: string,
): Promise<MemoryComment> => {
  // the route validates too, but the service can be called from other places
  // (tests, other controllers), so the content is trimmed and checked here as well
  const { content: validContent } = createCommentSchema.parse({ content });

  const { userId } = await validateMemoryAccess(userUuid, fileId);

  return prisma.media_comments.create({
    data: {
      file_id: fileId,
      user_id: userId,
      content: validContent,
    },
    select: commentSelect,
  });
};

export const deleteComment = async (
  userUuid: string,
  fileId: number,
  commentId: number,
): Promise<void> => {
  const { userId } = await validateMemoryAccess(userUuid, fileId);

  const comment = await prisma.media_comments.findUnique({
    where: {
      comment_id: commentId,
    },
  });

  if (!comment) {
    throw new NotFoundError('Comment not found!');
  }

  if (comment.file_id !== fileId) {
    throw new BadRequestError('This comment does not belong to this memory!');
  }

  if (comment.user_id !== userId) {
    throw new ForbiddenError('Only the author can delete this comment!');
  }

  await prisma.media_comments.delete({
    where: {
      comment_id: commentId,
    },
  });
};

export const toggleReaction = async (
  userUuid: string,
  fileId: number,
  emoji: MemoryReactionEmoji,
): Promise<MemoryReactionSummary[]> => {
  const { userId } = await validateMemoryAccess(userUuid, fileId);

  const reaction = { file_id: fileId, user_id: userId, emoji };

  // the memory row is locked until the end of the transaction, so toggles of the
  // same memory run one after the other and each one sees the result of the previous
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.$queryRaw`SELECT file_id FROM media_files WHERE file_id = ${fileId} FOR UPDATE`;

    const existingReaction = await tx.media_reactions.findUnique({
      where: {
        file_id_user_id_emoji: reaction,
      },
    });

    if (existingReaction) {
      await tx.media_reactions.delete({
        where: {
          file_id_user_id_emoji: reaction,
        },
      });
    } else {
      await tx.media_reactions.create({
        data: reaction,
      });
    }

    const reactions = await tx.media_reactions.findMany({
      where: {
        file_id: fileId,
      },
      select: {
        emoji: true,
        user_id: true,
      },
    });

    return summarizeReactions(reactions, userId);
  });
};

// counts per emoji, in the order of the emoji list, without the user ids
export const summarizeReactions = (
  reactions: { emoji: string; user_id: number }[],
  userId: number,
): MemoryReactionSummary[] => {
  return MEMORY_REACTION_EMOJIS.map((emoji: MemoryReactionEmoji) => {
    const reactionsWithEmoji = reactions.filter(
      (reaction: { emoji: string }) => reaction.emoji === emoji,
    );

    return {
      emoji,
      count: reactionsWithEmoji.length,
      reacted_by_me: reactionsWithEmoji.some(
        (reaction: { user_id: number }) => reaction.user_id === userId,
      ),
    };
  }).filter((summary: MemoryReactionSummary) => summary.count > 0);
};

// Only active group members with media read permission can interact with a memory.
async function validateMemoryAccess(userUuid: string, fileId: number): Promise<{ userId: number }> {
  const memory = await prisma.media_files.findUnique({
    where: {
      file_id: fileId,
    },
    select: {
      files: {
        select: {
          groups: { select: { uuid: true } },
        },
      },
    },
  });

  if (!memory) {
    throw new NotFoundError('Memory not found!');
  }

  const groupUuid = memory.files.groups?.uuid;
  if (!groupUuid) {
    throw new BadRequestError('This memory does not belong to a group!');
  }

  const context = await loadPermissionContext(userUuid, groupUuid);
  assertPermission(context, PERMISSIONS.MEDIA_READ);

  return { userId: context.userId };
}
