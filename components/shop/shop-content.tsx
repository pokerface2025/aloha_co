'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProductCard } from '@/components/product/product-card'
import { getUniqueColors, products } from '@/lib/products'
import type { Size, FitType, SortOption } from '@/lib/types'
import { getCollections } from '@/src/data/catalog'
import { useTheme } from '@/components/ui/theme-context'
import { COLLECTIONS, type CollectionId } from '@/lib/constants'

const sizes: Size[] = ['S', 'M', 'L', 'XL']
const fits: FitType[] = ['oversize', 'regular']
const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Más nuevos' },
  { value: 'popular', label: 'Populares' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
]

export function ShopContent() {
  const { setAmbientTint, audience, setTheme } = useTheme()
  const router = useRouter()
  const searchParams = useSearchParams()
  const filterParam = searchParams.get('filter')
  const sortParam = searchParams.get('sort') as SortOption | null
  const collectionParam = searchParams.get('collection') as CollectionId | null

  const [selectedSizes, setSelectedSizes] = useState<Size[]>([])
  const [selectedFits, setSelectedFits] = useState<FitType[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortOption>(sortParam || 'newest')
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  const uniqueColors = getUniqueColors(audience)
  const collections = getCollections()
  const activeCollection = collections.some((c) => c.slug === collectionParam)
    ? collectionParam || 'all'
    : 'all'

  const activeCollectionData = collections.find((c) => c.slug === activeCollection)
  const collectionCopy: Record<CollectionId, { title: string; description: string }> = {
    [COLLECTIONS.COLOMBIA]: {
      title: 'Herencia ancestral y alma bordada',
      description:
        'Una oda a la biodiversidad andina y caribeña. Cada bordado es un microrrelato de nuestra tierra. Color, identidad y orgullo en un lienzo de algodón premium.',
    },
    [COLLECTIONS.PLENTY]: {
      title: 'El peso de la intención: abundancia',
      description:
        'La sobriedad es la máxima expresión del lujo. Diseñada para quienes encuentran seguridad en el silencio y el poder en el propósito.',
    },
    [COLLECTIONS.DOLCE_VITA]: {
      title: 'Ocio mediterráneo: de Amalfi al Caribe',
      description:
        'Donde el sol de Italia abraza la brisa del mar. Una transición fluida entre lo casual y lo extraordinario. Incluye una postal de colección.',
    },
    [COLLECTIONS.QUILLAMI]: {
      title: 'La costa dorada: historia de dos ciudades',
      description:
        "La energía vibrante de Barranquilla se encuentra con los rascacielos de Miami. Sofisticación tropical y 'sabrosura' curada para el ciudadano del mundo.",
    },
  }
  const collectionPills = [
    { id: COLLECTIONS.COLOMBIA, label: 'Esto es Colombia' },
    { id: COLLECTIONS.PLENTY, label: 'Drop Plenty' },
    { id: COLLECTIONS.DOLCE_VITA, label: 'Dolce Vita' },
    { id: COLLECTIONS.QUILLAMI, label: 'Made in Quillami' },
  ]

  console.log('Current Filter:', activeCollection)
  useEffect(() => {
    console.table(products.map((p) => ({ name: p.name, id: p.collectionId })))
  }, [])

  const filteredProducts = useMemo(() => {
    const isKidsUniverse = audience === 'kids'
    let filtered = products.filter((p) => {
      const matchesCollection =
        activeCollection === 'all' || p.collectionId === activeCollection
      const matchesUniverse = isKidsUniverse ? p.category === 'kids' : p.category !== 'kids'
      return matchesCollection && matchesUniverse
    })

    if (filterParam === 'hot-sale') {
      filtered = filtered.filter((p) => p.isHotSale)
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered = filtered.filter((p) => p.isNew).concat(filtered.filter((p) => !p.isNew))
        break
      case 'popular':
        // Mock: just reverse the order
        filtered = [...filtered].reverse()
        break
      case 'price-asc':
        filtered = [...filtered].sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filtered = [...filtered].sort((a, b) => b.price - a.price)
        break
    }

    return filtered
  }, [activeCollection, filterParam, selectedSizes, selectedFits, selectedColors, sortBy, audience])

  useEffect(() => {
    if (activeCollection === 'all') {
      setAmbientTint('#ffffff', '0')
      setTheme('hero')
      return
    }

    const tintMap: Record<string, { color: string; opacity: string }> = {
      [COLLECTIONS.COLOMBIA]: { color: '#FAF3E0', opacity: '0.08' },
      [COLLECTIONS.PLENTY]: { color: '#F0F2F5', opacity: '0.08' },
      [COLLECTIONS.DOLCE_VITA]: { color: '#E0F7FA', opacity: '0.08' },
      [COLLECTIONS.QUILLAMI]: { color: '#FFF9E6', opacity: '0.08' },
    }

    const tint = tintMap[activeCollection] || { color: '#ffffff', opacity: '0' }
    setAmbientTint(tint.color, tint.opacity)
    setTheme(activeCollection === COLLECTIONS.QUILLAMI ? 'quillami' : 'hero')
  }, [activeCollection, setAmbientTint, setTheme])

  const handleCollectionSelect = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (slug === 'all') {
      params.delete('collection')
    } else {
      params.set('collection', slug)
    }
    router.push(`/shop?${params.toString()}`)
  }

  const toggleSize = (size: Size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    )
  }

  const toggleFit = (fit: FitType) => {
    setSelectedFits((prev) =>
      prev.includes(fit) ? prev.filter((f) => f !== fit) : [...prev, fit]
    )
  }

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    )
  }

  const clearFilters = () => {
    setSelectedSizes([])
    setSelectedFits([])
    setSelectedColors([])
  }

  const hasActiveFilters = selectedSizes.length > 0 || selectedFits.length > 0 || selectedColors.length > 0

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Size Filter */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Talla</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                selectedSizes.includes(size)
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Fit Filter */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Fit</h3>
        <div className="flex flex-wrap gap-2">
          {fits.map((fit) => (
            <button
              key={fit}
              onClick={() => toggleFit(fit)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors capitalize ${
                selectedFits.includes(fit)
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {fit}
            </button>
          ))}
        </div>
      </div>

      {/* Color Filter */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Color</h3>
        <div className="flex flex-wrap gap-2">
          {uniqueColors.map(({ color, colorHex }) => (
            <button
              key={color}
              onClick={() => toggleColor(color)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition-colors ${
                selectedColors.includes(color)
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <span
                className="h-4 w-4 rounded-full border border-border"
                style={{ backgroundColor: colorHex }}
              />
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="ghost" className="w-full" onClick={clearFilters}>
          <X className="mr-2 h-4 w-4" />
          Limpiar filtros
        </Button>
      )}
    </div>
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {filterParam === 'hot-sale' ? 'Hot Sale' : 'Tienda'}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {audience === 'kids'
            ? 'Legado y estilo para el futuro.'
            : `${filteredProducts.length} ${filteredProducts.length === 1 ? 'producto' : 'productos'}`}
        </p>
      </div>

      {/* Filters Bar */}
      <GlassCard className="sticky top-16 z-30 mb-8 flex flex-col gap-4 border-white/20 bg-white/15 px-4 py-4 sm:static">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleCollectionSelect('all')}
            className={`rounded-full border px-4 py-2 text-[12px] uppercase tracking-[0.1em] transition-colors ${
              activeCollection === 'all'
                ? 'border-black bg-[#f9fafb] font-medium text-foreground shadow-sm'
                : 'border-[#e5e7eb] text-foreground'
            }`}
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Ver todo
          </button>
          <div className="hidden sm:block h-6 w-px bg-white/30" />
          <div className="flex flex-wrap gap-2 overflow-x-auto">
            {collectionPills.map((collection) => (
              <button
                key={collection.id}
                onClick={() => handleCollectionSelect(collection.id)}
                className={`rounded-full border px-4 py-2 text-[12px] uppercase tracking-[0.1em] transition-colors ${
                  activeCollection === collection.id
                    ? 'border-black bg-[#f9fafb] font-medium text-foreground shadow-sm'
                    : 'border-[#e5e7eb] text-foreground hover:text-foreground'
                }`}
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {collection.label}
              </button>
            ))}
          </div>
        </div>

        {activeCollection !== 'all' && activeCollectionData ? (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground font-serif">
              {collectionCopy[activeCollection as CollectionId]?.title || activeCollectionData.description}
            </p>
            <TypewriterText
              key={activeCollectionData.slug}
              text={
                collectionCopy[activeCollection as CollectionId]?.description ||
                activeCollectionData.description ||
                ''
              }
            />
          </div>
        ) : null}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Mobile Filter Button */}
          <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <SheetTrigger asChild>
              <GlassButton className="lg:hidden">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filtros
                {hasActiveFilters && (
                  <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    {selectedSizes.length + selectedFits.length + selectedColors.length}
                  </span>
                )}
              </GlassButton>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FiltersContent />
              </div>
            </SheetContent>
          </Sheet>

          {/* Sort */}
          <div className="flex items-center gap-2 sm:ml-auto">
            <span className="text-sm text-muted-foreground">Ordenar:</span>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-[180px] bg-white/20 border-white/20 backdrop-blur-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </GlassCard>

      {/* Active Filters Pills */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            {selectedSizes.map((size) => (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
              >
                Talla {size}
                <X className="h-3 w-3" />
              </button>
            ))}
            {selectedFits.map((fit) => (
              <button
                key={fit}
                onClick={() => toggleFit(fit)}
                className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary capitalize"
              >
                {fit}
                <X className="h-3 w-3" />
              </button>
            ))}
            {selectedColors.map((color) => (
              <button
                key={color}
                onClick={() => toggleColor(color)}
                className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
              >
                {color}
                <X className="h-3 w-3" />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-8">
        {/* Desktop Filters Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <h2 className="font-semibold text-foreground mb-6">Filtros</h2>
            <FiltersContent />
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              {activeCollection !== 'all' ? (
                <p className="font-serif text-lg text-foreground py-12">
                  Esta serie limitada se encuentra actualmente en preparación.
                </p>
              ) : (
                <>
                  <p className="text-muted-foreground">
                    No encontramos productos con esos filtros.
                  </p>
                  <Button variant="link" onClick={clearFilters} className="mt-2">
                    Limpiar filtros
                  </Button>
                </>
              )}
            </div>
          ) : (
            <motion.div
              layout
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={{
                hidden: {},
                show: {
                  transition: { staggerChildren: 0.12 },
                },
              }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    layout
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: {
                        opacity: 1,
                        y: 0,
                        transition: { type: 'spring', stiffness: 220, damping: 22 },
                      },
                    }}
                  >
                    <ProductCard product={product} index={index} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

function TypewriterText({ text }: { text: string }) {
  return (
    <motion.p
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.015 },
        },
      }}
      className="text-sm text-muted-foreground"
      style={{
        fontFamily: 'var(--font-body)',
        fontWeight: 300,
        lineHeight: 1.8,
        letterSpacing: '0.05em',
      }}
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          variants={{
            hidden: { opacity: 0, y: 4 },
            show: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.2 }}
          style={{ display: 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.p>
  )
}
