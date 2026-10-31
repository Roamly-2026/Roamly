<!-- frontend/app/components/files/FilesListRow.vue -->
<template>
  <div
    :class="[
      'w-full bg-surface-500/70 backdrop-blur-xl rounded-2xl ring-1 ring-surface-500/50 shadow-sm hover:bg-surface-500/90 transition-all',
      SPACING_TOKENS.px.lg,
      SPACING_TOKENS.py.md,
    ]"
  >
    <!-- Desktop row -->
    <div :class="['hidden md:grid grid-cols-12 items-center w-full', SPACING_TOKENS.gap.md]">
      <!-- Name + Icon (4 cols) -->
      <div
        :class="[
          'col-span-4 flex items-center min-w-0',
          SPACING_TOKENS.gap.sm,
          SPACING_TOKENS.px.xs,
        ]"
      >
        <div class="w-9 h-9 rounded-xl bg-surface-600/30 flex items-center justify-center shrink-0">
          <UIcon
            :name="getFileIcon(file.mime_type, file.file_name)"
            class="w-5 h-5 text-brand-500"
          />
        </div>
        <span class="font-bold text-sm text-dark-text truncate" :title="file.file_name">
          {{ file.file_name }}
        </span>
      </div>

      <!-- Type tag (2 cols) -->
      <div class="col-span-2 flex items-center min-w-0">
        <span
          :class="[
            'text-xs font-semibold rounded-full bg-surface-600/30 text-dark-text/80 truncate max-w-full',
            SPACING_TOKENS.px.sm,
            SPACING_TOKENS.py.xs,
          ]"
        >
          {{
            file.documents?.document_type ||
            getFileExtension(file.file_name) ||
            file.mime_type?.split('/')[1] ||
            '—'
          }}
        </span>
      </div>

      <!-- Size (2 cols) -->
      <div class="col-span-2 text-sm text-dark-text/80 font-medium">
        {{ formatFileSize(file.file_size) }}
      </div>

      <!-- Creator / Owner (2 cols) -->
      <div :class="['col-span-2 flex items-center min-w-0', SPACING_TOKENS.gap.sm]">
        <UAvatar
          :src="fileUser?.profile_image_url || undefined"
          :alt="fileUser?.username"
          class="w-7! h-7! text-xs shrink-0 rounded-full object-cover"
        />
        <span class="text-sm font-medium text-dark-text truncate">
          {{ fileUser?.username || UI_TEXT.common.unknown }}
        </span>
      </div>

      <!-- Date + Actions (2 cols) -->
      <div class="col-span-2 flex items-center justify-between">
        <span class="text-xs text-dark-text/70 shrink-0">
          {{ new Date(file.created_at).toLocaleDateString() }}
        </span>

        <div :class="['flex items-center shrink-0', SPACING_TOKENS.gap.xs]">
          <BaseButton
            icon="i-heroicons-eye"
            variant="ghostBrandIconButton"
            :href="fileUrl"
            target="_blank"
            :tooltip="UI_TEXT.common.view"
          />
          <BaseButton
            icon="i-heroicons-arrow-down-tray"
            variant="ghostBrandIconButton"
            :tooltip="UI_TEXT.common.download"
            @click.prevent="emit('download', fileUrl, file.file_name)"
          />
          <BaseButton
            v-if="isCurrentUserLeader"
            icon="i-heroicons-trash"
            variant="ghostDangerIconButton"
            :tooltip="UI_TEXT.common.delete"
            @click="emit('delete', file)"
          />
        </div>
      </div>
    </div>

    <!-- Mobile row -->
    <div :class="['flex md:hidden flex-col', SPACING_TOKENS.gap.sm]">
      <div class="flex items-center justify-between">
        <div :class="['flex items-center min-w-0 flex-1', SPACING_TOKENS.gap.sm]">
          <UIcon
            :name="getFileIcon(file.mime_type, file.file_name)"
            class="w-5 h-5 text-brand-500 shrink-0"
          />
          <span class="font-bold text-sm text-dark-text truncate">
            {{ file.file_name }}
          </span>
        </div>
        <span class="text-xs text-dark-text/70 shrink-0">
          {{ formatFileSize(file.file_size) }}
        </span>
      </div>

      <div
        :class="[
          'flex items-center justify-between border-t border-dark-text/10 text-xs',
          SPACING_TOKENS.pt.xs,
        ]"
      >
        <div :class="['flex items-center', SPACING_TOKENS.gap.xs]">
          <UAvatar
            :src="fileUser?.profile_image_url || undefined"
            :alt="fileUser?.username"
            class="w-6! h-6! text-[10px] shrink-0 rounded-full object-cover"
          />
          <span class="text-dark-text/80 truncate">
            {{ fileUser?.username || UI_TEXT.common.unknown }}
          </span>
        </div>

        <div :class="['flex items-center', SPACING_TOKENS.gap.xs]">
          <BaseButton
            icon="i-heroicons-eye"
            variant="ghostBrandIconButton"
            :href="fileUrl"
            target="_blank"
          />
          <BaseButton
            icon="i-heroicons-arrow-down-tray"
            variant="ghostBrandIconButton"
            @click.prevent="emit('download', fileUrl, file.file_name)"
          />
          <BaseButton
            v-if="isCurrentUserLeader"
            icon="i-heroicons-trash"
            variant="ghostDangerIconButton"
            @click="emit('delete', file)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { GroupFile, PrivateDocumentMetadata, FileUserDto } from '~/types/files.type';

const props = defineProps<{
  file: GroupFile | PrivateDocumentMetadata;
  isCurrentUserLeader: boolean;
}>();

const emit = defineEmits<{
  delete: [file: GroupFile | PrivateDocumentMetadata];
  download: [url: string | undefined, filename: string];
}>();

const fileUser = computed<FileUserDto | null>(() => {
  if (props.file.creator) {
    return props.file.creator;
  }
  if ('owner' in props.file && props.file.owner) {
    return props.file.owner;
  }
  return null;
});

const fileUrl = computed<string | undefined>(() => {
  if ('download_url' in props.file && props.file.download_url) {
    return props.file.download_url;
  }
  return props.file.file_url;
});
</script>
