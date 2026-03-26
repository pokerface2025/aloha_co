'use client'

import { startTransition, type ReactNode, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import { ArrowRight, Heart, RotateCcw, Shield, ShoppingBag, Sparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/store'
import { formatPrice, products } from '@/lib/products'
import type { Product, Size, SortOption } from '@/lib/types'
import { getCollections } from '@/src/data/catalog'
import { useTheme } from '@/components/ui/theme-context'
import { COLLECTIONS, type CollectionId } from '@/lib/constants'

type ShopView = 'quest' | 'collections'
type QuestStage = 'intro' | 'browse' | 'result'
type QuestReaction = 'like' | 'pass'

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Más nuevas' },
  { value: 'popular', label: 'Más deseadas' },
  { value: 'price-asc', label: 'Precio asc.' },
  { value: 'price-desc', label: 'Precio desc.' },
]

const collectionPills = [
  { id: 'all', label: 'Todos los capítulos' },
  { id: COLLECTIONS.COLOMBIA, label: 'Esto Es Colombia' },
  { id: COLLECTIONS.PLENTY, label: 'Drop Plenty' },
  { id: COLLECTIONS.DOLCE_VITA, label: 'Dolce Vita' },
  { id: COLLECTIONS.QUILLAMI, label: 'Made in Quillami' },
] as const

const headingFont = '[font-family:var(--font-shop-heading)]'
const bodyFont = '[font-family:var(--font-shop-body)]'
const monoFont = '[font-family:var(--font-shop-mono)]'

export function ShopContent() {
  const { audience } = useTheme()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { addItem, items } = useCartStore()
  const filterParam = searchParams.get('filter')
  const sortParam = searchParams.get('sort') as SortOption | null
  const collectionParam = searchParams.get('collection') as CollectionId | null
  const viewParam = searchParams.get('view')
  const collections = getCollections()
  const activeViewFromQuery: ShopView = viewParam === 'collections' ? 'collections' : 'quest'

  const activeCollection = collections.some((collection) => collection.slug === collectionParam)
    ? collectionParam || 'all'
    : 'all'

  const [view, setView] = useState<ShopView>(activeViewFromQuery)
  const [stage, setStage] = useState<QuestStage>('intro')
  const [sortBy, setSortBy] = useState<SortOption>(sortParam || 'newest')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState(1)
  const [likedProducts, setLikedProducts] = useState<Array<{ product: Product; score: number }>>([])
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState<Size | null>(null)
  const [checkoutMessage, setCheckoutMessage] = useState('')
  const [isPreparingCheckout, setIsPreparingCheckout] = useState(false)

  const filteredProducts = useMemo(() => {
    const isKidsUniverse = audience === 'kids'
    let filtered = products.filter((product) => {
      const matchesCollection =
        activeCollection === 'all' || product.collectionId === activeCollection
      const matchesUniverse = isKidsUniverse ? product.category === 'kids' : product.category !== 'kids'
      return matchesCollection && matchesUniverse
    })

    if (filterParam === 'hot-sale') {
      filtered = filtered.filter((product) => product.isHotSale)
    }

    switch (sortBy) {
      case 'newest':
        filtered = filtered.filter((product) => product.isNew).concat(filtered.filter((product) => !product.isNew))
        break
      case 'popular':
        filtered = [...filtered].sort((left, right) => {
          return getQuestScore(right, filtered.length, 0) - getQuestScore(left, filtered.length, 0)
        })
        break
      case 'price-asc':
        filtered = [...filtered].sort((left, right) => left.price - right.price)
        break
      case 'price-desc':
        filtered = [...filtered].sort((left, right) => right.price - left.price)
        break
    }

    return filtered
  }, [activeCollection, audience, filterParam, sortBy])

  const currentProduct = filteredProducts[currentIndex] || null
  const topMatch = useMemo(() => {
    if (likedProducts.length > 0) {
      return [...likedProducts].sort((left, right) => right.score - left.score)[0]?.product ?? null
    }

    return filteredProducts[0] ?? null
  }, [filteredProducts, likedProducts])

  const activeCollectionLabel =
    collectionPills.find((collection) => collection.id === activeCollection)?.label || 'Todos los capítulos'

  const collectionSections = useMemo(() => {
    const visibleCollections = collections.filter((collection) => {
      if (activeCollection === 'all') return true
      return collection.slug === activeCollection
    })

    return visibleCollections
      .map((collection) => ({
        collection,
        products: filteredProducts.filter((product) => product.collectionId === collection.slug),
      }))
      .filter((section) => section.products.length > 0)
  }, [activeCollection, collections, filteredProducts])

  const resultColors = useMemo(
    () => (topMatch ? getProductColors(topMatch) : []),
    [topMatch],
  )

  const availableSizes = useMemo(
    () => (topMatch ? getAvailableSizes(topMatch, selectedColor) : []),
    [selectedColor, topMatch],
  )

  const selectedVariant =
    topMatch && selectedSize
      ? topMatch.variants.find(
          (variant) => variant.color === selectedColor && variant.size === selectedSize && variant.stock > 0,
        ) || null
      : null

  useEffect(() => {
    const root = document.documentElement
    const nextVars: Record<string, string> = {
      '--background': '#F6F0E6',
      '--foreground': '#335A77',
      '--card': '#FCFAF5',
      '--card-foreground': '#335A77',
      '--popover': '#FFFCF7',
      '--popover-foreground': '#335A77',
      '--primary': '#8CB9D8',
      '--primary-foreground': '#FCFAF5',
      '--secondary': '#E9F4FB',
      '--secondary-foreground': '#335A77',
      '--muted': '#EFE6D8',
      '--muted-foreground': '#6F8DA7',
      '--accent': '#CFE4F2',
      '--accent-foreground': '#335A77',
      '--border': 'rgba(140, 185, 216, 0.32)',
      '--input': '#F5EEE2',
      '--ring': 'rgba(140, 185, 216, 0.45)',
      '--bg-primary': '#E6F4FB',
      '--bg-secondary': '#F6F0E6',
      '--ambient-tint': '#A5CDE8',
      '--ambient-opacity': '0.14',
      '--wave-opacity': '0.24',
      '--wave-blend': 'soft-light',
    }
    const previousTheme = root.getAttribute('data-theme')
    const previousVars = Object.fromEntries(
      Object.keys(nextVars).map((key) => [key, root.style.getPropertyValue(key)]),
    )

    Object.entries(nextVars).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
    root.setAttribute('data-theme', 'light')

    return () => {
      Object.entries(previousVars).forEach(([key, value]) => {
        if (value) {
          root.style.setProperty(key, value)
          return
        }

        root.style.removeProperty(key)
      })

      if (previousTheme) {
        root.setAttribute('data-theme', previousTheme)
        return
      }

      root.removeAttribute('data-theme')
    }
  }, [])

  useEffect(() => {
    setView(activeViewFromQuery)
  }, [activeViewFromQuery])

  useEffect(() => {
    setStage('intro')
    setCurrentIndex(0)
    setSwipeDirection(1)
    setLikedProducts([])
    setCheckoutMessage('')
    setIsPreparingCheckout(false)
  }, [activeCollection, audience, filterParam, sortBy])

  useEffect(() => {
    if (!topMatch) {
      setSelectedColor('')
      setSelectedSize(null)
      return
    }

    const colors = getProductColors(topMatch)
    setSelectedColor((previousColor) =>
      colors.some((color) => color.color === previousColor) ? previousColor : colors[0]?.color || '',
    )
  }, [topMatch])

  useEffect(() => {
    if (!topMatch || !selectedColor) {
      setSelectedSize(null)
      return
    }

    const sizes = getAvailableSizes(topMatch, selectedColor)
    setSelectedSize((previousSize) => (previousSize && sizes.includes(previousSize) ? previousSize : sizes[0] || null))
  }, [selectedColor, topMatch])

  const beginQuest = () => {
    setCheckoutMessage('')
    setIsPreparingCheckout(false)
    setCurrentIndex(0)
    setLikedProducts([])
    setSwipeDirection(1)
    setStage('browse')
  }

  const resetQuest = () => {
    setStage('intro')
    setCurrentIndex(0)
    setLikedProducts([])
    setSwipeDirection(1)
    setCheckoutMessage('')
    setIsPreparingCheckout(false)
  }

  const updateQueryParam = (key: 'collection' | 'sort' | 'view', value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (key === 'collection' && value === 'all') {
      params.delete('collection')
    } else {
      params.set(key, value)
    }

    if (key === 'sort' && value === 'newest') {
      params.delete('sort')
    }

    if (key === 'view' && value === 'quest') {
      params.delete('view')
    }

    const nextUrl = params.toString() ? `/shop?${params.toString()}` : '/shop'
    startTransition(() => router.replace(nextUrl))
  }

  const handleSortChange = (value: SortOption) => {
    setSortBy(value)
    updateQueryParam('sort', value)
  }

  const handleCollectionSelect = (value: string) => {
    updateQueryParam('collection', value)
  }

  const handleViewChange = (nextView: ShopView) => {
    setView(nextView)
    updateQueryParam('view', nextView)
  }

  const handleReaction = (reaction: QuestReaction) => {
    if (!currentProduct) return

    setCheckoutMessage('')
    setSwipeDirection(reaction === 'like' ? 1 : -1)

    if (reaction === 'like') {
      setLikedProducts((previousLikes) => [
        ...previousLikes,
        {
          product: currentProduct,
          score: getQuestScore(currentProduct, filteredProducts.length, previousLikes.length),
        },
      ])
    }

    if (currentIndex >= filteredProducts.length - 1) {
      setStage('result')
      return
    }

    setCurrentIndex((previousIndex) => previousIndex + 1)
  }

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 120) {
      handleReaction('like')
      return
    }

    if (info.offset.x < -120) {
      handleReaction('pass')
    }
  }

  const handleCheckout = () => {
    if (!topMatch || !selectedVariant) {
      setCheckoutMessage('Selecciona una talla disponible antes de continuar.')
      return
    }

    const existingItem = items.find((item) => item.variantSku === selectedVariant.sku)
    setCheckoutMessage('')
    setIsPreparingCheckout(true)

    if (!existingItem) {
      addItem({
        productId: topMatch.id,
        variantSku: selectedVariant.sku,
        size: selectedVariant.size,
        color: selectedVariant.color,
        colorHex: selectedVariant.colorHex,
      })
    }

    router.push('/checkout')
  }

  if (filteredProducts.length === 0) {
    return (
      <section className={`relative mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl items-center px-4 py-16 sm:px-6 lg:px-8 ${bodyFont}`}>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(140,185,216,0.18),transparent_38%),radial-gradient(circle_at_bottom,rgba(227,210,182,0.14),transparent_35%)]" />
          <div className="mx-auto max-w-2xl rounded-[32px] border border-[#8CB9D8]/18 bg-[rgba(252,250,245,0.84)] px-8 py-12 text-center shadow-[0_30px_120px_rgba(124,165,193,0.14)] backdrop-blur">
            <span className={`text-[11px] uppercase tracking-[0.38em] text-[#6B98B8] ${monoFont}`}>
              Archivo editorial
            </span>
          <h1 className={`mt-6 text-4xl text-[#335A77] sm:text-5xl ${headingFont}`}>
            No hay piezas disponibles en esta selección.
          </h1>
          <p className="mt-5 text-base text-[#5E7A93]">
            Ajusta la colección o vuelve más tarde. Esta edición todavía no ha salido del atelier.
          </p>
          <Button
            onClick={resetQuest}
            className="mt-8 min-h-11 rounded-full border border-[#8CB9D8]/30 bg-[#8CB9D8] px-7 text-[#FCFAF5] hover:bg-[#7DAFCE]"
          >
            Reiniciar Experiencia
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className={`relative isolate overflow-hidden ${bodyFont}`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[36rem] bg-[radial-gradient(circle_at_top,rgba(140,185,216,0.24),transparent_52%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[24rem] bg-[radial-gradient(circle_at_bottom,rgba(227,210,182,0.14),transparent_48%)]" />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="flex flex-col gap-6 rounded-[32px] border border-[#8CB9D8]/18 bg-[rgba(252,250,245,0.78)] p-5 shadow-[0_20px_100px_rgba(124,165,193,0.14)] backdrop-blur sm:p-8">
          <div className="flex flex-col gap-5 border-b border-[#8CB9D8]/12 pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className={`text-[11px] uppercase tracking-[0.38em] text-[#6B98B8] ${monoFont}`}>
                {view === 'collections' ? 'Selecciones Curadas' : 'El Proceso de Selección'}
              </span>
              <h1 className={`mt-4 text-4xl leading-none text-[#335A77] sm:text-5xl lg:text-6xl ${headingFont}`}>
                {view === 'collections'
                  ? 'Colecciones'
                  : filterParam === 'hot-sale'
                    ? 'Selección en oferta.'
                    : 'El Proceso de Selección'}
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[#5E7A93] sm:text-base">
                {view === 'collections'
                  ? 'Recorre todas las colecciones con una lectura editorial, imágenes en gris que cobran color al pasar y acceso directo al checkout actual desde cada pieza.'
                  : 'Recorre una pieza a la vez, guarda la que más te conecte y termina en el proceso de compra existente sin tocar la lógica de pago.'}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {([
                { id: 'quest', label: 'El Proceso' },
                { id: 'collections', label: 'Colecciones' },
              ] as const).map((option) => {
                const isActive = option.id === view

                return (
                  <button
                    key={option.id}
                    onClick={() => handleViewChange(option.id)}
                    className={`min-h-11 rounded-full border px-5 py-2 text-left text-[11px] uppercase tracking-[0.26em] transition ${
                      isActive
                        ? 'border-[#8CB9D8] bg-[#8CB9D8] text-[#FCFAF5]'
                        : 'border-[#8CB9D8]/18 bg-transparent text-[#5E7A93] hover:border-[#8CB9D8]/45 hover:text-[#335A77]'
                    } ${monoFont}`}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>

          {view === 'collections' ? (
            <CollectionsView sections={collectionSections} />
          ) : (
          <AnimatePresence mode="wait">
            {stage === 'intro' ? (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center"
              >
                <div className="max-w-2xl py-4">
                  <span className={`text-[11px] uppercase tracking-[0.38em] text-[#6B98B8] ${monoFont}`}>
                    Capítulo 01
                  </span>
                  <h2 className={`mt-6 text-5xl leading-[0.95] text-[#335A77] sm:text-6xl ${headingFont}`}>
                    Entra a la tienda como si fuera una portada.
                  </h2>
                  <p className="mt-6 max-w-xl text-base leading-8 text-[#5E7A93]">
                    Esto no es una cuadrícula común. Es una selección tranquila, pieza por pieza, para que descubras cuál se siente realmente tuya.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button
                      onClick={beginQuest}
                      className="min-h-11 rounded-full border border-[#8CB9D8]/30 bg-[#8CB9D8] px-8 text-[#FCFAF5] hover:bg-[#7DAFCE]"
                    >
                      Iniciar Búsqueda
                    </Button>
                    <Link
                      href={currentProduct ? `/product/${currentProduct.slug}` : '/shop'}
                      className={`inline-flex min-h-11 items-center justify-center rounded-full border border-[#8CB9D8]/16 px-6 py-2 text-[11px] uppercase tracking-[0.32em] text-[#5E7A93] transition hover:border-[#8CB9D8]/42 hover:text-[#335A77] ${monoFont}`}
                    >
                      Ver ficha
                    </Link>
                  </div>
                </div>

                <IntroPreviewCard product={filteredProducts[0]} />
              </motion.div>
            ) : null}

            {stage === 'browse' && currentProduct ? (
              <motion.div
                key={`browse-${currentProduct.id}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                className="space-y-8"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-2">
                    <span className={`text-[11px] uppercase tracking-[0.36em] text-[#6B98B8] ${monoFont}`}>
                      Capítulo {String(currentIndex + 1).padStart(2, '0')}
                    </span>
                    <p className="text-sm text-[#5E7A93]">
                      Desliza a la derecha para guardar. Desliza a la izquierda para pasar. También puedes usar los botones.
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-1.5 w-40 overflow-hidden rounded-full bg-[#8CB9D8]/12">
                      <motion.div
                        className="h-full rounded-full bg-[#8CB9D8]"
                        initial={false}
                        animate={{ width: `${((currentIndex + 1) / filteredProducts.length) * 100}%` }}
                      />
                    </div>
                    <span className={`text-[11px] uppercase tracking-[0.36em] text-[#6F8DA7] ${monoFont}`}>
                      {currentIndex + 1}/{filteredProducts.length}
                    </span>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.article
                    key={currentProduct.id}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={handleDragEnd}
                    initial={{ opacity: 0, y: 24, scale: 0.97 }}
                    animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                    exit={{
                      opacity: 0,
                      x: swipeDirection > 0 ? 240 : -240,
                      rotate: swipeDirection > 0 ? 11 : -11,
                      scale: 0.92,
                    }}
                    transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                    className="mx-auto max-w-5xl cursor-grab active:cursor-grabbing"
                  >
                    <QuestCard product={currentProduct} />
                  </motion.article>
                </AnimatePresence>

                <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleReaction('pass')}
                      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-[#8CB9D8]/16 bg-white/72 px-5 text-[#335A77] transition hover:border-[#8CB9D8]/28 hover:bg-white"
                      aria-label="Pasar esta pieza"
                    >
                      <X className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleReaction('like')}
                      className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#8CB9D8]/28 bg-[#8CB9D8] px-6 text-[#FCFAF5] transition hover:bg-[#7DAFCE]"
                      aria-label="Guardar esta pieza"
                    >
                      <Heart className="mr-2 h-5 w-5" />
                      Añadir a la Colección
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <Link
                      href={`/product/${currentProduct.slug}`}
                      className={`inline-flex min-h-11 items-center justify-center rounded-full border border-[#8CB9D8]/14 px-5 py-2 text-[11px] uppercase tracking-[0.28em] text-[#5E7A93] transition hover:border-[#8CB9D8]/38 hover:text-[#335A77] ${monoFont}`}
                    >
                      Ver detalle
                    </Link>
                    <span className={`text-[11px] uppercase tracking-[0.32em] text-[#6F8DA7] ${monoFont}`}>
                      {likedProducts.length} guardadas
                    </span>
                  </div>
                </div>
              </motion.div>
            ) : null}

            {stage === 'result' && topMatch ? (
              <motion.div
                key={`result-${topMatch.id}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]"
              >
                <ResultCard
                  likedCount={likedProducts.length}
                  product={topMatch}
                  selectedColor={selectedColor}
                  selectedSize={selectedSize}
                  onColorChange={setSelectedColor}
                  onSizeChange={setSelectedSize}
                  availableSizes={availableSizes}
                  colors={resultColors}
                  checkoutMessage={checkoutMessage}
                  isPreparingCheckout={isPreparingCheckout}
                  onCheckout={handleCheckout}
                  onReset={resetQuest}
                />

                <aside className="rounded-[30px] border border-[#8CB9D8]/16 bg-white/72 p-6 shadow-[0_24px_80px_rgba(124,165,193,0.14)]">
                  <span className={`text-[11px] uppercase tracking-[0.38em] text-[#6B98B8] ${monoFont}`}>
                    Notas de selección
                  </span>
                  <h3 className={`mt-5 text-3xl text-[#335A77] ${headingFont}`}>
                    Tu Combinación Perfecta
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-[#5E7A93]">
                    {buildResultCopy(topMatch, likedProducts.length)}
                  </p>

                  <div className="mt-8 space-y-4">
                    <ResultStat
                      icon={<Sparkles className="h-4 w-4" />}
                      label="Por qué ganó"
                      value={topMatch.fitType === 'oversize' ? 'Tiene una caída más editorial y una presencia relajada.' : 'Se siente más precisa, limpia y equilibrada.'}
                    />
                    <ResultStat
                      icon={<Shield className="h-4 w-4" />}
                      label="Ruta de compra"
                      value="El flujo de Bold sigue intacto. Esta pantalla solo prepara tu variante y te envía hacia ese proceso de compra."
                    />
                    <ResultStat
                      icon={<ShoppingBag className="h-4 w-4" />}
                      label="Nota de estilo"
                      value={topMatch.shortDescription}
                    />
                  </div>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row xl:flex-col">
                    <Button
                      onClick={handleCheckout}
                      disabled={!selectedVariant || isPreparingCheckout}
                      className="min-h-11 rounded-full border border-[#8CB9D8]/28 bg-[#8CB9D8] px-6 text-[#FCFAF5] hover:bg-[#7DAFCE] disabled:opacity-60"
                    >
                      {isPreparingCheckout ? 'Abriendo checkout...' : 'Ir al checkout Bold'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                      onClick={resetQuest}
                      variant="ghost"
                      className="min-h-11 rounded-full border border-[#8CB9D8]/14 px-6 text-[#335A77] hover:bg-white/70"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reiniciar Experiencia
                    </Button>
                  </div>
                </aside>
              </motion.div>
            ) : null}
          </AnimatePresence>
          )}
        </div>
      </div>
      {view === 'collections' ? (
        <div className={`pointer-events-none fixed bottom-4 left-4 z-30 text-[10px] uppercase tracking-[0.34em] text-[#335A77]/28 ${monoFont}`}>
          Desde 2012
        </div>
      ) : null}
    </section>
  )
}

function CollectionsView({
  sections,
}: {
  sections: Array<{
    collection: ReturnType<typeof getCollections>[number]
    products: Product[]
  }>
}) {
  return (
    <div className="space-y-10">
      {sections.map((section, index) => (
        <section
          key={section.collection.id}
          className="grid gap-6 border-t border-[#8CB9D8]/12 pt-8 lg:grid-cols-[0.32fr_0.68fr] lg:pt-10"
        >
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <span className={`text-[11px] uppercase tracking-[0.38em] text-[#6B98B8] ${monoFont}`}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <h2 className={`mt-4 text-4xl text-[#335A77] sm:text-5xl ${headingFont}`}>
              {section.collection.name}
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-7 text-[#5E7A93]">
              {section.collection.description}
            </p>
          </aside>

          <div className="grid gap-5 md:grid-cols-2">
            {section.products.map((product) => (
              <CollectionsProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

function IntroPreviewCard({ product }: { product: Product }) {
  return (
    <div className="relative overflow-hidden rounded-[30px] border border-[#8CB9D8]/18 bg-[rgba(252,250,245,0.84)] p-4 shadow-[0_24px_80px_rgba(124,165,193,0.16)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(140,185,216,0.18),transparent_36%)]" />
      <div className="grid gap-5 md:grid-cols-[0.92fr_1.08fr] md:items-end">
        <div className="group relative aspect-[3/4] overflow-hidden rounded-[24px]">
          <Image
            src={product.media[0]?.url || '/placeholder.jpg'}
            alt={product.name}
            fill
            priority
            className="object-cover grayscale transition duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#335A77]/34 via-transparent to-transparent" />
        </div>
        <div className="space-y-4 p-2">
          <span className={`text-[11px] uppercase tracking-[0.38em] text-[#6B98B8] ${monoFont}`}>
            Vista previa
          </span>
          <h3 className={`text-4xl text-[#335A77] ${headingFont}`}>{product.name}</h3>
          <p className="rounded-[22px] border border-[#8CB9D8]/14 bg-white/72 px-4 py-4 text-sm leading-7 text-[#4D6D88]">
            {product.description}
          </p>
          <div className="flex flex-wrap gap-3">
            <span className={`rounded-full border border-[#8CB9D8]/18 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-[#6B98B8] ${monoFont}`}>
              Corte {product.fitType === 'oversize' ? 'amplio' : 'clásico'}
            </span>
            <span className={`rounded-full border border-[#8CB9D8]/18 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-[#6B98B8] ${monoFont}`}>
              {formatPrice(product.price)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function QuestCard({ product }: { product: Product }) {
  const secondaryImage = product.media[1]?.url || product.media[0]?.url || '/placeholder.jpg'
  const colors = getProductColors(product)

  return (
    <div className="group overflow-hidden rounded-[34px] border border-[#8CB9D8]/16 bg-[rgba(252,250,245,0.86)] shadow-[0_28px_110px_rgba(124,165,193,0.18)]">
      <div className="grid min-h-[42rem] gap-0 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative min-h-[24rem] overflow-hidden bg-[#EAF6FC]">
          <Image
            src={product.media[0]?.url || '/placeholder.jpg'}
            alt={product.name}
            fill
            priority
            className="object-cover grayscale transition duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
          />
          <Image
            src={secondaryImage}
            alt={`${product.name} vista alterna`}
            fill
            className="object-cover opacity-0 transition duration-700 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#335A77]/56 via-[#335A77]/10 to-transparent" />

          <div className="absolute left-5 top-5 flex flex-wrap gap-2">
            {product.isNew ? <Badge label="Nueva" /> : null}
            {product.isHotSale ? <Badge label="Oferta" /> : null}
            <Badge label={product.collectionId.replace('-', ' ')} />
          </div>
        </div>

        <div className="flex flex-col justify-between gap-8 p-6 sm:p-8 lg:p-10">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className={`text-[11px] uppercase tracking-[0.38em] text-[#6B98B8] ${monoFont}`}>
                Pieza seleccionada
              </span>
              <span className={`text-[11px] uppercase tracking-[0.36em] text-[#6F8DA7] ${monoFont}`}>
                {product.fitType === 'oversize' ? 'Silueta relajada' : 'Silueta precisa'}
              </span>
            </div>

            <h2 className={`mt-5 text-5xl leading-[0.92] text-[#335A77] sm:text-6xl ${headingFont}`}>
              {product.name}
            </h2>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <span className={`text-sm uppercase tracking-[0.34em] text-[#6B98B8] ${monoFont}`}>
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice > product.price ? (
                <span className={`text-sm uppercase tracking-[0.3em] text-[#6F8DA7]/55 line-through ${monoFont}`}>
                  {formatPrice(product.compareAtPrice)}
                </span>
              ) : null}
            </div>

            <p className="mt-6 max-w-xl rounded-[24px] border border-[#8CB9D8]/14 bg-white/72 px-5 py-5 text-base leading-8 text-[#4D6D88]">
              {product.description}
            </p>
          </div>

          <div className="grid gap-6 border-t border-[#8CB9D8]/12 pt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <span className={`text-[11px] uppercase tracking-[0.34em] text-[#6B98B8] ${monoFont}`}>
                  Opciones de color
                </span>
                <div className="mt-4 flex flex-wrap gap-3">
                  {colors.map((color) => (
                    <span
                      key={color.color}
                      className="inline-flex min-h-11 items-center gap-3 rounded-full border border-[#8CB9D8]/14 bg-white/62 px-4 py-2 text-sm text-[#4D6D88]"
                    >
                      <span
                        className="h-4 w-4 rounded-full border border-white/50"
                        style={{ backgroundColor: color.colorHex }}
                      />
                      {color.color}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className={`text-[11px] uppercase tracking-[0.34em] text-[#6B98B8] ${monoFont}`}>
                  Notas de experiencia
                </span>
                <ul className="mt-4 space-y-3 rounded-[22px] border border-[#8CB9D8]/14 bg-white/72 px-4 py-4 text-sm leading-7 text-[#4D6D88]">
                  <li>Ves una sola pieza al centro para decidir con calma.</li>
                  <li>Las imágenes se mantienen en escala de grises hasta acercarte.</li>
                  <li>El paso final conserva intacto tu proceso de compra actual con Bold.</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/product/${product.slug}`}
                className={`inline-flex min-h-11 items-center rounded-full border border-[#8CB9D8]/16 px-5 py-2 text-[11px] uppercase tracking-[0.3em] text-[#5E7A93] transition hover:border-[#8CB9D8]/35 hover:text-[#335A77] ${monoFont}`}
              >
                Ver ficha
              </Link>
              <span className={`text-[11px] uppercase tracking-[0.3em] text-[#6F8DA7] ${monoFont}`}>
                Desliza para decidir
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CollectionsProductCard({ product }: { product: Product }) {
  const router = useRouter()
  const { addItem, items } = useCartStore()
  const [checkoutMessage, setCheckoutMessage] = useState('')
  const [isPreparingCheckout, setIsPreparingCheckout] = useState(false)

  const selectedVariant = product.variants.find((variant) => variant.stock > 0) || null

  const handleCheckout = () => {
    if (!selectedVariant) {
      setCheckoutMessage('Esta pieza no tiene stock disponible ahora mismo.')
      return
    }

    const existingItem = items.find((item) => item.variantSku === selectedVariant.sku)
    setCheckoutMessage('')
    setIsPreparingCheckout(true)

    if (!existingItem) {
      addItem({
        productId: product.id,
        variantSku: selectedVariant.sku,
        size: selectedVariant.size,
        color: selectedVariant.color,
        colorHex: selectedVariant.colorHex,
      })
    }

    router.push('/checkout')
  }

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="group overflow-hidden rounded-[30px] border border-[#8CB9D8]/16 bg-[rgba(252,250,245,0.8)] shadow-[0_18px_70px_rgba(124,165,193,0.12)] backdrop-blur"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={product.media[0]?.url || '/placeholder.jpg'}
          alt={product.name}
          fill
          className="object-cover grayscale transition duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#335A77]/44 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {product.isNew ? <Badge label="Nueva" /> : null}
          {product.isHotSale ? <Badge label="Oferta" /> : null}
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="rounded-[22px] border border-white/16 bg-[linear-gradient(180deg,rgba(17,40,58,0.14),rgba(17,40,58,0.62))] p-4 text-[#FCFAF5] backdrop-blur-md">
            <span className={`text-[11px] uppercase tracking-[0.34em] text-[#D9ECF8] ${monoFont}`}>
              {formatPrice(product.price)}
            </span>
            <h3 className={`mt-3 text-3xl ${headingFont}`}>{product.name}</h3>
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#F5F8FB]/92">
              {product.shortDescription}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                onClick={handleCheckout}
                disabled={!selectedVariant || isPreparingCheckout}
                className="min-h-11 rounded-full border border-white/18 bg-white/18 px-4 text-[11px] uppercase tracking-[0.26em] text-[#FCFAF5] backdrop-blur hover:bg-white/26 disabled:opacity-60"
              >
                {isPreparingCheckout ? 'Abriendo...' : 'Bold Checkout'}
              </Button>
              <Link
                href={`/product/${product.slug}`}
                className={`inline-flex min-h-11 items-center justify-center rounded-full border border-white/18 px-4 py-2 text-[11px] uppercase tracking-[0.26em] text-[#F5F8FB] transition hover:bg-white/12 ${monoFont}`}
              >
                Ver detalle
              </Link>
            </div>
            {checkoutMessage ? (
              <p className="mt-3 text-sm leading-6 text-[#D9ECF8]">{checkoutMessage}</p>
            ) : null}
          </div>
        </div>
      </div>
    </motion.article>
  )
}

type ResultCardProps = {
  availableSizes: Size[]
  checkoutMessage: string
  colors: Array<{ color: string; colorHex: string }>
  isPreparingCheckout: boolean
  likedCount: number
  onCheckout: () => void
  onColorChange: (color: string) => void
  onReset: () => void
  onSizeChange: (size: Size) => void
  product: Product
  selectedColor: string
  selectedSize: Size | null
}

function ResultCard({
  availableSizes,
  checkoutMessage,
  colors,
  isPreparingCheckout,
  likedCount,
  onCheckout,
  onColorChange,
  onReset,
  onSizeChange,
  product,
  selectedColor,
  selectedSize,
}: ResultCardProps) {
  return (
    <div className="overflow-hidden rounded-[34px] border border-[#8CB9D8]/18 bg-[rgba(252,250,245,0.86)] shadow-[0_28px_110px_rgba(124,165,193,0.18)]">
      <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="group relative min-h-[25rem] overflow-hidden bg-[#EAF6FC]">
          <Image
            src={product.media[0]?.url || '/placeholder.jpg'}
            alt={product.name}
            fill
            priority
            className="object-cover grayscale transition duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#335A77]/58 via-[#335A77]/12 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <span className={`text-[11px] uppercase tracking-[0.38em] text-[#D9ECF8] ${monoFont}`}>
              Selección final
            </span>
            <h2 className={`mt-4 text-5xl leading-[0.94] text-[#FCFAF5] sm:text-6xl ${headingFont}`}>
              {product.name}
            </h2>
          </div>
        </div>

        <div className="flex flex-col gap-7 p-6 sm:p-8 lg:p-10">
          <div>
            <span className={`text-[11px] uppercase tracking-[0.38em] text-[#6B98B8] ${monoFont}`}>
              Selección terminada
            </span>
            <p className="mt-4 text-sm leading-7 text-[#5E7A93]">
              {likedCount > 0
                ? `Guardaste ${likedCount} pieza${likedCount === 1 ? '' : 's'}. Esta fue la que tuvo mayor conexión contigo.`
                : 'Pasaste todas las opciones, así que elegimos la pieza más versátil de este capítulo.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <span className={`text-sm uppercase tracking-[0.34em] text-[#6B98B8] ${monoFont}`}>
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice > product.price ? (
              <span className={`text-sm uppercase tracking-[0.3em] text-[#6F8DA7]/55 line-through ${monoFont}`}>
                {formatPrice(product.compareAtPrice)}
              </span>
            ) : null}
          </div>

          <p className="rounded-[24px] border border-[#8CB9D8]/14 bg-white/72 px-5 py-5 text-base leading-8 text-[#4D6D88]">
            {product.description}
          </p>

          <div className="space-y-5 rounded-[28px] border border-[#8CB9D8]/14 bg-white/72 p-5">
            <div>
              <span className={`text-[11px] uppercase tracking-[0.34em] text-[#6B98B8] ${monoFont}`}>
                Elige color
              </span>
              <div className="mt-4 flex flex-wrap gap-3">
                {colors.map((color) => {
                  const isActive = color.color === selectedColor

                  return (
                    <button
                      key={color.color}
                      onClick={() => onColorChange(color.color)}
                      className={`inline-flex min-h-11 items-center gap-3 rounded-full border px-4 py-2 text-sm transition ${
                        isActive
                          ? 'border-[#8CB9D8] bg-[#8CB9D8]/12 text-[#335A77]'
                          : 'border-[#8CB9D8]/14 text-[#5E7A93] hover:border-[#8CB9D8]/35 hover:text-[#335A77]'
                      }`}
                    >
                      <span
                        className="h-4 w-4 rounded-full border border-white/50"
                        style={{ backgroundColor: color.colorHex }}
                      />
                      {color.color}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <span className={`text-[11px] uppercase tracking-[0.34em] text-[#6B98B8] ${monoFont}`}>
                Elige talla
              </span>
              <div className="mt-4 grid grid-cols-4 gap-3">
                {(['S', 'M', 'L', 'XL'] as Size[]).map((size) => {
                  const isAvailable = availableSizes.includes(size)
                  const isActive = selectedSize === size

                  return (
                    <button
                      key={size}
                      onClick={() => isAvailable && onSizeChange(size)}
                      disabled={!isAvailable}
                      className={`min-h-11 rounded-2xl border text-sm transition ${
                        isActive
                          ? 'border-[#8CB9D8] bg-[#8CB9D8] text-[#FCFAF5]'
                          : isAvailable
                            ? 'border-[#8CB9D8]/14 text-[#335A77] hover:border-[#8CB9D8]/38'
                            : 'border-[#8CB9D8]/8 bg-[#F7FBFE] text-[#A7BAC9]'
                      }`}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={onCheckout}
              disabled={!selectedSize || isPreparingCheckout}
              className="min-h-11 flex-1 rounded-full border border-[#8CB9D8]/28 bg-[#8CB9D8] px-6 text-[#FCFAF5] hover:bg-[#7DAFCE] disabled:opacity-60"
            >
              Ir al checkout Bold
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              onClick={onReset}
              variant="ghost"
              className="min-h-11 rounded-full border border-[#8CB9D8]/14 px-6 text-[#335A77] hover:bg-white/70"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reiniciar Experiencia
            </Button>
          </div>

          {checkoutMessage ? (
            <p className="text-sm text-[#6B98B8]">{checkoutMessage}</p>
          ) : (
            <p className="text-sm text-[#5E7A93]">
              El paso de pago con Bold se abre después usando exactamente la implementación actual.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-[#8CB9D8]/12 bg-white/62 px-4 py-3">
      <span className={`block text-[10px] uppercase tracking-[0.32em] text-[#6B98B8] ${monoFont}`}>
        {label}
      </span>
      <span className="mt-2 block text-sm text-[#4D6D88]">{value}</span>
    </div>
  )
}

function ResultStat({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-[22px] border border-[#8CB9D8]/14 bg-white/68 p-4">
      <div className="flex items-center gap-3 text-[#6B98B8]">
        {icon}
        <span className={`text-[10px] uppercase tracking-[0.32em] ${monoFont}`}>{label}</span>
      </div>
      <p className="mt-3 text-sm leading-7 text-[#4D6D88]">{value}</p>
    </div>
  )
}

function Badge({ label }: { label: string }) {
  return (
    <span className={`rounded-full border border-white/30 bg-white/58 px-3 py-2 text-[10px] uppercase tracking-[0.28em] text-[#335A77] backdrop-blur ${monoFont}`}>
      {label}
    </span>
  )
}

function getProductColors(product: Product) {
  return Array.from(
    new Map(product.variants.map((variant) => [variant.color, { color: variant.color, colorHex: variant.colorHex }])).values(),
  )
}

function getAvailableSizes(product: Product, color: string) {
  return product.variants
    .filter((variant) => variant.color === color && variant.stock > 0)
    .map((variant) => variant.size)
}

function getQuestScore(product: Product, productCount: number, likeIndex: number) {
  return (
    productCount * 2 -
    likeIndex +
    (product.isNew ? 20 : 0) +
    (product.isHotSale ? 12 : 0) +
    (product.fitType === 'oversize' ? 6 : 3)
  )
}

function buildResultCopy(product: Product, likedCount: number) {
  if (likedCount === 0) {
    return `Como no marcaste piezas favoritas, ${product.name} quedó arriba por su equilibrio general y por lo fácil que se siente imaginarla en tu día a día.`
  }

  if (product.isNew) {
    return `${product.name} subió al primer lugar porque transmite novedad, presencia inmediata y una energía más fresca dentro de la selección.`
  }

  if (product.fitType === 'oversize') {
    return `${product.name} ganó por actitud. Su volumen, caída y soltura la vuelven la silueta más editorial de tu recorrido.`
  }

  return `${product.name} ganó por precisión. Tiene la línea más limpia del grupo y una sensación de lujo sereno sin exagerar el gesto.`
}
