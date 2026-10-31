<!-- frontend/app/components/files/FilesListView.vue -->
<template>
  <div :class="['flex flex-col w-full', SPACING_TOKENS.gap.sm]">
    <FilesListHeader :sort-key="sortKey" :sort-order="sortOrder" @sort="toggleSort" />

    <FilesListRow
      v-for="file in sortedFiles"
      :key="file.file_id"
      :file="file"
      :is-current-user-leader="isCurrentUserLeader"
      @delete="emit('delete', $event)"
      @download="(url: string | undefined, filename: string) => emit('download', url, filename)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { GroupFile, PrivateDocumentMetadata } from '~/types/files.type';
import type { SortKey, SortOrder } from '~/components/files/FilesListHeader.vue';
import FilesListHeader from '~/components/files/FilesListHeader.vue';
import FilesListRow from '~/components/files/FilesListRow.vue';

const props = defineProps<{
  files: (GroupFile | PrivateDocumentMetadata)[];
  isCurrentUserLeader: boolean;
}>();

const emit = defineEmits<{
  delete: [file: GroupFile | PrivateDocumentMetadata];
  download: [url: string | undefined, filename: string];
}>();

const sortKey = ref<SortKey>('created_at');
const sortOrder = ref<SortOrder>('desc');

const toggleSort = (key: SortKey) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
};

const sortedFiles = computed(() => {
  return [...props.files].sort((a, b) => {
    let aVal: string | number = '';
    let bVal: string | number = '';

    if (sortKey.value === 'file_name') {
      aVal = a.file_name.toLowerCase();
      bVal = b.file_name.toLowerCase();
    } else if (sortKey.value === 'type') {
      aVal = a.documents?.document_type || a.mime_type || '';
      bVal = b.documents?.document_type || b.mime_type || '';
    } else if (sortKey.value === 'file_size') {
      aVal = a.file_size || 0;
      bVal = b.file_size || 0;
    } else if (sortKey.value === 'created_at') {
      aVal = new Date(a.created_at).getTime();
      bVal = new Date(b.created_at).getTime();
    }

    if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1;
    return 0;
  });
});
</script>
