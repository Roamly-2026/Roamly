<!-- frontend/app/components/documents/modals/PrivateDocumentsModals.vue -->
<template>
  <div>
    <!-- ==================== -->
    <!-- UPLOAD DOCUMENT MODAL -->
    <!-- ==================== -->
    <BaseModal
      v-model:open="documentsStore.isPrivateUploadModalOpen"
      :title="UI_TEXT.documents.uploadPrivate"
      :ui-size="appConfig.layout.modalSizeMd"
    >
      <template #body>
        <UForm
          id="upload-private-doc-form"
          :schema="uploadDocumentSchema"
          :state="uploadForm"
          :class="appConfig.layout.modalForm"
          @submit="handleUpload"
        >
          <!-- Choose file -->
          <UFormField :label="UI_TEXT.documents.selectFile" name="file">
            <template #default="{ error: fieldError }">
              <UInput
                type="file"
                :variant="fieldError ? 'glassError' : 'glass'"
                icon="i-heroicons-document-arrow-up"
                @change="onFileChange"
              />
            </template>
          </UFormField>

          <!-- Document type -->
          <UFormField :label="UI_TEXT.documents.typeLabel" name="documentType">
            <template #default>
              <USelect
                v-model="uploadForm.documentType"
                :items="privateDocumentTypes"
                label-key="label"
                value-key="value"
                :placeholder="UI_TEXT.documents.selectType"
                :popper="{ strategy: 'fixed', placement: 'bottom-start' }"
                :ui="{ content: 'z-[10100]' }"
              />
            </template>
          </UFormField>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Issue date -->
            <UFormField :label="UI_TEXT.documents.issueDate" name="issueDate">
              <template #default="{ error: fieldError }">
                <UInput
                  v-model="uploadForm.issueDate"
                  type="date"
                  :variant="fieldError ? 'glassError' : 'glass'"
                />
              </template>
            </UFormField>

            <!-- Expiry date -->
            <UFormField :label="UI_TEXT.documents.expiryDate" name="expiryDate">
              <template #default="{ error: fieldError }">
                <UInput
                  v-model="uploadForm.expiryDate"
                  type="date"
                  :variant="fieldError ? 'glassError' : 'glass'"
                />
              </template>
            </UFormField>
          </div>

          <!-- Error Display -->
          <div v-if="uploadError" :class="appConfig.typography.formStatusError">
            {{ getErrorMessage(uploadError) }}
          </div>
        </UForm>
      </template>
      <template #footer>
        <div :class="appConfig.layout.flexBetween">
          <UButton
            :label="UI_TEXT.common.cancel"
            variant="actionCancelButton"
            :class="appConfig.typography.modalActionBtnCancel"
            @click="closeUploadModal"
          />
          <UButton
            type="submit"
            form="upload-private-doc-form"
            :label="UI_TEXT.common.upload"
            variant="actionOkButton"
            :class="appConfig.typography.modalActionBtnOk"
            :loading="uploadMutation.isLoading.value"
            :disabled="!uploadForm.file"
          />
        </div>
      </template>
    </BaseModal>

    <!-- ==================== -->
    <!-- UPDATE DOCUMENT MODAL -->
    <!-- ==================== -->
    <BaseModal
      v-model:open="documentsStore.isPrivateUpdateModalOpen"
      :title="UI_TEXT.documents.updatePrivate"
      :ui-size="appConfig.layout.modalSizeMd"
    >
      <template #body>
        <UForm
          id="update-private-doc-form"
          :schema="updateDocumentSchema"
          :state="updateForm"
          :class="appConfig.layout.modalForm"
          @submit="handleUpdate"
        >
          <!-- Current file name -->
          <div
            v-if="fileToUpdate"
            class="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-100/10 border border-surface-500/20"
          >
            <UIcon name="i-heroicons-document-text" class="w-4 h-4 text-surface-400 shrink-0" />
            <span class="text-sm text-surface-400 truncate">{{ fileToUpdate.fileName }}</span>
          </div>

          <!-- Replace file (optional) -->
          <UFormField :label="UI_TEXT.documents.replaceFile" name="file">
            <template #default="{ error: fieldError }">
              <UInput
                type="file"
                :variant="fieldError ? 'glassError' : 'glass'"
                icon="i-heroicons-document-arrow-up"
                @change="onUpdateFileChange"
              />
            </template>
          </UFormField>

          <!-- Document type -->
          <UFormField :label="UI_TEXT.documents.typeLabel" name="documentType">
            <template #default>
              <USelect
                v-model="updateForm.documentType"
                :items="privateDocumentTypes"
                label-key="label"
                value-key="value"
                :placeholder="UI_TEXT.documents.selectType"
                :popper="{ strategy: 'fixed', placement: 'bottom-start' }"
                :ui="{ content: 'z-[10100]' }"
              />
            </template>
          </UFormField>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Issue date -->
            <UFormField :label="UI_TEXT.documents.issueDate" name="issueDate">
              <template #default="{ error: fieldError }">
                <UInput
                  v-model="updateForm.issueDate"
                  type="date"
                  :variant="fieldError ? 'glassError' : 'glass'"
                />
              </template>
            </UFormField>

            <!-- Expiry date -->
            <UFormField :label="UI_TEXT.documents.expiryDate" name="expiryDate">
              <template #default="{ error: fieldError }">
                <UInput
                  v-model="updateForm.expiryDate"
                  type="date"
                  :variant="fieldError ? 'glassError' : 'glass'"
                />
              </template>
            </UFormField>
          </div>

          <!-- Error Display -->
          <div v-if="updateError" :class="appConfig.typography.formStatusError">
            {{ getErrorMessage(updateError) }}
          </div>
        </UForm>
      </template>
      <template #footer>
        <div :class="appConfig.layout.flexBetween">
          <UButton
            :label="UI_TEXT.common.cancel"
            variant="actionCancelButton"
            :class="appConfig.typography.modalActionBtnCancel"
            @click="closeUpdateModal"
          />
          <UButton
            type="submit"
            form="update-private-doc-form"
            :label="UI_TEXT.common.save"
            variant="actionOkButton"
            :class="appConfig.typography.modalActionBtnOk"
            :loading="isUpdating"
          />
        </div>
      </template>
    </BaseModal>

    <!-- ==================== -->
    <!-- DELETE DOCUMENT MODAL -->
    <!-- ==================== -->
    <ConfirmModal
      v-model:open="documentsStore.isPrivateDeleteModalOpen"
      :title="UI_TEXT.documents.deleteTitle"
      :error-text="deleteError ? getErrorMessage(deleteError) : ''"
      :cancel-text="UI_TEXT.common.cancel"
      :confirm-text="UI_TEXT.common.delete"
      :loading="deleteMutation.isLoading.value"
      :ui-size="appConfig.layout.modalSizeMd"
      @cancel="documentsStore.closePrivateDeleteModal()"
      @confirm="confirmDelete"
    >
      <template #body>
        <p :class="appConfig.typography.modalText">
          {{ ' ' + UI_TEXT.documents.deleteBeforeName + ' '
          }}<span :class="appConfig.typography.modalInlineHighlight">{{
            privateFileToDelete?.fileName
          }}</span
          >{{ UI_TEXT.documents.deleteAfterName + ' ' }}
        </p>
      </template>
    </ConfirmModal>

    <!-- ==================== -->
    <!-- SHARE DOCUMENT MODAL -->
    <!-- ==================== -->
    <BaseModal
      v-model:open="documentsStore.isPrivateShareModalOpen"
      :title="UI_TEXT.documents.share"
      :ui-size="appConfig.layout.modalSizeMd"
    >
      <template #body>
        <div :class="appConfig.calendar.participantModalScroll">
          <div
            v-for="group in unsharedGroups"
            :key="group.uuid"
            :class="appConfig.calendar.participantCard"
          >
            <div class="flex items-center justify-between w-full">
              <div class="flex items-center gap-5">
                <UAvatar
                  :alt="group.name"
                  icon="i-heroicons-user-group"
                  size="xl"
                  :class="appConfig.calendar.participantCardAvatar"
                />

                <div :class="appConfig.calendar.participantCardInfo">
                  <div class="flex items-center gap-1.5 mb-1.5">
                    <h4 :class="appConfig.calendar.participantCardName">{{ group.name }}</h4>
                  </div>
                  <div class="flex gap-1.5">
                    <UIcon name="i-heroicons-user-solid" class="w-5 h-5 text-brand-500 shrink-0" />
                    <h4 :class="appConfig.calendar.metaValue">{{ group.current_size }}</h4>
                  </div>
                </div>
              </div>
              <UTooltip
                :text="UI_TEXT.documents.shareWithGroup"
                :ui="{ content: 'z-[9999]' }"
                :popper="{ placement: 'top', strategy: 'fixed' }"
              >
                <UButton
                  icon="i-heroicons-share"
                  variant="ghostBrandIconButton"
                  class="text-dark-text/70"
                  :loading="shareMutation.isLoading.value"
                  @click="handleShareDocument(group.uuid)"
                />
              </UTooltip>
            </div>
          </div>
          <div v-if="!unsharedGroups?.length" class="text-sm font-medium text-dark-text/50 p-4">
            {{ ' ' + UI_TEXT.documents.noAvailableGroups + ' ' }}
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end w-full">
          <UButton
            :label="UI_TEXT.common.close"
            variant="actionOkButton"
            :class="appConfig.typography.modalActionBtnCancel"
            @click="documentsStore.closePrivateShareModal()"
          />
        </div>
      </template>
    </BaseModal>

    <!-- ==================== -->
    <!-- VIEW ACCESS MODAL -->
    <!-- ==================== -->
    <BaseModal
      v-model:open="documentsStore.isPrivateAccessModalOpen"
      :title="UI_TEXT.documents.access"
      :ui-size="appConfig.layout.modalSizeMd"
    >
      <template #body>
        <div :class="appConfig.calendar.participantModalScroll">
          <div
            v-for="share in sharedGroups"
            :key="share.groups.name"
            :class="appConfig.calendar.participantCard"
          >
            <div class="flex items-center justify-between w-full">
              <div class="flex items-center gap-5">
                <UAvatar
                  :alt="share.groups.name"
                  icon="i-heroicons-user-group"
                  size="xl"
                  :class="appConfig.calendar.participantCardAvatar"
                />

                <div :class="appConfig.calendar.participantCardInfo">
                  <div class="flex items-center gap-1.5">
                    <h4 :class="appConfig.calendar.participantCardName">{{ share.groups.name }}</h4>
                  </div>
                  <p :class="appConfig.calendar.participantCardEmail">
                    {{ ' ' + UI_TEXT.documents.sharedAt + ' '
                    }}{{ new Date(share.shared_at).toLocaleDateString() }}
                  </p>
                </div>
              </div>
              <UTooltip
                :text="UI_TEXT.documents.revokeAccess"
                :ui="{ content: 'z-[9999]' }"
                :popper="{ placement: 'top', strategy: 'fixed' }"
              >
                <UButton
                  icon="i-heroicons-x-mark"
                  variant="ghostDangerIconButton"
                  :loading="revokeMutation.isLoading.value"
                  @click="handleRevokeAccess(share.groups.name)"
                />
              </UTooltip>
            </div>
          </div>
          <div v-if="!sharedGroups?.length" class="text-sm font-medium text-dark-text/50 p-4">
            {{ ' ' + UI_TEXT.documents.notShared + ' ' }}
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end w-full">
          <UButton
            :label="UI_TEXT.common.close"
            variant="actionOkButton"
            :class="appConfig.typography.modalActionBtnCancel"
            @click="documentsStore.closePrivateAccessModal()"
          />
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { useAppConfig, useToast } from '#imports';
import { computed, reactive, ref, watch } from 'vue';
import { useQueryCache } from '@pinia/colada';
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';
import { useDocumentsStore } from '~/stores/documents.modals.store';
import {
  useUploadPrivateDocumentMutation,
  useDeletePrivateDocumentMutation,
  useShareDocumentMutation,
  useDeleteSharingMutation,
} from '~/queries/files.mutation';
import { filesService } from '~/services/files.service';
import { getErrorMessage } from '~/utils/error.utils';
import type { ApiError } from '~/types/apiError.type';
import type { FileShareDto } from '~/types/files.type';
import type { GroupOutDto } from '~/types/groups.type';

