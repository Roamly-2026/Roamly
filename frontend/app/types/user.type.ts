import type { GroupMembershipRole } from './groups.type';

// frontend/app/types/user.type.ts
import type { BackgroundType, ColorMode, ThemePaletteId } from '~/utils/constants/theme.constants';

export interface UserOutDto {
  theme_palette?: ThemePaletteId;
  background_type?: BackgroundType;
  background_value?: string | null;
  uuid: string;
  username: string;
  email: string;
  phone_number: string;
  created_at: string | Date;
  updated_at: string | Date;
  profile_image_url?: string | null;
  color_mode?: ColorMode;
}

export interface UserInDto {
  username?: string;
  email: string;
  phone_number: string;
  password?: string;
}

export interface UserProfileModalDto {
  userUuid: string;
  username: string;
  email: string;
  system_role: GroupMembershipRole['system_role'] | null;
  custom_role: GroupMembershipRole['custom_role'];
  joinedAt: string;
}

export interface UpdateThemePreferencesDto {
  theme_palette?: ThemePaletteId;
  color_mode?: ColorMode;
  background_type?: BackgroundType;
  background_value?: string | null;
}
