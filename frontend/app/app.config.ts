// frontend/app/app.config.ts
import { COLOR_TOKENS } from '~/utils/styles/colors';

export default defineAppConfig({
  /* ==========================================================================
     GLOBAL UI COMPONENTS
     (Buttons, Cards, Inputs, Modals, Tooltips, etc. used everywhere)
     ========================================================================== */
  ui: {
    // ------------------- BUTTONS -------------------
    button: {
      variants: {
        variant: {
          smallPrimaryActionButton: `rounded-full ${COLOR_TOKENS.button.primary} !${SPACING_TOKENS.px.lg} !${SPACING_TOKENS.py.sm} transition-colors shadow-sm font-bold tracking-wide cursor-pointer`,
          smallAccentActionButton: `rounded-full ${COLOR_TOKENS.button.secondary} !${SPACING_TOKENS.px.lg} !${SPACING_TOKENS.py.sm} transition-colors shadow-sm font-bold tracking-wide cursor-pointer`,
          smallHollowActionButton: `rounded-full text-btn-primary ring-1 ring-btn-primary/40 hover:bg-btn-primary/20 !${SPACING_TOKENS.px.lg} !${SPACING_TOKENS.py.sm} transition-colors text-xs font-semibold cursor-pointer`,

          // Hero Buttons (Usually on Home / Landing)
          actionHeroButton: `rounded-full inline-flex items-center justify-center !px-12 h-14 ${COLOR_TOKENS.button.primary} shadow-[inset_0_1px_3px_rgba(255,255,255,0.3),0_2px_4px_rgba(122,154,130,0.3)] font-bold tracking-wide transition-all hover:-translate-y-1 !text-xl cursor-pointer`,
          actionAccentHeroButton: `rounded-full inline-flex items-center justify-center px-10 !h-12 ${COLOR_TOKENS.button.secondary} shadow-[inset_0_1px_3px_rgba(255,255,255,0.3),0_2px_4px_rgba(122,154,130,0.3)] font-semibold tracking-wide transition-all hover:-translate-y-1 !text-md cursor-pointer`,

          // Standard Action Buttons (Login, Register, Modals)
          actionOkButton: `rounded-full !px-10 justify-center ${COLOR_TOKENS.button.primary} shadow-[inset_0_1px_3px_rgba(255,255,255,0.3),0_2px_4px_rgba(122,154,130,0.3)] h-12 font-bold tracking-wide transition-all text-lg cursor-pointer`,
          actionCancelButton:
            'rounded-full !px-10 justify-center bg-surface-card/50 ring-1 ring-btn-secondary text-btn-secondary hover:bg-btn-secondary hover:text-btn-secondary-text h-11 font-bold tracking-wide transition-colors cursor-pointer',

          // Glass Buttons (General UI, Filters, Headers)
          glassButton: `h-10 ${SPACING_TOKENS.px.xl} rounded-full !min-w-18 flex items-center justify-center text-md bg-surface-card/70 backdrop-blur-xl ${COLOR_TOKENS.text.primary} ring-1 ring-content-primary/10 hover:bg-surface-card/90 transition-colors cursor-pointer`,
          glassOutlineButton: `border border-btn-primary/50 !${SPACING_TOKENS.px.lg} !${SPACING_TOKENS.py.sm} rounded-full bg-surface-card/70 hover:bg-surface-page ${COLOR_TOKENS.text.primary} transition-colors backdrop-blur-md cursor-pointer`,

          // Icon Buttons (Toolbars, Action Groups)
          glassIconButton: `w-10 h-10 rounded-full font-semibold flex items-center justify-center p-0 cursor-pointer bg-surface-card/70 backdrop-blur-xl ${COLOR_TOKENS.text.primary} ring-1 ring-content-primary/10 hover:bg-surface-card/90 transition-colors`,
          glassIconButtonDanger: `w-10 h-10 rounded-full font-semibold flex items-center justify-center p-0 cursor-pointer bg-surface-card/70 backdrop-blur-xl ${COLOR_TOKENS.text.primary} ring-1 ring-content-primary/10 hover:bg-btn-danger hover:text-btn-danger-text transition-colors`,
          glassIconButtonHighlight: `w-10 h-10 rounded-full font-semibold flex items-center justify-center p-0 cursor-pointer bg-surface-card/70 backdrop-blur-xl ${COLOR_TOKENS.text.primary} ring-1 ring-content-primary/10 hover:bg-btn-primary hover:text-btn-primary-text transition-colors`,
          glassIconButtonBrand:
            'w-10 h-10 rounded-full font-semibold flex items-center justify-center p-0 cursor-pointer bg-surface-card/70 backdrop-blur-xl text-btn-primary ring-1 ring-content-primary/10 hover:bg-surface-subtle transition-colors',

          // Ghost Icon Buttons (Inside cards, subtle actions)
          ghostDangerIconButton: `text-content-primary/70 hover:text-status-error transition-colors ${SPACING_TOKENS.p.xs} cursor-pointer [&>span]:!w-5 [&>span]:!h-5`,
          ghostBrandIconButton: `${COLOR_TOKENS.text.inverse} hover:text-btn-primary ${SPACING_TOKENS.p.xs} transition-colors cursor-pointer [&>span]:!w-5 [&>span]:!h-5`,
        },
      },
    },

    checkbox: {
      slots: { root: `flex items-center ${SPACING_TOKENS.gap.sm}` },
      variants: {
        variant: {
          glass: {
            root: `text-content-primary/70 hover:${COLOR_TOKENS.text.primary} transition-colors cursor-pointer bg-black/5 hover:bg-content-primary/10 rounded-full ${SPACING_TOKENS.p.sm}`,
          },
        },
      },
    },

    // ------------------- CARDS -------------------
    card: {
      slots: {
        root: 'w-full',
        body: `${SPACING_TOKENS.responsive.cardPadding}`,
      },
      variants: {
        variant: {
          glass: {
            root: `bg-surface-card/70 backdrop-blur-xl rounded-[25px] shadow-[0_15px_40px_rgba(47,62,50,0.15)] border-0 ring-1 ring-surface-card/50 ${COLOR_TOKENS.text.primary} max-w-md mx-auto w-full`,
          },
          interactiveGlass: {
            root: `bg-surface-card/70 backdrop-blur-xl rounded-[25px] shadow-[0_15px_40px_rgba(47,62,50,0.15)] border-0 ring-1 ring-surface-card/50 ${COLOR_TOKENS.text.primary} transition-transform hover:-translate-y-1 overflow-hidden min-w-0`,
            body: `flex flex-col items-center justify-center h-full text-center ${SPACING_TOKENS.responsive.cardPadding} overflow-hidden`,
          },
          outlineGlass: {
            root: `bg-surface-card-hover/10 backdrop-blur-xl rounded-[25px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-0 ring-2 ring-content-inverse/60 ${COLOR_TOKENS.text.inverse} transition-all duration-500 ease-in-out`,
            body: `${SPACING_TOKENS.responsive.cardPadding} h-full flex flex-col`,
          },
          pointedGlass: {
            root: `bg-surface-card/70 backdrop-blur-xl rounded-[25px] shadow-[0_15px_40px_rgba(47,62,50,0.15)] border-0 ring-1 ring-surface-card/50 ${COLOR_TOKENS.text.primary} transition-transform hover:-translate-y-1 cursor-pointer`,
            body: `flex flex-col items-center justify-center h-full text-center ${SPACING_TOKENS.responsive.cardPadding}`,
          },
          documentGlass: {
            root: `bg-surface-card/70 backdrop-blur-xl rounded-[25px] shadow-[0_15px_40px_rgba(47,62,50,0.15)] border-0 ring-1 ring-surface-card/50 ${COLOR_TOKENS.text.primary} overflow-hidden transition-transform hover:-translate-y-1`,
            body: 'p-0 flex flex-col h-full',
          },
        },
      },
    },

    // ------------------- FORMS & INPUTS -------------------
    input: {
      slots: {
        root: 'w-full',
        base: `w-full [&_input]:!${SPACING_TOKENS.px.md}`,
      },
      variants: {
        variant: {
          glass: {
            base: `${COLOR_TOKENS.input.base} rounded-xl ring-1 ring-field-border focus:ring-2 focus:ring-field-focus transition-colors h-11 [&_input]:!${SPACING_TOKENS.px.md} shadow-none`,
          },
          glassError: {
            base: `${COLOR_TOKENS.input.error} rounded-xl ring-1 ring-status-error placeholder:text-status-error-border focus:ring-2 focus:ring-status-error transition-colors h-11 [&_input]:!${SPACING_TOKENS.px.md} shadow-none`,
          },
          search: {
            base: `${COLOR_TOKENS.input.base} rounded-full ring-1 ring-field-border focus:ring-2 focus:ring-field-focus transition-colors h-10 !pl-8 [&_input]:!${SPACING_TOKENS.px.md} shadow-none w-full`,
          },
        },
      },
    },
    formField: {
      slots: {
        label: `text-sm font-medium ${COLOR_TOKENS.text.primary} ${SPACING_TOKENS.mb.xs} block`,
        error: `${COLOR_TOKENS.status.error} text-sm text-left font-small`,
      },
    },

    textarea: {
      slots: { root: 'w-full' },
      variants: {
        variant: {
          glass: {
            base: `${COLOR_TOKENS.input.base} rounded-xl ring-1 ring-field-border focus:ring-2 focus:ring-field-focus transition-colors h-11 !${SPACING_TOKENS.px.md} shadow-none`,
          },
          glassError: {
            base: `${COLOR_TOKENS.input.error} rounded-xl ring-1 ring-status-error placeholder:text-status-error-border focus:ring-2 focus:ring-status-error transition-colors h-11 !${SPACING_TOKENS.px.md} shadow-none`,
          },
        },
      },
    },

    // ------------------- AVATAR -------------------
    avatar: {
      slots: {
        root: '!bg-btn-primary text-btn-primary-text flex items-center justify-center rounded-full shadow-sm ring-1 ring-btn-primary/30 font-bold overflow-hidden hover:ring-2 hover:ring-btn-primary transition-all',
      },
      variants: {
        size: {
          header: { root: 'w-9 h-9 text-base' },
          profileLg: { root: `w-24 h-24 text-4xl shadow-md ${SPACING_TOKENS.m.sm}` },
        },
      },
      defaultVariants: { size: 'header' },
    },

    // ------------------- DROPDOWNS & SELECTS -------------------
    select: {
      slots: {
        base: `w-fit rounded-full text-btn-primary !ring-1 !ring-btn-primary !bg-surface-card/90 !pl-8 !${SPACING_TOKENS.px.md} !${SPACING_TOKENS.py.sm} transition-colors text-xs font-semibold shadow-sm cursor-pointer text-left`,
        trailingIcon:
          'absolute right-2 w-4 h-4 transition-transform pointer-events-none text-btn-primary',
        content: `z-100 !bg-surface-card rounded-2xl ring-1 ring-btn-primary/30 shadow-xl ${COLOR_TOKENS.text.primary} ${SPACING_TOKENS.mt.sm}`,
        viewport: `${SPACING_TOKENS.p.xs}`,
        item: `flex items-center justify-start text-left ${SPACING_TOKENS.py.sm} ${SPACING_TOKENS.px.md} hover:bg-btn-primary/20 ${COLOR_TOKENS.text.primary} cursor-pointer data-[highlighted]:bg-btn-primary/20 data-[highlighted]:text-content-primary font-medium text-xs rounded-xl mx-1 my-1 whitespace-nowrap`,
      },
    },
    dropdownMenu: {
      slots: {
        content: `z-[100] bg-surface-card/90 backdrop-blur-md rounded-2xl ring-1 ring-btn-primary/30 shadow-xl ${SPACING_TOKENS.p.xs} w-36`,
        item: `flex items-center ${SPACING_TOKENS.gap.sm} w-full justify-start text-left cursor-pointer ${SPACING_TOKENS.px.md} ${SPACING_TOKENS.py.sm} text-md font-medium text-content-primary/80 hover:${COLOR_TOKENS.text.primary} hover:bg-btn-primary/20 data-[highlighted]:bg-btn-primary/20 data-[highlighted]:text-content-primary rounded-xl transition-colors`,
        itemLeadingIcon: '!w-6 !h-8 !text-btn-primary shrink-0',
      },
    },
    wideDropdownMenu: {
      slots: {
        content: `z-[100] bg-surface-card/90 backdrop-blur-md rounded-2xl ring-1 ring-btn-primary/30 shadow-xl ${SPACING_TOKENS.p.sm} sm:min-w-64`,
        item: `flex items-start ${SPACING_TOKENS.gap.sm} w-full justify-start text-left cursor-pointer ${SPACING_TOKENS.px.md} ${SPACING_TOKENS.py.sm} text-md font-medium text-content-primary/80 hover:${COLOR_TOKENS.text.primary} hover:bg-btn-primary/20 data-[highlighted]:bg-btn-primary/20 data-[highlighted]:text-content-primary rounded-xl transition-colors`,
        itemLeadingIcon: '!w-6 !h-6 !text-btn-primary shrink-0',
      },
    },
    selectMenu: {
      slots: {
        base: `bg-transparent ${COLOR_TOKENS.text.inverse} font-bold text-xl border-none shadow-none ring-0 focus:ring-0 focus:outline-none cursor-pointer hover:opacity-80 transition-opacity`,
        trailingIcon: `${COLOR_TOKENS.text.inverse} w-6 h-6`,
        content: `z-[100] bg-surface-card/90 backdrop-blur-xl rounded-2xl ring-1 ring-btn-primary/30 shadow-xl ${COLOR_TOKENS.text.primary} ${SPACING_TOKENS.mt.sm} min-w-56`,
        item: `flex items-center text-left ${SPACING_TOKENS.py.sm} ${SPACING_TOKENS.px.md} hover:bg-btn-primary/20 ${COLOR_TOKENS.text.primary} cursor-pointer data-[highlighted]:bg-btn-primary/20 data-[highlighted]:text-content-primary font-medium text-sm rounded-xl mx-1 my-1`,
      },
    },

    // ------------------- MODALS -------------------
    modal: {
      slots: {
        overlay: `fixed inset-0 z-[100] ${COLOR_TOKENS.surface.overlay} backdrop-blur-sm`,
        content:
          'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[95%] sm:w-full !bg-surface-modal/70 backdrop-blur-2xl !rounded-[25px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] !ring-1 !ring-surface-card/50 !divide-none !border-0 focus:!outline-none overflow-hidden flex flex-col',
        header: `${SPACING_TOKENS.p.md} sm:${SPACING_TOKENS.px.lg} !border-0 !ring-0`,
        body: `${SPACING_TOKENS.responsive.cardPadding} !border-0 !ring-0`,
        footer: `${SPACING_TOKENS.p.md} sm:${SPACING_TOKENS.px.lg} !border-0 !ring-0`,
      },
    },

    // ------------------- TOOLTIPS -------------------
    tooltip: {
      slots: {
        content: `z-[100] bg-surface-card/90 backdrop-blur-md ${COLOR_TOKENS.text.primary} ring-1 ring-btn-primary/30 rounded-xl ${SPACING_TOKENS.px.sm} ${SPACING_TOKENS.py.xs} text-xs font-semibold shadow-xl`,
        arrow: 'fill-surface-card/90',
      },
    },
  },

  /* ==========================================================================
     LAYOUT CLASSES
     (Containers, Wrappers, Structural Elements)
     ========================================================================== */
  layout: {
    // ------------------- GLOBAL LAYOUT -------------------
    base: `min-h-screen flex flex-col ${COLOR_TOKENS.surface.page} font-sans bg-cover bg-center bg-no-repeat bg-fixed`,
    mainDefault: `flex-1 flex flex-col ${SPACING_TOKENS.responsive.screenPadding}`,

    // Page Wrappers
    pageWrapper: `w-full max-w-7xl mx-auto flex flex-col ${SPACING_TOKENS.responsive.containerGap} relative`,
    pageHeader: `flex flex-col md:flex-row justify-between items-center w-full ${SPACING_TOKENS.responsive.gridGap}`,

    // Common Utilities
    actionGroup: `flex items-center ${SPACING_TOKENS.gap.md}`,
    singleButtonWrapper: 'pt-2 text-center w-full',
    divider: `${SPACING_TOKENS.my.xs} border-t border-content-primary/10 w-full`,
    flexBetween: 'flex justify-between w-full',

    // ------------------- HEADER COMPONENT -------------------
    headerBase: `flex items-center justify-between ${SPACING_TOKENS.px.md} md:${SPACING_TOKENS.px.lg} ${SPACING_TOKENS.py.md} bg-surface-card/70 backdrop-blur-md shadow-sm z-50 border-b border-content-primary/10`,
    headerSticky: 'sticky top-0',
    headerRelative: 'relative',
    logoWrapper: `flex items-center ${SPACING_TOKENS.gap.sm} ${COLOR_TOKENS.text.primary} hover:opacity-80 transition-opacity w-max`,
    navWrapper: `hidden md:flex ${SPACING_TOKENS.gap.xl} font-bold tracking-wide`,
    headerRight: `flex-1 flex justify-end items-center ${SPACING_TOKENS.responsive.listGap}`,

    // ------------------- HOME PAGE -------------------
    homeWrapper: `flex-1 flex flex-col items-center ${SPACING_TOKENS.px.md} md:${SPACING_TOKENS.px.lg} py-8 md:py-12 ${SPACING_TOKENS.responsive.containerGap} relative z-10 w-full`,
    homeHeroSection: `flex flex-col items-center text-center ${SPACING_TOKENS.mt.lg} max-w-3xl scroll-mt-24`,
    homeCardsSection: `flex flex-col md:flex-row flex-wrap ${SPACING_TOKENS.responsive.gridGap} w-full max-w-6xl ${SPACING_TOKENS.mb.xl}`,
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
    cardFooter:
      'flex items-end justify-between w-full pt-4 border-t border-content-primary/10 text-xs text-content-primary/70',

    memberCardInner: `flex items-start ${SPACING_TOKENS.gap.md} w-full h-full min-w-0`,
    memberCardContent: 'flex-1 flex flex-col justify-between h-full min-h-16 min-w-0',

    // ------------------- PROFILE & DOCUMENTS VIEWS -------------------
    sectionWrapper: `${SPACING_TOKENS.mt.xl} flex flex-col ${SPACING_TOKENS.gap.lg}`,

    // User Profile Card
    profileCard: `w-full bg-surface-card/70 backdrop-blur-xl rounded-[25px] shadow-[0_15px_40px_rgba(47,62,50,0.15)] ring-1 ring-surface-card/50 ${SPACING_TOKENS.responsive.cardPadding} flex flex-col md:flex-row ${SPACING_TOKENS.gap.xl} relative`,
    profilePictureWrapper: `relative w-40 h-40 shrink-0 mx-auto md:mx-0 md:ml-8 ${SPACING_TOKENS.mt.xl} md:mt-0`,
    profilePictureInner:
      'w-full h-full bg-btn-primary rounded-2xl overflow-hidden shadow-lg border border-surface-card/50 flex items-center justify-center relative',
    profileDetailsWrapper: `flex-1 flex flex-col justify-center ${SPACING_TOKENS.gap.sm} ${COLOR_TOKENS.text.primary} pt-2`,
    profileDetailRow: `flex items-center ${SPACING_TOKENS.gap.md}`,

    // Documents Grid
    documentGrid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ${SPACING_TOKENS.responsive.gridGap} w-full ${SPACING_TOKENS.mt.md}`,
    documentCardHeader: `absolute top-0 left-0 w-full ${SPACING_TOKENS.p.md} flex justify-between items-start z-10 bg-linear-to-b from-black/50 to-transparent ${COLOR_TOKENS.text.inverse}`,
    documentCardImage:
      'w-full h-40 bg-surface-card-hover/30 flex flex-col items-center justify-center relative',
    documentCardMeta: `${SPACING_TOKENS.p.md} flex flex-col ${SPACING_TOKENS.gap.xs} text-xs text-content-primary/80`,

    fileInput: `w-full text-sm text-content-primary/70 file:mr-4 file:${SPACING_TOKENS.py.sm} file:${SPACING_TOKENS.px.lg} file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-transparent file:text-btn-primary file:ring-1 file:ring-btn-primary/40 hover:file:bg-btn-primary/20 file:transition-colors file:cursor-pointer cursor-pointer`,
    // ------------------- MODAL LAYOUTS -------------------
    modalForm: `flex flex-col ${SPACING_TOKENS.gap.md} ${SPACING_TOKENS.py.sm}`,
    modalActions: `flex flex-col-reverse sm:flex-row items-center justify-between w-full ${SPACING_TOKENS.gap.sm} sm:gap-0`,
    modalSizeSm: 'w-full sm:max-w-md !w-[90%] !mx-auto sm:!w-full',
    modalSizeMd: 'w-full sm:max-w-lg !w-[90%] !mx-auto sm:!w-full',
    modalSizeLg: 'w-full sm:max-w-3xl !w-[90%] !mx-auto sm:!w-full',
  },

  /* ==========================================================================
     TYPOGRAPHY
     (Fonts, Text Sizes, Headings, Highlights)
     ========================================================================== */
  typography: {
    // ------------------- GLOBAL TEXTS -------------------
    pageTitle: `text-3xl font-bold ${COLOR_TOKENS.text.inverse} tracking-wide text-center`,
    pageSubtitle: `text-sm opacity-80 capitalize ${COLOR_TOKENS.text.inverse} font-semibold ${SPACING_TOKENS.mt.xs}`,
    sectionTitleTransparent: `text-2xl font-bold ${COLOR_TOKENS.text.inverse} tracking-wide text-center flex-1`,

    cardTitle: `text-xl font-bold tracking-wide ${COLOR_TOKENS.text.primary} truncate block w-full`,
    cardTitleCenter: `text-xl font-bold text-center tracking-wide ${COLOR_TOKENS.text.primary} truncate pr-2`,

    // ------------------- STATUS & ERRORS -------------------
    statusLoading: `text-center ${SPACING_TOKENS.py.xl} ${COLOR_TOKENS.text.inverse}`,
    statusError: `text-center ${SPACING_TOKENS.py.xl} ${COLOR_TOKENS.status.error}`,
    formStatusError: `${COLOR_TOKENS.status.error} text-sm text-center font-medium`,
    formStatusSuccess: `${COLOR_TOKENS.status.success} text-sm text-center font-medium`,

    // ------------------- HOME PAGE TEXTS -------------------
    homeHeroText: `${SPACING_TOKENS.mt.sm} ${SPACING_TOKENS.mb.lg} text-lg ${COLOR_TOKENS.text.inverse} font-medium opacity-90 leading-relaxed`,
    homeSectionTitle: `text-3xl font-bold ${COLOR_TOKENS.text.inverse} tracking-wide`,
    homeSectionText: `${SPACING_TOKENS.mt.md} ${SPACING_TOKENS.mb.xl} text-lg ${COLOR_TOKENS.text.inverse} font-medium opacity-90 leading-relaxed`,

    // ------------------- HEADER NAV TEXTS -------------------
    logoText: 'text-lg md:text-xl font-semibold tracking-wider',
    navLink: 'hover:text-btn-primary hover:underline underline-offset-4 transition-colors',

    // ------------------- AUTH TEXTS -------------------
    authTitle: `text-2xl font-medium tracking-wide ${COLOR_TOKENS.text.brand}`,
    authTitleWrapper: `text-center ${SPACING_TOKENS.m.xl}`,

    // ------------------- PROFILE TEXTS -------------------
    profileLabel: 'w-28 font-medium opacity-80 shrink-0',
    profileValue: 'font-bold text-lg',
    profileValueLg: 'font-bold text-xl leading-none',

    // ------------------- MODAL TEXTS & FORMS -------------------
    modalText: `text-sm text-content-primary/80 ${SPACING_TOKENS.py.sm}`,
    modalHighlight: `block font-semibold ${SPACING_TOKENS.mt.xs} text-btn-primary`,
    modalInlineHighlight: `font-semibold ${SPACING_TOKENS.mt.xs} text-btn-primary`,
    modalErrorBox: `text-xs font-semibold ${COLOR_TOKENS.status.errorBox} ${SPACING_TOKENS.mt.sm} ${SPACING_TOKENS.p.sm} rounded border`,
    modalSuccessBox: `text-xs font-semibold text-btn-primary ${SPACING_TOKENS.mt.sm} bg-btn-primary/10 ${SPACING_TOKENS.p.sm} rounded border border-btn-primary/20`,
    modalActionBtnCancel: 'w-full sm:w-auto',
    modalActionBtnOk: 'w-full sm:w-auto',
    inputLabel: `block text-sm font-medium ${COLOR_TOKENS.text.primary} ${SPACING_TOKENS.mb.xs}`,
    inputError: `text-xs ${COLOR_TOKENS.status.error} ${SPACING_TOKENS.mt.xs}`,
  },

  /* ==========================================================================
     FOOTER
     ========================================================================== */
  footer: {
    base: `py-4 ${SPACING_TOKENS.px.md} md:${SPACING_TOKENS.px.lg} flex items-center justify-between text-xs ${COLOR_TOKENS.text.primary} bg-surface-page/70 backdrop-blur-md shadow-[0_-2px_10px_rgba(0,0,0,0.02)] relative z-10`,
    text: 'font-medium opacity-80',
  },

  /* ==========================================================================
     CALENDAR / EVENTS VIEW
     (Styles specifically built for the Calendar scheduling interface)
     ========================================================================== */
  calendar: {
    // Wrapper and Layouts
    eventsWrapper: `w-full max-w-360 mx-auto ${SPACING_TOKENS.px.md} md:${SPACING_TOKENS.px.lg} ${SPACING_TOKENS.py.xl} flex flex-col flex-1 min-h-0 ${SPACING_TOKENS.gap.xl} relative`,
    eventsHeaderRow: `flex flex-col md:flex-row justify-between items-center w-full ${SPACING_TOKENS.gap.lg} shrink-0`,
    headerActionLeft: `flex items-center ${SPACING_TOKENS.gap.md} flex-1 justify-start`,
    headerCenter: 'flex flex-col items-center justify-center shrink-0',
    headerTitleRow: `flex items-center ${SPACING_TOKENS.gap.xs}`,
    headerActionRight: `flex items-center ${SPACING_TOKENS.gap.md} flex-1 justify-end`,

    // Filters
    headerSearchWrapper: 'flex items-center w-full max-w-sm ml-4',
    filterDropdownContent: `z-[100] bg-surface-card/90 backdrop-blur-xl rounded-2xl ring-1 ring-btn-primary/30 shadow-xl ${SPACING_TOKENS.p.md} w-72`,
    filterFormGroup: `flex flex-col ${SPACING_TOKENS.gap.sm}`,
    filterLabel: 'text-sm font-semibold text-content-primary/90',
    filterDateInput: `w-full ${COLOR_TOKENS.input.base} rounded-xl ring-1 ring-field-border focus:ring-2 focus:ring-field-focus transition-colors h-10 ${SPACING_TOKENS.px.md}`,
    filterButtonWrapper: `${SPACING_TOKENS.mt.md} flex justify-end w-full`,

    eventsGrid: `grid grid-cols-1 md:grid-cols-12 ${SPACING_TOKENS.gap.xs} flex-1 min-h-0 bg-surface-card/50 backdrop-blur-md border border-content-primary/20 rounded-xl overflow-hidden shadow-lg`,
    // Columns
    columnBase: 'flex flex-col h-full border-content-primary/10',
    columnDays: 'col-span-12 md:col-span-3 border-r bg-surface-card/20',
    columnEvents: 'col-span-12 md:col-span-4 border-r bg-surface-card/10',
    columnPreview: 'col-span-12 md:col-span-5 bg-surface-card/20 overflow-y-auto',
    columnHeader: `${SPACING_TOKENS.p.md} font-semibold text-sm text-content-primary/80 uppercase tracking-wider shrink-0 bg-surface-card-hover/50 flex justify-between border-b border-content-primary/10`,
    columnBody: 'flex-1 overflow-y-auto',

    // List Items (Days, Events)
    listItem: `flex items-center justify-between ${SPACING_TOKENS.p.md} border-b border-content-primary/10 cursor-pointer transition-colors`,
    listItemHover: 'hover:bg-surface-card/40',
    listItemSelected: 'bg-surface-card-hover/70 border-l-4 border-l-btn-primary',
    eventListItemSelected: 'bg-btn-primary/20',

    eventItemWrapper: `flex items-center ${SPACING_TOKENS.gap.sm}`,
    eventItemIcon: 'w-5 h-5 text-content-primary/70',
    eventItemTitle: `font-semibold ${COLOR_TOKENS.text.primary}`,
    eventItemTime: 'text-xs text-content-primary/70 font-bold',
    expiredItemWrapper: 'opacity-40 grayscale hover:opacity-70',
    expiredItemText: 'line-through decoration-content-primary/40',

    // Event Preview Area
    previewWrapper: `${SPACING_TOKENS.p.lg} flex flex-col ${SPACING_TOKENS.gap.lg}`,
    previewTitleRow: 'flex items-center justify-between',
    previewTypeWrapper: `flex items-center ${SPACING_TOKENS.gap.sm} text-content-primary/80`,
    previewTypeIcon: 'w-5 h-5',
    previewTypeText: 'text-sm font-medium',
    previewMainTitle: `text-xl font-bold ${COLOR_TOKENS.text.primary} text-center flex-1`,
    previewExpiredBadge:
      'text-xs ml-2 bg-status-error/20 text-status-error px-2 py-0.5 rounded-full align-middle',
    previewMetaRow: `flex flex-col ${SPACING_TOKENS.gap.sm} text-sm text-content-primary/90`,

    metaRowItem: `flex ${SPACING_TOKENS.gap.sm}`,
    metaRowItemCenter: `flex ${SPACING_TOKENS.gap.sm} items-center min-h-8`,
    metaLabel: 'font-bold w-24 shrink-0',
    metaValue: 'flex-1 leading-relaxed',
    metaValueLink:
      'text-btn-primary-hover hover:text-btn-primary underline underline-offset-2 cursor-pointer transition-colors',

    previewMapPlaceholder: `w-full h-64 ${SPACING_TOKENS.mt.sm} rounded-xl overflow-hidden relative flex items-center justify-center shadow-inner border border-content-primary/20 bg-surface-card-hover/30`,
    emptyPreview: 'flex-1 flex items-center justify-center text-content-primary/60 text-sm font-medium',

    // Mobile view styles
    mobileMainWrapper: `${SPACING_TOKENS.p.sm} flex flex-col ${SPACING_TOKENS.gap.md}`,
    mobileContentWrapper: `bg-surface-card/50 backdrop-blur-md rounded-xl ring-1 ring-content-primary/10 shadow-lg ${SPACING_TOKENS.p.sm} ${SPACING_TOKENS.mt.md} flex-1 flex flex-col ${SPACING_TOKENS.gap.sm}`,
    mobileTopActions: `flex items-center justify-between w-full ${SPACING_TOKENS.px.sm} ${SPACING_TOKENS.mb.sm}`,
    mobileHeader: 'w-full text-center flex flex-col items-center',
    mobileHeaderButton: `flex flex-col justify-center items-center ${SPACING_TOKENS.gap.xs} p-0 hover:bg-transparent cursor-pointer outline-none w-full`,
    mobileHeaderTitleRow: `flex items-center ${SPACING_TOKENS.gap.sm}`,
    mobileToolbar: `flex items-center ${SPACING_TOKENS.gap.sm} w-full ${SPACING_TOKENS.mt.sm}`,
    mobileFilterButton: `rounded-full ${SPACING_TOKENS.px.md} text-sm h-10 shadow-none border-content-primary/20 bg-surface-card/70`,
    mobileDateButton: `flex justify-between items-center rounded-full ${SPACING_TOKENS.px.lg} bg-surface-card/30 border-content-primary/30 ${COLOR_TOKENS.text.primary} shadow-inner font-bold`,
    mobileEventsWrapper: `flex flex-col w-full ${SPACING_TOKENS.mt.sm} ring-1 ring-content-primary/10 rounded-xl overflow-hidden bg-surface-card/20`,
    mobileEventItem: `flex items-center justify-between ${SPACING_TOKENS.p.md} bg-surface-card/40 backdrop-blur-md cursor-pointer hover:bg-surface-card/60 transition-colors`,
    mobileEventItemBorder: 'border-b border-content-primary/10',
    mobileEmptyState: `${SPACING_TOKENS.p.lg} text-center text-sm text-content-primary/60 font-medium bg-surface-card/40`,

    mobileShowActiveButton: `border border-btn-primary/50 !${SPACING_TOKENS.px.lg} !${SPACING_TOKENS.py.sm} rounded-full bg-surface-card/70 hover:bg-surface-page transition-colors backdrop-blur-md cursor-pointer ring-2 ring-status-success ${COLOR_TOKENS.status.success}`,
    mobileShowAllButton: `w-10 h-10 rounded-full font-semibold flex items-center justify-center p-0 cursor-pointer bg-surface-card/70 backdrop-blur-xl ${COLOR_TOKENS.text.primary} ring-1 ring-content-primary/10 hover:bg-surface-card/90 transition-colors shrink-0`,
    // Participants Area (in Preview)
    participantsGroup: `flex items-center ${SPACING_TOKENS.gap.md}`,
    participantsAvatars: 'flex items-center',
    participantsOverlap: '-space-x-2',
    participantsGap: `${SPACING_TOKENS.gap.sm}`,
    participantAvatar: 'ring-2 ring-surface-card cursor-pointer w-5 h-5',
    participantAvatarHover: 'hover:z-10 transition-transform relative',
    participantMoreBadge: `flex items-center justify-center w-5 h-5 rounded-full bg-surface-card-hover/80 text-xs font-bold ${COLOR_TOKENS.text.primary} ring-2 ring-surface-card relative z-10 hover:bg-surface-card transition-colors cursor-pointer`,
    participantViewAll:
      'text-xs text-btn-primary-hover hover:text-btn-primary cursor-pointer font-medium underline underline-offset-2',

    // Participants Modal Styles (Wide Card View)
    participantModalScroll: `flex flex-col ${SPACING_TOKENS.gap.sm} overflow-y-auto max-h-[540px] pr-2 w-full custom-scrollbar`,
    participantCard: `flex items-center ${SPACING_TOKENS.gap.md} w-full !${SPACING_TOKENS.p.md} bg-surface-card/40 rounded-2xl ring-1 ring-content-primary/10 hover:bg-surface-card/60 transition-colors cursor-pointer shrink-0`,
    participantCardAvatar: 'shrink-0 shadow-sm w-10 h-10',
    participantCardInfo: 'flex flex-col flex-1 min-w-0',
    participantCardHeader: `flex items-center justify-between ${SPACING_TOKENS.gap.sm}`,
    participantCardName: `font-bold text-lg ${COLOR_TOKENS.text.primary} truncate`,
    participantCardRole: `text-xs font-bold ${SPACING_TOKENS.px.sm} py-0.5 rounded-full bg-btn-primary/20 text-btn-primary-hover capitalize shrink-0`,
    participantCardEmail: 'text-sm text-content-primary/70 truncate',
    participantCardPhone: `text-xs text-content-primary/50 ${SPACING_TOKENS.mt.xs} truncate`,
  },
});