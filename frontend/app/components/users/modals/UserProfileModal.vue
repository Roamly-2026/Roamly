<!-- frontend/app/components/users/modals/UserProfileModal.vue -->
<template>
  <BaseModal
    v-model:open="groupsStore.isUserProfileModalOpen"
    :dismissible="true"
    :ui-size="LAYOUT_CONFIG.modalSizeMd"
  >
    <template #body>
      <div :class="LAYOUT_CONFIG.modalScrollBody">
        <div :class="LAYOUT_CONFIG.modalFormGroup">
          <div :class="LAYOUT_CONFIG.profileDetailRow">
            <p :class="TYPOGRAPHY_CONFIG.profileLabel">{{ UI_TEXT.auth.emailLabel }}</p>
            <p :class="TYPOGRAPHY_CONFIG.profileValue">{{ userProfile?.email ?? '—' }}</p>
          </div>
          <div :class="LAYOUT_CONFIG.profileDetailRow">
            <p :class="TYPOGRAPHY_CONFIG.profileLabel">
              {{ UI_TEXT.groups.roleSelectionLabel }}
            </p>
            <p :class="[TYPOGRAPHY_CONFIG.profileValue, 'capitalize']">
              {{ userProfile?.role ?? '—' }}
            </p>
          </div>
          <div :class="LAYOUT_CONFIG.profileDetailRow">
            <p :class="TYPOGRAPHY_CONFIG.profileLabel">{{ UI_TEXT.common.joined }}</p>
            <p :class="TYPOGRAPHY_CONFIG.profileValue">
              {{ userProfile?.joinedAt.slice(0, 10) ?? '—' }}
            </p>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div :class="LAYOUT_CONFIG.rightButtonWrapper">
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
import { useGroupsStore } from '~/stores/groups.modals.store';

const groupsStore = useGroupsStore();

const userProfile = computed(() => groupsStore.selectedUserProfile);
</script>
