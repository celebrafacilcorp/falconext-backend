/*
  Warnings:

  - A unique constraint covering the columns `[codigoSeguimiento]` on the table `PedidoTienda` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `codigoSeguimiento` to the `PedidoTienda` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoEntrega" AS ENUM ('RECOJO', 'ENVIO');

-- AlterTable
ALTER TABLE "Empresa" ADD COLUMN     "aceptaEnvio" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "aceptaRecojo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "costoEnvioFijo" DECIMAL(65,30) DEFAULT 0,
ADD COLUMN     "direccionRecojo" TEXT,
ADD COLUMN     "tiempoPreparacionMin" INTEGER DEFAULT 30;

-- AlterTable
ALTER TABLE "PedidoTienda" ADD COLUMN     "codigoSeguimiento" TEXT NOT NULL,
ADD COLUMN     "costoEnvio" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "notasInternas" TEXT,
ADD COLUMN     "tipoEntrega" "TipoEntrega" NOT NULL DEFAULT 'RECOJO';

-- CreateTable
CREATE TABLE "HistorialEstadoPedido" (
    "id" SERIAL NOT NULL,
    "pedidoId" INTEGER NOT NULL,
    "estadoAnterior" "EstadoPedidoTienda",
    "estadoNuevo" "EstadoPedidoTienda" NOT NULL,
    "usuarioId" INTEGER,
    "notas" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HistorialEstadoPedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PreferenciaTabla" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "empresaId" INTEGER,
    "tabla" TEXT NOT NULL,
    "visibleColumns" JSONB NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PreferenciaTabla_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HistorialEstadoPedido_pedidoId_idx" ON "HistorialEstadoPedido"("pedidoId");

-- CreateIndex
CREATE INDEX "HistorialEstadoPedido_creadoEn_idx" ON "HistorialEstadoPedido"("creadoEn");

-- CreateIndex
CREATE INDEX "PreferenciaTabla_usuarioId_empresaId_tabla_idx" ON "PreferenciaTabla"("usuarioId", "empresaId", "tabla");

-- CreateIndex
CREATE UNIQUE INDEX "PreferenciaTabla_usuarioId_empresaId_tabla_key" ON "PreferenciaTabla"("usuarioId", "empresaId", "tabla");

-- CreateIndex
CREATE UNIQUE INDEX "PedidoTienda_codigoSeguimiento_key" ON "PedidoTienda"("codigoSeguimiento");

-- CreateIndex
CREATE INDEX "PedidoTienda_codigoSeguimiento_idx" ON "PedidoTienda"("codigoSeguimiento");

-- AddForeignKey
ALTER TABLE "HistorialEstadoPedido" ADD CONSTRAINT "HistorialEstadoPedido_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "PedidoTienda"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialEstadoPedido" ADD CONSTRAINT "HistorialEstadoPedido_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreferenciaTabla" ADD CONSTRAINT "PreferenciaTabla_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreferenciaTabla" ADD CONSTRAINT "PreferenciaTabla_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
