// frontend/app/utils/reactions.utils.ts
import type { MemoryReactionDto, MemoryReactionEmoji } from '~/types/memories.type';

// the expected result of a click, shown before the server answers
export const toggleReactionLocally = (
  reactions: MemoryReactionDto[],
  emoji: MemoryReactionEmoji,
): MemoryReactionDto[] => {
  const existing = reactions.find((reaction) => reaction.emoji === emoji);

  let updated: MemoryReactionDto[];

  if (!existing) {
    updated = [...reactions, { emoji, count: 1, reacted_by_me: true }];
  } else {
    updated = reactions.map((reaction) =>
      reaction.emoji === emoji
        ? {
            ...reaction,
            count: reaction.count + (reaction.reacted_by_me ? -1 : 1),
            reacted_by_me: !reaction.reacted_by_me,
          }
        : reaction,
    );
  }

  // same order as the backend, emojis nobody uses are hidden
  return MEMORY_REACTION_EMOJIS.map((item) =>
    updated.find((reaction) => reaction.emoji === item),
  ).filter((reaction): reaction is MemoryReactionDto => !!reaction && reaction.count > 0);
};
