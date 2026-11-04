<!-- frontend/app/components/files/ViewSwitcher.vue -->
<template>
  <UTooltip :text="tooltipText">
    <div
      role="button"
      tabindex="0"
      :aria-label="tooltipText"
      :class="[
        'flex items-center select-none outline-none',
        INTERACTION_TOKENS.base,
        GLASS_TOKENS.medium,
        RADIUS_TOKENS.full,
        BORDER_TOKENS.ringSubtle,
        SPACING_TOKENS.p.xs,
      ]"
      @click="toggleMode"
      @keydown.enter.prevent="toggleMode"
      @keydown.space.prevent="toggleMode"
    >
      <BaseButton
        icon="i-heroicons-squares-2x2"
        :variant="model === 'grid' ? 'glassIconButtonHighlight' : 'ghost'"
        :class="[
          SIZE_TOKENS.controlHeight.xs,
          '!w-8',
          RADIUS_TOKENS.full,
          SPACING_TOKENS.p.xs,
          'pointer-events-none',
        ]"
        tabindex="-1"
      />

      <BaseButton
        icon="i-heroicons-bars-4"
        :variant="model === 'list' ? 'glassIconButtonHighlight' : 'ghost'"
        :class="[
          SIZE_TOKENS.controlHeight.xs,
          '!w-8',
          RADIUS_TOKENS.full,
          SPACING_TOKENS.p.xs,
          'pointer-events-none',
        ]"
        tabindex="-1"
      />
    </div>
  </UTooltip>
</template>

<script setup lang="ts">
import { computed } from 'vue';

export type ViewMode = 'grid' | 'list';

const model = defineModel<ViewMode>({ default: 'grid' });

const toggleMode = () => {
  model.value = model.value === 'grid' ? 'list' : 'grid';
};

const tooltipText = computed(() =>
  model.value === 'grid' ? UI_TEXT.files.listView : UI_TEXT.files.gridView,
);
</script>
