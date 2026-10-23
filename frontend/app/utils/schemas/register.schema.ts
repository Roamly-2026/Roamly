import { UI_TEXT } from '~/locales/en';
import { z } from 'zod';

export const registerSchema = z
  .object({
    email: z.string().email(UI_TEXT.validation.emailFormat),
    username: z.string().min(3, UI_TEXT.validation.registerUsernameMin),
    phone_number: z.string().regex(/^\+\d{1,4}[\s\d]{6,14}$/, UI_TEXT.validation.phoneFormat),
    password: z.string().min(8, UI_TEXT.validation.registerPasswordMin),
    repeatPassword: z.string(),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: UI_TEXT.validation.passwordsMismatch,
    path: ['repeatPassword'],
  });

export type RegisterFormState = z.infer<typeof registerSchema>;
