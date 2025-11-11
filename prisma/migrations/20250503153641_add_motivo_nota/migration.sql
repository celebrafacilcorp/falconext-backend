/*
  Warnings:

  - A unique constraint covering the columns `[tipo,codigo]` on the table `MotivoNota` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "MotivoNota_codigo_key";

-- CreateIndex
CREATE UNIQUE INDEX "MotivoNota_tipo_codigo_key" ON "MotivoNota"("tipo", "codigo");
