<template>
  <div ref="containerRef" class="relative w-full">
    <label v-if="label" :class="TYPOGRAPHY_CONFIG.inputLabel">
      {{ label }}
    </label>

    <!-- Chips + Input container -->
    <div
      :class="[
        `relative w-full flex flex-wrap items-center cursor-text`,
        compact
          ? `${INPUT_SIZES.sm} ${RADIUS_TOKENS.full}`
          : `${INPUT_SIZES.md} ${RADIUS_TOKENS.md}`,
        SPACING_TOKENS.gap.xs,
        SPACING_TOKENS.px.md,
        clearable && modelValue.length > 0 ? '!pr-8' : '',
        compact ? SPACING_TOKENS.py['2xs'] : SPACING_TOKENS.py.xs,
        INPUT_APPEARANCES.glass,
        'focus-within:ring-2 focus-within:ring-field-focus',
      ]"
      @click="inputRef?.focus()"
    >
      <!-- Selected tag chips -->
      <span
        v-for="(tag, index) in modelValue"
        :key="tag"
        :class="[
          TYPOGRAPHY_CONFIG.badgeRole,
          BORDER_TOKENS.brandSubtle,
          `inline-flex items-center normal-case ${SPACING_TOKENS.gap.xs}`,
        ]"
      >
        <span>#{{ tag }}</span>
        <button
          type="button"
          :class="[
            `inline-flex items-center justify-center focus:outline-none`,
            INTERACTION_TOKENS.base,
            BUTTON_APPEARANCES.ghostDanger,
          ]"
          :aria-label="UI_TEXT.files.removeTagAria(tag)"
          @click.stop="removeTag(index)"
        >
          <UIcon name="i-heroicons-x-mark" :class="SIZE_TOKENS.icon.sm" />
        </button>
      </span>

      <!-- Text input -->
      <input
        ref="inputRef"
        v-model="inputValue"
        type="text"
        :placeholder="modelValue.length === 0 ? placeholder : ''"
        :class="[
          `flex-1 bg-transparent border-none outline-none`,
          compact ? 'min-w-12' : 'min-w-28',
          TEXT_SIZES.sm,
          COLOR_TOKENS.text.primary,
          'placeholder:text-field-placeholder',
          SPACING_TOKENS.py['2xs'],
        ]"
        :maxlength="maxLength"
        @focus="isOpen = true"
        @input="isOpen = true"
        @keydown="handleKeydown"
        @blur="handleBlur"
      />

      <!-- Clear all button -->
      <button
        v-if="clearable && modelValue.length > 0"
        type="button"
        :class="[
          `absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center shrink-0`,
          INTERACTION_TOKENS.base,
          BUTTON_APPEARANCES.ghostDanger,
          SPACING_TOKENS.p.xs,
        ]"
        :title="UI_TEXT.files.clearAllTags"
        @click.stop="clearAll"
      >
        <UIcon name="i-heroicons-x-circle" :class="SIZE_TOKENS.icon.sm" />
      </button>
    </div>

    <!-- Autocomplete suggestions dropdown -->
    <div
      v-if="isOpen && filteredSuggestions.length > 0"
      :class="[
        `absolute left-0 right-0 max-h-48 overflow-y-auto custom-scrollbar flex flex-col`,
        Z_INDEX_TOKENS.modal,
        SPACING_TOKENS.mt.xs,
        SPACING_TOKENS.p.xs,
        SPACING_TOKENS.gap.xs,
        RADIUS_TOKENS.lg,
        COLOR_TOKENS.surface.card,
        BORDER_TOKENS.ringCard,
        SHADOW_TOKENS.modal,
      ]"
    >
      <button
        v-for="(suggestion, idx) in filteredSuggestions"
        :key="suggestion"
        type="button"
        :class="[
          `w-full flex items-center justify-between`,
          TEXT_SIZES.sm,
          FONT_WEIGHTS.medium,
          RADIUS_TOKENS.md,
          SPACING_TOKENS.px.md,
          SPACING_TOKENS.py.xs,
          INTERACTION_TOKENS.base,
          idx === highlightedIndex
            ? `${COLOR_TOKENS.surface.brandTint} ${COLOR_TOKENS.text.primary}`
            : `${COLOR_TOKENS.text.primarySoft} hover:${COLOR_TOKENS.text.primary} hover:${COLOR_TOKENS.surface.subtle}`,
        ]"
        @mousedown.prevent="selectSuggestion(suggestion)"
      >
        <span>#{{ suggestion }}</span>
        <UIcon name="i-heroicons-plus" :class="`${SIZE_TOKENS.icon.sm} ${OPACITY_TOKENS.subtle}`" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue: string[];
    suggestions?: string[];
    label?: string;
    placeholder?: string;
    allowCreate?: boolean;
    clearable?: boolean;
    compact?: boolean;
    maxTags?: number;
    maxLength?: number;
  }>(),
  {
    suggestions: () => [],
    label: '',
    placeholder: UI_TEXT.files.addTagPlaceholder,
    allowCreate: true,
    clearable: false,
    compact: false,
    maxTags: 15,
    maxLength: 32,
  },
);

