'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp } from 'lucide-react'
import { GlassButton } from '@/components/ui/glass-button'
import { ProductCard } from '@/components/product/product-card'
import { getBestSellers } from '@/lib/products'
import { useTheme } from '@/components/ui/theme-context'

export function BestSellersSection() {
  const { audience } = useTheme()
  const bestSellers = getBestSellers(audience)

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="accent-label text-sm text-primary">
                Favoritos
              </span>
            </div>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Lo Más Vendido
            </h2>
            <p className="mt-2 text-muted-foreground">
              Las camisetas que todos quieren
            </p>
          </div>
          <GlassButton asChild size="sm" className="mt-4 sm:mt-0 group">
            <Link href="/shop?sort=popular">
              Ver todo
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </GlassButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {bestSellers.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
