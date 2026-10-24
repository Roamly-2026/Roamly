<!-- frontend/app/components/groups/modals/GroupInvitesModals.vue -->
<template>
  <div>
    <!-- JOIN MODAL -->
    <ConfirmModal
      v-model:open="groupsStore.isJoinModalOpen"
      :title="UI_TEXT.groups.joinTitle"
      :error-text="joinErrorText"
      :cancel-text="UI_TEXT.common.cancel"
      :confirm-text="UI_TEXT.common.join"
      :loading="isJoining"
      :ui-size="appConfig.layout.modalSizeSm"
      @cancel="groupsStore.closeJoinModal"
      @confirm="confirmJoin"
    >
      <template #body>
        <p :class="appConfig.typography.modalText">
          {{ UI_TEXT.groups.joinConfirmation }}
          <span v-if="groupsStore.selectedGroupToJoin" :class="appConfig.typography.modalHighlight">
            „{{ groupsStore.selectedGroupToJoin.name }}”
          </span>
        </p>
      </template>
    </ConfirmModal>

    <!-- DECLINE MODAL -->
    <ConfirmModal
      v-model:open="groupsStore.isDeclineModalOpen"
      :title="UI_TEXT.groups.declineInviteTitle"
      :error-text="declineErrorText"
      :cancel-text="UI_TEXT.common.cancel"
      :confirm-text="UI_TEXT.common.decline"
      :loading="isLeaving"
      :ui-size="appConfig.layout.modalSizeSm"
      @cancel="groupsStore.closeDeclineModal"
      @confirm="confirmDecline"
    >
      <template #body>
        <p :class="appConfig.typography.modalText">
          {{ UI_TEXT.groups.declineInviteConfirmation }}
          <span
            v-if="groupsStore.selectedGroupToDecline"
            :class="appConfig.typography.modalHighlight"
          >
            „{{ groupsStore.selectedGroupToDecline.name }}”
          </span>
        </p>
      </template>
    </ConfirmModal>
  </div>
</template>

<script setup lang="ts">
/* --- IMPORTS --- */
import { computed } from 'vue';
import { useGroupsStore } from '~/stores/groups.modals.store';
import { useJoinGroupMutation, useLeaveGroupMutation } from '~/queries/groups.mutation';
import { useAppConfig } from '#imports';

/* --- COMPOSABLES --- */
const appConfig = useAppConfig();
const groupsStore = useGroupsStore();

/* --- API MUTATIONS --- */
const {
  mutate: joinGroup,
  isLoading: isJoining,
  error: joinApiError,
  reset: resetJoin,
} = useJoinGroupMutation({
  onSuccess: () => groupsStore.closeJoinModal(),
});

const {
  mutate: leaveGroup,
  isLoading: isLeaving,
  error: declineApiError,
  reset: resetDecline,
} = useLeaveGroupMutation({
  onSuccess: () => groupsStore.closeDeclineModal(),
});

/* --- COMPUTED --- */
const joinErrorText = computed(() =>
  joinApiError.value ? getErrorMessage(joinApiError.value) : '',
);
const declineErrorText = computed(() =>
  declineApiError.value ? getErrorMessage(declineApiError.value) : '',
);

/* --- HANDLERS --- */
const confirmJoin = () => {
  if (!groupsStore.selectedGroupToJoin) return;
  resetJoin();
  joinGroup(groupsStore.selectedGroupToJoin.uuid);
};

const confirmDecline = () => {
  if (!groupsStore.selectedGroupToDecline) return;
  resetDecline();
  leaveGroup(groupsStore.selectedGroupToDecline.uuid);
};
</script>
