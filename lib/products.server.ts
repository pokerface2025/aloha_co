import 'server-only'

import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import type { Prisma } from '@prisma/client'
import { db } from '@/lib/db'

const productInclude = {
  images: {
    orderBy: {
      sortOrder: 'asc',
    },
  },
  variants: {
    orderBy: [{ color: 'asc' }, { size: 'asc' }],
  },
} satisfies Prisma.ProductInclude

type ProductRecord = Prisma.ProductGetPayload<{
  include: typeof productInclude
}>

export type CatalogFilters = {
  size?: string
  color?: string
}

export type StorefrontImage = {
  id: string
  url: string
  alt: string
  sortOrder: number
}

export type StorefrontVariant = {
  id: string
  size: string
  color: string
  stock: number
  sku: string
}

export type StorefrontProduct = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  active: boolean
  createdAt: Date
  updatedAt: Date
  images: StorefrontImage[]
  variants: StorefrontVariant[]
  totalStock: number
  availableSizes: string[]
  availableColors: string[]
}

export type CatalogFilterOptions = {
  sizes: string[]
  colors: string[]
}

export type ProductPurchaseSnapshot = {
  productId: string
  slug: string
  name: string
  price: number
  variant: StorefrontVariant
  primaryImage: StorefrontImage | null
}

export const PRODUCT_CACHE_TAG = 'products'
const PRODUCT_CACHE_REVALIDATE_SECONDS = 300

function mapProduct(product: ProductRecord): StorefrontProduct {
  const availableSizes = Array.from(new Set(product.variants.map((variant) => variant.size)))
  const availableColors = Array.from(new Set(product.variants.map((variant) => variant.color)))
  const totalStock = product.variants.reduce((sum, variant) => sum + variant.stock, 0)

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    active: product.active,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    images: product.images,
    variants: product.variants,
    totalStock,
    availableSizes,
    availableColors,
  }
}

function buildCatalogWhere(filters: CatalogFilters): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {
    active: true,
  }

  if (filters.size || filters.color) {
    where.variants = {
      some: {
        ...(filters.size ? { size: filters.size } : {}),
        ...(filters.color ? { color: filters.color } : {}),
      },
    }
  }

  return where
}

const getCachedPublicProducts = unstable_cache(
  async () => {
    const products = await db.product.findMany({
      where: {
        active: true,
      },
      include: productInclude,
      orderBy: [{ createdAt: 'desc' }, { name: 'asc' }],
    })

    return products.map(mapProduct)
  },
  ['catalog-public-products'],
  {
    tags: [PRODUCT_CACHE_TAG],
    revalidate: PRODUCT_CACHE_REVALIDATE_SECONDS,
  },
)

const getCachedAdminProducts = unstable_cache(
  async () => {
    const products = await db.product.findMany({
      include: productInclude,
      orderBy: [{ createdAt: 'desc' }, { name: 'asc' }],
    })

    return products.map(mapProduct)
  },
  ['catalog-admin-products'],
  {
    tags: [PRODUCT_CACHE_TAG],
    revalidate: PRODUCT_CACHE_REVALIDATE_SECONDS,
  },
)

export async function getCatalogProducts(filters: CatalogFilters = {}): Promise<StorefrontProduct[]> {
  const products = await getCachedPublicProducts()
  const where = buildCatalogWhere(filters)

  return products.filter((product) => {
    if (!where.variants?.some) {
      return true
    }

    return product.variants.some((variant) => {
      if (typeof where.variants === 'object' && 'some' in where.variants && where.variants.some) {
        const variantFilter = where.variants.some
        const matchesSize = !('size' in variantFilter) || !variantFilter.size || variant.size === variantFilter.size
        const matchesColor = !('color' in variantFilter) || !variantFilter.color || variant.color === variantFilter.color
        return matchesSize && matchesColor
      }

      return true
    })
  })
}

export const getCatalogProductBySlug = cache(async (slug: string): Promise<StorefrontProduct | null> => {
  const products = await getCachedPublicProducts()
  return products.find((product) => product.slug === slug) || null
})

export const getCatalogFilterOptions = cache(async (): Promise<CatalogFilterOptions> => {
  const products = await getCachedPublicProducts()

  const sizes = Array.from(
    new Set(products.flatMap((product) => product.variants.map((variant) => variant.size))),
  ).sort()

  const colors = Array.from(
    new Set(products.flatMap((product) => product.variants.map((variant) => variant.color))),
  ).sort((left, right) => left.localeCompare(right, 'es'))

  return { sizes, colors }
})

export async function getAdminProducts(): Promise<StorefrontProduct[]> {
  return getCachedAdminProducts()
}

export async function getAdminProductById(id: string): Promise<StorefrontProduct | null> {
  const products = await getCachedAdminProducts()
  return products.find((product) => product.id === id) || null
}

export const getProductPurchaseSnapshot = cache(
  async (productId: string, sku: string): Promise<ProductPurchaseSnapshot | null> => {
    const products = await getCachedPublicProducts()
    const product = products.find((entry) => entry.id === productId)

    if (!product) {
      return null
    }

    const variant = product.variants.find((entry) => entry.sku === sku)

    if (!variant) {
      return null
    }

    return {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      variant,
      primaryImage: product.images[0] || null,
    }
  },
)
