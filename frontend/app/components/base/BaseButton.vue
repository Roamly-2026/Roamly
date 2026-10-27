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
import type { ButtonProps } from '@nuxt/ui';

defineOptions({ inheritAttrs: false });

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