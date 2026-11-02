<!-- frontend/app/components/files/ViewSwitcher.vue -->
<template>
  <div
    :class="[
      'flex items-center',
      GLASS_TOKENS.medium,
      RADIUS_TOKENS.full,
      BORDER_TOKENS.ringSubtle,
      SPACING_TOKENS.p.xs,
    ]"
  >
    <BaseButton
      icon="i-heroicons-squares-2x2"
      :variant="model === 'grid' ? 'glassIconButtonHighlight' : 'ghost'"
      :class="[SIZE_TOKENS.controlHeight.xs, '!w-8', RADIUS_TOKENS.full, SPACING_TOKENS.p.xs]"
      :tooltip="UI_TEXT.files.gridView"
      @click="model = 'grid'"
    />

    <BaseButton
      icon="i-heroicons-bars-4"
      :variant="model === 'list' ? 'glassIconButtonHighlight' : 'ghost'"
      :class="[SIZE_TOKENS.controlHeight.xs, '!w-8', RADIUS_TOKENS.full, SPACING_TOKENS.p.xs]"
      :tooltip="UI_TEXT.files.listView"
      @click="model = 'list'"
    />
  </div>
</template>

<script setup lang="ts">
export type ViewMode = 'grid' | 'list';

const model = defineModel<ViewMode>({ default: 'grid' });
</script>
