<!-- frontend/app/components/base/BaseCard.vue -->
<template>
  <UCard :variant="variant">
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps ?? {}" />
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type { CardProps } from '@nuxt/ui';

withDefaults(
  defineProps<{
    variant?: CardProps['variant'];
  }>(),
  {
    variant: 'glass',
  },
);
</script>
