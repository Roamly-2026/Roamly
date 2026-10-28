<!-- frontend/app/components/events/modals/EventCreationModals.vue -->
<template>
  <div>
    <!-- ADD EVENT MODAL -->
    <BaseModal
      v-model:open="eventsStore.isAddEventModalOpen"
      :title="UI_TEXT.tooltips.addEvent"
      :ui-size="appConfig.layout.modalSizeMd"
    >
      <template #body>
        <div :class="appConfig.layout.modalScrollBody">
          <UForm
            id="add-event-form"
            :schema="createEventSchema"
            :state="formState"
            :class="appConfig.layout.modalForm"
            @submit="onSubmit"
          >
            <BaseInput
              v-model="formState.title"
              name="title"
              :label="UI_TEXT.events.title"
              :placeholder="UI_TEXT.events.titlePlaceholder"
            />

            <UFormField name="start_time" :label="UI_TEXT.events.startDateTime">
              <template #default="{ error }">
                <div :class="appConfig.layout.modalFormGrid2Col">
                  <UInput
                    v-model="formState.startDate"
                    type="date"
                    :variant="error ? 'glassError' : 'glass'"
                  />
                  <UInput
                    v-model="formState.startTime"
                    type="time"
                    :variant="error ? 'glassError' : 'glass'"
                  />
                </div>
              </template>
            </UFormField>

            <UFormField name="end_time" :label="UI_TEXT.events.endDateTime">
              <template #default="{ error }">
                <div :class="appConfig.layout.modalFormGrid2Col">
                  <UInput
                    v-model="formState.endDate"
                    type="date"
                    :variant="error ? 'glassError' : 'glass'"
                  />
                  <UInput
                    v-model="formState.endTime"
                    type="time"
                    :variant="error ? 'glassError' : 'glass'"
                  />
                </div>
              </template>
            </UFormField>

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
            <div :class="appConfig.calendar.filterFormGroup">
              <span :class="appConfig.typography.inputLabel">{{
                UI_TEXT.events.optionalLocation
              }}</span>
              <BaseButton
                icon="i-heroicons-map"
                :label="UI_TEXT.events.chooseLocation"
                variant="glassOutlineButton"
                @click="isMapSelectorOpen = true"
              />
              <div v-if="formState.address" :class="appConfig.layout.filePreviewChip">
                <span :class="appConfig.calendar.metaValue">
                  {{ formState.address }}
                </span>
                <BaseButton
                  icon="i-heroicons-x-mark"
                  variant="ghostDangerIconButton"
                  @click="clearLocation"
                />
              </div>
            </div>

            <div :class="appConfig.layout.flexBetween">
              <UCheckbox
                v-model="formState.is_private"
                variant="glass"
                :label="UI_TEXT.events.markPrivate"
              />
            </div>
          </UForm>
        </div>
      </template>
      <template #footer>
        <div :class="appConfig.layout.modalActions">
          <BaseButton
            :label="UI_TEXT.common.cancel"
            variant="actionCancelButton"
            :class="appConfig.typography.modalActionBtnCancel"
            @click="closeAndResetForm"
          />
          <BaseButton
            type="submit"
            form="add-event-form"
            :label="UI_TEXT.common.add"
            variant="actionOkButton"
            :class="appConfig.typography.modalActionBtnOk"
            :loading="createEventMutation.isLoading.value"
          />
        </div>
      </template>
    </BaseModal>

    <!-- MAP SELECTOR MODAL -->
    <BaseModal v-model:open="isMapSelectorOpen" :ui-size="appConfig.layout.modalSizeLg">
      <template #header>
        <div :class="appConfig.calendar.previewTitleRow">
          <h3 :class="appConfig.typography.cardTitle">{{ UI_TEXT.events.selectLocation }}</h3>
          <BaseButton
            icon="i-heroicons-x-mark"
            variant="ghostDangerIconButton"
            @click="isMapSelectorOpen = false"
          />
        </div>
      </template>
      <template #body>
        <div :class="appConfig.layout.modalScrollBody">
          <div :class="appConfig.layout.modalMapWrapper">
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
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import type { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';
import { useAppConfig } from '#imports';
import { useEventsStore } from '~/stores/events.modals.store';
import { useCreateEventMutation } from '~/queries/events.mutation';
import { createEventSchema } from '~/utils/schemas/events.schema';

const appConfig = useAppConfig();
const eventsStore = useEventsStore();

const isMapSelectorOpen = ref(false);

const createEventMutation = useCreateEventMutation(
  computed(() => eventsStore.selectedGroupUuid),
  {
    onSuccess: () => {
      closeAndResetForm();
    },
  },
);

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
    latitude: null,
    longitude: null,
    address: null,
  });
};

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
    latitude: formState.latitude ?? null,
    longitude: formState.longitude ?? null,
    address: formState.address ?? null,
  };
  createEventMutation.mutate(payload);
};

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
