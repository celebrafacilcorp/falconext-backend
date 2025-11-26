-- AlterTable
ALTER TABLE "DisenoRubro" ADD COLUMN     "tiempoEntregaMax" INTEGER DEFAULT 25,
ADD COLUMN     "tiempoEntregaMin" INTEGER DEFAULT 15;

-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "ratingAvg" DECIMAL(65,30) DEFAULT 0,
ADD COLUMN     "ratingCount" INTEGER DEFAULT 0;
