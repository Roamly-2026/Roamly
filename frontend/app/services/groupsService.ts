// frontend/app/services/groupsService.ts
import type {
  GroupOutDto,
  RawGroupDto,
  GroupInfosOutDto,
  GroupMembershipRole,
  GroupSummary,
  MyGroupPermissionsDto,
} from '~/types/groups.type';
import type {
  PaginatedGroupsResponse,
  RawPaginatedGroupsResponse,
  PaginatedGroupInvitesResponse,
  RawPaginatedGroupInvitesResponse,
} from '~/types/paginatedGroups.type';
import type { ApiResponse } from '~/types/api.type';
import { useApi } from '~/composables/useApi';
import type { CreateGroupInput } from '~/utils/schemas/groups.schema';

const mapGroupData = (
  item: GroupSummary,
  membership: GroupMembershipRole | undefined,
): GroupOutDto => {
  if (!membership) throw new Error(UI_TEXT.errors.invalidData);

  return {
    uuid: item.uuid,
    name: item.name,
    current_size: item.current_size,
    created_at: item.created_at ? new Date(item.created_at).toLocaleDateString() : '',
    system_role: membership.system_role,
    custom_role: membership.custom_role,
  };
};

export const groupsService = {
  async listGroups(limit: number = 15, cursor?: string): Promise<PaginatedGroupsResponse> {
    const api = useApi();
    const query: Record<string, string | number> = { limit };
    if (cursor) {
      query.cursor = cursor;
    }

    const response = await api<ApiResponse<RawPaginatedGroupsResponse>>('/groups', {
      method: 'GET',
      query,
    });

    return {
      ...response.data,
      items: response.data.items.map((item) => mapGroupData(item, item.group_profiles[0])),
    };
  },

  async createGroup(data: CreateGroupInput): Promise<GroupOutDto> {
    const api = useApi();
    const response = await api<ApiResponse<RawGroupDto>>('/groups', {
      method: 'POST',
      body: data,
    });

    return mapGroupData(response.data, response.data.group_profiles[0]);
  },

  async deleteGroup(groupUuid: string): Promise<void> {
    const api = useApi();
    await api<ApiResponse<void>>(`/groups/${groupUuid}`, {
      method: 'DELETE',
    });
  },

  async joinGroup(groupUuid: string): Promise<void> {
    const api = useApi();
    await api<ApiResponse<void>>(`/groups/${groupUuid}/join`, {
      method: 'POST',
    });
  },

  async leaveGroup(groupUuid: string): Promise<void> {
    const api = useApi();
    await api<ApiResponse<void>>(`/groups/${groupUuid}/leave`, {
      method: 'DELETE',
    });
  },

  async getPendingInvites(
    limit: number = 15,
    cursor?: string,
  ): Promise<PaginatedGroupInvitesResponse> {
    const api = useApi();
    const query: Record<string, string | number> = { limit };
    if (cursor) {
      query.cursor = cursor;
    }

    const response = await api<ApiResponse<RawPaginatedGroupInvitesResponse>>('/groups/invites', {
      method: 'GET',
      query,
    });

    return {
      ...response.data,
      items: response.data.items.map((item) => mapGroupData(item, item.groupInvites[0])),
    };
  },

  async getGroupInfos(groupUuid: string): Promise<GroupInfosOutDto> {
    const api = useApi();
    const response = await api<ApiResponse<GroupInfosOutDto>>(`/groups/${groupUuid}`, {
      method: 'GET',
    });
    return response.data;
  },

  async getMyPermissions(groupUuid: string): Promise<MyGroupPermissionsDto> {
    const api = useApi();
    const response = await api<ApiResponse<MyGroupPermissionsDto>>(
      `/groups/${groupUuid}/my-permissions`,
    );
    return response.data;
  },

  async updateGroup(groupUuid: string, data: { name: string }): Promise<void> {
    const api = useApi();
    await api<ApiResponse<GroupSummary>>(`/groups/${groupUuid}`, {
      method: 'PATCH',
      body: data,
    });
  },

  async inviteUser(
    groupUuid: string,
    data: { invitedUserEmail: string; inviteWithRole: string },
  ): Promise<void> {
    const api = useApi();
    await api<ApiResponse<void>>(`/groups/${groupUuid}/invite`, {
      method: 'POST',
      body: data,
    });
  },

  async removeUserFromGroup(groupUuid: string, userUuid: string): Promise<void> {
    const api = useApi();
    await api<ApiResponse<void>>(`/groups/${groupUuid}/users/${userUuid}`, {
      method: 'DELETE',
    });
  },
};
