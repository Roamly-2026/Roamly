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
          <UButton
            :class="appConfig.typography.modalActionBtnCancel"
            :label="UI_TEXT.common.cancel"
            variant="actionCancelButton"
            @click="groupsStore.closeJoinModal"
          />
          <UButton
            :class="appConfig.typography.modalActionBtnOk"
            :label="UI_TEXT.common.join"
            variant="actionOkButton"
            :loading="joinMutation.isLoading.value"
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
          <UButton
            :class="appConfig.typography.modalActionBtnCancel"
            :label="UI_TEXT.common.cancel"
            variant="actionCancelButton"
            @click="groupsStore.closeDeclineModal"
          />
          <UButton
            :class="appConfig.typography.modalActionBtnOk"
            :label="UI_TEXT.common.decline"
            variant="actionOkButton"
            :loading="leaveMutation.isLoading.value"
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
