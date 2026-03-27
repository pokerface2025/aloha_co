'use client'

import { useEffect } from 'react'
import { Inter, JetBrains_Mono, Playfair_Display } from 'next/font/google'
import { HeroSection } from '@/components/home/hero-section'
import { CollectionSection } from '@/components/home/collection-section'
import { BestSellersSection } from '@/components/home/best-sellers-section'
import { useTheme } from '@/components/ui/theme-context'
import type { ThemeKey } from '@/components/ui/theme-context'

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-home-heading',
  weight: ['400', '600', '700'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-home-body',
  weight: ['400', '500', '600'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-home-mono',
  weight: ['400', '500'],
})

export default function HomePage() {
  const { setTheme } = useTheme()

  useEffect(() => {
    const root = document.documentElement
    const nextVars: Record<string, string> = {
      '--background': '#F6F0E6',
      '--foreground': '#335A77',
      '--card': '#FCFAF5',
      '--card-foreground': '#335A77',
      '--popover': '#FFFCF7',
      '--popover-foreground': '#335A77',
      '--primary': '#8CB9D8',
      '--primary-foreground': '#F6F0E6',
      '--secondary': '#E9F4FB',
      '--secondary-foreground': '#335A77',
      '--muted': '#EFE6D8',
      '--muted-foreground': '#6F8DA7',
      '--accent': '#CFE4F2',
      '--accent-foreground': '#335A77',
      '--border': 'rgba(140, 185, 216, 0.32)',
      '--input': '#F5EEE2',
      '--ring': 'rgba(140, 185, 216, 0.45)',
      '--bg-primary': '#E6F4FB',
      '--bg-secondary': '#F6F0E6',
      '--ambient-tint': '#A5CDE8',
      '--ambient-opacity': '0.14',
      '--wave-opacity': '0.24',
      '--wave-blend': 'soft-light',
    }
    const previousTheme = root.getAttribute('data-theme')
    const previousVars = Object.fromEntries(
      Object.keys(nextVars).map((key) => [key, root.style.getPropertyValue(key)]),
    )

    Object.entries(nextVars).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
    root.setAttribute('data-theme', 'light')

    return () => {
      Object.entries(previousVars).forEach(([key, value]) => {
        if (value) {
          root.style.setProperty(key, value)
          return
        }

        root.style.removeProperty(key)
      })

      if (previousTheme) {
        root.setAttribute('data-theme', previousTheme)
        return
      }

      root.removeAttribute('data-theme')
    }
  }, [])

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('[data-theme-section]'),
    )
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0]

        if (visible?.target) {
          const key = (visible.target as HTMLElement).dataset.themeSection as
            | ThemeKey
            | undefined
          if (key) setTheme(key)
        }
      },
      {
        threshold: [0.25, 0.4, 0.6, 0.75],
        rootMargin: '-10% 0px -40% 0px',
      },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [setTheme])

  return (
    <div
      className={`relative overflow-hidden bg-[#F6F0E6] text-[#335A77] selection:bg-[#8CB9D8] selection:text-[#FCFAF5] ${playfairDisplay.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[42rem] bg-[radial-gradient(circle_at_top,rgba(140,185,216,0.34),transparent_48%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.7),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[38rem] bg-[radial-gradient(circle_at_bottom,rgba(227,210,182,0.25),transparent_52%)]" />

      <section data-theme-section="hero">
        <HeroSection />
      </section>
      <section data-theme-section="dolce">
        <CollectionSection />
      </section>
      <section data-theme-section="quillami">
        <BestSellersSection />
      </section>
    </div>
  )
}
