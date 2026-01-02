
const fs = require('fs');
const path = require('path');

// 1. DATA SOURCES (Peruvian Market Context)
const LABS = [
    'Portugal', 'Genfar', 'Farmindustria', 'Medifarma', 'IQFarma',
    'AC Farma', 'Bagó', 'Hersil', 'Teva', 'Siegfried',
    'Abbott', 'Bayer', 'Pfizer', 'GSK', 'Sanofi'
];

const FORMS = [
    { code: 'CJA', name: 'Caja', suf: 'tabletas', factor: 100 },
    { code: 'FCO', name: 'Frasco', suf: 'ml', factor: 1 },
    { code: 'TUB', name: 'Tubo', suf: 'g', factor: 1 },
    { code: 'SOB', name: 'Sobre', suf: 'polvo', factor: 1 },
    { code: 'AMP', name: 'Ampolla', suf: 'ml', factor: 1 },
    { code: 'STR', name: 'Tira', suf: 'tabletas', factor: 10 }
];

const MOLECULES = [
    { name: 'Paracetamol', strenghts: ['500mg', '1g', '120mg/5ml'] },
    { name: 'Ibuprofeno', strenghts: ['400mg', '600mg', '100mg/5ml'] },
    { name: 'Amoxicilina', strenghts: ['500mg', '250mg/5ml', '875mg'] },
    { name: 'Cetirizina', strenghts: ['10mg', '5mg/5ml'] },
    { name: 'Loratadina', strenghts: ['10mg', '5mg/5ml'] },
    { name: 'Naproxeno', strenghts: ['550mg', '275mg'] },
    { name: 'Ciprofloxacino', strenghts: ['500mg'] },
    { name: 'Azitromicina', strenghts: ['500mg', '200mg/5ml'] },
    { name: 'Diclofenaco', strenghts: ['50mg', '100mg', '75mg/3ml'] },
    { name: 'Omeprazol', strenghts: ['20mg', '40mg'] },
    { name: 'Metformina', strenghts: ['850mg', '500mg', '1g'] },
    { name: 'Losartan', strenghts: ['50mg', '100mg'] },
    { name: 'Enalapril', strenghts: ['10mg', '20mg'] },
    { name: 'Atorvastatina', strenghts: ['20mg', '40mg'] },
    { name: 'Sildenafilo', strenghts: ['50mg', '100mg'] },
    { name: 'Glibenclamida', strenghts: ['5mg'] },
    { name: 'Prednisona', strenghts: ['5mg', '20mg', '50mg'] },
    { name: 'Dexametasona', strenghts: ['4mg/2ml', '0.5mg'] },
    { name: 'Clorfenamina', strenghts: ['4mg', '10mg/ml'] },
    { name: 'Salbutamol', strenghts: ['100mcg', 'Jarabe'] },
    { name: 'Bismuto', strenghts: ['150ml'] },
    { name: 'Simeticona', strenghts: ['40mg', '80mg'] },
    { name: 'Fluconazol', strenghts: ['150mg'] },
    { name: 'Ketoconazol', strenghts: ['200mg', 'Crema 2%'] },
    { name: 'Clotrimazol', strenghts: ['Crema 1%'] },
    { name: 'Gentamicina', strenghts: ['160mg', '80mg'] },
    { name: 'Amlodipino', strenghts: ['5mg', '10mg'] },
    { name: 'Tamsulosina', strenghts: ['0.4mg'] },
    { name: 'Gabapentina', strenghts: ['300mg', '400mg'] },
    { name: 'Pregabalina', strenghts: ['75mg', '150mg'] }
];

