<!-- frontend/app/components/users/AppearanceSettings.vue -->
<template>
  <div :class="LAYOUT_CONFIG.sectionWrapper">
    <h2 :class="TYPOGRAPHY_CONFIG.sectionTitleTransparent">{{ UI_TEXT.appearance.heading }}</h2>

    <div
      :class="`${CARD_APPEARANCES.glass} ${SPACING_TOKENS.responsive.cardPadding} flex flex-col ${SPACING_TOKENS.gap.lg}`"
    >
      <div :class="rowClass">
        <span :class="labelClass">{{ UI_TEXT.appearance.colorModeLabel }}</span>
        <div :class="optionsClass">
          <BaseButton
            v-for="mode in MODES"
            :key="mode.value"
            :icon="mode.icon"
            :label="UI_TEXT.appearance.modes[mode.value]"
            :variant="
              colorMode === mode.value ? 'smallPrimaryActionButton' : 'smallHollowActionButton'
            "
            :aria-pressed="colorMode === mode.value"
            @click="setColorMode(mode.value)"
          />
        </div>
      </div>

      <div :class="rowClass">
        <span :class="labelClass">{{ UI_TEXT.appearance.themeLabel }}</span>
        <div :class="optionsClass">
          <BaseButton
            v-for="key in THEME_KEYS"
            :key="key"
            :label="UI_TEXT.appearance.themes[key]"
            :variant="themeKey === key ? 'smallPrimaryActionButton' : 'smallHollowActionButton'"
            :aria-pressed="themeKey === key"
            @click="setTheme(key)"
          >
            <template #leading>
              <!-- data-theme re-scopes the raw --theme-* var (not the @theme alias, which resolves on :root) -->
              <span
                :data-theme="key"
                :class="`w-3 h-3 rounded-full bg-(--theme-btn-primary-bg) ring-1 ring-line-strong shrink-0 ${SPACING_TOKENS.mr.sm}`"
              />
            </template>
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppearance } from '~/composables/useAppearance';

const { themeKey, colorMode, setTheme, setColorMode } = useAppearance();

const MODES = [
  { value: 'LIGHT', icon: 'i-heroicons-sun' },
  { value: 'DARK', icon: 'i-heroicons-moon' },
  { value: 'SYSTEM', icon: 'i-heroicons-computer-desktop' },
] as const satisfies readonly { value: ColorMode; icon: string }[];

const rowClass = `flex flex-col sm:flex-row sm:items-center ${SPACING_TOKENS.gap.md}`;
const labelClass = `${TEXT_SIZES.sm} ${FONT_WEIGHTS.semibold} sm:w-32 shrink-0`;
const optionsClass = `flex flex-wrap ${SPACING_TOKENS.gap.sm}`;
</script>
