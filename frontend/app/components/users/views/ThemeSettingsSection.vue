<!-- frontend/app/components/users/ThemeSettingsSection.vue -->
<template>
  <div :class="LAYOUT_CONFIG.sectionWrapper">
    <h2 :class="TYPOGRAPHY_CONFIG.sectionTitleTransparent">Appearance</h2>

    <div :class="['flex flex-col', SPACING_TOKENS.gap.lg]">
      <!-- COLOR PALETTE SELECTOR -->
      <BaseCard>
        <div :class="['flex flex-col', SPACING_TOKENS.gap.md]">
          <div>
            <h3 :class="TYPOGRAPHY_CONFIG.cardTitle">Color Palette</h3>
            <p :class="TYPOGRAPHY_CONFIG.bodySmMuted">
              Choose a theme palette. Changes apply immediately and sync across your devices.
            </p>
          </div>

          <div :class="['grid grid-cols-2 md:grid-cols-4', SPACING_TOKENS.gap.md]">
            <button
              v-for="palette in THEME_PALETTE_OPTIONS"
              :key="palette.id"
              type="button"
              :class="[
                'relative flex flex-col items-start text-left cursor-pointer transition-all',
                SPACING_TOKENS.p.md,
                SPACING_TOKENS.gap.sm,
                RADIUS_TOKENS.lg,
                GLASS_TOKENS.subtle,
                preferences.theme_palette === palette.id
                  ? 'ring-2 ring-btn-primary bg-surface-card'
                  : 'ring-1 ring-line-default hover:bg-surface-card-hover',
              ]"
              @click="setPalette(palette.id)"
            >
              <div class="flex items-center justify-between w-full">
                <span :class="TYPOGRAPHY_CONFIG.cardTitleSm">{{ palette.label }}</span>
                <UIcon
                  v-if="preferences.theme_palette === palette.id"
                  name="i-heroicons-check-circle-solid"
                  :class="TYPOGRAPHY_CONFIG.iconBrandMd"
                />
              </div>

              <!-- Color Swatches -->
              <div :class="['flex items-center w-full', SPACING_TOKENS.gap.xs]">
                <span
                  v-for="(color, idx) in palette.colors"
                  :key="idx"
                  class="h-6 flex-1 rounded-md border border-black/10 shadow-xs"
                  :style="{ backgroundColor: color }"
                />
              </div>
            </button>
          </div>
        </div>
      </BaseCard>

      <!-- BACKGROUND IMAGE SELECTOR -->
      <BaseCard>
        <div :class="['flex flex-col', SPACING_TOKENS.gap.md]">
          <div :class="LAYOUT_CONFIG.flexBetween">
            <div>
              <h3 :class="TYPOGRAPHY_CONFIG.cardTitle">Background Image</h3>
              <p :class="TYPOGRAPHY_CONFIG.bodySmMuted">
                Select a preset background or upload your own custom image (max 10MB).
              </p>
            </div>

            <div>
              <input
                ref="fileInputRef"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                class="hidden"
                @change="handleFileSelected"
              />
              <BaseButton
                icon="i-heroicons-arrow-up-tray"
                label="Upload Custom"
                variant="actionOkButton"
                :loading="isUploadingBackground"
                @click="triggerFileInput"
              />
            </div>
          </div>

          <div :class="['grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5', SPACING_TOKENS.gap.md]">
            <!-- SYSTEM DEFAULT OPTION -->
            <button
              type="button"
              :class="[
                'group relative aspect-video cursor-pointer overflow-hidden transition-all',
                RADIUS_TOKENS.md,
                preferences.background_type === 'system'
                  ? 'ring-2 ring-btn-primary'
                  : 'ring-1 ring-line-default hover:ring-btn-primary/60',
              ]"
              @click="setSystemBackground()"
            >
              <img
                src="/groups/groups-background.jpg"
                alt="Default background"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div
                class="absolute inset-x-0 bottom-0 bg-black/55 px-2 py-1 flex items-center justify-between"
              >
                <span class="text-xs font-medium text-white truncate">Default</span>
                <UIcon
                  v-if="preferences.background_type === 'system'"
                  name="i-heroicons-check-circle-solid"
                  class="w-4 h-4 text-white shrink-0"
                />
              </div>
            </button>

            <!-- NONE OPTION -->
            <button
              type="button"
              :class="[
                'relative aspect-video flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all',
                RADIUS_TOKENS.md,
                GLASS_TOKENS.subtle,
                preferences.background_type === 'none'
                  ? 'ring-2 ring-btn-primary'
                  : 'ring-1 ring-line-default hover:ring-btn-primary/60',
              ]"
              @click="clearBackground()"
            >
              <UIcon name="i-heroicons-no-symbol" :class="TYPOGRAPHY_CONFIG.iconMutedSm" />
              <span :class="[TYPOGRAPHY_CONFIG.captionMuted, SPACING_TOKENS.mt.xs]">None</span>
            </button>

            <!-- PRESET BACKGROUNDS -->
            <button
              v-for="bg in PRESET_BACKGROUND_OPTIONS"
              :key="bg.id"
              type="button"
              :class="[
                'group relative aspect-video cursor-pointer overflow-hidden transition-all',
                RADIUS_TOKENS.md,
                preferences.background_type === 'preset' && preferences.background_value === bg.id
                  ? 'ring-2 ring-btn-primary'
                  : 'ring-1 ring-line-default hover:ring-btn-primary/60',
              ]"
              @click="setPresetBackground(bg.id)"
            >
              <img
                :src="bg.url"
                :alt="bg.label"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div
                class="absolute inset-x-0 bottom-0 bg-black/55 px-2 py-1 flex items-center justify-between"
              >
                <span class="text-xs font-medium text-white truncate">{{ bg.label }}</span>
                <UIcon
                  v-if="
                    preferences.background_type === 'preset' &&
                    preferences.background_value === bg.id
                  "
                  name="i-heroicons-check-circle-solid"
                  class="w-4 h-4 text-white shrink-0"
                />
              </div>
            </button>

            <!-- ACTIVE CUSTOM BACKGROUND PREVIEW -->
            <div
              v-if="preferences.background_type === 'custom' && preferences.background_value"
              :class="[
                'relative aspect-video overflow-hidden ring-2 ring-btn-primary',
                RADIUS_TOKENS.md,
              ]"
            >
              <img
                :src="preferences.background_value"
                alt="Custom background"
                class="w-full h-full object-cover"
              />
              <div
                class="absolute inset-x-0 bottom-0 bg-black/55 px-2 py-1 flex items-center justify-between"
              >
                <span class="text-xs font-medium text-white truncate">Custom</span>
                <UIcon name="i-heroicons-check-circle-solid" class="w-4 h-4 text-white shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from '#imports';
import {
  THEME_PALETTE_OPTIONS,
  PRESET_BACKGROUND_OPTIONS,
} from '~/utils/constants/theme.constants';
import { getErrorMessage } from '~/utils/error.utils';
import { useTheme } from '~/composables/useTheme';

const {
  preferences,
  setPalette,
  setSystemBackground,
  setPresetBackground,
  clearBackground,
  uploadCustomBackground,
  isUploadingBackground,
} = useTheme();

const toast = useToast();
const fileInputRef = ref<HTMLInputElement | null>(null);

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const handleFileSelected = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  try {
    await uploadCustomBackground(file);
    toast.add({
      title: UI_TEXT.common.success,
      description: 'Background image updated!',
      class: 'toast-success',
    });
  } catch (err) {
    toast.add({
      title: UI_TEXT.common.error,
      description: getErrorMessage(err),
      class: 'toast-error',
    });
  } finally {
    target.value = '';
  }
};
</script>
