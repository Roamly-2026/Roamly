<!-- frontend/app/components/groups/modals/GroupMembersModals.vue -->
<template>
  <div>
    <!-- UPDATE MODAL -->
    <FormModal
      v-model:open="groupsStore.isUpdateModalOpen"
      :title="UI_TEXT.groups.editTitle"
      form-id="update-group-form"
      :cancel-text="UI_TEXT.common.cancel"
      :submit-text="UI_TEXT.common.save"
      :loading="isUpdating"
      :ui-size="LAYOUT_CONFIG.modalSizeSm"
      @cancel="groupsStore.closeUpdateModal()"
      @submit="handleUpdateGroup"
    >
      <div>
        <BaseInput
          v-model="updateGroupName"
          :label="UI_TEXT.groups.nameLabel"
          :placeholder="UI_TEXT.groups.namePlaceholder"
        />
        <p v-if="updateError" :class="TYPOGRAPHY_CONFIG.inputError">{{ updateError }}</p>
      </div>
    </FormModal>

    <!-- INVITE MODAL -->
    <FormModal
      v-model:open="groupsStore.isInviteModalOpen"
      :title="UI_TEXT.groups.inviteUserTitle"
      form-id="invite-user-form"
      :cancel-text="UI_TEXT.common.cancel"
      :submit-text="UI_TEXT.groups.sendInvite"
      :loading="isInviting"
      :disable-cancel="!!inviteSuccess"
      :disable-submit="!!inviteSuccess"
      :ui-size="LAYOUT_CONFIG.modalSizeSm"
      @cancel="groupsStore.closeInviteModal()"
      @submit="handleInviteUser"
    >
      <div>
        <BaseInput
          v-model="inviteEmail"
          :label="UI_TEXT.groups.emailLabel"
          :placeholder="UI_TEXT.groups.emailPlaceholder"
          variant="glass"
        />
      </div>
      <div>
        <label :class="TYPOGRAPHY_CONFIG.inputLabel">{{ UI_TEXT.groups.roleSelectionLabel }}</label>
        <USelect
          v-model="inviteRole"
          :items="roleOptions"
          label-key="label"
          value-key="value"
          :popper="{ strategy: 'fixed', placement: 'bottom-start' }"
          :ui="{ content: Z_INDEX_TOKENS.modal }"
        />
      </div>
      <p v-if="inviteError" :class="TYPOGRAPHY_CONFIG.modalErrorBox">{{ inviteError }}</p>
      <p v-if="inviteSuccess" :class="TYPOGRAPHY_CONFIG.modalSuccessBox">
        {{ inviteSuccess }}
      </p>
    </FormModal>

    <!-- REMOVE USER MODAL -->
    <ConfirmModal
      v-model:open="groupsStore.isRemoveUserModalOpen"
      :title="UI_TEXT.groups.removeUserTitle"
      :error-text="removeErrorText"
      :cancel-text="UI_TEXT.common.cancel"
      :confirm-text="UI_TEXT.common.remove"
      :loading="isRemoving"
      :ui-size="LAYOUT_CONFIG.modalSizeSm"
      @cancel="groupsStore.closeRemoveUserModal()"
      @confirm="handleRemoveUser"
    >
      <template #body>
        <p :class="TYPOGRAPHY_CONFIG.modalText">
          {{ UI_TEXT.groups.removeUserConfirmation }}
          <span :class="TYPOGRAPHY_CONFIG.modalHighlight"
            >„{{ groupsStore.selectedUserEmailToRemove }}”</span
          >
        </p>
      </template>
    </ConfirmModal>

    <!-- PROMOTE USER MODAL -->
    <ConfirmModal
      v-model:open="groupsStore.isPromoteUserModalOpen"
      :title="UI_TEXT.groups.promoteUser"
      :error-text="promoteErrorText"
      :cancel-text="UI_TEXT.common.cancel"
      :confirm-text="UI_TEXT.groups.promote"
      :loading="isPromoting"
      :ui-size="LAYOUT_CONFIG.modalSizeSm"
      :confirm-btn-class="BUTTON_APPEARANCES.primaryElevated"
      @cancel="groupsStore.closePromoteUserModal()"
      @confirm="handlePromoteUser"
    >
      <template #body>
        <p :class="TYPOGRAPHY_CONFIG.modalText">
          {{ ' ' + UI_TEXT.groups.promoteBeforeName + ' '
          }}<span :class="TYPOGRAPHY_CONFIG.modalInlineHighlight"
            >„{{ groupsStore.selectedUserNameToPromote }}”</span
          >{{ ' ' + UI_TEXT.groups.promoteAfterName + ' ' }}
        </p>
      </template>
    </ConfirmModal>

    <!-- DEMOTE USER MODAL -->
    <ConfirmModal
      v-model:open="groupsStore.isDemoteUserModalOpen"
      :title="UI_TEXT.groups.demoteUser"
      :error-text="demoteErrorText"
      :cancel-text="UI_TEXT.common.cancel"
      :confirm-text="UI_TEXT.groups.demote"
      :loading="isDemoting"
      :ui-size="LAYOUT_CONFIG.modalSizeSm"
      :confirm-btn-class="BUTTON_APPEARANCES.dangerElevated"
      @cancel="groupsStore.closeDemoteUserModal()"
      @confirm="handleDemoteUser"
    >
      <template #body>
        <p :class="TYPOGRAPHY_CONFIG.modalText">
          {{ ' ' + UI_TEXT.groups.demoteBeforeName + ' '
          }}<span :class="TYPOGRAPHY_CONFIG.modalInlineHighlight"
            >„{{ groupsStore.selectedUserNameToDemote }}”</span
          >{{ ' ' + UI_TEXT.groups.demoteAfterName + ' ' }}
        </p>
      </template>
    </ConfirmModal>
  </div>
