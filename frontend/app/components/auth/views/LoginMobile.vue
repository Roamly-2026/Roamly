<!-- frontend/app/components/auth/views/LoginMobile.vue -->
<template>
  <div :class="appConfig.layout.mobileAuthWrapper">
    <!-- LOGIN FORM CARD -->
    <UCard variant="glass">
      <div :class="appConfig.typography.authTitleWrapper">
        <h1 :class="appConfig.typography.authTitle">
          {{ UI_TEXT.auth.loginHeading }}
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
              :ui="{ base: `!${SPACING_TOKENS.px.md}` }"
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
              :ui="{ base: `!${SPACING_TOKENS.px.md}` }"
            />
          </template>
        </UFormField>

        <div v-if="error" :class="appConfig.typography.formStatusError">
          {{ getErrorMessage(error) }}
        </div>
        <div v-if="status === 'success'" :class="appConfig.typography.formStatusSuccess">
          {{ UI_TEXT.auth.loginSuccess }}
        </div>

        <!-- ACTIONS (Mobilos elrendezés: egymás alatt, teljes szélességgel) -->

        <div
          :class="`flex flex-col-reverse ${SPACING_TOKENS.gap.md} ${SPACING_TOKENS.pt.lg} w-full`"
        >
          <BaseButton
            :label="UI_TEXT.common.cancel"
            variant="actionCancelButton"
            :disabled="isLoading"
            class="w-full"
            @click="clearForm"
          />
          <BaseButton
            type="submit"
            :label="UI_TEXT.auth.loginTitle"
            class="w-full"
            :loading="isLoading"
          />
        </div>
      </UForm>
    </UCard>

    <!-- REGISTRATION PROMPT BUTTON -->
    <div :class="appConfig.layout.singleButtonWrapper">
      <BaseButton
        to="/register"
        :label="UI_TEXT.auth.registerPrompt"
        variant="actionAccentHeroButton"
        :tooltip="UI_TEXT.tooltips.registerPrompt"
        class="w-full"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useAppConfig } from '#imports';
import type { FormSubmitEvent } from '#ui/types';
import { loginSchema, type LoginFormState } from '~/utils/schemas/login.schema';
import { getErrorMessage } from '~/utils/error.utils';
import type { ApiError } from '~/types/apiError.type';

const appConfig = useAppConfig();

defineProps<{
  isLoading: boolean;
  error: ApiError | Error | null | undefined;
  status: 'idle' | 'pending' | 'success' | 'error';
}>();

const emit = defineEmits<{
  (e: 'submit', data: LoginFormState): void;
}>();

const form = reactive<LoginFormState>({
  email: '',
  password: '',
});

const clearForm = () => {
  Object.assign(form, { email: '', password: '' });
};

const onSubmit = (event: FormSubmitEvent<LoginFormState>) => {
  emit('submit', event.data);
};
</script>
