-- Seed para planes de suscripción
-- Insertar planes si no existen

INSERT INTO "Plan" (nombre, descripcion, "limiteUsuarios", costo) 
VALUES 
  ('BASICO', 'Plan básico con funcionalidades esenciales para pequeñas empresas', 3, 45.00),
  ('PRO', 'Plan profesional con funciones avanzadas para empresas en crecimiento', 10, 65.00),
  ('PREMIUM', 'Plan premium con todas las funcionalidades y soporte prioritario', 25, 99.00)
ON CONFLICT (nombre) DO UPDATE SET
  descripcion = EXCLUDED.descripcion,
  "limiteUsuarios" = EXCLUDED."limiteUsuarios",
  costo = EXCLUDED.costo;

-- Verificar los datos insertados
-- SELECT * FROM "Plan" ORDER BY id;