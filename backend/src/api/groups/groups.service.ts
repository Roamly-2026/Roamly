import prisma from '../../prisma';
import { group_profiles, groups, Prisma } from '@prisma/client';
import {
  profileRelatedToTheGroup,
  PaginatedGroups,
  GroupProfilesInfos,
  InfosOfTheGroupTheUserIsPartOf,
  PaginatedInvites,
  CreatedGroup,
} from '../../types/group.types';
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from '../../utils/ServerError';
import * as sendMail from '../shared/email.service';
import { logger } from '../../config/logger.config';
import { SYSTEM_ROLES } from '../../constants/roles.constants';
import {
  assertOwner,
  assertOwnerOrAdmin,
  assertPermission,
  loadPermissionContext,
} from '../shared/permissions.service';
import { PermissionContext } from '../../types/permissions.types';
import { PERMISSIONS } from '../../constants/permission.constants';
import {
  ChangeMemberRoleInput,
  changeMemberRoleSchema,
  inviteUsersToYourGroupBodySchema,
} from './groups.validation';

const getCustomRoleId = async (
  groupId: number,
  systemRole: string,
  customRoleUuid?: string,
): Promise<number | null> => {
  if (systemRole !== SYSTEM_ROLES.CUSTOM) return null;

  if (!customRoleUuid) {
    throw new BadRequestError('Custom role UUID is required!');
  }

  const role = await prisma.roles.findFirst({
    where: {
      uuid: customRoleUuid,
      group_id: groupId,
    },
  });

  if (!role) {
    throw new NotFoundError('Custom role not found in this group!');
  }

  return role.role_id;
};

const removeMembership = async (
  userId: number,
  groupId: number,
  systemRole: group_profiles['system_role'],
): Promise<void> => {
  await prisma.$transaction([
    prisma.group_profiles.delete({
      where: {
        user_id_group_id: {
          user_id: userId,
          group_id: groupId,
        },
        system_role: systemRole,
      },
    }),
    prisma.event_participants.deleteMany({
      where: {
        user_id: userId,
        events: { group_id: groupId },
      },
    }),
    prisma.file_shares.deleteMany({
      where: {
        group_id: groupId,
        files: { user_id: userId },
      },
    }),
    prisma.groups.update({
      where: { group_id: groupId },
      data: { current_size: { decrement: 1 } },
    }),
  ]);
};

// TODO
//  if it gets an error when handling the third new user, it returns fail, but the group already got created
//  this is inherited from the previous version of this service
export const createGroup = async (
  creatorUuid: string,
  name: string,
  initialInvites?: { email: string; role: string }[],
): Promise<CreatedGroup> => {
  const user = await prisma.users.findFirstOrThrow({
    where: { uuid: creatorUuid },
  });

  if (
    initialInvites?.some(
      (invitee: { email: string; role: string }): boolean => invitee.role !== SYSTEM_ROLES.MEMBER,
    )
  ) {
    throw new BadRequestError('Initial invitations must use the Member role!');
  }

  const newGroup = await prisma.groups.create({
    data: {
      name,
      current_size: 1,
      group_profiles: {
        create: {
          user_id: user.user_id,
          system_role: SYSTEM_ROLES.OWNER,
        },
      },
    },
    include: {
      group_profiles: {
        include: {
          custom_role: true,
        },
      },
    },
  });

  if (initialInvites && initialInvites.length > 0) {
    const context = await loadPermissionContext(creatorUuid, newGroup.uuid);

    await Promise.all(
      initialInvites.map(async (invitee: { email: string; role: string }) => {
        // email notification is handled in the "inviteUsersToYourGroup" funcion
        await inviteUsersToYourGroup(context, invitee.email, invitee.role);
      }),
    );
  }

  return newGroup;
};

