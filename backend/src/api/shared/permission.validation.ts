import { z } from 'zod';
import { PERMISSIONS, type Permission } from '../../constants/permission.constants';
import { SYSTEM_ROLES } from '../../constants/roles.constants';

export const systemRoleSchema = z.enum(SYSTEM_ROLES);

export const permissionListSchema = z
  .array(z.enum(PERMISSIONS))
  .refine(
    (permissions: Permission[]): boolean => new Set(permissions).size === permissions.length,
    { message: 'Duplicate permissions are not allowed!' },
  );

const customPermissionsBaseSchema = z.strictObject({
  allow: permissionListSchema,
  deny: permissionListSchema,
});

export type CustomPermissions = z.infer<typeof customPermissionsBaseSchema>;

export const customPermissionsSchema = customPermissionsBaseSchema.refine(
  (value: CustomPermissions): boolean =>
    !value.allow.some((permission: Permission): boolean => value.deny.includes(permission)),
  { message: 'A permission cannot be both allowed and denied!' },
);
