// frontend/app/queries/events.mutation.ts
import { useMutation, useQueryCache } from '@pinia/colada';
import type { Ref } from 'vue';
import { eventsService } from '~/services/eventsService';
import type { EventInDto, RsvpStatus } from '~/types/events.type';
import { useToast } from '#imports';
import { getErrorMessage } from '../utils/error.utils';

interface MutationOptions {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export const useCreateEventMutation = (
  groupUuid: Ref<string | undefined>,
  options?: MutationOptions,
) => {
  const queryCache = useQueryCache();
  const toast = useToast();

  return useMutation({
    mutation: (data: EventInDto) => {
      if (!groupUuid.value) throw new Error(UI_TEXT.errors.groupUuidRequired);
      return eventsService.createEvent(groupUuid.value, data);
    },
    onSuccess: () => {
      toast.add({
        title: UI_TEXT.common.success,
        description: UI_TEXT.events.created,
        class: 'toast-success',
      });
      queryCache.invalidateQueries({ key: ['events', groupUuid.value ?? null] });
      queryCache.invalidateQueries({ key: ['events-dates', groupUuid.value ?? null] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.add({
        title: UI_TEXT.common.error,
        description: getErrorMessage(error),
        class: 'toast-error',
      });
      options?.onError?.(error);
    },
  });
};

export const useDeleteEventMutation = (
  groupUuid: Ref<string | undefined>,
  options?: MutationOptions,
) => {
  const queryCache = useQueryCache();
  const toast = useToast();

  return useMutation({
    mutation: (eventUuid: string) => {
      if (!groupUuid.value) throw new Error(UI_TEXT.errors.groupUuidRequired);
      return eventsService.deleteEvent(groupUuid.value, eventUuid);
    },
    onSuccess: () => {
      toast.add({
        title: UI_TEXT.common.success,
        description: UI_TEXT.events.deleted,
        class: 'toast-success',
      });
      queryCache.invalidateQueries({ key: ['events', groupUuid.value ?? null] });
      queryCache.invalidateQueries({ key: ['events-dates', groupUuid.value ?? null] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.add({
        title: UI_TEXT.common.error,
        description: getErrorMessage(error),
        class: 'toast-error',
      });
      options?.onError?.(error);
    },
  });
};

export const useAddParticipantsMutation = (
  groupUuid: Ref<string | undefined>,
  options?: MutationOptions,
) => {
  const queryCache = useQueryCache();
  const toast = useToast();

  return useMutation({
    mutation: (data: { eventUuid: string; participant_emails: string[] }) => {
      if (!groupUuid.value) throw new Error(UI_TEXT.errors.groupUuidRequired);
      return eventsService.addParticipants(
        groupUuid.value,
        data.eventUuid,
        data.participant_emails,
      );
    },
    onSuccess: () => {
      toast.add({
        title: UI_TEXT.common.success,
        description: UI_TEXT.events.membersAdded,
        class: 'toast-success',
      });
      queryCache.invalidateQueries({ key: ['events', groupUuid.value ?? null] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.add({
        title: UI_TEXT.common.error,
        description: getErrorMessage(error),
        class: 'toast-error',
      });
      options?.onError?.(error);
    },
  });
};

export const useLeaveEventMutation = (
  groupUuid: Ref<string | undefined>,
  options?: MutationOptions,
) => {
  const queryCache = useQueryCache();
  const toast = useToast();

  return useMutation({
    mutation: (data: { eventUuid: string; targetUuid: string }) => {
      if (!groupUuid.value) throw new Error(UI_TEXT.errors.groupUuidRequired);
      return eventsService.removeParticipant(groupUuid.value, data.eventUuid, data.targetUuid);
    },
    onSuccess: () => {
      toast.add({
        title: UI_TEXT.common.success,
        description: UI_TEXT.events.left,
        class: 'toast-success',
      });
      queryCache.invalidateQueries({ key: ['events', groupUuid.value ?? null] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.add({
        title: UI_TEXT.common.error,
        description: getErrorMessage(error),
        class: 'toast-error',
      });
      options?.onError?.(error);
    },
  });
};

export const useRemoveParticipantMutation = (
  groupUuid: Ref<string | undefined>,
  options?: MutationOptions,
) => {
  const queryCache = useQueryCache();
  const toast = useToast();

  return useMutation({
    mutation: (data: { eventUuid: string; targetUuid: string }) => {
      if (!groupUuid.value) throw new Error(UI_TEXT.errors.groupUuidRequired);
      return eventsService.removeParticipant(groupUuid.value, data.eventUuid, data.targetUuid);
    },
    onSuccess: () => {
      toast.add({
        title: UI_TEXT.common.success,
        description: UI_TEXT.events.participantRemoved,
        class: 'toast-success',
      });
      queryCache.invalidateQueries({ key: ['events', groupUuid.value ?? null] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.add({
        title: UI_TEXT.common.error,
        description: getErrorMessage(error),
        class: 'toast-error',
      });
      options?.onError?.(error);
    },
  });
};

export const useSetEventRsvpMutation = (
  groupUuid: Ref<string | undefined>,
  options?: MutationOptions,
) => {
  const queryCache = useQueryCache();
  const toast = useToast();

  return useMutation({
    mutation: (data: { eventUuid: string; status: RsvpStatus | null }) => {
      if (!groupUuid.value) throw new Error(UI_TEXT.errors.groupUuidRequired);
      // a null status removes the user's response
      if (!data.status) {
        return eventsService.removeRsvp(groupUuid.value, data.eventUuid);
      }
      return eventsService.setRsvp(groupUuid.value, data.eventUuid, data.status);
    },
    // the highlighted button is the feedback
    onSuccess: () => {
      queryCache.invalidateQueries({ key: ['events', groupUuid.value ?? null] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.add({
        title: UI_TEXT.common.error,
        description: getErrorMessage(error),
        class: 'toast-error',
      });
      options?.onError?.(error);
    },
  });
};
