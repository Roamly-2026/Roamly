// frontend/app/utils/schemas/common.schema.ts
import { z } from 'zod';

export const emailSchema = z
  .string({ message: 'Invalid email address format!' })
  .email('Invalid email address format!')
  .max(254, 'Email address can not be longer than 254 characters!');

export const usernameSchema = z
  .string({ message: 'Username is required!' })
  .min(3, 'Username must be at least 3 characters long!')
  .max(64, 'Username can not be longer than 64 characters!');

export const newPasswordSchema = z
  .string({ message: 'Password is required!' })
  .trim()
  .min(8, 'Password must be between 8-72 characters long!')
  .max(72, 'Password must be between 8-72 characters long!')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase character!')
  .regex(/[a-z]/, 'Password must contain at least one lowercase character!')
  .regex(/[0-9]/, 'Password must contain at least one number!');

export const groupNameSchema = z
  .string()
  .trim()
  .min(3, 'Group name must be at least 3 characters long!')
  .max(255, 'Group name can not be longer than 255 characters!')
  .regex(
    /^[a-zA-Z0-9\s\-_]+$/,
    'Group name can only contain letters, numbers, spaces, hyphens and underscores!',
  );
