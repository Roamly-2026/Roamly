// frontend/app/queries/auth.mutation.ts
import { useMutation } from '@pinia/colada';
import { useAuth } from '~/composables/useAuth';
import { authService } from '~/services/authService';
import type { LoginFormState } from '~/utils/schemas/login.schema';
import { useToast } from '#imports';
import { getErrorMessage } from '../utils/error.utils';
import { UI_TEXT } from '../locales/en';

export const useLoginUserMutation = (onSuccessCallback?: () => void) => {
  const { login } = useAuth();
  const toast = useToast();

  return useMutation({
    mutation: (credentials: LoginFormState) => login(credentials),
    onSuccess: () => {
      // the user will be automatically redirected, we are not showing a success toast msg here
      onSuccessCallback?.();
    },
    onError: (error) => {
      toast.add({
        title: UI_TEXT.auth.loginError,
        description: getErrorMessage(error),
        color: 'error',
      });
    },
  });
};

export const useVerifyEmailMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const toast = useToast();

  return useMutation({
    mutation: ({ email, otp }: { email: string; otp: string }) =>
      authService.verifyEmail(email, otp),

    onSuccess: () => {
      toast.add({
        title: UI_TEXT.common.success,
        description: UI_TEXT.auth.verified,
        color: 'success',
      });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.add({
        title: UI_TEXT.auth.verificationError,
        description: getErrorMessage(error),
        color: 'error',
      });
      options?.onError?.(error);
    },
  });
};

export const useResendVerificationMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const toast = useToast();

  return useMutation({
    mutation: (email: string) => authService.resendVerification(email),
    onSuccess: () => {
      toast.add({
        title: UI_TEXT.auth.emailSent,
        description: UI_TEXT.auth.emailSentDescription,
        color: 'success',
      });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.add({
        title: UI_TEXT.auth.emailError,
        description: getErrorMessage(error),
        color: 'error',
      });
      options?.onError?.(error);
    },
  });
};
