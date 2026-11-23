-- New users should get the route-based system background by default.
ALTER TABLE "users" ALTER COLUMN "background_type" SET DEFAULT 'system';

-- Rows created by 20261121234000_add_user_theme_preferences got 'none' as a
-- default value, not as a user choice. Move them to the system background.
UPDATE "users" SET "background_type" = 'system' WHERE "background_type" = 'none' AND "background_value" IS NULL;
