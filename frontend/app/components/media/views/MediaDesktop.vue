<!-- frontend/app/components/media/views/MediaDesktop.vue -->
<template>
  <div :class="LAYOUT_CONFIG.pageWrapper">
    <div :class="LAYOUT_CONFIG.pageHeader">
      <div :class="LAYOUT_CONFIG.headerActionLeft">
        <BaseButton
          v-if="isCurrentUserLeader"
          icon="i-heroicons-trash"
          variant="glassIconButtonDanger"
          :tooltip="UI_TEXT.groups.deleteGroup"
          @click="emit('delete-group')"
        />
        <BaseButton
          icon="i-heroicons-arrow-right-on-rectangle"
          variant="glassIconButtonDanger"
          :tooltip="UI_TEXT.groups.leaveGroup"
          @click="emit('leave-group')"
        />
      </div>

      <div :class="LAYOUT_CONFIG.headerCenter">
        <UPopover v-model:open="isGroupDropdownOpen">
          <BaseButton variant="ghost" :class="LAYOUT_CONFIG.headerDropdownButton">
            <div :class="LAYOUT_CONFIG.headerDropdownTitleRow">
              <h1 :class="TYPOGRAPHY_CONFIG.pageTitle">
                <ClientOnly :fallback="UI_TEXT.common.loading">
                  {{
                    isLoading
                      ? UI_TEXT.common.loading
                      : currentGroupDetails?.name || UI_TEXT.documents.selectGroup
                  }}
                </ClientOnly>
              </h1>
              <UIcon
                name="i-heroicons-chevron-down"
                :class="[
                  TYPOGRAPHY_CONFIG.iconDropdownChevron,
                  isGroupDropdownOpen ? 'rotate-180' : '',
                ]"
              />
            </div>
          </BaseButton>
          <template #content>
            <div :class="WIDE_DROPDOWN_MENU_CONFIG.slots.content">
              <BaseButton
                v-for="group in groups"
                :key="group.uuid"
                :class="WIDE_DROPDOWN_MENU_CONFIG.slots.item"
                variant="ghost"
                @click="selectGroup(group.uuid)"
              >
                <template #leading>
                  <UIcon
                    :name="
                      group.uuid === selectedGroup ? 'i-heroicons-check' : 'i-heroicons-user-group'
                    "
                    :class="WIDE_DROPDOWN_MENU_CONFIG.slots.itemLeadingIcon"
                  />
                </template>
                {{ group.name }}
              </BaseButton>
            </div>
          </template>
        </UPopover>
        <p :class="TYPOGRAPHY_CONFIG.pageSubtitle">
          {{ UI_TEXT.media.groupPhotos }}
        </p>
      </div>

      <div :class="LAYOUT_CONFIG.headerActionRight">
        <NavigationMenu :group-uuid="selectedGroup" active-tab="media" :is-mobile="false" />
      </div>
    </div>

    <!-- MEDIA SECTION -->
    <div :class="[LAYOUT_CONFIG.sectionWrapper, SPACING_TOKENS.mb.xl]">
      <div :class="LAYOUT_CONFIG.headerRow">
        <div :class="LAYOUT_CONFIG.headerActionLeft">
          <div :class="LAYOUT_CONFIG.headerSearchWrapper">
            <BaseSearchInput v-model="searchQuery" :placeholder="UI_TEXT.media.search" />
          </div>

          <!-- VIEW SWITCHER -->
          <ViewSwitcher v-model="viewMode" />
        </div>

        <div :class="TYPOGRAPHY_CONFIG.sectionTitleTransparent">
          {{ UI_TEXT.media.groupPhotos }}
        </div>

        <div :class="LAYOUT_CONFIG.headerActionRight">
          <BaseButton
            v-if="isCurrentUserLeader"
            icon="i-heroicons-plus"
            variant="glassIconButtonHighlight"
            :tooltip="UI_TEXT.media.uploadPhoto"
            @click="emit('upload')"
          />
        </div>
      </div>

      <div v-if="isLoading" :class="TYPOGRAPHY_CONFIG.statusLoading">
        {{ UI_TEXT.media.loading }}
      </div>

      <template v-else-if="filteredMedia.length > 0">
        <!-- LIST VIEW -->
        <FilesListView
          v-if="viewMode === 'list'"
          :files="filteredMedia"
          :is-current-user-leader="isCurrentUserLeader"
          @delete="emit('delete', $event as GroupFile)"
          @download="(url, filename) => emit('download', url, filename)"
        />

        <!-- Media Grid -->
        <div v-else :class="LAYOUT_CONFIG.documentGrid">
          <BaseCard
            v-for="mediaItem in filteredMedia"
            :key="mediaItem.file_id"
            variant="documentGlass"
            :class="LAYOUT_CONFIG.headerRelative"
          >
            <!-- Title + delete -->
            <div :class="LAYOUT_CONFIG.documentCardHeader">
              <p :class="TYPOGRAPHY_CONFIG.documentHeaderTitle">{{ mediaItem.file_name }}</p>
              <div :class="LAYOUT_CONFIG.headerTitleRow">
                <BaseButton
                  v-if="isCurrentUserLeader"
                  icon="i-heroicons-trash"
                  variant="ghostDangerIconButton"
                  :tooltip="UI_TEXT.common.delete"
                  @click="emit('delete', mediaItem)"
                />
              </div>
            </div>

            <!-- Image preview -->
            <div :class="LAYOUT_CONFIG.documentCardImage">
              <img
                v-if="isImage(mediaItem.mime_type)"
                :src="mediaItem.download_url || mediaItem.file_url"
                :alt="mediaItem.file_name"
                :class="LAYOUT_CONFIG.mediaCoverImage"
              />
              <div v-else :class="LAYOUT_CONFIG.cardContentCenter">
                <UIcon name="i-heroicons-film" :class="TYPOGRAPHY_CONFIG.iconWatermarkLg" />
                <span :class="TYPOGRAPHY_CONFIG.captionMuted">{{ mediaItem.mime_type }}</span>
              </div>

              <div :class="LAYOUT_CONFIG.documentCardBottomActions">
                <BaseButton
                  icon="i-heroicons-eye"
                  variant="ghostDangerIconButton"
                  :href="mediaItem.download_url || mediaItem.file_url"
                  target="_blank"
                  :tooltip="UI_TEXT.common.view"
                />
                <BaseButton
                  icon="i-heroicons-arrow-down-tray"
                  variant="ghostBrandIconButton"
                  :class="COLOR_TOKENS.text.primaryMuted"
                  :tooltip="UI_TEXT.common.download"
                  @click.prevent="
                    emit(
                      'download',
                      mediaItem.download_url || mediaItem.file_url,
                      mediaItem.file_name,
                    )
                  "
                />
              </div>
            </div>

            <!-- Metadata -->
            <div :class="LAYOUT_CONFIG.documentCardMeta">
              <div :class="['flex items-center', SPACING_TOKENS.mb.xs, SPACING_TOKENS.gap.xs]">
                <UAvatar
                  :src="mediaItem.creator?.profile_image_url || undefined"
                  :alt="mediaItem.creator?.username"
                  class="w-6! h-6! text-[10px] shrink-0 rounded-full object-cover"
                />
                <span :class="TYPOGRAPHY_CONFIG.metaHighlight">
                  {{ mediaItem.creator?.username || UI_TEXT.common.unknown }}
                </span>
              </div>

              <p>
                {{ ' ' + UI_TEXT.common.uploadedAt + ' ' }}
                <span :class="TYPOGRAPHY_CONFIG.metaHighlight">
                  {{ new Date(mediaItem.created_at).toLocaleDateString() }}
                </span>
              </p>
              <div v-if="mediaItem.media_files?.description">
                <div :class="LAYOUT_CONFIG.divider"></div>
                <p>
                  {{ ' ' + UI_TEXT.events.descriptionLabel + ' ' }}
                  <span :class="TYPOGRAPHY_CONFIG.metaHighlight">
                    {{ mediaItem.media_files.description }}
                  </span>
                </p>
              </div>
              <div :class="LAYOUT_CONFIG.divider"></div>
              <div :class="LAYOUT_CONFIG.flexBetween">
                <p>
                  {{ ' ' + UI_TEXT.media.type + ' ' }}
                  <span :class="TYPOGRAPHY_CONFIG.metaHighlight">
                    {{ mediaItem.mime_type?.split('/')[1] || UI_TEXT.common.unknown }}
                  </span>
                </p>
                <p>
                  {{ ' ' + UI_TEXT.media.size + ' ' }}
                  <span :class="TYPOGRAPHY_CONFIG.metaHighlight">
                    {{ formatFileSize(mediaItem.file_size) }}
                  </span>
                </p>
              </div>
            </div>
          </BaseCard>
        </div>
      </template>

      <div v-else :class="TYPOGRAPHY_CONFIG.statusLoading">
        {{ searchQuery ? UI_TEXT.media.noMatchingPhotos : UI_TEXT.media.noPhotos }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import type { GroupFile } from '~/types/files.type';
import type { GroupOutDto } from '~/types/groups.type';
import type { ViewMode } from '~/components/files/ViewSwitcher.vue';
import FilesListView from '~/components/files/FilesListView.vue';
import ViewSwitcher from '~/components/files/ViewSwitcher.vue';

const selectedGroup = defineModel<string | undefined>('selectedGroup');
const searchQuery = defineModel<string>('searchQuery', { default: '' });

const props = defineProps<{
  media: GroupFile[];
  groups: GroupOutDto[];
  isLoading: boolean;
  isCurrentUserLeader: boolean;
}>();

const emit = defineEmits<{
  delete: [file: GroupFile];
  upload: [];
  'delete-group': [];
  'leave-group': [];
  download: [url: string | undefined, filename: string];
}>();

const isGroupDropdownOpen = ref(false);

const currentGroupDetails = computed(() =>
  props.groups.find((g) => g.uuid === selectedGroup.value),
);

const selectGroup = (uuid: string) => {
  selectedGroup.value = uuid;
  isGroupDropdownOpen.value = false;
};

const isImage = (mimeType: string) => mimeType?.startsWith('image/');

const filteredMedia = computed<GroupFile[]>(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return props.media;
  return props.media.filter((m) => m.file_name.toLowerCase().includes(q));
});

const viewMode = useLocalStorage<ViewMode>('roamly_files_view_mode', 'grid');
</script>
