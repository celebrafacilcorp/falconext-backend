/*
  Warnings:

  - A unique constraint covering the columns `[slugTienda]` on the table `Empresa` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "EstadoPedidoTienda" AS ENUM ('PENDIENTE', 'CONFIRMADO', 'EN_PREPARACION', 'LISTO', 'ENTREGADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "MedioPagoTienda" AS ENUM ('YAPE', 'PLIN', 'EFECTIVO', 'TRANSFERENCIA', 'TARJETA');

-- AlterTable
ALTER TABLE "Empresa" ADD COLUMN     "aceptaEfectivo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "colorPrimario" TEXT DEFAULT '#000000',
ADD COLUMN     "colorSecundario" TEXT DEFAULT '#ffffff',
ADD COLUMN     "descripcionTienda" TEXT,
ADD COLUMN     "facebookUrl" TEXT,
ADD COLUMN     "horarioAtencion" TEXT,
ADD COLUMN     "instagramUrl" TEXT,
ADD COLUMN     "plinNumero" TEXT,
ADD COLUMN     "plinQrUrl" TEXT,
ADD COLUMN     "slugTienda" TEXT,
ADD COLUMN     "tiktokUrl" TEXT,
ADD COLUMN     "whatsappTienda" TEXT,
ADD COLUMN     "yapeNumero" TEXT,
ADD COLUMN     "yapeQrUrl" TEXT;

-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "tieneTienda" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "descripcionLarga" TEXT,
ADD COLUMN     "destacado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "imagenUrl" TEXT,
ADD COLUMN     "imagenesExtra" TEXT,
ADD COLUMN     "publicarEnTienda" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "PedidoTienda" (
    "id" SERIAL NOT NULL,
    "empresaId" INTEGER NOT NULL,
    "clienteNombre" TEXT NOT NULL,
    "clienteTelefono" TEXT NOT NULL,
    "clienteEmail" TEXT,
    "clienteDireccion" TEXT,
    "clienteReferencia" TEXT,
    "subtotal" DECIMAL(65,30) NOT NULL,
    "igv" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "total" DECIMAL(65,30) NOT NULL,
    "estado" "EstadoPedidoTienda" NOT NULL DEFAULT 'PENDIENTE',
    "medioPago" "MedioPagoTienda" NOT NULL DEFAULT 'YAPE',
    "observaciones" TEXT,
    "referenciaTransf" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,
    "fechaConfirmacion" TIMESTAMP(3),
    "usuarioConfirma" INTEGER,
    "comprobanteId" INTEGER,

    CONSTRAINT "PedidoTienda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemPedidoTienda" (
    "id" SERIAL NOT NULL,
    "pedidoId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioUnit" DECIMAL(65,30) NOT NULL,
    "subtotal" DECIMAL(65,30) NOT NULL,
    "observacion" TEXT,

    CONSTRAINT "ItemPedidoTienda_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PedidoTienda_empresaId_estado_idx" ON "PedidoTienda"("empresaId", "estado");

-- CreateIndex
CREATE INDEX "PedidoTienda_creadoEn_idx" ON "PedidoTienda"("creadoEn");

-- CreateIndex
CREATE INDEX "ItemPedidoTienda_pedidoId_idx" ON "ItemPedidoTienda"("pedidoId");

-- CreateIndex
CREATE INDEX "ItemPedidoTienda_productoId_idx" ON "ItemPedidoTienda"("productoId");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_slugTienda_key" ON "Empresa"("slugTienda");

-- CreateIndex
CREATE INDEX "Empresa_slugTienda_idx" ON "Empresa"("slugTienda");

-- CreateIndex
CREATE INDEX "Producto_empresaId_publicarEnTienda_idx" ON "Producto"("empresaId", "publicarEnTienda");

-- AddForeignKey
ALTER TABLE "PedidoTienda" ADD CONSTRAINT "PedidoTienda_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemPedidoTienda" ADD CONSTRAINT "ItemPedidoTienda_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "PedidoTienda"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemPedidoTienda" ADD CONSTRAINT "ItemPedidoTienda_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
