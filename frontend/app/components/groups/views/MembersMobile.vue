<!-- frontend/app/components/groups/views/MembersMobile.vue -->
<template>
  <div :class="LAYOUT_CONFIG.pageWrapper">
    <div :class="LAYOUT_CONFIG.cardContent">
      <!-- NAV ACTIONS -->
      <div :class="LAYOUT_CONFIG.mobileTopActions">
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

      <!-- TITLE & ACTIONS -->
      <div :class="LAYOUT_CONFIG.mobileHeader">
        <div :class="LAYOUT_CONFIG.mobileHeaderTitleRow">
          <h1 :class="TYPOGRAPHY_CONFIG.pageTitle">
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
        <p :class="TYPOGRAPHY_CONFIG.pageSubtitle">{{ UI_TEXT.common.members }}</p>
      </div>

      <!-- SEARCH & INVITE -->
      <div :class="LAYOUT_CONFIG.mobileToolbar">
        <div :class="LAYOUT_CONFIG.listCardInfo">
          <BaseSearchInput
            :model-value="searchQuery"
            :placeholder="UI_TEXT.groups.searchMembers"
            @update:model-value="emit('update:searchQuery', $event)"
          />
        </div>
        <div :class="CALENDAR_CONFIG.eventItemWrapper">
          <BaseButton
            v-if="isCurrentUserLeader"
            icon="i-heroicons-user-plus"
            variant="glassIconButtonHighlight"
            :tooltip="UI_TEXT.tooltips.inviteUser"
            @click="groupsStore.openInviteModal()"
          />
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
      </div>
    </div>

    <!-- MEMBERS LIST SECTION -->
    <div :class="LAYOUT_CONFIG.fullWidth">
      <ClientOnly>
        <div v-if="isLoading" :class="TYPOGRAPHY_CONFIG.statusLoading">
          {{ UI_TEXT.common.loading }}
        </div>
        <div v-else-if="error" :class="TYPOGRAPHY_CONFIG.statusError">
          {{ UI_TEXT.errors.fetch }}
        </div>

        <div v-else-if="filteredMembers?.length" :class="LAYOUT_CONFIG.cardGrid">
          <BaseCard
            v-for="profile in filteredMembers"
            :key="profile.users.email"
            variant="interactiveGlass"
            :class="[LAYOUT_CONFIG.headerRelative, INTERACTION_TOKENS.base]"
            @click="emit('openProfile', profile)"
          >
            <div :class="LAYOUT_CONFIG.memberCardInner">
              <div :class="SPACING_TOKENS.pt.xs">
                <UAvatar
                  :src="profile.users.profile_image_url || undefined"
                  :alt="profile.users.username"
                  size="profileLg"
                  icon="i-heroicons-user"
                />
              </div>

              <div :class="LAYOUT_CONFIG.memberCardContent">
                <div :class="LAYOUT_CONFIG.flexBetween">
                  <div :class="LAYOUT_CONFIG.listCardInfo">
                    <h3 :class="TYPOGRAPHY_CONFIG.cardTitle" :title="profile.users.username">
                      {{ profile.users.username }}
                    </h3>
                    <p
                      v-if="isCurrentUser(profile.users.email)"
                      :class="TYPOGRAPHY_CONFIG.modalHighlight"
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

                <div :class="LAYOUT_CONFIG.cardFooter">
                  <p :class="TYPOGRAPHY_CONFIG.bodySmSoft">
                    {{ ' ' + UI_TEXT.groups.roleLabel + ' '
                    }}<span :class="TYPOGRAPHY_CONFIG.metaHighlightCap">{{
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
    <div :class="LAYOUT_CONFIG.mobileContentWrapper">
      <h2 :class="TYPOGRAPHY_CONFIG.cardTitle">
        {{ UI_TEXT.events.upcomingHeading }}
      </h2>

      <ClientOnly>
        <div v-if="isLoadingEvents" :class="CALENDAR_CONFIG.mobileEmptyState">
          {{ UI_TEXT.events.loadingEvents }}
        </div>
        <div v-else-if="todayUpcomingEvents.length === 0" :class="CALENDAR_CONFIG.mobileEmptyState">
          {{ UI_TEXT.events.noUpcomingEvents }}
        </div>

        <div v-else :class="LAYOUT_CONFIG.modalFormGroup">
          <BaseCard
            v-for="event in todayUpcomingEvents"
            :key="event.uuid"
            variant="interactiveGlass"
            :class="INTERACTION_TOKENS.base"
            @click="navigateToEvent(event.uuid)"
          >
            <div :class="LAYOUT_CONFIG.modalFormGroup">
              <div :class="LAYOUT_CONFIG.flexBetween">
                <div :class="[CALENDAR_CONFIG.eventItemWrapper, LAYOUT_CONFIG.listCardInfo]">
                  <UTooltip
                    :text="
                      event.is_private ? UI_TEXT.events.privateEvent : UI_TEXT.events.groupEvent
                    "
                  >
                    <UIcon
                      :name="event.is_private ? 'i-heroicons-user' : 'i-heroicons-user-group'"
                      :class="TYPOGRAPHY_CONFIG.iconBrandSm"
                    />
                  </UTooltip>
                  <h3 :class="TYPOGRAPHY_CONFIG.cardTitleSm">
                    {{ event.title }}
                  </h3>
                </div>
                <div :class="TYPOGRAPHY_CONFIG.badgeRole">
                  <span>{{ event.timeStartFormatted }}</span>
                </div>
              </div>

              <div :class="LAYOUT_CONFIG.documentCardMeta">
                <div :class="LAYOUT_CONFIG.flexBetween">
                  <span :class="TYPOGRAPHY_CONFIG.metaLabelSoft"
                    >{{ UI_TEXT.events.creatorLabel + ' '
                    }}<span :class="TYPOGRAPHY_CONFIG.metaHighlight">{{
                      event.creator?.username
                    }}</span></span
                  >
                  <span :class="TYPOGRAPHY_CONFIG.metaTime"
                    >{{ event.timeStartFormatted }} - {{ event.timeEndFormatted }}</span
                  >
                </div>
                <p
                  :class="TYPOGRAPHY_CONFIG.bodySmMutedTruncate"
                  :title="event.description || undefined"
                >
                  {{ event.description || UI_TEXT.groups.noDescription }}
                </p>
              </div>

              <div :class="LAYOUT_CONFIG.cardFooter">
                <span :class="TYPOGRAPHY_CONFIG.captionUppercase">{{
                  UI_TEXT.groups.participants
                }}</span>

                <div :class="CALENDAR_CONFIG.participantsGroup">
                  <template v-if="event.is_private">
                    <div
                      :class="[
                        CALENDAR_CONFIG.participantsAvatars,
                        CALENDAR_CONFIG.participantsGap,
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
                          :class="CALENDAR_CONFIG.participantAvatar"
                        />
                      </UTooltip>

                      <BaseButton
                        v-if="(event.members?.length || 0) > 5"
                        variant="ghost"
                        :class="CALENDAR_CONFIG.participantMoreBadge"
                        :tooltip="
                          '+' +
                          ((event.members?.length || 0) - 5).toString() +
                          UI_TEXT.events.moreParticipants
                        "
                        @click.stop="eventsStore.openParticipantsModal(event)"
                      >
                        +{{ (event.members?.length || 0) - 5 }}
                      </BaseButton>
                    </div>
                  </template>
                  <template v-else>
                    <div :class="CALENDAR_CONFIG.eventItemWrapper">
                      <span :class="TYPOGRAPHY_CONFIG.captionBoldPrimary">{{
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
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGroupsStore } from '~/stores/groups.modals.store';
import { useEventsQuery } from '~/queries/events.query';
import { useEventsStore } from '~/stores/events.modals.store';
import { processAndSortEvents } from '~/utils/sort.utils';
import type { GroupInfosOutDto, GroupProfileDto } from '~/types/groups.type';
import type { UiEvent } from '~/types/events.type';
import type { ApiError } from '~/types/apiError.type';

const groupsStore = useGroupsStore();
const route = useRoute();
const router = useRouter();
const eventsStore = useEventsStore();

const navigateToEvent = (eventUuid: string) => {
  router.push({ path: '/events', query: { eventId: eventUuid } });
};

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
