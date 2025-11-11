import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed...');

  // Crear planes
  const planes = [
    {
      nombre: 'PRUEBA',
      descripcion: 'Plan de prueba - 15 días sin costo',
      costo: 0,
      esPrueba: true,
      limiteUsuarios: 5,
    },
    {
      nombre: 'INFORMAL',
      descripcion: 'Plan para empresas informales',
      costo: 20,
      esPrueba: false,
      limiteUsuarios: 3,
    },
    {
      nombre: 'FORMAL',
      descripcion: 'Plan básico para empresas formales',
      costo: 45,
      esPrueba: false,
      limiteUsuarios: 5,
    },
    {
      nombre: 'PROFESIONAL',
      descripcion: 'Plan profesional con más funcionalidades',
      costo: 65,
      esPrueba: false,
      limiteUsuarios: 10,
    },
    {
      nombre: 'EMPRESARIAL',
      descripcion: 'Plan empresarial con todas las funcionalidades',
      costo: 99,
      esPrueba: false,
      limiteUsuarios: 50,
    },
  ];

  for (const plan of planes) {
    const existente = await prisma.plan.findUnique({
      where: { nombre: plan.nombre },
    });
    if (!existente) {
      const created = await prisma.plan.create({
        data: plan,
      });
      console.log(`✓ Plan creado: ${created.nombre} - S/ ${created.costo}`);
    } else {
      console.log(`✓ Plan ya existe: ${plan.nombre}`);
    }
  }

  // Crear usuario admin
  const saltRounds = 10;
  const plainPassword = 'Admin123!';
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

  const usuarioExistente = await prisma.usuario.findUnique({
    where: { email: 'admin@nephi.test' },
  });

  if (!usuarioExistente) {
    const usuario = await prisma.usuario.create({
      data: {
        nombre: 'Administrador Sistema',
        dni: '00000000',
        celular: '999999999',
        email: 'admin@nephi.test',
        password: hashedPassword,
        rol: 'ADMIN_SISTEMA',
        estado: 'ACTIVO',
      },
    });
    console.log(`✓ Admin creado: ${usuario.email}`);
    console.log(`  Contraseña: ${plainPassword}`);
  } else {
    console.log(`✓ Admin ya existe: ${usuarioExistente.email}`);
  }

  console.log('\n✓ Seed completado exitosamente');
}

main()
  .catch((e) => {
    console.error('Error al ejecutar la semilla:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });