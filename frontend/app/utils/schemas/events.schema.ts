import { UI_TEXT } from '~/locales/en';
// frontend/app/schemas/events.schema.ts
import { z } from 'zod';

export const createEventSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, UI_TEXT.validation.eventTitleMin)
      .max(64, UI_TEXT.validation.eventTitleMax),
    description: z.string().trim().max(255, UI_TEXT.validation.eventDescriptionMax).optional(),
    start_time: z.string().min(1, UI_TEXT.validation.startTimeRequired),
    end_time: z.string().optional(),
    is_private: z.boolean(),

    // map
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
    address: z.string().max(255).nullable().optional(),
  })
  .refine(
    (data) => {
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
