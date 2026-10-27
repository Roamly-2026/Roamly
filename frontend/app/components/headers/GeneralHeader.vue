<!-- frontend/app/components/headers/GeneralHeader.vue -->
<template>
  <header :class="[appConfig.layout.headerBase, appConfig.layout.headerSticky]">
    <!-- BACK BUTTON SECTION -->
    <div :class="appConfig.layout.headerLeft">
      <BaseButton icon="i-heroicons-arrow-left" variant="glassIconButton" to="/" />
    </div>

    <!-- LOGO SECTION -->
    <div :class="appConfig.layout.headerCenter">
      <NuxtLink to="/" :class="appConfig.layout.logoWrapper">
        <UIcon
          name="i-heroicons-map-pin"
          :class="[SIZE_TOKENS.icon.lg, COLOR_TOKENS.text.brandAccent]"
        />
        <span :class="appConfig.typography.logoText">{{ UI_TEXT.common.brandName }}</span>
      </NuxtLink>
    </div>

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

            <!-- Desktop menu -->
            <UDropdownMenu
              v-if="!isMobile"
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

            <!-- Mobile menu -->
            <UAvatar
              v-if="isMobile"
              :src="userProfile?.profile_image_url || undefined"
              :alt="userProfile?.username || UI_TEXT.common.user"
              icon="i-heroicons-user"
            />

            <UDropdownMenu
              :items="profileDropdownItems"
              :content="{ align: 'end', side: 'bottom', sideOffset: 8 }"
              :ui="DROPDOWN_MENU_CONFIG.slots"
            >
              <BaseButton
                icon="i-heroicons-bars-3"
                variant="ghost"
                :class="appConfig.layout.mobileMenuButton"
              />
            </UDropdownMenu>
          </template>
        </div>
      </ClientOnly>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAppConfig } from '#imports';
import { useCurrentUserQuery } from '~/queries/user.query';
import { useScreenSize } from '~/composables/useScreenSize';
import type { DropdownMenuItem } from '@nuxt/ui';

const appConfig = useAppConfig();
const router = useRouter();
const { isAuthenticated, logout } = useAuth();
const { data: userProfile } = useCurrentUserQuery();
const { isMobile } = useScreenSize();

const profileDropdownItems = ref<DropdownMenuItem[]>([
  { label: UI_TEXT.common.profile, icon: 'i-heroicons-user-circle', to: '/users/profile' },
  { label: UI_TEXT.common.groups, icon: 'i-heroicons-user-group', to: '/groups' },
  { label: UI_TEXT.common.events, icon: 'i-heroicons-calendar-days', to: '/events' },
  {
    label: UI_TEXT.common.logout,
    icon: 'i-heroicons-arrow-left-on-rectangle',
    onSelect: () => handleLogout(),
    class: 'text-red-500 font-semibold',
  },
]);

const handleLogout = () => {
  logout();
  router.push('/login');
};
</script>
