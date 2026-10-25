// frontend/app/composables/useProtectedPage.ts
import { watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '~/composables/useAuth';

/**
 * Client-side route guard composable.
 * Evaluates authentication state immediately on mount and redirects to /login if unauthenticated,
 * or reactive-ly if the session is terminated while on the page.
 */
export const useProtectedPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

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
