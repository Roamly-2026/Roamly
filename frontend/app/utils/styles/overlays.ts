// frontend/app/utils/styles/overlays.ts

// AVATAR
export const AVATAR_SIZES = {
  xs: 'w-5 h-5 text-xs',
  sm: 'w-9 h-9 text-base',
  md: 'w-10 h-10 text-base',
  lg: `w-24 h-24 text-4xl ${SHADOW_TOKENS.md} ${SPACING_TOKENS.m.sm}`,
} as const;

export const AVATAR_CONFIG = {
  slots: {
    root: `!bg-btn-primary text-btn-primary-text flex items-center justify-center ${RADIUS_TOKENS.full} ${SHADOW_TOKENS.sm} ${BORDER_TOKENS.ringBrandSubtle} font-bold overflow-hidden hover:ring-2 hover:ring-btn-primary transition-all`,
  },
  variants: {
    size: {
      header: { root: AVATAR_SIZES.sm },
      profileLg: { root: AVATAR_SIZES.lg },
    },
  },
  defaultVariants: { size: 'header' },
} as const;

// SHARED DROPDOWN & SELECT APPEARANCES
export const MENU_APPEARANCES = {
  // Shared floating panel style for dropdowns, selects, and calendar filters
  content: `z-[100] ${GLASS_TOKENS.strong} ${RADIUS_TOKENS.lg} ${BORDER_TOKENS.ringBrandSubtle} ${SHADOW_TOKENS.xl} ${COLOR_TOKENS.text.primary}`,
  // Shared interactive highlight state for menu items
  itemHighlight: `hover:bg-btn-primary/20 data-[highlighted]:bg-btn-primary/20 data-[highlighted]:text-content-primary ${RADIUS_TOKENS.md} ${INTERACTION_TOKENS.base}`,
  itemBase: `flex items-center justify-start text-left ${SPACING_TOKENS.py.sm} ${SPACING_TOKENS.px.md} font-medium`,
} as const;

// SELECT & DROPDOWN CONFIGS
export const SELECT_CONFIG = {
  slots: {
    base: `w-fit ${RADIUS_TOKENS.full} text-btn-primary !ring-1 !ring-btn-primary !bg-surface-card/90 !pl-8 !${SPACING_TOKENS.px.md} !${SPACING_TOKENS.py.sm} ${INTERACTION_TOKENS.base} text-xs font-semibold ${SHADOW_TOKENS.sm} text-left`,
    trailingIcon: 'absolute right-2 w-4 h-4 transition-transform pointer-events-none text-btn-primary',
    content: `${MENU_APPEARANCES.content} !bg-surface-card ${SPACING_TOKENS.mt.sm}`,
    viewport: `${SPACING_TOKENS.p.xs}`,
    item: `${MENU_APPEARANCES.itemBase} ${COLOR_TOKENS.text.primary} ${MENU_APPEARANCES.itemHighlight} text-xs mx-1 my-1 whitespace-nowrap`,
  },
} as const;

export const DROPDOWN_MENU_CONFIG = {
  slots: {
    content: `${MENU_APPEARANCES.content} ${SPACING_TOKENS.p.xs} w-36`,
    item: `${MENU_APPEARANCES.itemBase} ${SPACING_TOKENS.gap.sm} w-full text-md text-content-primary/80 hover:${COLOR_TOKENS.text.primary} ${MENU_APPEARANCES.itemHighlight}`,
    itemLeadingIcon: '!w-6 !h-8 !text-btn-primary shrink-0',
  },
} as const;

export const WIDE_DROPDOWN_MENU_CONFIG = {
  slots: {
    content: `${MENU_APPEARANCES.content} ${SPACING_TOKENS.p.sm} sm:min-w-64`,
    item: `flex items-start ${SPACING_TOKENS.gap.sm} w-full justify-start text-left ${SPACING_TOKENS.px.md} ${SPACING_TOKENS.py.sm} text-md font-medium text-content-primary/80 hover:${COLOR_TOKENS.text.primary} ${MENU_APPEARANCES.itemHighlight}`,
    itemLeadingIcon: '!w-6 !h-6 !text-btn-primary shrink-0',
  },
} as const;

export const SELECT_MENU_CONFIG = {
  slots: {
    base: `bg-transparent ${COLOR_TOKENS.text.inverse} font-bold text-xl ${BORDER_TOKENS.none} ${SHADOW_TOKENS.none} focus:ring-0 focus:outline-none cursor-pointer hover:opacity-80 transition-opacity`,
    trailingIcon: `${COLOR_TOKENS.text.inverse} w-6 h-6`,
    content: `${MENU_APPEARANCES.content} ${SPACING_TOKENS.mt.sm} min-w-56`,
    item: `${MENU_APPEARANCES.itemBase} ${COLOR_TOKENS.text.primary} ${MENU_APPEARANCES.itemHighlight} text-sm mx-1 my-1`,
  },
} as const;

// MODAL CONFIG
export const MODAL_CONFIG = {
  slots: {
    overlay: `fixed inset-0 z-[100] ${COLOR_TOKENS.surface.overlay} backdrop-blur-sm`,
    content: `fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[95%] sm:w-full ${GLASS_TOKENS.modal} !${RADIUS_TOKENS.xl} ${SHADOW_TOKENS.modal} !ring-1 !ring-surface-card/50 !divide-none !border-0 focus:!outline-none overflow-hidden flex flex-col`,
    header: `${SPACING_TOKENS.p.md} sm:${SPACING_TOKENS.px.lg} !border-0 !ring-0`,
    body: `${SPACING_TOKENS.responsive.cardPadding} !border-0 !ring-0`,
    footer: `${SPACING_TOKENS.p.md} sm:${SPACING_TOKENS.px.lg} !border-0 !ring-0`,
  },
} as const;

// TOOLTIP CONFIG
export const TOOLTIP_CONFIG = {
  slots: {
    content: `z-[100] ${GLASS_TOKENS.strong} ${COLOR_TOKENS.text.primary} ${BORDER_TOKENS.ringBrandSubtle} ${RADIUS_TOKENS.md} ${SPACING_TOKENS.px.sm} ${SPACING_TOKENS.py.xs} text-xs font-semibold ${SHADOW_TOKENS.xl}`,
    arrow: 'fill-surface-card/90',
  },
} as const;