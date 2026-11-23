-- CreateTable
CREATE TABLE "media_comments" (
    "comment_id" SERIAL NOT NULL,
    "file_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "content" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_comments_pkey" PRIMARY KEY ("comment_id")
);

-- CreateTable
CREATE TABLE "media_reactions" (
    "file_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "emoji" VARCHAR(16) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_reactions_pkey" PRIMARY KEY ("file_id","user_id","emoji")
);

-- CreateIndex
CREATE INDEX "media_comments_file_id_created_at_idx" ON "media_comments"("file_id", "created_at");

-- AddForeignKey
ALTER TABLE "media_comments" ADD CONSTRAINT "media_comments_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "media_files"("file_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "media_comments" ADD CONSTRAINT "media_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "media_reactions" ADD CONSTRAINT "media_reactions_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "media_files"("file_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "media_reactions" ADD CONSTRAINT "media_reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;
