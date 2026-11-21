import { Prisma, color_mode } from '@prisma/client';

export const userProfileSelect = {
  username: true,
  email: true,
  phone_number: true,
  uuid: true,
  created_at: true,
  updated_at: true,
  profile_image_url: true,
  theme_key: true,
  color_mode: true,
  custom_background_url: true,
} satisfies Prisma.usersSelect;

export type userProfileInfo = Prisma.usersGetPayload<{
  select: {
    username: true;
    email: true;
    phone_number: true;
    uuid: true;
    created_at: true;
    updated_at: true;
    profile_image_url: true;
    theme_key: true;
    color_mode: true;
    custom_background_url: true;
  };
}>;

export type UpdateProfileInput = {
  username?: string;
  email?: string;
  phone_number?: string;
  theme_key?: string;
  color_mode?: color_mode;
  custom_background_url?: string | null;
};
