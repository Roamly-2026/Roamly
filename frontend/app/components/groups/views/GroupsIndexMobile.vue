<!-- frontend/app/components/groups/views/IndexMobile.vue -->
<template>
  <div :class="LAYOUT_CONFIG.pageWrapper">
    <h1 :class="TYPOGRAPHY_CONFIG.pageTitle">{{ UI_TEXT.groups.heading }}</h1>

    <div :class="LAYOUT_CONFIG.mobileToolbar">
      <BaseSearchInput v-model="searchQuery" :placeholder="UI_TEXT.groups.searchGroups" />

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

    <ClientOnly>
      <div v-if="isLoading && groupsList.length === 0" :class="TYPOGRAPHY_CONFIG.statusLoading">
        {{ UI_TEXT.common.loading }}
      </div>
      <div v-else-if="error" :class="TYPOGRAPHY_CONFIG.statusError">
        {{ UI_TEXT.errors.fetch }}
      </div>

      <div v-else-if="groupsList.length > 0" :class="LAYOUT_CONFIG.cardContent">
        <div v-if="filteredGroups.length > 0" :class="LAYOUT_CONFIG.cardGrid">
          <BaseCard
            v-for="group in filteredGroups"
            :key="group.uuid"
            variant="pointedGlass"
            :class="[LAYOUT_CONFIG.headerRelative, INTERACTION_TOKENS.base]"
            @click="router.push(`/groups/${group.uuid}/members`)"
          >
            <div :class="LAYOUT_CONFIG.cardCornerLeft">
              <BaseButton
                icon="i-heroicons-arrow-right-on-rectangle"
                variant="ghostDangerIconButton"
                :tooltip="UI_TEXT.tooltips.leaveGroup"
                @click.stop="groupsStore.openLeaveModal(group)"
              />
            </div>

            <div
              v-if="group.role.toLowerCase() === 'leader'"
              :class="LAYOUT_CONFIG.cardCornerRight"
            >
              <BaseButton
                icon="i-heroicons-trash"
                variant="ghostDangerIconButton"
                :tooltip="UI_TEXT.tooltips.deleteGroup"
                @click.stop="groupsStore.openDeleteModal(group)"
              />
            </div>

            <div :class="LAYOUT_CONFIG.cardContent">
              <h3 :class="TYPOGRAPHY_CONFIG.cardTitleCenter">{{ group.name }}</h3>
              <p :class="TYPOGRAPHY_CONFIG.bodySmSoft">
                {{ UI_TEXT.groups.yourRoleLabel }}
                <span :class="TYPOGRAPHY_CONFIG.metaHighlightCap">{{ group.role }}</span>
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
        {{ UI_TEXT.groups.noGroups }}
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';
import { useGroupsStore } from '~/stores/groups.modals.store';
import type { GroupOutDto } from '~/types/groups.type';
import type { ApiError } from '~/types/apiError.type';

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
