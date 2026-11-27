import type { CustomGroupRole, GroupProfileDto } from '~/types/groups.type';
import { SYSTEM_ROLES, type SystemRole } from '~/utils/constants/permissions.constants';

export const getGroupRoleLabel = (role?: SystemRole | null, customRole?: CustomGroupRole | null) =>
  customRole?.name ?? role?.toLowerCase() ?? UI_TEXT.common.unknown;

export const canLeaveGroup = (role?: SystemRole, size?: number) =>
  !!role && (role !== SYSTEM_ROLES.OWNER || size === 1);

export const canRemoveGroupMember = (
  profile: GroupProfileDto,
  role: SystemRole | undefined,
  userUuid: string | undefined,
) =>
  !!role &&
  !!userUuid &&
  profile.users.uuid !== userUuid &&
  profile.system_role !== SYSTEM_ROLES.OWNER &&
  (profile.system_role !== SYSTEM_ROLES.ADMIN || role === SYSTEM_ROLES.OWNER);
