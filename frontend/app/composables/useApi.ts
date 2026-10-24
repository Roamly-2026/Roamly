// frontend/app/composables/useApi.ts
import { useRuntimeConfig } from '#imports';
import { useAuth } from '~/composables/useAuth';

// a composable for creating a customized $fetch instance with authentication and error handling
// it will be used as a base api on every other requests
// [return value]: $Fetch
export const useApi = () => {
  const config = useRuntimeConfig();
  const { token, logout } = useAuth();

  return $fetch.create({
    // sets the base url to communicate with the backend
    baseURL: config.public.apiBaseUrl as string,

    // intercepts the request to attach the Bearer token if it exists
    // [input value]: { options: any }
    onRequest({ options }) {
      // if the user is logged in it puts the token on the request
      if (token.value) {
        options.headers = new Headers(options.headers);
        options.headers.set('Authorization', `Bearer ${token.value}`);
      }
    },

    // intercepts response errors to automatically log out the user on 401 Unauthorized
    // [input value]: { response: any }
    onResponseError({ response }) {
      // if the backend gives back an unauthorized response it logs the user out
      if (response?.status === 401) {
        logout();
      }
    },
  });
};
