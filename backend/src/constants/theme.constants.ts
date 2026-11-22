export const THEME_PALETTES = {
  DEFAULT: 'default',
  FOREST: 'forest',
  OCEAN: 'ocean',
  MINIMAL: 'minimal',
} as const;

export type ThemePalette = (typeof THEME_PALETTES)[keyof typeof THEME_PALETTES];

export const BACKGROUND_TYPES = {
  NONE: 'none',
  PRESET: 'preset',
  CUSTOM: 'custom',
} as const;

export type BackgroundType = (typeof BACKGROUND_TYPES)[keyof typeof BACKGROUND_TYPES];

export const PRESET_BACKGROUNDS = ['mountains', 'forest', 'ocean', 'minimal-grid'] as const;

export type PresetBackground = (typeof PRESET_BACKGROUNDS)[number];
