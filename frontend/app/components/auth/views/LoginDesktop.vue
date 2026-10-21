<!-- frontend/app/components/auth/views/LoginDesktop.vue -->
<template>
  <div :class="appConfig.layout.authWrapper">
    <!-- LOGIN FORM CARD -->
    <UCard variant="glass">
      <div :class="appConfig.typography.authTitleWrapper">
        <h1 :class="appConfig.typography.authTitle">
          {{ UI_TEXT.auth.loginHeading ?? UI_TEXT.fallback.login }}
        </h1>
      </div>

      <!-- FORM -->
      <UForm
        :schema="loginSchema"
        :state="form"
        :class="appConfig.layout.formWrapper"
        @submit="onSubmit"
      >
        <UFormField name="email" :label="UI_TEXT.auth.emailLabel">
          <template #default="{ error: fieldError }">
            <UInput
              v-model="form.email"
              type="email"
              :placeholder="UI_TEXT.auth.emailPlaceholder"
              :variant="fieldError ? 'glassError' : 'glass'"
            />
          </template>
        </UFormField>

        <UFormField name="password" :label="UI_TEXT.auth.passwordLabel">
          <template #default="{ error: fieldError }">
            <UInput
              v-model="form.password"
              type="password"
              :placeholder="UI_TEXT.auth.passwordPlaceholder"
              :variant="fieldError ? 'glassError' : 'glass'"
            />
          </template>
        </UFormField>

        <div v-if="error" :class="appConfig.typography.formStatusError">
          {{ getErrorMessage(error) }}
        </div>
        <div v-if="status === 'success'" :class="appConfig.typography.formStatusSuccess">
          {{ UI_TEXT.auth.loginSuccess ?? UI_TEXT.fallback.success }}
        </div>

        <!-- REGISTRATION PROMPT BUTTON -->
        <div :class="appConfig.layout.formActions">
          <UButton
            :label="UI_TEXT.common.cancel"
            variant="actionCancelButton"
            :disabled="isLoading"
            @click="clearForm"
          />
          <UButton
            type="submit"
            :label="UI_TEXT.auth.loginTitle ?? UI_TEXT.fallback.login"
            variant="actionOkButton"
            :loading="isLoading"
          />
        </div>
      </UForm>
    </UCard>

    <div :class="appConfig.layout.singleButtonWrapper">
      <UTooltip :text="UI_TEXT.tooltips.registerPrompt ?? UI_TEXT.auth.registerTitle">
        <UButton
          to="/register"
          :label="UI_TEXT.auth.registerPrompt ?? UI_TEXT.fallback.createAccount"
          variant="actionAccentHeroButton"
          class="w-full"
        />
      </UTooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
/* --- IMPORTS --- */
import { reactive } from 'vue';
import { useAppConfig } from '#imports';
import type { FormSubmitEvent } from '#ui/types';
import { loginSchema, type LoginFormState } from '~/utils/schemas/login.schema';
import { getErrorMessage } from '~/utils/error.utils';
import type { ApiError } from '~/types/apiError.type';

/* --- COMPOSABLES --- */
const appConfig = useAppConfig();

/* --- PROPS & EMITS --- */
defineProps<{
  isLoading: boolean;
  error: ApiError | Error | null | undefined;
  status: 'idle' | 'pending' | 'success' | 'error';
}>();

const emit = defineEmits<{
  (e: 'submit', data: LoginFormState): void;
}>();

/* --- COMPONENT STATE --- */
const form = reactive<LoginFormState>({
  email: '',
  password: '',
});

/* --- EVENT HANDLERS --- */
const clearForm = () => {
  Object.assign(form, { email: '', password: '' });
};

const onSubmit = (event: FormSubmitEvent<LoginFormState>) => {
  emit('submit', event.data);
};
</script>
