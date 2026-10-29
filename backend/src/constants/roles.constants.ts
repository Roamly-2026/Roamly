import { MEMBER_PERMISSIONS, PERMISSIONS } from './permission.constants';

export const SYSTEM_ROLES = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
  CUSTOM: 'CUSTOM',
} as const;

export type SystemRole = (typeof SYSTEM_ROLES)[keyof typeof SYSTEM_ROLES];

export const ROLE_PRESETS = {
  LEADER: {
    // leader can do everything crucial to managing assets, but cant create custom roles
    name: 'Leader',
    permissions: [
      PERMISSIONS.GROUP_MANAGE,
      PERMISSIONS.MEMBERS_MANAGE,
      PERMISSIONS.EVENTS_MANAGE,
      PERMISSIONS.DOCUMENTS_MANAGE,
      PERMISSIONS.MEDIA_MANAGE,
      PERMISSIONS.PERSONAL_DOCUMENTS_READ_RESTRICTED,
    ],
  },
  EVENT_ORGANIZER: {
    name: 'Event Organizer',
    permissions: [...MEMBER_PERMISSIONS, PERMISSIONS.EVENTS_MANAGE],
  },
  DOCUMENT_MANAGER: {
    name: 'Document Manager',
    permissions: [
      ...MEMBER_PERMISSIONS,
      PERMISSIONS.DOCUMENTS_MANAGE,
      PERMISSIONS.PERSONAL_DOCUMENTS_READ_RESTRICTED,
    ],
  },
  MEDIA_MANAGER: {
    name: 'Media Manager',
    permissions: [...MEMBER_PERMISSIONS, PERMISSIONS.MEDIA_MANAGE],
  },
} as const;
