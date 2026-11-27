export const SYSTEM_ROLES = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
  CUSTOM: 'CUSTOM',
} as const;

export type SystemRole = (typeof SYSTEM_ROLES)[keyof typeof SYSTEM_ROLES];

export const PERMISSIONS = {
  GROUP_MANAGE: 'group:manage',
  GROUP_MANAGE_ROLES: 'group:manage_roles',
  MEMBERS_MANAGE: 'members:manage',
  EVENTS_READ: 'events:read',
  EVENTS_CONTRIBUTE: 'events:contribute',
  EVENTS_MANAGE: 'events:manage',
  DOCUMENTS_READ: 'documents:read',
  DOCUMENTS_CONTRIBUTE: 'documents:contribute',
  DOCUMENTS_MANAGE: 'documents:manage',
  MEDIA_READ: 'media:read',
  MEDIA_CONTRIBUTE: 'media:contribute',
  MEDIA_MANAGE: 'media:manage',
  PERSONAL_DOCUMENTS_READ_RESTRICTED: 'personal-documents:read-restricted',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
