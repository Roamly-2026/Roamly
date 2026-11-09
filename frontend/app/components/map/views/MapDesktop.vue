<!-- frontend/app/components/map/views/MapDesktop.vue -->
<template>
  <div ref="mapContainer" class="w-full h-full z-0" />
</template>

<script setup lang="ts">
import L from 'leaflet';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const defaultIconPrototype = L.Icon.Default.prototype as L.Icon & { _getIconUrl?: () => string };
delete defaultIconPrototype._getIconUrl;

const props = defineProps<{
  // the id, latitude-, longitude coordinate and title for the event
  locations: {
    id: string | number;
    lat: number;
    lng: number;
    title?: string;
    visibility?: 'private' | 'public';
  }[];
}>();

const emit = defineEmits<{
  (e: 'marker-click', eventId: string | number): void;
  (e: 'map-click', location: { lat: number; lng: number }): void;
}>();

const mapContainer = ref<HTMLElement | null>(null);
let map: L.Map | null = null;
let markersGroup: L.LayerGroup | null = null;

// the view is only set on the first render,
// so refreshing the events does not move the map away from where the user is looking
let isViewInitialized = false;

const toast = useToast();

const getCustomPin = (visibility?: 'private' | 'public') => {
  const colorClass = visibility === 'private' ? 'red' : 'yellow';

  return L.icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${colorClass}.png`,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

// escapes the event title
const escapeHtml = (unsafeText?: string) => {
  if (!unsafeText) return '';
  return unsafeText
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const renderMarkers = () => {
  if (!map) {
    return;
  }

  if (markersGroup) {
    markersGroup.clearLayers();
  } else {
    markersGroup = L.layerGroup().addTo(map);
  }

  // default location if there are no events for the group yet
  // (or they aren't active anymore)
  if (!props.locations || props.locations.length === 0) {
    if (!isViewInitialized) {
      map.setView([44.111979, 24.347248], 13);
      isViewInitialized = true;
    }
    return;
  }

  // map will be zoomed in a way that every location is visible
  const bounds = L.latLngBounds([]);

  props.locations.forEach((loc) => {
    const marker = L.marker([loc.lat, loc.lng], {
      icon: getCustomPin(loc.visibility),
    });

    // small bubble with the event title
    if (loc.title) {
      const typeLabel = loc.visibility === 'private' ? '(Private)' : '(Public)';
      const safeLocationTitle = escapeHtml(loc.title);

      marker.bindTooltip(
        `<div class="text-center">
            <span class="${FONT_WEIGHTS.bold} ${COLOR_TOKENS.text.primary}">${safeLocationTitle}</span><br/>
            <span class="${TEXT_SIZES.xs} ${OPACITY_TOKENS.subtle} ${COLOR_TOKENS.text.primaryMuted}">${typeLabel}</span>
        </div>`,
      );
    }

    marker.on('click', () => {
      emit('marker-click', loc.id);
    });

    markersGroup!.addLayer(marker);
    bounds.extend([loc.lat, loc.lng]);
  });

  if (isViewInitialized) {
    return;
  }

  isViewInitialized = true;

  if (props.locations.length === 1) {
    map.setView([props.locations[0]!.lat, props.locations[0]!.lng], 13);
  } else {
    map.fitBounds(bounds, {
      paddingTopLeft: [50, 110],
      paddingBottomRight: [50, 50],
    });
  }
};

const initMap = () => {
  if (!mapContainer.value) {
    toast.add({
      title: UI_TEXT.common.error,
      description: UI_TEXT.map.initError,
      class: 'toast-error',
    });

    return;
  }

  map = L.map(mapContainer.value);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: UI_TEXT.map.attribution,
  }).addTo(map);

  map.attributionControl.setPrefix(false);

  map.on('click', (e: L.LeafletMouseEvent) => {
    emit('map-click', { lat: e.latlng.lat, lng: e.latlng.lng });
  });

  renderMarkers();
};

onMounted(() => {
  initMap();
});

// if the backend gives back new locations the map will be refreshed automatically
watch(
  () => props.locations,
  () => {
    renderMarkers();
  },
  { deep: true },
);

onUnmounted(() => {
  if (map) {
    map.remove();
  }
});
</script>
