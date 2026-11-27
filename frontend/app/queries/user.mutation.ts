// frontend/app/queries/user.mutation.ts
import { useMutation, useQueryCache } from '@pinia/colada';
import { userService } from '~/services/userService';
import type { UpdateThemePreferencesDto, UserInDto } from '~/types/user.type';
import { useToast } from '#imports';
import { getErrorMessage } from '../utils/error.utils';

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
        class: 'toast-success',
      });
      queryCache.invalidateQueries({ key: ['users', 'current'] });
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

export const useChangePasswordMutation = (options?: MutationOptions) => {
  const toast = useToast();

  return useMutation({
    mutation: (data: { oldPassword: string; newPassword: string }) =>
      userService.changePassword(data),
    onSuccess: () => {
      toast.add({
        title: UI_TEXT.common.success,
        description: UI_TEXT.profile.passwordChanged,
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

export const useDeleteProfileMutation = (options?: MutationOptions) => {
  const toast = useToast();

  return useMutation({
    mutation: () => userService.deleteProfile(),
    onSuccess: () => {
      toast.add({
        title: UI_TEXT.common.success,
        description: UI_TEXT.profile.deleted,
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

export const useUploadProfilePictureMutation = (options?: MutationOptions) => {
  const queryCache = useQueryCache();
  const toast = useToast();

  return useMutation({
    mutation: (file: File) => userService.uploadProfilePicture(file),
    onSuccess: () => {
      toast.add({
        title: UI_TEXT.common.success,
        description: UI_TEXT.profile.pictureUploaded,
        class: 'toast-success',
      });
      queryCache.invalidateQueries({ key: ['users', 'current'] });
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

// Theme mutations don't touch the user cache: useTheme writes the final local state into it
// once every save has settled. A refetch would flip isLoading and make pages flash.
export const useUpdateThemePreferencesMutation = () => {
  const toast = useToast();

  return useMutation({
    mutation: (data: UpdateThemePreferencesDto) => userService.updateThemePreferences(data),
    onError: (error) => {
      toast.add({
        title: UI_TEXT.common.error,
        description: getErrorMessage(error),
        class: 'toast-error',
      });
    },
  });
};

export const useUploadBackgroundMutation = () => {
  return useMutation({
    mutation: (file: File) => userService.uploadBackgroundImage(file),
  });
};
