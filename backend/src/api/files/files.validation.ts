import { z } from 'zod';
import * as FILE_CONSTANTS from '../../constants/files.constants';
import { ROLES } from '../../constants/roles.constants';

export const privateDocumentDataSchema = z
  .object({
    document_type: z.enum(['ID', 'PASSPORT', 'DRIVING_LICENSE', 'OTHER'], {
      message: 'Invalid document type!, Must be ID, PASSPORT, DRIVING_LICENSE or OTHER',
    }),

    issue_date: z.iso.date('Invalid date format! Use ISO format (YYYY-MM-DD)').optional(),

    expiry_date: z.iso.date('Invalid date format! Use ISO format (YYYY-MM-DD)').optional(),
  })
  .refine(
    (data: { document_type: string; issue_date?: string; expiry_date?: string }) => {
      if (data.issue_date && data.expiry_date) {
        return new Date(data.expiry_date) > new Date(data.issue_date);
      }

      return true;
    },
    {
      message: 'Expiry date must be after the issue date!',
      path: ['expiry_date'],
    },
  );

export const fileIdValidationSchema = z.object({
  fileId: z.string().regex(/^\d+$/, 'File ID must be a valid number!'),
});

export const groupUuidValidationSchema = z.object({
  groupUuid: z.uuid('Invalid group UUID format!'),
});

export const sharingUpdateSchema = z.object({
  accessLevel: z.enum([ROLES.LEADER, ROLES.MEMBER], {
    message: `Access level parameter is required and must be either ${ROLES.LEADER} or ${ROLES.MEMBER}!`,
  }),
});

export const groupDocumentDataSchema = z
  .object({
    document_type: z.enum(
      ['TICKET', 'BOOKING_CONFIRMATION', 'HOTEL_VOUCHER', 'GUEST_REGISTRATION_CARD', 'OTHER'],
      {
        message:
          'Invalid document type!, Must be TICKET, BOOKING_CONFIRMATION, HOTEL_VOUCHER, GUEST_REGISTRATION_CARD, or OTHER',
      },
    ),

    issue_date: z.iso.date('Invalid date format! Use ISO format (YYYY-MM-DD)').optional(),

    expiry_date: z.iso.date('Invalid date format! Use ISO format (YYYY-MM-DD)').optional(),
  })
  .refine(
    (data: { document_type: string; issue_date?: string; expiry_date?: string }) => {
      if (data.issue_date && data.expiry_date) {
        return new Date(data.expiry_date) > new Date(data.issue_date);
      }

      return true;
    },
    {
      message: 'Expiry date must be after the issue date!',
      path: ['expiry_date'],
    },
  );

const parseJsonArray = (val: unknown): unknown => {
  if (typeof val === 'string') {
    if (val.trim() === '') return [];
    try {
      return JSON.parse(val);
    } catch {
      return [];
    }
  }
  return val;
};

const groupMediaFields = {
  description: z.preprocess(
    (val: unknown): unknown => (val === '' ? undefined : val),
    z.string().trim().max(512, 'Description can not be longer than 512 characters!').optional(),
  ),

  taken_at: z.preprocess(
    (val: unknown): unknown => (val === '' ? undefined : val),
    z.iso.datetime('Invalid date format! Use ISO format (YYYY-MM-DDTHH:MM:SS.MSZ)').optional(),
  ),

  location_name: z.preprocess(
    (val: unknown): unknown => (val === '' ? undefined : val),
    z.string().trim().max(255).optional(),
  ),

  latitude: z.preprocess(
    (val: unknown): unknown =>
      val === undefined || val === '' || val === null ? undefined : Number(val),
    z.number().min(-90, 'Latitude must be between -90 and 90').max(90, 'Latitude must be between -90 and 90').optional(),
  ),

  longitude: z.preprocess(
    (val: unknown): unknown =>
      val === undefined || val === '' || val === null ? undefined : Number(val),
    z.number().min(-180, 'Longitude must be between -180 and 180').max(180, 'Longitude must be between -180 and 180').optional(),
  ),

  tagged_user_uuids: z.preprocess(
    parseJsonArray,
    z.array(z.string().uuid('Invalid user UUID format!')).optional(),
  ),
};

const validateCoordinates = (data: { latitude?: number; longitude?: number }): boolean => {
  const hasLat = data.latitude !== undefined;
  const hasLng = data.longitude !== undefined;
  return hasLat === hasLng;
};

export const groupMediaDataSchema = z
  .object(groupMediaFields)
  .refine(
    validateCoordinates,
    {
      message: 'Latitude and longitude must be provided together!',
      path: ['latitude'],
    },
  );

export const groupMediaUpdateSchema = z
  .object(groupMediaFields)
  .partial()
  .refine(
    validateCoordinates,
    {
      message: 'Latitude and longitude must be provided together!',
      path: ['latitude'],
    },
  );

export const groupDocumentUpdateSchema = z
  .object({
    document_type: z
      .enum(
        ['TICKET', 'BOOKING_CONFIRMATION', 'HOTEL_VOUCHER', 'GUEST_REGISTRATION_CARD', 'OTHER'],
        {
          message:
            'Invalid document type!, Must be TICKET, BOOKING_CONFIRMATION, HOTEL_VOUCHER, GUEST_REGISTRATION_CARD, or OTHER',
        },
      )
      .optional(),

    issue_date: z.iso.date('Invalid date format! Use ISO format (YYYY-MM-DD)').optional(),

    expiry_date: z.iso.date('Invalid date format! Use ISO format (YYYY-MM-DD)').optional(),
  })
  .refine(
    (data: { document_type?: string; issue_date?: string; expiry_date?: string }) => {
      if (data.issue_date && data.expiry_date) {
        return new Date(data.expiry_date) > new Date(data.issue_date);
      }

      return true;
    },
    {
      message: 'Expiry date must be after the issue date!',
      path: ['expiry_date'],
    },
  );

export const paginatedQuerySchema = z.object({
  limit: z.coerce
    .number({ message: 'limit parameter must be a number!' })
    .int('limit parameter must be an integer!')
    .min(1, 'limit parameter must be greater than or equal to 1!')
    .max(50, 'limit parameter must be less than or equal to 50!')
    .default(15),

  cursor: z.preprocess(
    (val: unknown) => (val === undefined || val === '' ? undefined : Number(val)),
    z
      .number({ message: 'Invalid cursor format! Cursor must be a valid number!' })
      .int('cursor parameter must be an integer!')
      .min(1, 'cursor parameter must be greater than or equal to 1!')
      .optional(),
  ),

  type: z
    .enum([FILE_CONSTANTS.GROUP_FILE_TYPE.DOCUMENT, FILE_CONSTANTS.GROUP_FILE_TYPE.MEDIA_FILE])
    .optional(),
});

export const documentUrlQuerySchema = z.object({
  type: z
    .enum([FILE_CONSTANTS.URL_TYPE.VIEW, FILE_CONSTANTS.URL_TYPE.DOWNLOAD], {
      message: 'Url type must be either view or download!',
    })
    .default(FILE_CONSTANTS.URL_TYPE.VIEW),
});

export const getAllFilterQuerySchema = z.object({
  documentType: z
    .enum(['ID', 'PASSPORT', 'DRIVING_LICENSE', 'OTHER'], {
      message:
        'Invalid document type!, Must be TICKET, BOOKING_CONFIRMATION, HOTEL_VOUCHER, GUEST_REGISTRATION_CARD, or OTHER',
    })
    .optional(),

  targetUserUuid: z.uuid('Target user query param must be a valid uuid!').optional(),
});
