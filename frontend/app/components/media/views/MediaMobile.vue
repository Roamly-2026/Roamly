<!-- frontend/app/components/media/views/MediaMobile.vue -->
<template>
  <div :class="LAYOUT_CONFIG.mobilePageWrapper">
    <!-- TOP NAV BUTTONS -->
    <div :class="LAYOUT_CONFIG.mobileTopActions">
      <BaseButton
        icon="i-heroicons-users"
        variant="glassIconButton"
        :to="membersRoute"
        :tooltip="UI_TEXT.tooltips.members"
      />
      <BaseButton
        icon="i-heroicons-calendar"
        variant="glassIconButton"
        :to="eventsRoute"
        :tooltip="UI_TEXT.tooltips.calendar"
      />
      <BaseButton
        icon="i-heroicons-photo"
        variant="glassIconButton"
        class="text-brand-500"
        :to="mediaRoute"
        :tooltip="UI_TEXT.tooltips.photos"
      />
      <BaseButton
        icon="i-heroicons-document-text"
        variant="glassIconButton"
        :to="documentsRoute"
        :tooltip="UI_TEXT.tooltips.documents"
      />
    </div>

    <div :class="LAYOUT_CONFIG.mobileMainWrapper">
      <!-- GROUP DROPDOWN HEADER -->
      <div :class="LAYOUT_CONFIG.mobileHeader">
        <UPopover
          v-model:open="isGroupDropdownOpen"
          :class="LAYOUT_CONFIG.fullWidth"
          :popper="{ strategy: 'fixed' }"
        >
          <BaseButton block variant="ghost" :class="LAYOUT_CONFIG.mobileHeaderButton">
            <div :class="LAYOUT_CONFIG.mobileHeaderTitleRow">
              <h1 :class="TYPOGRAPHY_CONFIG.sectionTitleTransparent">
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

      <!-- TOOLBAR: search + upload -->
      <div :class="LAYOUT_CONFIG.mobileToolbar">
        <BaseSearchInput v-model="searchQuery" :placeholder="UI_TEXT.media.search" class="flex-1" />
        <ViewSwitcher v-model="viewMode" />
        <BaseButton
          icon="i-heroicons-plus"
          variant="glassIconButton"
          :tooltip="UI_TEXT.media.uploadHeading"
          :disabled="!selectedGroup"
          @click="mediaStore.openUploadModal(selectedGroup!)"
        />
      </div>

      <!-- MEDIA LIST -->
      <div>
        <div v-if="isLoading" :class="TYPOGRAPHY_CONFIG.statusLoading">
          {{ ' ' + UI_TEXT.media.loading + ' ' }}
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

          <!-- MEDIA GALLERY GRID VIEW -->
          <MediaGrid v-else :media-list="filteredMedia" :is-loading="isLoading" />
        </template>

        <div v-else :class="TYPOGRAPHY_CONFIG.statusLoading">
          {{ searchQuery ? UI_TEXT.media.noMatchingPhotos : UI_TEXT.media.noPhotos }}
        </div>
      </div>
    </div>

    <!-- Modals -->
    <GroupMediaModals />
    <MediaLightboxModal />
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
import { useMediaModalsStore } from '~/stores/media.modals.store';
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

const currentGroupDetails = computed(() =>
  props.groups.find((g) => g.uuid === selectedGroup.value),
);

const selectGroup = (uuid: string) => {
  selectedGroup.value = uuid;
  isGroupDropdownOpen.value = false;
};

// Contextual nav routes
const membersRoute = computed(() =>
  selectedGroup.value ? `/groups/${selectedGroup.value}/members` : '/groups',
);
const eventsRoute = computed(() =>
  selectedGroup.value ? `/events?groupId=${selectedGroup.value}` : '/events',
);
const mediaRoute = computed(() =>
  selectedGroup.value ? `/files/media?groupId=${selectedGroup.value}` : '/files/media',
);
const documentsRoute = computed(() =>
  selectedGroup.value ? `/files/documents?groupId=${selectedGroup.value}` : '/files/documents',
);

const filteredMedia = computed<GroupFile[]>(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return props.media;
  return props.media.filter((m) => m.file_name.toLowerCase().includes(q));
});

const viewMode = useLocalStorage<ViewMode>('roamly_files_view_mode', 'grid');
</script>