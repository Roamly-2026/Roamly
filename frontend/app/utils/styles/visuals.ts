// frontend/app/utils/styles/visuals.ts

export const RADIUS_TOKENS = {
  none: 'rounded-none',
  xs: 'rounded', // Small status boxes
  sm: 'rounded-lg', // Small badges, inner elements
  md: 'rounded-xl', // Inputs, dropdown items, inner cards
  lg: 'rounded-2xl', // Dropdown menus, profile picture
  xl: 'rounded-[25px]', // Main Cards, Modals
  xlImportant: '!rounded-[25px]',
  full: 'rounded-full', // Buttons, Avatars, Search inputs, Pills
  fullImportant: '!rounded-full',
} as const;

export const SHADOW_TOKENS = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  inner: 'shadow-inner',
  footer: 'shadow-[0_-2px_10px_rgba(0,0,0,0.02)]',
  button: 'shadow-[inset_0_1px_3px_rgba(255,255,255,0.3),0_2px_4px_rgba(122,154,130,0.3)]',
  card: 'shadow-[0_15px_40px_rgba(47,62,50,0.15)]',
  modal: 'shadow-[0_20px_50px_rgba(0,0,0,0.15)]',
  heavy: 'shadow-[0_20px_50px_rgba(0,0,0,0.2)]',
} as const;

export const BORDER_TOKENS = {
  none: 'border-0 ring-0',
  // Standard CSS borders
  thin: 'border border-content-primary/10',
  medium: 'border border-content-primary/20',
  strong: 'border border-content-primary/30',
  brand: 'border border-btn-primary/50',
  brandSubtle: 'border border-btn-primary/20',
  cardSubtle: 'border border-surface-card/50',
  selectedLeft: 'border-l-4 border-l-btn-primary',
  // Directional dividers
  dividerTop: 'border-t border-content-primary/10',
  dividerBottom: 'border-b border-content-primary/10',
  dividerRight: 'border-r border-content-primary/10',
  // Tailwind Rings
  ringSubtle: 'ring-1 ring-content-primary/10',
  ringCard: 'ring-1 ring-surface-card/50',
  ringAvatar: 'ring-2 ring-surface-card',
  ringBrandSubtle: 'ring-1 ring-btn-primary/30',
  ringBrandMedium: 'ring-1 ring-btn-primary/40',
  ringBrand: 'ring-1 ring-btn-primary',
  ringSecondary: 'ring-1 ring-btn-secondary',
  ringSuccess: 'ring-2 ring-status-success',
  ringInput: 'ring-1 ring-field-border focus:ring-2 focus:ring-field-focus',
  ringError: 'ring-1 ring-status-error focus:ring-2 focus:ring-status-error',
  ringInverseStrong: 'ring-2 ring-content-inverse/60',
} as const;

export const GLASS_TOKENS = {
  faint: 'bg-surface-card/20',
  subtle: 'bg-surface-card/40 backdrop-blur-md',
  medium: 'bg-surface-card/50 backdrop-blur-md',
  default: 'bg-surface-card/70 backdrop-blur-xl',
  strong: 'bg-surface-card/90 backdrop-blur-xl',
  page: 'bg-surface-page/70 backdrop-blur-md',
  modal: '!bg-surface-modal/70 backdrop-blur-2xl',
  outline: 'bg-surface-card-hover/10 backdrop-blur-xl',
} as const;

export const OPACITY_TOKENS = {
  muted: 'opacity-40',
  subtle: 'opacity-70',
  soft: 'opacity-80',
  high: 'opacity-90',
  full: 'opacity-100',
  hoverSoft: 'hover:opacity-80',
  hoverSubtle: 'hover:opacity-70',
} as const;

export const SIZE_TOKENS = {
  // Interactive control heights (Buttons, Inputs, Selects) - min-h allows dynamic text wrapping if needed
  controlHeight: {
    xs: 'min-h-8 h-8',
    sm: 'min-h-9 h-9',
    md: 'min-h-10 h-10',
    lg: 'min-h-11 h-11',
    xl: 'min-h-12 h-12',
    '2xl': 'min-h-14 h-14',
    otpDesktop: 'w-12 h-14',
    otpMobile: 'w-11 h-13',
  },
  // Square icons
  icon: {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    tall: '!w-6 !h-8',
    button: 'w-10 h-10',
    hero: 'w-14 h-14'
  },
  // Avatars & Profile Pictures
  avatar: {
    xs: 'w-5 h-5',
    sm: 'w-9 h-9',
    md: 'w-10 h-10',
    lg: 'w-24 h-24',
    xl: 'w-40 h-40',
  },
  // Container & Dropdown Widths
  container: {
    dropdownSm: 'w-36',
    dropdownMd: 'min-w-56',
    dropdownLg: 'sm:min-w-64',
    dropdownFilter: 'w-72',
    search: 'max-w-sm',
    cardMd: 'max-w-md',
    modalMd: 'sm:max-w-md',
    modalLg: 'sm:max-w-lg',
    modalXl: 'sm:max-w-3xl',
    contentLg: 'max-w-3xl',
    contentXl: 'max-w-6xl',
    pageMax: 'max-w-7xl',
    calendarMax: 'max-w-360',
  },
} as const;

export const Z_INDEX_TOKENS = {
  base: 'z-10',
  header: 'z-50',
  overlay: 'z-[100]',
  modal: 'z-[101]',
} as const;

export const INTERACTION_TOKENS = {
  base: 'transition-colors cursor-pointer',
  all: 'transition-all cursor-pointer',
  opacity: 'transition-opacity cursor-pointer',
  lift: 'transition-all hover:-translate-y-1 cursor-pointer',
  cardLift: 'transition-transform hover:-translate-y-1',
} as const;
