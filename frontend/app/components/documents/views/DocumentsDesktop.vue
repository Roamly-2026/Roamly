<!-- frontend/app/components/documents/views/DocumentsDesktop.vue -->
<template>
  <div :class="LAYOUT_CONFIG.pageWrapper">
    <!-- HEADER -->
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

      <!-- DROPDOWN HEADER -->
      <div :class="LAYOUT_CONFIG.headerCenter">
        <UPopover v-model:open="isGroupDropdownOpen">
          <BaseButton variant="ghost" :class="LAYOUT_CONFIG.mobileHeaderButton">
            <div :class="LAYOUT_CONFIG.mobileHeaderTitleRow">
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
                :class="[TYPOGRAPHY_CONFIG.iconBrandMd, isGroupDropdownOpen ? 'rotate-180' : '']"
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
        <p :class="TYPOGRAPHY_CONFIG.pageSubtitle">
          {{ UI_TEXT.documents.groupDocuments }}
        </p>
      </div>

      <div :class="LAYOUT_CONFIG.headerActionRight">
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

    <!-- GROUP DOCUMENT SECTION -->
    <div :class="LAYOUT_CONFIG.sectionWrapper">
      <div :class="LAYOUT_CONFIG.headerRow">
        <div :class="LAYOUT_CONFIG.headerActionLeft">
          <div :class="LAYOUT_CONFIG.headerSearchWrapper">
            <BaseSearchInput v-model="searchQuery" :placeholder="UI_TEXT.documents.search" />
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

        <div :class="TYPOGRAPHY_CONFIG.sectionTitleTransparent">
          {{ UI_TEXT.documents.groupDocumentsHeading }}
        </div>

        <div :class="LAYOUT_CONFIG.headerActionRight">
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
      <div v-if="isLoading" :class="TYPOGRAPHY_CONFIG.statusLoading">
        {{ UI_TEXT.documents.loading }}
      </div>

      <div v-else-if="documents.length > 0" :class="LAYOUT_CONFIG.documentGrid">
        <BaseCard
          v-for="doc in documents"
          :key="doc.file_id"
          variant="documentGlass"
          :class="LAYOUT_CONFIG.headerRelative"
        >
          <div :class="LAYOUT_CONFIG.documentCardHeader">
            <p :class="TYPOGRAPHY_CONFIG.documentHeaderTitle">{{ doc.file_name }}</p>
            <div :class="LAYOUT_CONFIG.headerTitleRow">
              <BaseButton
                v-if="isCurrentUserLeader"
                icon="i-heroicons-trash"
                variant="ghostDangerIconButton"
                :tooltip="UI_TEXT.common.delete"
                @click="emit('delete', doc)"
              />
            </div>
          </div>

          <div :class="LAYOUT_CONFIG.documentCardImage">
            <UIcon name="i-heroicons-document" :class="TYPOGRAPHY_CONFIG.iconWatermarkLg" />

            <div :class="LAYOUT_CONFIG.documentCardBottomActions">
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

          <div :class="LAYOUT_CONFIG.documentCardMeta">
            <p>
              {{ ' ' + UI_TEXT.common.uploadedBy + ' '
              }}<span :class="TYPOGRAPHY_CONFIG.metaHighlight">{{
                doc.creator?.username || UI_TEXT.common.unknown
              }}</span>
            </p>
            <p>
              {{ ' ' + UI_TEXT.common.uploadedAt + ' '
              }}<span :class="TYPOGRAPHY_CONFIG.metaHighlight">{{
                new Date(doc.created_at).toLocaleDateString()
              }}</span>
            </p>
            <p>
              {{ ' ' + UI_TEXT.documents.documentType + ' '
              }}<span :class="TYPOGRAPHY_CONFIG.metaHighlight">{{
                doc.documents?.document_type.toLocaleLowerCase() || UI_TEXT.common.notAvailable
              }}</span>
            </p>
            <div :class="LAYOUT_CONFIG.divider"></div>
            <div :class="LAYOUT_CONFIG.flexBetween">
              <p>
                {{ ' ' + UI_TEXT.documents.fileType + ' '
                }}<span :class="TYPOGRAPHY_CONFIG.metaHighlight">{{
                  doc.mime_type.split('/')[1] || UI_TEXT.common.unknown
                }}</span>
              </p>
              <p>
                {{ ' ' + UI_TEXT.documents.fileSize + ' '
                }}<span :class="TYPOGRAPHY_CONFIG.metaHighlight"
                  >{{ (doc.file_size / (1024 * 1024)).toFixed(2)
                  }}{{ ' ' + UI_TEXT.common.megabytes }}</span
                >
              </p>
            </div>
            <div :class="LAYOUT_CONFIG.divider"></div>
            <p>
              {{ ' ' + UI_TEXT.documents.issued + ' '
              }}<span :class="TYPOGRAPHY_CONFIG.metaHighlight">{{
                doc.documents?.issue_date
                  ? new Date(doc.documents.issue_date).toLocaleDateString()
                  : UI_TEXT.common.notAvailable
              }}</span>
            </p>
            <p>
              {{ ' ' + UI_TEXT.documents.ends + ' '
              }}<span :class="TYPOGRAPHY_CONFIG.metaHighlight">{{
                doc.documents?.expiry_date
                  ? new Date(doc.documents.expiry_date).toLocaleDateString()
                  : UI_TEXT.common.notAvailable
              }}</span>
            </p>
          </div>
        </BaseCard>
      </div>
      <div v-else :class="TYPOGRAPHY_CONFIG.statusLoading">
        {{
          searchQuery || filterType !== 'ALL'
            ? UI_TEXT.documents.noMatchingDocuments
            : UI_TEXT.documents.noDocuments
        }}
      </div>
    </div>
  </div>

  <!-- MEMBER DOCUMENTS (leader) -->
  <div v-if="isCurrentUserLeader" :class="LAYOUT_CONFIG.pageWrapper">
    <div :class="LAYOUT_CONFIG.headerRow">
      <div :class="LAYOUT_CONFIG.headerActionLeft">
        <div :class="LAYOUT_CONFIG.headerSearchWrapper">
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

      <div :class="TYPOGRAPHY_CONFIG.sectionTitleTransparent">
        {{ UI_TEXT.documents.memberDocumentsHeading }}
      </div>

      <div :class="LAYOUT_CONFIG.headerActionRight" />
    </div>

    <div v-if="isLoadingMemberDocuments" :class="TYPOGRAPHY_CONFIG.statusLoading">
      {{ ' ' + UI_TEXT.documents.loadingMemberDocuments + ' ' }}
    </div>

    <template v-else>
      <div
        v-for="type in privateDocumentTypes.filter(
          (t) => t.value !== 'ALL' && (memberFilterType === 'ALL' || memberFilterType === t.value),
        )"
        :key="type.value"
        :class="LAYOUT_CONFIG.sectionWrapper"
      >
        <h2 :class="TYPOGRAPHY_CONFIG.sectionTitleTransparent">
          {{ type.label }}
        </h2>

        <div
          v-if="filteredMemberDocuments(type.value).length > 0"
          :class="LAYOUT_CONFIG.documentGrid"
        >
          <BaseCard
            v-for="doc in filteredMemberDocuments(type.value)"
            :key="doc.file_id"
            variant="documentGlass"
            :class="LAYOUT_CONFIG.headerRelative"
          >
            <div :class="LAYOUT_CONFIG.documentCardHeader">
              <p :class="TYPOGRAPHY_CONFIG.documentHeaderTitle">{{ doc.file_name }}</p>
            </div>

            <div :class="LAYOUT_CONFIG.documentCardImage">
              <UIcon name="i-heroicons-document-text" :class="TYPOGRAPHY_CONFIG.iconWatermarkLg" />
              <div :class="LAYOUT_CONFIG.documentCardBottomActionEnd">
                <BaseButton
                  icon="i-heroicons-eye"
                  variant="ghostDangerIconButton"
                  :href="doc.file_url"
                  target="_blank"
                  :tooltip="UI_TEXT.common.view"
                />
              </div>
            </div>

            <div :class="LAYOUT_CONFIG.documentCardMeta">
              <p>
                {{ ' ' + UI_TEXT.common.uploadedAt + ' '
                }}<span :class="TYPOGRAPHY_CONFIG.metaHighlight">{{
                  new Date(doc.created_at).toLocaleDateString()
                }}</span>
              </p>
              <p>
                {{ ' ' + UI_TEXT.documents.documentType + ' '
                }}<span :class="TYPOGRAPHY_CONFIG.metaHighlight">{{
                  doc.documents?.document_type ?? UI_TEXT.common.notAvailable
                }}</span>
              </p>
              <div :class="LAYOUT_CONFIG.divider"></div>
              <div :class="LAYOUT_CONFIG.flexBetween">
                <p>
                  {{ ' ' + UI_TEXT.documents.fileType + ' '
                  }}<span :class="TYPOGRAPHY_CONFIG.metaHighlight">{{
                    doc.mime_type.split('/')[1] || UI_TEXT.common.unknown
                  }}</span>
                </p>
                <p>
                  {{ ' ' + UI_TEXT.documents.fileSize + ' '
                  }}<span :class="TYPOGRAPHY_CONFIG.metaHighlight"
                    >{{ (doc.file_size / (1024 * 1024)).toFixed(2)
                    }}{{ ' ' + UI_TEXT.common.megabytes }}</span
                  >
                </p>
              </div>
              <div :class="LAYOUT_CONFIG.divider"></div>
              <p>
                {{ ' ' + UI_TEXT.documents.issued + ' '
                }}<span :class="TYPOGRAPHY_CONFIG.metaHighlight">{{
                  doc.documents?.issue_date
                    ? new Date(doc.documents.issue_date).toLocaleDateString()
                    : UI_TEXT.common.notAvailable
                }}</span>
              </p>
              <p>
                {{ ' ' + UI_TEXT.documents.ends + ' '
                }}<span :class="TYPOGRAPHY_CONFIG.metaHighlight">{{
                  doc.documents?.expiry_date
                    ? new Date(doc.documents.expiry_date).toLocaleDateString()
                    : UI_TEXT.common.notAvailable
                }}</span>
              </p>
            </div>
          </BaseCard>
        </div>

        <div v-else :class="TYPOGRAPHY_CONFIG.statusLoading">
          <UIcon name="i-heroicons-document-text" :class="TYPOGRAPHY_CONFIG.iconEmptyState" />
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
import type { GroupFile, PrivateDocumentMetadata } from '~/types/files.type';
import type { GroupOutDto } from '~/types/groups.type';

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
