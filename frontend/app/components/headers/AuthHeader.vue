<!-- frontend/app/components/headers/AuthHeader.vue -->
<template>
  <header :class="[LAYOUT_CONFIG.headerBase, LAYOUT_CONFIG.headerRelative]">
    <div :class="LAYOUT_CONFIG.headerLeft">
      <NuxtLink to="/" :class="LAYOUT_CONFIG.logoWrapper">
        <UIcon name="i-heroicons-map-pin" :class="TYPOGRAPHY_CONFIG.iconBrandLg" />
        <span :class="TYPOGRAPHY_CONFIG.logoText">{{ UI_TEXT.common.brandName }}</span>
      </NuxtLink>
    </div>

    <div :class="LAYOUT_CONFIG.headerRight">
      <NuxtLink :to="isAuthenticated ? '/users/profile' : '/login'">
        <UAvatar icon="i-heroicons-user" />
      </NuxtLink>
    </div>
  </header>
</template>

<script setup lang="ts">
const { isAuthenticated } = useAuth();
</script>
