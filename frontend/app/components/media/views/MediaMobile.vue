<!-- frontend/app/components/media/views/MediaMobile.vue -->
<template>
  <div :class="LAYOUT_CONFIG.mobilePageWrapper">
    <div :class="LAYOUT_CONFIG.mobileTopActions">
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

    <div :class="LAYOUT_CONFIG.mobileMainWrapper">
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
                :class="[TYPOGRAPHY_CONFIG.iconBrandMd, isGroupDropdownOpen ? 'rotate-180' : '']"
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

      <div :class="LAYOUT_CONFIG.mobileToolbar">
        <BaseSearchInput v-model="searchQuery" :placeholder="UI_TEXT.media.search" />
        <BaseButton
          icon="i-heroicons-plus"
          variant="glassIconButton"
          :tooltip="UI_TEXT.media.uploadPhoto"
          @click="emit('upload')"
        />
      </div>

      <div>
        <div v-if="isLoading" :class="TYPOGRAPHY_CONFIG.statusLoading">
          {{ ' ' + UI_TEXT.media.loading + ' ' }}
        </div>

        <div v-else-if="filteredMedia.length > 0" :class="LAYOUT_CONFIG.documentGrid">
          <BaseCard
            v-for="mediaItem in filteredMedia"
            :key="mediaItem.file_id"
            variant="documentGlass"
            :class="LAYOUT_CONFIG.headerRelative"
          >
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

            <div :class="LAYOUT_CONFIG.documentCardMeta">
              <p>
                {{ ' ' + UI_TEXT.common.uploadedBy + ' '
                }}<span :class="TYPOGRAPHY_CONFIG.metaHighlight">{{
                  mediaItem.creator?.username || UI_TEXT.common.unknown
                }}</span>
              </p>
              <p>
                {{ ' ' + UI_TEXT.common.uploadedAt + ' '
                }}<span :class="TYPOGRAPHY_CONFIG.metaHighlight">{{
                  new Date(mediaItem.created_at).toLocaleDateString()
                }}</span>
              </p>
              <div v-if="mediaItem.media_files?.description">
                <div :class="LAYOUT_CONFIG.divider"></div>
                <p>
                  {{ ' ' + UI_TEXT.events.descriptionLabel + ' '
                  }}<span :class="TYPOGRAPHY_CONFIG.metaHighlight">{{
                    mediaItem.media_files.description
                  }}</span>
                </p>
              </div>
              <div :class="LAYOUT_CONFIG.divider"></div>
              <div :class="LAYOUT_CONFIG.flexBetween">
                <p>
                  {{ ' ' + UI_TEXT.media.type + ' '
                  }}<span :class="TYPOGRAPHY_CONFIG.metaHighlight">{{
                    mediaItem.mime_type?.split('/')[1] || UI_TEXT.common.unknown
                  }}</span>
                </p>
                <p>
                  {{ ' ' + UI_TEXT.media.size + ' '
                  }}<span :class="TYPOGRAPHY_CONFIG.metaHighlight"
                    >{{ (mediaItem.file_size / (1024 * 1024)).toFixed(2)
                    }}{{ ' ' + UI_TEXT.common.megabytes }}</span
                  >
                </p>
              </div>
            </div>
          </BaseCard>
        </div>

        <div v-else :class="TYPOGRAPHY_CONFIG.statusLoading">
          {{ searchQuery ? UI_TEXT.media.noMatchingPhotos : UI_TEXT.media.noPhotos }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { GroupFile } from '~/types/files.type';
import type { GroupOutDto } from '~/types/groups.type';

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
