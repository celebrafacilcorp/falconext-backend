/*
  Warnings:

  - You are about to drop the column `tipoDoc` on the `Cliente` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cliente" DROP CONSTRAINT "Cliente_empresaId_fkey";

-- AlterTable
ALTER TABLE "Cliente" DROP COLUMN "tipoDoc",
ADD COLUMN     "tipoDocumentoId" INTEGER,
ALTER COLUMN "empresaId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "TipoDocumento" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "TipoDocumento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TipoDocumento_codigo_key" ON "TipoDocumento"("codigo");

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_tipoDocumentoId_fkey" FOREIGN KEY ("tipoDocumentoId") REFERENCES "TipoDocumento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;
