// frontend/app/composables/useProtectedPage.ts
import { watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '~/composables/useAuth';

// a composable for protecting routes by redirecting unauthenticated users to the login page
export const useProtectedPage = () => {
  const router = useRouter();
  // a computed property that determines if a user is logged in
  // [return value]: boolean
  const { isAuthenticated } = useAuth();

  // watches the authentication state and immediately redirects to the login page
  // if the user is not authenticated
  watch(
    isAuthenticated,
    (isAuth) => {
      if (!isAuth) {
        router.push('/login');
      }
    },
    { immediate: true },
  );

  return {
    isAuthenticated,
  };
};
