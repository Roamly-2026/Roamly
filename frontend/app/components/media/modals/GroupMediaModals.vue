<template>
  <div>
    <!-- UPLOAD MODAL -->
    <BaseModal
      v-model:open="mediaStore.isUploadModalOpen"
      :title="UI_TEXT.media.uploadHeading"
      :ui-size="appConfig.layout.modalSizeMd"
    >
      <template #body>
        <UForm
          id="upload-media-form"
          :schema="groupMediaSchema"
          :state="uploadForm"
          :class="[
            appConfig.layout.modalForm,
            'overflow-y-auto max-h-[65vh] custom-scrollbar px-2',
          ]"
          @submit="handleUpload"
        >
          <BaseInput
            :label="UI_TEXT.documents.selectFile"
            name="file"
            type="file"
            icon="i-heroicons-photo"
            @change="onFileChange"
          />

          <BaseInput
            v-model="uploadForm.taken_at"
            :label="UI_TEXT.documents.issuedAtLabel"
            name="taken_at"
            type="datetime-local"
          />

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-dark-text">{{
              UI_TEXT.events.locationLabel
            }}</label>
            <div class="flex items-center gap-2">
              <BaseInput v-model="uploadForm.location_name" name="location_name" class="flex-1" />
              <BaseButton
                icon="i-heroicons-map"
                :label="UI_TEXT.events.chooseLocation"
                variant="glassOutlineButton"
                class="shrink-0 h-10 px-3 whitespace-nowrap"
                @click.prevent="openMapFor('upload')"
              />
              <BaseButton
                v-if="uploadForm.latitude && uploadForm.longitude"
                icon="i-heroicons-x-mark"
                variant="ghostDangerIconButton"
                class="shrink-0 h-10 w-10 text-error-500"
                tooltip="Clear coordinates"
                @click="clearUploadLocation"
              />
            </div>
            <div
              v-if="uploadForm.latitude && uploadForm.longitude"
              class="text-xs font-medium text-brand-600 pl-1"
            >
              Coordinates attached
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <span class="text-sm font-medium text-dark-text">{{
              UI_TEXT.events.participantsLabel
            }}</span>
            <div class="flex flex-wrap gap-2.5">
              <div
                v-for="user in availableMembers"
                :key="user.uuid || user.username"
                :class="[
                  'cursor-pointer rounded-full flex items-center px-3 py-1.5 gap-2.5 border transition-all select-none',
                  user.uuid && uploadForm.tagged_user_uuids?.includes(user.uuid)
                    ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-500'
                    : 'border-surface-200 bg-surface-50 text-dark-text/80 hover:bg-surface-100 hover:border-surface-300',
                ]"
                @click="toggleUploadTag(user.uuid)"
              >
                <!-- Enforce avatar size constraints defined by app config -->
                <UAvatar
                  :src="user.profile_image_url || undefined"
                  :alt="user.username"
                  size="header"
                  class="!w-6 !h-6 min-w-[24px] min-h-[24px] shrink-0"
                />
                <span class="text-sm font-medium">{{ user.username }}</span>
              </div>
            </div>
          </div>

          <UFormField name="description" :label="UI_TEXT.events.descriptionLabel">
            <template #default="{ error }">
              <UTextarea
                v-model="uploadForm.description"
                :placeholder="UI_TEXT.media.captionPlaceholder"
                :variant="error ? 'glassError' : 'glass'"
              />
            </template>
          </UFormField>

          <div v-if="uploadError" :class="appConfig.typography.formStatusError">
            {{ getErrorMessage(uploadError) }}
          </div>
        </UForm>
      </template>
      <template #footer>
        <div :class="appConfig.layout.flexBetween">
          <BaseButton
            :label="UI_TEXT.common.cancel"
            variant="actionCancelButton"
            @click="closeUploadModal"
          />
          <BaseButton
            type="submit"
            form="upload-media-form"
            :label="UI_TEXT.common.upload"
            :loading="uploadMutation.isLoading.value"
            :disabled="!uploadForm.file"
          />
        </div>
      </template>
    </BaseModal>

    <!-- UPDATE MODAL -->
    <BaseModal
      v-model:open="mediaStore.isUpdateModalOpen"
      title="Edit photo details"
      :ui-size="appConfig.layout.modalSizeMd"
    >
      <template #body>
        <form
          id="update-media-form"
          :class="[
            appConfig.layout.modalForm,
            'overflow-y-auto max-h-[65vh] custom-scrollbar px-2 flex flex-col gap-4',
          ]"
          @submit.prevent="handleUpdate"
        >
          <BaseInput
            v-model="updateForm.taken_at"
            :label="UI_TEXT.documents.issuedAtLabel"
            name="taken_at"
            type="datetime-local"
          />

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-dark-text">{{
              UI_TEXT.events.locationLabel
            }}</label>
            <div class="flex items-center gap-2">
              <BaseInput v-model="updateForm.location_name" name="location_name" class="flex-1" />
              <BaseButton
                icon="i-heroicons-map"
                :label="UI_TEXT.events.chooseLocation"
                variant="glassOutlineButton"
                class="shrink-0 h-10 px-3 whitespace-nowrap"
                @click.prevent="openMapFor('update')"
              />
              <BaseButton
                v-if="updateForm.latitude && updateForm.longitude"
                icon="i-heroicons-x-mark"
                variant="ghostDangerIconButton"
                class="shrink-0 h-10 w-10 text-error-500"
                tooltip="Clear coordinates"
                @click="clearUpdateLocation"
              />
            </div>
            <div
              v-if="updateForm.latitude && updateForm.longitude"
              class="text-xs font-medium text-brand-600 pl-1"
            >
              Coordinates attached
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <span class="text-sm font-medium text-dark-text">{{
              UI_TEXT.events.participantsLabel
            }}</span>
            <div class="flex flex-wrap gap-2.5">
              <div
                v-for="user in availableMembers"
                :key="user.uuid || user.username"
                :class="[
                  'cursor-pointer rounded-full flex items-center px-3 py-1.5 gap-2.5 border transition-all select-none',
                  user.uuid && updateForm.tagged_user_uuids?.includes(user.uuid)
                    ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-500'
                    : 'border-surface-200 bg-surface-50 text-dark-text/80 hover:bg-surface-100 hover:border-surface-300',
                ]"
                @click="toggleUpdateTag(user.uuid)"
              >
                <!-- Enforce avatar size constraints defined by app config -->
                <UAvatar
                  :src="user.profile_image_url || undefined"
                  :alt="user.username"
                  size="header"
                  class="!w-6 !h-6 min-w-[24px] min-h-[24px] shrink-0"
                />
                <span class="text-sm font-medium">{{ user.username }}</span>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-dark-text">{{
              UI_TEXT.events.descriptionLabel
            }}</label>
            <UTextarea
              v-model="updateForm.description"
              :placeholder="UI_TEXT.media.captionPlaceholder"
              variant="glass"
            />
          </div>

          <div v-if="updateError" :class="appConfig.typography.formStatusError">
            {{ getErrorMessage(updateError) }}
          </div>
        </form>
      </template>
      <template #footer>
        <div :class="appConfig.layout.flexBetween">
          <BaseButton
            :label="UI_TEXT.common.cancel"
            variant="actionCancelButton"
            @click="mediaStore.closeUpdateModal()"
          />
          <BaseButton
            type="submit"
            form="update-media-form"
            :label="UI_TEXT.common.save"
            :loading="updateMutation.isLoading.value"
          />
        </div>
      </template>
    </BaseModal>

    <!-- MAP SELECTOR MODAL (SHARED) -->
    <BaseModal v-model:open="isMapSelectorOpen" :ui-size="appConfig.layout.modalSizeLg">
      <template #header>
        <div class="flex justify-between items-center w-full">
          <h3 class="text-xl font-bold text-dark-text">{{ UI_TEXT.events.selectLocation }}</h3>
          <BaseButton
            icon="i-heroicons-x-mark"
            variant="ghost"
            class="hover:bg-error-50 hover:text-error-500 rounded-full transition-all duration-200"
            @click="isMapSelectorOpen = false"
          />
        </div>
      </template>
      <template #body>
        <div class="h-[45vh] w-full shrink-0">
          <ClientOnly>
            <EventMapSelector
              :is-open="isMapSelectorOpen"
              :initial-location="activeMapInitialLocation"
              @confirm-location="handleLocationSelected"
            />
          </ClientOnly>
        </div>
      </template>
    </BaseModal>

    <!-- DELETE MODAL -->
    <ConfirmModal
      v-model:open="mediaStore.isDeleteModalOpen"
      :title="UI_TEXT.media.deletePhoto"
      :cancel-text="UI_TEXT.common.cancel"
      :confirm-text="UI_TEXT.common.delete"
      :loading="deleteMutation.isLoading.value"
      :ui-size="appConfig.layout.modalSizeMd"
      @cancel="mediaStore.closeDeleteModal()"
      @confirm="confirmDelete"
    >
      <template #body>
        <p :class="appConfig.typography.modalText">
          {{ UI_TEXT.documents.deleteDocumentBeforeName }}
          <span :class="appConfig.typography.modalInlineHighlight">{{
            mediaStore.mediaToDelete?.file_name
          }}</span
          >?
        </p>
      </template>
    </ConfirmModal>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAppConfig } from '#imports';
