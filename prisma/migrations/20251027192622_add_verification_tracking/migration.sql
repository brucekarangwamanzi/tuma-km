-- AlterTable
ALTER TABLE "verification_requests" ADD COLUMN "reviewedAt" DATETIME;
ALTER TABLE "verification_requests" ADD COLUMN "reviewedBy" TEXT;
