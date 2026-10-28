<!-- frontend/app/components/events/map/EventMapSelector -->
<template>
  <div :class="LAYOUT_CONFIG.mapSelectorWrapper">
    <div ref="mapContainer" :class="LAYOUT_CONFIG.mapCanvas"></div>

    <div :class="LAYOUT_CONFIG.mapSelectorFooter">
      <div :class="CALENDAR_CONFIG.participantCardInfo">
        <p :class="[TEXT_SIZES.sm, FONT_WEIGHTS.bold, COLOR_TOKENS.text.primary]">
          {{ UI_TEXT.map.selectedLocation }}
        </p>
        <p :class="[TEXT_SIZES.sm, COLOR_TOKENS.text.primarySoft, SPACING_TOKENS.mt.xs]">
          <span v-if="isLoadingAddress" :class="[OPACITY_TOKENS.subtle, 'animate-pulse']">{{
            UI_TEXT.map.loadingAddress
          }}</span>
          <span v-else-if="currentSelection">{{ currentSelection.address }}</span>
          <span v-else :class="OPACITY_TOKENS.subtle">{{ UI_TEXT.map.selectLocation }}</span>
        </p>
      </div>
      <BaseButton
        :label="UI_TEXT.map.confirmLocation"
        :disabled="!currentSelection"
        variant="actionOkButton"
        @click="confirmSelection"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import L from 'leaflet';
import 'leaflet-control-geocoder';

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const props = defineProps<{
  // the starting location to display on the map, including coordinates and a formatted address
  initialLocation?: { latitude: number; longitude: number; address: string } | null;
  // indicates whether the map modal or container is currently open (used to resize the map correctly)
  isOpen?: boolean;
}>();

const defaultIconPrototype = L.Icon.Default.prototype as L.Icon & { _getIconUrl?: () => string };
delete defaultIconPrototype._getIconUrl;

L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

interface GeocodeResult {
  name: string;
  center: { lat: number; lng: number };
}

interface MarkGeocodeEvent {
  geocode: GeocodeResult;
}

const emit = defineEmits<{
  // triggers when the user confirms their selected location on the map
  // [emit value]: location: { latitude: number; longitude: number; address: string }
  (e: 'confirm-location', location: { latitude: number; longitude: number; address: string }): void;
}>();

const mapContainer = ref<HTMLElement | null>(null);
let map: L.Map | null = null;
let marker: L.Marker | null = null;

// states for the location confirm button
const currentSelection = ref<{ latitude: number; longitude: number; address: string } | null>(null);
const isLoadingAddress = ref(false);

const initmap = () => {
  if (!mapContainer.value) {
    return;
  }

  // default location the map is showing
  const initialLat = props.initialLocation?.latitude ?? 44.111979;
  const initialLng = props.initialLocation?.longitude ?? 24.347248;
  const initialZoom = props.initialLocation ? 17 : 13;

  map = L.map(mapContainer.value).setView([initialLat, initialLng], initialZoom);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: UI_TEXT.map.attribution,
  }).addTo(map);

  map.attributionControl.setPrefix(false);

  // if there is an initial location, place the marker immediately
  if (props.initialLocation) {
    updateMarker(initialLat, initialLng);
    currentSelection.value = { ...props.initialLocation };
  }

  // search bar with Geocoder plugin
  const LControl = L.Control as unknown as {
    Geocoder: { nominatim: () => unknown };
    geocoder: (
      options: Record<string, unknown>,
    ) => L.Control & { on: (event: string, fn: (e: MarkGeocodeEvent) => void) => L.Control };
  };

  const geocoder = LControl.Geocoder.nominatim();

  LControl.geocoder({
    geocoder,
    defaultMarkGeocode: false,
    placeholder: UI_TEXT.map.searchAddress,
  })
    .on('markgeocode', (e: MarkGeocodeEvent) => {
      const lat = e.geocode.center.lat;
      const lng = e.geocode.center.lng;
      const address = e.geocode.name;

      map?.setView([lat, lng], 17);
      updateMarker(lat, lng);

      currentSelection.value = { latitude: lat, longitude: lng, address };
    })
    .addTo(map);

  // clicking event on the map (reverse geocode)
  map.on('click', async (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;

    // instant marker placement
    updateMarker(lat, lng);
    currentSelection.value = {
      latitude: lat,
      longitude: lng,
      address: UI_TEXT.map.location(lat, lng),
    };
    isLoadingAddress.value = true;

    // fetch for the reverse geocoding
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      );

      const data = await response.json();

      if (data && data.display_name && currentSelection.value) {
        currentSelection.value.address = data.display_name;
      }
    } catch (error) {
      console.error('Failed to fetch address:', error);
    } finally {
      isLoadingAddress.value = false;
    }
  });

  setTimeout(() => {
    map?.invalidateSize();
  }, 250);
};

const updateMarker = (lat: number, lng: number) => {
  if (!map) {
    return;
  }

  if (marker) {
    marker.setLatLng([lat, lng]);
  } else {
    marker = L.marker([lat, lng]).addTo(map);
  }
};

// location confrm button
const confirmSelection = () => {
  if (currentSelection.value) {
    emit('confirm-location', currentSelection.value);
  }
};

watch(
  () => props.isOpen,
  async (isOpen) => {
    if (isOpen && map) {
      await nextTick();
      // Wait for Nuxt UI modal transition (usually 200-250ms) before invalidating
      setTimeout(() => {
        map?.invalidateSize();
      }, 250);
    }
  },
);

onMounted(() => {
  initmap();
});

onUnmounted(() => {
  if (map) {
    map.remove();
  }
});
</script>
