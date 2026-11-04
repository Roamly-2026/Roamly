import prisma from '../../prisma';
import { hashPassword, validatePassword } from '../../utils/password.utils';
import { userProfileInfo } from '../../types/users.types';
import { BadRequestError } from '../../utils/ServerError';
import {
  deletePublicFileFromCloud,
  uploadPublicFileToCloud,
  uploadPrivateFileToCloud,
  deletePrivateFilesFromCloud,
  getPrivatePresignedUrl,
} from '../../utils/storage.util';
import { SYSTEM_ROLES } from '../../constants/roles.constants';
import { Prisma } from '@prisma/client';
import { BACKGROUND_TYPES, BackgroundType, ThemePalette } from '../../constants/theme.constants';

const userProfileSelect = {
  username: true,
  email: true,
  phone_number: true,
  uuid: true,
  created_at: true,
  updated_at: true,
  profile_image_url: true,
  theme_palette: true,
  background_type: true,
  background_value: true,
} as const;

const resolveUserBackground = async (user: userProfileInfo): Promise<userProfileInfo> => {
  if (user.background_type === BACKGROUND_TYPES.CUSTOM && user.background_value) {
    const signedUrl = await getPrivatePresignedUrl(user.background_value);
    return {
      ...user,
      background_value: signedUrl,
    };
  }

  return user;
};

export const getProfile = async (uuid: string): Promise<userProfileInfo> => {
  const user = await prisma.users.findFirstOrThrow({
    where: {
      uuid: uuid,
    },
    select: userProfileSelect,
  });

  return resolveUserBackground(user);
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

  return resolveUserBackground(updatedUser);
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
    select: userProfileSelect,
  });

  return resolveUserBackground(updatedUser);
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
    select: userProfileSelect,
  });

  return resolveUserBackground(updatedUser);
};

export const updateThemePreferences = async (
  userUuid: string,
  preferences: {
    theme_palette?: ThemePalette;
    background_type?: BackgroundType;
    background_value?: string | null;
  },
): Promise<userProfileInfo> => {
  const user = await prisma.users.findUniqueOrThrow({
    where: {
      uuid: userUuid,
    },
  });

  const shouldDeleteOldCustomBg =
    user.background_type === BACKGROUND_TYPES.CUSTOM &&
    user.background_value &&
    preferences.background_type &&
    preferences.background_type !== BACKGROUND_TYPES.CUSTOM;

  if (preferences.background_type === BACKGROUND_TYPES.CUSTOM) {
    throw new BadRequestError('Custom backgrounds can only be set by uploading an image!');
  }

  // background_value is only written together with a background_type, so a stored
  // custom file key can never be swapped for an arbitrary one.
  const nextBackgroundValue = !preferences.background_type
    ? undefined
    : preferences.background_type === BACKGROUND_TYPES.PRESET
      ? preferences.background_value
      : null;

  const updatedUser = await prisma.users.update({
    where: {
      user_id: user.user_id,
    },
    data: {
      theme_palette: preferences.theme_palette,
      background_type: preferences.background_type,
      background_value: nextBackgroundValue,
    },
    select: userProfileSelect,
  });

  if (shouldDeleteOldCustomBg && user.background_value) {
    await deletePrivateFilesFromCloud([user.background_value]).catch(() => {});
  }

  return resolveUserBackground(updatedUser);
};

export const uploadBackgroundImage = async (
  userUuid: string,
  fileData: Express.Multer.File,
): Promise<userProfileInfo> => {
  const user = await prisma.users.findUniqueOrThrow({
    where: {
      uuid: userUuid,
    },
  });

  const oldCustomBg =
    user.background_type === BACKGROUND_TYPES.CUSTOM ? user.background_value : null;

  const fileKey = await uploadPrivateFileToCloud(fileData, 'backgrounds');

  let updatedUser: userProfileInfo;
  try {
    updatedUser = await prisma.users.update({
      where: {
        user_id: user.user_id,
      },
      data: {
        background_type: BACKGROUND_TYPES.CUSTOM,
        background_value: fileKey,
      },
      select: userProfileSelect,
    });
  } catch (err) {
    await deletePrivateFilesFromCloud([fileKey]).catch(() => {});
    throw err;
  }

  if (oldCustomBg) {
    await deletePrivateFilesFromCloud([oldCustomBg]).catch(() => {});
  }

  return resolveUserBackground(updatedUser);
};
