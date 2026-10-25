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
          <BaseInput
            :label="UI_TEXT.documents.selectFile"
            name="file"
            type="file"
            icon="i-heroicons-document-arrow-up"
            @change="onFileChange"
          />

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
            <BaseInput
              v-model="uploadForm.issueDate"
              :label="UI_TEXT.documents.issueDate"
              name="issueDate"
              type="date"
            />

            <!-- Expiry date -->
            <BaseInput
              v-model="uploadForm.expiryDate"
              :label="UI_TEXT.documents.expiryDate"
              name="expiryDate"
              type="date"
            />
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
          <BaseInput
            :label="UI_TEXT.documents.replaceFile"
            name="file"
            type="file"
            icon="i-heroicons-document-arrow-up"
            @change="onUpdateFileChange"
          />

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
            <BaseInput
              v-model="updateForm.issueDate"
              :label="UI_TEXT.documents.issueDate"
              name="issueDate"
              type="date"
            />

            <!-- Expiry date -->
            <BaseInput
              v-model="updateForm.expiryDate"
              :label="UI_TEXT.documents.expiryDate"
              name="expiryDate"
              type="date"
            />
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
} from '~/queries/files.mutation';
import { filesService } from '~/services/files.service';
import { getErrorMessage } from '~/utils/error.utils';
import type { ApiError } from '~/types/apiError.type';

defineProps<{
  privateDocumentTypes?: { label: string; value: string }[];
}>();

const appConfig = useAppConfig();
const documentsStore = useDocumentsStore();
const queryCache = useQueryCache();
const toast = useToast();

const uploadError = ref<ApiError | Error | null>(null);
const updateError = ref<ApiError | Error | null>(null);
const deleteError = ref<ApiError | Error | null>(null);
const isUpdating = ref(false);

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
</script>
