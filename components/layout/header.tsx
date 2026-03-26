'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassNavbar } from '@/components/ui/glass-navbar'
import { useCartStore } from '@/lib/store'

const navigation = [
  { name: 'Colecciones', href: '/shop' },
]

export function Header() {
  const [mounted, setMounted] = useState(false)
  const { openCart, getItemCount } = useCartStore()
  const itemCount = getItemCount()

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <GlassNavbar>
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
                ALOHA
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={openCart}
              aria-label={
                mounted
                  ? `Carrito de compras con ${itemCount} productos`
                  : 'Carrito de compras'
              }
            >
              <ShoppingBag className="h-5 w-5" />
              {mounted && itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground"
                >
                  {itemCount > 9 ? '9+' : itemCount}
                </motion.span>
              )}
            </Button>
          </div>
        </div>
      </nav>
    </GlassNavbar>
  )
}
