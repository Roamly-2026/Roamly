<!-- components/common/modals/FormModal.vue -->
<template>
  <BaseModal
    :open="open"
    :title="title"
    :ui-size="uiSize"
    :dismissible="dismissible"
    @update:open="$emit('update:open', $event)"
  >
    <template #body>
      <form :id="formId" :class="appConfig.layout.modalForm" @submit.prevent="$emit('submit')">
        <slot name="body">
          <slot></slot>
        </slot>
        <p v-if="errorText" :class="[appConfig.typography.inputError, 'mt-2']">
          {{ errorText }}
        </p>
      </form>
    </template>

    <template #footer>
      <div :class="appConfig.layout.modalActions || appConfig.layout.flexBetween">
        <UButton
          :label="cancelText"
          variant="actionCancelButton"
          :class="appConfig.typography.modalActionBtnCancel"
          :disabled="disableCancel"
          @click="$emit('cancel')"
        />
        <UButton
          type="submit"
          :form="formId"
          :label="submitText"
          variant="actionOkButton"
          :class="appConfig.typography.modalActionBtnOk"
          :loading="loading"
          :disabled="disableSubmit"
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
    formId: string;
    cancelText: string;
    submitText: string;
    errorText?: string;
    loading?: boolean;
    uiSize?: string;
    disableCancel?: boolean;
    disableSubmit?: boolean;
    dismissible?: boolean;
  }>(),
  {
    errorText: '',
    loading: false,
    uiSize: undefined,
    disableCancel: false,
    disableSubmit: false,
    dismissible: false,
  },
);

defineEmits(['update:open', 'cancel', 'submit']);
</script>
