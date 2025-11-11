/*
  Warnings:

  - You are about to drop the column `mtoDescuento` on the `DetalleComprobante` table. All the data in the column will be lost.
  - You are about to drop the column `mtoTotalVenta` on the `DetalleComprobante` table. All the data in the column will be lost.
  - You are about to drop the column `porcentajeDescuento` on the `DetalleComprobante` table. All the data in the column will be lost.
  - Made the column `formaPagoTipo` on table `Comprobante` required. This step will fail if there are existing NULL values in that column.
  - Made the column `formaPagoMoneda` on table `Comprobante` required. This step will fail if there are existing NULL values in that column.
  - Made the column `mtoOperGravadas` on table `Comprobante` required. This step will fail if there are existing NULL values in that column.
  - Made the column `mtoIGV` on table `Comprobante` required. This step will fail if there are existing NULL values in that column.
  - Made the column `valorVenta` on table `Comprobante` required. This step will fail if there are existing NULL values in that column.
  - Made the column `totalImpuestos` on table `Comprobante` required. This step will fail if there are existing NULL values in that column.
  - Made the column `subTotal` on table `Comprobante` required. This step will fail if there are existing NULL values in that column.
  - Made the column `mtoImpVenta` on table `Comprobante` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "TipoEmpresa" AS ENUM ('FORMAL', 'INFORMAL');

-- AlterEnum
ALTER TYPE "EstadoPago" ADD VALUE 'PAGO_PARCIAL';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EstadoSunat" ADD VALUE 'REGISTRADO';
ALTER TYPE "EstadoSunat" ADD VALUE 'NO_APLICA';

-- AlterTable
ALTER TABLE "Comprobante" ADD COLUMN     "descuentoOT" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "descuentoPorcOT" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "estadoOT" TEXT,
ALTER COLUMN "formaPagoTipo" SET NOT NULL,
ALTER COLUMN "formaPagoMoneda" SET NOT NULL,
ALTER COLUMN "mtoOperGravadas" SET NOT NULL,
ALTER COLUMN "mtoIGV" SET NOT NULL,
ALTER COLUMN "valorVenta" SET NOT NULL,
ALTER COLUMN "totalImpuestos" SET NOT NULL,
ALTER COLUMN "subTotal" SET NOT NULL,
ALTER COLUMN "mtoImpVenta" SET NOT NULL,
ALTER COLUMN "saldo" SET DEFAULT 0,
ALTER COLUMN "estadoPago" SET DEFAULT 'PENDIENTE_PAGO';

-- AlterTable
ALTER TABLE "DetalleComprobante" DROP COLUMN "mtoDescuento",
DROP COLUMN "mtoTotalVenta",
DROP COLUMN "porcentajeDescuento";

-- AlterTable
ALTER TABLE "Empresa" ADD COLUMN     "tipoEmpresa" "TipoEmpresa" NOT NULL DEFAULT 'FORMAL';

-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "costo" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "esPrueba" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Pago" (
    "id" SERIAL NOT NULL,
    "comprobanteId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monto" DOUBLE PRECISION NOT NULL,
    "medioPago" TEXT NOT NULL,
    "observacion" TEXT,
    "referencia" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "empresaId" INTEGER,
    "usuarioId" INTEGER,

    CONSTRAINT "Pago_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Pago_comprobanteId_idx" ON "Pago"("comprobanteId");

-- CreateIndex
CREATE INDEX "Pago_usuarioId_idx" ON "Pago"("usuarioId");

-- CreateIndex
CREATE INDEX "Pago_empresaId_idx" ON "Pago"("empresaId");

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_comprobanteId_fkey" FOREIGN KEY ("comprobanteId") REFERENCES "Comprobante"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
