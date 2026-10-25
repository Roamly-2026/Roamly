<template>
  <UApp :toaster="{ duration: 5000 }">
    <Transition name="fade">
      <LoadingScreen v-if="isAppLoading" />
    </Transition>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useNuxtApp } from '#imports';

const isAppLoading = ref(true);
const nuxtApp = useNuxtApp();

nuxtApp.hook('page:start', () => {
  isAppLoading.value = true;
});

nuxtApp.hook('page:finish', () => {
  isAppLoading.value = false;
});

onMounted(() => {
  isAppLoading.value = false;
});
</script>
