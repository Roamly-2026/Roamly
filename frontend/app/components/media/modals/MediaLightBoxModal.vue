<!-- frontend/app/components/media/modals/MediaLightBoxModal.vue -->
<template>
  <UModal
    :open="mediaStore.isLightboxOpen"
    :ui="{
      content: `!w-[95vw] lg:!max-w-7xl h-[92vh] sm:h-[90vh] flex flex-col landscape:flex-row lg:flex-row overflow-hidden !bg-black/95 ${BORDER_TOKENS.ringSubtle} ${RADIUS_TOKENS.lg} !p-0 ${SHADOW_TOKENS.heavy}`,
      overlay: MODAL_CONFIG.slots.overlay,
    }"
    @update:open="mediaStore.closeLightbox()"
  >
    <template #content>
      <div
        v-if="activeMedia"
        class="flex flex-col landscape:flex-row lg:flex-row w-full h-full min-h-0"
      >
        <!-- IMAGE / VIDEO AREA -->
        <div
          class="relative flex-1 flex items-center justify-center overflow-hidden bg-black group min-h-0 min-w-0 select-none"
          @touchstart.passive="onTouchStart"
          @touchend.passive="onTouchEnd"
        >
          <img
            v-if="activeMedia.mime_type?.startsWith('image/')"
            :src="activeMedia.download_url || activeMedia.file_url"
            :alt="activeMedia.file_name || 'Media'"
            class="w-full h-full object-contain"
          />
          <video
            v-else
            :src="activeMedia.download_url || activeMedia.file_url"
            controls
            class="w-full h-full object-contain"
          ></video>

          <!-- PREV BUTTON -->
          <button
            v-if="mediaStore.lightboxMediaList.length > 1"
            :class="`absolute left-3 sm:left-4 w-10 h-10 sm:w-12 sm:h-12 aspect-square flex items-center justify-center p-0 ${BUTTON_APPEARANCES.pictureOverlay} active:scale-95 opacity-80 lg:opacity-0 lg:group-hover:opacity-100 transition-all cursor-pointer ${Z_INDEX_TOKENS.base}`"
            @click.stop="mediaStore.prevMedia()"
          >
            <UIcon name="i-heroicons-chevron-left" :class="SIZE_TOKENS.icon.lg" />
          </button>

          <!-- NEXT BUTTON -->
          <button
            v-if="mediaStore.lightboxMediaList.length > 1"
            :class="`absolute right-3 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 aspect-square flex items-center justify-center p-0 ${BUTTON_APPEARANCES.pictureOverlay} active:scale-95 opacity-80 lg:opacity-0 lg:group-hover:opacity-100 transition-all cursor-pointer ${Z_INDEX_TOKENS.base}`"
            @click.stop="mediaStore.nextMedia()"
          >
            <UIcon name="i-heroicons-chevron-right" :class="SIZE_TOKENS.icon.lg" />
          </button>
        </div>

        <!-- INFO BAR -->
        <div
          :class="`w-full landscape:w-80 lg:w-96 max-h-[42%] landscape:max-h-none lg:max-h-none landscape:h-full lg:h-full ${COLOR_TOKENS.surface.modal} ${COLOR_TOKENS.text.primary} flex flex-col overflow-y-auto custom-scrollbar border-t landscape:border-t-0 lg:border-t-0 landscape:border-l lg:border-l ${COLOR_TOKENS.border.default} shrink-0`"
        >
          <!-- STICKY ACTION BAR -->
          <div
            :class="`${LAYOUT_CONFIG.flexBetween} ${SPACING_TOKENS.p.md} ${BORDER_TOKENS.dividerBottom} sticky top-0 ${GLASS_TOKENS.strong} ${Z_INDEX_TOKENS.base}`"
          >
            <div :class="`flex items-center ${SPACING_TOKENS.gap.sm}`">
              <!-- Direct Download -->
              <BaseButton
                icon="i-heroicons-arrow-down-tray"
                variant="ghostBrandIconButton"
                :tooltip="UI_TEXT.common.download"
                @click.stop.prevent="handleDownload"
              />

              <!-- Modify (pencil) -->
              <BaseButton
                v-if="canManage"
                icon="i-heroicons-pencil-square"
                variant="ghostBrandIconButton"
                tooltip="Modify"
                @click="
                  mediaStore.closeLightbox();
                  mediaStore.openUpdateModal(activeMedia!);
                "
              />

              <!-- Delete (trashcan) -->
              <BaseButton
                v-if="canManage"
                icon="i-heroicons-trash"
                variant="ghostDangerIconButton"
                :tooltip="UI_TEXT.common.delete"
                @click="
                  mediaStore.closeLightbox();
                  mediaStore.openDeleteModal(activeMedia!);
                "
              />
            </div>

            <!-- Close Button (uses ghostDangerIconButton so it turns red on hover) -->
            <BaseButton
              icon="i-heroicons-x-mark"
              variant="ghostDangerIconButton"
              @click="mediaStore.closeLightbox()"
            />
          </div>

          <div :class="`flex flex-col ${SPACING_TOKENS.gap.lg} ${SPACING_TOKENS.p.md}`">
            <!-- Uploader -->
            <div :class="`flex items-center ${SPACING_TOKENS.gap.md}`">
              <UAvatar
                :src="activeMedia.creator?.profile_image_url || undefined"
                :alt="activeMedia.creator?.username"
                icon="i-heroicons-user"
                size="header"
                class="!w-9 !h-9 min-w-[36px] min-h-[36px] shrink-0"
              />
              <div class="flex flex-col min-w-0">
                <span :class="TYPOGRAPHY_CONFIG.cardTitleSm">
                  {{ activeMedia.creator?.username || UI_TEXT.common.unknown }}
                </span>
                <span :class="TYPOGRAPHY_CONFIG.captionMuted">
                  {{ formatDisplayDate(activeMedia.created_at) }}
                </span>
              </div>
            </div>

            <div :class="LAYOUT_CONFIG.divider" class="my-0!"></div>

            <!-- Date and Map -->
            <div :class="`flex flex-col ${SPACING_TOKENS.gap.md}`">
              <div
                v-if="activeMedia.media_files?.taken_at"
                :class="`flex items-start ${SPACING_TOKENS.gap.sm}`"
              >
                <UIcon
                  name="i-heroicons-calendar"
                  :class="`${TYPOGRAPHY_CONFIG.iconMutedSm} shrink-0 mt-0.5`"
                />
                <div class="flex flex-col">
                  <span :class="TYPOGRAPHY_CONFIG.captionUppercase">Taken At</span>
                  <span :class="TYPOGRAPHY_CONFIG.bodySmSoft">
                    {{ formatDisplayDateTime(activeMedia.media_files.taken_at) }}
                  </span>
                </div>
              </div>

              <div
                v-if="
                  activeMedia.media_files?.location_name ||
                  (activeMedia.media_files?.latitude != null &&
                    activeMedia.media_files?.longitude != null)
                "
                :class="`flex items-start ${SPACING_TOKENS.gap.sm}`"
              >
                <UIcon
                  name="i-heroicons-map-pin"
                  :class="`${TYPOGRAPHY_CONFIG.iconMutedSm} shrink-0 mt-0.5`"
                />
                <div class="flex flex-col flex-1 min-w-0">
                  <span :class="TYPOGRAPHY_CONFIG.captionUppercase">Location</span>
                  <span
                    v-if="activeMedia.media_files?.location_name"
                    :class="`${TYPOGRAPHY_CONFIG.bodySmSoft} break-words`"
                  >
                    {{ activeMedia.media_files.location_name }}
                  </span>
                  <div
                    v-if="
                      activeMedia.media_files?.latitude != null &&
                      activeMedia.media_files?.longitude != null
                    "
                    :class="`w-full h-36 ${SPACING_TOKENS.mt.sm} ${RADIUS_TOKENS.sm} overflow-hidden ${BORDER_TOKENS.medium} relative z-0`"
                  >
                    <ClientOnly>
                      <EventMapPreview
                        :latitude="activeMedia.media_files.latitude"
                        :longitude="activeMedia.media_files.longitude"
                      />
                    </ClientOnly>
                  </div>
                </div>
              </div>
            </div>

            <!-- Caption -->
            <div
              v-if="activeMedia.media_files?.description"
              :class="`flex flex-col ${SPACING_TOKENS.gap.xs}`"
            >
              <span :class="TYPOGRAPHY_CONFIG.captionUppercase">Description</span>
              <p :class="`${TYPOGRAPHY_CONFIG.bodySmSoft} whitespace-pre-wrap break-words`">
                {{ activeMedia.media_files.description }}
              </p>
            </div>

            <!-- Tags -->
            <div
              v-if="(activeMedia.media_files?.media_tags?.length || 0) > 0"
              :class="`flex flex-col ${SPACING_TOKENS.gap.sm}`"
            >
              <span :class="TYPOGRAPHY_CONFIG.captionUppercase">
                Tagged ({{ activeMedia.media_files!.media_tags!.length }})
              </span>
              <div :class="`flex flex-wrap ${SPACING_TOKENS.gap.sm}`">
                <div
                  v-for="tag in activeMedia.media_files!.media_tags"
                  :key="tag.users.uuid"
                  :class="`flex items-center ${SPACING_TOKENS.gap.xs} ${SPACING_TOKENS.px.sm} ${SPACING_TOKENS.py.xs} ${RADIUS_TOKENS.full} ${COLOR_TOKENS.surface.subtle} ${BORDER_TOKENS.thin}`"
                >
                  <UAvatar
                    :src="tag.users.profile_image_url || undefined"
                    :alt="tag.users.username"
                    size="header"
                    class="!w-6 !h-6 min-w-[24px] min-h-[24px] shrink-0"
                  />
                  <span :class="TYPOGRAPHY_CONFIG.captionBoldPrimary">
                    {{ tag.users.username }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useMediaModalsStore } from '~/stores/media.modals.store';
