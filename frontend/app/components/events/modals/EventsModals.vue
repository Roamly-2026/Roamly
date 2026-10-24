<!-- frontend/app/components/events/modals/EventsModals.vue -->
<template>
  <div>
    <!-- ADD EVENT MODAL -->
    <BaseModal
      v-model:open="eventsStore.isAddEventModalOpen"
      :title="UI_TEXT.tooltips.addEvent"
      :ui-size="appConfig.layout.modalSizeMd"
    >
      <template #body>
        <div
          :class="[
            appConfig.calendar.previewWrapper,
            'p-2! pr-3! gap-4! md:overflow-visible md:max-h-none overflow-y-auto max-h-[70vh] overscroll-contain custom-scrollbar flex flex-col',
          ]"
        >
          <UForm
            id="add-event-form"
            :schema="createEventSchema"
            :state="formState"
            :class="appConfig.layout.modalForm"
            @submit="onSubmit"
          >
            <UFormField name="title" :label="UI_TEXT.events.title">
              <template #default="{ error }">
                <UInput
                  v-model="formState.title"
                  :placeholder="UI_TEXT.events.titlePlaceholder"
                  :variant="error ? 'glassError' : 'glass'"
                />
              </template>
            </UFormField>

            <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <UFormField name="start_time" :label="UI_TEXT.events.startDateTime">
                <template #default="{ error }">
                  <div class="flex gap-2 w-full">
                    <UInput
                      v-model="formState.startDate"
                      type="date"
                      class="w-full"
                      :variant="error ? 'glassError' : 'glass'"
                    />
                    <UInput
                      v-model="formState.startTime"
                      type="time"
                      class="w-full"
                      :variant="error ? 'glassError' : 'glass'"
                    />
                  </div>
                </template>
              </UFormField>
            </div>

            <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <UFormField name="end_time" :label="UI_TEXT.events.endDateTime">
                <template #default="{ error }">
                  <div class="flex gap-2 w-full">
                    <UInput
                      v-model="formState.endDate"
                      type="date"
                      class="w-full"
                      :variant="error ? 'glassError' : 'glass'"
                    />
                    <UInput
                      v-model="formState.endTime"
                      type="time"
                      class="w-full"
                      :variant="error ? 'glassError' : 'glass'"
                    />
                  </div>
                </template>
              </UFormField>
            </div>

            <UFormField name="description" :label="UI_TEXT.events.description">
              <template #default="{ error }">
                <UTextarea
                  v-model="formState.description"
                  :placeholder="UI_TEXT.events.descriptionPlaceholder"
                  :variant="error ? 'glassError' : 'glass'"
                />
              </template>
            </UFormField>

            <!-- Location selector -->
            <div class="mt-4 flex flex-col gap-2">
              <span class="text-sm font-medium text-dark-text">{{
                UI_TEXT.events.optionalLocation
              }}</span>
              <UButton
                icon="i-heroicons-map"
                :label="UI_TEXT.events.chooseLocation"
                variant="glassOutlineButton"
                @click="isMapSelectorOpen = true"
              />
              <div
                v-if="formState.address"
                class="flex items-start justify-between gap-2 p-2 bg-surface-50 border border-surface-200 rounded-md w-full overflow-hidden box-border"
              >
                <span
                  class="text-sm text-dark-text/80 wrap-break-word whitespace-normal min-w-0 flex-1"
                >
                  {{ formState.address }}
                </span>
                <UButton
                  icon="i-heroicons-x-mark"
                  variant="ghostDangerIconButton"
                  size="xs"
                  class="p-0 shrink-0 self-center"
                  @click="clearLocation"
                />
              </div>
            </div>

            <div class="mt-2 flex items-center justify-between">
              <UCheckbox
                v-model="formState.is_private"
                variant="glass"
                :label="UI_TEXT.events.markPrivate"
                :ui="{ base: 'w-5 h-5 cursor-pointer border-2 border-dark-text/30' }"
              />
            </div>
          </UForm>
        </div>
      </template>
      <template #footer>
        <div :class="[appConfig.layout.flexBetween, 'mt-4']">
          <UButton
            :label="UI_TEXT.common.cancel"
            variant="actionCancelButton"
            @click="closeAndResetForm"
          />
          <UButton
            type="submit"
            form="add-event-form"
            :label="UI_TEXT.common.add"
            variant="actionOkButton"
            :loading="createEventMutation.isLoading.value"
          />
        </div>
      </template>
    </BaseModal>

    <!-- MAP SELECTOR MODAL -->
    <BaseModal v-model:open="isMapSelectorOpen" :ui-size="appConfig.layout.modalSizeLg">
      <template #header>
        <div class="flex justify-between items-center w-full">
          <h3 class="text-xl font-bold text-dark-text">{{ UI_TEXT.events.selectLocation }}</h3>
          <UButton
            icon="i-heroicons-x-mark"
            variant="ghost"
            class="hover:bg-error-50 hover:text-error-500 rounded-full transition-all duration-200"
            @click="isMapSelectorOpen = false"
          />
        </div>
      </template>
      <template #body>
        <div class="max-h-[70vh] overflow-y-auto custom-scrollbar flex flex-col gap-4 p-1">
          <div class="h-[45vh] w-full shrink-0">
            <ClientOnly>
              <EventMapSelector
                :is-open="isMapSelectorOpen"
                :initial-location="
                  formState.latitude !== null &&
                  formState.longitude !== null &&
                  formState.address !== null
                    ? {
                        latitude: formState.latitude,
                        longitude: formState.longitude,
                        address: formState.address,
                      }
                    : null
                "
                @confirm-location="handleLocationSelected"
              />
            </ClientOnly>
          </div>
        </div>
      </template>
    </BaseModal>

    <!-- DELETE EVENT MODAL -->
    <ConfirmModal
      v-model:open="eventsStore.isDeleteEventModalOpen"
      :title="UI_TEXT.events.deleteEvent"
      :cancel-text="UI_TEXT.common.cancel"
      :confirm-text="UI_TEXT.common.delete"
      :loading="deleteEventMutation.isLoading.value"
      :ui-size="appConfig.layout.modalSizeMd"
      @cancel="eventsStore.closeDeleteEventModal()"
      @confirm="handleConfirmDelete"
    >
      <template #body>
        <p :class="appConfig.typography.modalText">
          {{ ' ' + UI_TEXT.events.deleteBeforeTitle
          }}{{ eventsStore.selectedEventToDelete?.title }}"?
        </p>
      </template>
    </ConfirmModal>

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
                  @click="eventsStore.openRemoveParticipantModal(user)"
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

    <!-- EVENT PREVIEW MODAL (MOBILE ONLY) -->
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
                  eventsStore.previewEvent.is_private
                    ? 'i-heroicons-user'
                    : 'i-heroicons-user-group'
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
              <UTooltip
                v-if="
                  eventsStore.previewEvent.creator?.email === currentUserEmail &&
                  eventsStore.previewEvent.is_private
                "
                :text="UI_TEXT.events.inviteMembers"
              >
                <UButton
                  icon="i-heroicons-user-plus"
                  variant="ghostBrandIconButton"
                  class="text-dark-text/70"
                  @click="eventsStore.openAddMembersModal(eventsStore.previewEvent!)"
                />
              </UTooltip>
              <UTooltip v-if="hasPermissionToDelete" :text="UI_TEXT.events.deleteEvent">
                <UButton
                  icon="i-heroicons-trash"
                  variant="ghostDangerIconButton"
                  @click="eventsStore.openDeleteEventModal(eventsStore.previewEvent!)"
                />
              </UTooltip>
              <UTooltip v-else-if="canLeaveEvent" :text="UI_TEXT.events.leaveEvent">
                <UButton
                  icon="i-heroicons-arrow-right-on-rectangle"
                  variant="ghostDangerIconButton"
                  @click="eventsStore.openLeaveEventModal(eventsStore.previewEvent!)"
                />
              </UTooltip>
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
                  <UButton
                    variant="link"
                    class="p-0 text-sm h-auto font-medium"
                    @click="openAllParticipantsModal"
                    >{{ UI_TEXT.events.showParticipants }}</UButton
                  >
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
              <span :class="appConfig.calendar.metaLabel">{{
                UI_TEXT.events.descriptionLabel
              }}</span>
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
          <UButton
            :label="UI_TEXT.common.close"
            variant="actionCancelButton"
            @click="eventsStore.closePreviewModal()"
          />
        </div>
      </template>
    </BaseModal>

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

    <!-- LEAVE EVENT MODAL -->
    <ConfirmModal
      v-model:open="eventsStore.isLeaveEventModalOpen"
      :title="UI_TEXT.events.leaveEvent"
      :cancel-text="UI_TEXT.common.cancel"
      :confirm-text="UI_TEXT.common.leave"
      :loading="leaveEventMutation.isLoading.value"
      :ui-size="appConfig.layout.modalSizeMd"
      @cancel="eventsStore.closeLeaveEventModal()"
      @confirm="handleConfirmLeave"
    >
      <template #body>
        <p :class="appConfig.typography.modalText">
          {{ ' ' + UI_TEXT.events.leaveBeforeTitle }}{{ eventsStore.selectedEventToLeave?.title }}"?
        </p>
      </template>
    </ConfirmModal>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import type { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';
import { useAppConfig, useToast } from '#imports';
import { useEventsStore } from '~/stores/events.modals.store';
import { useGroupsStore } from '~/stores/groups.modals.store';
import { useCurrentUserQuery } from '~/queries/user.query';
import { useGroupsQuery, useGroupInfosQuery } from '~/queries/groups.query';
import {
  useDeleteEventMutation,
  useCreateEventMutation,
  useAddParticipantsMutation,
  useLeaveEventMutation,
  useRemoveParticipantMutation,
} from '~/queries/events.mutation';
import type { EventCreatorDto } from '~/types/events.type';
import { createEventSchema } from '~/utils/schemas/events.schema';
import { getErrorMessage } from '~/utils/error.utils';

const appConfig = useAppConfig();
const toast = useToast();
const eventsStore = useEventsStore();
const groupsStore = useGroupsStore();

// map
const isMapSelectorOpen = ref(false);

const { data: currentUser } = useCurrentUserQuery();
const { data: groupsData } = useGroupsQuery();
const { data: groupInfosData } = useGroupInfosQuery(
  computed(() => eventsStore.selectedGroupUuid || ''),
);
const currentUserEmail = computed(() => currentUser.value?.email);

/* --- MUTATIONS --- */
const deleteEventMutation = useDeleteEventMutation(
  computed(() => eventsStore.selectedGroupUuid),
  {
    onSuccess: () => {
      eventsStore.closeDeleteEventModal();
      eventsStore.closePreviewModal();
      toast.add({ title: UI_TEXT.common.success, description: UI_TEXT.events.deleted });
    },
    onError: (err: Error) =>
      toast.add({ title: UI_TEXT.common.error, description: getErrorMessage(err) }),
  },
);

const createEventMutation = useCreateEventMutation(
  computed(() => eventsStore.selectedGroupUuid),
  {
    onSuccess: () => {
      closeAndResetForm();
      toast.add({ title: UI_TEXT.common.success, description: UI_TEXT.events.created });
    },
    onError: (err: Error) =>
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
    onError: (err: Error) =>
      toast.add({ title: UI_TEXT.common.error, description: getErrorMessage(err) }),
  },
);

const leaveEventMutation = useLeaveEventMutation(
  computed(() => eventsStore.selectedGroupUuid),
  {
    onSuccess: () => {
      eventsStore.closeLeaveEventModal();
      eventsStore.closePreviewModal();
      toast.add({ title: UI_TEXT.common.success, description: UI_TEXT.events.left });
    },
    onError: (err: Error) =>
      toast.add({ title: UI_TEXT.common.error, description: getErrorMessage(err) }),
  },
);

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
    onError: (err: Error) =>
      toast.add({ title: UI_TEXT.common.error, description: getErrorMessage(err) }),
  },
);

