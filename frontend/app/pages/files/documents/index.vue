<!-- frontend/app/pages/files/documents/index.vue -->
<template>
  <div>
    <ClientOnly>
      <template #fallback>
        <div class="min-h-screen flex items-center justify-center">
          <span class="opacity-50 font-medium">{{ UI_TEXT.common.loading }}</span>
        </div>
      </template>

      <DocumentsDesktop
        v-if="!isMobile"
        v-model:selected-group="selectedGroupUuid"
        v-model:search-query="searchQuery"
        v-model:selected-tags="selectedTags"
        v-model:member-search-query="memberSearchQuery"
        v-model:member-filter-type="memberFilterType"
        :documents="filteredDocuments"
        :available-tags="availableTags"
        :member-documents="memberDocuments"
        :is-loading-member-documents="isLoadingMemberDocuments"
        :private-document-types="privateDocumentTypes"
        :groups="groupsList"
        :is-loading="isLoadingFiles"
        :can-upload="canUploadDocument"
        :can-manage-file="canManageFile"
        :can-read-member-documents="canReadMemberDocuments"
        :can-delete-group="canDeleteGroup"
        :can-leave-group="canLeaveCurrentGroup"
        @edit="handleEdit"
        @delete="handleDelete"
        @upload="openUploadModal"
        @delete-group="handleDeleteGroup"
        @leave-group="handleLeaveGroup"
        @download="handleDownload"
      />
      <DocumentsMobile
        v-else
        v-model:selected-group="selectedGroupUuid"
        v-model:search-query="searchQuery"
        v-model:selected-tags="selectedTags"
        v-model:member-search-query="memberSearchQuery"
        v-model:member-filter-type="memberFilterType"
        :documents="filteredDocuments"
        :available-tags="availableTags"
        :member-documents="memberDocuments"
        :is-loading-member-documents="isLoadingMemberDocuments"
        :private-document-types="privateDocumentTypes"
        :groups="groupsList"
        :is-loading="isLoadingFiles"
        :can-upload="canUploadDocument"
        :can-manage-file="canManageFile"
        :can-read-member-documents="canReadMemberDocuments"
        @edit="handleEdit"
        @delete="handleDelete"
        @upload="openUploadModal"
        @delete-group="handleDeleteGroup"
        @leave-group="handleLeaveGroup"
        @download="handleDownload"
      />
    </ClientOnly>

    <!-- Group document modals (custom tags) -->
    <GroupDocumentsModals
      :available-tags="availableTags"
      :group-uuid="selectedGroupUuid"
      :can-upload="canUploadDocument"
      :can-manage-document="canManageDocument"
    />

    <!-- Private document modals (fixed document types for member documents section) -->
    <PrivateDocumentsModals :private-document-types="privateDocumentTypes" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useMediaQuery } from '@vueuse/core';
import { useToast } from '#imports';
import { useGroupPermission } from '~/composables/useGroupPermission';
import { useGroupFilesQuery, useGroupMemberDocumentsQuery } from '~/queries/files.query';
import { useGroupsQuery } from '~/queries/groups.query';
import { useDocumentsStore } from '~/stores/documents.modals.store';
import { useGroupsStore } from '~/stores/groups.modals.store';
import { PERMISSIONS, SYSTEM_ROLES } from '~/utils/constants/permissions.constants';
import { filterGroupDocuments } from '~/utils/filter.utils';
import { canLeaveGroup } from '~/utils/groups.utils';
import type { GroupFile, PrivateDocumentMetadata } from '~/types/files.type';
import type { GroupOutDto } from '~/types/groups.type';

definePageMeta({ layout: 'general', middleware: ['auth'] });

const isMobile = useMediaQuery('(max-width: 768px)');
const documentsStore = useDocumentsStore();
const groupsStore = useGroupsStore();
const toast = useToast();
const route = useRoute();

const searchQuery = ref('');
const selectedTags = ref<string[]>([]);

const memberSearchQuery = ref('');
const memberFilterType = ref('ALL');

const privateDocumentTypes = [
  { label: UI_TEXT.common.allTypes, value: 'ALL' },
  { label: UI_TEXT.documentTypes.personalId, value: 'ID' },
  { label: UI_TEXT.documentTypes.passport, value: 'PASSPORT' },
  { label: UI_TEXT.documentTypes.drivingLicense, value: 'DRIVING_LICENSE' },
  { label: UI_TEXT.documentTypes.other, value: 'OTHER' },
];

const { data: groupsData } = useGroupsQuery();
const groupsList = computed<GroupOutDto[]>(() => groupsData.value?.items || []);
const selectedGroupUuid = ref<string | undefined>((route.query.groupId as string) || undefined);

watch(
  groupsList,
  (newGroups) => {
    if (newGroups.length > 0 && !selectedGroupUuid.value) {
      selectedGroupUuid.value = newGroups[0]?.uuid;
    }
  },
  { immediate: true },
);

