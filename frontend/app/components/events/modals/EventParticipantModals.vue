<!-- frontend/app/components/events/modals/EventParticipantModals.vue -->
<template>
  <div>
    <!-- PARTICIPANTS MODAL -->
    <BaseModal
      v-model:open="eventsStore.isParticipantsModalOpen"
      :title="UI_TEXT.events.eventParticipants"
      :ui-size="appConfig.layout.modalSizeMd"
    >
      <template #body>
        <div :class="appConfig.calendar.participantModalScroll">
          <div
            v-for="user in eventsStore.currentEventParticipants"
            :key="user.uuid"
            :class="appConfig.calendar.participantCard"
            @click="handleOpenUserProfile(user)"
          >
            <div :class="appConfig.calendar.previewTitleRow">
              <div :class="appConfig.layout.actionGroup">
                <UAvatar
                  :alt="user.username"
                  :src="user.profile_image_url || undefined"
                  icon="i-heroicons-user"
                  size="xl"
                  :class="appConfig.calendar.participantCardAvatar"
                />

                <div :class="appConfig.calendar.participantCardInfo">
                  <div :class="appConfig.calendar.headerTitleRow">
                    <h4 :class="appConfig.calendar.participantCardName">{{ user.username }}</h4>
                    <UTooltip v-if="isGroupLeader(user)" :text="UI_TEXT.events.groupLeader">
                      <UIcon
                        name="i-heroicons-star"
                        :class="[SIZE_TOKENS.icon.sm, COLOR_TOKENS.text.brandAccent]"
                      />
                    </UTooltip>
                  </div>
                  <span :class="appConfig.calendar.participantCardRole">
                    {{ isEventCreator(user) ? UI_TEXT.events.creator : UI_TEXT.events.participant }}
                  </span>
                  <p :class="appConfig.calendar.participantCardEmail">{{ user.email }}</p>
                </div>
              </div>
              <BaseButton
                v-if="hasPermissionToDelete && user.email !== currentUserEmail"
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
            :class="appConfig.calendar.emptyPreview"
          >
            {{ UI_TEXT.events.noParticipants }}
          </div>
        </div>
      </template>
      <template #footer>
        <div :class="appConfig.calendar.filterButtonWrapper">
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
      :ui-size="appConfig.layout.modalSizeMd"
      @cancel="eventsStore.closeRemoveParticipantModal()"
      @confirm="confirmRemoveParticipant"
    >
      <template #body>
        <p :class="appConfig.typography.modalText">
          {{ ' ' + UI_TEXT.events.removeBeforeName }}
          <span :class="appConfig.typography.modalInlineHighlight">{{
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
      :ui-size="appConfig.layout.modalSizeMd"
    >
      <template #body>
        <div :class="appConfig.layout.modalForm">
          <p :class="appConfig.typography.modalText">{{ UI_TEXT.events.selectMembers }}</p>
          <div :class="appConfig.calendar.participantModalScroll">
            <div
              v-for="user in availableGroupMembers"
              :key="user.email"
              :class="[
                appConfig.calendar.participantCard,
                selectedEmailsToAdd.includes(user.email)
                  ? [BORDER_TOKENS.ringBrand, COLOR_TOKENS.surface.brandTint]
                  : '',
              ]"
              @click="toggleMemberSelection(user.email)"
            >
              <div :class="appConfig.calendar.previewTitleRow">
                <div :class="appConfig.layout.actionGroup">
                  <UAvatar
                    :alt="user.username"
                    :src="user.profile_image_url || undefined"
                    icon="i-heroicons-user"
                    size="xl"
                    :class="appConfig.calendar.participantCardAvatar"
                  />
                  <div :class="appConfig.calendar.participantCardInfo">
                    <h4 :class="appConfig.calendar.participantCardName">{{ user.username }}</h4>
                    <p :class="appConfig.calendar.participantCardEmail">{{ user.email }}</p>
                  </div>
                </div>
                <UIcon
                  :name="
                    selectedEmailsToAdd.includes(user.email)
                      ? 'i-heroicons-check-circle-solid'
                      : 'i-heroicons-plus-circle'
                  "
                  :class="[
                    SIZE_TOKENS.icon.lg,
                    selectedEmailsToAdd.includes(user.email)
                      ? COLOR_TOKENS.text.brandAccent
                      : COLOR_TOKENS.text.primaryFaint,
                  ]"
                />
              </div>
            </div>
            <div
              v-if="availableGroupMembers.length === 0"
              :class="appConfig.calendar.emptyPreview"
            >
              {{ ' ' + UI_TEXT.events.noAvailableMembers + ' ' }}
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div :class="appConfig.layout.modalActions">
          <BaseButton
            :label="UI_TEXT.common.cancel"
            variant="actionCancelButton"
            :class="appConfig.typography.modalActionBtnCancel"
            :disabled="addParticipantsMutation.isLoading.value"
            @click="closeAddMembersModal"
          />
          <BaseButton
            :label="UI_TEXT.events.addSelected"
            variant="actionOkButton"
            :class="appConfig.typography.modalActionBtnOk"
            :loading="addParticipantsMutation.isLoading.value"
            :disabled="selectedEmailsToAdd.length === 0"
            @click="submitNewMembers"
          />
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAppConfig } from '#imports';
import { useEventsStore } from '~/stores/events.modals.store';
import { useGroupsStore } from '~/stores/groups.modals.store';
import { useCurrentUserQuery } from '~/queries/user.query';
import { useGroupsQuery, useGroupInfosQuery } from '~/queries/groups.query';
import {
  useAddParticipantsMutation,
  useRemoveParticipantMutation,
} from '~/queries/events.mutation';
import type { EventCreatorDto } from '~/types/events.type';

