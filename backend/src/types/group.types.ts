import { Prisma } from '@prisma/client';

export type CreatedGroup = Prisma.groupsGetPayload<{
  include: {
    group_profiles: {
      include: {
        custom_role: true;
      };
    };
  };
}>;

export type GroupWithRole = Prisma.groupsGetPayload<{
  select: {
    uuid: true;
    name: true;
    current_size: true;
    created_at: true;
    group_profiles: {
      select: {
        system_role: true;
        custom_role: {
          select: {
            uuid: true;
            name: true;
          };
        };
      };
    };
  };
}>;

export type PaginatedGroups = {
  items: GroupWithRole[];
  meta: {
    next_cursor: string | null;
    has_next_page: boolean;
    limit: number;
    count: number;
  };
};

export type GroupWithInvite = Omit<GroupWithRole, 'group_profiles'> & {
  groupInvites: GroupWithRole['group_profiles'];
};

export type PaginatedInvites = Omit<PaginatedGroups, 'items'> & {
  items: GroupWithInvite[];
};

export type profileRelatedToTheGroup = Prisma.group_profilesGetPayload<{
  include: {
    custom_role: true;
  };
}>;

export type GroupProfilesInfos = Prisma.group_profilesGetPayload<{
  select: {
    users: {
      select: {
        email: true;
        username: true;
      };
    };
    system_role: true;
    custom_role: {
      select: {
        uuid: true;
        name: true;
      };
    };
  };
}>;

export type InfosOfTheGroupTheUserIsPartOf = Prisma.groupsGetPayload<{
  select: {
    name: true;
    current_size: true;
    created_at: true;

    group_profiles: {
      select: {
        users: {
          select: {
            uuid: true;
            email: true;
            username: true;
            profile_image_url: true;
          };
        };
        system_role: true;
        custom_role: {
          select: {
            uuid: true;
            name: true;
          };
        };
        nickname: true;
        description: true;
      };
    };
  };
}>;

export type userGroupProfile = Prisma.group_profilesGetPayload<{
  select: {
    nickname: true;
    description: true;

    system_role: true;
    custom_role: {
      select: {
        uuid: true;
        name: true;
      };
    };
  };
}>;
