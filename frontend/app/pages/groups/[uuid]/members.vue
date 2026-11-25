<!-- frontend/app/pages/groups/[uuid]/members.vue -->
<template>
  <div>
    <ClientOnly>
      <template #fallback>
        <div class="min-h-screen flex items-center justify-center">
          <span class="opacity-50 font-medium">{{ UI_TEXT.common.loading }}</span>
        </div>
      </template>
      <MembersMobile
        v-if="isMobile"
        :group-infos="groupInfos"
        :filtered-members="filteredMembers"
        :is-loading="isLoading"
        :error="error"
        :search-query="searchQuery"
        :can-rename-group="canRenameGroup"
        :can-invite-member="canInviteMember"
        :can-remove-member="canRemoveMember"
        :can-delete-group="canDeleteGroup"
        :can-leave-group="canLeaveCurrentGroup"
        :can-read-events="canReadEvents"
        :current-user-uuid="currentUserUuid"
        @update:search-query="searchQuery = $event"
        @delete-group="handleDeleteCurrentGroup"
        @leave-group="handleLeaveCurrentGroup"
        @open-profile="handleOpenProfile"
      />

      <MembersDesktop
        v-else
        :group-infos="groupInfos"
        :filtered-members="filteredMembers"
        :is-loading="isLoading"
        :error="error"
        :search-query="searchQuery"
        :can-rename-group="canRenameGroup"
        :can-invite-member="canInviteMember"
        :can-remove-member="canRemoveMember"
        :can-delete-group="canDeleteGroup"
        :can-leave-group="canLeaveCurrentGroup"
        :can-read-events="canReadEvents"
        :current-user-uuid="currentUserUuid"
        @update:search-query="searchQuery = $event"
        @delete-group="handleDeleteCurrentGroup"
        @leave-group="handleLeaveCurrentGroup"
        @open-profile="handleOpenProfile"
      />
    </ClientOnly>

    <!-- User profile modal — groupUuid enables per-user doc fetching for leaders -->
    <UserProfileModal :group-uuid="groupUuid" />
  </div>
</template>

<script setup lang="ts">
/* --- IMPORTS --- */
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useScreenSize } from '~/composables/useScreenSize';
import { useProtectedPage } from '~/composables/useProtectedPage';
import { useGroupInfosQuery } from '~/queries/groups.query';
import { useGroupsStore } from '~/stores/groups.modals.store';
import type { GroupOutDto, GroupProfileDto } from '~/types/groups.type';

/* --- PAGE CONFIGURATION --- */
definePageMeta({ layout: 'general', middleware: ['auth'] });

/* --- COMPOSABLES & STORES --- */
useProtectedPage();
const { isMobile } = useScreenSize();
const route = useRoute();
const groupsStore = useGroupsStore();

/* --- STATE & COMPUTED --- */
const groupUuid = computed(() => route.params.uuid as string);
const searchQuery = ref('');
const debouncedQuery = ref('');
let debounceTimeout: ReturnType<typeof setTimeout>;

/* --- API QUERIES --- */
const { data: groupInfos, isLoading, error } = useGroupInfosQuery(groupUuid);

/* --- FILTER LOGIC --- */
watch(searchQuery, (newVal) => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    debouncedQuery.value = newVal;
  }, 300);
});

const filteredMembers = computed(() => {
  if (!groupInfos.value?.group_profiles) return [];
  if (!debouncedQuery.value) return groupInfos.value.group_profiles;

  const query = debouncedQuery.value.toLowerCase();
  return groupInfos.value.group_profiles.filter(
    (profile) =>
      profile.users.username.toLowerCase().includes(query) ||
      getGroupRoleLabel(profile.system_role, profile.custom_role).toLowerCase().includes(query),
  );
});

const { currentUserUuid, systemRole, customRole, hasPermission } = useGroupPermission(groupUuid);

const canRenameGroup = computed(() => hasPermission(PERMISSIONS.GROUP_MANAGE));
const canInviteMember = computed(() => hasPermission(PERMISSIONS.MEMBERS_MANAGE));
const canReadEvents = computed(() => hasPermission(PERMISSIONS.EVENTS_READ));
const canDeleteGroup = computed(() => systemRole.value === SYSTEM_ROLES.OWNER);
const canLeaveCurrentGroup = computed(() =>
  canLeaveGroup(systemRole.value, groupInfos.value?.current_size),
);

const canRemoveMember = (profile: GroupProfileDto) =>
  canInviteMember.value && canRemoveGroupMember(profile, systemRole.value, currentUserUuid.value);

const currentGroup = computed<GroupOutDto | undefined>(() => {
  const info = groupInfos.value;
  if (!info || !systemRole.value) return;

  return {
    uuid: groupUuid.value,
    name: info.name,
    current_size: info.current_size,
    created_at: info.created_at,
    system_role: systemRole.value,
    custom_role: customRole.value,
  };
});

const handleLeaveCurrentGroup = () => {
  if (currentGroup.value && canLeaveCurrentGroup.value) {
    groupsStore.openLeaveModal(currentGroup.value);
  }
};

const handleDeleteCurrentGroup = () => {
  if (currentGroup.value && canDeleteGroup.value) {
    groupsStore.openDeleteModal(currentGroup.value);
  }
};

const handleOpenProfile = (profile: GroupProfileDto) => {
  groupsStore.openUserProfileModal({
    userUuid: profile.users.uuid,
    username: profile.users.username,
    email: profile.users.email,
    system_role: profile.system_role,
    custom_role: profile.custom_role,
    joinedAt: groupInfos.value?.created_at ?? UI_TEXT.common.unknown,
  });
};
</script>
