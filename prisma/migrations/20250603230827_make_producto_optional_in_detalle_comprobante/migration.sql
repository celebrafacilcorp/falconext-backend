-- DropForeignKey
ALTER TABLE "DetalleComprobante" DROP CONSTRAINT "DetalleComprobante_productoId_fkey";

-- AlterTable
ALTER TABLE "DetalleComprobante" ALTER COLUMN "productoId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "DetalleComprobante" ADD CONSTRAINT "DetalleComprobante_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE SET NULL ON UPDATE CASCADE;
