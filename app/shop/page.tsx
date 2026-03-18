import { Suspense } from 'react'
import type { Metadata } from 'next'
import { ShopContent } from '@/components/shop/shop-content'

export const metadata: Metadata = {
  title: 'Tienda | ALOHA',
  description: 'Explora nuestra colección de camisetas premium con el mood de la costa colombiana. Encuentra tu estilo perfecto.',
}

export default function ShopPage() {
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 bg-ocean-sky opacity-25" />
      <div className="pointer-events-none absolute inset-0 bg-grain opacity-25" />
      <Suspense fallback={<ShopSkeleton />}>
        <ShopContent />
      </Suspense>
    </div>
  )
}

function ShopSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="animate-pulse">
        {/* Header */}
        <div className="h-10 w-48 bg-muted rounded-lg mb-8" />
        
        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-[3/4] bg-muted rounded-xl" />
              <div className="h-4 w-3/4 bg-muted rounded" />
              <div className="h-4 w-1/2 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
