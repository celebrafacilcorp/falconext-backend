-- AlterTable
ALTER TABLE "Comprobante" ADD COLUMN     "sunatCdrResponse" JSONB,
ADD COLUMN     "sunatCdrZip" TEXT,
ADD COLUMN     "sunatErrorMsg" TEXT,
ADD COLUMN     "sunatXml" TEXT;
