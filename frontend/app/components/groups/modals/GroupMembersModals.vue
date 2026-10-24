<!-- frontend/app/components/groups/modals/GroupMembersModals.vue -->
<template>
  <div>
    <!-- UPDATE MODAL -->
    <UModal
      v-model:open="groupsStore.isUpdateModalOpen"
      :title="UI_TEXT.groups.editTitle"
      :dismissible="false"
      :close="false"
      :ui="{ content: appConfig.layout.modalSizeSm }"
    >
      <template #default><div class="hidden"></div></template>
      <template #body>
        <form
          id="update-group-form"
          :class="appConfig.layout.modalForm"
          @submit.prevent="handleUpdateGroup"
        >
          <div>
            <label :class="appConfig.typography.inputLabel">{{ UI_TEXT.groups.nameLabel }}</label>
            <UInput
              v-model="updateGroupName"
              :placeholder="UI_TEXT.groups.namePlaceholder"
              variant="glass"
              class="w-full"
            />
            <p v-if="updateError" :class="appConfig.typography.inputError">{{ updateError }}</p>
          </div>
        </form>
      </template>
      <template #footer>
        <div :class="appConfig.layout.modalActions">
          <BaseButton
            :class="appConfig.typography.modalActionBtnCancel"
            :label="UI_TEXT.common.cancel"
            variant="actionCancelButton"
            @click="groupsStore.closeUpdateModal()"
          />
          <BaseButton
            :class="appConfig.typography.modalActionBtnOk"
            :label="UI_TEXT.common.save"
            variant="actionOkButton"
            type="submit"
            form="update-group-form"
            :loading="isUpdating"
          />
        </div>
      </template>
    </UModal>

    <!-- INVITE MODAL -->
    <UModal
      v-model:open="groupsStore.isInviteModalOpen"
      :title="UI_TEXT.groups.inviteUserTitle"
      :dismissible="false"
      :close="false"
      :ui="{ content: appConfig.layout.modalSizeSm }"
    >
      <template #default><div class="hidden"></div></template>
      <template #body>
        <form
          id="invite-user-form"
          :class="appConfig.layout.modalForm"
          @submit.prevent="handleInviteUser"
        >
          <div>
            <label :class="appConfig.typography.inputLabel">{{ UI_TEXT.groups.emailLabel }}</label>
            <UInput
              v-model="inviteEmail"
              :placeholder="UI_TEXT.groups.emailPlaceholder"
              variant="glass"
              class="w-full"
            />
          </div>
          <div>
            <label :class="appConfig.typography.inputLabel">{{
              UI_TEXT.groups.roleSelectionLabel
            }}</label>
            <USelect
              v-model="inviteRole"
              :items="roleOptions"
              label-key="label"
              value-key="value"
              :popper="{ strategy: 'fixed', placement: 'bottom-start' }"
              :ui="{ content: 'z-[9999]' }"
            />
          </div>
          <p v-if="inviteError" :class="appConfig.typography.modalErrorBox">{{ inviteError }}</p>
          <p v-if="inviteSuccess" :class="appConfig.typography.modalSuccessBox">
            {{ inviteSuccess }}
          </p>
        </form>
      </template>
      <template #footer>
        <div :class="appConfig.layout.modalActions">
          <BaseButton
            :class="appConfig.typography.modalActionBtnCancel"
            :label="UI_TEXT.common.cancel"
            variant="actionCancelButton"
            :disabled="!!inviteSuccess"
            @click="groupsStore.closeInviteModal()"
          />
          <BaseButton
            :class="appConfig.typography.modalActionBtnOk"
            :label="UI_TEXT.groups.sendInvite"
            variant="actionOkButton"
            type="submit"
            form="invite-user-form"
            :loading="isInviting"
            :disabled="!!inviteSuccess"
          />
        </div>
      </template>
    </UModal>

    <!-- REMOVE USER MODAL -->
    <UModal
      v-model:open="groupsStore.isRemoveUserModalOpen"
      :title="UI_TEXT.groups.removeUserTitle"
      :dismissible="false"
      :close="false"
      :ui="{ content: appConfig.layout.modalSizeSm }"
    >
      <template #default><div class="hidden"></div></template>
      <template #body>
        <p :class="appConfig.typography.modalText">
          {{ UI_TEXT.groups.removeUserConfirmation }}
          <span :class="appConfig.typography.modalHighlight"
            >„{{ groupsStore.selectedUserEmailToRemove }}”</span
          >
        </p>
        <p v-if="removeErrorText" :class="appConfig.typography.inputError">{{ removeErrorText }}</p>
      </template>
      <template #footer>
        <div :class="appConfig.layout.modalActions">
          <BaseButton
            :class="appConfig.typography.modalActionBtnCancel"
            :label="UI_TEXT.common.cancel"
            variant="actionCancelButton"
            @click="groupsStore.closeRemoveUserModal()"
          />
          <BaseButton
            :class="appConfig.typography.modalActionBtnOk"
            :label="UI_TEXT.common.remove"
            variant="actionOkButton"
            :loading="isRemoving"
            @click="handleRemoveUser"
          />
        </div>
      </template>
    </UModal>

    <!-- PROMOTE USER MODAL -->
    <UModal
      v-model:open="groupsStore.isPromoteUserModalOpen"
      :title="UI_TEXT.groups.promoteUser"
      :dismissible="false"
      :close="false"
      :ui="{ content: appConfig.layout.modalSizeSm }"
    >
      <template #default><div class="hidden"></div></template>
      <template #body>
        <p :class="appConfig.typography.modalText">
          {{ ' ' + UI_TEXT.groups.promoteBeforeName + ' '
          }}<span :class="appConfig.typography.modalInlineHighlight"
            >„{{ groupsStore.selectedUserNameToPromote }}”</span
          >{{ ' ' + UI_TEXT.groups.promoteAfterName + ' ' }}
        </p>
        <p v-if="promoteErrorText" :class="appConfig.typography.inputError">
          {{ promoteErrorText }}
        </p>
      </template>
      <template #footer>
        <div :class="appConfig.layout.modalActions">
          <BaseButton
            :class="appConfig.typography.modalActionBtnCancel"
            :label="UI_TEXT.common.cancel"
            variant="actionCancelButton"
            @click="groupsStore.closePromoteUserModal()"
          />
          <BaseButton
            :class="appConfig.typography.modalActionBtnOk"
            :label="UI_TEXT.groups.promote"
            variant="actionOkButton"
            :loading="isPromoting"
            @click="handlePromoteUser"
          />
        </div>
      </template>
    </UModal>

    <!-- DEMOTE USER MODAL -->
    <UModal
      v-model:open="groupsStore.isDemoteUserModalOpen"
      :title="UI_TEXT.groups.demoteUser"
      :dismissible="false"
      :close="false"
      :ui="{ content: appConfig.layout.modalSizeSm }"
    >
      <template #default><div class="hidden"></div></template>
      <template #body>
        <p :class="appConfig.typography.modalText">
          {{ ' ' + UI_TEXT.groups.demoteBeforeName + ' '
          }}<span :class="appConfig.typography.modalInlineHighlight"
            >„{{ groupsStore.selectedUserNameToDemote }}”</span
          >{{ ' ' + UI_TEXT.groups.demoteAfterName + ' ' }}
        </p>
        <p v-if="demoteErrorText" :class="appConfig.typography.inputError">{{ demoteErrorText }}</p>
      </template>
      <template #footer>
        <div :class="appConfig.layout.modalActions">
          <BaseButton
            :class="appConfig.typography.modalActionBtnCancel"
            :label="UI_TEXT.common.cancel"
            variant="actionCancelButton"
            @click="groupsStore.closeDemoteUserModal()"
          />
          <BaseButton
            :class="appConfig.typography.modalActionBtnOk"
            :label="UI_TEXT.groups.demote"
            variant="actionCancelButton"
            class="text-orange-500 hover:text-white hover:bg-orange-600 ring-orange-500"
            :loading="isDemoting"
            @click="handleDemoteUser"
          />
        </div>
      </template>
    </UModal>
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
import { useAppConfig } from '#imports';

