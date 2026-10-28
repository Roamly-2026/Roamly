<!-- frontend/app/components/groups/views/IndexDesktop.vue -->
<template>
  <div :class="appConfig.layout.pageWrapper">
    <!-- PAGE TITLE -->
    <h1 :class="appConfig.typography.pageTitle">{{ UI_TEXT.groups.heading }}</h1>

    <!-- ACTION BUTTONS -->
    <div :class="appConfig.layout.actionGroup">
      <div :class="appConfig.calendar.headerSearchWrapper">
        <BaseSearchInput
          v-model="searchQuery"
          :placeholder="UI_TEXT.events.searchPlaceholder"
        />
      </div>
      <BaseButton
        icon="i-heroicons-plus"
        variant="glassIconButton"
        :tooltip="UI_TEXT.tooltips.createGroup"
        @click="groupsStore.openCreateModal()"
      />
      <BaseButton
        icon="i-heroicons-envelope"
        variant="glassIconButton"
        to="/groups/invites"
        :tooltip="UI_TEXT.tooltips.viewInvites"
      />
    </div>

    <!-- CONTENT SECTION -->
    <ClientOnly>
      <div v-if="isLoading && groupsList.length === 0" :class="appConfig.typography.statusLoading">
        {{ UI_TEXT.common.loading }}
      </div>
      <div v-else-if="error" :class="appConfig.typography.statusError">
        {{ UI_TEXT.errors.fetch }}
      </div>

      <div v-else-if="filteredGroups.length > 0" :class="appConfig.layout.cardContent">
        <div :class="appConfig.layout.cardGrid">
          <BaseCard
            v-for="group in filteredGroups"
            :key="group.uuid"
            variant="pointedGlass"
            :class="[appConfig.layout.headerRelative, INTERACTION_TOKENS.base]"
            @click="router.push(`/groups/${group.uuid}/members`)"
          >
            <div :class="appConfig.layout.cardCornerLeft">
              <BaseButton
                icon="i-heroicons-arrow-right-on-rectangle"
                variant="ghostDangerIconButton"
                :tooltip="UI_TEXT.tooltips.leaveGroup"
                @click.stop="groupsStore.openLeaveModal(group)"
              />
            </div>

            <div
              v-if="group.role.toLowerCase() === 'leader'"
              :class="appConfig.layout.cardCornerRight"
            >
              <BaseButton
                icon="i-heroicons-trash"
                variant="ghostDangerIconButton"
                :tooltip="UI_TEXT.tooltips.deleteGroup"
                @click.stop="groupsStore.openDeleteModal(group)"
              />
            </div>

            <div :class="appConfig.layout.cardContent">
              <h3 :class="appConfig.typography.cardTitleCenter">{{ group.name }}</h3>
              <p :class="[TEXT_SIZES.sm, COLOR_TOKENS.text.primarySoft, FONT_WEIGHTS.medium]">
                {{ UI_TEXT.groups.yourRoleLabel }}
                <span :class="[FONT_WEIGHTS.bold, 'capitalize']">{{ group.role }}</span>
              </p>
              <div :class="appConfig.layout.cardFooter">
                <div>
                  <p :class="OPACITY_TOKENS.subtle">{{ UI_TEXT.groups.createdAtLabel }}</p>
                  <p :class="FONT_WEIGHTS.semibold">{{ group.created_at }}</p>
                </div>
                <div :class="[appConfig.calendar.headerTitleRow, FONT_WEIGHTS.semibold]">
                  <span>{{ group.current_size }}</span>
                  <UIcon
                    name="i-heroicons-user"
                    :class="[SIZE_TOKENS.icon.md, COLOR_TOKENS.text.brandAccent]"
                  />
                </div>
              </div>
            </div>
          </BaseCard>
        </div>

        <!-- INFINITE SCROLL TRIGGER -->
        <div ref="loadMoreTrigger" :class="appConfig.layout.infiniteScrollTrigger">
          <span v-if="isFetchingNextPage" :class="[COLOR_TOKENS.text.primaryMuted, TEXT_SIZES.sm]">
            {{ UI_TEXT.groups.loadingGroups }}
          </span>
        </div>
      </div>

      <!-- if user is part of groups, but the search gave back 0 results -->
      <div
        v-else-if="groupsList.length > 0 && filteredGroups.length === 0"
        :class="appConfig.typography.statusLoading"
      >
        {{ UI_TEXT.groups.searchGroupsNoResult }}
      </div>
      <div v-else :class="appConfig.typography.statusLoading">
        {{ UI_TEXT.groups.noGroups }}
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useAppConfig } from '#imports';
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';
import { useGroupsStore } from '~/stores/groups.modals.store';
import type { GroupOutDto } from '~/types/groups.type';
import type { ApiError } from '~/types/apiError.type';

const appConfig = useAppConfig();
const router = useRouter();
const groupsStore = useGroupsStore();

const searchQuery = defineModel<string>('searchQuery', { default: '' });

const props = defineProps<{
  groupsList: GroupOutDto[];
  isLoading: boolean;
  error: ApiError | Error | null | undefined;
  isFetchingNextPage: boolean;
}>();

const emit = defineEmits<{
  (e: 'loadMore'): void;
}>();

// Local filter logic
const filteredGroups = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return props.groupsList;
  return props.groupsList.filter((group) => group.name.toLowerCase().includes(query));
});

// DOM observer - Infinite scroll
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
