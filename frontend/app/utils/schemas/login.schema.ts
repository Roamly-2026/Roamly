import { UI_TEXT } from '~/locales/en';
import { z } from 'zod';
import { emailSchema } from './common.schema';

export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string({ message: UI_TEXT.validation.passwordRequired })
    .min(1, UI_TEXT.validation.passwordRequired),
});

export type LoginFormState = z.infer<typeof loginSchema>;
