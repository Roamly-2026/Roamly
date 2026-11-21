// frontend/app/composables/useAppearance.ts
import { computed, watch } from 'vue';
import { onNuxtReady, useColorMode, useCookie, useHead } from '#imports';
import { useAuth } from '~/composables/useAuth';
import { useCurrentUserQuery } from '~/queries/user.query';
import { useUpdateAppearanceMutation } from '~/queries/user.mutation';

const TO_PREFERENCE = { LIGHT: 'light', DARK: 'dark', SYSTEM: 'system' } as const;
const FROM_PREFERENCE: Record<string, ColorMode> = {
  light: 'LIGHT',
  dark: 'DARK',
  system: 'SYSTEM',
};

/**
 * Applies the theme (data-theme on <html>, via cookie so SSR renders it without a flash)
 * and color mode (.dark via @nuxtjs/color-mode), and keeps them in sync with the user's profile.
 */
export const useAppearance = () => {
  const colorModeState = useColorMode();
  const { isAuthenticated } = useAuth();
  const { data: user } = useCurrentUserQuery();
  const { mutateAsync: saveAppearance } = useUpdateAppearanceMutation();

  const themeCookie = useCookie<string>('theme_key', {
    default: () => 'default',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });

  const themeKey = computed<ThemeKey>(() => resolveThemeKey(themeCookie.value));
  const colorMode = computed<ColorMode>(
    () => FROM_PREFERENCE[colorModeState.preference] ?? 'SYSTEM',
  );

  useHead({ htmlAttrs: { 'data-theme': themeKey } });

  // Server values win whenever the profile (re)loads: login, other device, account switch
  watch(
    user,
    (profile) => {
      if (!profile) return;
      themeCookie.value = resolveThemeKey(profile.theme_key);
      // color-mode resets preference from localStorage on app:mounted, so apply after that
      onNuxtReady(() => {
        colorModeState.preference = TO_PREFERENCE[profile.color_mode] ?? 'system';
      });
    },
    { immediate: true },
  );

  // Apply instantly; roll back if the save fails (the mutation already shows the error toast)
  const setTheme = (key: ThemeKey) => {
    const previous = themeCookie.value;
    themeCookie.value = key;
    if (isAuthenticated.value) {
      saveAppearance({ theme_key: key }).catch(() => (themeCookie.value = previous));
    }
  };

  const setColorMode = (mode: ColorMode) => {
    const previous = colorModeState.preference;
    colorModeState.preference = TO_PREFERENCE[mode];
    if (isAuthenticated.value) {
      saveAppearance({ color_mode: mode }).catch(() => (colorModeState.preference = previous));
    }
  };

  return { themeKey, colorMode, setTheme, setColorMode };
};
