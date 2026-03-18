'use client'

import { Fragment } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassButton } from '@/components/ui/glass-button'
import { useCartStore } from '@/lib/store'
import { formatPrice, getProductById } from '@/lib/products'

export function CartDrawer() {
  const { 
    items, 
    isCartOpen, 
    closeCart, 
    updateQuantity, 
    removeItem,
    getSubtotal 
  } = useCartStore()

  const subtotal = getSubtotal()
  const isEmpty = items.length === 0

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-md"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md border border-white/20 bg-white/20 backdrop-blur-2xl shadow-2xl"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border px-4 py-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  <h2 className="font-serif text-lg font-semibold">Tu Carrito</h2>
                  {!isEmpty && (
                    <span className="text-sm text-muted-foreground">
                      ({items.length} {items.length === 1 ? 'producto' : 'productos'})
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeCart}
                  aria-label="Cerrar carrito"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {isEmpty ? (
                  <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
                    <div className="rounded-full bg-muted p-4">
                      <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Tu carrito está vacío</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Explora nuestra tienda y encuentra algo que te encante
                      </p>
                    </div>
                    <GlassButton onClick={closeCart} asChild>
                      <Link href="/shop">Ver tienda</Link>
                    </GlassButton>
                  </div>
                ) : (
                  <ul className="divide-y divide-border">
                    {items.map((item) => {
                      const product = getProductById(item.productId)
                      if (!product) return null

                      return (
                        <motion.li
                          key={item.variantSku}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          className="p-4"
                        >
                          <div className="flex gap-4">
                            {/* Product Image */}
                            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                              <Image
                                src={product.media[0]?.url || '/placeholder.jpg'}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>

                            {/* Product Info */}
                            <div className="flex flex-1 flex-col">
                              <div className="flex items-start justify-between">
                                <div>
                                  <Link
                                    href={`/product/${product.slug}`}
                                    onClick={closeCart}
                                    className="font-medium hover:text-primary transition-colors"
                                  >
                                    {product.name}
                                  </Link>
                                  <p className="mt-0.5 text-sm text-muted-foreground">
                                    {item.color} / {item.size}
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                  onClick={() => removeItem(item.variantSku)}
                                  aria-label={`Eliminar ${product.name} del carrito`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="mt-auto flex items-center justify-between">
                                {/* Quantity Controls */}
                                <div className="flex items-center gap-2">
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

                                {/* Price */}
                                <p className="font-medium">
                                  {formatPrice(product.price * item.quantity)}
                                </p>
                              </div>
                              {item.quantity >= 10 && (
                                <p className="mt-2 text-xs text-destructive">
                                  Máximo 10 por producto. Para más, escríbenos a ventas.
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.li>
                      )
                    })}
                  </ul>
                )}
              </div>

              {/* Footer */}
              {!isEmpty && (
                <div className="border-t border-border p-4 space-y-4">
                  {/* Subtotal */}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>

                  {/* Shipping Note */}
                  <p className="text-xs text-muted-foreground text-center">
                    Envío $15.000 COP si el subtotal es menor a 150.000 COP. Gratis desde 150.000 COP.
                  </p>

                  {/* Actions */}
                  <div className="grid gap-2">
                    <GlassButton asChild size="lg" onClick={closeCart}>
                      <Link href="/checkout">Ir a pagar</Link>
                    </GlassButton>
                    <GlassButton asChild onClick={closeCart}>
                      <Link href="/cart">Ver carrito completo</Link>
                    </GlassButton>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
