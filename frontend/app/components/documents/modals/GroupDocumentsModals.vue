<!-- frontend/app/components/documents/modals/GroupDocumentsModals.vue -->
<template>
  <div>
    <!-- UPLOAD DOCUMENT MODAL -->
    <BaseModal
      v-model:open="documentsStore.isUploadModalOpen"
      :title="UI_TEXT.documents.uploadTitle"
      :ui-size="LAYOUT_CONFIG.modalSizeMd"
    >
      <template #body>
        <UForm
          id="upload-group-doc-form"
          :schema="uploadDocumentSchema"
          :state="uploadForm"
          :class="LAYOUT_CONFIG.modalForm"
          @submit="handleUpload"
        >
          <BaseInput
            :label="UI_TEXT.documents.selectFileWithSpace + UI_TEXT.documents.acceptedFormats"
            name="file"
            type="file"
            icon="i-heroicons-document-arrow-up"
            @change="onFileChange"
          />

          <UFormField :label="UI_TEXT.documents.typeLabel" name="documentType">
            <template #default>
              <USelect
                v-model="uploadForm.documentType"
                :items="documentTypes"
                label-key="label"
                value-key="value"
                :placeholder="UI_TEXT.documents.selectType"
                :popper="{ strategy: 'fixed', placement: 'bottom-start' }"
                :ui="{ content: Z_INDEX_TOKENS.modal }"
              />
            </template>
          </UFormField>

          <div :class="LAYOUT_CONFIG.modalFormGrid2Col">
            <BaseInput
              v-model="uploadForm.issueDate"
              :label="UI_TEXT.documents.issueDate"
              name="issueDate"
              type="date"
            />
            <BaseInput
              v-model="uploadForm.expiryDate"
              :label="UI_TEXT.documents.expiryDate"
              name="expiryDate"
              type="date"
            />
          </div>

          <div v-if="uploadError" :class="TYPOGRAPHY_CONFIG.formStatusError">
            {{ getErrorMessage(uploadError) }}
          </div>
        </UForm>
      </template>
      <template #footer>
        <div :class="LAYOUT_CONFIG.flexBetween">
          <BaseButton
            :label="UI_TEXT.common.cancel"
            variant="actionCancelButton"
            :class="TYPOGRAPHY_CONFIG.modalActionBtnCancel"
            @click="closeUploadModal"
          />
          <BaseButton
            type="submit"
            form="upload-group-doc-form"
            :label="UI_TEXT.common.upload"
            :class="TYPOGRAPHY_CONFIG.modalActionBtnOk"
            :loading="uploadMutation.isLoading.value"
            :disabled="!uploadForm.file"
          />
        </div>
      </template>
    </BaseModal>

    <!-- UPDATE DOCUMENT MODAL -->
    <BaseModal
      v-model:open="documentsStore.isGroupUpdateModalOpen"
      :title="UI_TEXT.documents.updateGroup"
      :ui-size="LAYOUT_CONFIG.modalSizeMd"
    >
      <template #body>
        <UForm
          id="update-group-doc-form"
          :schema="updateDocumentSchema"
          :state="updateForm"
          :class="LAYOUT_CONFIG.modalForm"
          @submit="handleUpdate"
        >
          <div v-if="groupFileToUpdate" :class="LAYOUT_CONFIG.filePreviewChip">
            <UIcon name="i-heroicons-document-text" :class="TYPOGRAPHY_CONFIG.iconMutedSm" />
            <span :class="TYPOGRAPHY_CONFIG.bodySmMutedTruncate">{{
              groupFileToUpdate.fileName
            }}</span>
          </div>

          <BaseInput
            :label="UI_TEXT.documents.replaceFile"
            name="file"
            type="file"
            icon="i-heroicons-document-arrow-up"
            @change="onUpdateFileChange"
          />

          <UFormField :label="UI_TEXT.documents.typeLabel" name="documentType">
            <template #default>
              <USelect
                v-model="updateForm.documentType"
                :items="documentTypes"
                label-key="label"
                value-key="value"
                :placeholder="UI_TEXT.documents.selectType"
                :popper="{ strategy: 'fixed', placement: 'bottom-start' }"
                :ui="{ content: Z_INDEX_TOKENS.modal }"
              />
            </template>
          </UFormField>

          <div :class="LAYOUT_CONFIG.modalFormGrid2Col">
            <BaseInput
              v-model="updateForm.issueDate"
              :label="UI_TEXT.documents.issueDate"
              name="issueDate"
              type="date"
            />
            <BaseInput
              v-model="updateForm.expiryDate"
              :label="UI_TEXT.documents.expiryDate"
              name="expiryDate"
              type="date"
            />
          </div>

          <div v-if="updateError" :class="TYPOGRAPHY_CONFIG.formStatusError">
            {{ getErrorMessage(updateError) }}
          </div>
        </UForm>
      </template>
      <template #footer>
        <div :class="LAYOUT_CONFIG.flexBetween">
          <BaseButton
            :label="UI_TEXT.common.cancel"
            variant="actionCancelButton"
            :class="TYPOGRAPHY_CONFIG.modalActionBtnCancel"
            @click="closeUpdateModal"
          />
          <BaseButton
            type="submit"
            form="update-group-doc-form"
            :label="UI_TEXT.common.save"
            :class="TYPOGRAPHY_CONFIG.modalActionBtnOk"
            :loading="updateMutation.isLoading.value"
          />
        </div>
      </template>
    </BaseModal>

    <!-- DELETE DOCUMENT MODAL -->
    <ConfirmModal
      v-model:open="documentsStore.isDeleteModalOpen"
      :title="UI_TEXT.documents.deleteTitle"
      :error-text="deleteError ? getErrorMessage(deleteError) : ''"
      :cancel-text="UI_TEXT.common.cancel"
      :confirm-text="UI_TEXT.common.delete"
      :loading="deleteMutation.isLoading.value"
      :ui-size="LAYOUT_CONFIG.modalSizeMd"
      @cancel="documentsStore.closeDeleteModal()"
      @confirm="confirmDelete"
    >
      <template #body>
        <p :class="TYPOGRAPHY_CONFIG.modalText">
          {{ UI_TEXT.documents.deleteDocumentBeforeName }}
          <span :class="TYPOGRAPHY_CONFIG.modalInlineHighlight">{{ fileToDelete?.fileName }}</span
          >{{ UI_TEXT.documents.cannotUndoSuffix }}
        </p>
      </template>
    </ConfirmModal>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';
