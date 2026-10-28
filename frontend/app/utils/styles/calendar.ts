// frontend/app/utils/styles/calendar.ts

export const CALENDAR_CONFIG = {
  // Wrapper and Layouts
  eventsWrapper: `w-full ${SIZE_TOKENS.container.calendarMax} ${SPACING_TOKENS.mx.auto} ${SPACING_TOKENS.px.md} md:${SPACING_TOKENS.px.lg} ${SPACING_TOKENS.py.xl} flex flex-col flex-1 min-h-0 ${SPACING_TOKENS.gap.xl} relative`,
  eventsHeaderRow: `flex flex-col md:flex-row justify-between items-center w-full ${SPACING_TOKENS.gap.lg} shrink-0`,
  headerActionLeft: `flex items-center ${SPACING_TOKENS.gap.md} flex-1 justify-start`,
  headerCenter: 'flex flex-col items-center justify-center shrink-0',
  headerTitleRow: `flex items-center ${SPACING_TOKENS.gap.xs}`,
  headerActionRight: `flex items-center ${SPACING_TOKENS.gap.md} flex-1 justify-end`,

  // Filters
  headerSearchWrapper: `flex items-center w-full ${SIZE_TOKENS.container.search} ${SPACING_TOKENS.ml.md}`,
  filterDropdownContent: `${MENU_APPEARANCES.content} ${SPACING_TOKENS.p.md} ${SIZE_TOKENS.container.dropdownFilter}`,
  filterFormGroup: `flex flex-col ${SPACING_TOKENS.gap.sm}`,
  filterLabel: `${TEXT_SIZES.sm} ${FONT_WEIGHTS.semibold} ${COLOR_TOKENS.text.primaryStrong}`,
  filterDateInput: `w-full ${INPUT_APPEARANCES.glass} ${RADIUS_TOKENS.md} ${INPUT_SIZES.sm} ${SPACING_TOKENS.px.md}`,
  filterButtonWrapper: `${SPACING_TOKENS.mt.md} flex justify-end w-full`,

  // Grid & Columns
  eventsGrid: `grid grid-cols-1 md:grid-cols-12 ${SPACING_TOKENS.gap.xs} flex-1 min-h-0 ${GLASS_TOKENS.medium} ${BORDER_TOKENS.medium} ${RADIUS_TOKENS.md} overflow-hidden ${SHADOW_TOKENS.lg}`,
  columnBase: 'flex flex-col h-full border-content-primary/10',
  columnDays: `col-span-12 md:col-span-3 border-r ${GLASS_TOKENS.faint}`,
  columnEvents: 'col-span-12 md:col-span-4 border-r bg-surface-card/10',
  columnPreview: `col-span-12 md:col-span-5 ${GLASS_TOKENS.faint} overflow-y-auto`,
  columnHeader: `${SPACING_TOKENS.p.md} ${FONT_WEIGHTS.semibold} ${TEXT_SIZES.sm} ${COLOR_TOKENS.text.primarySoft} uppercase ${TEXT_TRACKING.wider} shrink-0 bg-surface-card-hover/50 flex justify-between ${BORDER_TOKENS.dividerBottom}`,
  columnBody: 'flex-1 overflow-y-auto',

  // List Items (Days, Events)
  listItem: `flex items-center justify-between ${SPACING_TOKENS.p.md} ${BORDER_TOKENS.dividerBottom} ${INTERACTION_TOKENS.base}`,
  listItemHover: 'hover:bg-surface-card/40',
  listItemSelected: `bg-surface-card-hover/70 ${BORDER_TOKENS.selectedLeft}`,
  eventListItemSelected: COLOR_TOKENS.surface.brandTint,

  eventItemWrapper: `flex items-center ${SPACING_TOKENS.gap.sm}`,
  eventItemIcon: `${SIZE_TOKENS.icon.md} ${COLOR_TOKENS.text.primaryMuted}`,
  eventItemTitle: `${FONT_WEIGHTS.semibold} ${COLOR_TOKENS.text.primary}`,
  eventItemTime: `${TEXT_SIZES.xs} ${COLOR_TOKENS.text.primaryMuted} ${FONT_WEIGHTS.bold}`,
  expiredItemWrapper: `${OPACITY_TOKENS.muted} grayscale ${OPACITY_TOKENS.hoverSubtle}`,
  expiredItemText: 'line-through decoration-content-primary/40',

  // Event Preview Area
  previewWrapper: `${SPACING_TOKENS.p.lg} flex flex-col ${SPACING_TOKENS.gap.lg}`,
  previewTitleRow: 'flex items-center justify-between',
  previewTypeWrapper: `flex items-center ${SPACING_TOKENS.gap.sm} ${COLOR_TOKENS.text.primarySoft}`,
  previewTypeIcon: SIZE_TOKENS.icon.md,
  previewTypeText: `${TEXT_SIZES.sm} ${FONT_WEIGHTS.medium}`,
  previewMainTitle: `${TEXT_SIZES.xl} ${FONT_WEIGHTS.bold} ${COLOR_TOKENS.text.primary} text-center flex-1`,
  previewExpiredBadge: `${TEXT_SIZES.xs} ${SPACING_TOKENS.ml.sm} ${COLOR_TOKENS.status.errorBadge} ${SPACING_TOKENS.px.sm} ${SPACING_TOKENS.py['2xs']} ${RADIUS_TOKENS.full} align-middle`,
  previewMetaRow: `flex flex-col ${SPACING_TOKENS.gap.sm} ${TEXT_SIZES.sm} ${COLOR_TOKENS.text.primaryStrong}`,

  metaRowItem: `flex ${SPACING_TOKENS.gap.sm}`,
  metaRowItemCenter: `flex ${SPACING_TOKENS.gap.sm} items-center min-h-8`,
  metaLabel: `${FONT_WEIGHTS.bold} w-24 shrink-0`,
  metaValue: `flex-1 ${TEXT_LEADING.relaxed}`,
  metaValueLink: `${COLOR_TOKENS.text.brandHover} hover:${COLOR_TOKENS.text.brandAccent} underline underline-offset-2 ${INTERACTION_TOKENS.base}`,

  previewMapPlaceholder: `w-full h-64 ${SPACING_TOKENS.mt.sm} ${RADIUS_TOKENS.md} overflow-hidden relative flex items-center justify-center ${SHADOW_TOKENS.inner} ${BORDER_TOKENS.medium} bg-surface-card-hover/30`,
  emptyPreview: `flex-1 flex items-center justify-center ${COLOR_TOKENS.text.primarySubtle} ${TEXT_SIZES.sm} ${FONT_WEIGHTS.medium}`,

  // Mobile View Styles
  mobileMainWrapper: `${SPACING_TOKENS.p.sm} flex flex-col ${SPACING_TOKENS.gap.md}`,
  mobileContentWrapper: `${GLASS_TOKENS.medium} ${RADIUS_TOKENS.md} ${BORDER_TOKENS.ringSubtle} ${SHADOW_TOKENS.lg} ${SPACING_TOKENS.p.sm} ${SPACING_TOKENS.mt.md} flex-1 flex flex-col ${SPACING_TOKENS.gap.sm}`,
  mobileTopActions: `flex items-center justify-between w-full ${SPACING_TOKENS.px.sm} ${SPACING_TOKENS.mb.sm}`,
  mobileHeader: 'w-full text-center flex flex-col items-center',
  mobileHeaderButton: `flex flex-col justify-center items-center ${SPACING_TOKENS.gap.xs} ${SPACING_TOKENS.p.none} hover:bg-transparent cursor-pointer outline-none w-full`,
  mobileHeaderTitleRow: `flex items-center ${SPACING_TOKENS.gap.sm}`,
  mobileToolbar: `flex items-center ${SPACING_TOKENS.gap.sm} w-full ${SPACING_TOKENS.mt.sm}`,
  mobileFilterButton: `${RADIUS_TOKENS.full} ${SPACING_TOKENS.px.md} ${TEXT_SIZES.sm} ${INPUT_SIZES.sm} ${SHADOW_TOKENS.none} ${BORDER_TOKENS.medium} bg-surface-card/70`,
  mobileDateButton: `flex justify-between items-center ${RADIUS_TOKENS.full} ${SPACING_TOKENS.px.lg} bg-surface-card/30 ${BORDER_TOKENS.strong} ${COLOR_TOKENS.text.primary} ${SHADOW_TOKENS.inner} ${FONT_WEIGHTS.bold}`,
  mobileEventsWrapper: `flex flex-col w-full ${SPACING_TOKENS.mt.sm} ${BORDER_TOKENS.ringSubtle} ${RADIUS_TOKENS.md} overflow-hidden ${GLASS_TOKENS.faint}`,
  mobileEventItem: `flex items-center justify-between ${SPACING_TOKENS.p.md} ${GLASS_TOKENS.subtle} hover:bg-surface-card/60 ${INTERACTION_TOKENS.base}`,
  mobileEventItemBorder: BORDER_TOKENS.dividerBottom,
  mobileEmptyState: `${SPACING_TOKENS.p.lg} text-center ${TEXT_SIZES.sm} ${COLOR_TOKENS.text.primarySubtle} ${FONT_WEIGHTS.medium} bg-surface-card/40`,

  mobileShowActiveButton: `${BUTTON_VARIANTS.glassOutlineButton} ${BORDER_TOKENS.ringSuccess} ${COLOR_TOKENS.status.success}`,
  mobileShowAllButton: BUTTON_VARIANTS.glassIconButton,

  // Participants Area (in Preview)
  participantsGroup: `flex items-center ${SPACING_TOKENS.gap.md}`,
  participantsAvatars: 'flex items-center',
  participantsOverlap: '-space-x-2',
  participantsGap: `${SPACING_TOKENS.gap.sm}`,
  participantAvatar: `${BORDER_TOKENS.ringAvatar} cursor-pointer ${SIZE_TOKENS.avatar.xs}`,
  participantAvatarHover: `hover:${Z_INDEX_TOKENS.base} transition-transform relative`,
  participantMoreBadge: `flex items-center justify-center ${SIZE_TOKENS.avatar.xs} ${RADIUS_TOKENS.full} bg-surface-card-hover/80 ${TEXT_SIZES.xs} ${FONT_WEIGHTS.bold} ${COLOR_TOKENS.text.primary} ${BORDER_TOKENS.ringAvatar} relative ${Z_INDEX_TOKENS.base} hover:bg-surface-card ${INTERACTION_TOKENS.base}`,
  participantViewAll: `${TEXT_SIZES.xs} ${COLOR_TOKENS.text.brandHover} hover:${COLOR_TOKENS.text.brandAccent} cursor-pointer ${FONT_WEIGHTS.medium} underline underline-offset-2`,

  // Participants Modal Styles (Wide Card View)
  participantModalScroll: `flex flex-col ${SPACING_TOKENS.gap.sm} overflow-y-auto max-h-[540px] ${SPACING_TOKENS.pr.sm} w-full custom-scrollbar`,
  participantCard: `flex items-center ${SPACING_TOKENS.gap.md} w-full !${SPACING_TOKENS.p.md} bg-surface-card/40 ${RADIUS_TOKENS.lg} ${BORDER_TOKENS.ringSubtle} hover:bg-surface-card/60 ${INTERACTION_TOKENS.base} shrink-0`,
  participantCardAvatar: `shrink-0 ${SHADOW_TOKENS.sm} ${SIZE_TOKENS.avatar.md}`,
  participantCardInfo: 'flex flex-col flex-1 min-w-0',
  participantCardHeader: `flex items-center justify-between ${SPACING_TOKENS.gap.sm}`,
  participantCardName: `${FONT_WEIGHTS.bold} ${TEXT_SIZES.lg} ${COLOR_TOKENS.text.primary} truncate`,
  participantCardRole: `${TEXT_SIZES.xs} ${FONT_WEIGHTS.bold} ${SPACING_TOKENS.px.sm} ${SPACING_TOKENS.py['2xs']} ${RADIUS_TOKENS.full} ${COLOR_TOKENS.surface.brandTint} ${COLOR_TOKENS.text.brandHover} capitalize shrink-0`,
  participantCardEmail: `${TEXT_SIZES.sm} ${COLOR_TOKENS.text.primaryMuted} truncate`,
  participantCardPhone: `${TEXT_SIZES.xs} ${COLOR_TOKENS.text.primaryFaint} ${SPACING_TOKENS.mt.xs} truncate`,

  clearFilterActive: `${COLOR_TOKENS.status.error} ${BORDER_TOKENS.ringError} hover:bg-status-error/20 ${INTERACTION_TOKENS.base}`,
  clearFilterDisabled: `${COLOR_TOKENS.text.primaryFaint} ${BORDER_TOKENS.ringSubtle} bg-transparent hover:bg-transparent ${OPACITY_TOKENS.muted} cursor-not-allowed`,
  activeToggleFilterBtn: `${BORDER_TOKENS.ringSuccess} ${COLOR_TOKENS.status.success} shrink-0 whitespace-nowrap ${SPACING_TOKENS.px.md} ${SPACING_TOKENS.py.sm}`,
  inactiveToggleFilterBtn: `shrink-0 whitespace-nowrap ${SPACING_TOKENS.px.md} ${SPACING_TOKENS.py.sm}`,
} as const;
