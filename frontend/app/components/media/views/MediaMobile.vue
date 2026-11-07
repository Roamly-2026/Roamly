<!-- frontend/app/components/media/views/MediaMobile.vue -->
<template>
  <div :class="`flex flex-col flex-1 ${SPACING_TOKENS.gap.md} w-full ${SPACING_TOKENS.p.md} pb-20`">
    <!-- TOP NAV BUTTONS -->
    <div :class="appConfig.calendar.mobileTopActions">
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

    <div :class="appConfig.calendar.mobileMainWrapper">
      <!-- GROUP DROPDOWN HEADER -->
      <div :class="[appConfig.calendar.mobileHeader, SPACING_TOKENS.mb.md]">
        <UPopover v-model:open="isGroupDropdownOpen" class="w-full" :popper="{ strategy: 'fixed' }">
          <BaseButton block variant="ghost" :class="appConfig.calendar.mobileHeaderButton">
            <div :class="appConfig.calendar.mobileHeaderTitleRow">
              <h1 :class="appConfig.typography.pageTitle" class="text-2xl! truncate">
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
            </div>
            <p :class="appConfig.typography.pageSubtitle" class="mt-0">
              {{ UI_TEXT.media.groupPhotos }}
            </p>
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
      </div>

      <!-- SECTION HEADER + UPLOAD ACTION -->
      <div
        :class="`flex items-center justify-between w-full ${SPACING_TOKENS.px.sm} ${SPACING_TOKENS.mb.md}`"
      >
        <div :class="appConfig.typography.pageTitle" class="text-xl font-bold">
          {{ UI_TEXT.media.groupPhotos }}
        </div>
        <BaseButton
          icon="i-heroicons-plus"
          variant="glassIconButtonHighlight"
          :tooltip="UI_TEXT.media.uploadHeading"
          :disabled="!selectedGroupUuid"
          @click="mediaStore.openUploadModal(selectedGroupUuid!)"
        />
      </div>

      <!-- MEDIA GRID -->
      <div :class="`${SPACING_TOKENS.px.sm} ${SPACING_TOKENS.pt.xs}`">
        <MediaGrid :media-list="mediaItems" :is-loading="isLoadingMedia" />
      </div>
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

// Contextual nav routes
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
