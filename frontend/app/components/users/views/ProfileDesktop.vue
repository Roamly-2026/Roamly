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

      <div v-else-if="currentUser" :class="[CARD_CONFIG.slots.root, appConfig.layout.headerRelative]">
        <!-- PROFILE CARD SECTION -->
        <div :class="appConfig.layout.profileCard">
          <!-- Delete Button -->
          <div :class="appConfig.layout.cardCornerRight">
            <BaseButton
              icon="i-heroicons-trash"
              variant="glassIconButtonDanger"
              :tooltip="UI_TEXT.tooltips.deleteProfile"
              @click="profileStore.openDeleteModal(currentUser)"
            />
          </div>

          <!-- Profile picture -->
          <div :class="appConfig.layout.profilePictureWrapper">
            <div :class="appConfig.layout.profilePictureInner">
              <img
                v-if="currentUser.profile_image_url"
                :src="currentUser.profile_image_url"
                :alt="UI_TEXT.common.profile"
                :class="appConfig.layout.mediaCoverImage"
              />
              <UIcon
                v-else
                name="i-heroicons-user"
                :class="[SIZE_TOKENS.avatar.lg, COLOR_TOKENS.text.inverse]"
              />

              <div :class="appConfig.layout.profilePictureOverlay"></div>

              <div :class="appConfig.layout.documentCardBottomActions">
                <BaseButton
                  icon="i-heroicons-eye"
                  variant="ghostBrandIconButton"
                  :tooltip="UI_TEXT.tooltips.viewPicture"
                  @click="profileStore.openViewPictureModal(currentUser)"
                />

                <BaseButton
                  icon="i-heroicons-arrow-up-tray"
                  variant="ghostBrandIconButton"
                  :tooltip="UI_TEXT.tooltips.uploadPicture"
                  @click="profileStore.openUploadPictureModal()"
                />
              </div>
            </div>
          </div>

          <!-- Right side: user details -->
          <div :class="appConfig.layout.profileDetailsWrapper">
            <!-- Username -->
            <div :class="appConfig.layout.profileDetailRow">
              <p :class="appConfig.typography.profileLabel">{{ UI_TEXT.auth.usernameLabel }}</p>
              <div :class="appConfig.layout.actionGroup">
                <p :class="appConfig.typography.profileValue">{{ currentUser.username }}</p>
                <BaseButton
                  icon="i-heroicons-pencil"
                  variant="ghostDangerIconButton"
                  :tooltip="UI_TEXT.tooltips.editUsername"
                  @click="profileStore.openEditUsernameModal(currentUser)"
                />
              </div>
            </div>
            <!-- Email -->
            <div :class="appConfig.layout.profileDetailRow">
              <p :class="appConfig.typography.profileLabel">{{ UI_TEXT.auth.emailLabel }}</p>
              <div :class="appConfig.layout.actionGroup">
                <p :class="appConfig.typography.profileValue">{{ currentUser.email }}</p>
                <BaseButton
                  icon="i-heroicons-pencil"
                  variant="ghostDangerIconButton"
                  :tooltip="UI_TEXT.tooltips.editEmail"
                  @click="profileStore.openEditEmailModal(currentUser)"
                />
              </div>
            </div>
            <!-- Password -->
            <div :class="appConfig.layout.profileDetailRow">
              <p :class="appConfig.typography.profileLabel">{{ UI_TEXT.auth.passwordLabel }}</p>
              <div :class="appConfig.layout.actionGroup">
                <p :class="appConfig.typography.profileValueLg">************</p>
                <BaseButton
                  icon="i-heroicons-pencil"
                  variant="ghostDangerIconButton"
                  :tooltip="UI_TEXT.tooltips.editPassword"
                  @click="profileStore.openChangePasswordModal()"
                />
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
            <div :class="appConfig.calendar.headerActionLeft">
              <!-- Filter popover -->
              <UPopover>
                <BaseButton
                  icon="i-heroicons-funnel"
                  :label="
                    filterType === 'ALL'
                      ? UI_TEXT.common.filter
                      : privateDocumentTypes.find((d) => d.value === filterType)?.label
                  "
                  :tooltip="UI_TEXT.tooltips.filterDocuments"
                  variant="glassButton"
                />
                <template #content="{ close }">
                  <div :class="DROPDOWN_MENU_CONFIG.slots.content">
                    <BaseButton
                      variant="ghost"
                      :class="DROPDOWN_MENU_CONFIG.slots.item"
                      @click="
                        filterType = 'ALL';
                        close();
                      "
                    >
                      <template #leading>
                        <UIcon
                          :name="filterType === 'ALL' ? 'i-heroicons-check' : 'i-heroicons-funnel'"
                          :class="DROPDOWN_MENU_CONFIG.slots.itemLeadingIcon"
                        />
                      </template>
                      {{ UI_TEXT.common.allTypes }}
                    </BaseButton>
                    <BaseButton
                      v-for="type in privateDocumentTypes"
                      :key="type.value"
                      variant="ghost"
                      :class="DROPDOWN_MENU_CONFIG.slots.item"
                      @click="
                        filterType = type.value;
                        close();
                      "
                    >
                      <template #leading>
                        <UIcon
                          :name="
                            filterType === type.value ? 'i-heroicons-check' : 'i-heroicons-funnel'
                          "
                          :class="DROPDOWN_MENU_CONFIG.slots.itemLeadingIcon"
                        />
                      </template>
                      {{ type.label }}
                    </BaseButton>
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

            <h2 :class="appConfig.typography.sectionTitleTransparent">
              {{ UI_TEXT.profile.documentsHeading }}
            </h2>
            <div :class="appConfig.calendar.headerActionRight"></div>
          </div>

          <!-- Loading state -->
          <div v-if="isLoadingDocuments" :class="appConfig.typography.statusLoading">
            {{ ' ' + UI_TEXT.documents.loading + ' ' }}
          </div>

          <!-- Document Grid -->
          <div v-else-if="filteredDocuments.length > 0" :class="appConfig.layout.documentGrid">
            <BaseCard
              v-for="doc in filteredDocuments"
              :key="doc.file_id"
              variant="documentGlass"
              :class="appConfig.layout.headerRelative"
            >
              <!-- Title and action buttons -->
              <div :class="appConfig.layout.documentCardHeader">
                <p :class="[FONT_WEIGHTS.bold, TEXT_SIZES.sm, SPACING_TOKENS.pr.sm, 'truncate']">
                  {{ doc.file_name }}
                </p>
                <div :class="appConfig.calendar.headerTitleRow">
                  <BaseButton
                    icon="i-heroicons-key"
                    variant="ghostBrandIconButton"
                    :tooltip="UI_TEXT.profile.accessDetails"
                    @click="emit('access', doc)"
                  />
                  <BaseButton
                    icon="i-heroicons-share"
                    variant="ghostBrandIconButton"
                    :tooltip="UI_TEXT.profile.share"
                    @click.prevent="emit('share', doc)"
                  />
                  <BaseButton
                    icon="i-heroicons-pencil"
                    variant="ghostBrandIconButton"
                    :tooltip="UI_TEXT.tooltips.editDocument"
                    @click="emit('edit', doc)"
                  />
                  <BaseButton
                    icon="i-heroicons-trash"
                    variant="ghostDangerIconButton"
                    :tooltip="UI_TEXT.tooltips.deleteDocument"
                    @click="emit('delete', doc)"
                  />
                </div>
              </div>

              <!-- File Preview -->
              <div :class="appConfig.layout.documentCardImage">
                <UIcon
                  name="i-heroicons-document-text"
                  :class="[SIZE_TOKENS.avatar.lg, COLOR_TOKENS.text.primaryFaint]"
                />
                <div :class="appConfig.layout.documentCardBottomActions">
                  <BaseButton
                    icon="i-heroicons-eye"
                    variant="ghostBrandIconButton"
                    :class="COLOR_TOKENS.text.primaryMuted"
                    :tooltip="UI_TEXT.tooltips.viewDocument"
                    @click.prevent="emit('view', doc)"
                  />
                  <BaseButton
                    icon="i-heroicons-arrow-down-tray"
                    variant="ghostBrandIconButton"
                    :class="COLOR_TOKENS.text.primaryMuted"
                    :tooltip="UI_TEXT.tooltips.downloadDocument"
                    @click.prevent="emit('download', doc)"
                  />
                </div>
              </div>

              <!-- Metadata -->
              <div :class="appConfig.layout.documentCardMeta">
                <p>
                  {{ ' ' + UI_TEXT.common.uploadedAt + ' '
                  }}<span :class="[FONT_WEIGHTS.bold, COLOR_TOKENS.text.primary]">
                    {{ new Date(doc.created_at).toLocaleDateString() }}
                  </span>
                </p>
                <p>
                  {{ ' ' + UI_TEXT.documents.documentType + ' '
                  }}<span :class="[FONT_WEIGHTS.bold, COLOR_TOKENS.text.primary]">
                    {{ doc.documents?.document_type ?? UI_TEXT.common.notAvailable }}
                  </span>
                </p>

                <div :class="appConfig.layout.divider"></div>

                <div :class="appConfig.layout.flexBetween">
                  <p>
                    {{ ' ' + UI_TEXT.documents.fileType + ' '
                    }}<span :class="[FONT_WEIGHTS.bold, COLOR_TOKENS.text.primary]">
                      {{ doc.mime_type?.split('/')[1] ?? UI_TEXT.common.unknown }}
                    </span>
                  </p>
                  <p>
                    {{ ' ' + UI_TEXT.documents.fileSize + ' '
                    }}<span :class="[FONT_WEIGHTS.bold, COLOR_TOKENS.text.primary]">
                      {{ (doc.file_size / (1024 * 1024)).toFixed(2)
                      }}{{ ' ' + UI_TEXT.common.megabytes + ' ' }}</span
                    >
                  </p>
                </div>

                <div :class="appConfig.layout.divider"></div>

                <p>
                  {{ ' ' + UI_TEXT.documents.issued + ' '
                  }}<span :class="[FONT_WEIGHTS.bold, COLOR_TOKENS.text.primary]">
                    {{
                      doc.documents?.issue_date
                        ? new Date(doc.documents.issue_date).toLocaleDateString()
                        : UI_TEXT.common.notAvailable
                    }}
                  </span>
                </p>
                <p>
                  {{ ' ' + UI_TEXT.documents.ends + ' '
                  }}<span :class="[FONT_WEIGHTS.bold, COLOR_TOKENS.text.primary]">
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
import { computed, ref } from 'vue';
import { useAppConfig } from '#imports';
import type { useProfileStore } from '~/stores/profile.modals.store';
import type { useDocumentsStore } from '~/stores/documents.modals.store';
import type { UserOutDto } from '~/types/user.type';
import type { ApiError } from '~/types/apiError.type';
import type { PrivateDocumentMetadata } from '~/types/files.type';

const appConfig = useAppConfig();

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

const emit = defineEmits<{
  upload: [];
  edit: [doc: PrivateDocumentMetadata];
  delete: [doc: PrivateDocumentMetadata];
  view: [doc: PrivateDocumentMetadata];
  download: [doc: PrivateDocumentMetadata];
  share: [doc: PrivateDocumentMetadata];
  access: [doc: PrivateDocumentMetadata];
}>();

const filterType = ref('ALL');

const filteredDocuments = computed<PrivateDocumentMetadata[]>(() => {
  if (filterType.value === 'ALL') return props.privateDocuments;
  return props.privateDocuments.filter((doc) => doc.documents?.document_type === filterType.value);
});
</script>
