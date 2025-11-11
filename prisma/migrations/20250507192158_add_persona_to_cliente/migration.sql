-- CreateEnum
CREATE TYPE "PersonaType" AS ENUM ('CLIENTE', 'CLIENTE_PROVEEDOR', 'PROVEEDOR');

-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "persona" "PersonaType" NOT NULL DEFAULT 'CLIENTE';
