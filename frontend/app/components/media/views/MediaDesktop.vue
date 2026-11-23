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
            <p :class="TYPOGRAPHY_CONFIG.pageSubtitle">
              {{ UI_TEXT.media.groupPhotos }}
            </p>
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

          <!-- MULTI-TAG FILTER WITH AUTOCOMPLETE -->
          <TagFilterDropdown v-model="selectedTags" :available-tags="availableTags" />

          <!-- VIEW SWITCHER (List vs Grid) -->
          <ViewSwitcher v-model="viewMode" />
        </div>

        <div :class="TYPOGRAPHY_CONFIG.sectionTitleTransparent">
          {{ UI_TEXT.media.groupPhotos }}
        </div>

        <div :class="LAYOUT_CONFIG.headerActionRight">
          <BaseButton
            icon="i-heroicons-plus"
            variant="glassIconButtonHighlight"
            :tooltip="UI_TEXT.media.uploadHeading"
            :disabled="!selectedGroup"
            @click="mediaStore.openUploadModal(selectedGroup!)"
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
          show-reactions
          @open="handleOpenFile"
          @delete="emit('delete', $event as GroupFile)"
          @download="(url, filename) => emit('download', url, filename)"
        />

        <!-- MEDIA GALLERY GRID VIEW -->
        <MediaGrid v-else :media-list="filteredMedia" :is-loading="isLoading" />
      </template>

      <div v-else :class="TYPOGRAPHY_CONFIG.statusLoading">
        {{
          searchQuery || selectedTags.length > 0
            ? UI_TEXT.media.noMatchingPhotos
            : UI_TEXT.media.noPhotos
        }}
      </div>
    </div>

    <!-- Modals -->
    <GroupMediaModals :group-uuid="selectedGroup" :available-tags="availableTags" />
    <MediaLightboxModal
      :is-current-user-leader="isCurrentUserLeader"
      @download="(url, filename) => emit('download', url, filename)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import type { GroupFile, PrivateDocumentMetadata } from '~/types/files.type';
import type { GroupOutDto } from '~/types/groups.type';
import type { ViewMode } from '~/components/files/ViewSwitcher.vue';
import FilesListView from '~/components/files/FilesListView.vue';
import ViewSwitcher from '~/components/files/ViewSwitcher.vue';
import { useMediaModalsStore } from '~/stores/media.modals.store';
import { filterGroupFiles } from '~/utils/filter.utils';
import MediaGrid from '~/components/media/views/MediaGrid.vue';
import GroupMediaModals from '~/components/media/modals/GroupMediaModals.vue';
import MediaLightboxModal from '~/components/media/modals/MediaLightBoxModal.vue';

const mediaStore = useMediaModalsStore();

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
const selectedTags = ref<string[]>([]);

watch(selectedGroup, () => {
  selectedTags.value = [];
});

const currentGroupDetails = computed(() =>
  props.groups.find((g) => g.uuid === selectedGroup.value),
);

const selectGroup = (uuid: string) => {
  selectedGroup.value = uuid;
  isGroupDropdownOpen.value = false;
};

const availableTags = computed<string[]>(() => {
  const tagMap = new Map<string, string>();
  for (const item of props.media) {
    for (const tag of item.tags || []) {
      const lower = tag.toLowerCase();
      if (!tagMap.has(lower)) {
        tagMap.set(lower, tag);
      }
    }
  }
  return Array.from(tagMap.values()).sort((a, b) => a.localeCompare(b));
});

const filteredMedia = computed<GroupFile[]>(() => {
  return filterGroupFiles(props.media, searchQuery.value, selectedTags.value);
});

const viewMode = useLocalStorage<ViewMode>('roamly_files_view_mode', 'grid');

const handleOpenFile = (file: GroupFile | PrivateDocumentMetadata) => {
  const index = filteredMedia.value.findIndex((f) => f.file_id === file.file_id);
  if (index !== -1) {
    mediaStore.openLightbox(filteredMedia.value, index);
  }
};
</script>
