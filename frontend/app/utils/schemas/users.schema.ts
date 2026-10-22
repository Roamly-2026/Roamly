import { z } from 'zod';
import { usernameSchema, emailSchema, newPasswordSchema } from './common.schema';
import parsePhoneNumberFromString from 'libphonenumber-js';

export const updateUsernameSchema = z.object({
  username: usernameSchema,
});

export const updateEmailSchema = z.object({
  email: emailSchema,
});

export const updateProfileSchema = z.object({
  username: usernameSchema.optional(),
  email: emailSchema.optional(),
  phone_number: z
    .string()
    .transform((val: string, ctx: z.RefinementCtx) => {
      if (!val) return val;
      const phoneNumber = parsePhoneNumberFromString(val);

      if (!phoneNumber || !phoneNumber.isValid()) {
        ctx.addIssue({
          code: 'custom',
          message: 'Invalid phone number! Regional code must be included (e.g. +40)',
        });
        return z.NEVER;
      }
      return phoneNumber.number;
    })
    .optional(),
});

export const changePasswordSchema = z.object({
  oldPassword: z
    .string({ message: 'Old password is required!' })
    .min(1, 'Old password is required!'),
  newPassword: newPasswordSchema,
});