</template>

<script setup lang="ts">
/* --- IMPORTS --- */
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useGroupsStore } from '~/stores/groups.modals.store';
import {
  useUpdateGroupMutation,
  useInviteUserMutation,
  useRemoveUserMutation,
  usePromoteUserMutation,
  useDemoteUserMutation,
} from '~/queries/groups.mutation';
import { getErrorMessage } from '~/utils/error.utils';
import { updateGroupSchema, inviteUserSchema } from '~/utils/schemas/groups.schema';

/* --- COMPOSABLES --- */
const groupsStore = useGroupsStore();
const route = useRoute();
const membersGroupUuid = computed(() => route.params.uuid as string);

const isUpdating = computed(() => updateMutation.isLoading.value);
const isInviting = computed(() => inviteMutation.isLoading.value);
const isRemoving = computed(() => removeMutation.isLoading.value);
const isPromoting = computed(() => promoteMutation.isLoading.value);
const isDemoting = computed(() => demoteMutation.isLoading.value);

/* --- UPDATE LOGIC --- */
const updateGroupName = ref('');
const updateValidationError = ref('');
const updateMutation = useUpdateGroupMutation({
  onSuccess: () => groupsStore.closeUpdateModal(),
});

const updateError = computed(
  () =>
    updateValidationError.value ||
    (updateMutation.error.value ? getErrorMessage(updateMutation.error.value) : ''),
);

watch(
  () => groupsStore.isUpdateModalOpen,
  (isOpen: boolean) => {
    if (!isOpen) {
      updateGroupName.value = '';
      updateValidationError.value = '';
      updateMutation.reset();
    }
  },
);
const handleUpdateGroup = () => {
  updateMutation.reset();
  updateValidationError.value = '';
  const validationResult = updateGroupSchema.safeParse({ groupName: updateGroupName.value });
  if (!validationResult.success) {
    updateValidationError.value =
      validationResult.error.issues[0]?.message ?? UI_TEXT.errors.invalidData;
    return;
  }
  if (membersGroupUuid.value)
    updateMutation.mutate({
      groupUuid: membersGroupUuid.value,
      name: validationResult.data.groupName,
    });
};

