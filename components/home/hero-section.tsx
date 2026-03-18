'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassCard } from '@/components/ui/glass-card'
import { useTheme } from '@/components/ui/theme-context'

export function HeroSection() {
  const { audience } = useTheme()
  const isKids = audience === 'kids'

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-ocean-sky" />
      <div className="absolute inset-0 bg-grain opacity-50" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
      >
        <Image
          src="/hero-lifestyle.jpg"
          alt="ALOHA lifestyle"
          fill
          className="object-cover"
          priority
        />
      </motion.div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-foreground"
            >
              {isKids ? 'Little ALOHA' : 'Nueva Colección Disponible'}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              {isKids ? (
                <>
                  Legado y alegría,
                  <span className="block text-primary">estilo para el futuro</span>
                </>
              ) : (
                <>
                  Premium coastal wear,
                  <span className="block text-primary">hecho para tu ritmo</span>
                </>
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-foreground/80"
            >
              {isKids
                ? 'Un homenaje al legado con piezas creadas para el futuro: comodidad premium y detalles que celebran la infancia.'
                : 'Diseñadas en Barranquilla con un equilibrio perfecto entre frescura y sofisticación. Tu uniforme premium para días de sol y planes sin prisa.'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              <GlassButton asChild size="lg" className="group">
                <Link href="/shop">
                  Ver tienda
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </GlassButton>
              <GlassButton asChild size="lg" className="bg-white/5">
                <Link href="/shop?filter=hot-sale">Hot Sale</Link>
              </GlassButton>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="relative"
          >
            <GlassCard className="glass-hover p-4 sm:p-6">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                <Image
                  src="/hero-lifestyle.jpg"
                  alt="Camisetas ALOHA"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/35 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/20 bg-white/20 p-4 backdrop-blur-lg">
                  <p className="text-sm font-semibold text-foreground">
                    Video teaser (placeholder)
                  </p>
                  <p className="mt-1 text-xs text-foreground/70">
                    Storytelling de la nueva colección.
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
