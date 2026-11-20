<template>
  <UPopover v-model:open="isOpen">
    <BaseButton
      icon="i-heroicons-funnel"
      :label="buttonLabel"
      variant="glassButton"
      :class="selectedTags.length > 0 ? BORDER_TOKENS.ringBrandMedium : ''"
    />

    <template #content>
      <div
        :class="[
          SIZE_TOKENS.container.dropdownFilter,
          GLASS_TOKENS.strong,
          RADIUS_TOKENS.lg,
          BORDER_TOKENS.ringCard,
          SHADOW_TOKENS.modal,
          SPACING_TOKENS.p.sm,
          `flex flex-col ${SPACING_TOKENS.gap.sm}`,
        ]"
      >
        <!-- Search input inside dropdown -->
        <BaseSearchInput v-model="tagSearch" :placeholder="UI_TEXT.files.filterByTagsPlaceholder" />

        <!-- Active tags summary & clear -->
        <div
          v-if="selectedTags.length > 0"
          :class="[LAYOUT_CONFIG.flexBetween, SPACING_TOKENS.px.xs]"
        >
          <span :class="TYPOGRAPHY_CONFIG.captionMuted"> {{ selectedTags.length }} selected </span>
          <button
            type="button"
            :class="[
              TEXT_SIZES.xs,
              FONT_WEIGHTS.semibold,
              COLOR_TOKENS.status.error,
              INTERACTION_TOKENS.base,
              'hover:underline',
            ]"
            @click="clearAll"
          >
            {{ UI_TEXT.common.clearFilter }}
          </button>
        </div>

        <!-- Scrollable tag list -->
        <div
          v-if="filteredTags.length > 0"
          :class="`max-h-56 overflow-y-auto custom-scrollbar flex flex-col ${SPACING_TOKENS.gap.xs}`"
        >
          <button
            v-for="tag in filteredTags"
            :key="tag"
            type="button"
            :class="[
              `w-full flex items-center justify-between`,
              TEXT_SIZES.sm,
              FONT_WEIGHTS.medium,
              RADIUS_TOKENS.md,
              SPACING_TOKENS.px.md,
              SPACING_TOKENS.py.xs,
              INTERACTION_TOKENS.base,
              isSelected(tag)
                ? `${COLOR_TOKENS.surface.brandTint} ${COLOR_TOKENS.text.primary} ${FONT_WEIGHTS.semibold}`
                : `${COLOR_TOKENS.text.primarySoft} hover:${COLOR_TOKENS.text.primary} hover:${COLOR_TOKENS.surface.subtle}`,
            ]"
            @click="toggleTag(tag)"
          >
            <span class="truncate">#{{ tag }}</span>
            <UIcon
              v-if="isSelected(tag)"
              name="i-heroicons-check"
              :class="TYPOGRAPHY_CONFIG.iconBrandSm"
            />
          </button>
        </div>

        <div v-else :class="[TYPOGRAPHY_CONFIG.captionMuted, 'text-center', SPACING_TOKENS.py.md]">
          {{ UI_TEXT.documents.noMatchingDocuments }}
        </div>
      </div>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const selectedTags = defineModel<string[]>({ default: () => [] });

const props = defineProps<{
  availableTags: string[];
}>();

const isOpen = ref(false);
const tagSearch = ref('');

const buttonLabel = computed(() => {
  if (selectedTags.value.length === 0) {
    return UI_TEXT.common.filter;
  }
  if (selectedTags.value.length === 1) {
    return `#${selectedTags.value[0]}`;
  }
  return `#${selectedTags.value[0]} +${selectedTags.value.length - 1}`;
});

const filteredTags = computed(() => {
  const q = tagSearch.value.trim().toLowerCase();
  if (!q) return props.availableTags;
  return props.availableTags.filter((t) => t.toLowerCase().includes(q));
});

const isSelected = (tag: string) =>
  selectedTags.value.some((t) => t.toLowerCase() === tag.toLowerCase());

const toggleTag = (tag: string) => {
  const lower = tag.toLowerCase();
  const idx = selectedTags.value.findIndex((t) => t.toLowerCase() === lower);
  if (idx === -1) {
    selectedTags.value = [...selectedTags.value, tag];
  } else {
    const next = [...selectedTags.value];
    next.splice(idx, 1);
    selectedTags.value = next;
  }
};

const clearAll = () => {
  selectedTags.value = [];
  tagSearch.value = '';
};
</script>
