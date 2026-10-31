<!-- frontend/app/components/files/ViewSwitcher.vue -->
<template>
  <div
    :class="[
      'flex items-center bg-surface-500/50 backdrop-blur-md rounded-full ring-1 ring-dark-text/10',
      SPACING_TOKENS.p.xs,
    ]"
  >
    <BaseButton
      icon="i-heroicons-squares-2x2"
      :variant="model === 'grid' ? 'glassIconButtonHighlight' : 'ghost'"
      :class="['w-8! h-8! rounded-full', SPACING_TOKENS.p.xs]"
      :tooltip="UI_TEXT.files.gridView"
      @click="model = 'grid'"
    />

    <BaseButton
      icon="i-heroicons-bars-4"
      :variant="model === 'list' ? 'glassIconButtonHighlight' : 'ghost'"
      :class="['w-8! h-8! rounded-full', SPACING_TOKENS.p.xs]"
      :tooltip="UI_TEXT.files.listView"
      @click="model = 'list'"
    />
  </div>
</template>

<script setup lang="ts">
export type ViewMode = 'grid' | 'list';

const model = defineModel<ViewMode>({ default: 'grid' });
</script>
