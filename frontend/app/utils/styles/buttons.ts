// frontend/app/utils/styles/buttons.ts

const BASE_BUTTON = `inline-flex items-center justify-center ${RADIUS_TOKENS.full} ${TEXT_TRACKING.wide} ${INTERACTION_TOKENS.base}`;

// 1. BUTTON SIZES (Uses SIZE_TOKENS, SPACING_TOKENS, TEXT_SIZES, FONT_WEIGHTS)
export const BUTTON_SIZES = {
  xs: `${SIZE_TOKENS.controlHeight.xs} ${SPACING_TOKENS.pxImportant.md} ${SPACING_TOKENS.pyImportant.xs} ${TEXT_SIZES.xs} ${FONT_WEIGHTS.semibold}`,
  sm: `${SIZE_TOKENS.controlHeight.sm} ${SPACING_TOKENS.pxImportant.lg} ${SPACING_TOKENS.pyImportant.sm} ${TEXT_SIZES.xs} ${FONT_WEIGHTS.bold}`,
  md: `${SIZE_TOKENS.controlHeight.md} ${SPACING_TOKENS.pxImportant.xl} ${TEXT_SIZES.sm} ${FONT_WEIGHTS.semibold} !min-w-28 shrink-0 whitespace-nowrap`,
  lg: `${SIZE_TOKENS.controlHeight.xl} ${SPACING_TOKENS.pxImportant['2xl']} ${TEXT_SIZES.lg} ${FONT_WEIGHTS.bold}`,
  xl: `${SIZE_TOKENS.controlHeight['2xl']} ${SPACING_TOKENS.pxImportant['3xl']} !text-xl ${FONT_WEIGHTS.bold}`,
  // Icon buttons
  iconMd: `${SIZE_TOKENS.icon.button} !p-0 ${FONT_WEIGHTS.semibold} shrink-0`,
  iconSm: `!p-1 [&>span]:!w-5 [&>span]:!h-5`,
} as const;

// 2. BUTTON APPEARANCES
export const BUTTON_APPEARANCES = {
  primary: `${COLOR_TOKENS.button.primary} ${SHADOW_TOKENS.sm} ${INTERACTION_TOKENS.base}`,
  primaryElevated: `${COLOR_TOKENS.button.primary} ${SHADOW_TOKENS.button} ${INTERACTION_TOKENS.lift}`,

  secondary: `${COLOR_TOKENS.button.secondary} ${SHADOW_TOKENS.sm}`,
  secondaryElevated: `${COLOR_TOKENS.button.secondary} ${SHADOW_TOKENS.button} ${INTERACTION_TOKENS.lift}`,

  // Outline / Hollow styles
  outlinePrimary: `${COLOR_TOKENS.text.brandAccent} ${BORDER_TOKENS.ringBrandMedium} hover:${COLOR_TOKENS.surface.brandTint}`,
  outlineSecondary: `bg-surface-card/50 ${BORDER_TOKENS.ringSecondary} text-btn-secondary hover:bg-btn-secondary hover:text-btn-secondary-text ${SHADOW_TOKENS.button} ${INTERACTION_TOKENS.lift}`,

  // Glass styles
  glass: `${GLASS_TOKENS.default} ${COLOR_TOKENS.text.primary} ${BORDER_TOKENS.ringSubtle} hover:bg-surface-card/90`,
  glassOutline: `${GLASS_TOKENS.default} ${BORDER_TOKENS.brand} ${COLOR_TOKENS.text.primary} hover:bg-surface-page`,
  glassDanger: `${GLASS_TOKENS.default} ${COLOR_TOKENS.text.primary} ${BORDER_TOKENS.ringSubtle} hover:bg-btn-danger hover:text-btn-danger-text`,
  glassHighlight: `${GLASS_TOKENS.default} ${COLOR_TOKENS.text.primary} ${BORDER_TOKENS.ringSubtle} hover:bg-btn-primary hover:text-btn-primary-text`,
  glassBrand: `${GLASS_TOKENS.default} ${COLOR_TOKENS.text.brandAccent} ${BORDER_TOKENS.ringSubtle} hover:bg-surface-subtle`,

  // Ghost styles
  ghostDanger: `${COLOR_TOKENS.text.primaryMuted} hover:!text-red-500 [&>span]:transition-colors hover:[&>span]:!text-red-500 hover:bg-red-500/10 ${RADIUS_TOKENS.full}`,
  ghostBrand: `${COLOR_TOKENS.text.primaryMuted} hover:!text-btn-primary [&>span]:transition-colors hover:[&>span]:!text-btn-primary hover:bg-btn-primary/10 ${RADIUS_TOKENS.full}`,

  // Danger styles
  danger: `${COLOR_TOKENS.button.danger} ${SHADOW_TOKENS.sm}`,
  dangerElevated: `${COLOR_TOKENS.button.danger} ${SHADOW_TOKENS.md} ${INTERACTION_TOKENS.lift}`,
} as const;

