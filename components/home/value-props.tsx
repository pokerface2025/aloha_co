'use client'

import { motion } from 'framer-motion'
import { Sparkles, Truck, Shield } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'

const props = [
  {
    icon: Sparkles,
    title: 'Tejidos premium',
    description: 'Texturas suaves y frescas que elevan lo esencial.',
  },
  {
    icon: Truck,
    title: 'Envío nacional',
    description: 'Rápido, cuidado y con seguimiento en toda Colombia.',
  },
  {
    icon: Shield,
    title: 'Compra segura',
    description: 'Pagos protegidos y soporte cercano cuando lo necesites.',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export function ValueProps() {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <GlassCard className="glass-panel-strong px-6 py-8 sm:px-10">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Social proof
              </p>
              <h2 className="mt-2 font-serif text-2xl font-semibold text-foreground">
                La costa en versión premium
              </h2>
            </div>
            <div className="flex gap-8 text-sm text-muted-foreground">
              <div>
                <p className="text-2xl font-semibold text-foreground">4.9/5</p>
                <p>Reseñas verificadas</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">24h</p>
                <p>Despacho en ciudad</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">10k+</p>
                <p>Clientes felices</p>
              </div>
            </div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3"
          >
            {props.map((prop) => {
              const Icon = prop.icon
              return (
                <motion.div
                  key={prop.title}
                  variants={itemVariants}
                  className="flex items-start gap-4"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-semibold text-foreground">
                      {prop.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                      {prop.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </GlassCard>
      </div>
    </section>
  )
}
