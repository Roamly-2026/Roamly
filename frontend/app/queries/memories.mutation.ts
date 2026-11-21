// frontend/app/queries/memories.mutation.ts
import { useMutation, useQueryCache } from '@pinia/colada';
import { useToast } from '#imports';
import { memoriesService } from '~/services/memoriesService';
import { getErrorMessage } from '../utils/error.utils';
import type { MemoryReactionDto, MemoryReactionEmoji } from '~/types/memories.type';

interface MutationOptions {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export const useCreateMemoryCommentMutation = (options?: MutationOptions) => {
  const queryCache = useQueryCache();
  const toast = useToast();

  return useMutation({
    mutation: (data: { fileId: number; content: string }) =>
      memoriesService.createComment(data.fileId, data.content),

    // the new comment showing up in the list is the feedback
    onSuccess: (_response, variables) => {
      queryCache.invalidateQueries({ key: ['memory-comments', variables.fileId] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.add({
        title: UI_TEXT.common.error,
        description: getErrorMessage(error),
        class: 'toast-error',
      });
      options?.onError?.(error);
    },
  });
};

export const useDeleteMemoryCommentMutation = (options?: MutationOptions) => {
  const queryCache = useQueryCache();
  const toast = useToast();

  return useMutation({
    mutation: (data: { fileId: number; commentId: number }) =>
      memoriesService.deleteComment(data.fileId, data.commentId),
    onSuccess: (_response, variables) => {
      toast.add({
        title: UI_TEXT.common.success,
        description: UI_TEXT.media.commentDeleted,
        class: 'toast-success',
      });
      queryCache.invalidateQueries({ key: ['memory-comments', variables.fileId] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.add({
        title: UI_TEXT.common.error,
        description: getErrorMessage(error),
        class: 'toast-error',
      });
      options?.onError?.(error);
    },
  });
};

export const useToggleMemoryReactionMutation = (options?: {
  onSuccess?: (reactions: MemoryReactionDto[]) => void;
  onError?: (error: unknown) => void;
}) => {
  const toast = useToast();

  return useMutation({
    mutation: (data: { fileId: number; emoji: MemoryReactionEmoji }) =>
      memoriesService.toggleReaction(data.fileId, data.emoji).then((res) => res.data),
    // the highlighted emoji is the feedback, the list is not refetched
    // because that would generate new image urls
    onSuccess: (reactions) => {
      options?.onSuccess?.(reactions);
    },
    onError: (error) => {
      toast.add({
        title: UI_TEXT.common.error,
        description: getErrorMessage(error),
        class: 'toast-error',
      });
      options?.onError?.(error);
    },
  });
};
