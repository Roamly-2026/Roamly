export type ThemePaletteId = 'default' | 'forest' | 'ocean' | 'minimal';
export type BackgroundType = 'system' | 'none' | 'preset' | 'custom';
// Mirrors the backend color_mode enum
export type ColorMode = 'LIGHT' | 'DARK' | 'SYSTEM';

export interface ThemePaletteOption {
  id: ThemePaletteId;
  label: string;
  colors: [string, string, string, string]; // [bg, card, primary, secondary]
}

export interface PresetBackgroundOption {
  id: string;
  label: string;
  url: string;
}

export const THEME_PALETTE_OPTIONS: ThemePaletteOption[] = [
  {
    id: 'default',
    label: 'Default',
    colors: ['#4a6652', '#e7ece8', '#7a9a82', '#e5a93b'],
  },
  {
    id: 'forest',
    label: 'Forest',
    colors: ['#1f4736', '#cee1d4', '#2d6a4f', '#d97706'],
  },
  {
    id: 'ocean',
    label: 'Ocean',
    colors: ['#1b5273', '#c7e3f1', '#0284c7', '#f59e0b'],
  },
  {
    id: 'minimal',
    label: 'Minimal',
    colors: ['#2e2e33', '#f4f4f5', '#18181b', '#71717a'],
  },
];

export const PRESET_BACKGROUND_OPTIONS: PresetBackgroundOption[] = [
  { id: 'mountains', label: 'Mountain', url: '/backgrounds/mountains.webp' },
  { id: 'forest', label: 'Forest', url: '/backgrounds/forest.webp' },
  { id: 'ocean', label: 'Ocean', url: '/backgrounds/ocean.webp' },
  { id: 'minimal-grid', label: 'Minimalist', url: '/backgrounds/minimal.webp' },
];

export const COLOR_MODE_OPTIONS: { id: ColorMode; icon: string }[] = [
  { id: 'LIGHT', icon: 'i-heroicons-sun' },
  { id: 'DARK', icon: 'i-heroicons-moon' },
  { id: 'SYSTEM', icon: 'i-heroicons-computer-desktop' },
];
