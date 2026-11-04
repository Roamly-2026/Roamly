import { Prisma } from '@prisma/client';
import type { MemoryReactionSummary } from './memories.types';

export const creatorSelect = {
  select: {
    uuid: true,
    username: true,
    email: true,
    profile_image_url: true,
  },
} as const;

export type privateDocumentMetadata = Prisma.filesGetPayload<{
  include: {
    documents: true;
    creator: typeof creatorSelect;
  };
}>;

export type docSharedWithGroups = Prisma.file_sharesGetPayload<{
  select: {
    shared_by: true;
    shared_at: true;
    audience: true;

    groups: {
      select: {
        name: true;
      };
    };
  };
}>;

export type GroupFile = Prisma.filesGetPayload<{
  include: {
    documents: true;
    media_files: {
      include: {
        media_reactions: {
          select: {
            emoji: true;
            user_id: true;
          };
        };
      };
    };

    creator: typeof creatorSelect;
  };
}>;

export type GroupFileWithUrl = Omit<GroupFile, 'media_files'> & {
  media_files: Omit<NonNullable<GroupFile['media_files']>, 'media_reactions'> | null;
  download_url: string;
  reactions: MemoryReactionSummary[];
};

export type PaginatedGroupFiles = {
  items: GroupFileWithUrl[];
  meta: {
    next_cursor: number | null;
    has_next_page: boolean;
    limit: number;
    count: number;
  };
};

export type GroupMediaFile = Prisma.filesGetPayload<{
  include: {
    media_files: true;
  };
}>;

export type GroupMemberPrivateDocument = Prisma.filesGetPayload<{
  include: {
    owner: typeof creatorSelect;
    documents: true;
    file_shares: true;
  };
}>;

export type SharedPrivateDocumentMetadata = GroupMemberPrivateDocument;
