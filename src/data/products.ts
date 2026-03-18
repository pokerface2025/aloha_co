export type Size = "S" | "M" | "L" | "XL"
export type FitType = "oversize" | "regular"

export interface Variant {
  variantId: string
  size: Size
  colorName: string
  colorHex: string
  sku: string
  stock: number
}

export interface Media {
  images: string[]
  video?: string
}

export interface Product {
  id: string
  slug: string
  name: string
  badge?: string
  isHotSale: boolean
  isNew: boolean
  price: number
  compareAtPrice: number
  fitType: FitType
  materials: string[]
  care: string[]
  collection: "Relax Essentials" | "Costa Classics" | "Nueva Colección"
  collectionSlugs: string[]
  tags: string[]
  shortDescription: string
  fullDescription: {
    paragraphs: [string, string]
    benefits: [string, string, string, string]
  }
  media: Media
  variants: Variant[]
}

const IMAGES = [
  "/products/placeholder-1.jpg",
  "/products/placeholder-2.jpg",
  "/products/placeholder-3.jpg",
]

const VIDEO = "/products/placeholder-video.mp4"

const MATERIALS = [
  "Algodón premium (placeholder)",
  "Tela fresca para clima cálido",
]

const CARE = [
  "Lavar al revés",
  "No usar blanqueador",
  "Secado a la sombra",
]

