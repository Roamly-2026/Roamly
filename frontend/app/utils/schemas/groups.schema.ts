import { UI_TEXT } from '~/locales/en';
import { z } from 'zod';
import { emailSchema, groupNameSchema } from './common.schema';

const ROLES = {
  INVITEDMEMBER: 'invitedMember',
  INVITEDLEADER: 'invitedLeader',
  MEMBER: 'member',
  LEADER: 'leader',
};

export const createGroupSchema = z.object({
  groupName: groupNameSchema,
  initialInvites: z
    .array(
      z.object({
        email: emailSchema,
        role: z.enum([ROLES.INVITEDMEMBER, ROLES.INVITEDLEADER], {
          message: UI_TEXT.validation.inviteRole,
        }),
      }),
    )
    .max(50, 'You can only invite up to 50 users at once!')
    .optional(),
});

export const updateGroupSchema = z.object({
  groupName: groupNameSchema,
});

export const inviteUserSchema = z.object({
  email: emailSchema,
  role: z.enum([ROLES.INVITEDMEMBER, ROLES.INVITEDLEADER], {
    message: UI_TEXT.validation.inviteRole,
  }),
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>;