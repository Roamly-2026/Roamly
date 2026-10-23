import { UI_TEXT } from '~/locales/en';
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(UI_TEXT.validation.emailFormat),
  password: z.string().min(1, UI_TEXT.validation.passwordRequired),
});

export type LoginFormState = z.infer<typeof loginSchema>;
