<!-- frontend/app/components/documents/views/DocumentsMobile.vue -->
<template>
  <div :class="LAYOUT_CONFIG.mobilePageWrapper">
    <!-- TOP NAV BUTTONS -->
    <div :class="LAYOUT_CONFIG.mobileTopActions">
      <NavigationMenu :group-uuid="selectedGroup" active-tab="documents" :is-mobile="true" />
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
              {{ UI_TEXT.documents.groupDocuments }}
            </p>
          </BaseButton>
          <template #content>
            <div :class="WIDE_DROPDOWN_MENU_CONFIG.slots.content">
              <button
                v-for="group in groups"
                :key="group.uuid"
                :class="WIDE_DROPDOWN_MENU_CONFIG.slots.item"
                @click="selectGroup(group.uuid)"
              >
                <UIcon
                  :name="
                    group.uuid === selectedGroup ? 'i-heroicons-check' : 'i-heroicons-user-group'
                  "
                  :class="WIDE_DROPDOWN_MENU_CONFIG.slots.itemLeadingIcon"
                />
                <span>{{ group.name }}</span>
              </button>
            </div>
          </template>
        </UPopover>
      </div>

      <!-- GROUP DOCUMENTS SECTION -->
      <div :class="TYPOGRAPHY_CONFIG.sectionTitleTransparent">
        {{ UI_TEXT.documents.groupDocumentsHeading }}
      </div>

      <div :class="LAYOUT_CONFIG.mobileToolbar">
        <BaseSearchInput v-model="searchQuery" :placeholder="UI_TEXT.documents.search" />

        <ViewSwitcher v-model="viewMode" />

        <BaseButton
          v-if="canUpload"
          icon="i-heroicons-plus"
          variant="glassIconButton"
          :tooltip="UI_TEXT.documents.uploadTitle"
          @click="emit('upload')"
        />
      </div>

      <!-- MULTI-TAG FILTER WITH AUTOCOMPLETE -->
      <div :class="[LAYOUT_CONFIG.fullWidth, SPACING_TOKENS.mb.md]">
        <TagFilterDropdown v-model="selectedTags" :available-tags="availableTags" />
      </div>

      <div>
        <div v-if="isLoading" :class="TYPOGRAPHY_CONFIG.statusLoading">
          {{ ' ' + UI_TEXT.documents.loading + ' ' }}
        </div>

        <template v-else-if="documents.length > 0">
          <div
            v-for="section in documentSections"
            :key="section.key"
            :class="[LAYOUT_CONFIG.sectionWrapper, SPACING_TOKENS.mb.xl]"
          >
            <h2 :class="TYPOGRAPHY_CONFIG.sectionTitleTransparent">
              {{ section.label }}
            </h2>

            <!-- LIST VIEW -->
            <FilesListView
              v-if="viewMode === 'list'"
              :files="section.items"
              :can-manage-file="canManageFile"
              can-edit
              @open="openInNewTab"
              @edit="emit('edit', $event as GroupFile)"
              @delete="emit('delete', $event as GroupFile)"
              @download="(url, filename) => emit('download', url, filename)"
            />

            <!-- GRID VIEW -->
            <div v-else :class="`flex flex-col ${SPACING_TOKENS.gap.md} w-full`">
              <BaseCard
                v-for="doc in section.items"
                :key="`${section.key}-${doc.file_id}`"
                variant="documentGlass"
                class="relative w-full"
              >
                <div :class="LAYOUT_CONFIG.documentCardHeader">
                  <p :class="TYPOGRAPHY_CONFIG.documentHeaderTitle">{{ doc.file_name }}</p>
                  <div :class="LAYOUT_CONFIG.headerTitleRow">
                    <BaseButton
                      v-if="canManageFile(doc)"
                      icon="i-heroicons-pencil-square"
                      variant="ghostInverseIconButton"
                      class="w-6! h-6! p-0"
                      :tooltip="UI_TEXT.common.edit || 'Edit'"
                      @click="emit('edit', doc)"
                    />
                    <BaseButton
                      v-if="canManageFile(doc)"
                      icon="i-heroicons-trash"
                      variant="ghostDangerIconButton"
                      class="text-surface-500 hover:text-error-500 w-6! h-6! p-0"
                      :tooltip="UI_TEXT.common.delete"
                      @click="emit('delete', doc)"
                    />
                  </div>
                </div>

                <div :class="LAYOUT_CONFIG.documentCardImage" class="h-40!">
                  <UIcon
                    :name="getFileIcon(doc.mime_type, doc.file_name)"
                    class="w-12 h-12 text-surface-500/50"
                  />
                  <div
                    :class="`absolute bottom-2 ${SPACING_TOKENS.px.md} w-full flex justify-between`"
                  >
                    <BaseButton
                      icon="i-heroicons-eye"
                      variant="ghostDangerIconButton"
                      class="text-surface-500"
                      :href="doc.download_url || doc.file_url"
                      :tooltip="UI_TEXT.common.view"
                      target="_blank"
                    />
                    <BaseButton
                      icon="i-heroicons-arrow-down-tray"
                      variant="ghostBrandIconButton"
                      :class="COLOR_TOKENS.text.primaryMuted"
                      :tooltip="UI_TEXT.common.download"
                      @click.prevent="
                        emit('download', doc.download_url || doc.file_url, doc.file_name)
                      "
                    />
                  </div>
                </div>

                <div :class="LAYOUT_CONFIG.documentCardMeta">
                  <div :class="['flex items-center', SPACING_TOKENS.mb.xs, SPACING_TOKENS.gap.xs]">
                    <UAvatar
                      :src="doc.creator?.profile_image_url || undefined"
                      :alt="doc.creator?.username"
                      class="w-6! h-6! text-[10px] shrink-0 rounded-full object-cover"
                    />
                    <span :class="TYPOGRAPHY_CONFIG.metaHighlight">
                      {{ doc.creator?.username || UI_TEXT.common.unknown }}
                    </span>
                  </div>

                  <p>
                    {{ ' ' + UI_TEXT.common.uploadedAt + ' ' }}
                    <span :class="TYPOGRAPHY_CONFIG.metaHighlight">
                      {{ new Date(doc.created_at).toLocaleDateString() }}
                    </span>
                  </p>

                  <!-- Tags row -->
                  <div
                    v-if="doc.tags && doc.tags.length > 0"
                    :class="`flex flex-wrap ${SPACING_TOKENS.gap.xs} ${SPACING_TOKENS.my.xs}`"
                  >
                    <button
                      v-for="tag in doc.tags"
                      :key="tag"
                      type="button"
                      :class="[
                        `${TEXT_SIZES.xs} ${FONT_WEIGHTS.semibold} ${SPACING_TOKENS.px.sm} ${SPACING_TOKENS.py['2xs']} ${RADIUS_TOKENS.full} ${INTERACTION_TOKENS.base}`,
                        selectedTags.some((t) => t.toLowerCase() === tag.toLowerCase())
                          ? 'bg-btn-primary text-btn-primary-text'
                          : `${COLOR_TOKENS.surface.brandTint} ${COLOR_TOKENS.text.brandHover}`,
                      ]"
                      @click="toggleTagFilter(tag)"
                    >
                      #{{ tag }}
                    </button>
                  </div>

                  <div :class="LAYOUT_CONFIG.divider"></div>
                  <div :class="LAYOUT_CONFIG.flexBetween">
                    <p>
                      {{ ' ' + UI_TEXT.documents.fileType + ' ' }}
                      <span :class="TYPOGRAPHY_CONFIG.metaHighlight">
                        {{
                          getFileExtension(doc.file_name) ||
                          doc.mime_type.split('/')[1] ||
                          UI_TEXT.common.unknown
                        }}
                      </span>
                    </p>
                    <p>
                      {{ ' ' + UI_TEXT.documents.fileSize + ' ' }}
                      <span :class="TYPOGRAPHY_CONFIG.metaHighlight">
                        {{ formatFileSize(doc.file_size) }}
                      </span>
                    </p>
                  </div>
                  <div :class="LAYOUT_CONFIG.divider"></div>
                  <p>
                    {{ ' ' + UI_TEXT.documents.issued + ' ' }}
                    <span :class="TYPOGRAPHY_CONFIG.metaHighlight">
                      {{
                        doc.documents?.issue_date
                          ? new Date(doc.documents.issue_date).toLocaleDateString()
                          : UI_TEXT.common.notAvailable
                      }}
                    </span>
                  </p>
                  <p>
                    {{ ' ' + UI_TEXT.documents.ends + ' ' }}
                    <span :class="TYPOGRAPHY_CONFIG.metaHighlight">
                      {{
                        doc.documents?.expiry_date
                          ? new Date(doc.documents.expiry_date).toLocaleDateString()
                          : UI_TEXT.common.notAvailable
                      }}
                    </span>
                  </p>
                </div>
              </BaseCard>
            </div>
          </div>
        </template>

        <div v-else :class="TYPOGRAPHY_CONFIG.statusLoading">
          {{
            searchQuery || selectedTags.length > 0
              ? UI_TEXT.documents.noMatchingDocuments
              : UI_TEXT.documents.noDocuments
          }}
        </div>
      </div>
    </div>

    <!-- MEMBER DOCUMENTS -->
    <template v-if="canReadMemberDocuments">
      <div
        :class="[
          TYPOGRAPHY_CONFIG.sectionTitleTransparent,
          'border-t border-dark-text/10',
          `${SPACING_TOKENS.pt.xl}!`,
          `${SPACING_TOKENS.mt.xl}!`,
        ]"
      >
        {{ UI_TEXT.documents.memberDocumentsHeading }}
      </div>

      <div :class="LAYOUT_CONFIG.mobileToolbar">
        <UPopover>
          <BaseButton
            icon="i-heroicons-funnel"
            variant="glassIconButton"
            :tooltip="UI_TEXT.common.filter"
          />
          <template #content="{ close }">
            <div :class="DROPDOWN_MENU_CONFIG.slots.content">
              <button
                v-for="type in privateDocumentTypes"
                :key="type.value"
                :class="DROPDOWN_MENU_CONFIG.slots.item"
                @click="
                  memberFilterType = type.value;
                  close();
                "
              >
                <UIcon
                  :name="
                    memberFilterType === type.value ? 'i-heroicons-check' : 'i-heroicons-funnel'
                  "
                  :class="DROPDOWN_MENU_CONFIG.slots.itemLeadingIcon"
                />
                <span>{{ type.label }}</span>
              </button>
            </div>
          </template>
        </UPopover>

        <BaseSearchInput
          v-model="memberSearchQuery"
          :placeholder="UI_TEXT.documents.searchPrivate"
        />

        <ViewSwitcher v-model="viewMode" />
      </div>

      <div v-if="isLoadingMemberDocuments" :class="TYPOGRAPHY_CONFIG.statusLoading">
        {{ ' ' + UI_TEXT.documents.loadingMemberDocuments + ' ' }}
      </div>

      <div v-else :class="LAYOUT_CONFIG.sectionWrapper">
        <div
          v-for="type in privateDocumentTypes.filter(
            (t) =>
              t.value !== 'ALL' && (memberFilterType === 'ALL' || memberFilterType === t.value),
          )"
          :key="type.value"
          :class="LAYOUT_CONFIG.cardContent"
        >
          <h2 :class="TYPOGRAPHY_CONFIG.sectionTitleTransparent">
            {{ type.label }}
          </h2>

          <!-- Documents of this type -->
          <div v-if="filteredMemberDocuments(type.value).length > 0">
            <!-- LIST VIEW -->
            <FilesListView
              v-if="viewMode === 'list'"
              :files="filteredMemberDocuments(type.value)"
              @open="openInNewTab"
              @download="(url, filename) => emit('download', url, filename)"
            />

            <!-- GRID VIEW -->
            <div v-else :class="`flex flex-col ${SPACING_TOKENS.gap.md} w-full`">
              <BaseCard
                v-for="doc in filteredMemberDocuments(type.value)"
                :key="doc.file_id"
                variant="documentGlass"
                class="relative w-full"
              >
                <div :class="LAYOUT_CONFIG.documentCardHeader">
                  <p :class="TYPOGRAPHY_CONFIG.documentHeaderTitle">{{ doc.file_name }}</p>
                </div>

                <div :class="LAYOUT_CONFIG.documentCardImage" class="h-32!">
                  <UIcon name="i-heroicons-document-text" class="w-12 h-12 text-surface-500/50" />
                  <div :class="`absolute bottom-2 ${SPACING_TOKENS.px.md} w-full flex justify-end`">
                    <BaseButton
                      icon="i-heroicons-eye"
                      variant="ghostDangerIconButton"
                      class="text-surface-500"
                      :href="doc.file_url"
                      :tooltip="UI_TEXT.common.view"
                      target="_blank"
                    />
                    <BaseButton
                      icon="i-heroicons-arrow-down-tray"
                      variant="ghostBrandIconButton"
                      :class="COLOR_TOKENS.text.primaryMuted"
                      :tooltip="UI_TEXT.common.download"
                      @click.prevent="emit('download', doc.file_url, doc.file_name)"
                    />
                  </div>
                </div>

                <div :class="LAYOUT_CONFIG.documentCardMeta">
                  <div :class="['flex items-center', SPACING_TOKENS.mb.xs, SPACING_TOKENS.gap.xs]">
                    <UAvatar
                      :src="getMemberDocUser(doc)?.profile_image_url || undefined"
                      :alt="getMemberDocUser(doc)?.username"
                      class="w-6! h-6! text-[10px] shrink-0 rounded-full object-cover"
                    />
                    <span :class="TYPOGRAPHY_CONFIG.metaHighlight">
                      {{ getMemberDocUser(doc)?.username || UI_TEXT.common.unknown }}
                    </span>
                  </div>

                  <p>
                    {{ ' ' + UI_TEXT.common.uploadedAt + ' ' }}
                    <span :class="TYPOGRAPHY_CONFIG.metaHighlight">
                      {{ new Date(doc.created_at).toLocaleDateString() }}
                    </span>
                  </p>
                  <p>
                    {{ ' ' + UI_TEXT.documents.documentType + ' ' }}
                    <span :class="TYPOGRAPHY_CONFIG.metaHighlight">
                      {{ doc.documents?.document_type ?? UI_TEXT.common.notAvailable }}
                    </span>
                  </p>
                  <div :class="LAYOUT_CONFIG.divider"></div>
                  <div :class="LAYOUT_CONFIG.flexBetween">
                    <p>
                      {{ ' ' + UI_TEXT.documents.fileType + ' ' }}
                      <span :class="TYPOGRAPHY_CONFIG.metaHighlight">
                        {{
                          getFileExtension(doc.file_name) ||
                          doc.mime_type.split('/')[1] ||
                          UI_TEXT.common.unknown
                        }}
                      </span>
                    </p>
                    <p>
                      {{ ' ' + UI_TEXT.documents.fileSize + ' ' }}
                      <span :class="TYPOGRAPHY_CONFIG.metaHighlight">
                        {{ formatFileSize(doc.file_size) }}
                      </span>
                    </p>
                  </div>
                  <div :class="LAYOUT_CONFIG.divider"></div>
                  <p>
                    {{ ' ' + UI_TEXT.documents.issued + ' ' }}
                    <span :class="TYPOGRAPHY_CONFIG.metaHighlight">
                      {{
                        doc.documents?.issue_date
                          ? new Date(doc.documents.issue_date).toLocaleDateString()
                          : UI_TEXT.common.notAvailable
                      }}
                    </span>
                  </p>
                  <p>
                    {{ ' ' + UI_TEXT.documents.ends + ' ' }}
                    <span :class="TYPOGRAPHY_CONFIG.metaHighlight">
                      {{
                        doc.documents?.expiry_date
                          ? new Date(doc.documents.expiry_date).toLocaleDateString()
                          : UI_TEXT.common.notAvailable
                      }}
                    </span>
                  </p>
                </div>
              </BaseCard>
            </div>
          </div>

          <!-- Empty per-type state -->
          <div v-else :class="TYPOGRAPHY_CONFIG.statusLoading">
            <UIcon name="i-heroicons-document-text" :class="TYPOGRAPHY_CONFIG.iconEmptyState" />
            <p :class="TEXT_SIZES.sm">
              {{ ' ' + UI_TEXT.documents.no + ' ' }}{{ type.label.toLowerCase() }}
              {{ ' ' + UI_TEXT.documents.found + ' ' }}
              <template v-if="memberSearchQuery">
                {{ ' ' + UI_TEXT.documents.matching }}{{ memberSearchQuery }}"
              </template>
              .
            </p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import type { GroupFile, PrivateDocumentMetadata, FileUserDto } from '~/types/files.type';