import type { FormSubmitEvent } from '#ui/types';
import { useMediaModalsStore } from '~/stores/media.modals.store';
import { useGroupInfosQuery } from '~/queries/groups.query';
import {
  useUploadGroupMediaMutation,
  useDeleteGroupFileMutation,
  useUpdateGroupMediaMutation,
} from '~/queries/files.mutation';
import { groupMediaSchema, type GroupMediaFormState } from '~/utils/schemas/files.schema';
import { getErrorMessage } from '~/utils/error.utils';
import { extractImageMetadata } from '~/utils/exif.utils';
import EventMapSelector from '~/components/events/map/EventMapSelector.client.vue';

const appConfig = useAppConfig();
const mediaStore = useMediaModalsStore();
const route = useRoute();

const isMapSelectorOpen = ref(false);
const mapTarget = ref<'upload' | 'update'>('upload');

const uploadError = ref<Error | null>(null);
const updateError = ref<Error | null>(null);

// Always resolve the valid group UUID from route query or store upload context
const activeGroupUuid = computed(
  () => (route.query.groupId as string) || mediaStore.uploadGroupUuid || '',
);

const { data: groupInfos } = useGroupInfosQuery(activeGroupUuid);
const availableMembers = computed(
  () =>
    groupInfos.value?.group_profiles?.map((p) => ({
      uuid: p.users.uuid,
      username: p.users.username,
      profile_image_url: p.users.profile_image_url,
    })) || [],
);

