// frontend/app/composables/useAuth.ts
import { useCookie, useState, computed } from '#imports';
import { useQueryCache } from '@pinia/colada';
import type { UserOutDto } from '~/types/user.type';
import { authService } from '~/services/authService';
import type { LoginFormState } from '~/utils/schemas/login.schema';

// a composable for managing authentication state, login, and logout actions
export const useAuth = () => {
  // a cookie-backed state holding the authentication token
  // [return value]: string | null
  const token = useCookie<string | null>('auth_token', {/* ... */});
  const queryCache = useQueryCache();

  // cancels and invalidates all queries in the pinia colada cache to
  // prevent data leaks between sessions
  const clearAppDataAndCache = () => {
    queryCache.cancelQueries();
    queryCache.invalidateQueries();
  };

  // a global state holding the current user's profile data
  // [return value]: UserOutDto | null
  const user = useState<UserOutDto | null>('user_profile', () => null);
  // a computed property that determines if a user is logged in based on the presence of a token
  // [return value]: boolean
  const isAuthenticated = computed(() => !!token.value);

  // authenticates the user, clears previous cache, sets the token, and returns the response
  // [input value]: credentials: LoginFormState
  const login = async (credentials: LoginFormState) => {
    clearAppDataAndCache();
    const response = await authService.login(credentials);
    token.value = response.token;
    return response;
  };

  // logs the user out by clearing the cache, removing the token,
  // and clearing the user profile state
  const logout = () => {
    clearAppDataAndCache();
    token.value = null;
    user.value = null;
  };

  return { token, user, isAuthenticated, login, logout };
};
