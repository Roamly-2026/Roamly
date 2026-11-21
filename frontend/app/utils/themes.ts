// frontend/app/utils/themes.ts

export type ColorMode = 'LIGHT' | 'DARK' | 'SYSTEM';

// Adding a theme: a key here, its blocks in assets/css/tokens.css,
// a label in UI_TEXT.appearance.themes and images in public/themes/<key>/
export const THEME_KEYS = ['default', 'ocean'] as const;

export type ThemeKey = (typeof THEME_KEYS)[number];

export const resolveThemeKey = (key?: string | null): ThemeKey =>
  THEME_KEYS.find((themeKey) => themeKey === key) ?? 'default';
