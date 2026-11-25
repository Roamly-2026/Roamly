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
import { useEventPermissions } from '~/composables/useEventPermissions';
import { useEventsStore } from '~/stores/events.modals.store';
import { useDeleteEventMutation, useLeaveEventMutation } from '~/queries/events.mutation';

const eventsStore = useEventsStore();
const groupUuid = computed(() => eventsStore.selectedGroupUuid);
const { currentUserUuid, canManageEvent, canLeaveEvent } = useEventPermissions(groupUuid);

const deleteEventMutation = useDeleteEventMutation(groupUuid, {
  onSuccess: () => {
    eventsStore.closeDeleteEventModal();
    eventsStore.closePreviewModal();
  },
});

const leaveEventMutation = useLeaveEventMutation(groupUuid, {
  onSuccess: () => {
    eventsStore.closeLeaveEventModal();
    eventsStore.closePreviewModal();
  },
});

const handleConfirmDelete = () => {
  const event = eventsStore.selectedEventToDelete;
  if (event && canManageEvent(event)) deleteEventMutation.mutate(event.uuid);
};

const handleConfirmLeave = () => {
  const event = eventsStore.selectedEventToLeave;
  const userUuid = currentUserUuid.value;
  if (!event || !userUuid || !canLeaveEvent(event)) return;

  leaveEventMutation.mutate({ eventUuid: event.uuid, targetUuid: userUuid });
};
</script>
