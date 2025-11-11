/*
  Warnings:

  - A unique constraint covering the columns `[empresaId,codigo]` on the table `Producto` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Producto_codigo_key";

-- CreateIndex
CREATE UNIQUE INDEX "Producto_empresaId_codigo_key" ON "Producto"("empresaId", "codigo");
