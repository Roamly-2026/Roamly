<!-- frontend/app/layouts/general.vue -->
<template>
  <div :class="[appConfig.layout.base, bgClass]">
    <GeneralHeader />

    <main :class="appConfig.layout.mainDefault">
      <slot />
    </main>

    <footer :class="appConfig.footer.base">
      <div :class="appConfig.footer.text">{{ UI_TEXT.common.copyright }}</div>
    </footer>

    <GroupModals />
    <GroupInvitesModals />
    <GroupMembersModals />
    <ProfileModals />
    <UserProfileModal />
    <EventsModals />
    <PrivateDocumentsModals />
    <GroupDocumentsModals />
    <PrivateDocumentsSharingModals />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useAppConfig } from '#imports';
const { preferences } = useTheme();

const isMounted = ref(false);
const route = useRoute();
const appConfig = useAppConfig();

// The name of the current page
const pageName = computed(() => {
  const name = route.name ? String(route.name).split('-')[0] : 'home';
  return name ?? 'home';
});

onMounted(() => {
  isMounted.value = true;
});

// Background class
const bgClass = computed(() => {
  if (isMounted.value && preferences.value.background_type !== 'system') {
    return '!bg-transparent';
  }

  switch (pageName.value) {
    case 'groups':
      return CONST_BG_GROUPS;
    case 'profile':
      return CONST_BG_PROFILE;
    default:
      return CONST_BG_GROUPS;
  }
});
</script>
