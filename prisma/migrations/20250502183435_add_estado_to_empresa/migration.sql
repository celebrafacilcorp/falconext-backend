-- CreateEnum
CREATE TYPE "EstadoType" AS ENUM ('ACTIVO', 'INACTIVO');

-- AlterTable
ALTER TABLE "Empresa" ADD COLUMN     "estado" "EstadoType" NOT NULL DEFAULT 'ACTIVO';
