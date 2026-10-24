// frontend/app/utils/styles/buttons.ts

const BASE_BUTTON = `inline-flex items-center justify-center ${RADIUS_TOKENS.full} tracking-wide ${INTERACTION_TOKENS.base}`;

// BUTTON SIZES (Controls height, padding, font-size, font-weight)
export const BUTTON_SIZES = {
  xs: `h-8 !${SPACING_TOKENS.px.md} !${SPACING_TOKENS.py.xs} text-xs font-semibold`,
  sm: `h-9 !${SPACING_TOKENS.px.lg} !${SPACING_TOKENS.py.sm} text-xs font-bold`,
  md: `h-10 ${SPACING_TOKENS.px.xl} text-sm font-semibold !min-w-18`,
  lg: 'h-12 !px-10 text-lg font-bold',
  xl: 'h-14 !px-12 !text-xl font-bold',
  // Fixed dimensions for square/circle icon buttons
  iconMd: 'w-10 h-10 p-0 font-semibold shrink-0',
  iconSm: `${SPACING_TOKENS.p.xs} [&>span]:!w-5 [&>span]:!h-5`,
} as const;

// BUTTON APPEARANCES (Controls colors, borders, shadows, glass effects)
export const BUTTON_APPEARANCES = {
  primary: `${COLOR_TOKENS.button.primary} ${SHADOW_TOKENS.sm}`,
  primaryElevated: `${COLOR_TOKENS.button.primary} ${SHADOW_TOKENS.button} ${INTERACTION_TOKENS.lift}`,
  
  secondary: `${COLOR_TOKENS.button.secondary} ${SHADOW_TOKENS.sm}`,
  secondaryElevated: `${COLOR_TOKENS.button.secondary} ${SHADOW_TOKENS.button} ${INTERACTION_TOKENS.lift}`,
  
  // Outline / Hollow styles
  outlinePrimary: `text-btn-primary ${BORDER_TOKENS.ringBrandSubtle} hover:bg-btn-primary/20`,
  outlineSecondary: `bg-surface-card/50 ${BORDER_TOKENS.ringSecondary} text-btn-secondary hover:bg-btn-secondary hover:text-btn-secondary-text`,
  
  // Glass styles
  glass: `${GLASS_TOKENS.default} ${COLOR_TOKENS.text.primary} ${BORDER_TOKENS.ringSubtle} hover:bg-surface-card/90`,
  glassOutline: `${GLASS_TOKENS.default} ${BORDER_TOKENS.brand} ${COLOR_TOKENS.text.primary} hover:bg-surface-page`,
  glassDanger: `${GLASS_TOKENS.default} ${COLOR_TOKENS.text.primary} ${BORDER_TOKENS.ringSubtle} hover:bg-btn-danger hover:text-btn-danger-text`,
  glassHighlight: `${GLASS_TOKENS.default} ${COLOR_TOKENS.text.primary} ${BORDER_TOKENS.ringSubtle} hover:bg-btn-primary hover:text-btn-primary-text`,
  glassBrand: `${GLASS_TOKENS.default} text-btn-primary ${BORDER_TOKENS.ringSubtle} hover:bg-surface-subtle`,

  // Ghost styles (no background, subtle icon actions)
  ghostDanger: 'text-content-primary/70 hover:text-status-error',
  ghostBrand: `${COLOR_TOKENS.text.inverse} hover:text-btn-primary`,
} as const;

// 3. PREDEFINED BUTTON VARIANTS (Ready to plug into app.config.ts)
export const BUTTON_VARIANTS = {
  // Small Action Buttons
  smallPrimaryActionButton: `${BASE_BUTTON} ${BUTTON_SIZES.sm} ${BUTTON_APPEARANCES.primary}`,
  smallAccentActionButton: `${BASE_BUTTON} ${BUTTON_SIZES.sm} ${BUTTON_APPEARANCES.secondary}`,
  smallHollowActionButton: `${BASE_BUTTON} ${BUTTON_SIZES.sm} ${BUTTON_APPEARANCES.outlinePrimary}`,

  // Hero Buttons
  actionHeroButton: `${BASE_BUTTON} ${BUTTON_SIZES.xl} ${BUTTON_APPEARANCES.primaryElevated}`,
  actionAccentHeroButton: `${BASE_BUTTON} ${BUTTON_SIZES.lg} ${BUTTON_APPEARANCES.secondaryElevated}`,

  // Standard Modal / Form Action Buttons
  actionOkButton: `${BASE_BUTTON} ${BUTTON_SIZES.lg} ${BUTTON_APPEARANCES.primaryElevated}`,
  actionCancelButton: `${BASE_BUTTON} ${BUTTON_SIZES.lg} ${BUTTON_APPEARANCES.outlineSecondary}`,

  // Glass UI Buttons
  glassButton: `${BASE_BUTTON} ${BUTTON_SIZES.md} ${BUTTON_APPEARANCES.glass}`,
  glassOutlineButton: `${BASE_BUTTON} ${BUTTON_SIZES.sm} ${BUTTON_APPEARANCES.glassOutline}`,

  // Glass Icon Buttons
  glassIconButton: `${BASE_BUTTON} ${BUTTON_SIZES.iconMd} ${BUTTON_APPEARANCES.glass}`,
  glassIconButtonDanger: `${BASE_BUTTON} ${BUTTON_SIZES.iconMd} ${BUTTON_APPEARANCES.glassDanger}`,
  glassIconButtonHighlight: `${BASE_BUTTON} ${BUTTON_SIZES.iconMd} ${BUTTON_APPEARANCES.glassHighlight}`,
  glassIconButtonBrand: `${BASE_BUTTON} ${BUTTON_SIZES.iconMd} ${BUTTON_APPEARANCES.glassBrand}`,

  // Ghost Icon Buttons
  ghostDangerIconButton: `${INTERACTION_TOKENS.base} ${BUTTON_SIZES.iconSm} ${BUTTON_APPEARANCES.ghostDanger}`,
  ghostBrandIconButton: `${INTERACTION_TOKENS.base} ${BUTTON_SIZES.iconSm} ${BUTTON_APPEARANCES.ghostBrand}`,
} as const;