const props = defineProps<{
  // a list of available document types for categorization, formatted as label-value pairs
  privateDocumentTypes?: { label: string; value: string }[];
  // a list of groups that currently have access to the selected private document
  sharedGroups?: FileShareDto[];
  // a list of groups that currently do not have access to the document, available for new sharing
  unsharedGroups?: GroupOutDto[];
  // the complete list of groups the user belongs to
  allGroups?: GroupOutDto[];
}>();

const appConfig = useAppConfig();
const documentsStore = useDocumentsStore();
const queryCache = useQueryCache();
const toast = useToast();

const uploadError = ref<ApiError | Error | null>(null);
const updateError = ref<ApiError | Error | null>(null);
const deleteError = ref<ApiError | Error | null>(null);
const isUpdating = ref(false);

const privateFileToShare = computed(() => documentsStore.privateFileToShare);
const privateFileToViewAccess = computed(() => documentsStore.privateFileToViewAccess);

// -------------------------
// UPLOAD LOGIC
// -------------------------

const uploadDocumentSchema = z.object({
  file: z.any().refine((val) => val instanceof File, {
    message: UI_TEXT.validation.selectFile,
  }),
  documentType: z.string().min(1, UI_TEXT.validation.selectDocumentType),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),
});

type UploadFormState = z.infer<typeof uploadDocumentSchema>;

