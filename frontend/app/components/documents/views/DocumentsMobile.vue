<!-- frontend/app/components/documents/views/DocumentsMobile.vue -->
<template>
  <div :class="`flex flex-col flex-1 ${SPACING_TOKENS.gap.md} w-full ${SPACING_TOKENS.p.md} pb-20`">
    <div :class="appConfig.calendar.mobileTopActions">
      <UTooltip :text="UI_TEXT.common.members">
        <UButton icon="i-heroicons-users" variant="glassIconButton" :to="membersRoute" />
      </UTooltip>
      <UTooltip :text="UI_TEXT.common.calendar">
        <UButton icon="i-heroicons-calendar" variant="glassIconButton" :to="eventsRoute" />
      </UTooltip>
      <UTooltip :text="UI_TEXT.common.photos">
        <UButton icon="i-heroicons-photo" variant="glassIconButton" :to="mediaRoute" />
      </UTooltip>
      <UTooltip :text="UI_TEXT.common.documents">
        <UButton
          icon="i-heroicons-document-text"
          variant="glassIconButton"
          class="text-brand-500"
          :to="documentsRoute"
        />
      </UTooltip>
    </div>

    <div :class="appConfig.calendar.mobileMainWrapper">
      <div :class="[appConfig.calendar.mobileHeader, SPACING_TOKENS.mb.xl]">
        <UPopover v-model:open="isGroupDropdownOpen" class="w-full" :popper="{ strategy: 'fixed' }">
          <UButton block variant="ghost" :class="appConfig.calendar.mobileHeaderButton">
            <div :class="appConfig.calendar.mobileHeaderTitleRow">
              <h1 :class="appConfig.typography.pageTitle" class="text-2xl! truncate">
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
            </div>
            <p :class="appConfig.typography.pageSubtitle" class="mt-0">
              {{ UI_TEXT.documents.groupDocuments }}
            </p>
          </UButton>
          <template #content>
            <div
              :class="[
                appConfig.ui.wideDropdownMenu.slots.content,
                'max-h-[50vh] overflow-y-auto custom-scrollbar',
              ]"
            >
              <button
                v-for="group in groups"
                :key="group.uuid"
                :class="appConfig.ui.wideDropdownMenu.slots.item"
                @click="selectGroup(group.uuid)"
              >
                <UIcon
                  :name="
                    group.uuid === selectedGroup ? 'i-heroicons-check' : 'i-heroicons-user-group'
                  "
                  :class="appConfig.ui.wideDropdownMenu.slots.itemLeadingIcon"
                />
                <span>{{ group.name }}</span>
              </button>
            </div>
          </template>
        </UPopover>
      </div>

      <!-- ====================== -->
      <!-- GROUP DOCUMENTS SECTION -->
      <!-- ====================== -->

      <div :class="appConfig.typography.pageTitle" class="text-2xl font-bold">
        {{ UI_TEXT.documents.groupDocumentsHeading }}
      </div>

      <div :class="appConfig.calendar.mobileToolbar">
        <UTooltip :text="UI_TEXT.common.filter">
          <UPopover>
            <UButton icon="i-heroicons-funnel" variant="glassIconButton" />
            <template #content="{ close }">
              <div :class="[appConfig.ui.dropdownMenu.slots.content, 'w-fit']">
                <button
                  v-for="type in documentTypes"
                  :key="type.value"
                  :class="appConfig.ui.dropdownMenu.slots.item"
                  @click="
                    filterType = type.value;
                    close();
                  "
                >
                  <UIcon
                    :name="filterType === type.value ? 'i-heroicons-check' : 'i-heroicons-funnel'"
                    :class="appConfig.ui.dropdownMenu.slots.itemLeadingIcon"
                  />
                  <span>{{ type.label }}</span>
                </button>
              </div>
            </template>
          </UPopover>
        </UTooltip>

        <UInput
          v-model="searchQuery"
          :placeholder="UI_TEXT.documents.search"
          icon="i-heroicons-magnifying-glass"
          class="flex-1"
          :ui="{ leading: 'pl-3' }"
          variant="search"
        />

        <UTooltip v-if="isCurrentUserLeader" :text="UI_TEXT.documents.uploadTitle">
          <UButton icon="i-heroicons-plus" variant="glassIconButton" @click="emit('upload')" />
        </UTooltip>
      </div>

      <div :class="`${SPACING_TOKENS.px.sm} ${SPACING_TOKENS.pt.sm} ${SPACING_TOKENS.mb.xl}`">
        <div
          v-if="isLoading"
          :class="[appConfig.typography.statusLoading, SPACING_TOKENS.py.md, 'text-center']"
        >
          {{ ' ' + UI_TEXT.documents.loading + ' ' }}
        </div>

        <div
          v-else-if="documents.length > 0"
          :class="`flex flex-col ${SPACING_TOKENS.gap.md} w-full`"
        >
          <UCard
            v-for="doc in documents"
            :key="doc.file_id"
            variant="documentGlass"
            class="relative w-full"
          >
            <div :class="appConfig.layout.documentCardHeader">
              <p class="font-bold truncate pr-2 shadow-sm text-sm">{{ doc.file_name }}</p>
              <div :class="`flex items-center ${SPACING_TOKENS.gap.xs} shrink-0`">
                <UTooltip v-if="isCurrentUserLeader" :text="UI_TEXT.common.delete">
                  <UButton
                    icon="i-heroicons-trash"
                    variant="ghostDangerIconButton"
                    class="text-surface-500 hover:text-error-500 w-6! h-6! p-0"
                    @click="emit('delete', doc)"
                  />
                </UTooltip>
              </div>
            </div>

            <div :class="appConfig.layout.documentCardImage" class="h-40!">
              <UIcon name="i-heroicons-document" class="w-12 h-12 text-surface-500/50" />
              <div :class="`absolute bottom-2 ${SPACING_TOKENS.px.md} w-full flex justify-between`">
                <UTooltip :text="UI_TEXT.common.view">
                  <UButton
                    icon="i-heroicons-eye"
                    variant="ghostDangerIconButton"
                    class="text-surface-500"
                    :href="doc.download_url"
                    target="_blank"
                  />
                </UTooltip>
                <UTooltip :text="UI_TEXT.common.download">
                  <UButton
                    icon="i-heroicons-arrow-down-tray"
                    variant="ghostDangerIconButton"
                    class="text-surface-500"
                    @click.prevent="emit('download', doc.download_url, doc.file_name)"
                  />
                </UTooltip>
              </div>
            </div>

            <div :class="appConfig.layout.documentCardMeta">
              <p>
                {{ ' ' + UI_TEXT.common.uploadedBy + ' '
                }}<span class="font-bold text-dark-text">{{
                  doc.creator?.username || UI_TEXT.common.unknown
                }}</span>
              </p>
              <p>
                {{ ' ' + UI_TEXT.common.uploadedAt + ' '
                }}<span class="font-bold text-dark-text">{{
                  new Date(doc.created_at).toLocaleDateString()
                }}</span>
              </p>
              <p>
                {{ ' ' + UI_TEXT.documents.documentType + ' '
                }}<span class="font-bold text-dark-text">{{
                  doc.documents?.document_type.toLocaleLowerCase() || UI_TEXT.common.notAvailable
                }}</span>
              </p>
              <div :class="appConfig.layout.divider"></div>
              <div :class="appConfig.layout.flexBetween">
                <p>
                  {{ ' ' + UI_TEXT.documents.fileType + ' '
                  }}<span class="font-bold text-dark-text">{{
                    doc.mime_type.split('/')[1] || UI_TEXT.common.unknown
                  }}</span>
                </p>
                <p>
                  {{ ' ' + UI_TEXT.documents.fileSize + ' '
                  }}<span class="font-bold text-dark-text"
                    >{{ (doc.file_size / (1024 * 1024)).toFixed(2)
                    }}{{ ' ' + UI_TEXT.common.megabytes }}</span
                  >
                </p>
              </div>
              <div :class="appConfig.layout.divider"></div>
              <p>
                {{ ' ' + UI_TEXT.documents.issued + ' '
                }}<span class="font-bold text-dark-text">{{
                  doc.documents?.issue_date
                    ? new Date(doc.documents.issue_date).toLocaleDateString()
                    : UI_TEXT.common.notAvailable
                }}</span>
              </p>
              <p>
                {{ ' ' + UI_TEXT.documents.ends + ' '
                }}<span class="font-bold text-dark-text">{{
                  doc.documents?.expiry_date
                    ? new Date(doc.documents.expiry_date).toLocaleDateString()
                    : UI_TEXT.common.notAvailable
                }}</span>
              </p>
            </div>
          </UCard>
        </div>

        <div
          v-else
          :class="[appConfig.typography.statusLoading, SPACING_TOKENS.py.md, 'text-center']"
        >
          {{
            searchQuery || filterType !== 'ALL'
              ? UI_TEXT.documents.noMatchingDocuments
              : UI_TEXT.documents.noDocuments
          }}
        </div>
      </div>
    </div>

    <!-- ========================= -->
    <!-- MEMBER DOCUMENTS (leader) -->
    <!-- ========================= -->
    <template v-if="isCurrentUserLeader">
      <div :class="appConfig.typography.pageTitle" class="text-2xl font-bold">
        {{ UI_TEXT.documents.memberDocumentsHeading }}
      </div>

      <div :class="appConfig.calendar.mobileToolbar">
        <UTooltip :text="UI_TEXT.common.filter">
          <UPopover>
            <UButton icon="i-heroicons-funnel" variant="glassIconButton" />
            <template #content="{ close }">
              <div :class="[appConfig.ui.dropdownMenu.slots.content, 'w-fit']">
                <button
                  v-for="type in privateDocumentTypes"
                  :key="type.value"
                  :class="appConfig.ui.dropdownMenu.slots.item"
                  @click="
                    memberFilterType = type.value;
                    close();
                  "
                >
                  <UIcon
                    :name="
                      memberFilterType === type.value ? 'i-heroicons-check' : 'i-heroicons-funnel'
                    "
                    :class="appConfig.ui.dropdownMenu.slots.itemLeadingIcon"
                  />
                  <span>{{ type.label }}</span>
                </button>
              </div>
            </template>
          </UPopover>
        </UTooltip>

        <UInput
          v-model="memberSearchQuery"
          :placeholder="UI_TEXT.documents.searchPrivate"
          icon="i-heroicons-magnifying-glass"
          class="flex-1"
          :ui="{ leading: 'pl-3' }"
          variant="search"
        />
      </div>

      <!-- Loading -->
      <div
        v-if="isLoadingMemberDocuments"
        :class="[appConfig.typography.statusLoading, SPACING_TOKENS.py.md, 'text-center']"
      >
        {{ ' ' + UI_TEXT.documents.loadingMemberDocuments + ' ' }}
      </div>

      <div
        v-else
        :class="`${SPACING_TOKENS.px.sm} ${SPACING_TOKENS.pt.md} flex flex-col ${SPACING_TOKENS.gap.lg} w-full`"
      >
        <div
          v-for="type in privateDocumentTypes.filter(
            (t) =>
              t.value !== 'ALL' && (memberFilterType === 'ALL' || memberFilterType === t.value),
          )"
          :key="type.value"
          :class="`flex flex-col ${SPACING_TOKENS.gap.sm} w-full`"
        >
          <h2 :class="appConfig.typography.pageTitle" class="text-xl font-bold">
            {{ type.label }}
          </h2>

          <!-- Documents of this type -->
          <div
            v-if="filteredMemberDocuments(type.value).length > 0"
            :class="`flex flex-col ${SPACING_TOKENS.gap.md} w-full`"
          >
            <UCard
              v-for="doc in filteredMemberDocuments(type.value)"
              :key="doc.file_id"
              variant="documentGlass"
              class="relative w-full"
            >
              <div :class="appConfig.layout.documentCardHeader">
                <p class="font-bold truncate pr-2 shadow-sm text-sm">{{ doc.file_name }}</p>
              </div>

              <div :class="appConfig.layout.documentCardImage" class="h-32!">
                <UIcon name="i-heroicons-document-text" class="w-12 h-12 text-surface-500/50" />
                <div :class="`absolute bottom-2 ${SPACING_TOKENS.px.md} w-full flex justify-end`">
                  <UTooltip :text="UI_TEXT.common.view">
                    <UButton
                      icon="i-heroicons-eye"
                      variant="ghostDangerIconButton"
                      class="text-surface-500"
                      :href="doc.file_url"
                      target="_blank"
                    />
                  </UTooltip>
                </div>
              </div>

              <div :class="appConfig.layout.documentCardMeta">
                <p>
                  {{ ' ' + UI_TEXT.common.uploadedAt + ' '
                  }}<span class="font-bold text-dark-text">{{
                    new Date(doc.created_at).toLocaleDateString()
                  }}</span>
                </p>
                <p>
                  {{ ' ' + UI_TEXT.documents.documentType + ' '
                  }}<span class="font-bold text-dark-text">{{
                    doc.documents?.document_type ?? UI_TEXT.common.notAvailable
                  }}</span>
                </p>
                <div :class="appConfig.layout.divider"></div>
                <div :class="appConfig.layout.flexBetween">
                  <p>
                    {{ ' ' + UI_TEXT.documents.fileType + ' '
                    }}<span class="font-bold text-dark-text">{{
                      doc.mime_type.split('/')[1] || UI_TEXT.common.unknown
                    }}</span>
                  </p>
                  <p>
                    {{ ' ' + UI_TEXT.documents.fileSize + ' '
                    }}<span class="font-bold text-dark-text"
                      >{{ (doc.file_size / (1024 * 1024)).toFixed(2)
                      }}{{ ' ' + UI_TEXT.common.megabytes }}</span
                    >
                  </p>
                </div>
                <div :class="appConfig.layout.divider"></div>
                <p>
                  {{ ' ' + UI_TEXT.documents.issued + ' '
                  }}<span class="font-bold text-dark-text">{{
                    doc.documents?.issue_date
                      ? new Date(doc.documents.issue_date).toLocaleDateString()
                      : UI_TEXT.common.notAvailable
                  }}</span>
                </p>
                <p>
                  {{ ' ' + UI_TEXT.documents.ends + ' '
                  }}<span class="font-bold text-dark-text">{{
                    doc.documents?.expiry_date
                      ? new Date(doc.documents.expiry_date).toLocaleDateString()
                      : UI_TEXT.common.notAvailable
                  }}</span>
                </p>
              </div>
            </UCard>
          </div>

          <!-- Empty per-type state -->
          <UCard v-else variant="documentGlass" class="relative w-full">
            <div :class="`${SPACING_TOKENS.py.lg} text-center`">
              <UIcon
                name="i-heroicons-document-text"
                :class="`w-12 h-12 text-surface-500/40 mx-auto ${SPACING_TOKENS.mb.sm}`"
              />
              <p class="text-surface-400 italic text-sm">
                {{ ' ' + UI_TEXT.documents.no + ' ' }}{{ type.label.toLowerCase()
                }}{{ ' ' + UI_TEXT.documents.found + ' '
                }}<template v-if="memberSearchQuery"
                  >{{ ' ' + UI_TEXT.documents.matching }}{{ memberSearchQuery }}"</template
                >.
              </p>
            </div>
          </UCard>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAppConfig } from '#imports';
