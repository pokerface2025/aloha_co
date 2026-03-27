'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { getCollections } from '@/src/data/collections'

const headingFont = '[font-family:var(--font-home-heading)]'
const bodyFont = '[font-family:var(--font-home-body)]'
const monoFont = '[font-family:var(--font-home-mono)]'

const collectionImageMap: Record<string, string> = {
  colombia: '/products/ocean-breeze-tee.jpg',
  plenty: '/products/classic-white-tee.jpg',
  'dolce-vita': '/products/sunset-vibes-tee.jpg',
  quillami: '/products/tropical-palms-tee.jpg',
}

const collageClasses = [
  'md:col-span-7 md:row-span-1',
  'md:col-span-5 md:row-span-2',
  'md:col-span-4 md:row-span-1',
  'md:col-span-3 md:row-span-1',
]

export function CollectionSection() {
  const collections = getCollections()

  return (
    <section className={`relative px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24 ${bodyFont}`}>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(246,240,230,0.55),rgba(233,244,251,0.62)_32%,rgba(246,240,230,0.9))]" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-2xl">
            <span className={`text-[11px] uppercase tracking-[0.34em] text-[#6B98B8] ${monoFont}`}>
              Selección de capítulos
            </span>
            <h2 className={`mt-4 text-3xl leading-tight text-[#335A77] sm:text-5xl ${headingFont}`}>
              Un collage para ver todas las colecciones a la vez.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#5E7A93] sm:text-base sm:leading-8">
              Cada universo aparece con la misma fuerza visual para que puedas comparar moods, color y energía sin que uno opaque al otro.
            </p>
          </div>

          <Link
            href="/shop?view=collections"
            className={`inline-flex min-h-11 w-full items-center justify-center rounded-full border border-[#8CB9D8]/24 bg-white/65 px-6 text-sm uppercase tracking-[0.28em] text-[#5E86A4] transition hover:border-[#8CB9D8]/45 hover:bg-white sm:w-auto ${monoFont}`}
          >
            Ver todas las colecciones
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </motion.div>

        <div className="mt-8 grid gap-4 auto-rows-[17rem] sm:auto-rows-[19rem] md:auto-rows-[14rem] md:grid-cols-12 lg:auto-rows-[15rem]">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.06 }}
              className={`${collageClasses[index] || 'md:col-span-6 md:row-span-1'} min-h-[17rem] sm:min-h-[19rem] md:min-h-0`}
            >
              <CollectionCollageCard collection={collection} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CollectionCollageCard({
  collection,
}: {
  collection: ReturnType<typeof getCollections>[number]
}) {
  return (
    <Link
      href={`/shop?view=collections&collection=${collection.slug}`}
      className="group relative block h-full overflow-hidden rounded-[28px] border border-[#8CB9D8]/18 bg-[rgba(252,250,245,0.74)] p-2.5 shadow-[0_22px_90px_rgba(124,165,193,0.14)] backdrop-blur sm:rounded-[32px] sm:p-3"
    >
      <div className="relative h-full overflow-hidden rounded-[22px] sm:rounded-[26px]">
        <Image
          src={collectionImageMap[collection.slug] || '/hero-lifestyle.jpg'}
          alt={collection.name}
          fill
          className="object-cover grayscale transition duration-700 group-hover:scale-[1.04] group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(51,90,119,0.7))]" />

        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
          <div className="rounded-[20px] border border-white/16 bg-[linear-gradient(180deg,rgba(17,40,58,0.12),rgba(17,40,58,0.58))] p-3.5 text-[#FCFAF5] backdrop-blur-md sm:rounded-[24px] sm:p-4">
            <span className={`text-[11px] uppercase tracking-[0.32em] text-[#D9ECF8] ${monoFont}`}>
              Colección
            </span>
            <h3 className={`mt-3 text-2xl leading-tight sm:text-4xl ${headingFont}`}>{collection.name}</h3>
            <div className={`mt-4 inline-flex items-center text-sm uppercase tracking-[0.28em] text-[#D9ECF8] ${monoFont}`}>
              Explorar
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
