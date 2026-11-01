<template>
  <div class="w-full">
    <div v-if="isLoading" :class="appConfig.typography.statusLoading">
      {{ UI_TEXT.media.loading }}
    </div>

    <div v-else-if="mediaList.length > 0" :class="`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${SPACING_TOKENS.responsive.gridGap} w-full`">
      <div
        v-for="(media, index) in mediaList"
        :key="media.file_id"
        class="group relative aspect-square bg-surface-200 rounded-xl overflow-hidden cursor-pointer shadow-sm ring-1 ring-dark-text/5 hover:ring-brand-500 transition-all"
        @click="mediaStore.openLightbox(mediaList, index)"
      >
        <img
          v-if="media.mime_type?.startsWith('image/')"
          :src="media.download_url"
          :alt="media.file_name || 'Image'"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div v-else class="w-full h-full flex items-center justify-center bg-surface-300">
          <UIcon name="i-heroicons-video-camera" class="w-12 h-12 text-surface-500/50" />
        </div>

        <!-- Metadata Overlay -->
        <div :class="`absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/40 to-transparent ${SPACING_TOKENS.p.sm} pt-8 flex flex-col ${SPACING_TOKENS.gap.xs} sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300`">
          <div v-if="media.media_files?.location_name" :class="`flex items-center ${SPACING_TOKENS.gap.xs} text-white`">
            <UIcon name="i-heroicons-map-pin" class="w-3.5 h-3.5 shrink-0" />
            <span class="text-xs font-medium truncate">{{ media.media_files.location_name }}</span>
          </div>

          <div :class="`flex items-end justify-between ${SPACING_TOKENS.mt.xs}`">
            <span class="text-[10px] text-white/80 font-medium">
              {{ media.media_files?.taken_at ? new Date(media.media_files.taken_at).toLocaleDateString() : new Date(media.created_at).toLocaleDateString() }}
            </span>
            
            <div v-if="(media.media_files?.media_tags?.length || 0) > 0" :class="[appConfig.calendar.participantsAvatars, appConfig.calendar.participantsOverlap]">
              <UTooltip
                v-for="tag in media.media_files!.media_tags!.slice(0, 3)"
                :key="tag.users.uuid"
                :text="tag.users.username"
              >
                <UAvatar
                  :src="tag.users.profile_image_url || undefined"
                  :alt="tag.users.username"
                  size="3xs"
                  class="ring-1 ring-white/50"
                />
              </UTooltip>
              <div
                v-if="media.media_files!.media_tags!.length > 3"
                :class="appConfig.calendar.participantMoreBadge"
                class="w-5! h-5! text-[9px]! ring-white/50!"
              >
                +{{ media.media_files!.media_tags!.length - 3 }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else :class="appConfig.typography.statusLoading">
      {{ UI_TEXT.media.noPhotos }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppConfig } from '#imports';
import { useMediaModalsStore } from '~/stores/media.modals.store';
import type { GroupFile } from '~/types/files.type';

defineProps<{
  mediaList: GroupFile[];
  isLoading: boolean;
}>();

const appConfig = useAppConfig();
const mediaStore = useMediaModalsStore();
</script>