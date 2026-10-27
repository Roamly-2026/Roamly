<!-- frontend/app/components/auth/views/VerifyEmailDesktop.vue -->
<template>
  <div :class="appConfig.layout.authWrapper">
    <BaseCard>
      <!-- TITLE -->
      <div :class="appConfig.typography.authTitleWrapper">
        <h1 :class="appConfig.typography.authTitle">{{ UI_TEXT.auth.verifyHeading }}</h1>
        <p :class="[appConfig.typography.modalText, TEXT_LEADING.relaxed]">
          {{ ' ' + UI_TEXT.auth.verifyBeforeEmail + ' '
          }}<span :class="appConfig.typography.modalInlineHighlight">{{ email }}</span
          >{{ UI_TEXT.auth.verifyAfterEmail + ' ' }}
        </p>
      </div>

      <!-- OTP INPUTS -->
      <div :class="appConfig.layout.formWrapper">
        <div :class="[appConfig.layout.actionGroup, SPACING_TOKENS.mx.auto, SPACING_TOKENS.py.sm]">
          <input
            v-for="(_, i) in otpCells"
            :key="i"
            :ref="(el) => setRef(el, i)"
            v-model="otpCells[i]"
            type="text"
            inputmode="numeric"
            maxlength="1"
            :class="[
              OTP_INPUT_CONFIG.desktop,
              error ? OTP_INPUT_CONFIG.error : '',
              isVerified ? OTP_INPUT_CONFIG.success : '',
            ]"
            :disabled="isVerifying || isVerified"
            @input="onInput(i, $event)"
            @keydown="onKeydown(i, $event)"
            @paste="onPaste"
            @focus="($event.target as HTMLInputElement).select()"
          />
        </div>

        <!-- Error -->
        <div v-if="error" :class="appConfig.typography.formStatusError">
          {{ getErrorMessage(error) }}
        </div>

        <!-- Success -->
        <div v-if="isVerified" :class="appConfig.typography.formStatusSuccess">
          {{ ' ' + UI_TEXT.auth.verified + ' ' }}
        </div>

        <!-- Verify button -->
        <div :class="appConfig.layout.formActions">
          <BaseButton
            :label="UI_TEXT.auth.verify"
            variant="actionOkButton"
            :class="CARD_CONFIG.slots.root"
            :loading="isVerifying"
            :disabled="!isOtpComplete || isVerified"
            @click="emit('submit', otpValue)"
          />
        </div>

        <!-- Divider -->
        <div :class="appConfig.layout.divider" />

        <!-- Resend -->
        <div :class="appConfig.layout.homeHeroSection">
          <p :class="[TEXT_SIZES.xs, COLOR_TOKENS.text.muted]">{{ UI_TEXT.auth.noCode }}</p>
          <BaseButton
            :label="UI_TEXT.auth.resend"
            variant="link"
            :class="[TEXT_SIZES.sm, FONT_WEIGHTS.semibold, COLOR_TOKENS.text.brandAccent]"
            :disabled="isResending || resendCooldown > 0 || isVerified"
            :loading="isResending"
            @click="emit('resend')"
          />
          <p v-if="resendCooldown > 0" :class="[TEXT_SIZES.xs, COLOR_TOKENS.text.muted]">
            {{ ' ' + UI_TEXT.auth.resendAvailable + ' ' }}{{ resendCooldown
            }}{{ UI_TEXT.auth.seconds + ' ' }}
          </p>
          <div v-if="resendSuccess" :class="appConfig.typography.formStatusSuccess">
            {{ ' ' + UI_TEXT.auth.resent + ' ' }}
          </div>
          <div v-if="resendError" :class="appConfig.typography.formStatusError">
            {{ getErrorMessage(resendError) }}
          </div>
        </div>
      </div>
    </BaseCard>

    <!-- Back to register link -->
    <div :class="appConfig.layout.singleButtonWrapper">
      <BaseButton
        to="/register"
        :label="UI_TEXT.auth.backToRegister"
        variant="actionAccentHeroButton"
        :class="CARD_CONFIG.slots.root"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue';
import { useAppConfig } from '#imports';
import { getErrorMessage } from '~/utils/error.utils';
import type { ApiError } from '~/types/apiError.type';

const appConfig = useAppConfig();

const props = defineProps<{
  email: string;
  isVerifying: boolean;
  isResending: boolean;
  isVerified: boolean;
  resendCooldown: number;
  resendSuccess: boolean;
  error: ApiError | Error | null | undefined;
  resendError: ApiError | Error | null | undefined;
}>();

const emit = defineEmits<{
  submit: [otp: string];
  resend: [];
}>();

const OTP_LENGTH = 6;
const otpCells = reactive<string[]>(Array(OTP_LENGTH).fill(''));
const inputRefs = ref<(HTMLInputElement | null)[]>(Array(OTP_LENGTH).fill(null));

const setRef = (el: unknown, i: number) => {
  inputRefs.value[i] = el as HTMLInputElement | null;
};

const otpValue = computed(() => otpCells.join(''));
const isOtpComplete = computed(
  () => otpValue.value.length === OTP_LENGTH && otpCells.every((c) => c !== ''),
);

const focusCell = (index: number) => {
  inputRefs.value[index]?.focus();
};

// Sanitizes input to a single digit, auto-advances focus, and auto-submits when all cells are filled
const onInput = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement;
  const val = target.value.replace(/\D/g, '').slice(-1);
  otpCells[index] = val;

  if (val && index < OTP_LENGTH - 1) {
    focusCell(index + 1);
  }

  if (isOtpComplete.value) {
    emit('submit', otpValue.value);
  }
};

// Handles keyboard navigation (Arrow keys) and sequential deletion (Backspace) across OTP inputs
const onKeydown = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace') {
    if (otpCells[index]) {
      otpCells[index] = '';
    } else if (index > 0) {
      otpCells[index - 1] = '';
      focusCell(index - 1);
    }
    event.preventDefault();
  } else if (event.key === 'ArrowLeft' && index > 0) {
    focusCell(index - 1);
    event.preventDefault();
  } else if (event.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
    focusCell(index + 1);
    event.preventDefault();
  }
};

// Extracts numeric characters from clipboard data, distributes them across cells, and triggers auto-submit if complete
const onPaste = (event: ClipboardEvent) => {
  event.preventDefault();
  const pasted = event.clipboardData?.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH) ?? '';
  pasted.split('').forEach((char, i) => {
    if (i < OTP_LENGTH) otpCells[i] = char;
  });
  focusCell(Math.min(pasted.length, OTP_LENGTH - 1));

  if (isOtpComplete.value) {
    emit('submit', otpValue.value);
  }
};

// Reset OTP inputs and return focus to the first cell upon verification failure
watch(
  () => props.error,
  (newErr) => {
    if (newErr) {
      otpCells.forEach((_, i) => {
        otpCells[i] = '';
      });
      focusCell(0);
    }
  },
);
</script>
