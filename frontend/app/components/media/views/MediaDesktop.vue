<!-- frontend/app/components/media/views/MediaDesktop.vue -->
<template>
  <div :class="appConfig.layout.pageWrapper">
    <!-- HEADER -->
    <div :class="appConfig.layout.pageHeader">
      <div :class="appConfig.layout.actionGroup" class="flex-1 justify-start">
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
                  isLoading
                    ? UI_TEXT.common.loading
                    : currentGroupDetails?.name || UI_TEXT.documents.selectGroup
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
                v-for="group in groups"
                :key="group.uuid"
                :class="appConfig.ui.wideDropdownMenu.slots.item"
                variant="ghost"
                @click="selectGroup(group.uuid)"
              >
                <template #leading>
                  <UIcon
                    :name="
                      group.uuid === selectedGroup ? 'i-heroicons-check' : 'i-heroicons-user-group'
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
          variant="glassIconButton"
          class="text-brand-500"
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
    </div>

    <!-- MEDIA SECTION -->
    <div :class="[appConfig.layout.sectionWrapper, 'mt-8!']">
      <div :class="`flex items-center justify-between w-full ${SPACING_TOKENS.mb.lg} relative`">
        <div :class="`flex items-center ${SPACING_TOKENS.gap.sm} flex-1 justify-start`">
          <BaseSearchInput
            v-model="searchQuery"
            :placeholder="UI_TEXT.media.search"
            class="w-1/3! max-w-none!"
          />
        </div>

        <div :class="appConfig.typography.pageTitle" class="text-2xl font-bold">
          {{ UI_TEXT.media.groupPhotos }}
        </div>

        <div :class="`flex items-center ${SPACING_TOKENS.gap.sm} flex-1 justify-end shrink-0`">
          <BaseButton
            icon="i-heroicons-plus"
            variant="glassIconButtonHighlight"
            :tooltip="UI_TEXT.media.uploadPhoto"
            @click="emit('upload')"
          />
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" :class="appConfig.typography.statusLoading">
        {{ UI_TEXT.media.loading }}
      </div>

      <!-- Media Grid -->
      <div v-else-if="filteredMedia.length > 0" :class="appConfig.layout.documentGrid">
        <BaseCard
          v-for="mediaItem in filteredMedia"
          :key="mediaItem.file_id"
          variant="documentGlass"
          class="relative"
        >
          <!-- Title + delete -->
          <div :class="appConfig.layout.documentCardHeader">
            <p class="font-bold truncate pr-2 shadow-sm text-sm">{{ mediaItem.file_name }}</p>
            <div :class="`flex items-center ${SPACING_TOKENS.gap.xs} shrink-0`">
              <BaseButton
                v-if="isCurrentUserLeader"
                icon="i-heroicons-trash"
                variant="ghostDangerIconButton"
                class="text-surface-500 hover:text-error-500"
                :tooltip="UI_TEXT.common.delete"
                @click="emit('delete', mediaItem)"
              />
            </div>
          </div>

          <!-- Image preview -->
          <div :class="appConfig.layout.documentCardImage" class="overflow-hidden">
            <img
              v-if="isImage(mediaItem.mime_type)"
              :src="mediaItem.download_url || mediaItem.file_url"
              :alt="mediaItem.file_name"
              class="w-full h-full object-cover"
            />
            <div
              v-else
              :class="`flex flex-col items-center justify-center ${SPACING_TOKENS.gap.sm}`"
            >
              <UIcon name="i-heroicons-film" class="w-16 h-16 text-surface-500/50" />
              <span class="text-xs text-surface-400">{{ mediaItem.mime_type }}</span>
            </div>

            <div :class="`absolute bottom-2 ${SPACING_TOKENS.px.md} w-full flex justify-between`">
              <BaseButton
                icon="i-heroicons-eye"
                variant="ghostDangerIconButton"
                class="text-surface-500"
                :href="mediaItem.download_url || mediaItem.file_url"
                target="_blank"
                :tooltip="UI_TEXT.common.view"
              />
              <BaseButton
                icon="i-heroicons-arrow-down-tray"
                variant="ghostDangerIconButton"
                class="text-surface-500 hover:text-brand-500"
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
              }}<span class="font-bold text-dark-text">{{
                mediaItem.creator?.username || UI_TEXT.common.unknown
              }}</span>
            </p>
            <p>
              {{ ' ' + UI_TEXT.common.uploadedAt + ' '
              }}<span class="font-bold text-dark-text">{{
                new Date(mediaItem.created_at).toLocaleDateString()
              }}</span>
            </p>
            <div v-if="mediaItem.media_files?.description">
              <div :class="appConfig.layout.divider"></div>
              <p>
                {{ ' ' + UI_TEXT.events.descriptionLabel + ' '
                }}<span class="font-bold text-dark-text">{{
                  mediaItem.media_files.description
                }}</span>
              </p>
            </div>
            <div :class="appConfig.layout.divider"></div>
            <div :class="appConfig.layout.flexBetween">
              <p>
                {{ ' ' + UI_TEXT.media.type + ' '
                }}<span class="font-bold text-dark-text">{{
                  mediaItem.mime_type?.split('/')[1] || UI_TEXT.common.unknown
                }}</span>
              </p>
              <p>
                {{ ' ' + UI_TEXT.media.size + ' '
                }}<span class="font-bold text-dark-text"
                  >{{ (mediaItem.file_size / (1024 * 1024)).toFixed(2)
                  }}{{ ' ' + UI_TEXT.common.megabytes }}</span
                >
              </p>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Empty state -->
      <div v-else :class="appConfig.typography.statusLoading">
        {{ searchQuery ? UI_TEXT.media.noMatchingPhotos : UI_TEXT.media.noPhotos }}
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

// Contextual nav routes — route to the currently selected group
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
