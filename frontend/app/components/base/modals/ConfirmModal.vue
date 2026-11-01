<template>
  <BaseModal
    :open="open"
    :title="title"
    :ui-size="uiSize"
    :dismissible="dismissible"
    @update:open="$emit('update:open', $event)"
  >
    <template #body>
      <slot name="body">
        <p :class="TYPOGRAPHY_CONFIG.modalText">{{ message }}</p>
      </slot>
      <p v-if="errorText" :class="TYPOGRAPHY_CONFIG.modalErrorBox">
        {{ errorText }}
      </p>
    </template>

    <template #footer>
      <div :class="LAYOUT_CONFIG.modalActions">
        <BaseButton
          :label="cancelText"
          variant="actionCancelButton"
          :class="TYPOGRAPHY_CONFIG.modalActionBtnCancel"
          @click="$emit('cancel')"
        />
        <BaseButton
          :label="confirmText"
          :variant="confirmVariant"
          :class="[TYPOGRAPHY_CONFIG.modalActionBtnOk, confirmBtnClass]"
          :loading="loading"
          @click="$emit('confirm')"
        />
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui';

withDefaults(
  defineProps<{
    open: boolean;
    title: string;
    message?: string;
    errorText?: string;
    cancelText: string;
    confirmText: string;
    loading?: boolean;
    uiSize?: string;
    dismissible?: boolean;
    confirmVariant?: ButtonProps['variant'];
    confirmBtnClass?: string;
  }>(),
  {
    message: '',
    errorText: '',
    loading: false,
    uiSize: undefined,
    dismissible: false,
    confirmVariant: 'actionDangerButton',
    confirmBtnClass: '',
  },
);

defineEmits(['update:open', 'cancel', 'confirm']);
</script>
