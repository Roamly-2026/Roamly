<!-- frontend/app/components/groups/views/InvitesDesktop.vue -->
<template>
  <div :class="LAYOUT_CONFIG.pageWrapper">
    <h1 :class="TYPOGRAPHY_CONFIG.pageTitle">{{ UI_TEXT.groups.invitesHeading }}</h1>

    <ClientOnly>
      <div v-if="isLoading && invitesList.length === 0" :class="TYPOGRAPHY_CONFIG.statusLoading">
        {{ UI_TEXT.common.loading }}
      </div>
      <div v-else-if="error" :class="TYPOGRAPHY_CONFIG.statusError">
        {{ UI_TEXT.errors.fetch }}
      </div>

      <div v-else-if="invitesList.length > 0" :class="LAYOUT_CONFIG.cardContent">
        <div :class="LAYOUT_CONFIG.cardGrid">
          <BaseCard
            v-for="group in invitesList"
            :key="group.uuid"
            variant="interactiveGlass"
            :class="[LAYOUT_CONFIG.headerRelative, INTERACTION_TOKENS.base]"
            @click="groupsStore.openJoinModal(group)"
          >
            <div :class="LAYOUT_CONFIG.cardCornerRight">
              <BaseButton
                icon="i-heroicons-x-mark"
                variant="ghostDangerIconButton"
                :tooltip="UI_TEXT.tooltips.declineInvite"
                @click.stop="groupsStore.openDeclineModal(group)"
              />
            </div>

            <div :class="LAYOUT_CONFIG.cardContent">
              <h3 :class="TYPOGRAPHY_CONFIG.cardTitleCenter">{{ group.name }}</h3>
              <p :class="TYPOGRAPHY_CONFIG.bodySmSoft">
                {{
                  group.leaders.length > 1
                    ? UI_TEXT.groups.leadersLabel
                    : UI_TEXT.groups.leaderLabel
                }}
                <span :class="TYPOGRAPHY_CONFIG.metaHighlight">{{ group.leaders.join(', ') }}</span>
              </p>
              <div :class="LAYOUT_CONFIG.cardFooter">
                <div>
                  <p :class="TYPOGRAPHY_CONFIG.metaLabelSoft">
                    {{ UI_TEXT.groups.createdAtLabel }}
                  </p>
                  <p :class="TYPOGRAPHY_CONFIG.metaTime">{{ group.created_at }}</p>
                </div>
                <div :class="LAYOUT_CONFIG.headerTitleRow">
                  <span :class="TYPOGRAPHY_CONFIG.metaTime">{{ group.current_size }}</span>
                  <UIcon name="i-heroicons-user" :class="TYPOGRAPHY_CONFIG.iconBrandMd" />
                </div>
              </div>
            </div>
          </BaseCard>
        </div>

        <div ref="loadMoreTrigger" :class="LAYOUT_CONFIG.infiniteScrollTrigger">
          <span v-if="isFetchingNextPage" :class="TYPOGRAPHY_CONFIG.bodySmMuted">
            {{ UI_TEXT.groups.loadingGroups }}
          </span>
        </div>
      </div>

      <div v-else :class="TYPOGRAPHY_CONFIG.statusLoading">
        {{ UI_TEXT.groups.noInvites }}
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';
import { useGroupsStore } from '~/stores/groups.modals.store';
import type { GroupInvitesOutDto } from '~/types/groups.type';
import type { ApiError } from '~/types/apiError.type';

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
