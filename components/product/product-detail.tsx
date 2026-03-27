'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Ruler, Truck, MapPin, Check, ChevronLeft, ChevronRight, Info, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassModal } from '@/components/ui/glass-modal'
import { GlassBadge } from '@/components/ui/glass-badge'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { useCartStore, calculateFitRecommendation } from '@/lib/store'
import { formatPrice } from '@/lib/products'
import type { Product, Size, FitPreference } from '@/lib/types'

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState<Size | null>(null)
  const [selectedColor, setSelectedColor] = useState<string>(product.variants[0]?.color || '')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false)
  const [isFitFinderOpen, setIsFitFinderOpen] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [quantityError, setQuantityError] = useState('')

  // Fit finder state
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [fitPreference, setFitPreference] = useState<FitPreference | undefined>()
  const [fitRecommendation, setFitRecommendation] = useState<{ recommendedSize: Size; explanation: string } | null>(null)

  const { addItem, items } = useCartStore()

  const uniqueColors = Array.from(
    new Map(product.variants.map((v) => [v.color, { color: v.color, colorHex: v.colorHex }])).values()
  )

  const sizes: Size[] = ['S', 'M', 'L', 'XL']

  const selectedVariant = selectedSize
    ? product.variants.find((v) => v.size === selectedSize && v.color === selectedColor)
    : null

  const selectedColorHex = uniqueColors.find((c) => c.color === selectedColor)?.colorHex || ''
  const mediaItems = product.media

  const handleAddToCart = () => {
    if (!selectedVariant || !selectedSize) return
    const existingQty = items.find((item) => item.variantSku === selectedVariant.sku)?.quantity ?? 0
    if (existingQty + quantity > 10) {
      setQuantityError('Máximo 10 por producto. Para más, escríbenos a ventas.')
      return
    }

    addItem({
      productId: product.id,
      variantSku: selectedVariant.sku,
      size: selectedSize,
      color: selectedColor,
      colorHex: selectedColorHex,
      quantity,
    })

    setIsAdded(true)
    setQuantityError('')
    setTimeout(() => setIsAdded(false), 2000)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    // Redirect to checkout after a brief delay
    setTimeout(() => {
      window.location.href = '/checkout'
    }, 500)
  }

  const handleQuantityChange = (value: number) => {
    if (value > 10) {
      setQuantity(10)
      setQuantityError('Máximo 10 por producto. Para más, escríbenos a ventas.')
      return
    }
    setQuantityError('')
    setQuantity(Math.max(1, value))
  }

  const handleFitFinder = () => {
    const heightNum = parseInt(height)
    const weightNum = parseInt(weight)

    if (!heightNum || !weightNum) return

    const recommendation = calculateFitRecommendation(
      heightNum,
      weightNum,
      fitPreference,
      product.fitType
    )

    setFitRecommendation(recommendation)
  }

  const discount = Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
  const seriesIndex = Math.min(
    50,
    Math.max(1, parseInt(product.id.replace('prod-', ''), 10) || 1),
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-foreground transition-colors">
              Inicio
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/shop" className="hover:text-foreground transition-colors">
              Tienda
            </Link>
          </li>
          <li>/</li>
          <li className="text-foreground">{product.name}</li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <GlassCard className="relative aspect-[3/4] overflow-hidden rounded-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                {mediaItems[currentImageIndex]?.type === 'video' ? (
                  <video
                    className="h-full w-full object-cover"
                    controls
                    playsInline
                    preload="metadata"
                  >
                    <source src={mediaItems[currentImageIndex]?.url} />
                  </video>
                ) : (
                  <Image
                    src={mediaItems[currentImageIndex]?.url || '/placeholder.jpg'}
                    alt={mediaItems[currentImageIndex]?.alt || product.name}
                    fill
                    priority
                    className="object-cover"
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {mediaItems.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrentImageIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1))
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/70 backdrop-blur-lg shadow-sm transition-colors hover:bg-white"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() =>
                    setCurrentImageIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1))
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/70 backdrop-blur-lg shadow-sm transition-colors hover:bg-white"
                  aria-label="Siguiente imagen"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Badges */}
            <div className="absolute left-4 top-4 flex flex-col gap-2">
              {product.isHotSale && (
                <GlassBadge className="bg-accent/80 text-accent-foreground border-accent/40">
                  Hot Sale
                </GlassBadge>
              )}
              {discount > 0 && (
                <GlassBadge className="bg-foreground/90 text-background border-foreground/60">
                  -{discount}%
                </GlassBadge>
              )}
            </div>
          </GlassCard>

          {/* Thumbnails */}
          {mediaItems.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {mediaItems.map((media, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                    currentImageIndex === index ? 'border-primary' : 'border-white/20'
                  }`}
                >
                  {media.type === 'video' ? (
                    <div className="flex h-full w-full items-center justify-center bg-white/20 text-xs text-foreground">
                      Video
                    </div>
                  ) : (
                    <Image
                      src={media.url || "/placeholder.svg"}
                      alt={media.alt}
                      fill
                      className="object-cover"
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Title & Price */}
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {product.fitType === 'oversize' ? 'Oversize' : 'Regular'} Fit • Unisex
            </p>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-2xl font-bold text-foreground">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice > product.price && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <div className="rounded-xl border border-white/30 bg-white/60 px-4 py-3 text-sm text-muted-foreground backdrop-blur-lg">
            <p>Serie Limitada: Solo 50 unidades creadas para este diseño.</p>
            <p>
              Estado:{' '}
              <span className="font-serif text-foreground">{seriesIndex}</span>/50 piezas
              registradas.
            </p>
          </div>

          <div className="rounded-xl border border-white/30 bg-white/60 px-4 py-3 text-sm text-muted-foreground backdrop-blur-lg">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-foreground">Piece 12/50.</span>{' '}
                Título de Propiedad Digital registrado a tu nombre.
              </div>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-white/70 text-foreground transition-colors hover:bg-white"
                    aria-label="Vista previa del Título de Propiedad Digital"
                  >
                    <Info className="h-4 w-4" />
                  </button>
                </HoverCardTrigger>
                <HoverCardContent className="w-72 border-white/40 bg-white/90 backdrop-blur-xl">
                  <div className="rounded-lg border border-white/40 bg-white/80 px-4 py-3">
                    <p className="font-serif text-sm tracking-wide text-foreground">
                      Título de Propiedad Digital
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Registered to your name with a unique serial number.
                    </p>
                    <div className="mt-3 h-px w-full bg-foreground/10" />
                    <p className="mt-3 text-xs text-muted-foreground">
                      ALOHA Atelier • Barranquilla
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Color: <span className="font-normal text-muted-foreground">{selectedColor}</span>
              </label>
            </div>
            <div className="mt-3 flex gap-3">
              {uniqueColors.map(({ color, colorHex }) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`relative h-10 w-10 rounded-full border-2 transition-all ${
                    selectedColor === color ? 'border-primary scale-110' : 'border-border hover:scale-105'
                  }`}
                  style={{ backgroundColor: colorHex }}
                  aria-label={`Color ${color}`}
                >
                  {selectedColor === color && (
                    <Check className="absolute inset-0 m-auto h-4 w-4 text-foreground mix-blend-difference" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Talla</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsFitFinderOpen(true)}
                  className="text-sm text-primary hover:underline"
                >
                  Encuentra tu talla
                </button>
                <span className="text-muted-foreground">|</span>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-sm text-primary hover:underline"
                >
                  Guía de tallas
                </button>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-3">
              {sizes.map((size) => {
                const variant = product.variants.find(
                  (v) => v.size === size && v.color === selectedColor
                )
                const isAvailable = variant && variant.stock > 0

                return (
                  <button
                    key={size}
                    onClick={() => isAvailable && setSelectedSize(size)}
                    disabled={!isAvailable}
                    className={`rounded-lg border py-3 text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? 'border-primary bg-primary text-primary-foreground'
                        : isAvailable
                        ? 'border-border hover:border-primary'
                        : 'border-border bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                    }`}
                  >
                    {size}
                    {!isAvailable && <span className="block text-[10px]">Agotado</span>}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Fit Recommendation */}
          <GlassCard className="glass-hover p-4">
            <div className="flex items-start gap-3">
              <Ruler className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Encuentra tu talla ideal
                </p>
                <p className="text-sm text-muted-foreground">
                  Responde dos datos y te damos una recomendación rápida.
                </p>
                <GlassButton
                  size="sm"
                  className="mt-3"
                  onClick={() => setIsFitFinderOpen(true)}
                >
                  Abrir recomendación
                </GlassButton>
              </div>
            </div>
          </GlassCard>

          {/* Delivery Info */}
          <GlassCard className="space-y-3 p-4">
            <div className="flex items-start gap-3">
              <Truck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Envío a toda Colombia</p>
                <p className="text-sm text-muted-foreground">El costo se calcula en el checkout</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Barranquilla</p>
                <p className="text-sm text-muted-foreground">Si estás en Barranquilla, a veces te llega el mismo día.</p>
              </div>
            </div>
          </GlassCard>

          {/* Action Buttons */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Cantidad
              </label>
              <div className="flex items-stretch gap-2">
                <div className="flex min-h-12 items-center rounded-2xl border border-border bg-white/70 px-2 shadow-sm backdrop-blur-sm">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition hover:bg-muted"
                    aria-label="Reducir cantidad"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={10}
                    value={quantity}
                    onChange={(event) => handleQuantityChange(Number(event.target.value))}
                    className="h-10 w-14 border-0 bg-transparent px-0 text-center text-base font-semibold text-foreground shadow-none focus-visible:ring-0"
                    aria-label="Cantidad"
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition hover:bg-muted"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center rounded-2xl border border-border bg-white/50 px-3 text-xs text-muted-foreground backdrop-blur-sm">
                  Máx. 10
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Ajusta aquí cuántas unidades quieres añadir.
              </p>
            </div>
            <div className="grid gap-3">
              <GlassButton
                onClick={handleAddToCart}
                disabled={!selectedSize || isAdded}
                size="lg"
                className="w-full"
              >
                {isAdded ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Agregado
                  </>
                ) : (
                  <>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Agregar al carrito
                  </>
                )}
              </GlassButton>
              <GlassButton
                onClick={handleBuyNow}
                disabled={!selectedSize}
                size="lg"
                variant="default"
                className="w-full bg-primary/90 text-primary-foreground border-primary/40 hover:bg-primary"
              >
                Comprar ahora
              </GlassButton>
            </div>
          </div>

          {!selectedSize && (
            <p className="text-sm text-center text-muted-foreground">
              Selecciona una talla para continuar
            </p>
          )}

          {quantityError && (
            <p className="text-sm text-center text-destructive">{quantityError}</p>
          )}
        </div>
      </div>

      {/* Size Guide Modal */}
      <Dialog open={isSizeGuideOpen} onOpenChange={setIsSizeGuideOpen}>
        <GlassModal className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">Guía de Tallas</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Todas nuestras camisetas son unisex. Medidas en centímetros.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-medium">Talla</th>
                    <th className="text-center py-2 px-4 font-medium">Pecho</th>
                    <th className="text-center py-2 px-4 font-medium">Largo</th>
                    <th className="text-center py-2 px-4 font-medium">Hombro</th>
                  </tr>
                </thead>
                <tbody>
                  {product.fitType === 'oversize' ? (
                    <>
                      <tr className="border-b border-border">
                        <td className="py-2 pr-4">S</td>
                        <td className="text-center py-2 px-4">56</td>
                        <td className="text-center py-2 px-4">72</td>
                        <td className="text-center py-2 px-4">52</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2 pr-4">M</td>
                        <td className="text-center py-2 px-4">60</td>
                        <td className="text-center py-2 px-4">74</td>
                        <td className="text-center py-2 px-4">54</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2 pr-4">L</td>
                        <td className="text-center py-2 px-4">64</td>
                        <td className="text-center py-2 px-4">76</td>
                        <td className="text-center py-2 px-4">56</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">XL</td>
                        <td className="text-center py-2 px-4">68</td>
                        <td className="text-center py-2 px-4">78</td>
                        <td className="text-center py-2 px-4">58</td>
                      </tr>
                    </>
                  ) : (
                    <>
                      <tr className="border-b border-border">
                        <td className="py-2 pr-4">S</td>
                        <td className="text-center py-2 px-4">48</td>
                        <td className="text-center py-2 px-4">68</td>
                        <td className="text-center py-2 px-4">44</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2 pr-4">M</td>
                        <td className="text-center py-2 px-4">52</td>
                        <td className="text-center py-2 px-4">70</td>
                        <td className="text-center py-2 px-4">46</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2 pr-4">L</td>
                        <td className="text-center py-2 px-4">56</td>
                        <td className="text-center py-2 px-4">72</td>
                        <td className="text-center py-2 px-4">48</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">XL</td>
                        <td className="text-center py-2 px-4">60</td>
                        <td className="text-center py-2 px-4">74</td>
                        <td className="text-center py-2 px-4">50</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              * Las medidas pueden variar ±2cm. Para camisetas oversize, considera una talla menos si prefieres un fit más ceñido.
            </p>
          </div>
        </GlassModal>
      </Dialog>

      {/* Fit Finder Modal */}
      <Dialog open={isFitFinderOpen} onOpenChange={setIsFitFinderOpen}>
        <GlassModal className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif flex items-center gap-2">
              <Ruler className="h-5 w-5 text-primary" />
              Encuentra tu talla
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-6">
            {!fitRecommendation ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Cuéntanos un poco sobre ti y te recomendamos la talla ideal.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="height">Altura (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="170"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Peso (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="70"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <div>
                  <Label>¿Cómo te gusta el fit? (opcional)</Label>
                  <RadioGroup
                    value={fitPreference}
                    onValueChange={(value) => setFitPreference(value as FitPreference)}
                    className="mt-2 grid grid-cols-3 gap-2"
                  >
                    <div>
                      <RadioGroupItem value="ajustada" id="ajustada" className="peer sr-only" />
                      <Label
                        htmlFor="ajustada"
                        className="flex cursor-pointer items-center justify-center rounded-lg border border-border py-2 px-3 text-sm peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-muted transition-colors"
                      >
                        Ajustada
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="normal" id="normal" className="peer sr-only" />
                      <Label
                        htmlFor="normal"
                        className="flex cursor-pointer items-center justify-center rounded-lg border border-border py-2 px-3 text-sm peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-muted transition-colors"
                      >
                        Normal
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="suelta" id="suelta" className="peer sr-only" />
                      <Label
                        htmlFor="suelta"
                        className="flex cursor-pointer items-center justify-center rounded-lg border border-border py-2 px-3 text-sm peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-muted transition-colors"
                      >
                        Suelta
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button
                  onClick={handleFitFinder}
                  disabled={!height || !weight}
                  className="w-full"
                >
                  Ver recomendación
                </Button>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
              >
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-3xl font-bold text-primary">{fitRecommendation.recommendedSize}</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Te recomendamos talla {fitRecommendation.recommendedSize}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {fitRecommendation.explanation}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground italic">
                  Es una recomendación; si estás entre dos tallas, elige la que te guste más.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => {
                      setFitRecommendation(null)
                      setHeight('')
                      setWeight('')
                      setFitPreference(undefined)
                    }}
                  >
                    Calcular de nuevo
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => {
                      setSelectedSize(fitRecommendation.recommendedSize)
                      setIsFitFinderOpen(false)
                    }}
                  >
                    Usar talla {fitRecommendation.recommendedSize}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </GlassModal>
      </Dialog>
    </div>
  )
}
