-- AlterTable
ALTER TABLE "DisenoRubro" ADD COLUMN     "vistaProductos" TEXT NOT NULL DEFAULT 'cards';

-- AlterTable
ALTER TABLE "Empresa" ADD COLUMN     "disenoOverride" JSONB;

-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "maxBanners" INTEGER DEFAULT 3,
ADD COLUMN     "maxImagenesProducto" INTEGER DEFAULT 1,
ADD COLUMN     "tieneBanners" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tieneCulqi" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tieneDeliveryGPS" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tieneGaleria" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "marcaId" INTEGER;

-- CreateTable
CREATE TABLE "Marca" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "empresaId" INTEGER,

    CONSTRAINT "Marca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Banner" (
    "id" SERIAL NOT NULL,
    "empresaId" INTEGER NOT NULL,
    "titulo" TEXT,
    "subtitulo" TEXT,
    "imagenUrl" TEXT NOT NULL,
    "linkUrl" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GaleriaProducto" (
    "id" SERIAL NOT NULL,
    "productoId" INTEGER NOT NULL,
    "imagenUrl" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "esPrincipal" BOOLEAN NOT NULL DEFAULT false,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GaleriaProducto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Marca_empresaId_nombre_key" ON "Marca"("empresaId", "nombre");

-- CreateIndex
CREATE INDEX "Banner_empresaId_activo_orden_idx" ON "Banner"("empresaId", "activo", "orden");

-- CreateIndex
CREATE INDEX "GaleriaProducto_productoId_idx" ON "GaleriaProducto"("productoId");

-- CreateIndex
CREATE INDEX "GaleriaProducto_productoId_esPrincipal_idx" ON "GaleriaProducto"("productoId", "esPrincipal");

-- CreateIndex
CREATE INDEX "Producto_marcaId_idx" ON "Producto"("marcaId");

-- AddForeignKey
ALTER TABLE "Marca" ADD CONSTRAINT "Marca_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES "Marca"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Banner" ADD CONSTRAINT "Banner_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GaleriaProducto" ADD CONSTRAINT "GaleriaProducto_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
