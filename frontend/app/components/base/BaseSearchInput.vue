<!-- frontend/app/components/base/BaseSearchInput.vue -->

<template>
  <UInput
    v-model="model"
    v-bind="$attrs"
    icon="i-heroicons-magnifying-glass"
    variant="search"
    :ui="{ leading: 'pl-3' }"
  />
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});

const model = defineModel<string>();
</script>
