<!-- frontend/app/components/headers/AppHeader.vue -->
<template>
  <header :class="[LAYOUT_CONFIG.headerBase, LAYOUT_CONFIG.headerSticky]">
    <!-- LOGO SECTION -->
    <div :class="LAYOUT_CONFIG.headerLeft">
      <NuxtLink to="/#home" :class="LAYOUT_CONFIG.logoWrapper">
        <UIcon name="i-heroicons-map-pin" :class="TYPOGRAPHY_CONFIG.iconBrandLg" />
        <span :class="TYPOGRAPHY_CONFIG.logoText">{{ UI_TEXT.common.brandName }}</span>
      </NuxtLink>
    </div>

    <!-- DESKTOP NAV SECTION -->
    <nav :class="LAYOUT_CONFIG.navWrapper">
      <NuxtLink to="/#home" :class="TYPOGRAPHY_CONFIG.navLink">{{ UI_TEXT.home.title }}</NuxtLink>
      <NuxtLink to="/#about" :class="TYPOGRAPHY_CONFIG.navLink">{{
        UI_TEXT.home.aboutTitle
      }}</NuxtLink>
      <NuxtLink to="/#support" :class="TYPOGRAPHY_CONFIG.navLink">{{
        UI_TEXT.home.supportTitle
      }}</NuxtLink>
    </nav>

    <!-- USER ACTIONS SECTION -->
    <div :class="LAYOUT_CONFIG.headerRight">
      <ClientOnly>
        <div :class="LAYOUT_CONFIG.actionGroup">
          <template v-if="isAuthenticated">
            <span :class="TYPOGRAPHY_CONFIG.headerUsername">
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
              :ui="DROPDOWN_MENU_CONFIG.slots"
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
              :class="LAYOUT_CONFIG.mobileMenuButton"
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
import { useCurrentUserQuery } from '~/queries/user.query';
import type { DropdownMenuItem } from '@nuxt/ui';

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
