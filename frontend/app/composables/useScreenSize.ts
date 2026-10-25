// frontend/app/composables/useScreenSize.ts
import { useMediaQuery } from '@vueuse/core';

export const useScreenSize = () => {
  // Matches Tailwind CSS 'md' breakpoint (768px) to toggle mobile-specific UI layouts
  const isMobile = useMediaQuery('(max-width: 768px)');

  return {
    isMobile,
  };
};
