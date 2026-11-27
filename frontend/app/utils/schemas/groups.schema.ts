import { z } from 'zod';
import { SYSTEM_ROLES } from '~/utils/constants/permissions.constants';
import { emailSchema, groupNameSchema } from './common.schema';

export const createGroupSchema = z.object({
  groupName: groupNameSchema,
  initialInvites: z
    .array(
      z.object({
        email: emailSchema,
        role: z.literal(SYSTEM_ROLES.MEMBER).default(SYSTEM_ROLES.MEMBER),
      }),
    )
    .max(50, UI_TEXT.validation.maxInvites)
    .optional(),
});

export const updateGroupSchema = z.object({
  groupName: groupNameSchema,
});

export const inviteUserSchema = z.object({
  email: emailSchema,
  role: z.literal(SYSTEM_ROLES.MEMBER),
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>;
