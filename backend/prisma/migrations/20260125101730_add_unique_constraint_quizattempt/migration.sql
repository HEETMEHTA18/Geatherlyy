/*
  Warnings:

  - You are about to drop the column `reviewedBy` on the `approval_requests` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[quizId,userId]` on the table `quiz_attempts` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "approval_requests" DROP COLUMN "reviewedBy",
ADD COLUMN     "reviewedById" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "quiz_attempts_quizId_userId_key" ON "quiz_attempts"("quizId", "userId");

-- AddForeignKey
ALTER TABLE "approval_requests" ADD CONSTRAINT "approval_requests_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
