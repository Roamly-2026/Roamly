// frontend/app/stores/groups.modals.store.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { GroupOutDto, GroupInvitesOutDto } from '~/types/groups.type';
import type { UserProfileModalDto } from '~/types/user.type';

/**
 * Manages modal states and target entities for group administration, invitations, and member role changes.
 */
export const useGroupsStore = defineStore('groups', () => {
  const isCreateModalOpen = ref(false);
  const isDeleteModalOpen = ref(false);
  const isLeaveModalOpen = ref(false);
  const isJoinModalOpen = ref(false);
  const isDeclineModalOpen = ref(false);
  const isRemoveUserModalOpen = ref(false);
  const isUpdateModalOpen = ref(false);
  const isInviteModalOpen = ref(false);
  const isPromoteUserModalOpen = ref(false);
  const isDemoteUserModalOpen = ref(false);
  const isUserProfileModalOpen = ref(false);

  const groupNameToUpdate = ref('');
  const selectedUserEmailToPromote = ref<string | null>(null);
  const selectedUserNameToPromote = ref<string | null>(null);
  const selectedUserEmailToDemote = ref<string | null>(null);
  const selectedUserNameToDemote = ref<string | null>(null);
  const selectedGroupToDelete = ref<GroupOutDto | null>(null);
  const selectedGroupToLeave = ref<GroupOutDto | null>(null);
  const selectedGroupToJoin = ref<GroupInvitesOutDto | null>(null);
  const selectedGroupToDecline = ref<GroupInvitesOutDto | null>(null);
  const selectedUserEmailToRemove = ref<string | null>(null);
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

  const openDeclineModal = (group: GroupInvitesOutDto) => {
    selectedGroupToDecline.value = group;
    isDeclineModalOpen.value = true;
  };

  const closeDeclineModal = () => {
    isDeclineModalOpen.value = false;
    selectedGroupToDecline.value = null;
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

  const openRemoveUserModal = (email: string) => {
    selectedUserEmailToRemove.value = email;
    isRemoveUserModalOpen.value = true;
  };

  const closeRemoveUserModal = () => {
    isRemoveUserModalOpen.value = false;
    selectedUserEmailToRemove.value = null;
  };

  const openPromoteUserModal = (email: string, name: string) => {
    selectedUserEmailToPromote.value = email;
    selectedUserNameToPromote.value = name;
    isPromoteUserModalOpen.value = true;
  };

  const closePromoteUserModal = () => {
    isPromoteUserModalOpen.value = false;
    selectedUserEmailToPromote.value = null;
    selectedUserNameToPromote.value = null;
  };

  const openDemoteUserModal = (email: string, name: string) => {
    selectedUserEmailToDemote.value = email;
    selectedUserNameToDemote.value = name;
    isDemoteUserModalOpen.value = true;
  };

  const closeDemoteUserModal = () => {
    isDemoteUserModalOpen.value = false;
    selectedUserEmailToDemote.value = null;
    selectedUserNameToDemote.value = null;
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
    isDeclineModalOpen,
    isLeaveModalOpen,
    isUpdateModalOpen,
    isInviteModalOpen,
    isRemoveUserModalOpen,
    isPromoteUserModalOpen,
    isDemoteUserModalOpen,
    isUserProfileModalOpen,
    groupNameToUpdate,

    selectedGroupToLeave,
    selectedGroupToJoin,
    selectedGroupToDecline,
    selectedGroupToDelete,
    selectedUserEmailToRemove,
    selectedUserEmailToPromote,
    selectedUserNameToPromote,
    selectedUserEmailToDemote,
    selectedUserNameToDemote,
    selectedUserProfile,

    openCreateModal,
    closeCreateModal,
    openDeleteModal,
    closeDeleteModal,
    openLeaveModal,
    closeLeaveModal,
    openJoinModal,
    closeJoinModal,
    openDeclineModal,
    closeDeclineModal,
    openUpdateModal,
    closeUpdateModal,
    openInviteModal,
    closeInviteModal,
    openRemoveUserModal,
    closeRemoveUserModal,
    openPromoteUserModal,
    closePromoteUserModal,
    openUserProfileModal,
    closeUserProfileModal,
    openDemoteUserModal,
    closeDemoteUserModal,
  };
});
