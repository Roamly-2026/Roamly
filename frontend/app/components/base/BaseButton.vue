<!-- frontend/app/components/base/BaseButton.vue -->
<template>
  <UTooltip :text="tooltip" :disabled="!tooltip">
    <UButton v-bind="$attrs" :variant="variant">
      <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps ?? {}" />
      </template>
    </UButton>
  </UTooltip>
</template>

<script setup lang="ts">
/* --- IMPORTS --- */
import type { ButtonProps } from '@nuxt/ui';

/* --- OPTIONS --- */
// The root is now UTooltip, so attributes (icon, label, @click...) must be passed to UButton manually
defineOptions({ inheritAttrs: false });

/* --- PROPS --- */
withDefaults(
  defineProps<{
    variant?: ButtonProps['variant'];
    tooltip?: string;
  }>(),
  {
    variant: 'actionOkButton',
    tooltip: undefined,
  },
);
</script>
