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
      :disable-submit="!canRenameGroup"
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
      :disable-submit="!!inviteSuccess || !canManageMembers"
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
            >„{{ groupsStore.selectedMemberToRemove?.users.email }}”</span
          >
        </p>
      </template>
    </ConfirmModal>
  </div>
</template>

<script setup lang="ts">
/* --- IMPORTS --- */
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useGroupPermission } from '~/composables/useGroupPermission';
import { useGroupsStore } from '~/stores/groups.modals.store';
import {
  useUpdateGroupMutation,
  useInviteUserMutation,
  useRemoveUserMutation,
} from '~/queries/groups.mutation';
import { PERMISSIONS, SYSTEM_ROLES } from '~/utils/constants/permissions.constants';
import { getErrorMessage } from '~/utils/error.utils';
import { canRemoveGroupMember } from '~/utils/groups.utils';
import { updateGroupSchema, inviteUserSchema } from '~/utils/schemas/groups.schema';

/* --- COMPOSABLES --- */
const groupsStore = useGroupsStore();
const route = useRoute();
const membersGroupUuid = computed(() => route.params.uuid as string | undefined);
const { currentUserUuid, systemRole, hasPermission } = useGroupPermission(membersGroupUuid);
const canRenameGroup = computed(() => hasPermission(PERMISSIONS.GROUP_MANAGE));
const canManageMembers = computed(() => hasPermission(PERMISSIONS.MEMBERS_MANAGE));

const isUpdating = computed(() => updateMutation.isLoading.value);
const isInviting = computed(() => inviteMutation.isLoading.value);
const isRemoving = computed(() => removeMutation.isLoading.value);

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
  const groupUuid = membersGroupUuid.value;
  if (!groupUuid || !canRenameGroup.value) return;

  updateMutation.reset();
  updateValidationError.value = '';
  const validationResult = updateGroupSchema.safeParse({ groupName: updateGroupName.value });
  if (!validationResult.success) {
    updateValidationError.value =
      validationResult.error.issues[0]?.message ?? UI_TEXT.errors.invalidData;
    return;
  }
  updateMutation.mutate({ groupUuid, name: validationResult.data.groupName });
};

/* --- INVITE LOGIC --- */
const inviteEmail = ref('');
const inviteRole = ref(SYSTEM_ROLES.MEMBER);
const inviteValidationError = ref('');
const roleOptions = [{ label: UI_TEXT.common.member, value: SYSTEM_ROLES.MEMBER }];
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
  const groupUuid = membersGroupUuid.value;
  if (!groupUuid || !canManageMembers.value) return;

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
  inviteMutation.mutate({
    groupUuid,
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
  const groupUuid = membersGroupUuid.value;
  const member = groupsStore.selectedMemberToRemove;
  if (
    !groupUuid ||
    !member ||
    !canManageMembers.value ||
    !canRemoveGroupMember(member, systemRole.value, currentUserUuid.value)
  ) {
    return;
  }

  removeMutation.reset();
  removeMutation.mutate({ groupUuid, userUuid: member.users.uuid });
};
</script>
