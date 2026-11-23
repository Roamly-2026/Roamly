<!-- frontend/app/layouts/default.vue -->
<template>
  <div :class="[appConfig.layout.base, bgClass]">
    <AppHeader />

    <main :class="appConfig.layout.mainDefault">
      <slot />
    </main>

    <footer :class="appConfig.footer.base">
      <div :class="appConfig.footer.text">{{ UI_TEXT.common.copyright }}</div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useAppConfig } from '#imports';
const { preferences } = useTheme();

const isMounted = ref(false);
const route = useRoute();
const appConfig = useAppConfig();

const pageName = computed(() => {
  const name = route.name ? String(route.name).split('-')[0] : 'home';
  return name ?? 'home';
});

onMounted(() => {
  isMounted.value = true;
});

const bgClass = computed(() => {
  if (isMounted.value && preferences.value.background_type !== 'system') {
    return '!bg-transparent';
  }

  switch (pageName.value) {
    default:
      return CONST_BG_HOME;
  }
});
</script>