// Reset selected tag filters when switching groups
watch(selectedGroupUuid, () => {
  selectedTags.value = [];
});

const currentGroup = computed(() =>
  groupsList.value.find((g) => g.uuid === selectedGroupUuid.value),
);

const { currentUserUuid, systemRole, hasPermission } = useGroupPermission(selectedGroupUuid);

const canReadDocuments = computed(() => hasPermission(PERMISSIONS.DOCUMENTS_READ));
const canUploadDocument = computed(() => hasPermission(PERMISSIONS.DOCUMENTS_CONTRIBUTE));
const canReadMemberDocuments = computed(
  () => canReadDocuments.value || hasPermission(PERMISSIONS.PERSONAL_DOCUMENTS_READ_RESTRICTED),
);
const canDeleteGroup = computed(() => systemRole.value === SYSTEM_ROLES.OWNER);
const canLeaveCurrentGroup = computed(() =>
  canLeaveGroup(systemRole.value, currentGroup.value?.current_size),
);

const canManageDocument = (uploaderUuid?: string | null) => {
  const isUploader = !!uploaderUuid && uploaderUuid === currentUserUuid.value;
  return hasPermission(
    isUploader ? PERMISSIONS.DOCUMENTS_CONTRIBUTE : PERMISSIONS.DOCUMENTS_MANAGE,
  );
};

const canManageFile = (file: GroupFile | PrivateDocumentMetadata) =>
  file.ownership_type === 'GROUP' && canManageDocument(file.creator?.uuid);

// Group documents
const { data: filesData, isLoading: isLoadingFiles } = useGroupFilesQuery(
  () => (canReadDocuments.value ? (selectedGroupUuid.value ?? '') : ''),
  () => 15,
  () => undefined,
  () => 'document',
);

const allGroupDocuments = computed<GroupFile[]>(() => filesData.value?.items || []);

// Unique sorted tags across all documents in the active group
const availableTags = computed<string[]>(() => {
  const tagMap = new Map<string, string>();
  for (const doc of allGroupDocuments.value) {
    for (const tag of doc.tags || []) {
      const lower = tag.toLowerCase();
      if (!tagMap.has(lower)) {
        tagMap.set(lower, tag);
      }
    }
  }
  return Array.from(tagMap.values()).sort((a, b) => a.localeCompare(b));
});

const filteredDocuments = computed<GroupFile[]>(() => {
  return filterGroupDocuments(allGroupDocuments.value, searchQuery.value, selectedTags.value);
});

// Member private documents
const { data: memberDocumentsData, isLoading: isLoadingMemberDocuments } =
  useGroupMemberDocumentsQuery(
    () => selectedGroupUuid.value || '',
    () => canReadMemberDocuments.value,
  );

const memberDocuments = computed<PrivateDocumentMetadata[]>(() =>
  canReadMemberDocuments.value ? (memberDocumentsData.value ?? []) : [],
);

// Handlers
const handleEdit = (file: GroupFile) => {
  if (!selectedGroupUuid.value || !canManageFile(file)) return;
  documentsStore.openGroupUpdateModal({
    fileId: file.file_id,
    groupUuid: selectedGroupUuid.value,
    fileName: file.file_name,
    creatorUuid: file.creator?.uuid ?? null,
    tags: file.tags || [],
    issueDate: file.documents?.issue_date ? file.documents.issue_date.slice(0, 10) : '',
    expiryDate: file.documents?.expiry_date ? file.documents.expiry_date.slice(0, 10) : '',
  });
};

const handleDelete = (file: GroupFile) => {
  if (!selectedGroupUuid.value || !canManageFile(file)) return;
  documentsStore.openDeleteModal({
    fileId: file.file_id,
    groupUuid: selectedGroupUuid.value,
    fileName: file.file_name,
    creatorUuid: file.creator?.uuid ?? null,
  });
};

const openUploadModal = () => {
  if (!canUploadDocument.value) return;

  if (selectedGroupUuid.value) {
    documentsStore.openUploadModal(selectedGroupUuid.value);
  } else {
    toast.add({
      title: UI_TEXT.common.warning,
      description: UI_TEXT.errors.selectGroupFirst,
      class: 'toast-error',
    });
  }
};

const handleDeleteGroup = () => {
  if (currentGroup.value && canDeleteGroup.value) {
    groupsStore.openDeleteModal(currentGroup.value);
  }
};

const handleLeaveGroup = () => {
  if (currentGroup.value && canLeaveCurrentGroup.value) {
    groupsStore.openLeaveModal(currentGroup.value);
  }
};

const handleDownload = async (url: string | undefined, filename: string) => {
  if (!url) return;
  try {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Download trigger failed:', error);
  }
};
</script>
