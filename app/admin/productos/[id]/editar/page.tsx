import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProductForm } from '@/components/admin/product-form'
import { updateProductAction } from '@/app/admin/productos/actions'
import { getAdminProductById } from '@/lib/products.server'

export const dynamic = 'force-dynamic'

type EditAdminProductPageProps = {
  params: Promise<{
    id: string
  }>
}

export const metadata: Metadata = {
  title: 'Editar Producto | Admin ALOHA',
  description: 'Formulario de edición de productos.',
}

export default async function EditAdminProductPage({ params }: EditAdminProductPageProps) {
  const { id } = await params
  const product = await getAdminProductById(id)

  if (!product) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#F6F0E6] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="rounded-[32px] border border-[#8CB9D8]/18 bg-[rgba(252,250,245,0.82)] p-6 shadow-[0_22px_90px_rgba(124,165,193,0.14)] sm:p-8">
          <p className="text-xs tracking-[0.28em] text-[#6B98B8]">ADMIN</p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-[#335A77] sm:text-4xl">Editar producto</h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[#5E7A93]">
                Ajusta datos, imágenes y variantes del producto seleccionado.
              </p>
            </div>
            <Link href="/admin/productos" className="text-sm text-[#335A77] underline underline-offset-4">
              Volver al listado
            </Link>
          </div>
        </section>

        <ProductForm
          mode="edit"
          submitLabel="Guardar cambios"
          cancelHref="/admin/productos"
          action={updateProductAction}
          initialValues={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: product.price,
            active: product.active,
            images: product.images.map((image) => ({
              url: image.url,
              alt: image.alt,
              sortOrder: image.sortOrder,
            })),
            variants: product.variants.map((variant) => ({
              size: variant.size,
              color: variant.color,
              stock: variant.stock,
              sku: variant.sku,
            })),
          }}
        />
      </div>
    </main>
  )
}
