// frontend/app/composables/useScreenSize.ts
import { useMediaQuery } from '@vueuse/core';

// a composable for detecting the current screen size and checking if it matches the mobile layout
export const useScreenSize = () => {
  // checks if the screen width is 768px or less (Tailwind's md breakpoint)
  // [return value]: boolean
  const isMobile = useMediaQuery('(max-width: 768px)');

  return {
    isMobile,
  };
};
