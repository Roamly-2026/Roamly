// frontend/app/utils/themes.ts

export type ColorMode = 'LIGHT' | 'DARK' | 'SYSTEM';

// Keys must match the [data-theme='<key>'] blocks in assets/css/tokens.css
export const THEMES = [
  { key: 'default', label: UI_TEXT.appearance.themes.default, preview: '#7a9a82' },
  { key: 'ocean', label: UI_TEXT.appearance.themes.ocean, preview: '#4f86a8' },
] as const;

export type ThemeKey = (typeof THEMES)[number]['key'];

export const resolveThemeKey = (key?: string | null): ThemeKey =>
  THEMES.find((theme) => theme.key === key)?.key ?? 'default';
