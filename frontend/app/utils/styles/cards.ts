// frontend/app/utils/styles/cards.ts

// Reusable base appearances for cards
export const CARD_APPEARANCES = {
  glass: `${GLASS_TOKENS.default} ${RADIUS_TOKENS.xl} ${SHADOW_TOKENS.card} border-0 ${BORDER_TOKENS.ringCard} ${COLOR_TOKENS.text.primary}`,
  outlineGlass: `${GLASS_TOKENS.outline} ${RADIUS_TOKENS.xl} ${SHADOW_TOKENS.heavy} border-0 ${BORDER_TOKENS.ringInverseStrong} ${COLOR_TOKENS.text.inverse} transition-all duration-500 ease-in-out`,
} as const;

// Reusable body layouts for cards
export const CARD_BODY_LAYOUTS = {
  default: `${SPACING_TOKENS.responsive.cardPadding}`,
  centered: `flex flex-col items-center justify-center h-full text-center ${SPACING_TOKENS.responsive.cardPadding}`,
  column: `${SPACING_TOKENS.responsive.cardPadding} h-full flex flex-col`,
  flush: 'p-0 flex flex-col h-full',
} as const;

// Complete Nuxt UI Card configuration
export const CARD_CONFIG = {
  slots: {
    root: 'w-full',
    body: CARD_BODY_LAYOUTS.default,
  },
  variants: {
    variant: {
      glass: {
        root: `${CARD_APPEARANCES.glass} max-w-md mx-auto w-full`,
      },
      interactiveGlass: {
        root: `${CARD_APPEARANCES.glass} ${INTERACTION_TOKENS.cardLift} overflow-hidden min-w-0`,
        body: `${CARD_BODY_LAYOUTS.centered} overflow-hidden`,
      },
      outlineGlass: {
        root: CARD_APPEARANCES.outlineGlass,
        body: CARD_BODY_LAYOUTS.column,
      },
      pointedGlass: {
        root: `${CARD_APPEARANCES.glass} ${INTERACTION_TOKENS.lift}`,
        body: CARD_BODY_LAYOUTS.centered,
      },
      documentGlass: {
        root: `${CARD_APPEARANCES.glass} overflow-hidden ${INTERACTION_TOKENS.cardLift}`,
        body: CARD_BODY_LAYOUTS.flush,
      },
    },
  },
} as const;