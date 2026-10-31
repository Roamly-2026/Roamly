<!-- frontend/app/components/files/FilesListRow.vue -->
<template>
  <div
    :class="[
      'w-full transition-all cursor-pointer',
      appConfig.ui.card.variants.variant.glass.root,
      'hover:bg-surface-500/90 hover:-translate-y-0.5',
      SPACING_TOKENS.px.lg,
      SPACING_TOKENS.py.md,
    ]"
  >
    <!-- Desktop row -->
    <div :class="['hidden md:grid grid-cols-12 items-center', SPACING_TOKENS.gap.md]">
      <!-- Name + Icon -->
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

      <!-- Type tag -->
      <div class="col-span-2 flex items-center">
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

      <!-- Size -->
      <div class="col-span-2 text-sm text-dark-text/80 font-medium">
        {{ formatFileSize(file.file_size) }}
      </div>

      <!-- Creator (Avatar + Name) -->
      <div :class="['col-span-2 flex items-center min-w-0', SPACING_TOKENS.gap.sm]">
        <UAvatar
          :src="file.creator?.profile_image_url || undefined"
          :alt="file.creator?.username"
          size="xs"
          class="shrink-0"
        />
        <span class="text-sm font-medium text-dark-text truncate">
          {{ file.creator?.username || UI_TEXT.common.unknown }}
        </span>
      </div>

      <!-- Date + Actions -->
      <div class="col-span-2 flex items-center justify-between">
        <span class="text-xs text-dark-text/70">
          {{ new Date(file.created_at).toLocaleDateString() }}
        </span>

        <div :class="['flex items-center shrink-0', SPACING_TOKENS.gap.xs]">
          <BaseButton
            icon="i-heroicons-eye"
            variant="ghostBrandIconButton"
            :href="file.download_url || file.file_url"
            target="_blank"
            :tooltip="UI_TEXT.common.view"
          />
          <BaseButton
            icon="i-heroicons-arrow-down-tray"
            variant="ghostBrandIconButton"
            :tooltip="UI_TEXT.common.download"
            @click.prevent="emit('download', file.download_url || file.file_url, file.file_name)"
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
          <span class="font-bold text-sm text-dark-text truncate">{{ file.file_name }}</span>
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
            :src="file.creator?.profile_image_url || undefined"
            :alt="file.creator?.username"
            size="xs"
          />
          <span class="text-dark-text/80 truncate">{{ file.creator?.username }}</span>
        </div>

        <div :class="['flex items-center', SPACING_TOKENS.gap.xs]">
          <BaseButton
            icon="i-heroicons-eye"
            variant="ghostBrandIconButton"
            :href="file.download_url || file.file_url"
            target="_blank"
          />
          <BaseButton
            icon="i-heroicons-arrow-down-tray"
            variant="ghostBrandIconButton"
            @click.prevent="emit('download', file.download_url || file.file_url, file.file_name)"
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
import type { GroupFile } from '~/types/files.type';

const appConfig = useAppConfig();

defineProps<{
  file: GroupFile;
  isCurrentUserLeader: boolean;
}>();

const emit = defineEmits<{
  delete: [file: GroupFile];
  download: [url: string | undefined, filename: string];
}>();
</script>
