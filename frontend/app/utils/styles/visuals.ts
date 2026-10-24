// frontend/app/utils/styles/visuals.ts

export const RADIUS_TOKENS = {
  none: 'rounded-none',
  sm: 'rounded-lg',        // Small badges, inner elements
  md: 'rounded-xl',        // Inputs, dropdown items, inner cards
  lg: 'rounded-2xl',       // Dropdown menus, profile picture
  xl: 'rounded-[25px]',    // Main Cards, Modals
  full: 'rounded-full',    // Buttons, Avatars, Search inputs, Pills
} as const;

export const SHADOW_TOKENS = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  inner: 'shadow-inner',
  // Custom elevated shadows used across the project
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
  brand: 'border border-btn-primary/50',
  // Tailwind Rings (used heavily on glass, inputs and buttons)
  ringSubtle: 'ring-1 ring-content-primary/10',
  ringCard: 'ring-1 ring-surface-card/50',
  ringBrandSubtle: 'ring-1 ring-btn-primary/30',
  ringBrand: 'ring-1 ring-btn-primary',
  ringSecondary: 'ring-1 ring-btn-secondary',
  ringInput: 'ring-1 ring-field-border focus:ring-2 focus:ring-field-focus',
  ringError: 'ring-1 ring-status-error focus:ring-2 focus:ring-status-error',
  ringInverseStrong: 'ring-2 ring-content-inverse/60',
} as const;

export const GLASS_TOKENS = {
  // Subtle glass (Calendar columns, subtle containers)
  subtle: 'bg-surface-card/40 backdrop-blur-md',
  // Standard UI glass (Buttons, Cards, Headers, Toolbars)
  default: 'bg-surface-card/70 backdrop-blur-xl',
  // High-contrast glass (Dropdowns, Select menus, Tooltips)
  strong: 'bg-surface-card/90 backdrop-blur-xl',
  // Deep blur glass (Modals)
  modal: '!bg-surface-modal/70 backdrop-blur-2xl',
  // Transparent outline glass (Landing page outline cards)
  outline: 'bg-surface-card-hover/10 backdrop-blur-xl',
} as const;

export const INTERACTION_TOKENS = {
  base: 'transition-colors cursor-pointer',
  all: 'transition-all cursor-pointer',
  lift: 'transition-all hover:-translate-y-1 cursor-pointer',
  cardLift: 'transition-transform hover:-translate-y-1',
} as const;