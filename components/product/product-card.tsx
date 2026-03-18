'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Plus, Flame, Check, BadgeCheck, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassModal } from '@/components/ui/glass-modal'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassBadge } from '@/components/ui/glass-badge'
import { getCollectionBySlug } from '@/src/data/collections'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/products'
import type { Product, Size } from '@/lib/types'

interface ProductCardProps {
  product: Product
  priority?: boolean
  index?: number
}

export function ProductCard({ product, priority = false, index = 0 }: ProductCardProps) {
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false)
  const [selectedSize, setSelectedSize] = useState<Size | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [isAdded, setIsAdded] = useState(false)
  const [quantityError, setQuantityError] = useState('')
  const { addItem, items } = useCartStore()

  const uniqueColors = Array.from(
    new Map(product.variants.map((v) => [v.color, { color: v.color, colorHex: v.colorHex }])).values()
  )

  const sizes: Size[] = ['S', 'M', 'L', 'XL']
  const collectionBadges = product.collectionId
    ? [getCollectionBySlug(product.collectionId)?.name || product.collectionId]
    : []

  const selectedVariant = selectedSize && selectedColor
    ? product.variants.find((v) => v.size === selectedSize && v.color === selectedColor)
    : null

  const handleQuickAdd = () => {
    if (uniqueColors.length === 1 && product.variants.filter(v => v.color === uniqueColors[0].color).length === 4) {
      // Simple product, open size selector
      setSelectedColor(uniqueColors[0].color)
    }
    setIsQuickAddOpen(true)
  }

  const handleAddToCart = () => {
    if (!selectedVariant || !selectedSize || !selectedColor) return
    const existingQty = items.find((item) => item.variantSku === selectedVariant.sku)?.quantity ?? 0
    if (existingQty + 1 > 10) {
      setQuantityError('Máximo 10 por producto. Para más, escríbenos a ventas.')
      return
    }

    addItem({
      productId: product.id,
      variantSku: selectedVariant.sku,
      size: selectedSize,
      color: selectedColor,
      colorHex: selectedVariant.colorHex,
    })

    setIsAdded(true)
    setQuantityError('')
    setTimeout(() => {
      setIsAdded(false)
      setIsQuickAddOpen(false)
      setSelectedSize(null)
      setSelectedColor(null)
    }, 1500)
  }

  const discount = Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
  const lifestyleImage =
    product.media?.[1]?.url ||
    product.media?.[0]?.url ||
    '/placeholder.jpg'
  const totalStock = product.variants.reduce((sum, variant) => sum + variant.stock, 0)
  const seriesIndex = Math.min(
    50,
    Math.max(1, parseInt(product.id.replace('prod-', ''), 10) || 1),
  )
  const primaryCollectionSlug = product.collectionId
  const primaryCollectionName =
    (primaryCollectionSlug && getCollectionBySlug(primaryCollectionSlug)?.name) ||
    primaryCollectionSlug

  const isEstoEsColombia =
    product.collectionId === 'colombia' ||
    product.tags?.includes('colombia')
  const isDolceVita =
    product.collectionId === 'dolce-vita' ||
    product.tags?.includes('dolce-vita')
  const isDropPlenty =
    product.collectionId === 'plenty' ||
    product.tags?.includes('plenty')
  const isMadeInQuillami =
    product.collectionId === 'quillami' ||
    product.tags?.includes('quillami')

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.2,
      },
    }),
  }

  return (
    <>
      <motion.article
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={cardVariants}
        custom={index}
        whileHover={{ y: -10 }}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        className="group relative"
        style={{ willChange: 'transform' }}
      >
        <div className="overflow-hidden bg-white rounded-none shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-shadow duration-500 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
          {/* Image Container */}
          <Link href={`/product/${product.slug}`} className="block">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src={product.media[0]?.url || '/placeholder.jpg'}
                alt={product.name}
                fill
                priority={priority}
                loading={priority ? 'eager' : 'lazy'}
                className="object-cover transition-opacity duration-500 group-hover:opacity-0"
              />
              <Image
                src={lifestyleImage}
                alt={`${product.name} lifestyle`}
                fill
                loading="lazy"
                className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 via-transparent to-transparent" />

              {/* Badges */}
              <div className="absolute left-3 top-3 flex flex-col gap-2">
                {collectionBadges?.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {collectionBadges.map((label) => (
                      <GlassBadge key={label} className="bg-white/70 text-foreground">
                        {label}
                      </GlassBadge>
                    ))}
                  </div>
                ) : null}
                {product.isHotSale && (
                  <GlassBadge className="bg-accent/80 text-accent-foreground border-accent/40">
                    <Flame className="h-3 w-3" />
                    Hot Sale
                  </GlassBadge>
                )}
                {product.isNew && (
                  <GlassBadge className="accent-label bg-primary/80 text-primary-foreground border-primary/40">
                    Nuevo
                  </GlassBadge>
                )}
                {discount > 0 && (
                  <GlassBadge className="bg-foreground/90 text-background border-foreground/60">
                    -{discount}%
                  </GlassBadge>
                )}
                {totalStock < 10 && (
                  <GlassBadge className="accent-label bg-white/80 text-foreground border-white/60">
                    Limited Edition
                  </GlassBadge>
                )}
                {isDolceVita && (
                  <GlassBadge className="accent-label bg-white/80 text-foreground border-white/60">
                    Gift with Purchase
                  </GlassBadge>
                )}
              </div>

              {/* Quick Add Button */}
              <div className="absolute bottom-3 left-3 right-3 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  onClick={(e) => {
                    e.preventDefault()
                    handleQuickAdd()
                  }}
                  className="w-full glass-panel"
                  size="sm"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar
                </Button>
              </div>
            </div>
          </Link>

          {/* Product Info */}
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div className={isDropPlenty ? 'text-center w-full' : undefined}>
                {primaryCollectionName ? (
                  <span className="accent-label text-xs text-muted-foreground">
                    {primaryCollectionName}
                  </span>
                ) : null}
                <Link href={`/product/${product.slug}`}>
                  <h3 className="font-medium text-foreground hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {product.fitType === 'oversize' ? 'Oversize' : 'Regular'} Fit
                </p>
                <div className="mt-2 text-xs text-muted-foreground">
                  <p>Serie Limitada: Solo 50 unidades creadas para este diseño.</p>
                  <p>
                    Estado:{' '}
                    <span className="font-serif text-foreground">{seriesIndex}</span>/50 piezas
                    registradas.
                  </p>
                </div>
                {isEstoEsColombia && (
                  <p className="mt-1 text-xs text-muted-foreground italic">
                    Bordado artesanal destacado.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <span className="font-semibold text-foreground">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice > product.price && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>

            {/* Color Swatches */}
            <div className="mt-3 flex gap-1.5">
              {uniqueColors.map(({ color, colorHex }) => (
                <button
                  key={color}
                  title={color}
                  className="h-5 w-5 rounded-full border border-white/30 shadow-sm transition-transform hover:scale-110"
                  style={{ backgroundColor: colorHex }}
                  aria-label={`Color ${color}`}
                />
              ))}
            </div>

            {(isEstoEsColombia || isMadeInQuillami) && (
              <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                {isEstoEsColombia && (
                  <span
                    className="inline-flex items-center gap-1"
                    title="Culture Note: Bordado artesanal inspirado en herencia local."
                  >
                    <Info className="h-3.5 w-3.5" />
                    Culture Note
                  </span>
                )}
                {isMadeInQuillami && (
                  <span className="inline-flex items-center gap-1">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Local Pride
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.article>

      {/* Quick Add Dialog */}
      <Dialog open={isQuickAddOpen} onOpenChange={setIsQuickAddOpen}>
        <GlassModal className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">{product.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Color Selection */}
            {uniqueColors.length > 1 && (
              <div>
                <label className="text-sm font-medium text-foreground">Color</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {uniqueColors.map(({ color, colorHex }) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                        selectedColor === color
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
            )}

            {/* Size Selection */}
            <div>
              <label className="text-sm font-medium text-foreground">Talla</label>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {sizes.map((size) => {
                  const variant = product.variants.find(
                    (v) => v.size === size && (selectedColor ? v.color === selectedColor : true)
                  )
                  const isAvailable = variant && variant.stock > 0

                  return (
                    <button
                      key={size}
                      onClick={() => isAvailable && setSelectedSize(size)}
                      disabled={!isAvailable}
                      className={`rounded-lg border py-2 text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-primary bg-primary text-primary-foreground'
                          : isAvailable
                          ? 'border-border hover:border-primary'
                          : 'border-border bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                      }`}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between border-t border-border pt-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">{formatPrice(product.price)}</span>
                {product.compareAtPrice > product.price && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Add Button */}
            <GlassButton
              onClick={handleAddToCart}
              disabled={!selectedSize || !selectedColor || isAdded}
              className="w-full"
              size="lg"
            >
              {isAdded ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Agregado al carrito
                </>
              ) : (
                'Agregar al carrito'
              )}
            </GlassButton>
            {quantityError && (
              <p className="text-sm text-center text-destructive">{quantityError}</p>
            )}
          </div>
        </GlassModal>
      </Dialog>
    </>
  )
}
