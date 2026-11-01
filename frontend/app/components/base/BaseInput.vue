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
import type { InputProps } from '@nuxt/ui';

defineOptions({ inheritAttrs: false });

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
