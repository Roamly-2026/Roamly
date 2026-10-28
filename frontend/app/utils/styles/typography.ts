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

// 2. PREDEFINED SEMANTIC TYPOGRAPHY CLASSES
export const TYPOGRAPHY_CONFIG = {
  // ------------------- GLOBAL TEXTS -------------------
  pageTitle: `${TEXT_SIZES['3xl']} ${FONT_WEIGHTS.bold} ${COLOR_TOKENS.text.inverse} ${TEXT_TRACKING.wide} text-center`,
  pageSubtitle: `${TEXT_SIZES.sm} ${OPACITY_TOKENS.soft} capitalize ${COLOR_TOKENS.text.inverse} ${FONT_WEIGHTS.semibold} ${SPACING_TOKENS.mt.xs}`,
  sectionTitleTransparent: `${TEXT_SIZES['2xl']} ${FONT_WEIGHTS.bold} ${COLOR_TOKENS.text.inverse} ${TEXT_TRACKING.wide} text-center flex-1 truncate`,

  cardTitle: `${TEXT_SIZES.xl} ${FONT_WEIGHTS.bold} ${TEXT_TRACKING.wide} ${COLOR_TOKENS.text.primary} truncate block w-full`,
  cardTitleSm: `${TEXT_SIZES.sm} ${FONT_WEIGHTS.bold} ${COLOR_TOKENS.text.primary} truncate`,
  cardTitleCenter: `${TEXT_SIZES.xl} ${FONT_WEIGHTS.bold} text-center ${TEXT_TRACKING.wide} ${COLOR_TOKENS.text.primary} w-full`,
  cardTitleInverseCenter: `${TEXT_SIZES.xl} ${FONT_WEIGHTS.bold} text-center ${TEXT_TRACKING.wide} ${COLOR_TOKENS.text.inverse} w-full`,
  documentHeaderTitle: `${FONT_WEIGHTS.bold} ${TEXT_SIZES.sm} ${SPACING_TOKENS.pr.sm} truncate`,

  // ------------------- SEMANTIC META & BODY ROLES -------------------
  metaHighlight: `${FONT_WEIGHTS.bold} ${COLOR_TOKENS.text.primary}`,
  metaHighlightCap: `${FONT_WEIGHTS.bold} ${COLOR_TOKENS.text.primary} capitalize`,
  metaLabelSoft: `${FONT_WEIGHTS.medium} ${OPACITY_TOKENS.subtle}`,
  metaTime: `${FONT_WEIGHTS.semibold}`,
  bodySmSoft: `${TEXT_SIZES.sm} ${COLOR_TOKENS.text.primarySoft} ${FONT_WEIGHTS.medium}`,
  bodySmMuted: `${TEXT_SIZES.sm} ${COLOR_TOKENS.text.primaryMuted}`,
  bodySmMutedTruncate: `${TEXT_SIZES.sm} ${COLOR_TOKENS.text.primaryMuted} truncate`,
  captionMuted: `${TEXT_SIZES.xs} ${COLOR_TOKENS.text.muted}`,
  captionBoldPrimary: `${TEXT_SIZES.xs} ${FONT_WEIGHTS.bold} ${COLOR_TOKENS.text.primary}`,
  captionUppercase: `${TEXT_SIZES.xs} ${FONT_WEIGHTS.bold} ${COLOR_TOKENS.text.primaryFaint} uppercase ${TEXT_TRACKING.wider}`,
  badgeRole: `${TEXT_SIZES.xs} ${FONT_WEIGHTS.bold} ${SPACING_TOKENS.px.sm} ${SPACING_TOKENS.py['2xs']} ${RADIUS_TOKENS.full} ${COLOR_TOKENS.surface.brandTint} ${COLOR_TOKENS.text.brandHover} capitalize shrink-0`,
  listCardName: `${FONT_WEIGHTS.bold} ${TEXT_SIZES.lg} ${COLOR_TOKENS.text.primary} truncate`,

  // ------------------- SEMANTIC ICON ROLES -------------------
  iconBrandLg: `${SIZE_TOKENS.icon.lg} ${COLOR_TOKENS.text.brandAccent}`,
  iconBrandMd: `${SIZE_TOKENS.icon.md} ${COLOR_TOKENS.text.brandAccent}`,
  iconBrandSm: `${SIZE_TOKENS.icon.sm} ${COLOR_TOKENS.text.brandAccent}`,
  iconMutedSm: `${SIZE_TOKENS.icon.sm} ${COLOR_TOKENS.text.primaryMuted}`,
  iconFaintSm: `${SIZE_TOKENS.icon.lg} ${COLOR_TOKENS.text.primaryFaint}`,
  iconWatermarkLg: `${SIZE_TOKENS.avatar.lg} ${COLOR_TOKENS.text.primaryFaint}`,
  iconWatermarkXl: `${SIZE_TOKENS.avatar.xl} ${COLOR_TOKENS.text.primaryFaint}`,
  iconAvatarInverse: `${SIZE_TOKENS.avatar.lg} ${COLOR_TOKENS.text.inverse}`,
  iconEmptyState: `${SIZE_TOKENS.avatar.md} ${SPACING_TOKENS.mx.auto} ${SPACING_TOKENS.mb.sm} ${OPACITY_TOKENS.muted}`,

  // ------------------- STATUS & ERRORS -------------------
  statusLoading: `text-center ${SPACING_TOKENS.py.xl} ${COLOR_TOKENS.text.inverse}`,
  statusError: `text-center ${SPACING_TOKENS.py.xl} ${COLOR_TOKENS.status.error}`,
  emptyStateText: `flex-1 flex items-center justify-center ${COLOR_TOKENS.text.primarySubtle} ${TEXT_SIZES.sm} ${FONT_WEIGHTS.medium} ${SPACING_TOKENS.p.md} text-center`,
  formStatusError: `${COLOR_TOKENS.status.error} ${TEXT_SIZES.sm} text-center ${FONT_WEIGHTS.medium}`,
  formStatusSuccess: `${COLOR_TOKENS.status.success} ${TEXT_SIZES.sm} text-center ${FONT_WEIGHTS.medium}`,

  // ------------------- HOME PAGE TEXTS -------------------
  homeHeroText: `${SPACING_TOKENS.mt.sm} ${SPACING_TOKENS.mb.lg} ${TEXT_SIZES.lg} ${COLOR_TOKENS.text.inverse} ${FONT_WEIGHTS.medium} ${OPACITY_TOKENS.high} ${TEXT_LEADING.relaxed}`,
  homeSectionTitle: `${TEXT_SIZES['3xl']} ${FONT_WEIGHTS.bold} ${COLOR_TOKENS.text.inverse} ${TEXT_TRACKING.wide}`,
  homeSectionText: `${SPACING_TOKENS.mt.md} ${SPACING_TOKENS.mb.xl} ${TEXT_SIZES.lg} ${COLOR_TOKENS.text.inverse} ${FONT_WEIGHTS.medium} ${OPACITY_TOKENS.high} ${TEXT_LEADING.relaxed}`,
  homeCardDescActive: `${TEXT_SIZES.sm} ${TEXT_LEADING.relaxed} ${SPACING_TOKENS.mb.sm} ${COLOR_TOKENS.text.inverse}`,
  homeCardDescInactive: `${TEXT_SIZES.sm} ${TEXT_LEADING.relaxed} ${SPACING_TOKENS.mb.sm} ${COLOR_TOKENS.text.primarySoft}`,
  homeCardIconActive: `${SIZE_TOKENS.avatar.lg} ${OPACITY_TOKENS.soft} ${INTERACTION_TOKENS.base} ${COLOR_TOKENS.text.inverse}`,
  homeCardIconInactive: `${SIZE_TOKENS.avatar.lg} ${OPACITY_TOKENS.soft} ${INTERACTION_TOKENS.base} ${COLOR_TOKENS.text.brandAccent}`,
  homeCardExtendedBox: `${SPACING_TOKENS.my.xs} ${BORDER_TOKENS.dividerTop} w-full ${SPACING_TOKENS.pt.md} ${COLOR_TOKENS.text.inverse} ${OPACITY_TOKENS.high} ${TEXT_LEADING.relaxed}`,

  // ------------------- HEADER NAV TEXTS -------------------
  logoText: `${TEXT_SIZES.lg} md:${TEXT_SIZES.xl} ${FONT_WEIGHTS.semibold} ${TEXT_TRACKING.wider}`,
  navLink: `hover:${COLOR_TOKENS.text.brandHover} hover:underline underline-offset-4 ${INTERACTION_TOKENS.base}`,
  headerUsername: `${FONT_WEIGHTS.bold} ${COLOR_TOKENS.text.primary} ${TEXT_TRACKING.wide} ${TEXT_SIZES.sm} hidden sm:block`,
  loadingTitle: `${TEXT_SIZES['2xl']} ${FONT_WEIGHTS.bold} ${COLOR_TOKENS.text.primary} ${TEXT_TRACKING.wider} animate-pulse`,

  // ------------------- AUTH TEXTS -------------------
  authTitle: `${TEXT_SIZES['2xl']} ${FONT_WEIGHTS.medium} ${TEXT_TRACKING.wide} ${COLOR_TOKENS.text.brand}`,
  authTitleWrapper: `text-center ${SPACING_TOKENS.m.xl}`,
  authResendBtn: `${TEXT_SIZES.sm} ${FONT_WEIGHTS.semibold} ${COLOR_TOKENS.text.brandAccent} hover:${COLOR_TOKENS.text.brandHover} hover:underline underline-offset-4 ${INTERACTION_TOKENS.base}`,

  // ------------------- PROFILE TEXTS -------------------
  profileLabel: `w-28 ${FONT_WEIGHTS.medium} ${OPACITY_TOKENS.soft} shrink-0`,
  profileValue: `${FONT_WEIGHTS.bold} ${TEXT_SIZES.lg} truncate`,
  profileValueLg: `${FONT_WEIGHTS.bold} ${TEXT_SIZES.xl} ${TEXT_LEADING.none}`,

  // ------------------- MODAL TEXTS & FORMS -------------------
  modalText: `${TEXT_SIZES.sm} ${COLOR_TOKENS.text.primarySoft} ${SPACING_TOKENS.py.sm} ${TEXT_LEADING.relaxed}`,
  modalHighlight: `block ${FONT_WEIGHTS.semibold} ${SPACING_TOKENS.mt.xs} ${COLOR_TOKENS.text.brandAccent}`,
  modalInlineHighlight: `${FONT_WEIGHTS.semibold} ${SPACING_TOKENS.mt.xs} ${COLOR_TOKENS.text.brandAccent}`,
  modalErrorBox: `${TEXT_SIZES.xs} ${FONT_WEIGHTS.semibold} ${COLOR_TOKENS.status.errorBox} ${SPACING_TOKENS.mt.sm} ${SPACING_TOKENS.p.sm} ${RADIUS_TOKENS.xs} border`,
  modalSuccessBox: `${TEXT_SIZES.xs} ${FONT_WEIGHTS.semibold} ${COLOR_TOKENS.text.brandAccent} ${SPACING_TOKENS.mt.sm} ${COLOR_TOKENS.surface.brandTintSubtle} ${SPACING_TOKENS.p.sm} ${RADIUS_TOKENS.xs} ${BORDER_TOKENS.brandSubtle}`,
  modalActionBtnCancel: 'w-full sm:w-auto',
  modalActionBtnOk: 'w-full sm:w-auto',
  inputLabel: `block ${TEXT_SIZES.sm} ${FONT_WEIGHTS.medium} ${COLOR_TOKENS.text.primary} ${SPACING_TOKENS.mb.xs}`,
  inputError: `${TEXT_SIZES.xs} ${COLOR_TOKENS.status.error} ${SPACING_TOKENS.mt.xs}`,
} as const;
