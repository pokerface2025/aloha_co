'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, ShoppingBag, User, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassNavbar } from '@/components/ui/glass-navbar'
import { useCartStore } from '@/lib/store'
import { useTheme } from '@/components/ui/theme-context'
import { useAuthStore } from '@/lib/auth-store'

const navigation = [
  { name: 'Tienda', href: '/shop' },
]

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { openCart, getItemCount } = useCartStore()
  const session = useAuthStore((state) => state.session)
  const clearSession = useAuthStore((state) => state.clearSession)
  const isExpired = useAuthStore((state) => state.isExpired)
  const itemCount = getItemCount()
  const { audience, setAudience } = useTheme()

  useEffect(() => {
    setMounted(true)
    if (isExpired()) {
      clearSession()
    }
  }, [clearSession, isExpired])

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
          <div className="hidden md:flex md:items-center md:gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex md:items-center md:gap-2">
              {session ? (
                <>
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm text-foreground transition-colors hover:bg-white/20"
                  >
                    <User className="h-4 w-4" />
                    <span className="max-w-28 truncate">{session.username}</span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearSession}
                    aria-label="Cerrar sesión"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Link
                  href="/login?redirect=/admin"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm text-foreground transition-colors hover:bg-white/20"
                >
                  <User className="h-4 w-4" />
                  <span>Ingresar</span>
                </Link>
              )}
            </div>

            <div className="hidden md:flex items-center rounded-full border border-white/20 bg-white/10 p-1">
              <button
                onClick={() => setAudience('adult')}
                className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] transition-colors ${
                  audience === 'adult'
                    ? 'bg-foreground text-background'
                    : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                Collection
              </button>
              <button
                onClick={() => setAudience('kids')}
                className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] transition-colors ${
                  audience === 'kids'
                    ? 'bg-foreground text-background'
                    : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                Little ALOHA
              </button>
            </div>

            {/* Cart Button */}
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

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-white/15 bg-white/35 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-3">
              {session ? (
                <div className="flex items-center justify-between rounded-2xl border border-white/20 bg-white/20 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{session.username}</p>
                    <p className="text-xs text-muted-foreground">{session.email}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={clearSession} aria-label="Cerrar sesión">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Link
                  href="/login?redirect=/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/20 px-4 py-3 text-sm font-medium text-foreground"
                >
                  <User className="h-4 w-4" />
                  <span>Ingresar</span>
                </Link>
              )}
              <div className="flex items-center gap-2 pb-2">
                <button
                  onClick={() => setAudience('adult')}
                  className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] transition-colors ${
                    audience === 'adult'
                      ? 'bg-foreground text-background'
                      : 'border border-white/20 text-foreground/70'
                  }`}
                >
                  Collection
                </button>
                <button
                  onClick={() => setAudience('kids')}
                  className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] transition-colors ${
                    audience === 'kids'
                      ? 'bg-foreground text-background'
                      : 'border border-white/20 text-foreground/70'
                  }`}
                >
                  Little ALOHA
                </button>
              </div>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassNavbar>
  )
}
