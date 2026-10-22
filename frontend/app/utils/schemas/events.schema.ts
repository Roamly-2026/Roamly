import { UI_TEXT } from '~/locales/en';
import { z } from 'zod';
import { emailSchema } from './common.schema';

export const createEventSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, UI_TEXT.validation.eventTitleMin)
      .max(64, UI_TEXT.validation.eventTitleMax),

    description: z
      .string()
      .trim()
      .max(255, UI_TEXT.validation.eventDescriptionMax)
      .optional(),

    start_time: z
      .string({ message: UI_TEXT.validation.startTimeRequired })
      .min(1, UI_TEXT.validation.startTimeRequired)
      .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date/time!' }),

    end_time: z
      .string()
      .refine((val) => !val || !isNaN(Date.parse(val)), { message: 'Invalid date/time!' })
      .optional(),

    is_private: z.boolean(),

    latitude: z
      .number()
      .min(-90, UI_TEXT.validation.latitude)
      .max(90, UI_TEXT.validation.latitude)
      .nullable()
      .optional(),

    longitude: z
      .number()
      .min(-180, UI_TEXT.validation.longitude)
      .max(180, UI_TEXT.validation.longitude)
      .nullable()
      .optional(),

    address: z.string().trim().max(255).nullable().optional(),

    participant_emails: z
      .array(emailSchema)
      .refine((emails: string[]) => new Set(emails).size === emails.length, {
        message: 'The list contains duplicate email addresses!',
      })
      .optional(),
  })
  .refine(
    (data: { start_time: string; end_time?: string }) => {
      if (data.end_time) {
        return new Date(data.end_time) >= new Date(data.start_time);
      }
      return true;
    },
    {
      message: 'End time must be after the start time, or the exact same!',
      path: ['end_time'],
    },
  )
  .refine(
    (data: { is_private: boolean; participant_emails?: string[] }) => {
      if (!data.is_private && data.participant_emails && data.participant_emails.length > 0) {
        return false;
      }
      return true;
    },
    {
      message:
        'Public events can not have specified participants, every user in the group will be a participant!',
      path: ['participant_emails'],
    },
  )
  .refine(
    (data: { latitude?: number | null; longitude?: number | null; address?: string | null }) => {
      const hasLat = data.latitude !== undefined && data.latitude !== null;
      const hasLng = data.longitude !== undefined && data.longitude !== null;
      const hasAddress =
        data.address !== undefined && data.address !== null && data.address.trim() !== '';

      if (hasLat || hasLng || hasAddress) {
        return hasLat && hasLng && hasAddress;
      }
      return true;
    },
    {
      message: 'Latitude, longitude and address must all be provided together, or all left empty!',
      path: ['address'],
    },
  );

export const updateEventSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, UI_TEXT.validation.eventTitleMin)
      .max(64, UI_TEXT.validation.eventTitleMax)
      .optional(),

    description: z
      .string()
      .trim()
      .max(255, UI_TEXT.validation.eventDescriptionMax)
      .optional(),

    start_time: z
      .string()
      .datetime('Invalid date format! Use ISO format (YYYY-MM-DDTHH:MM:SS.MSZ)')
      .optional(),

    end_time: z
      .string()
      .datetime('Invalid date format! Use ISO format (YYYY-MM-DDTHH:MM:SS.MSZ)')
      .nullable()
      .optional(),

    is_private: z.boolean().optional(),

    latitude: z
      .number()
      .min(-90, UI_TEXT.validation.latitude)
      .max(90, UI_TEXT.validation.latitude)
      .nullable()
      .optional(),

    longitude: z
      .number()
      .min(-180, UI_TEXT.validation.longitude)
      .max(180, UI_TEXT.validation.longitude)
      .nullable()
      .optional(),

    address: z.string().trim().max(255).nullable().optional(),
  })
  .refine(
    (data: { start_time?: string; end_time?: string | null }) => {
      if (data.end_time && data.start_time) {
        return new Date(data.end_time) >= new Date(data.start_time);
      }
      return true;
    },
    {
      message: UI_TEXT.validation.endTime,
      path: ['end_time'],
    },
  )
  .refine(
    (data: { latitude?: number | null; longitude?: number | null; address?: string | null }) => {
      const hasLat = data.latitude !== undefined && data.latitude !== null;
      const hasLng = data.longitude !== undefined && data.longitude !== null;
      const hasAddress =
        data.address !== undefined && data.address !== null && data.address.trim() !== '';

      if (hasLat || hasLng || hasAddress) {
        return hasLat && hasLng && hasAddress;
      }
      return true;
    },
    {
      message: UI_TEXT.validation.location,
      path: ['address'],
    },
  );

export const addNewParticipantsSchema = z.object({
  participant_emails: z
    .array(emailSchema)
    .min(1, 'You need to invite at least 1 participant!')
    .max(45, 'You can not invite more users than the maximum size of the group!')
    .refine((emails: string[]) => new Set(emails).size === emails.length, {
      message: 'The list contains duplicate email addresses!',
    }),
});

export const eventListingFilterSchema = z
  .object({
    start_date: z.string().date('Invalid date format! Use ISO format (YYYY-MM-DD)').optional(),
    end_date: z.string().date('Invalid date format! Use ISO format (YYYY-MM-DD)').optional(),
    title: z.string().trim().max(64, 'Title must be shorter than 64 characters long!').optional(),
  })
  .refine(
    (data: { start_date?: string; end_date?: string }) => {
      if (data.end_date && data.start_date) {
        return new Date(data.end_date) >= new Date(data.start_date);
      }
      return true;
    },
    {
      message: 'End time must be after the start time, or the exact same!',
      path: ['end_date'],
    },
  );