// ------------------------------------------
// 1. UPLOAD LOGIC
// ------------------------------------------
const uploadForm = reactive<GroupMediaFormState>({
  file: null,
  description: '',
  taken_at: '',
  location_name: '',
  latitude: null,
  longitude: null,
  tagged_user_uuids: [],
});

const onFileChange = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0] ?? null;
  uploadForm.file = file;

  if (file && file.type.startsWith('image/')) {
    uploadForm.taken_at = '';
    uploadForm.latitude = null;
    uploadForm.longitude = null;
    uploadForm.location_name = '';

    const meta = await extractImageMetadata(file);

    if (meta.takenAt) {
      uploadForm.taken_at = meta.takenAt;
    }

    if (typeof meta.latitude === 'number' && typeof meta.longitude === 'number') {
      uploadForm.latitude = meta.latitude;
      uploadForm.longitude = meta.longitude;
    }

    if (meta.locationName) {
      uploadForm.location_name = meta.locationName;
    }
  }
};

const toggleUploadTag = (uuid?: string): void => {
  if (!uuid) return;
  if (!uploadForm.tagged_user_uuids) uploadForm.tagged_user_uuids = [];
  const idx = uploadForm.tagged_user_uuids.indexOf(uuid);
  if (idx === -1) uploadForm.tagged_user_uuids.push(uuid);
  else uploadForm.tagged_user_uuids.splice(idx, 1);
};

const clearUploadLocation = () => {
  uploadForm.latitude = null;
  uploadForm.longitude = null;
  uploadForm.location_name = '';
};

const closeUploadModal = () => {
  mediaStore.closeUploadModal();
  Object.assign(uploadForm, {
    file: null,
    description: '',
    taken_at: '',
    location_name: '',
    latitude: null,
    longitude: null,
    tagged_user_uuids: [],
  });
  uploadError.value = null;
};

const uploadMutation = useUploadGroupMediaMutation(
  computed(() => activeGroupUuid.value || undefined),
  { onSuccess: closeUploadModal, onError: (err) => (uploadError.value = err as Error) },
);

const handleUpload = (event: FormSubmitEvent<GroupMediaFormState>) => {
  if (!(event.data.file instanceof File)) return;
  uploadError.value = null;
  const fd = new FormData();
  fd.append('file', event.data.file);
  if (event.data.description) fd.append('description', event.data.description);
  if (event.data.taken_at) fd.append('taken_at', new Date(event.data.taken_at).toISOString());

  if (typeof event.data.latitude === 'number' && typeof event.data.longitude === 'number') {
    fd.append('latitude', event.data.latitude.toString());
    fd.append('longitude', event.data.longitude.toString());
  }
  if (event.data.location_name) {
    fd.append('location_name', event.data.location_name);
  }

  if (event.data.tagged_user_uuids?.length)
    fd.append('tagged_user_uuids', JSON.stringify(event.data.tagged_user_uuids));
  uploadMutation.mutate(fd);
};