import type { GroupFile, PrivateDocumentMetadata } from '~/types/files.type';
import type { GroupOutDto } from '~/types/groups.type';

const appConfig = useAppConfig();

const selectedGroup = defineModel<string | undefined>('selectedGroup');
const searchQuery = defineModel<string>('searchQuery', { default: '' });
const filterType = defineModel<string>('filterType', { default: 'ALL' });
const memberSearchQuery = defineModel<string>('memberSearchQuery', { default: '' });
const memberFilterType = defineModel<string>('memberFilterType', { default: 'ALL' });

const props = defineProps<{
  documents: GroupFile[];
  memberDocuments: PrivateDocumentMetadata[];
  isLoadingMemberDocuments: boolean;
  groups: GroupOutDto[];
  isLoading: boolean;
  isCurrentUserLeader: boolean;
  documentTypes: { label: string; value: string }[];
  privateDocumentTypes: { label: string; value: string }[];
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

// Contextual navigation routes scoped to the currently active group
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

// Filters private member documents by specific category and case-insensitive filename search
const filteredMemberDocuments = (typeValue: string): PrivateDocumentMetadata[] => {
  const query = memberSearchQuery.value.toLowerCase().trim();
  return props.memberDocuments.filter((doc) => {
    const matchesType = doc.documents?.document_type === typeValue;
    const matchesSearch = !query || doc.file_name.toLowerCase().includes(query);
    return matchesType && matchesSearch;
  });
};
</script>
