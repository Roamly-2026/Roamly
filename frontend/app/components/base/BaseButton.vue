<!-- frontend/app/components/base/BaseButton.vue -->
<template>
  <UTooltip :text="tooltip" :disabled="!tooltip" :ui="tooltipUi" :popper="tooltipPopper">
    <UButton v-bind="$attrs" :variant="variant">
      <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps ?? {}" />
      </template>
    </UButton>
  </UTooltip>
</template>

<script setup lang="ts">
/* --- IMPORTS --- */
import type { ButtonProps, TooltipProps } from '@nuxt/ui';

/* --- TYPES --- */
type PopperOptions = {
  placement?:
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'left'
    | 'left-start'
    | 'left-end'
    | 'auto'
    | 'auto-start'
    | 'auto-end';
  strategy?: 'fixed' | 'absolute';
  arrow?: boolean;
  offsetDistance?: number;
  offsetSkid?: number;
  flip?: boolean;
};

/* --- OPTIONS --- */
// The root is now UTooltip, so attributes (icon, label, @click...) must be passed to UButton manually
defineOptions({ inheritAttrs: false });

/* --- PROPS --- */
withDefaults(
  defineProps<{
    variant?: ButtonProps['variant'];
    tooltip?: string;
    tooltipUi?: TooltipProps['ui'];
    tooltipPopper?: PopperOptions;
  }>(),
  {
    variant: 'actionOkButton',
    tooltip: undefined,
    tooltipUi: undefined,
    tooltipPopper: undefined,
  },
);
</script>
