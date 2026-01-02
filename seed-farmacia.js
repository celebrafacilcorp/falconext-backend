
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
    console.log('💊 Sembrando Catálogo de Farmacia MASIVO (1000 ITEMS)...');

    // 1. Load Data
    const dataPath = path.join(__dirname, 'catalogo_farmacia_real.json');
    if (!fs.existsSync(dataPath)) {
        throw new Error('No se encontró el archivo catalogo_farmacia_real.json. Ejecuta node generate-real-catalog.js primero.');
    }
    const catalogoFarmacia = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    console.log(`📦 Cargados ${catalogoFarmacia.length} productos desde JSON.`);


    // 2. Ensure Rubro
    const rubro = await prisma.rubro.upsert({
        where: { nombre: 'Farmacia' },
        update: {},
        create: { nombre: 'Farmacia' }
    });
    console.log('✅ Rubro Farmacia asegurado');

    // 3. Insert Products (Batching recommended for speed, but pure loop is fine for 1000 locally)
    let count = 0;
    let skipped = 0;

    // We fetch existing once to optimize avoid N queries
    const existing = await prisma.productoPlantilla.findMany({
        where: { rubroId: rubro.id },
        select: { nombre: true }
    });
    const existingNames = new Set(existing.map(e => e.nombre));

    console.log('🚀 Iniciando carga...');

    // Use transaction for speed in chunks, or just parallel promises
    const CHUNK_SIZE = 50;
    for (let i = 0; i < catalogoFarmacia.length; i += CHUNK_SIZE) {
        const chunk = catalogoFarmacia.slice(i, i + CHUNK_SIZE);
        const promises = chunk.map(async (prod) => {
            if (existingNames.has(prod.nombre)) {
                skipped++;
                return;
            }

            const codigo = `FAR-${Math.floor(Math.random() * 9000000) + 1000000}`;

            // Destructure to exclude esGenerico, which is not in the schema
            const { esGenerico, ...validData } = prod;

            await prisma.productoPlantilla.create({
                data: {
                    ...validData,
                    rubroId: rubro.id,
                    codigo: codigo,
                    imagenUrl: 'https://via.placeholder.com/150'
                }
            });
            count++;
        });

        await Promise.all(promises);
        process.stdout.write('.'); // Progress indicator
    }

    console.log(`\n🎉 Proceso terminado.`);
    console.log(`   + Agregados: ${count}`);
    console.log(`   . Saltados : ${skipped}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
