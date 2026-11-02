// frontend/app/queries/groups.mutation.ts
import { useMutation, useQueryCache } from '@pinia/colada';
import { groupsService } from '~/services/groupsService';
import { useToast } from '#imports';
import { getErrorMessage } from '../utils/error.utils';

interface MutationOptions {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export const useCreateGroupMutation = (options?: MutationOptions) => {
  const queryCache = useQueryCache();
  const toast = useToast();

  return useMutation({
    mutation: (data: { groupName: string }) => groupsService.createGroup(data),
    onSuccess: () => {
      toast.add({
        title: UI_TEXT.common.success,
        description: UI_TEXT.groups.created,
        class: 'toast-success',
      });
      queryCache.invalidateQueries({ key: ['groups', 'list'] });
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

export const useDeleteGroupMutation = (options?: MutationOptions) => {
  const queryCache = useQueryCache();
  const toast = useToast();

  return useMutation({
    mutation: (groupUuid: string) => groupsService.deleteGroup(groupUuid),
    onSuccess: () => {
      toast.add({
        title: UI_TEXT.common.success,
        description: UI_TEXT.groups.deleted,
        class: 'toast-success',
      });
      queryCache.invalidateQueries({ key: ['groups', 'list'] });
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

export const useJoinGroupMutation = (options?: MutationOptions) => {
  const queryCache = useQueryCache();
  const toast = useToast();

  return useMutation({
    mutation: (groupUuid: string) => groupsService.joinGroup(groupUuid),
    onSuccess: () => {
      toast.add({
        title: UI_TEXT.common.success,
        description: UI_TEXT.groups.joined,
        class: 'toast-success',
      });
      queryCache.invalidateQueries({ key: ['groups', 'invites'] });
      queryCache.invalidateQueries({ key: ['groups', 'list'] });
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

export const useLeaveGroupMutation = (options?: MutationOptions) => {
  const queryCache = useQueryCache();
  const toast = useToast();

  return useMutation({
    mutation: (groupUuid: string) => groupsService.leaveGroup(groupUuid),
    onSuccess: () => {
      toast.add({
        title: UI_TEXT.common.success,
        description: UI_TEXT.groups.left,
        class: 'toast-success',
      });
      queryCache.invalidateQueries({ key: ['groups', 'invites'] });
      queryCache.invalidateQueries({ key: ['groups', 'list'] });
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

export const useUpdateGroupMutation = (options?: MutationOptions) => {
  const queryCache = useQueryCache();
  const toast = useToast();

  return useMutation({
    mutation: ({ groupUuid, name }: { groupUuid: string; name: string }) =>
      groupsService.updateGroup(groupUuid, { name }),
    onSuccess: (data, variables) => {
      toast.add({
        title: UI_TEXT.common.success,
        description: UI_TEXT.groups.updated,
        class: 'toast-success',
      });
      queryCache.invalidateQueries({ key: ['groups', 'list'] });
      queryCache.invalidateQueries({ key: ['groups', 'infos', variables.groupUuid] });
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

export const useInviteUserMutation = (options?: MutationOptions) => {
  const toast = useToast();

  return useMutation({
    mutation: ({
      groupUuid,
      data,
    }: {
      groupUuid: string;
      data: { invitedUserEmail: string; inviteWithRole: string };
    }) => groupsService.inviteUser(groupUuid, data),
    onSuccess: () => {
      toast.add({
        title: UI_TEXT.common.success,
        description: UI_TEXT.groups.inviteSuccess,
        class: 'toast-success',
      });
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

export const useRemoveUserMutation = (options?: MutationOptions) => {
  const queryCache = useQueryCache();
  const toast = useToast();

  return useMutation({
    mutation: ({ groupUuid, email }: { groupUuid: string; email: string }) =>
      groupsService.removeUserFromGroup(groupUuid, email),
    onSuccess: (data, variables) => {
      toast.add({
        title: UI_TEXT.common.success,
        description: UI_TEXT.groups.removed,
        class: 'toast-success',
      });
      queryCache.invalidateQueries({ key: ['groups', 'infos', variables.groupUuid] });
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

export const usePromoteUserMutation = (options?: MutationOptions) => {
  const queryCache = useQueryCache();
  const toast = useToast();

  return useMutation({
    mutation: ({ groupUuid, email }: { groupUuid: string; email: string }) =>
      groupsService.promoteUser(groupUuid, email),
    onSuccess: (data, variables) => {
      toast.add({
        title: UI_TEXT.common.success,
        description: UI_TEXT.groups.promoted,
        class: 'toast-success',
      });
      queryCache.invalidateQueries({ key: ['groups', 'infos', variables.groupUuid] });
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

export const useDemoteUserMutation = (options?: MutationOptions) => {
  const queryCache = useQueryCache();
  const toast = useToast();

  return useMutation({
    mutation: ({ groupUuid, email }: { groupUuid: string; email: string }) =>
      groupsService.demoteUser(groupUuid, email),
    onSuccess: (data, variables) => {
      toast.add({
        title: UI_TEXT.common.success,
        description: UI_TEXT.groups.demoted,
        class: 'toast-success',
      });
      queryCache.invalidateQueries({ key: ['groups', 'infos', variables.groupUuid] });
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
