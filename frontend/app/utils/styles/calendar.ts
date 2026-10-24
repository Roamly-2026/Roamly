// frontend/app/utils/styles/calendar.ts

export const CALENDAR_CONFIG = {
  // Wrapper and Layouts
  eventsWrapper: `w-full max-w-360 mx-auto ${SPACING_TOKENS.px.md} md:${SPACING_TOKENS.px.lg} ${SPACING_TOKENS.py.xl} flex flex-col flex-1 min-h-0 ${SPACING_TOKENS.gap.xl} relative`,
  eventsHeaderRow: `flex flex-col md:flex-row justify-between items-center w-full ${SPACING_TOKENS.gap.lg} shrink-0`,
  headerActionLeft: `flex items-center ${SPACING_TOKENS.gap.md} flex-1 justify-start`,
  headerCenter: 'flex flex-col items-center justify-center shrink-0',
  headerTitleRow: `flex items-center ${SPACING_TOKENS.gap.xs}`,
  headerActionRight: `flex items-center ${SPACING_TOKENS.gap.md} flex-1 justify-end`,

  // Filters
  headerSearchWrapper: 'flex items-center w-full max-w-sm ml-4',
  filterDropdownContent: `${MENU_APPEARANCES.content} ${SPACING_TOKENS.p.md} w-72`,
  filterFormGroup: `flex flex-col ${SPACING_TOKENS.gap.sm}`,
  filterLabel: `${TEXT_SIZES.sm} ${FONT_WEIGHTS.semibold} text-content-primary/90`,
  filterDateInput: `w-full ${INPUT_APPEARANCES.glass} ${RADIUS_TOKENS.md} ${INPUT_SIZES.sm} ${SPACING_TOKENS.px.md}`,
  filterButtonWrapper: `${SPACING_TOKENS.mt.md} flex justify-end w-full`,

  // Grid & Columns
  eventsGrid: `grid grid-cols-1 md:grid-cols-12 ${SPACING_TOKENS.gap.xs} flex-1 min-h-0 bg-surface-card/50 backdrop-blur-md ${BORDER_TOKENS.medium} ${RADIUS_TOKENS.md} overflow-hidden ${SHADOW_TOKENS.lg}`,
  columnBase: 'flex flex-col h-full border-content-primary/10',
  columnDays: 'col-span-12 md:col-span-3 border-r bg-surface-card/20',
  columnEvents: 'col-span-12 md:col-span-4 border-r bg-surface-card/10',
  columnPreview: 'col-span-12 md:col-span-5 bg-surface-card/20 overflow-y-auto',
  columnHeader: `${SPACING_TOKENS.p.md} ${FONT_WEIGHTS.semibold} ${TEXT_SIZES.sm} text-content-primary/80 uppercase tracking-wider shrink-0 bg-surface-card-hover/50 flex justify-between border-b border-content-primary/10`,
  columnBody: 'flex-1 overflow-y-auto',

  // List Items (Days, Events)
  listItem: `flex items-center justify-between ${SPACING_TOKENS.p.md} border-b border-content-primary/10 ${INTERACTION_TOKENS.base}`,
  listItemHover: 'hover:bg-surface-card/40',
  listItemSelected: 'bg-surface-card-hover/70 border-l-4 border-l-btn-primary',
  eventListItemSelected: 'bg-btn-primary/20',

  eventItemWrapper: `flex items-center ${SPACING_TOKENS.gap.sm}`,
  eventItemIcon: 'w-5 h-5 text-content-primary/70',
  eventItemTitle: `${FONT_WEIGHTS.semibold} ${COLOR_TOKENS.text.primary}`,
  eventItemTime: `${TEXT_SIZES.xs} text-content-primary/70 ${FONT_WEIGHTS.bold}`,
  expiredItemWrapper: 'opacity-40 grayscale hover:opacity-70',
  expiredItemText: 'line-through decoration-content-primary/40',

  // Event Preview Area
  previewWrapper: `${SPACING_TOKENS.p.lg} flex flex-col ${SPACING_TOKENS.gap.lg}`,
  previewTitleRow: 'flex items-center justify-between',
  previewTypeWrapper: `flex items-center ${SPACING_TOKENS.gap.sm} text-content-primary/80`,
  previewTypeIcon: 'w-5 h-5',
  previewTypeText: `${TEXT_SIZES.sm} ${FONT_WEIGHTS.medium}`,
  previewMainTitle: `${TEXT_SIZES.xl} ${FONT_WEIGHTS.bold} ${COLOR_TOKENS.text.primary} text-center flex-1`,
  previewExpiredBadge: `${TEXT_SIZES.xs} ml-2 bg-status-error/20 ${COLOR_TOKENS.status.error} px-2 py-0.5 ${RADIUS_TOKENS.full} align-middle`,
  previewMetaRow: `flex flex-col ${SPACING_TOKENS.gap.sm} ${TEXT_SIZES.sm} text-content-primary/90`,

  metaRowItem: `flex ${SPACING_TOKENS.gap.sm}`,
  metaRowItemCenter: `flex ${SPACING_TOKENS.gap.sm} items-center min-h-8`,
  metaLabel: `${FONT_WEIGHTS.bold} w-24 shrink-0`,
  metaValue: 'flex-1 leading-relaxed',
  metaValueLink: `text-btn-primary-hover hover:text-btn-primary underline underline-offset-2 ${INTERACTION_TOKENS.base}`,

  previewMapPlaceholder: `w-full h-64 ${SPACING_TOKENS.mt.sm} ${RADIUS_TOKENS.md} overflow-hidden relative flex items-center justify-center ${SHADOW_TOKENS.inner} ${BORDER_TOKENS.medium} bg-surface-card-hover/30`,
  emptyPreview: `flex-1 flex items-center justify-center text-content-primary/60 ${TEXT_SIZES.sm} ${FONT_WEIGHTS.medium}`,

  // Mobile View Styles
  mobileMainWrapper: `${SPACING_TOKENS.p.sm} flex flex-col ${SPACING_TOKENS.gap.md}`,
  mobileContentWrapper: `bg-surface-card/50 backdrop-blur-md ${RADIUS_TOKENS.md} ${BORDER_TOKENS.ringSubtle} ${SHADOW_TOKENS.lg} ${SPACING_TOKENS.p.sm} ${SPACING_TOKENS.mt.md} flex-1 flex flex-col ${SPACING_TOKENS.gap.sm}`,
  mobileTopActions: `flex items-center justify-between w-full ${SPACING_TOKENS.px.sm} ${SPACING_TOKENS.mb.sm}`,
  mobileHeader: 'w-full text-center flex flex-col items-center',
  mobileHeaderButton: `flex flex-col justify-center items-center ${SPACING_TOKENS.gap.xs} p-0 hover:bg-transparent cursor-pointer outline-none w-full`,
  mobileHeaderTitleRow: `flex items-center ${SPACING_TOKENS.gap.sm}`,
  mobileToolbar: `flex items-center ${SPACING_TOKENS.gap.sm} w-full ${SPACING_TOKENS.mt.sm}`,
  mobileFilterButton: `${RADIUS_TOKENS.full} ${SPACING_TOKENS.px.md} ${TEXT_SIZES.sm} ${INPUT_SIZES.sm} ${SHADOW_TOKENS.none} border-content-primary/20 bg-surface-card/70`,
  mobileDateButton: `flex justify-between items-center ${RADIUS_TOKENS.full} ${SPACING_TOKENS.px.lg} bg-surface-card/30 border-content-primary/30 ${COLOR_TOKENS.text.primary} ${SHADOW_TOKENS.inner} ${FONT_WEIGHTS.bold}`,
  mobileEventsWrapper: `flex flex-col w-full ${SPACING_TOKENS.mt.sm} ${BORDER_TOKENS.ringSubtle} ${RADIUS_TOKENS.md} overflow-hidden bg-surface-card/20`,
  mobileEventItem: `flex items-center justify-between ${SPACING_TOKENS.p.md} ${GLASS_TOKENS.subtle} hover:bg-surface-card/60 ${INTERACTION_TOKENS.base}`,
  mobileEventItemBorder: 'border-b border-content-primary/10',
  mobileEmptyState: `${SPACING_TOKENS.p.lg} text-center ${TEXT_SIZES.sm} text-content-primary/60 ${FONT_WEIGHTS.medium} bg-surface-card/40`,

  mobileShowActiveButton: `${BUTTON_VARIANTS.glassOutlineButton} ring-2 ring-status-success ${COLOR_TOKENS.status.success}`,
  mobileShowAllButton: BUTTON_VARIANTS.glassIconButton,

  // Participants Area (in Preview)
  participantsGroup: `flex items-center ${SPACING_TOKENS.gap.md}`,
  participantsAvatars: 'flex items-center',
  participantsOverlap: '-space-x-2',
  participantsGap: `${SPACING_TOKENS.gap.sm}`,
  participantAvatar: 'ring-2 ring-surface-card cursor-pointer w-5 h-5',
  participantAvatarHover: 'hover:z-10 transition-transform relative',
  participantMoreBadge: `flex items-center justify-center w-5 h-5 ${RADIUS_TOKENS.full} bg-surface-card-hover/80 ${TEXT_SIZES.xs} ${FONT_WEIGHTS.bold} ${COLOR_TOKENS.text.primary} ring-2 ring-surface-card relative z-10 hover:bg-surface-card ${INTERACTION_TOKENS.base}`,
  participantViewAll: `${TEXT_SIZES.xs} text-btn-primary-hover hover:text-btn-primary cursor-pointer ${FONT_WEIGHTS.medium} underline underline-offset-2`,

  // Participants Modal Styles (Wide Card View)
  participantModalScroll: `flex flex-col ${SPACING_TOKENS.gap.sm} overflow-y-auto max-h-[540px] pr-2 w-full custom-scrollbar`,
  participantCard: `flex items-center ${SPACING_TOKENS.gap.md} w-full !${SPACING_TOKENS.p.md} bg-surface-card/40 ${RADIUS_TOKENS.lg} ${BORDER_TOKENS.ringSubtle} hover:bg-surface-card/60 ${INTERACTION_TOKENS.base} shrink-0`,
  participantCardAvatar: `shrink-0 ${SHADOW_TOKENS.sm} w-10 h-10`,
  participantCardInfo: 'flex flex-col flex-1 min-w-0',
  participantCardHeader: `flex items-center justify-between ${SPACING_TOKENS.gap.sm}`,
  participantCardName: `${FONT_WEIGHTS.bold} ${TEXT_SIZES.lg} ${COLOR_TOKENS.text.primary} truncate`,
  participantCardRole: `${TEXT_SIZES.xs} ${FONT_WEIGHTS.bold} ${SPACING_TOKENS.px.sm} py-0.5 ${RADIUS_TOKENS.full} bg-btn-primary/20 text-btn-primary-hover capitalize shrink-0`,
  participantCardEmail: `${TEXT_SIZES.sm} text-content-primary/70 truncate`,
  participantCardPhone: `${TEXT_SIZES.xs} text-content-primary/50 ${SPACING_TOKENS.mt.xs} truncate`,
} as const;