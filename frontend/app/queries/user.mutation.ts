// frontend/app/queries/user.mutation.ts
import { useMutation, useQueryCache } from '@pinia/colada';
import { userService } from '~/services/userService';
import type { UpdateThemePreferencesDto, UserInDto } from '~/types/user.type';
import { useToast } from '#imports';
import { getErrorMessage } from '../utils/error.utils';
import type { ColorMode } from '~/utils/themes';

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

// Silent save for theme / color mode switches (no success toast)
export const useUpdateAppearanceMutation = () => {
  const queryCache = useQueryCache();
  const toast = useToast();

  return useMutation({
    mutation: (data: { theme_key?: string; color_mode?: ColorMode }) =>
      userService.updateProfile(data),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: ['users', 'current'] });
    },
    onError: (error) => {
      toast.add({
        title: UI_TEXT.common.error,
        description: getErrorMessage(error),
        class: 'toast-error',
      });
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

export const useUpdateThemePreferencesMutation = () => {
  const queryCache = useQueryCache();

  return useMutation({
    mutation: (data: UpdateThemePreferencesDto) => userService.updateThemePreferences(data),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: ['users', 'current'] });
    },
  });
};

export const useUploadBackgroundMutation = () => {
  const queryCache = useQueryCache();

  return useMutation({
    mutation: (file: File) => userService.uploadBackgroundImage(file),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: ['users', 'current'] });
    },
  });
};
