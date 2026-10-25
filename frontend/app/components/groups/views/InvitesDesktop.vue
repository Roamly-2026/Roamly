<!-- frontend/app/components/groups/views/InvitesDesktop.vue -->
<template>
  <div :class="appConfig.layout.pageWrapper">
    <!-- PAGE TITLE -->
    <h1 :class="appConfig.typography.pageTitle">{{ UI_TEXT.groups.invitesHeading }}</h1>

    <!-- CONTENT SECTION -->
    <ClientOnly>
      <!-- LOADING / ERROR STATES -->
      <div v-if="isLoading && invitesList.length === 0" :class="appConfig.typography.statusLoading">
        {{ UI_TEXT.common.loading }}
      </div>
      <div v-else-if="error" :class="appConfig.typography.statusError">
        {{ UI_TEXT.errors.fetch }}
      </div>

      <!-- INVITES GRID -->
      <div
        v-else-if="invitesList.length > 0"
        :class="`flex flex-col ${SPACING_TOKENS.gap.lg} w-full`"
      >
        <div :class="appConfig.layout.cardGrid">
          <UCard
            v-for="group in invitesList"
            :key="group.uuid"
            variant="interactiveGlass"
            class="relative flex flex-col justify-between cursor-pointer"
            @click="groupsStore.openJoinModal(group)"
          >
            <div class="absolute top-4 right-4 z-10">
              <UTooltip :text="UI_TEXT.tooltips.declineInvite">
                <UButton
                  icon="i-heroicons-x-mark"
                  variant="ghostDangerIconButton"
                  @click.stop="groupsStore.openDeclineModal(group)"
                />
              </UTooltip>
            </div>

            <div :class="appConfig.layout.cardContent">
              <h3 :class="appConfig.typography.cardTitleCenter">{{ group.name }}</h3>
              <p class="text-sm text-center text-dark-text/80 font-medium">
                {{
                  group.leaders.length > 1
                    ? UI_TEXT.groups.leadersLabel
                    : UI_TEXT.groups.leaderLabel
                }}
                <span class="font-bold">{{ group.leaders.join(', ') }}</span>
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

      <!-- EMPTY STATE -->
      <div v-else :class="appConfig.typography.statusLoading">
        {{ UI_TEXT.groups.noInvites }}
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useAppConfig } from '#imports';
import { ref } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';
import { useGroupsStore } from '~/stores/groups.modals.store';
import type { GroupInvitesOutDto } from '~/types/groups.type';
import type { ApiError } from '~/types/apiError.type';

const appConfig = useAppConfig();
const groupsStore = useGroupsStore();

defineProps<{
  invitesList: GroupInvitesOutDto[];
  isLoading: boolean;
  error: ApiError | Error | null | undefined;
  isFetchingNextPage: boolean;
}>();

const emit = defineEmits<{
  (e: 'loadMore'): void;
}>();

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
