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
      :ui-size="appConfig.layout.modalSizeMd"
      @cancel="eventsStore.closeDeleteEventModal()"
      @confirm="handleConfirmDelete"
    >
      <template #body>
        <p :class="appConfig.typography.modalText">
          {{ ' ' + UI_TEXT.events.deleteBeforeTitle
          }}{{ eventsStore.selectedEventToDelete?.title }}"?
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
      :ui-size="appConfig.layout.modalSizeMd"
      @cancel="eventsStore.closeLeaveEventModal()"
      @confirm="handleConfirmLeave"
    >
      <template #body>
        <p :class="appConfig.typography.modalText">
          {{ ' ' + UI_TEXT.events.leaveBeforeTitle }}{{ eventsStore.selectedEventToLeave?.title }}"?
        </p>
      </template>
    </ConfirmModal>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAppConfig, useToast } from '#imports';
import { useEventsStore } from '~/stores/events.modals.store';
import { useCurrentUserQuery } from '~/queries/user.query';
import { useDeleteEventMutation, useLeaveEventMutation } from '~/queries/events.mutation';
import { getErrorMessage } from '~/utils/error.utils';

const appConfig = useAppConfig();
const toast = useToast();
const eventsStore = useEventsStore();

const { data: currentUser } = useCurrentUserQuery();
const currentUserEmail = computed(() => currentUser.value?.email);

const deleteEventMutation = useDeleteEventMutation(
  computed(() => eventsStore.selectedGroupUuid),
  {
    onSuccess: () => {
      eventsStore.closeDeleteEventModal();
      eventsStore.closePreviewModal();
      toast.add({ title: UI_TEXT.common.success, description: UI_TEXT.events.deleted });
    },
    onError: (err) =>
      toast.add({ title: UI_TEXT.common.error, description: getErrorMessage(err) }),
  },
);

const leaveEventMutation = useLeaveEventMutation(
  computed(() => eventsStore.selectedGroupUuid),
  {
    onSuccess: () => {
      eventsStore.closeLeaveEventModal();
      eventsStore.closePreviewModal();
      toast.add({ title: UI_TEXT.common.success, description: UI_TEXT.events.left });
    },
    onError: (err) =>
      toast.add({ title: UI_TEXT.common.error, description: getErrorMessage(err) }),
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
