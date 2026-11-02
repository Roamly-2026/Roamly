<!-- frontend/app/pages/groups/[uuid]/map.vue -->
<template>
  <div>
    <ClientOnly>
      <template #fallback>
        <div class="fixed inset-0 flex items-center justify-center z-0">
          <span :class="[OPACITY_TOKENS.subtle, FONT_WEIGHTS.medium]">
            {{ UI_TEXT.common.loading }}
          </span>
        </div>
      </template>
      <div :class="['fixed inset-0 z-0', GLASS_TOKENS.faint]">
        <MapDesktop
          v-if="!isLoading"
          :locations="mapCoordinates"
          @marker-click="handleMarkerClick"
        />

        <div v-else-if="error" class="fixed inset-0 flex items-center justify-center z-0">
          <span :class="TYPOGRAPHY_CONFIG.statusError">
            {{ UI_TEXT.common.error }}
          </span>
        </div>
      </div>
    </ClientOnly>

    <EventPreviewModals />
  </div>
</template>

<script setup lang="ts">
/* --- IMPORTS --- */
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useProtectedPage } from '~/composables/useProtectedPage';
import { useEventsQuery } from '~/queries/events.query';
import { useEventsStore } from '~/stores/events.modals.store';
import { processAndSortEvents } from '~/utils/sort.utils';

/* --- PAGE CONFIGURATION --- */
definePageMeta({ layout: 'general', middleware: ['auth'] });

/* --- COMPOSABLES & STORES --- */
useProtectedPage();
const route = useRoute();
const eventsStore = useEventsStore();

/* --- STATE & COMPUTED --- */
const groupUuid = computed(() => route.params.uuid as string);
// it will give back every event
const selectedDate = ref('ALL');

/* --- API QUERIES --- */
const { data: events, isLoading, error } = useEventsQuery(groupUuid, selectedDate);

/* --- MODAL LOGIC --- */
const handleMarkerClick = (eventId: string | number) => {
  if (!events.value) {
    return;
  }

  const found = events.value.find((e) => e.uuid === eventId);

  if (found) {
    const processedEvents = processAndSortEvents([found]);

    const targetEvent = processedEvents[0];

    if (targetEvent) {
      eventsStore.previewEvent = targetEvent;
      eventsStore.openPreviewModal(targetEvent);
      eventsStore.selectedGroupUuid = groupUuid.value;
    }
  }
};

/* --- MAP LOGIC --- */
const mapCoordinates = computed(() => {
  if (!events.value) {
    return [];
  }

  const now = new Date();

  return events.value
    .filter((event) => {
      const hasLocation = typeof event.latitude === 'number' && typeof event.longitude === 'number';

      if (!hasLocation) {
        return false;
      }

      const endTime = new Date(event.end_time);
      const isActive = endTime >= now;

      return isActive;
    })
    .map((event) => ({
      id: event.uuid,
      lat: Number(event.latitude),
      lng: Number(event.longitude),
      title: event.title || 'Event',
      visibility: event.visibility as 'private' | 'public',
    }));
});
</script>
