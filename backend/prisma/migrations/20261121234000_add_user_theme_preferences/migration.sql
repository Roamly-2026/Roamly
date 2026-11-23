-- AlterTable
ALTER TABLE "users"
ADD COLUMN "theme_palette" VARCHAR(32) NOT NULL DEFAULT 'default',
ADD COLUMN "background_type" VARCHAR(16) NOT NULL DEFAULT 'none',
ADD COLUMN "background_value" TEXT;