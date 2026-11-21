import prisma from '../../prisma';
import { ROLES } from '../../constants/roles.constants';
import { MEMORY_REACTION_EMOJIS, MemoryReactionEmoji } from '../../constants/memories.constants';
import { BadRequestError, ForbiddenError } from '../../utils/ServerError';
import { commentSelect, MemoryComment, MemoryReactionSummary } from '../../types/memories.types';

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
  const { userId } = await validateMemoryAccess(userUuid, fileId);

  return prisma.media_comments.create({
    data: {
      file_id: fileId,
      user_id: userId,
      content,
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

  const comment = await prisma.media_comments.findUniqueOrThrow({
    where: {
      comment_id: commentId,
    },
  });

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

  const existingReaction = await prisma.media_reactions.findUnique({
    where: {
      file_id_user_id_emoji: reaction,
    },
  });

  // deleteMany and skipDuplicates, so a double click can not cause an error
  if (existingReaction) {
    await prisma.media_reactions.deleteMany({
      where: reaction,
    });
  } else {
    await prisma.media_reactions.createMany({
      data: [reaction],
      skipDuplicates: true,
    });
  }

  const reactions = await prisma.media_reactions.findMany({
    where: {
      file_id: fileId,
    },
    select: {
      emoji: true,
      user_id: true,
    },
  });

  return summarizeReactions(reactions, userId);
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

// only members and leaders of the memory's group can interact with it,
// invited users are not part of the group yet
async function validateMemoryAccess(userUuid: string, fileId: number): Promise<{ userId: number }> {
  const memory = await prisma.media_files.findUniqueOrThrow({
    where: {
      file_id: fileId,
    },
    select: {
      files: {
        select: {
          group_id: true,
        },
      },
    },
  });

  if (memory.files.group_id === null) {
    throw new BadRequestError('This memory does not belong to a group!');
  }

  const groupProfile = await prisma.group_profiles.findFirst({
    where: {
      users: {
        uuid: userUuid,
      },
      group_id: memory.files.group_id,
      roles: {
        type: {
          in: [ROLES.LEADER, ROLES.MEMBER],
        },
      },
    },
    select: {
      user_id: true,
    },
  });

  if (!groupProfile) {
    throw new ForbiddenError('User must be part of the group to interact with this memory!');
  }

  return { userId: groupProfile.user_id };
}
