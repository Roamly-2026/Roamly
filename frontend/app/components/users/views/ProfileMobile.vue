<!-- frontend/app/components/views/mobile/users/ProfileMobile.vue -->
<template>
  <div :class="appConfig.layout.pageWrapper">
    <!-- PAGE TITLE -->
    <div>
      <h1 :class="appConfig.typography.pageTitle">{{ UI_TEXT.profile.heading }}</h1>
    </div>

    <!-- CONTENT SECTION -->
    <ClientOnly>
      <!-- LOADING / ERROR STATES -->
      <div v-if="isLoading" :class="appConfig.typography.statusLoading">
        {{ UI_TEXT.common.loading }}
      </div>
      <div v-else-if="error" :class="appConfig.typography.statusError">
        {{ UI_TEXT.errors.fetch }}
      </div>

      <div v-else-if="currentUser" class="w-full relative flex flex-col">
        <!-- PROFILE CARD SECTION -->
        <div
          :class="[
            appConfig.layout.profileCard,
            'p-4! flex-row! items-center',
            SPACING_TOKENS.gap.md,
          ]"
        >
          <!-- Delete Button -->
          <div class="absolute top-2 left-2 z-10">
            <BaseButton
              icon="i-heroicons-trash"
              variant="glassIconButtonDanger"
              class="w-7! h-7!"
              :tooltip="UI_TEXT.tooltips.deleteProfile"
              @click="profileStore.openDeleteModal(currentUser)"
            />
          </div>

          <!-- Profile picture -->
          <div
            :class="appConfig.layout.profilePictureWrapper"
            class="top-3 w-20! h-20! my-0! ml-0! shrink-0 relative"
          >
            <div :class="appConfig.layout.profilePictureInner">
              <img
                v-if="currentUser.profile_image_url"
                :src="currentUser.profile_image_url"
                :alt="UI_TEXT.common.profile"
                class="w-full h-full object-cover"
              />
              <UIcon v-else name="i-heroicons-user" class="w-10 h-10 text-surface-500" />

              <div
                class="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/50 to-transparent pointer-events-none"
              ></div>

              <BaseButton
                icon="i-heroicons-eye"
                variant="ghostDangerIconButton"
                class="text-surface-500 w-6! h-6! p-0 absolute bottom-0.5 left-0.5"
                :tooltip="UI_TEXT.tooltips.viewPicture"
                @click="profileStore.openViewPictureModal(currentUser)"
              />

              <BaseButton
                icon="i-heroicons-arrow-up-tray"
                variant="ghostDangerIconButton"
                class="text-surface-500 w-6! h-6! p-0 absolute bottom-0.5 right-0.5"
                :tooltip="UI_TEXT.tooltips.uploadPicture"
                @click="profileStore.openUploadPictureModal()"
              />
            </div>
          </div>

          <!-- User details -->
          <div
            :class="[
              appConfig.layout.profileDetailsWrapper,
              'text-sm! flex-1 min-w-0',
              SPACING_TOKENS.gap.xs,
            ]"
          >
            <!-- Username -->
            <div :class="[appConfig.layout.profileDetailRow, SPACING_TOKENS.gap.sm]">
              <p :class="appConfig.typography.profileLabel" class="w-16! text-[10px]!">
                {{ UI_TEXT.auth.usernameLabel }}
              </p>
              <div
                :class="[
                  appConfig.layout.actionGroup,
                  'justify-between flex-1 min-w-0',
                  SPACING_TOKENS.gap.xs,
                ]"
              >
                <p :class="appConfig.typography.profileValue" class="text-sm! truncate">
                  {{ currentUser.username }}
                </p>
                <BaseButton
                  icon="i-heroicons-pencil"
                  variant="ghostDangerIconButton"
                  :tooltip="UI_TEXT.tooltips.editUsername"
                  class="w-6! h-6! p-0 shrink-0"
                  @click="profileStore.openEditUsernameModal(currentUser)"
                />
              </div>
            </div>
            <!-- Email -->
            <div :class="[appConfig.layout.profileDetailRow, SPACING_TOKENS.gap.sm]">
              <p :class="appConfig.typography.profileLabel" class="w-16! text-[10px]!">
                {{ UI_TEXT.auth.emailLabel }}
              </p>
              <div
                :class="[
                  appConfig.layout.actionGroup,
                  'justify-between flex-1 min-w-0',
                  SPACING_TOKENS.gap.xs,
                ]"
              >
                <p :class="appConfig.typography.profileValue" class="text-xs! truncate">
                  {{ currentUser.email }}
                </p>
                <BaseButton
                  icon="i-heroicons-pencil"
                  variant="ghostDangerIconButton"
                  class="w-6! h-6! p-0 shrink-0"
                  :tooltip="UI_TEXT.tooltips.editEmail"
                  @click="profileStore.openEditEmailModal(currentUser)"
                />
              </div>
            </div>
            <!-- Password -->
            <div :class="[appConfig.layout.profileDetailRow, SPACING_TOKENS.gap.sm]">
              <p :class="appConfig.typography.profileLabel" class="w-16! text-[10px]!">
                {{ UI_TEXT.auth.passwordLabel }}
              </p>
              <div
                :class="[
                  appConfig.layout.actionGroup,
                  'justify-between flex-1 min-w-0',
                  SPACING_TOKENS.gap.xs,
                ]"
              >
                <p :class="[appConfig.typography.profileValueLg, 'text-sm!', SPACING_TOKENS.mt.xs]">
                  ********
                </p>
                <BaseButton
                  icon="i-heroicons-pencil"
                  variant="ghostDangerIconButton"
                  class="w-6! h-6! p-0 shrink-0"
                  :tooltip="UI_TEXT.tooltips.editPassword"
                  @click="profileStore.openChangePasswordModal()"
                />
              </div>
            </div>
            <!-- Registered -->
            <div :class="[appConfig.layout.profileDetailRow, SPACING_TOKENS.gap.sm]">
              <p :class="appConfig.typography.profileLabel" class="w-16! text-[10px]!">
                {{ UI_TEXT.profile.registeredLabel }}
              </p>
              <div
                :class="[
                  appConfig.layout.actionGroup,
                  'justify-between flex-1 min-w-0',
                  SPACING_TOKENS.gap.xs,
                ]"
              >
                <p :class="appConfig.typography.profileValue" class="text-xs! truncate">
                  {{
                    currentUser.created_at
                      ? new Date(currentUser.created_at).toLocaleDateString()
                      : UI_TEXT.common.notAvailable
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- DOCUMENT SECTION -->
        <div :class="[appConfig.layout.sectionWrapper, SPACING_TOKENS.mt.lg]">
          <div :class="[appConfig.layout.pageHeader, SPACING_TOKENS.mb.md]">
            <h2 :class="appConfig.typography.sectionTitleTransparent" class="text-xl">
              {{ UI_TEXT.profile.documentsHeading }}
            </h2>
            <div :class="[appConfig.layout.actionGroup, 'justify-center', SPACING_TOKENS.mt.sm]">
              <!-- Filter popover -->
              <UPopover>
                <BaseButton
                  icon="i-heroicons-funnel"
                  :label="
                    filterType === 'ALL'
                      ? UI_TEXT.common.filter
                      : privateDocumentTypes.find((d) => d.value === filterType)?.label
                  "
                  variant="glassButton"
                  :tooltip="UI_TEXT.tooltips.filterDocuments"
                />
                <template #content="{ close }">
                  <div :class="[appConfig.ui.dropdownMenu.slots.content, 'w-fit']">
                    <button
                      :class="appConfig.ui.dropdownMenu.slots.item"
                      @click="
                        filterType = 'ALL';
                        close();
                      "
                    >
                      <UIcon
                        :name="filterType === 'ALL' ? 'i-heroicons-check' : 'i-heroicons-funnel'"
                        :class="appConfig.ui.dropdownMenu.slots.itemLeadingIcon"
                      />
                      <span>{{ UI_TEXT.common.allTypes }}</span>
                    </button>
                    <button
                      v-for="type in privateDocumentTypes"
                      :key="type.value"
                      :class="appConfig.ui.dropdownMenu.slots.item"
                      @click="
                        filterType = type.value;
                        close();
                      "
                    >
                      <UIcon
                        :name="
                          filterType === type.value ? 'i-heroicons-check' : 'i-heroicons-funnel'
                        "
                        :class="appConfig.ui.dropdownMenu.slots.itemLeadingIcon"
                      />
                      <span>{{ type.label }}</span>
                    </button>
                  </div>
                </template>
              </UPopover>

              <!-- Upload button -->
              <BaseButton
                icon="i-heroicons-plus"
                variant="glassIconButton"
                :tooltip="UI_TEXT.tooltips.uploadDocument"
                @click="emit('upload')"
              />
            </div>
          </div>

          <!-- Loading state -->
          <div v-if="isLoadingDocuments" :class="appConfig.typography.statusLoading">
            {{ ' ' + UI_TEXT.documents.loading + ' ' }}
          </div>

          <!-- Document List (vertical on mobile) -->
          <div
            v-else-if="filteredDocuments.length > 0"
            :class="`flex flex-col ${SPACING_TOKENS.gap.md} w-full`"
          >
            <UCard
              v-for="doc in filteredDocuments"
              :key="doc.file_id"
              variant="documentGlass"
              class="relative w-full"
            >
              <!-- Title and action buttons -->
              <div :class="appConfig.layout.documentCardHeader">
                <p class="font-bold truncate pr-2 shadow-sm text-sm">{{ doc.file_name }}</p>
                <div :class="`flex items-center ${SPACING_TOKENS.gap.xs}`">
                  <BaseButton
                    icon="i-heroicons-key-solid"
                    variant="ghostBrandIconButton"
                    class="text-surface-500"
                    :tooltip="UI_TEXT.profile.accessDetails"
                    @click="emit('access', doc)"
                  />
                  <BaseButton
                    icon="i-heroicons-share"
                    variant="ghostBrandIconButton"
                    class="text-surface-500"
                    :tooltip="UI_TEXT.profile.share"
                    @click.prevent="emit('share', doc)"
                  />
                  <BaseButton
                    icon="i-heroicons-pencil"
                    variant="ghostDangerIconButton"
                    class="text-surface-500"
                    :tooltip="UI_TEXT.tooltips.editDocument"
                    @click="emit('edit', doc)"
                  />
                  <BaseButton
                    icon="i-heroicons-trash"
                    variant="ghostDangerIconButton"
                    class="text-surface-500"
                    :tooltip="UI_TEXT.tooltips.deleteDocument"
                    @click="emit('delete', doc)"
                  />
                </div>
              </div>

              <!-- File Preview -->
              <div :class="appConfig.layout.documentCardImage" class="h-32!">
                <UIcon name="i-heroicons-document-text" class="w-12 h-12 text-surface-500/50" />
                <div
                  :class="`absolute bottom-2 ${SPACING_TOKENS.px.md} w-full flex justify-between`"
                >
                  <BaseButton
                    icon="i-heroicons-eye"
                    variant="ghostBrandIconButton"
                    class="text-dark-text/70"
                    :tooltip="UI_TEXT.tooltips.viewDocument"
                    @click.prevent="emit('view', doc)"
                  />
                  <BaseButton
                    icon="i-heroicons-arrow-down-tray"
                    variant="ghostBrandIconButton"
                    class="text-dark-text/70"
                    :tooltip="UI_TEXT.tooltips.downloadDocument"
                    @click.prevent="emit('download', doc)"
                  />
                </div>
              </div>

              <!-- Metadata -->
              <div :class="appConfig.layout.documentCardMeta">
                <p>
                  {{ ' ' + UI_TEXT.common.uploadedAt + ' '
                  }}<span class="font-bold text-dark-text">
                    {{ new Date(doc.created_at).toLocaleDateString() }}
                  </span>
                </p>
                <p>
                  {{ ' ' + UI_TEXT.documents.documentType + ' '
                  }}<span class="font-bold text-dark-text">
                    {{ doc.documents?.document_type ?? UI_TEXT.common.notAvailable }}
                  </span>
                </p>

                <div :class="appConfig.layout.divider"></div>

                <div :class="appConfig.layout.flexBetween">
                  <p>
                    {{ ' ' + UI_TEXT.documents.fileType + ' '
                    }}<span class="font-bold text-dark-text">
                      {{ doc.mime_type?.split('/')[1] ?? UI_TEXT.common.unknown }}
                    </span>
                  </p>
                  <p>
                    {{ ' ' + UI_TEXT.documents.fileSize + ' '
                    }}<span class="font-bold text-dark-text">
                      {{ (doc.file_size / (1024 * 1024)).toFixed(2)
                      }}{{ ' ' + UI_TEXT.common.megabytes + ' ' }}</span
                    >
                  </p>
                </div>

                <div :class="appConfig.layout.divider"></div>

                <p>
                  {{ ' ' + UI_TEXT.documents.issued + ' '
                  }}<span class="font-bold text-dark-text">
                    {{
                      doc.documents?.issue_date
                        ? new Date(doc.documents.issue_date).toLocaleDateString()
                        : UI_TEXT.common.notAvailable
                    }}
                  </span>
                </p>
                <p>
                  {{ ' ' + UI_TEXT.documents.ends + ' '
                  }}<span class="font-bold text-dark-text">
                    {{
                      doc.documents?.expiry_date
                        ? new Date(doc.documents.expiry_date).toLocaleDateString()
                        : UI_TEXT.common.notAvailable
                    }}
                  </span>
                </p>
              </div>
            </UCard>
          </div>

          <!-- Empty state -->
          <div v-else :class="appConfig.typography.statusLoading">
            {{
              filterType !== 'ALL'
                ? UI_TEXT.profile.noMatchingDocuments
                : UI_TEXT.profile.noPrivateDocuments
            }}
          </div>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
/* --- IMPORTS --- */
import { computed, ref } from 'vue';
import { useAppConfig } from '#imports';
import type { useProfileStore } from '~/stores/profile.modals.store';
import type { useDocumentsStore } from '~/stores/documents.modals.store';
import type { UserOutDto } from '~/types/user.type';
import type { ApiError } from '~/types/apiError.type';
import type { PrivateDocumentMetadata } from '~/types/files.type';

/* --- COMPOSABLES --- */
const appConfig = useAppConfig();

/* --- PROPS --- */
const props = defineProps<{
  currentUser: UserOutDto | null | undefined;
  isLoading: boolean;
  error: ApiError | Error | null | undefined;
  privateDocuments: PrivateDocumentMetadata[];
  isLoadingDocuments: boolean;
  privateDocumentTypes: { label: string; value: string }[];
  profileStore: ReturnType<typeof useProfileStore>;
  documentsStore: ReturnType<typeof useDocumentsStore>;
}>();

/* --- EMITS --- */
const emit = defineEmits<{
  upload: [];
  edit: [doc: PrivateDocumentMetadata];
  delete: [doc: PrivateDocumentMetadata];
  view: [doc: PrivateDocumentMetadata];
  download: [doc: PrivateDocumentMetadata];
  share: [doc: PrivateDocumentMetadata];
  access: [doc: PrivateDocumentMetadata];
}>();

/* --- LOCAL STATE --- */
const filterType = ref('ALL');

/* --- COMPUTED --- */
const filteredDocuments = computed<PrivateDocumentMetadata[]>(() => {
  if (filterType.value === 'ALL') return props.privateDocuments;
  return props.privateDocuments.filter((doc) => doc.documents?.document_type === filterType.value);
});
</script>
