import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedPlanes() {
  console.log('🌱 Seeding planes...');
  
  const planes = [
    {
      nombre: 'BASICO',
      descripcion: 'Plan básico con funcionalidades esenciales para pequeñas empresas',
      limiteUsuarios: 3,
      costo: 45.00
    },
    {
      nombre: 'PRO', 
      descripcion: 'Plan profesional con funciones avanzadas para empresas en crecimiento',
      limiteUsuarios: 10,
      costo: 65.00
    },
    {
      nombre: 'PREMIUM',
      descripcion: 'Plan premium con todas las funcionalidades y soporte prioritario',
      limiteUsuarios: 25,
      costo: 99.00
    }
  ];

  for (const planData of planes) {
    try {
      const plan = await prisma.plan.upsert({
        where: { nombre: planData.nombre },
        update: {
          descripcion: planData.descripcion,
          limiteUsuarios: planData.limiteUsuarios,
          costo: planData.costo
        },
        create: planData
      });
      
      console.log(`✅ Plan ${plan.nombre} - S/ ${plan.costo} (${plan.limiteUsuarios} usuarios)`);
    } catch (error) {
      console.error(`❌ Error creating plan ${planData.nombre}:`, error);
    }
  }
}

async function main() {
  try {
    await seedPlanes();
    
    // Verificar planes creados
    const planesCount = await prisma.plan.count();
    console.log(`\n📊 Total planes en BD: ${planesCount}`);
    
    const allPlanes = await prisma.plan.findMany({
      orderBy: { id: 'asc' }
    });
    
    console.log('\n📋 Planes disponibles:');
    allPlanes.forEach(plan => {
      console.log(`  • ${plan.nombre}: S/ ${plan.costo} (${plan.limiteUsuarios} usuarios max)`);
    });
    
  } catch (error) {
    console.error('❌ Error in seeding process:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

export { seedPlanes };