import type { GroupOutDto } from '~/types/groups.type';
import type { ViewMode } from '~/components/files/ViewSwitcher.vue';
import FilesListView from '~/components/files/FilesListView.vue';
import ViewSwitcher from '~/components/files/ViewSwitcher.vue';

const selectedGroup = defineModel<string | undefined>('selectedGroup');
const searchQuery = defineModel<string>('searchQuery', { default: '' });
const selectedTags = defineModel<string[]>('selectedTags', { default: () => [] });
const memberSearchQuery = defineModel<string>('memberSearchQuery', { default: '' });
const memberFilterType = defineModel<string>('memberFilterType', { default: 'ALL' });

const props = defineProps<{
  documents: GroupFile[];
  availableTags: string[];
  memberDocuments: PrivateDocumentMetadata[];
  isLoadingMemberDocuments: boolean;
  groups: GroupOutDto[];
  isLoading: boolean;
  canUpload: boolean;
  canManageFile: (file: GroupFile | PrivateDocumentMetadata) => boolean;
  canReadMemberDocuments: boolean;
  privateDocumentTypes: { label: string; value: string }[];
}>();

const emit = defineEmits<{
  edit: [file: GroupFile];
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

const toggleTagFilter = (tag: string) => {
  const lower = tag.toLowerCase();
  const idx = selectedTags.value.findIndex((t) => t.toLowerCase() === lower);
  if (idx === -1) {
    selectedTags.value = [...selectedTags.value, tag];
  } else {
    const next = [...selectedTags.value];
    next.splice(idx, 1);
    selectedTags.value = next;
  }
};

// Group documents into sections by tag (plus an 'Untagged' section for docs with no tags)
const documentSections = computed(() => {
  const map = new Map<string, { key: string; label: string; items: GroupFile[] }>();
  const untagged: GroupFile[] = [];

  for (const doc of props.documents) {
    const tags = doc.tags || [];
    if (tags.length === 0) {
      untagged.push(doc);
      continue;
    }

    for (const tag of tags) {
      const lower = tag.toLowerCase();
      if (!map.has(lower)) {
        map.set(lower, { key: lower, label: `#${tag}`, items: [] });
      }
      map.get(lower)!.items.push(doc);
    }
  }

  const sections = Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
  if (untagged.length > 0) {
    sections.push({
      key: '__untagged__',
      label: UI_TEXT.files.untaggedSection,
      items: untagged,
    });
  }
  return sections;
});

// Filters private member documents by specific category and case-insensitive filename search
const filteredMemberDocuments = (typeValue: string): PrivateDocumentMetadata[] => {
  const query = memberSearchQuery.value.toLowerCase().trim();
  return props.memberDocuments.filter((doc) => {
    const matchesType = doc.documents?.document_type === typeValue;
    const matchesSearch = !query || doc.file_name.toLowerCase().includes(query);
    return matchesType && matchesSearch;
  });
};

const getMemberDocUser = (doc: PrivateDocumentMetadata): FileUserDto | null => {
  return doc.creator || doc.owner || null;
};

const viewMode = useLocalStorage<ViewMode>('roamly_files_view_mode', 'grid');

// the list rows only emit open, the documents are opened in a new tab like in the grid view
const openInNewTab = (file: GroupFile | PrivateDocumentMetadata) => {
  const url = 'download_url' in file && file.download_url ? file.download_url : file.file_url;
  window.open(url, '_blank', 'noopener');
};
</script>
