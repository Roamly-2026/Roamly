// frontend/app/utils/styles/calendar.ts

export const CALENDAR_CONFIG = {
  // Wrapper and Layouts
  eventsWrapper: `w-full ${SIZE_TOKENS.container.calendarMax} ${SPACING_TOKENS.mx.auto} ${SPACING_TOKENS.px.md} md:${SPACING_TOKENS.px.lg} ${SPACING_TOKENS.py.xl} flex flex-col flex-1 min-h-0 ${SPACING_TOKENS.gap.xl} relative`,
  eventsHeaderRow: LAYOUT_CONFIG.headerRow,
  headerActionLeft: LAYOUT_CONFIG.headerActionLeft,
  headerCenter: LAYOUT_CONFIG.headerCenter,
  headerTitleRow: LAYOUT_CONFIG.headerTitleRow,
  headerActionRight: LAYOUT_CONFIG.headerActionRight,

  // Filters
  headerSearchWrapper: LAYOUT_CONFIG.headerSearchWrapper,
  filterDropdownContent: `${MENU_APPEARANCES.content} ${SPACING_TOKENS.p.md} ${SIZE_TOKENS.container.dropdownFilter}`,
  filterFormGroup: LAYOUT_CONFIG.modalFormGroup,
  filterLabel: `${TEXT_SIZES.sm} ${FONT_WEIGHTS.semibold} ${COLOR_TOKENS.text.primaryStrong}`,
  filterDateInput: `w-full ${INPUT_APPEARANCES.glass} ${RADIUS_TOKENS.md} ${INPUT_SIZES.sm} ${SPACING_TOKENS.px.md}`,
  filterButtonWrapper: LAYOUT_CONFIG.rightButtonWrapper,
  clearFilterActive: `${COLOR_TOKENS.status.error} ${BORDER_TOKENS.ringError} hover:bg-status-error/20 ${INTERACTION_TOKENS.base}`,
  clearFilterDisabled: `${COLOR_TOKENS.text.primaryFaint} ${BORDER_TOKENS.ringSubtle} bg-transparent hover:bg-transparent ${OPACITY_TOKENS.muted} cursor-not-allowed`,
  activeToggleFilterBtn: `${BORDER_TOKENS.ringBrand} ${COLOR_TOKENS.surface.brandTint} ${COLOR_TOKENS.text.brandAccent} ${SIZE_TOKENS.controlHeight.md} shrink-0 whitespace-nowrap !px-4`,
  inactiveToggleFilterBtn: `${SIZE_TOKENS.controlHeight.md} shrink-0 whitespace-nowrap !px-4`,

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
  eventItemTitle: `${FONT_WEIGHTS.semibold} ${COLOR_TOKENS.text.primary} truncate`,
  eventItemTime: `${TEXT_SIZES.xs} ${COLOR_TOKENS.text.primaryMuted} ${FONT_WEIGHTS.bold} whitespace-nowrap`,
  eventItemRowLeft: `flex flex-row items-center ${SPACING_TOKENS.gap.sm} flex-1 min-w-0 ${SPACING_TOKENS.pr.sm}`,
  expiredItemWrapper: `${OPACITY_TOKENS.muted} grayscale ${OPACITY_TOKENS.hoverSubtle}`,
  expiredItemText: 'line-through decoration-content-primary/40',

  // Event Preview Area
  previewWrapper: `${SPACING_TOKENS.p.lg} flex flex-col ${SPACING_TOKENS.gap.lg}`,
  previewTitleRow: 'flex items-center justify-between w-full',
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
  emptyPreview: TYPOGRAPHY_CONFIG.emptyStateText,

  // Mobile Calendar Styles
  mobileFilterButton: `${SIZE_TOKENS.controlHeight.md} ${RADIUS_TOKENS.full} !px-4 ${TEXT_SIZES.sm} ${FONT_WEIGHTS.semibold} ${BORDER_TOKENS.medium} bg-surface-card/70 shrink-0 whitespace-nowrap`,
  mobileDateButton: `flex justify-between items-center ${RADIUS_TOKENS.full} ${SPACING_TOKENS.px.lg} bg-surface-card/30 ${BORDER_TOKENS.strong} ${COLOR_TOKENS.text.primary} ${SHADOW_TOKENS.inner} ${FONT_WEIGHTS.bold}`,
  mobileEventsWrapper: `flex flex-col w-full ${SPACING_TOKENS.mt.sm} ${BORDER_TOKENS.ringSubtle} ${RADIUS_TOKENS.md} overflow-hidden ${GLASS_TOKENS.faint}`,
  mobileEventItem: `flex items-center justify-between ${SPACING_TOKENS.p.md} ${GLASS_TOKENS.subtle} hover:bg-surface-card/60 ${INTERACTION_TOKENS.base}`,
  mobileEventItemBorder: BORDER_TOKENS.dividerBottom,
  mobileEmptyState: `${SPACING_TOKENS.p.lg} text-center ${TEXT_SIZES.sm} ${COLOR_TOKENS.text.primarySubtle} ${FONT_WEIGHTS.medium} bg-surface-card/40`,

  // Participants Area (in Preview)
  participantsGroup: `flex items-center ${SPACING_TOKENS.gap.md}`,
  participantsAvatars: 'flex items-center',
  participantsOverlap: '-space-x-2',
  participantsGap: `${SPACING_TOKENS.gap.sm}`,
  participantAvatar: `${BORDER_TOKENS.ringAvatar} cursor-pointer ${SIZE_TOKENS.avatar.xs}`,
  participantAvatarHover: `hover:${Z_INDEX_TOKENS.base} transition-transform relative`,
  participantMoreBadge: `flex items-center justify-center ${SIZE_TOKENS.avatar.xs} ${RADIUS_TOKENS.full} bg-surface-card-hover/80 ${TEXT_SIZES.xs} ${FONT_WEIGHTS.bold} ${COLOR_TOKENS.text.primary} ${BORDER_TOKENS.ringAvatar} relative ${Z_INDEX_TOKENS.base} hover:bg-surface-card ${INTERACTION_TOKENS.base}`,
} as const;
