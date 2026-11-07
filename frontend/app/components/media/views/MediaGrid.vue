<template>
  <div class="w-full">
    <div v-if="isLoading" :class="appConfig.typography.statusLoading">
      {{ UI_TEXT.media.loading }}
    </div>

    <div
      v-else-if="mediaList.length > 0"
      :class="`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${SPACING_TOKENS.responsive.gridGap} w-full`"
    >
      <div
        v-for="(media, index) in mediaList"
        :key="media.file_id"
        class="group relative aspect-square bg-surface-200 rounded-xl overflow-hidden cursor-pointer shadow-sm ring-1 ring-dark-text/5 hover:ring-brand-500 transition-all"
        @click="mediaStore.openLightbox(mediaList, index)"
      >
        <!-- IMAGE SHOWCASE -->
        <img
          v-if="media.mime_type?.startsWith('image/')"
          :src="media.download_url || media.file_url"
          :alt="media.file_name || 'Image'"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <!-- AUTOMATIC THUMBNAIL FOR VIDEOS -->
        <div v-else class="relative w-full h-full bg-black flex items-center justify-center">
          <video
            :src="`${media.download_url || media.file_url}#t=0.1`"
            preload="metadata"
            muted
            playsinline
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          ></video>

          <!-- PLAY ICON -->
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              class="w-12 h-12 aspect-square flex items-center justify-center rounded-full bg-black/50 text-white group-hover:bg-brand-500/80 transition-all"
            >
              <UIcon name="i-heroicons-play" class="w-6 h-6 translate-x-0.5" />
            </div>
          </div>
        </div>

        <!-- Metadata Overlay -->
        <div
          :class="`absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/40 to-transparent ${SPACING_TOKENS.p.sm} pt-8 flex flex-col ${SPACING_TOKENS.gap.xs} sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300`"
        >
          <div
            v-if="media.media_files?.location_name"
            :class="`flex items-center ${SPACING_TOKENS.gap.xs} text-white`"
          >
            <UIcon name="i-heroicons-map-pin" class="w-3.5 h-3.5 shrink-0" />
            <span class="text-xs font-medium truncate">{{ media.media_files.location_name }}</span>
          </div>

          <div :class="`flex items-end justify-between ${SPACING_TOKENS.mt.xs}`">
            <span class="text-[10px] text-white/80 font-medium">
              {{
                media.media_files?.taken_at
                  ? new Date(media.media_files.taken_at).toLocaleDateString()
                  : new Date(media.created_at).toLocaleDateString()
              }}
            </span>
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