/* --- ADD EVENT FORM STATE --- */
const formState = reactive({
  title: '',
  is_private: false,
  start_time: '',
  end_time: '',
  description: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',

  // map
  latitude: null as number | null,
  longitude: null as number | null,
  address: null as string | null,
});
type FormSchemaType = z.output<typeof createEventSchema>;

watch([() => formState.startDate, () => formState.startTime], ([date, time]) => {
  if (date && time) formState.start_time = `${date}T${time}`;
});

watch([() => formState.endDate, () => formState.endTime], ([date, time]) => {
  if (date && time) formState.end_time = `${date}T${time}`;
});

const closeAndResetForm = () => {
  eventsStore.closeAddEventModal();
  Object.assign(formState, {
    title: '',
    is_private: false,
    start_time: '',
    end_time: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    // map
    latitude: null,
    longitude: null,
    address: null,
  });
};

const selectedEmailsToAdd = ref<string[]>([]);

const onSubmit = (event: FormSubmitEvent<FormSchemaType>) => {
  const payload = {
    title: event.data.title,
    description: event.data.description || undefined,
    start_time: new Date(event.data.start_time).toISOString(),
    end_time: event.data.end_time
      ? new Date(event.data.end_time).toISOString()
      : new Date(event.data.start_time).toISOString(),
    visibility: formState.is_private ? 'private' : 'public',
    participant_emails: [],
    // map
    latitude: formState.latitude ?? null,
    longitude: formState.longitude ?? null,
    address: formState.address ?? null,
  };
  createEventMutation.mutate(payload);
};

