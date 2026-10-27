<!-- frontend/app/components/headers/LoadingScreen.vue -->
<template>
  <div :class="LAYOUT_CONFIG.loadingScreenWrapper">
    <UIcon name="i-heroicons-arrow-path" :class="LAYOUT_CONFIG.loadingSpinner" />
    <h2 :class="TYPOGRAPHY_CONFIG.loadingTitle">
      {{ UI_TEXT.common.brandName }}
    </h2>
  </div>
</template>
