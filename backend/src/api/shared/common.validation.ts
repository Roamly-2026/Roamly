import { z } from 'zod';

export const emailSchema = z
  .email('Invalid email address format!')
  .max(254, 'Email address can not be longer than 254 characters!');

export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters long!')
  .max(64, 'Username can not be longer than 64 characters!');

export const groupNameSchema = z
  .string()
  .trim()
  .min(3, 'Group name must be at least 3 characters long!')
  .max(255, 'Group name can not be longer than 255 characters!')
  .regex(
    /^[a-zA-Z0-9\s\-_]+$/,
    'Group name can only contain letters, numbers, spaces, hyphens and underscores!',
  );

export const newPasswordSchema = z
  .string()
  .trim()
  .min(8, 'Password must be between 8-72 characters long!')
  .max(72, 'Password must be between 8-72 characters long!')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase character!')
  .regex(/[a-z]/, 'Password must contain at least one lowercase character!')
  .regex(/[0-9]/, 'Password must contain at least one number!');
