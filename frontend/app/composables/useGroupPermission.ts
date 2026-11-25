import { computed, type Ref } from 'vue';
import { useAuth } from '~/composables/useAuth';
import { useMyGroupPermissionsQuery } from '~/queries/groups.query';
import { useCurrentUserQuery } from '~/queries/user.query';
import type { Permission } from '~/utils/constants/permissions.constants';

export const useGroupPermission = (groupUuid: Ref<string | undefined>) => {
  const { isAuthenticated } = useAuth();
  const currentUser = useCurrentUserQuery();
  const currentUserUuid = computed(() =>
    isAuthenticated.value && currentUser.status.value === 'success' && !currentUser.isLoading.value
      ? currentUser.data.value?.uuid
      : undefined,
  );

  const query = useMyGroupPermissionsQuery(groupUuid, currentUserUuid);
  const permissions = computed(() =>
    currentUserUuid.value && query.status.value === 'success' && !query.isLoading.value
      ? query.data.value
      : undefined,
  );

  const systemRole = computed(() => permissions.value?.systemRole);
  const customRole = computed(() => permissions.value?.customRole ?? null);

  const hasPermission = (permission: Permission) =>
    permissions.value?.effectivePermissions.includes(permission) ?? false;

  return { currentUserUuid, systemRole, customRole, hasPermission };
};
