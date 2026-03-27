'use client'

import { startTransition, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import { ArrowRight, Heart, RotateCcw, X } from 'lucide-react'
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
type StyleProfile = 'hombre' | 'mujer'
type SizeMode = 'global' | 'individual'
type FavoriteSelectionConfig = {
  selected: boolean
  color: string
  size: Size | null
  quantity: number
}

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
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

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
  const [styleProfile, setStyleProfile] = useState<StyleProfile>('hombre')
  const [sortBy, setSortBy] = useState<SortOption>(sortParam || 'newest')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState(1)
  const [dragOffset, setDragOffset] = useState(0)
  const [likedProducts, setLikedProducts] = useState<Array<{ product: Product; score: number }>>([])
  const [favoriteSelections, setFavoriteSelections] = useState<Record<string, FavoriteSelectionConfig>>({})
  const [questColors, setQuestColors] = useState<Record<string, string>>({})
  const [sizeMode, setSizeMode] = useState<SizeMode>('individual')
  const [globalSize, setGlobalSize] = useState<Size | null>(null)
  const [selectedResultProductId, setSelectedResultProductId] = useState('')
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

  const questProducts = useMemo(() => {
    return [...filteredProducts]
      .sort((left, right) => {
        return (
          getQuestScore(right, filteredProducts.length, 0, styleProfile) -
          getQuestScore(left, filteredProducts.length, 0, styleProfile)
        )
      })
      .slice(0, 5)
  }, [filteredProducts, styleProfile])

  const currentProduct = questProducts[currentIndex] || null
  const currentQuestColor = currentProduct
    ? questColors[currentProduct.id] || getProductColors(currentProduct)[0]?.color || ''
    : ''

  const resultCandidates = useMemo(() => {
    if (likedProducts.length > 0) {
      const uniqueProducts = new Map<string, { product: Product; score: number }>()

      likedProducts
        .sort((left, right) => right.score - left.score)
        .forEach((entry) => {
          if (!uniqueProducts.has(entry.product.id)) {
            uniqueProducts.set(entry.product.id, entry)
          }
        })

      return Array.from(uniqueProducts.values()).map((entry) => entry.product)
    }

    return questProducts.slice(0, 3)
  }, [likedProducts, questProducts])

  const activeResultProduct =
    resultCandidates.find((product) => product.id === selectedResultProductId) || resultCandidates[0] || null

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
    () => (activeResultProduct ? getProductColors(activeResultProduct) : []),
    [activeResultProduct],
  )

  const availableSizes = useMemo(
    () => (activeResultProduct ? getAvailableSizes(activeResultProduct, selectedColor) : []),
    [activeResultProduct, selectedColor],
  )

  const selectedVariant =
    activeResultProduct && selectedSize
      ? activeResultProduct.variants.find(
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
    setStyleProfile('hombre')
    setCurrentIndex(0)
    setSwipeDirection(1)
    setDragOffset(0)
    setLikedProducts([])
    setFavoriteSelections({})
    setQuestColors({})
    setSizeMode('individual')
    setGlobalSize(null)
    setSelectedResultProductId('')
    setCheckoutMessage('')
    setIsPreparingCheckout(false)
  }, [activeCollection, audience, filterParam, sortBy])

  useEffect(() => {
    if (!activeResultProduct) {
      setSelectedColor('')
      setSelectedSize(null)
      return
    }

    const colors = getProductColors(activeResultProduct)
    setSelectedColor((previousColor) =>
      colors.some((color) => color.color === previousColor) ? previousColor : colors[0]?.color || '',
    )
  }, [activeResultProduct])

  useEffect(() => {
    if (!activeResultProduct || !selectedColor) {
      setSelectedSize(null)
      return
    }

    const sizes = getAvailableSizes(activeResultProduct, selectedColor)
    setSelectedSize((previousSize) => (previousSize && sizes.includes(previousSize) ? previousSize : sizes[0] || null))
  }, [activeResultProduct, selectedColor])

  useEffect(() => {
    if (resultCandidates.length === 0) {
      setSelectedResultProductId('')
      return
    }

    setSelectedResultProductId((previousId) =>
      resultCandidates.some((product) => product.id === previousId) ? previousId : resultCandidates[0]?.id || '',
    )
  }, [resultCandidates])

  useEffect(() => {
    setFavoriteSelections((previousSelections) => {
      const nextSelections = Object.fromEntries(
        resultCandidates.map((product, index) => {
          const previousConfig = previousSelections[product.id]
          const colors = getProductColors(product)
          const nextColor =
            previousConfig && colors.some((color) => color.color === previousConfig.color)
              ? previousConfig.color
              : colors[0]?.color || ''
          const sizes = getAvailableSizes(product, nextColor)
          const nextSize =
            previousConfig?.size && sizes.includes(previousConfig.size)
              ? previousConfig.size
              : sizes[0] || null

          return [
            product.id,
            {
              selected: previousConfig?.selected ?? (likedProducts.length > 0 ? true : index === 0),
              color: nextColor,
              size: nextSize,
              quantity: previousConfig?.quantity ?? 1,
            },
          ]
        }),
      )

      return nextSelections
    })
  }, [likedProducts.length, resultCandidates])

  useEffect(() => {
    if (!currentProduct) return

    const colors = getProductColors(currentProduct)
    if (colors.length === 0) return

    setQuestColors((previousColors) => {
      if (previousColors[currentProduct.id]) return previousColors

      return {
        ...previousColors,
        [currentProduct.id]: colors[0].color,
      }
    })
  }, [currentProduct])

  const beginQuest = () => {
    setStage('browse')
    setCheckoutMessage('')
    setIsPreparingCheckout(false)
    setCurrentIndex(0)
    setLikedProducts([])
    setFavoriteSelections({})
    setQuestColors({})
    setSizeMode('individual')
    setGlobalSize(null)
    setSelectedResultProductId('')
    setSwipeDirection(1)
    setDragOffset(0)
  }

  const startGuidedSelection = (nextProfile?: StyleProfile) => {
    if (nextProfile) {
      setStyleProfile(nextProfile)
    }
    setCheckoutMessage('')
    setIsPreparingCheckout(false)
    setCurrentIndex(0)
    setLikedProducts([])
    setFavoriteSelections({})
    setQuestColors({})
    setSizeMode('individual')
    setGlobalSize(null)
    setSelectedResultProductId('')
    setSwipeDirection(1)
    setDragOffset(0)
    setStage('browse')
  }

  const resetQuest = () => {
    setStage('intro')
    setStyleProfile('hombre')
    setCurrentIndex(0)
    setLikedProducts([])
    setFavoriteSelections({})
    setQuestColors({})
    setSizeMode('individual')
    setGlobalSize(null)
    setSelectedResultProductId('')
    setSwipeDirection(1)
    setDragOffset(0)
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
    setDragOffset(0)

    if (reaction === 'like') {
      setLikedProducts((previousLikes) => [
        ...previousLikes,
        {
          product: currentProduct,
          score: getQuestScore(currentProduct, questProducts.length, previousLikes.length, styleProfile),
        },
      ])
    }

    if (currentIndex >= questProducts.length - 1) {
      setStage('result')
      return
    }

    setCurrentIndex((previousIndex) => previousIndex + 1)
  }

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setDragOffset(0)

    if (info.offset.x > 120) {
      handleReaction('like')
      return
    }

    if (info.offset.x < -120) {
      handleReaction('pass')
    }
  }

  const handleCheckout = () => {
    if (!activeResultProduct || !selectedVariant) {
      setCheckoutMessage('Selecciona una talla disponible antes de continuar.')
      return
    }

    const existingItem = items.find((item) => item.variantSku === selectedVariant.sku)
    setCheckoutMessage('')
    setIsPreparingCheckout(true)

    if (!existingItem) {
      addItem({
        productId: activeResultProduct.id,
        variantSku: selectedVariant.sku,
        size: selectedVariant.size,
        color: selectedVariant.color,
        colorHex: selectedVariant.colorHex,
      })
    }

    router.push('/checkout')
  }

  const updateFavoriteSelection = (
    productId: string,
    updater: (current: FavoriteSelectionConfig) => FavoriteSelectionConfig,
  ) => {
    setFavoriteSelections((previousSelections) => {
      const currentSelection = previousSelections[productId]
      if (!currentSelection) return previousSelections

      return {
        ...previousSelections,
        [productId]: updater(currentSelection),
      }
    })
  }

  const applySizeToSelectedFavorites = (size: Size) => {
    setSizeMode('global')
    setGlobalSize(size)
    setFavoriteSelections((previousSelections) => {
      const nextSelections = { ...previousSelections }

      resultCandidates.forEach((product) => {
        const currentSelection = previousSelections[product.id]
        if (!currentSelection?.selected) return

        const sizes = getAvailableSizes(product, currentSelection.color)
        if (!sizes.includes(size)) return

        nextSelections[product.id] = {
          ...currentSelection,
          size,
        }
      })

      return nextSelections
    })
  }

  const handleAddSelectedToCart = () => {
    const selectedProducts = resultCandidates
      .map((product) => ({
        product,
        config: favoriteSelections[product.id],
      }))
      .filter((entry) => entry.config?.selected)

    if (selectedProducts.length === 0) {
      setCheckoutMessage('Selecciona al menos una prenda para llevarla al carrito.')
      return
    }

    const preparedItems = selectedProducts.map(({ product, config }) => {
      const variant =
        config?.size
          ? product.variants.find(
              (item) =>
                item.color === config.color &&
                item.size === config.size &&
                item.stock > 0,
            ) || null
          : null

      return {
        product,
        config,
        variant,
      }
    })

    if (preparedItems.some((entry) => !entry.config?.size || !entry.variant)) {
      setCheckoutMessage('Revisa talla y color en cada favorita antes de continuar.')
      return
    }

    setCheckoutMessage('')
    setIsPreparingCheckout(true)

    preparedItems.forEach(({ product, config, variant }) => {
      if (!config || !variant) return

      addItem({
        productId: product.id,
        variantSku: variant.sku,
        size: variant.size,
        color: variant.color,
        colorHex: variant.colorHex,
        quantity: config.quantity,
      })
    })

    router.push('/cart')
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

  const likeActive = dragOffset > 56
  const passActive = dragOffset < -56
  const selectedFavoriteEntries = resultCandidates
    .map((product) => {
      const config = favoriteSelections[product.id]
      const variant =
        config?.size
          ? product.variants.find(
              (item) =>
                item.color === config.color &&
                item.size === config.size &&
                item.stock > 0,
            ) || null
          : null

      return { product, config, variant }
    })
    .filter((entry) => entry.config?.selected)
  const selectedFavoriteCount = selectedFavoriteEntries.reduce(
    (total, entry) => total + (entry.config?.quantity || 0),
    0,
  )
  const selectedFavoriteSubtotal = selectedFavoriteEntries.reduce(
    (total, entry) => total + entry.product.price * (entry.config?.quantity || 0),
    0,
  )
  const hasGlobalSelectionCoverage =
    sizeMode !== 'global' ||
    selectedFavoriteEntries.every((entry) => {
      if (!globalSize || !entry.config) return false
      return getAvailableSizes(entry.product, entry.config.color).includes(globalSize)
    })

  return (
    <section className={`relative isolate overflow-hidden ${bodyFont}`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[36rem] bg-[radial-gradient(circle_at_top,rgba(140,185,216,0.24),transparent_52%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[24rem] bg-[radial-gradient(circle_at_bottom,rgba(227,210,182,0.14),transparent_48%)]" />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
        <div className="flex flex-col gap-6 rounded-[28px] border border-[#8CB9D8]/18 bg-[rgba(252,250,245,0.78)] p-4 shadow-[0_20px_100px_rgba(124,165,193,0.14)] backdrop-blur sm:rounded-[32px] sm:p-8">
          <div className="flex flex-col gap-5 border-b border-[#8CB9D8]/12 pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className={`text-[11px] uppercase tracking-[0.38em] text-[#6B98B8] ${monoFont}`}>
                Archivo editorial
              </span>
              <h1 className={`mt-4 text-4xl leading-none text-[#335A77] sm:text-5xl lg:text-6xl ${headingFont}`}>
                Colecciones
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[#5E7A93] sm:text-base">
                {view === 'collections'
                  ? 'Recorre el archivo visual de ALOHA con imágenes limpias que revelan cada detalle solo cuando te acercas.'
                  : 'Te recomendamos tu próxima prenda en un recorrido simple: eliges tu ruta, deslizas cinco piezas y terminas comparando tus favoritas antes de pasar al carrito.'}
              </p>
            </div>

            <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap">
              {([
                { id: 'quest', label: 'El Proceso' },
                { id: 'collections', label: 'Colecciones' },
              ] as const).map((option) => {
                const isActive = option.id === view

                return (
                  <button
                    key={option.id}
                    onClick={() => handleViewChange(option.id)}
                    className={`min-h-11 rounded-full border px-4 py-2 text-center text-[11px] uppercase tracking-[0.26em] transition sm:px-6 sm:text-left ${
                      isActive
                        ? 'border-[#8CB9D8] bg-[#8CB9D8] text-[#FCFAF5] shadow-[0_16px_40px_rgba(124,165,193,0.22)]'
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
                  className="overflow-hidden rounded-[28px] border border-[#8CB9D8]/16 bg-[rgba(252,250,245,0.72)] shadow-[0_24px_90px_rgba(124,165,193,0.12)] sm:rounded-[32px]"
                >
                  <div className="grid min-h-[56vh] md:min-h-[68vh] md:grid-cols-2">
                    {([
                      {
                        id: 'hombre',
                        title: 'Hombre',
                        description: 'Entra por una ruta serena, directa y limpia.',
                        image: '/hero-lifestyle.jpg',
                        imageClassName: 'object-center',
                      },
                      {
                        id: 'mujer',
                        title: 'Mujer',
                        description: 'Entra por una ruta suave, luminosa y con más gesto.',
                        image: '/hero-lifestyle.jpg',
                        imageClassName: 'scale-x-[-1] object-center',
                      },
                    ] as const).map((option, index) => (
                      <button
                        key={option.id}
                        onClick={() => startGuidedSelection(option.id)}
                        className={`group relative min-h-[24rem] overflow-hidden text-left sm:min-h-[30rem] md:min-h-[34rem] ${
                          index === 0 ? 'border-b md:border-b-0 md:border-r' : ''
                        } border-[#8CB9D8]/16`}
                      >
                        <Image
                          src={option.image}
                          alt={`Ruta ${option.title}`}
                          fill
                          priority
                          className={`object-cover grayscale transition duration-700 group-hover:scale-[1.03] group-hover:grayscale-0 ${option.imageClassName}`}
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(246,240,230,0.02),rgba(39,74,102,0.72))]" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(140,185,216,0.12),transparent_42%)]" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                          <span className={`text-[11px] uppercase tracking-[0.38em] text-[#D9ECF8] ${monoFont}`}>
                            Elige tu ruta
                          </span>
                          <h2 className={`mt-4 text-3xl text-[#FCFAF5] sm:text-5xl ${headingFont}`}>
                            {option.title}
                          </h2>
                          <p className="mt-4 max-w-sm text-sm leading-7 text-[#F3F8FB]/88">
                            {option.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : null}

              {stage === 'browse' && currentProduct ? (
                <motion.div
                  key={`browse-${currentProduct.id}`}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  className="mx-auto flex min-h-[60vh] max-w-5xl flex-col justify-center sm:min-h-[68vh]"
                >
                  <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <span className={`text-[11px] uppercase tracking-[0.36em] text-[#6B98B8] ${monoFont}`}>
                        Ruta {styleProfile} · Pieza {String(currentIndex + 1).padStart(2, '0')}
                      </span>
                      <p className="mt-2 text-sm text-[#5E7A93]">
                        Desliza a la izquierda para pasar o a la derecha para guardar. También puedes decidir con los botones.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-start md:self-auto">
                      <div className="h-1.5 w-40 overflow-hidden rounded-full bg-[#8CB9D8]/12">
                        <motion.div
                          className="h-full rounded-full bg-[#8CB9D8]"
                          initial={false}
                          animate={{ width: `${((currentIndex + 1) / Math.max(questProducts.length, 1)) * 100}%` }}
                        />
                      </div>
                      <span className={`text-[11px] uppercase tracking-[0.36em] text-[#6F8DA7] ${monoFont}`}>
                        {currentIndex + 1}/{questProducts.length}
                      </span>
                    </div>
                  </div>

                  <div className="mb-5 flex items-center justify-center">
                    <div className="flex w-full flex-nowrap gap-2 overflow-x-auto rounded-full border border-[#8CB9D8]/16 bg-white/62 px-3 py-3 sm:w-auto sm:flex-wrap sm:justify-center">
                      {getProductColors(currentProduct).map((color) => {
                        const isActive = color.color === currentQuestColor

                        return (
                          <button
                            key={color.color}
                            onClick={() =>
                              setQuestColors((previousColors) => ({
                                ...previousColors,
                                [currentProduct.id]: color.color,
                              }))
                            }
                            className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                              isActive
                                ? 'border-[#8CB9D8] bg-[#E9F4FB] text-[#335A77]'
                                : 'border-[#8CB9D8]/14 bg-white/72 text-[#5E7A93] hover:border-[#8CB9D8]/35'
                            }`}
                          >
                            <span
                              className="h-4 w-4 rounded-full border border-white/40"
                              style={{ backgroundColor: color.colorHex }}
                            />
                            {color.color}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.article
                      key={currentProduct.id}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      onDrag={(_event, info) => setDragOffset(info.offset.x)}
                      onDragEnd={handleDragEnd}
                      initial={{ opacity: 0, y: 24, scale: 0.97 }}
                      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                      exit={{
                        opacity: 0,
                        x: swipeDirection > 0 ? 260 : -260,
                        rotate: swipeDirection > 0 ? 10 : -10,
                        scale: 0.92,
                      }}
                      transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                      className="mx-auto w-full max-w-[22.75rem] cursor-grab active:cursor-grabbing sm:max-w-[28rem]"
                    >
                      <QuestCard
                        product={currentProduct}
                        dragOffset={dragOffset}
                        selectedColor={currentQuestColor}
                        onColorChange={(color) =>
                          setQuestColors((previousColors) => ({
                            ...previousColors,
                            [currentProduct.id]: color,
                          }))
                        }
                      />
                    </motion.article>
                  </AnimatePresence>

                  <div className="mt-6 flex items-center justify-center gap-3 sm:mt-8 sm:gap-4">
                    <button
                      onClick={() => handleReaction('pass')}
                      className={`inline-flex min-h-14 min-w-14 items-center justify-center rounded-full border px-5 transition ${
                        passActive
                          ? 'border-[#335A77] bg-[#335A77] text-[#FCFAF5] shadow-[0_18px_40px_rgba(51,90,119,0.24)]'
                          : 'border-[#8CB9D8]/16 bg-white/72 text-[#335A77] hover:border-[#8CB9D8]/28 hover:bg-white'
                      }`}
                      aria-label="Pasar esta pieza"
                    >
                      <X className="h-6 w-6" />
                    </button>
                    <button
                      onClick={() => handleReaction('like')}
                      className={`inline-flex min-h-14 items-center justify-center rounded-full border px-7 transition ${
                        likeActive
                          ? 'border-[#8CB9D8] bg-[#8CB9D8] text-[#FCFAF5] shadow-[0_18px_40px_rgba(124,165,193,0.28)]'
                          : 'border-[#8CB9D8]/28 bg-[#8CB9D8]/12 text-[#335A77] hover:bg-[#E9F4FB]'
                      }`}
                      aria-label="Guardar esta pieza"
                    >
                      <Heart className="mr-3 h-6 w-6" />
                      Quiero esta
                    </button>
                  </div>
                </motion.div>
              ) : null}

              {stage === 'result' ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  className="grid gap-6 xl:grid-cols-[1.22fr_0.78fr] xl:gap-8"
                >
                  <div className="space-y-4">
                    <div>
                      <span className={`text-[11px] uppercase tracking-[0.38em] text-[#6B98B8] ${monoFont}`}>
                        Tus favoritas
                      </span>
                      <h3 className={`mt-4 text-3xl text-[#335A77] sm:text-4xl ${headingFont}`}>
                        Compara, configura y llévalas al carrito.
                      </h3>
                      <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5E7A93]">
                        Elige una o varias, define color, talla y cantidad en cada una, y luego sigue al carrito para terminar tu compra con el flujo actual.
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {resultCandidates.map((product) => {
                        const config = favoriteSelections[product.id]
                        if (!config) return null

                        return (
                          <FavoriteSelectionCard
                            key={product.id}
                            product={product}
                            config={config}
                            sizeMode={sizeMode}
                            globalSize={globalSize}
                            onToggle={() =>
                              updateFavoriteSelection(product.id, (current) => ({
                                ...current,
                                selected: !current.selected,
                              }))
                            }
                            onColorChange={(color) =>
                              updateFavoriteSelection(product.id, (current) => {
                                const sizes = getAvailableSizes(product, color)
                                return {
                                  ...current,
                                  color,
                                  size: current.size && sizes.includes(current.size) ? current.size : sizes[0] || null,
                                }
                              })
                            }
                            onSizeChange={(size) =>
                              updateFavoriteSelection(product.id, (current) => ({
                                ...current,
                                size,
                              }))
                            }
                            onQuantityChange={(quantity) =>
                              updateFavoriteSelection(product.id, (current) => ({
                                ...current,
                                quantity: clamp(quantity, 1, 10),
                              }))
                            }
                          />
                        )
                      })}
                    </div>
                  </div>

                  <aside className="rounded-[30px] border border-[#8CB9D8]/16 bg-white/72 p-5 shadow-[0_24px_80px_rgba(124,165,193,0.14)] sm:p-6 xl:sticky xl:top-24 xl:self-start">
                    <span className={`text-[11px] uppercase tracking-[0.38em] text-[#6B98B8] ${monoFont}`}>
                      Resumen
                    </span>
                    <h3 className={`mt-5 text-3xl text-[#335A77] ${headingFont}`}>
                      Listo para pagar.
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-[#5E7A93]">
                      {activeResultProduct ? buildResultCopy(activeResultProduct, likedProducts.length) : 'Configura tus prendas favoritas y llévalas al carrito para terminar la compra.'}
                    </p>

                    <div className="mt-8 flex gap-2 rounded-full border border-[#8CB9D8]/14 bg-white/70 p-2">
                      {([
                        { id: 'global', label: 'Talla global' },
                        { id: 'individual', label: 'Por artículo' },
                      ] as const).map((option) => {
                        const isActive = sizeMode === option.id

                        return (
                          <button
                            key={option.id}
                            onClick={() => setSizeMode(option.id)}
                            className={`min-h-11 flex-1 rounded-full px-4 text-[11px] uppercase tracking-[0.28em] transition ${
                              isActive
                                ? 'bg-[#8CB9D8] text-[#FCFAF5] shadow-[0_14px_30px_rgba(124,165,193,0.24)]'
                                : 'text-[#5E7A93] hover:bg-[#E9F4FB]'
                            } ${monoFont}`}
                          >
                            {option.label}
                          </button>
                        )
                      })}
                    </div>

                    <div className="mt-8 rounded-[24px] border border-[#8CB9D8]/14 bg-[#E9F4FB]/68 p-4">
                      <span className={`text-[11px] uppercase tracking-[0.34em] text-[#6B98B8] ${monoFont}`}>
                        {sizeMode === 'global' ? 'Talla global activa' : 'Aplicar talla global'}
                      </span>
                      <div className="mt-4 grid grid-cols-4 gap-2">
                        {(['S', 'M', 'L', 'XL'] as Size[]).map((size) => (
                          <button
                            key={size}
                            onClick={() => applySizeToSelectedFavorites(size)}
                            className={`min-h-11 rounded-2xl border text-sm transition ${
                              globalSize === size
                                ? 'border-[#8CB9D8] bg-[#8CB9D8] text-[#FCFAF5]'
                                : 'border-[#8CB9D8]/18 bg-white/70 text-[#335A77] hover:border-[#8CB9D8]/38'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                      {sizeMode === 'global' && !hasGlobalSelectionCoverage ? (
                        <p className="mt-3 text-sm leading-6 text-[#6B98B8]">
                          Algunas prendas no tienen esa talla con el color elegido. Puedes ajustar por artículo.
                        </p>
                      ) : null}
                    </div>

                    <div className="mt-6 space-y-3 rounded-[24px] border border-[#8CB9D8]/14 bg-white/76 p-5">
                      <div className="flex items-center justify-between text-sm text-[#5E7A93]">
                        <span>Prendas elegidas</span>
                        <span className="text-[#335A77]">{selectedFavoriteEntries.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-[#5E7A93]">
                        <span>Unidades</span>
                        <span className="text-[#335A77]">{selectedFavoriteCount}</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-[#8CB9D8]/12 pt-3">
                        <span className="text-sm text-[#5E7A93]">Subtotal</span>
                        <span className={`text-sm uppercase tracking-[0.28em] text-[#335A77] ${monoFont}`}>
                          {formatPrice(selectedFavoriteSubtotal)}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={handleAddSelectedToCart}
                      disabled={isPreparingCheckout}
                      className="mt-8 min-h-11 w-full rounded-full border border-[#8CB9D8]/28 bg-[#8CB9D8] px-6 text-[#FCFAF5] hover:bg-[#7DAFCE] disabled:opacity-60"
                    >
                      {isPreparingCheckout ? 'Abriendo carrito...' : 'Añadir seleccionadas al carrito'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    {checkoutMessage ? (
                      <p className="mt-4 text-sm leading-7 text-[#6B98B8]">{checkoutMessage}</p>
                    ) : null}

                    <Button
                      onClick={resetQuest}
                      variant="ghost"
                      className="mt-8 min-h-11 rounded-full border border-[#8CB9D8]/14 px-6 text-[#335A77] hover:bg-white/70"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reiniciar Experiencia
                    </Button>
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
            {section.products.length > 2 ? (
              <p className={`mt-5 text-[11px] uppercase tracking-[0.32em] text-[#6B98B8] ${monoFont}`}>
                Desliza para ver más piezas
              </p>
            ) : null}
          </aside>

          <div className="flex gap-4 overflow-x-auto pb-2 pr-1 snap-x snap-mandatory sm:gap-5">
            {section.products.map((product) => (
              <div key={product.id} className="w-[15.75rem] flex-none snap-center sm:w-[18rem] lg:w-[20rem]">
                <CollectionsProductCard product={product} />
              </div>
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

function QuestCard({
  product,
  dragOffset,
  selectedColor,
  onColorChange,
}: {
  product: Product
  dragOffset: number
  selectedColor: string
  onColorChange: (color: string) => void
}) {
  const colors = getProductColors(product).slice(0, 3)
  const likeOpacity = clamp(Math.max(dragOffset, 0) / 120, 0, 1)
  const passOpacity = clamp(Math.max(-dragOffset, 0) / 120, 0, 1)

  return (
    <div className="group overflow-hidden rounded-[34px] border border-[#8CB9D8]/16 bg-[rgba(252,250,245,0.88)] shadow-[0_28px_110px_rgba(124,165,193,0.18)]">
      <div className="relative h-[clamp(31rem,72vh,39rem)] overflow-hidden bg-[#EAF6FC]">
        <Image
          src={product.media[0]?.url || '/placeholder.jpg'}
          alt={product.name}
          fill
          priority
          className="object-cover grayscale transition duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#274a66]/72 via-[#274a66]/14 to-transparent" />

        <div className="absolute left-5 top-5 flex flex-wrap gap-2">
          {product.isNew ? <Badge label="Nueva" /> : null}
          {product.isHotSale ? <Badge label="Oferta" /> : null}
        </div>

        <motion.div
          aria-hidden="true"
          style={{ opacity: passOpacity }}
          className="absolute left-5 top-20 rounded-full border border-white/18 bg-[#335A77]/82 px-4 py-3 text-[#FCFAF5] backdrop-blur"
        >
          <X className="h-6 w-6" />
        </motion.div>

        <motion.div
          aria-hidden="true"
          style={{ opacity: likeOpacity }}
          className="absolute right-5 top-5 rounded-full border border-white/18 bg-[#8CB9D8]/88 px-4 py-3 text-[#FCFAF5] backdrop-blur"
        >
          <Heart className="h-6 w-6" />
        </motion.div>

        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <div className="rounded-[28px] border border-white/16 bg-[linear-gradient(180deg,rgba(17,40,58,0.08),rgba(17,40,58,0.62))] p-5 text-[#FCFAF5] backdrop-blur-md">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className={`text-[11px] uppercase tracking-[0.34em] text-[#D9ECF8] ${monoFont}`}>
                  {formatPrice(product.price)}
                </span>
                <h2 className={`mt-3 text-4xl leading-[0.95] sm:text-5xl ${headingFont}`}>
                  {product.name}
                </h2>
              </div>
              <span className={`rounded-full border border-white/16 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-[#E8F4FB] ${monoFont}`}>
                {product.fitType === 'oversize' ? 'Silueta amplia' : 'Silueta precisa'}
              </span>
            </div>

            <p className="mt-4 max-w-md text-sm leading-7 text-[#F3F8FB]/92">
              {product.shortDescription}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color.color}
                  onClick={() => onColorChange(color.color)}
                  className={`inline-flex min-h-11 items-center gap-3 rounded-full border px-4 py-2 text-sm transition ${
                    selectedColor === color.color
                      ? 'border-white/40 bg-[#8CB9D8]/26 text-[#FCFAF5]'
                      : 'border-white/14 bg-white/10 text-[#F8FBFD] hover:bg-white/16'
                  }`}
                >
                  <span
                    className="h-4 w-4 rounded-full border border-white/40"
                    style={{ backgroundColor: color.colorHex }}
                  />
                  {color.color}
                </button>
              ))}
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#335A77]/52 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100 group-focus-within:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 translate-y-5 p-4 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
          <div className="rounded-[22px] border border-white/16 bg-[linear-gradient(180deg,rgba(17,40,58,0.18),rgba(17,40,58,0.7))] p-4 text-[#FCFAF5] backdrop-blur-md">
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
                {isPreparingCheckout ? 'Abriendo...' : 'Lo quiero'}
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

function FavoriteSelectionCard({
  product,
  config,
  sizeMode,
  globalSize,
  onToggle,
  onColorChange,
  onSizeChange,
  onQuantityChange,
}: {
  product: Product
  config: FavoriteSelectionConfig
  sizeMode: SizeMode
  globalSize: Size | null
  onToggle: () => void
  onColorChange: (color: string) => void
  onSizeChange: (size: Size) => void
  onQuantityChange: (quantity: number) => void
}) {
  const colors = getProductColors(product)
  const availableSizes = getAvailableSizes(product, config.color)
  const displayedSize = sizeMode === 'global' && globalSize ? globalSize : config.size

  return (
    <div
      className={`overflow-hidden rounded-[28px] border shadow-[0_18px_60px_rgba(124,165,193,0.12)] transition ${
        config.selected
          ? 'border-[#8CB9D8] bg-[#FCFAF5]'
          : 'border-[#8CB9D8]/14 bg-white/72'
      }`}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={product.media[0]?.url || '/placeholder.jpg'}
          alt={product.name}
          fill
          className="object-cover grayscale transition duration-700 hover:scale-[1.03] hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#335A77]/58 via-[#335A77]/8 to-transparent" />
        <button
          onClick={onToggle}
          className={`absolute right-4 top-4 min-h-11 rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.26em] backdrop-blur transition ${
            config.selected
              ? 'border-white/18 bg-[#8CB9D8] text-[#FCFAF5]'
              : 'border-white/18 bg-white/18 text-[#FCFAF5]'
          } ${monoFont}`}
        >
          {config.selected ? 'Elegida' : 'Elegir'}
        </button>
        <div className="absolute inset-x-0 bottom-0 p-5 text-[#FCFAF5]">
          <span className={`text-[11px] uppercase tracking-[0.34em] text-[#D9ECF8] ${monoFont}`}>
            {formatPrice(product.price)}
          </span>
          <h4 className={`mt-3 text-3xl ${headingFont}`}>{product.name}</h4>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[#F5F8FB]/92">
            {product.shortDescription}
          </p>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div>
          <span className={`text-[11px] uppercase tracking-[0.34em] text-[#6B98B8] ${monoFont}`}>
            Color
          </span>
          <div className="mt-3 flex flex-wrap gap-2">
            {colors.map((color) => {
              const isActive = color.color === config.color

              return (
                <button
                  key={color.color}
                  onClick={() => onColorChange(color.color)}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                    isActive
                      ? 'border-[#8CB9D8] bg-[#E9F4FB] text-[#335A77]'
                      : 'border-[#8CB9D8]/14 text-[#5E7A93] hover:border-[#8CB9D8]/35'
                  }`}
                >
                  <span
                    className="h-4 w-4 rounded-full border border-white/40"
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
            {sizeMode === 'global' ? 'Talla global' : 'Talla'}
          </span>
          {sizeMode === 'global' ? (
            <p className="mt-2 text-sm text-[#5E7A93]">
              Esta tarjeta usa la talla global que elijas en el resumen.
            </p>
          ) : null}
          <div className="mt-3 grid grid-cols-4 gap-2">
            {(['S', 'M', 'L', 'XL'] as Size[]).map((size) => {
              const isAvailable = availableSizes.includes(size)
              const isActive = displayedSize === size

              return (
                <button
                  key={size}
                  onClick={() => isAvailable && onSizeChange(size)}
                  disabled={!isAvailable || sizeMode === 'global'}
                  className={`min-h-11 rounded-2xl border text-sm transition ${
                    isActive
                      ? 'border-[#8CB9D8] bg-[#8CB9D8] text-[#FCFAF5]'
                      : isAvailable
                        ? 'border-[#8CB9D8]/14 text-[#335A77] hover:border-[#8CB9D8]/35'
                        : 'border-[#8CB9D8]/8 bg-[#F7FBFE] text-[#A7BAC9]'
                  } ${sizeMode === 'global' ? 'cursor-default' : ''}`}
                >
                  {size}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-[22px] border border-[#8CB9D8]/14 bg-[#E9F4FB]/58 px-4 py-3">
          <span className={`text-[11px] uppercase tracking-[0.34em] text-[#6B98B8] ${monoFont}`}>
            Cantidad
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onQuantityChange(config.quantity - 1)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-[#8CB9D8]/18 bg-white/80 text-[#335A77]"
              aria-label="Reducir cantidad"
            >
              -
            </button>
            <span className="w-6 text-center text-sm text-[#335A77]">{config.quantity}</span>
            <button
              onClick={() => onQuantityChange(config.quantity + 1)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-[#8CB9D8]/18 bg-white/80 text-[#335A77]"
              aria-label="Aumentar cantidad"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
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
  const hasValidSelection = selectedSize !== null && availableSizes.includes(selectedSize)

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
              disabled={!hasValidSelection || isPreparingCheckout}
              className="min-h-11 flex-1 rounded-full border border-[#8CB9D8]/28 bg-[#8CB9D8] px-6 text-[#FCFAF5] hover:bg-[#7DAFCE] disabled:opacity-60"
            >
              {isPreparingCheckout ? 'Abriendo checkout...' : 'Lo quiero'}
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

function getQuestScore(
  product: Product,
  productCount: number,
  likeIndex: number,
  styleProfile: StyleProfile = 'hombre',
) {
  const profileBias =
    styleProfile === 'mujer'
      ? (product.fitType === 'oversize' ? 8 : 3) + (product.isNew ? 5 : 0)
      : (product.fitType === 'regular' ? 8 : 3) + (product.isHotSale ? 5 : 0)

  return (
    productCount * 2 -
    likeIndex +
    profileBias +
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
