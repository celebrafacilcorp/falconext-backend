-- CreateMigration: sync_existing_drift
-- Esta migración sincroniza el historial de migraciones con cambios que ya existían en la base de datos
-- Los siguientes cambios ya estaban aplicados manualmente:
-- 1. Comprobante.usuarioId (columna y foreign key ya existían)
-- 2. MovimientoCaja.turno (columna ya existía)

-- No se requieren cambios en el esquema ya que los cambios ya estaban aplicados
-- Esta migración marca el estado como sincronizado sin modificar datos

-- Los cambios fueron:
-- ALTER TABLE "Comprobante" ADD COLUMN "usuarioId" INTEGER;
-- ALTER TABLE "Comprobante" ADD CONSTRAINT "Comprobante_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
-- ALTER TABLE "MovimientoCaja" ADD COLUMN "turno" TEXT;

-- Como estos cambios ya existían en la BD, esta migración solo sincroniza el historial