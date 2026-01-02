
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    const email = 'trader.devcode5@gmail.com';
    const password = 'developer';

    console.log(`Creating/Updating user: ${email}...`);

    // 1. Ensure 'Farmacia' rubro exists
    let rubro = await prisma.rubro.findFirst({
        where: { nombre: 'Farmacia' }
    });

    if (!rubro) {
        rubro = await prisma.rubro.create({
            data: { nombre: 'Farmacia' }
        });
        console.log('Created Rubro: Farmacia');
    }

    // 2. Ensure Test Company exists
    const ruc = '20600000001';
    let empresa = await prisma.empresa.findUnique({
        where: { ruc }
    });

    if (!empresa) {
        // Get a plan
        const plan = await prisma.plan.findFirst();

        empresa = await prisma.empresa.create({
            data: {
                ruc,
                razonSocial: 'FARMACIA TEST S.A.C.',
                direccion: 'Av. Test 123',
                fechaActivacion: new Date(),
                fechaExpiracion: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                planId: plan ? plan.id : 1, // Fallback ID
                rubroId: rubro.id,
                tipoEmpresa: 'FORMAL',
                nombreComercial: 'MI FARMACIA',
            }
        });
        console.log('Created Company: FARMACIA TEST');
    } else {
        // Update existing company to be Farmacia
        await prisma.empresa.update({
            where: { id: empresa.id },
            data: { rubroId: rubro.id }
        });
        console.log('Updated Company to run as Farmacia');
    }

    // 3. Create/Update User
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.usuario.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            empresaId: empresa.id,
            rol: 'ADMIN_EMPRESA',
            estado: 'ACTIVO'
        },
        create: {
            nombre: 'Trader Code',
            email,
            password: hashedPassword,
            dni: '00000001',
            celular: '900000001',
            rol: 'ADMIN_EMPRESA',
            estado: 'ACTIVO',
            empresaId: empresa.id
        }
    });

    console.log(`User ${user.email} is ready correctly linked to Farmacia!`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
