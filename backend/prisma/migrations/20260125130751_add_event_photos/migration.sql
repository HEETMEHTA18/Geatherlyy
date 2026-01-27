-- AlterTable
ALTER TABLE "clubs" ADD COLUMN     "eventPhotos" TEXT[] DEFAULT ARRAY[]::TEXT[];