const emit = defineEmits<{
  'update:modelValue': [tags: string[]];
}>();

const containerRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const inputValue = ref('');
const isOpen = ref(false);
const highlightedIndex = ref(-1);

const filteredSuggestions = computed(() => {
  const query = inputValue.value.trim().toLowerCase();
  const selectedLower = new Set(props.modelValue.map((t) => t.toLowerCase()));

  return props.suggestions.filter((s) => {
    const lower = s.toLowerCase();
    if (selectedLower.has(lower)) return false;
    if (!query) return true;
    return lower.includes(query);
  });
});

watch(filteredSuggestions, () => {
  highlightedIndex.value = -1;
});

const addTag = (raw: string) => {
  const parts = raw
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
  if (parts.length === 0) return;

  const next = [...props.modelValue];
  for (const rawPart of parts) {
    if (next.length >= props.maxTags) break;
    const part = rawPart.slice(0, props.maxLength).trim();
    if (!part) continue;
    const exists = next.some((t) => t.toLowerCase() === part.toLowerCase());
    if (!exists) {
      next.push(part);
    }
  }

  emit('update:modelValue', next);
  inputValue.value = '';
  highlightedIndex.value = -1;
};

const selectSuggestion = (suggestion: string) => {
  addTag(suggestion);
  inputRef.value?.focus();
};

const removeTag = (index: number) => {
  const next = [...props.modelValue];
  next.splice(index, 1);
  emit('update:modelValue', next);
};

const clearAll = () => {
  emit('update:modelValue', []);
  inputValue.value = '';
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowDown') {
    if (filteredSuggestions.value.length > 0) {
      e.preventDefault();
      isOpen.value = true;
      highlightedIndex.value = (highlightedIndex.value + 1) % filteredSuggestions.value.length;
    }
    return;
  }

  if (e.key === 'ArrowUp') {
    if (filteredSuggestions.value.length > 0) {
      e.preventDefault();
      isOpen.value = true;
      highlightedIndex.value =
        (highlightedIndex.value - 1 + filteredSuggestions.value.length) %
        filteredSuggestions.value.length;
    }
    return;
  }

  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault();
    if (highlightedIndex.value >= 0 && highlightedIndex.value < filteredSuggestions.value.length) {
      selectSuggestion(filteredSuggestions.value[highlightedIndex.value]!);
      return;
    }

    if (props.allowCreate) {
      addTag(inputValue.value);
    } else if (filteredSuggestions.value.length === 1) {
      selectSuggestion(filteredSuggestions.value[0]!);
    }
    return;
  }

  if (e.key === 'Backspace' && inputValue.value === '' && props.modelValue.length > 0) {
    removeTag(props.modelValue.length - 1);
    return;
  }

  if (e.key === 'Escape') {
    isOpen.value = false;
  }
};

const handleClickOutside = (e: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    isOpen.value = false;
  }
};

const handleBlur = () => {
  if (props.allowCreate && inputValue.value.trim()) {
    addTag(inputValue.value);
  }
  isOpen.value = false;
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('click', handleClickOutside));
</script>