// 3. PREDEFINED BUTTON VARIANTS
export const BUTTON_VARIANTS = {
  smallPrimaryActionButton: `${BASE_BUTTON} ${BUTTON_SIZES.sm} ${BUTTON_APPEARANCES.primary}`,
  smallAccentActionButton: `${BASE_BUTTON} ${BUTTON_SIZES.sm} ${BUTTON_APPEARANCES.secondary}`,
  smallHollowActionButton: `${BASE_BUTTON} ${BUTTON_SIZES.sm} ${BUTTON_APPEARANCES.outlinePrimary}`,

  actionHeroButton: `${BASE_BUTTON} ${BUTTON_SIZES.xl} ${BUTTON_APPEARANCES.primaryElevated}`,
  actionAccentHeroButton: `${BASE_BUTTON} ${BUTTON_SIZES.lg} ${BUTTON_APPEARANCES.secondaryElevated}`,

  actionOkButton: `${BASE_BUTTON} ${BUTTON_SIZES.lg} ${BUTTON_APPEARANCES.primaryElevated}`,
  actionCancelButton: `${BASE_BUTTON} ${BUTTON_SIZES.lg} ${BUTTON_APPEARANCES.outlineSecondary}`,

  glassButton: `${BASE_BUTTON} ${BUTTON_SIZES.md} ${BUTTON_APPEARANCES.glass}`,
  glassOutlineButton: `${BASE_BUTTON} ${BUTTON_SIZES.sm} ${BUTTON_APPEARANCES.glassOutline}`,

  glassIconButton: `${BASE_BUTTON} ${BUTTON_SIZES.iconMd} ${BUTTON_APPEARANCES.glass}`,
  glassIconButtonDanger: `${BASE_BUTTON} ${BUTTON_SIZES.iconMd} ${BUTTON_APPEARANCES.glassDanger}`,
  glassIconButtonHighlight: `${BASE_BUTTON} ${BUTTON_SIZES.iconMd} ${BUTTON_APPEARANCES.glassHighlight}`,
  glassIconButtonBrand: `${BASE_BUTTON} ${BUTTON_SIZES.iconMd} ${BUTTON_APPEARANCES.glassBrand}`,

  ghostDangerIconButton: `${INTERACTION_TOKENS.base} ${BUTTON_SIZES.iconSm} ${BUTTON_APPEARANCES.ghostDanger}`,
  ghostBrandIconButton: `${INTERACTION_TOKENS.base} ${BUTTON_SIZES.iconSm} ${BUTTON_APPEARANCES.ghostBrand}`,

  smallDangerActionButton: `${BASE_BUTTON} ${BUTTON_SIZES.sm} ${BUTTON_APPEARANCES.danger}`,
  actionDangerButton: `${BASE_BUTTON} ${BUTTON_SIZES.lg} ${BUTTON_APPEARANCES.dangerElevated}`,
} as const;

export const BUTTON_CONFIG = {
  variants: {
    variant: BUTTON_VARIANTS,
  },
  defaultVariants: {
    variant: 'actionOkButton',
  },
} as const;