const appConfig = useAppConfig();
const eventsStore = useEventsStore();
const groupsStore = useGroupsStore();

const { data: currentUser } = useCurrentUserQuery();
const { data: groupsData } = useGroupsQuery();
const { data: groupInfosData } = useGroupInfosQuery(
  computed(() => eventsStore.selectedGroupUuid || ''),
);
const currentUserEmail = computed(() => currentUser.value?.email);

const removeParticipantMutation = useRemoveParticipantMutation(
  computed(() => eventsStore.selectedGroupUuid),
  {
    onSuccess: () => {
      if (eventsStore.participantToRemove) {
        eventsStore.currentEventParticipants = eventsStore.currentEventParticipants.filter(
          (p) => p.uuid !== eventsStore.participantToRemove!.uuid,
        );
      }
      eventsStore.closeRemoveParticipantModal();
    },
  },
);

const addParticipantsMutation = useAddParticipantsMutation(
  computed(() => eventsStore.selectedGroupUuid),
  {
    onSuccess: () => {
      closeAddMembersModal();
    },
  },
);

const confirmRemoveParticipant = () => {
  if (!eventsStore.previewEvent || !eventsStore.participantToRemove) return;
  removeParticipantMutation.mutate({
    eventUuid: eventsStore.previewEvent.uuid,
    targetUuid: eventsStore.participantToRemove.uuid,
  });
};

const handleOpenUserProfile = (user: EventCreatorDto) => {
  eventsStore.closeParticipantsModal();
  eventsStore.closePreviewModal();
  groupsStore.selectedUserProfile = {
    userUuid: user.uuid || '',
    username: user.username,
    email: user.email || UI_TEXT.common.notAvailable,
    role: getGroupRole(user),
    joinedAt: UI_TEXT.common.unknown,
    canViewDocuments: false,
  };
  groupsStore.isUserProfileModalOpen = true;
};

const selectedGroupDetails = computed(() =>
  groupsData.value?.items?.find((g) => g.uuid === eventsStore.selectedGroupUuid),
);
const isCurrentUserLeader = computed(
  () => selectedGroupDetails.value?.role?.toLowerCase() === 'leader',
);
const hasPermissionToDelete = computed<boolean>(() => {
  const creatorEmail = eventsStore.previewEvent?.creator?.email;
  return (
    isCurrentUserLeader.value ||
    (!!creatorEmail && !!currentUserEmail.value && creatorEmail === currentUserEmail.value)
  );
});

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

const getGroupRole = (user?: EventCreatorDto | null): string => {
  if (!user || !groupInfosData.value?.group_profiles) return UI_TEXT.common.member;

  const profile = groupInfosData.value.group_profiles.find(
    (p: { users?: { email?: string; username?: string }; roles?: { type?: string } }) => {
      const matchEmail =
        user.email &&
        p.users?.email &&
        user.email.trim().toLowerCase() === p.users.email.trim().toLowerCase();
      const matchUsername =
        user.username &&
        p.users?.username &&
        user.username.trim().toLowerCase() === p.users.username.trim().toLowerCase();
      return matchEmail || matchUsername;
    },
  );

  const roleType = profile?.roles?.type?.toLowerCase();
  return roleType === 'leader' ? UI_TEXT.common.leader : UI_TEXT.common.member;
};

const isGroupLeader = (user: EventCreatorDto): boolean =>
  getGroupRole(user) === UI_TEXT.common.leader;
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
  if (selectedEmailsToAdd.value.length === 0 || !eventsStore.previewEvent) return;
  addParticipantsMutation.mutate({
    eventUuid: eventsStore.previewEvent.uuid,
    participant_emails: selectedEmailsToAdd.value,
  });
};
</script>
