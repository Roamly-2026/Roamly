<!-- frontend/app/components/groups/modals/GroupModals.vue -->
<template>
  <div>
    <!-- CREATE MODAL -->
    <UModal
      v-model:open="groupsStore.isCreateModalOpen"
      :title="UI_TEXT.groups.createTitle"
      :dismissible="false"
      :close="false"
      :ui="{ content: appConfig.layout.modalSizeSm }"
    >
      <template #default><div class="hidden"></div></template>
      <template #body>
        <form
          id="create-group-form"
          :class="appConfig.layout.modalForm"
          @submit.prevent="handleCreateGroup"
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
        </form>
      </template>
      <template #footer>
        <div :class="appConfig.layout.modalActions">
          <BaseButton
            :class="appConfig.typography.modalActionBtnCancel"
            :label="UI_TEXT.common.cancel"
            variant="actionCancelButton"
            type="button"
            @click="groupsStore.closeCreateModal"
          />
          <BaseButton
            :class="appConfig.typography.modalActionBtnOk"
            :label="UI_TEXT.common.create"
            variant="actionOkButton"
            type="submit"
            form="create-group-form"
            :loading="isCreating"
          />
        </div>
      </template>
    </UModal>

    <!-- DELETE GROUP MODAL -->
    <UModal
      v-model:open="groupsStore.isDeleteModalOpen"
      :title="UI_TEXT.groups.deleteTitle"
      :dismissible="false"
      :close="false"
      :ui="{ content: appConfig.layout.modalSizeSm }"
    >
      <template #default><div class="hidden"></div></template>
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
        <p v-if="deleteErrorText" :class="appConfig.typography.modalErrorBox">
          {{ deleteErrorText }}
        </p>
      </template>
      <template #footer>
        <div :class="appConfig.layout.modalActions">
          <BaseButton
            :class="appConfig.typography.modalActionBtnCancel"
            :label="UI_TEXT.common.cancel"
            variant="actionCancelButton"
            @click="groupsStore.closeDeleteModal"
          />
          <BaseButton
            :class="appConfig.typography.modalActionBtnOk"
            :label="UI_TEXT.common.delete"
            variant="actionOkButton"
            :loading="isDeleting"
            @click="confirmDelete"
          />
        </div>
      </template>
    </UModal>

    <!-- LEAVE GROUP MODAL -->
    <UModal
      v-model:open="groupsStore.isLeaveModalOpen"
      :title="UI_TEXT.groups.leaveTitle"
      :dismissible="false"
      :close="false"
      :ui="{ content: appConfig.layout.modalSizeSm }"
    >
      <template #default><div class="hidden"></div></template>
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
          <p v-if="leaveErrorText" :class="appConfig.typography.modalErrorBox">
            {{ leaveErrorText }}
          </p>
        </div>
      </template>
      <template #footer>
        <div :class="appConfig.layout.modalActions">
          <BaseButton
            :class="appConfig.typography.modalActionBtnCancel"
            :label="UI_TEXT.common.cancel"
            variant="actionCancelButton"
            @click="groupsStore.closeLeaveModal"
          />
          <BaseButton
            :class="appConfig.typography.modalActionBtnOk"
            :label="UI_TEXT.common.leave"
            variant="actionOkButton"
            :loading="isLeaving"
            @click="confirmLeave"
          />
        </div>
      </template>
    </UModal>
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
const {
  mutate: createGroup,
  isLoading: isCreating,
  error: createApiError,
  reset: resetCreate,
} = useCreateGroupMutation({
  onSuccess: () => {
    groupsStore.closeCreateModal();
    newGroupName.value = '';
  },
});
const {
  mutate: deleteGroup,
  isLoading: isDeleting,
  error: deleteApiError,
  reset: resetDelete,
} = useDeleteGroupMutation({
  onSuccess: () => {
    groupsStore.closeDeleteModal();
    router.push('/groups');
  },
});
const {
  mutate: leaveGroup,
  isLoading: isLeaving,
  error: leaveApiError,
  reset: resetLeave,
} = useLeaveGroupMutation({
  onSuccess: () => {
    groupsStore.closeLeaveModal();
    router.push('/groups');
  },
});

/* --- COMPUTED ERRORS --- */
const createError = computed(
  () =>
    formValidationError.value ||
    (createApiError.value ? getErrorMessage(createApiError.value) : ''),
);
const deleteErrorText = computed(() =>
  deleteApiError.value ? getErrorMessage(deleteApiError.value) : '',
);
const leaveErrorText = computed(() =>
  leaveApiError.value ? getErrorMessage(leaveApiError.value) : '',
);

/* --- HANDLERS --- */
const handleCreateGroup = () => {
  resetCreate();
  formValidationError.value = '';
  const validationResult = createGroupSchema.safeParse({ groupName: newGroupName.value });
  if (!validationResult.success) {
    formValidationError.value =
      validationResult.error.issues[0]?.message ?? UI_TEXT.errors.invalidData;
    return;
  }
  createGroup({ groupName: validationResult.data.groupName });
};

const confirmDelete = () => {
  if (!groupsStore.selectedGroupToDelete) return;
  resetDelete();
  deleteGroup(groupsStore.selectedGroupToDelete.uuid);
};

const confirmLeave = () => {
  if (!groupsStore.selectedGroupToLeave) return;
  resetLeave();
  leaveGroup(groupsStore.selectedGroupToLeave.uuid);
};
</script>
