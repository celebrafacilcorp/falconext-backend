-- AlterTable
ALTER TABLE "Empresa" ADD COLUMN     "empresaUbigeo" TEXT,
ALTER COLUMN "estado" SET DEFAULT 'ACTIVO';

-- CreateTable
CREATE TABLE "Ubigeo" (
    "codigo" TEXT NOT NULL,
    "departamento" TEXT NOT NULL,
    "provincia" TEXT NOT NULL,
    "distrito" TEXT NOT NULL,

    CONSTRAINT "Ubigeo_pkey" PRIMARY KEY ("codigo")
);

-- AddForeignKey
ALTER TABLE "Empresa" ADD CONSTRAINT "Empresa_empresaUbigeo_fkey" FOREIGN KEY ("empresaUbigeo") REFERENCES "Ubigeo"("codigo") ON DELETE SET NULL ON UPDATE CASCADE;