import { useCurrentUserQuery } from '~/queries/user.query';
import EventMapPreview from '~/components/events/map/EventMapPreview.client.vue';

const props = withDefaults(
  defineProps<{
    isCurrentUserLeader?: boolean;
  }>(),
  {
    isCurrentUserLeader: false,
  },
);

const emit = defineEmits<{
  download: [url: string | undefined, filename: string];
}>();

const mediaStore = useMediaModalsStore();
const { data: currentUser } = useCurrentUserQuery();

const activeMedia = computed(() => mediaStore.activeMedia);

// Only the uploader or a group leader can edit/delete a media item
const canManage = computed(() => {
  if (!currentUser.value || !activeMedia.value) return false;
  if (props.isCurrentUserLeader) return true;
  if (activeMedia.value.creator?.uuid && currentUser.value.uuid) {
    return activeMedia.value.creator.uuid === currentUser.value.uuid;
  }
  if (activeMedia.value.creator?.email && currentUser.value.email) {
    return activeMedia.value.creator.email === currentUser.value.email;
  }
  return false;
});

// Swipe gesture handling for mobile
const touchStartX = ref(0);
const touchStartY = ref(0);

const onTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.changedTouches[0]?.screenX || 0;
  touchStartY.value = e.changedTouches[0]?.screenY || 0;
};

