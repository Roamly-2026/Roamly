<!-- frontend/app/components/documents/modals/PrivateDocumentsSharingModals.vue -->
<template>
  <div>
    <!-- SHARE DOCUMENT MODAL -->
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
              <BaseButton
                icon="i-heroicons-share"
                variant="ghostBrandIconButton"
                class="text-dark-text/70"
                :loading="shareMutation.isLoading.value"
                :tooltip="UI_TEXT.documents.shareWithGroup"
                :tooltip-ui="{ content: 'z-[9999]' }"
                :tooltip-popper="{ placement: 'top', strategy: 'fixed' }"
                @click="handleShareDocument(group.uuid)"
              />
            </div>
          </div>
          <div v-if="!unsharedGroups?.length" class="text-sm font-medium text-dark-text/50 p-4">
            {{ ' ' + UI_TEXT.documents.noAvailableGroups + ' ' }}
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end w-full">
          <BaseButton
            :label="UI_TEXT.common.close"
            :class="appConfig.typography.modalActionBtnCancel"
            @click="documentsStore.closePrivateShareModal()"
          />
        </div>
      </template>
    </BaseModal>

    <!-- VIEW ACCESS MODAL -->
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
              <BaseButton
                icon="i-heroicons-x-mark"
                variant="ghostDangerIconButton"
                :loading="revokeMutation.isLoading.value"
                :tooltip="UI_TEXT.documents.revokeAccess"
                :tooltip-ui="{ content: 'z-[9999]' }"
                :tooltip-popper="{ placement: 'top', strategy: 'fixed' }"
                @click="handleRevokeAccess(share.groups.name)"
              />
            </div>
          </div>
          <div v-if="!sharedGroups?.length" class="text-sm font-medium text-dark-text/50 p-4">
            {{ ' ' + UI_TEXT.documents.notShared + ' ' }}
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end w-full">
          <BaseButton
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
import { computed } from 'vue';
import { useDocumentsStore } from '~/stores/documents.modals.store';
import { useShareDocumentMutation, useDeleteSharingMutation } from '~/queries/files.mutation';
import type { FileShareDto } from '~/types/files.type';
import type { GroupOutDto } from '~/types/groups.type';

const props = defineProps<{
  sharedGroups?: FileShareDto[];
  unsharedGroups?: GroupOutDto[];
  allGroups?: GroupOutDto[];
}>();

const appConfig = useAppConfig();
const documentsStore = useDocumentsStore();
const toast = useToast();

const privateFileToShare = computed(() => documentsStore.privateFileToShare);
const privateFileToViewAccess = computed(() => documentsStore.privateFileToViewAccess);

const shareMutation = useShareDocumentMutation();

const handleShareDocument = (groupUuid: string) => {
  if (!privateFileToShare.value) return;

  shareMutation.mutate({
    fileId: privateFileToShare.value.fileId,
    groupUuid,
    accessLevel: 'leader',
  });
};

const revokeMutation = useDeleteSharingMutation();

const handleRevokeAccess = (groupName: string) => {
  if (!privateFileToViewAccess.value) return;

  const groupUuid = props.allGroups?.find((g) => g.name === groupName)?.uuid;

  // Local guard before triggering the mutation: requires a client-side toast
  if (!groupUuid) {
    toast.add({
      title: UI_TEXT.common.error,
      description: UI_TEXT.errors.groupUuidNotFound,
      color: 'error',
    });
    return;
  }

  revokeMutation.mutate({
    fileId: privateFileToViewAccess.value.fileId,
    groupUuid,
  });
};
</script>
