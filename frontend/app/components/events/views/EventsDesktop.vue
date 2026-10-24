<!-- frontend/app/components/events/views/EventsDesktop.vue -->
<template>
  <div :class="appConfig.calendar.eventsWrapper">
    <div :class="appConfig.calendar.eventsHeaderRow">
      <div :class="appConfig.calendar.headerActionLeft">
        ><BaseButton
          v-if="isCurrentUserLeader"
          icon="i-heroicons-trash"
          variant="glassIconButtonDanger"
          :tooltip="UI_TEXT.groups.deleteGroup"
          @click="$emit('delete-group')"
        />
        ><BaseButton
          icon="i-heroicons-arrow-right-on-rectangle"
          variant="glassIconButtonDanger"
          :tooltip="UI_TEXT.groups.leaveGroup"
          @click="$emit('leave-group')"
        />
      </div>

      <div :class="appConfig.calendar.headerCenter">
        <UPopover v-model:open="isGroupDropdownOpen">
          <BaseButton
            variant="ghost"
            :class="`group flex items-center ${SPACING_TOKENS.gap.sm} p-0 hover:bg-transparent cursor-pointer outline-none`"
          >
            <h1 :class="appConfig.typography.pageTitle">
              {{
                isLoadingGroups
                  ? UI_TEXT.common.loading
                  : selectedGroupDetails?.name || UI_TEXT.events.selectGroup
              }}
            </h1>
            <UIcon
              name="i-heroicons-chevron-down"
              class="w-5 h-5 text-surface-500 transition-transform duration-200"
              :class="{ 'rotate-180': isGroupDropdownOpen }"
            />
          </BaseButton>
          <template #content>
            <div
              :class="[
                appConfig.ui.wideDropdownMenu.slots.content,
                'max-h-[50vh] overflow-y-auto custom-scrollbar',
              ]"
            >
              <button
                v-for="group in userGroupsList"
                :key="group.uuid"
                :class="appConfig.ui.wideDropdownMenu.slots.item"
                @click="$emit('select-group', group.uuid)"
              >
                <UIcon
                  :name="
                    group.uuid === selectedGroupUuid
                      ? 'i-heroicons-check'
                      : 'i-heroicons-user-group'
                  "
                  :class="appConfig.ui.wideDropdownMenu.slots.itemLeadingIcon"
                />
                <span>{{ group.name }}</span>
              </button>
            </div>
          </template>
        </UPopover>
        <p :class="appConfig.typography.pageSubtitle" class="mt-0">{{ UI_TEXT.common.calendar }}</p>
      </div>

      <div :class="appConfig.calendar.headerActionRight">
        <BaseButton
          icon="i-heroicons-users"
          variant="glassIconButton"
          :to="membersRoute"
          :tooltip="UI_TEXT.tooltips.members"
        />
        <BaseButton
          icon="i-heroicons-calendar"
          variant="glassIconButton"
          class="text-brand-500"
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

    <div
      :class="`flex flex-col sm:flex-row items-center justify-between ${SPACING_TOKENS.gap.md} w-full shrink-0`"
    >
      <div :class="`flex items-center ${SPACING_TOKENS.gap.md} w-full sm:w-auto flex-1`">
        <BaseSearchInput
          v-model="searchQuery"
          :placeholder="UI_TEXT.events.searchPlaceholder"
          class="w-full max-w-xs"
        />

        <UPopover v-model:open="isFilterOpen">
          ><BaseButton
            icon="i-heroicons-funnel"
            :label="UI_TEXT.common.filter"
            variant="glassButton"
            :tooltip="UI_TEXT.tooltips.filterEvents"
          />
          <template #content>
            <div :class="appConfig.calendar.filterDropdownContent">
              <div :class="appConfig.calendar.filterFormGroup">
                <div>
                  <label :class="appConfig.calendar.filterLabel">{{
                    UI_TEXT.events.startDateLabel
                  }}</label
                  ><input
                    v-model="filterStartDate"
                    type="date"
                    :class="appConfig.calendar.filterDateInput"
                  />
                </div>
                <div>
                  <label :class="appConfig.calendar.filterLabel">{{
                    UI_TEXT.events.endDateLabel
                  }}</label
                  ><input
                    v-model="filterEndDate"
                    type="date"
                    :class="appConfig.calendar.filterDateInput"
                  />
                </div>
                <div :class="appConfig.calendar.filterButtonWrapper">
                  <div :class="appConfig.calendar.filterButtonWrapper">
                    <BaseButton
                      :label="UI_TEXT.common.clearFilter"
                      variant="smallHollowActionButton"
                      :class="[
                        filterStartDate || filterEndDate
                          ? 'text-error-500 ring-error-500/40 hover:bg-error-500/20 cursor-pointer'
                          : 'text-dark-text/40 ring-dark-text/20 bg-transparent hover:bg-transparent opacity-60 cursor-not-allowed',
                      ]"
                      :disabled="!filterStartDate && !filterEndDate"
                      @click="clearFilters"
                    />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </UPopover>

        <BaseButton
          icon="i-heroicons-clock"
          :label="showOnlyActiveEvents ? UI_TEXT.events.active : UI_TEXT.common.all"
          :variant="showOnlyActiveEvents ? 'glassOutlineButton' : 'glassButton'"
          :class="[
            showOnlyActiveEvents ? 'ring-2 ring-success-500 text-success-600' : '',
            `shrink-0 whitespace-nowrap ${SPACING_TOKENS.px.md} ${SPACING_TOKENS.py.sm} min-w-22!`,
          ]"
          :tooltip="showOnlyActiveEvents ? UI_TEXT.events.showAll : UI_TEXT.events.hideExpired"
          @click="showOnlyActiveEvents = !showOnlyActiveEvents"
        />
      </div>
      <div class="shrink-0 w-full sm:w-auto flex justify-end">
        <BaseButton
          icon="i-heroicons-calendar-days"
          :label="UI_TEXT.tooltips.addEvent"
          variant="actionOkButton"
          :class="`h-10 text-md ${SPACING_TOKENS.px.lg}`"
          @click="$emit('open-add-event')"
        >
          <template #leading><UIcon name="i-heroicons-plus" class="w-5 h-5 mr-1" /></template>
        </BaseButton>
      </div>
    </div>

    <div :class="appConfig.calendar.eventsGrid">
      <div :class="[appConfig.calendar.columnBase, appConfig.calendar.columnDays]">
        <div :class="[appConfig.calendar.columnHeader, 'rounded-tl-xl']">
          {{ UI_TEXT.events.daysHeading }}
        </div>
        <div :class="appConfig.calendar.columnBody">
          <div
            v-if="isLoadingDays"
            :class="`${SPACING_TOKENS.p.md} text-center text-sm opacity-60`"
          >
            {{ UI_TEXT.events.loadingDays }}
          </div>
          <template v-else>
            <div
              v-for="day in sortedDaysList"
              :key="day.id"
              :class="[
                appConfig.calendar.listItem,
                selectedDayId === day.id
                  ? appConfig.calendar.listItemSelected
                  : appConfig.calendar.listItemHover,
                day.isExpired ? appConfig.calendar.expiredItemWrapper : '',
              ]"
              @click="$emit('update:selected-day-id', day.id)"
            >
              <span class="font-medium text-dark-text">{{ day.date }} ({{ day.dayOfWeek }})</span>
            </div>
            <div
              v-if="!sortedDaysList.length"
              :class="`${SPACING_TOKENS.p.md} text-center text-sm opacity-60`"
            >
              {{ ' ' + UI_TEXT.events.noDays + ' ' }}
            </div>
          </template>
        </div>
      </div>

      <div :class="[appConfig.calendar.columnBase, appConfig.calendar.columnEvents]">
        <div :class="appConfig.calendar.columnHeader">
          <span class="uppercase">{{ UI_TEXT.common.events }}</span>
          <span v-if="selectedDayDetails">{{ selectedDayDetails.date }}</span>
        </div>
        <div :class="appConfig.calendar.columnBody">
          <div
            v-if="isLoadingEvents"
            :class="`${SPACING_TOKENS.p.md} text-center text-sm opacity-60`"
          >
            {{ UI_TEXT.events.loadingEvents }}
          </div>
          <template v-else>
            <div
              v-for="event in filteredAndSortedEventsList"
              :key="event.uuid"
              :class="[
                appConfig.calendar.listItem,
                appConfig.calendar.listItemHover,
                selectedEvent?.uuid === event.uuid ? appConfig.calendar.eventListItemSelected : '',
                event.isExpired ? appConfig.calendar.expiredItemWrapper : '',
                'group relative flex items-center justify-between',
              ]"
              @click="$emit('update:selected-event', event)"
            >
              <div :class="appConfig.calendar.eventItemWrapper" class="flex-1 min-w-0 pr-2 gap-3!">
                <UTooltip
                  :text="
                    event.is_private ? UI_TEXT.events.privateEvent : UI_TEXT.events.publicEvent
                  "
                >
                  <UIcon
                    :name="event.is_private ? 'i-heroicons-user' : 'i-heroicons-user-group'"
                    class="w-5 h-5 text-dark-text/70 shrink-0"
                  />
                </UTooltip>
                <span
                  :class="[
                    appConfig.calendar.eventItemTitle,
                    event.isExpired ? appConfig.calendar.expiredItemText : '',
                  ]"
                  class="truncate"
                  >{{ event.title }}</span
                >
              </div>
              <div :class="`flex items-center ${SPACING_TOKENS.gap.sm} shrink-0`">
                <span :class="appConfig.calendar.eventItemTime"
                  >{{ event.timeStartFormatted }} - {{ event.timeEndFormatted }}</span
                >
              </div>
            </div>
            <div
              v-if="!filteredAndSortedEventsList?.length"
              :class="`${SPACING_TOKENS.p.xl} text-center text-sm text-dark-text/60 font-medium flex flex-col items-center justify-center h-48 ${SPACING_TOKENS.gap.sm}`"
            >
              <UIcon name="i-heroicons-calendar" class="w-8 h-8 opacity-40" />
              <span>{{
                searchQuery ? UI_TEXT.events.noMatchingEvents : UI_TEXT.events.noEvents
              }}</span>
            </div>
          </template>
        </div>
      </div>

      <div :class="[appConfig.calendar.columnBase, appConfig.calendar.columnPreview]">
        <div :class="[appConfig.calendar.columnHeader, 'rounded-tr-xl']">
          {{ UI_TEXT.events.previewHeading }}
        </div>
        <div
          v-if="selectedEvent"
          :class="[appConfig.calendar.previewWrapper, selectedEvent.isExpired ? 'opacity-70' : '']"
        >
          <div :class="appConfig.calendar.previewTitleRow" class="justify-between">
            <div :class="appConfig.calendar.previewTypeWrapper">
              <UIcon
                :name="selectedEvent.is_private ? 'i-heroicons-user' : 'i-heroicons-user-group'"
                :class="appConfig.calendar.previewTypeIcon"
              />
              <span :class="appConfig.calendar.previewTypeText">{{
                selectedEvent.is_private
                  ? UI_TEXT.events.privateLabel
                  : UI_TEXT.events.groupEventLabel
              }}</span>
            </div>

            <div :class="`flex items-center ${SPACING_TOKENS.gap.xs}`">
              <BaseButton
                v-if="selectedEvent.creator?.email === currentUserEmail && selectedEvent.is_private"
                icon="i-heroicons-user-plus"
                variant="ghostBrandIconButton"
                class="text-dark-text/80 hover:text-brand-500 p-1"
                :tooltip="UI_TEXT.events.addMembers"
                @click="$emit('open-add-members', selectedEvent)"
              />
              <BaseButton
                v-if="canManageEvent(selectedEvent)"
                icon="i-heroicons-trash"
                variant="ghostDangerIconButton"
                class="text-error-500 hover:text-error-600"
                :tooltip="UI_TEXT.events.deleteEvent"
                @click="$emit('open-delete-event', selectedEvent)"
              />
              <BaseButton
                v-if="canLeaveEvent(selectedEvent)"
                icon="i-heroicons-arrow-right-on-rectangle"
                variant="ghostDangerIconButton"
                class="text-error-500 hover:text-error-600"
                :tooltip="UI_TEXT.events.leaveEvent"
                @click="$emit('open-leave-event', selectedEvent)"
              />
            </div>
          </div>
          <h2 :class="appConfig.calendar.previewMainTitle">
            {{ selectedEvent.title }}
            <span v-if="selectedEvent.isExpired" :class="appConfig.calendar.previewExpiredBadge">{{
              UI_TEXT.events.expired
            }}</span>
          </h2>

          <div :class="appConfig.calendar.previewMetaRow">
            <div :class="appConfig.calendar.metaRowItem">
              <span :class="appConfig.calendar.metaLabel">{{ UI_TEXT.events.creatorLabel }}</span>
              <span :class="appConfig.calendar.metaValue">{{
                selectedEvent.creator?.username
              }}</span>
            </div>
            <div :class="appConfig.calendar.metaRowItem">
              <span :class="appConfig.calendar.metaLabel">{{ UI_TEXT.events.dateLabel }}</span>
              <span
                v-if="
                  new Date(selectedEvent.start_time).toLocaleDateString() ===
                  new Date(selectedEvent.end_time).toLocaleDateString()
                "
                :class="appConfig.calendar.metaValue"
              >
                {{ new Date(selectedEvent.start_time).toLocaleDateString() }}
              </span>
              <span v-else :class="appConfig.calendar.metaValue">
                {{ new Date(selectedEvent.start_time).toLocaleDateString() }} -
                {{ new Date(selectedEvent.end_time).toLocaleDateString() }}
              </span>
            </div>
            <div :class="appConfig.calendar.metaRowItem">
              <span :class="appConfig.calendar.metaLabel">{{ UI_TEXT.events.timeLabel }}</span>
              <span
                v-if="selectedEvent.timeStartFormatted === selectedEvent.timeEndFormatted"
                :class="appConfig.calendar.metaValue"
              >
                {{ selectedEvent.timeStartFormatted }}
              </span>
              <span v-else :class="appConfig.calendar.metaValue">
                {{ selectedEvent.timeStartFormatted }} - {{ selectedEvent.timeEndFormatted }}
              </span>
            </div>

            <div :class="appConfig.calendar.metaRowItemCenter">
              <span :class="appConfig.calendar.metaLabel">{{ UI_TEXT.events.membersLabel }}</span>
              <div :class="appConfig.calendar.participantsGroup">
                <template v-if="selectedEvent.is_private">
                  <div
                    :class="[
                      appConfig.calendar.participantsAvatars,
                      (selectedEvent.members?.length || 0) > 5
                        ? appConfig.calendar.participantsOverlap
                        : appConfig.calendar.participantsGap,
                    ]"
                  >
                    <UTooltip
                      v-for="p in selectedEvent.members?.slice(0, 5)"
                      :key="p.uuid"
                      :text="p.username"
                    >
                      <UAvatar
                        :alt="p.username"
                        :src="p.profile_image_url || undefined"
                        icon="i-heroicons-user"
                        :class="appConfig.calendar.participantAvatar"
                        @click="$emit('open-user-profile', p)"
                      />
                    </UTooltip>
                    <UTooltip
                      v-if="(selectedEvent.members?.length || 0) > 5"
                      :text="
                        '+' +
                        ((selectedEvent.members?.length || 0) - 5).toString() +
                        UI_TEXT.events.moreParticipants
                      "
                    >
                      <div
                        :class="appConfig.calendar.participantMoreBadge"
                        @click="$emit('open-all-participants')"
                      >
                        +{{ (selectedEvent.members?.length || 0) - 5 }}
                      </div>
                    </UTooltip>
                  </div>
                  <BaseButton
                    variant="link"
                    :class="appConfig.calendar.metaValueLink"
                    @click="$emit('open-all-participants')"
                    >{{ UI_TEXT.events.showParticipants }}</BaseButton
                  >
                </template>
                <template v-else>
                  <div :class="`flex items-center ${SPACING_TOKENS.gap.sm}`">
                    <span class="text-sm font-bold text-dark-text">{{
                      UI_TEXT.common.everyone
                    }}</span>
                  </div>
                </template>
              </div>
            </div>
            <div :class="[appConfig.calendar.metaRowItem, SPACING_TOKENS.mt.sm]">
              <span :class="appConfig.calendar.metaLabel">{{
                UI_TEXT.events.descriptionLabel
              }}</span>
              <span :class="appConfig.calendar.metaValue">{{ selectedEvent.description }}</span>
            </div>
            <div
              v-if="selectedEvent.address || selectedEvent.latitude !== null"
              :class="[
                appConfig.calendar.metaRowItem,
                SPACING_TOKENS.mt.md,
                'flex-col',
                'items-start',
                SPACING_TOKENS.gap.sm,
              ]"
            >
              <span :class="appConfig.calendar.metaLabel">{{ UI_TEXT.events.locationLabel }}</span>
              <span v-if="selectedEvent.address" :class="appConfig.calendar.metaValue">
                {{ selectedEvent.address }}
              </span>
              <div
                v-if="
                  selectedEvent.latitude !== null &&
                  selectedEvent.latitude !== undefined &&
                  selectedEvent.longitude !== null &&
                  selectedEvent.longitude !== undefined
                "
                :class="`w-full h-48 rounded-lg overflow-hidden border border-gray-200 ${SPACING_TOKENS.mt.xs} relative z-0`"
              >
                <ClientOnly>
                  <EventMapPreview
                    :latitude="selectedEvent.latitude"
                    :longitude="selectedEvent.longitude"
                  />
                </ClientOnly>
              </div>
            </div>
          </div>
        </div>
        <div v-else :class="appConfig.calendar.emptyPreview">{{ UI_TEXT.events.selectEvent }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAppConfig } from '#imports';
