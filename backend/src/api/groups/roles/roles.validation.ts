import z from 'zod';
import { SYSTEM_ROLES } from '../../../constants/roles.constants';
import { roleNameSchema, permissionListSchema } from '../../shared/permission.validation';
import { groupUuidValidationSchema } from '../groups.validation';

export const roleParamsSchema = groupUuidValidationSchema.extend({
  roleId: z.union([
    z.uuid('Invalid role UUID!'),
    z.enum([SYSTEM_ROLES.OWNER, SYSTEM_ROLES.ADMIN, SYSTEM_ROLES.MEMBER]),
  ]),
});

export const createRoleSchema = z.strictObject({
  name: roleNameSchema,
  permissions: permissionListSchema,
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;

export const updateRoleSchema = createRoleSchema
  .partial()
  .refine(
    (data: Partial<CreateRoleInput>): boolean =>
      data.name !== undefined || data.permissions !== undefined,
    {
      message: 'At least one field is required!',
      path: ['name'],
    },
  );
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
