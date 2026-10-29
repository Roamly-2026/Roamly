// frontend/app/utils/styles/forms.ts

// 1. CHECKBOX
export const CHECKBOX_CONFIG = {
  slots: {
    root: `flex items-center ${SPACING_TOKENS.gap.sm}`,
  },
  variants: {
    variant: {
      glass: {
        root: `${COLOR_TOKENS.text.primaryMuted} hover:${COLOR_TOKENS.text.primary} ${INTERACTION_TOKENS.base} bg-content-primary/5 hover:bg-content-primary/10 ${RADIUS_TOKENS.full} ${SPACING_TOKENS.p.sm}`,
      },
    },
  },
} as const;

// 2. SHARED INPUT & TEXTAREA APPEARANCES
export const INPUT_SIZES = {
  sm: SIZE_TOKENS.controlHeight.md, // h-10
  md: SIZE_TOKENS.controlHeight.lg, // h-11
} as const;

export const INPUT_APPEARANCES = {
  glass: `${COLOR_TOKENS.input.base} ${BORDER_TOKENS.ringInput} ${SHADOW_TOKENS.none} transition-colors`,
  error: `${COLOR_TOKENS.input.error} ${BORDER_TOKENS.ringError} placeholder:text-status-error-border ${SHADOW_TOKENS.none} transition-colors`,
} as const;

// 3. INPUT CONFIG
export const INPUT_CONFIG = {
  slots: {
    root: 'w-full',
    base: 'w-full [&_input]:!px-4',
    leading: '!pl-3.5 pointer-events-none flex items-center',
    leadingIcon: `${SIZE_TOKENS.icon.md} ${COLOR_TOKENS.text.primaryMuted} shrink-0`,
  },
  variants: {
    variant: {
      glass: {
        base: `${INPUT_APPEARANCES.glass} ${RADIUS_TOKENS.md} ${INPUT_SIZES.md} [&_input]:!px-4`,
      },
      glassError: {
        base: `${INPUT_APPEARANCES.error} ${RADIUS_TOKENS.md} ${INPUT_SIZES.md} [&_input]:!px-4`,
      },
      search: {
        base: `${INPUT_APPEARANCES.glass} ${RADIUS_TOKENS.full} ${INPUT_SIZES.sm} !pl-10 !pr-4 [&_input]:!pl-10 [&_input]:!pr-4 w-full`,
      },
    },
  },
} as const;

export const OTP_INPUT_CONFIG = {
  desktop: `${SIZE_TOKENS.controlHeight.otpDesktop} text-center ${TEXT_SIZES['2xl']} ${FONT_WEIGHTS.bold} ${RADIUS_TOKENS.md} ${INPUT_APPEARANCES.glass} outline-none ${INTERACTION_TOKENS.all} caret-btn-primary disabled:${OPACITY_TOKENS.muted}`,
  mobile: `${SIZE_TOKENS.controlHeight.otpMobile} text-center ${TEXT_SIZES.xl} ${FONT_WEIGHTS.bold} ${RADIUS_TOKENS.md} ${INPUT_APPEARANCES.glass} outline-none ${INTERACTION_TOKENS.all} caret-btn-primary disabled:${OPACITY_TOKENS.muted}`,
  error: BORDER_TOKENS.ringError,
  success: BORDER_TOKENS.ringSuccess,
} as const;

// 4. TEXTAREA CONFIG
export const TEXTAREA_CONFIG = {
  slots: {
    root: 'w-full',
  },
  variants: {
    variant: {
      glass: {
        base: `${INPUT_APPEARANCES.glass} ${RADIUS_TOKENS.md} ${INPUT_SIZES.md} !${SPACING_TOKENS.px.md}`,
      },
      glassError: {
        base: `${INPUT_APPEARANCES.error} ${RADIUS_TOKENS.md} ${INPUT_SIZES.md} !${SPACING_TOKENS.px.md}`,
      },
    },
  },
} as const;

// 5. FORM FIELD CONFIG
export const FORM_FIELD_CONFIG = {
  slots: {
    root: 'w-full max-w-full min-w-0',
    label: `${TEXT_SIZES.sm} ${FONT_WEIGHTS.medium} ${COLOR_TOKENS.text.primary} ${SPACING_TOKENS.mb.xs} block`,
    error: `${COLOR_TOKENS.status.error} ${TEXT_SIZES.xs} text-left ${FONT_WEIGHTS.normal} break-words whitespace-normal w-full`,
  },
} as const;