export const products: Product[] = [
  {
    id: "prod-001",
    slug: "aloha-brisa",
    name: "ALOHA Brisa",
    isHotSale: false,
    isNew: false,
    price: 129900,
    compareAtPrice: 159900,
    fitType: "regular",
    materials: MATERIALS,
    care: CARE,
    collection: "Relax Essentials",
    collectionSlugs: ["relax-essentials", "costa-classics"],
    tags: ["premium", "costeño", "unisex", "algodón", "fresco"],
    shortDescription: "Ligera y versátil, pensada para tu ritmo diario en la costa.",
    fullDescription: {
      paragraphs: [
        "Una camiseta esencial que te acompaña con calma y estilo. Su tacto suave y su caída equilibrada la hacen perfecta para planes largos.",
        "Combínala con denim o lino y mantén siempre ese aire fresco de Barranquilla, sin esfuerzo.",
      ],
      benefits: [
        "Caida limpia que favorece cualquier look.",
        "Sensacion fresca para dias calidos.",
        "Costuras suaves para uso prolongado.",
        "Paleta costera facil de combinar.",
      ],
    },
    media: {
      images: IMAGES,
    },
    variants: [
      { variantId: "brisa-s-arena", size: "S", colorName: "Arena", colorHex: "#E8DCC8", sku: "ALOHA-BRISA-REG-S-ARENA", stock: 18 },
      { variantId: "brisa-m-arena", size: "M", colorName: "Arena", colorHex: "#E8DCC8", sku: "ALOHA-BRISA-REG-M-ARENA", stock: 22 },
      { variantId: "brisa-l-arena", size: "L", colorName: "Arena", colorHex: "#E8DCC8", sku: "ALOHA-BRISA-REG-L-ARENA", stock: 20 },
      { variantId: "brisa-xl-arena", size: "XL", colorName: "Arena", colorHex: "#E8DCC8", sku: "ALOHA-BRISA-REG-XL-ARENA", stock: 14 },
      { variantId: "brisa-s-mar", size: "S", colorName: "Mar", colorHex: "#0EA5A4", sku: "ALOHA-BRISA-REG-S-MAR", stock: 16 },
      { variantId: "brisa-m-mar", size: "M", colorName: "Mar", colorHex: "#0EA5A4", sku: "ALOHA-BRISA-REG-M-MAR", stock: 20 },
      { variantId: "brisa-l-mar", size: "L", colorName: "Mar", colorHex: "#0EA5A4", sku: "ALOHA-BRISA-REG-L-MAR", stock: 18 },
      { variantId: "brisa-xl-mar", size: "XL", colorName: "Mar", colorHex: "#0EA5A4", sku: "ALOHA-BRISA-REG-XL-MAR", stock: 12 },
    ],
  },
  {
    id: "prod-002",
    slug: "aloha-mar-abierto",
    name: "ALOHA Mar Abierto",
    isHotSale: false,
    isNew: false,
    price: 149900,
    compareAtPrice: 189900,
    fitType: "oversize",
    materials: MATERIALS,
    care: CARE,
    collection: "Costa Classics",
    collectionSlugs: ["costa-classics", "relax-essentials"],
    tags: ["premium", "costeño", "unisex", "playa", "fresco"],
    shortDescription: "Oversize amplio con vibra marina y presencia relajada.",
    fullDescription: {
      paragraphs: [
        "Mar Abierto trae un corte generoso que se mueve contigo. Ideal para tardes largas con brisa y sol suave.",
        "Su silueta oversize aporta actitud y comodidad sin perder un acabado premium.",
      ],
      benefits: [
        "Oversize equilibrado para un look moderno.",
        "Tela ligera que respira con facilidad.",
        "Acabado premium en cuello y mangas.",
        "Colores inspirados en el mar caribe.",
      ],
    },
    media: {
      images: IMAGES,
      video: VIDEO,
    },
    variants: [
      { variantId: "marabierto-s-mar", size: "S", colorName: "Mar", colorHex: "#0EA5A4", sku: "ALOHA-MARABIERTO-OV-S-MAR", stock: 12 },
      { variantId: "marabierto-m-mar", size: "M", colorName: "Mar", colorHex: "#0EA5A4", sku: "ALOHA-MARABIERTO-OV-M-MAR", stock: 16 },
      { variantId: "marabierto-l-mar", size: "L", colorName: "Mar", colorHex: "#0EA5A4", sku: "ALOHA-MARABIERTO-OV-L-MAR", stock: 14 },
      { variantId: "marabierto-xl-mar", size: "XL", colorName: "Mar", colorHex: "#0EA5A4", sku: "ALOHA-MARABIERTO-OV-XL-MAR", stock: 10 },
      { variantId: "marabierto-s-noche", size: "S", colorName: "Noche", colorHex: "#0B1220", sku: "ALOHA-MARABIERTO-OV-S-NOCHE", stock: 11 },
      { variantId: "marabierto-m-noche", size: "M", colorName: "Noche", colorHex: "#0B1220", sku: "ALOHA-MARABIERTO-OV-M-NOCHE", stock: 15 },
      { variantId: "marabierto-l-noche", size: "L", colorName: "Noche", colorHex: "#0B1220", sku: "ALOHA-MARABIERTO-OV-L-NOCHE", stock: 13 },
      { variantId: "marabierto-xl-noche", size: "XL", colorName: "Noche", colorHex: "#0B1220", sku: "ALOHA-MARABIERTO-OV-XL-NOCHE", stock: 9 },
      { variantId: "marabierto-s-blanco", size: "S", colorName: "Blanco Hueso", colorHex: "#F7F4ED", sku: "ALOHA-MARABIERTO-OV-S-BLANCOHUESO", stock: 12 },
      { variantId: "marabierto-m-blanco", size: "M", colorName: "Blanco Hueso", colorHex: "#F7F4ED", sku: "ALOHA-MARABIERTO-OV-M-BLANCOHUESO", stock: 16 },
      { variantId: "marabierto-l-blanco", size: "L", colorName: "Blanco Hueso", colorHex: "#F7F4ED", sku: "ALOHA-MARABIERTO-OV-L-BLANCOHUESO", stock: 14 },
      { variantId: "marabierto-xl-blanco", size: "XL", colorName: "Blanco Hueso", colorHex: "#F7F4ED", sku: "ALOHA-MARABIERTO-OV-XL-BLANCOHUESO", stock: 10 },
    ],
  },
  {
    id: "prod-003",
    slug: "aloha-arena-fina",
    name: "ALOHA Arena Fina",
    isHotSale: false,
    isNew: false,
    price: 119900,
    compareAtPrice: 149900,
    fitType: "regular",
    materials: MATERIALS,
    care: CARE,
    collection: "Relax Essentials",
    collectionSlugs: ["relax-essentials"],
    tags: ["premium", "unisex", "algodón", "fresco", "playa"],
    shortDescription: "Regular fit con tono arena y sensacion suave al tacto.",
    fullDescription: {
      paragraphs: [
        "Arena Fina es esa camiseta que se siente limpia y pulida desde el primer uso. Diseñada para verte bien sin esfuerzo.",
        "La silueta regular mantiene una linea ordenada y comoda, ideal para el dia a dia.",
      ],
      benefits: [
        "Fit regular con caida precisa.",
        "Color arena facil de combinar.",
        "Textura suave que no pesa.",
        "Ideal para climas calidos.",
      ],
    },
    media: {
      images: IMAGES,
    },
    variants: [
      { variantId: "arenafina-s-arena", size: "S", colorName: "Arena", colorHex: "#E8DCC8", sku: "ALOHA-ARENAF-REG-S-ARENA", stock: 20 },
      { variantId: "arenafina-m-arena", size: "M", colorName: "Arena", colorHex: "#E8DCC8", sku: "ALOHA-ARENAF-REG-M-ARENA", stock: 24 },
      { variantId: "arenafina-l-arena", size: "L", colorName: "Arena", colorHex: "#E8DCC8", sku: "ALOHA-ARENAF-REG-L-ARENA", stock: 22 },
      { variantId: "arenafina-xl-arena", size: "XL", colorName: "Arena", colorHex: "#E8DCC8", sku: "ALOHA-ARENAF-REG-XL-ARENA", stock: 16 },
      { variantId: "arenafina-s-blanco", size: "S", colorName: "Blanco Hueso", colorHex: "#F7F4ED", sku: "ALOHA-ARENAF-REG-S-BLANCOHUESO", stock: 18 },
      { variantId: "arenafina-m-blanco", size: "M", colorName: "Blanco Hueso", colorHex: "#F7F4ED", sku: "ALOHA-ARENAF-REG-M-BLANCOHUESO", stock: 22 },
      { variantId: "arenafina-l-blanco", size: "L", colorName: "Blanco Hueso", colorHex: "#F7F4ED", sku: "ALOHA-ARENAF-REG-L-BLANCOHUESO", stock: 20 },
      { variantId: "arenafina-xl-blanco", size: "XL", colorName: "Blanco Hueso", colorHex: "#F7F4ED", sku: "ALOHA-ARENAF-REG-XL-BLANCOHUESO", stock: 14 },
    ],
  },
  {
    id: "prod-004",
    slug: "aloha-atardecer",
    name: "ALOHA Atardecer",
    badge: "Nueva cápsula",
    isHotSale: false,
    isNew: false,
    price: 154900,
    compareAtPrice: 194900,
    fitType: "oversize",
    materials: MATERIALS,
    care: CARE,
    collection: "Costa Classics",
    collectionSlugs: ["costa-classics"],
    tags: ["premium", "costeño", "unisex", "playa", "urbano"],
    shortDescription: "Oversize con tonos calidos inspirados en el cielo del Malecon.",
    fullDescription: {
      paragraphs: [
        "Atardecer captura esa luz dorada que cae sobre Barranquilla. Su oversize fluye y se siente ligero.",
        "Pensada para destacar con discrecion, con detalles simples y bien acabados.",
      ],
      benefits: [
        "Silueta amplia con buen drapeado.",
        "Colores calidos de temporada.",
        "Perfecta para planes de tarde.",
        "Se adapta a looks urbanos o relax.",
      ],
    },
    media: {
      images: IMAGES,
      video: VIDEO,
    },
    variants: [
      { variantId: "atardecer-s-coral", size: "S", colorName: "Coral Suave", colorHex: "#FF7A6E", sku: "ALOHA-ATARDECER-OV-S-CORALSUAVE", stock: 12 },
      { variantId: "atardecer-m-coral", size: "M", colorName: "Coral Suave", colorHex: "#FF7A6E", sku: "ALOHA-ATARDECER-OV-M-CORALSUAVE", stock: 16 },
      { variantId: "atardecer-l-coral", size: "L", colorName: "Coral Suave", colorHex: "#FF7A6E", sku: "ALOHA-ATARDECER-OV-L-CORALSUAVE", stock: 14 },
      { variantId: "atardecer-xl-coral", size: "XL", colorName: "Coral Suave", colorHex: "#FF7A6E", sku: "ALOHA-ATARDECER-OV-XL-CORALSUAVE", stock: 10 },
      { variantId: "atardecer-s-noche", size: "S", colorName: "Noche", colorHex: "#0B1220", sku: "ALOHA-ATARDECER-OV-S-NOCHE", stock: 11 },
      { variantId: "atardecer-m-noche", size: "M", colorName: "Noche", colorHex: "#0B1220", sku: "ALOHA-ATARDECER-OV-M-NOCHE", stock: 15 },
      { variantId: "atardecer-l-noche", size: "L", colorName: "Noche", colorHex: "#0B1220", sku: "ALOHA-ATARDECER-OV-L-NOCHE", stock: 13 },
      { variantId: "atardecer-xl-noche", size: "XL", colorName: "Noche", colorHex: "#0B1220", sku: "ALOHA-ATARDECER-OV-XL-NOCHE", stock: 9 },
    ],
  },
  {
    id: "prod-005",
    slug: "aloha-malecon",
    name: "ALOHA Malecon",
    isHotSale: false,
    isNew: false,
    price: 134900,
    compareAtPrice: 169900,
    fitType: "regular",
    materials: MATERIALS,
    care: CARE,
    collection: "Costa Classics",
    collectionSlugs: ["costa-classics", "relax-essentials"],
    tags: ["premium", "costeño", "unisex", "algodón", "urbano"],
    shortDescription: "Regular fit elegante para caminar la ciudad con calma.",
    fullDescription: {
      paragraphs: [
        "Malecon es equilibrio entre comodidad y presencia. Un fit limpio que acompaña bien cualquier plan.",
        "Su estructura regular mantiene la forma y se siente premium todo el dia.",
      ],
      benefits: [
        "Corte regular con buena estructura.",
        "Acabados finos y duraderos.",
        "Ideal para looks casuales premium.",
        "Color neutro con vibra costera.",
      ],
    },
    media: {
      images: IMAGES,
    },
    variants: [
      { variantId: "malecon-s-blanco", size: "S", colorName: "Blanco Hueso", colorHex: "#F7F4ED", sku: "ALOHA-MALECON-REG-S-BLANCOHUESO", stock: 20 },
      { variantId: "malecon-m-blanco", size: "M", colorName: "Blanco Hueso", colorHex: "#F7F4ED", sku: "ALOHA-MALECON-REG-M-BLANCOHUESO", stock: 24 },
      { variantId: "malecon-l-blanco", size: "L", colorName: "Blanco Hueso", colorHex: "#F7F4ED", sku: "ALOHA-MALECON-REG-L-BLANCOHUESO", stock: 22 },
      { variantId: "malecon-xl-blanco", size: "XL", colorName: "Blanco Hueso", colorHex: "#F7F4ED", sku: "ALOHA-MALECON-REG-XL-BLANCOHUESO", stock: 16 },
      { variantId: "malecon-s-verde", size: "S", colorName: "Verde Palma", colorHex: "#1F7A4D", sku: "ALOHA-MALECON-REG-S-VERDEPALMA", stock: 14 },
      { variantId: "malecon-m-verde", size: "M", colorName: "Verde Palma", colorHex: "#1F7A4D", sku: "ALOHA-MALECON-REG-M-VERDEPALMA", stock: 18 },
      { variantId: "malecon-l-verde", size: "L", colorName: "Verde Palma", colorHex: "#1F7A4D", sku: "ALOHA-MALECON-REG-L-VERDEPALMA", stock: 16 },
      { variantId: "malecon-xl-verde", size: "XL", colorName: "Verde Palma", colorHex: "#1F7A4D", sku: "ALOHA-MALECON-REG-XL-VERDEPALMA", stock: 12 },
    ],
  },
  {
    id: "prod-006",
    slug: "aloha-palma-real",
    name: "ALOHA Palma Real",
    isHotSale: false,
    isNew: false,
    price: 152900,
    compareAtPrice: 192900,
    fitType: "oversize",
    materials: MATERIALS,
    care: CARE,
    collection: "Relax Essentials",
    collectionSlugs: ["relax-essentials"],
    tags: ["premium", "unisex", "playa", "fresco", "algodón"],
    shortDescription: "Oversize comodo con tono verde palma, listo para el calor.",
    fullDescription: {
      paragraphs: [
        "Palma Real se inspira en los espacios verdes del Caribe. Su fit amplio te da libertad sin perder estilo.",
        "Perfecta para dias de sol, con una sensacion suave que acompaña tu movimiento.",
      ],
      benefits: [
        "Oversize relajado y versatil.",
        "Verde palma con presencia natural.",
        "Tela ligera para clima calido.",
        "Acabado premium en cada detalle.",
      ],
    },
    media: {
      images: IMAGES,
    },
    variants: [
      { variantId: "palmareal-s-verde", size: "S", colorName: "Verde Palma", colorHex: "#1F7A4D", sku: "ALOHA-PALMA-OV-S-VERDEPALMA", stock: 12 },
      { variantId: "palmareal-m-verde", size: "M", colorName: "Verde Palma", colorHex: "#1F7A4D", sku: "ALOHA-PALMA-OV-M-VERDEPALMA", stock: 16 },
      { variantId: "palmareal-l-verde", size: "L", colorName: "Verde Palma", colorHex: "#1F7A4D", sku: "ALOHA-PALMA-OV-L-VERDEPALMA", stock: 14 },
      { variantId: "palmareal-xl-verde", size: "XL", colorName: "Verde Palma", colorHex: "#1F7A4D", sku: "ALOHA-PALMA-OV-XL-VERDEPALMA", stock: 10 },
      { variantId: "palmareal-s-arena", size: "S", colorName: "Arena", colorHex: "#E8DCC8", sku: "ALOHA-PALMA-OV-S-ARENA", stock: 11 },
      { variantId: "palmareal-m-arena", size: "M", colorName: "Arena", colorHex: "#E8DCC8", sku: "ALOHA-PALMA-OV-M-ARENA", stock: 15 },
      { variantId: "palmareal-l-arena", size: "L", colorName: "Arena", colorHex: "#E8DCC8", sku: "ALOHA-PALMA-OV-L-ARENA", stock: 13 },
      { variantId: "palmareal-xl-arena", size: "XL", colorName: "Arena", colorHex: "#E8DCC8", sku: "ALOHA-PALMA-OV-XL-ARENA", stock: 9 },
    ],
  },
  {
    id: "prod-007",
    slug: "aloha-barrio-cool",
    name: "ALOHA Barrio Cool",
    badge: "Edicion limitada",
    isHotSale: false,
    isNew: false,
    price: 159900,
    compareAtPrice: 199900,
    fitType: "oversize",
    materials: MATERIALS,
    care: CARE,
    collection: "Costa Classics",
    collectionSlugs: ["costa-classics"],
    tags: ["premium", "costeño", "unisex", "urbano", "playa"],
    shortDescription: "Oversize urbano con energia fresca y limpia.",
    fullDescription: {
      paragraphs: [
        "Barrio Cool mezcla la vibra local con un fit amplio y relajado. Pensada para moverte con actitud.",
        "Una prenda protagonista que se siente premium y lista para cualquier plan.",
      ],
      benefits: [
        "Oversize con presencia urbana.",
        "Suavidad premium al contacto.",
        "Colores que elevan el look.",
        "Comodidad para uso diario.",
      ],
    },
    media: {
      images: IMAGES,
      video: VIDEO,
    },
    variants: [
      { variantId: "barriocool-s-noche", size: "S", colorName: "Noche", colorHex: "#0B1220", sku: "ALOHA-BARRIO-OV-S-NOCHE", stock: 10 },
      { variantId: "barriocool-m-noche", size: "M", colorName: "Noche", colorHex: "#0B1220", sku: "ALOHA-BARRIO-OV-M-NOCHE", stock: 14 },
      { variantId: "barriocool-l-noche", size: "L", colorName: "Noche", colorHex: "#0B1220", sku: "ALOHA-BARRIO-OV-L-NOCHE", stock: 12 },
      { variantId: "barriocool-xl-noche", size: "XL", colorName: "Noche", colorHex: "#0B1220", sku: "ALOHA-BARRIO-OV-XL-NOCHE", stock: 8 },
      { variantId: "barriocool-s-coralsuave", size: "S", colorName: "Coral Suave", colorHex: "#FF7A6E", sku: "ALOHA-BARRIO-OV-S-CORALSUAVE", stock: 9 },
      { variantId: "barriocool-m-coralsuave", size: "M", colorName: "Coral Suave", colorHex: "#FF7A6E", sku: "ALOHA-BARRIO-OV-M-CORALSUAVE", stock: 13 },
      { variantId: "barriocool-l-coralsuave", size: "L", colorName: "Coral Suave", colorHex: "#FF7A6E", sku: "ALOHA-BARRIO-OV-L-CORALSUAVE", stock: 11 },
      { variantId: "barriocool-xl-coralsuave", size: "XL", colorName: "Coral Suave", colorHex: "#FF7A6E", sku: "ALOHA-BARRIO-OV-XL-CORALSUAVE", stock: 7 },
      { variantId: "barriocool-s-blanco", size: "S", colorName: "Blanco Hueso", colorHex: "#F7F4ED", sku: "ALOHA-BARRIO-OV-S-BLANCOHUESO", stock: 10 },
      { variantId: "barriocool-m-blanco", size: "M", colorName: "Blanco Hueso", colorHex: "#F7F4ED", sku: "ALOHA-BARRIO-OV-M-BLANCOHUESO", stock: 14 },
      { variantId: "barriocool-l-blanco", size: "L", colorName: "Blanco Hueso", colorHex: "#F7F4ED", sku: "ALOHA-BARRIO-OV-L-BLANCOHUESO", stock: 12 },
      { variantId: "barriocool-xl-blanco", size: "XL", colorName: "Blanco Hueso", colorHex: "#F7F4ED", sku: "ALOHA-BARRIO-OV-XL-BLANCOHUESO", stock: 8 },
    ],
  },
  {
    id: "prod-008",
    slug: "aloha-salitre",
    name: "ALOHA Salitre",
    isHotSale: false,
    isNew: false,
    price: 124900,
    compareAtPrice: 154900,
    fitType: "regular",
    materials: MATERIALS,
    care: CARE,
    collection: "Relax Essentials",
    collectionSlugs: ["relax-essentials"],
    tags: ["premium", "costeño", "unisex", "fresco", "playa"],
    shortDescription: "Regular fit con sensacion limpia y fresca, ideal para clima calido.",
    fullDescription: {
      paragraphs: [
        "Salitre tiene un look pulido y relajado, pensado para el dia a dia cerca del mar.",
        "Sus colores suaves mantienen un aire premium sin perder frescura.",
      ],
      benefits: [
        "Regular fit facil de llevar.",
        "Tejido ligero con buena transpiracion.",
        "Colores suaves con vibra costera.",
        "Acabados limpios y duraderos.",
      ],
    },
    media: {
      images: IMAGES,
    },
    variants: [
      { variantId: "salitre-s-mar", size: "S", colorName: "Mar", colorHex: "#0EA5A4", sku: "ALOHA-SALITRE-REG-S-MAR", stock: 18 },
      { variantId: "salitre-m-mar", size: "M", colorName: "Mar", colorHex: "#0EA5A4", sku: "ALOHA-SALITRE-REG-M-MAR", stock: 22 },
      { variantId: "salitre-l-mar", size: "L", colorName: "Mar", colorHex: "#0EA5A4", sku: "ALOHA-SALITRE-REG-L-MAR", stock: 20 },
      { variantId: "salitre-xl-mar", size: "XL", colorName: "Mar", colorHex: "#0EA5A4", sku: "ALOHA-SALITRE-REG-XL-MAR", stock: 14 },
      { variantId: "salitre-s-arena", size: "S", colorName: "Arena", colorHex: "#E8DCC8", sku: "ALOHA-SALITRE-REG-S-ARENA", stock: 16 },
      { variantId: "salitre-m-arena", size: "M", colorName: "Arena", colorHex: "#E8DCC8", sku: "ALOHA-SALITRE-REG-M-ARENA", stock: 20 },
      { variantId: "salitre-l-arena", size: "L", colorName: "Arena", colorHex: "#E8DCC8", sku: "ALOHA-SALITRE-REG-L-ARENA", stock: 18 },
      { variantId: "salitre-xl-arena", size: "XL", colorName: "Arena", colorHex: "#E8DCC8", sku: "ALOHA-SALITRE-REG-XL-ARENA", stock: 12 },
    ],
  },
  {
    id: "prod-009",
    slug: "aloha-nuevo-sol",
    name: "ALOHA Nuevo Sol",
    badge: "Hot Sale",
    isHotSale: true,
    isNew: true,
    price: 164900,
    compareAtPrice: 209900,
    fitType: "oversize",
    materials: MATERIALS,
    care: CARE,
    collection: "Nueva Colección",
    collectionSlugs: ["nueva-coleccion"],
    tags: ["premium", "costeño", "unisex", "playa", "fresco"],
    shortDescription: "Nueva coleccion con oversize luminoso y energia fresca.",
    fullDescription: {
      paragraphs: [
        "Nuevo Sol llega con un fit amplio y un color que ilumina. Es la pieza clave para estrenar temporada.",
        "Su sensacion premium y su caida suave hacen que quieras usarla una y otra vez.",
      ],
      benefits: [
        "Oversize moderno y comodo.",
        "Colores vibrantes con balance premium.",
        "Ideal para dias de sol y brisa.",
        "Acabado suave y duradero.",
      ],
    },
    media: {
      images: IMAGES,
      video: VIDEO,
    },
    variants: [
      { variantId: "nuevosol-s-coralsuave", size: "S", colorName: "Coral Suave", colorHex: "#FF7A6E", sku: "ALOHA-NUEVOSOL-OV-S-CORALSUAVE", stock: 12 },
      { variantId: "nuevosol-m-coralsuave", size: "M", colorName: "Coral Suave", colorHex: "#FF7A6E", sku: "ALOHA-NUEVOSOL-OV-M-CORALSUAVE", stock: 16 },
      { variantId: "nuevosol-l-coralsuave", size: "L", colorName: "Coral Suave", colorHex: "#FF7A6E", sku: "ALOHA-NUEVOSOL-OV-L-CORALSUAVE", stock: 14 },
      { variantId: "nuevosol-xl-coralsuave", size: "XL", colorName: "Coral Suave", colorHex: "#FF7A6E", sku: "ALOHA-NUEVOSOL-OV-XL-CORALSUAVE", stock: 10 },
      { variantId: "nuevosol-s-blanco", size: "S", colorName: "Blanco Hueso", colorHex: "#F7F4ED", sku: "ALOHA-NUEVOSOL-OV-S-BLANCOHUESO", stock: 11 },
      { variantId: "nuevosol-m-blanco", size: "M", colorName: "Blanco Hueso", colorHex: "#F7F4ED", sku: "ALOHA-NUEVOSOL-OV-M-BLANCOHUESO", stock: 15 },
      { variantId: "nuevosol-l-blanco", size: "L", colorName: "Blanco Hueso", colorHex: "#F7F4ED", sku: "ALOHA-NUEVOSOL-OV-L-BLANCOHUESO", stock: 13 },
      { variantId: "nuevosol-xl-blanco", size: "XL", colorName: "Blanco Hueso", colorHex: "#F7F4ED", sku: "ALOHA-NUEVOSOL-OV-XL-BLANCOHUESO", stock: 9 },
      { variantId: "nuevosol-s-mar", size: "S", colorName: "Mar", colorHex: "#0EA5A4", sku: "ALOHA-NUEVOSOL-OV-S-MAR", stock: 12 },
      { variantId: "nuevosol-m-mar", size: "M", colorName: "Mar", colorHex: "#0EA5A4", sku: "ALOHA-NUEVOSOL-OV-M-MAR", stock: 16 },
      { variantId: "nuevosol-l-mar", size: "L", colorName: "Mar", colorHex: "#0EA5A4", sku: "ALOHA-NUEVOSOL-OV-L-MAR", stock: 14 },
      { variantId: "nuevosol-xl-mar", size: "XL", colorName: "Mar", colorHex: "#0EA5A4", sku: "ALOHA-NUEVOSOL-OV-XL-MAR", stock: 10 },
    ],
  },
  {
    id: "prod-010",
    slug: "aloha-marea-viva",
    name: "ALOHA Marea Viva",
    badge: "Hot Sale",
    isHotSale: true,
    isNew: true,
    price: 139900,
    compareAtPrice: 179900,
    fitType: "regular",
    materials: MATERIALS,
    care: CARE,
    collection: "Nueva Colección",
    collectionSlugs: ["nueva-coleccion"],
    tags: ["premium", "costeño", "unisex", "algodón", "fresco"],
    shortDescription: "Regular fit fresco y elegante, parte de la nueva coleccion.",
    fullDescription: {
      paragraphs: [
        "Marea Viva es una pieza nueva con vibra limpia y premium. Su fit regular cae justo donde debe.",
        "Es la camiseta que te acompaña de dia a noche con comodidad total.",
      ],
      benefits: [
        "Fit regular con linea precisa.",
        "Colores costeros con balance premium.",
        "Tejido suave para clima calido.",
        "Acabado de alta calidad.",
      ],
    },
    media: {
      images: IMAGES,
      video: VIDEO,
    },
    variants: [
      { variantId: "mareaviva-s-arena", size: "S", colorName: "Arena", colorHex: "#E8DCC8", sku: "ALOHA-MAREAVIVA-REG-S-ARENA", stock: 16 },
      { variantId: "mareaviva-m-arena", size: "M", colorName: "Arena", colorHex: "#E8DCC8", sku: "ALOHA-MAREAVIVA-REG-M-ARENA", stock: 20 },
      { variantId: "mareaviva-l-arena", size: "L", colorName: "Arena", colorHex: "#E8DCC8", sku: "ALOHA-MAREAVIVA-REG-L-ARENA", stock: 18 },
      { variantId: "mareaviva-xl-arena", size: "XL", colorName: "Arena", colorHex: "#E8DCC8", sku: "ALOHA-MAREAVIVA-REG-XL-ARENA", stock: 12 },
      { variantId: "mareaviva-s-noche", size: "S", colorName: "Noche", colorHex: "#0B1220", sku: "ALOHA-MAREAVIVA-REG-S-NOCHE", stock: 14 },
      { variantId: "mareaviva-m-noche", size: "M", colorName: "Noche", colorHex: "#0B1220", sku: "ALOHA-MAREAVIVA-REG-M-NOCHE", stock: 18 },
      { variantId: "mareaviva-l-noche", size: "L", colorName: "Noche", colorHex: "#0B1220", sku: "ALOHA-MAREAVIVA-REG-L-NOCHE", stock: 16 },
      { variantId: "mareaviva-xl-noche", size: "XL", colorName: "Noche", colorHex: "#0B1220", sku: "ALOHA-MAREAVIVA-REG-XL-NOCHE", stock: 10 },
    ],
  },
]
