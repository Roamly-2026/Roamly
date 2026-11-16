import prisma from '../../prisma';
import { logger } from '../../config/logger.config';
import type { Permission } from '../../constants/permission.constants';
import { SYSTEM_ROLES } from '../../constants/roles.constants';
import type { PermissionContext } from '../../types/permissions.types';
import { resolvePermissions } from '../../utils/permissions.utils';
import { ForbiddenError, NotFoundError, ServerError } from '../../utils/ServerError';
import { customPermissionsSchema } from './permission.validation';

export const loadPermissionContext = async (
  userUuid: string,
  groupUuid: string,
): Promise<PermissionContext> => {
  const group = await prisma.groups.findUnique({
    where: { uuid: groupUuid },
    select: {
      group_id: true,
      uuid: true,
      group_profiles: {
        where: { users: { uuid: userUuid } },
        select: {
          user_id: true,
          system_role: true,
          custom_role_id: true,
          custom_permissions: true,
          custom_role: {
            select: {
              role_id: true,
              uuid: true,
              group_id: true,
              name: true,
              permissions: true,
            },
          },
        },
      },
    },
  });

  if (!group) {
    throw new NotFoundError('Group not found!');
  }

  const membership = group.group_profiles[0];

  if (!membership) {
    throw new ForbiddenError('Active group membership is required!');
  }

  try {
    const role = membership.custom_role;

    //  if a role is custom it must have a role id
    if (membership.system_role === SYSTEM_ROLES.CUSTOM) {
      if (!role || role.role_id !== membership.custom_role_id || role.group_id !== group.group_id) {
        throw new Error('Invalid stored custom role assignment!');
      }
      //  if not then it cant have one
    } else if (membership.custom_role_id !== null || role !== null) {
      throw new Error('Only Custom members can have a custom role!');
    }

    const customPermissions = customPermissionsSchema.parse(membership.custom_permissions);
    const effectivePermissions = resolvePermissions(
      membership.system_role,
      role?.permissions ?? [],
      customPermissions,
    );

    return {
      userId: membership.user_id,
      userUuid,
      groupId: group.group_id,
      groupUuid: group.uuid,
      systemRole: membership.system_role,
      customRole: role ? { uuid: role.uuid, name: role.name } : null,
      customPermissions,
      effectivePermissions,
    };
  } catch (err: unknown) {
    logger.error({ err, userUuid, groupUuid }, 'Invalid stored group permission data');
    throw new ServerError('Internal server error!', 500);
  }
};

export const assertPermission = (context: PermissionContext, permission: Permission): void => {
  if (!context.effectivePermissions.includes(permission)) {
    throw new ForbiddenError(`Missing required permission: ${permission}!`);
  }
};

export const assertOwner = (context: PermissionContext): void => {
  if (context.systemRole !== SYSTEM_ROLES.OWNER) {
    throw new ForbiddenError('Only the group owner can perform this action!');
  }
};

export const assertOwnerOrAdmin = (context: PermissionContext): void => {
  if (context.systemRole !== SYSTEM_ROLES.OWNER && context.systemRole !== SYSTEM_ROLES.ADMIN) {
    throw new ForbiddenError('Only the group owner or admins can perform this action!');
  }
};
