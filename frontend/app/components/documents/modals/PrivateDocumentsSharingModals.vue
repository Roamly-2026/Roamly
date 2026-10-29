<!-- frontend/app/components/documents/modals/PrivateDocumentsSharingModals.vue -->
<template>
  <div>
    <!-- SHARE DOCUMENT MODAL -->
    <BaseModal
      v-model:open="documentsStore.isPrivateShareModalOpen"
      :title="UI_TEXT.documents.share"
      :ui-size="LAYOUT_CONFIG.modalSizeMd"
    >
      <template #body>
        <div :class="LAYOUT_CONFIG.listModalScroll">
          <div v-for="group in unsharedGroups" :key="group.uuid" :class="LAYOUT_CONFIG.listCard">
            <div :class="LAYOUT_CONFIG.flexBetween">
              <div :class="LAYOUT_CONFIG.actionGroup">
                <UAvatar
                  :alt="group.name"
                  icon="i-heroicons-user-group"
                  size="xl"
                  :class="LAYOUT_CONFIG.listCardAvatar"
                />

                <div :class="LAYOUT_CONFIG.listCardInfo">
                  <div :class="LAYOUT_CONFIG.headerTitleRow">
                    <h4 :class="TYPOGRAPHY_CONFIG.listCardName">{{ group.name }}</h4>
                  </div>
                  <div :class="LAYOUT_CONFIG.headerTitleRow">
                    <UIcon name="i-heroicons-user-solid" :class="TYPOGRAPHY_CONFIG.iconBrandMd" />
                    <h4 :class="CALENDAR_CONFIG.metaValue">{{ group.current_size }}</h4>
                  </div>
                </div>
              </div>
              <BaseButton
                icon="i-heroicons-share"
                variant="ghostBrandIconButton"
                :class="COLOR_TOKENS.text.primaryMuted"
                :loading="shareMutation.isLoading.value"
                :tooltip="UI_TEXT.documents.shareWithGroup"
                @click="handleShareDocument(group.uuid)"
              />
            </div>
          </div>
          <div v-if="!unsharedGroups?.length" :class="TYPOGRAPHY_CONFIG.emptyStateText">
            {{ ' ' + UI_TEXT.documents.noAvailableGroups + ' ' }}
          </div>
        </div>
      </template>
      <template #footer>
        <div :class="LAYOUT_CONFIG.rightButtonWrapper">
          <BaseButton
            :label="UI_TEXT.common.close"
            :class="TYPOGRAPHY_CONFIG.modalActionBtnCancel"
            @click="documentsStore.closePrivateShareModal()"
          />
        </div>
      </template>
    </BaseModal>

    <!-- VIEW ACCESS MODAL -->
    <BaseModal
      v-model:open="documentsStore.isPrivateAccessModalOpen"
      :title="UI_TEXT.documents.access"
      :ui-size="LAYOUT_CONFIG.modalSizeMd"
    >
      <template #body>
        <div :class="LAYOUT_CONFIG.listModalScroll">
          <div
            v-for="share in sharedGroups"
            :key="share.groups.name"
            :class="LAYOUT_CONFIG.listCard"
          >
            <div :class="LAYOUT_CONFIG.flexBetween">
              <div :class="LAYOUT_CONFIG.actionGroup">
                <UAvatar
                  :alt="share.groups.name"
                  icon="i-heroicons-user-group"
                  size="xl"
                  :class="LAYOUT_CONFIG.listCardAvatar"
                />

                <div :class="LAYOUT_CONFIG.listCardInfo">
                  <div :class="LAYOUT_CONFIG.headerTitleRow">
                    <h4 :class="TYPOGRAPHY_CONFIG.listCardName">{{ share.groups.name }}</h4>
                  </div>
                  <p :class="TYPOGRAPHY_CONFIG.bodySmMutedTruncate">
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
                @click="handleRevokeAccess(share.groups.name)"
              />
            </div>
          </div>
          <div v-if="!sharedGroups?.length" :class="TYPOGRAPHY_CONFIG.emptyStateText">
            {{ ' ' + UI_TEXT.documents.notShared + ' ' }}
          </div>
        </div>
      </template>
      <template #footer>
        <div :class="LAYOUT_CONFIG.rightButtonWrapper">
          <BaseButton
            :label="UI_TEXT.common.close"
            variant="actionOkButton"
            :class="TYPOGRAPHY_CONFIG.modalActionBtnCancel"
            @click="documentsStore.closePrivateAccessModal()"
          />
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '#imports';
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
