import prisma from '../../prisma';
import { hashPassword, validatePassword } from '../../utils/password.utils';
import { userProfileInfo } from '../../types/users.types';
import { BadRequestError } from '../../utils/ServerError';
import { deletePublicFileFromCloud, uploadPublicFileToCloud } from '../../utils/storage.util';
import { Prisma } from '@prisma/client';
import { SYSTEM_ROLES } from '../../constants/roles.constants';

export const getProfile = async (uuid: string): Promise<userProfileInfo> => {
  const user = await prisma.users.findFirstOrThrow({
    where: {
      uuid: uuid,
    },
    select: {
      username: true,
      email: true,
      phone_number: true,
      uuid: true,
      created_at: true,
      updated_at: true,
      profile_image_url: true,
    },
  });

  return user;
};

export const updateProfile = async (
  userUuid: string,
  updateData: { username?: string; email?: string; phoneNumber?: string },
): Promise<userProfileInfo> => {
  const updatedUser = await prisma.users.update({
    where: {
      uuid: userUuid,
    },
    data: updateData,
    omit: {
      password: true,
      user_id: true,
    },
  });

  return updatedUser;
};

export const deleteProfile = async (userUuid: string): Promise<void> => {
  const user = await prisma.users.findFirstOrThrow({
    where: {
      uuid: userUuid,
    },
  });

  const usersAllProfiles = await prisma.group_profiles.findMany({
    where: {
      user_id: user.user_id,
    },
    include: {
      groups: {
        include: {
          _count: {
            select: {
              group_profiles: true,
            },
          },
        },
      },
    },
  });

  const singleMemberGroupsToDelete: number[] = [];
  const multiMemberGroupsToDecrement: number[] = [];

  for (const profile of usersAllProfiles) {
    const group = profile.groups;

    if (profile.system_role === SYSTEM_ROLES.OWNER) {
      if (group._count.group_profiles > 1) {
        throw new BadRequestError(
          `Cannot delete profile. You own the group "${group.name}", which still has other members. Delete the group first.`,
        );
      }

      singleMemberGroupsToDelete.push(group.group_id);
    } else {
      multiMemberGroupsToDecrement.push(group.group_id);
    }
  }

  const transactionOperations: Prisma.PrismaPromise<unknown>[] = [];

  for (const groupId of singleMemberGroupsToDelete) {
    transactionOperations.push(
      //  delete is needed instead of delete many because delete many does not show erorrs, just gives back a 0
      prisma.groups.delete({
        where: {
          group_id: groupId,
          group_profiles: {
            some: {
              user_id: user.user_id,
              system_role: SYSTEM_ROLES.OWNER,
            },
            none: {
              user_id: {
                not: user.user_id,
              },
            },
          },
        },
      }),
    );
  }

  if (multiMemberGroupsToDecrement.length > 0) {
    transactionOperations.push(
      prisma.groups.updateMany({
        where: {
          group_id: {
            in: multiMemberGroupsToDecrement,
          },
          group_profiles: {
            some: {
              user_id: user.user_id,
            },
          },
        },
        data: {
          current_size: { decrement: 1 },
        },
      }),
    );
  }

  transactionOperations.push(
    prisma.users.delete({
      where: {
        uuid: userUuid,
      },
    }),
  );

  await prisma.$transaction(transactionOperations);
};

export const changePassword = async (
  userUuid: string,
  oldPassword: string,
  newPassword: string,
): Promise<void> => {
  const user = await prisma.users.findFirstOrThrow({
    where: {
      uuid: userUuid,
    },
  });

  const isPasswordValid = await validatePassword(oldPassword, user.password);

  if (!isPasswordValid) {
    throw new BadRequestError('Old password invalid!');
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.users.update({
    where: {
      user_id: user.user_id,
    },
    data: {
      password: hashedPassword,
    },
  });
};

export const uploadProfilePicture = async (
  userUuid: string,
  fileData: Express.Multer.File,
): Promise<userProfileInfo> => {
  const user = await prisma.users.findFirstOrThrow({
    where: {
      uuid: userUuid,
    },
  });

  // if the user already has a profile picture we first delete the old one
  if (user.profile_image_url) {
    await deletePublicFileFromCloud(user.profile_image_url);
  }

  // sending the file to the Cloud, it returns the public URL
  const cloudPublicUrl = await uploadPublicFileToCloud(fileData, 'profiles');

  // saving the public URL in the database
  const updatedUser = await prisma.users.update({
    where: {
      user_id: user.user_id,
    },
    data: {
      profile_image_url: cloudPublicUrl,
    },
    select: {
      username: true,
      email: true,
      phone_number: true,
      uuid: true,
      created_at: true,
      updated_at: true,
      profile_image_url: true,
    },
  });

  return updatedUser;
};

export const deleteProfilePicture = async (userUuid: string): Promise<userProfileInfo> => {
  const user = await prisma.users.findUniqueOrThrow({
    where: {
      uuid: userUuid,
    },
  });

  if (!user.profile_image_url) {
    throw new BadRequestError('User does not have a profile picture to remove!');
  }

  await deletePublicFileFromCloud(user.profile_image_url);

  const updatedUser = await prisma.users.update({
    where: {
      user_id: user.user_id,
    },
    data: {
      profile_image_url: null,
    },
    select: {
      username: true,
      email: true,
      phone_number: true,
      uuid: true,
      created_at: true,
      updated_at: true,
      profile_image_url: true,
    },
  });

  return updatedUser;
};
