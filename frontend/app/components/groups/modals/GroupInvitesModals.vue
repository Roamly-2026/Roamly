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
import { getErrorMessage } from '~/utils/error.utils';

/* --- COMPOSABLES --- */
const appConfig = useAppConfig();
const groupsStore = useGroupsStore();

/* --- API MUTATIONS --- */
const joinMutation = useJoinGroupMutation({
  onSuccess: () => {
    groupsStore.closeJoinModal();
  },
});

const leaveMutation = useLeaveGroupMutation({
  onSuccess: () => {
    groupsStore.closeDeclineModal();
  },
});

/* --- COMPUTED --- */
const joinErrorText = computed(() =>
  joinMutation.error.value ? getErrorMessage(joinMutation.error.value) : '',
);
const declineErrorText = computed(() =>
  leaveMutation.error.value ? getErrorMessage(leaveMutation.error.value) : '',
);

/* --- HANDLERS --- */
const confirmJoin = () => {
  if (!groupsStore.selectedGroupToJoin) return;
  joinMutation.reset();
  joinMutation.mutate(groupsStore.selectedGroupToJoin.uuid);
};

const confirmDecline = () => {
  if (!groupsStore.selectedGroupToDecline) return;
  leaveMutation.reset();
  leaveMutation.mutate(groupsStore.selectedGroupToDecline.uuid);
};
</script>
