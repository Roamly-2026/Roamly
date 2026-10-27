<!-- frontend/app/components/auth/views/RegisterDesktop.vue -->
<template>
  <div :class="appConfig.layout.authWrapper">
    <BaseCard>
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
        <BaseInput
          v-model="form.email"
          name="email"
          :label="UI_TEXT.auth.emailLabel"
          type="email"
          :placeholder="UI_TEXT.auth.emailPlaceholder"
        />

        <BaseInput
          v-model="form.username"
          name="username"
          :label="UI_TEXT.auth.usernameLabel"
          type="text"
          :placeholder="UI_TEXT.auth.usernamePlaceholder"
        />

        <BaseInput
          v-model="form.phone_number"
          name="phone_number"
          :label="UI_TEXT.auth.phoneLabel"
          type="tel"
          :placeholder="UI_TEXT.auth.phonePlaceholder"
        />

        <BaseInput
          v-model="form.password"
          name="password"
          :label="UI_TEXT.auth.passwordLabel"
          type="password"
          :placeholder="UI_TEXT.auth.passwordPlaceholder"
        />

        <BaseInput
          v-model="form.repeatPassword"
          name="repeatPassword"
          :label="UI_TEXT.auth.repeatPasswordLabel"
          type="password"
          :placeholder="UI_TEXT.auth.passwordPlaceholder"
        />

        <div v-if="error" :class="appConfig.typography.formStatusError">
          {{ getErrorMessage(error) }}
        </div>
        <div v-if="status === 'success'" :class="appConfig.typography.formStatusSuccess">
          {{ UI_TEXT.auth.registerSuccess }}
        </div>

        <div :class="appConfig.layout.formActions">
          <BaseButton
            :label="UI_TEXT.common.cancel"
            variant="actionCancelButton"
            :disabled="isLoading"
            @click="clearForm"
          />
          <BaseButton
            type="submit"
            :label="UI_TEXT.auth.registerTitle"
            variant="actionOkButton"
            :loading="isLoading"
          />
        </div>
      </UForm>
    </BaseCard>

    <div :class="appConfig.layout.singleButtonWrapper">
      <BaseButton
        to="/login"
        :label="UI_TEXT.auth.loginInstead"
        variant="actionAccentHeroButton"
        :class="CARD_CONFIG.slots.root"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useAppConfig } from '#imports';
import type { FormSubmitEvent } from '#ui/types';
import { registerSchema, type RegisterFormState } from '~/utils/schemas/register.schema';
import { getErrorMessage } from '~/utils/error.utils';
import type { ApiError } from '~/types/apiError.type';

const appConfig = useAppConfig();

defineProps<{
  isLoading: boolean;
  error: ApiError | Error | null | undefined;
  status: 'idle' | 'pending' | 'success' | 'error';
}>();

const emit = defineEmits<{
  (e: 'submit', data: RegisterFormState): void;
}>();

const form = reactive<RegisterFormState>({
  email: '',
  username: '',
  phone_number: '',
  password: '',
  repeatPassword: '',
});

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
