// frontend/app/types/memories.type.ts
import type { MEMORY_REACTION_EMOJIS } from '~/utils/constants/memories.constants';
import type { FileUserDto } from '~/types/files.type';

export type MemoryReactionEmoji = (typeof MEMORY_REACTION_EMOJIS)[number];

export interface MemoryReactionDto {
  emoji: MemoryReactionEmoji;
  count: number;
  reacted_by_me: boolean;
}

export interface MemoryCommentDto {
  comment_id: number;
  content: string;
  created_at: string;
  users: FileUserDto;
}
