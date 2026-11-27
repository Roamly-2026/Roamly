import type { Permission, SystemRole } from '~/utils/constants/permissions.constants';

export interface CustomGroupRole {
  uuid: string;
  name: string;
}

export interface GroupMembershipRole {
  system_role: SystemRole;
  custom_role: CustomGroupRole | null;
}

export interface GroupSummary {
  uuid: string;
  name: string;
  current_size: number;
  created_at: string;
}

export type GroupOutDto = GroupSummary & GroupMembershipRole;

export interface RawGroupDto extends GroupSummary {
  group_profiles: GroupMembershipRole[];
}

export interface GroupProfileDto extends GroupMembershipRole {
  users: {
    uuid: string;
    email: string;
    username: string;
    profile_image_url?: string | null;
  };
  nickname: string | null;
  description: string | null;
}

export interface GroupInfosOutDto {
  name: string;
  current_size: number;
  created_at: string;
  group_profiles: GroupProfileDto[];
}

export interface RawGroupInvitesDto extends GroupSummary {
  groupInvites: GroupMembershipRole[];
}

export type GroupInvitesOutDto = GroupOutDto;

export interface MyGroupPermissionsDto {
  systemRole: SystemRole;
  customRole: CustomGroupRole | null;
  effectivePermissions: Permission[];
}

export interface AvailableGroupRoleDto {
  id: string;
  name: string;
  isSystem: boolean;
}
