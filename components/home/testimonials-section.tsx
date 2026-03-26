'use client'

import { motion } from 'framer-motion'
import { Quote, Star } from 'lucide-react'

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
    text: 'Llegó súper rápido a Bogotá. El corte amplio es perfecto, justo como me gusta. 100% recomendado.',
  },
  {
    id: 3,
    name: 'Valentina S.',
    location: 'Medellín',
    rating: 5,
    text: 'Me encanta el concepto de la marca. Se nota que hay cariño en cada detalle. Volveré a comprar.',
  },
]

const headingFont = '[font-family:var(--font-home-heading)]'
const bodyFont = '[font-family:var(--font-home-body)]'
const monoFont = '[font-family:var(--font-home-mono)]'

export function TestimonialsSection() {
  return (
    <section className={`relative px-4 py-16 sm:px-6 lg:px-8 lg:py-24 ${bodyFont}`}>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(246,240,230,0.82),rgba(233,244,251,0.55)_35%,rgba(246,240,230,1))]" />
      <div className="pointer-events-none absolute left-[8%] top-16 h-40 w-40 rounded-full bg-[#8CB9D8]/16 blur-3xl" />
      <div className="pointer-events-none absolute bottom-12 right-[10%] h-44 w-44 rounded-full bg-[#E4D4BF]/26 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center"
        >
          <span className={`text-[11px] uppercase tracking-[0.34em] text-[#6B98B8] ${monoFont}`}>
            Voces de la comunidad
          </span>
          <h2 className={`mt-4 text-4xl text-[#335A77] sm:text-5xl ${headingFont}`}>
            Lo que regresa desde la orilla.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#5E7A93]">
            La dirección visual es más ligera, pero la promesa sigue igual: sensación premium, uso fácil y una presencia tranquila.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="overflow-hidden rounded-[34px] border border-[#8CB9D8]/18 bg-[rgba(252,250,245,0.76)] p-6 shadow-[0_22px_90px_rgba(124,165,193,0.12)] backdrop-blur sm:p-8"
          >
            <span className={`text-[11px] uppercase tracking-[0.34em] text-[#6B98B8] ${monoFont}`}>
              Promesa editorial
            </span>
            <h3 className={`mt-4 text-4xl text-[#335A77] ${headingFont}`}>
              Suave a la vista, serio en el producto.
            </h3>
            <p className="mt-5 text-base leading-8 text-[#5E7A93]">
              Esta versión del home toma un ritmo editorial y lo traduce a la paleta real de ALOHA: blanco hueso, arena suave y azul claro. El proceso de compra no cambió.
            </p>

            <div className="mt-8 space-y-4">
              <PromiseRow label="Paleta" value="Blanco hueso, arena y azul cielo" />
              <PromiseRow label="Sensación" value="Cielo abierto, brisa y calma frente al mar" />
              <PromiseRow label="Compra" value="El proceso de pago se mantiene exactamente igual" />
            </div>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.article
                key={testimonial.id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.08 }}
                className="relative overflow-hidden rounded-[30px] border border-[#8CB9D8]/16 bg-white/70 p-6 shadow-[0_18px_70px_rgba(124,165,193,0.12)] backdrop-blur"
              >
                <Quote className="absolute right-6 top-6 h-8 w-8 text-[#8CB9D8]/35" />

                <div className="flex gap-1 text-[#8CB9D8]">
                  {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                    <Star key={starIndex} className="h-4 w-4 fill-current" />
                  ))}
                </div>

                <p className="mt-5 text-base leading-8 text-[#4D6D88]">{`"${testimonial.text}"`}</p>

                <div className="mt-8 border-t border-[#8CB9D8]/14 pt-5">
                  <p className="text-base text-[#335A77]">{testimonial.name}</p>
                  <p className={`mt-1 text-[11px] uppercase tracking-[0.28em] text-[#6B98B8] ${monoFont}`}>
                    {testimonial.location}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function PromiseRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-[#8CB9D8]/14 bg-white/58 p-4">
      <span className={`block text-[10px] uppercase tracking-[0.32em] text-[#6B98B8] ${monoFont}`}>
        {label}
      </span>
      <span className="mt-2 block text-sm text-[#4D6D88]">{value}</span>
    </div>
  )
}
