<!-- frontend/app/components/media/views/MediaMobile.vue -->
<template>
  <div :class="appConfig.layout.mobilePageWrapper">
    <!-- TOP NAV BUTTONS -->
    <div :class="appConfig.calendar.mobileTopActions">
      <BaseButton
        icon="i-heroicons-users"
        variant="glassIconButton"
        :to="membersRoute"
        :tooltip="UI_TEXT.common.members"
      />
      <BaseButton
        icon="i-heroicons-calendar"
        variant="glassIconButton"
        :to="eventsRoute"
        :tooltip="UI_TEXT.common.calendar"
      />
      <BaseButton
        icon="i-heroicons-photo"
        variant="glassIconButtonBrand"
        :to="mediaRoute"
        :tooltip="UI_TEXT.common.photos"
      />
      <BaseButton
        icon="i-heroicons-document-text"
        variant="glassIconButton"
        :to="documentsRoute"
        :tooltip="UI_TEXT.common.documents"
      />
    </div>

    <div :class="appConfig.calendar.mobileMainWrapper">
      <!-- GROUP DROPDOWN HEADER -->
      <div :class="[appConfig.calendar.mobileHeader, SPACING_TOKENS.mb.md]">
        <UPopover
          v-model:open="isGroupDropdownOpen"
          :class="CARD_CONFIG.slots.root"
          :popper="{ strategy: 'fixed' }"
        >
          <BaseButton block variant="ghost" :class="appConfig.calendar.mobileHeaderButton">
            <div :class="appConfig.calendar.mobileHeaderTitleRow">
              <h1 :class="[appConfig.typography.sectionTitleTransparent, 'truncate']">
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
                  SELECT_CONFIG.slots.trailingIcon,
                  'static pointer-events-auto',
                  isGroupDropdownOpen ? 'rotate-180' : '',
                ]"
              />
            </div>
            <p :class="appConfig.typography.pageSubtitle">
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
      <div :class="appConfig.calendar.mobileToolbar">
        <BaseSearchInput v-model="searchQuery" :placeholder="UI_TEXT.media.search" />
        <BaseButton
          icon="i-heroicons-plus"
          variant="glassIconButton"
          :tooltip="UI_TEXT.media.uploadPhoto"
          @click="emit('upload')"
        />
      </div>

      <!-- MEDIA LIST -->
      <div :class="[SPACING_TOKENS.px.sm, SPACING_TOKENS.pt.sm]">
        <div v-if="isLoading" :class="appConfig.typography.statusLoading">
          {{ ' ' + UI_TEXT.media.loading + ' ' }}
        </div>

        <div v-else-if="filteredMedia.length > 0" :class="appConfig.layout.documentGrid">
          <BaseCard
            v-for="mediaItem in filteredMedia"
            :key="mediaItem.file_id"
            variant="documentGlass"
            :class="appConfig.layout.headerRelative"
          >
            <!-- Title + delete -->
            <div :class="appConfig.layout.documentCardHeader">
              <p :class="[FONT_WEIGHTS.bold, TEXT_SIZES.sm, SPACING_TOKENS.pr.sm, 'truncate']">
                {{ mediaItem.file_name }}
              </p>
              <div :class="appConfig.calendar.headerTitleRow">
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
            <div :class="appConfig.layout.documentCardImage">
              <img
                v-if="isImage(mediaItem.mime_type)"
                :src="mediaItem.download_url || mediaItem.file_url"
                :alt="mediaItem.file_name"
                :class="appConfig.layout.mediaCoverImage"
              />
              <div v-else :class="appConfig.layout.cardContentCenter">
                <UIcon
                  name="i-heroicons-film"
                  :class="[SIZE_TOKENS.avatar.lg, COLOR_TOKENS.text.primaryFaint]"
                />
                <span :class="[TEXT_SIZES.xs, COLOR_TOKENS.text.muted]">{{
                  mediaItem.mime_type
                }}</span>
              </div>

              <div :class="appConfig.layout.documentCardBottomActions">
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
            <div :class="appConfig.layout.documentCardMeta">
              <p>
                {{ ' ' + UI_TEXT.common.uploadedBy + ' '
                }}<span :class="[FONT_WEIGHTS.bold, COLOR_TOKENS.text.primary]">{{
                  mediaItem.creator?.username || UI_TEXT.common.unknown
                }}</span>
              </p>
              <p>
                {{ ' ' + UI_TEXT.common.uploadedAt + ' '
                }}<span :class="[FONT_WEIGHTS.bold, COLOR_TOKENS.text.primary]">{{
                  new Date(mediaItem.created_at).toLocaleDateString()
                }}</span>
              </p>
              <div v-if="mediaItem.media_files?.description">
                <div :class="appConfig.layout.divider"></div>
                <p>
                  {{ ' ' + UI_TEXT.events.descriptionLabel + ' '
                  }}<span :class="[FONT_WEIGHTS.bold, COLOR_TOKENS.text.primary]">{{
                    mediaItem.media_files.description
                  }}</span>
                </p>
              </div>
              <div :class="appConfig.layout.divider"></div>
              <div :class="appConfig.layout.flexBetween">
                <p>
                  {{ ' ' + UI_TEXT.media.type + ' '
                  }}<span :class="[FONT_WEIGHTS.bold, COLOR_TOKENS.text.primary]">{{
                    mediaItem.mime_type?.split('/')[1] || UI_TEXT.common.unknown
                  }}</span>
                </p>
                <p>
                  {{ ' ' + UI_TEXT.media.size + ' '
                  }}<span :class="[FONT_WEIGHTS.bold, COLOR_TOKENS.text.primary]"
                    >{{ (mediaItem.file_size / (1024 * 1024)).toFixed(2)
                    }}{{ ' ' + UI_TEXT.common.megabytes }}</span
                  >
                </p>
              </div>
            </div>
          </BaseCard>
        </div>

        <div v-else :class="appConfig.typography.statusLoading">
          {{ searchQuery ? UI_TEXT.media.noMatchingPhotos : UI_TEXT.media.noPhotos }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAppConfig } from '#imports';
import type { GroupFile } from '~/types/files.type';
import type { GroupOutDto } from '~/types/groups.type';

const appConfig = useAppConfig();

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

const isImage = (mimeType: string) => mimeType?.startsWith('image/');

const filteredMedia = computed<GroupFile[]>(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return props.media;
  return props.media.filter((m) => m.file_name.toLowerCase().includes(q));
});
</script>
