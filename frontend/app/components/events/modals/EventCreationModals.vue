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
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import type { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';
import { useAppConfig, useToast } from '#imports';
import { useEventsStore } from '~/stores/events.modals.store';
import { useCreateEventMutation } from '~/queries/events.mutation';
import { createEventSchema } from '~/utils/schemas/events.schema';
import { getErrorMessage } from '~/utils/error.utils';

const appConfig = useAppConfig();
const toast = useToast();
const eventsStore = useEventsStore();

const isMapSelectorOpen = ref(false);

const createEventMutation = useCreateEventMutation(
  computed(() => eventsStore.selectedGroupUuid),
  {
    onSuccess: () => {
      closeAndResetForm();
      toast.add({ title: UI_TEXT.common.success, description: UI_TEXT.events.created });
    },
    onError: (err) => toast.add({ title: UI_TEXT.common.error, description: getErrorMessage(err) }),
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
