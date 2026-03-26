'use client'

import { type MouseEvent as ReactMouseEvent, type ReactNode, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion, type PanInfo, useMotionValue, useSpring } from 'framer-motion'
import { ArrowRight, Heart, RotateCcw, Shield, ShoppingBag, Star, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice, getBestSellers } from '@/lib/products'
import { useCartStore } from '@/lib/store'
import type { Product, Size } from '@/lib/types'
import { useTheme } from '@/components/ui/theme-context'

type EtapaHero = 'intro' | 'seleccion' | 'resultado'
type ReaccionHero = 'like' | 'pass'
const HERO_LIKES_KEY = 'aloha:hero-likes'

const headingFont = '[font-family:var(--font-home-heading)]'
const bodyFont = '[font-family:var(--font-home-body)]'
const monoFont = '[font-family:var(--font-home-mono)]'
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

export function HeroSection() {
  const { audience } = useTheme()
  const router = useRouter()
  const { addItem, items } = useCartStore()
  const productos = useMemo(() => getBestSellers(audience).slice(0, 4), [audience])

  const [etapa, setEtapa] = useState<EtapaHero>('intro')
  const [indiceActual, setIndiceActual] = useState(0)
  const [direccion, setDireccion] = useState(1)
  const [likes, setLikes] = useState<Array<{ product: Product; score: number }>>([])
  const [likesPorProducto, setLikesPorProducto] = useState<Record<string, number>>({})
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState<Size | null>(null)
  const [checkoutMessage, setCheckoutMessage] = useState('')
  const [isPreparingCheckout, setIsPreparingCheckout] = useState(false)
  const [hoverOffset, setHoverOffset] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const hoverX = useMotionValue(0)
  const hoverRotate = useMotionValue(0)
  const springHoverX = useSpring(hoverX, { stiffness: 240, damping: 24, mass: 0.6 })
  const springHoverRotate = useSpring(hoverRotate, { stiffness: 240, damping: 24, mass: 0.6 })

  const productoActual = productos[indiceActual] || null
  const piezaElegida = useMemo(() => {
    if (likes.length > 0) {
      return [...likes].sort((left, right) => right.score - left.score)[0]?.product ?? null
    }

    return productos[0] ?? null
  }, [likes, productos])

  const totalLikesActual = productoActual ? likesPorProducto[productoActual.id] || 0 : 0
  const ratingPromedioActual = productoActual ? getProductRating(productoActual, totalLikesActual) : 5
  const totalLikesPiezaElegida = piezaElegida ? likesPorProducto[piezaElegida.id] || 0 : 0
  const interactionOffset = dragOffset !== 0 ? dragOffset : hoverOffset
  const likeActivo = interactionOffset > 46
  const passActivo = interactionOffset < -46

  const resultColors = useMemo(
    () => (piezaElegida ? getProductColors(piezaElegida) : []),
    [piezaElegida],
  )

  const availableSizes = useMemo(
    () => (piezaElegida ? getAvailableSizes(piezaElegida, selectedColor) : []),
    [piezaElegida, selectedColor],
  )

  const selectedVariant =
    piezaElegida && selectedSize
      ? piezaElegida.variants.find(
          (variant) => variant.color === selectedColor && variant.size === selectedSize && variant.stock > 0,
        ) || null
      : null

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(HERO_LIKES_KEY)
      if (!raw) return

      const parsed = JSON.parse(raw) as Record<string, number>
      setLikesPorProducto(parsed)
    } catch (error) {
      console.warn('No se pudieron cargar los corazones del hero.', error)
    }
  }, [])

  useEffect(() => {
    setEtapa('intro')
    setIndiceActual(0)
    setDireccion(1)
    setLikes([])
    setCheckoutMessage('')
    setIsPreparingCheckout(false)
  }, [audience])

  useEffect(() => {
    if (!piezaElegida) {
      setSelectedColor('')
      setSelectedSize(null)
      return
    }

    const colors = getProductColors(piezaElegida)
    setSelectedColor((previousColor) =>
      colors.some((color) => color.color === previousColor) ? previousColor : colors[0]?.color || '',
    )
  }, [piezaElegida])

  useEffect(() => {
    if (!piezaElegida || !selectedColor) {
      setSelectedSize(null)
      return
    }

    const sizes = getAvailableSizes(piezaElegida, selectedColor)
    setSelectedSize((previousSize) => (previousSize && sizes.includes(previousSize) ? previousSize : sizes[0] || null))
  }, [piezaElegida, selectedColor])

  useEffect(() => {
    hoverX.set(0)
    hoverRotate.set(0)
    setHoverOffset(0)
    setDragOffset(0)
  }, [hoverRotate, hoverX, indiceActual, etapa])

  const iniciarExperiencia = () => {
    setEtapa('seleccion')
    setIndiceActual(0)
    setDireccion(1)
    setLikes([])
    setCheckoutMessage('')
    setIsPreparingCheckout(false)
  }

  const reiniciar = () => {
    setEtapa('intro')
    setIndiceActual(0)
    setDireccion(1)
    setLikes([])
    setCheckoutMessage('')
    setIsPreparingCheckout(false)
  }

  const reaccionar = (reaccion: ReaccionHero) => {
    if (!productoActual) return

    setCheckoutMessage('')
    setDireccion(reaccion === 'like' ? 1 : -1)
    hoverX.set(0)
    hoverRotate.set(0)
    setHoverOffset(0)
    setDragOffset(0)

    if (reaccion === 'like') {
      setLikes((previo) => [
        ...previo,
        {
          product: productoActual,
          score: getHeroScore(productoActual, productos.length, previo.length),
        },
      ])

      setLikesPorProducto((previo) => {
        const actualizado = {
          ...previo,
          [productoActual.id]: (previo[productoActual.id] || 0) + 1,
        }

        try {
          window.localStorage.setItem(HERO_LIKES_KEY, JSON.stringify(actualizado))
        } catch (error) {
          console.warn('No se pudieron guardar los corazones del hero.', error)
        }

        return actualizado
      })
    }

    if (indiceActual >= productos.length - 1) {
      setEtapa('resultado')
      return
    }

    setIndiceActual((previo) => previo + 1)
  }

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setDragOffset(0)

    if (info.offset.x > 120) {
      reaccionar('like')
      return
    }

    if (info.offset.x < -120) {
      reaccionar('pass')
    }
  }

  const handleCardPointerMove = (event: ReactMouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const ratio = (event.clientX - rect.left) / rect.width - 0.5
    const nextX = clamp(ratio * 42, -20, 20)
    hoverX.set(nextX)
    hoverRotate.set(clamp(ratio * 10, -5, 5))
    setHoverOffset(nextX)
  }

  const handleCardPointerLeave = () => {
    hoverX.set(0)
    hoverRotate.set(0)
    setHoverOffset(0)
  }

  const handleCheckout = () => {
    if (!piezaElegida || !selectedVariant) {
      setCheckoutMessage('Selecciona una talla disponible antes de continuar.')
      return
    }

    const existingItem = items.find((item) => item.variantSku === selectedVariant.sku)
    setCheckoutMessage('')
    setIsPreparingCheckout(true)

    if (!existingItem) {
      addItem({
        productId: piezaElegida.id,
        variantSku: selectedVariant.sku,
        size: selectedVariant.size,
        color: selectedVariant.color,
        colorHex: selectedVariant.colorHex,
      })
    }

    router.push('/checkout')
  }

  if (!productoActual) {
    return null
  }

  return (
    <section className={`relative min-h-screen overflow-hidden bg-[#F6F0E6] px-4 pb-10 pt-24 text-[#335A77] sm:px-6 lg:px-8 ${bodyFont}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(140,185,216,0.26),transparent_36%),radial-gradient(circle_at_bottom,rgba(227,210,182,0.18),transparent_34%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(246,240,230,0.96),rgba(233,244,251,0.82)_42%,rgba(246,240,230,0.96))]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-7rem)] max-w-7xl items-center">
        <div className="w-full overflow-hidden rounded-[36px] border border-[#8CB9D8]/18 bg-[rgba(252,250,245,0.8)] p-5 shadow-[0_28px_120px_rgba(124,165,193,0.16)] backdrop-blur sm:p-8 lg:p-10">
          <AnimatePresence mode="wait">
            {etapa === 'intro' ? (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center text-center"
              >
                <span className={`text-[11px] uppercase tracking-[0.4em] text-[#6B98B8] ${monoFont}`}>
                  Quiero Mi Aloha
                </span>
                <h1 className={`mt-6 text-[clamp(3.4rem,9vw,7rem)] leading-[0.88] text-[#335A77] ${headingFont}`}>
                  Encuentra tu pieza perfecta.
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-8 text-[#5E7A93] sm:text-lg">
                  Empieza una experiencia simple: verás una prenda a la vez, decidirás con un corazón o una X y al final te mostraremos cuál es tu Aloha ideal.
                </p>
                <Button
                  onClick={iniciarExperiencia}
                  className="mt-10 min-h-11 rounded-full border border-[#8CB9D8]/30 bg-[#8CB9D8] px-9 text-sm uppercase tracking-[0.28em] text-[#FCFAF5] hover:bg-[#7DAFCE]"
                >
                  Empezar experiencia
                </Button>
              </motion.div>
            ) : null}

            {etapa === 'seleccion' ? (
              <motion.div
                key="seleccion"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col justify-center"
              >
                <div className="mb-5 text-center">
                  <span className={`text-[11px] uppercase tracking-[0.36em] text-[#6B98B8] ${monoFont}`}>
                    Pieza {indiceActual + 1} de {productos.length}
                  </span>
                  <h2 className={`mt-3 text-3xl text-[#335A77] sm:text-4xl ${headingFont}`}>
                    {productoActual.name}
                  </h2>
                </div>

                <AnimatePresence mode="wait">
                  <motion.article
                    key={productoActual.id}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDrag={(_event, info) => setDragOffset(info.offset.x)}
                    onDragEnd={handleDragEnd}
                    onMouseMove={handleCardPointerMove}
                    onMouseLeave={handleCardPointerLeave}
                    initial={{ opacity: 0, y: 24, scale: 0.97 }}
                    animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
                    exit={{
                      opacity: 0,
                      x: direccion > 0 ? 240 : -240,
                      rotate: direccion > 0 ? 10 : -10,
                      scale: 0.92,
                    }}
                    transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                    style={{ x: springHoverX, rotate: springHoverRotate }}
                    className="mx-auto w-full max-w-[26rem] cursor-grab active:cursor-grabbing sm:max-w-[27rem] md:max-w-[28rem]"
                  >
                    <div className="overflow-hidden rounded-[32px] border border-[#8CB9D8]/16 bg-[rgba(252,250,245,0.9)] shadow-[0_26px_100px_rgba(124,165,193,0.18)]">
                      <div className="relative h-[clamp(30rem,67vh,41rem)] overflow-hidden">
                        <Image
                          src={productoActual.media[0]?.url || '/placeholder.jpg'}
                          alt={productoActual.name}
                          fill
                          priority
                          className="object-cover grayscale transition duration-700 hover:grayscale-0"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#335A77]/74 via-[#335A77]/14 to-transparent" />
                        <div className="absolute right-4 top-4">
                          <div className="inline-flex min-h-11 items-center rounded-full border border-white/20 bg-[rgba(255,255,255,0.18)] px-4 text-[#F5F8FB] backdrop-blur-md">
                            <Heart className="mr-2 h-4 w-4 text-[#D9ECF8]" />
                            <span className={`text-[11px] uppercase tracking-[0.24em] text-[#D9ECF8] ${monoFont}`}>
                              {formatLikesLabel(totalLikesActual)}
                            </span>
                          </div>
                        </div>

                        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                          <div className="rounded-[26px] border border-white/18 bg-[linear-gradient(180deg,rgba(17,40,58,0.22),rgba(17,40,58,0.72))] p-4 text-[#FCFAF5] backdrop-blur-md sm:p-5">
                            <div className="flex items-start justify-between gap-3">
                              <span className={`text-[11px] uppercase tracking-[0.34em] text-[#D9ECF8] ${monoFont}`}>
                                {formatPrice(productoActual.price)}
                              </span>
                              <div className="text-right">
                                <div className="flex items-center justify-end gap-1 text-[#D9ECF8]">
                                  {Array.from({ length: 5 }).map((_, index) => (
                                    <Star
                                      key={index}
                                      className={`h-3.5 w-3.5 ${
                                        index < Math.round(ratingPromedioActual)
                                          ? 'fill-[#D9ECF8] text-[#D9ECF8]'
                                          : 'text-white/35'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className={`mt-2 block text-[11px] uppercase tracking-[0.24em] text-[#D9ECF8]/88 ${monoFont}`}>
                                  {ratingPromedioActual.toFixed(1)} / 5
                                </span>
                              </div>
                            </div>

                            <p className="mt-4 text-sm leading-7 text-[#F5F8FB] sm:text-[15px]">
                              {productoActual.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-4 p-4 sm:gap-5 sm:p-5">
                          <button
                            onClick={() => reaccionar('pass')}
                            className={`inline-flex min-h-14 min-w-14 items-center justify-center rounded-full border px-7 text-[#335A77] transition sm:min-h-16 sm:min-w-16 ${
                              passActivo
                                ? 'border-[#9EB8CC] bg-[#EAF2F8] text-[#335A77] shadow-[0_0_0_6px_rgba(140,185,216,0.14)]'
                                : 'border-[#8CB9D8]/16 bg-white/70 hover:border-[#8CB9D8]/38 hover:bg-white'
                            }`}
                            aria-label="Pasar esta prenda"
                          >
                            <X className="h-6 w-6 sm:h-7 sm:w-7" />
                          </button>
                          <button
                            onClick={() => reaccionar('like')}
                            className={`inline-flex min-h-14 min-w-14 items-center justify-center rounded-full border px-7 transition sm:min-h-16 sm:min-w-16 ${
                              likeActivo
                                ? 'border-[#8CB9D8] bg-[#8CB9D8] text-[#FCFAF5] shadow-[0_0_0_6px_rgba(140,185,216,0.16)]'
                                : 'border-[#8CB9D8]/30 bg-[#8CB9D8] text-[#FCFAF5] hover:bg-[#7DAFCE]'
                            }`}
                            aria-label="Elegir esta prenda"
                          >
                            <Heart className="h-6 w-6 sm:h-7 sm:w-7" />
                          </button>
                      </div>
                    </div>
                  </motion.article>
                </AnimatePresence>
              </motion.div>
            ) : null}

            {etapa === 'resultado' && piezaElegida ? (
              <motion.div
                key={`resultado-${piezaElegida.id}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr]"
              >
                <div className="overflow-hidden rounded-[34px] border border-[#8CB9D8]/18 bg-[rgba(252,250,245,0.84)] shadow-[0_28px_110px_rgba(124,165,193,0.18)]">
                  <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
                    <div className="group relative min-h-[24rem] overflow-hidden bg-[#EAF6FC]">
                      <Image
                        src={piezaElegida.media[0]?.url || '/placeholder.jpg'}
                        alt={piezaElegida.name}
                        fill
                        priority
                        className="object-cover grayscale transition duration-700 group-hover:grayscale-0"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#335A77]/48 via-transparent to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <span className={`text-[11px] uppercase tracking-[0.38em] text-[#D9ECF8] ${monoFont}`}>
                          Tu Aloha
                        </span>
                        <h2 className={`mt-4 text-5xl leading-[0.94] text-[#FCFAF5] sm:text-6xl ${headingFont}`}>
                          {piezaElegida.name}
                        </h2>
                      </div>
                    </div>

                    <div className="flex flex-col gap-7 p-6 sm:p-8 lg:p-10">
                      <div>
                        <span className={`text-[11px] uppercase tracking-[0.38em] text-[#6B98B8] ${monoFont}`}>
                          Resultado final
                        </span>
                        <p className="mt-4 text-sm leading-7 text-[#5E7A93]">
                          Esta es la pieza que mejor conectó contigo. Elige color y talla para seguir al proceso de compra actual.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <span className={`text-sm uppercase tracking-[0.34em] text-[#6B98B8] ${monoFont}`}>
                          {formatPrice(piezaElegida.price)}
                        </span>
                        {piezaElegida.compareAtPrice > piezaElegida.price ? (
                          <span className={`text-sm uppercase tracking-[0.3em] text-[#6F8DA7]/55 line-through ${monoFont}`}>
                            {formatPrice(piezaElegida.compareAtPrice)}
                          </span>
                        ) : null}
                      </div>

                      <p className="rounded-[24px] border border-[#8CB9D8]/14 bg-white/72 px-5 py-5 text-base leading-8 text-[#4D6D88]">
                        {piezaElegida.description}
                      </p>

                      <div className="space-y-5 rounded-[28px] border border-[#8CB9D8]/14 bg-white/72 p-5">
                        <div>
                          <span className={`text-[11px] uppercase tracking-[0.34em] text-[#6B98B8] ${monoFont}`}>
                            Elige color
                          </span>
                          <div className="mt-4 flex flex-wrap gap-3">
                            {resultColors.map((color) => {
                              const isActive = color.color === selectedColor

                              return (
                                <button
                                  key={color.color}
                                  onClick={() => setSelectedColor(color.color)}
                                  className={`inline-flex min-h-11 items-center gap-3 rounded-full border px-4 py-2 text-sm transition ${
                                    isActive
                                      ? 'border-[#8CB9D8] bg-[#8CB9D8]/12 text-[#335A77]'
                                      : 'border-[#8CB9D8]/14 text-[#5E7A93] hover:border-[#8CB9D8]/35 hover:text-[#335A77]'
                                  }`}
                                >
                                  <span
                                    className="h-4 w-4 rounded-full border border-white/20"
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
                                  onClick={() => isAvailable && setSelectedSize(size)}
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
                          onClick={handleCheckout}
                          disabled={!selectedSize || isPreparingCheckout}
                          className="min-h-11 flex-1 rounded-full border border-[#8CB9D8]/28 bg-[#8CB9D8] px-6 text-[#FCFAF5] hover:bg-[#7DAFCE] disabled:opacity-60"
                        >
                          {isPreparingCheckout ? 'Abriendo checkout...' : 'Añadir a mi colección'}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button
                          onClick={reiniciar}
                          variant="ghost"
                          className="min-h-11 rounded-full border border-[#8CB9D8]/16 px-6 text-[#335A77] hover:bg-white/70"
                        >
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Volver a empezar
                        </Button>
                      </div>

                      {checkoutMessage ? (
                        <p className="text-sm text-[#6B98B8]">{checkoutMessage}</p>
                      ) : (
                        <p className="text-sm text-[#5E7A93]">
                          El flujo de pago sigue igual. Esta sección solo te guía hasta tu pieza ideal.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <aside className="rounded-[30px] border border-[#8CB9D8]/16 bg-white/72 p-6 shadow-[0_24px_80px_rgba(124,165,193,0.14)]">
                  <span className={`text-[11px] uppercase tracking-[0.38em] text-[#6B98B8] ${monoFont}`}>
                    Por qué quedó arriba
                  </span>
                  <h3 className={`mt-5 text-3xl text-[#335A77] ${headingFont}`}>
                    Tu elegida
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-[#5E7A93]">
                    {buildResultCopy(piezaElegida, likes.length)}
                  </p>

                  <div className="mt-8 space-y-4">
                    <HeroStat
                      icon={<Heart className="h-4 w-4" />}
                      label="Corazones"
                      value={`${formatLikesLabel(totalLikesPiezaElegida)} en esta pieza.`}
                    />
                    <HeroStat
                      icon={<ShoppingBag className="h-4 w-4" />}
                      label="Paso siguiente"
                      value="Selecciona tu variante y sigue al proceso de compra actual. No se cambió ninguna lógica de pago."
                    />
                    <HeroStat
                      icon={<Shield className="h-4 w-4" />}
                      label="Pago"
                      value="Bold se mantiene exactamente como ya estaba integrado."
                    />
                  </div>
                </aside>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

function HeroStat({
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

function getHeroScore(product: Product, productCount: number, likeIndex: number) {
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
    return `Como no marcaste favoritas, ${product.name} quedó arriba por su equilibrio general y por lo fácil que resulta imaginarla en tu día a día.`
  }

  if (product.isNew) {
    return `${product.name} subió al primer lugar porque se siente más fresca, más actual y con una presencia inmediata.`
  }

  if (product.fitType === 'oversize') {
    return `${product.name} ganó por actitud. Tiene un volumen más editorial y una caída que se siente segura y relajada.`
  }

  return `${product.name} ganó por precisión. Tiene una línea más limpia y una sensación de lujo sobrio.`
}

function getProductRating(product: Product, likesCount: number) {
  const base =
    4.6 +
    (product.isHotSale ? 0.18 : 0) +
    (product.isNew ? 0.12 : 0) +
    (product.fitType === 'oversize' ? 0.06 : 0) +
    Math.min(0.14, likesCount * 0.02)

  return Math.min(5, Number(base.toFixed(1)))
}

function formatLikesLabel(likesCount: number) {
  return `${likesCount} ${likesCount === 1 ? 'corazón' : 'corazones'}`
}
