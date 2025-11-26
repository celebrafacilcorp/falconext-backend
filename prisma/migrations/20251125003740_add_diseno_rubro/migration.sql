-- CreateTable
CREATE TABLE "DisenoRubro" (
    "id" SERIAL NOT NULL,
    "rubroId" INTEGER NOT NULL,
    "colorPrimario" TEXT NOT NULL DEFAULT '#6A6CFF',
    "colorSecundario" TEXT NOT NULL DEFAULT '#ffffff',
    "colorAccento" TEXT NOT NULL DEFAULT '#FF6B6B',
    "tipografia" TEXT NOT NULL DEFAULT 'Inter',
    "espaciado" TEXT NOT NULL DEFAULT 'normal',
    "bordeRadius" TEXT NOT NULL DEFAULT 'medium',
    "estiloBoton" TEXT NOT NULL DEFAULT 'rounded',
    "plantillaId" TEXT NOT NULL DEFAULT 'moderna',
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DisenoRubro_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DisenoRubro_rubroId_key" ON "DisenoRubro"("rubroId");

-- CreateIndex
CREATE INDEX "DisenoRubro_rubroId_idx" ON "DisenoRubro"("rubroId");

-- AddForeignKey
ALTER TABLE "DisenoRubro" ADD CONSTRAINT "DisenoRubro_rubroId_fkey" FOREIGN KEY ("rubroId") REFERENCES "Rubro"("id") ON DELETE CASCADE ON UPDATE CASCADE;
