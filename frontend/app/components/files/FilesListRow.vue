<!-- frontend/app/components/files/FilesListRow.vue -->
<template>
  <div
    :class="[
      'w-full cursor-pointer',
      GLASS_TOKENS.default,
      RADIUS_TOKENS.lg,
      BORDER_TOKENS.ringCard,
      SHADOW_TOKENS.sm,
      INTERACTION_TOKENS.base,
      'hover:bg-surface-card/90',
      SPACING_TOKENS.px.lg,
      SPACING_TOKENS.py.md,
    ]"
    @click="emit('open', file)"
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
        <div
          :class="[
            SIZE_TOKENS.avatar.sm,
            RADIUS_TOKENS.md,
            COLOR_TOKENS.surface.subtle,
            'flex items-center justify-center shrink-0',
          ]"
        >
          <UIcon
            :name="getFileIcon(file.mime_type, file.file_name)"
            :class="TYPOGRAPHY_CONFIG.iconBrandSm"
          />
        </div>
        <span :class="[TYPOGRAPHY_CONFIG.cardTitleSm, 'truncate']" :title="file.file_name">
          {{ file.file_name }}
        </span>
      </div>

      <!-- Type / Tags (2 cols) -->
      <div :class="['col-span-2 flex items-center flex-wrap min-w-0', SPACING_TOKENS.gap.xs]">
        <span
          v-if="file.documents?.document_type"
          :class="[TYPOGRAPHY_CONFIG.badgeRole, 'truncate max-w-full']"
        >
          {{ file.documents.document_type }}
        </span>
        <template v-else-if="file.tags && file.tags.length > 0">
          <span
            v-for="tag in file.tags.slice(0, 2)"
            :key="tag"
            :class="[TYPOGRAPHY_CONFIG.badgeRole, 'truncate max-w-full']"
          >
            #{{ tag }}
          </span>
          <span v-if="file.tags.length > 2" :class="TYPOGRAPHY_CONFIG.captionMuted">
            +{{ file.tags.length - 2 }}
          </span>
        </template>
        <span v-else :class="[TYPOGRAPHY_CONFIG.badgeRole, 'truncate max-w-full']">
          {{ getFileExtension(file.file_name) || file.mime_type?.split('/')[1] || '—' }}
        </span>
      </div>

      <!-- Size (2 cols) -->
      <div :class="['col-span-2', TYPOGRAPHY_CONFIG.bodySmSoft]">
        {{ formatFileSize(file.file_size) }}
      </div>

      <!-- Creator / Owner (2 cols) -->
      <div :class="['col-span-2 flex items-center min-w-0', SPACING_TOKENS.gap.sm]">
        <UAvatar
          :src="fileUser?.profile_image_url || undefined"
          :alt="fileUser?.username"
          class="w-7! h-7! text-xs shrink-0 rounded-full object-cover"
        />
        <span :class="[TYPOGRAPHY_CONFIG.bodySmSoft, 'truncate']">
          {{ fileUser?.username || UI_TEXT.common.unknown }}
        </span>
      </div>

      <!-- Date + Actions (2 cols) -->
      <div class="col-span-2 flex items-center justify-between">
        <span :class="[TYPOGRAPHY_CONFIG.captionMuted, 'shrink-0']">
          {{ new Date(file.created_at).toLocaleDateString() }}
        </span>

        <div :class="['flex items-center shrink-0', SPACING_TOKENS.gap.xs]">
          <BaseButton
            icon="i-heroicons-eye"
            variant="ghostBrandIconButton"
            :tooltip="UI_TEXT.common.view"
            @click.stop="emit('open', file)"
          />
          <BaseButton
            icon="i-heroicons-arrow-down-tray"
            variant="ghostBrandIconButton"
            :tooltip="UI_TEXT.common.download"
            @click.stop.prevent="emit('download', fileUrl, file.file_name)"
          />
          <BaseButton
            v-if="canManage && canEdit"
            icon="i-heroicons-pencil-square"
            variant="ghostBrandIconButton"
            :tooltip="UI_TEXT.common.edit"
            @click.stop="emit('edit', file)"
          />
          <BaseButton
            v-if="canManage"
            icon="i-heroicons-trash"
            variant="ghostDangerIconButton"
            :tooltip="UI_TEXT.common.delete"
            @click.stop="emit('delete', file)"
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
            :class="[TYPOGRAPHY_CONFIG.iconBrandSm, 'shrink-0']"
          />
          <span :class="[TYPOGRAPHY_CONFIG.cardTitleSm, 'truncate']">
            {{ file.file_name }}
          </span>
        </div>
        <span :class="[TYPOGRAPHY_CONFIG.captionMuted, 'shrink-0']">
          {{ formatFileSize(file.file_size) }}
        </span>
      </div>

      <div
        :class="[
          'flex items-center justify-between text-xs',
          BORDER_TOKENS.dividerTop,
          SPACING_TOKENS.pt.xs,
        ]"
      >
        <div :class="['flex items-center', SPACING_TOKENS.gap.xs]">
          <UAvatar
            :src="fileUser?.profile_image_url || undefined"
            :alt="fileUser?.username"
            class="w-6! h-6! text-[10px] shrink-0 rounded-full object-cover"
          />
          <span :class="[TYPOGRAPHY_CONFIG.bodySmMutedTruncate]">
            {{ fileUser?.username || UI_TEXT.common.unknown }}
          </span>
        </div>

        <div :class="['flex items-center', SPACING_TOKENS.gap.xs]">
          <BaseButton
            icon="i-heroicons-eye"
            variant="ghostBrandIconButton"
            @click.stop="emit('open', file)"
          />
          <BaseButton
            icon="i-heroicons-arrow-down-tray"
            variant="ghostBrandIconButton"
            @click.stop.prevent="emit('download', fileUrl, file.file_name)"
          />
          <BaseButton
            v-if="canManage && canEdit"
            icon="i-heroicons-pencil-square"
            variant="ghostBrandIconButton"
            @click.stop="emit('edit', file)"
          />
          <BaseButton
            v-if="canManage"
            icon="i-heroicons-trash"
            variant="ghostDangerIconButton"
            @click.stop="emit('delete', file)"
          />
        </div>
      </div>
    </div>
    <!-- Reactions (media only) -->
    <div v-if="showReactions && 'reactions' in file" :class="LAYOUT_CONFIG.mediaListRowReactions">
      <MemoryReactionBar :media="file" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { GroupFile, PrivateDocumentMetadata, FileUserDto } from '~/types/files.type';
import MemoryReactionBar from '~/components/media/MemoryReactionBar.vue';

const props = defineProps<{
  file: GroupFile | PrivateDocumentMetadata;
  canManage: boolean;
  canEdit?: boolean;
  showReactions?: boolean;
}>();

const emit = defineEmits<{
  edit: [file: GroupFile | PrivateDocumentMetadata];
  delete: [file: GroupFile | PrivateDocumentMetadata];
  download: [url: string | undefined, filename: string];
  open: [file: GroupFile | PrivateDocumentMetadata];
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
