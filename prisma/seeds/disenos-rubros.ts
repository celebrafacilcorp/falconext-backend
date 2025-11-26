import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const disenosPorRubro = [
    {
        rubroNombre: 'Restauración y alimentos', // ID 5
        colorPrimario: '#FF6B6B',
        colorSecundario: '#FFE66D',
        colorAccento: '#4ECDC4',
        tipografia: 'Poppins',
        espaciado: 'spacious',
        bordeRadius: 'large',
        estiloBoton: 'rounded',
        plantillaId: 'restaurante',
        vistaProductos: 'cards',
    },
    {
        rubroNombre: 'Venta de materiales de construcción', // ID 1
        colorPrimario: '#2C3E50',
        colorSecundario: '#E74C3C',
        colorAccento: '#3498DB',
        tipografia: 'Inter',
        espaciado: 'compact',
        bordeRadius: 'small',
        estiloBoton: 'square',
        plantillaId: 'tecnica',
        vistaProductos: 'tabla',
    },
    {
        rubroNombre: 'Comercio minorista', // ID 2
        colorPrimario: '#27AE60',
        colorSecundario: '#F39C12',
        colorAccento: '#E67E22',
        tipografia: 'Roboto',
        espaciado: 'normal',
        bordeRadius: 'medium',
        estiloBoton: 'rounded',
        plantillaId: 'compacta',
        vistaProductos: 'lista',
    },
    {
        rubroNombre: 'Artesanía y decoración', // ID 11
        colorPrimario: '#E91E63',
        colorSecundario: '#FFF9C4',
        colorAccento: '#9C27B0',
        tipografia: 'Pacifico',
        espaciado: 'spacious',
        bordeRadius: 'large',
        estiloBoton: 'pill',
        plantillaId: 'moderna',
        vistaProductos: 'cards',
    },
];

async function seedDisenosRubro() {
    console.log('🎨 Seeding diseños por rubro...');

    // Primero, obtener los rubros existentes
    const rubros = await prisma.rubro.findMany({
        select: { id: true, nombre: true },
    });

    console.log(`📊 Rubros encontrados: ${rubros.length}`);
    rubros.forEach((rubro) => {
        console.log(`  - ID ${rubro.id}: ${rubro.nombre}`);
    });

    // Crear diseños basados en los IDs reales
    for (const diseno of disenosPorRubro) {
        console.log(`\n🛠️  Procesando diseño para: ${diseno.rubroNombre}`);

        // Buscar rubro por nombre similar
        const rubro = rubros.find((r) =>
            r.nombre.toLowerCase().includes(diseno.rubroNombre.toLowerCase().split('/')[0])
        );

        if (!rubro) {
            console.log(`⚠️  No se encontró rubro para: ${diseno.rubroNombre}, saltando...`);
            continue;
        }

        console.log(`✅ Usando rubro ID ${rubro.id}: ${rubro.nombre}`);

        // Verificar si ya existe un diseño para este rubro
        const existente = await prisma.disenoRubro.findUnique({
            where: { rubroId: rubro.id },
        });

        if (existente) {
            console.log(`📝 Actualizando diseño existente para rubro ${rubro.nombre}`);
            await prisma.disenoRubro.update({
                where: { rubroId: rubro.id },
                data: {
                    colorPrimario: diseno.colorPrimario,
                    colorSecundario: diseno.colorSecundario,
                    colorAccento: diseno.colorAccento,
                    tipografia: diseno.tipografia,
                    espaciado: diseno.espaciado,
                    bordeRadius: diseno.bordeRadius,
                    estiloBoton: diseno.estiloBoton,
                    plantillaId: diseno.plantillaId,
                    vistaProductos: diseno.vistaProductos,
                },
            });
        } else {
            console.log(`➕ Creando nuevo diseño para rubro ${rubro.nombre}`);
            await prisma.disenoRubro.create({
                data: {
                    rubroId: rubro.id,
                    colorPrimario: diseno.colorPrimario,
                    colorSecundario: diseno.colorSecundario,
                    colorAccento: diseno.colorAccento,
                    tipografia: diseno.tipografia,
                    espaciado: diseno.espaciado,
                    bordeRadius: diseno.bordeRadius,
                    estiloBoton: diseno.estiloBoton,
                    plantillaId: diseno.plantillaId,
                    vistaProductos: diseno.vistaProductos,
                },
            });
        }
    }

    console.log('\n✨ Seed de diseños por rubro completado!');
}

seedDisenosRubro()
    .catch((error) => {
        console.error('❌ Error en seed:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
