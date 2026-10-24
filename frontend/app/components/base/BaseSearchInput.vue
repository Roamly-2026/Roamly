<!-- frontend/app/components/base/BaseSearchInput.vue -->

<template>
  <UInput
    v-model="model"
    icon="i-heroicons-magnifying-glass"
    variant="search"
    :ui="{ leading: 'pl-3' }"
  />
</template>

<script setup lang="ts">
const model = defineModel<string>();
</script>
