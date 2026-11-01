<!-- frontend/app/components/events/modals/EventPreviewModal.vue -->
<template>
  <BaseModal
    v-model:open="eventsStore.isPreviewModalOpen"
    :title="UI_TEXT.events.details"
    :ui-size="LAYOUT_CONFIG.modalSizeMd"
  >
    <template #body>
      <div
        v-if="eventsStore.previewEvent"
        :class="[
          LAYOUT_CONFIG.modalScrollBody,
          eventsStore.previewEvent.isExpired ? OPACITY_TOKENS.subtle : '',
        ]"
      >
        <div :class="CALENDAR_CONFIG.previewTitleRow">
          <div :class="CALENDAR_CONFIG.previewTypeWrapper">
            <UIcon
              :name="
                eventsStore.previewEvent.is_private ? 'i-heroicons-user' : 'i-heroicons-user-group'
              "
              :class="CALENDAR_CONFIG.previewTypeIcon"
            />
            <span :class="CALENDAR_CONFIG.previewTypeText">{{
              eventsStore.previewEvent.is_private
                ? UI_TEXT.events.privateEvent
                : UI_TEXT.events.groupEvent
            }}</span>
          </div>
          <div :class="LAYOUT_CONFIG.headerTitleRow">
            <BaseButton
              v-if="
                eventsStore.previewEvent.creator?.email === currentUserEmail &&
                eventsStore.previewEvent.is_private
              "
              icon="i-heroicons-user-plus"
              variant="ghostBrandIconButton"
              :class="COLOR_TOKENS.text.primaryMuted"
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
        <h2 :class="CALENDAR_CONFIG.previewMainTitle">
          {{ eventsStore.previewEvent.title }}
          <span
            v-if="eventsStore.previewEvent.isExpired"
            :class="CALENDAR_CONFIG.previewExpiredBadge"
            >{{ UI_TEXT.events.expired }}</span
          >
        </h2>

        <div :class="CALENDAR_CONFIG.previewMetaRow">
          <div :class="CALENDAR_CONFIG.metaRowItem">
            <span :class="CALENDAR_CONFIG.metaLabel">{{ UI_TEXT.events.creatorLabel }}</span
            ><span :class="CALENDAR_CONFIG.metaValue">{{
              eventsStore.previewEvent.creator?.username
            }}</span>
          </div>

          <div :class="CALENDAR_CONFIG.metaRowItem">
            <span :class="CALENDAR_CONFIG.metaLabel">{{ UI_TEXT.events.dateLabel }}</span>
            <span
              v-if="
                new Date(eventsStore.previewEvent.start_time).toLocaleDateString() ===
                new Date(eventsStore.previewEvent.end_time).toLocaleDateString()
              "
              :class="CALENDAR_CONFIG.metaValue"
            >
              {{ new Date(eventsStore.previewEvent.start_time).toLocaleDateString() }}
            </span>
            <span v-else :class="CALENDAR_CONFIG.metaValue">
              {{ new Date(eventsStore.previewEvent.start_time).toLocaleDateString() }} -
              {{ new Date(eventsStore.previewEvent.end_time).toLocaleDateString() }}
            </span>
          </div>

          <div :class="CALENDAR_CONFIG.metaRowItem">
            <span :class="CALENDAR_CONFIG.metaLabel">{{ UI_TEXT.events.timeLabel }}</span>
            <span
              v-if="
                eventsStore.previewEvent.timeStartFormatted ===
                eventsStore.previewEvent.timeEndFormatted
              "
              :class="CALENDAR_CONFIG.metaValue"
            >
              {{ eventsStore.previewEvent.timeStartFormatted }}
            </span>
            <span v-else :class="CALENDAR_CONFIG.metaValue">
              {{ eventsStore.previewEvent.timeStartFormatted }} -
              {{ eventsStore.previewEvent.timeEndFormatted }}
            </span>
          </div>

          <div :class="CALENDAR_CONFIG.metaRowItemCenter">
            <span :class="CALENDAR_CONFIG.metaLabel">{{ UI_TEXT.events.membersLabel }}</span>
            <div :class="CALENDAR_CONFIG.participantsGroup">
              <template v-if="eventsStore.previewEvent.is_private">
                <div
                  :class="[
                    CALENDAR_CONFIG.participantsAvatars,
                    (eventsStore.previewEvent.members?.length || 0) > 5
                      ? CALENDAR_CONFIG.participantsOverlap
                      : CALENDAR_CONFIG.participantsGap,
                  ]"
                >
                  <UTooltip v-for="p in displayParticipants" :key="p.uuid" :text="p.username">
                    <UAvatar
                      :alt="p.username"
                      :src="p.profile_image_url || undefined"
                      icon="i-heroicons-user"
                      size="sm"
                      :class="CALENDAR_CONFIG.participantAvatar"
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
                      :class="CALENDAR_CONFIG.participantMoreBadge"
                      @click="openAllParticipantsModal"
                    >
                      +{{ extraParticipantsCount }}
                    </div>
                  </UTooltip>
                </div>
                <BaseButton
                  variant="link"
                  :class="CALENDAR_CONFIG.metaValueLink"
                  @click="openAllParticipantsModal"
                  >{{ UI_TEXT.events.showParticipants }}
                </BaseButton>
              </template>
              <template v-else>
                <div :class="CALENDAR_CONFIG.eventItemWrapper">
                  <span :class="TYPOGRAPHY_CONFIG.metaHighlight">{{
                    UI_TEXT.common.everyone
                  }}</span>
                </div>
              </template>
            </div>
          </div>
          <div :class="LAYOUT_CONFIG.modalFormGroup">
            <span :class="CALENDAR_CONFIG.metaLabel">{{ UI_TEXT.events.descriptionLabel }}</span>
            <span :class="CALENDAR_CONFIG.metaValue">{{
              eventsStore.previewEvent.description
            }}</span>
          </div>

          <!-- map -->
          <div
            v-if="eventsStore.previewEvent.address || eventsStore.previewEvent.latitude !== null"
            :class="LAYOUT_CONFIG.modalFormGroup"
          >
            <span :class="CALENDAR_CONFIG.metaLabel">{{ UI_TEXT.events.locationLabel }}</span>
            <span v-if="eventsStore.previewEvent.address" :class="CALENDAR_CONFIG.metaValue">
              {{ eventsStore.previewEvent.address }}
            </span>
            <div
              v-if="
                eventsStore.previewEvent.latitude !== null &&
                eventsStore.previewEvent.latitude !== undefined &&
                eventsStore.previewEvent.longitude !== null &&
                eventsStore.previewEvent.longitude !== undefined
              "
              :class="CALENDAR_CONFIG.previewMapPlaceholder"
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
      <div v-else :class="TYPOGRAPHY_CONFIG.emptyStateText">{{ UI_TEXT.events.selectEvent }}</div>
    </template>
    <template #footer>
      <div :class="LAYOUT_CONFIG.rightButtonWrapper">
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
import { useEventsStore } from '~/stores/events.modals.store';
import { useGroupsStore } from '~/stores/groups.modals.store';
import { useCurrentUserQuery } from '~/queries/user.query';
import { useGroupsQuery, useGroupInfosQuery } from '~/queries/groups.query';
import type { EventCreatorDto } from '~/types/events.type';

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
