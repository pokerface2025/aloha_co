'use client'

import Link from 'next/link'
import { useTheme } from '@/components/ui/theme-context'
import { useEffect, useState } from 'react'

const socialLinks = [
  { name: 'Facebook', href: 'https://facebook.com/quieromialoha' },
  { name: 'Instagram', href: 'https://instagram.com/quieromialoha' },
  { name: 'TikTok', href: 'https://tiktok.com/@quieromialoha' },
  { name: 'WhatsApp', href: 'https://wa.me/573001234567' },
]

export function Footer() {
  const { theme } = useTheme()
  const [baqTime, setBaqTime] = useState('')
  const [miaTime, setMiaTime] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const formatterBAQ = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Bogota',
      hour: '2-digit',
      minute: '2-digit',
    })
    const formatterMIA = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      hour: '2-digit',
      minute: '2-digit',
    })

    const updateTimes = () => {
      const now = new Date()
      setBaqTime(formatterBAQ.format(now))
      setMiaTime(formatterMIA.format(now))
    }

    setMounted(true)
    updateTimes()
    const interval = setInterval(updateTimes, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <footer className="glass-footer border-t border-white/20 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
                ALOHA
              </span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Camisetas premium con el mood de la costa colombiana.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-foreground"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>

        {theme === 'quillami' && mounted && (
          <div className="mt-6 flex flex-col gap-1 text-[8px] text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[#deedff] animate-pulse" />
              <span>Hora local Barranquilla {baqTime} • 10.9639° N</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[#deedff]/60" />
              <span>Hora local Miami {miaTime} • 25.7617° N</span>
            </div>
          </div>
        )}

        <div className="mt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} ALOHA. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
