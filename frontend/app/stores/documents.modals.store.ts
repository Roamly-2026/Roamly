// frontend/app/stores/documents.modals.store.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * Manages UI state and target file payloads for group and private document modals.
 */
export const useDocumentsStore = defineStore('documentsModals', () => {
  // ==========================================
  // GROUP DOCUMENT MODALS
  // ==========================================

  const isDeleteModalOpen = ref(false);
  const isUploadModalOpen = ref(false);
  const isGroupUpdateModalOpen = ref(false);

  const fileToDelete = ref<{ fileId: number; groupUuid: string; fileName: string } | null>(null);
  const uploadGroupUuid = ref<string | null>(null);
  const groupFileToUpdate = ref<{
    fileId: number;
    groupUuid: string;
    fileName: string;
    documentType?: string;
    issueDate?: string;
    expiryDate?: string;
  } | null>(null);

  const openDeleteModal = (file: { fileId: number; groupUuid: string; fileName: string }) => {
    fileToDelete.value = file;
    isDeleteModalOpen.value = true;
  };

  const closeDeleteModal = () => {
    isDeleteModalOpen.value = false;
    fileToDelete.value = null;
  };

  const openUploadModal = (groupUuid: string) => {
    uploadGroupUuid.value = groupUuid;
    isUploadModalOpen.value = true;
  };

  const closeUploadModal = () => {
    isUploadModalOpen.value = false;
    uploadGroupUuid.value = null;
  };

  const openGroupUpdateModal = (file: {
    fileId: number;
    groupUuid: string;
    fileName: string;
    documentType?: string;
    issueDate?: string;
    expiryDate?: string;
  }) => {
    groupFileToUpdate.value = file;
    isGroupUpdateModalOpen.value = true;
  };

  const closeGroupUpdateModal = () => {
    isGroupUpdateModalOpen.value = false;
    groupFileToUpdate.value = null;
  };

  // ==========================================
  // PRIVATE DOCUMENT MODALS
  // ==========================================

  const isPrivateUploadModalOpen = ref(false);
  const isPrivateUpdateModalOpen = ref(false);
  const isPrivateDeleteModalOpen = ref(false);
  const isPrivateShareModalOpen = ref(false);
  const isPrivateAccessModalOpen = ref(false);

  const privateFileToDelete = ref<{ fileId: number; fileName: string } | null>(null);
  const privateFileToUpdate = ref<{
    fileId: number;
    fileName: string;
    documentType?: string;
    issueDate?: string;
    expiryDate?: string;
  } | null>(null);
  const privateFileToShare = ref<{ fileId: number; fileName: string } | null>(null);
  const privateFileToViewAccess = ref<{ fileId: number; fileName: string } | null>(null);

  // Ensures mutual exclusivity among private document modals to prevent overlapping UI states
  const closeAllPrivateModals = () => {
    isPrivateUploadModalOpen.value = false;
    isPrivateUpdateModalOpen.value = false;
    isPrivateDeleteModalOpen.value = false;
    isPrivateShareModalOpen.value = false;
    isPrivateAccessModalOpen.value = false;
  };

  const openPrivateUploadModal = () => {
    closeAllPrivateModals();
    isPrivateUploadModalOpen.value = true;
  };

  const closePrivateUploadModal = () => {
    isPrivateUploadModalOpen.value = false;
  };

  const openPrivateUpdateModal = (file: {
    fileId: number;
    fileName: string;
    documentType?: string;
    issueDate?: string;
    expiryDate?: string;
  }) => {
    closeAllPrivateModals();
    privateFileToUpdate.value = file;
    isPrivateUpdateModalOpen.value = true;
  };

  const closePrivateUpdateModal = () => {
    isPrivateUpdateModalOpen.value = false;
    privateFileToUpdate.value = null;
  };

  const openPrivateDeleteModal = (file: { fileId: number; fileName: string }) => {
    closeAllPrivateModals();
    privateFileToDelete.value = file;
    isPrivateDeleteModalOpen.value = true;
  };

  const closePrivateDeleteModal = () => {
    isPrivateDeleteModalOpen.value = false;
    privateFileToDelete.value = null;
  };

  const openPrivateShareModal = (file: { fileId: number; fileName: string }) => {
    closeAllPrivateModals();
    privateFileToShare.value = file;
    isPrivateShareModalOpen.value = true;
  };

  const closePrivateShareModal = () => {
    isPrivateShareModalOpen.value = false;
    privateFileToShare.value = null;
  };

  const openPrivateAccessModal = (file: { fileId: number; fileName: string }) => {
    closeAllPrivateModals();
    privateFileToViewAccess.value = file;
    isPrivateAccessModalOpen.value = true;
  };

  const closePrivateAccessModal = () => {
    isPrivateAccessModalOpen.value = false;
    privateFileToViewAccess.value = null;
  };

  return {
    // Group modals
    isDeleteModalOpen,
    isUploadModalOpen,
    isGroupUpdateModalOpen,
    fileToDelete,
    uploadGroupUuid,
    groupFileToUpdate,
    openDeleteModal,
    closeDeleteModal,
    openUploadModal,
    closeUploadModal,
    openGroupUpdateModal,
    closeGroupUpdateModal,

    // Private document modals
    isPrivateUploadModalOpen,
    isPrivateUpdateModalOpen,
    isPrivateDeleteModalOpen,
    isPrivateShareModalOpen,
    isPrivateAccessModalOpen,
    privateFileToDelete,
    privateFileToUpdate,
    privateFileToShare,
    privateFileToViewAccess,
    openPrivateUploadModal,
    closePrivateUploadModal,
    openPrivateUpdateModal,
    closePrivateUpdateModal,
    openPrivateDeleteModal,
    closePrivateDeleteModal,
    openPrivateShareModal,
    closePrivateShareModal,
    openPrivateAccessModal,
    closePrivateAccessModal,
  };
});
