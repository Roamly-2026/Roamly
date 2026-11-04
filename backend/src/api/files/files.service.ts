import { files, file_shares, Prisma } from '@prisma/client';
import prisma from '../../prisma';
import * as cloudOperations from '../../utils/storage.util';
import { BadRequestError, ConflictError, ForbiddenError } from '../../utils/ServerError';
import {
  docSharedWithGroups,
  GroupFile,
  GroupMediaFile,
  PaginatedGroupFiles,
  privateDocumentMetadata,
  creatorSelect,
  SharedPrivateDocumentMetadata,
} from '../../types/files.types';
import * as FILE_CONSTANTS from '../../constants/files.constants';
import { PermissionContext } from '../../types/permissions.types';
import { PERMISSIONS } from '../../constants/permission.constants';
import { assertPermission, loadPermissionContext } from '../shared/permissions.service';
import { SharedDocumentsFilter } from './files.validation';

const getOwnedPrivateDocument = async (
  userId: number,
  fileId: number,
): Promise<privateDocumentMetadata> => {
  const file = await prisma.files.findUniqueOrThrow({
    where: {
      file_id: fileId,
      ownership_type: FILE_CONSTANTS.OWNERSHIP.PRIVATE,
      documents: {
        isNot: null,
      },
    },
    include: {
      documents: true,
      creator: creatorSelect,
    },
  });

  if (file.user_id !== userId) {
    throw new ForbiddenError('Users can only manage their own private documents!');
  }

  return file;
};

const getReadableDocumentAudiences = (
  context: PermissionContext,
): FILE_CONSTANTS.DocumentAudience[] => {
  const audiences: FILE_CONSTANTS.DocumentAudience[] = [];

  if (context.effectivePermissions.includes(PERMISSIONS.DOCUMENTS_READ)) {
    audiences.push(FILE_CONSTANTS.DOCUMENT_AUDIENCE.GROUP_MEMBERS);
  }

  if (context.effectivePermissions.includes(PERMISSIONS.PERSONAL_DOCUMENTS_READ_RESTRICTED)) {
    audiences.push(FILE_CONSTANTS.DOCUMENT_AUDIENCE.DOCUMENT_REVIEWERS);
  }

  return audiences;
};

const assertGroupFileWriteAccess = (
  context: PermissionContext,
  uploadedBy: number | null,
  type: FILE_CONSTANTS.GroupFileType,
): void => {
  const isUploader = uploadedBy === context.userId;

  if (type === FILE_CONSTANTS.GROUP_FILE_TYPE.DOCUMENT) {
    assertPermission(
      context,
      isUploader ? PERMISSIONS.DOCUMENTS_CONTRIBUTE : PERMISSIONS.DOCUMENTS_MANAGE,
    );

    return;
  }

  assertPermission(context, isUploader ? PERMISSIONS.MEDIA_CONTRIBUTE : PERMISSIONS.MEDIA_MANAGE);
};

export const uploadPrivateDocument = async (
  userUuid: string,
  fileData: Express.Multer.File,
  document_type: string,
  issue_date?: string,
  expiry_date?: string,
): Promise<privateDocumentMetadata> => {
  const user = await prisma.users.findUniqueOrThrow({
    where: {
      uuid: userUuid,
    },
  });

  const existingDocsCount = await prisma.files.count({
    where: {
      user_id: user.user_id,
      ownership_type: FILE_CONSTANTS.OWNERSHIP.PRIVATE,
      documents: {
        document_type: document_type,
      },
    },
  });

  if (existingDocsCount >= 3) {
    throw new BadRequestError(
      `You already uploaded 3 files of type: ${document_type}, if you want to replace one, try the replace option!`,
    );
  }

  const fileKey = await cloudOperations.uploadPrivateFileToCloud(
    fileData,
    FILE_CONSTANTS.BUCKET_FOLDER_NAME.DOCUMENT,
  );

  const newFile = await prisma.files.create({
    data: {
      file_name: fileData.originalname,
      file_url: fileKey,
      file_size: fileData.size,
      mime_type: fileData.mimetype,
      ownership_type: FILE_CONSTANTS.OWNERSHIP.PRIVATE,
      user_id: user.user_id,
      uploaded_by: user.user_id,

      documents: {
        create: {
          document_type: document_type,
          issue_date: issue_date ? new Date(issue_date) : null,
          expiry_date: expiry_date ? new Date(expiry_date) : null,
        },
      },
    },

    include: {
      documents: true,
      creator: creatorSelect,
    },
  });

  return newFile;
};

