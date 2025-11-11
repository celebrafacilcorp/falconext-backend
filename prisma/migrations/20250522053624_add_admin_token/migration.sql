/*
  Warnings:

  - A unique constraint covering the columns `[adminToken]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "adminToken" TEXT;

-- CreateIndex
CREATE INDEX "Empresa_providerToken_idx" ON "Empresa"("providerToken");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_adminToken_key" ON "Usuario"("adminToken");