/* --- HANDLERS & COMPUTEDS --- */
const handleConfirmDelete = () => {
  const eventToDelete = eventsStore.selectedEventToDelete;
  if (eventToDelete) deleteEventMutation.mutate(eventToDelete.uuid);
};

const handleConfirmLeave = () => {
  const eventToLeave = eventsStore.selectedEventToLeave;
  if (!eventToLeave) return;
  const myRecord = eventToLeave.members.find((m) => m.email === currentUserEmail.value);
  if (myRecord) {
    leaveEventMutation.mutate({ eventUuid: eventToLeave.uuid, targetUuid: myRecord.uuid });
  }
};

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

const openAllParticipantsModal = () => {
  if (eventsStore.previewEvent) {
    eventsStore.openParticipantsModal(eventsStore.previewEvent);
  }
};

const displayParticipants = computed<EventCreatorDto[]>(
  () => eventsStore.previewEvent?.members?.slice(0, 5) || [],
);
const extraParticipantsCount = computed<number>(() =>
  Math.max(0, (eventsStore.previewEvent?.members?.length || 0) - 5),
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

  const profile = groupInfosData.value.group_profiles.find((p) => {
    const matchEmail =
      user.email &&
      p.users?.email &&
      user.email.trim().toLowerCase() === p.users.email.trim().toLowerCase();

    const matchUsername =
      user.username &&
      p.users?.username &&
      user.username.trim().toLowerCase() === p.users.username.trim().toLowerCase();

    return matchEmail || matchUsername;
  });

  const roleType = profile?.roles?.type?.toLowerCase();
  return roleType === 'leader' ? UI_TEXT.common.leader : UI_TEXT.common.member;
};

const isGroupLeader = (user: EventCreatorDto): boolean => {
  return getGroupRole(user) === UI_TEXT.common.leader;
};
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

// map
const handleLocationSelected = (location: {
  latitude: number;
  longitude: number;
  address: string;
}) => {
  formState.latitude = location.latitude;
  formState.longitude = location.longitude;
  formState.address = location.address;
  isMapSelectorOpen.value = false;
};

const clearLocation = () => {
  formState.latitude = null;
  formState.longitude = null;
  formState.address = null;
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
