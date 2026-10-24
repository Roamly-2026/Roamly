// frontend/app/stores/documents.modals.store.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

// a pinia store for managing the document related modals and the data of selected files
export const useDocumentsStore = defineStore('documentsModals', () => {
  // ==========================================
  // GROUP DOCUMENT MODALS
  // ==========================================

  // visibility state of the group document delete modal
  // [return value]: boolean
  const isDeleteModalOpen = ref(false);
  // visibility state of the group document upload modal
  // [return value]: boolean
  const isUploadModalOpen = ref(false);
  // visibility state of the group document update modal
  // [return value]: boolean
  const isGroupUpdateModalOpen = ref(false);

  // data of the group document selected for deletion
  // [return value]: { fileId: number; groupUuid: string; fileName: string } | null
  const fileToDelete = ref<{ fileId: number; groupUuid: string; fileName: string } | null>(null);
  // the uuid of the group where the upload is taking place
  // [return value]: string | null
  const uploadGroupUuid = ref<string | null>(null);
  // data of the group document selected for update
  // [return value]: {fileId: number, groupUuid: string, fileName: string, documentType?: string,
  // issueDate?: string, expiryDate?: string} | null
  const groupFileToUpdate = ref<{
    fileId: number;
    groupUuid: string;
    fileName: string;
    documentType?: string;
    issueDate?: string;
    expiryDate?: string;
  } | null>(null);

  // Group — Delete modal
  // opens the group document delete confirmation modal
  // [input value]: file: { fileId: number; groupUuid: string; fileName: string }
  const openDeleteModal = (file: { fileId: number; groupUuid: string; fileName: string }) => {
    fileToDelete.value = file;
    isDeleteModalOpen.value = true;
  };

  // closes the group document delete modal and clears the selected file data
  const closeDeleteModal = () => {
    isDeleteModalOpen.value = false;
    fileToDelete.value = null;
  };

  // Group — Upload modal
  // opens the group document upload modal
  // [input value]: groupUuid: string
  const openUploadModal = (groupUuid: string) => {
    uploadGroupUuid.value = groupUuid;
    isUploadModalOpen.value = true;
  };

  // closes the group document upload modal
  const closeUploadModal = () => {
    isUploadModalOpen.value = false;
    uploadGroupUuid.value = null;
  };

  // Group — Update modal
  // opens the group document update modal
  // [input value]: file: {fileId: number; groupUuid: string; fileName: string; documentType?: string;
  // issueDate?: string; expiryDate?: string;}
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

  // closes the group document update modal
  const closeGroupUpdateModal = () => {
    isGroupUpdateModalOpen.value = false;
    groupFileToUpdate.value = null;
  };

  // ==========================================
  // PRIVATE DOCUMENT MODALS
  // ==========================================

  // visibility state of the private document upload modal
  // [return value]: boolean
  const isPrivateUploadModalOpen = ref(false);
  // visibility state of the private document update modal
  // [return value]: boolean
  const isPrivateUpdateModalOpen = ref(false);
  // visibility state of the private document delete modal
  // [return value]: boolean
  const isPrivateDeleteModalOpen = ref(false);
  // visibility state of the private document share modal
  // [return value]: boolean
  const isPrivateShareModalOpen = ref(false);
  // visibility state of the private document access management modal
  // [return value]: boolean
  const isPrivateAccessModalOpen = ref(false);

  // data of the private document selected for deletion
  // [return value]: { fileId: number; fileName: string } | null
  const privateFileToDelete = ref<{ fileId: number; fileName: string } | null>(null);
  // data of the private document selected for update
  // [return value]: { fileId: number; fileName: string; documentType?: string; issueDate?: string;
  // expiryDate?: string; } | null
  const privateFileToUpdate = ref<{
    fileId: number;
    fileName: string;
    documentType?: string;
    issueDate?: string;
    expiryDate?: string;
  } | null>(null);
  // data of the private document selected for sharing
  // [return value]: { fileId: number; fileName: string } | null
  const privateFileToShare = ref<{ fileId: number; fileName: string } | null>(null);
  // data of the private document selected for access management
  // [return value]: { fileId: number; fileName: string } | null
  const privateFileToViewAccess = ref<{ fileId: number; fileName: string } | null>(null);

  // closes all open private document modals to prevent multiple modals from being active simultaneously
  const closeAllPrivateModals = () => {
    isPrivateUploadModalOpen.value = false;
    isPrivateUpdateModalOpen.value = false;
    isPrivateDeleteModalOpen.value = false;
    isPrivateShareModalOpen.value = false;
    isPrivateAccessModalOpen.value = false;
  };

  // Private — Upload modal
  // opens the private document upload modal
  const openPrivateUploadModal = () => {
    closeAllPrivateModals();
    isPrivateUploadModalOpen.value = true;
  };
  
  // closes the private document upload modal
  const closePrivateUploadModal = () => {
    isPrivateUploadModalOpen.value = false;
  };

  // Private — Update modal
  // opens the private document update modal
  // [input value]: file: { fileId: number; fileName: string; documentType?: string; issueDate?: string;
  // expiryDate?: string; }
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

  // closes the private document update modal
  const closePrivateUpdateModal = () => {
    isPrivateUpdateModalOpen.value = false;
    privateFileToUpdate.value = null;
  };

  // Private — Delete modal
  // opens the private document delete confirmation modal
  // [input value]: file: { fileId: number; fileName: string }
  const openPrivateDeleteModal = (file: { fileId: number; fileName: string }) => {
    closeAllPrivateModals();
    privateFileToDelete.value = file;
    isPrivateDeleteModalOpen.value = true;
  };

  // closes the private document delete modal
  const closePrivateDeleteModal = () => {
    isPrivateDeleteModalOpen.value = false;
    privateFileToDelete.value = null;
  };

  // Private — Share modal
  // opens the private document share modal
  // [input value]: file: { fileId: number; fileName: string }
  const openPrivateShareModal = (file: { fileId: number; fileName: string }) => {
    closeAllPrivateModals();
    privateFileToShare.value = file;
    isPrivateShareModalOpen.value = true;
  };

  // closes the private document share modal
  const closePrivateShareModal = () => {
    isPrivateShareModalOpen.value = false;
    privateFileToShare.value = null;
  };

  // Private — Access modal
  // opens the private document access management modal
  // [input value]: file: { fileId: number; fileName: string }
  const openPrivateAccessModal = (file: { fileId: number; fileName: string }) => {
    closeAllPrivateModals();
    privateFileToViewAccess.value = file;
    isPrivateAccessModalOpen.value = true;
  };

  // closes the private document access management modal
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