import type { GroupOutDto } from '~/types/groups.type';
import type { EventCreatorDto, UiDay, UiEvent } from '~/types/events.type';

const props = defineProps<{
  userGroupsList: GroupOutDto[];
  selectedGroupUuid?: string;
  selectedGroupDetails?: GroupOutDto;
  selectedDayId?: string;
  selectedEvent: UiEvent | null | undefined;
  isLoadingGroups: boolean;
  isLoadingDays: boolean;
  isLoadingEvents: boolean;
  sortedDaysList: UiDay[];
  filteredAndSortedEventsList: UiEvent[];
  selectedDayDetails?: UiDay;
  isCurrentUserLeader: boolean;
  currentUserEmail?: string;
}>();

const appConfig = useAppConfig();

defineEmits<{
  (e: 'select-group', uuid: string): void;
  (e: 'update:selected-day-id', id: string | undefined): void;
  (e: 'update:selected-event', event: UiEvent | null): void;
  (
    e: 'delete-group' | 'leave-group' | 'apply-filter' | 'open-add-event' | 'open-all-participants',
  ): void;
  (e: 'open-delete-event' | 'open-leave-event' | 'open-add-members', event: UiEvent): void;
  (e: 'open-user-profile', user: EventCreatorDto): void;
}>();

// Group leaders and the event creator have permission to delete the event
const canManageEvent = (event: UiEvent | null | undefined) => {
  if (!event) return false;
  return props.isCurrentUserLeader || event.creator?.email === props.currentUserEmail;
};

