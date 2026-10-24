<!-- frontend/app/components/groups/modals/GroupModals.vue -->
<template>
  <div>
    <!-- CREATE MODAL -->
    <FormModal
      v-model:open="groupsStore.isCreateModalOpen"
      :title="UI_TEXT.groups.createTitle"
      form-id="create-group-form"
      :cancel-text="UI_TEXT.common.cancel"
      :submit-text="UI_TEXT.common.create"
      :loading="isCreating"
      :ui-size="appConfig.layout.modalSizeSm"
      @cancel="groupsStore.closeCreateModal"
      @submit="handleCreateGroup"
    >
      <div>
        <label :class="appConfig.typography.inputLabel">{{ UI_TEXT.groups.nameLabel }}</label>
        <UInput
          v-model="newGroupName"
          :placeholder="UI_TEXT.groups.namePlaceholder"
          variant="glass"
          class="w-full"
        />
        <p v-if="createError" :class="appConfig.typography.inputError">{{ createError }}</p>
      </div>
    </FormModal>

    <!-- DELETE GROUP MODAL -->
    <ConfirmModal
      v-model:open="groupsStore.isDeleteModalOpen"
      :title="UI_TEXT.groups.deleteTitle"
      :error-text="deleteErrorText"
      :cancel-text="UI_TEXT.common.cancel"
      :confirm-text="UI_TEXT.common.delete"
      :loading="isDeleting"
      :ui-size="appConfig.layout.modalSizeSm"
      @cancel="groupsStore.closeDeleteModal"
      @confirm="confirmDelete"
    >
      <template #body>
        <p :class="appConfig.typography.modalText">
          {{ UI_TEXT.groups.deleteConfirmation }}
          <span
            v-if="groupsStore.selectedGroupToDelete"
            :class="appConfig.typography.modalHighlight"
          >
            „{{ groupsStore.selectedGroupToDelete.name }}”
          </span>
        </p>
      </template>
    </ConfirmModal>

    <!-- LEAVE GROUP MODAL -->
    <ConfirmModal
      v-model:open="groupsStore.isLeaveModalOpen"
      :title="UI_TEXT.groups.leaveTitle"
      :error-text="leaveErrorText"
      :cancel-text="UI_TEXT.common.cancel"
      :confirm-text="UI_TEXT.common.leave"
      :loading="isLeaving"
      :ui-size="appConfig.layout.modalSizeSm"
      @cancel="groupsStore.closeLeaveModal"
      @confirm="confirmLeave"
    >
      <template #body>
        <div :class="appConfig.layout.modalForm">
          <p :class="appConfig.typography.modalText">
            {{ UI_TEXT.groups.leaveConfirmation }}
            <span
              v-if="groupsStore.selectedGroupToLeave"
              :class="appConfig.typography.modalHighlight"
            >
              „{{ groupsStore.selectedGroupToLeave.name }}”
            </span>
          </p>
          <p
            v-if="
              groupsStore.selectedGroupToLeave?.current_size === 1 &&
              groupsStore.selectedGroupToLeave?.role?.toLowerCase() === 'leader'
            "
            :class="appConfig.typography.modalErrorBox"
          >
            {{ UI_TEXT.groups.leaveWarning }}
          </p>
        </div>
      </template>
    </ConfirmModal>
  </div>
</template>

<script setup lang="ts">
/* --- IMPORTS --- */
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useGroupsStore } from '~/stores/groups.modals.store';
import {
  useCreateGroupMutation,
  useDeleteGroupMutation,
  useLeaveGroupMutation,
} from '~/queries/groups.mutation';
import { useAppConfig } from '#imports';

/* --- COMPOSABLES --- */
const appConfig = useAppConfig();
const groupsStore = useGroupsStore();
const router = useRouter();

/* --- STATE --- */
const newGroupName = ref('');
const formValidationError = ref('');

/* --- API MUTATIONS --- */
const createMutation = useCreateGroupMutation({
  onSuccess: () => {
    groupsStore.closeCreateModal();
    newGroupName.value = '';
  },
});

const deleteMutation = useDeleteGroupMutation({
  onSuccess: () => {
    groupsStore.closeDeleteModal();
    router.push('/groups');
  },
});

const leaveMutation = useLeaveGroupMutation({
  onSuccess: () => {
    groupsStore.closeLeaveModal();
    router.push('/groups');
  },
});

/* --- COMPUTED ERRORS --- */
const createError = computed(
  () =>
    formValidationError.value ||
    (createMutation.error.value ? getErrorMessage(createMutation.error.value) : ''),
);
const deleteErrorText = computed(() =>
  deleteMutation.error.value ? getErrorMessage(deleteMutation.error.value) : '',
);
const leaveErrorText = computed(() =>
  leaveMutation.error.value ? getErrorMessage(leaveMutation.error.value) : '',
);

/* --- HANDLERS --- */
const handleCreateGroup = () => {
  createMutation.reset();
  formValidationError.value = '';
  const validationResult = createGroupSchema.safeParse({ groupName: newGroupName.value });
  if (!validationResult.success) {
    formValidationError.value =
      validationResult.error.issues[0]?.message ?? UI_TEXT.errors.invalidData;
    return;
  }
  createMutation.mutate({ groupName: validationResult.data.groupName });
};

const confirmDelete = () => {
  if (!groupsStore.selectedGroupToDelete) return;
  deleteMutation.reset();
  deleteMutation.mutate(groupsStore.selectedGroupToDelete.uuid);
};

const confirmLeave = () => {
  if (!groupsStore.selectedGroupToLeave) return;
  leaveMutation.reset();
  leaveMutation.mutate(groupsStore.selectedGroupToLeave.uuid);
};
</script>
