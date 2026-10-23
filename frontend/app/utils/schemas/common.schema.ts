// frontend/app/utils/schemas/common.schema.ts
import { UI_TEXT } from '~/locales/en';
import { z } from 'zod';

export const emailSchema = z
  .email(UI_TEXT.validation.validEmail)
  .max(254, UI_TEXT.validation.emailMax);

export const usernameSchema = z
  .string({ message: UI_TEXT.validation.usernameRequired })
  .min(3, UI_TEXT.validation.usernameMin)
  .max(64, UI_TEXT.validation.usernameMax);

export const newPasswordSchema = z
  .string({ message: UI_TEXT.validation.passwordRequired })
  .trim()
  .min(8, UI_TEXT.validation.passwordLength)
  .max(72, UI_TEXT.validation.passwordLength)
  .regex(/[A-Z]/, UI_TEXT.validation.passwordUppercase)
  .regex(/[a-z]/, UI_TEXT.validation.passwordLowercase)
  .regex(/[0-9]/, UI_TEXT.validation.passwordNumber);

export const groupNameSchema = z
  .string()
  .trim()
  .min(3, UI_TEXT.validation.groupNameMin)
  .max(255, UI_TEXT.validation.groupNameMax)
  .regex(/^[a-zA-Z0-9\s\-_]+$/, UI_TEXT.validation.groupNameCharacters);
