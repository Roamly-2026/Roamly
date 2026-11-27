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

  // Purges Pinia Colada query cache
  const clearAppDataAndCache = () => {
    queryCache.cancelQueries();
    // inactive entries are left over from the previous session: remove them so they can't be read
    for (const entry of queryCache.getEntries({ active: false })) {
      queryCache.remove(entry);
    }
    // Mark stale only, never refetch here: a refetch without a valid token gets a 401, whose
    // handler calls logout() -> this function again, looping forever (and wiping a fresh login token)
    queryCache.invalidateQueries(undefined, false);
  };

  // SSR-friendly global state for the authenticated user's profile
  const user = useState<UserOutDto | null>('user_profile', () => null);
  const isAuthenticated = computed(() => !!token.value);

  const login = async (credentials: LoginFormState) => {
    const response = await authService.login(credentials);
    clearAppDataAndCache();
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
