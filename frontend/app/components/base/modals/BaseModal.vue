<!-- components/common/modals/BaseModal.vue -->
<template>
  <UModal
    :open="open"
    :dismissible="dismissible"
    :close="closeIcon"
    :ui="{
      overlay: MODAL_CONFIG.slots.overlay,
      content: `${MODAL_CONFIG.slots.content} ${uiSize || LAYOUT_CONFIG.modalSizeMd}`,
      header: MODAL_CONFIG.slots.header,
      body: MODAL_CONFIG.slots.body,
      footer: MODAL_CONFIG.slots.footer,
    }"
    @update:open="$emit('update:open', $event)"
  >
    <!-- Hiding default Nuxt UI slots -->
    <template #default><span /></template>
    <template #close><span /></template>

    <template v-if="$slots.header || title" #header>
      <slot name="header">
        <h3 :class="TYPOGRAPHY_CONFIG.cardTitle">{{ title }}</h3>
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
    title: undefined,
    uiSize: undefined,
    dismissible: false,
    closeIcon: false,
  },
);

defineEmits(['update:open']);
</script>
