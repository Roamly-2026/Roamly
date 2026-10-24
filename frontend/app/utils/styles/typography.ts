// frontend/app/utils/styles/typography.ts

// TYPOGRAPHY SCALE TOKENS
export const TEXT_SIZES = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  md: 'text-md',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
} as const;

export const FONT_WEIGHTS = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
} as const;

// PREDEFINED TYPOGRAPHY CLASSES
export const TYPOGRAPHY_CONFIG = {
  // ------------------- GLOBAL TEXTS -------------------
  pageTitle: `${TEXT_SIZES['3xl']} ${FONT_WEIGHTS.bold} ${COLOR_TOKENS.text.inverse} tracking-wide text-center`,
  pageSubtitle: `${TEXT_SIZES.sm} opacity-80 capitalize ${COLOR_TOKENS.text.inverse} ${FONT_WEIGHTS.semibold} ${SPACING_TOKENS.mt.xs}`,
  sectionTitleTransparent: `${TEXT_SIZES['2xl']} ${FONT_WEIGHTS.bold} ${COLOR_TOKENS.text.inverse} tracking-wide text-center flex-1`,

  cardTitle: `${TEXT_SIZES.xl} ${FONT_WEIGHTS.bold} tracking-wide ${COLOR_TOKENS.text.primary} truncate block w-full`,
  cardTitleCenter: `${TEXT_SIZES.xl} ${FONT_WEIGHTS.bold} text-center tracking-wide ${COLOR_TOKENS.text.primary} truncate pr-2`,

  // ------------------- STATUS & ERRORS -------------------
  statusLoading: `text-center ${SPACING_TOKENS.py.xl} ${COLOR_TOKENS.text.inverse}`,
  statusError: `text-center ${SPACING_TOKENS.py.xl} ${COLOR_TOKENS.status.error}`,
  formStatusError: `${COLOR_TOKENS.status.error} ${TEXT_SIZES.sm} text-center ${FONT_WEIGHTS.medium}`,
  formStatusSuccess: `${COLOR_TOKENS.status.success} ${TEXT_SIZES.sm} text-center ${FONT_WEIGHTS.medium}`,

  // ------------------- HOME PAGE TEXTS -------------------
  homeHeroText: `${SPACING_TOKENS.mt.sm} ${SPACING_TOKENS.mb.lg} ${TEXT_SIZES.lg} ${COLOR_TOKENS.text.inverse} ${FONT_WEIGHTS.medium} opacity-90 leading-relaxed`,
  homeSectionTitle: `${TEXT_SIZES['3xl']} ${FONT_WEIGHTS.bold} ${COLOR_TOKENS.text.inverse} tracking-wide`,
  homeSectionText: `${SPACING_TOKENS.mt.md} ${SPACING_TOKENS.mb.xl} ${TEXT_SIZES.lg} ${COLOR_TOKENS.text.inverse} ${FONT_WEIGHTS.medium} opacity-90 leading-relaxed`,

  // ------------------- HEADER NAV TEXTS -------------------
  logoText: `${TEXT_SIZES.lg} md:${TEXT_SIZES.xl} ${FONT_WEIGHTS.semibold} tracking-wider`,
  navLink: 'hover:text-btn-primary hover:underline underline-offset-4 transition-colors',

  // ------------------- AUTH TEXTS -------------------
  authTitle: `${TEXT_SIZES['2xl']} ${FONT_WEIGHTS.medium} tracking-wide ${COLOR_TOKENS.text.brand}`,
  authTitleWrapper: `text-center ${SPACING_TOKENS.m.xl}`,

  // ------------------- PROFILE TEXTS -------------------
  profileLabel: `w-28 ${FONT_WEIGHTS.medium} opacity-80 shrink-0`,
  profileValue: `${FONT_WEIGHTS.bold} ${TEXT_SIZES.lg}`,
  profileValueLg: `${FONT_WEIGHTS.bold} ${TEXT_SIZES.xl} leading-none`,

  // ------------------- MODAL TEXTS & FORMS -------------------
  modalText: `${TEXT_SIZES.sm} text-content-primary/80 ${SPACING_TOKENS.py.sm}`,
  modalHighlight: `block ${FONT_WEIGHTS.semibold} ${SPACING_TOKENS.mt.xs} text-btn-primary`,
  modalInlineHighlight: `${FONT_WEIGHTS.semibold} ${SPACING_TOKENS.mt.xs} text-btn-primary`,
  modalErrorBox: `${TEXT_SIZES.xs} ${FONT_WEIGHTS.semibold} ${COLOR_TOKENS.status.errorBox} ${SPACING_TOKENS.mt.sm} ${SPACING_TOKENS.p.sm} rounded border`,
  modalSuccessBox: `${TEXT_SIZES.xs} ${FONT_WEIGHTS.semibold} text-btn-primary ${SPACING_TOKENS.mt.sm} bg-btn-primary/10 ${SPACING_TOKENS.p.sm} rounded border border-btn-primary/20`,
  modalActionBtnCancel: 'w-full sm:w-auto',
  modalActionBtnOk: 'w-full sm:w-auto',
  inputLabel: `block ${TEXT_SIZES.sm} ${FONT_WEIGHTS.medium} ${COLOR_TOKENS.text.primary} ${SPACING_TOKENS.mb.xs}`,
  inputError: `${TEXT_SIZES.xs} ${COLOR_TOKENS.status.error} ${SPACING_TOKENS.mt.xs}`,
} as const;