/*
  Warnings:

  - You are about to drop the column `codMotivo` on the `Comprobante` table. All the data in the column will be lost.
  - You are about to drop the column `desMotivo` on the `Comprobante` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TipoNota" AS ENUM ('CREDITO', 'DEBITO');

-- AlterEnum
ALTER TYPE "EstadoSunat" ADD VALUE 'ENVIADO';

-- AlterTable
ALTER TABLE "Comprobante" DROP COLUMN "codMotivo",
DROP COLUMN "desMotivo",
ADD COLUMN     "motivoId" INTEGER;

-- CreateTable
CREATE TABLE "MotivoNota" (
    "id" SERIAL NOT NULL,
    "tipo" "TipoNota" NOT NULL,
    "codigo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "MotivoNota_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comprobante" ADD CONSTRAINT "Comprobante_motivoId_fkey" FOREIGN KEY ("motivoId") REFERENCES "MotivoNota"("id") ON DELETE SET NULL ON UPDATE CASCADE;
