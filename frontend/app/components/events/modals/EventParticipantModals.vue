<!-- frontend/app/components/events/modals/EventParticipantModals.vue -->
<template>
  <div>
    <!-- PARTICIPANTS MODAL -->
    <BaseModal
      v-model:open="eventsStore.isParticipantsModalOpen"
      :title="UI_TEXT.events.eventParticipants"
      :ui-size="LAYOUT_CONFIG.modalSizeMd"
    >
      <template #body>
        <div :class="LAYOUT_CONFIG.listModalScroll">
          <div
            v-for="user in eventsStore.currentEventParticipants"
            :key="user.uuid"
            :class="LAYOUT_CONFIG.listCard"
            @click="handleOpenUserProfile(user)"
          >
            <div :class="LAYOUT_CONFIG.flexBetween">
              <div :class="LAYOUT_CONFIG.actionGroup">
                <UAvatar
                  :alt="user.username"
                  :src="user.profile_image_url || undefined"
                  icon="i-heroicons-user"
                  size="xl"
                  :class="LAYOUT_CONFIG.listCardAvatar"
                />

                <div :class="LAYOUT_CONFIG.listCardInfo">
                  <div :class="LAYOUT_CONFIG.headerTitleRow">
                    <h4 :class="TYPOGRAPHY_CONFIG.listCardName">{{ user.username }}</h4>
                  </div>
                  <span :class="TYPOGRAPHY_CONFIG.badgeRole">
                    {{ isEventCreator(user) ? UI_TEXT.events.creator : UI_TEXT.events.participant }}
                  </span>
                  <p :class="TYPOGRAPHY_CONFIG.bodySmMutedTruncate">{{ user.email }}</p>
                </div>
              </div>
              <BaseButton
                v-if="canManageEvent(eventsStore.previewEvent) && user.uuid !== currentUserUuid"
                icon="i-heroicons-user-minus"
                variant="ghostDangerIconButton"
                :loading="removeParticipantMutation.isLoading.value"
                :tooltip="UI_TEXT.tooltips.removeParticipant"
                @click.stop="eventsStore.openRemoveParticipantModal(user)"
              />
            </div>
          </div>
          <div
            v-if="eventsStore.currentEventParticipants.length === 0"
            :class="TYPOGRAPHY_CONFIG.emptyStateText"
          >
            {{ UI_TEXT.events.noParticipants }}
          </div>
        </div>
      </template>
      <template #footer>
        <div :class="LAYOUT_CONFIG.rightButtonWrapper">
          <BaseButton
            :label="UI_TEXT.common.close"
            variant="actionCancelButton"
            @click="eventsStore.closeParticipantsModal()"
          />
        </div>
      </template>
    </BaseModal>

    <!-- REMOVE PARTICIPANT MODAL -->
    <ConfirmModal
      v-model:open="eventsStore.isRemoveParticipantModalOpen"
      :title="UI_TEXT.events.removeParticipant"
      :cancel-text="UI_TEXT.common.cancel"
      :confirm-text="UI_TEXT.common.remove"
      :loading="removeParticipantMutation.isLoading.value"
      :ui-size="LAYOUT_CONFIG.modalSizeMd"
      @cancel="eventsStore.closeRemoveParticipantModal()"
      @confirm="confirmRemoveParticipant"
    >
      <template #body>
        <p :class="TYPOGRAPHY_CONFIG.modalText">
          {{ ' ' + UI_TEXT.events.removeBeforeName }}
          <span :class="TYPOGRAPHY_CONFIG.modalInlineHighlight">{{
            eventsStore.participantToRemove?.username
          }}</span>
          {{ UI_TEXT.events.removeAfterName + ' ' }}
        </p>
      </template>
    </ConfirmModal>

    <!-- ADD MEMBERS MODAL -->
    <BaseModal
      v-model:open="eventsStore.isAddMembersModalOpen"
      :title="UI_TEXT.events.addMembers"
      :ui-size="LAYOUT_CONFIG.modalSizeMd"
    >
      <template #body>
        <div :class="LAYOUT_CONFIG.modalForm">
          <p :class="TYPOGRAPHY_CONFIG.modalText">{{ UI_TEXT.events.selectMembers }}</p>
          <div :class="LAYOUT_CONFIG.listModalScroll">
            <div
              v-for="user in availableGroupMembers"
              :key="user.email"
              :class="[
                LAYOUT_CONFIG.listCard,
                selectedEmailsToAdd.includes(user.email) ? LAYOUT_CONFIG.listCardSelected : '',
              ]"
              @click="toggleMemberSelection(user.email)"
            >
              <div :class="LAYOUT_CONFIG.flexBetween">
                <div :class="LAYOUT_CONFIG.actionGroup">
                  <UAvatar
                    :alt="user.username"
                    :src="user.profile_image_url || undefined"
                    icon="i-heroicons-user"
                    size="xl"
                    :class="LAYOUT_CONFIG.listCardAvatar"
                  />
                  <div :class="LAYOUT_CONFIG.listCardInfo">
                    <h4 :class="TYPOGRAPHY_CONFIG.listCardName">{{ user.username }}</h4>
                    <p :class="TYPOGRAPHY_CONFIG.bodySmMutedTruncate">{{ user.email }}</p>
                  </div>
                </div>
                <UIcon
                  :name="
                    selectedEmailsToAdd.includes(user.email)
                      ? 'i-heroicons-check-circle-solid'
                      : 'i-heroicons-plus-circle'
                  "
                  :class="
                    selectedEmailsToAdd.includes(user.email)
                      ? TYPOGRAPHY_CONFIG.iconBrandLg
                      : TYPOGRAPHY_CONFIG.iconFaintSm
                  "
                />
              </div>
            </div>
            <div
              v-if="availableGroupMembers.length === 0"
              :class="TYPOGRAPHY_CONFIG.emptyStateText"
            >
              {{ ' ' + UI_TEXT.events.noAvailableMembers + ' ' }}
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div :class="LAYOUT_CONFIG.modalActions">
          <BaseButton
            :label="UI_TEXT.common.cancel"
            variant="actionCancelButton"
            :class="TYPOGRAPHY_CONFIG.modalActionBtnCancel"
            :disabled="addParticipantsMutation.isLoading.value"
            @click="closeAddMembersModal"
          />
          <BaseButton
            :label="UI_TEXT.events.addSelected"
            variant="actionOkButton"
            :class="TYPOGRAPHY_CONFIG.modalActionBtnOk"
            :loading="addParticipantsMutation.isLoading.value"
            :disabled="
              selectedEmailsToAdd.length === 0 ||
              !eventsStore.previewEvent?.is_private ||
              !canManageEvent(eventsStore.previewEvent)
            "
            @click="submitNewMembers"
          />
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useEventPermissions } from '~/composables/useEventPermissions';
import { useEventsStore } from '~/stores/events.modals.store';
import { useGroupsStore } from '~/stores/groups.modals.store';
import { useCurrentUserQuery } from '~/queries/user.query';
import { useGroupInfosQuery } from '~/queries/groups.query';
import {
  useAddParticipantsMutation,
  useRemoveParticipantMutation,
} from '~/queries/events.mutation';
import type { EventCreatorDto } from '~/types/events.type';

