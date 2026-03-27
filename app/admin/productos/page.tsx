import Link from 'next/link'
import type { Metadata } from 'next'
import { formatPrice } from '@/lib/products'
import { toggleProductStatusAction } from '@/app/admin/productos/actions'
import { getAdminProducts } from '@/lib/products.server'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Admin Productos | ALOHA',
  description: 'Listado base de productos para administración interna.',
}

export default async function AdminProductsPage() {
  const products = await getAdminProducts()

  return (
    <main className="min-h-screen bg-[#F6F0E6] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[32px] border border-[#8CB9D8]/18 bg-[rgba(252,250,245,0.82)] p-6 shadow-[0_22px_90px_rgba(124,165,193,0.14)] sm:p-8">
          <p className="text-xs tracking-[0.28em] text-[#6B98B8]">ADMIN</p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-[#335A77] sm:text-4xl">Productos</h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[#5E7A93]">
                Listado operativo para crear, editar y activar productos directamente sobre la base de datos.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="rounded-[22px] border border-[#8CB9D8]/18 bg-white/75 px-5 py-4 text-sm text-[#5E7A93]">
                {products.length} producto(s) en catálogo
              </div>
              <Link
                href="/admin/productos/nuevo"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#335A77] px-5 text-sm font-medium text-[#FCFAF5] transition hover:bg-[#27475f]"
              >
                Crear producto
              </Link>
            </div>
          </div>
        </section>

        {products.length > 0 ? (
          <section className="overflow-hidden rounded-[28px] border border-[#8CB9D8]/18 bg-white/85">
            <table className="min-w-full divide-y divide-[#8CB9D8]/14 text-left text-sm">
              <thead className="bg-[#EAF4FB] text-[#335A77]">
                <tr>
                  <th className="px-5 py-4 font-medium">Producto</th>
                  <th className="px-5 py-4 font-medium">Precio</th>
                  <th className="px-5 py-4 font-medium">Variantes</th>
                  <th className="px-5 py-4 font-medium">Imágenes</th>
                  <th className="px-5 py-4 font-medium">Stock total</th>
                  <th className="px-5 py-4 font-medium">Estado</th>
                  <th className="px-5 py-4 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#8CB9D8]/10 bg-white text-[#5E7A93]">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-[#335A77]">{product.name}</p>
                        <p className="text-xs text-[#6B98B8]">/{product.slug}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">{formatPrice(product.price)}</td>
                    <td className="px-5 py-4">{product.variants.length}</td>
                    <td className="px-5 py-4">{product.images.length}</td>
                    <td className="px-5 py-4">{product.totalStock}</td>
                    <td className="px-5 py-4">{product.active ? 'Activo' : 'Inactivo'}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-3">
                        <Link href={`/tienda/${product.slug}`} className="text-[#335A77] underline underline-offset-4">
                          Ver
                        </Link>
                        <Link href={`/admin/productos/${product.id}/editar`} className="text-[#335A77] underline underline-offset-4">
                          Editar
                        </Link>
                        <form action={toggleProductStatusAction}>
                          <input type="hidden" name="productId" value={product.id} />
                          <button type="submit" className="text-[#335A77] underline underline-offset-4">
                            {product.active ? 'Desactivar' : 'Activar'}
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ) : (
          <section className="flex min-h-[280px] items-center justify-center rounded-[28px] border border-dashed border-[#8CB9D8]/28 bg-white/70 px-6 text-center">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-[#335A77]">No hay productos cargados</h2>
              <p className="max-w-md text-sm leading-7 text-[#5E7A93]">
                El panel está listo para administración. Cuando cargues productos en la base, aparecerán aquí.
              </p>
              <Link
                href="/admin/productos/nuevo"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#335A77] px-5 text-sm font-medium text-[#FCFAF5] transition hover:bg-[#27475f]"
              >
                Crear primer producto
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
