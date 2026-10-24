<!-- frontend/app/components/users/modals/UserProfileModal.vue -->
<template>
  <BaseModal
    v-model:open="groupsStore.isUserProfileModalOpen"
    :dismissible="true"
    ui-size="sm:max-w-lg w-full max-h-[85vh] flex flex-col"
  >
    <template #body>
      <div class="flex flex-col gap-5 overflow-y-auto custom-scrollbar pr-1">
        <!-- BASIC INFO -->
        <div class="flex flex-col gap-2">
          <div :class="appConfig.layout.profileDetailRow">
            <p :class="appConfig.typography.profileLabel">{{ UI_TEXT.auth.emailLabel }}</p>
            <p :class="appConfig.typography.profileValue">{{ userProfile?.email ?? '—' }}</p>
          </div>
          <div :class="appConfig.layout.profileDetailRow">
            <p :class="appConfig.typography.profileLabel">
              {{ UI_TEXT.groups.roleSelectionLabel }}
            </p>
            <p :class="[appConfig.typography.profileValue, 'capitalize']">
              {{ userProfile?.role ?? '—' }}
            </p>
          </div>
          <div :class="appConfig.layout.profileDetailRow">
            <p :class="appConfig.typography.profileLabel">{{ UI_TEXT.common.joined }}</p>
            <p :class="appConfig.typography.profileValue">
              {{ userProfile?.joinedAt.slice(0, 10) ?? '—' }}
            </p>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end">
        <BaseButton
          :label="UI_TEXT.common.close"
          variant="actionOkButton"
          @click="groupsStore.closeUserProfileModal()"
        />
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAppConfig } from '#imports';
import { useGroupsStore } from '~/stores/groups.modals.store';

const appConfig = useAppConfig();
const groupsStore = useGroupsStore();

const userProfile = computed(() => groupsStore.selectedUserProfile);
</script>
