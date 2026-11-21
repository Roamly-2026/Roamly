import { z } from 'zod';
import { MEMORY_REACTION_EMOJIS } from '../../constants/memories.constants';

export const memoryIdParamsSchema = z.object({
  fileId: z.string().regex(/^\d+$/, 'File ID must be a valid number!'),
});

export const commentIdParamsSchema = memoryIdParamsSchema.extend({
  commentId: z.string().regex(/^\d+$/, 'Comment ID must be a valid number!'),
});

export const createCommentSchema = z.object({
  content: z
    .string({ message: 'Comment content is required!' })
    .trim()
    .min(1, 'Comment can not be empty!')
    .max(255, 'Comment can not be longer than 255 characters!'),
});

export const toggleReactionSchema = z.object({
  emoji: z.enum(MEMORY_REACTION_EMOJIS, {
    message: `Emoji must be one of: ${MEMORY_REACTION_EMOJIS.join(' ')}`,
  }),
});
