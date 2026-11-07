<!-- frontend/app/components/media/views/MediaDesktop.vue -->
<template>
  <div :class="appConfig.layout.pageWrapper">
    <!-- HEADER -->
    <div :class="appConfig.layout.pageHeader">
      <div :class="appConfig.layout.actionGroup" class="flex-1 justify-start"></div>

      <!-- DROPDOWN HEADER -->
      <div class="flex flex-col items-center justify-center shrink-0">
        <UPopover v-model:open="isGroupDropdownOpen">
          <BaseButton
            variant="ghost"
            :class="`group flex items-center ${SPACING_TOKENS.gap.sm} p-0 hover:bg-transparent cursor-pointer outline-none`"
          >
            <h1 :class="appConfig.typography.pageTitle">
              <ClientOnly :fallback="UI_TEXT.common.loading">
                {{
                  isLoadingGroups
                    ? UI_TEXT.common.loading
                    : currentGroupDetails?.name || UI_TEXT.events.selectGroup
                }}
              </ClientOnly>
            </h1>
            <UIcon
              name="i-heroicons-chevron-down"
              class="w-5 h-5 text-surface-500 transition-transform duration-200"
              :class="{ 'rotate-180': isGroupDropdownOpen }"
            />
          </BaseButton>

          <template #content>
            <div
              :class="[
                appConfig.ui.wideDropdownMenu.slots.content,
                'max-h-[50vh] overflow-y-auto custom-scrollbar',
              ]"
            >
              <BaseButton
                v-for="group in userGroupsList"
                :key="group.uuid"
                :class="appConfig.ui.wideDropdownMenu.slots.item"
                variant="ghost"
                @click="selectGroup(group.uuid)"
              >
                <template #leading>
                  <UIcon
                    :name="
                      group.uuid === selectedGroupUuid
                        ? 'i-heroicons-check'
                        : 'i-heroicons-user-group'
                    "
                    :class="appConfig.ui.wideDropdownMenu.slots.itemLeadingIcon"
                  />
                </template>
                {{ group.name }}
              </BaseButton>
            </div>
          </template>
        </UPopover>
        <p :class="appConfig.typography.pageSubtitle" class="mt-0">
          {{ UI_TEXT.media.groupPhotos }}
        </p>
      </div>

      <div :class="appConfig.layout.actionGroup" class="flex-1 justify-end">
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
    </div>

    <!-- MEDIA SECTION -->
    <div :class="[appConfig.layout.sectionWrapper, 'mt-8!']">
      <div :class="`flex items-center justify-between w-full ${SPACING_TOKENS.mb.lg} relative`">
        <div :class="`flex items-center ${SPACING_TOKENS.gap.sm} flex-1 justify-start`"></div>
        <div :class="appConfig.typography.pageTitle" class="text-2xl font-bold">
          {{ UI_TEXT.media.groupPhotos }}
        </div>
        <div :class="`flex items-center ${SPACING_TOKENS.gap.sm} flex-1 justify-end shrink-0`">
          <BaseButton
            icon="i-heroicons-plus"
            variant="glassIconButtonHighlight"
            :tooltip="UI_TEXT.media.uploadHeading"
            :disabled="!selectedGroupUuid"
            @click="mediaStore.openUploadModal(selectedGroupUuid!)"
          />
        </div>
      </div>

      <!-- Media Grid Component -->
      <MediaGrid :media-list="mediaItems" :is-loading="isLoadingMedia" />
    </div>

    <!-- Modals -->
    <GroupMediaModals />
    <MediaLightboxModal />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppConfig } from '#imports';
import { useMediaModalsStore } from '~/stores/media.modals.store';
import { useGroupsQuery } from '~/queries/groups.query';
import { useGroupFilesQuery } from '~/queries/files.query';
import MediaGrid from '~/components/media/views/MediaGrid.vue';
import GroupMediaModals from '~/components/media/modals/GroupMediaModals.vue';
import MediaLightboxModal from '~/components/media/modals/MediaLightBoxModal.vue';

const appConfig = useAppConfig();
const mediaStore = useMediaModalsStore();
const route = useRoute();
const router = useRouter();

const isGroupDropdownOpen = ref(false);
const selectedGroupUuid = computed(() => (route.query.groupId as string) || undefined);

// Groups data
const { data: groupsData, isLoading: isLoadingGroups } = useGroupsQuery();
const userGroupsList = computed(() => groupsData.value?.items || []);
const currentGroupDetails = computed(() =>
  userGroupsList.value.find((g) => g.uuid === selectedGroupUuid.value),
);

// Auto-select the first available group if none is present in query parameters
watch(
  userGroupsList,
  (groups) => {
    if (!selectedGroupUuid.value && groups.length > 0 && groups[0]?.uuid) {
      router.replace({ query: { ...route.query, groupId: groups[0].uuid } });
    }
  },
  { immediate: true },
);

const selectGroup = (uuid: string) => {
  isGroupDropdownOpen.value = false;
  router.push({ query: { ...route.query, groupId: uuid } });
};

// Navigation routes
const membersRoute = computed(() =>
  selectedGroupUuid.value ? `/groups/${selectedGroupUuid.value}/members` : '/groups',
);
const eventsRoute = computed(() =>
  selectedGroupUuid.value ? `/events?groupId=${selectedGroupUuid.value}` : '/events',
);
const mediaRoute = computed(() =>
  selectedGroupUuid.value ? `/files/media?groupId=${selectedGroupUuid.value}` : '/files/media',
);
const documentsRoute = computed(() =>
  selectedGroupUuid.value
    ? `/files/documents?groupId=${selectedGroupUuid.value}`
    : '/files/documents',
);

// Fetch media files from backend API
const { data: groupMediaData, isLoading: isLoadingMedia } = useGroupFilesQuery(
  () => selectedGroupUuid.value || '',
  () => 50,
  () => undefined,
  () => 'media',
);

const mediaItems = computed(() => groupMediaData.value?.items || []);
</script>
