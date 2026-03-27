import Link from 'next/link'
import type { Metadata } from 'next'
import { ProductForm } from '@/components/admin/product-form'
import { createProductAction } from '@/app/admin/productos/actions'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Nuevo Producto | Admin ALOHA',
  description: 'Formulario de creación de productos.',
}

export default function NewAdminProductPage() {
  return (
    <main className="min-h-screen bg-[#F6F0E6] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="rounded-[32px] border border-[#8CB9D8]/18 bg-[rgba(252,250,245,0.82)] p-6 shadow-[0_22px_90px_rgba(124,165,193,0.14)] sm:p-8">
          <p className="text-xs tracking-[0.28em] text-[#6B98B8]">ADMIN</p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-[#335A77] sm:text-4xl">Crear producto</h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[#5E7A93]">
                Carga información básica, URLs de imágenes y variantes. El formulario guarda directo en la base.
              </p>
            </div>
            <Link href="/admin/productos" className="text-sm text-[#335A77] underline underline-offset-4">
              Volver al listado
            </Link>
          </div>
        </section>

        <ProductForm
          mode="create"
          submitLabel="Crear producto"
          cancelHref="/admin/productos"
          action={createProductAction}
        />
      </div>
    </main>
  )
}
