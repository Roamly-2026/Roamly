// frontend/app/stores/groups.modals.store.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { GroupOutDto, GroupInvitesOutDto } from '~/types/groups.type';
import type { UserProfileModalDto } from '~/types/user.type';

// a pinia store for managing group-related modals and the data of selected groups or users
export const useGroupsStore = defineStore('groups', () => {
  // visibility state of the create group modal
  // [return value]: boolean
  const isCreateModalOpen = ref(false);
  // visibility state of the delete group modal
  // [return value]: boolean
  const isDeleteModalOpen = ref(false);
  // visibility state of the leave group modal
  // [return value]: boolean
  const isLeaveModalOpen = ref(false);
  // visibility state of the join group modal
  // [return value]: boolean
  const isJoinModalOpen = ref(false);
  // visibility state of the decline group invite modal
  // [return value]: boolean
  const isDeclineModalOpen = ref(false);
  // visibility state of the remove user modal
  // [return value]: boolean
  const isRemoveUserModalOpen = ref(false);
  // visibility state of the update group modal
  // [return value]: boolean
  const isUpdateModalOpen = ref(false);
  // visibility state of the invite user modal
  // [return value]: boolean
  const isInviteModalOpen = ref(false);
  // the current name of the group being updated
  // [return value]: string
  const groupNameToUpdate = ref('');
  // visibility state of the promote user modal
  // [return value]: boolean
  const isPromoteUserModalOpen = ref(false);
  // visibility state of the demote user modal
  // [return value]: boolean
  const isDemoteUserModalOpen = ref(false);
  // visibility state of the user profile modal
  // [return value]: boolean
  const isUserProfileModalOpen = ref(false);

  // email of the user selected for promotion
  // [return value]: string | null
  const selectedUserEmailToPromote = ref<string | null>(null);
  // name of the user selected for promotion
  // [return value]: string | null
  const selectedUserNameToPromote = ref<string | null>(null);
  // email of the user selected for demotion
  // [return value]: string | null
  const selectedUserEmailToDemote = ref<string | null>(null);
  // name of the user selected for demotion
  // [return value]: string | null
  const selectedUserNameToDemote = ref<string | null>(null);
  // data of the group selected for deletion
  // [return value]: GroupOutDto | null
  const selectedGroupToDelete = ref<GroupOutDto | null>(null);
  // data of the group the user wants to leave
  // [return value]: GroupOutDto | null
  const selectedGroupToLeave = ref<GroupOutDto | null>(null);
  // data of the group invite the user wants to join/accept
  // [return value]: GroupInvitesOutDto | null
  const selectedGroupToJoin = ref<GroupInvitesOutDto | null>(null);
  // data of the group invite the user wants to decline
  // [return value]: GroupInvitesOutDto | null
  const selectedGroupToDecline = ref<GroupInvitesOutDto | null>(null);
  // email of the user selected to be removed from the group
  // [return value]: string | null
  const selectedUserEmailToRemove = ref<string | null>(null);
  // data of the user profile selected for viewing
  // [return value]: UserProfileModalDto | null
  const selectedUserProfile = ref<UserProfileModalDto | null>(null);

  // Create modal
  // opens the create group modal
  const openCreateModal = () => {
    isCreateModalOpen.value = true;
  };

  // closes the create group modal
  const closeCreateModal = () => {
    isCreateModalOpen.value = false;
  };

  // Delete modal
  // opens the delete group confirmation modal
  // [input value]: group: GroupOutDto
  const openDeleteModal = (group: GroupOutDto) => {
    selectedGroupToDelete.value = group;
    isDeleteModalOpen.value = true;
  };

  // closes the delete group modal and clears the selected group data
  const closeDeleteModal = () => {
    isDeleteModalOpen.value = false;
    selectedGroupToDelete.value = null;
  };

  // Leave modal
  // opens the leave group confirmation modal
  // [input value]: group: GroupOutDto
  const openLeaveModal = (group: GroupOutDto) => {
    selectedGroupToLeave.value = group;
    isLeaveModalOpen.value = true;
  };

  // closes the leave group modal and clears the selected group data
  const closeLeaveModal = () => {
    isLeaveModalOpen.value = false;
    selectedGroupToLeave.value = null;
  };

  // Join modal
  // opens the join group confirmation modal
  // [input value]: group: GroupInvitesOutDto
  const openJoinModal = (group: GroupInvitesOutDto) => {
    selectedGroupToJoin.value = group;
    isJoinModalOpen.value = true;
  };

  // closes the join group modal and clears the selected invite data
  const closeJoinModal = () => {
    isJoinModalOpen.value = false;
    selectedGroupToJoin.value = null;
  };

  // Decline modal
  // opens the decline group invite modal
  // [input value]: group: GroupInvitesOutDto
  const openDeclineModal = (group: GroupInvitesOutDto) => {
    selectedGroupToDecline.value = group;
    isDeclineModalOpen.value = true;
  };

  // closes the decline group invite modal and clears the selected invite data
  const closeDeclineModal = () => {
    isDeclineModalOpen.value = false;
    selectedGroupToDecline.value = null;
  };

  // Update modal
  // opens the update group modal and sets the current group name
  // [input value]: currentName: string
  const openUpdateModal = (currentName: string) => {
    groupNameToUpdate.value = currentName;
    isUpdateModalOpen.value = true;
  };

  // closes the update group modal
  const closeUpdateModal = () => {
    isUpdateModalOpen.value = false;
  };

  // Invite Modal
  // opens the invite user modal
  const openInviteModal = () => {
    isInviteModalOpen.value = true;
  };

  // closes the invite user modal
  const closeInviteModal = () => {
    isInviteModalOpen.value = false;
  };

  // Remove User Modal
  // opens the remove user confirmation modal
  // [input value]: email: string
  const openRemoveUserModal = (email: string) => {
    selectedUserEmailToRemove.value = email;
    isRemoveUserModalOpen.value = true;
  };

  // closes the remove user modal and clears the selected user email
  const closeRemoveUserModal = () => {
    isRemoveUserModalOpen.value = false;
    selectedUserEmailToRemove.value = null;
  };

  // Promote User Modal
  // opens the promote user confirmation modal
  // [input value]: email: string, name: string
  const openPromoteUserModal = (email: string, name: string) => {
    selectedUserEmailToPromote.value = email;
    selectedUserNameToPromote.value = name;
    isPromoteUserModalOpen.value = true;
  };

  // closes the promote user modal and clears the selected user data
  const closePromoteUserModal = () => {
    isPromoteUserModalOpen.value = false;
    selectedUserEmailToPromote.value = null;
    selectedUserNameToPromote.value = null;
  };

  // Demote User Modal
  // opens the demote user confirmation modal
  // [input value]: email: string, name: string
  const openDemoteUserModal = (email: string, name: string) => {
    selectedUserEmailToDemote.value = email;
    selectedUserNameToDemote.value = name;
    isDemoteUserModalOpen.value = true;
  };

  // closes the demote user modal and clears the selected user data
  const closeDemoteUserModal = () => {
    isDemoteUserModalOpen.value = false;
    selectedUserEmailToDemote.value = null;
    selectedUserNameToDemote.value = null;
  };

  // User Profile Modal
  // opens the user profile detailed view modal
  // [input value]: profile: UserProfileModalDto
  const openUserProfileModal = (profile: UserProfileModalDto) => {
    selectedUserProfile.value = profile;
    isUserProfileModalOpen.value = true;
  };

  // closes the user profile modal and clears the selected profile data
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
