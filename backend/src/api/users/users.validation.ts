import parsePhoneNumberFromString from 'libphonenumber-js';
import { z } from 'zod';
import { emailSchema, newPasswordSchema, usernameSchema } from '../shared/common.validation';
import { UpdateProfileInput } from '../../types/users.types';

export const updateProfileScheme: z.ZodType<UpdateProfileInput> = z.object({
  username: usernameSchema.optional(),
  email: emailSchema.optional(),

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

  theme_key: z.string().trim().min(1).max(32).optional(),
  color_mode: z.enum(['LIGHT', 'DARK', 'SYSTEM']).optional(),
  custom_background_url: z.url().max(2048).nullable().optional(),
});

export const changePasswordScheme = z.object({
  oldPassword: z.string({ message: 'Old password is required!' }),
  newPassword: newPasswordSchema,
});
