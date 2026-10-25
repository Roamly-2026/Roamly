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
        <p :class="appConfig.typography.modalText">{{ message }}</p>
      </slot>
      <p v-if="errorText" :class="[appConfig.typography.modalErrorBox, 'mt-2']">
        {{ errorText }}
      </p>
    </template>

    <template #footer>
      <div :class="appConfig.layout.modalActions || appConfig.layout.flexBetween">
        <UButton
          :label="cancelText"
          variant="actionCancelButton"
          :class="appConfig.typography.modalActionBtnCancel"
          @click="$emit('cancel')"
        />
        <UButton
          :label="confirmText"
          variant="actionOkButton"
          :class="[appConfig.typography.modalActionBtnOk, confirmBtnClass]"
          :loading="loading"
          @click="$emit('confirm')"
        />
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { useAppConfig } from '#imports';

const appConfig = useAppConfig();

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
    confirmBtnClass?: string;
    dismissible?: boolean;
  }>(),
  {
    message: '',
    errorText: '',
    loading: false,
    uiSize: undefined,
    confirmBtnClass: 'bg-error-500 hover:bg-error-600 text-white',
    dismissible: false,
  },
);

defineEmits(['update:open', 'cancel', 'confirm']);
</script>
