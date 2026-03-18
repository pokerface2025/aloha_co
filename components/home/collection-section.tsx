"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

import { GlassCard } from "@/components/ui/glass-card"
import { GlassBadge } from "@/components/ui/glass-badge"
import { getCollections } from "@/src/data/collections"

export function CollectionSection() {
  const collections = getCollections()

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Colecciones
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-foreground">
              Shop by collection
            </h2>
            <p className="mt-2 text-muted-foreground">
              Encuentra tu estilo costero en nuestras lineas premium.
            </p>
          </div>
        </motion.div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/shop?collection=${collection.slug}`}>
                <GlassCard className="glass-hover overflow-hidden">
                  <div className="relative h-48">
                    {collection.heroMedia?.type === "image" ? (
                      <Image
                        src={collection.heroMedia.url}
                        alt={collection.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-white/20 text-sm text-foreground">
                        Video placeholder
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/25 via-transparent to-transparent" />
                    <div className="absolute left-4 top-4">
                      <GlassBadge className="bg-white/70 text-foreground">
                        {collection.name}
                      </GlassBadge>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground">
                      {collection.description}
                    </p>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
