import Link from 'next/link'
import type { Metadata } from 'next'
import { ProductCard } from '@/components/product-card'
import { getCatalogFilterOptions, getCatalogProducts } from '@/lib/products.server'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Tienda | ALOHA',
  description: 'Catálogo dinámico de prendas con datos cargados desde base de datos.',
  alternates: {
    canonical: '/tienda',
  },
  openGraph: {
    title: 'Tienda | ALOHA',
    description: 'Catálogo dinámico de prendas con datos cargados desde base de datos.',
    url: '/tienda',
    type: 'website',
  },
}

type TiendaPageProps = {
  searchParams: Promise<{
    size?: string
    color?: string
  }>
}

function normalizeFilterValue(value?: string) {
  if (!value) return undefined
  const normalized = value.trim()
  return normalized.length > 0 ? normalized : undefined
}

function buildFilterHref(filters: { size?: string; color?: string }) {
  const params = new URLSearchParams()

  if (filters.size) {
    params.set('size', filters.size)
  }

  if (filters.color) {
    params.set('color', filters.color)
  }

  const query = params.toString()
  return query ? `/tienda?${query}` : '/tienda'
}

export default async function TiendaPage({ searchParams }: TiendaPageProps) {
  const params = await searchParams
  const activeSize = normalizeFilterValue(params.size)
  const activeColor = normalizeFilterValue(params.color)

  const [products, filterOptions] = await Promise.all([
    getCatalogProducts({ size: activeSize, color: activeColor }),
    getCatalogFilterOptions(),
  ])

  return (
    <main className="min-h-screen bg-[#F6F0E6] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <section className="rounded-[32px] border border-[#8CB9D8]/18 bg-[rgba(252,250,245,0.82)] p-6 shadow-[0_22px_90px_rgba(124,165,193,0.14)] sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <p className="text-xs tracking-[0.28em] text-[#6B98B8]">CATÁLOGO DINÁMICO</p>
              <h1 className="text-3xl font-semibold text-[#335A77] sm:text-5xl">Tienda ALOHA</h1>
              <p className="max-w-2xl text-sm leading-7 text-[#5E7A93] sm:text-base">
                Las prendas, tallas, colores, stock e imágenes se leen desde la base de datos. La página renderiza en servidor y queda lista para conectar carrito o checkout después.
              </p>
            </div>

            <div className="rounded-[24px] border border-[#8CB9D8]/18 bg-white/70 px-5 py-4 text-sm text-[#5E7A93]">
              <p>{products.length} producto(s) encontrado(s)</p>
              <p>{activeSize || activeColor ? 'Filtros activos aplicados' : 'Sin filtros activos'}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 rounded-[32px] border border-[#8CB9D8]/18 bg-white/70 p-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-[0.18em] text-[#335A77]">Talla</h2>
                {activeSize ? (
                  <Link href={buildFilterHref({ color: activeColor })} className="text-xs text-[#6B98B8]">
                    Limpiar
                  </Link>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2">
                {filterOptions.sizes.map((size) => {
                  const isActive = size === activeSize
                  return (
                    <Link
                      key={size}
                      href={buildFilterHref({ size: isActive ? undefined : size, color: activeColor })}
                      className={`rounded-full border px-3 py-2 text-sm transition ${
                        isActive
                          ? 'border-[#335A77] bg-[#335A77] text-[#FCFAF5]'
                          : 'border-[#8CB9D8]/24 text-[#335A77] hover:bg-[#EAF4FB]'
                      }`}
                    >
                      {size}
                    </Link>
                  )
                })}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-[0.18em] text-[#335A77]">Color</h2>
                {activeColor ? (
                  <Link href={buildFilterHref({ size: activeSize })} className="text-xs text-[#6B98B8]">
                    Limpiar
                  </Link>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2">
                {filterOptions.colors.map((color) => {
                  const isActive = color === activeColor
                  return (
                    <Link
                      key={color}
                      href={buildFilterHref({ size: activeSize, color: isActive ? undefined : color })}
                      className={`rounded-full border px-3 py-2 text-sm transition ${
                        isActive
                          ? 'border-[#335A77] bg-[#335A77] text-[#FCFAF5]'
                          : 'border-[#8CB9D8]/24 text-[#335A77] hover:bg-[#EAF4FB]'
                      }`}
                    >
                      {color}
                    </Link>
                  )
                })}
              </div>
            </div>

            {(activeSize || activeColor) && (
              <Link
                href="/tienda"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#8CB9D8]/24 px-4 text-sm text-[#335A77] transition hover:bg-[#EAF4FB]"
              >
                Limpiar filtros
              </Link>
            )}
          </aside>

          <div>
            {products.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[28px] border border-dashed border-[#8CB9D8]/28 bg-[#F6F0E6] px-6 text-center">
                <h2 className="text-2xl font-semibold text-[#335A77]">No hay productos para este filtro</h2>
                <p className="mt-3 max-w-md text-sm leading-7 text-[#5E7A93]">
                  Ajusta talla o color para volver a ver el catálogo. La arquitectura ya está lista para ampliar los filtros sin duplicar lógica.
                </p>
                <Link
                  href="/tienda"
                  className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[#335A77] px-5 text-sm font-medium text-[#FCFAF5]"
                >
                  Ver todo el catálogo
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
