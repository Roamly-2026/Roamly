<!-- frontend/app/components/groups/views/InvitesMobile.vue -->
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
      <div v-else-if="invitesList.length > 0" :class="appConfig.layout.cardContent">
        <div :class="appConfig.layout.cardGrid">
          <BaseCard
            v-for="group in invitesList"
            :key="group.uuid"
            variant="interactiveGlass"
            :class="[appConfig.layout.headerRelative, INTERACTION_TOKENS.base]"
            @click="groupsStore.openJoinModal(group)"
          >
            <!-- DECLINE BUTTON -->
            <div :class="appConfig.layout.cardCornerRight">
              <BaseButton
                icon="i-heroicons-x-mark"
                variant="ghostDangerIconButton"
                :tooltip="UI_TEXT.tooltips.declineInvite"
                @click.stop="groupsStore.openDeclineModal(group)"
              />
            </div>

            <!-- CARD CONTENT -->
            <div :class="appConfig.layout.cardContent">
              <h3 :class="appConfig.typography.cardTitleCenter">{{ group.name }}</h3>
              <p :class="[TEXT_SIZES.sm, COLOR_TOKENS.text.primarySoft, FONT_WEIGHTS.medium]">
                {{
                  group.leaders.length > 1
                    ? UI_TEXT.groups.leadersLabel
                    : UI_TEXT.groups.leaderLabel
                }}
                <span :class="FONT_WEIGHTS.bold">{{ group.leaders.join(', ') }}</span>
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
