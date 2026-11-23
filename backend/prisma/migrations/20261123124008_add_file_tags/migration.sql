-- AlterTable
ALTER TABLE "documents" ALTER COLUMN "document_type" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "files" ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
