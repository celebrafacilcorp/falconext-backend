-- AlterTable - Add SUNAT retry tracking columns
ALTER TABLE "Comprobante" ADD COLUMN IF NOT EXISTS "sunatRetriesCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Comprobante" ADD COLUMN IF NOT EXISTS "sunatLastRetryAt" TIMESTAMP(3);
ALTER TABLE "Comprobante" ADD COLUMN IF NOT EXISTS "sunatNextRetryAt" TIMESTAMP(3);