const onTouchEnd = (e: TouchEvent) => {
  if (mediaStore.lightboxMediaList.length <= 1) return;

  const touchEndX = e.changedTouches[0]?.screenX || 0;
  const touchEndY = e.changedTouches[0]?.screenY || 0;

  const diffX = touchStartX.value - touchEndX;
  const diffY = touchStartY.value - touchEndY;

  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
    if (diffX > 0) {
      mediaStore.nextMedia();
    } else {
      mediaStore.prevMedia();
    }
  }
};

const handleKeydown = (e: KeyboardEvent) => {
  if (!mediaStore.isLightboxOpen) return;
  if (e.key === 'ArrowRight') mediaStore.nextMedia();
  if (e.key === 'ArrowLeft') mediaStore.prevMedia();
  if (e.key === 'Escape') mediaStore.closeLightbox();
};

onMounted(() => window.addEventListener('keydown', handleKeydown));
onUnmounted(() => window.removeEventListener('keydown', handleKeydown));

const formatDisplayDateTime = (dateStr?: string | Date | null) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}. ${pad(d.getMonth() + 1)}. ${pad(d.getDate())}. ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const formatDisplayDate = (dateStr?: string | Date | null) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}. ${pad(d.getMonth() + 1)}. ${pad(d.getDate())}.`;
};

const handleDownload = () => {
  const url = activeMedia.value?.download_url || activeMedia.value?.file_url;
  const filename = activeMedia.value?.file_name || 'download';
  if (!url) return;

  emit('download', url, filename);
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}
</style>
