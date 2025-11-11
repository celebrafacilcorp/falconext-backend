/*
  Warnings:

  - You are about to drop the column `tipoOperacion` on the `Comprobante` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comprobante" DROP COLUMN "tipoOperacion",
ADD COLUMN     "tipoOperacionId" INTEGER;

-- CreateTable
CREATE TABLE "TipoOperacion" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "TipoOperacion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TipoOperacion_codigo_key" ON "TipoOperacion"("codigo");

-- AddForeignKey
ALTER TABLE "Comprobante" ADD CONSTRAINT "Comprobante_tipoOperacionId_fkey" FOREIGN KEY ("tipoOperacionId") REFERENCES "TipoOperacion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
