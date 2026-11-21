<!-- frontend/app/components/media/MemoryCommentSection.vue -->
<template>
  <div :class="LAYOUT_CONFIG.mediaCommentSection">
    <span :class="TYPOGRAPHY_CONFIG.captionUppercase">
      {{ UI_TEXT.media.comments }} ({{ comments.length }})
    </span>

    <!-- COMMENT LIST -->
    <div v-if="isLoading" :class="TYPOGRAPHY_CONFIG.captionMuted">
      {{ UI_TEXT.media.loadingComments }}
    </div>
    <div v-else-if="comments.length === 0" :class="TYPOGRAPHY_CONFIG.captionMuted">
      {{ UI_TEXT.media.noComments }}
    </div>
    <ul v-else :class="LAYOUT_CONFIG.mediaCommentList">
      <li
        v-for="comment in comments"
        :key="comment.comment_id"
        :class="LAYOUT_CONFIG.mediaCommentItem"
      >
        <UAvatar
          :src="comment.users.profile_image_url || undefined"
          :alt="comment.users.username"
          size="header"
          :class="LAYOUT_CONFIG.mediaCommentAvatar"
        />
        <div :class="LAYOUT_CONFIG.mediaCommentBody">
          <div :class="LAYOUT_CONFIG.mediaCommentHeader">
            <span :class="TYPOGRAPHY_CONFIG.captionBoldPrimary">{{ comment.users.username }}</span>
            <span :class="TYPOGRAPHY_CONFIG.captionMuted">
              {{ formatCommentDate(comment.created_at) }}
            </span>
          </div>
          <p :class="LAYOUT_CONFIG.mediaCommentText">{{ comment.content }}</p>
        </div>

        <!-- only the author can delete a comment -->
        <BaseButton
          v-if="isOwnComment(comment)"
          icon="i-heroicons-trash"
          variant="ghostDangerIconButton"
          :tooltip="UI_TEXT.media.deleteComment"
          :disabled="deleteMutation.isLoading.value"
          @click="handleDelete(comment.comment_id)"
        />
      </li>
    </ul>

    <!-- NEW COMMENT -->
    <!-- wrapper element for onClickOutside, the form component itself is not an element -->
    <div ref="commentFormWrapperRef">
      <UForm
        ref="commentFormRef"
        :schema="memoryCommentSchema"
        :state="commentForm"
        :validate-on="[]"
        :class="LAYOUT_CONFIG.mediaCommentForm"
        @submit="handleSubmit"
      >
        <UFormField name="content" class="flex-1">
          <template #default="{ error }">
            <UTextarea
              v-model="commentForm.content"
              :placeholder="UI_TEXT.media.commentPlaceholder"
              :variant="error ? 'glassError' : 'glass'"
              :rows="1"
              :maxrows="4"
              autoresize
              @focus="clearCommentError"
            />
          </template>
        </UFormField>

        <BaseButton
          type="submit"
          icon="i-heroicons-paper-airplane"
          variant="glassIconButtonHighlight"
          :tooltip="UI_TEXT.media.sendComment"
          :loading="createMutation.isLoading.value"
        />
      </UForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, useTemplateRef, watch } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { useCurrentUserQuery } from '~/queries/user.query';
import { useMemoryCommentsQuery } from '~/queries/memories.query';
import {
  useCreateMemoryCommentMutation,
  useDeleteMemoryCommentMutation,
} from '~/queries/memories.mutation';
import { memoryCommentSchema, type MemoryCommentFormState } from '~/utils/schemas/memories.schema';
import type { GroupFile } from '~/types/files.type';
import type { MemoryCommentDto } from '~/types/memories.type';

const props = defineProps<{
  media: GroupFile;
}>();

const { data: currentUser } = useCurrentUserQuery();

const { data: commentsData, isLoading } = useMemoryCommentsQuery(() => props.media.file_id);
const comments = computed<MemoryCommentDto[]>(() => commentsData.value || []);

const commentForm = reactive<MemoryCommentFormState>({
  content: '',
});

const commentFormRef = useTemplateRef('commentFormRef');
const commentFormWrapperRef = useTemplateRef('commentFormWrapperRef');

const clearCommentError = () => commentFormRef.value?.clear();

// an error of the previous image does not move to the next one,
// a half written comment does not move to the next image
watch(
  () => props.media.file_id,
  () => {
    commentForm.content = '';
    clearCommentError();
  },
);

// the error disappears once the user starts typing again
watch(() => commentForm.content, clearCommentError);

// the user changed their mind after an empty send, the error is not needed anymore
onClickOutside(commentFormWrapperRef, clearCommentError);

const createMutation = useCreateMemoryCommentMutation({
  onSuccess: () => {
    commentForm.content = '';
  },
});

const deleteMutation = useDeleteMemoryCommentMutation();

const handleSubmit = () => {
  if (createMutation.isLoading.value) return;

  createMutation.mutate({
    fileId: props.media.file_id,
    content: commentForm.content.trim(),
  });
};

const handleDelete = (commentId: number) => {
  deleteMutation.mutate({ fileId: props.media.file_id, commentId });
};

const isOwnComment = (comment: MemoryCommentDto): boolean =>
  !!currentUser.value?.uuid && comment.users.uuid === currentUser.value.uuid;

const formatCommentDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}. ${pad(d.getMonth() + 1)}. ${pad(d.getDate())}. ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
</script>