const uploadForm = reactive<UploadFormState>({
  file: null,
  documentType: '',
  issueDate: '',
  expiryDate: '',
});

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  uploadForm.file = target.files?.[0] ?? null;
};

// Keep the full mutation object — never destructure isLoading out of it
const uploadMutation = useUploadPrivateDocumentMutation({
  onSuccess: () => {
    uploadError.value = null;
    closeUploadModal();
  },
  onError: (err) => {
    uploadError.value = err as Error;
  },
});

const closeUploadModal = () => {
  documentsStore.closePrivateUploadModal();
  uploadForm.file = null;
  uploadForm.documentType = '';
  uploadForm.issueDate = '';
  uploadForm.expiryDate = '';
  uploadError.value = null;
};

const handleUpload = (event: FormSubmitEvent<UploadFormState>) => {
  uploadError.value = null;

  const formData = new FormData();
  formData.append('file', event.data.file);
  if (event.data.documentType) formData.append('document_type', event.data.documentType);
  if (event.data.issueDate) formData.append('issue_date', event.data.issueDate);
  if (event.data.expiryDate) formData.append('expiry_date', event.data.expiryDate);

  uploadMutation.mutate(formData);
};

// -------------------------
// UPDATE LOGIC
// -------------------------

const updateDocumentSchema = z.object({
  file: z.any().optional(),
  documentType: z.string().min(1, UI_TEXT.validation.selectDocumentType),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),
});

