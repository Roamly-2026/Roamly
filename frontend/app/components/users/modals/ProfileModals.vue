<!-- frontend/app/components/users/modals/ProfileModals.vue -->
<template>
  <div>
    <!-- EDIT USERNAME MODAL -->
    <FormModal
      v-model:open="profileStore.isEditUsernameModalOpen"
      :title="UI_TEXT.profile.editUsernameTitle"
      form-id="edit-username-form"
      :cancel-text="UI_TEXT.common.cancel"
      :submit-text="UI_TEXT.common.save"
      :loading="isUpdatingProfile"
      :ui-size="appConfig.layout.modalSizeSm"
      @cancel="profileStore.closeEditUsernameModal()"
      @submit="handleUpdateUsername"
    >
      <div>
        <label :class="appConfig.typography.inputLabel">{{ UI_TEXT.auth.usernameLabel }}</label>
        <UInput v-model="editFormData.username" variant="glass" class="w-full" />
        <p v-if="usernameError" :class="appConfig.typography.inputError">{{ usernameError }}</p>
      </div>
    </FormModal>

    <!-- EDIT EMAIL MODAL -->
    <FormModal
      v-model:open="profileStore.isEditEmailModalOpen"
      :title="UI_TEXT.profile.editEmailTitle"
      form-id="edit-email-form"
      :cancel-text="UI_TEXT.common.cancel"
      :submit-text="UI_TEXT.common.save"
      :loading="isUpdatingProfile"
      :ui-size="appConfig.layout.modalSizeSm"
      @cancel="profileStore.closeEditEmailModal()"
      @submit="handleUpdateEmail"
    >
      <div>
        <label :class="appConfig.typography.inputLabel">{{ UI_TEXT.auth.emailLabel }}</label>
        <UInput v-model="editFormData.email" type="email" variant="glass" class="w-full" />
        <p v-if="emailError" :class="appConfig.typography.inputError">{{ emailError }}</p>
      </div>
    </FormModal>

    <!-- CHANGE PASSWORD MODAL -->
    <FormModal
      v-model:open="profileStore.isChangePasswordModalOpen"
      :title="UI_TEXT.profile.changePasswordTitle"
      form-id="change-pwd-form"
      :cancel-text="UI_TEXT.common.cancel"
      :submit-text="UI_TEXT.common.save"
      :loading="isChangingPwd"
      :ui-size="appConfig.layout.modalSizeSm"
      @cancel="profileStore.closeChangePasswordModal()"
      @submit="handleChangePassword"
    >
      <div>
        <label :class="appConfig.typography.inputLabel">{{
          UI_TEXT.profile.oldPasswordLabel
        }}</label>
        <UInput v-model="pwdData.oldPassword" type="password" variant="glass" class="w-full" />
      </div>
      <div>
        <label :class="appConfig.typography.inputLabel">{{
          UI_TEXT.profile.newPasswordLabel
        }}</label>
        <UInput v-model="pwdData.newPassword" type="password" variant="glass" class="w-full" />
      </div>
      <p v-if="passwordError" :class="appConfig.typography.inputError">{{ passwordError }}</p>
    </FormModal>

    <!-- DELETE ACCOUNT MODAL -->
    <ConfirmModal
      v-model:open="profileStore.isDeleteModalOpen"
      :title="UI_TEXT.profile.deleteAccountTitle"
      :error-text="deleteError"
      :cancel-text="UI_TEXT.common.cancel"
      :confirm-text="UI_TEXT.common.delete"
      :loading="isDeleting"
      :ui-size="appConfig.layout.modalSizeSm"
      @cancel="profileStore.closeDeleteModal()"
      @confirm="handleDeleteProfile"
    >
      <template #body>
        <p :class="appConfig.typography.modalText">
          {{ UI_TEXT.profile.deleteAccountConfirmation }}
        </p>
      </template>
    </ConfirmModal>

    <!-- UPLOAD PICTURE MODAL -->
    <BaseModal
      v-model:open="profileStore.isUploadPictureModalOpen"
      :title="UI_TEXT.profile.uploadPictureTitle"
      :ui-size="appConfig.layout.modalSizeSm"
    >
      <template #body>
        <form
          id="upload-pic-form"
          :class="appConfig.layout.modalForm"
          @submit.prevent="handleUploadPicture"
        >
          <div>
            <label :class="appConfig.typography.inputLabel">{{
              UI_TEXT.profile.selectFileLabel
            }}</label>
            <input
              type="file"
              :class="appConfig.layout.fileInput"
              accept="image/*"
              @change="onPictureSelected"
            />
            <p v-if="uploadPicError" :class="appConfig.typography.inputError">
              {{ uploadPicError }}
            </p>
          </div>
        </form>
      </template>
      <template #footer>
        <div :class="appConfig.layout.modalActions">
          <UButton
            :class="appConfig.typography.modalActionBtnCancel"
            :label="UI_TEXT.common.cancel"
            variant="actionCancelButton"
            @click="profileStore.closeUploadPictureModal()"
          />
          <UButton
            :class="appConfig.typography.modalActionBtnOk"
            :label="UI_TEXT.common.upload"
            variant="actionOkButton"
            type="submit"
            form="upload-pic-form"
            :loading="uploadPictureMutation.isLoading.value"
          />
        </div>
      </template>
    </BaseModal>

    <!-- VIEW PICTURE FULL MODAL -->
    <BaseModal
      v-model:open="profileStore.isViewPictureModalOpen"
      :title="UI_TEXT.profile.pictureTitle"
      :ui-size="appConfig.layout.modalSizeLg"
    >
      <template #body>
        <div
          class="w-full h-80 flex items-center justify-center bg-surface-600/10 rounded-2xl overflow-hidden mt-2"
        >
          <img
            v-if="profileStore.selectedUser?.profile_image_url"
            :src="profileStore.selectedUser.profile_image_url"
            :alt="UI_TEXT.profile.fullPicture"
            class="max-w-full max-h-full object-contain"
          />
          <UIcon v-else name="i-heroicons-user" class="w-32 h-32 text-surface-500/50" />
        </div>
      </template>
      <template #footer>
        <div class="flex items-center justify-end w-full">
          <UButton
            :class="appConfig.typography.modalActionBtnOk"
            :label="UI_TEXT.profile.ok"
            variant="actionOkButton"
            @click="profileStore.closeViewPictureModal()"
          />
        </div>
      </template>
    </BaseModal>

    <!-- UPLOAD DOCUMENT MODAL -->
    <BaseModal
      v-model:open="profileStore.isUploadDocumentModalOpen"
      :title="UI_TEXT.documents.uploadTitle"
      :ui-size="appConfig.layout.modalSizeMd"
    >
      <template #body>
        <form
          id="upload-doc-form"
          :class="appConfig.layout.modalForm"
          @submit.prevent="profileStore.closeUploadDocumentModal()"
        >
          <div>
            <label :class="appConfig.typography.inputLabel">{{
              UI_TEXT.profile.selectFileLabel
            }}</label>
            <input type="file" :class="appConfig.layout.fileInput" />
          </div>
          <div>
            <label :class="appConfig.typography.inputLabel">{{
              UI_TEXT.documents.typeLabel
            }}</label>
            <USelect
              :items="[
                { label: 'ID Card', value: 'id' },
                { label: UI_TEXT.documentTypes.passport, value: 'passport' },
              ]"
              label-key="label"
              value-key="value"
            />
          </div>
          <div class="flex gap-4">
            <div class="flex-1">
              <label :class="appConfig.typography.inputLabel">{{
                UI_TEXT.documents.issuedAtLabel
              }}</label>
              <UInput type="date" variant="glass" class="w-full" />
            </div>
            <div class="flex-1">
              <label :class="appConfig.typography.inputLabel">{{
                UI_TEXT.documents.endsAtLabel
              }}</label>
              <UInput type="date" variant="glass" class="w-full" />
            </div>
          </div>
        </form>
      </template>
      <template #footer>
        <div :class="appConfig.layout.modalActions">
          <UButton
            :class="appConfig.typography.modalActionBtnCancel"
            :label="UI_TEXT.common.cancel"
            variant="actionCancelButton"
            @click="profileStore.closeUploadDocumentModal()"
          />
          <UButton
            :class="appConfig.typography.modalActionBtnOk"
            :label="UI_TEXT.common.upload"
            variant="actionOkButton"
            type="submit"
            form="upload-doc-form"
          />
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
/* ==========================================
   IMPORTS & SETUP
========================================== */
import { ref, computed, watch, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '~/composables/useAuth';
import { useProfileStore } from '~/stores/profile.modals.store';
import {
  useUpdateProfileMutation,
  useDeleteProfileMutation,
  useChangePasswordMutation,
  useUploadProfilePictureMutation,
} from '~/queries/user.mutation';
import {
  updateUsernameSchema,
  updateEmailSchema,
  changePasswordSchema,
} from '~/utils/schemas/users.schema';
import type { ApiError } from '~/types/apiError.type';
import { useAppConfig } from '#imports';

const appConfig = useAppConfig();
const profileStore = useProfileStore();
const router = useRouter();
const { logout } = useAuth();

const isUpdatingProfile = computed(() => updateProfileMutation.isLoading.value);
const isChangingPwd = computed(() => changePwdMutation.isLoading.value);
const isDeleting = computed(() => deleteProfileMutation.isLoading.value);

/* ==========================================
   SHARED HELPERS
========================================== */
const getErrorMessage = (error: unknown) => {
  const apiErr = error as ApiError;
  const msg = apiErr?.response?._data?.message;
  return typeof msg === 'string' ? msg : UI_TEXT.errors.invalidData;
};

const editFormData = reactive({ username: '', email: '' });

const updateProfileMutation = useUpdateProfileMutation({
  onSuccess: () => {
    profileStore.closeEditUsernameModal();
    profileStore.closeEditEmailModal();
  },
});

/* ==========================================
   FEATURE: EDIT USERNAME
========================================== */
const usernameValidationError = ref('');

const usernameError = computed(
  () =>
    usernameValidationError.value ||
    (updateProfileMutation.error.value ? getErrorMessage(updateProfileMutation.error.value) : ''),
);

watch(
  () => profileStore.isEditUsernameModalOpen,
  (isOpen) => {
    if (isOpen && profileStore.selectedUser) {
      editFormData.username = profileStore.selectedUser.username || '';
      usernameValidationError.value = '';
      updateProfileMutation.reset();
    }
  },
);

const handleUpdateUsername = () => {
  updateProfileMutation.reset();
  usernameValidationError.value = '';

  const validationResult = updateUsernameSchema.safeParse({ username: editFormData.username });
  if (!validationResult.success) {
    usernameValidationError.value =
      validationResult.error.issues[0]?.message ?? UI_TEXT.errors.invalidData;
    return;
  }

  updateProfileMutation.mutate({ username: validationResult.data.username });
};

/* ==========================================
   FEATURE: EDIT EMAIL
========================================== */
const emailValidationError = ref('');

const emailError = computed(
  () =>
    emailValidationError.value ||
    (updateProfileMutation.error.value ? getErrorMessage(updateProfileMutation.error.value) : ''),
);

watch(
  () => profileStore.isEditEmailModalOpen,
  (isOpen) => {
    if (isOpen && profileStore.selectedUser) {
      editFormData.email = profileStore.selectedUser.email || '';
      emailValidationError.value = '';
      updateProfileMutation.reset();
    }
  },
);

const handleUpdateEmail = () => {
  updateProfileMutation.reset();
  emailValidationError.value = '';

  const validationResult = updateEmailSchema.safeParse({ email: editFormData.email });
  if (!validationResult.success) {
    emailValidationError.value =
      validationResult.error.issues[0]?.message ?? UI_TEXT.errors.invalidData;
    return;
  }

  updateProfileMutation.mutate({ email: validationResult.data.email });
};

/* ==========================================
   FEATURE: CHANGE PASSWORD
========================================== */
const pwdData = reactive({ oldPassword: '', newPassword: '' });
const pwdValidationError = ref('');

const changePwdMutation = useChangePasswordMutation({
  onSuccess: () => {
    profileStore.closeChangePasswordModal();
  },
});

const passwordError = computed(
  () =>
    pwdValidationError.value ||
    (changePwdMutation.error.value ? getErrorMessage(changePwdMutation.error.value) : ''),
);

watch(
  () => profileStore.isChangePasswordModalOpen,
  (isOpen) => {
    if (isOpen) {
      pwdData.oldPassword = '';
      pwdData.newPassword = '';
      pwdValidationError.value = '';
      changePwdMutation.reset();
    }
  },
);

const handleChangePassword = () => {
  changePwdMutation.reset();
  pwdValidationError.value = '';

  const validationResult = changePasswordSchema.safeParse({
    oldPassword: pwdData.oldPassword,
    newPassword: pwdData.newPassword,
  });

  if (!validationResult.success) {
    pwdValidationError.value =
      validationResult.error.issues[0]?.message ?? UI_TEXT.errors.invalidData;
    return;
  }

  changePwdMutation.mutate({
    oldPassword: validationResult.data.oldPassword,
    newPassword: validationResult.data.newPassword,
  });
};

/* ==========================================
   FEATURE: DELETE ACCOUNT
========================================== */
const deleteProfileMutation = useDeleteProfileMutation({
  onSuccess: () => {
    profileStore.closeDeleteModal();
    logout();
    router.push('/login');
  },
});

const deleteError = computed(() =>
  deleteProfileMutation.error.value ? getErrorMessage(deleteProfileMutation.error.value) : '',
);

watch(
  () => profileStore.isDeleteModalOpen,
  (isOpen) => {
    if (isOpen) deleteProfileMutation.reset();
  },
);

const handleDeleteProfile = () => {
  deleteProfileMutation.reset();
  deleteProfileMutation.mutate();
};

/* ==========================================
   FEATURE: UPLOAD PICTURE
========================================== */
const selectedPicture = ref<File | null>(null);
const uploadPicValidationError = ref('');

const uploadPictureMutation = useUploadProfilePictureMutation({
  onSuccess: () => {
    profileStore.closeUploadPictureModal();
  },
});

const uploadPicError = computed(
  () =>
    uploadPicValidationError.value ||
    (uploadPictureMutation.error.value ? getErrorMessage(uploadPictureMutation.error.value) : ''),
);

watch(
  () => profileStore.isUploadPictureModalOpen,
  (isOpen) => {
    if (isOpen) {
      selectedPicture.value = null;
      uploadPicValidationError.value = '';
      uploadPictureMutation.reset();
    }
  },
);

const onPictureSelected = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    selectedPicture.value = target.files[0] ?? null;
  } else {
    selectedPicture.value = null;
  }
};

const handleUploadPicture = () => {
  uploadPictureMutation.reset();
  uploadPicValidationError.value = '';
  if (!selectedPicture.value) {
    uploadPicValidationError.value = UI_TEXT.profile.selectFileFirst;
    return;
  }
  uploadPictureMutation.mutate(selectedPicture.value);
};
</script>
