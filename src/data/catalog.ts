import type { FitType, Size } from "@/lib/types"
import { products, type AudienceMode } from "@/lib/products"
import { getCollections } from "@/src/data/collections"

export interface ProductFilters {
  collectionSlug?: string
  sizes?: Size[]
  fits?: FitType[]
  colors?: string[]
  priceRange?: { min?: number; max?: number }
  audience?: AudienceMode
}

export function getProducts() {
  return products
}

export function filterProducts(filters: ProductFilters) {
  const { collectionSlug, sizes, fits, colors, priceRange, audience = 'adult' } = filters

  return products.filter((product) => {
    if (audience === 'kids') {
      if (!product.tags?.includes('kids') && !product.tags?.includes('little-aloha')) {
        return false
      }
    }
    if (collectionSlug && product.collectionId !== collectionSlug) {
      return false
    }

    if (sizes && sizes.length > 0) {
      const hasSize = product.variants.some(
        (variant) => sizes.includes(variant.size) && variant.stock > 0,
      )
      if (!hasSize) return false
    }

    if (fits && fits.length > 0 && !fits.includes(product.fitType)) {
      return false
    }

    if (colors && colors.length > 0) {
      const hasColor = product.variants.some((variant) => colors.includes(variant.color))
      if (!hasColor) return false
    }

    if (priceRange?.min !== undefined && product.price < priceRange.min) {
      return false
    }

    if (priceRange?.max !== undefined && product.price > priceRange.max) {
      return false
    }

    return true
  })
}

export { getCollections }
