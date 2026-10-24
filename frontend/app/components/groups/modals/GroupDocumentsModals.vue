<!-- frontend/app/components/groups/modals/GroupDocumentsModals.vue -->
<template>
  <div>
    <!-- ==================== -->
    <!-- UPLOAD DOCUMENT MODAL -->
    <!-- ==================== -->
    <UModal
      v-model:open="documentsStore.isUploadModalOpen"
      :dismissible="false"
      :close="false"
      :ui="{ content: appConfig.layout.modalSizeMd }"
    >
      <template #default><div class="hidden"></div></template>
      <template #close><div class="hidden"></div></template>
      <template #header>
        <h3 class="text-xl font-bold text-dark-text">
          {{ UI_TEXT.documents.uploadTitle }}
        </h3>
      </template>
      <template #body>
        <UForm
          :schema="uploadDocumentSchema"
          :state="uploadForm"
          :class="appConfig.layout.modalForm"
          @submit="handleUpload"
        >
          <!-- Choose file -->
          <UFormField
            :label="UI_TEXT.documents.selectFileWithSpace + UI_TEXT.documents.acceptedFormats"
            name="file"
          >
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
                :items="documentTypes"
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

            <!-- Expire date -->
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

          <!-- Buttons -->
          <div :class="[appConfig.layout.flexBetween, 'mt-4']">
            <BaseButton
              :label="UI_TEXT.common.cancel"
              variant="actionCancelButton"
              :class="appConfig.typography.modalActionBtnCancel"
              @click="closeUploadModal"
            />
            <BaseButton
              type="submit"
              :label="UI_TEXT.common.upload"
              variant="actionOkButton"
              :class="appConfig.typography.modalActionBtnOk"
              :loading="uploadMutation.isLoading.value"
              :disabled="!uploadForm.file"
            />
          </div>
        </UForm>
      </template>
    </UModal>

    <!-- ==================== -->
    <!-- UPDATE DOCUMENT MODAL -->
    <!-- ==================== -->
    <UModal
      v-model:open="documentsStore.isGroupUpdateModalOpen"
      :dismissible="false"
      :close="false"
      :ui="{ content: appConfig.layout.modalSizeMd }"
    >
      <template #default><div class="hidden"></div></template>
      <template #close><div class="hidden"></div></template>
      <template #header>
        <h3 class="text-xl font-bold text-dark-text">{{ UI_TEXT.documents.updateGroup }}</h3>
      </template>
      <template #body>
        <UForm
          :schema="updateDocumentSchema"
          :state="updateForm"
          :class="appConfig.layout.modalForm"
          @submit="handleUpdate"
        >
          <!-- Current file name -->
          <div
            v-if="groupFileToUpdate"
            class="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-100/10 border border-surface-500/20"
          >
            <UIcon name="i-heroicons-document-text" class="w-4 h-4 text-surface-400 shrink-0" />
            <span class="text-sm text-surface-400 truncate">{{ groupFileToUpdate.fileName }}</span>
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
                :items="documentTypes"
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

          <!-- Buttons -->
          <div :class="[appConfig.layout.flexBetween, 'mt-4']">
            <BaseButton
              :label="UI_TEXT.common.cancel"
              variant="actionCancelButton"
              :class="appConfig.typography.modalActionBtnCancel"
              @click="closeUpdateModal"
            />
            <BaseButton
              type="submit"
              :label="UI_TEXT.common.save"
              variant="actionOkButton"
              :class="appConfig.typography.modalActionBtnOk"
              :loading="updateMutation.isLoading.value"
            />
          </div>
        </UForm>
      </template>
    </UModal>

    <!-- ==================== -->
    <!-- DELETE DOCUMENT MODAL -->
    <!-- ==================== -->
    <UModal
      v-model:open="documentsStore.isDeleteModalOpen"
      :dismissible="false"
      :close="false"
      :ui="{ content: appConfig.layout.modalSizeMd }"
    >
      <template #default><div class="hidden"></div></template>
      <template #close><div class="hidden"></div></template>
      <template #header>
        <h3 class="text-xl font-bold text-dark-text">
          {{ UI_TEXT.documents.deleteTitle }}
        </h3>
      </template>
      <template #body>
        <p :class="appConfig.typography.modalText">
          {{ UI_TEXT.documents.deleteDocumentBeforeName }}
          <span :class="appConfig.typography.modalInlineHighlight">{{
            fileToDelete?.fileName
          }}</span
          >{{ UI_TEXT.documents.cannotUndoSuffix }}
        </p>

        <!-- Delete Error Display -->
        <div v-if="deleteError" :class="[appConfig.typography.formStatusError, 'mt-2']">
          {{ getErrorMessage(deleteError) }}
        </div>
      </template>
      <template #footer>
        <div :class="appConfig.layout.flexBetween">
          <BaseButton
            :label="UI_TEXT.common.cancel"
            variant="actionCancelButton"
            :class="appConfig.typography.modalActionBtnCancel"
            @click="documentsStore.closeDeleteModal()"
          />
          <BaseButton
            :label="UI_TEXT.common.delete"
            variant="actionOkButton"
            class="bg-error-500 hover:bg-error-600 text-white"
            :class="appConfig.typography.modalActionBtnOk"
            :loading="deleteMutation.isLoading.value"
            @click="confirmDelete"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { useAppConfig, useToast } from '#imports';
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
  documentTypes?: { label: string; value: string }[];
}>();

const appConfig = useAppConfig();
const documentsStore = useDocumentsStore();
const toast = useToast();

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
    toast.add({ title: UI_TEXT.common.success, description: UI_TEXT.documents.uploaded });
    closeUploadModal();
  },
  onError: (err: Error) => {
    uploadError.value = err;
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
    toast.add({ title: UI_TEXT.common.success, description: UI_TEXT.documents.updated });
    closeUpdateModal();
  },
  onError: (err: Error) => {
    updateError.value = err;
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
    toast.add({ title: UI_TEXT.common.success, description: UI_TEXT.documents.deleted });
  },
  onError: (err: Error) => {
    deleteError.value = err;
  },
});

const confirmDelete = () => {
  if (!fileToDelete.value) return;
  deleteError.value = null;
  deleteMutation.mutate(fileToDelete.value.fileId);
};
</script>
