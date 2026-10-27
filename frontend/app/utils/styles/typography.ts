// frontend/app/utils/styles/typography.ts

// 1. TYPOGRAPHY SCALE TOKENS
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

export const TEXT_TRACKING = {
  normal: 'tracking-normal',
  wide: 'tracking-wide',
  wider: 'tracking-wider',
} as const;

export const TEXT_LEADING = {
  none: 'leading-none',
  normal: 'leading-normal',
  relaxed: 'leading-relaxed',
} as const;

// 2. PREDEFINED TYPOGRAPHY CLASSES
export const TYPOGRAPHY_CONFIG = {
  // ------------------- GLOBAL TEXTS -------------------
  pageTitle: `${TEXT_SIZES['3xl']} ${FONT_WEIGHTS.bold} ${COLOR_TOKENS.text.inverse} ${TEXT_TRACKING.wide} text-center`,
  pageSubtitle: `${TEXT_SIZES.sm} ${OPACITY_TOKENS.soft} capitalize ${COLOR_TOKENS.text.inverse} ${FONT_WEIGHTS.semibold} ${SPACING_TOKENS.mt.xs}`,
  sectionTitleTransparent: `${TEXT_SIZES['2xl']} ${FONT_WEIGHTS.bold} ${COLOR_TOKENS.text.inverse} ${TEXT_TRACKING.wide} text-center flex-1`,

  cardTitle: `${TEXT_SIZES.xl} ${FONT_WEIGHTS.bold} ${TEXT_TRACKING.wide} ${COLOR_TOKENS.text.primary} truncate block w-full`,
  cardTitleCenter: `${TEXT_SIZES.xl} ${FONT_WEIGHTS.bold} text-center ${TEXT_TRACKING.wide} ${COLOR_TOKENS.text.primary} truncate `,

  // ------------------- STATUS & ERRORS -------------------
  statusLoading: `text-center ${SPACING_TOKENS.py.xl} ${COLOR_TOKENS.text.inverse}`,
  statusError: `text-center ${SPACING_TOKENS.py.xl} ${COLOR_TOKENS.status.error}`,
  formStatusError: `${COLOR_TOKENS.status.error} ${TEXT_SIZES.sm} text-center ${FONT_WEIGHTS.medium}`,
  formStatusSuccess: `${COLOR_TOKENS.status.success} ${TEXT_SIZES.sm} text-center ${FONT_WEIGHTS.medium}`,

  // ------------------- HOME PAGE TEXTS -------------------
  homeHeroText: `${SPACING_TOKENS.mt.sm} ${SPACING_TOKENS.mb.lg} ${TEXT_SIZES.lg} ${COLOR_TOKENS.text.inverse} ${FONT_WEIGHTS.medium} ${OPACITY_TOKENS.high} ${TEXT_LEADING.relaxed}`,
  homeSectionTitle: `${TEXT_SIZES['3xl']} ${FONT_WEIGHTS.bold} ${COLOR_TOKENS.text.inverse} ${TEXT_TRACKING.wide}`,
  homeSectionText: `${SPACING_TOKENS.mt.md} ${SPACING_TOKENS.mb.xl} ${TEXT_SIZES.lg} ${COLOR_TOKENS.text.inverse} ${FONT_WEIGHTS.medium} ${OPACITY_TOKENS.high} ${TEXT_LEADING.relaxed}`,

  // ------------------- HEADER NAV TEXTS -------------------
  logoText: `${TEXT_SIZES.lg} md:${TEXT_SIZES.xl} ${FONT_WEIGHTS.semibold} ${TEXT_TRACKING.wider}`,
  navLink: `hover:${COLOR_TOKENS.text.brandAccent} hover:underline underline-offset-4 transition-colors`,
  headerUsername: `${FONT_WEIGHTS.bold} ${COLOR_TOKENS.text.primary} ${TEXT_TRACKING.wide} ${TEXT_SIZES.sm} hidden sm:block`,
  loadingTitle: `${TEXT_SIZES['2xl']} ${FONT_WEIGHTS.bold} ${COLOR_TOKENS.text.primary} ${TEXT_TRACKING.wider} animate-pulse`,

  // ------------------- AUTH TEXTS -------------------
  authTitle: `${TEXT_SIZES['2xl']} ${FONT_WEIGHTS.medium} ${TEXT_TRACKING.wide} ${COLOR_TOKENS.text.brand}`,
  authTitleWrapper: `text-center ${SPACING_TOKENS.m.xl}`,

  // ------------------- PROFILE TEXTS -------------------
  profileLabel: `w-28 ${FONT_WEIGHTS.medium} ${OPACITY_TOKENS.soft} shrink-0`,
  profileValue: `${FONT_WEIGHTS.bold} ${TEXT_SIZES.lg}`,
  profileValueLg: `${FONT_WEIGHTS.bold} ${TEXT_SIZES.xl} ${TEXT_LEADING.none}`,

  // ------------------- MODAL TEXTS & FORMS -------------------
  modalText: `${TEXT_SIZES.sm} ${COLOR_TOKENS.text.primarySoft} ${SPACING_TOKENS.py.sm}`,
  modalHighlight: `block ${FONT_WEIGHTS.semibold} ${SPACING_TOKENS.mt.xs} ${COLOR_TOKENS.text.brandAccent}`,
  modalInlineHighlight: `${FONT_WEIGHTS.semibold} ${SPACING_TOKENS.mt.xs} ${COLOR_TOKENS.text.brandAccent}`,
  modalErrorBox: `${TEXT_SIZES.xs} ${FONT_WEIGHTS.semibold} ${COLOR_TOKENS.status.errorBox} ${SPACING_TOKENS.mt.sm} ${SPACING_TOKENS.p.sm} ${RADIUS_TOKENS.xs} border`,
  modalSuccessBox: `${TEXT_SIZES.xs} ${FONT_WEIGHTS.semibold} ${COLOR_TOKENS.text.brandAccent} ${SPACING_TOKENS.mt.sm} ${COLOR_TOKENS.surface.brandTintSubtle} ${SPACING_TOKENS.p.sm} ${RADIUS_TOKENS.xs} ${BORDER_TOKENS.brandSubtle}`,
  modalActionBtnCancel: 'w-full sm:w-auto',
  modalActionBtnOk: 'w-full sm:w-auto',
  inputLabel: `block ${TEXT_SIZES.sm} ${FONT_WEIGHTS.medium} ${COLOR_TOKENS.text.primary} ${SPACING_TOKENS.mb.xs}`,
  inputError: `${TEXT_SIZES.xs} ${COLOR_TOKENS.status.error} ${SPACING_TOKENS.mt.xs}`,
} as const;
