<!-- frontend/app/components/files/FilesListHeader.vue -->
<template>
  <div
    :class="[
      'hidden md:grid grid-cols-12 items-center w-full text-xs font-bold text-dark-text/70 uppercase tracking-wider select-none border-b border-dark-text/10',
      SPACING_TOKENS.gap.md,
      SPACING_TOKENS.px.lg,
      SPACING_TOKENS.py.sm,
    ]"
  >
    <!-- File Name column (4) -->
    <div
      class="col-span-4 flex items-center cursor-pointer hover:text-dark-text transition-colors"
      @click="emit('sort', 'file_name')"
    >
      <span>{{ UI_TEXT.files.fileName }}</span>
      <UIcon
        v-if="sortKey === 'file_name'"
        :name="sortOrder === 'asc' ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
        :class="['w-4 h-4 text-brand-500', SPACING_TOKENS.m.xs]"
      />
    </div>

    <!-- Type column (2) -->
    <div
      class="col-span-2 flex items-center cursor-pointer hover:text-dark-text transition-colors"
      @click="emit('sort', 'type')"
    >
      <span>{{ UI_TEXT.media.type || 'Type' }}</span>
      <UIcon
        v-if="sortKey === 'type'"
        :name="sortOrder === 'asc' ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
        :class="['w-4 h-4 text-brand-500', SPACING_TOKENS.m.xs]"
      />
    </div>

    <!-- Size column (2) -->
    <div
      class="col-span-2 flex items-center cursor-pointer hover:text-dark-text transition-colors"
      @click="emit('sort', 'file_size')"
    >
      <span>{{ UI_TEXT.media.size || 'Size' }}</span>
      <UIcon
        v-if="sortKey === 'file_size'"
        :name="sortOrder === 'asc' ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
        :class="['w-4 h-4 text-brand-500', SPACING_TOKENS.m.xs]"
      />
    </div>

    <!-- Uploaded by column (2) -->
    <div class="col-span-2 flex items-center">
      <span>{{ UI_TEXT.common.uploadedBy || 'Uploaded by' }}</span>
    </div>

    <!-- Date + Actions column (2) -->
    <div
      class="col-span-2 flex items-center justify-between cursor-pointer hover:text-dark-text transition-colors"
      @click="emit('sort', 'created_at')"
    >
      <div class="flex items-center">
        <span>{{ UI_TEXT.common.uploadedAt || 'Date' }}</span>
        <UIcon
          v-if="sortKey === 'created_at'"
          :name="sortOrder === 'asc' ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
          :class="['w-4 h-4 text-brand-500', SPACING_TOKENS.m.xs]"
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
