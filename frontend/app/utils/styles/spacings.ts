// frontend/app/utils/spacing.tokens.ts

export const SPACING_TOKENS = {
  // Base spacings
  gap: {
    xs: 'gap-1', // 4px
    sm: 'gap-2', // 8px
    md: 'gap-4', // 16px
    lg: 'gap-6', // 24px
    xl: 'gap-8', // 32px
  },
  p: {
    xs: 'p-1', // 4px
    sm: 'p-2', // 8px
    md: 'p-4', // 16px
    lg: 'p-6', // 24px
    xl: 'p-8', // 32px
  },
  pt: {
    xs: 'pt-1', // 4px
    sm: 'pt-2', // 8px
    md: 'pt-4', // 16px
    lg: 'pt-6', // 24px
    xl: 'pt-8', // 32px
  },
  px: {
    xs: 'px-1',
    sm: 'px-2',
    md: 'px-4',
    lg: 'px-6',
    xl: 'px-8',
  },
  py: {
    xs: 'py-1',
    sm: 'py-2',
    md: 'py-4',
    lg: 'py-6',
    xl: 'py-8',
  },
  m: {
    xs: 'm-1',
    sm: 'm-2',
    md: 'm-4',
    lg: 'm-6',
    xl: 'm-8',
  },
  my: {
    xs: 'my-1',
    sm: 'my-2',
    md: 'my-4',
    lg: 'my-6',
    xl: 'my-8',
  },
  mt: {
    xs: 'mt-1',
    sm: 'mt-2',
    md: 'mt-4',
    lg: 'mt-6',
    xl: 'mt-8',
  },
  mb: {
    xs: 'mb-1', // 4px
    sm: 'mb-2', // 8px
    md: 'mb-4', // 16px
    lg: 'mb-6', // 24px
    xl: 'mb-8', // 32px
  },

  // Mobile and desktop spacings
  mobile: {
    screenPadding: 'p-4',
    cardPadding: 'p-4',
    gridGap: 'gap-4',
    listGap: 'gap-2',
  },
  desktop: {
    screenPadding: 'p-8',
    cardPadding: 'p-6',
    gridGap: 'gap-6',
    listGap: 'gap-4',
  },

  // Responsive shared spacings
  responsive: {
    screenPadding: 'px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8',
    containerGap: 'gap-4 md:gap-6 lg:gap-8',
    cardPadding: 'p-4 md:p-6',
    gridGap: 'gap-4 md:gap-6',
    listGap: 'gap-2 md:gap-4',
  },
} as const;
