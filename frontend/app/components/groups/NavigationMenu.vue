<template>
  <!-- Mobile -->
  <div
    v-if="isMobile"
    :class="[
      'flex flex-row items-center justify-center w-full overflow-x-auto custom-scrollbar pb-1',
      SPACING_TOKENS.gap.sm,
      SPACING_TOKENS.pr.sm,
    ]"
  >
    <BaseButton
      v-for="item in navItems"
      :key="item.id"
      :icon="item.icon"
      :to="item.to"
      :variant="activeTab === item.id ? 'glassIconButtonBrand' : 'glassIconButton'"
      :tooltip="item.label"
    />
  </div>

  <!-- Desktop -->
  <div v-else :class="`flex items-center ${SPACING_TOKENS.gap.sm}`">
    <BaseButton
      v-for="item in navItems"
      :key="item.id"
      :icon="item.icon"
      :variant="activeTab === item.id ? 'glassIconButtonBrand' : 'glassIconButton'"
      :to="item.to"
      :tooltip="item.label"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  groupUuid?: string;
  activeTab: 'members' | 'events' | 'media' | 'documents';
  isMobile?: boolean;
}>();

// routes
const membersRoute = computed(() =>
  props.groupUuid ? `/groups/${props.groupUuid}/members` : '/groups',
);
const eventsRoute = computed(() =>
  props.groupUuid ? `/events?groupId=${props.groupUuid}` : '/events',
);
const mediaRoute = computed(() =>
  props.groupUuid ? `/files/media?groupId=${props.groupUuid}` : '/files/media',
);
const documentsRoute = computed(() =>
  props.groupUuid ? `/files/documents?groupId=${props.groupUuid}` : '/files/documents',
);
const mapRoute = computed(() => (props.groupUuid ? `/groups/${props.groupUuid}/map` : '/groups'));

const navItems = computed(() => [
  {
    id: 'members',
    icon: 'i-heroicons-users',
    to: membersRoute.value,
    label: UI_TEXT.tooltips.members,
  },
  {
    id: 'events',
    icon: 'i-heroicons-calendar',
    to: eventsRoute.value,
    label: UI_TEXT.tooltips.calendar,
  },
  { id: 'map', icon: 'i-heroicons-map', to: mapRoute.value, label: UI_TEXT.tooltips.groupMap },
  { id: 'media', icon: 'i-heroicons-photo', to: mediaRoute.value, label: UI_TEXT.tooltips.photos },
  {
    id: 'documents',
    icon: 'i-heroicons-document-text',
    to: documentsRoute.value,
    label: UI_TEXT.tooltips.documents,
  },
]);
</script>
