<!-- frontend/app/components/events/views/EventsMobile.vue -->
<template>
  <div :class="appConfig.layout.mobilePageWrapper">
    <div :class="appConfig.calendar.mobileTopActions">
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

    <div :class="appConfig.calendar.mobileMainWrapper">
      <div :class="appConfig.calendar.mobileHeader">
        <UPopover v-model:open="isGroupDropdownOpen" :class="CARD_CONFIG.slots.root" :popper="{ strategy: 'fixed' }">
          <BaseButton block variant="ghost" :class="appConfig.calendar.mobileHeaderButton">
            <div :class="appConfig.calendar.mobileHeaderTitleRow">
              <h1 :class="[appConfig.typography.sectionTitleTransparent, 'truncate']">
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
            <p :class="appConfig.typography.pageSubtitle">
              {{ UI_TEXT.common.calendar }}
            </p>
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
      </div>

      <div :class="appConfig.calendar.mobileToolbar">
        <UPopover
          v-model:open="isFilterOpen"
          :popper="{ strategy: 'fixed', placement: 'bottom-end' }"
        >
          <BaseButton
            icon="i-heroicons-funnel"
            :label="UI_TEXT.common.filter"
            variant="glassOutlineButton"
            :class="appConfig.calendar.mobileFilterButton"
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

        <BaseSearchInput
          v-model="searchQuery"
          :placeholder="UI_TEXT.events.searchPlaceholder"
        />

        <BaseButton
          icon="i-heroicons-plus"
          variant="glassIconButton"
          :tooltip="UI_TEXT.tooltips.addEvent"
          @click="$emit('open-add-event')"
        />
      </div>

      <div :class="appConfig.calendar.mobileContentWrapper">
        <div :class="appConfig.calendar.mobileToolbar">
          <UPopover
            v-model:open="isDateDropdownOpen"
            :class="appConfig.calendar.participantCardInfo"
            :popper="{ strategy: 'fixed', placement: 'bottom-start' }"
          >
            <BaseButton
              block
              variant="glassOutlineButton"
              :class="appConfig.calendar.mobileDateButton"
            >
              <span class="truncate">{{
                selectedDayDetails
                  ? `${selectedDayDetails.date} (${selectedDayDetails.dayOfWeek})`
                  : UI_TEXT.events.selectDate
              }}</span>
              <UIcon
                name="i-heroicons-chevron-up-down"
                :class="[
                   appConfig.calendar.eventItemIcon,
                  isDateDropdownOpen ? 'rotate-180' : '',
                ]"
              />
            </BaseButton>
            <template #content>
              <div :class="WIDE_DROPDOWN_MENU_CONFIG.slots.content">
                <div v-if="isLoadingDays" :class="appConfig.calendar.mobileEmptyState">
                  {{ UI_TEXT.events.loadingDays }}
                </div>
                <template v-else>
                  <BaseButton
                    v-for="day in sortedDaysList"
                    :key="day.id"
                    :class="[
                      WIDE_DROPDOWN_MENU_CONFIG.slots.item,
                      selectedDayId === day.id ? appConfig.calendar.eventListItemSelected : '',
                      day.isExpired ? appConfig.calendar.expiredItemWrapper : '',
                    ]"
                    variant="ghost"
                    @click="selectDay(day.id)"
                  >
                    {{ day.date }} ({{ day.dayOfWeek }})
                  </BaseButton>
                </template>
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

        <div :class="appConfig.calendar.mobileEventsWrapper">
          <div v-if="isLoadingEvents" :class="appConfig.calendar.mobileEmptyState">
            {{ UI_TEXT.events.loadingEvents }}
          </div>
          <template v-else>
            <div
              v-for="(event, index) in filteredAndSortedEventsList"
              :key="event.uuid"
              :class="[
                appConfig.calendar.mobileEventItem,
                event.isExpired ? appConfig.calendar.expiredItemWrapper : '',
                index !== filteredAndSortedEventsList.length - 1
                  ? appConfig.calendar.mobileEventItemBorder
                  : '',
              ]"
              @click="$emit('open-preview-modal', event)"
            >
              <div :class="[appConfig.calendar.eventItemWrapper, appConfig.calendar.participantCardInfo]">
                <UTooltip
                  :text="
                    event.is_private ? UI_TEXT.events.privateLabel : UI_TEXT.events.groupEventLabel
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
                    TEXT_SIZES.sm,
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
              :class="[appConfig.calendar.mobileEmptyState, SPACING_TOKENS.py.xl]"
            >
              <span>{{
                searchQuery ? UI_TEXT.events.noMatchingEvents : UI_TEXT.events.noEvents
              }}</span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
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

const emit = defineEmits<{
  (e: 'select-group', uuid: string): void;
  (e: 'update:selected-day-id', id: string | undefined): void;
  (e: 'update:selected-event', event: UiEvent | null): void;
  (
    e: 'delete-group' | 'leave-group' | 'apply-filter' | 'open-add-event' | 'open-all-participants',
  ): void;
  (
    e: 'open-delete-event' | 'open-leave-event' | 'open-add-members' | 'open-preview-modal',
    event: UiEvent,
  ): void;
  (e: 'open-user-profile', user: EventCreatorDto): void;
}>();

const searchQuery = defineModel<string>('searchQuery', { default: '' });
const filterStartDate = defineModel<string>('filterStartDate', { default: '' });
const filterEndDate = defineModel<string>('filterEndDate', { default: '' });
const isGroupDropdownOpen = defineModel<boolean>('isGroupDropdownOpen', { default: false });
const isFilterOpen = defineModel<boolean>('isFilterOpen', { default: false });
const showOnlyActiveEvents = defineModel<boolean>('showOnlyActiveEvents', { default: true });

const isDateDropdownOpen = ref(false);

const selectDay = (id: string) => {
  emit('update:selected-day-id', id);
  isDateDropdownOpen.value = false;
};

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
