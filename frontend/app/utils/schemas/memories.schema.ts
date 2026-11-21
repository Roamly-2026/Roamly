import { z } from 'zod';

export const memoryCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, UI_TEXT.validation.commentRequired)
    .max(255, UI_TEXT.validation.commentMax),
});

export type MemoryCommentFormState = z.infer<typeof memoryCommentSchema>;
