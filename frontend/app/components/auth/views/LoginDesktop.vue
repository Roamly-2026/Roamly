<!-- frontend/app/components/auth/views/LoginDesktop.vue -->
<template>
  <div :class="LAYOUT_CONFIG.authWrapper">
    <BaseCard>
      <div :class="TYPOGRAPHY_CONFIG.authTitleWrapper">
        <h1 :class="TYPOGRAPHY_CONFIG.authTitle">
          {{ UI_TEXT.auth.loginHeading }}
        </h1>
      </div>

      <UForm
        :schema="loginSchema"
        :state="form"
        :class="LAYOUT_CONFIG.formWrapper"
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

        <div v-if="error" :class="TYPOGRAPHY_CONFIG.formStatusError">
          {{ getErrorMessage(error) }}
        </div>
        <div v-if="status === 'success'" :class="TYPOGRAPHY_CONFIG.formStatusSuccess">
          {{ UI_TEXT.auth.loginSuccess }}
        </div>

        <div :class="LAYOUT_CONFIG.formActions">
          <BaseButton
            :label="UI_TEXT.common.cancel"
            variant="actionCancelButton"
            :disabled="isLoading"
            @click="clearForm"
          />
          <BaseButton
            type="submit"
            :label="UI_TEXT.auth.loginTitle"
            variant="actionOkButton"
            :loading="isLoading"
          />
        </div>
      </UForm>
    </BaseCard>

    <div :class="LAYOUT_CONFIG.singleButtonWrapper">
      <BaseButton
        to="/register"
        :label="UI_TEXT.auth.registerPrompt"
        variant="actionAccentHeroButton"
        :tooltip="UI_TEXT.tooltips.registerPrompt"
        :class="LAYOUT_CONFIG.fullWidth"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import type { FormSubmitEvent } from '#ui/types';
import { loginSchema, type LoginFormState } from '~/utils/schemas/login.schema';
import { getErrorMessage } from '~/utils/error.utils';
import type { ApiError } from '~/types/apiError.type';

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
