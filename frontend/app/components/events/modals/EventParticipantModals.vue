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
            <div class="flex items-center justify-between w-full">
              <div class="flex items-center gap-5 cursor-pointer">
                <UAvatar
                  :alt="user.username"
                  :src="user.profile_image_url || undefined"
                  icon="i-heroicons-user"
                  size="xl"
                  :class="appConfig.calendar.participantCardAvatar"
                />

                <div :class="appConfig.calendar.participantCardInfo">
                  <div class="flex items-center gap-1.5">
                    <h4 :class="appConfig.calendar.participantCardName">{{ user.username }}</h4>
                    <UTooltip v-if="isGroupLeader(user)" :text="UI_TEXT.events.groupLeader">
                      <UIcon name="i-heroicons-star" class="w-4 h-4 text-amber-500" />
                    </UTooltip>
                  </div>
                  <span :class="appConfig.calendar.participantCardRole">
                    {{ isEventCreator(user) ? UI_TEXT.events.creator : UI_TEXT.events.participant }}
                  </span>
                  <p :class="appConfig.calendar.participantCardEmail">{{ user.email }}</p>
                </div>
              </div>
              <UTooltip
                v-if="hasPermissionToDelete && user.email !== currentUserEmail"
                :text="UI_TEXT.tooltips.removeParticipant"
                :ui="{ content: 'z-[9999]' }"
                :popper="{ placement: 'top', strategy: 'fixed' }"
              >
                <UButton
                  icon="i-heroicons-user-minus"
                  variant="ghostDangerIconButton"
                  :loading="removeParticipantMutation.isLoading.value"
                  @click.stop="eventsStore.openRemoveParticipantModal(user)"
                />
              </UTooltip>
            </div>
          </div>
          <div
            v-if="eventsStore.currentEventParticipants.length === 0"
            class="text-sm font-medium text-dark-text/50 p-4"
          >
            {{ UI_TEXT.events.noParticipants }}
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end w-full">
          <UButton
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
          {{ ' ' + UI_TEXT.events.removeBeforeName }}{{ eventsStore.participantToRemove?.username
          }}{{ UI_TEXT.events.removeAfterName + ' ' }}
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
        <div class="flex flex-col gap-4">
          <p class="text-sm text-dark-text/70">{{ UI_TEXT.events.selectMembers }}</p>
          <div
            :class="appConfig.calendar.participantModalScroll"
            class="flex flex-wrap gap-4 max-h-60 overflow-y-auto p-1"
          >
            <div
              v-for="user in availableGroupMembers"
              :key="user.email"
              :class="[
                appConfig.calendar.participantCard,
                'cursor-pointer transition-colors',
                selectedEmailsToAdd.includes(user.email)
                  ? 'ring-2 ring-brand-500 bg-brand-50'
                  : 'hover:bg-surface-100',
              ]"
              @click="toggleMemberSelection(user.email)"
            >
              <div class="flex items-center justify-between w-full">
                <div class="flex items-center gap-5">
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
                  v-if="selectedEmailsToAdd.includes(user.email)"
                  name="i-heroicons-check-circle"
                  class="w-7 h-7 text-brand-500 shrink-0"
                />
                <div
                  v-else
                  class="w-6 h-6 rounded-full border-2 border-dark-text/20 shrink-0"
                ></div>
              </div>
            </div>
            <div
              v-if="availableGroupMembers.length === 0"
              class="text-sm font-medium text-dark-text/50 p-4"
            >
              {{ ' ' + UI_TEXT.events.noAvailableMembers + ' ' }}
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-between w-full gap-3">
          <UButton
            :label="UI_TEXT.common.cancel"
            variant="actionCancelButton"
            :disabled="addParticipantsMutation.isLoading.value"
            @click="closeAddMembersModal"
          />
          <UButton
            :label="UI_TEXT.events.addSelected"
            variant="actionOkButton"
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
import { useAppConfig, useToast } from '#imports';
import { useEventsStore } from '~/stores/events.modals.store';
import { useGroupsStore } from '~/stores/groups.modals.store';
import { useCurrentUserQuery } from '~/queries/user.query';
import { useGroupsQuery, useGroupInfosQuery } from '~/queries/groups.query';
import {
  useAddParticipantsMutation,
  useRemoveParticipantMutation,
} from '~/queries/events.mutation';
import type { EventCreatorDto } from '~/types/events.type';
import { getErrorMessage } from '~/utils/error.utils';

const appConfig = useAppConfig();
const toast = useToast();
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
      toast.add({ title: UI_TEXT.common.success, description: UI_TEXT.events.participantRemoved });
      if (eventsStore.participantToRemove) {
        eventsStore.currentEventParticipants = eventsStore.currentEventParticipants.filter(
          (p) => p.uuid !== eventsStore.participantToRemove!.uuid,
        );
      }
      eventsStore.closeRemoveParticipantModal();
    },
    onError: (err) =>
      toast.add({ title: UI_TEXT.common.error, description: getErrorMessage(err) }),
  },
);

const addParticipantsMutation = useAddParticipantsMutation(
  computed(() => eventsStore.selectedGroupUuid),
  {
    onSuccess: () => {
      toast.add({ title: UI_TEXT.common.success, description: UI_TEXT.events.membersAdded });
      closeAddMembersModal();
    },
    onError: (err) =>
      toast.add({ title: UI_TEXT.common.error, description: getErrorMessage(err) }),
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