const eventsStore = useEventsStore();
const groupUuid = computed(() => eventsStore.selectedGroupUuid);
const { currentUserUuid, canManageEvent } = useEventPermissions(groupUuid);
const groupsStore = useGroupsStore();

const { data: currentUser } = useCurrentUserQuery();
const { data: groupInfosData } = useGroupInfosQuery(computed(() => groupUuid.value || ''));
const currentUserEmail = computed(() => currentUser.value?.email);

const removeParticipantMutation = useRemoveParticipantMutation(groupUuid, {
  onSuccess: () => {
    if (eventsStore.participantToRemove) {
      eventsStore.currentEventParticipants = eventsStore.currentEventParticipants.filter(
        (p) => p.uuid !== eventsStore.participantToRemove!.uuid,
      );
    }
    eventsStore.closeRemoveParticipantModal();
  },
});

const addParticipantsMutation = useAddParticipantsMutation(groupUuid, {
  onSuccess: () => {
    closeAddMembersModal();
  },
});

const confirmRemoveParticipant = () => {
  const event = eventsStore.previewEvent;
  const participant = eventsStore.participantToRemove;
  if (
    !event ||
    !participant ||
    !canManageEvent(event) ||
    participant.uuid === currentUserUuid.value
  ) {
    return;
  }

  removeParticipantMutation.mutate({ eventUuid: event.uuid, targetUuid: participant.uuid });
};

const handleOpenUserProfile = (user: EventCreatorDto) => {
  eventsStore.closeParticipantsModal();
  eventsStore.closePreviewModal();
  const profile = groupInfosData.value?.group_profiles.find(
    (item) => item.users.uuid === user.uuid,
  );
  groupsStore.selectedUserProfile = {
    userUuid: user.uuid || '',
    username: user.username,
    email: user.email || UI_TEXT.common.notAvailable,
    system_role: profile?.system_role ?? null,
    custom_role: profile?.custom_role ?? null,
    joinedAt: UI_TEXT.common.unknown,
  };
  groupsStore.isUserProfileModalOpen = true;
};

const availableGroupMembers = computed<EventCreatorDto[]>(() => {
  const rawProfiles = groupInfosData.value?.group_profiles || [];
  const allGroupMembers: EventCreatorDto[] = rawProfiles.map(
    (profile: {
      users: { uuid?: string; username: string; email: string; profile_image_url?: string | null };
    }) => ({
      uuid: profile.users.uuid || '',
      username: profile.users.username,
      email: profile.users.email,
      profile_image_url: profile.users.profile_image_url || null,
    }),
  );
  const currentEventEmails =
    eventsStore.previewEvent?.members?.map((m: EventCreatorDto) => m.email) || [];

  return allGroupMembers.filter(
    (m: EventCreatorDto) =>
      m.email && !currentEventEmails.includes(m.email) && m.email !== currentUserEmail.value,
  );
});

const isEventCreator = (user: EventCreatorDto): boolean => {
  const creator = eventsStore.previewEvent?.creator;
  if (!creator) return false;
  const matchEmail = !!(
    user.email &&
    creator.email &&
    user.email.trim().toLowerCase() === creator.email.trim().toLowerCase()
  );
  const matchUsername = !!(
    user.username &&
    creator.username &&
    user.username.trim().toLowerCase() === creator.username.trim().toLowerCase()
  );
  return matchEmail || matchUsername;
};

const selectedEmailsToAdd = ref<string[]>([]);
const toggleMemberSelection = (email: string) => {
  const index = selectedEmailsToAdd.value.indexOf(email);
  if (index === -1) selectedEmailsToAdd.value.push(email);
  else selectedEmailsToAdd.value.splice(index, 1);
};
const closeAddMembersModal = () => {
  selectedEmailsToAdd.value = [];
  eventsStore.closeAddMembersModal();
};
const submitNewMembers = () => {
  const event = eventsStore.previewEvent;
  if (!event?.is_private || !canManageEvent(event) || selectedEmailsToAdd.value.length === 0) {
    return;
  }

  addParticipantsMutation.mutate({
    eventUuid: event.uuid,
    participant_emails: selectedEmailsToAdd.value,
  });
};
</script>
