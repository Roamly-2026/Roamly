import { UI_TEXT } from '~/locales/en';
// frontend/app/utils/schemas/users.validation.ts
import { z } from 'zod';

export const updateUsernameSchema = z.object({
  username: z
    .string(UI_TEXT.validation.validUsername)
    .min(3, UI_TEXT.validation.usernameMin)
    .max(50, UI_TEXT.validation.usernameMax),
});

export const updateEmailSchema = z.object({
  email: z.string(UI_TEXT.validation.validEmail).email(UI_TEXT.validation.emailNotRecognized),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string({ message: UI_TEXT.validation.oldPasswordRequired }),
  newPassword: z
    .string()
    .trim()
    .min(8, UI_TEXT.validation.passwordLength)
    .max(72, UI_TEXT.validation.passwordLength)
    .regex(/[A-Z]/, UI_TEXT.validation.passwordUppercase)
    .regex(/[a-z]/, UI_TEXT.validation.passwordLowercase)
    .regex(/[0-9]/, UI_TEXT.validation.passwordNumber),
});