import { useDocumentsStore } from '~/stores/documents.modals.store';
import {
  useDeleteGroupFileMutation,
  useUpdateGroupDocumentMutation,
  useUploadGroupDocumentMutation,
} from '~/queries/files.mutation';
import { getErrorMessage } from '~/utils/error.utils';
import type { ApiError } from '~/types/apiError.type';

defineProps<{
  // a list of available document types for categorization, formatted as label-value pairs
  documentTypes?: { label: string; value: string }[];
}>();

const documentsStore = useDocumentsStore();

const uploadError = ref<ApiError | Error | null>(null);
const updateError = ref<ApiError | Error | null>(null);
const deleteError = ref<ApiError | Error | null>(null);

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

const uploadGroupUuidRef = computed(() => documentsStore.uploadGroupUuid || undefined);

// Keep the full mutation object — never destructure isLoading out of it
const uploadMutation = useUploadGroupDocumentMutation(uploadGroupUuidRef, {
  onSuccess: () => {
    uploadError.value = null;
    closeUploadModal();
  },
  onError: (err) => {
    uploadError.value = err as Error;
  },
});

const closeUploadModal = () => {
  documentsStore.closeUploadModal();
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

const groupFileToUpdate = computed(() => documentsStore.groupFileToUpdate);

const updateGroupUuidRef = computed(() => documentsStore.groupFileToUpdate?.groupUuid);

// Pre-fill the update form when the modal opens
watch(
  () => documentsStore.groupFileToUpdate,
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
  documentsStore.closeGroupUpdateModal();
  updateForm.file = null;
  updateForm.documentType = '';
  updateForm.issueDate = '';
  updateForm.expiryDate = '';
  updateError.value = null;
};

const updateMutation = useUpdateGroupDocumentMutation(updateGroupUuidRef, {
  onSuccess: () => {
    updateError.value = null;
    closeUpdateModal();
  },
  onError: (err) => {
    updateError.value = err as Error;
  },
});

const handleUpdate = (event: FormSubmitEvent<UpdateFormState>) => {
  if (!groupFileToUpdate.value) return;
  updateError.value = null;

  const formData = new FormData();
  if (event.data.file instanceof File) formData.append('file', event.data.file);
  if (event.data.documentType) formData.append('document_type', event.data.documentType);
  if (event.data.issueDate) formData.append('issue_date', event.data.issueDate);
  if (event.data.expiryDate) formData.append('expiry_date', event.data.expiryDate);

  updateMutation.mutate({ fileId: groupFileToUpdate.value.fileId, formData });
};

// -------------------------
// DELETE LOGIC
// -------------------------

const fileToDelete = computed(() => documentsStore.fileToDelete);

const deleteGroupUuidRef = computed(() => documentsStore.fileToDelete?.groupUuid);

const deleteMutation = useDeleteGroupFileMutation(deleteGroupUuidRef, {
  onSuccess: () => {
    deleteError.value = null;
    documentsStore.closeDeleteModal();
  },
  onError: (err) => {
    deleteError.value = err as Error;
  },
});

const confirmDelete = () => {
  if (!fileToDelete.value) return;
  deleteError.value = null;
  deleteMutation.mutate(fileToDelete.value.fileId);
};
</script>
