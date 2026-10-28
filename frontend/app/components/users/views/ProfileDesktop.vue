<!-- frontend/app/components/views/desktop/users/ProfileDesktop.vue -->
<template>
  <div :class="LAYOUT_CONFIG.pageWrapper">
    <div>
      <h1 :class="TYPOGRAPHY_CONFIG.pageTitle">{{ UI_TEXT.profile.heading }}</h1>
    </div>

    <ClientOnly>
      <div v-if="isLoading" :class="TYPOGRAPHY_CONFIG.statusLoading">
        {{ UI_TEXT.common.loading }}
      </div>
      <div v-else-if="error" :class="TYPOGRAPHY_CONFIG.statusError">
        {{ UI_TEXT.errors.fetch }}
      </div>

      <div v-else-if="currentUser" :class="LAYOUT_CONFIG.cardContent">
        <!-- PROFILE CARD SECTION -->
        <div :class="LAYOUT_CONFIG.profileCard">
          <div :class="LAYOUT_CONFIG.cardCornerRight">
            <BaseButton
              icon="i-heroicons-trash"
              variant="glassIconButtonDanger"
              :tooltip="UI_TEXT.tooltips.deleteProfile"
              @click="profileStore.openDeleteModal(currentUser)"
            />
          </div>

          <div :class="LAYOUT_CONFIG.profilePictureWrapper">
            <div :class="LAYOUT_CONFIG.profilePictureInner">
              <img
                v-if="currentUser.profile_image_url"
                :src="currentUser.profile_image_url"
                :alt="UI_TEXT.common.profile"
                :class="LAYOUT_CONFIG.mediaCoverImage"
              />
              <UIcon v-else name="i-heroicons-user" :class="TYPOGRAPHY_CONFIG.iconAvatarInverse" />

              <div :class="LAYOUT_CONFIG.profilePictureOverlay"></div>

              <div :class="LAYOUT_CONFIG.documentCardBottomActions">
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

          <!-- User details -->
          <div :class="LAYOUT_CONFIG.profileDetailsWrapper">
            <div :class="LAYOUT_CONFIG.profileDetailRow">
              <p :class="TYPOGRAPHY_CONFIG.profileLabel">{{ UI_TEXT.auth.usernameLabel }}</p>
              <div :class="[LAYOUT_CONFIG.flexBetween, LAYOUT_CONFIG.listCardInfo]">
                <p :class="TYPOGRAPHY_CONFIG.profileValue">{{ currentUser.username }}</p>
                <BaseButton
                  icon="i-heroicons-pencil"
                  variant="ghostDangerIconButton"
                  :tooltip="UI_TEXT.tooltips.editUsername"
                  @click="profileStore.openEditUsernameModal(currentUser)"
                />
              </div>
            </div>

            <div :class="LAYOUT_CONFIG.profileDetailRow">
              <p :class="TYPOGRAPHY_CONFIG.profileLabel">{{ UI_TEXT.auth.emailLabel }}</p>
              <div :class="[LAYOUT_CONFIG.flexBetween, LAYOUT_CONFIG.listCardInfo]">
                <p :class="TYPOGRAPHY_CONFIG.profileValue">{{ currentUser.email }}</p>
                <BaseButton
                  icon="i-heroicons-pencil"
                  variant="ghostDangerIconButton"
                  :tooltip="UI_TEXT.tooltips.editEmail"
                  @click="profileStore.openEditEmailModal(currentUser)"
                />
              </div>
            </div>

            <div :class="LAYOUT_CONFIG.profileDetailRow">
              <p :class="TYPOGRAPHY_CONFIG.profileLabel">{{ UI_TEXT.auth.passwordLabel }}</p>
              <div :class="[LAYOUT_CONFIG.flexBetween, LAYOUT_CONFIG.listCardInfo]">
                <p :class="TYPOGRAPHY_CONFIG.profileValueLg">************</p>
                <BaseButton
                  icon="i-heroicons-pencil"
                  variant="ghostDangerIconButton"
                  :tooltip="UI_TEXT.tooltips.editPassword"
                  @click="profileStore.openChangePasswordModal()"
                />
              </div>
            </div>

            <div :class="LAYOUT_CONFIG.profileDetailRow">
              <p :class="TYPOGRAPHY_CONFIG.profileLabel">
                {{ UI_TEXT.profile.registeredLabel }}
              </p>
              <div :class="[LAYOUT_CONFIG.flexBetween, LAYOUT_CONFIG.listCardInfo]">
                <p :class="TYPOGRAPHY_CONFIG.profileValue">
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
        <div :class="LAYOUT_CONFIG.sectionWrapper">
          <div :class="LAYOUT_CONFIG.pageHeader">
            <div :class="LAYOUT_CONFIG.headerActionLeft">
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

              <BaseButton
                icon="i-heroicons-plus"
                variant="glassIconButton"
                :tooltip="UI_TEXT.tooltips.uploadDocument"
                @click="emit('upload')"
              />
            </div>

            <h2 :class="TYPOGRAPHY_CONFIG.sectionTitleTransparent">
              {{ UI_TEXT.profile.documentsHeading }}
            </h2>
            <div :class="LAYOUT_CONFIG.headerActionRight"></div>
          </div>

          <div v-if="isLoadingDocuments" :class="TYPOGRAPHY_CONFIG.statusLoading">
            {{ ' ' + UI_TEXT.documents.loading + ' ' }}
          </div>

          <div v-else-if="filteredDocuments.length > 0" :class="LAYOUT_CONFIG.documentGrid">
            <BaseCard
              v-for="doc in filteredDocuments"
              :key="doc.file_id"
              variant="documentGlass"
              :class="LAYOUT_CONFIG.headerRelative"
            >
              <div :class="LAYOUT_CONFIG.documentCardHeader">
                <p :class="TYPOGRAPHY_CONFIG.documentHeaderTitle">{{ doc.file_name }}</p>
                <div :class="LAYOUT_CONFIG.headerTitleRow">
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

              <div :class="LAYOUT_CONFIG.documentCardImage">
                <UIcon
                  name="i-heroicons-document-text"
                  :class="TYPOGRAPHY_CONFIG.iconWatermarkLg"
                />
                <div :class="LAYOUT_CONFIG.documentCardBottomActions">
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

              <div :class="LAYOUT_CONFIG.documentCardMeta">
                <p>
                  {{ ' ' + UI_TEXT.common.uploadedAt + ' '
                  }}<span :class="TYPOGRAPHY_CONFIG.metaHighlight">
                    {{ new Date(doc.created_at).toLocaleDateString() }}
                  </span>
                </p>
                <p>
                  {{ ' ' + UI_TEXT.documents.documentType + ' '
                  }}<span :class="TYPOGRAPHY_CONFIG.metaHighlight">
                    {{ doc.documents?.document_type ?? UI_TEXT.common.notAvailable }}
                  </span>
                </p>

                <div :class="LAYOUT_CONFIG.divider"></div>

                <div :class="LAYOUT_CONFIG.flexBetween">
                  <p>
                    {{ ' ' + UI_TEXT.documents.fileType + ' '
                    }}<span :class="TYPOGRAPHY_CONFIG.metaHighlight">
                      {{ doc.mime_type?.split('/')[1] ?? UI_TEXT.common.unknown }}
                    </span>
                  </p>
                  <p>
                    {{ ' ' + UI_TEXT.documents.fileSize + ' '
                    }}<span :class="TYPOGRAPHY_CONFIG.metaHighlight">
                      {{ (doc.file_size / (1024 * 1024)).toFixed(2)
                      }}{{ ' ' + UI_TEXT.common.megabytes + ' ' }}</span
                    >
                  </p>
                </div>

                <div :class="LAYOUT_CONFIG.divider"></div>

                <p>
                  {{ ' ' + UI_TEXT.documents.issued + ' '
                  }}<span :class="TYPOGRAPHY_CONFIG.metaHighlight">
                    {{
                      doc.documents?.issue_date
                        ? new Date(doc.documents.issue_date).toLocaleDateString()
                        : UI_TEXT.common.notAvailable
                    }}
                  </span>
                </p>
                <p>
                  {{ ' ' + UI_TEXT.documents.ends + ' '
                  }}<span :class="TYPOGRAPHY_CONFIG.metaHighlight">
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

          <div v-else :class="TYPOGRAPHY_CONFIG.statusLoading">
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
import type { useProfileStore } from '~/stores/profile.modals.store';
import type { useDocumentsStore } from '~/stores/documents.modals.store';
import type { UserOutDto } from '~/types/user.type';
import type { ApiError } from '~/types/apiError.type';
import type { PrivateDocumentMetadata } from '~/types/files.type';

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
