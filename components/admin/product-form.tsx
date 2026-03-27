'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { MinusCircle, PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type EditableImage = {
  url: string
  alt: string
  sortOrder: number
}

type EditableVariant = {
  size: string
  color: string
  stock: number
  sku: string
}

type ProductFormProps = {
  mode: 'create' | 'edit'
  submitLabel: string
  cancelHref: string
  action: (formData: FormData) => void | Promise<void>
  initialValues?: {
    id: string
    name: string
    slug: string
    description: string
    price: number
    active: boolean
    images: EditableImage[]
    variants: EditableVariant[]
  }
}

const emptyImage: EditableImage = {
  url: '',
  alt: '',
  sortOrder: 0,
}

const emptyVariant: EditableVariant = {
  size: 'M',
  color: '',
  stock: 0,
  sku: '',
}

export function ProductForm({
  mode,
  submitLabel,
  cancelHref,
  action,
  initialValues,
}: ProductFormProps) {
  const [images, setImages] = useState<EditableImage[]>(
    initialValues?.images.length ? initialValues.images : [{ ...emptyImage }],
  )
  const [variants, setVariants] = useState<EditableVariant[]>(
    initialValues?.variants.length ? initialValues.variants : [{ ...emptyVariant }],
  )

  const imagesPayload = useMemo(() => JSON.stringify(images), [images])
  const variantsPayload = useMemo(() => JSON.stringify(variants), [variants])

  return (
    <form action={action} className="space-y-8">
      {initialValues ? <input type="hidden" name="productId" value={initialValues.id} /> : null}
      <input type="hidden" name="imagesPayload" value={imagesPayload} />
      <input type="hidden" name="variantsPayload" value={variantsPayload} />

      <section className="rounded-[28px] border border-[#8CB9D8]/18 bg-white/85 p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" name="name" defaultValue={initialValues?.name || ''} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" defaultValue={initialValues?.slug || ''} required />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={initialValues?.description || ''}
              className="min-h-32"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Precio</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min={1}
              step={1}
              defaultValue={initialValues?.price || 0}
              required
            />
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-3 text-sm text-[#335A77]">
              <input
                type="checkbox"
                name="active"
                defaultChecked={initialValues?.active ?? true}
                className="h-4 w-4 rounded border-[#8CB9D8]/24"
              />
              Producto activo
            </label>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-[#8CB9D8]/18 bg-white/85 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[#335A77]">Imágenes</h2>
            <p className="mt-1 text-sm text-[#5E7A93]">Carga URLs remotas o locales públicas ya servidas por la app.</p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setImages((currentImages) => [
                ...currentImages,
                { ...emptyImage, sortOrder: currentImages.length },
              ])
            }
          >
            <PlusCircle className="h-4 w-4" />
            Agregar imagen
          </Button>
        </div>

        <div className="mt-6 space-y-4">
          {images.map((image, index) => (
            <div key={`image-${index}`} className="grid gap-4 rounded-2xl border border-[#8CB9D8]/14 bg-[#FCFAF5] p-4 md:grid-cols-[1.6fr_1.2fr_140px_auto]">
              <div className="space-y-2">
                <Label>URL</Label>
                <Input
                  value={image.url}
                  onChange={(event) =>
                    setImages((currentImages) =>
                      currentImages.map((entry, entryIndex) =>
                        entryIndex === index ? { ...entry, url: event.target.value } : entry,
                      ),
                    )
                  }
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label>Alt</Label>
                <Input
                  value={image.alt}
                  onChange={(event) =>
                    setImages((currentImages) =>
                      currentImages.map((entry, entryIndex) =>
                        entryIndex === index ? { ...entry, alt: event.target.value } : entry,
                      ),
                    )
                  }
                  placeholder="Texto alternativo"
                />
              </div>

              <div className="space-y-2">
                <Label>Orden</Label>
                <Input
                  type="number"
                  min={0}
                  value={image.sortOrder}
                  onChange={(event) =>
                    setImages((currentImages) =>
                      currentImages.map((entry, entryIndex) =>
                        entryIndex === index
                          ? { ...entry, sortOrder: Number(event.target.value) || 0 }
                          : entry,
                      ),
                    )
                  }
                />
              </div>

              <div className="flex items-end">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={images.length === 1}
                  onClick={() =>
                    setImages((currentImages) => currentImages.filter((_, entryIndex) => entryIndex !== index))
                  }
                >
                  <MinusCircle className="h-4 w-4" />
                  Quitar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[28px] border border-[#8CB9D8]/18 bg-white/85 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[#335A77]">Variantes</h2>
            <p className="mt-1 text-sm text-[#5E7A93]">Administra talla, color, stock y SKU por cada variante.</p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setVariants((currentVariants) => [...currentVariants, { ...emptyVariant }])
            }
          >
            <PlusCircle className="h-4 w-4" />
            Agregar variante
          </Button>
        </div>

        <div className="mt-6 space-y-4">
          {variants.map((variant, index) => (
            <div key={`variant-${index}`} className="grid gap-4 rounded-2xl border border-[#8CB9D8]/14 bg-[#FCFAF5] p-4 md:grid-cols-[120px_1.2fr_140px_1.4fr_auto]">
              <div className="space-y-2">
                <Label>Talla</Label>
                <Input
                  value={variant.size}
                  onChange={(event) =>
                    setVariants((currentVariants) =>
                      currentVariants.map((entry, entryIndex) =>
                        entryIndex === index ? { ...entry, size: event.target.value } : entry,
                      ),
                    )
                  }
                  placeholder="M"
                />
              </div>

              <div className="space-y-2">
                <Label>Color</Label>
                <Input
                  value={variant.color}
                  onChange={(event) =>
                    setVariants((currentVariants) =>
                      currentVariants.map((entry, entryIndex) =>
                        entryIndex === index ? { ...entry, color: event.target.value } : entry,
                      ),
                    )
                  }
                  placeholder="Blanco hueso"
                />
              </div>

              <div className="space-y-2">
                <Label>Stock</Label>
                <Input
                  type="number"
                  min={0}
                  value={variant.stock}
                  onChange={(event) =>
                    setVariants((currentVariants) =>
                      currentVariants.map((entry, entryIndex) =>
                        entryIndex === index
                          ? { ...entry, stock: Number(event.target.value) || 0 }
                          : entry,
                      ),
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>SKU</Label>
                <Input
                  value={variant.sku}
                  onChange={(event) =>
                    setVariants((currentVariants) =>
                      currentVariants.map((entry, entryIndex) =>
                        entryIndex === index ? { ...entry, sku: event.target.value } : entry,
                      ),
                    )
                  }
                  placeholder="ALOHA-M-BH"
                />
              </div>

              <div className="flex items-end">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={variants.length === 1}
                  onClick={() =>
                    setVariants((currentVariants) =>
                      currentVariants.filter((_, entryIndex) => entryIndex !== index),
                    )
                  }
                >
                  <MinusCircle className="h-4 w-4" />
                  Quitar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" size="lg">
          {submitLabel}
        </Button>
        <Button asChild type="button" size="lg" variant="outline">
          <Link href={cancelHref}>{mode === 'create' ? 'Cancelar' : 'Volver al listado'}</Link>
        </Button>
      </div>
    </form>
  )
}
