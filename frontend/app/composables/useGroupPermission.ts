import { computed, type Ref } from 'vue';
import { useAuth } from '~/composables/useAuth';
import { useMyGroupPermissionsQuery } from '~/queries/groups.query';
import { useCurrentUserQuery } from '~/queries/user.query';
import type { Permission } from '~/utils/constants/permissions.constants';

export const useGroupPermission = (groupUuid: Ref<string | undefined>) => {
  const { isAuthenticated } = useAuth();
  const currentUser = useCurrentUserQuery();

  // data is kept during background refetches, the previous session's cache is purged on login
  const currentUserUuid = computed(() =>
    isAuthenticated.value ? currentUser.data.value?.uuid : undefined,
  );

  const query = useMyGroupPermissionsQuery(groupUuid, currentUserUuid);

  // an error (e.g. the user was removed from the group) drops the previous permissions
  const permissions = computed(() =>
    currentUserUuid.value && query.status.value === 'success' ? query.data.value : undefined,
  );

  const systemRole = computed(() => permissions.value?.systemRole);
  const customRole = computed(() => permissions.value?.customRole ?? null);

  const hasPermission = (permission: Permission) =>
    permissions.value?.effectivePermissions.includes(permission) ?? false;

  return { currentUserUuid, systemRole, customRole, hasPermission };
};
