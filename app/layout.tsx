import React from "react"
import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Montserrat, Yeseva_One } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CartDrawer } from '@/components/cart/cart-drawer'
import { ThemeProvider } from '@/components/ui/theme-context'
import { LiquidBackground } from '@/components/ui/liquid-background'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['300', '400', '500'],
})

const yeseva = Yeseva_One({
  subsets: ['latin'],
  variable: '--font-yeseva',
  weight: ['400'],
})

const metadataBase =
  process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : new URL('http://localhost:3000')

export const metadata: Metadata = {
  metadataBase,
  title: 'ALOHA | Camisetas Premium Costeñas',
  description: 'Camisetas premium con el mood de la costa colombiana. Calidad, estilo y la brisa del Caribe en cada prenda. Envíos a toda Colombia.',
  keywords: ['camisetas', 'premium', 'colombia', 'barranquilla', 'ropa', 'moda', 'costeño'],
  authors: [{ name: 'ALOHA' }],
  openGraph: {
    title: 'ALOHA | Camisetas Premium Costeñas',
    description: 'Camisetas premium con el mood de la costa colombiana.',
    url: 'https://quieromialoha.com',
    siteName: 'ALOHA',
    locale: 'es_CO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ALOHA | Camisetas Premium Costeñas',
    description: 'Camisetas premium con el mood de la costa colombiana.',
  },
  robots: {
    index: true,
    follow: true,
  },
  generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: '#4A8B9E',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${montserrat.variable} ${yeseva.variable} font-sans antialiased`}>
        <ThemeProvider>
          <LiquidBackground />
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
