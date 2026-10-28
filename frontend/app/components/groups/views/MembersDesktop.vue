<!-- frontend/app/components/groups/views/MembersDesktop.vue -->
<template>
  <div :class="appConfig.layout.pageWrapper">
    <!-- HEADER & SEARCH SECTION -->
    <div :class="appConfig.layout.cardContent">
      <div :class="appConfig.layout.pageHeader">
        <div :class="appConfig.calendar.headerActionLeft">
          <BaseButton
            v-if="isCurrentUserLeader"
            icon="i-heroicons-trash"
            variant="glassIconButtonDanger"
            :tooltip="UI_TEXT.tooltips.deleteGroup"
            @click="emit('deleteGroup')"
          />
          <BaseButton
            icon="i-heroicons-arrow-right-on-rectangle"
            variant="glassIconButtonDanger"
            :tooltip="UI_TEXT.tooltips.leaveGroup"
            @click="emit('leaveGroup')"
          />
        </div>

        <div :class="appConfig.calendar.headerCenter">
          <div :class="appConfig.calendar.headerTitleRow">
            <h1 :class="appConfig.typography.pageTitle">
              {{ groupInfos?.name || UI_TEXT.common.loading }}
            </h1>
            <BaseButton
              v-if="isCurrentUserLeader"
              icon="i-heroicons-pencil"
              variant="ghostBrandIconButton"
              :tooltip="UI_TEXT.tooltips.editGroup"
              @click="groupsStore.openUpdateModal(groupInfos?.name || '')"
            />
          </div>
          <p :class="appConfig.typography.pageSubtitle">
            {{ UI_TEXT.common.members }}
          </p>
        </div>

        <div :class="appConfig.calendar.headerActionRight">
          <BaseButton
            icon="i-heroicons-users"
            variant="glassIconButtonBrand"
            :to="membersRoute"
            :tooltip="UI_TEXT.tooltips.members"
          />
          <BaseButton
            icon="i-heroicons-calendar"
            variant="glassIconButton"
            :to="eventsRoute"
            :tooltip="UI_TEXT.tooltips.calendar"
          />
          <BaseButton
            icon="i-heroicons-photo"
            variant="glassIconButton"
            :to="mediaRoute"
            :tooltip="UI_TEXT.tooltips.photos"
          />
          <BaseButton
            icon="i-heroicons-document-text"
            variant="glassIconButton"
            :to="documentsRoute"
            :tooltip="UI_TEXT.tooltips.documents"
          />
        </div>
      </div>

      <div :class="appConfig.layout.flexBetween">
        <div :class="appConfig.calendar.headerSearchWrapper">
          <BaseSearchInput
            :model-value="searchQuery"
            :placeholder="UI_TEXT.groups.searchMembers"
            @update:model-value="emit('update:searchQuery', $event)"
          />
        </div>

        <div :class="appConfig.calendar.headerTitleRow">
          <BaseButton
            v-if="isCurrentUserLeader"
            icon="i-heroicons-user-plus"
            variant="glassIconButtonHighlight"
            :tooltip="UI_TEXT.tooltips.inviteUser"
            @click="groupsStore.openInviteModal()"
          />
        </div>
      </div>
    </div>

    <!-- MEMBERS LIST SECTION -->
    <div :class="CARD_CONFIG.slots.root">
      <ClientOnly>
        <div v-if="isLoading" :class="appConfig.typography.statusLoading">
          {{ UI_TEXT.common.loading }}
        </div>
        <div v-else-if="error" :class="appConfig.typography.statusError">
          {{ UI_TEXT.errors.fetch }}
        </div>

        <div v-else-if="filteredMembers?.length" :class="appConfig.layout.cardGrid">
          <BaseCard
            v-for="profile in filteredMembers"
            :key="profile.users.email"
            variant="interactiveGlass"
            :class="[appConfig.layout.headerRelative, INTERACTION_TOKENS.base]"
            @click="emit('openProfile', profile)"
          >
            <div :class="appConfig.layout.memberCardInner">
              <div :class="SPACING_TOKENS.pt.xs">
                <UAvatar
                  :src="profile.users.profile_image_url || undefined"
                  :alt="profile.users.username"
                  size="profileLg"
                  icon="i-heroicons-user"
                />
              </div>

              <div :class="appConfig.layout.memberCardContent">
                <div :class="appConfig.layout.flexBetween">
                  <div :class="appConfig.calendar.participantCardInfo">
                    <h3 :class="appConfig.typography.cardTitle" :title="profile.users.username">
                      {{ profile.users.username }}
                    </h3>
                    <p
                      v-if="isCurrentUser(profile.users.email)"
                      :class="appConfig.typography.modalHighlight"
                    >
                      {{ ' ' + UI_TEXT.common.you + ' ' }}
                    </p>
                  </div>

                  <BaseButton
                    v-if="isCurrentUserLeader && profile.roles.type.toLowerCase() === 'member'"
                    icon="i-heroicons-arrow-up-circle"
                    variant="ghostBrandIconButton"
                    :class="COLOR_TOKENS.text.primaryMuted"
                    :tooltip="UI_TEXT.tooltips.promoteUser"
                    @click.stop="
                      groupsStore.openPromoteUserModal(profile.users.email, profile.users.username)
                    "
                  />
                </div>

                <div :class="[appConfig.layout.cardFooter, SPACING_TOKENS.mt.md]">
                  <p :class="[TEXT_SIZES.sm, FONT_WEIGHTS.medium, COLOR_TOKENS.text.primarySoft]">
                    {{ ' ' + UI_TEXT.groups.roleLabel + ' '
                    }}<span :class="[FONT_WEIGHTS.bold, 'capitalize']">{{
                      profile.roles.type
                    }}</span>
                  </p>

                  <BaseButton
                    v-if="isCurrentUserLeader && !isCurrentUser(profile.users.email)"
                    icon="i-heroicons-user-minus"
                    variant="ghostDangerIconButton"
                    :tooltip="UI_TEXT.tooltips.removeUser"
                    @click.stop="groupsStore.openRemoveUserModal(profile.users.email)"
                  />
                </div>
              </div>
            </div>
          </BaseCard>
        </div>
      </ClientOnly>
    </div>

    <!-- UPCOMING EVENTS SECTION -->
    <div :class="appConfig.layout.sectionWrapper">
      <h2 :class="[appConfig.typography.pageSubtitle, SPACING_TOKENS.mb.sm]">
        {{ UI_TEXT.events.upcomingHeading }}
      </h2>

      <ClientOnly>
        <div v-if="isLoadingEvents" :class="appConfig.typography.statusLoading">
          {{ UI_TEXT.events.loadingEvents }}
        </div>
        <div
          v-else-if="todayUpcomingEvents.length === 0"
          :class="appConfig.typography.statusLoading"
        >
          {{ UI_TEXT.events.noUpcomingEvents }}
        </div>

        <div v-else :class="appConfig.layout.cardGrid">
          <BaseCard
            v-for="event in todayUpcomingEvents"
            :key="event.uuid"
            variant="interactiveGlass"
            :class="INTERACTION_TOKENS.base"
            @click="navigateToEvent(event.uuid)"
          >
            <div :class="appConfig.calendar.filterFormGroup">
              <div :class="[appConfig.calendar.previewTitleRow, BORDER_TOKENS.dividerBottom, SPACING_TOKENS.py.xs]">
                <div :class="[appConfig.calendar.eventItemWrapper, appConfig.calendar.participantCardInfo]">
                  <UTooltip
                    :text="
                      event.is_private ? UI_TEXT.events.privateEvent : UI_TEXT.events.groupEvent
                    "
                  >
                    <UIcon
                      :name="event.is_private ? 'i-heroicons-user' : 'i-heroicons-user-group'"
                      :class="[SIZE_TOKENS.icon.sm, COLOR_TOKENS.text.brandAccent]"
                    />
                  </UTooltip>
                  <h3 :class="appConfig.typography.cardTitle">
                    {{ event.title }}
                  </h3>
                </div>
                <div :class="[appConfig.calendar.headerTitleRow, appConfig.calendar.participantCardRole]">
                  <UIcon name="i-heroicons-clock" :class="SIZE_TOKENS.icon.sm" />
                  <span>{{ event.timeStartFormatted }}</span>
                </div>
              </div>

              <div :class="appConfig.layout.documentCardMeta">
                <div :class="appConfig.layout.flexBetween">
                  <span :class="[FONT_WEIGHTS.medium, OPACITY_TOKENS.subtle]"
                    >{{ UI_TEXT.events.creatorLabel + ' '
                    }}<span :class="[FONT_WEIGHTS.bold, COLOR_TOKENS.text.primary]">{{
                      event.creator?.username
                    }}</span></span
                  >
                  <span :class="FONT_WEIGHTS.semibold"
                    >{{ event.timeStartFormatted }} - {{ event.timeEndFormatted }}</span
                  >
                </div>
                <p :class="[OPACITY_TOKENS.soft, 'truncate']" :title="event.description || undefined">
                  {{ event.description || UI_TEXT.groups.noDescription }}
                </p>
              </div>

              <div :class="appConfig.layout.cardFooter">
                <span :class="[TEXT_SIZES.xs, FONT_WEIGHTS.bold, COLOR_TOKENS.text.primaryFaint, 'uppercase', TEXT_TRACKING.wider]">{{
                  UI_TEXT.groups.participants
                }}</span>

                <div :class="appConfig.calendar.participantsGroup">
                  <template v-if="event.is_private">
                    <div
                      :class="[
                        appConfig.calendar.participantsAvatars,
                        appConfig.calendar.participantsGap,
                      ]"
                    >
                      <UTooltip
                        v-for="p in event.members?.slice(0, 5)"
                        :key="p.uuid"
                        :text="p.username"
                      >
                        <UAvatar
                          :alt="p.username"
                          :src="p.profile_image_url || undefined"
                          icon="i-heroicons-user"
                          size="sm"
                          :class="appConfig.calendar.participantAvatar"
                        />
                      </UTooltip>
                      <UTooltip
                        v-if="(event.members?.length || 0) > 5"
                        :text="
                          '+' +
                          ((event.members?.length || 0) - 5).toString() +
                          UI_TEXT.events.moreParticipants
                        "
                      >
                        <div
                          :class="appConfig.calendar.participantMoreBadge"
                          @click.stop="eventsStore.openParticipantsModal(event)"
                        >
                          +{{ (event.members?.length || 0) - 5 }}
                        </div>
                      </UTooltip>
                    </div>
                  </template>
                  <template v-else>
                    <div :class="appConfig.calendar.eventItemWrapper">
                      <span :class="[TEXT_SIZES.xs, FONT_WEIGHTS.bold, COLOR_TOKENS.text.primary]">{{
                        UI_TEXT.common.everyone
                      }}</span>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </BaseCard>
        </div>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppConfig } from '#imports';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGroupsStore } from '~/stores/groups.modals.store';
