<!-- frontend/app/components/media/MemoryReactionBar.vue -->
<template>
  <!-- click.stop, so a click here does not open the card or the list row -->
  <div :class="LAYOUT_CONFIG.mediaReactionBar" @click.stop>
    <!-- EXISTING REACTIONS -->
    <button
      v-for="reaction in reactions"
      :key="reaction.emoji"
      type="button"
      :class="[LAYOUT_CONFIG.mediaReactionChip, chipClass(reaction.reacted_by_me)]"
      :disabled="toggleMutation.isLoading.value"
      @click="handleToggle(reaction.emoji)"
    >
      <span>{{ reaction.emoji }}</span>
      <span>{{ reaction.count }}</span>
    </button>

    <!-- EMOJI PICKER -->
    <!-- z-index of the modal, so the picker is not hidden behind the lightbox -->
    <UPopover :ui="{ content: Z_INDEX_TOKENS.modal }">
      <button
        type="button"
        :class="[LAYOUT_CONFIG.mediaReactionChip, chipClass(false)]"
        :disabled="toggleMutation.isLoading.value"
        :aria-label="UI_TEXT.media.addReaction"
        :title="UI_TEXT.media.addReaction"
      >
        <UIcon name="i-heroicons-face-smile" :class="LAYOUT_CONFIG.mediaReactionPickerIcon" />
      </button>

      <template #content="{ close }">
        <div :class="LAYOUT_CONFIG.mediaReactionPicker">
          <button
            v-for="emoji in MEMORY_REACTION_EMOJIS"
            :key="emoji"
            type="button"
            :class="[
              LAYOUT_CONFIG.mediaReactionPickerItem,
              isMine(emoji) && LAYOUT_CONFIG.mediaReactionPickerItemActive,
            ]"
            @click="
              handleToggle(emoji);
              close();
            "
          >
            {{ emoji }}
          </button>
        </div>
      </template>
    </UPopover>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useMediaModalsStore } from '~/stores/media.modals.store';
import { useToggleMemoryReactionMutation } from '~/queries/memories.mutation';
import type { GroupFile } from '~/types/files.type';
import type { MemoryReactionDto, MemoryReactionEmoji } from '~/types/memories.type';

const props = withDefaults(
  defineProps<{
    media: GroupFile;
    // white chips for the image overlay of the grid cards
    overlay?: boolean;
  }>(),
  {
    overlay: false,
  },
);

const mediaStore = useMediaModalsStore();

const reactions = computed<MemoryReactionDto[]>(() => mediaStore.getReactions(props.media));

// the file and its reactions before the click, the lightbox can move to another
// image while the request is running, so the file id is saved too
let pending: { fileId: number; previous: MemoryReactionDto[] } | null = null;

const toggleMutation = useToggleMemoryReactionMutation({
  onSuccess: (serverReactions) => {
    if (pending) mediaStore.setReactions(pending.fileId, serverReactions);
  },
  onError: () => {
    if (pending) mediaStore.setReactions(pending.fileId, pending.previous);
  },
});

const handleToggle = (emoji: MemoryReactionEmoji) => {
  // one request at a time, so a failed earlier request can not overwrite a later click
  if (toggleMutation.isLoading.value) return;

  const fileId = props.media.file_id;
  pending = { fileId, previous: reactions.value };

  mediaStore.setReactions(fileId, toggleReactionLocally(reactions.value, emoji));
  toggleMutation.mutate({ fileId, emoji });
};

const isMine = (emoji: MemoryReactionEmoji): boolean =>
  reactions.value.some((reaction) => reaction.emoji === emoji && reaction.reacted_by_me);

const chipClass = (active: boolean): string => {
  if (props.overlay) {
    return active
      ? LAYOUT_CONFIG.mediaReactionChipOverlayActive
      : LAYOUT_CONFIG.mediaReactionChipOverlay;
  }
  return active ? LAYOUT_CONFIG.mediaReactionChipActive : LAYOUT_CONFIG.mediaReactionChipDefault;
};
</script>
