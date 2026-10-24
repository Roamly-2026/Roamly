<!-- frontend/app/components/views/desktop/users/ProfileDesktop.vue -->
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

      <div v-else-if="currentUser" class="w-full relative">
        <!-- PROFILE CARD SECTION -->
        <div :class="appConfig.layout.profileCard">
          <!-- Delete Button -->
          <div class="absolute top-4 right-4 z-10">
            <UTooltip :text="UI_TEXT.tooltips.deleteProfile">
              <UButton
                icon="i-heroicons-trash"
                variant="glassIconButtonDanger"
                @click="profileStore.openDeleteModal(currentUser)"
              />
            </UTooltip>
          </div>

          <!-- Profile picture -->
          <div :class="appConfig.layout.profilePictureWrapper">
            <div :class="appConfig.layout.profilePictureInner">
              <img
                v-if="currentUser.profile_image_url"
                :src="currentUser.profile_image_url"
                :alt="UI_TEXT.common.profile"
                class="w-full h-full object-cover"
              />
              <UIcon v-else name="i-heroicons-user" class="w-20 h-20 text-surface-500" />

              <div
                class="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/50 to-transparent pointer-events-none"
              ></div>

              <UTooltip :text="UI_TEXT.tooltips.viewPicture" class="absolute bottom-2 left-2">
                <UButton
                  icon="i-heroicons-eye"
                  variant="ghostDangerIconButton"
                  class="text-surface-500"
                  @click="profileStore.openViewPictureModal(currentUser)"
                />
              </UTooltip>

              <UTooltip :text="UI_TEXT.tooltips.uploadPicture" class="absolute bottom-2 right-2">
                <UButton
                  icon="i-heroicons-arrow-up-tray"
                  variant="ghostDangerIconButton"
                  class="text-surface-500"
                  @click="profileStore.openUploadPictureModal()"
                />
              </UTooltip>
            </div>
          </div>

          <!-- Right side: user details -->
          <div :class="appConfig.layout.profileDetailsWrapper">
            <!-- Username -->
            <div :class="appConfig.layout.profileDetailRow">
              <p :class="appConfig.typography.profileLabel">{{ UI_TEXT.auth.usernameLabel }}</p>
              <div :class="appConfig.layout.actionGroup">
                <p :class="appConfig.typography.profileValue">{{ currentUser.username }}</p>
                <UTooltip :text="UI_TEXT.tooltips.editUsername">
                  <UButton
                    icon="i-heroicons-pencil"
                    variant="ghostDangerIconButton"
                    @click="profileStore.openEditUsernameModal(currentUser)"
                  />
                </UTooltip>
              </div>
            </div>
            <!-- Email -->
            <div :class="appConfig.layout.profileDetailRow">
              <p :class="appConfig.typography.profileLabel">{{ UI_TEXT.auth.emailLabel }}</p>
              <div :class="appConfig.layout.actionGroup">
                <p :class="appConfig.typography.profileValue">{{ currentUser.email }}</p>
                <UTooltip :text="UI_TEXT.tooltips.editEmail">
                  <UButton
                    icon="i-heroicons-pencil"
                    variant="ghostDangerIconButton"
                    @click="profileStore.openEditEmailModal(currentUser)"
                  />
                </UTooltip>
              </div>
            </div>
            <!-- Password -->
            <div :class="appConfig.layout.profileDetailRow">
              <p :class="appConfig.typography.profileLabel">{{ UI_TEXT.auth.passwordLabel }}</p>
              <div :class="appConfig.layout.actionGroup">
                <p :class="appConfig.typography.profileValueLg">************</p>
                <UTooltip :text="UI_TEXT.tooltips.editPassword">
                  <UButton
                    icon="i-heroicons-pencil"
                    variant="ghostDangerIconButton"
                    @click="profileStore.openChangePasswordModal()"
                  />
                </UTooltip>
              </div>
            </div>
            <!-- Registered -->
            <div :class="appConfig.layout.profileDetailRow">
              <p :class="appConfig.typography.profileLabel">
                {{ UI_TEXT.profile.registeredLabel }}
              </p>
              <div :class="appConfig.layout.actionGroup">
                <p :class="appConfig.typography.profileValue">
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
        <div :class="appConfig.layout.sectionWrapper">
          <div :class="appConfig.layout.pageHeader">
            <div :class="appConfig.layout.actionGroup">
              <!-- Filter popover -->
              <UPopover>
                <UTooltip :text="UI_TEXT.tooltips.filterDocuments">
                  <UButton
                    icon="i-heroicons-funnel"
                    :label="
                      filterType === 'ALL'
                        ? UI_TEXT.common.filter
                        : privateDocumentTypes.find((d) => d.value === filterType)?.label
                    "
                    variant="glassButton"
                  />
                </UTooltip>
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
              <UTooltip :text="UI_TEXT.tooltips.uploadDocument">
                <UButton
                  icon="i-heroicons-plus"
                  variant="glassIconButton"
                  @click="emit('upload')"
                />
              </UTooltip>
            </div>

            <h2 :class="appConfig.typography.sectionTitleTransparent">
              {{ UI_TEXT.profile.documentsHeading }}
            </h2>
            <div class="w-30 hidden md:block"></div>
          </div>

          <!-- Loading state -->
          <div v-if="isLoadingDocuments" :class="appConfig.typography.statusLoading">
            {{ ' ' + UI_TEXT.documents.loading + ' ' }}
          </div>

          <!-- Document Grid -->
          <div v-else-if="filteredDocuments.length > 0" :class="appConfig.layout.documentGrid">
            <UCard
              v-for="doc in filteredDocuments"
              :key="doc.file_id"
              variant="documentGlass"
              class="relative"
            >
              <!-- Title and action buttons -->
              <div :class="appConfig.layout.documentCardHeader">
                <p class="font-bold truncate pr-2 shadow-sm">{{ doc.file_name }}</p>
                <div :class="`flex items-center ${SPACING_TOKENS.gap.xs}`">
                  <UTooltip :text="UI_TEXT.profile.accessDetails">
                    <UButton
                      icon="i-heroicons-key"
                      variant="ghostBrandIconButton"
                      class="text-surface-500"
                      @click="emit('access', doc)"
                    />
                  </UTooltip>
                  <UTooltip :text="UI_TEXT.profile.share">
                    <UButton
                      icon="i-heroicons-share"
                      variant="ghostBrandIconButton"
                      class="text-surface-500"
                      @click.prevent="emit('share', doc)"
                    />
                  </UTooltip>
                  <UTooltip :text="UI_TEXT.tooltips.editDocument">
                    <UButton
                      icon="i-heroicons-pencil"
                      variant="ghostBrandIconButton"
                      class="text-surface-500"
                      @click="emit('edit', doc)"
                    />
                  </UTooltip>
                  <UTooltip :text="UI_TEXT.tooltips.deleteDocument">
                    <UButton
                      icon="i-heroicons-trash"
                      variant="ghostDangerIconButton"
                      class="text-surface-500"
                      @click="emit('delete', doc)"
                    />
                  </UTooltip>
                </div>
              </div>

              <!-- File Preview -->
              <div :class="appConfig.layout.documentCardImage">
                <UIcon name="i-heroicons-document-text" class="w-16 h-16 text-surface-500/50" />
                <div
                  :class="`absolute bottom-2 ${SPACING_TOKENS.px.md} w-full flex justify-between`"
                >
                  <UTooltip :text="UI_TEXT.tooltips.viewDocument">
                    <UButton
                      icon="i-heroicons-eye"
                      variant="ghostBrandIconButton"
                      class="text-dark-text/70"
                      @click.prevent="emit('view', doc)"
                    />
                  </UTooltip>
                  <UTooltip :text="UI_TEXT.tooltips.downloadDocument">
                    <UButton
                      icon="i-heroicons-arrow-down-tray"
                      variant="ghostBrandIconButton"
                      class="text-dark-text/70"
                      @click.prevent="emit('download', doc)"
                    />
                  </UTooltip>
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
  // the detailed profile information of the currently authenticated user
  currentUser: UserOutDto | null | undefined;
  // indicates whether the user profile data is currently being loaded
  isLoading: boolean;
  // the error object returned from a failed profile fetch attempt, if any
  error: ApiError | Error | null | undefined;
  // the list of private documents uploaded by or belonging to the user
  privateDocuments: PrivateDocumentMetadata[];
  // indicates whether the private documents are currently being loaded
  isLoadingDocuments: boolean;
  // a list of available document types for filtering or categorization,
  // formatted as label-value pairs
  privateDocumentTypes: { label: string; value: string }[];
  // reference to the profile store for managing profile-related modal states and actions
  profileStore: ReturnType<typeof useProfileStore>;
  // reference to the documents store for managing document-related modal states and actions
  documentsStore: ReturnType<typeof useDocumentsStore>;
}>();

/* --- EMITS --- */
const emit = defineEmits<{
  // triggers when the user initiates a new document upload process
  upload: [];
  // triggers when the user attempts to edit a specific document's metadata
  // [emit value]: doc: PrivateDocumentMetadata
  edit: [doc: PrivateDocumentMetadata];
  // triggers when the user attempts to delete a specific document
  // [emit value]: doc: PrivateDocumentMetadata
  delete: [doc: PrivateDocumentMetadata];
  // triggers when the user wants to preview or view a specific document
  // [emit value]: doc: PrivateDocumentMetadata
  view: [doc: PrivateDocumentMetadata];
  // triggers when the user initiates a download for a specific document
  // [emit value]: doc: PrivateDocumentMetadata
  download: [doc: PrivateDocumentMetadata];
  // triggers when the user attempts to share a specific document
  // [emit value]: doc: PrivateDocumentMetadata
  share: [doc: PrivateDocumentMetadata];
  // triggers when the user manages access rights and permissions for a specific document
  // [emit value]: doc: PrivateDocumentMetadata
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
