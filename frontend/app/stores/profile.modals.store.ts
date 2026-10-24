// frontend/app/stores/profile.modals.store.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { UserOutDto } from '~/types/user.type';

// a pinia store for managing profile-related modals and the data of the selected user
export const useProfileStore = defineStore('profile', () => {
  // visibility state of the edit username modal
  // [return value]: boolean
  const isEditUsernameModalOpen = ref(false);
  // visibility state of the edit email modal
  // [return value]: boolean
  const isEditEmailModalOpen = ref(false);
  // visibility state of the change password modal
  // [return value]: boolean
  const isChangePasswordModalOpen = ref(false);
  // visibility state of the delete user profile modal
  // [return value]: boolean
  const isDeleteModalOpen = ref(false);
  // visibility state of the upload profile picture modal
  // [return value]: boolean
  const isUploadPictureModalOpen = ref(false);
  // visibility state of the view profile picture modal
  // [return value]: boolean
  const isViewPictureModalOpen = ref(false);
  // visibility state of the upload personal document modal
  // [return value]: boolean
  const isUploadDocumentModalOpen = ref(false);

  // data of the currently selected user profile
  // [return value]: UserOutDto | null
  const selectedUser = ref<UserOutDto | null>(null);

  // Edit Username Modal
  // opens the edit username modal and sets the selected user
  // [input value]: user: UserOutDto
  const openEditUsernameModal = (user: UserOutDto) => {
    selectedUser.value = user;
    isEditUsernameModalOpen.value = true;
  };

  // closes the edit username modal and clears the selected user data
  const closeEditUsernameModal = () => {
    isEditUsernameModalOpen.value = false;
    selectedUser.value = null;
  };

  // Edit Email Modal
  // opens the edit email modal and sets the selected user
  // [input value]: user: UserOutDto
  const openEditEmailModal = (user: UserOutDto) => {
    selectedUser.value = user;
    isEditEmailModalOpen.value = true;
  };

  // closes the edit email modal and clears the selected user data
  const closeEditEmailModal = () => {
    isEditEmailModalOpen.value = false;
    selectedUser.value = null;
  };

  // Change Password Modal
  // opens the change password modal
  const openChangePasswordModal = () => {
    isChangePasswordModalOpen.value = true;
  };

  // closes the change password modal
  const closeChangePasswordModal = () => {
    isChangePasswordModalOpen.value = false;
  };

  // Delete User Modal
  // opens the delete user profile confirmation modal
  // [input value]: user: UserOutDto
  const openDeleteModal = (user: UserOutDto) => {
    selectedUser.value = user;
    isDeleteModalOpen.value = true;
  };

  // closes the delete user profile modal and clears the selected user data
  const closeDeleteModal = () => {
    isDeleteModalOpen.value = false;
    selectedUser.value = null;
  };

  // Open Upload Picture Modal
  // opens the upload profile picture modal
  const openUploadPictureModal = () => {
    isUploadPictureModalOpen.value = true;
  };

  // closes the upload profile picture modal
  const closeUploadPictureModal = () => {
    isUploadPictureModalOpen.value = false;
  };

  // Open View Picture Modal
  // opens the view profile picture modal and sets the selected user
  // [input value]: user: UserOutDto
  const openViewPictureModal = (user: UserOutDto) => {
    selectedUser.value = user;
    isViewPictureModalOpen.value = true;
  };

  // closes the view profile picture modal and clears the selected user data
  const closeViewPictureModal = () => {
    isViewPictureModalOpen.value = false;
    selectedUser.value = null;
  };

  // Open Upload Document Modal
  // opens the upload personal document modal
  const openUploadDocumentModal = () => {
    isUploadDocumentModalOpen.value = true;
  };

  // closes the upload personal document modal
  const closeUploadDocumentModal = () => {
    isUploadDocumentModalOpen.value = false;
  };

  return {
    isEditUsernameModalOpen,
    isEditEmailModalOpen,
    isChangePasswordModalOpen,
    isDeleteModalOpen,
    isUploadPictureModalOpen,
    isViewPictureModalOpen,
    isUploadDocumentModalOpen,

    selectedUser,

    openEditUsernameModal,
    closeEditUsernameModal,
    openEditEmailModal,
    closeEditEmailModal,
    openChangePasswordModal,
    closeChangePasswordModal,
    openDeleteModal,
    closeDeleteModal,
    openUploadPictureModal,
    closeUploadPictureModal,
    openViewPictureModal,
    closeViewPictureModal,
    openUploadDocumentModal,
    closeUploadDocumentModal,
  };
});
