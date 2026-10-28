<!-- frontend/app/components/events/views/EventsDesktop.vue -->
<template>
  <div :class="appConfig.calendar.eventsWrapper">
    <div :class="appConfig.calendar.eventsHeaderRow">
      <div :class="appConfig.calendar.headerActionLeft">
        <BaseButton
          v-if="isCurrentUserLeader"
          icon="i-heroicons-trash"
          variant="glassIconButtonDanger"
          :tooltip="UI_TEXT.groups.deleteGroup"
          @click="$emit('delete-group')"
        />
        <BaseButton
          icon="i-heroicons-arrow-right-on-rectangle"
          variant="glassIconButtonDanger"
          :tooltip="UI_TEXT.groups.leaveGroup"
          @click="$emit('leave-group')"
        />
      </div>

      <div :class="appConfig.calendar.headerCenter">
        <UPopover v-model:open="isGroupDropdownOpen">
          <BaseButton variant="ghost" :class="appConfig.calendar.mobileHeaderButton">
            <div :class="appConfig.calendar.mobileHeaderTitleRow">
              <h1 :class="appConfig.typography.pageTitle">
                {{
                  isLoadingGroups
                    ? UI_TEXT.common.loading
                    : selectedGroupDetails?.name || UI_TEXT.events.selectGroup
                }}
              </h1>
              <UIcon
                name="i-heroicons-chevron-down"
                :class="[
                  SELECT_CONFIG.slots.trailingIcon,
                  'static pointer-events-auto',
                  isGroupDropdownOpen ? 'rotate-180' : '',
                ]"
              />
            </div>
          </BaseButton>
          <template #content>
            <div :class="WIDE_DROPDOWN_MENU_CONFIG.slots.content">
              <BaseButton
                v-for="group in userGroupsList"
                :key="group.uuid"
                :class="WIDE_DROPDOWN_MENU_CONFIG.slots.item"
                variant="ghost"
                @click="$emit('select-group', group.uuid)"
              >
                <template #leading>
                  <UIcon
                    :name="
                      group.uuid === selectedGroupUuid
                        ? 'i-heroicons-check'
                        : 'i-heroicons-user-group'
                    "
                    :class="WIDE_DROPDOWN_MENU_CONFIG.slots.itemLeadingIcon"
                  />
                </template>
                {{ group.name }}
              </BaseButton>
            </div>
          </template>
        </UPopover>
        <p :class="appConfig.typography.pageSubtitle">{{ UI_TEXT.common.calendar }}</p>
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
          variant="glassIconButtonBrand"
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

    <div :class="appConfig.calendar.eventsHeaderRow">
      <div :class="appConfig.calendar.headerActionLeft">
        <div :class="appConfig.calendar.headerSearchWrapper">
          <BaseSearchInput
            v-model="searchQuery"
            :placeholder="UI_TEXT.events.searchPlaceholder"
          />
        </div>

        <UPopover v-model:open="isFilterOpen">
          <BaseButton
            icon="i-heroicons-funnel"
            :label="UI_TEXT.common.filter"
            variant="glassButton"
            :tooltip="UI_TEXT.tooltips.filterEvents"
          />
          <template #content>
            <div :class="appConfig.calendar.filterDropdownContent">
              <div :class="appConfig.calendar.filterFormGroup">
                <BaseInput
                  v-model="filterStartDate"
                  :label="UI_TEXT.events.startDateLabel"
                  name="startDate"
                  type="date"
                />
                <BaseInput
                  v-model="filterEndDate"
                  :label="UI_TEXT.events.endDateLabel"
                  name="endDate"
                  type="date"
                />
                <div :class="appConfig.calendar.filterButtonWrapper">
                  <BaseButton
                    :label="UI_TEXT.common.clearFilter"
                    variant="smallHollowActionButton"
                    :class="
                      filterStartDate || filterEndDate
                        ? appConfig.calendar.clearFilterActive
                        : appConfig.calendar.clearFilterDisabled
                    "
                    :disabled="!filterStartDate && !filterEndDate"
                    @click="clearFilters"
                  />
                </div>
              </div>
            </div>
          </template>
        </UPopover>

        <BaseButton
          icon="i-heroicons-clock"
          :label="showOnlyActiveEvents ? UI_TEXT.events.active : UI_TEXT.common.all"
          :variant="showOnlyActiveEvents ? 'glassOutlineButton' : 'glassButton'"
          :class="
            showOnlyActiveEvents
              ? appConfig.calendar.activeToggleFilterBtn
              : appConfig.calendar.inactiveToggleFilterBtn
          "
          :tooltip="showOnlyActiveEvents ? UI_TEXT.events.showAll : UI_TEXT.events.hideExpired"
          @click="showOnlyActiveEvents = !showOnlyActiveEvents"
        />
      </div>
      <div :class="appConfig.calendar.headerActionRight">
        <BaseButton
          icon="i-heroicons-plus"
          :label="UI_TEXT.tooltips.addEvent"
          variant="smallPrimaryActionButton"
          @click="$emit('open-add-event')"
        />
      </div>
    </div>

    <div :class="appConfig.calendar.eventsGrid">
      <div :class="[appConfig.calendar.columnBase, appConfig.calendar.columnDays]">
        <div :class="appConfig.calendar.columnHeader">
          {{ UI_TEXT.events.daysHeading }}
        </div>
        <div :class="appConfig.calendar.columnBody">
          <div v-if="isLoadingDays" :class="appConfig.calendar.mobileEmptyState">
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
              <span :class="[FONT_WEIGHTS.medium, COLOR_TOKENS.text.primary]"
                >{{ day.date }} ({{ day.dayOfWeek }})</span
              >
            </div>
            <div v-if="!sortedDaysList.length" :class="appConfig.calendar.mobileEmptyState">
              {{ ' ' + UI_TEXT.events.noDays + ' ' }}
            </div>
          </template>
        </div>
      </div>

      <div :class="[appConfig.calendar.columnBase, appConfig.calendar.columnEvents]">
        <div :class="appConfig.calendar.columnHeader">
          <span>{{ UI_TEXT.common.events }}</span>
          <span v-if="selectedDayDetails">{{ selectedDayDetails.date }}</span>
        </div>
        <div :class="appConfig.calendar.columnBody">
          <div v-if="isLoadingEvents" :class="appConfig.calendar.mobileEmptyState">
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
              ]"
              @click="$emit('update:selected-event', event)"
            >
              <div :class="[appConfig.calendar.eventItemWrapper, appConfig.calendar.participantCardInfo]">
                <UTooltip
                  :text="
                    event.is_private ? UI_TEXT.events.privateEvent : UI_TEXT.events.publicEvent
                  "
                >
                  <UIcon
                    :name="event.is_private ? 'i-heroicons-user' : 'i-heroicons-user-group'"
                    :class="appConfig.calendar.eventItemIcon"
                  />
                </UTooltip>
                <span
                  :class="[
                    appConfig.calendar.eventItemTitle,
                    event.isExpired ? appConfig.calendar.expiredItemText : '',
                    'truncate',
                  ]"
                  >{{ event.title }}</span
                >
              </div>
              <div :class="appConfig.calendar.eventItemWrapper">
                <span :class="appConfig.calendar.eventItemTime"
                  >{{ event.timeStartFormatted }} - {{ event.timeEndFormatted }}</span
                >
              </div>
            </div>
            <div
              v-if="!filteredAndSortedEventsList?.length"
              :class="[appConfig.calendar.emptyPreview, SPACING_TOKENS.py.xl]"
            >
              <span>{{
                searchQuery ? UI_TEXT.events.noMatchingEvents : UI_TEXT.events.noEvents
              }}</span>
            </div>
          </template>
        </div>
      </div>

      <div :class="[appConfig.calendar.columnBase, appConfig.calendar.columnPreview]">
        <div :class="appConfig.calendar.columnHeader">
          {{ UI_TEXT.events.previewHeading }}
        </div>
        <div
          v-if="selectedEvent"
          :class="[
            appConfig.calendar.previewWrapper,
            selectedEvent.isExpired ? OPACITY_TOKENS.subtle : '',
          ]"
        >
          <div :class="appConfig.calendar.previewTitleRow">
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

            <div :class="appConfig.calendar.headerTitleRow">
              <BaseButton
                v-if="selectedEvent.creator?.email === currentUserEmail && selectedEvent.is_private"
                icon="i-heroicons-user-plus"
                variant="ghostBrandIconButton"
                :class="COLOR_TOKENS.text.primarySoft"
                :tooltip="UI_TEXT.events.addMembers"
                @click="$emit('open-add-members', selectedEvent)"
              />
              <BaseButton
                v-if="canManageEvent(selectedEvent)"
                icon="i-heroicons-trash"
                variant="ghostDangerIconButton"
                :tooltip="UI_TEXT.events.deleteEvent"
                @click="$emit('open-delete-event', selectedEvent)"
              />
              <BaseButton
                v-if="canLeaveEvent(selectedEvent)"
                icon="i-heroicons-arrow-right-on-rectangle"
                variant="ghostDangerIconButton"
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
                    >{{ UI_TEXT.events.showParticipants }}
                  </BaseButton>
                </template>
                <template v-else>
                  <div :class="appConfig.calendar.eventItemWrapper">
                    <span :class="[TEXT_SIZES.sm, FONT_WEIGHTS.bold, COLOR_TOKENS.text.primary]">{{
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
              :class="[appConfig.calendar.filterFormGroup, SPACING_TOKENS.mt.md]"
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
                :class="appConfig.calendar.previewMapPlaceholder"
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
