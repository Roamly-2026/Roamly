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
      :ui-size="LAYOUT_CONFIG.modalSizeSm"
      @cancel="groupsStore.closeJoinModal"
      @confirm="confirmJoin"
    >
      <template #body>
        <p :class="TYPOGRAPHY_CONFIG.modalText">
          {{ UI_TEXT.groups.joinConfirmation }}
          <span v-if="groupsStore.selectedGroupToJoin" :class="TYPOGRAPHY_CONFIG.modalHighlight">
            „{{ groupsStore.selectedGroupToJoin.name }}”
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
import { useJoinGroupMutation } from '~/queries/groups.mutation';
import { getErrorMessage } from '~/utils/error.utils';

/* --- COMPOSABLES --- */
const groupsStore = useGroupsStore();

const isJoining = computed(() => joinMutation.isLoading.value);

/* --- API MUTATIONS --- */
const joinMutation = useJoinGroupMutation({
  onSuccess: () => {
    groupsStore.closeJoinModal();
  },
});

/* --- COMPUTED --- */
const joinErrorText = computed(() =>
  joinMutation.error.value ? getErrorMessage(joinMutation.error.value) : '',
);

/* --- HANDLERS --- */
const confirmJoin = () => {
  if (!groupsStore.selectedGroupToJoin) return;
  joinMutation.reset();
  joinMutation.mutate(groupsStore.selectedGroupToJoin.uuid);
};
</script>
