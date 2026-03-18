'use client'

import { HeroSection } from '@/components/home/hero-section'
import { CollectionSection } from '@/components/home/collection-section'
import { BestSellersSection } from '@/components/home/best-sellers-section'
import { TestimonialsSection } from '@/components/home/testimonials-section'
import { useEffect } from 'react'
import { useTheme } from '@/components/ui/theme-context'
import type { ThemeKey } from '@/components/ui/theme-context'

export default function HomePage() {
  const { setTheme } = useTheme()

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('[data-theme-section]'),
    )
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

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
    <>
      <section data-theme-section="hero">
        <HeroSection />
      </section>
      <section data-theme-section="dolce">
        <CollectionSection />
      </section>
      <section data-theme-section="quillami">
        <BestSellersSection />
      </section>
      <section data-theme-section="plenty">
        <TestimonialsSection />
      </section>
    </>
  )
}
