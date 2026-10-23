import { UI_TEXT } from '~/locales/en';
import { z } from 'zod';

// These roles are here only temporarily. In an upcoming feature the logic will be updated.
const ROLES = {
  INVITEDMEMBER: 'invitedMember',
  INVITEDLEADER: 'invitedLeader',
  MEMBER: 'member',
  LEADER: 'leader',
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const dateRefine = (data: { issue_date?: string; expiry_date?: string }) => {
  if (data.issue_date && data.expiry_date) {
    return new Date(data.expiry_date) > new Date(data.issue_date);
  }
  return true;
};

export const privateDocumentSchema = z
  .object({
    file: z
      .instanceof(File, { message: UI_TEXT.validation.fileRequired })
      .refine((f) => f.size <= MAX_FILE_SIZE, UI_TEXT.validation.fileSize),
    document_type: z.enum(['ID', 'PASSPORT', 'DRIVING_LICENSE', 'OTHER'], {
      message: UI_TEXT.validation.documentType,
    }),
    issue_date: z.string().optional(),
    expiry_date: z.string().optional(),
  })
  .refine(dateRefine, {
    message: UI_TEXT.validation.expiryDate,
    path: ['expiry_date'],
  });

export const groupDocumentSchema = z
  .object({
    file: z.instanceof(File, { message: UI_TEXT.validation.fileRequired }),
    document_type: z.enum(
      ['TICKET', 'BOOKING_CONFIRMATION', 'HOTEL_VOUCHER', 'GUEST_REGISTRATION_CARD', 'OTHER'],
      {
        message: UI_TEXT.validation.documentType,
      },
    ),
    issue_date: z.string().optional(),
    expiry_date: z.string().optional(),
  })
  .refine(dateRefine, {
    message: UI_TEXT.validation.expiryDate,
    path: ['expiry_date'],
  });

export const groupMediaSchema = z.object({
  file: z.instanceof(File, { message: UI_TEXT.validation.fileRequired }),
  description: z.string().max(512, UI_TEXT.validation.mediaDescriptionMax).optional(),
});

export const sharingUpdateSchema = z.object({
  accessLevel: z.enum([ROLES.LEADER, ROLES.MEMBER], {
    message: UI_TEXT.validation.accessLevel,
  }),
});
