// ============================================
// ALOHA Product Data
// ============================================
// 
// HOW TO ADD NEW PRODUCTS:
// 1. Copy one of the existing product objects below
// 2. Update all fields with your new product info
// 3. Generate a unique ID (use format: "prod-XXX")
// 4. Create a unique slug (URL-friendly, lowercase with hyphens)
// 5. Add product images to /public/products/[slug]/ folder
// 6. Set isHotSale: true and isNew: true for featured products
//
// VARIANT NOTES:
// - Each size/color combo needs a unique SKU (format: SLUG-SIZE-COLOR)
// - Stock is per variant, not per product
// - colorHex is used for the color swatch display
// ============================================

import type { Product } from './types'

export type AudienceMode = 'adult' | 'kids'

export const WHATSAPP_PHONE_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '573000000000'

export const COLOMBIAN_DEPARTMENTS = [
  'Amazonas',
  'Antioquia',
  'Arauca',
  'Atlántico',
  'Bolívar',
  'Boyacá',
  'Caldas',
  'Caquetá',
  'Casanare',
  'Cauca',
  'Cesar',
  'Chocó',
  'Córdoba',
  'Cundinamarca',
  'Guainía',
  'Guaviare',
  'Huila',
  'La Guajira',
  'Magdalena',
  'Meta',
  'Nariño',
  'Norte de Santander',
  'Putumayo',
  'Quindío',
  'Risaralda',
  'San Andrés y Providencia',
  'Santander',
  'Sucre',
  'Tolima',
  'Valle del Cauca',
  'Vaupés',
  'Vichada',
]

