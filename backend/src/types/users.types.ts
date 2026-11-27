import { Prisma } from '@prisma/client';

export const userProfileSelect = {
  username: true,
  email: true,
  phone_number: true,
  uuid: true,
  created_at: true,
  updated_at: true,
  profile_image_url: true,
  theme_palette: true,
  background_type: true,
  background_value: true,
  color_mode: true,
} satisfies Prisma.usersSelect;

export type userProfileInfo = Prisma.usersGetPayload<{
  select: typeof userProfileSelect;
}>;

export type UpdateProfileInput = {
  username?: string;
  email?: string;
  phone_number?: string;
};
