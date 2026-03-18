'use client'

import { useEffect } from 'react'

type ThemeConfig = {
  bgSolid: string
  bgStart: string
  bgEnd: string
  waveOpacity: string
  waveBlend: string
  theme: 'light' | 'dark'
}

const THEMES: Record<string, ThemeConfig> = {
  hero: {
    bgSolid: '#ffffff',
    bgStart: '#deedff',
    bgEnd: '#ffffff',
    waveOpacity: '0.6',
    waveBlend: 'soft-light',
    theme: 'light',
  },
  origin: {
    bgSolid: '#F4EDE4',
    bgStart: '#F4EDE4',
    bgEnd: '#ffffff',
    waveOpacity: '0.55',
    waveBlend: 'multiply',
    theme: 'light',
  },
  manifesto: {
    bgSolid: '#2C2C2C',
    bgStart: '#2C2C2C',
    bgEnd: '#1f1f1f',
    waveOpacity: '0.35',
    waveBlend: 'overlay',
    theme: 'dark',
  },
  amalfi: {
    bgSolid: '#E0F2F1',
    bgStart: '#E0F2F1',
    bgEnd: '#ffffff',
    waveOpacity: '0.5',
    waveBlend: 'soft-light',
    theme: 'light',
  },
  golden: {
    bgSolid: '#FFF8E1',
    bgStart: '#FFF8E1',
    bgEnd: '#ffffff',
    waveOpacity: '0.5',
    waveBlend: 'multiply',
    theme: 'light',
  },
}

function applyTheme(themeKey: string) {
  const theme = THEMES[themeKey] || THEMES.hero
  const root = document.documentElement
  root.style.setProperty('--bg-solid', theme.bgSolid)
  root.style.setProperty('--bg-start', theme.bgStart)
  root.style.setProperty('--bg-end', theme.bgEnd)
  root.style.setProperty('--wave-opacity', theme.waveOpacity)
  root.style.setProperty('--wave-blend', theme.waveBlend)
  root.setAttribute('data-theme', theme.theme)
}

export function SectionBackgroundObserver() {
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('[data-bg-section]'),
    )
    if (sections.length === 0) {
      applyTheme('hero')
      return
    }

    applyTheme(sections[0].dataset.bgSection || 'hero')

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visible?.target) {
          const key = (visible.target as HTMLElement).dataset.bgSection || 'hero'
          applyTheme(key)
        }
      },
      {
        threshold: [0.25, 0.4, 0.6, 0.75],
        rootMargin: '-10% 0px -40% 0px',
      },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return null
}
