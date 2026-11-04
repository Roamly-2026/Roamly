import { z } from 'zod';
import { SYSTEM_ROLES } from '../../constants/roles.constants';
import { emailSchema, groupNameSchema } from '../shared/common.validation';

export const createGroupSchema = z.object({
  groupName: groupNameSchema,
  initialInvites: z
    .array(
      z.object({
        email: emailSchema,
        role: z.literal(SYSTEM_ROLES.MEMBER).default(SYSTEM_ROLES.MEMBER),
      }),
    )
    .max(50, 'You can only invite up to 50 users at once!')
    .optional(),
});

export const listGroupsSchema = z.object({
  limit: z.coerce
    .number({ message: 'limit parameter must be a number!' })
    .int('limit parameter must be an integer!')
    .min(1, 'limit parameter must be greater than or equal to 1!')
    .max(50, 'limit parameter must be less than or equal to 50!')
    .default(15),

  cursor: z.preprocess(
    (val: unknown) => (val === '' ? undefined : val),
    z.uuid({ message: 'Invalid cursor format! Cursor must be a valid UUID!' }).optional(),
  ),
});

export const groupUuidValidationSchema = z.object({
  groupUuid: z.uuid({ message: 'groupUuid parameter must be valid UUID!' }),
});

export const inviteUsersToYourGroupBodySchema = z
  .object({
    invitedUserEmail: emailSchema,
    inviteWithRole: z.enum([SYSTEM_ROLES.MEMBER, SYSTEM_ROLES.CUSTOM]),
    customRoleUuid: z.uuid('Invalid custom role UUID!').optional(),
  })
  .refine(
    (data: { inviteWithRole: string; customRoleUuid?: string }): boolean =>
      (data.inviteWithRole === SYSTEM_ROLES.CUSTOM) === (data.customRoleUuid !== undefined),
    {
      message: 'customRoleUuid is required only for Custom invitations!',
    },
  );

export const groupUserUuidSchema = groupUuidValidationSchema.extend({
  userUuid: z.uuid('userUuid parameter must be valid UUID!'),
});

export const updatedGroupSchema = z.object({
  name: groupNameSchema.optional(),
});

export const changeMemberRoleSchema = z
  .object({
    systemRole: z.enum([SYSTEM_ROLES.ADMIN, SYSTEM_ROLES.MEMBER, SYSTEM_ROLES.CUSTOM]),
    customRoleUuid: z.uuid('Invalid custom role UUID!').optional(),
  })
  .refine(
    (data: { systemRole: string; customRoleUuid?: string }): boolean =>
      (data.systemRole === SYSTEM_ROLES.CUSTOM) === (data.customRoleUuid !== undefined),
    {
      message: 'customRoleUuid is required only for Custom members!',
    },
  );

export type ChangeMemberRoleInput = z.infer<typeof changeMemberRoleSchema>;
