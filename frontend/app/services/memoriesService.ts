// frontend/app/services/memoriesService.ts
import { useApi } from '~/composables/useApi';
import type { ApiResponse } from '~/types/api.type';
import type {
  MemoryCommentDto,
  MemoryReactionDto,
  MemoryReactionEmoji,
} from '~/types/memories.type';

export const memoriesService = {
  // --- COMMENTS ---
  getComments(fileId: number): Promise<ApiResponse<MemoryCommentDto[]>> {
    const api = useApi();
    return api(`/memories/${fileId}/comments`);
  },

  createComment(fileId: number, content: string): Promise<ApiResponse<MemoryCommentDto>> {
    const api = useApi();
    return api(`/memories/${fileId}/comments`, {
      method: 'POST',
      body: { content },
    });
  },

  deleteComment(fileId: number, commentId: number): Promise<ApiResponse<null>> {
    const api = useApi();
    return api(`/memories/${fileId}/comments/${commentId}`, { method: 'DELETE' });
  },

  // --- REACTIONS ---
  toggleReaction(
    fileId: number,
    emoji: MemoryReactionEmoji,
  ): Promise<ApiResponse<MemoryReactionDto[]>> {
    const api = useApi();
    return api(`/memories/${fileId}/reactions`, {
      method: 'POST',
      body: { emoji },
    });
  },
};
