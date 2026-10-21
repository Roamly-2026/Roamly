<!-- frontend/app/pages/files/media/index.vue -->
<template>
  <div>
    <ClientOnly>
      <template #fallback>
        <div class="min-h-screen flex items-center justify-center">
          <span class="opacity-50 font-medium">{{ UI_TEXT.common.loading }}</span>
        </div>
      </template>

      <MediaDesktop
        v-if="!isMobile"
        v-model:selected-group="selectedGroupUuid"
        v-model:search-query="searchQuery"
        :media="mediaFiles"
        :groups="groupsList"
        :is-loading="isLoadingMedia"
        :is-current-user-leader="isCurrentUserLeader"
        @delete="handleDelete"
        @upload="isUploadModalOpen = true"
        @delete-group="handleDeleteGroup"
        @leave-group="handleLeaveGroup"
        @download="handleDownload"
      />
      <MediaMobile
        v-else
        v-model:selected-group="selectedGroupUuid"
        v-model:search-query="searchQuery"
        :media="mediaFiles"
        :groups="groupsList"
        :is-loading="isLoadingMedia"
        :is-current-user-leader="isCurrentUserLeader"
        @delete="handleDelete"
        @upload="isUploadModalOpen = true"
        @delete-group="handleDeleteGroup"
        @leave-group="handleLeaveGroup"
        @download="handleDownload"
      />
    </ClientOnly>

    <!-- ==================== -->
    <!-- UPLOAD MEDIA MODAL   -->
    <!-- ==================== -->
    <UModal
      v-model:open="isUploadModalOpen"
      :dismissible="false"
      :close="false"
      :ui="{ content: 'sm:max-w-md w-full' }"
    >
      <template #default><div class="hidden"></div></template>
      <template #close><div class="hidden"></div></template>
      <template #header>
        <h3 class="text-xl font-bold text-dark-text">{{ UI_TEXT.media.uploadHeading }}</h3>
      </template>
      <template #body>
        <div class="flex flex-col gap-4">
          <!-- File input -->
          <UFormField :label="UI_TEXT.documents.selectFile">
            <UInput
              type="file"
              accept="image/*,video/*"
              variant="glass"
              icon="i-heroicons-photo"
              @change="onFileChange"
            />
          </UFormField>

          <!-- Description -->
          <UFormField :label="UI_TEXT.media.optionalDescription">
            <UInput
              v-model="uploadDescription"
              variant="glass"
              :placeholder="UI_TEXT.media.captionPlaceholder"
            />
          </UFormField>

          <!-- Error -->
          <div v-if="uploadError" class="text-sm text-error-500 font-medium">
            {{ uploadError }}
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex items-center justify-between w-full">
          <UButton
            :label="UI_TEXT.common.cancel"
            variant="actionCancelButton"
            @click="closeUploadModal"
          />
          <UButton
            :label="UI_TEXT.common.upload"
            variant="actionOkButton"
            :loading="isUploading"
            :disabled="!uploadFile"
            @click="handleUpload"
          />
        </div>
      </template>
    </UModal>

    <!-- ==================== -->
    <!-- DELETE MEDIA MODAL   -->
    <!-- ==================== -->
    <UModal
      v-model:open="isDeleteModalOpen"
      :dismissible="false"
      :close="false"
      :ui="{ content: 'sm:max-w-md w-full' }"
    >
      <template #default><div class="hidden"></div></template>
      <template #close><div class="hidden"></div></template>
      <template #header>
        <h3 class="text-xl font-bold text-dark-text">{{ UI_TEXT.media.deletePhoto }}</h3>
      </template>
      <template #body>
        <p class="text-dark-text/80">
          {{ ' ' + UI_TEXT.documents.deleteBeforeName + ' '
          }}<span class="font-bold text-dark-text">{{ fileToDelete?.file_name }}</span
          >{{ UI_TEXT.documents.deleteAfterName + ' ' }}
        </p>
        <div v-if="deleteError" class="text-sm text-error-500 font-medium mt-2">
          {{ deleteError }}
        </div>
      </template>
      <template #footer>
        <div class="flex items-center justify-between w-full">
          <UButton
            :label="UI_TEXT.common.cancel"
            variant="actionCancelButton"
            @click="
              isDeleteModalOpen = false;
              fileToDelete = null;
            "
          />
          <UButton
            :label="UI_TEXT.common.delete"
            variant="actionOkButton"
            class="bg-error-500 hover:bg-error-600 text-white"
            :loading="isDeleting"
            @click="confirmDelete"
          />
        </div>
      </template>
    </UModal>

    <!-- Group modals (leave / delete group) -->
    <GroupModals />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useMediaQuery } from '@vueuse/core';