export const products: Product[] = [
  // ============================================
  // HOT SALE / NEW COLLECTION (2 products)
  // ============================================
  {
    id: 'prod-001',
    slug: 'costa-vibes-oversize',
    name: 'Costa Vibes',
    description: 'Nuestra camiseta más cómoda para esos días de brisa costera. Corte oversize con caída perfecta, ideal para combinar con todo. Algodón premium 100% que respira con vos.',
    shortDescription: 'Oversize premium para tu mood playero',
    price: 89900,
    compareAtPrice: 119900,
    fitType: 'oversize',
    tags: ['oversize', 'premium', 'nuevo', 'kids'],
    collectionSlugs: ['dolce-vita'],
    collectionId: 'dolce-vita',
    category: 'kids',
    isHotSale: true,
    isNew: true,
    variants: [
      { size: 'S', color: 'Arena', colorHex: '#E8DFD0', stock: 15, sku: 'COSTA-S-ARENA' },
      { size: 'M', color: 'Arena', colorHex: '#E8DFD0', stock: 20, sku: 'COSTA-M-ARENA' },
      { size: 'L', color: 'Arena', colorHex: '#E8DFD0', stock: 18, sku: 'COSTA-L-ARENA' },
      { size: 'XL', color: 'Arena', colorHex: '#E8DFD0', stock: 12, sku: 'COSTA-XL-ARENA' },
      { size: 'S', color: 'Mar', colorHex: '#4A8B9E', stock: 10, sku: 'COSTA-S-MAR' },
      { size: 'M', color: 'Mar', colorHex: '#4A8B9E', stock: 15, sku: 'COSTA-M-MAR' },
      { size: 'L', color: 'Mar', colorHex: '#4A8B9E', stock: 14, sku: 'COSTA-L-MAR' },
      { size: 'XL', color: 'Mar', colorHex: '#4A8B9E', stock: 8, sku: 'COSTA-XL-MAR' },
    ],
    media: [
      { type: 'image', url: '/products/classic-white-tee.jpg', alt: 'Costa Vibes - Vista frontal' },
      { type: 'image', url: '/products/ocean-breeze-tee.jpg', alt: 'Costa Vibes - Vista posterior' },
    ],
    relatedProducts: ['prod-002', 'prod-003', 'prod-005'],
  },
  {
    id: 'prod-002',
    slug: 'atardecer-barranquilla',
    name: 'Atardecer Barranquilla',
    description: 'Inspirada en los atardeceres del Malecón, esta camiseta tiene un estampado exclusivo que captura la esencia de nuestra ciudad. Oversize relajado para máxima comodidad.',
    shortDescription: 'Oversize con el soul de la Arenosa',
    price: 99900,
    compareAtPrice: 139900,
    fitType: 'oversize',
    tags: ['oversize', 'estampado', 'nuevo', 'edición-limitada', 'kids'],
    collectionSlugs: ['dolce-vita'],
    collectionId: 'dolce-vita',
    category: 'kids',
    isHotSale: true,
    isNew: true,
    variants: [
      { size: 'S', color: 'Blanco', colorHex: '#FEFEFE', stock: 12, sku: 'ATAR-S-BLANCO' },
      { size: 'M', color: 'Blanco', colorHex: '#FEFEFE', stock: 18, sku: 'ATAR-M-BLANCO' },
      { size: 'L', color: 'Blanco', colorHex: '#FEFEFE', stock: 16, sku: 'ATAR-L-BLANCO' },
      { size: 'XL', color: 'Blanco', colorHex: '#FEFEFE', stock: 10, sku: 'ATAR-XL-BLANCO' },
      { size: 'S', color: 'Negro', colorHex: '#1A1A1A', stock: 8, sku: 'ATAR-S-NEGRO' },
      { size: 'M', color: 'Negro', colorHex: '#1A1A1A', stock: 14, sku: 'ATAR-M-NEGRO' },
      { size: 'L', color: 'Negro', colorHex: '#1A1A1A', stock: 12, sku: 'ATAR-L-NEGRO' },
      { size: 'XL', color: 'Negro', colorHex: '#1A1A1A', stock: 6, sku: 'ATAR-XL-NEGRO' },
    ],
    media: [
      { type: 'image', url: '/products/sunset-vibes-tee.jpg', alt: 'Atardecer Barranquilla - Vista frontal' },
      { type: 'image', url: '/products/tropical-palms-tee.jpg', alt: 'Atardecer Barranquilla - Vista posterior' },
    ],
    relatedProducts: ['prod-001', 'prod-004', 'prod-006'],
  },

  // ============================================
  // REGULAR COLLECTION (8 products)
  // ============================================
  {
    id: 'prod-003',
    slug: 'basica-premium',
    name: 'Básica Premium',
    description: 'La camiseta esencial que todo closet necesita. Corte regular perfecto, algodón peinado de alta calidad. Simple, elegante, atemporal.',
    shortDescription: 'Tu básica de toda la vida, elevada',
    price: 69900,
    compareAtPrice: 89900,
    fitType: 'regular',
    tags: ['regular', 'básica', 'esencial'],
    collectionSlugs: ['plenty'],
    collectionId: 'plenty',
    category: 'adult',
    isHotSale: false,
    isNew: false,
    variants: [
      { size: 'S', color: 'Blanco', colorHex: '#FEFEFE', stock: 25, sku: 'BASICA-S-BLANCO' },
      { size: 'M', color: 'Blanco', colorHex: '#FEFEFE', stock: 30, sku: 'BASICA-M-BLANCO' },
      { size: 'L', color: 'Blanco', colorHex: '#FEFEFE', stock: 28, sku: 'BASICA-L-BLANCO' },
      { size: 'XL', color: 'Blanco', colorHex: '#FEFEFE', stock: 20, sku: 'BASICA-XL-BLANCO' },
      { size: 'S', color: 'Negro', colorHex: '#1A1A1A', stock: 22, sku: 'BASICA-S-NEGRO' },
      { size: 'M', color: 'Negro', colorHex: '#1A1A1A', stock: 28, sku: 'BASICA-M-NEGRO' },
      { size: 'L', color: 'Negro', colorHex: '#1A1A1A', stock: 25, sku: 'BASICA-L-NEGRO' },
      { size: 'XL', color: 'Negro', colorHex: '#1A1A1A', stock: 18, sku: 'BASICA-XL-NEGRO' },
      { size: 'S', color: 'Gris', colorHex: '#6B6B6B', stock: 15, sku: 'BASICA-S-GRIS' },
      { size: 'M', color: 'Gris', colorHex: '#6B6B6B', stock: 20, sku: 'BASICA-M-GRIS' },
      { size: 'L', color: 'Gris', colorHex: '#6B6B6B', stock: 18, sku: 'BASICA-L-GRIS' },
      { size: 'XL', color: 'Gris', colorHex: '#6B6B6B', stock: 12, sku: 'BASICA-XL-GRIS' },
    ],
    media: [
      { type: 'image', url: '/products/classic-white-tee.jpg', alt: 'Básica Premium - Vista frontal' },
      { type: 'image', url: '/products/ocean-breeze-tee.jpg', alt: 'Básica Premium - Vista posterior' },
    ],
    relatedProducts: ['prod-004', 'prod-005', 'prod-007'],
  },
  {
    id: 'prod-004',
    slug: 'caribe-flow',
    name: 'Caribe Flow',
    description: 'Diseñada para moverte con libertad. Corte oversize con mangas caídas y acabado suave al tacto. Para esos días donde quieres estar cómodo sin sacrificar estilo.',
    shortDescription: 'Fluye con el Caribe',
    price: 84900,
    compareAtPrice: 109900,
    fitType: 'oversize',
    tags: ['oversize', 'cómoda', 'casual'],
    collectionSlugs: ['quillami'],
    collectionId: 'quillami',
    category: 'adult',
    isHotSale: false,
    isNew: false,
    variants: [
      { size: 'S', color: 'Oliva', colorHex: '#5C6B4A', stock: 14, sku: 'CARIBE-S-OLIVA' },
      { size: 'M', color: 'Oliva', colorHex: '#5C6B4A', stock: 18, sku: 'CARIBE-M-OLIVA' },
      { size: 'L', color: 'Oliva', colorHex: '#5C6B4A', stock: 16, sku: 'CARIBE-L-OLIVA' },
      { size: 'XL', color: 'Oliva', colorHex: '#5C6B4A', stock: 10, sku: 'CARIBE-XL-OLIVA' },
      { size: 'S', color: 'Terracota', colorHex: '#C4704B', stock: 10, sku: 'CARIBE-S-TERRACOTA' },
      { size: 'M', color: 'Terracota', colorHex: '#C4704B', stock: 14, sku: 'CARIBE-M-TERRACOTA' },
      { size: 'L', color: 'Terracota', colorHex: '#C4704B', stock: 12, sku: 'CARIBE-L-TERRACOTA' },
      { size: 'XL', color: 'Terracota', colorHex: '#C4704B', stock: 8, sku: 'CARIBE-XL-TERRACOTA' },
    ],
    media: [
      { type: 'image', url: '/products/tropical-palms-tee.jpg', alt: 'Caribe Flow - Vista frontal' },
      { type: 'image', url: '/products/ocean-breeze-tee.jpg', alt: 'Caribe Flow - Vista posterior' },
    ],
    relatedProducts: ['prod-001', 'prod-002', 'prod-006'],
  },
  {
    id: 'prod-005',
    slug: 'minimal-tee',
    name: 'Minimal Tee',
    description: 'Menos es más. Nuestra camiseta más minimalista con un corte regular impecable. Perfecta para quienes aprecian la simplicidad bien ejecutada.',
    shortDescription: 'Simplicidad premium',
    price: 74900,
    compareAtPrice: 94900,
    fitType: 'regular',
    tags: ['regular', 'minimalista', 'clásica'],
    collectionSlugs: ['plenty'],
    collectionId: 'plenty',
    category: 'adult',
    isHotSale: false,
    isNew: false,
    variants: [
      { size: 'S', color: 'Crema', colorHex: '#F5F0E6', stock: 16, sku: 'MINIMAL-S-CREMA' },
      { size: 'M', color: 'Crema', colorHex: '#F5F0E6', stock: 22, sku: 'MINIMAL-M-CREMA' },
      { size: 'L', color: 'Crema', colorHex: '#F5F0E6', stock: 20, sku: 'MINIMAL-L-CREMA' },
      { size: 'XL', color: 'Crema', colorHex: '#F5F0E6', stock: 14, sku: 'MINIMAL-XL-CREMA' },
      { size: 'S', color: 'Azul Marino', colorHex: '#1E3A5F', stock: 12, sku: 'MINIMAL-S-MARINO' },
      { size: 'M', color: 'Azul Marino', colorHex: '#1E3A5F', stock: 18, sku: 'MINIMAL-M-MARINO' },
      { size: 'L', color: 'Azul Marino', colorHex: '#1E3A5F', stock: 16, sku: 'MINIMAL-L-MARINO' },
      { size: 'XL', color: 'Azul Marino', colorHex: '#1E3A5F', stock: 10, sku: 'MINIMAL-XL-MARINO' },
    ],
    media: [
      { type: 'image', url: '/products/classic-white-tee.jpg', alt: 'Minimal Tee - Vista frontal' },
      { type: 'image', url: '/products/sunset-vibes-tee.jpg', alt: 'Minimal Tee - Vista posterior' },
    ],
    relatedProducts: ['prod-003', 'prod-007', 'prod-008'],
  },
  {
    id: 'prod-006',
    slug: 'brisa-marina',
    name: 'Brisa Marina',
    description: 'Ligera como la brisa del mar. Tejido especial que te mantiene fresco incluso en los días más calurosos. Corte oversize para máximo confort.',
    shortDescription: 'Frescura costeña',
    price: 79900,
    compareAtPrice: 99900,
    fitType: 'oversize',
    tags: ['oversize', 'ligera', 'verano'],
    collectionSlugs: ['colombia'],
    collectionId: 'colombia',
    category: 'adult',
    isHotSale: false,
    isNew: false,
    variants: [
      { size: 'S', color: 'Celeste', colorHex: '#A8D4E6', stock: 14, sku: 'BRISA-S-CELESTE' },
      { size: 'M', color: 'Celeste', colorHex: '#A8D4E6', stock: 18, sku: 'BRISA-M-CELESTE' },
      { size: 'L', color: 'Celeste', colorHex: '#A8D4E6', stock: 16, sku: 'BRISA-L-CELESTE' },
      { size: 'XL', color: 'Celeste', colorHex: '#A8D4E6', stock: 10, sku: 'BRISA-XL-CELESTE' },
      { size: 'S', color: 'Blanco', colorHex: '#FEFEFE', stock: 16, sku: 'BRISA-S-BLANCO' },
      { size: 'M', color: 'Blanco', colorHex: '#FEFEFE', stock: 20, sku: 'BRISA-M-BLANCO' },
      { size: 'L', color: 'Blanco', colorHex: '#FEFEFE', stock: 18, sku: 'BRISA-L-BLANCO' },
      { size: 'XL', color: 'Blanco', colorHex: '#FEFEFE', stock: 12, sku: 'BRISA-XL-BLANCO' },
    ],
    media: [
      { type: 'image', url: '/products/ocean-breeze-tee.jpg', alt: 'Brisa Marina - Vista frontal' },
      { type: 'image', url: '/products/classic-white-tee.jpg', alt: 'Brisa Marina - Vista posterior' },
    ],
    relatedProducts: ['prod-001', 'prod-004', 'prod-009'],
  },
  {
    id: 'prod-007',
    slug: 'clasica-fit',
    name: 'Clásica Fit',
    description: 'El corte clásico que nunca pasa de moda. Regular fit con proporciones perfectas, ideal para cualquier ocasión. Tu nueva favorita del día a día.',
    shortDescription: 'El clásico que siempre funciona',
    price: 72900,
    compareAtPrice: 92900,
    fitType: 'regular',
    tags: ['regular', 'clásica', 'versátil'],
    collectionSlugs: ['colombia'],
    collectionId: 'colombia',
    category: 'adult',
    isHotSale: false,
    isNew: false,
    variants: [
      { size: 'S', color: 'Blanco', colorHex: '#FEFEFE', stock: 20, sku: 'CLASICA-S-BLANCO' },
      { size: 'M', color: 'Blanco', colorHex: '#FEFEFE', stock: 25, sku: 'CLASICA-M-BLANCO' },
      { size: 'L', color: 'Blanco', colorHex: '#FEFEFE', stock: 22, sku: 'CLASICA-L-BLANCO' },
      { size: 'XL', color: 'Blanco', colorHex: '#FEFEFE', stock: 15, sku: 'CLASICA-XL-BLANCO' },
      { size: 'S', color: 'Negro', colorHex: '#1A1A1A', stock: 18, sku: 'CLASICA-S-NEGRO' },
      { size: 'M', color: 'Negro', colorHex: '#1A1A1A', stock: 22, sku: 'CLASICA-M-NEGRO' },
      { size: 'L', color: 'Negro', colorHex: '#1A1A1A', stock: 20, sku: 'CLASICA-L-NEGRO' },
      { size: 'XL', color: 'Negro', colorHex: '#1A1A1A', stock: 14, sku: 'CLASICA-XL-NEGRO' },
    ],
    media: [
      { type: 'image', url: '/products/classic-white-tee.jpg', alt: 'Clásica Fit - Vista frontal' },
      { type: 'image', url: '/products/tropical-palms-tee.jpg', alt: 'Clásica Fit - Vista posterior' },
    ],
    relatedProducts: ['prod-003', 'prod-005', 'prod-008'],
  },
  {
    id: 'prod-008',
    slug: 'urban-relax',
    name: 'Urban Relax',
    description: 'Para la vida urbana con actitud relajada. Corte regular con un toque moderno, perfecta para moverse por la ciudad con estilo propio.',
    shortDescription: 'Ciudad y relax en uno',
    price: 77900,
    compareAtPrice: 97900,
    fitType: 'regular',
    tags: ['regular', 'urbana', 'moderna'],
    collectionSlugs: ['plenty'],
    collectionId: 'plenty',
    category: 'adult',
    isHotSale: false,
    isNew: false,
    variants: [
      { size: 'S', color: 'Grafito', colorHex: '#3D3D3D', stock: 14, sku: 'URBAN-S-GRAFITO' },
      { size: 'M', color: 'Grafito', colorHex: '#3D3D3D', stock: 18, sku: 'URBAN-M-GRAFITO' },
      { size: 'L', color: 'Grafito', colorHex: '#3D3D3D', stock: 16, sku: 'URBAN-L-GRAFITO' },
      { size: 'XL', color: 'Grafito', colorHex: '#3D3D3D', stock: 10, sku: 'URBAN-XL-GRAFITO' },
      { size: 'S', color: 'Arena', colorHex: '#E8DFD0', stock: 12, sku: 'URBAN-S-ARENA' },
      { size: 'M', color: 'Arena', colorHex: '#E8DFD0', stock: 16, sku: 'URBAN-M-ARENA' },
      { size: 'L', color: 'Arena', colorHex: '#E8DFD0', stock: 14, sku: 'URBAN-L-ARENA' },
      { size: 'XL', color: 'Arena', colorHex: '#E8DFD0', stock: 8, sku: 'URBAN-XL-ARENA' },
    ],
    media: [
      { type: 'image', url: '/products/sunset-vibes-tee.jpg', alt: 'Urban Relax - Vista frontal' },
      { type: 'image', url: '/products/ocean-breeze-tee.jpg', alt: 'Urban Relax - Vista posterior' },
    ],
    relatedProducts: ['prod-005', 'prod-007', 'prod-010'],
  },
  {
    id: 'prod-009',
    slug: 'sunset-oversize',
    name: 'Sunset Oversize',
    description: 'Captura la magia del atardecer costeño. Oversize generoso con detalles sutiles que la hacen única. Para esos momentos donde quieres destacar sin esfuerzo.',
    shortDescription: 'Oversize con magia',
    price: 87900,
    compareAtPrice: 114900,
    fitType: 'oversize',
    tags: ['oversize', 'statement', 'especial'],
    collectionSlugs: ['quillami'],
    collectionId: 'quillami',
    category: 'adult',
    isHotSale: false,
    isNew: false,
    variants: [
      { size: 'S', color: 'Coral', colorHex: '#E07B5C', stock: 10, sku: 'SUNSET-S-CORAL' },
      { size: 'M', color: 'Coral', colorHex: '#E07B5C', stock: 14, sku: 'SUNSET-M-CORAL' },
      { size: 'L', color: 'Coral', colorHex: '#E07B5C', stock: 12, sku: 'SUNSET-L-CORAL' },
      { size: 'XL', color: 'Coral', colorHex: '#E07B5C', stock: 8, sku: 'SUNSET-XL-CORAL' },
      { size: 'S', color: 'Arena', colorHex: '#E8DFD0', stock: 12, sku: 'SUNSET-S-ARENA' },
      { size: 'M', color: 'Arena', colorHex: '#E8DFD0', stock: 16, sku: 'SUNSET-M-ARENA' },
      { size: 'L', color: 'Arena', colorHex: '#E8DFD0', stock: 14, sku: 'SUNSET-L-ARENA' },
      { size: 'XL', color: 'Arena', colorHex: '#E8DFD0', stock: 10, sku: 'SUNSET-XL-ARENA' },
    ],
    media: [
      { type: 'image', url: '/products/sunset-vibes-tee.jpg', alt: 'Sunset Oversize - Vista frontal' },
      { type: 'image', url: '/products/tropical-palms-tee.jpg', alt: 'Sunset Oversize - Vista posterior' },
    ],
    relatedProducts: ['prod-001', 'prod-002', 'prod-006'],
  },
  {
    id: 'prod-010',
    slug: 'everyday-tee',
    name: 'Everyday Tee',
    description: 'Tu compañera de todos los días. Corte regular versátil que funciona para todo: trabajo, paseo, o simplemente estar en casa. Comodidad garantizada.',
    shortDescription: 'Para cada momento',
    price: 67900,
    compareAtPrice: 84900,
    fitType: 'regular',
    tags: ['regular', 'versátil', 'diaria'],
    collectionSlugs: ['plenty'],
    collectionId: 'plenty',
    category: 'adult',
    isHotSale: false,
    isNew: false,
    variants: [
      { size: 'S', color: 'Blanco', colorHex: '#FEFEFE', stock: 22, sku: 'EVERYDAY-S-BLANCO' },
      { size: 'M', color: 'Blanco', colorHex: '#FEFEFE', stock: 28, sku: 'EVERYDAY-M-BLANCO' },
      { size: 'L', color: 'Blanco', colorHex: '#FEFEFE', stock: 25, sku: 'EVERYDAY-L-BLANCO' },
      { size: 'XL', color: 'Blanco', colorHex: '#FEFEFE', stock: 18, sku: 'EVERYDAY-XL-BLANCO' },
      { size: 'S', color: 'Gris Claro', colorHex: '#9A9A9A', stock: 16, sku: 'EVERYDAY-S-GRISCLARO' },
      { size: 'M', color: 'Gris Claro', colorHex: '#9A9A9A', stock: 20, sku: 'EVERYDAY-M-GRISCLARO' },
      { size: 'L', color: 'Gris Claro', colorHex: '#9A9A9A', stock: 18, sku: 'EVERYDAY-L-GRISCLARO' },
      { size: 'XL', color: 'Gris Claro', colorHex: '#9A9A9A', stock: 12, sku: 'EVERYDAY-XL-GRISCLARO' },
      { size: 'S', color: 'Negro', colorHex: '#1A1A1A', stock: 18, sku: 'EVERYDAY-S-NEGRO' },
      { size: 'M', color: 'Negro', colorHex: '#1A1A1A', stock: 24, sku: 'EVERYDAY-M-NEGRO' },
      { size: 'L', color: 'Negro', colorHex: '#1A1A1A', stock: 22, sku: 'EVERYDAY-L-NEGRO' },
      { size: 'XL', color: 'Negro', colorHex: '#1A1A1A', stock: 14, sku: 'EVERYDAY-XL-NEGRO' },
    ],
    media: [
      { type: 'image', url: '/products/classic-white-tee.jpg', alt: 'Everyday Tee - Vista frontal' },
      { type: 'image', url: '/products/ocean-breeze-tee.jpg', alt: 'Everyday Tee - Vista posterior' },
    ],
    relatedProducts: ['prod-003', 'prod-007', 'prod-008'],
  },
]

