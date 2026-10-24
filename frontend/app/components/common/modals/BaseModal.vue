<!-- components/common/modals/BaseModal.vue -->
<template>
  <UModal
    :open="open"
    :dismissible="dismissible"
    :close="closeIcon"
    :ui="{ content: uiSize }"
    @update:open="$emit('update:open', $event)"
  >
    <template #default><div class="hidden"></div></template>
    <template #close><div class="hidden"></div></template>
    
    <template #header>
      <slot name="header">
        <h3 class="text-xl font-bold text-dark-text">{{ title }}</h3>
      </slot>
    </template>
    
    <template #body>
      <slot name="body"></slot>
    </template>
    
    <template v-if="$slots.footer" #footer>
      <slot name="footer"></slot>
    </template>
  </UModal>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    open: boolean;
    title?: string;
    uiSize?: string;
    dismissible?: boolean;
    closeIcon?: boolean;
  }>(),
  {
    title: '',
    uiSize: undefined,
    dismissible: false, 
    closeIcon: false,
  },
);

defineEmits(['update:open']);
</script>