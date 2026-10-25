import { z } from 'zod';
import parsePhoneNumberFromString from 'libphonenumber-js';
import { emailSchema, newPasswordSchema, usernameSchema } from './common.schema';

export const registerSchema = z
  .object({
    email: emailSchema,
    username: usernameSchema,
    phone_number: z
      .string()
      .transform((val: string, ctx: z.RefinementCtx) => {
        if (!val) return val;
        const phoneNumber = parsePhoneNumberFromString(val);

        if (!phoneNumber || !phoneNumber.isValid()) {
          ctx.addIssue({
            code: 'custom',
            message: UI_TEXT.validation.phoneFormat,
          });
          return z.NEVER;
        }
        return phoneNumber.number;
      })
      .optional(),
    password: newPasswordSchema,
    repeatPassword: z.string({ message: UI_TEXT.validation.passwordsMismatch }),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: UI_TEXT.validation.passwordsMismatch,
    path: ['repeatPassword'],
  });

export type RegisterFormState = z.infer<typeof registerSchema>;
