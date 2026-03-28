import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProductGallery } from '@/components/product-gallery'
import { WHATSAPP_PHONE_NUMBER, buildWhatsAppProductUrl, formatPrice } from '@/lib/products'
import { getCatalogProductBySlug } from '@/lib/products.server'

export const revalidate = 300

type ProductDetailPageProps = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getCatalogProductBySlug(slug)

  if (!product) {
    return {
      title: 'Producto no encontrado | ALOHA',
    }
  }

  return {
    title: `${product.name} | ALOHA`,
    description: product.description,
    alternates: {
      canonical: `/tienda/${product.slug}`,
    },
    openGraph: {
      title: product.name,
      description: product.description,
      url: `/tienda/${product.slug}`,
      images: product.images[0] ? [product.images[0].url] : [],
    },
  }
}

function getStockTone(totalStock: number) {
  if (totalStock <= 0) return 'Sin stock'
  if (totalStock <= 5) return 'Stock bajo'
  return 'Disponible'
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params
  const product = await getCatalogProductBySlug(slug)

  if (!product) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#F6F0E6] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <nav className="flex items-center gap-2 text-sm text-[#5E7A93]">
          <Link href="/" className="hover:text-[#335A77]">Inicio</Link>
          <span>/</span>
          <Link href="/tienda" className="hover:text-[#335A77]">Tienda</Link>
          <span>/</span>
          <span className="text-[#335A77]">{product.name}</span>
        </nav>

        <section className="grid gap-8 rounded-[32px] border border-[#8CB9D8]/18 bg-[rgba(252,250,245,0.82)] p-6 shadow-[0_22px_90px_rgba(124,165,193,0.14)] lg:grid-cols-[1.05fr_0.95fr] lg:p-8">
          <ProductGallery images={product.images} productName={product.name} />

          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-xs tracking-[0.28em] text-[#6B98B8]">DETALLE DE PRODUCTO</p>
              <h1 className="text-3xl font-semibold text-[#335A77] sm:text-5xl">{product.name}</h1>
              <p className="text-2xl font-semibold text-[#335A77]">{formatPrice(product.price)}</p>
              <p className="text-sm leading-7 text-[#5E7A93] sm:text-base">{product.description}</p>
            </div>

            <div className="grid gap-4 rounded-[24px] border border-[#8CB9D8]/18 bg-white/80 p-5 sm:grid-cols-3">
              <div>
                <p className="text-xs tracking-[0.22em] text-[#6B98B8]">Colores</p>
                <p className="mt-2 text-sm text-[#335A77]">{product.availableColors.join(', ')}</p>
              </div>
              <div>
                <p className="text-xs tracking-[0.22em] text-[#6B98B8]">Tallas</p>
                <p className="mt-2 text-sm text-[#335A77]">{product.availableSizes.join(', ')}</p>
              </div>
              <div>
                <p className="text-xs tracking-[0.22em] text-[#6B98B8]">Stock</p>
                <p className="mt-2 text-sm text-[#335A77]">
                  {getStockTone(product.totalStock)} ({product.totalStock} unidades)
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[#335A77]">Variantes disponibles</h2>
              <div className="overflow-hidden rounded-[24px] border border-[#8CB9D8]/18 bg-white/85">
                <table className="min-w-full divide-y divide-[#8CB9D8]/14 text-left text-sm">
                  <thead className="bg-[#EAF4FB] text-[#335A77]">
                    <tr>
                      <th className="px-4 py-3 font-medium">Color</th>
                      <th className="px-4 py-3 font-medium">Talla</th>
                      <th className="px-4 py-3 font-medium">SKU</th>
                      <th className="px-4 py-3 font-medium">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#8CB9D8]/10 text-[#5E7A93]">
                    {product.variants.map((variant) => (
                      <tr key={variant.id}>
                        <td className="px-4 py-3">{variant.color}</td>
                        <td className="px-4 py-3">{variant.size}</td>
                        <td className="px-4 py-3">{variant.sku}</td>
                        <td className="px-4 py-3">{variant.stock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-[24px] border border-[#8CB9D8]/18 bg-white/80 p-5">
              <p className="text-sm leading-7 text-[#5E7A93]">
                WhatsApp configurado: <span className="font-medium text-[#335A77]">{WHATSAPP_PHONE_NUMBER}</span>
              </p>
              <Link
                href={buildWhatsAppProductUrl(product.name, product.slug)}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex min-h-12 items-center justify-center rounded-full bg-[#25D366] px-6 text-sm font-semibold text-white transition hover:bg-[#1fa855]"
              >
                Consultar por WhatsApp
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
