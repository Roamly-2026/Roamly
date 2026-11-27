// frontend/app/stores/groups.modals.store.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { GroupOutDto, GroupInvitesOutDto, GroupProfileDto } from '~/types/groups.type';
import type { UserProfileModalDto } from '~/types/user.type';

/**
 * Manages modal states and target entities for groups, invitations, and members.
 */
export const useGroupsStore = defineStore('groups', () => {
  const isCreateModalOpen = ref(false);
  const isDeleteModalOpen = ref(false);
  const isLeaveModalOpen = ref(false);
  const isJoinModalOpen = ref(false);
  const isRemoveUserModalOpen = ref(false);
  const isUpdateModalOpen = ref(false);
  const isInviteModalOpen = ref(false);
  const isUserProfileModalOpen = ref(false);

  const groupNameToUpdate = ref('');
  const selectedGroupToDelete = ref<GroupOutDto | null>(null);
  const selectedGroupToLeave = ref<GroupOutDto | null>(null);
  const selectedGroupToJoin = ref<GroupInvitesOutDto | null>(null);
  const selectedMemberToRemove = ref<GroupProfileDto | null>(null);
  const selectedUserProfile = ref<UserProfileModalDto | null>(null);

  const openCreateModal = () => {
    isCreateModalOpen.value = true;
  };

  const closeCreateModal = () => {
    isCreateModalOpen.value = false;
  };

  const openDeleteModal = (group: GroupOutDto) => {
    selectedGroupToDelete.value = group;
    isDeleteModalOpen.value = true;
  };

  const closeDeleteModal = () => {
    isDeleteModalOpen.value = false;
    selectedGroupToDelete.value = null;
  };

  const openLeaveModal = (group: GroupOutDto) => {
    selectedGroupToLeave.value = group;
    isLeaveModalOpen.value = true;
  };

  const closeLeaveModal = () => {
    isLeaveModalOpen.value = false;
    selectedGroupToLeave.value = null;
  };

  const openJoinModal = (group: GroupInvitesOutDto) => {
    selectedGroupToJoin.value = group;
    isJoinModalOpen.value = true;
  };

  const closeJoinModal = () => {
    isJoinModalOpen.value = false;
    selectedGroupToJoin.value = null;
  };

  const openUpdateModal = (currentName: string) => {
    groupNameToUpdate.value = currentName;
    isUpdateModalOpen.value = true;
  };

  const closeUpdateModal = () => {
    isUpdateModalOpen.value = false;
  };

  const openInviteModal = () => {
    isInviteModalOpen.value = true;
  };

  const closeInviteModal = () => {
    isInviteModalOpen.value = false;
  };

  const openRemoveUserModal = (profile: GroupProfileDto) => {
    selectedMemberToRemove.value = profile;
    isRemoveUserModalOpen.value = true;
  };

  const closeRemoveUserModal = () => {
    isRemoveUserModalOpen.value = false;
    selectedMemberToRemove.value = null;
  };

  const openUserProfileModal = (profile: UserProfileModalDto) => {
    selectedUserProfile.value = profile;
    isUserProfileModalOpen.value = true;
  };

  const closeUserProfileModal = () => {
    isUserProfileModalOpen.value = false;
    selectedUserProfile.value = null;
  };

  return {
    isCreateModalOpen,
    isDeleteModalOpen,
    isJoinModalOpen,
    isLeaveModalOpen,
    isUpdateModalOpen,
    isInviteModalOpen,
    isRemoveUserModalOpen,
    isUserProfileModalOpen,
    groupNameToUpdate,

    selectedGroupToLeave,
    selectedGroupToJoin,
    selectedGroupToDelete,
    selectedMemberToRemove,
    selectedUserProfile,

    openCreateModal,
    closeCreateModal,
    openDeleteModal,
    closeDeleteModal,
    openLeaveModal,
    closeLeaveModal,
    openJoinModal,
    closeJoinModal,
    openUpdateModal,
    closeUpdateModal,
    openInviteModal,
    closeInviteModal,
    openRemoveUserModal,
    closeRemoveUserModal,
    openUserProfileModal,
    closeUserProfileModal,
  };
});
