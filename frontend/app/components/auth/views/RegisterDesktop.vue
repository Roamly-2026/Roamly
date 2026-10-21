<!-- frontend/app/components/auth/views/RegisterDesktop.vue -->
<template>
  <div :class="appConfig.layout.authWrapper">
    <UCard variant="glass">
      <!-- TITLE -->
      <div :class="appConfig.typography.authTitleWrapper">
        <h1 :class="appConfig.typography.authTitle">
          {{ UI_TEXT.auth.registerHeading }}
        </h1>
      </div>

      <!-- FORM -->
      <UForm
        :schema="registerSchema"
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

        <UFormField name="username" :label="UI_TEXT.auth.usernameLabel">
          <template #default="{ error: fieldError }">
            <UInput
              v-model="form.username"
              type="text"
              :placeholder="UI_TEXT.auth.usernamePlaceholder"
              :variant="fieldError ? 'glassError' : 'glass'"
            />
          </template>
        </UFormField>

        <UFormField name="phone_number" :label="UI_TEXT.auth.phoneLabel">
          <template #default="{ error: fieldError }">
            <UInput
              v-model="form.phone_number"
              type="tel"
              :placeholder="UI_TEXT.auth.phonePlaceholder"
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

        <UFormField name="repeatPassword" :label="UI_TEXT.auth.repeatPasswordLabel">
          <template #default="{ error: fieldError }">
            <UInput
              v-model="form.repeatPassword"
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
          {{ UI_TEXT.auth.registerSuccess }}
        </div>

        <div :class="appConfig.layout.formActions">
          <UButton
            :label="UI_TEXT.common.cancel"
            variant="actionCancelButton"
            :disabled="isLoading"
            @click="clearForm"
          />
          <UButton
            type="submit"
            :label="UI_TEXT.auth.registerTitle"
            variant="actionOkButton"
            :loading="isLoading"
          />
        </div>
      </UForm>
    </UCard>

    <div :class="appConfig.layout.singleButtonWrapper">
      <UButton
        to="/login"
        :label="UI_TEXT.auth.loginInstead"
        variant="actionOkButton"
        class="w-full"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
/* --- IMPORTS --- */
import { reactive } from 'vue';
import { useAppConfig } from '#imports';
import type { FormSubmitEvent } from '#ui/types';
import { registerSchema, type RegisterFormState } from '~/utils/schemas/register.schema';
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
  (e: 'submit', data: RegisterFormState): void;
}>();

/* --- COMPONENT STATE --- */
const form = reactive<RegisterFormState>({
  email: '',
  username: '',
  phone_number: '',
  password: '',
  repeatPassword: '',
});

/* --- EVENT HANDLERS --- */
const clearForm = () => {
  Object.assign(form, {
    email: '',
    username: '',
    phone_number: '',
    password: '',
    repeatPassword: '',
  });
};

const onSubmit = (event: FormSubmitEvent<RegisterFormState>) => {
  emit('submit', event.data);
};
</script>
