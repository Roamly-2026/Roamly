<!-- frontend/app/components/media/modals/GroupMediaModals.vue -->
<template>
  <div>
    <!-- UPLOAD MODAL -->
    <BaseModal
      v-model:open="mediaStore.isUploadModalOpen"
      :title="UI_TEXT.media.uploadHeading"
      :ui-size="LAYOUT_CONFIG.modalSizeMd"
    >
      <template #body>
        <UForm
          id="upload-media-form"
          :schema="groupMediaSchema"
          :state="uploadForm"
          :class="LAYOUT_CONFIG.modalScrollBody"
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

          <div :class="LAYOUT_CONFIG.modalFormGroup">
            <label :class="TYPOGRAPHY_CONFIG.inputLabel">{{ UI_TEXT.events.locationLabel }}</label>
            <div :class="`flex items-center ${SPACING_TOKENS.gap.sm}`">
              <BaseInput v-model="uploadForm.location_name" name="location_name" class="flex-1" />
              <BaseButton
                icon="i-heroicons-map"
                :label="UI_TEXT.events.chooseLocation"
                variant="glassOutlineButton"
                class="shrink-0 h-10 px-3 whitespace-nowrap"
                @click.prevent="openMapFor('upload')"
              />
              <BaseButton
                v-if="uploadForm.latitude != null && uploadForm.longitude != null"
                icon="i-heroicons-x-mark"
                variant="ghostDangerIconButton"
                class="shrink-0"
                tooltip="Clear coordinates"
                @click="clearUploadLocation"
              />
            </div>
            <div
              v-if="uploadForm.latitude != null && uploadForm.longitude != null"
              :class="TYPOGRAPHY_CONFIG.modalHighlight"
            >
              Coordinates attached
            </div>
          </div>

          <div :class="LAYOUT_CONFIG.modalFormGroup">
            <span :class="TYPOGRAPHY_CONFIG.inputLabel">{{
              UI_TEXT.events.participantsLabel
            }}</span>
            <div :class="`flex flex-wrap ${SPACING_TOKENS.gap.sm}`">
              <div
                v-for="user in availableMembers"
                :key="user.uuid || user.username"
                :class="[
                  `cursor-pointer ${RADIUS_TOKENS.full} flex items-center ${SPACING_TOKENS.px.md} ${SPACING_TOKENS.py.xs} ${SPACING_TOKENS.gap.sm} ${INTERACTION_TOKENS.all} select-none transition-all`,
                  user.uuid && uploadForm.tagged_user_uuids?.includes(user.uuid)
                    ? '!bg-btn-primary !text-btn-primary-text font-semibold shadow-md ring-2 ring-btn-primary'
                    : 'bg-black/30 border border-content-primary/20 text-content-primary/70 hover:bg-black/50 hover:text-content-primary',
                ]"
                @click="toggleUploadTag(user.uuid)"
              >
                <UAvatar
                  :src="user.profile_image_url || undefined"
                  :alt="user.username"
                  size="header"
                  class="!w-6 !h-6 min-w-[24px] min-h-[24px] shrink-0 pointer-events-none"
                />
                <span class="text-xs pointer-events-none">{{ user.username }}</span>
                <UIcon
                  v-if="user.uuid && uploadForm.tagged_user_uuids?.includes(user.uuid)"
                  name="i-heroicons-check"
                  class="w-3.5 h-3.5 shrink-0 pointer-events-none"
                />
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

          <div v-if="uploadError" :class="TYPOGRAPHY_CONFIG.formStatusError">
            {{ getErrorMessage(uploadError) }}
          </div>
        </UForm>
      </template>
      <template #footer>
        <div :class="LAYOUT_CONFIG.flexBetween">
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
      :ui-size="LAYOUT_CONFIG.modalSizeMd"
    >
      <template #body>
        <form
          id="update-media-form"
          :class="LAYOUT_CONFIG.modalScrollBody"
          @submit.prevent="handleUpdate"
        >
          <BaseInput
            v-model="updateForm.taken_at"
            :label="UI_TEXT.documents.issuedAtLabel"
            name="taken_at"
            type="datetime-local"
          />

          <div :class="LAYOUT_CONFIG.modalFormGroup">
            <label :class="TYPOGRAPHY_CONFIG.inputLabel">{{ UI_TEXT.events.locationLabel }}</label>
            <div :class="`flex items-center ${SPACING_TOKENS.gap.sm}`">
              <BaseInput v-model="updateForm.location_name" name="location_name" class="flex-1" />
              <BaseButton
                icon="i-heroicons-map"
                :label="UI_TEXT.events.chooseLocation"
                variant="glassOutlineButton"
                class="shrink-0 h-10 px-3 whitespace-nowrap"
                @click.prevent="openMapFor('update')"
              />
              <BaseButton
                v-if="updateForm.latitude != null && updateForm.longitude != null"
                icon="i-heroicons-x-mark"
                variant="ghostDangerIconButton"
                class="shrink-0"
                tooltip="Clear coordinates"
                @click="clearUpdateLocation"
              />
            </div>
            <div
              v-if="updateForm.latitude != null && updateForm.longitude != null"
              :class="TYPOGRAPHY_CONFIG.modalHighlight"
            >
              Coordinates attached
            </div>
          </div>

          <div :class="LAYOUT_CONFIG.modalFormGroup">
            <span :class="TYPOGRAPHY_CONFIG.inputLabel">{{
              UI_TEXT.events.participantsLabel
            }}</span>
            <div :class="`flex flex-wrap ${SPACING_TOKENS.gap.sm}`">
              <div
                v-for="user in availableMembers"
                :key="user.uuid || user.username"
                :class="[
                  `cursor-pointer ${RADIUS_TOKENS.full} flex items-center ${SPACING_TOKENS.px.md} ${SPACING_TOKENS.py.xs} ${SPACING_TOKENS.gap.sm} ${INTERACTION_TOKENS.all} select-none transition-all`,
                  user.uuid && updateForm.tagged_user_uuids?.includes(user.uuid)
                    ? '!bg-btn-primary !text-btn-primary-text font-semibold shadow-md ring-2 ring-btn-primary'
                    : 'bg-black/30 border border-content-primary/20 text-content-primary/70 hover:bg-black/50 hover:text-content-primary',
                ]"
                @click="toggleUpdateTag(user.uuid)"
              >
                <UAvatar
                  :src="user.profile_image_url || undefined"
                  :alt="user.username"
                  size="header"
                  class="!w-6 !h-6 min-w-[24px] min-h-[24px] shrink-0 pointer-events-none"
                />
                <span class="text-xs pointer-events-none">{{ user.username }}</span>
                <UIcon
                  v-if="user.uuid && updateForm.tagged_user_uuids?.includes(user.uuid)"
                  name="i-heroicons-check"
                  class="w-3.5 h-3.5 shrink-0 pointer-events-none"
                />
              </div>
            </div>
          </div>

          <div :class="LAYOUT_CONFIG.modalFormGroup">
            <label :class="TYPOGRAPHY_CONFIG.inputLabel">{{
              UI_TEXT.events.descriptionLabel
            }}</label>
            <UTextarea
              v-model="updateForm.description"
              :placeholder="UI_TEXT.media.captionPlaceholder"
              variant="glass"
            />
          </div>

          <div v-if="updateError" :class="TYPOGRAPHY_CONFIG.formStatusError">
            {{ getErrorMessage(updateError) }}
          </div>
        </form>
      </template>
      <template #footer>
        <div :class="LAYOUT_CONFIG.flexBetween">
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
    <BaseModal v-model:open="isMapSelectorOpen" :ui-size="LAYOUT_CONFIG.modalSizeLg">
      <template #header>
        <div :class="LAYOUT_CONFIG.flexBetween">
          <h3 :class="TYPOGRAPHY_CONFIG.cardTitle">{{ UI_TEXT.events.selectLocation }}</h3>
          <BaseButton
            icon="i-heroicons-x-mark"
            variant="ghostDangerIconButton"
            @click="isMapSelectorOpen = false"
          />
        </div>
      </template>
      <template #body>
        <div :class="LAYOUT_CONFIG.modalMapWrapper">
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
      :ui-size="LAYOUT_CONFIG.modalSizeMd"
      @cancel="mediaStore.closeDeleteModal()"
      @confirm="confirmDelete"
    >
      <template #body>
        <p :class="TYPOGRAPHY_CONFIG.modalText">
          {{ UI_TEXT.documents.deleteDocumentBeforeName }}
          <span :class="TYPOGRAPHY_CONFIG.modalInlineHighlight">{{
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

const props = defineProps<{
  groupUuid?: string;
}>();

const mediaStore = useMediaModalsStore();
const route = useRoute();

const isMapSelectorOpen = ref(false);
const mapTarget = ref<'upload' | 'update'>('upload');

const uploadError = ref<Error | null>(null);
const updateError = ref<Error | null>(null);

const activeGroupUuid = computed(
  () => props.groupUuid || (route.query.groupId as string) || mediaStore.uploadGroupUuid || '',
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

    if (meta.latitude != null && meta.longitude != null) {
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

const handleUpload = () => {
  if (!(uploadForm.file instanceof File)) return;
  uploadError.value = null;

  const fd = new FormData();
  fd.append('file', uploadForm.file);
  if (uploadForm.description) fd.append('description', uploadForm.description.trim());
  if (uploadForm.taken_at) fd.append('taken_at', new Date(uploadForm.taken_at).toISOString());

  if (uploadForm.latitude != null && uploadForm.longitude != null) {
    fd.append('latitude', uploadForm.latitude.toString());
    fd.append('longitude', uploadForm.longitude.toString());
  }
  if (uploadForm.location_name) {
    fd.append('location_name', uploadForm.location_name.trim());
  }

  if (uploadForm.tagged_user_uuids?.length) {
    fd.append('tagged_user_uuids', JSON.stringify(uploadForm.tagged_user_uuids));
  }

  uploadMutation.mutate(fd);
};

// ------------------------------------------
// 2. UPDATE LOGIC (Supports clearing existing fields)
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

  // Always append fields (including empty strings / []) so users can clear values
  const fd = new FormData();
  fd.append('description', updateForm.description.trim());
  fd.append('taken_at', updateForm.taken_at ? new Date(updateForm.taken_at).toISOString() : '');
  fd.append('location_name', updateForm.location_name.trim());

  if (updateForm.latitude != null && updateForm.longitude != null) {
    fd.append('latitude', updateForm.latitude.toString());
    fd.append('longitude', updateForm.longitude.toString());
  } else {
    fd.append('latitude', '');
    fd.append('longitude', '');
  }

  fd.append('tagged_user_uuids', JSON.stringify(updateForm.tagged_user_uuids || []));

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
  if (current.latitude != null && current.longitude != null) {
    return {
      latitude: current.latitude,
      longitude: current.longitude,
      address: current.location_name || '',
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
