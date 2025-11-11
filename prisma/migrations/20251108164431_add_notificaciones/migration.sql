-- AlterTable
ALTER TABLE "Comprobante" ADD COLUMN     "usuarioId" INTEGER;

-- AlterTable
ALTER TABLE "MovimientoCaja" ADD COLUMN     "turno" TEXT;

-- AddForeignKey
ALTER TABLE "Comprobante" ADD CONSTRAINT "Comprobante_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
