
const fs = require('fs');
const path = require('path');

// ==========================================
// 1. LABORATORIOS REALES (Perú)
// ==========================================
const LABS = [
    { name: 'Portugal', tier: 'low' },
    { name: 'Genfar', tier: 'low' },
    { name: 'Farmindustria', tier: 'mid' },
    { name: 'IQFarma', tier: 'mid' },
    { name: 'AC Farma', tier: 'low' },
    { name: 'Hersil', tier: 'mid' },
    { name: 'Teva', tier: 'mid' },
    { name: 'Siegfried', tier: 'high' },
    { name: 'Medifarma', tier: 'mid' },
    { name: 'Bayer', tier: 'high' },
];

// ==========================================
// 2. MEDICAMENTOS DE MARCA (Trade Names) - REALES
// ==========================================
const TRADE_PRODUCTS = [
    { n: 'Panadol Forte', d: 'Caja x 100 tabletas', p: 85.00, u: 'CJA', c: 'Dolor y Fiebre' },
    { n: 'Panadol Antigripal', d: 'Caja x 100 tabletas', p: 95.00, u: 'CJA', c: 'Respiratorio' },
    { n: 'Panadol Niños', d: 'Jarabe 60ml', p: 18.00, u: 'NIU', c: 'Infantil' },
    { n: 'Panadol Gotas', d: 'Frasco 15ml', p: 15.00, u: 'NIU', c: 'Infantil' },

    { n: 'Apronax 550mg', d: 'Caja x 120 tabletas', p: 140.00, u: 'CJA', c: 'Dolor y Fiebre' },
    { n: 'Apronax 275mg', d: 'Caja x 20 tabletas', p: 25.00, u: 'CJA', c: 'Dolor y Fiebre' },
    { n: 'Apronax Gel', d: 'Tubo 40g', p: 35.00, u: 'NIU', c: 'Dolor y Fiebre' },

    { n: 'Antalgina 500mg', d: 'Caja x 100 tabletas', p: 60.00, u: 'CJA', c: 'Dolor y Fiebre' },
    { n: 'Antalgina Jarabe', d: 'Frasco 120ml', p: 15.00, u: 'NIU', c: 'Infantil' },
    { n: 'Antalgina Gotas', d: 'Frasco 10ml', p: 12.00, u: 'NIU', c: 'Infantil' },

    { n: 'Kitadol 500mg', d: 'Caja x 100 tabletas', p: 55.00, u: 'CJA', c: 'Dolor y Fiebre' },
    { n: 'Gripefina', d: 'Caja x 100 tabletas', p: 70.00, u: 'CJA', c: 'Respiratorio' },
    { n: 'Nastizol Compositum', d: 'Caja x 100 tabletas', p: 90.00, u: 'CJA', c: 'Respiratorio' },
    { n: 'Nastizol Jarabe', d: 'Frasco 120ml', p: 35.00, u: 'NIU', c: 'Respiratorio' },

    { n: 'Aspirina 100mg', d: 'Caja x 100 tabletas', p: 45.00, u: 'CJA', c: 'Cardiovascular' },
    { n: 'Aspirina Forte', d: 'Caja x 40 tabletas', p: 30.00, u: 'CJA', c: 'Dolor y Fiebre' },

    { n: 'Redoxon Total', d: 'Tubo x 10 efervescentes', p: 15.00, u: 'NIU', c: 'Vitaminas' },
    { n: 'Vick Vaporub', d: 'Lata 50g', p: 12.00, u: 'NIU', c: 'Respiratorio' },
    { n: 'Vick Pyrena', d: 'Caja x 50 sobres', p: 60.00, u: 'CJA', c: 'Respiratorio' },

    { n: 'Bismutol', d: 'Frasco 150ml', p: 22.00, u: 'NIU', c: 'Estomacal' },
    { n: 'Bismutol Tabletas', d: 'Caja x 100 tabletas', p: 80.00, u: 'CJA', c: 'Estomacal' },
    { n: 'Sal de Andrews', d: 'Caja x 100 sobres', p: 40.00, u: 'CJA', c: 'Estomacal' },
    { n: 'Gastrozepina', d: 'Caja x 30 tabletas', p: 45.00, u: 'CJA', c: 'Estomacal' },

    { n: 'Hepabionta', d: 'Caja x 20 cápsulas', p: 35.00, u: 'CJA', c: 'Estomacal' },
    { n: 'Neurobion 5000', d: 'Caja x 3 ampollas', p: 45.00, u: 'CJA', c: 'Vitaminas' },
    { n: 'Dolo-Neurobion', d: 'Caja x 1 ampolla', p: 25.00, u: 'NIU', c: 'Dolor y Fiebre' },
    { n: 'Dolo-Neurobion Forte', d: 'Caja x 10 tabletas', p: 30.00, u: 'CJA', c: 'Dolor y Fiebre' },

    { n: 'Hirudoid Forte', d: 'Gel 40g', p: 38.00, u: 'NIU', c: 'Tópico' },
    { n: 'Voltaren 50mg', d: 'Caja x 20 tabletas', p: 42.00, u: 'CJA', c: 'Dolor y Fiebre' },
    { n: 'Voltaren Emulgel', d: 'Tubo 30g', p: 35.00, u: 'NIU', c: 'Tópico' },

    { n: 'Buscapina Compositum', d: 'Caja x 20 grageas', p: 28.00, u: 'CJA', c: 'Dolor y Fiebre' },
    { n: 'Buscapina Fem', d: 'Caja x 10 tabletas', p: 15.00, u: 'CJA', c: 'Dolor y Fiebre' },
    { n: 'Plidan', d: 'Caja x 20 tabletas', p: 25.00, u: 'CJA', c: 'Estomacal' },
    { n: 'Aero-Om', d: 'Gotas 15ml', p: 20.00, u: 'NIU', c: 'Infantil' },
    { n: 'Gaseovet', d: 'Gotas 15ml', p: 18.00, u: 'NIU', c: 'Estomacal' },

    { n: 'Enterogermina', d: 'Caja x 10 ampollas bebibles', p: 45.00, u: 'CJA', c: 'Estomacal' },
    { n: 'Floratil', d: 'Caja x 10 cápsulas', p: 38.00, u: 'CJA', c: 'Estomacal' },
    { n: 'Electrolight', d: 'Frasco 1L Fresa', p: 6.50, u: 'NIU', c: 'Hidratación' },
    { n: 'Pedialyte 60', d: 'Frasco 500ml Uva', p: 9.50, u: 'NIU', c: 'Hidratación' },

    { n: 'Ensure Advance', d: 'Lata 400g Vainilla', p: 68.00, u: 'NIU', c: 'Nutrición' },
    { n: 'Glucerna', d: 'Lata 400g Vainilla', p: 72.00, u: 'NIU', c: 'Nutrición' },
    { n: 'Pediasure', d: 'Lata 400g Chocolate', p: 65.00, u: 'NIU', c: 'Nutrición' },

    { n: 'Tio Nacho Acondicionador', d: 'Frasco 415ml', p: 25.00, u: 'NIU', c: 'Cuidado Personal' },
    { n: 'Tio Nacho Shampoo', d: 'Frasco 415ml', p: 25.00, u: 'NIU', c: 'Cuidado Personal' },
    { n: 'Eucerin Bloqueador 50+', d: 'Frasco 50ml', p: 95.00, u: 'NIU', c: 'Dermocosmética' },
    { n: 'La Roche-Posay Anthelios', d: 'Frasco 50ml', p: 110.00, u: 'NIU', c: 'Dermocosmética' },

    { n: 'Huggies M', d: 'Paquete x 52 pañales', p: 48.00, u: 'NIU', c: 'Bebé' },
    { n: 'Huggies XG', d: 'Paquete x 48 pañales', p: 52.00, u: 'NIU', c: 'Bebé' },
    { n: 'Babysec M', d: 'Paquete x 52 pañales', p: 40.00, u: 'NIU', c: 'Bebé' },
    { n: 'Pampers G', d: 'Paquete x 50 pañales', p: 45.00, u: 'NIU', c: 'Bebé' },
];

