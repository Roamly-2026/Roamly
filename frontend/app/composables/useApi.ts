// frontend/app/composables/useApi.ts
import { useRuntimeConfig } from '#imports';
import { useAuth } from '~/composables/useAuth';

/**
 * Provides a pre-configured $fetch instance for backend API communication.
 * Automatically injects the JWT Bearer token and handles session expiration (401).
 */
export const useApi = () => {
  const config = useRuntimeConfig();
  const { token, logout } = useAuth();

  return $fetch.create({
    baseURL: config.public.apiBaseUrl as string,

    onRequest({ options }) {
      if (token.value) {
        options.headers = new Headers(options.headers);
        options.headers.set('Authorization', `Bearer ${token.value}`);
      }
    },

    // Force logout if the token is rejected or expired to keep client state in sync
    onResponseError({ response }) {
      if (response?.status === 401) {
        logout();
      }
    },
  });
};
