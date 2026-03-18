'use client'

import React from 'react'

export type ThemeKey = 'hero' | 'colombia' | 'plenty' | 'dolce' | 'quillami'
export type AudienceMode = 'adult' | 'kids'

type ThemeConfig = {
  bgPrimary: string
  bgSecondary: string
  accentFont: string
  theme: 'light' | 'dark'
  waveOpacity: string
  waveBlend: string
}

const THEMES: Record<ThemeKey, ThemeConfig> = {
  hero: {
    bgPrimary: '#deedff',
    bgSecondary: '#ffffff',
    accentFont: 'var(--font-script)',
    theme: 'light',
    waveOpacity: '0.6',
    waveBlend: 'soft-light',
  },
  colombia: {
    bgPrimary: '#deedff',
    bgSecondary: '#ffffff',
    accentFont: 'var(--font-script)',
    theme: 'light',
    waveOpacity: '0.6',
    waveBlend: 'soft-light',
  },
  plenty: {
    bgPrimary: '#deedff',
    bgSecondary: '#ffffff',
    accentFont: 'var(--font-script)',
    theme: 'light',
    waveOpacity: '0.6',
    waveBlend: 'soft-light',
  },
  dolce: {
    bgPrimary: '#deedff',
    bgSecondary: '#ffffff',
    accentFont: 'var(--font-script)',
    theme: 'light',
    waveOpacity: '0.6',
    waveBlend: 'soft-light',
  },
  quillami: {
    bgPrimary: '#deedff',
    bgSecondary: '#ffffff',
    accentFont: 'var(--font-script)',
    theme: 'light',
    waveOpacity: '0.6',
    waveBlend: 'soft-light',
  },
}

type ThemeContextValue = {
  theme: ThemeKey
  setTheme: (theme: ThemeKey) => void
  audience: AudienceMode
  setAudience: (audience: AudienceMode) => void
  setAmbientTint: (color: string, opacity?: string) => void
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined)

function applyTheme(themeKey: ThemeKey) {
  const theme = THEMES[themeKey]
  const root = document.documentElement
  root.style.setProperty('--bg-primary', theme.bgPrimary)
  root.style.setProperty('--bg-secondary', theme.bgSecondary)
  root.style.setProperty('--accent-font', theme.accentFont)
  root.style.setProperty('--wave-opacity', theme.waveOpacity)
  root.style.setProperty('--wave-blend', theme.waveBlend)
  root.setAttribute('data-theme', theme.theme)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<ThemeKey>('hero')
  const [audience, setAudience] = React.useState<AudienceMode>('adult')
  const [ambientTint, setAmbientTintState] = React.useState('#ffffff')
  const [ambientOpacity, setAmbientOpacity] = React.useState('0')

  React.useEffect(() => {
    applyTheme(theme)
  }, [theme])

  React.useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--bg-primary', audience === 'kids' ? '#F0F7FF' : '#deedff')
  }, [audience])

  React.useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--ambient-tint', ambientTint)
    root.style.setProperty('--ambient-opacity', ambientOpacity)
  }, [ambientTint, ambientOpacity])

  React.useEffect(() => {
    const updateScrollState = () => {
      document.documentElement.dataset.scrolled = window.scrollY > 8 ? 'true' : 'false'
    }
    updateScrollState()
    window.addEventListener('scroll', updateScrollState, { passive: true })
    return () => window.removeEventListener('scroll', updateScrollState)
  }, [])

  const setAmbientTint = React.useCallback((color: string, opacity: string = '0.08') => {
    setAmbientTintState(color)
    setAmbientOpacity(opacity)
  }, [])

  const value = React.useMemo(
    () => ({ theme, setTheme, audience, setAudience, setAmbientTint }),
    [theme, audience, setAmbientTint],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return ctx
}
