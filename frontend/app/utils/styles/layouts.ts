// frontend/app/utils/styles/layouts.ts

// LAYOUT CLASSES
export const LAYOUT_CONFIG = {
  // ------------------- GLOBAL LAYOUT -------------------
  base: `min-h-screen flex flex-col ${COLOR_TOKENS.surface.page} font-sans bg-cover bg-center bg-no-repeat bg-fixed`,
  mainDefault: `flex-1 flex flex-col ${SPACING_TOKENS.responsive.screenPadding}`,

  // Page Wrappers
  pageWrapper: `w-full max-w-7xl mx-auto flex flex-col ${SPACING_TOKENS.responsive.containerGap} relative`,
  pageHeader: `flex flex-col md:flex-row justify-between items-center w-full ${SPACING_TOKENS.responsive.gridGap}`,

  // Common Utilities
  actionGroup: `flex items-center ${SPACING_TOKENS.gap.md}`, singleButtonWrapper: 'pt-2 text-center w-full', divider: `${SPACING_TOKENS.my.xs} border-t border-content-primary/10 w-full`,
  flexBetween: 'flex justify-between w-full',

  // ------------------- HEADER COMPONENT -------------------
  headerBase: `flex items-center justify-between ${SPACING_TOKENS.px.md} md:${SPACING_TOKENS.px.lg}${SPACING_TOKENS.py.md} ${GLASS_TOKENS.default}${SHADOW_TOKENS.sm} z-50 border-b border-content-primary/10`,
  headerSticky: 'sticky top-0',
  headerRelative: 'relative',
  logoWrapper: `flex items-center ${SPACING_TOKENS.gap.sm}${COLOR_TOKENS.text.primary} hover:opacity-80 transition-opacity w-max`,
  navWrapper: `hidden md:flex ${SPACING_TOKENS.gap.xl}${FONT_WEIGHTS.bold} tracking-wide`,
  headerRight: `flex-1 flex justify-end items-center ${SPACING_TOKENS.responsive.listGap}`,

  // ------------------- HOME PAGE -------------------
  homeWrapper: `flex-1 flex flex-col items-center ${SPACING_TOKENS.px.md} md:${SPACING_TOKENS.px.lg} py-8 md:py-12${SPACING_TOKENS.responsive.containerGap} relative z-10 w-full`,
  homeHeroSection: `flex flex-col items-center text-center ${SPACING_TOKENS.mt.lg} max-w-3xl scroll-mt-24`,
  homeCardsSection: `flex flex-col md:flex-row flex-wrap ${SPACING_TOKENS.responsive.gridGap} w-full max-w-6xl${SPACING_TOKENS.mb.xl}`,
  homeContentSection:
    'flex flex-col items-center text-center max-w-3xl pt-8 border-t border-content-primary/10 scroll-mt-24',

  // ------------------- AUTH PAGES (Login / Register) -------------------
  mainAuth: `flex-1 flex items-center justify-center ${SPACING_TOKENS.responsive.cardPadding}`,
  authWrapper: `w-full max-w-md mx-auto flex flex-col ${SPACING_TOKENS.responsive.gridGap}`,
  mobileAuthWrapper: `w-full max-w-md mx-auto flex flex-col ${SPACING_TOKENS.gap.lg}`,
  formWrapper: `w-full flex flex-col ${SPACING_TOKENS.responsive.listGap}`,
  formActions: 'flex items-center justify-between pt-6',

  // ------------------- GROUPS & MEMBERS VIEWS -------------------
  cardGrid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${SPACING_TOKENS.responsive.gridGap} w-full`,
  cardContent: `flex flex-col ${SPACING_TOKENS.gap.lg} w-full pt-2`,
  cardFooter: `flex items-end justify-between w-full pt-4 border-t border-content-primary/10 ${TEXT_SIZES.xs} text-content-primary/70`,

  memberCardInner: `flex items-start ${SPACING_TOKENS.gap.md} w-full h-full min-w-0`,
  memberCardContent: 'flex-1 flex flex-col justify-between h-full min-h-16 min-w-0',

  // ------------------- PROFILE & DOCUMENTS VIEWS -------------------
  sectionWrapper: `${SPACING_TOKENS.mt.xl} flex flex-col ${SPACING_TOKENS.gap.lg}`,
  profilePictureWrapper: `relative w-40 h-40 shrink-0 mx-auto md:mx-0 md:ml-8 ${SPACING_TOKENS.mt.xl} md:mt-0`,
  profilePictureInner: `w-full h-full bg-btn-primary ${RADIUS_TOKENS.lg} overflow-hidden${SHADOW_TOKENS.lg} border border-surface-card/50 flex items-center justify-center relative`,
  profileDetailsWrapper: `flex-1 flex flex-col justify-center ${SPACING_TOKENS.gap.sm}${COLOR_TOKENS.text.primary} pt-2`,
  profileDetailRow: `flex items-center ${SPACING_TOKENS.gap.md}`,

  // Documents Grid
  documentGrid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ${SPACING_TOKENS.responsive.gridGap} w-full${SPACING_TOKENS.mt.md}`,
  documentCardHeader: `absolute top-0 left-0 w-full ${SPACING_TOKENS.p.md} flex justify-between items-start z-10 bg-linear-to-b from-black/50 to-transparent ${COLOR_TOKENS.text.inverse}`, documentCardImage: 'w-full h-40 bg-surface-card-hover/30 flex flex-col items-center justify-center relative', documentCardMeta: `${SPACING_TOKENS.p.md} flex flex-col ${SPACING_TOKENS.gap.xs}${TEXT_SIZES.xs} text-content-primary/80`,

  fileInput: `w-full ${TEXT_SIZES.sm} text-content-primary/70 file:mr-4 file:${SPACING_TOKENS.py.sm} file:${SPACING_TOKENS.px.lg} file:${RADIUS_TOKENS.full} file:border-0 file:${TEXT_SIZES.xs} file:${FONT_WEIGHTS.semibold} file:bg-transparent file:text-btn-primary file:ring-1 file:ring-btn-primary/40 hover:file:bg-btn-primary/20 file:transition-colors file:cursor-pointer cursor-pointer`,

  // ------------------- MODAL LAYOUTS -------------------
  modalForm: `flex flex-col ${SPACING_TOKENS.gap.md}${SPACING_TOKENS.py.sm}`,
  modalActions: `flex flex-col-reverse sm:flex-row items-center justify-between w-full ${SPACING_TOKENS.gap.sm} sm:gap-0`,
  modalSizeSm: 'w-full sm:max-w-md !w-[90%] !mx-auto sm:!w-full',
  modalSizeMd: 'w-full sm:max-w-lg !w-[90%] !mx-auto sm:!w-full',
  modalSizeLg: 'w-full sm:max-w-3xl !w-[90%] !mx-auto sm:!w-full',
} as const;

// FOOTER CLASSES
export const FOOTER_CONFIG = {
  base: `py-4 ${SPACING_TOKENS.px.md} md:${SPACING_TOKENS.px.lg} flex items-center justify-between ${TEXT_SIZES.xs}${COLOR_TOKENS.text.primary} bg-surface-page/70 backdrop-blur-md shadow-[0_-2px_10px_rgba(0,0,0,0.02)] relative z-10`,
  text: `${FONT_WEIGHTS.medium} opacity-80`,
} as const;