// Non-creator participants can leave an event they are currently assigned to
const canLeaveEvent = (event: UiEvent | null | undefined) => {
  if (!event) return false;
  if (event.creator?.email === props.currentUserEmail) return false;
  return event.members?.some((m) => m.email === props.currentUserEmail) ?? false;
};

const searchQuery = defineModel<string>('searchQuery', { default: '' });
const filterStartDate = defineModel<string>('filterStartDate', { default: '' });
const filterEndDate = defineModel<string>('filterEndDate', { default: '' });
const isGroupDropdownOpen = defineModel<boolean>('isGroupDropdownOpen', { default: false });
const isFilterOpen = defineModel<boolean>('isFilterOpen', { default: false });
const showOnlyActiveEvents = defineModel<boolean>('showOnlyActiveEvents', { default: true });

const clearFilters = () => {
  filterStartDate.value = '';
  filterEndDate.value = '';
};

// Contextual navigation routes scoped to the currently active group
const membersRoute = computed(() =>
  props.selectedGroupUuid ? `/groups/${props.selectedGroupUuid}/members` : '/groups',
);
const eventsRoute = computed(() =>
  props.selectedGroupUuid ? `/events?groupId=${props.selectedGroupUuid}` : '/events',
);
const mediaRoute = computed(() =>
  props.selectedGroupUuid ? `/files/media?groupId=${props.selectedGroupUuid}` : '/files/media',
);
const documentsRoute = computed(() =>
  props.selectedGroupUuid
    ? `/files/documents?groupId=${props.selectedGroupUuid}`
    : '/files/documents',
);
</script>
