-- AlterTable
ALTER TABLE "approval_requests" ADD COLUMN     "clubId" INTEGER;

-- AlterTable
ALTER TABLE "clubs" ADD COLUMN     "maxMembers" INTEGER NOT NULL DEFAULT 100;

-- CreateIndex
CREATE INDEX "approval_requests_clubId_idx" ON "approval_requests"("clubId");

-- AddForeignKey
ALTER TABLE "approval_requests" ADD CONSTRAINT "approval_requests_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
