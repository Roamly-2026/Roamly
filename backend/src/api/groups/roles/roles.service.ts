import { roles, Prisma } from '@prisma/client';
import { Permission, PERMISSIONS } from '../../../constants/permission.constants';
import { SYSTEM_ROLES } from '../../../constants/roles.constants';
import prisma from '../../../prisma';
import { PermissionContext } from '../../../types/permissions.types';
import { resolvePermissions } from '../../../utils/permissions.utils';
import {
  ServerError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} from '../../../utils/ServerError';
import { permissionListSchema } from '../../shared/permission.validation';
import { assertPermission } from '../../shared/permissions.service';
import { CreateRoleInput, UpdateRoleInput } from './roles.validation';

export type RoleResponse = {
  id: string;
  name: string;
  permissions: Permission[];
  isSystem: boolean;
};

//  the ids of the system roles are not database specific, to prevent unneeded db acces
const SYSTEM_ROLE_DEFINITIONS = [
  { id: SYSTEM_ROLES.OWNER, name: 'Owner' },
  { id: SYSTEM_ROLES.ADMIN, name: 'Admin' },
  { id: SYSTEM_ROLES.MEMBER, name: 'Member' },
] as const;

type SystemRoleDefinition = (typeof SYSTEM_ROLE_DEFINITIONS)[number];

const getSystemRoles = (): RoleResponse[] =>
  SYSTEM_ROLE_DEFINITIONS.map((role: SystemRoleDefinition): RoleResponse => ({
    ...role,
    permissions: resolvePermissions(role.id),
    isSystem: true,
  }));

const toRoleResponse = (role: roles): RoleResponse => {
  const parsed = permissionListSchema.safeParse(role.permissions);

  if (!parsed.success) {
    throw new ServerError('Invalid stored role permissions!', 500);
  }

  return {
    id: role.uuid,
    name: role.name,
    permissions: parsed.data,
    isSystem: false,
  };
};

const assertCustomRole = (roleId: string): void => {
  if (SYSTEM_ROLE_DEFINITIONS.some((role: SystemRoleDefinition): boolean => role.id === roleId)) {
    throw new ForbiddenError('System roles cannot be modified or deleted!');
  }
};

const findCustomRole = async (groupId: number, roleId: string): Promise<roles> => {
  const role = await prisma.roles.findFirst({
    where: {
      group_id: groupId,
      uuid: roleId,
    },
  });

  if (!role) {
    throw new NotFoundError('Custom role not found in this group!');
  }

  return role;
};

const assertGrantablePermissions = (
  context: PermissionContext,
  permissions: Permission[],
): void => {
  const effectivePermissions = resolvePermissions(SYSTEM_ROLES.CUSTOM, permissions);
  const allowed = new Set(context.effectivePermissions);

  if (effectivePermissions.some((permission: Permission): boolean => !allowed.has(permission))) {
    throw new ForbiddenError('You cannot grant permissions you do not effectively have!');
  }
};

//  converts a known prisma error to layer specific one
const rethrowRoleWriteError = (err: unknown): never => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      throw new ConflictError('A role with this name already exists in this group!');
    }

    if (err.code === 'P2003' || err.code === 'P2034') {
      throw new ConflictError('Concurrent role changes prevented the operation. Please retry!');
    }
  }

  throw err;
};

export const listRoles = async (context: PermissionContext): Promise<RoleResponse[]> => {
  const customRoles = await prisma.roles.findMany({
    where: {
      group_id: context.groupId,
    },
    orderBy: [{ name: 'asc' }, { uuid: 'asc' }],
  });

  return [...getSystemRoles(), ...customRoles.map(toRoleResponse)];
};

export const getRole = async (
  context: PermissionContext,
  roleId: string,
): Promise<RoleResponse> => {
  const systemRole = getSystemRoles().find((role: RoleResponse): boolean => role.id === roleId);

  if (systemRole) {
    return systemRole;
  }

  return toRoleResponse(await findCustomRole(context.groupId, roleId));
};

export const createRole = async (
  context: PermissionContext,
  input: CreateRoleInput,
): Promise<RoleResponse> => {
  assertPermission(context, PERMISSIONS.GROUP_MANAGE_ROLES);
  assertGrantablePermissions(context, input.permissions);

  try {
    const role = await prisma.roles.create({
      data: {
        group_id: context.groupId,
        name: input.name,
        permissions: input.permissions,
      },
    });

    return toRoleResponse(role);
  } catch (err: unknown) {
    return rethrowRoleWriteError(err);
  }
};

export const updateRole = async (
  context: PermissionContext,
  roleId: string,
  input: UpdateRoleInput,
): Promise<RoleResponse> => {
  assertPermission(context, PERMISSIONS.GROUP_MANAGE_ROLES);
  assertCustomRole(roleId);

  const role = await findCustomRole(context.groupId, roleId);
  const permissions = input.permissions ?? toRoleResponse(role).permissions;

  assertGrantablePermissions(context, permissions);

  try {
    const updatedRole = await prisma.roles.update({
      where: {
        uuid: role.uuid,
        group_id: context.groupId,
      },
      data: {
        name: input.name ?? role.name,
        permissions,
      },
    });

    return toRoleResponse(updatedRole);
  } catch (err: unknown) {
    return rethrowRoleWriteError(err);
  }
};

export const deleteRole = async (context: PermissionContext, roleId: string): Promise<void> => {
  assertPermission(context, PERMISSIONS.GROUP_MANAGE_ROLES);
  assertCustomRole(roleId);

  const role = await findCustomRole(context.groupId, roleId);

  try {
    //   all users with the deleted role go back to member
    await prisma.$transaction([
      prisma.group_profiles.updateMany({
        where: {
          group_id: context.groupId,
          custom_role_id: role.role_id,
        },
        data: {
          system_role: SYSTEM_ROLES.MEMBER,
          custom_role_id: null,
          custom_permissions: { allow: [], deny: [] },
        },
      }),
      prisma.group_invites.updateMany({
        where: {
          group_id: context.groupId,
          custom_role_id: role.role_id,
        },
        data: {
          system_role: SYSTEM_ROLES.MEMBER,
          custom_role_id: null,
        },
      }),
      prisma.roles.delete({
        where: {
          uuid: role.uuid,
          group_id: context.groupId,
        },
      }),
    ]);
  } catch (err: unknown) {
    return rethrowRoleWriteError(err);
  }
};
