//  avaliable permissions, contribute means, you can create and manage your own, and manage means you can modify all
export const PERMISSIONS = {
  GROUP_MANAGE: 'group:manage',
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
  // reads personal documents explicitly shared with document reviewers
  PERSONAL_DOCUMENTS_READ_RESTRICTED: 'personal-documents:read-restricted',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// the default permissions of a member
export const MEMBER_PERMISSIONS = [
  PERMISSIONS.EVENTS_READ,
  PERMISSIONS.DOCUMENTS_READ,
  PERMISSIONS.MEDIA_CONTRIBUTE,
] as const;

//  it lists the permissions that are boundled together and wich enclose eachother
export const PERMISSION_CHAINS = [
  [PERMISSIONS.EVENTS_READ, PERMISSIONS.EVENTS_CONTRIBUTE, PERMISSIONS.EVENTS_MANAGE],
  [PERMISSIONS.DOCUMENTS_READ, PERMISSIONS.DOCUMENTS_CONTRIBUTE, PERMISSIONS.DOCUMENTS_MANAGE],
  [PERMISSIONS.MEDIA_READ, PERMISSIONS.MEDIA_CONTRIBUTE, PERMISSIONS.MEDIA_MANAGE],
] as const;
