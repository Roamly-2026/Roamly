import type { Permission } from '../constants/permission.constants';
import type { SystemRole } from '../constants/roles.constants';
import type { CustomPermissions } from '../api/shared/permission.validation';

export type PermissionContext = {
  userId: number;
  userUuid: string;
  groupId: number;
  groupUuid: string;
  systemRole: SystemRole;
  customRole: {
    uuid: string;
    name: string;
  } | null;
  customPermissions: CustomPermissions;
  effectivePermissions: Permission[];
};
