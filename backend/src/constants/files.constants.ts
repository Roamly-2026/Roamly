export const OWNERSHIP = {
  PRIVATE: 'PRIVATE',
  GROUP: 'GROUP',
} as const;

export type Ownership = (typeof OWNERSHIP)[keyof typeof OWNERSHIP];

export const BUCKET_FOLDER_NAME = {
  DOCUMENT: 'document',
  GROUP_FILES: 'group_files',
} as const;

export type BucketFolderName = (typeof BUCKET_FOLDER_NAME)[keyof typeof BUCKET_FOLDER_NAME];

export const PRIVATE_DOCUMENT_TYPES = {
  ID: 'ID',
  PASSPORT: 'PASSPORT',
  DRIVING_LICENSE: 'DRIVING_LICENSE',
  OTHER: 'OTHER',
} as const;

export type PrivateDocumentType =
  (typeof PRIVATE_DOCUMENT_TYPES)[keyof typeof PRIVATE_DOCUMENT_TYPES];

export const GROUP_FILE_TYPE = {
  DOCUMENT: 'document',
  MEDIA_FILE: 'media',
} as const;

export type GroupFileType = (typeof GROUP_FILE_TYPE)[keyof typeof GROUP_FILE_TYPE];

export const URL_TYPE = {
  VIEW: 'view',
  DOWNLOAD: 'download',
} as const;

export type urlType = (typeof URL_TYPE)[keyof typeof URL_TYPE];

export const MAX_DOCUMENTS_PER_TYPE = 3;
