/*
  Warnings:

  - The values [ACEPTADO] on the enum `EstadoSunat` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EstadoSunat_new" AS ENUM ('PENDIENTE', 'ENVIADO', 'EMITIDO', 'RECHAZADO');
ALTER TABLE "Comprobante" ALTER COLUMN "estadoEnvioSunat" DROP DEFAULT;
ALTER TABLE "Comprobante" ALTER COLUMN "estadoEnvioSunat" TYPE "EstadoSunat_new" USING ("estadoEnvioSunat"::text::"EstadoSunat_new");
ALTER TYPE "EstadoSunat" RENAME TO "EstadoSunat_old";
ALTER TYPE "EstadoSunat_new" RENAME TO "EstadoSunat";
DROP TYPE "EstadoSunat_old";
ALTER TABLE "Comprobante" ALTER COLUMN "estadoEnvioSunat" SET DEFAULT 'PENDIENTE';
COMMIT;
