import { z } from 'zod';
import { ROLES } from '../../constants/roles.constants';
import { emailSchema, groupNameSchema } from '../shared/common.validation';

export const createGroupSchema = z.object({
  groupName: groupNameSchema,
  initialInvites: z
    .array(
      z.object({
        email: emailSchema,
        role: z.enum([ROLES.INVITEDMEMBER, ROLES.INVITEDLEADER], {
          message: `Role must be either "${ROLES.INVITEDMEMBER}" or "${ROLES.INVITEDLEADER}"!`,
        }),
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

export const inviteUsersToYourGroupBodySchema = z.object({
  invitedUserEmail: emailSchema,

  inviteWithRole: z.enum([ROLES.INVITEDLEADER, ROLES.INVITEDMEMBER], {
    message: `Role must be either "${ROLES.INVITEDMEMBER}" or "${ROLES.INVITEDLEADER}"!`,
  }),
});

export const removeUserFromGroupByEmailSchema = z.object({
  groupUuid: z.uuid({ message: 'groupUuid parameter must be valid UUID!' }),

  email: emailSchema,
});

export const updatedGroupSchema = z.object({
  name: groupNameSchema.optional(),
});

export const targetUserEmailSchema = z.object({
  email: emailSchema,
});
