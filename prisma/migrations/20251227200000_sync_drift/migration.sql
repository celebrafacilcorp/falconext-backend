-- CreateTable
CREATE TABLE "producto_plantillas" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "imagenUrl" TEXT,
    "precioSugerido" DECIMAL(10,2),
    "rubroId" INTEGER NOT NULL,
    "categoria" VARCHAR(100),
    "marca" VARCHAR(100),
    "unidadConteo" TEXT NOT NULL DEFAULT 'NIU',
    "codigo" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "producto_plantillas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "producto_plantillas_codigo_key" ON "producto_plantillas"("codigo");

-- CreateIndex
CREATE INDEX "producto_plantillas_rubroId_idx" ON "producto_plantillas"("rubroId");

-- CreateIndex
CREATE INDEX "producto_plantillas_nombre_idx" ON "producto_plantillas"("nombre");

-- AddForeignKey
ALTER TABLE "producto_plantillas" ADD CONSTRAINT "producto_plantillas_rubroId_fkey" FOREIGN KEY ("rubroId") REFERENCES "Rubro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "opciones_modificadores" ALTER COLUMN "actualizadoEn" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "opciones_modificadores_grupoId_idx" ON "opciones_modificadores"("grupoId");
