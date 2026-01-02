
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('🧹 Eliminando catálogo farmacéutico incorrecto...');

    const rubro = await prisma.rubro.findUnique({
        where: { nombre: 'Farmacia' }
    });

    if (!rubro) {
        console.log('No existe el rubro Farmacia.');
        return;
    }

    const deleted = await prisma.productoPlantilla.deleteMany({
        where: { rubroId: rubro.id }
    });

    console.log(`✅ ${deleted.count} productos eliminados correctamente.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
