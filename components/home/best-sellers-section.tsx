'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const headingFont = '[font-family:var(--font-home-heading)]'
const bodyFont = '[font-family:var(--font-home-body)]'
const monoFont = '[font-family:var(--font-home-mono)]'

export function BestSellersSection() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!email.trim()) {
      setStatus('error')
      setMessage('Escribe un correo válido para recibir tu beneficio.')
      return
    }

    setIsSubmitting(true)
    setStatus('idle')
    setMessage('')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const payload = (await response.json()) as { error?: string; message?: string; code?: string }

      if (!response.ok) {
        throw new Error(payload.error || 'No se pudo registrar el correo.')
      }

      setStatus('success')
      setMessage(payload.message || 'Listo. Revisa tu correo para conocer tu beneficio de bienvenida.')
      setEmail('')
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'No se pudo registrar el correo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className={`relative px-4 py-16 sm:px-6 lg:px-8 lg:py-24 ${bodyFont}`}>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(233,244,251,0.62),rgba(246,240,230,0.84)_56%,rgba(246,240,230,1))]" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          className="rounded-[34px] border border-[#8CB9D8]/18 bg-[rgba(252,250,245,0.78)] p-6 shadow-[0_22px_90px_rgba(124,165,193,0.14)] backdrop-blur sm:p-8"
        >
          <div className="mx-auto max-w-4xl text-center">
            <span className={`text-[11px] uppercase tracking-[0.34em] text-[#6B98B8] ${monoFont}`}>
              Suscríbete
            </span>
            <h2 className={`mt-4 text-4xl text-[#335A77] sm:text-5xl ${headingFont}`}>
              10% de descuento en tu primera compra.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#5E7A93]">
              Déjanos tu correo y te reservamos un código de bienvenida para entrar a ALOHA con una ventaja desde el primer pedido.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-4xl">
            <div className="rounded-[28px] border border-[#8CB9D8]/14 bg-white/72 p-4 sm:p-5">
              <div className="mb-4 flex justify-center">                
              </div>

              <div className="flex flex-col gap-3 lg:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="tu@correo.com"
                  className="min-h-14 flex-1 rounded-full border border-[#8CB9D8]/16 bg-[#FFFCF7] px-5 text-base text-[#335A77] outline-none transition placeholder:text-[#8AA1B7] focus:border-[#8CB9D8]/45 focus:ring-2 focus:ring-[#8CB9D8]/20"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex min-h-14 items-center justify-center rounded-full border border-[#8CB9D8]/28 bg-[#8CB9D8] px-7 text-sm uppercase tracking-[0.28em] text-[#FCFAF5] transition hover:bg-[#7DAFCE] disabled:opacity-60"
                >
                  {isSubmitting ? 'Registrando...' : 'Suscribirme'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="mt-4 text-center text-sm leading-7 text-[#5E7A93]">
              Te escribiremos con tu beneficio de bienvenida y futuras novedades de la marca.
            </p>

            {message ? (
              <div
                className={`mt-4 rounded-[24px] border px-4 py-4 text-center text-sm leading-7 ${
                  status === 'success'
                    ? 'border-[#8CB9D8]/20 bg-[#EAF6FC] text-[#335A77]'
                    : 'border-[#D9B3A8]/28 bg-[#FFF7F4] text-[#8A5C55]'
                }`}
              >
                {message}
              </div>
            ) : null}
          </form>
        </motion.div>
      </div>
    </section>
  )
}
