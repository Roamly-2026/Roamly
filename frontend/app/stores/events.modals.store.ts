// frontend/app/stores/events.modals.store.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { UiEvent, EventCreatorDto } from '~/types/events.type';

// a pinia store for managing the event related modals, selected groups, and event states
export const useEventsStore = defineStore('events', () => {
  // the uuid of the currently selected group
  // [return value]: string | undefined
  const selectedGroupUuid = ref<string | undefined>(undefined);

  // visibility state of the add day modal
  // [return value]: boolean
  const isAddDayModalOpen = ref(false);
  // visibility state of the delete day modal
  // [return value]: boolean
  const isDeleteDayModalOpen = ref(false);
  // visibility state of the add event modal
  // [return value]: boolean
  const isAddEventModalOpen = ref(false);
  // visibility state of the delete event modal
  // [return value]: boolean
  const isDeleteEventModalOpen = ref(false);
  // visibility state of the participants list modal
  // [return value]: boolean
  const isParticipantsModalOpen = ref(false);
  // visibility state of the event preview modal
  // [return value]: boolean
  const isPreviewModalOpen = ref(false);
  // visibility state of the add members to event modal
  // [return value]: boolean
  const isAddMembersModalOpen = ref(false);
  // visibility state of the leave event modal
  // [return value]: boolean
  const isLeaveEventModalOpen = ref(false);
  // visibility state of the remove participant modal
  // [return value]: boolean
  const isRemoveParticipantModalOpen = ref(false);

  // data of the event selected for deletion
  // [return value]: UiEvent | null
  const selectedEventToDelete = ref<UiEvent | null>(null);
  // data of the event the user wants to leave
  // [return value]: UiEvent | null
  const selectedEventToLeave = ref<UiEvent | null>(null);
  // list of participants for the currently viewed event
  // [return value]: EventCreatorDto[]
  const currentEventParticipants = ref<EventCreatorDto[]>([]);
  // data of the event selected for preview or detailed view
  // [return value]: UiEvent | null
  const previewEvent = ref<UiEvent | null>(null);
  // the date associated with the event being previewed
  // [return value]: string | undefined
  const previewDate = ref<string | undefined>(undefined);
  // data of the participant selected for removal from an event
  // [return value]: EventCreatorDto | null
  const participantToRemove = ref<EventCreatorDto | null>(null);

  // opens the add event modal
  const openAddEventModal = () => (isAddEventModalOpen.value = true);
  // closes the add event modal
  const closeAddEventModal = () => (isAddEventModalOpen.value = false);

  // opens the delete event confirmation modal and closes the preview modal
  // [input value]: event: UiEvent
  const openDeleteEventModal = (event: UiEvent) => {
    selectedEventToDelete.value = event;
    isDeleteEventModalOpen.value = true;
    isPreviewModalOpen.value = false;
  };

  // closes the delete event modal and clears the selected event data
  const closeDeleteEventModal = () => {
    isDeleteEventModalOpen.value = false;
    selectedEventToDelete.value = null;
  };

  // opens the participants modal, loads the members, and closes the preview modal
  // [input value]: event: UiEvent
  const openParticipantsModal = (event: UiEvent) => {
    previewEvent.value = event;
    currentEventParticipants.value = event.members || [];
    isParticipantsModalOpen.value = true;
    isPreviewModalOpen.value = false;
  };

  // closes the participants modal and clears the participants list
  const closeParticipantsModal = () => {
    isParticipantsModalOpen.value = false;
    currentEventParticipants.value = [];
  };

  // opens the event preview modal with the provided event data and optional date
  // [input value]: event: UiEvent, date?: string
  const openPreviewModal = (event: UiEvent, date?: string) => {
    previewEvent.value = event;
    previewDate.value = date;
    isPreviewModalOpen.value = true;
  };

  // closes the event preview modal and clears the preview data
  const closePreviewModal = () => {
    isPreviewModalOpen.value = false;
    previewEvent.value = null;
    previewDate.value = undefined;
  };

  // opens the add members modal, setting the preview event, and closes related modals
  // [input value]: event: UiEvent
  const openAddMembersModal = (event: UiEvent) => {
    previewEvent.value = event;
    isAddMembersModalOpen.value = true;
    isPreviewModalOpen.value = false;
    isParticipantsModalOpen.value = false;
  };

  // closes the add members modal
  const closeAddMembersModal = () => {
    isAddMembersModalOpen.value = false;
  };

  // opens the leave event confirmation modal and closes the preview modal
  // [input value]: event: UiEvent
  const openLeaveEventModal = (event: UiEvent) => {
    selectedEventToLeave.value = event;
    isLeaveEventModalOpen.value = true;
    isPreviewModalOpen.value = false;
  };

  // closes the leave event modal and clears the selected event data
  const closeLeaveEventModal = () => {
    isLeaveEventModalOpen.value = false;
    selectedEventToLeave.value = null;
  };

  // opens the remove participant confirmation modal
  // [input value]: user: EventCreatorDto
  const openRemoveParticipantModal = (user: EventCreatorDto) => {
    participantToRemove.value = user;
    isRemoveParticipantModalOpen.value = true;
  };

  // closes the remove participant modal and clears the selected user data
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
