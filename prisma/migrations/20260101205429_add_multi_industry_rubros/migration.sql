-- ============================================================
-- MIGRACIÓN SEGURA: Agregar Rubros Multi-Industria
-- ============================================================
-- Esta migración es 100% segura para producción:
-- - No elimina datos existentes
-- - Usa INSERT ... ON CONFLICT DO NOTHING para evitar duplicados
-- - Actualiza solo si el registro antiguo existe
-- ============================================================

-- 1. Agregar nuevos rubros específicos (solo si no existen)
INSERT INTO rubros (nombre) 
VALUES 
  ('Farmacia'),
  ('Botica'),
  ('Bodega y Abarrotes'),
  ('Supermarket'),
  ('Minimarket'),
  ('Ferretería'),
  ('Panadería y Pastelería'),
  ('Librería y Papelería'),
  ('Farmacia Veterinaria')
ON CONFLICT (nombre) DO NOTHING;

-- 2. Actualizar nombre de rubro existente (solo si existe)
-- De "Restauración y alimentos" a "Restaurante y alimentos"
UPDATE rubros 
SET nombre = 'Restaurante y alimentos'
WHERE nombre = 'Restauración y alimentos';

-- ============================================================
-- NOTAS:
-- - Esta migración es idempotente (se puede ejecutar múltiples veces sin problemas)
-- - No afecta empresas existentes ni sus datos
-- - Los rubros antiguos permanecen sin cambios
-- - La detección automática funciona sin configuración adicional
-- ============================================================
