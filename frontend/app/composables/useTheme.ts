// frontend/app/composables/useTheme.ts
import { computed, watch } from 'vue';
import { useQueryCache } from '@pinia/colada';
import { onNuxtReady, useColorMode, useCookie, useHead, useState } from '#imports';
import {
  PRESET_BACKGROUND_OPTIONS,
  type BackgroundType,
  type ColorMode,
  type ThemePaletteId,
} from '~/utils/constants/theme.constants';
import { useAuth } from '~/composables/useAuth';
import { useCurrentUserQuery } from '~/queries/user.query';
import {
  useUpdateThemePreferencesMutation,
  useUploadBackgroundMutation,
} from '~/queries/user.mutation';
import type { UserOutDto } from '~/types/user.type';

export interface ThemePreferences {
  theme_palette: ThemePaletteId;
  color_mode: ColorMode;
  background_type: BackgroundType;
  background_value: string | null;
}

type PreferenceKey = keyof ThemePreferences;
type PreferencePatch = Partial<ThemePreferences>;

const DEFAULT_PREFERENCES: ThemePreferences = {
  theme_palette: 'default',
  color_mode: 'SYSTEM',
  background_type: 'system',
  background_value: null,
};

const TO_COLOR_MODE_PREFERENCE = { LIGHT: 'light', DARK: 'dark', SYSTEM: 'system' } as const;

// The cookie (unlike localStorage) is readable during SSR, so the first render already has the
// right palette and background: no post-mount switch, no flicker.
const usePreferencesState = () => {
  const cookie = useCookie<ThemePreferences>('roamly_theme_preferences', {
    default: () => ({ ...DEFAULT_PREFERENCES }),
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });
  const preferences = useState<ThemePreferences>('theme-preferences', () => ({
    ...DEFAULT_PREFERENCES,
    ...cookie.value,
  }));

  return { cookie, preferences };
};

// Number of theme saves still in flight. While it is above zero the server profile is ignored,
// so a stale response can't overwrite a newer local choice.
const usePendingSaves = () => useState<number>('theme-pending-saves', () => 0);

const toBackgroundCss = (prefs: ThemePreferences): string => {
  if (prefs.background_type === 'preset' && prefs.background_value) {
    const preset = PRESET_BACKGROUND_OPTIONS.find((b) => b.id === prefs.background_value);
    if (preset) return `url('${preset.url}')`;
  } else if (prefs.background_type === 'custom' && prefs.background_value) {
    return `url('${prefs.background_value}')`;
  }

  return 'none';
};

/**
 * Applies the theme once for the whole app: data-theme and the background image on <html>,
 * the color mode (.dark via @nuxtjs/color-mode), and syncing from the user's profile.
 * Call it only from app.vue; components use useTheme().
 */
export const initTheme = () => {
  const { cookie, preferences } = usePreferencesState();
  const pendingSaves = usePendingSaves();
  const colorModeState = useColorMode();
  const { data: user } = useCurrentUserQuery();

  useHead({
    htmlAttrs: {
      'data-theme': computed(() => preferences.value.theme_palette),
      style: computed(() => `--app-bg-image: ${toBackgroundCss(preferences.value)}`),
    },
  });

  watch(
    preferences,
    (prefs) => {
      cookie.value = { ...prefs };
    },
    { deep: true },
  );

  // color-mode restores its own stored preference on app:mounted, so apply ours after that
  onNuxtReady(() => {
    watch(
      () => preferences.value.color_mode,
      (mode) => {
        colorModeState.preference = TO_COLOR_MODE_PREFERENCE[mode] ?? 'system';
      },
      { immediate: true },
    );
  });

  // Server values win whenever the profile (re)loads: login, another device, account switch
  watch(
    user,
    (profile) => {
      if (!profile?.theme_palette || pendingSaves.value > 0) return;

      preferences.value = {
        theme_palette: profile.theme_palette,
        color_mode: profile.color_mode ?? DEFAULT_PREFERENCES.color_mode,
        background_type: profile.background_type ?? DEFAULT_PREFERENCES.background_type,
        background_value: profile.background_value ?? null,
      };
    },
    { immediate: true },
  );
};

export const useTheme = () => {
  const { preferences } = usePreferencesState();
  const pendingSaves = usePendingSaves();
  const queryCache = useQueryCache();
  const { isAuthenticated } = useAuth();
  const updatePreferencesMutation = useUpdateThemePreferencesMutation();
  const uploadBackgroundMutation = useUploadBackgroundMutation();

  // When the last save settles, mirror the local state into the cached profile instead of
  // refetching (a refetch flips isLoading and makes pages flash)
  const settleSave = () => {
    pendingSaves.value = Math.max(0, pendingSaves.value - 1);
    if (pendingSaves.value > 0) return;

    queryCache.setQueriesData<UserOutDto | undefined>({ key: ['users', 'current'] }, (cached) =>
      cached ? { ...cached, ...preferences.value } : cached,
    );
  };

  // Apply instantly, save in the background, roll back if the save fails
  // (the mutation already shows the error toast)
  const applyAndPersist = (patch: PreferencePatch) => {
    const keys = Object.keys(patch) as PreferenceKey[];
    const previous = Object.fromEntries(
      keys.map((key) => [key, preferences.value[key]]),
    ) as PreferencePatch;

    preferences.value = { ...preferences.value, ...patch };
    if (!isAuthenticated.value) return;

    pendingSaves.value++;
    updatePreferencesMutation
      .mutateAsync(patch)
      .catch(() => {
        // Only roll back fields the user hasn't changed again since
        const untouched = keys.every((key) => preferences.value[key] === patch[key]);
        if (untouched) preferences.value = { ...preferences.value, ...previous };
      })
      .finally(settleSave);
  };

  const setPalette = (palette: ThemePaletteId) => applyAndPersist({ theme_palette: palette });

  const setColorMode = (mode: ColorMode) => applyAndPersist({ color_mode: mode });

  const setSystemBackground = () =>
    applyAndPersist({ background_type: 'system', background_value: null });

  const setPresetBackground = (presetId: string) =>
    applyAndPersist({ background_type: 'preset', background_value: presetId });

  const clearBackground = () =>
    applyAndPersist({ background_type: 'none', background_value: null });

  const uploadCustomBackground = async (file: File) => {
    pendingSaves.value++;
    try {
      const response = await uploadBackgroundMutation.mutateAsync(file);
      const updated = response?.data;
      if (updated?.background_value) {
        preferences.value = {
          ...preferences.value,
          background_type: 'custom',
          background_value: updated.background_value,
        };
      }
    } finally {
      settleSave();
    }
  };

  return {
    preferences: computed(() => preferences.value),
    setPalette,
    setColorMode,
    setSystemBackground,
    setPresetBackground,
    clearBackground,
    uploadCustomBackground,
    isUploadingBackground: uploadBackgroundMutation.isLoading,
    isSavingPreferences: updatePreferencesMutation.isLoading,
  };
};
