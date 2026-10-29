import {
  customPermissionsSchema,
  permissionListSchema,
  systemRoleSchema,
} from '../api/shared/permission.validation';
import {
  MEMBER_PERMISSIONS,
  PERMISSION_CHAINS,
  PERMISSIONS,
  type Permission,
} from '../constants/permission.constants';
import { SYSTEM_ROLES, type SystemRole } from '../constants/roles.constants';

// it gets a users system role, permission list for custom roles and its user specific modifiers and return its permissions
export const resolvePermissions = (
  systemRole: SystemRole,
  rolePermissions: unknown = [],
  customPermissions: unknown = { allow: [], deny: [] },
): Permission[] => {
  const roleResult = systemRoleSchema.safeParse(systemRole);
  const permissionsResult = permissionListSchema.safeParse(rolePermissions);
  const overridesResult = customPermissionsSchema.safeParse(customPermissions);

  if (!roleResult.success || !permissionsResult.success || !overridesResult.success) {
    throw new Error('Invalid stored permission data!');
  }

  const role = roleResult.data;
  const { allow, deny } = overridesResult.data;
  const isPrivileged = role === SYSTEM_ROLES.OWNER || role === SYSTEM_ROLES.ADMIN;

  if (isPrivileged && (allow.length > 0 || deny.length > 0)) {
    throw new Error('Owner and Admin cannot have permission overrides!');
  }

  if (role !== SYSTEM_ROLES.CUSTOM && permissionsResult.data.length > 0) {
    throw new Error('Only Custom roles can have stored role permissions!');
  }

  const basePermissions =
    role === SYSTEM_ROLES.CUSTOM
      ? permissionsResult.data
      : isPrivileged
        ? Object.values(PERMISSIONS)
        : MEMBER_PERMISSIONS;

  const permissions = new Set<Permission>([...basePermissions, ...allow]);

  for (const [read, contribute, manage] of PERMISSION_CHAINS) {
    if (permissions.has(manage)) permissions.add(contribute);
    if (permissions.has(contribute)) permissions.add(read);
  }

  for (const permission of deny) {
    permissions.delete(permission);
  }

  for (const [read, contribute, manage] of PERMISSION_CHAINS) {
    if (!permissions.has(read)) permissions.delete(contribute);
    if (!permissions.has(contribute)) permissions.delete(manage);
  }

  return Object.values(PERMISSIONS).filter((permission: Permission): boolean =>
    permissions.has(permission),
  );
};
