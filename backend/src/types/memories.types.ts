import { Prisma } from '@prisma/client';
import { creatorSelect } from './files.types';
import { MemoryReactionEmoji } from '../constants/memories.constants';

export const commentSelect = {
  comment_id: true,
  content: true,
  created_at: true,
  users: creatorSelect,
} as const;

export type MemoryComment = Prisma.media_commentsGetPayload<{
  select: typeof commentSelect;
}>;

export type MemoryReactionSummary = {
  emoji: MemoryReactionEmoji;
  count: number;
  reacted_by_me: boolean;
};
