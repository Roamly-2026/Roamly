import { UI_TEXT } from '~/locales/en';
// frontend/app/utils/schemas/groups.schema.ts
import { z } from 'zod';

export const createGroupSchema = z.object({
  groupName: z
    .string()
    .trim()
    .min(3, UI_TEXT.validation.groupNameMin)
    .max(64, UI_TEXT.validation.groupNameMax)
    .regex(/^[a-zA-Z0-9\s\-_]+$/, UI_TEXT.validation.groupNameCharacters),
});

export const updateGroupSchema = z.object({
  groupName: z
    .string()
    .trim()
    .min(3, UI_TEXT.validation.groupNameMin)
    .max(64, UI_TEXT.validation.groupNameMax)
    .regex(/^[a-zA-Z0-9\s\-_]+$/, UI_TEXT.validation.groupNameCharacters),
});

export const inviteUserSchema = z.object({
  email: z.string().email(UI_TEXT.validation.inviteEmailFormat),
  role: z.enum(['invitedMember', 'invitedLeader'], {
    message: UI_TEXT.validation.inviteRole,
  }),
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>;