type UpdateFormState = z.infer<typeof updateDocumentSchema>;

const updateForm = reactive<UpdateFormState>({
  file: null,
  documentType: '',
  issueDate: '',
  expiryDate: '',
});

const fileToUpdate = computed(() => documentsStore.privateFileToUpdate);

// Pre-fill the update form when the modal opens
watch(
  () => documentsStore.privateFileToUpdate,
  (file) => {
    if (file) {
      updateForm.file = null;
      updateForm.documentType = file.documentType ?? '';
      updateForm.issueDate = file.issueDate ?? '';
      updateForm.expiryDate = file.expiryDate ?? '';
    }
  },
);

const onUpdateFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  updateForm.file = target.files?.[0] ?? null;
};

const closeUpdateModal = () => {
  documentsStore.closePrivateUpdateModal();
  updateForm.file = null;
  updateForm.documentType = '';
  updateForm.issueDate = '';
  updateForm.expiryDate = '';
  updateError.value = null;
};

const handleUpdate = async (event: FormSubmitEvent<UpdateFormState>) => {
  if (!fileToUpdate.value) return;
  updateError.value = null;
  isUpdating.value = true;

  try {
    const formData = new FormData();
    if (event.data.file instanceof File) formData.append('file', event.data.file);
    if (event.data.documentType) formData.append('document_type', event.data.documentType);
    if (event.data.issueDate) formData.append('issue_date', event.data.issueDate);
    if (event.data.expiryDate) formData.append('expiry_date', event.data.expiryDate);

    await filesService.replacePrivateDocument(fileToUpdate.value.fileId, formData);
    queryCache.invalidateQueries({ key: ['private-documents'] });

    toast.add({
      title: UI_TEXT.common.success,
      description: UI_TEXT.documents.updated,
      color: 'success',
    });

    closeUpdateModal();
  } catch (err) {
    updateError.value = err as Error;

    toast.add({
      title: UI_TEXT.common.error,
      description: getErrorMessage(err),
      color: 'error',
    });
  } finally {
    isUpdating.value = false;
  }
};

// -------------------------
// DELETE LOGIC
// -------------------------

const privateFileToDelete = computed(() => documentsStore.privateFileToDelete);

const deleteMutation = useDeletePrivateDocumentMutation({
  onSuccess: () => {
    deleteError.value = null;
    documentsStore.closePrivateDeleteModal();
  },
  onError: (err) => {
    deleteError.value = err as Error;
  },
});

const confirmDelete = () => {
  if (!privateFileToDelete.value) return;
  deleteError.value = null;
  deleteMutation.mutate(privateFileToDelete.value.fileId);
};

// -------------------------
// SHARING & ACCESS LOGIC
// -------------------------
const shareMutation = useShareDocumentMutation();

const handleShareDocument = (groupUuid: string) => {
  if (!privateFileToShare.value) return;

  shareMutation.mutate({
    fileId: privateFileToShare.value.fileId,
    groupUuid,
    accessLevel: 'leader', // Default érték
  });
};

const revokeMutation = useDeleteSharingMutation();

const handleRevokeAccess = (groupName: string) => {
  if (!privateFileToViewAccess.value) return;

  // UUID kinyerése a név alapján a teljes csoportlistából
  const groupUuid = props.allGroups?.find((g) => g.name === groupName)?.uuid;

  if (!groupUuid) {
    toast.add({ title: UI_TEXT.common.error, description: UI_TEXT.errors.groupUuidNotFound });
    return;
  }

  revokeMutation.mutate({
    fileId: privateFileToViewAccess.value.fileId,
    groupUuid,
  });
};
</script>
