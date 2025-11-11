-- CreateEnum
CREATE TYPE "TipoMovimiento" AS ENUM ('INGRESO', 'SALIDA', 'AJUSTE', 'TRANSFERENCIA');

-- CreateEnum
CREATE TYPE "MetodoCosteo" AS ENUM ('FIFO', 'LIFO', 'PROMEDIO_PONDERADO');

-- CreateEnum
CREATE TYPE "TipoCaja" AS ENUM ('APERTURA', 'CIERRE', 'INGRESO', 'EGRESO');

-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "duracionDias" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN     "tipoFacturacion" TEXT NOT NULL DEFAULT 'MENSUAL';

-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "costoPromedio" DECIMAL(65,30) DEFAULT 0,
ADD COLUMN     "stockMaximo" INTEGER,
ADD COLUMN     "stockMinimo" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "permisos" TEXT;

-- CreateTable
CREATE TABLE "MovimientoKardex" (
    "id" SERIAL NOT NULL,
    "productoId" INTEGER NOT NULL,
    "empresaId" INTEGER NOT NULL,
    "tipoMovimiento" "TipoMovimiento" NOT NULL,
    "concepto" TEXT NOT NULL,
    "comprobanteId" INTEGER,
    "cantidad" INTEGER NOT NULL,
    "stockAnterior" INTEGER NOT NULL,
    "stockActual" INTEGER NOT NULL,
    "costoUnitario" DECIMAL(65,30),
    "valorTotal" DECIMAL(65,30),
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER,
    "observacion" TEXT,
    "lote" TEXT,
    "fechaVencimiento" TIMESTAMP(3),

    CONSTRAINT "MovimientoKardex_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovimientoCaja" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "empresaId" INTEGER NOT NULL,
    "tipoMovimiento" "TipoCaja" NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "montoInicial" DECIMAL(65,30),
    "montoFinal" DECIMAL(65,30),
    "montoEfectivo" DECIMAL(65,30) DEFAULT 0,
    "montoYape" DECIMAL(65,30) DEFAULT 0,
    "montoPlin" DECIMAL(65,30) DEFAULT 0,
    "montoTransferencia" DECIMAL(65,30) DEFAULT 0,
    "montoTarjeta" DECIMAL(65,30) DEFAULT 0,
    "observaciones" TEXT,
    "estado" "EstadoType" NOT NULL DEFAULT 'ACTIVO',
    "fechaCierre" TIMESTAMP(3),
    "totalVentas" DECIMAL(65,30) DEFAULT 0,
    "totalIngresos" DECIMAL(65,30) DEFAULT 0,
    "diferencia" DECIMAL(65,30) DEFAULT 0,

    CONSTRAINT "MovimientoCaja_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MovimientoKardex_productoId_fecha_idx" ON "MovimientoKardex"("productoId", "fecha");

-- CreateIndex
CREATE INDEX "MovimientoKardex_empresaId_fecha_idx" ON "MovimientoKardex"("empresaId", "fecha");

-- CreateIndex
CREATE INDEX "MovimientoKardex_tipoMovimiento_idx" ON "MovimientoKardex"("tipoMovimiento");

-- CreateIndex
CREATE INDEX "MovimientoCaja_usuarioId_fecha_idx" ON "MovimientoCaja"("usuarioId", "fecha");

-- CreateIndex
CREATE INDEX "MovimientoCaja_empresaId_fecha_idx" ON "MovimientoCaja"("empresaId", "fecha");

-- CreateIndex
CREATE INDEX "MovimientoCaja_tipoMovimiento_idx" ON "MovimientoCaja"("tipoMovimiento");

-- AddForeignKey
ALTER TABLE "MovimientoKardex" ADD CONSTRAINT "MovimientoKardex_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoKardex" ADD CONSTRAINT "MovimientoKardex_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoKardex" ADD CONSTRAINT "MovimientoKardex_comprobanteId_fkey" FOREIGN KEY ("comprobanteId") REFERENCES "Comprobante"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoKardex" ADD CONSTRAINT "MovimientoKardex_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoCaja" ADD CONSTRAINT "MovimientoCaja_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoCaja" ADD CONSTRAINT "MovimientoCaja_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