// ------------------------------------------
// 2. UPDATE LOGIC
// ------------------------------------------
const updateForm = reactive({
  description: '',
  taken_at: '',
  location_name: '',
  latitude: null as number | null,
  longitude: null as number | null,
  tagged_user_uuids: [] as string[],
});

// Sync existing record data into form
watch(
  () => mediaStore.mediaToUpdate,
  (media) => {
    if (!media) return;

    let formattedDate = '';
    if (media.media_files?.taken_at) {
      const d = new Date(media.media_files.taken_at);
      formattedDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
    }

    updateForm.description = media.media_files?.description || '';
    updateForm.taken_at = formattedDate;
    updateForm.location_name = media.media_files?.location_name || '';
    updateForm.latitude = media.media_files?.latitude ?? null;
    updateForm.longitude = media.media_files?.longitude ?? null;
    updateForm.tagged_user_uuids = media.media_files?.media_tags?.map((t) => t.users.uuid) || [];
  },
  { immediate: true },
);

const toggleUpdateTag = (uuid?: string): void => {
  if (!uuid) return;
  const idx = updateForm.tagged_user_uuids.indexOf(uuid);
  if (idx === -1) updateForm.tagged_user_uuids.push(uuid);
  else updateForm.tagged_user_uuids.splice(idx, 1);
};

const clearUpdateLocation = () => {
  updateForm.latitude = null;
  updateForm.longitude = null;
  updateForm.location_name = '';
};

const updateMutation = useUpdateGroupMediaMutation(
  computed(() => activeGroupUuid.value || undefined),
  {
    onSuccess: () => {
      mediaStore.closeUpdateModal();
    },
    onError: (err) => {
      updateError.value = err as Error;
    },
  },
);

const handleUpdate = () => {
  if (!mediaStore.mediaToUpdate) return;
  updateError.value = null;

  const fd = new FormData();
  if (updateForm.description) fd.append('description', updateForm.description);
  if (updateForm.taken_at) fd.append('taken_at', new Date(updateForm.taken_at).toISOString());
  if (typeof updateForm.latitude === 'number' && typeof updateForm.longitude === 'number') {
    fd.append('latitude', updateForm.latitude.toString());
    fd.append('longitude', updateForm.longitude.toString());
  }
  if (updateForm.location_name) {
    fd.append('location_name', updateForm.location_name);
  }
  if (updateForm.tagged_user_uuids?.length) {
    fd.append('tagged_user_uuids', JSON.stringify(updateForm.tagged_user_uuids));
  }

  updateMutation.mutate({
    fileId: mediaStore.mediaToUpdate.file_id,
    formData: fd,
  });
};

// ------------------------------------------
// 3. MAP SELECTION LOGIC
// ------------------------------------------
const openMapFor = (target: 'upload' | 'update') => {
  mapTarget.value = target;
  isMapSelectorOpen.value = true;
};

const activeMapInitialLocation = computed(() => {
  const current = mapTarget.value === 'upload' ? uploadForm : updateForm;
  if (
    typeof current.latitude === 'number' &&
    typeof current.longitude === 'number' &&
    current.location_name
  ) {
    return {
      latitude: current.latitude,
      longitude: current.longitude,
      address: current.location_name,
    };
  }
  return null;
});

const handleLocationSelected = (loc: {
  latitude: number;
  longitude: number;
  address: string;
}): void => {
  const current = mapTarget.value === 'upload' ? uploadForm : updateForm;
  current.latitude = loc.latitude;
  current.longitude = loc.longitude;

  if (!current.location_name?.trim()) {
    current.location_name = loc.address;
  }

  isMapSelectorOpen.value = false;
};

// ------------------------------------------
// 4. DELETE LOGIC
// ------------------------------------------
const deleteMutation = useDeleteGroupFileMutation(
  computed(() => activeGroupUuid.value || undefined),
  {
    onSuccess: () => {
      mediaStore.closeDeleteModal();
    },
  },
);

const confirmDelete = () => {
  if (mediaStore.mediaToDelete) deleteMutation.mutate(mediaStore.mediaToDelete.file_id);
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
