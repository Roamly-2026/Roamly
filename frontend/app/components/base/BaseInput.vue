<!-- frontend/app/components/base/BaseInput.vue -->
<template>
  <UFormField :name="name" :label="label">
    <template #default="{ error: fieldError }">
      <UInput
        v-model="model"
        v-bind="$attrs"
        :variant="fieldError && variant === 'glass' ? 'glassError' : variant"
      />
    </template>
  </UFormField>
</template>

<script setup lang="ts">
/* --- IMPORTS --- */
import type { InputProps } from '@nuxt/ui';

/* --- OPTIONS --- */
// Attributes (type, placeholder, icon...) belong to the input, not to the form field wrapper
defineOptions({ inheritAttrs: false });

/* --- PROPS & MODEL --- */
withDefaults(
  defineProps<{
    name?: string;
    label?: string;
    variant?: InputProps['variant'];
  }>(),
  {
    name: undefined,
    label: undefined,
    variant: 'glass',
  },
);

const model = defineModel<string>();
</script>
