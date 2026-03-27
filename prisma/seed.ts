import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const productSeeds = [
  {
    name: 'Camiseta Lino Costa',
    slug: 'camiseta-lino-costa',
    description:
      'Camiseta ligera de lino con tacto suave y silueta relajada. Funciona para clima cálido, capas livianas y looks casuales de uso diario.',
    price: 129900,
    active: true,
    images: [
      { url: '/products/classic-white-tee.jpg', alt: 'Camiseta Lino Costa vista frontal', sortOrder: 0 },
      { url: '/products/ocean-breeze-tee.jpg', alt: 'Camiseta Lino Costa vista lateral', sortOrder: 1 },
    ],
    variants: [
      { size: 'S', color: 'Blanco hueso', stock: 8, sku: 'CLC-S-BH' },
      { size: 'M', color: 'Blanco hueso', stock: 10, sku: 'CLC-M-BH' },
      { size: 'L', color: 'Blanco hueso', stock: 6, sku: 'CLC-L-BH' },
      { size: 'XL', color: 'Blanco hueso', stock: 4, sku: 'CLC-XL-BH' },
      { size: 'M', color: 'Arena', stock: 7, sku: 'CLC-M-AR' },
      { size: 'L', color: 'Arena', stock: 5, sku: 'CLC-L-AR' },
    ],
  },
  {
    name: 'Overshirt Brisa Pacífica',
    slug: 'overshirt-brisa-pacifica',
    description:
      'Overshirt liviana para combinar sobre camiseta o top. Tiene estructura limpia, caída suave y un peso ideal para tardes frescas o interiores con aire.',
    price: 189900,
    active: true,
    images: [
      { url: '/products/tropical-palms-tee.jpg', alt: 'Overshirt Brisa Pacífica vista frontal', sortOrder: 0 },
      { url: '/products/sunset-vibes-tee.jpg', alt: 'Overshirt Brisa Pacífica detalle de textura', sortOrder: 1 },
    ],
    variants: [
      { size: 'S', color: 'Azul humo', stock: 5, sku: 'OBP-S-AH' },
      { size: 'M', color: 'Azul humo', stock: 9, sku: 'OBP-M-AH' },
      { size: 'L', color: 'Azul humo', stock: 7, sku: 'OBP-L-AH' },
      { size: 'XL', color: 'Azul humo', stock: 3, sku: 'OBP-XL-AH' },
      { size: 'M', color: 'Gris perla', stock: 6, sku: 'OBP-M-GP' },
      { size: 'L', color: 'Gris perla', stock: 4, sku: 'OBP-L-GP' },
    ],
  },
  {
    name: 'Polo Bahía',
    slug: 'polo-bahia',
    description:
      'Polo de algodón premium con cuello firme y fit regular. Pensada para subir un poco el nivel sin perder comodidad ni versatilidad.',
    price: 149900,
    active: true,
    images: [
      { url: '/products/ocean-breeze-tee.jpg', alt: 'Polo Bahía vista frontal', sortOrder: 0 },
      { url: '/products/classic-white-tee.jpg', alt: 'Polo Bahía vista posterior', sortOrder: 1 },
    ],
    variants: [
      { size: 'S', color: 'Azul marino', stock: 6, sku: 'PB-S-AM' },
      { size: 'M', color: 'Azul marino', stock: 11, sku: 'PB-M-AM' },
      { size: 'L', color: 'Azul marino', stock: 8, sku: 'PB-L-AM' },
      { size: 'XL', color: 'Azul marino', stock: 5, sku: 'PB-XL-AM' },
      { size: 'M', color: 'Crema', stock: 7, sku: 'PB-M-CR' },
      { size: 'L', color: 'Crema', stock: 6, sku: 'PB-L-CR' },
    ],
  },
  {
    name: 'Camiseta Graphic Malecón',
    slug: 'camiseta-graphic-malecon',
    description:
      'Camiseta gráfica de algodón peinado con fit relajado. Aporta color y personalidad sin dejar de ser fácil de llevar en un armario diario.',
    price: 119900,
    active: true,
    images: [
      { url: '/products/sunset-vibes-tee.jpg', alt: 'Camiseta Graphic Malecón vista frontal', sortOrder: 0 },
      { url: '/products/tropical-palms-tee.jpg', alt: 'Camiseta Graphic Malecón detalle de estampado', sortOrder: 1 },
    ],
    variants: [
      { size: 'S', color: 'Coral', stock: 9, sku: 'CGM-S-CO' },
      { size: 'M', color: 'Coral', stock: 12, sku: 'CGM-M-CO' },
      { size: 'L', color: 'Coral', stock: 8, sku: 'CGM-L-CO' },
      { size: 'XL', color: 'Coral', stock: 4, sku: 'CGM-XL-CO' },
      { size: 'M', color: 'Negro', stock: 10, sku: 'CGM-M-NE' },
      { size: 'L', color: 'Negro', stock: 7, sku: 'CGM-L-NE' },
    ],
  },
  {
    name: 'Camisa Resort Palma',
    slug: 'camisa-resort-palma',
    description:
      'Camisa resort de manga corta con caída amplia y textura fresca. Hecha para climas cálidos, vacaciones y looks relajados con intención.',
    price: 179900,
    active: true,
    images: [
      { url: '/products/tropical-palms-tee.jpg', alt: 'Camisa Resort Palma vista frontal', sortOrder: 0 },
      { url: '/products/classic-white-tee.jpg', alt: 'Camisa Resort Palma detalle de cuello', sortOrder: 1 },
    ],
    variants: [
      { size: 'S', color: 'Verde palma', stock: 4, sku: 'CRP-S-VP' },
      { size: 'M', color: 'Verde palma', stock: 8, sku: 'CRP-M-VP' },
      { size: 'L', color: 'Verde palma', stock: 6, sku: 'CRP-L-VP' },
      { size: 'XL', color: 'Verde palma', stock: 3, sku: 'CRP-XL-VP' },
      { size: 'M', color: 'Blanco humo', stock: 5, sku: 'CRP-M-BH' },
      { size: 'L', color: 'Blanco humo', stock: 5, sku: 'CRP-L-BH' },
    ],
  },
  {
    name: 'Hoodie Puerto Norte',
    slug: 'hoodie-puerto-norte',
    description:
      'Hoodie liviano para noches frescas, viajes o días de trabajo informal. Interior suave, capucha estructurada y fit cómodo sin exceso de volumen.',
    price: 209900,
    active: true,
    images: [
      { url: '/products/ocean-breeze-tee.jpg', alt: 'Hoodie Puerto Norte vista frontal', sortOrder: 0 },
      { url: '/products/sunset-vibes-tee.jpg', alt: 'Hoodie Puerto Norte vista de espalda', sortOrder: 1 },
    ],
    variants: [
      { size: 'S', color: 'Grafito', stock: 3, sku: 'HPN-S-GR' },
      { size: 'M', color: 'Grafito', stock: 6, sku: 'HPN-M-GR' },
      { size: 'L', color: 'Grafito', stock: 5, sku: 'HPN-L-GR' },
      { size: 'XL', color: 'Grafito', stock: 2, sku: 'HPN-XL-GR' },
      { size: 'M', color: 'Arena', stock: 4, sku: 'HPN-M-AR' },
      { size: 'L', color: 'Arena', stock: 3, sku: 'HPN-L-AR' },
    ],
  },
]

async function main() {
  await prisma.productImage.deleteMany()
  await prisma.productVariant.deleteMany()
  await prisma.product.deleteMany()

  for (const product of productSeeds) {
    await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        active: product.active,
        images: {
          create: product.images,
        },
        variants: {
          create: product.variants,
        },
      },
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