import { useToast } from '#imports';
import { useGroupFilesQuery } from '~/queries/files.query';
import { useGroupsQuery } from '~/queries/groups.query';
import { useGroupsStore } from '~/stores/groups.modals.store';
import { useQueryCache } from '@pinia/colada';
import { filesService } from '~/services/files.service';
import type { GroupFile } from '~/types/files.type';
import type { GroupOutDto } from '~/types/groups.type';

definePageMeta({ layout: 'general', middleware: ['auth'] });

const isMobile = useMediaQuery('(max-width: 768px)');
const groupsStore = useGroupsStore();
const queryCache = useQueryCache();
const toast = useToast();
const route = useRoute();

const searchQuery = ref('');
const selectedGroupUuid = ref<string | undefined>((route.query.groupId as string) || undefined);

// ---- GROUP LIST ----
const { data: groupsData } = useGroupsQuery();
const groupsList = computed<GroupOutDto[]>(() => groupsData.value?.items || []);

watch(
  groupsList,
  (newGroups) => {
    if (newGroups.length > 0 && !selectedGroupUuid.value) {
      selectedGroupUuid.value = newGroups[0]?.uuid;
    }
  },
  { immediate: true },
);

const currentGroup = computed(() =>
  groupsList.value.find((g) => g.uuid === selectedGroupUuid.value),
);

const isCurrentUserLeader = computed(() => {
  const role = currentGroup.value?.role ?? '';
  console.log(role);
  return role.toLowerCase() === 'leader';
});

// ---- MEDIA QUERY ----
const { data: mediaData, isLoading: isLoadingMedia } = useGroupFilesQuery(
  () => selectedGroupUuid.value || '',
  () => 50,
  () => undefined,
  () => 'media',
);

const mediaFiles = computed<GroupFile[]>(() => mediaData.value?.items || []);

// ---- UPLOAD ----
const isUploadModalOpen = ref(false);
const uploadFile = ref<File | null>(null);
const uploadDescription = ref('');
const uploadError = ref('');
const isUploading = ref(false);

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  uploadFile.value = target.files?.[0] ?? null;
};

const closeUploadModal = () => {
  isUploadModalOpen.value = false;
  uploadFile.value = null;
  uploadDescription.value = '';
  uploadError.value = '';
};

const handleUpload = async () => {
  if (!uploadFile.value || !selectedGroupUuid.value) return;
  isUploading.value = true;
  uploadError.value = '';

  try {
    const formData = new FormData();
    formData.append('file', uploadFile.value);
    if (uploadDescription.value) {
      formData.append('description', uploadDescription.value);
    }

    await filesService.uploadGroupMediaFile(selectedGroupUuid.value, formData);
    queryCache.invalidateQueries({ key: ['group-files', selectedGroupUuid.value] });
    toast.add({ title: UI_TEXT.common.success, description: UI_TEXT.media.uploaded });
    closeUploadModal();
  } catch {
    uploadError.value = UI_TEXT.media.uploadFailed;
  } finally {
    isUploading.value = false;
  }
};

// ---- DELETE ----
const isDeleteModalOpen = ref(false);
const fileToDelete = ref<GroupFile | null>(null);
const deleteError = ref('');
const isDeleting = ref(false);

const handleDelete = (file: GroupFile) => {
  fileToDelete.value = file;
  isDeleteModalOpen.value = true;
};

const confirmDelete = async () => {
  if (!fileToDelete.value || !selectedGroupUuid.value) return;
  isDeleting.value = true;
  deleteError.value = '';

  try {
    await filesService.deleteGroupFile(selectedGroupUuid.value, fileToDelete.value.file_id);
    queryCache.invalidateQueries({ key: ['group-files', selectedGroupUuid.value] });
    toast.add({ title: UI_TEXT.common.success, description: UI_TEXT.media.deleted });
    isDeleteModalOpen.value = false;
    fileToDelete.value = null;
  } catch {
    deleteError.value = UI_TEXT.media.deleteFailed;
  } finally {
    isDeleting.value = false;
  }
};

// ---- GROUP ACTIONS ----
const handleDeleteGroup = () => {
  if (currentGroup.value) groupsStore.openDeleteModal(currentGroup.value);
};

const handleLeaveGroup = () => {
  if (currentGroup.value) groupsStore.openLeaveModal(currentGroup.value);
};

const handleDownload = async (url: string | undefined, filename: string) => {
  if (!url) return;
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch {
    console.error('Download failed');
  }
};
</script>
