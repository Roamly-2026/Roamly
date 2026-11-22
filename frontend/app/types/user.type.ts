// frontend/app/types/user.type.ts
import type { BackgroundType, ThemePaletteId } from '~/utils/constants/theme.constants';

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
  role: string;
  joinedAt: string;
  canViewDocuments: boolean;
}

export interface UpdateThemePreferencesDto {
  theme_palette?: ThemePaletteId;
  background_type?: BackgroundType;
  background_value?: string | null;
}
