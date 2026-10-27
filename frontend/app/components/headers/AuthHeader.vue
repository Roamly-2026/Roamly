<!-- frontend/app/components/headers/AuthHeader.vue -->
<template>
  <header :class="[appConfig.layout.headerBase, appConfig.layout.headerRelative]">
    <!-- LOGO SECTION -->
    <div :class="appConfig.layout.headerLeft">
      <NuxtLink to="/" :class="appConfig.layout.logoWrapper">
        <UIcon
          name="i-heroicons-map-pin"
          :class="[SIZE_TOKENS.icon.lg, COLOR_TOKENS.text.brandAccent]"
        />
        <span :class="appConfig.typography.logoText">{{ UI_TEXT.common.brandName }}</span>
      </NuxtLink>
    </div>

    <!-- ACTIONS SECTION -->
    <div :class="appConfig.layout.headerRight">
      <NuxtLink :to="isAuthenticated ? '/users/profile' : '/login'">
        <UAvatar icon="i-heroicons-user" />
      </NuxtLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAppConfig } from '#imports';

const appConfig = useAppConfig();
const { isAuthenticated } = useAuth();
</script>
