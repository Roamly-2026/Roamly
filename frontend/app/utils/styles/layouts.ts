// frontend/app/utils/styles/layouts.ts

// 1. LAYOUT CLASSES
export const LAYOUT_CONFIG = {
  // ------------------- GLOBAL LAYOUT -------------------
  base: `min-h-screen flex flex-col ${COLOR_TOKENS.surface.page} font-sans bg-cover bg-center bg-no-repeat bg-fixed`,
  mainDefault: `flex-1 flex flex-col ${SPACING_TOKENS.responsive.screenPadding}`,

  // Page Wrappers
  pageWrapper: `w-full ${SIZE_TOKENS.container.pageMax} ${SPACING_TOKENS.mx.auto} flex flex-col ${SPACING_TOKENS.responsive.containerGap} relative`,
  pageHeader: `flex flex-col md:flex-row justify-between items-center w-full ${SPACING_TOKENS.responsive.gridGap}`,

  // Common Utilities
  actionGroup: `flex items-center ${SPACING_TOKENS.gap.md}`,
  singleButtonWrapper: `${SPACING_TOKENS.pt.sm} text-center w-full`,
  divider: `${SPACING_TOKENS.my.xs} ${BORDER_TOKENS.dividerTop} w-full`,
  flexBetween: 'flex justify-between w-full',

  // ------------------- HEADER COMPONENT -------------------
  headerBase: `flex items-center justify-between ${SPACING_TOKENS.px.md} md:${SPACING_TOKENS.px.lg} ${SPACING_TOKENS.py.md} ${GLASS_TOKENS.default} ${SHADOW_TOKENS.sm} ${Z_INDEX_TOKENS.header} ${BORDER_TOKENS.dividerBottom}`,
  headerSticky: 'sticky top-0',
  headerRelative: 'relative',
  headerLeft: `flex-1 flex items-center ${SPACING_TOKENS.gap.md}`,
  headerCenter: 'flex-1 flex justify-center items-center',
  logoWrapper: `flex items-center ${SPACING_TOKENS.gap.sm} ${COLOR_TOKENS.text.primary} ${OPACITY_TOKENS.hoverSoft} transition-opacity w-max`,
  navWrapper: `hidden md:flex flex-1 justify-center items-center ${SPACING_TOKENS.gap.xl} ${FONT_WEIGHTS.bold} ${TEXT_TRACKING.wide}`,
  headerRight: `flex-1 flex justify-end items-center ${SPACING_TOKENS.responsive.listGap}`,
  mobileMenuButton: `md:hidden ${COLOR_TOKENS.text.primary} ${SPACING_TOKENS.p.xs}`,

  // ------------------- LOADING SCREEN -------------------
  loadingScreenWrapper: `fixed inset-0 ${Z_INDEX_TOKENS.modal} ${GLASS_TOKENS.page} flex flex-col items-center justify-center ${SPACING_TOKENS.gap.lg}`,
  loadingSpinner: `${SIZE_TOKENS.avatar.lg} ${COLOR_TOKENS.text.brandAccent} animate-spin`,

  // ------------------- HOME PAGE -------------------
  homeWrapper: `flex-1 flex flex-col items-center ${SPACING_TOKENS.px.md} md:${SPACING_TOKENS.px.lg} ${SPACING_TOKENS.py.xl} md:${SPACING_TOKENS.py['3xl']} ${SPACING_TOKENS.responsive.containerGap} relative ${Z_INDEX_TOKENS.base} w-full`,
  homeHeroSection: `flex flex-col items-center text-center ${SPACING_TOKENS.mt.lg} ${SIZE_TOKENS.container.contentLg} scroll-mt-24`,
  homeCardsSection: `flex flex-col md:flex-row flex-wrap ${SPACING_TOKENS.responsive.gridGap} w-full ${SIZE_TOKENS.container.contentXl} ${SPACING_TOKENS.mb.xl}`,
  homeContentSection: `flex flex-col items-center text-center ${SIZE_TOKENS.container.contentLg} ${SPACING_TOKENS.pt.xl} ${BORDER_TOKENS.dividerTop} scroll-mt-24`,
  cardContentCenter: `flex flex-col items-center justify-center text-center ${SPACING_TOKENS.gap.sm} w-full h-full`,

  // ------------------- AUTH PAGES (Login / Register) -------------------
  mainAuth: `flex-1 flex items-center justify-center w-full ${SPACING_TOKENS.responsive.cardPadding}`,
  authWrapper: `w-full ${SIZE_TOKENS.container.cardMd} shrink-0 ${SPACING_TOKENS.mx.auto} flex flex-col ${SPACING_TOKENS.responsive.gridGap}`,
  mobileAuthWrapper: `w-full ${SIZE_TOKENS.container.cardMd} shrink-0 ${SPACING_TOKENS.mx.auto} flex flex-col ${SPACING_TOKENS.gap.lg}`,
  formWrapper: `w-full min-w-0 flex flex-col ${SPACING_TOKENS.responsive.listGap}`,
  formActions: `flex items-center justify-between ${SPACING_TOKENS.pt.lg}`,

  // ------------------- GROUPS & MEMBERS VIEWS -------------------
  cardGrid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${SPACING_TOKENS.responsive.gridGap} w-full`,
  cardContent: `flex flex-col ${SPACING_TOKENS.gap.lg} w-full ${SPACING_TOKENS.pt.sm}`,
  cardFooter: `flex items-end justify-between w-full ${SPACING_TOKENS.pt.md} ${BORDER_TOKENS.dividerTop} ${TEXT_SIZES.xs} ${COLOR_TOKENS.text.primaryMuted}`,

  memberCardInner: `flex items-start ${SPACING_TOKENS.gap.md} w-full h-full min-w-0`,
  memberCardContent: 'flex-1 flex flex-col justify-between h-full min-h-16 min-w-0',

  // ------------------- PROFILE & DOCUMENTS VIEWS -------------------
  sectionWrapper: `${SPACING_TOKENS.mt.xl} flex flex-col ${SPACING_TOKENS.gap.lg}`,
  profileCard: `w-full ${CARD_APPEARANCES.glass} ${SPACING_TOKENS.responsive.cardPadding} flex flex-col md:flex-row ${SPACING_TOKENS.gap.xl} relative`,
  profilePictureWrapper: `relative ${SIZE_TOKENS.avatar.xl} shrink-0 ${SPACING_TOKENS.mx.auto} md:mx-0 md:${SPACING_TOKENS.ml.xl} ${SPACING_TOKENS.mt.xl} md:${SPACING_TOKENS.mt.none}`,
  profilePictureInner: `w-full h-full bg-btn-primary ${RADIUS_TOKENS.lg} overflow-hidden ${SHADOW_TOKENS.lg} ${BORDER_TOKENS.cardSubtle} flex items-center justify-center relative`,
  profileDetailsWrapper: `flex-1 flex flex-col justify-center ${SPACING_TOKENS.gap.sm} ${COLOR_TOKENS.text.primary} ${SPACING_TOKENS.pt.sm}`,
  profileDetailRow: `flex items-center ${SPACING_TOKENS.gap.md}`,

  // Documents Grid
  documentGrid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ${SPACING_TOKENS.responsive.gridGap} w-full ${SPACING_TOKENS.mt.md}`,
  documentCardHeader: `absolute top-0 left-0 w-full ${SPACING_TOKENS.p.md} flex justify-between items-start ${Z_INDEX_TOKENS.base} bg-linear-to-b from-black/50 to-transparent ${COLOR_TOKENS.text.inverse}`,
  documentCardImage:
    'w-full h-40 bg-surface-card-hover/30 flex flex-col items-center justify-center relative',
  documentCardMeta: `${SPACING_TOKENS.p.md} flex flex-col ${SPACING_TOKENS.gap.xs} ${TEXT_SIZES.xs} ${COLOR_TOKENS.text.primarySoft}`,

  fileInput: `w-full ${TEXT_SIZES.sm} ${COLOR_TOKENS.text.primaryMuted} file:${SPACING_TOKENS.mr.md} file:${SPACING_TOKENS.py.sm} file:${SPACING_TOKENS.px.lg} file:${RADIUS_TOKENS.full} file:border-0 file:${TEXT_SIZES.xs} file:${FONT_WEIGHTS.semibold} file:bg-transparent file:${COLOR_TOKENS.text.brandAccent} file:ring-1 file:ring-btn-primary/40 hover:file:bg-btn-primary/20 file:transition-colors file:cursor-pointer cursor-pointer`,

  // ------------------- MODAL LAYOUTS -------------------
  modalForm: `flex flex-col ${SPACING_TOKENS.gap.md} ${SPACING_TOKENS.py.sm}`,
  modalActions: `flex flex-col-reverse sm:flex-row items-center justify-between w-full ${SPACING_TOKENS.gap.sm} sm:gap-0`,
  modalSizeSm: `w-full ${SIZE_TOKENS.container.modalMd} !w-[90%] !mx-auto sm:!w-full`,
  modalSizeMd: `w-full ${SIZE_TOKENS.container.modalLg} !w-[90%] !mx-auto sm:!w-full`,
  modalSizeLg: `w-full ${SIZE_TOKENS.container.modalXl} !w-[90%] !mx-auto sm:!w-full`,
} as const;

// 2. FOOTER CLASSES
export const FOOTER_CONFIG = {
  base: `${SPACING_TOKENS.py.md} ${SPACING_TOKENS.px.md} md:${SPACING_TOKENS.px.lg} flex items-center justify-between ${TEXT_SIZES.xs} ${COLOR_TOKENS.text.primary} ${GLASS_TOKENS.page} ${SHADOW_TOKENS.footer} relative ${Z_INDEX_TOKENS.base}`,
  text: `${FONT_WEIGHTS.medium} ${OPACITY_TOKENS.soft}`,
} as const;
