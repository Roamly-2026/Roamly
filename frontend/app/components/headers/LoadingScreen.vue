<!-- frontend/app/components/headers/LoadingScreen.vue -->
<template>
  <div
    :class="[
      'fixed inset-0 z-9999 bg-light-bg/80 backdrop-blur-md flex flex-col items-center justify-center',
      SPACING_TOKENS.gap.lg,
    ]"
  >
    <UIcon name="i-heroicons-arrow-path" class="w-16 h-16 text-brand-500 animate-spin" />
    <h2 class="text-2xl font-bold text-dark-text tracking-widest animate-pulse">
      {{ UI_TEXT.common.brandName }}
    </h2>
  </div>
</template>

<script setup lang="ts">
import { SPACING_TOKENS } from '~/utils/spacings.tokens';
</script>