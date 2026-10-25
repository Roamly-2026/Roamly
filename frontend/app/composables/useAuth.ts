// frontend/app/composables/useAuth.ts
import { useCookie, useState, computed } from '#imports';
import { useQueryCache } from '@pinia/colada';
import type { UserOutDto } from '~/types/user.type';
import { authService } from '~/services/authService';
import type { LoginFormState } from '~/utils/schemas/login.schema';

/**
 * Manages user authentication state, session persistence via cookies, and query cache cleanup.
 */
export const useAuth = () => {
  const token = useCookie<string | null>('auth_token', {/* ... */});
  const queryCache = useQueryCache();

  // Purges Pinia Colada query cache to prevent cross-session data leaks when switching accounts
  const clearAppDataAndCache = () => {
    queryCache.cancelQueries();
    queryCache.invalidateQueries();
  };

  // SSR-friendly global state for the authenticated user's profile
  const user = useState<UserOutDto | null>('user_profile', () => null);
  const isAuthenticated = computed(() => !!token.value);

  const login = async (credentials: LoginFormState) => {
    clearAppDataAndCache();
    const response = await authService.login(credentials);
    token.value = response.token;
    return response;
  };

  const logout = () => {
    clearAppDataAndCache();
    token.value = null;
    user.value = null;
  };

  return { token, user, isAuthenticated, login, logout };
};
