import { watch } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import {
  PRESET_BACKGROUND_OPTIONS,
  type BackgroundType,
  type ThemePaletteId,
} from '~/utils/constants/theme.constants';
import {
  useUpdateThemePreferencesMutation,
  useUploadBackgroundMutation,
} from '~/queries/user.mutation';
import type { UpdateThemePreferencesDto, UserOutDto } from '~/types/user.type';

interface StoredThemePreferences {
  theme_palette: ThemePaletteId;
  background_type: BackgroundType;
  background_value: string | null;
}

const DEFAULT_PREFERENCES: StoredThemePreferences = {
  theme_palette: 'default',
  background_type: 'system',
  background_value: null,
};

let pendingMutations = 0;

export const useTheme = () => {
  const preferences = useLocalStorage<StoredThemePreferences>(
    'roamly_theme_preferences',
    DEFAULT_PREFERENCES,
  );

  const { isAuthenticated } = useAuth();
  const updatePreferencesMutation = useUpdateThemePreferencesMutation();
  const uploadBackgroundMutation = useUploadBackgroundMutation();

  const applyToDom = (prefs: StoredThemePreferences) => {
    if (!import.meta.client) return;

    document.documentElement.setAttribute('data-theme', prefs.theme_palette || 'default');

    let bgCssValue = 'none';
    if (prefs.background_type === 'preset' && prefs.background_value) {
      const preset = PRESET_BACKGROUND_OPTIONS.find((b) => b.id === prefs.background_value);
      if (preset) bgCssValue = `url('${preset.url}')`;
    } else if (prefs.background_type === 'custom' && prefs.background_value) {
      bgCssValue = `url('${prefs.background_value}')`;
    }

    document.documentElement.style.setProperty('--app-bg-image', bgCssValue);
  };

  watch(preferences, (newPrefs) => applyToDom(newPrefs), { deep: true, immediate: true });

  const syncFromUser = (user?: UserOutDto | null) => {
    if (!user || !user.theme_palette || pendingMutations > 0) return;
    preferences.value = {
      theme_palette: user.theme_palette,
      background_type: user.background_type || 'system',
      background_value: user.background_value ?? null,
    };
  };

  const persistPreferences = async (payload: UpdateThemePreferencesDto) => {
    if (!isAuthenticated.value) return;
    pendingMutations++;
    try {
      await updatePreferencesMutation.mutateAsync(payload);
    } catch (err) {
      console.error('Failed to save theme preferences:', err);
    } finally {
      pendingMutations = Math.max(0, pendingMutations - 1);
    }
  };

  const setPalette = (palette: ThemePaletteId) => {
    preferences.value = { ...preferences.value, theme_palette: palette };
    void persistPreferences({ theme_palette: palette });
  };

  const setSystemBackground = () => {
    preferences.value = {
      ...preferences.value,
      background_type: 'system',
      background_value: null,
    };
    void persistPreferences({
      background_type: 'system',
      background_value: null,
    });
  };

  const setPresetBackground = (presetId: string) => {
    preferences.value = {
      ...preferences.value,
      background_type: 'preset',
      background_value: presetId,
    };
    void persistPreferences({
      background_type: 'preset',
      background_value: presetId,
    });
  };

  const clearBackground = () => {
    preferences.value = {
      ...preferences.value,
      background_type: 'none',
      background_value: null,
    };
    void persistPreferences({
      background_type: 'none',
      background_value: null,
    });
  };

  const uploadCustomBackground = async (file: File) => {
    pendingMutations++;
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
      pendingMutations = Math.max(0, pendingMutations - 1);
    }
  };

  return {
    preferences,
    syncFromUser,
    setPalette,
    setSystemBackground,
    setPresetBackground,
    clearBackground,
    uploadCustomBackground,
    isUploadingBackground: uploadBackgroundMutation.isLoading,
    isSavingPreferences: updatePreferencesMutation.isLoading,
  };
};