export const getPrivateDocumentUrl = async (
  userUuid: string,
  fileId: number,
  type: FILE_CONSTANTS.urlType,
): Promise<{ url: string; file: files }> => {
  const user = await prisma.users.findUniqueOrThrow({
    where: {
      uuid: userUuid,
    },
  });

  const file = await prisma.files.findUniqueOrThrow({
    where: {
      file_id: fileId,
      ownership_type: FILE_CONSTANTS.OWNERSHIP.PRIVATE,
      documents: {
        isNot: null,
      },
    },
    include: {
      file_shares: {
        where: {
          groups: {
            group_profiles: {
              some: {
                user_id: user.user_id,
              },
            },
          },
        },
        select: {
          audience: true,
          groups: {
            select: {
              uuid: true,
            },
          },
        },
      },
    },
  });

  const isOwner = file.user_id === user.user_id;
  let hasGroupAccess = false;

  if (!isOwner) {
    for (const share of file.file_shares) {
      const context = await loadPermissionContext(userUuid, share.groups.uuid);
      const readableAudiences = getReadableDocumentAudiences(context);

      if (readableAudiences.includes(share.audience)) {
        hasGroupAccess = true;
        break;
      }
    }
  }

  if (!isOwner && !hasGroupAccess) {
    throw new ForbiddenError('User does not have permission to view document!');
  }

  let presignedUrl;

  if (type === FILE_CONSTANTS.URL_TYPE.DOWNLOAD) {
    presignedUrl = await cloudOperations.generateDownloadLink(
      file.file_url,
      file.file_name as string,
    );
  } else {
    presignedUrl = await cloudOperations.getPrivatePresignedUrl(file.file_url);
  }

  return {
    url: presignedUrl,
    file: file,
  };
};

export const deletePrivateDocument = async (userUuid: string, fileId: number): Promise<void> => {
  const user = await prisma.users.findUniqueOrThrow({
    where: {
      uuid: userUuid,
    },
  });

  const file = await getOwnedPrivateDocument(user.user_id, fileId);

  // validate authorization
  if (file.user_id !== user.user_id) {
    throw new ForbiddenError('Users can only delete their own files!');
  }

  // deleting from Cloud
  await cloudOperations.deletePrivateFilesFromCloud([file.file_url]);

  // deleting from database table
  await prisma.files.delete({
    where: {
      file_id: file.file_id,
    },
  });
};