// ==========================================
// 3. MOLECULAS REALES (Para combinaciones)
// ==========================================
const MOLECULES = [
    { n: 'Paracetamol', s: '500mg', type: 'tabs', cat: 'Dolor y Fiebre' },
    { n: 'Paracetamol', s: '120mg/5ml', type: 'syrup', cat: 'Infantil' },
    { n: 'Ibuprofeno', s: '400mg', type: 'tabs', cat: 'Dolor y Fiebre' },
    { n: 'Ibuprofeno', s: '100mg/5ml', type: 'syrup', cat: 'Infantil' },
    { n: 'Naproxeno', s: '550mg', type: 'tabs', cat: 'Dolor y Fiebre' },
    { n: 'Diclofenaco', s: '50mg', type: 'tabs', cat: 'Dolor y Fiebre' },
    { n: 'Diclofenaco', s: '75mg/3ml', type: 'amp', cat: 'Dolor y Fiebre' },
    { n: 'Ketorolaco', s: '10mg', type: 'tabs', cat: 'Dolor y Fiebre' },

    { n: 'Amoxicilina', s: '500mg', type: 'caps', cat: 'Antibióticos' },
    { n: 'Amoxicilina', s: '250mg/5ml', type: 'syrup', cat: 'Infantil' },
    { n: 'Azitromicina', s: '500mg', type: 'tabs', cat: 'Antibióticos' },
    { n: 'Ciprofloxacino', s: '500mg', type: 'tabs', cat: 'Antibióticos' },
    { n: 'Cefalexina', s: '500mg', type: 'caps', cat: 'Antibióticos' },

    { n: 'Cetirizina', s: '10mg', type: 'tabs', cat: 'Alergias' },
    { n: 'Loratadina', s: '10mg', type: 'tabs', cat: 'Alergias' },
    { n: 'Clorfenamina', s: '4mg', type: 'tabs', cat: 'Alergias' },
    { n: 'Prednisona', s: '20mg', type: 'tabs', cat: 'Corticoides' },
    { n: 'Dexametasona', s: '4mg/2ml', type: 'amp', cat: 'Corticoides' },

    { n: 'Omeprazol', s: '20mg', type: 'caps', cat: 'Estomacal' },
    { n: 'Esomeprazol', s: '40mg', type: 'tabs', cat: 'Estomacal' },
    { n: 'Ranitidina', s: '300mg', type: 'tabs', cat: 'Estomacal' },

    { n: 'Losartan', s: '50mg', type: 'tabs', cat: 'Cardiovascular' },
    { n: 'Enalapril', s: '10mg', type: 'tabs', cat: 'Cardiovascular' },
    { n: 'Amlodipino', s: '5mg', type: 'tabs', cat: 'Cardiovascular' },
    { n: 'Atorvastatina', s: '20mg', type: 'tabs', cat: 'Cardiovascular' },

    { n: 'Metformina', s: '850mg', type: 'tabs', cat: 'Diabetes' },
    { n: 'Glibenclamida', s: '5mg', type: 'tabs', cat: 'Diabetes' },

    { n: 'Fluconazol', s: '150mg', type: 'caps', cat: 'Antimicóticos' },
    { n: 'Ketoconazol', s: '200mg', type: 'tabs', cat: 'Antimicóticos' },
    { n: 'Clotrimazol', s: '1%', type: 'cream', cat: 'Tópico' },

    { n: 'Sildenafilo', s: '100mg', type: 'tabs', cat: 'Salud Sexual' },
    { n: 'Tadalafilo', s: '20mg', type: 'tabs', cat: 'Salud Sexual' },

    { n: 'Alprazolam', s: '0.5mg', type: 'tabs', cat: 'Neurología' },
    { n: 'Clonazepam', s: '0.5mg', type: 'tabs', cat: 'Neurología' },
    { n: 'Gabapentina', s: '300mg', type: 'caps', cat: 'Neurología' },
    { n: 'Pregabalina', s: '75mg', type: 'caps', cat: 'Neurología' },

    { n: 'Complejo B', s: 'Fuerte', type: 'tabs', cat: 'Vitaminas' },
    { n: 'Vitamina C', s: '1g', type: 'tabs', cat: 'Vitaminas' },
    { n: 'Calcio + Vit D', s: '500mg', type: 'tabs', cat: 'Vitaminas' },
];


