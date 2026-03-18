'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'

const testimonials = [
  {
    id: 1,
    name: 'Camila R.',
    location: 'Barranquilla',
    rating: 5,
    text: 'La calidad es increíble, se siente premium de verdad. Ya pedí mi segunda camiseta y viene en camino.',
  },
  {
    id: 2,
    name: 'Andrés M.',
    location: 'Bogotá',
    rating: 5,
    text: 'Llegó súper rápido a Bogotá. El oversize es perfecto, justo como me gusta. 100% recomendado.',
  },
  {
    id: 3,
    name: 'Valentina S.',
    location: 'Medellín',
    rating: 5,
    text: 'Me encanta el concepto de la marca. Se nota que hay cariño en cada detalle. Volveré a comprar.',
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

export function TestimonialsSection() {
  return (
    <section className="relative py-16 sm:py-20">
      <div className="absolute inset-0 bg-ocean-sky opacity-40" />
      <div className="absolute inset-0 bg-grain opacity-40" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative text-center"
        >
          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Lo que dicen de nosotros
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Clientes felices, eso es lo que nos mueve
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="relative mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              className="relative"
            >
              <GlassCard className="glass-hover p-6">
                <Quote className="absolute right-6 top-6 h-8 w-8 text-white/30" />

                {/* Rating */}
                <div className="flex gap-0.5">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-accent text-accent"
                    />
                  ))}
                </div>

                {/* Text */}
                <p className="mt-4 text-foreground leading-relaxed">
                  {`"${testimonial.text}"`}
                </p>

                {/* Author */}
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 font-medium text-primary">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
