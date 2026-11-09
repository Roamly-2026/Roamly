// frontend/app/stores/events.modals.store.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { UiEvent, EventCreatorDto, EventCoordinates } from '~/types/events.type';

/**
 * Manages modal visibility and active event context for itinerary and event operations.
 */
export const useEventsStore = defineStore('events', () => {
  const selectedGroupUuid = ref<string | undefined>(undefined);

  const isAddDayModalOpen = ref(false);
  const isDeleteDayModalOpen = ref(false);
  const isAddEventModalOpen = ref(false);
  const isDeleteEventModalOpen = ref(false);
  const isParticipantsModalOpen = ref(false);
  const isPreviewModalOpen = ref(false);
  const isAddMembersModalOpen = ref(false);
  const isLeaveEventModalOpen = ref(false);
  const isRemoveParticipantModalOpen = ref(false);

  const selectedEventToDelete = ref<UiEvent | null>(null);
  const selectedEventToLeave = ref<UiEvent | null>(null);
  const currentEventParticipants = ref<EventCreatorDto[]>([]);
  const previewEvent = ref<UiEvent | null>(null);
  const previewDate = ref<string | undefined>(undefined);
  const participantToRemove = ref<EventCreatorDto | null>(null);

  // location picked on the big map, used to prefill the event creation modal
  const prefilledLocation = ref<EventCoordinates | null>(null);
  // set after an event is created from the map, so the map can focus on it
  const createdEventLocation = ref<EventCoordinates | null>(null);

  const openAddEventModal = (location?: EventCoordinates) => {
    prefilledLocation.value = location ?? null;
    isAddEventModalOpen.value = true;
  };
  const closeAddEventModal = () => (isAddEventModalOpen.value = false);

  // Transitions from the event preview modal directly to the delete confirmation modal
  const openDeleteEventModal = (event: UiEvent) => {
    selectedEventToDelete.value = event;
    isDeleteEventModalOpen.value = true;
    isPreviewModalOpen.value = false;
  };

  const closeDeleteEventModal = () => {
    isDeleteEventModalOpen.value = false;
    selectedEventToDelete.value = null;
  };

  // Replaces the preview modal with the participants view and hydrates the member list
  const openParticipantsModal = (event: UiEvent) => {
    previewEvent.value = event;
    currentEventParticipants.value = event.members || [];
    isParticipantsModalOpen.value = true;
    isPreviewModalOpen.value = false;
  };

  const closeParticipantsModal = () => {
    isParticipantsModalOpen.value = false;
    currentEventParticipants.value = [];
  };

  const openPreviewModal = (event: UiEvent, date?: string) => {
    previewEvent.value = event;
    previewDate.value = date;
    isPreviewModalOpen.value = true;
  };

  const closePreviewModal = () => {
    isPreviewModalOpen.value = false;
    previewEvent.value = null;
    previewDate.value = undefined;
  };

  // Transitions from either the preview or participants modal to the member assignment modal
  const openAddMembersModal = (event: UiEvent) => {
    previewEvent.value = event;
    isAddMembersModalOpen.value = true;
    isPreviewModalOpen.value = false;
    isParticipantsModalOpen.value = false;
  };

  const closeAddMembersModal = () => {
    isAddMembersModalOpen.value = false;
  };

  // Transitions from the event preview modal to the leave confirmation modal
  const openLeaveEventModal = (event: UiEvent) => {
    selectedEventToLeave.value = event;
    isLeaveEventModalOpen.value = true;
    isPreviewModalOpen.value = false;
  };

  const closeLeaveEventModal = () => {
    isLeaveEventModalOpen.value = false;
    selectedEventToLeave.value = null;
  };

  const openRemoveParticipantModal = (user: EventCreatorDto) => {
    participantToRemove.value = user;
    isRemoveParticipantModalOpen.value = true;
  };

  const closeRemoveParticipantModal = () => {
    isRemoveParticipantModalOpen.value = false;
    participantToRemove.value = null;
  };

  return {
    selectedGroupUuid,
    isAddDayModalOpen,
    isDeleteDayModalOpen,
    isAddEventModalOpen,
    isDeleteEventModalOpen,
    isParticipantsModalOpen,
    isPreviewModalOpen,
    isAddMembersModalOpen,
    isLeaveEventModalOpen,
    isRemoveParticipantModalOpen,
    selectedEventToDelete,
    selectedEventToLeave,
    currentEventParticipants,
    previewEvent,
    previewDate,
    participantToRemove,
    prefilledLocation,
    createdEventLocation,
    openAddEventModal,
    closeAddEventModal,
    openDeleteEventModal,
    closeDeleteEventModal,
    openParticipantsModal,
    closeParticipantsModal,
    openPreviewModal,
    closePreviewModal,
    openAddMembersModal,
    closeAddMembersModal,
    openLeaveEventModal,
    closeLeaveEventModal,
    openRemoveParticipantModal,
    closeRemoveParticipantModal,
  };
});
