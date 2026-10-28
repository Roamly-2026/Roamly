<!-- frontend/app/components/base/modals/FormModal.vue -->
<template>
  <BaseModal
    :open="open"
    :title="title"
    :ui-size="uiSize"
    :dismissible="dismissible"
    @update:open="$emit('update:open', $event)"
  >
    <template #body>
      <form :id="formId" :class="LAYOUT_CONFIG.modalForm" @submit.prevent="$emit('submit')">
        <slot name="body">
          <slot></slot>
        </slot>
        <p v-if="errorText" :class="TYPOGRAPHY_CONFIG.inputError">
          {{ errorText }}
        </p>
      </form>
    </template>

    <template #footer>
      <div :class="LAYOUT_CONFIG.modalActions">
        <BaseButton
          :label="cancelText"
          variant="actionCancelButton"
          :class="TYPOGRAPHY_CONFIG.modalActionBtnCancel"
          :disabled="disableCancel"
          @click="$emit('cancel')"
        />
        <BaseButton
          type="submit"
          :form="formId"
          :label="submitText"
          :class="TYPOGRAPHY_CONFIG.modalActionBtnOk"
          :loading="loading"
          :disabled="disableSubmit"
        />
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
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
