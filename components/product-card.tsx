import Image from 'next/image'
import Link from 'next/link'
import type { StorefrontProduct } from '@/lib/products.server'
import { formatPrice } from '@/lib/products'

type ProductCardProps = {
  product: StorefrontProduct
}

export function ProductCard({ product }: ProductCardProps) {
  const image = product.images[0]

  return (
    <article className="overflow-hidden rounded-[24px] border border-[#8CB9D8]/18 bg-white shadow-[0_18px_60px_rgba(124,165,193,0.12)] transition-transform hover:-translate-y-1">
      <Link href={`/tienda/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] bg-[#F6F0E6]">
          <Image
            src={image?.url || '/placeholder.jpg'}
            alt={image?.alt || product.name}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"
            className="object-cover"
          />
        </div>
      </Link>

      <div className="space-y-3 p-5">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-[#335A77]">
            <Link href={`/tienda/${product.slug}`}>{product.name}</Link>
          </h3>
          <p className="line-clamp-2 text-sm leading-6 text-[#5E7A93]">{product.description}</p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-[#6B98B8]">Desde</p>
            <p className="text-lg font-semibold text-[#335A77]">{formatPrice(product.price)}</p>
          </div>

          <Link
            href={`/tienda/${product.slug}`}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#8CB9D8]/30 px-4 text-sm font-medium tracking-[0.08em] text-[#335A77] transition hover:bg-[#EAF4FB]"
          >
            Ver detalle
          </Link>
        </div>
      </div>
    </article>
  )
}
