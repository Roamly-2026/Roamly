<!-- frontend/app/components/documents/views/DocumentsDesktop.vue -->
<template>
  <div :class="appConfig.layout.pageWrapper">
    <!-- HEADER -->
    <div :class="appConfig.layout.pageHeader">
      <div :class="appConfig.calendar.headerActionLeft">
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
      <div :class="appConfig.calendar.headerCenter">
        <UPopover v-model:open="isGroupDropdownOpen">
          <BaseButton variant="ghost" :class="appConfig.calendar.mobileHeaderButton">
            <div :class="appConfig.calendar.mobileHeaderTitleRow">
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
                :class="[
                  SELECT_CONFIG.slots.trailingIcon,
                  'static pointer-events-auto',
                  isGroupDropdownOpen ? 'rotate-180' : '',
                ]"
              />
            </div>
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
        <p :class="appConfig.typography.pageSubtitle">
          {{ UI_TEXT.documents.groupDocuments }}
        </p>
      </div>

      <div :class="appConfig.calendar.headerActionRight">
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
          :to="mediaRoute"
          :tooltip="UI_TEXT.common.photos"
        />
        <BaseButton
          icon="i-heroicons-document-text"
          variant="glassIconButtonBrand"
          :to="documentsRoute"
          :tooltip="UI_TEXT.common.documents"
        />
      </div>
    </div>

    <!-- ==================== -->
    <!-- GROUP DOCUMENT SECTION -->
    <!-- ==================== -->
    <div :class="appConfig.layout.sectionWrapper">
      <div :class="[appConfig.calendar.eventsHeaderRow, SPACING_TOKENS.mb.lg]">
        <div :class="appConfig.calendar.headerActionLeft">
          <div :class="appConfig.calendar.headerSearchWrapper">
            <BaseSearchInput
              v-model="searchQuery"
              :placeholder="UI_TEXT.documents.search"
            />
          </div>

          <UPopover>
            <BaseButton
              icon="i-heroicons-funnel"
              :label="
                filterType === 'ALL'
                  ? UI_TEXT.common.filter
                  : documentTypes.find((d) => d.value === filterType)?.label
              "
              variant="glassButton"
            />
            <template #content="{ close }">
              <div :class="DROPDOWN_MENU_CONFIG.slots.content">
                <button
                  v-for="type in documentTypes"
                  :key="type.value"
                  :class="DROPDOWN_MENU_CONFIG.slots.item"
                  @click="
                    filterType = type.value;
                    close();
                  "
                >
                  <UIcon
                    :name="filterType === type.value ? 'i-heroicons-check' : 'i-heroicons-funnel'"
                    :class="DROPDOWN_MENU_CONFIG.slots.itemLeadingIcon"
                  />
                  <span>{{ type.label }}</span>
                </button>
              </div>
            </template>
          </UPopover>
        </div>

        <div :class="appConfig.typography.sectionTitleTransparent">
          {{ UI_TEXT.documents.groupDocumentsHeading }}
        </div>

        <div :class="appConfig.calendar.headerActionRight">
          <BaseButton
            v-if="isCurrentUserLeader"
            icon="i-heroicons-plus"
            variant="glassIconButtonHighlight"
            :tooltip="UI_TEXT.documents.uploadTitle"
            @click="emit('upload')"
          />
        </div>
      </div>

      <!-- DOCUMENT GRID -->
      <div v-if="isLoading" :class="appConfig.typography.statusLoading">
        {{ UI_TEXT.documents.loading }}
      </div>

      <div v-else-if="documents.length > 0" :class="appConfig.layout.documentGrid">
        <BaseCard
          v-for="doc in documents"
          :key="doc.file_id"
          variant="documentGlass"
          :class="appConfig.layout.headerRelative"
        >
          <div :class="appConfig.layout.documentCardHeader">
            <p :class="[FONT_WEIGHTS.bold, TEXT_SIZES.sm, SPACING_TOKENS.pr.sm, 'truncate']">
              {{ doc.file_name }}
            </p>

            <div :class="appConfig.calendar.headerTitleRow">
              <BaseButton
                v-if="isCurrentUserLeader"
                icon="i-heroicons-trash"
                variant="ghostDangerIconButton"
                :tooltip="UI_TEXT.common.delete"
                @click="emit('delete', doc)"
              />
            </div>
          </div>

          <div :class="appConfig.layout.documentCardImage">
            <UIcon
              name="i-heroicons-document"
              :class="[SIZE_TOKENS.avatar.lg, COLOR_TOKENS.text.primaryFaint]"
            />

            <div :class="appConfig.layout.documentCardBottomActions">
              <BaseButton
                icon="i-heroicons-eye"
                variant="ghostDangerIconButton"
                :href="doc.download_url"
                target="_blank"
                :tooltip="UI_TEXT.common.view"
              />
              <BaseButton
                icon="i-heroicons-arrow-down-tray"
                variant="ghostBrandIconButton"
                :class="COLOR_TOKENS.text.primaryMuted"
                :tooltip="UI_TEXT.common.download"
                @click.prevent="emit('download', doc.download_url, doc.file_name)"
              />
            </div>
          </div>

          <div :class="appConfig.layout.documentCardMeta">
            <p>
              {{ ' ' + UI_TEXT.common.uploadedBy + ' '
              }}<span :class="[FONT_WEIGHTS.bold, COLOR_TOKENS.text.primary]">{{
                doc.creator?.username || UI_TEXT.common.unknown
              }}</span>
            </p>
            <p>
              {{ ' ' + UI_TEXT.common.uploadedAt + ' '
              }}<span :class="[FONT_WEIGHTS.bold, COLOR_TOKENS.text.primary]">{{
                new Date(doc.created_at).toLocaleDateString()
              }}</span>
            </p>
            <p>
              {{ ' ' + UI_TEXT.documents.documentType + ' '
              }}<span :class="[FONT_WEIGHTS.bold, COLOR_TOKENS.text.primary]">{{
                doc.documents?.document_type.toLocaleLowerCase() || UI_TEXT.common.notAvailable
              }}</span>
            </p>
            <div :class="appConfig.layout.divider"></div>
            <div :class="appConfig.layout.flexBetween">
              <p>
                {{ ' ' + UI_TEXT.documents.fileType + ' '
                }}<span :class="[FONT_WEIGHTS.bold, COLOR_TOKENS.text.primary]">{{
                  doc.mime_type.split('/')[1] || UI_TEXT.common.unknown
                }}</span>
              </p>
              <p>
                {{ ' ' + UI_TEXT.documents.fileSize + ' '
                }}<span :class="[FONT_WEIGHTS.bold, COLOR_TOKENS.text.primary]"
                  >{{ (doc.file_size / (1024 * 1024)).toFixed(2)
                  }}{{ ' ' + UI_TEXT.common.megabytes }}</span
                >
              </p>
            </div>
            <div :class="appConfig.layout.divider"></div>
            <p>
              {{ ' ' + UI_TEXT.documents.issued + ' '
              }}<span :class="[FONT_WEIGHTS.bold, COLOR_TOKENS.text.primary]">{{
                doc.documents?.issue_date
                  ? new Date(doc.documents.issue_date).toLocaleDateString()
                  : UI_TEXT.common.notAvailable
              }}</span>
            </p>
            <p>
              {{ ' ' + UI_TEXT.documents.ends + ' '
              }}<span :class="[FONT_WEIGHTS.bold, COLOR_TOKENS.text.primary]">{{
                doc.documents?.expiry_date
                  ? new Date(doc.documents.expiry_date).toLocaleDateString()
                  : UI_TEXT.common.notAvailable
              }}</span>
            </p>
          </div>
        </BaseCard>
      </div>
      <div v-else :class="appConfig.typography.statusLoading">
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
  <div v-if="isCurrentUserLeader" :class="appConfig.layout.pageWrapper">
    <div :class="[appConfig.calendar.eventsHeaderRow, SPACING_TOKENS.mb.lg]">
      <div :class="appConfig.calendar.headerActionLeft">
        <div :class="appConfig.calendar.headerSearchWrapper">
          <BaseSearchInput
            v-model="memberSearchQuery"
            :placeholder="UI_TEXT.documents.searchPrivate"
          />
        </div>

        <UPopover>
          <BaseButton
            icon="i-heroicons-funnel"
            :label="
              memberFilterType === 'ALL'
                ? UI_TEXT.common.filter
                : privateDocumentTypes.find((d) => d.value === memberFilterType)?.label
            "
            variant="glassButton"
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
      </div>

      <div :class="appConfig.typography.sectionTitleTransparent">
        {{ UI_TEXT.documents.memberDocumentsHeading }}
      </div>

      <div :class="appConfig.calendar.headerActionRight" />
    </div>

    <!-- Loading -->
    <div v-if="isLoadingMemberDocuments" :class="appConfig.typography.statusLoading">
      {{ ' ' + UI_TEXT.documents.loadingMemberDocuments + ' ' }}
    </div>

    <template v-else>
      <div
        v-for="type in privateDocumentTypes.filter(
          (t) => t.value !== 'ALL' && (memberFilterType === 'ALL' || memberFilterType === t.value),
        )"
        :key="type.value"
        :class="appConfig.layout.sectionWrapper"
      >
        <h2 :class="appConfig.typography.sectionTitleTransparent">
          {{ type.label }}
        </h2>

        <!-- Documents of this type -->
        <div
          v-if="filteredMemberDocuments(type.value).length > 0"
          :class="appConfig.layout.documentGrid"
        >
          <BaseCard
            v-for="doc in filteredMemberDocuments(type.value)"
            :key="doc.file_id"
            variant="documentGlass"
            :class="appConfig.layout.headerRelative"
          >
            <div :class="appConfig.layout.documentCardHeader">
              <p :class="[FONT_WEIGHTS.bold, TEXT_SIZES.sm, SPACING_TOKENS.pr.sm, 'truncate']">
                {{ doc.file_name }}
              </p>
            </div>

            <div :class="appConfig.layout.documentCardImage">
              <UIcon
                name="i-heroicons-document-text"
                :class="[SIZE_TOKENS.avatar.lg, COLOR_TOKENS.text.primaryFaint]"
              />
              <div :class="appConfig.layout.documentCardBottomActionEnd">
                <BaseButton
                  icon="i-heroicons-eye"
                  variant="ghostDangerIconButton"
                  :href="doc.file_url"
                  target="_blank"
                  :tooltip="UI_TEXT.common.view"
                />
              </div>
            </div>

            <div :class="appConfig.layout.documentCardMeta">
              <p>
                {{ ' ' + UI_TEXT.common.uploadedAt + ' '
                }}<span :class="[FONT_WEIGHTS.bold, COLOR_TOKENS.text.primary]">{{
                  new Date(doc.created_at).toLocaleDateString()
                }}</span>
              </p>
              <p>
                {{ ' ' + UI_TEXT.documents.documentType + ' '
                }}<span :class="[FONT_WEIGHTS.bold, COLOR_TOKENS.text.primary]">{{
                  doc.documents?.document_type ?? UI_TEXT.common.notAvailable
                }}</span>
              </p>
              <div :class="appConfig.layout.divider"></div>
              <div :class="appConfig.layout.flexBetween">
                <p>
                  {{ ' ' + UI_TEXT.documents.fileType + ' '
                  }}<span :class="[FONT_WEIGHTS.bold, COLOR_TOKENS.text.primary]">{{
                    doc.mime_type.split('/')[1] || UI_TEXT.common.unknown
                  }}</span>
                </p>
                <p>
                  {{ ' ' + UI_TEXT.documents.fileSize + ' '
                  }}<span :class="[FONT_WEIGHTS.bold, COLOR_TOKENS.text.primary]"
                    >{{ (doc.file_size / (1024 * 1024)).toFixed(2)
                    }}{{ ' ' + UI_TEXT.common.megabytes }}</span
                  >
                </p>
              </div>
              <div :class="appConfig.layout.divider"></div>
              <p>
                {{ ' ' + UI_TEXT.documents.issued + ' '
                }}<span :class="[FONT_WEIGHTS.bold, COLOR_TOKENS.text.primary]">{{
                  doc.documents?.issue_date
                    ? new Date(doc.documents.issue_date).toLocaleDateString()
                    : UI_TEXT.common.notAvailable
                }}</span>
              </p>
              <p>
                {{ ' ' + UI_TEXT.documents.ends + ' '
                }}<span :class="[FONT_WEIGHTS.bold, COLOR_TOKENS.text.primary]">{{
                  doc.documents?.expiry_date
                    ? new Date(doc.documents.expiry_date).toLocaleDateString()
                    : UI_TEXT.common.notAvailable
                }}</span>
              </p>
            </div>
          </BaseCard>
        </div>

        <!-- Empty per-type state -->
        <div v-else :class="appConfig.typography.statusLoading">
          <UIcon
            name="i-heroicons-document-text"
            :class="[SIZE_TOKENS.avatar.md, SPACING_TOKENS.mx.auto, SPACING_TOKENS.mb.sm, OPACITY_TOKENS.muted]"
          />
          <p :class="TEXT_SIZES.sm">
            {{ ' ' + UI_TEXT.documents.no + ' ' }}{{ type.label.toLowerCase()
            }}{{ ' ' + UI_TEXT.documents.found + ' '
            }}<template v-if="memberSearchQuery"
              >{{ ' ' + UI_TEXT.documents.matching }}{{ memberSearchQuery }}"</template
            >.
          </p>
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
