<template>
  <BaseModal 
    :open="open" 
    :title="title" 
    :ui-size="uiSize"
    @update:open="$emit('update:open', $event)" 
  >
    <template #body>
      <form :id="formId" :class="appConfig.layout.modalForm" @submit.prevent="$emit('submit')">
        <slot name="body"></slot>
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
          :label="submitText" 
          variant="actionOkButton" 
          :class="appConfig.typography.modalActionBtnOk"
          type="submit" 
          :form="formId" 
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

defineProps<{
  open: boolean;
  title: string;
  formId: string;
  errorText?: string;
  cancelText: string;
  submitText: string;
  loading?: boolean;
  uiSize?: string;
  disableCancel?: boolean;
  disableSubmit?: boolean;
}>();

defineEmits(['update:open', 'cancel', 'submit']);
</script>