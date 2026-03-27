'use server'

import { redirect } from 'next/navigation'
import { revalidatePath, revalidateTag } from 'next/cache'
import { z } from 'zod'
import { db } from '@/lib/db'
import { PRODUCT_CACHE_TAG } from '@/lib/products.server'

const imageSchema = z.object({
  url: z.string().trim().url('La URL de imagen debe ser válida.'),
  alt: z.string().trim().min(1, 'El texto alternativo es obligatorio.'),
  sortOrder: z.number().int().nonnegative(),
})

const variantSchema = z.object({
  size: z.string().trim().min(1, 'La talla es obligatoria.'),
  color: z.string().trim().min(1, 'El color es obligatorio.'),
  stock: z.number().int().nonnegative(),
  sku: z.string().trim().min(1, 'El SKU es obligatorio.'),
})

const productSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es obligatorio.'),
  slug: z.string().trim().min(1, 'El slug es obligatorio.'),
  description: z.string().trim().min(1, 'La descripción es obligatoria.'),
  price: z.number().int().positive('El precio debe ser mayor a cero.'),
  active: z.boolean(),
  images: z.array(imageSchema).min(1, 'Debes agregar al menos una imagen.'),
  variants: z.array(variantSchema).min(1, 'Debes agregar al menos una variante.'),
})

function parseBoolean(value: FormDataEntryValue | null) {
  return value === 'on' || value === 'true'
}

function parseIntegerField(value: FormDataEntryValue | null) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? Math.trunc(parsed) : NaN
}

function parseJsonField<T>(value: FormDataEntryValue | null): T {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error('Faltan datos serializados del formulario.')
  }

  return JSON.parse(value) as T
}

function normalizeImages(rawImages: Array<{ url: string; alt: string; sortOrder?: number }>) {
  return rawImages
    .map((image, index) => ({
      url: image.url.trim(),
      alt: image.alt.trim(),
      sortOrder: typeof image.sortOrder === 'number' ? image.sortOrder : index,
    }))
    .filter((image) => image.url.length > 0 && image.alt.length > 0)
}

function normalizeVariants(rawVariants: Array<{ size: string; color: string; stock: number; sku: string }>) {
  return rawVariants
    .map((variant) => ({
      size: variant.size.trim().toUpperCase(),
      color: variant.color.trim(),
      stock: Number(variant.stock),
      sku: variant.sku.trim().toUpperCase(),
    }))
    .filter((variant) => variant.size.length > 0 && variant.color.length > 0 && variant.sku.length > 0)
}

function parseProductFormData(formData: FormData) {
  const payload = {
    name: String(formData.get('name') || ''),
    slug: String(formData.get('slug') || ''),
    description: String(formData.get('description') || ''),
    price: parseIntegerField(formData.get('price')),
    active: parseBoolean(formData.get('active')),
    images: normalizeImages(parseJsonField<Array<{ url: string; alt: string; sortOrder?: number }>>(formData.get('imagesPayload'))),
    variants: normalizeVariants(parseJsonField<Array<{ size: string; color: string; stock: number; sku: string }>>(formData.get('variantsPayload'))),
  }

  return productSchema.parse(payload)
}

function revalidateProductPaths(slug?: string, previousSlug?: string) {
  revalidateTag(PRODUCT_CACHE_TAG, 'max')
  revalidatePath('/admin/productos')
  revalidatePath('/admin/productos/nuevo')
  revalidatePath('/tienda')
  revalidatePath('/shop')

  if (slug) {
    revalidatePath(`/tienda/${slug}`)
    revalidatePath(`/product/${slug}`)
  }

  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/tienda/${previousSlug}`)
    revalidatePath(`/product/${previousSlug}`)
  }
}

export async function createProductAction(formData: FormData) {
  const payload = parseProductFormData(formData)

  await db.product.create({
    data: {
      name: payload.name,
      slug: payload.slug,
      description: payload.description,
      price: payload.price,
      active: payload.active,
      images: {
        create: payload.images,
      },
      variants: {
        create: payload.variants,
      },
    },
  })

  revalidateProductPaths(payload.slug)
  redirect('/admin/productos')
}

export async function updateProductAction(formData: FormData) {
  const productId = String(formData.get('productId') || '').trim()

  if (!productId) {
    throw new Error('Falta el identificador del producto.')
  }

  const existingProduct = await db.product.findUnique({
    where: { id: productId },
    select: { slug: true },
  })

  if (!existingProduct) {
    throw new Error('El producto no existe.')
  }

  const payload = parseProductFormData(formData)

  await db.$transaction([
    db.productImage.deleteMany({ where: { productId } }),
    db.productVariant.deleteMany({ where: { productId } }),
    db.product.update({
      where: { id: productId },
      data: {
        name: payload.name,
        slug: payload.slug,
        description: payload.description,
        price: payload.price,
        active: payload.active,
        images: {
          create: payload.images,
        },
        variants: {
          create: payload.variants,
        },
      },
    }),
  ])

  revalidateProductPaths(payload.slug, existingProduct.slug)
  redirect('/admin/productos')
}

export async function toggleProductStatusAction(formData: FormData) {
  const productId = String(formData.get('productId') || '').trim()

  if (!productId) {
    throw new Error('Falta el identificador del producto.')
  }

  const product = await db.product.findUnique({
    where: { id: productId },
    select: { active: true, slug: true },
  })

  if (!product) {
    throw new Error('El producto no existe.')
  }

  await db.product.update({
    where: { id: productId },
    data: {
      active: !product.active,
    },
  })

  revalidateProductPaths(product.slug)
}
