/*
  Warnings:

  - You are about to drop the `BajaComprobante` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BajaDetalle` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BajaComprobante" DROP CONSTRAINT "BajaComprobante_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "BajaDetalle" DROP CONSTRAINT "BajaDetalle_bajaComprobanteId_fkey";

-- DropForeignKey
ALTER TABLE "BajaDetalle" DROP CONSTRAINT "BajaDetalle_comprobanteId_fkey";

-- AlterTable
ALTER TABLE "Comprobante" ALTER COLUMN "fechaEmision" SET DATA TYPE TIMESTAMP(6);

-- DropTable
DROP TABLE "BajaComprobante";

-- DropTable
DROP TABLE "BajaDetalle";