function isKidsProduct(product: Product) {
  return product.tags?.includes('kids') || product.tags?.includes('little-aloha')
}

function filterByAudience(list: Product[], audience: AudienceMode = 'adult') {
  if (audience === 'kids') {
    return list.filter(isKidsProduct)
  }
  return list
}

// Helper functions
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getHotSaleProducts(audience: AudienceMode = 'adult'): Product[] {
  return filterByAudience(products, audience).filter((p) => p.isHotSale)
}

export function getBestSellers(audience: AudienceMode = 'adult'): Product[] {
  // Mock: return first 4 non-hot-sale products as "best sellers"
  return filterByAudience(products, audience).filter((p) => !p.isHotSale).slice(0, 4)
}

export function getRelatedProducts(productId: string, audience: AudienceMode = 'adult'): Product[] {
  const product = getProductById(productId)
  if (!product) return []
  return filterByAudience(
    product.relatedProducts
    .map((id) => getProductById(id))
    .filter((p): p is Product => p !== undefined),
    audience,
  )
}

export function getUniqueColors(audience: AudienceMode = 'adult'): { color: string; colorHex: string }[] {
  const colorMap = new Map<string, string>()
  filterByAudience(products, audience).forEach((p) => {
    p.variants.forEach((v) => {
      if (!colorMap.has(v.color)) {
        colorMap.set(v.color, v.colorHex)
      }
    })
  })
  return Array.from(colorMap).map(([color, colorHex]) => ({ color, colorHex }))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function buildWhatsAppProductUrl(productName: string, slug: string): string {
  const message = encodeURIComponent(
    `Hola, quiero consultar por ${productName}. Vi este producto: /tienda/${slug}`,
  )

  return `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${message}`
}
