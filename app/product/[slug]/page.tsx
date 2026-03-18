import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductBySlug, products } from '@/lib/products'
import { ProductDetail } from '@/components/product/product-detail'
import { RelatedProducts } from '@/components/product/related-products'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    return {
      title: 'Producto no encontrado | ALOHA',
    }
  }

  return {
    title: `${product.name} | ALOHA`,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: product.media[0]?.url ? [product.media[0].url] : [],
    },
  }
}

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }))
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 bg-ocean-sky opacity-20" />
      <div className="pointer-events-none absolute inset-0 bg-grain opacity-25" />
      <ProductDetail product={product} />
      <RelatedProducts productId={product.id} />
    </div>
  )
}
