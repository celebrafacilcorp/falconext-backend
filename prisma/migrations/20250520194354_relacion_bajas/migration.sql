-- CreateTable
CREATE TABLE "BajaComprobante" (
    "id" SERIAL NOT NULL,
    "correlativo" TEXT NOT NULL,
    "fecGeneracion" TIMESTAMP(3) NOT NULL,
    "fecComunicacion" TIMESTAMP(3) NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "BajaComprobante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BajaDetalle" (
    "id" SERIAL NOT NULL,
    "bajaComprobanteId" INTEGER NOT NULL,
    "tipoDoc" TEXT NOT NULL,
    "serie" TEXT NOT NULL,
    "correlativoOrigen" TEXT NOT NULL,
    "desMotivoBaja" TEXT NOT NULL,
    "comprobanteId" INTEGER,

    CONSTRAINT "BajaDetalle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BajaComprobante_empresaId_idx" ON "BajaComprobante"("empresaId");

-- CreateIndex
CREATE INDEX "BajaDetalle_bajaComprobanteId_idx" ON "BajaDetalle"("bajaComprobanteId");

-- CreateIndex
CREATE INDEX "BajaDetalle_comprobanteId_idx" ON "BajaDetalle"("comprobanteId");

-- AddForeignKey
ALTER TABLE "BajaComprobante" ADD CONSTRAINT "BajaComprobante_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BajaDetalle" ADD CONSTRAINT "BajaDetalle_comprobanteId_fkey" FOREIGN KEY ("comprobanteId") REFERENCES "Comprobante"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BajaDetalle" ADD CONSTRAINT "BajaDetalle_bajaComprobanteId_fkey" FOREIGN KEY ("bajaComprobanteId") REFERENCES "BajaComprobante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
