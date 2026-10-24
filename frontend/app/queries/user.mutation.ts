// frontend/app/queries/user.mutation.ts
import { useMutation, useQueryCache } from '@pinia/colada';
import { userService } from '~/services/userService';
import type { UserInDto } from '~/types/user.type';
import { useToast } from '#imports';
import { getErrorMessage } from '../utils/error.utils';
import { UI_TEXT } from '~/locales/en';

interface MutationOptions {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export const useCreateUserMutation = (options?: MutationOptions) => {
  const toast = useToast();

  return useMutation({
    mutation: (newUser: UserInDto) => userService.createUser(newUser),
    onSuccess: () => {
      toast.add({
        title: UI_TEXT.common.success,
        description: UI_TEXT.auth.registerSuccess,
        color: 'success',
      });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.add({
        title: UI_TEXT.common.error,
        description: getErrorMessage(error),
        color: 'error',
      });
      options?.onError?.(error);
    },
  });
};

export const useUpdateProfileMutation = (options?: MutationOptions) => {
  const queryCache = useQueryCache();
  const toast = useToast();

  return useMutation({
    mutation: (data: { username?: string; email?: string; phone_number?: string }) =>
      userService.updateProfile(data),
    onSuccess: () => {
      toast.add({
        title: UI_TEXT.common.success,
        description: UI_TEXT.profile.updated,
        color: 'success',
      });
      queryCache.invalidateQueries({ key: ['users', 'current'] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.add({
        title: UI_TEXT.common.error,
        description: getErrorMessage(error),
        color: 'error',
      });
      options?.onError?.(error);
    },
  });
};

export const useChangePasswordMutation = (options?: MutationOptions) => {
  const toast = useToast();

  return useMutation({
    mutation: (data: { oldPassword: string; newPassword: string }) =>
      userService.changePassword(data),
    onSuccess: () => {
      toast.add({
        title: UI_TEXT.common.success,
        description: UI_TEXT.profile.passwordChanged,
        color: 'success',
      });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.add({
        title: UI_TEXT.common.error,
        description: getErrorMessage(error),
        color: 'error',
      });
      options?.onError?.(error);
    },
  });
};

export const useDeleteProfileMutation = (options?: MutationOptions) => {
  const toast = useToast();

  return useMutation({
    mutation: () => userService.deleteProfile(),
    onSuccess: () => {
      toast.add({
        title: UI_TEXT.common.success,
        description: UI_TEXT.profile.deleted,
        color: 'success',
      });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.add({
        title: UI_TEXT.common.error,
        description: getErrorMessage(error),
        color: 'error',
      });
      options?.onError?.(error);
    },
  });
};

export const useUploadProfilePictureMutation = (options?: MutationOptions) => {
  const queryCache = useQueryCache();
  const toast = useToast();

  return useMutation({
    mutation: (file: File) => userService.uploadProfilePicture(file),
    onSuccess: () => {
      toast.add({
        title: UI_TEXT.common.success,
        description: UI_TEXT.profile.pictureUploaded,
        color: 'success',
      });
      queryCache.invalidateQueries({ key: ['users', 'current'] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.add({
        title: UI_TEXT.common.error,
        description: getErrorMessage(error),
        color: 'error',
      });
      options?.onError?.(error);
    },
  });
};
