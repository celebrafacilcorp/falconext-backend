-- ============================================================
-- MIGRACIÓN SEGURA V5: Fix Sequence & Quoted Identifiers
-- ============================================================
-- 0. Corregir desincronización de IDs (Error P2002)
-- Esto asegura que el autoincrement no use un ID que ya existe
SELECT setval(pg_get_serial_sequence('"Rubro"', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM "Rubro";

-- 1. Agregar nuevos rubros (Insertar solo si no existen)
INSERT INTO "Rubro" (nombre)
SELECT v.nombre
FROM (VALUES 
  ('Farmacia'),
  ('Botica'),
  ('Bodega y Abarrotes'),
  ('Supermarket'),
  ('Minimarket'),
  ('Ferretería'),
  ('Panadería y Pastelería'),
  ('Librería y Papelería'),
  ('Farmacia Veterinaria')
) AS v(nombre)
WHERE NOT EXISTS (
  SELECT 1 FROM "Rubro" r WHERE r.nombre = v.nombre
);

-- 2. Actualizar nombre de rubro existente 
UPDATE "Rubro" 
SET nombre = 'Restaurante y alimentos'
WHERE nombre = 'Restauración y alimentos'
AND NOT EXISTS (
  SELECT 1 FROM "Rubro" WHERE nombre = 'Restaurante y alimentos'
);
