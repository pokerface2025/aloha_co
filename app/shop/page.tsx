import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Playfair_Display } from 'next/font/google'
import { ShopContent } from '@/components/shop/shop-content'

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-shop-heading',
  weight: ['400', '600', '700'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-shop-body',
  weight: ['400', '500', '600'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-shop-mono',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'Tienda | Quiero Mi Aloha',
  description:
    'Explora una pieza a la vez, encuentra tu Aloha ideal y continúa hacia el proceso de compra existente.',
}

export default function ShopPage() {
  return (
    <div
      className={`relative min-h-screen overflow-hidden bg-[#F6F0E6] text-[#335A77] ${playfairDisplay.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(140,185,216,0.26),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.72),transparent_34%),radial-gradient(circle_at_bottom,rgba(227,210,182,0.2),transparent_42%)]" />
      <Suspense fallback={<ShopSkeleton />}>
        <ShopContent />
      </Suspense>
    </div>
  )
}

function ShopSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="overflow-hidden rounded-[32px] border border-[#8CB9D8]/18 bg-[rgba(252,250,245,0.82)] p-5 shadow-[0_20px_100px_rgba(124,165,193,0.14)] backdrop-blur sm:p-8">
        <div className="animate-pulse space-y-8">
          <div className="space-y-4 border-b border-[#8CB9D8]/10 pb-6">
            <div className="h-3 w-32 rounded-full bg-[#8CB9D8]/24" />
            <div className="h-12 max-w-xl rounded-full bg-[#8CB9D8]/10" />
            <div className="h-5 max-w-2xl rounded-full bg-[#8CB9D8]/10" />
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-5 py-4">
              <div className="h-16 max-w-xl rounded-[24px] bg-[#8CB9D8]/10" />
              <div className="h-5 max-w-2xl rounded-full bg-[#8CB9D8]/10" />
              <div className="h-5 max-w-xl rounded-full bg-[#8CB9D8]/10" />
              <div className="flex gap-3">
                <div className="h-11 w-40 rounded-full bg-[#8CB9D8]/24" />
                <div className="h-11 w-36 rounded-full bg-[#8CB9D8]/10" />
              </div>
            </div>

            <div className="grid gap-5 rounded-[30px] border border-[#8CB9D8]/14 bg-white/70 p-4 md:grid-cols-[0.92fr_1.08fr]">
              <div className="aspect-[3/4] rounded-[24px] bg-[#8CB9D8]/10" />
              <div className="space-y-4 p-2">
                <div className="h-3 w-28 rounded-full bg-[#8CB9D8]/24" />
                <div className="h-12 w-3/4 rounded-[18px] bg-[#8CB9D8]/10" />
                <div className="h-5 w-full rounded-full bg-[#8CB9D8]/10" />
                <div className="h-5 w-4/5 rounded-full bg-[#8CB9D8]/10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
