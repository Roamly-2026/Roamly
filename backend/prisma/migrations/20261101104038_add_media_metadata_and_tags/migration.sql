-- AlterTable
ALTER TABLE "media_files" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "location_name" VARCHAR(255),
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "taken_at" TIMESTAMP(6),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(512);

-- CreateTable
CREATE TABLE "media_tags" (
    "file_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "media_tags_pkey" PRIMARY KEY ("file_id","user_id")
);

-- AddForeignKey
ALTER TABLE "media_tags" ADD CONSTRAINT "media_tags_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "media_files"("file_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "media_tags" ADD CONSTRAINT "media_tags_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;