import { useEventsStore } from '~/stores/events.modals.store';
import { useEventsQuery } from '~/queries/events.query';
import { processAndSortEvents } from '~/utils/sort.utils';
import type { GroupInfosOutDto, GroupProfileDto } from '~/types/groups.type';
import type { UiEvent } from '~/types/events.type';
import type { ApiError } from '~/types/apiError.type';

const appConfig = useAppConfig();
const groupsStore = useGroupsStore();
const route = useRoute();
const router = useRouter();
const eventsStore = useEventsStore();

const props = defineProps<{
  groupInfos: GroupInfosOutDto | undefined | null;
  filteredMembers: GroupProfileDto[];
  isLoading: boolean;
  error: ApiError | Error | null | undefined;
  searchQuery: string;
  isCurrentUserLeader: boolean;
  currentUserEmail: string | undefined;
}>();

const emit = defineEmits<{
  (e: 'update:searchQuery', val: string): void;
  (e: 'deleteGroup' | 'leaveGroup'): void;
  (e: 'openProfile', profile: GroupProfileDto): void;
}>();

const navigateToEvent = (eventUuid: string) => {
  router.push({ path: '/events', query: { eventId: eventUuid } });
};

const groupUuid = computed(() => route.params.uuid as string);
const selectedDateId = ref<string | undefined>('ALL');
const { data: eventsData, isLoading: isLoadingEvents } = useEventsQuery(groupUuid, selectedDateId);

const todayUpcomingEvents = computed(() => {
  const processedEvents = processAndSortEvents(eventsData.value || []);
  const now = new Date();

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const endOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999,
  ).getTime();

  return processedEvents
    .filter((e: UiEvent) => {
      if (e.isExpired) return false;

      const eventStart = new Date(e.start_time).getTime();
      const eventEnd = new Date(e.end_time).getTime();

      return eventStart <= endOfToday && eventEnd >= startOfToday;
    })
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    .slice(0, 3);
});

// Contextual nav
const membersRoute = computed(() =>
  groupUuid.value ? `/groups/${groupUuid.value}/members` : '/groups',
);
const eventsRoute = computed(() =>
  groupUuid.value ? `/events?groupId=${groupUuid.value}` : '/events',
);
const mediaRoute = computed(() =>
  groupUuid.value ? `/files/media?groupId=${groupUuid.value}` : '/files/media',
);
const documentsRoute = computed(() =>
  groupUuid.value ? `/files/documents?groupId=${groupUuid.value}` : '/files/documents',
);

const isCurrentUser = (email: string) => {
  return props.currentUserEmail === email;
};
</script>
