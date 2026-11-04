<!-- frontend/app/components/files/FilesListHeader.vue -->
<template>
  <div
    :class="[
      'hidden md:grid grid-cols-12 items-center w-full select-none',
      TEXT_SIZES.xs,
      FONT_WEIGHTS.bold,
      COLOR_TOKENS.text.inverse,
      TEXT_TRACKING.wider,
      'uppercase',
      GLASS_TOKENS.subtle,
      RADIUS_TOKENS.lg,
      BORDER_TOKENS.dividerBottom,
      SPACING_TOKENS.gap.md,
      SPACING_TOKENS.px.lg,
      SPACING_TOKENS.py.sm,
      SPACING_TOKENS.mb.xs,
    ]"
  >
    <!-- File Name column (4) -->
    <div
      :class="[
        'col-span-4 flex items-center',
        INTERACTION_TOKENS.base,
        OPACITY_TOKENS.soft,
        `hover:${OPACITY_TOKENS.full}`,
      ]"
      @click="emit('sort', 'file_name')"
    >
      <span>{{ UI_TEXT.files.fileName }}</span>
      <UIcon
        v-if="sortKey === 'file_name'"
        :name="sortOrder === 'asc' ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
        :class="[TYPOGRAPHY_CONFIG.iconBrandSm, SPACING_TOKENS.m.xs]"
      />
    </div>

    <!-- Type column (2) -->
    <div
      :class="[
        'col-span-2 flex items-center',
        INTERACTION_TOKENS.base,
        OPACITY_TOKENS.soft,
        `hover:${OPACITY_TOKENS.full}`,
      ]"
      @click="emit('sort', 'type')"
    >
      <span>{{ UI_TEXT.media.type || 'Type' }}</span>
      <UIcon
        v-if="sortKey === 'type'"
        :name="sortOrder === 'asc' ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
        :class="[TYPOGRAPHY_CONFIG.iconBrandSm, SPACING_TOKENS.m.xs]"
      />
    </div>

    <!-- Size column (2) -->
    <div
      :class="[
        'col-span-2 flex items-center',
        INTERACTION_TOKENS.base,
        OPACITY_TOKENS.soft,
        `hover:${OPACITY_TOKENS.full}`,
      ]"
      @click="emit('sort', 'file_size')"
    >
      <span>{{ UI_TEXT.media.size || 'Size' }}</span>
      <UIcon
        v-if="sortKey === 'file_size'"
        :name="sortOrder === 'asc' ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
        :class="[TYPOGRAPHY_CONFIG.iconBrandSm, SPACING_TOKENS.m.xs]"
      />
    </div>

    <!-- Uploaded by column (2) -->
    <div :class="['col-span-2 flex items-center', OPACITY_TOKENS.soft]">
      <span>{{ UI_TEXT.common.uploadedBy || 'Uploaded by' }}</span>
    </div>

    <!-- Date + Actions column (2) -->
    <div
      :class="[
        'col-span-2 flex items-center justify-between',
        INTERACTION_TOKENS.base,
        OPACITY_TOKENS.soft,
        `hover:${OPACITY_TOKENS.full}`,
      ]"
      @click="emit('sort', 'created_at')"
    >
      <div class="flex items-center">
        <span>{{ UI_TEXT.common.uploadedAt || 'Date' }}</span>
        <UIcon
          v-if="sortKey === 'created_at'"
          :name="sortOrder === 'asc' ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
          :class="[TYPOGRAPHY_CONFIG.iconBrandSm, SPACING_TOKENS.m.xs]"
        />
      </div>
      <span class="text-right cursor-default" @click.stop>
        {{ UI_TEXT.files.actions }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
export type SortKey = 'file_name' | 'type' | 'file_size' | 'created_at';
export type SortOrder = 'asc' | 'desc';

defineProps<{
  sortKey: SortKey;
  sortOrder: SortOrder;
}>();

const emit = defineEmits<{
  sort: [key: SortKey];
}>();
</script>
