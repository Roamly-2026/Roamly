import { computed, type Ref } from 'vue';
import type { UiEvent } from '~/types/events.type';
import { useGroupPermission } from '~/composables/useGroupPermission';
import { PERMISSIONS } from '~/utils/constants/permissions.constants';

export const useEventPermissions = (groupUuid: Ref<string | undefined>) => {
  const { currentUserUuid, systemRole, hasPermission} =
    useGroupPermission(groupUuid);

  const canReadEvents = computed(() => hasPermission(PERMISSIONS.EVENTS_READ));
  const canCreateEvent = computed(() => hasPermission(PERMISSIONS.EVENTS_CONTRIBUTE));

  const canManageEvent = (event?: UiEvent | null) => {
    if (!event) return false;

    const isCreator = event.creator.uuid === currentUserUuid.value;
    return hasPermission(isCreator ? PERMISSIONS.EVENTS_CONTRIBUTE : PERMISSIONS.EVENTS_MANAGE);
  };

  const canLeaveEvent = (event?: UiEvent | null) =>
    !!systemRole.value &&
    !!currentUserUuid.value &&
    (event?.members.some((member) => member.uuid === currentUserUuid.value) ?? false);

  return {
    currentUserUuid,
    systemRole,
    canReadEvents,
    canCreateEvent,
    canManageEvent,
    canLeaveEvent,
  };
};
