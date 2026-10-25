// frontend/app/utils/styles/overlays.ts

// 1. AVATAR
export const AVATAR_SIZES = {
  xs: `${SIZE_TOKENS.avatar.xs} ${TEXT_SIZES.xs}`,
  sm: `${SIZE_TOKENS.avatar.sm} ${TEXT_SIZES.base}`,
  md: `${SIZE_TOKENS.avatar.md} ${TEXT_SIZES.base}`,
  lg: `${SIZE_TOKENS.avatar.lg} ${TEXT_SIZES['4xl']} ${SHADOW_TOKENS.md} ${SPACING_TOKENS.m.sm}`,
} as const;

export const AVATAR_CONFIG = {
  slots: {
    root: `!bg-btn-primary text-btn-primary-text flex items-center justify-center ${RADIUS_TOKENS.full} ${SHADOW_TOKENS.sm} ${BORDER_TOKENS.ringBrandSubtle} ${FONT_WEIGHTS.bold} overflow-hidden hover:ring-2 hover:ring-btn-primary transition-all`,
  },
  variants: {
    size: {
      header: { root: AVATAR_SIZES.sm },
      profileLg: { root: AVATAR_SIZES.lg },
    },
  },
  defaultVariants: { size: 'header' },
} as const;

// 2. SHARED DROPDOWN & SELECT APPEARANCES
export const MENU_APPEARANCES = {
  content: `${Z_INDEX_TOKENS.overlay} ${GLASS_TOKENS.strong} ${RADIUS_TOKENS.lg} ${BORDER_TOKENS.ringBrandSubtle} ${SHADOW_TOKENS.xl} ${COLOR_TOKENS.text.primary}`,
  itemHighlight: `hover:${COLOR_TOKENS.surface.brandTint} data-[highlighted]:bg-btn-primary/20 data-[highlighted]:text-content-primary ${RADIUS_TOKENS.md} ${INTERACTION_TOKENS.base}`,
  itemBase: `flex items-center justify-start text-left ${SPACING_TOKENS.py.sm} ${SPACING_TOKENS.px.md} ${FONT_WEIGHTS.medium}`,
} as const;

// 3. SELECT & DROPDOWN CONFIGS
export const SELECT_CONFIG = {
  slots: {
    base: `w-full sm:w-fit min-w-40 ${RADIUS_TOKENS.full} ${COLOR_TOKENS.text.brandAccent} !ring-1 !ring-btn-primary !bg-surface-card/90 !pl-8 !pr-8 !py-2 ${INTERACTION_TOKENS.base} ${TEXT_SIZES.xs} ${FONT_WEIGHTS.semibold} ${SHADOW_TOKENS.sm} text-left`,
    trailingIcon: `absolute right-2.5 ${SIZE_TOKENS.icon.sm} transition-transform pointer-events-none ${COLOR_TOKENS.text.brandAccent}`,
    content: `${MENU_APPEARANCES.content} !bg-surface-card ${SPACING_TOKENS.mt.sm} min-w-[var(--reka-select-trigger-width)]`,
    viewport: '!p-1',
    item: `${MENU_APPEARANCES.itemBase} !px-4 !py-2 ${COLOR_TOKENS.text.primary} ${MENU_APPEARANCES.itemHighlight} ${TEXT_SIZES.xs} mx-1 my-1 whitespace-nowrap`,
  },
} as const;

export const DROPDOWN_MENU_CONFIG = {
  slots: {
    content: `${MENU_APPEARANCES.content} ${SPACING_TOKENS.p.xs} ${SIZE_TOKENS.container.dropdownSm}`,
    item: `${MENU_APPEARANCES.itemBase} ${SPACING_TOKENS.gap.sm} w-full ${TEXT_SIZES.md} ${COLOR_TOKENS.text.primarySoft} hover:${COLOR_TOKENS.text.primary} ${MENU_APPEARANCES.itemHighlight}`,
    itemLeadingIcon: `${SIZE_TOKENS.icon.tall} !text-btn-primary shrink-0`,
  },
} as const;

export const WIDE_DROPDOWN_MENU_CONFIG = {
  slots: {
    content: `${MENU_APPEARANCES.content} ${SPACING_TOKENS.p.sm} ${SIZE_TOKENS.container.dropdownLg}`,
    item: `flex items-start ${SPACING_TOKENS.gap.sm} w-full justify-start text-left ${SPACING_TOKENS.px.md} ${SPACING_TOKENS.py.sm} ${TEXT_SIZES.md} ${FONT_WEIGHTS.medium} ${COLOR_TOKENS.text.primarySoft} hover:${COLOR_TOKENS.text.primary} ${MENU_APPEARANCES.itemHighlight}`,
    itemLeadingIcon: `!w-6 !h-6 !text-btn-primary shrink-0`,
  },
} as const;

export const SELECT_MENU_CONFIG = {
  slots: {
    base: `bg-transparent ${COLOR_TOKENS.text.inverse} ${FONT_WEIGHTS.bold} ${TEXT_SIZES.xl} ${BORDER_TOKENS.none} ${SHADOW_TOKENS.none} focus:ring-0 focus:outline-none ${OPACITY_TOKENS.hoverSoft} ${INTERACTION_TOKENS.opacity}`,
    trailingIcon: `${COLOR_TOKENS.text.inverse} ${SIZE_TOKENS.icon.lg}`,
    content: `${MENU_APPEARANCES.content} ${SPACING_TOKENS.mt.sm} ${SIZE_TOKENS.container.dropdownMd}`,
    item: `${MENU_APPEARANCES.itemBase} ${COLOR_TOKENS.text.primary} ${MENU_APPEARANCES.itemHighlight} ${TEXT_SIZES.sm} ${SPACING_TOKENS.mx.xs} ${SPACING_TOKENS.my.xs}`,
  },
} as const;

// 4. MODAL CONFIG
export const MODAL_CONFIG = {
  slots: {
    overlay: `fixed inset-0 ${Z_INDEX_TOKENS.overlay} ${COLOR_TOKENS.surface.overlay} backdrop-blur-sm`,
    content: `fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${Z_INDEX_TOKENS.modal} w-[95%] sm:w-full ${GLASS_TOKENS.modal} ${RADIUS_TOKENS.xlImportant} ${SHADOW_TOKENS.modal} !ring-1 !ring-surface-card/50 !divide-none !border-0 focus:!outline-none overflow-hidden flex flex-col`,
    header: `${SPACING_TOKENS.p.md} sm:${SPACING_TOKENS.px.lg} !border-0 !ring-0`,
    body: `${SPACING_TOKENS.responsive.cardPadding} !border-0 !ring-0`,
    footer: `${SPACING_TOKENS.p.md} sm:${SPACING_TOKENS.px.lg} !border-0 !ring-0`,
  },
} as const;

// 5. TOOLTIP CONFIG
export const TOOLTIP_CONFIG = {
  slots: {
    content: `${Z_INDEX_TOKENS.overlay} ${GLASS_TOKENS.strong} ${COLOR_TOKENS.text.primary} ${BORDER_TOKENS.ringBrandSubtle} ${RADIUS_TOKENS.md} ${SPACING_TOKENS.px.sm} ${SPACING_TOKENS.py.xs} ${TEXT_SIZES.xs} ${FONT_WEIGHTS.semibold} ${SHADOW_TOKENS.xl}`,
    arrow: 'fill-surface-card/90',
  },
} as const;
