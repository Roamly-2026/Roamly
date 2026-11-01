// frontend/app/stores/media.modals.store.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { GroupFile } from '~/types/files.type';

export const useMediaModalsStore = defineStore('mediaModals', () => {
  // ==========================================
  // MODAL VISIBILITY STATES
  // ==========================================
  const isUploadModalOpen = ref(false);
  const isUpdateModalOpen = ref(false);
  const isDeleteModalOpen = ref(false);
  const isLightboxOpen = ref(false);

  // ==========================================
  // SELECTED ELEMENTS (TARGETS)
  // ==========================================
  const uploadGroupUuid = ref<string | null>(null);
  const mediaToDelete = ref<GroupFile | null>(null);
  const mediaToUpdate = ref<GroupFile | null>(null);

  // Lightbox state (list of gallery and the index of currently viewed image)
  const lightboxMediaList = ref<GroupFile[]>([]);
  const activeMediaIndex = ref<number>(0);

  // Computed property for active image
  const activeMedia = computed(() => {
    if (lightboxMediaList.value.length === 0) return null;
    return lightboxMediaList.value[activeMediaIndex.value] || null;
  });

  // ==========================================
  // ACTIONS: UPLOAD & UPDATE & DELETE
  // ==========================================
  const openUploadModal = (groupUuid: string) => {
    uploadGroupUuid.value = groupUuid;
    isUploadModalOpen.value = true;
  };
  const closeUploadModal = () => {
    isUploadModalOpen.value = false;
    uploadGroupUuid.value = null;
  };

  const openUpdateModal = (media: GroupFile) => {
    mediaToUpdate.value = media;
    isUpdateModalOpen.value = true;
  };
  const closeUpdateModal = () => {
    isUpdateModalOpen.value = false;
    mediaToUpdate.value = null;
  };

  const openDeleteModal = (media: GroupFile) => {
    mediaToDelete.value = media;
    isDeleteModalOpen.value = true;
  };
  const closeDeleteModal = () => {
    isDeleteModalOpen.value = false;
    mediaToDelete.value = null;
  };

  // ==========================================
  // ACTIONS: LIGHTBOX (IMAGE-VIEWER WITH FLIPPING THROUGH)
  // ==========================================
  const openLightbox = (mediaList: GroupFile[], initialIndex: number = 0) => {
    lightboxMediaList.value = mediaList;
    activeMediaIndex.value = initialIndex;
    isLightboxOpen.value = true;
  };
  const closeLightbox = () => {
    isLightboxOpen.value = false;
    setTimeout(() => {
      if (!isLightboxOpen.value) {
        lightboxMediaList.value = [];
        activeMediaIndex.value = 0;
      }
    }, 200);
  };

  const nextMedia = () => {
    if (lightboxMediaList.value.length === 0) return;
    activeMediaIndex.value = (activeMediaIndex.value + 1) % lightboxMediaList.value.length;
  };

  const prevMedia = () => {
    if (lightboxMediaList.value.length === 0) return;
    activeMediaIndex.value =
      (activeMediaIndex.value - 1 + lightboxMediaList.value.length) % lightboxMediaList.value.length;
  };

  return {
    isUploadModalOpen,
    isUpdateModalOpen,
    isDeleteModalOpen,
    isLightboxOpen,
    uploadGroupUuid,
    mediaToDelete,
    mediaToUpdate,
    lightboxMediaList,
    activeMediaIndex,
    activeMedia,
    openUploadModal,
    closeUploadModal,
    openUpdateModal,
    closeUpdateModal,
    openDeleteModal,
    closeDeleteModal,
    openLightbox,
    closeLightbox,
    nextMedia,
    prevMedia,
  };
});