export const getAllPrivateDocumentsMetadataOfAUser = async (
  userUuid: string,
): Promise<privateDocumentMetadata[]> => {
  const user = await prisma.users.findUniqueOrThrow({
    where: {
      uuid: userUuid,
    },
  });

  const privateDocumentsMetadata = await prisma.files.findMany({
    where: {
      user_id: user.user_id,
      ownership_type: FILE_CONSTANTS.OWNERSHIP.PRIVATE,
    },
    include: {
      documents: true,
      creator: creatorSelect,
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  return privateDocumentsMetadata;
};

export const replacePrivateDocument = async (
  userUuid: string,
  fileId: number,
  document_type: string,
  fileData?: Express.Multer.File,
  issue_date?: string,
  expiry_date?: string,
): Promise<privateDocumentMetadata> => {
  const user = await prisma.users.findUniqueOrThrow({
    where: {
      uuid: userUuid,
    },
  });

  const file = await getOwnedPrivateDocument(user.user_id, fileId);

  // is the file really a document
  if (!file.documents) {
    throw new BadRequestError('This file is not a document!');
  }

  // validate authorization
  if (file.user_id !== user.user_id) {
    throw new ForbiddenError('Users can only replace their own files!');
  }

  const effectiveIssueDate =
    issue_date === undefined
      ? file.documents.issue_date
      : issue_date === ''
        ? null
        : new Date(issue_date);

  const effectiveExpiryDate =
    expiry_date === undefined
      ? file.documents.expiry_date
      : expiry_date === ''
        ? null
        : new Date(expiry_date);

  if (effectiveIssueDate && effectiveExpiryDate && effectiveExpiryDate < effectiveIssueDate) {
    throw new BadRequestError('Expiry date cannot be earlier than the issue date!');
  }

  const updateData: Prisma.filesUpdateInput = {
    updated_at: new Date(),
    documents: {
      update: {
        document_type: document_type,
        issue_date: issue_date === undefined ? undefined : effectiveIssueDate,
        expiry_date: expiry_date === undefined ? undefined : effectiveExpiryDate,
      },
    },
  };

  if (fileData) {
    // deleting old file from Cloud
    await cloudOperations.deletePrivateFilesFromCloud([file.file_url]);

    const fileKey = await cloudOperations.uploadPrivateFileToCloud(
      fileData,
      FILE_CONSTANTS.BUCKET_FOLDER_NAME.DOCUMENT,
    );

    updateData.file_name = fileData.originalname;
    updateData.file_url = fileKey;
    updateData.file_size = fileData.size;
    updateData.mime_type = fileData.mimetype;
  }

  const updatedFile = await prisma.files.update({
    where: {
      file_id: fileId,
    },
    data: updateData,
    include: {
      documents: true,
      creator: creatorSelect,
    },
  });

  return updatedFile;
};

export const shareDocumentsWithGroup = async (
  userUuid: string,
  groupUuid: string,
  fileId: number,
  audience: FILE_CONSTANTS.DocumentAudience,
): Promise<file_shares> => {
  const context = await loadPermissionContext(userUuid, groupUuid);
  const file = await getOwnedPrivateDocument(context.userId, fileId);

  // is the file already shared
  const alreadyShared = await prisma.file_shares.findFirst({
    where: {
      file_id: file.file_id,
      group_id: context.groupId,
    },
  });

  if (alreadyShared) {
    throw new ConflictError('File already shared with group!');
  }

  const sharingData = await prisma.file_shares.create({
    data: {
      file_id: file.file_id,
      group_id: context.groupId,
      shared_by: context.userId,
      audience,
    },
  });

  return sharingData;
};

export const deleteSharing = async (
  userUuid: string,
  groupUuid: string,
  fileId: number,
): Promise<void> => {
  const user = await prisma.users.findUniqueOrThrow({
    where: {
      uuid: userUuid,
    },
  });

  const group = await prisma.groups.findUniqueOrThrow({
    where: {
      uuid: groupUuid,
    },
  });

  const file = await getOwnedPrivateDocument(user.user_id, fileId);

  // validate authorization
  if (file.user_id !== user.user_id) {
    throw new ForbiddenError('Users can only delete sharing of their own files!');
  }

  const isShared = await prisma.file_shares.findFirst({
    where: {
      file_id: file.file_id,
      group_id: group.group_id,
    },
  });

  if (!isShared) {
    throw new BadRequestError('File must be shared before revoking the sharing!');
  }

  await prisma.file_shares.delete({
    where: {
      file_id_group_id: {
        file_id: file.file_id,
        group_id: group.group_id,
      },
    },
  });
};

export const updateSharingConditions = async (
  context: PermissionContext,
  fileId: number,
  audience: FILE_CONSTANTS.DocumentAudience,
): Promise<file_shares> => {
  const file = await getOwnedPrivateDocument(context.userId, fileId);

  const isShared = await prisma.file_shares.findFirst({
    where: {
      file_id: file.file_id,
      group_id: context.groupId,
    },
  });

  if (!isShared) {
    throw new BadRequestError('File must be shared before updating the sharing conditions!');
  }

  const updatedSharingConditions = await prisma.file_shares.update({
    where: {
      file_id_group_id: {
        file_id: file.file_id,
        group_id: context.groupId,
      },
    },
    data: {
      audience,
    },
  });

  return updatedSharingConditions;
};

export const listAllGroupsADocumentIsSharedWith = async (
  userUuid: string,
  fileId: number,
): Promise<docSharedWithGroups[]> => {
  const user = await prisma.users.findUniqueOrThrow({
    where: {
      uuid: userUuid,
    },
  });

  const file = await getOwnedPrivateDocument(user.user_id, fileId);

  // validate authorization
  if (file.user_id !== user.user_id) {
    throw new ForbiddenError('Users can only list sharing data of their own files!');
  }

  const docSharedWithGroups = await prisma.file_shares.findMany({
    where: {
      file_id: file.file_id,
    },
    select: {
      shared_by: true,
      shared_at: true,
      audience: true,

      groups: {
        select: {
          name: true,
        },
      },
    },
  });

  return docSharedWithGroups;
};

export const uploadGroupDocument = async (
  context: PermissionContext,
  fileData: Express.Multer.File,
  document_type: string,
  issue_date?: string,
  expiry_date?: string,
): Promise<privateDocumentMetadata> => {
  assertPermission(context, PERMISSIONS.DOCUMENTS_CONTRIBUTE);

  // uploading the document to the cloud
  const fileKey = await cloudOperations.uploadPrivateFileToCloud(
    fileData,
    FILE_CONSTANTS.BUCKET_FOLDER_NAME.GROUP_FILES,
  );

  // saving in database
  const newGroupDocument = await prisma.files.create({
    data: {
      file_name: fileData.originalname,
      file_url: fileKey,
      file_size: fileData.size,
      mime_type: fileData.mimetype,
      ownership_type: FILE_CONSTANTS.OWNERSHIP.GROUP,
      // it only has group_id, because the file belongs to a group, not to a single user
      group_id: context.groupId,
      uploaded_by: context.userId,

      documents: {
        create: {
          document_type: document_type,
          issue_date: issue_date ? new Date(issue_date) : null,
          expiry_date: expiry_date ? new Date(expiry_date) : null,
        },
      },
    },

    include: {
      documents: true,
      creator: creatorSelect,
    },
  });

  return newGroupDocument;
};

export const uploadGroupMediaFile = async (
  context: PermissionContext,
  fileData: Express.Multer.File,
  description?: string,
): Promise<GroupMediaFile> => {
  assertPermission(context, PERMISSIONS.MEDIA_CONTRIBUTE);

  const fileKey = await cloudOperations.uploadPrivateFileToCloud(
    fileData,
    FILE_CONSTANTS.BUCKET_FOLDER_NAME.GROUP_FILES,
  );

  const newGroupMedia = await prisma.files.create({
    data: {
      file_name: fileData.originalname,
      file_url: fileKey,
      file_size: fileData.size,
      mime_type: fileData.mimetype,
      ownership_type: FILE_CONSTANTS.OWNERSHIP.GROUP,
      group_id: context.groupId,
      uploaded_by: context.userId,

      media_files: {
        create: {
          description: description || null,
        },
      },
    },

    include: {
      media_files: true,
    },
  });

  return newGroupMedia;
};

export const updateGroupDocument = async (
  context: PermissionContext,
  fileId: number,
  document_type?: string,
  fileData?: Express.Multer.File,
  issue_date?: string,
  expiry_date?: string,
): Promise<privateDocumentMetadata> => {
  const file = await prisma.files.findUniqueOrThrow({
    where: {
      file_id: fileId,
      group_id: context.groupId,
      ownership_type: FILE_CONSTANTS.OWNERSHIP.GROUP,
      documents: {
        isNot: null,
      },
      media_files: {
        is: null,
      },
    },
    include: {
      documents: true,
      creator: creatorSelect,
    },
  });

  // is the file really a document
  if (!file.documents) {
    throw new BadRequestError('This file is not a document!');
  }

  assertGroupFileWriteAccess(context, file.uploaded_by, FILE_CONSTANTS.GROUP_FILE_TYPE.DOCUMENT);

  const effectiveIssueDate =
    issue_date === undefined
      ? file.documents.issue_date
      : issue_date === ''
        ? null
        : new Date(issue_date);

  const effectiveExpiryDate =
    expiry_date === undefined
      ? file.documents.expiry_date
      : expiry_date === ''
        ? null
        : new Date(expiry_date);

  if (effectiveIssueDate && effectiveExpiryDate && effectiveExpiryDate < effectiveIssueDate) {
    throw new BadRequestError('Expiry date cannot be earlier than the issue date!');
  }

  const updateData: Prisma.filesUpdateInput = {
    updated_at: new Date(),
    documents: {
      update: {
        // if the user did not send anything, the data stays the same,
        // if the user sent an empty string the new data will be null in the database,
        // and if the user sent a valid date we will put that in the database
        document_type:
          document_type === undefined ? undefined : document_type === '' ? null : document_type,
        issue_date:
          issue_date === undefined ? undefined : issue_date === '' ? null : new Date(issue_date),
        expiry_date:
          expiry_date === undefined ? undefined : expiry_date === '' ? null : new Date(expiry_date),
      },
    },
  };

  // if the user wants to change the file too
  if (fileData) {
    await cloudOperations.deletePrivateFilesFromCloud([file.file_url]);
    const fileKey = await cloudOperations.uploadPrivateFileToCloud(
      fileData,
      FILE_CONSTANTS.BUCKET_FOLDER_NAME.GROUP_FILES,
    );

    updateData.file_name = fileData.originalname;
    updateData.file_url = fileKey;
    updateData.file_size = fileData.size;
    updateData.mime_type = fileData.mimetype;
  }

  const updatedFile = await prisma.files.update({
    where: {
      file_id: file.file_id,
    },

    data: updateData,

    include: {
      documents: true,
      creator: creatorSelect,
    },
  });

  return updatedFile;
};

export const updateGroupMediaFile = async (
  context: PermissionContext,
  fileId: number,
  fileData?: Express.Multer.File,
  description?: string,
): Promise<GroupMediaFile> => {
  const file = await prisma.files.findUniqueOrThrow({
    where: {
      file_id: fileId,
      group_id: context.groupId,
      ownership_type: FILE_CONSTANTS.OWNERSHIP.GROUP,
      media_files: {
        isNot: null,
      },
      documents: {
        is: null,
      },
    },
    include: {
      media_files: true,
    },
  });

  // is the file really a media file
  if (!file.media_files) {
    throw new BadRequestError('This file is not a media file!');
  }

  assertGroupFileWriteAccess(context, file.uploaded_by, FILE_CONSTANTS.GROUP_FILE_TYPE.MEDIA_FILE);

  const updateData: Prisma.filesUpdateInput = {
    updated_at: new Date(),
    media_files: {
      update: {
        description:
          description === undefined ? undefined : description === '' ? null : description,
      },
    },
  };

  if (fileData) {
    await cloudOperations.deletePrivateFilesFromCloud([file.file_url]);
    const fileKey = await cloudOperations.uploadPrivateFileToCloud(
      fileData,
      FILE_CONSTANTS.BUCKET_FOLDER_NAME.GROUP_FILES,
    );

    updateData.file_name = fileData.originalname;
    updateData.file_url = fileKey;
    updateData.file_size = fileData.size;
    updateData.mime_type = fileData.mimetype;
  }

  const updatedMediaFile = await prisma.files.update({
    where: {
      file_id: file.file_id,
    },

    data: updateData,

    include: {
      media_files: true,
    },
  });

  return updatedMediaFile;
};

export const deleteGroupFile = async (
  context: PermissionContext,
  fileId: number,
): Promise<void> => {
  const file = await prisma.files.findUniqueOrThrow({
    where: {
      file_id: fileId,
      group_id: context.groupId,
      ownership_type: FILE_CONSTANTS.OWNERSHIP.GROUP,
    },
    include: {
      documents: true,
      media_files: true,
    },
  });

  if ((!file.documents && !file.media_files) || (file.documents && file.media_files)) {
    throw new BadRequestError('Invalid group file type!');
  }

  const type = file.documents
    ? FILE_CONSTANTS.GROUP_FILE_TYPE.DOCUMENT
    : FILE_CONSTANTS.GROUP_FILE_TYPE.MEDIA_FILE;

  assertGroupFileWriteAccess(context, file.uploaded_by, type);

  await cloudOperations.deletePrivateFilesFromCloud([file.file_url]);

  await prisma.files.delete({
    where: {
      file_id: file.file_id,
    },
  });
};

export const getGroupFiles = async (
  context: PermissionContext,
  limit: number,
  cursor?: number,
  type?: FILE_CONSTANTS.GroupFileType,
): Promise<PaginatedGroupFiles> => {
  if (type === FILE_CONSTANTS.GROUP_FILE_TYPE.DOCUMENT) {
    assertPermission(context, PERMISSIONS.DOCUMENTS_READ);
  }

  if (type === FILE_CONSTANTS.GROUP_FILE_TYPE.MEDIA_FILE) {
    assertPermission(context, PERMISSIONS.MEDIA_READ);
  }

  const readableFileFilters: Prisma.filesWhereInput[] = [];

  if (
    type !== FILE_CONSTANTS.GROUP_FILE_TYPE.MEDIA_FILE &&
    context.effectivePermissions.includes(PERMISSIONS.DOCUMENTS_READ)
  ) {
    readableFileFilters.push({
      documents: { isNot: null },
      media_files: { is: null },
    });
  }

  if (
    type !== FILE_CONSTANTS.GROUP_FILE_TYPE.DOCUMENT &&
    context.effectivePermissions.includes(PERMISSIONS.MEDIA_READ)
  ) {
    readableFileFilters.push({
      media_files: { isNot: null },
      documents: { is: null },
    });
  }

  if (readableFileFilters.length === 0) {
    throw new ForbiddenError('User does not have permission to read group files!');
  }

  const queryOptions = {
    take: limit + 1,
    where: {
      group_id: context.groupId,
      ownership_type: FILE_CONSTANTS.OWNERSHIP.GROUP,
      OR: readableFileFilters,
    },
    include: {
      documents: true,
      media_files: true,
      creator: creatorSelect,
    },

    orderBy: [{ created_at: 'desc' }, { file_id: 'desc' }],
    ...(cursor ? { cursor: { file_id: cursor }, skip: 1 } : {}),
  } satisfies Prisma.filesFindManyArgs;

  const groupFiles = await prisma.files.findMany(queryOptions);
  const hasNextPage = groupFiles.length > limit;
  const pageFiles = groupFiles.slice(0, limit);

  // generating presigned URLs
  const filesWithUrls = await Promise.all(
    groupFiles.map(async (file: GroupFile) => {
      const presignedUrl = await cloudOperations.getPrivatePresignedUrl(file.file_url);

      return {
        ...file,
        download_url: presignedUrl,
      };
    }),
  );

  const nextCursor = hasNextPage ? pageFiles[pageFiles.length - 1].file_id : null;

  return {
    items: filesWithUrls,
    meta: {
      next_cursor: nextCursor,
      has_next_page: nextCursor !== null,
      limit: limit,
      count: groupFiles.length,
    },
  };
};

export const getAllPrivateDocumentsMetadataOfAllUsersInAGroup = async (
  context: PermissionContext,
  filters: SharedDocumentsFilter,
): Promise<SharedPrivateDocumentMetadata[]> => {
  const readableAudiences = getReadableDocumentAudiences(context);

  if (readableAudiences.length === 0) {
    throw new ForbiddenError('User does not have permission to read shared documents!');
  }

  const privateDocumentsList = await prisma.files.findMany({
    where: {
      file_shares: {
        some: {
          group_id: context.groupId,
          audience: {
            in: readableAudiences,
          },
        },
      },

      ownership_type: FILE_CONSTANTS.OWNERSHIP.PRIVATE,

      owner: filters.targetUserUuid ? { uuid: filters.targetUserUuid } : undefined,

      documents: filters.documentType ? { document_type: filters.documentType } : { isNot: null },
    },

    include: {
      owner: creatorSelect,
      documents: true,
      file_shares: {
        where: {
          group_id: context.groupId,
          audience: {
            in: readableAudiences,
          },
        },
      },
    },

    orderBy: {
      created_at: 'desc',
    },
  });

  return privateDocumentsList;
};
