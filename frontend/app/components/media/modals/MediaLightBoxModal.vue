<template>
  <UModal
    :open="mediaStore.isLightboxOpen"
    :ui="{
      content:
        '!w-[95vw] sm:!max-w-7xl h-[90vh] flex flex-col sm:flex-row overflow-hidden !bg-black/95 !ring-1 !ring-white/10 !rounded-2xl !p-0 shadow-2xl',
      overlay: 'fixed inset-0 z-[100] bg-black/80 backdrop-blur-md',
    }"
    @update:open="mediaStore.closeLightbox()"
  >
    <template #content>
      <div v-if="activeMedia" class="flex flex-col sm:flex-row w-full h-full min-h-0">
        <!-- LEFT SIDE: IMAGE/VIDEO -->
        <div
          class="relative flex-1 flex items-center justify-center overflow-hidden bg-black group h-full min-h-0 min-w-0"
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

          <button
            v-if="mediaStore.lightboxMediaList.length > 1"
            class="absolute left-4 w-12 h-12 aspect-square flex items-center justify-center p-0 rounded-full bg-black/50 text-white hover:bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
            @click.stop="mediaStore.prevMedia()"
          >
            <UIcon name="i-heroicons-chevron-left" class="w-7 h-7" />
          </button>
          <button
            v-if="mediaStore.lightboxMediaList.length > 1"
            class="absolute right-4 w-12 h-12 aspect-square flex items-center justify-center p-0 rounded-full bg-black/50 text-white hover:bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
            @click.stop="mediaStore.nextMedia()"
          >
            <UIcon name="i-heroicons-chevron-right" class="w-7 h-7" />
          </button>
        </div>

        <!-- RIGHT SIDE: INFO BAR -->
        <div
          class="w-full sm:w-80 lg:w-96 bg-surface-500 flex flex-col h-full overflow-y-auto custom-scrollbar border-l border-white/10 shrink-0"
        >
          <div
            :class="`flex items-center justify-between ${SPACING_TOKENS.p.md} border-b border-dark-text/10 sticky top-0 bg-surface-500/90 backdrop-blur z-10`"
          >
            <div :class="`flex items-center ${SPACING_TOKENS.gap.sm}`">
              <!-- Download -->
              <BaseButton
                icon="i-heroicons-arrow-down-tray"
                variant="ghostBrandIconButton"
                class="text-dark-text/70"
                :tooltip="UI_TEXT.common.download"
                :href="activeMedia.download_url || activeMedia.file_url"
                target="_blank"
              />

              <!-- Modify (pencil) -->
              <BaseButton
                v-if="canManage"
                icon="i-heroicons-pencil-square"
                variant="ghostBrandIconButton"
                class="text-dark-text/70 hover:text-brand-500"
                tooltip="Módosítás"
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

            <!-- Close -->
            <BaseButton
              icon="i-heroicons-x-mark"
              variant="ghost"
              class="text-dark-text/70 hover:text-dark-text"
              @click="mediaStore.closeLightbox()"
            />
          </div>

          <div :class="`flex flex-col ${SPACING_TOKENS.gap.lg} ${SPACING_TOKENS.p.md}`">
            <!-- Uploader -->
            <div :class="`flex items-center ${SPACING_TOKENS.gap.md}`">
              <UAvatar
                :src="(activeMedia.creator as any)?.profile_image_url || undefined"
                icon="i-heroicons-user"
                class="!w-9 !h-9 min-w-[36px] min-h-[36px] shrink-0"
              />
              <div class="flex flex-col">
                <span class="text-sm font-bold text-dark-text">{{
                  activeMedia.creator?.username
                }}</span>
                <span class="text-xs text-dark-text/60">
                  {{ new Date(activeMedia.created_at).toLocaleDateString() }}
                </span>
              </div>
            </div>
            <div :class="appConfig.layout.divider" class="my-0!"></div>

            <!-- Date and Map -->
            <div :class="`flex flex-col ${SPACING_TOKENS.gap.md}`">
              <div
                v-if="activeMedia.media_files?.taken_at"
                :class="`flex items-start ${SPACING_TOKENS.gap.sm}`"
              >
                <UIcon
                  name="i-heroicons-calendar"
                  class="w-5 h-5 text-dark-text/60 shrink-0 mt-0.5"
                />
                <div class="flex flex-col">
                  <span class="text-xs font-bold text-dark-text/60 uppercase">Taken At</span>
                  <span class="text-sm text-dark-text font-medium">
                    {{ new Date(activeMedia.media_files.taken_at).toLocaleString() }}
                  </span>
                </div>
              </div>

              <div
                v-if="activeMedia.media_files?.location_name"
                :class="`flex items-start ${SPACING_TOKENS.gap.sm}`"
              >
                <UIcon
                  name="i-heroicons-map-pin"
                  class="w-5 h-5 text-dark-text/60 shrink-0 mt-0.5"
                />
                <div class="flex flex-col flex-1 min-w-0">
                  <span class="text-xs font-bold text-dark-text/60 uppercase">Location</span>
                  <span class="text-sm text-dark-text font-medium break-words">{{
                    activeMedia.media_files.location_name
                  }}</span>
                  <div
                    v-if="activeMedia.media_files?.latitude && activeMedia.media_files?.longitude"
                    :class="`w-full h-32 ${SPACING_TOKENS.mt.sm} rounded-lg overflow-hidden border border-surface-200 relative z-0`"
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
              <span class="text-xs font-bold text-dark-text/60 uppercase">Description</span>
              <p class="text-sm text-dark-text/90 whitespace-pre-wrap">
                {{ activeMedia.media_files.description }}
              </p>
            </div>

            <!-- Tags -->
            <div
              v-if="(activeMedia.media_files?.media_tags?.length || 0) > 0"
              :class="`flex flex-col ${SPACING_TOKENS.gap.sm}`"
            >
              <span class="text-xs font-bold text-dark-text/60 uppercase"
                >Tagged ({{ activeMedia.media_files!.media_tags!.length }})</span
              >
              <div :class="`flex flex-wrap ${SPACING_TOKENS.gap.sm}`">
                <div
                  v-for="tag in activeMedia.media_files!.media_tags"
                  :key="tag.users.uuid"
                  :class="`flex items-center ${SPACING_TOKENS.gap.xs} px-2 py-1 rounded-full bg-surface-100 border border-surface-200`"
                >
                  <UAvatar
                    :src="tag.users.profile_image_url || undefined"
                    :alt="tag.users.username"
                    class="!w-6 !h-6 min-w-[24px] min-h-[24px] shrink-0"
                  />
                  <span class="text-xs font-medium text-dark-text">{{ tag.users.username }}</span>
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
import { computed, onMounted, onUnmounted } from 'vue';
import { useAppConfig } from '#imports';
import { useMediaModalsStore } from '~/stores/media.modals.store';
import { useCurrentUserQuery } from '~/queries/user.query';
import EventMapPreview from '~/components/events/map/EventMapPreview.client.vue';

const appConfig = useAppConfig();
const mediaStore = useMediaModalsStore();
const { data: currentUser } = useCurrentUserQuery();

const activeMedia = computed(() => mediaStore.activeMedia);

const canManage = computed(() => !!currentUser.value);

const handleKeydown = (e: KeyboardEvent) => {
  if (!mediaStore.isLightboxOpen) return;
  if (e.key === 'ArrowRight') mediaStore.nextMedia();
  if (e.key === 'ArrowLeft') mediaStore.prevMedia();
  if (e.key === 'Escape') mediaStore.closeLightbox();
};

onMounted(() => window.addEventListener('keydown', handleKeydown));
onUnmounted(() => window.removeEventListener('keydown', handleKeydown));
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
