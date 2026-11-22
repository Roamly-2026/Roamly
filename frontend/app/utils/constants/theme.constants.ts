export type ThemePaletteId = 'default' | 'forest' | 'ocean' | 'minimal';
export type BackgroundType = 'none' | 'preset' | 'custom';

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
    colors: ['#faf9f6', '#edf1ee', '#7a9a82', '#e5a93b'],
  },
  {
    id: 'forest',
    label: 'Forest',
    colors: ['#f2f5f3', '#e3ebe5', '#2d6a4f', '#d97706'],
  },
  {
    id: 'ocean',
    label: 'Ocean',
    colors: ['#f0f7fa', '#e0eff5', '#0284c7', '#f59e0b'],
  },
  {
    id: 'minimal',
    label: 'Minimal',
    colors: ['#ffffff', '#f4f4f5', '#18181b', '#71717a'],
  },
];

export const PRESET_BACKGROUND_OPTIONS: PresetBackgroundOption[] = [
  { id: 'mountains', label: 'Mountain', url: '/backgrounds/mountains.webp' },
  { id: 'forest', label: 'Forest', url: '/backgrounds/forest.webp' },
  { id: 'ocean', label: 'Ocean', url: '/backgrounds/ocean.webp' },
  { id: 'minimal-grid', label: 'Minimalist', url: '/backgrounds/minimal.webp' },
];
