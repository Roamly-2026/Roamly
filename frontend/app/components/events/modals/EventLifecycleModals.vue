<!-- frontend/app/components/events/modals/EventLifecycleModals.vue -->
<template>
  <div>
    <!-- DELETE EVENT MODAL -->
    <ConfirmModal
      v-model:open="eventsStore.isDeleteEventModalOpen"
      :title="UI_TEXT.events.deleteEvent"
      :cancel-text="UI_TEXT.common.cancel"
      :confirm-text="UI_TEXT.common.delete"
      :loading="deleteEventMutation.isLoading.value"
      :ui-size="LAYOUT_CONFIG.modalSizeMd"
      @cancel="eventsStore.closeDeleteEventModal()"
      @confirm="handleConfirmDelete"
    >
      <template #body>
        <p :class="TYPOGRAPHY_CONFIG.modalText">
          {{ ' ' + UI_TEXT.events.deleteBeforeTitle }}
          <span :class="TYPOGRAPHY_CONFIG.modalInlineHighlight"
            >„{{ eventsStore.selectedEventToDelete?.title }}”</span
          >?
        </p>
      </template>
    </ConfirmModal>

    <!-- LEAVE EVENT MODAL -->
    <ConfirmModal
      v-model:open="eventsStore.isLeaveEventModalOpen"
      :title="UI_TEXT.events.leaveEvent"
      :cancel-text="UI_TEXT.common.cancel"
      :confirm-text="UI_TEXT.common.leave"
      :loading="leaveEventMutation.isLoading.value"
      :ui-size="LAYOUT_CONFIG.modalSizeMd"
      @cancel="eventsStore.closeLeaveEventModal()"
      @confirm="handleConfirmLeave"
    >
      <template #body>
        <p :class="TYPOGRAPHY_CONFIG.modalText">
          {{ ' ' + UI_TEXT.events.leaveBeforeTitle }}
          <span :class="TYPOGRAPHY_CONFIG.modalInlineHighlight"
            >„{{ eventsStore.selectedEventToLeave?.title }}”</span
          >?
        </p>
      </template>
    </ConfirmModal>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useEventsStore } from '~/stores/events.modals.store';
import { useCurrentUserQuery } from '~/queries/user.query';
import { useDeleteEventMutation, useLeaveEventMutation } from '~/queries/events.mutation';

const eventsStore = useEventsStore();

const { data: currentUser } = useCurrentUserQuery();
const currentUserEmail = computed(() => currentUser.value?.email);

const deleteEventMutation = useDeleteEventMutation(
  computed(() => eventsStore.selectedGroupUuid),
  {
    onSuccess: () => {
      eventsStore.closeDeleteEventModal();
      eventsStore.closePreviewModal();
    },
  },
);

const leaveEventMutation = useLeaveEventMutation(
  computed(() => eventsStore.selectedGroupUuid),
  {
    onSuccess: () => {
      eventsStore.closeLeaveEventModal();
      eventsStore.closePreviewModal();
    },
  },
);

const handleConfirmDelete = () => {
  const eventToDelete = eventsStore.selectedEventToDelete;
  if (eventToDelete) deleteEventMutation.mutate(eventToDelete.uuid);
};

const handleConfirmLeave = () => {
  const eventToLeave = eventsStore.selectedEventToLeave;
  if (!eventToLeave) return;
  const myRecord = eventToLeave.members.find((m) => m.email === currentUserEmail.value);
  if (myRecord) {
    leaveEventMutation.mutate({ eventUuid: eventToLeave.uuid, targetUuid: myRecord.uuid });
  }
};
</script>