function generate() {
    let products = [];
    const usedNames = new Set();

    // 1. Add Trade Products (Exact copies)
    TRADE_PRODUCTS.forEach(p => {
        if (!usedNames.has(p.n)) {
            products.push({
                nombre: p.n,
                descripcion: p.d,
                precioSugerido: p.p,
                unidadConteo: p.u,
                categoria: p.c,
                esGenerico: false
            });
            usedNames.add(p.n);
        }
    });

    // 2. Build Matrix (Molecule + Lab)
    // Only realistic combinations. E.g. "Paracetamol 500mg Portugal"

    MOLECULES.forEach(mol => {
        // FORM DATA
        let formName = 'Caja x 100 tabletas';
        let unit = 'CJA';
        let basePrice = 5.00; // Cheap generic base

        if (mol.type === 'syrup') {
            formName = 'Frasco 120ml';
            unit = 'NIU';
            basePrice = 8.00;
        } else if (mol.type === 'caps') {
            formName = 'Caja x 100 cápsulas';
            unit = 'CJA';
            basePrice = 12.00;
        } else if (mol.type === 'amp') {
            formName = 'Caja x 100 ampollas';
            unit = 'CJA';
            basePrice = 40.00;
        } else if (mol.type === 'cream') {
            formName = 'Tubo 20g';
            unit = 'NIU';
            basePrice = 6.00;
        }

        // 2a. Add Pure Generic
        const genName = `${mol.n} ${mol.s}`;
        if (!usedNames.has(genName)) {
            products.push({
                nombre: genName,
                descripcion: `${formName} (Genérico)`,
                precioSugerido: basePrice,
                unidadConteo: unit,
                categoria: mol.cat,
                esGenerico: true
            });
            usedNames.add(genName);
        }

        // 2b. Add Branded Generics (Molecule + Lab)
        LABS.forEach(lab => {
            const labName = `${mol.n} ${mol.s} ${lab.name}`;

            // Tier-based multiplier
            let multiplier = 1.0;
            if (lab.tier === 'mid') multiplier = 1.5;
            if (lab.tier === 'high') multiplier = 2.2;

            // Lab Reputation Premium
            if (['Bayer', 'Siegfried', 'Pfizer'].includes(lab.name)) multiplier += 0.5;

            let price = basePrice * multiplier;

            // Category adjustments
            if (mol.cat === 'Antibióticos') price *= 1.3;
            if (mol.cat === 'Neurología') price *= 1.4;

            // Realistic Rounding (e.g., 22.50, 22.90, 23.00)
            const randomCents = [0.00, 0.50, 0.90];
            price = Math.round(price);
            price += randomCents[Math.floor(Math.random() * randomCents.length)];

            // Box quantity adjustment for non-standard counts if any (but here formName says 100)
            // Just ensuring no price is too low for a box
            if (formName.includes('Caja x 100') && price < 15) price = 15.00 + (Math.random() * 5);

            if (!usedNames.has(labName)) {
                products.push({
                    nombre: labName,
                    descripcion: `${formName} - ${lab.name}`,
                    precioSugerido: price.toFixed(2),
                    unidadConteo: unit,
                    categoria: mol.cat,
                    esGenerico: false
                });
                usedNames.add(labName);
            }
        });
    });

    // 3. Fillers for Personal Care (Variations)
    const personalCare = [
        'Pasta Dental Colgate Total 12',
        'Pasta Dental Kolynos',
        'Crema Dental Oral-B',
        'Shampoo Head&Shoulders',
        'Shampoo Pantene',
        'Shampoo Savital',
        'Jabón Protex',
        'Jabón Neko',
        'Jabón Dove',
        'Desodorante Rexona',
        'Desodorante Nivea',
        'Desodorante Old Spice',
        'Toallas Nosotras',
        'Toallas Kotex',
        'Papel Higiénico Elite',
        'Pañuelos Kleenex'
    ];

    const sizes = ['Pequeño', 'Mediano', 'Grande', 'Pack x 3'];

    personalCare.forEach(pc => {
        sizes.forEach(sz => {
            const name = `${pc} ${sz}`;
            if (!usedNames.has(name)) {
                products.push({
                    nombre: name,
                    descripcion: 'Unidad de aseo personal',
                    precioSugerido: (Math.random() * 20 + 5).toFixed(2),
                    unidadConteo: 'NIU',
                    categoria: 'Cuidado Personal',
                    esGenerico: false
                });
                usedNames.add(name);
            }
        });
    });

    console.log(`Generated ${products.length} unique real-looking products.`);
    fs.writeFileSync(path.join(__dirname, 'catalogo_farmacia_real.json'), JSON.stringify(products, null, 2));
}

generate();
