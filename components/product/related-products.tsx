'use client'

import { motion } from 'framer-motion'
import { ProductCard } from './product-card'
import { getRelatedProducts } from '@/lib/products'
import { useTheme } from '@/components/ui/theme-context'

interface RelatedProductsProps {
  productId: string
}

export function RelatedProducts({ productId }: RelatedProductsProps) {
  const { audience } = useTheme()
  const relatedProducts = getRelatedProducts(productId, audience)

  if (relatedProducts.length === 0) return null

  return (
    <section className="relative mt-16 border-t border-white/15 pt-16 pb-20">
      <div className="absolute inset-0 bg-ocean-sky opacity-30" />
      <div className="absolute inset-0 bg-grain opacity-30" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Combínala con...
          </h2>
          <p className="mt-2 text-muted-foreground">
            Productos que van perfecto con tu selección
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="relative mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {relatedProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
