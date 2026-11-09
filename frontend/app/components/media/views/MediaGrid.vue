<!-- frontend/app/components/media/views/MediaGrid.vue -->
<template>
  <div :class="LAYOUT_CONFIG.fullWidth">
    <div v-if="isLoading" :class="TYPOGRAPHY_CONFIG.statusLoading">
      {{ UI_TEXT.media.loading }}
    </div>

    <div
      v-else-if="mediaList.length > 0"
      :class="`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${SPACING_TOKENS.responsive.gridGap} ${LAYOUT_CONFIG.fullWidth}`"
    >
      <div
        v-for="(media, index) in mediaList"
        :key="media.file_id"
        :class="`group relative aspect-square bg-surface-card/40 ${RADIUS_TOKENS.md} overflow-hidden cursor-pointer ${SHADOW_TOKENS.sm} ${BORDER_TOKENS.ringSubtle} hover:ring-btn-primary transition-all`"
        @click="mediaStore.openLightbox(mediaList, index)"
      >
        <!-- IMAGE SHOWCASE -->
        <img
          v-if="media.mime_type?.startsWith('image/')"
          :src="media.download_url || media.file_url"
          :alt="media.file_name || 'Image'"
          :class="`${LAYOUT_CONFIG.mediaCoverImage} group-hover:scale-105 transition-transform duration-500`"
        />

        <!-- AUTOMATIC THUMBNAIL FOR VIDEOS -->
        <div v-else class="relative w-full h-full bg-black flex items-center justify-center">
          <video
            :src="`${media.download_url || media.file_url}#t=0.1`"
            preload="metadata"
            muted
            playsinline
            :class="`${LAYOUT_CONFIG.mediaCoverImage} group-hover:scale-105 transition-transform duration-500`"
          ></video>

          <!-- PLAY ICON -->
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              :class="`w-12 h-12 aspect-square flex items-center justify-center ${RADIUS_TOKENS.full} bg-black/60 ${COLOR_TOKENS.text.inverse} group-hover:bg-btn-primary transition-all`"
            >
              <UIcon name="i-heroicons-play" :class="`${SIZE_TOKENS.icon.lg} translate-x-0.5`" />
            </div>
          </div>
        </div>

        <!-- METADATA OVERLAY (Location, Date & Tagged Participants) -->
        <div
          :class="`absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 via-black/45 to-transparent ${SPACING_TOKENS.p.sm} ${SPACING_TOKENS.pt.xl} flex flex-col ${SPACING_TOKENS.gap.xs} sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300`"
        >
          <div
            v-if="media.media_files?.location_name"
            :class="`flex items-center ${SPACING_TOKENS.gap.xs} ${COLOR_TOKENS.text.inverse}`"
          >
            <UIcon name="i-heroicons-map-pin" :class="`${SIZE_TOKENS.icon.sm} shrink-0`" />
            <span :class="`${TEXT_SIZES.xs} ${FONT_WEIGHTS.medium} truncate`">
              {{ media.media_files.location_name }}
            </span>
          </div>

          <div :class="`flex items-end justify-between ${SPACING_TOKENS.mt.xs}`">
            <span
              :class="`${TEXT_SIZES.xs} ${COLOR_TOKENS.text.inverse} ${OPACITY_TOKENS.soft} ${FONT_WEIGHTS.medium}`"
            >
              {{
                media.media_files?.taken_at
                  ? new Date(media.media_files.taken_at).toLocaleDateString()
                  : new Date(media.created_at).toLocaleDateString()
              }}
            </span>

            <!-- Tagged Participants Avatars -->
            <div
              v-if="(media.media_files?.media_tags?.length || 0) > 0"
              :class="[CALENDAR_CONFIG.participantsAvatars, CALENDAR_CONFIG.participantsOverlap]"
            >
              <UTooltip
                v-for="tag in media.media_files!.media_tags!.slice(0, 3)"
                :key="tag.users.uuid"
                :text="tag.users.username"
              >
                <UAvatar
                  :src="tag.users.profile_image_url || undefined"
                  :alt="tag.users.username"
                  :class="`${CALENDAR_CONFIG.participantAvatar} !w-6 !h-6 min-w-[24px] min-h-[24px]`"
                />
              </UTooltip>
              <div
                v-if="media.media_files!.media_tags!.length > 3"
                :class="`${CALENDAR_CONFIG.participantMoreBadge} !w-6 !h-6 min-w-[24px] min-h-[24px]`"
              >
                +{{ media.media_files!.media_tags!.length - 3 }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else :class="TYPOGRAPHY_CONFIG.statusLoading">
      {{ UI_TEXT.media.noPhotos }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMediaModalsStore } from '~/stores/media.modals.store';
import type { GroupFile } from '~/types/files.type';

defineProps<{
  mediaList: GroupFile[];
  isLoading: boolean;
}>();

const mediaStore = useMediaModalsStore();
</script>
