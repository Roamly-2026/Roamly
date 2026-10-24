<!-- frontend/app/components/groups/modals/GroupInvitesModals.vue -->
<template>
  <div>
    <!-- JOIN MODAL -->
    <UModal
      v-model:open="groupsStore.isJoinModalOpen"
      :title="UI_TEXT.groups.joinTitle"
      :dismissible="false"
      :close="false"
      :ui="{ content: appConfig.layout.modalSizeSm }"
    >
      <template #default><div class="hidden"></div></template>
      <template #body>
        <p :class="appConfig.typography.modalText">
          {{ UI_TEXT.groups.joinConfirmation }}
          <span v-if="groupsStore.selectedGroupToJoin" :class="appConfig.typography.modalHighlight">
            „{{ groupsStore.selectedGroupToJoin.name }}”
          </span>
        </p>
        <p v-if="joinErrorText" :class="appConfig.typography.modalErrorBox">
          {{ joinErrorText }}
        </p>
      </template>
      <template #footer>
        <div :class="appConfig.layout.modalActions">
          <BaseButton
            :class="appConfig.typography.modalActionBtnCancel"
            :label="UI_TEXT.common.cancel"
            variant="actionCancelButton"
            @click="groupsStore.closeJoinModal"
          />
          <BaseButton
            :class="appConfig.typography.modalActionBtnOk"
            :label="UI_TEXT.common.join"
            variant="actionOkButton"
            :loading="isJoining"
            @click="confirmJoin"
          />
        </div>
      </template>
    </UModal>

    <!-- DECLINE MODAL -->
    <UModal
      v-model:open="groupsStore.isDeclineModalOpen"
      :title="UI_TEXT.groups.declineInviteTitle"
      :dismissible="false"
      :close="false"
      :ui="{ content: appConfig.layout.modalSizeSm }"
    >
      <template #default><div class="hidden"></div></template>
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
        <p v-if="declineErrorText" :class="appConfig.typography.modalErrorBox">
          {{ declineErrorText }}
        </p>
      </template>
      <template #footer>
        <div :class="appConfig.layout.modalActions">
          <BaseButton
            :class="appConfig.typography.modalActionBtnCancel"
            :label="UI_TEXT.common.cancel"
            variant="actionCancelButton"
            @click="groupsStore.closeDeclineModal"
          />
          <BaseButton
            :class="appConfig.typography.modalActionBtnOk"
            :label="UI_TEXT.common.decline"
            variant="actionOkButton"
            :loading="isLeaving"
            @click="confirmDecline"
          />
        </div>
      </template>
    </UModal>
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
