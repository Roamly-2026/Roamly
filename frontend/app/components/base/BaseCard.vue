<!-- frontend/app/components/base/BaseCard.vue -->
<template>
  <UCard :variant="variant">
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps ?? {}" />
    </template>
  </UCard>
</template>

<script setup lang="ts">
/* --- IMPORTS --- */
import type { CardProps } from '@nuxt/ui';

/* --- PROPS --- */
// Everything else (class, @click...) falls through to UCard
withDefaults(
  defineProps<{
    variant?: CardProps['variant'];
  }>(),
  {
    variant: 'glass',
  },
);
</script>
