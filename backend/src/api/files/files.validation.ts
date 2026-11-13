import { z } from 'zod';
import * as FILE_CONSTANTS from '../../constants/files.constants';
import { ROLES } from '../../constants/roles.constants';

const parseTagsArray = (val: unknown): unknown => {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed === '') return [];
    if (trimmed.startsWith('[')) {
      try {
        return JSON.parse(trimmed);
      } catch {
        return val;
      }
    }
    return trimmed
      .split(',')
      .map((t: string) => t.trim())
      .filter(Boolean);
  }
  return val;
};

const tagsValidation = z.preprocess(
  parseTagsArray,
  z
    .array(
      z.string().trim().min(1, 'Tag cannot be empty!').max(32, 'Tag cannot exceed 32 characters!'),
    )
    .optional(),
);

export const privateDocumentDataSchema = z
  .object({
    tags: tagsValidation,

    issue_date: z.iso.date('Invalid date format! Use ISO format (YYYY-MM-DD)').optional(),

    expiry_date: z.iso.date('Invalid date format! Use ISO format (YYYY-MM-DD)').optional(),
  })
  .refine(
    (data: { issue_date?: string; expiry_date?: string }) => {
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
    tags: tagsValidation,

    issue_date: z.iso.date('Invalid date format! Use ISO format (YYYY-MM-DD)').optional(),

    expiry_date: z.iso.date('Invalid date format! Use ISO format (YYYY-MM-DD)').optional(),
  })
  .refine(
    (data: { issue_date?: string; expiry_date?: string }) => {
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
      // Return original malformed string so Zod rejects it as non-array
      return val;
    }
  }
  return val;
};

const groupMediaUploadFields = {
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
    z
      .number()
      .min(-90, 'Latitude must be between -90 and 90')
      .max(90, 'Latitude must be between -90 and 90')
      .optional(),
  ),

  longitude: z.preprocess(
    (val: unknown): unknown =>
      val === undefined || val === '' || val === null ? undefined : Number(val),
    z
      .number()
      .min(-180, 'Longitude must be between -180 and 180')
      .max(180, 'Longitude must be between -180 and 180')
      .optional(),
  ),

  tagged_user_uuids: z.preprocess(
    parseJsonArray,
    z.array(z.string().uuid('Invalid user UUID format!')).optional(),
  ),
  tags: tagsValidation,
};

const groupMediaUpdateFields = {
  description: z
    .string()
    .trim()
    .max(512, 'Description can not be longer than 512 characters!')
    .optional(),

  taken_at: z
    .union([
      z.literal(''),
      z.iso.datetime('Invalid date format! Use ISO format (YYYY-MM-DDTHH:MM:SS.MSZ)'),
    ])
    .optional(),

  location_name: z.string().trim().max(255).optional(),

  latitude: z.preprocess(
    (val: unknown): unknown =>
      val === undefined ? undefined : val === '' || val === null ? null : Number(val),
    z
      .number()
      .min(-90, 'Latitude must be between -90 and 90')
      .max(90, 'Latitude must be between -90 and 90')
      .nullable()
      .optional(),
  ),

  longitude: z.preprocess(
    (val: unknown): unknown =>
      val === undefined ? undefined : val === '' || val === null ? null : Number(val),
    z
      .number()
      .min(-180, 'Longitude must be between -180 and 180')
      .max(180, 'Longitude must be between -180 and 180')
      .nullable()
      .optional(),
  ),

  tagged_user_uuids: z.preprocess(
    parseJsonArray,
    z.array(z.string().uuid('Invalid user UUID format!')).optional(),
  ),
  tags: tagsValidation,
};

const validateCoordinates = (data: {
  latitude?: number | null;
  longitude?: number | null;
}): boolean => {
  const hasLat = data.latitude !== undefined && data.latitude !== null;
  const hasLng = data.longitude !== undefined && data.longitude !== null;
  return hasLat === hasLng;
};

export const groupMediaDataSchema = z.object(groupMediaUploadFields).refine(validateCoordinates, {
  message: 'Latitude and longitude must be provided together!',
  path: ['latitude'],
});

export const groupMediaUpdateSchema = z
  .object(groupMediaUpdateFields)
  .partial()
  .refine(validateCoordinates, {
    message: 'Latitude and longitude must be provided together!',
    path: ['latitude'],
  });

export const groupDocumentUpdateSchema = z
  .object({
    tags: tagsValidation,

    issue_date: z.iso.date('Invalid date format! Use ISO format (YYYY-MM-DD)').optional(),

    expiry_date: z.iso.date('Invalid date format! Use ISO format (YYYY-MM-DD)').optional(),
  })
  .refine(
    (data: { issue_date?: string; expiry_date?: string }) => {
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
  tags: tagsValidation,

  targetUserUuid: z.uuid('Target user query param must be a valid uuid!').optional(),
});