/* --- COMPOSABLES --- */
const appConfig = useAppConfig();
const groupsStore = useGroupsStore();
const route = useRoute();
const membersGroupUuid = computed(() => route.params.uuid as string);

/* --- UPDATE LOGIC --- */
const updateGroupName = ref('');
const updateValidationError = ref('');
const {
  mutate: updateGroup,
  isLoading: isUpdating,
  error: updateApiError,
  reset: resetUpdate,
} = useUpdateGroupMutation({
  onSuccess: () => groupsStore.closeUpdateModal(),
});
const updateError = computed(
  () =>
    updateValidationError.value ||
    (updateApiError.value ? getErrorMessage(updateApiError.value) : ''),
);

watch(
  () => groupsStore.isUpdateModalOpen,
  (isOpen: boolean) => {
    if (!isOpen) {
      updateGroupName.value = '';
      updateValidationError.value = '';
      resetUpdate();
    }
  },
);
const handleUpdateGroup = () => {
  resetUpdate();
  updateValidationError.value = '';
  const validationResult = updateGroupSchema.safeParse({ groupName: updateGroupName.value });
  if (!validationResult.success) {
    updateValidationError.value =
      validationResult.error.issues[0]?.message ?? UI_TEXT.errors.invalidData;
    return;
  }
  if (membersGroupUuid.value)
    updateGroup({ groupUuid: membersGroupUuid.value, name: validationResult.data.groupName });
};

