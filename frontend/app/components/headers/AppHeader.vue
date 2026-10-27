<!-- frontend/app/components/headers/AppHeader.vue -->
<template>
  <header :class="[appConfig.layout.headerBase, appConfig.layout.headerSticky]">
    <!-- LOGO SECTION -->
    <div :class="appConfig.layout.headerLeft">
      <NuxtLink to="/#home" :class="appConfig.layout.logoWrapper">
        <UIcon
          name="i-heroicons-map-pin"
          :class="[SIZE_TOKENS.icon.lg, COLOR_TOKENS.text.brandAccent]"
        />
        <span :class="appConfig.typography.logoText">{{ UI_TEXT.common.brandName }}</span>
      </NuxtLink>
    </div>

    <!-- DESKTOP NAV SECTION -->
    <nav :class="appConfig.layout.navWrapper">
      <NuxtLink to="/#home" :class="appConfig.typography.navLink">{{
        UI_TEXT.home.title
      }}</NuxtLink>
      <NuxtLink to="/#about" :class="appConfig.typography.navLink">{{
        UI_TEXT.home.aboutTitle
      }}</NuxtLink>
      <NuxtLink to="/#support" :class="appConfig.typography.navLink">{{
        UI_TEXT.home.supportTitle
      }}</NuxtLink>
    </nav>

    <!-- USER ACTIONS SECTION -->
    <div :class="appConfig.layout.headerRight">
      <ClientOnly>
        <div :class="appConfig.layout.actionGroup">
          <template v-if="isAuthenticated">
            <span :class="appConfig.typography.headerUsername">
              {{ userProfile?.username || UI_TEXT.common.loading }}
            </span>
            <BaseButton
              icon="i-heroicons-arrow-left-on-rectangle"
              :label="UI_TEXT.auth.logoutTitle"
              variant="smallHollowActionButton"
              @click="handleLogout"
            />
            <UDropdownMenu
              :items="profileDropdownItems"
              :content="{ align: 'end', side: 'bottom', sideOffset: 8 }"
            >
              <UAvatar
                :src="userProfile?.profile_image_url || undefined"
                :alt="userProfile?.username || UI_TEXT.common.user"
                icon="i-heroicons-user"
                :class="INTERACTION_TOKENS.lift"
              />
            </UDropdownMenu>
            <!-- mobile menu button -->
            <BaseButton
              icon="i-heroicons-bars-3"
              variant="ghost"
              :class="appConfig.layout.mobileMenuButton"
            />
          </template>
          <template v-else>
            <BaseButton
              :label="UI_TEXT.auth.loginTitle"
              to="/login"
              variant="smallHollowActionButton"
            />
          </template>
        </div>
      </ClientOnly>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAppConfig } from '#imports';
import { useCurrentUserQuery } from '~/queries/user.query';
import type { DropdownMenuItem } from '@nuxt/ui';

const appConfig = useAppConfig();
const router = useRouter();
const { isAuthenticated, logout } = useAuth();
const { data: userProfile, error } = useCurrentUserQuery();

const profileDropdownItems = ref<DropdownMenuItem[]>([
  { label: UI_TEXT.common.profile, icon: 'i-heroicons-user-circle', to: '/users/profile' },
  { label: UI_TEXT.common.groups, icon: 'i-heroicons-user-group', to: '/groups' },
  { label: UI_TEXT.common.events, icon: 'i-heroicons-calendar-days', to: '/events' },
]);

watch(error, (newError) => {
  if (newError) handleLogout();
});

const handleLogout = () => {
  logout();
  router.push('/login');
};
</script>
