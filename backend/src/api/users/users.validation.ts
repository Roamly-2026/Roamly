import parsePhoneNumberFromString from 'libphonenumber-js';
import { z } from 'zod';
import { emailSchema, newPasswordSchema, usernameSchema } from '../shared/common.validation';
import {
  BACKGROUND_TYPES,
  PRESET_BACKGROUNDS,
  THEME_PALETTES,
} from '../../constants/theme.constants';

export const updateProfileScheme = z.object({
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
});

export const changePasswordScheme = z.object({
  oldPassword: z.string({ message: 'Old password is required!' }),
  newPassword: newPasswordSchema,
});

export const updateThemePreferencesSchema = z
  .object({
    theme_palette: z
      .enum([
        THEME_PALETTES.DEFAULT,
        THEME_PALETTES.FOREST,
        THEME_PALETTES.OCEAN,
        THEME_PALETTES.MINIMAL,
      ])
      .optional(),
    // 'custom' is set only by the upload endpoint, so the stored value is always a key we created.
    background_type: z
      .enum([BACKGROUND_TYPES.SYSTEM, BACKGROUND_TYPES.NONE, BACKGROUND_TYPES.PRESET])
      .optional(),
    background_value: z.string().trim().max(2048).nullable().optional(),
  })
  .refine(
    (data: { background_type?: string; background_value?: string | null }) =>
      data.background_value === undefined || data.background_type !== undefined,
    {
      message: 'background_value can only be sent together with background_type!',
      path: ['background_value'],
    },
  )
  .refine(
    (data: { background_type?: string; background_value?: string | null }) => {
      if (data.background_type === BACKGROUND_TYPES.PRESET) {
        return (
          typeof data.background_value === 'string' &&
          (PRESET_BACKGROUNDS as readonly string[]).includes(data.background_value)
        );
      }
      return true;
    },
    {
      message: `Invalid preset background! Allowed values: ${PRESET_BACKGROUNDS.join(', ')}`,
      path: ['background_value'],
    },
  );
