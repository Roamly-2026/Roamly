import { Prisma } from '@prisma/client';

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
    access_level: true;

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
    media_files: true;

    creator: typeof creatorSelect;
  };
}>;

export type GroupFileWithUrl = GroupFile & {
  download_url: string;
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

export type GroupMemberPrivateDocument = Prisma.filesGetPayload<{
  include: {
    documents: true;
    owner: typeof creatorSelect;
    file_shares: true;
  };
}>;
