/*
  Warnings:

  - You are about to drop the column `providerActive` on the `Empresa` table. All the data in the column will be lost.
  - You are about to drop the column `providerClientId` on the `Empresa` table. All the data in the column will be lost.
  - You are about to drop the column `providerClientSecret` on the `Empresa` table. All the data in the column will be lost.
  - You are about to drop the column `providerEnv` on the `Empresa` table. All the data in the column will be lost.
  - You are about to drop the column `solPass` on the `Empresa` table. All the data in the column will be lost.
  - You are about to drop the column `solUser` on the `Empresa` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Empresa" DROP COLUMN "providerActive",
DROP COLUMN "providerClientId",
DROP COLUMN "providerClientSecret",
DROP COLUMN "providerEnv",
DROP COLUMN "solPass",
DROP COLUMN "solUser",
ADD COLUMN     "providerId" TEXT;
