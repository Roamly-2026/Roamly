<template>
  <!-- Mobile -->
  <div
    v-if="isMobile"
    class="flex flex-row items-center justify-center gap-2 w-full overflow-x-auto custom-scrollbar pr-2 pb-1"
  >
    <BaseButton
      v-for="item in navItems"
      :key="item.id"
      :icon="item.icon"
      :to="item.to"
      variant="glassIconButton"
      :tooltip="item.label"
      :class="[
        'shrink-0',
        activeTab === item.id
          ? 'text-brand-500 bg-brand-50 dark:bg-brand-900/20'
          : 'text-dark-text',
      ]"
    />
  </div>

  <!-- Desktop -->
  <div v-else class="flex items-center gap-2">
    <BaseButton
      v-for="item in navItems"
      :key="item.id"
      :icon="item.icon"
      variant="glassIconButton"
      :class="activeTab === item.id ? 'text-brand-500' : ''"
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
