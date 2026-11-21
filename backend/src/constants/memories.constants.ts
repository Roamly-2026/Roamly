export const MEMORY_REACTION_EMOJIS = [
  '\u2764\uFE0F', // ❤️
  '\u{1F602}', // 😂
  '\u{1F62E}', // 😮
  '\u{1F622}', // 😢
  '\u{1F525}', // 🔥
  '\u{1F44D}', // 👍
  '\u{1F4AF}', // 💯
] as const;

export type MemoryReactionEmoji = (typeof MEMORY_REACTION_EMOJIS)[number];
