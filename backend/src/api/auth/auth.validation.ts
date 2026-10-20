import { z } from 'zod';
import parsePhoneNumberFromString from 'libphonenumber-js';
import { emailSchema, newPasswordSchema, usernameSchema } from '../shared/common.validation';

export const registerSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: newPasswordSchema,
  phone_number: z
    .string()
    .transform((val: string, ctx: z.RefinementCtx) => {
      const phoneNumber = parsePhoneNumberFromString(val);

      if (!phoneNumber || !phoneNumber.isValid()) {
        ctx.addIssue({
          code: 'custom',
          message: 'Invalid phone number! Regional code must be included (e.g. +40)',
        });

        return z.NEVER;
      }

      // returns the value with the regional code included (+40...)
      return phoneNumber.number;
    })
    .optional(),
});

export const emailBodySchema = z.object({
  email: emailSchema,
});

export const otpBodySchema = z.object({
  otp: z.string().trim().length(6, 'Otp code must be exactly 6 characters!'),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
});

export const emailPasswordBodySchema = z.object({
  email: emailSchema,
  newPassword: newPasswordSchema,
});
