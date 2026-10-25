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
        base: `${INPUT_APPEARANCES.glass} ${RADIUS_TOKENS.full} ${INPUT_SIZES.sm} [&_input]:!pl-10 [&_input]:!pr-4 w-full`,
      },
    },
  },
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
    label: `${TEXT_SIZES.sm} ${FONT_WEIGHTS.medium} ${COLOR_TOKENS.text.primary} ${SPACING_TOKENS.mb.xs} block`,
    error: `${COLOR_TOKENS.status.error} ${TEXT_SIZES.sm} text-left ${FONT_WEIGHTS.normal}`,
  },
} as const;
