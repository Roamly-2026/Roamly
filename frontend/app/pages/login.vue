<!-- frontend/app/pages/login.vue -->
<template>
  <div>
    <ClientOnly>
      <template #fallback>
        <div class="min-h-screen flex items-center justify-center">
          <span class="opacity-50 font-medium">{{ UI_TEXT.common.loading }}</span>
        </div>
      </template>

      <LoginMobile
        v-if="isMobile"
        :is-loading="loginMutation.isLoading.value"
        :error="loginMutation.error.value"
        :status="loginMutation.status.value"
        @submit="handleLogin"
      />
      <LoginDesktop
        v-else
        :is-loading="loginMutation.isLoading.value"
        :error="loginMutation.error.value"
        :status="loginMutation.status.value"
        @submit="handleLogin"
      />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
/* --- IMPORTS --- */
import { useRouter } from 'vue-router';
import { useScreenSize } from '~/composables/useScreenSize';
import { useLoginUserMutation } from '~/queries/auth.mutation';
import type { LoginFormState } from '~/utils/schemas/login.schema';

/* --- PAGE CONFIGURATION --- */
definePageMeta({ layout: 'auth', middleware: ['guest'] });

/* --- COMPOSABLES & STORES --- */
const { isMobile } = useScreenSize();
const router = useRouter();

/* --- API MUTATIONS --- */
const loginMutation = useLoginUserMutation(() => router.push('/groups'));

/* --- EVENT HANDLERS --- */
const handleLogin = (data: LoginFormState) => {
  loginMutation.mutate({
    email: data.email,
    password: data.password,
  });
};
</script>
