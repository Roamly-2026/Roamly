<!-- frontend/app/components/users/modals/UserProfileModal.vue -->
<template>
  <BaseModal
    v-model:open="groupsStore.isUserProfileModalOpen"
    :dismissible="true"
    ui-size="sm:max-w-lg w-full max-h-[85vh] flex flex-col"
  >
    <!-- Override default header to keep the original headerless design -->
    <template #header>
      <div class="hidden"></div>
    </template>
    
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
        <UButton
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
//import { useGroupMemberDocumentsQuery } from '~/queries/files.query';
//import type { PrivateDocumentMetadata } from '~/types/files.type';

const appConfig = useAppConfig();
const groupsStore = useGroupsStore();

/*
const props = defineProps<{
  groupUuid?: string;
}>();
*/

const userProfile = computed(() => groupsStore.selectedUserProfile);

/*
// targetUserUuid scopes the request to this specific member.
// The backend's getAllPrivateDocumentsMetadataOfAllUsersInAGroup already supports
// ?targetUserUuid= — so this returns only files owned by the opened member,
// not all members' files.
const targetUserUuid = computed(() => userProfile.value?.userUuid);

const { data: memberDocsData, isLoading: isLoadingDocs } = useGroupMemberDocumentsQuery(
  () => props.groupUuid || '',
  // enabled: only fire when the modal is open, the viewer is a leader,
  // and we have both the groupUuid and the target user's UUID
  () => !!(props.groupUuid && userProfile.value?.canViewDocuments && userProfile.value?.userUuid),
  // targetUserUuid — filters to just this member's documents
  () => targetUserUuid.value,
);

const memberDocuments = computed<PrivateDocumentMetadata[]>(() => memberDocsData.value ?? []); */
</script>
