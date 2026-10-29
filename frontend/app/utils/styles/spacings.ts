// frontend/app/utils/styles/spacings.ts

export const SPACING_TOKENS = {
  // Base spacings
  gap: {
    xs: 'gap-1', // 4px
    sm: 'gap-2', // 8px
    md: 'gap-4', // 16px
    lg: 'gap-6', // 24px
    xl: 'gap-8', // 32px
    '2xl': 'gap-10', // 40px
  },
  p: {
    none: 'p-0',
    xs: 'p-1', // 4px
    sm: 'p-2', // 8px
    md: 'p-4', // 16px
    lg: 'p-6', // 24px
    xl: 'p-8', // 32px
  },
  pt: {
    xs: 'pt-1',
    sm: 'pt-2',
    md: 'pt-4',
    lg: 'pt-6',
    xl: 'pt-8',
  },
  pr: {
    xs: 'pr-1',
    sm: 'pr-2',
    md: 'pr-4',
  },
  pl: {
    md: 'pl-4',
    lg: 'pl-6',
    xl: 'pl-8',
  },
  px: {
    xs: 'px-1',
    sm: 'px-2',
    md: 'px-4',
    lg: 'px-6',
    xl: 'px-8',
    '2xl': 'px-10', // 40px (lg buttons)
    '3xl': 'px-12', // 48px (xl hero buttons)
  },
  py: {
    '2xs': 'py-0.5', // 2px (badges)
    xs: 'py-1',
    sm: 'py-2',
    md: 'py-4',
    lg: 'py-6',
    xl: 'py-8',
    '3xl': 'py-12',
  },
  pxImportant: {
    md: '!px-4',
    lg: '!px-6',
    xl: '!px-8',
    '2xl': '!px-10',
    '3xl': '!px-12',
  },
  pyImportant: {
    xs: '!py-1',
    sm: '!py-2',
    md: '!py-4',
  },
  plImportant: {
    xl: '!pl-8',
    '2xl': '!pl-10',
  },
  m: {
    xs: 'm-1',
    sm: 'm-2',
    md: 'm-4',
    lg: 'm-6',
    xl: 'm-8',
  },
  mx: {
    xs: 'mx-1',
    sm: 'mx-2',
    auto: 'mx-auto',
  },
  my: {
    xs: 'my-1',
    sm: 'my-2',
    md: 'my-4',
    lg: 'my-6',
    xl: 'my-8',
  },
  mt: {
    none: 'mt-0',
    xs: 'mt-1',
    sm: 'mt-2',
    md: 'mt-4',
    lg: 'mt-6',
    xl: 'mt-8',
  },
  mb: {
    xs: 'mb-1',
    sm: 'mb-2',
    md: 'mb-4',
    lg: 'mb-6',
    xl: 'mb-8',
  },
  ml: {
    xs: 'ml-1',
    sm: 'ml-2',
    md: 'ml-4',
    xl: 'ml-8',
  },
  mr: {
    sm: 'mr-2',
    md: 'mr-4',
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