// cursor is optional (?) because the first listing won't include it
export const listAllGroupsTheUserIsPartOf = async (
  userUuid: string,
  limit: number,
  cursor?: string,
): Promise<PaginatedGroups> => {
  const user = await prisma.users.findFirstOrThrow({
    where: { uuid: userUuid },
  });

  const userFilter = {
    group_profiles: {
      some: {
        users: {
          uuid: user.uuid,
        },
      },
    },
  };

  const queryOptions = {
    take: limit,
    where: userFilter,

    select: {
      uuid: true,
      name: true,
      current_size: true,
      created_at: true,

      group_profiles: {
        where: {
          users: { uuid: user.uuid },
        },
        select: {
          system_role: true,
          custom_role: {
            select: {
              uuid: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: [{ created_at: 'desc' }, { uuid: 'desc' }],
    // if the frontend sent a cursor we put it into the query
    ...(cursor ? { cursor: { uuid: cursor }, skip: 1 } : {}),
  } satisfies Prisma.groupsFindManyArgs;

  // we skip the cursor, it was already part of the previous list
  const groupList = await prisma.groups.findMany(queryOptions);

  // next cursor could be either null, if there isn't any data left in the database
  // or the last elements uuid
  let nextCursor = null;

  if (groupList.length === limit) {
    nextCursor = groupList[groupList.length - 1].uuid;
  }

  return {
    items: groupList,
    meta: {
      next_cursor: nextCursor,
      // has_next_page will be false if the database doesn't contain any more data to be sent
      has_next_page: nextCursor !== null,
      limit: limit,
      // number of sent data
      count: groupList.length,
    },
  };
};

export const joinAGroupByUuidIfUserIsInvited = async (
  userUuid: string,
  groupUuid: string,
): Promise<profileRelatedToTheGroup> => {
  const user = await prisma.users.findFirstOrThrow({
    where: { uuid: userUuid },
  });

  const group = await prisma.groups.findFirstOrThrow({
    where: { uuid: groupUuid },
  });

  const invitation = await prisma.group_invites.findUnique({
    where: {
      user_id_group_id: {
        user_id: user.user_id,
        group_id: group.group_id,
      },
    },
  });

  if (!invitation) {
    throw new BadRequestError('User not invited or already part of the group!');
  }

  const existingProfile = await prisma.group_profiles.findUnique({
    where: {
      user_id_group_id: {
        user_id: user.user_id,
        group_id: group.group_id,
      },
    },
  });

  if (existingProfile) {
    throw new ConflictError('User already joined the group!');
  }

  const [createdProfile] = await prisma.$transaction([
    prisma.group_profiles.create({
      data: {
        user_id: user.user_id,
        group_id: group.group_id,
        system_role: invitation.system_role,
        custom_role_id: invitation.custom_role_id,
      },
      include: {
        custom_role: true,
      },
    }),
    prisma.group_invites.delete({
      where: {
        user_id_group_id: {
          user_id: user.user_id,
          group_id: group.group_id,
        },
        system_role: invitation.system_role,
        custom_role_id: invitation.custom_role_id,
        created_at: invitation.created_at,
      },
    }),
    prisma.groups.update({
      where: {
        group_id: group.group_id,
      },
      data: {
        current_size: { increment: 1 },
      },
    }),
  ]);

  return createdProfile;
};

export const inviteUsersToYourGroup = async (
  context: PermissionContext,
  invitedUserEmail: string,
  inviteWithRole: string,
  customRoleUuid?: string,
): Promise<Prisma.group_invitesGetPayload<{ include: { custom_role: true } }>> => {
  assertPermission(context, PERMISSIONS.MEMBERS_MANAGE);

  const invitationData = inviteUsersToYourGroupBodySchema.parse({
    invitedUserEmail,
    inviteWithRole,
    customRoleUuid,
  });

  if (invitationData.inviteWithRole === SYSTEM_ROLES.CUSTOM) {
    assertOwnerOrAdmin(context);
  }

  const customRoleId = await getCustomRoleId(
    context.groupId,
    invitationData.inviteWithRole,
    invitationData.customRoleUuid,
  );

  const invitedUser = await prisma.users.findUniqueOrThrow({
    where: {
      email: invitationData.invitedUserEmail,
    },
  });

  const group = await prisma.groups.findUniqueOrThrow({
    where: {
      group_id: context.groupId,
    },
  });

  const inviter = await prisma.users.findUniqueOrThrow({
    where: {
      user_id: context.userId,
    },
  });

  const membershipWhere = {
    user_id_group_id: {
      user_id: invitedUser.user_id,
      group_id: context.groupId,
    },
  };

  const existingProfile = await prisma.group_profiles.findUnique({
    where: membershipWhere,
  });

  const existingInvitation = await prisma.group_invites.findUnique({
    where: membershipWhere,
  });

  if (existingProfile || existingInvitation) {
    throw new ConflictError('User already in group or invited!');
  }

  const createdInvite = await prisma.group_invites.create({
    data: {
      user_id: invitedUser.user_id,
      group_id: context.groupId,
      invited_by: context.userId,
      system_role: invitationData.inviteWithRole,
      custom_role_id: customRoleId,
    },
    include: {
      custom_role: true,
    },
  });

  sendMail
    .sendGroupInvitedEmail(
      invitedUser.email,
      group.name,
      inviter.username,
      createdInvite.custom_role?.name ?? createdInvite.system_role,
    )
    .catch((err: unknown) => {
      logger.warn({ err }, 'Group invitation email could not be sent');
    });

  return createdInvite;
};

export const pendingInvites = async (
  userUuid: string,
  limit: number,
  cursor?: string,
): Promise<PaginatedInvites> => {
  const user = await prisma.users.findFirstOrThrow({
    where: { uuid: userUuid },
  });

  const queryOptions = {
    take: limit,
    where: {
      groupInvites: {
        some: {
          user_id: user.user_id,
        },
      },
    },
    select: {
      uuid: true,
      name: true,
      current_size: true,
      created_at: true,
      groupInvites: {
        where: {
          user_id: user.user_id,
        },
        select: {
          system_role: true,
          custom_role: {
            select: {
              uuid: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: [{ created_at: 'desc' }, { uuid: 'desc' }],
    ...(cursor ? { cursor: { uuid: cursor }, skip: 1 } : {}),
  } satisfies Prisma.groupsFindManyArgs;

  // we skip the cursor, it was already part of the previous list
  const groupList = await prisma.groups.findMany(queryOptions);

  // next cursor could be either null, if there isn't any data left in the database
  // or the last elements uuid
  let nextCursor = null;

  if (groupList.length === limit) {
    nextCursor = groupList[groupList.length - 1].uuid;
  }

  return {
    items: groupList,
    meta: {
      next_cursor: nextCursor,
      // has_next_page will be false if the database doesn't contain any more data to be sent
      has_next_page: nextCursor !== null,
      limit: limit,
      // number of sent data
      count: groupList.length,
    },
  };
};

export const joinGroupInfos = async (
  groupUuid: string,
  userUuid: string,
): Promise<GroupProfilesInfos[]> => {
  const group = await prisma.groups.findFirstOrThrow({
    where: { uuid: groupUuid },
  });

  const user = await prisma.users.findFirstOrThrow({
    where: { uuid: userUuid },
  });

  const invitation = await prisma.group_invites.findUnique({
    where: {
      user_id_group_id: {
        user_id: user.user_id,
        group_id: group.group_id,
      },
    },
  });

  if (!invitation) {
    throw new ForbiddenError('Group invitation is required!');
  }

  const groupInfos = await prisma.group_profiles.findMany({
    where: {
      group_id: group.group_id,
    },
    select: {
      users: {
        select: {
          email: true,
          username: true,
        },
      },
      system_role: true,
      custom_role: {
        select: {
          uuid: true,
          name: true,
        },
      },
    },
  });

  return groupInfos;
};

export const listAllInfosOfOneGroup = async (
  context: PermissionContext,
): Promise<InfosOfTheGroupTheUserIsPartOf> => {
  const groupInfos = await prisma.groups.findUniqueOrThrow({
    where: {
      group_id: context.groupId,
    },
    select: {
      name: true,
      current_size: true,
      created_at: true,

      group_profiles: {
        select: {
          users: {
            select: {
              uuid: true,
              email: true,
              username: true,
              profile_image_url: true,
            },
          },
          system_role: true,
          custom_role: {
            select: {
              uuid: true,
              name: true,
            },
          },

          nickname: true,
          description: true,
        },
      },
    },
  });

  return groupInfos;
};

export const deleteGroup = async (context: PermissionContext): Promise<void> => {
  assertOwner(context);

  await prisma.groups.delete({
    where: {
      group_id: context.groupId,
    },
  });
};

export const updateGroup = async (
  context: PermissionContext,
  updateData: { name?: string },
): Promise<groups> => {
  assertPermission(context, PERMISSIONS.GROUP_MANAGE);

  const updatedGroup = await prisma.groups.update({
    where: {
      group_id: context.groupId,
    },
    data: {
      name: updateData.name,
    },
  });

  return updatedGroup;
};

export const removeUserFromGroup = async (
  context: PermissionContext,
  targetUserUuid: string,
): Promise<void> => {
  assertPermission(context, PERMISSIONS.MEMBERS_MANAGE);

  const targetUserProfile = await prisma.group_profiles.findFirstOrThrow({
    where: {
      users: {
        uuid: targetUserUuid,
      },
      group_id: context.groupId,
    },
  });

  if (targetUserProfile.system_role === SYSTEM_ROLES.OWNER) {
    throw new BadRequestError('The group owner cannot be removed!');
  }

  if (targetUserProfile.user_id === context.userId) {
    throw new BadRequestError('Use the leave endpoint to leave the group!');
  }

  if (targetUserProfile.system_role === SYSTEM_ROLES.ADMIN) {
    assertOwner(context);
  }

  await removeMembership(targetUserProfile.user_id, context.groupId, targetUserProfile.system_role);
};

export const userLeavingGroup = async (context: PermissionContext): Promise<void> => {
  if (context.systemRole === SYSTEM_ROLES.OWNER) {
    const otherMembers = await prisma.group_profiles.count({
      where: {
        group_id: context.groupId,
        user_id: {
          not: context.userId,
        },
      },
    });

    if (otherMembers > 0) {
      throw new BadRequestError(
        'Cannot leave as group owner while other members are still in the group!',
      );
    }

    await prisma.groups.delete({
      where: {
        group_id: context.groupId,
        group_profiles: {
          none: {
            user_id: {
              not: context.userId,
            },
          },
        },
      },
    });

    return;
  }

  await removeMembership(context.userId, context.groupId, context.systemRole);
};

export const changeMemberRole = async (
  context: PermissionContext,
  targetUserUuid: string,
  updateData: ChangeMemberRoleInput,
): Promise<profileRelatedToTheGroup> => {
  assertOwnerOrAdmin(context);

  const roleData = changeMemberRoleSchema.parse(updateData);

  const targetUserProfile = await prisma.group_profiles.findFirstOrThrow({
    where: {
      users: {
        uuid: targetUserUuid,
      },
      group_id: context.groupId,
    },
  });

  if (targetUserProfile.system_role === SYSTEM_ROLES.OWNER) {
    throw new BadRequestError('The group owner role cannot be changed!');
  }

  if (
    targetUserProfile.system_role === SYSTEM_ROLES.ADMIN ||
    roleData.systemRole === SYSTEM_ROLES.ADMIN
  ) {
    assertOwner(context);
  }

  const customRoleId = await getCustomRoleId(
    context.groupId,
    roleData.systemRole,
    roleData.customRoleUuid,
  );

  const updatedProfile = await prisma.group_profiles.update({
    where: {
      user_id_group_id: {
        user_id: targetUserProfile.user_id,
        group_id: context.groupId,
      },
      system_role: targetUserProfile.system_role,
      custom_role_id: targetUserProfile.custom_role_id,
    },
    data: {
      system_role: roleData.systemRole,
      custom_role_id: customRoleId,
      // on role change, the custom permisisons get reset
      custom_permissions: { allow: [], deny: [] },
    },
    include: {
      custom_role: true,
    },
  });

  return updatedProfile;
};
