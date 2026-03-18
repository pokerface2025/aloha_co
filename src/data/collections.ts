export interface CollectionHeroMedia {
  type: "image" | "video"
  url: string
}

export interface Collection {
  id: string
  slug: string
  name: string
  description: string
  heroMedia?: CollectionHeroMedia
  accentColor?: string
}

export const collections: Collection[] = [
  {
    id: "col-001",
    slug: "colombia",
    name: "Esto es Colombia",
    description: "Herencia ancestral y alma bordada",
    heroMedia: { type: "image", url: "/collections/relax-essentials.jpg" },
    accentColor: "#E8DCC8",
  },
  {
    id: "col-002",
    slug: "plenty",
    name: "Drop Plenty",
    description: "El peso de la intención: abundancia",
    heroMedia: { type: "image", url: "/collections/costa-classics.jpg" },
    accentColor: "#0EA5A4",
  },
  {
    id: "col-003",
    slug: "dolce-vita",
    name: "Dolce Vita",
    description: "Ocio mediterráneo: de Amalfi al Caribe",
    heroMedia: { type: "video", url: "/collections/nueva-coleccion.mp4" },
    accentColor: "#FF7A6E",
  },
  {
    id: "col-004",
    slug: "quillami",
    name: "Made in Quillami",
    description: "La costa dorada: historia de dos ciudades",
    heroMedia: { type: "image", url: "/collections/quillami.jpg" },
    accentColor: "#FFF1C9",
  },
]

export function getCollections() {
  return collections
}

export function getCollectionBySlug(slug: string) {
  return collections.find((collection) => collection.slug === slug)
}