/* --- INVITE LOGIC --- */
const inviteEmail = ref('');
const inviteRole = ref('invitedMember');
const inviteValidationError = ref('');
const roleOptions = [
  { label: UI_TEXT.common.member, value: 'invitedMember' },
  { label: UI_TEXT.common.leader, value: 'invitedLeader' },
];
const {
  mutate: inviteUser,
  isLoading: isInviting,
  error: inviteApiError,
  status: inviteStatus,
  reset: resetInvite,
} = useInviteUserMutation({
  onSuccess: () => setTimeout(() => groupsStore.closeInviteModal(), 2000),
});
const inviteError = computed(
  () =>
    inviteValidationError.value ||
    (inviteApiError.value ? getErrorMessage(inviteApiError.value) : ''),
);
const inviteSuccess = computed(() =>
  inviteStatus.value === 'success' ? UI_TEXT.groups.inviteSuccess : '',
);

watch(
  () => groupsStore.isInviteModalOpen,
  (isOpen: boolean) => {
    if (!isOpen) {
      inviteEmail.value = '';
      inviteValidationError.value = '';
      resetInvite();
    }
  },
);
const handleInviteUser = () => {
  resetInvite();
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
    inviteUser({
      groupUuid: membersGroupUuid.value,
      data: {
        invitedUserEmail: validationResult.data.email,
        inviteWithRole: validationResult.data.role,
      },
    });
};

/* --- REMOVE LOGIC --- */
const {
  mutate: removeUser,
  isLoading: isRemoving,
  error: removeApiError,
  reset: resetRemove,
} = useRemoveUserMutation({
  onSuccess: () => groupsStore.closeRemoveUserModal(),
});
const removeErrorText = computed(() =>
  removeApiError.value ? getErrorMessage(removeApiError.value) : '',
);

watch(
  () => groupsStore.isRemoveUserModalOpen,
  (isOpen: boolean) => {
    if (!isOpen) resetRemove();
  },
);
const handleRemoveUser = () => {
  if (!groupsStore.selectedUserEmailToRemove || !membersGroupUuid.value) return;
  resetRemove();
  removeUser({ groupUuid: membersGroupUuid.value, email: groupsStore.selectedUserEmailToRemove });
};

/* --- PROMOTE LOGIC --- */
const {
  mutate: promoteUser,
  isLoading: isPromoting,
  error: promoteApiError,
  reset: resetPromote,
} = usePromoteUserMutation({
  onSuccess: () => groupsStore.closePromoteUserModal(),
});
const promoteErrorText = computed(() =>
  promoteApiError.value ? getErrorMessage(promoteApiError.value) : '',
);

watch(
  () => groupsStore.isPromoteUserModalOpen,
  (isOpen: boolean) => {
    if (!isOpen) resetPromote();
  },
);
const handlePromoteUser = () => {
  if (!groupsStore.selectedUserEmailToPromote || !membersGroupUuid.value) return;
  resetPromote();
  promoteUser({ groupUuid: membersGroupUuid.value, email: groupsStore.selectedUserEmailToPromote });
};

/* --- DEMOTE LOGIC --- */
const {
  mutate: demoteUser,
  isLoading: isDemoting,
  error: demoteApiError,
  reset: resetDemote,
} = useDemoteUserMutation({
  onSuccess: () => groupsStore.closeDemoteUserModal(),
});
const demoteErrorText = computed(() =>
  demoteApiError.value ? getErrorMessage(demoteApiError.value) : '',
);

watch(
  () => groupsStore.isDemoteUserModalOpen,
  (isOpen: boolean) => {
    if (!isOpen) resetDemote();
  },
);
const handleDemoteUser = () => {
  if (!groupsStore.selectedUserEmailToDemote || !membersGroupUuid.value) return;
  resetDemote();
  demoteUser({ groupUuid: membersGroupUuid.value, email: groupsStore.selectedUserEmailToDemote });
};
</script>