/* --- INVITE LOGIC --- */
const inviteEmail = ref('');
const inviteRole = ref('invitedMember');
const inviteValidationError = ref('');
const roleOptions = [
  { label: UI_TEXT.common.member, value: 'invitedMember' },
  { label: UI_TEXT.common.leader, value: 'invitedLeader' },
];
const inviteMutation = useInviteUserMutation({
  onSuccess: () => setTimeout(() => groupsStore.closeInviteModal(), 2000),
});
const inviteError = computed(
  () =>
    inviteValidationError.value ||
    (inviteMutation.error.value ? getErrorMessage(inviteMutation.error.value) : ''),
);
const inviteSuccess = computed(() =>
  inviteMutation.status.value === 'success' ? UI_TEXT.groups.inviteSuccess : '',
);

watch(
  () => groupsStore.isInviteModalOpen,
  (isOpen: boolean) => {
    if (!isOpen) {
      inviteEmail.value = '';
      inviteValidationError.value = '';
      inviteMutation.reset();
    }
  },
);
const handleInviteUser = () => {
  inviteMutation.reset();
  inviteValidationError.value = '';
  const validationResult = inviteUserSchema.safeParse({
    email: inviteEmail.value,
    role: inviteRole.value,
  });
  if (!validationResult.success) {
    inviteValidationError.value =
      validationResult.error.issues[0]?.message ?? UI_TEXT.errors.invalidData;
    return;
  }
  if (membersGroupUuid.value)
    inviteMutation.mutate({
      groupUuid: membersGroupUuid.value,
      data: {
        invitedUserEmail: validationResult.data.email,
        inviteWithRole: validationResult.data.role,
      },
    });
};

/* --- REMOVE LOGIC --- */
const removeMutation = useRemoveUserMutation({
  onSuccess: () => groupsStore.closeRemoveUserModal(),
});
const removeErrorText = computed(() =>
  removeMutation.error.value ? getErrorMessage(removeMutation.error.value) : '',
);

watch(
  () => groupsStore.isRemoveUserModalOpen,
  (isOpen: boolean) => {
    if (!isOpen) removeMutation.reset();
  },
);
const handleRemoveUser = () => {
  if (!groupsStore.selectedUserEmailToRemove || !membersGroupUuid.value) return;
  removeMutation.reset();
  removeMutation.mutate({
    groupUuid: membersGroupUuid.value,
    email: groupsStore.selectedUserEmailToRemove,
  });
};

/* --- PROMOTE LOGIC --- */
const promoteMutation = usePromoteUserMutation({
  onSuccess: () => groupsStore.closePromoteUserModal(),
});
const promoteErrorText = computed(() =>
  promoteMutation.error.value ? getErrorMessage(promoteMutation.error.value) : '',
);

watch(
  () => groupsStore.isPromoteUserModalOpen,
  (isOpen: boolean) => {
    if (!isOpen) promoteMutation.reset();
  },
);
const handlePromoteUser = () => {
  if (!groupsStore.selectedUserEmailToPromote || !membersGroupUuid.value) return;
  promoteMutation.reset();
  promoteMutation.mutate({
    groupUuid: membersGroupUuid.value,
    email: groupsStore.selectedUserEmailToPromote,
  });
};

/* --- DEMOTE LOGIC --- */
const demoteMutation = useDemoteUserMutation({
  onSuccess: () => groupsStore.closeDemoteUserModal(),
});
const demoteErrorText = computed(() =>
  demoteMutation.error.value ? getErrorMessage(demoteMutation.error.value) : '',
);

watch(
  () => groupsStore.isDemoteUserModalOpen,
  (isOpen: boolean) => {
    if (!isOpen) demoteMutation.reset();
  },
);
const handleDemoteUser = () => {
  if (!groupsStore.selectedUserEmailToDemote || !membersGroupUuid.value) return;
  demoteMutation.reset();
  demoteMutation.mutate({
    groupUuid: membersGroupUuid.value,
    email: groupsStore.selectedUserEmailToDemote,
  });
};
</script>
