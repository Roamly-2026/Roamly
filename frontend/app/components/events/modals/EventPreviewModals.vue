<!-- frontend/app/components/events/modals/EventPreviewModal.vue -->
<template>
  <BaseModal
    v-model:open="eventsStore.isPreviewModalOpen"
    :title="UI_TEXT.events.details"
    :ui-size="appConfig.layout.modalSizeMd"
  >
    <template #body>
      <div
        v-if="eventsStore.previewEvent"
        :class="[
          appConfig.calendar.previewWrapper,
          eventsStore.previewEvent.isExpired ? 'opacity-70' : '',
          'p-2! gap-4! overflow-y-auto max-h-[65vh] overscroll-contain custom-scrollbar',
        ]"
      >
        <div :class="appConfig.calendar.previewTitleRow" class="mb-2 justify-between">
          <div :class="appConfig.calendar.previewTypeWrapper">
            <UIcon
              :name="
                eventsStore.previewEvent.is_private ? 'i-heroicons-user' : 'i-heroicons-user-group'
              "
              :class="appConfig.calendar.previewTypeIcon"
            />
            <span :class="appConfig.calendar.previewTypeText">{{
              eventsStore.previewEvent.is_private
                ? UI_TEXT.events.privateEvent
                : UI_TEXT.events.groupEvent
            }}</span>
          </div>
          <div class="flex items-center gap-1">
            <BaseButton
              v-if="
                eventsStore.previewEvent.creator?.email === currentUserEmail &&
                eventsStore.previewEvent.is_private
              "
              icon="i-heroicons-user-plus"
              variant="ghostBrandIconButton"
              class="text-dark-text/70"
              :tooltip="UI_TEXT.events.inviteMembers"
              @click="eventsStore.openAddMembersModal(eventsStore.previewEvent!)"
            />
            <BaseButton
              v-if="hasPermissionToDelete"
              icon="i-heroicons-trash"
              variant="ghostDangerIconButton"
              :tooltip="UI_TEXT.events.deleteEvent"
              @click="eventsStore.openDeleteEventModal(eventsStore.previewEvent!)"
            />
            <BaseButton
              v-else-if="canLeaveEvent"
              icon="i-heroicons-arrow-right-on-rectangle"
              variant="ghostDangerIconButton"
              :tooltip="UI_TEXT.events.leaveEvent"
              @click="eventsStore.openLeaveEventModal(eventsStore.previewEvent!)"
            />
          </div>
        </div>
        <h2 :class="appConfig.calendar.previewMainTitle">
          {{ eventsStore.previewEvent.title }}
          <span
            v-if="eventsStore.previewEvent.isExpired"
            :class="appConfig.calendar.previewExpiredBadge"
            >{{ UI_TEXT.events.expired }}</span
          >
        </h2>

        <div :class="appConfig.calendar.previewMetaRow">
          <div :class="appConfig.calendar.metaRowItem">
            <span :class="appConfig.calendar.metaLabel">{{ UI_TEXT.events.creatorLabel }}</span
            ><span :class="appConfig.calendar.metaValue">{{
              eventsStore.previewEvent.creator?.username
            }}</span>
          </div>

          <div :class="appConfig.calendar.metaRowItem">
            <span :class="appConfig.calendar.metaLabel">{{ UI_TEXT.events.dateLabel }}</span>
            <span
              v-if="
                new Date(eventsStore.previewEvent.start_time).toLocaleDateString() ===
                new Date(eventsStore.previewEvent.end_time).toLocaleDateString()
              "
              :class="appConfig.calendar.metaValue"
            >
              {{ new Date(eventsStore.previewEvent.start_time).toLocaleDateString() }}
            </span>
            <span v-else :class="appConfig.calendar.metaValue">
              {{ new Date(eventsStore.previewEvent.start_time).toLocaleDateString() }} -
              {{ new Date(eventsStore.previewEvent.end_time).toLocaleDateString() }}
            </span>
          </div>

          <div :class="appConfig.calendar.metaRowItem">
            <span :class="appConfig.calendar.metaLabel">{{ UI_TEXT.events.timeLabel }}</span>
            <span
              v-if="
                eventsStore.previewEvent.timeStartFormatted ===
                eventsStore.previewEvent.timeEndFormatted
              "
              :class="appConfig.calendar.metaValue"
            >
              {{ eventsStore.previewEvent.timeStartFormatted }}
            </span>
            <span v-else :class="appConfig.calendar.metaValue">
              {{ eventsStore.previewEvent.timeStartFormatted }} -
              {{ eventsStore.previewEvent.timeEndFormatted }}
            </span>
          </div>

          <div :class="appConfig.calendar.metaRowItemCenter">
            <span :class="appConfig.calendar.metaLabel">{{ UI_TEXT.events.membersLabel }}</span>
            <div :class="appConfig.calendar.participantsGroup">
              <template v-if="eventsStore.previewEvent.is_private">
                <div
                  :class="[
                    appConfig.calendar.participantsAvatars,
                    (eventsStore.previewEvent.members?.length || 0) > 5
                      ? appConfig.calendar.participantsOverlap
                      : appConfig.calendar.participantsGap,
                  ]"
                >
                  <UTooltip v-for="p in displayParticipants" :key="p.uuid" :text="p.username">
                    <UAvatar
                      :alt="p.username"
                      :src="p.profile_image_url || undefined"
                      icon="i-heroicons-user"
                      size="sm"
                      :class="appConfig.calendar.participantAvatar"
                      @click="handleOpenUserProfile(p)"
                    />
                  </UTooltip>
                  <UTooltip
                    v-if="extraParticipantsCount > 0"
                    :text="
                      '+' + extraParticipantsCount.toString() + UI_TEXT.events.moreParticipants
                    "
                  >
                    <div
                      :class="appConfig.calendar.participantMoreBadge"
                      @click="openAllParticipantsModal"
                    >
                      +{{ extraParticipantsCount }}
                    </div>
                  </UTooltip>
                </div>
                <BaseButton
                  variant="link"
                  class="p-0 text-sm h-auto font-medium"
                  @click="openAllParticipantsModal"
                  >{{ UI_TEXT.events.showParticipants }}
                </BaseButton>
              </template>
              <template v-else>
                <div class="flex items-center gap-3">
                  <span class="text-sm font-bold text-dark-text">{{
                    UI_TEXT.common.everyone
                  }}</span>
                </div>
              </template>
            </div>
          </div>
          <div :class="[appConfig.calendar.metaRowItem, 'mt-2 flex-col gap-1!']">
            <span :class="appConfig.calendar.metaLabel">{{ UI_TEXT.events.descriptionLabel }}</span>
            <span :class="appConfig.calendar.metaValue">{{
              eventsStore.previewEvent.description
            }}</span>
          </div>

          <!-- map -->
          <div
            v-if="eventsStore.previewEvent.address || eventsStore.previewEvent.latitude !== null"
            :class="[appConfig.calendar.metaRowItem, 'mt-4 flex-col gap-2! items-start']"
          >
            <span :class="appConfig.calendar.metaLabel">{{ UI_TEXT.events.locationLabel }}</span>
            <span v-if="eventsStore.previewEvent.address" :class="appConfig.calendar.metaValue">
              {{ eventsStore.previewEvent.address }}
            </span>
            <div
              v-if="
                eventsStore.previewEvent.latitude !== null &&
                eventsStore.previewEvent.latitude !== undefined &&
                eventsStore.previewEvent.longitude !== null &&
                eventsStore.previewEvent.longitude !== undefined
              "
              class="w-full h-48 rounded-lg overflow-hidden border border-gray-200 mt-1 relative z-0 shrink-0"
            >
              <ClientOnly>
                <EventMapPreview
                  :latitude="eventsStore.previewEvent.latitude"
                  :longitude="eventsStore.previewEvent.longitude"
                />
              </ClientOnly>
            </div>
          </div>
        </div>
      </div>
      <div v-else :class="appConfig.calendar.emptyPreview">{{ UI_TEXT.events.selectEvent }}</div>
    </template>
    <template #footer>
      <div class="flex justify-end w-full">
        <BaseButton
          :label="UI_TEXT.common.close"
          variant="actionCancelButton"
          @click="eventsStore.closePreviewModal()"
        />
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAppConfig } from '#imports';
import { useEventsStore } from '~/stores/events.modals.store';
import { useGroupsStore } from '~/stores/groups.modals.store';
import { useCurrentUserQuery } from '~/queries/user.query';
import { useGroupsQuery, useGroupInfosQuery } from '~/queries/groups.query';
import type { EventCreatorDto } from '~/types/events.type';

const appConfig = useAppConfig();
const eventsStore = useEventsStore();
const groupsStore = useGroupsStore();

const { data: currentUser } = useCurrentUserQuery();
const currentUserEmail = computed(() => currentUser.value?.email);

const { data: groupsData } = useGroupsQuery();
const { data: groupInfosData } = useGroupInfosQuery(
  computed(() => eventsStore.selectedGroupUuid || ''),
);

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

const canLeaveEvent = computed<boolean>(() => {
  const event = eventsStore.previewEvent;
  if (!event || hasPermissionToDelete.value) return false;
  return event.members?.some((m) => m.email === currentUserEmail.value) ?? false;
});

const displayParticipants = computed<EventCreatorDto[]>(
  () => eventsStore.previewEvent?.members?.slice(0, 5) || [],
);
const extraParticipantsCount = computed<number>(() =>
  Math.max(0, (eventsStore.previewEvent?.members?.length || 0) - 5),
);

const openAllParticipantsModal = () => {
  if (eventsStore.previewEvent) {
    eventsStore.openParticipantsModal(eventsStore.previewEvent);
  }
};

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
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}
</style>
