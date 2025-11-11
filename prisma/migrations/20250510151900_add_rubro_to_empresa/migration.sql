-- AlterTable
ALTER TABLE "Empresa" ADD COLUMN     "nombreComercial" TEXT,
ADD COLUMN     "rubroId" INTEGER;

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "telefono" TEXT;

-- CreateTable
CREATE TABLE "Rubro" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Rubro_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rubro_nombre_key" ON "Rubro"("nombre");

-- AddForeignKey
ALTER TABLE "Empresa" ADD CONSTRAINT "Empresa_rubroId_fkey" FOREIGN KEY ("rubroId") REFERENCES "Rubro"("id") ON DELETE SET NULL ON UPDATE CASCADE;
