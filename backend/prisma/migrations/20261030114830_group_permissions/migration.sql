/*
  Warnings:

  - You are about to drop the column `access_level` on the `file_shares` table. All the data in the column will be lost.
  - You are about to drop the column `role_id` on the `group_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `roles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uuid]` on the table `roles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[role_id,group_id]` on the table `roles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `group_id` to the `roles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `roles` table without a default value. This is not possible if the table is not empty.
  - The required column `uuid` was added to the `roles` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- CreateEnum
CREATE TYPE "SystemRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER', 'CUSTOM');

-- CreateEnum
CREATE TYPE "DocumentAudience" AS ENUM ('GROUP_MEMBERS', 'DOCUMENT_REVIEWERS');

-- DropForeignKey
ALTER TABLE "group_profiles" DROP CONSTRAINT "group_profiles_role_id_fkey";

-- DropIndex
DROP INDEX "roles_type_key";

-- AlterTable
ALTER TABLE "file_shares" DROP COLUMN "access_level",
ADD COLUMN     "audience" "DocumentAudience" NOT NULL DEFAULT 'GROUP_MEMBERS';

-- AlterTable
ALTER TABLE "group_profiles" DROP COLUMN "role_id",
ADD COLUMN     "custom_permissions" JSONB NOT NULL DEFAULT '{"allow":[],"deny":[]}',
ADD COLUMN     "custom_role_id" INTEGER,
ADD COLUMN     "system_role" "SystemRole" NOT NULL DEFAULT 'MEMBER';

-- AlterTable
ALTER TABLE "roles" DROP COLUMN "type",
ADD COLUMN     "group_id" INTEGER NOT NULL,
ADD COLUMN     "name" VARCHAR(255) NOT NULL,
ADD COLUMN     "permissions" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "uuid" UUID NOT NULL;

-- CreateTable
CREATE TABLE "group_invites" (
    "user_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,
    "invited_by" INTEGER,
    "system_role" "SystemRole" NOT NULL DEFAULT 'MEMBER',
    "custom_role_id" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "group_invites_pkey" PRIMARY KEY ("user_id","group_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_uuid_key" ON "roles"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "roles_role_id_group_id_key" ON "roles"("role_id", "group_id");

-- AddForeignKey
ALTER TABLE "group_profiles" ADD CONSTRAINT "group_profiles_custom_role_id_group_id_fkey" FOREIGN KEY ("custom_role_id", "group_id") REFERENCES "roles"("role_id", "group_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "group_invites" ADD CONSTRAINT "group_invites_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("group_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "group_invites" ADD CONSTRAINT "group_invites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "group_invites" ADD CONSTRAINT "group_invites_invited_by_fkey" FOREIGN KEY ("invited_by") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "group_invites" ADD CONSTRAINT "group_invites_custom_role_id_group_id_fkey" FOREIGN KEY ("custom_role_id", "group_id") REFERENCES "roles"("role_id", "group_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("group_id") ON DELETE CASCADE ON UPDATE NO ACTION;

CREATE UNIQUE INDEX "roles_group_name_key"
ON "roles" ("group_id", lower(btrim("name")));

CREATE UNIQUE INDEX "group_profiles_owner_key"
ON "group_profiles" ("group_id")
WHERE "system_role" = 'OWNER';

ALTER TABLE "group_profiles"
ADD CONSTRAINT "group_profiles_custom_role_check"
CHECK (
  ("system_role" = 'CUSTOM' AND "custom_role_id" IS NOT NULL)
  OR
  ("system_role" <> 'CUSTOM' AND "custom_role_id" IS NULL)
);

ALTER TABLE "group_invites"
ADD CONSTRAINT "group_invites_custom_role_check"
CHECK (
  ("system_role" = 'CUSTOM' AND "custom_role_id" IS NOT NULL)
  OR
  ("system_role" = 'MEMBER' AND "custom_role_id" IS NULL)
);