<!-- frontend/app/components/events/views/EventsMobile.vue -->
<template>
  <div :class="LAYOUT_CONFIG.mobilePageWrapper">
    <div :class="LAYOUT_CONFIG.mobileTopActions">
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

    <div :class="LAYOUT_CONFIG.mobileMainWrapper">
      <div :class="LAYOUT_CONFIG.mobileHeader">
        <UPopover
          v-model:open="isGroupDropdownOpen"
          :class="LAYOUT_CONFIG.fullWidth"
          :popper="{ strategy: 'fixed' }"
        >
          <BaseButton block variant="ghost" :class="LAYOUT_CONFIG.mobileHeaderButton">
            <div :class="LAYOUT_CONFIG.mobileHeaderTitleRow">
              <h1 :class="TYPOGRAPHY_CONFIG.sectionTitleTransparent">
                {{
                  isLoadingGroups
                    ? UI_TEXT.common.loading
                    : selectedGroupDetails?.name || UI_TEXT.events.selectGroup
                }}
              </h1>
              <UIcon
                name="i-heroicons-chevron-down"
                :class="[TYPOGRAPHY_CONFIG.iconBrandMd, isGroupDropdownOpen ? 'rotate-180' : '']"
              />
            </div>
            <p :class="TYPOGRAPHY_CONFIG.pageSubtitle">
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

      <div :class="LAYOUT_CONFIG.mobileToolbar">
        <UPopover
          v-model:open="isFilterOpen"
          :popper="{ strategy: 'fixed', placement: 'bottom-end' }"
        >
          <BaseButton
            icon="i-heroicons-funnel"
            :label="UI_TEXT.common.filter"
            variant="glassOutlineButton"
            :class="CALENDAR_CONFIG.mobileFilterButton"
            :tooltip="UI_TEXT.tooltips.filterEvents"
          />
          <template #content>
            <div :class="CALENDAR_CONFIG.filterDropdownContent">
              <div :class="LAYOUT_CONFIG.modalFormGroup">
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
                <div :class="LAYOUT_CONFIG.rightButtonWrapper">
                  <BaseButton
                    :label="UI_TEXT.common.clearFilter"
                    variant="smallHollowActionButton"
                    :class="
                      filterStartDate || filterEndDate
                        ? CALENDAR_CONFIG.clearFilterActive
                        : CALENDAR_CONFIG.clearFilterDisabled
                    "
                    :disabled="!filterStartDate && !filterEndDate"
                    @click="clearFilters"
                  />
                </div>
              </div>
            </div>
          </template>
        </UPopover>

        <BaseSearchInput v-model="searchQuery" :placeholder="UI_TEXT.events.searchPlaceholder" />

        <BaseButton
          icon="i-heroicons-plus"
          variant="glassIconButton"
          :tooltip="UI_TEXT.tooltips.addEvent"
          @click="$emit('open-add-event')"
        />
      </div>

      <div :class="LAYOUT_CONFIG.mobileContentWrapper">
        <div :class="LAYOUT_CONFIG.mobileToolbar">
          <UPopover
            v-model:open="isDateDropdownOpen"
            :class="LAYOUT_CONFIG.listCardInfo"
            :popper="{ strategy: 'fixed', placement: 'bottom-start' }"
          >
            <BaseButton
              block
              variant="glassOutlineButton"
              :class="CALENDAR_CONFIG.mobileDateButton"
            >
              <span :class="TYPOGRAPHY_CONFIG.cardTitleSm">{{
                selectedDayDetails
                  ? `${selectedDayDetails.date} (${selectedDayDetails.dayOfWeek})`
                  : UI_TEXT.events.selectDate
              }}</span>
              <UIcon
                name="i-heroicons-chevron-up-down"
                :class="[CALENDAR_CONFIG.eventItemIcon, isDateDropdownOpen ? 'rotate-180' : '']"
              />
            </BaseButton>
            <template #content>
              <div :class="WIDE_DROPDOWN_MENU_CONFIG.slots.content">
                <div v-if="isLoadingDays" :class="CALENDAR_CONFIG.mobileEmptyState">
                  {{ UI_TEXT.events.loadingDays }}
                </div>
                <template v-else>
                  <BaseButton
                    v-for="day in sortedDaysList"
                    :key="day.id"
                    :class="[
                      WIDE_DROPDOWN_MENU_CONFIG.slots.item,
                      selectedDayId === day.id ? CALENDAR_CONFIG.eventListItemSelected : '',
                      day.isExpired ? CALENDAR_CONFIG.expiredItemWrapper : '',
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
                ? CALENDAR_CONFIG.activeToggleFilterBtn
                : CALENDAR_CONFIG.inactiveToggleFilterBtn
            "
            :tooltip="showOnlyActiveEvents ? UI_TEXT.events.showAll : UI_TEXT.events.hideExpired"
            @click="showOnlyActiveEvents = !showOnlyActiveEvents"
          />
        </div>

        <div :class="CALENDAR_CONFIG.mobileEventsWrapper">
          <div v-if="isLoadingEvents" :class="CALENDAR_CONFIG.mobileEmptyState">
            {{ UI_TEXT.events.loadingEvents }}
          </div>
          <template v-else>
            <div
              v-for="(event, index) in filteredAndSortedEventsList"
              :key="event.uuid"
              :class="[
                CALENDAR_CONFIG.mobileEventItem,
                event.isExpired ? CALENDAR_CONFIG.expiredItemWrapper : '',
                index !== filteredAndSortedEventsList.length - 1
                  ? CALENDAR_CONFIG.mobileEventItemBorder
                  : '',
              ]"
              @click="$emit('open-preview-modal', event)"
            >
              <div :class="[CALENDAR_CONFIG.eventItemWrapper, LAYOUT_CONFIG.listCardInfo]">
                <UTooltip
                  :text="
                    event.is_private ? UI_TEXT.events.privateLabel : UI_TEXT.events.groupEventLabel
                  "
                >
                  <UIcon
                    :name="event.is_private ? 'i-heroicons-user' : 'i-heroicons-user-group'"
                    :class="CALENDAR_CONFIG.eventItemIcon"
                  />
                </UTooltip>
                <span
                  :class="[
                    CALENDAR_CONFIG.eventItemTitle,
                    event.isExpired ? CALENDAR_CONFIG.expiredItemText : '',
                  ]"
                  >{{ event.title }}</span
                >
              </div>
              <div :class="CALENDAR_CONFIG.eventItemWrapper">
                <span :class="CALENDAR_CONFIG.eventItemTime"
                  >{{ event.timeStartFormatted }} - {{ event.timeEndFormatted }}</span
                >
              </div>
            </div>
            <div
              v-if="!filteredAndSortedEventsList?.length"
              :class="CALENDAR_CONFIG.mobileEmptyState"
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
