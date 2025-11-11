-- CreateEnum
CREATE TYPE "EstadoWhatsApp" AS ENUM ('PENDIENTE', 'ENVIADO', 'ENTREGADO', 'LEIDO', 'FALLIDO');

-- CreateTable
CREATE TABLE "WhatsAppEnvio" (
    "id" SERIAL NOT NULL,
    "comprobanteId" INTEGER NOT NULL,
    "empresaId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "numeroDestino" TEXT NOT NULL,
    "estado" "EstadoWhatsApp" NOT NULL DEFAULT 'PENDIENTE',
    "mensajeId" TEXT,
    "error" TEXT,
    "costoUSD" DECIMAL(10,4) NOT NULL DEFAULT 0,
    "incluyeXML" BOOLEAN NOT NULL DEFAULT false,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhatsAppEnvio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WhatsAppEnvio_comprobanteId_idx" ON "WhatsAppEnvio"("comprobanteId");

-- CreateIndex
CREATE INDEX "WhatsAppEnvio_empresaId_idx" ON "WhatsAppEnvio"("empresaId");

-- CreateIndex
CREATE INDEX "WhatsAppEnvio_estado_idx" ON "WhatsAppEnvio"("estado");

-- CreateIndex
CREATE INDEX "WhatsAppEnvio_creadoEn_idx" ON "WhatsAppEnvio"("creadoEn");

-- AddForeignKey
ALTER TABLE "WhatsAppEnvio" ADD CONSTRAINT "WhatsAppEnvio_comprobanteId_fkey" FOREIGN KEY ("comprobanteId") REFERENCES "Comprobante"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhatsAppEnvio" ADD CONSTRAINT "WhatsAppEnvio_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhatsAppEnvio" ADD CONSTRAINT "WhatsAppEnvio_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
