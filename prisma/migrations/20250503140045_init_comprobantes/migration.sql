-- CreateEnum
CREATE TYPE "EstadoSunat" AS ENUM ('PENDIENTE', 'ACEPTADO', 'RECHAZADO');

-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "departamento" TEXT,
ADD COLUMN     "distrito" TEXT,
ADD COLUMN     "provincia" TEXT,
ADD COLUMN     "ubigeo" TEXT;

-- AlterTable
ALTER TABLE "Empresa" ADD COLUMN     "departamento" TEXT,
ADD COLUMN     "distrito" TEXT,
ADD COLUMN     "provincia" TEXT,
ADD COLUMN     "ubigeo" TEXT;

-- CreateTable
CREATE TABLE "Comprobante" (
    "id" SERIAL NOT NULL,
    "ublVersion" TEXT NOT NULL DEFAULT '2.1',
    "tipoOperacion" TEXT NOT NULL,
    "tipoDoc" TEXT NOT NULL,
    "serie" TEXT NOT NULL,
    "correlativo" INTEGER NOT NULL,
    "fechaEmision" TIMESTAMP(3) NOT NULL,
    "formaPagoTipo" TEXT NOT NULL,
    "formaPagoMoneda" TEXT NOT NULL,
    "tipoMoneda" TEXT NOT NULL,
    "observaciones" TEXT,
    "mtoOperGravadas" DOUBLE PRECISION NOT NULL,
    "mtoIGV" DOUBLE PRECISION NOT NULL,
    "valorVenta" DOUBLE PRECISION NOT NULL,
    "totalImpuestos" DOUBLE PRECISION NOT NULL,
    "subTotal" DOUBLE PRECISION NOT NULL,
    "mtoImpVenta" DOUBLE PRECISION NOT NULL,
    "estadoEnvioSunat" "EstadoSunat" NOT NULL DEFAULT 'PENDIENTE',
    "medioPago" TEXT,
    "clienteId" INTEGER NOT NULL,
    "empresaId" INTEGER NOT NULL,
    "tipDocAfectado" TEXT,
    "numDocAfectado" TEXT,
    "codMotivo" TEXT,
    "desMotivo" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comprobante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetalleComprobante" (
    "id" SERIAL NOT NULL,
    "comprobanteId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "unidad" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "cantidad" DOUBLE PRECISION NOT NULL,
    "mtoValorUnitario" DOUBLE PRECISION NOT NULL,
    "mtoValorVenta" DOUBLE PRECISION NOT NULL,
    "mtoBaseIgv" DOUBLE PRECISION NOT NULL,
    "porcentajeIgv" DOUBLE PRECISION NOT NULL,
    "igv" DOUBLE PRECISION NOT NULL,
    "tipAfeIgv" INTEGER NOT NULL,
    "totalImpuestos" DOUBLE PRECISION NOT NULL,
    "mtoPrecioUnitario" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DetalleComprobante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Leyenda" (
    "id" SERIAL NOT NULL,
    "comprobanteId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Leyenda_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comprobante" ADD CONSTRAINT "Comprobante_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comprobante" ADD CONSTRAINT "Comprobante_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleComprobante" ADD CONSTRAINT "DetalleComprobante_comprobanteId_fkey" FOREIGN KEY ("comprobanteId") REFERENCES "Comprobante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleComprobante" ADD CONSTRAINT "DetalleComprobante_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leyenda" ADD CONSTRAINT "Leyenda_comprobanteId_fkey" FOREIGN KEY ("comprobanteId") REFERENCES "Comprobante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
