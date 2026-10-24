// frontend/app/utils/styles/forms.ts

// CHECKBOX
export const CHECKBOX_CONFIG = {
  slots: {
    root: `flex items-center ${SPACING_TOKENS.gap.sm}`,
  },
  variants: {
    variant: {
      glass: {
        root: `text-content-primary/70 hover:${COLOR_TOKENS.text.primary} ${INTERACTION_TOKENS.base} bg-content-primary/5 hover:bg-content-primary/10 ${RADIUS_TOKENS.full} ${SPACING_TOKENS.p.sm}`,
      },
    },
  },
} as const;

// SHARED INPUT & TEXTAREA APPEARANCES
export const INPUT_SIZES = {
  sm: 'h-10',
  md: 'h-11',
} as const;

export const INPUT_APPEARANCES = {
  glass: `${COLOR_TOKENS.input.base} ${BORDER_TOKENS.ringInput} ${SHADOW_TOKENS.none} transition-colors`,
  error: `${COLOR_TOKENS.input.error} ${BORDER_TOKENS.ringError} placeholder:text-status-error-border ${SHADOW_TOKENS.none} transition-colors`,
} as const;

// INPUT CONFIG
export const INPUT_CONFIG = {
  slots: {
    root: 'w-full',
    base: `w-full [&_input]:!${SPACING_TOKENS.px.md}`,
  },
  variants: {
    variant: {
      glass: {
        base: `${INPUT_APPEARANCES.glass} ${RADIUS_TOKENS.md} ${INPUT_SIZES.md} [&_input]:!${SPACING_TOKENS.px.md}`,
      },
      glassError: {
        base: `${INPUT_APPEARANCES.error} ${RADIUS_TOKENS.md} ${INPUT_SIZES.md} [&_input]:!${SPACING_TOKENS.px.md}`,
      },
      search: {
        base: `${INPUT_APPEARANCES.glass} ${RADIUS_TOKENS.full} ${INPUT_SIZES.sm} !pl-8 [&_input]:!${SPACING_TOKENS.px.md} w-full`,
      },
    },
  },
} as const;

// TEXTAREA CONFIG
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

// FORM FIELD CONFIG (Labels & Field Errors)
export const FORM_FIELD_CONFIG = {
  slots: {
    label: `text-sm font-medium ${COLOR_TOKENS.text.primary} ${SPACING_TOKENS.mb.xs} block`,
    error: `${COLOR_TOKENS.status.error} text-sm text-left font-small`,
  },
} as const;