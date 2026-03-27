'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCartStore } from '@/lib/store'
import { computeShippingMode } from '@/lib/pricing'
import { formatPrice, getProductById } from '@/lib/products'

export function CartPageContent() {
  const { items, updateQuantity, removeItem, getSubtotal, couponCode, setCouponCode } = useCartStore()
  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState('')

  const subtotal = getSubtotal()
  const isEmpty = items.length === 0

  const handleApplyCoupon = () => {
    // Placeholder coupon validation
    if (couponInput.toLowerCase() === 'aloha10') {
      setCouponCode(couponInput.toUpperCase())
      setCouponError('')
    } else {
      setCouponError('Cupón no válido')
      setCouponCode(null)
    }
  }

  const discount = couponCode ? subtotal * 0.1 : 0
  const shippingInfo = computeShippingMode(subtotal - discount)
  const shippingCost = shippingInfo.shippingCost ?? 0
  const total = subtotal - discount + shippingCost

  if (isEmpty) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center py-16">
          <div className="rounded-full bg-muted p-6 mb-6">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
            Tu carrito está vacío
          </h1>
          <p className="mt-2 text-muted-foreground max-w-md">
            Parece que aún no has agregado nada. Explora nuestra tienda y encuentra algo que te encante.
          </p>
          <Button asChild className="mt-8" size="lg">
            <Link href="/shop">
              Ir a la tienda
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <Link
          href="/shop"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Seguir comprando
        </Link>
      </nav>

      <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-8">
        Tu Carrito
      </h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-7">
          <ul className="divide-y divide-border border-y border-border">
            <AnimatePresence mode="popLayout">
              {items.map((item) => {
                const product = getProductById(item.productId)
                if (!product) return null

                return (
                  <motion.li
                    key={item.variantSku}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="py-6"
                  >
                    <div className="flex gap-4 sm:gap-6">
                      {/* Product Image */}
                      <Link
                        href={`/product/${product.slug}`}
                        className="relative h-28 w-28 sm:h-36 sm:w-36 flex-shrink-0 overflow-hidden rounded-lg bg-muted"
                      >
                        <Image
                          src={product.media[0]?.url || '/placeholder.jpg'}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </Link>

                      {/* Product Info */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between">
                            <div>
                              <Link
                                href={`/product/${product.slug}`}
                                className="font-medium text-foreground hover:text-primary transition-colors"
                              >
                                {product.name}
                              </Link>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {item.color} / Talla {item.size}
                              </p>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {product.fitType} Fit
                              </p>
                            </div>
                            <p className="font-medium text-foreground sm:hidden">
                              {formatPrice(product.price * item.quantity)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() => updateQuantity(item.variantSku, item.quantity - 1)}
                              aria-label="Reducir cantidad"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() => updateQuantity(item.variantSku, item.quantity + 1)}
                              aria-label="Aumentar cantidad"
                              disabled={item.quantity >= 10}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          {item.quantity >= 10 && (
                            <p className="text-xs text-destructive">
                              Máximo 10 por producto. Para más, escríbenos a ventas.
                            </p>
                          )}

                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(item.variantSku)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">Eliminar</span>
                          </Button>

                          {/* Price (desktop) */}
                          <p className="hidden sm:block font-medium text-foreground">
                            {formatPrice(product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.li>
                )
              })}
            </AnimatePresence>
          </ul>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5 mt-8 lg:mt-0">
          <div className="sticky top-24 rounded-2xl bg-secondary p-6 sm:p-8">
            <h2 className="font-serif text-xl font-semibold text-foreground">
              Resumen del pedido
            </h2>

            {/* Coupon Code */}
            <div className="mt-6">
              <label htmlFor="coupon" className="text-sm font-medium text-foreground">
                Código de descuento
              </label>
              <div className="mt-2 flex gap-2">
                <Input
                  id="coupon"
                  type="text"
                  placeholder="Ej: ALOHA10"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={handleApplyCoupon}
                  disabled={!couponInput}
                >
                  <Tag className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Aplicar</span>
                </Button>
              </div>
              {couponError && (
                <p className="mt-1 text-sm text-destructive">{couponError}</p>
              )}
              {couponCode && (
                <p className="mt-1 text-sm text-primary">
                  Cupón {couponCode} aplicado (-10%)
                </p>
              )}
            </div>

            {/* Summary */}
            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="font-medium text-foreground">{formatPrice(subtotal)}</dd>
              </div>

              {discount > 0 && (
                <div className="flex items-center justify-between text-primary">
                  <dt>Descuento</dt>
                  <dd className="font-medium">-{formatPrice(discount)}</dd>
                </div>
              )}

              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Envío estimado</dt>
                <dd className="font-medium text-foreground">
                  {shippingCost === 0 ? 'Gratis' : formatPrice(shippingCost)}
                </dd>
              </div>

              <div className="border-t border-border pt-4 flex items-center justify-between">
                <dt className="text-lg font-semibold text-foreground">Total</dt>
                <dd className="text-lg font-bold text-foreground">{formatPrice(total)}</dd>
              </div>
            </dl>

            <p className="mt-2 text-xs text-muted-foreground">
              El costo final de envío se calculará en el checkout según tu ubicación.
            </p>

            <Button asChild className="w-full mt-6" size="lg">
              <Link href="/checkout">
                Ir a pagar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <p className="mt-4 text-xs text-center text-muted-foreground">
              Pagos seguros procesados por Bold
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
