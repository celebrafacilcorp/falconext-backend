/*
  Warnings:

  - You are about to drop the column `adminToken` on the `Usuario` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Usuario_adminToken_key";

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "adminToken";
