<!-- frontend/app/components/auth/views/LoginDesktop.vue -->
<template>
  <div :class="appConfig.layout.authWrapper">
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
        <BaseInput
          v-model="form.email"
          name="email"
          :label="UI_TEXT.auth.emailLabel"
          type="email"
          :placeholder="UI_TEXT.auth.emailPlaceholder"
        />

        <BaseInput
          v-model="form.password"
          name="password"
          :label="UI_TEXT.auth.passwordLabel"
          type="password"
          :placeholder="UI_TEXT.auth.passwordPlaceholder"
        />

        <div v-if="error" :class="appConfig.typography.formStatusError">
          {{ getErrorMessage(error) }}
        </div>
        <div v-if="status === 'success'" :class="appConfig.typography.formStatusSuccess">
          {{ UI_TEXT.auth.loginSuccess }}
        </div>

        <!-- FORM BUTTONS -->
        <div :class="appConfig.layout.formActions">
          <BaseButton
            :label="UI_TEXT.common.cancel"
            variant="actionCancelButton"
            :disabled="isLoading"
            @click="clearForm"
          />
          <BaseButton type="submit" :label="UI_TEXT.auth.loginTitle" :loading="isLoading" />
        </div>
      </UForm>
    </UCard>

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
