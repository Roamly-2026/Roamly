<!-- frontend/app/components/groups/views/IndexDesktop.vue -->
<template>
  <div :class="appConfig.layout.pageWrapper">
    <!-- PAGE TITLE -->
    <h1 :class="appConfig.typography.pageTitle">{{ UI_TEXT.groups.heading }}</h1>

    <!-- ACTION BUTTONS -->
    <div :class="appConfig.layout.actionGroup">
      <UInput
        v-model="searchQuery"
        icon="i-heroicons-magnifying-glass"
        :placeholder="UI_TEXT.events.searchPlaceholder"
        variant="search"
        :ui="{ leading: 'pl-3' }"
        class="w-full max-w-xs"
      />
      <UTooltip :text="UI_TEXT.tooltips.createGroup">
        <UButton
          icon="i-heroicons-plus"
          variant="glassIconButton"
          @click="groupsStore.openCreateModal()"
        />
      </UTooltip>
      <UTooltip :text="UI_TEXT.tooltips.viewInvites">
        <UButton icon="i-heroicons-envelope" variant="glassIconButton" to="/groups/invites" />
      </UTooltip>
    </div>

    <!-- CONTENT SECTION -->
    <ClientOnly>
      <div v-if="isLoading && groupsList.length === 0" :class="appConfig.typography.statusLoading">
        {{ UI_TEXT.common.loading }}
      </div>
      <div v-else-if="error" :class="appConfig.typography.statusError">
        {{ UI_TEXT.errors.fetch }}
      </div>

      <div
        v-else-if="groupsList.length > 0"
        :class="`flex flex-col ${SPACING_TOKENS.gap.lg} w-full`"
      >
        <div :class="appConfig.layout.cardGrid">
          <UCard
            v-for="group in groupsList"
            :key="group.uuid"
            variant="pointedGlass"
            class="relative flex flex-col justify-between cursor-pointer"
            @click="router.push(`/groups/${group.uuid}/members`)"
          >
            <div class="absolute top-4 left-4 z-10">
              <UTooltip v-if="filteredGroups.length > 0" :text="UI_TEXT.tooltips.leaveGroup">
                <UButton
                  icon="i-heroicons-arrow-right-on-rectangle"
                  variant="ghostDangerIconButton"
                  @click.stop="groupsStore.openLeaveModal(group)"
                />
              </UTooltip>
            </div>

            <div v-if="group.role.toLowerCase() === 'leader'" class="absolute top-4 right-4 z-10">
              <UTooltip :text="UI_TEXT.tooltips.deleteGroup">
                <UButton
                  icon="i-heroicons-trash"
                  variant="ghostDangerIconButton"
                  @click.stop="groupsStore.openDeleteModal(group)"
                />
              </UTooltip>
            </div>

            <div :class="appConfig.layout.cardContent">
              <h3 :class="appConfig.typography.cardTitleCenter">{{ group.name }}</h3>
              <p class="text-sm text-center text-dark-text/80 font-medium">
                {{ UI_TEXT.groups.yourRoleLabel }}
                <span class="font-bold capitalize">{{ group.role }}</span>
              </p>
              <div :class="appConfig.layout.cardFooter">
                <div>
                  <p class="opacity-70">{{ UI_TEXT.groups.createdAtLabel }}</p>
                  <p class="font-semibold">{{ group.created_at }}</p>
                </div>
                <div :class="`flex items-center ${SPACING_TOKENS.gap.xs} font-semibold`">
                  <span>{{ group.current_size }}</span>
                  <UIcon name="i-heroicons-user" class="w-5 h-5 text-brand-500" />
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <!-- INFINITE SCROLL TRIGGER -->
        <div ref="loadMoreTrigger" class="h-10 w-full flex items-center justify-center">
          <span v-if="isFetchingNextPage" class="text-dark-text/70 text-sm">
            {{ UI_TEXT.groups.loadingGroups }}
          </span>
        </div>
      </div>

      <div v-else :class="appConfig.typography.statusLoading">
        {{ UI_TEXT.groups.noGroups }}
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
/* --- IMPORTS --- */
import { useAppConfig } from '#imports';
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';
import { useGroupsStore } from '~/stores/groups.modals.store';
import type { GroupOutDto } from '~/types/groups.type';
import type { ApiError } from '~/types/apiError.type';

/* --- COMPOSABLES & STORES --- */
const appConfig = useAppConfig();
const router = useRouter();
const groupsStore = useGroupsStore();

const searchQuery = defineModel<string>('searchQuery', { default: '' });

/* --- PROPS & EMITS --- */
const props = defineProps<{
  // the list of groups to be displayed
  groupsList: GroupOutDto[];
  // indicates whether the initial list of groups is currently being loaded
  isLoading: boolean;
  // the error object returned from a failed fetch attempt, if any
  error: ApiError | Error | null | undefined;
  // indicates whether the next page of groups is currently being fetched
  isFetchingNextPage: boolean;
}>();

const emit = defineEmits<{
  // triggers when the user requests to load the next set of groups (e.g., scrolling to the bottom)
  (e: 'loadMore'): void;
}>();

// Local filter logic
const filteredGroups = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return props.groupsList;
  return props.groupsList.filter((group) => group.name.toLowerCase().includes(query));
});

/* --- DOM OBSERVERS (INFINITE SCROLL) --- */
const loadMoreTrigger = ref<HTMLElement | null>(null);
useIntersectionObserver(
  loadMoreTrigger,
  (entries) => {
    if (entries[0]?.isIntersecting) {
      emit('loadMore');
    }
  },
  { rootMargin: '100px' },
);
</script>