// Top Real Brands (Hardcoded for realism)
const REAL_BRANDS = [
    { nombre: 'Panadol Forte', descripcion: 'Caja x 100 tabletas', precio: 85.00, unidad: 'CJA' },
    { nombre: 'Panadol Niños', descripcion: 'Jarabe 60ml', precio: 18.00, unidad: 'NIU' },
    { nombre: 'Apronax 550mg', descripcion: 'Caja x 120 tabletas', precio: 140.00, unidad: 'CJA' },
    { nombre: 'Antalgina 500mg', descripcion: 'Caja x 100 tabletas', precio: 60.00, unidad: 'CJA' },
    { nombre: 'Kitadol 500mg', descripcion: 'Caja x 100 tabletas', precio: 55.00, unidad: 'CJA' },
    { nombre: 'Nastizol Compositum', descripcion: 'Caja x 100 tabletas', precio: 90.00, unidad: 'CJA' },
    { nombre: 'Gripefina', descripcion: 'Caja x 100 tabletas', precio: 70.00, unidad: 'CJA' },
    { nombre: 'Aspirina 100mg', descripcion: 'Caja x 100 tabletas', precio: 45.00, unidad: 'CJA' },
    { nombre: 'Redoxon Total', descripcion: 'Tubo x 10 efervescentes', precio: 15.00, unidad: 'NIU' },
    { nombre: 'Vick Vaporub 50g', descripcion: 'Lata pequeña', precio: 12.00, unidad: 'NIU' },
    { nombre: 'Bismutol', descripcion: 'Frasco 150ml', precio: 22.00, unidad: 'NIU' },
    { nombre: 'Sal de Andrews', descripcion: 'Caja x 100 sobres', precio: 40.00, unidad: 'CJA' },
    { nombre: 'Hepabionta', descripcion: 'Caja x 20 cápsulas', precio: 35.00, unidad: 'CJA' },
    { nombre: 'Neurobion 5000', descripcion: 'Caja x 3 ampollas', precio: 45.00, unidad: 'CJA' },
    { nombre: 'Dolo-Neurobion', descripcion: 'Caja x 1 ampolla', precio: 25.00, unidad: 'NIU' },
    { nombre: 'Hirudoid Forte', descripcion: 'Gel 40g', precio: 38.00, unidad: 'NIU' },
    { nombre: 'Voltaren 50mg', descripcion: 'Caja x 20 tabletas', precio: 42.00, unidad: 'CJA' },
    { nombre: 'Buscapina Compositum', descripcion: 'Caja x 20 grageas', precio: 28.00, unidad: 'CJA' },
    { nombre: 'Plidan', descripcion: 'Caja x 20 tabletas', precio: 25.00, unidad: 'CJA' },
    { nombre: 'Aero-Om', descripcion: 'Gotas 15ml', precio: 20.00, unidad: 'NIU' }
];

function generateCatalog() {
    let products = [];

    // 1. Add Real Brands
    REAL_BRANDS.forEach(p => {
        products.push({
            nombre: p.nombre,
            descripcion: p.descripcion,
            precioSugerido: p.precio,
            unidadConteo: p.unidad,
            esGenerico: false
        });
    });

    // 2. Generate Generics & Branded Generics per Lab
    // Aiming for ~1000 products
    for (const mol of MOLECULES) {
        for (const str of mol.strenghts) {

            // Determine likely form based on strength string
            let form = FORMS[0]; // Default Caja
            if (str.includes('ml') && !str.includes('mg/')) form = FORMS[1]; // Frasco
            if (str.includes('crema') || str.includes('gel')) form = FORMS[2]; // Tubo
            if (str.includes('amp')) form = FORMS[4];

            // 2.1 Generic Item (Sin marca)
            const genericName = `${mol.name} ${str}`;
            const precioBase = Math.floor(Math.random() * 50) + 5;

            products.push({
                nombre: `${genericName} (Genérico)`,
                descripcion: `${form.name} x ${form.factor === 100 ? '100' : '1'} ${form.suf}`,
                precioSugerido: precioBase,
                unidadConteo: form.code,
                esGenerico: true
            });

            // 2.2 Branded Items from Labs
            // Pick 3 random labs per molecule to simulate market variety
            const selectedLabs = LABS.sort(() => 0.5 - Math.random()).slice(0, 3);

            selectedLabs.forEach(lab => {
                const isExpensive = ['Pfizer', 'Bayer', 'GSK', 'Abbott'].includes(lab);
                const multiplier = isExpensive ? 2.5 : 1.5;
                const price = Math.round(precioBase * multiplier);

                products.push({
                    nombre: `${genericName} ${lab}`,
                    descripcion: `${form.name} x ${form.factor === 100 ? '100' : '1'} ${form.suf} - ${lab}`,
                    precioSugerido: price,
                    unidadConteo: form.code,
                    esGenerico: false
                });
            });
        }
    }

    // 3. Fill until 1000+ with variations
    let count = 0;
    while (products.length < 1000) {
        const mol = MOLECULES[count % MOLECULES.length];
        const lab = LABS[count % LABS.length];
        const extraName = `Bio${mol.name} ${lab}`; // Fake commercial name

        products.push({
            nombre: `${extraName} Forte`,
            descripcion: `Caja x 100 tabletas`,
            precioSugerido: Math.floor(Math.random() * 80) + 20,
            unidadConteo: 'CJA',
            esGenerico: false
        });
        count++;
    }

    console.log(`Generated ${products.length} products.`);
    fs.writeFileSync(path.join(__dirname, 'catalogo_farmacia_full.json'), JSON.stringify(products, null, 2));
}

generateCatalog();
