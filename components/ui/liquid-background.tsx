'use client'

import { motion, useScroll, useTransform } from 'framer-motion'

export function LiquidBackground() {
  const { scrollY } = useScroll()
  const ySlow = useTransform(scrollY, [0, 1200], [0, -30])
  const yMid = useTransform(scrollY, [0, 1200], [0, -45])
  const yFast = useTransform(scrollY, [0, 1200], [0, -60])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute -left-1/4 -top-1/3 h-[70vw] w-[70vw]"
        style={{ filter: 'blur(80px)', opacity: 0.4, y: ySlow, willChange: 'transform' }}
        animate={{ x: [0, 40, -20, 0], scale: [1, 1.05, 0.98, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg viewBox="0 0 600 600" className="h-full w-full">
          <path
            d="M459.5,312.5Q452,375,400.5,416.5Q349,458,274,475Q199,492,150.5,438Q102,384,95.5,318Q89,252,128,201Q167,150,231,111Q295,72,360,103.5Q425,135,451.5,199.5Q478,264,459.5,312.5Z"
            fill="var(--bg-primary)"
            style={{ transition: 'fill 1200ms ease-in-out' }}
          />
        </svg>
      </motion.div>

      <motion.div
        className="absolute -right-1/4 top-[-10%] h-[60vw] w-[60vw]"
        style={{ filter: 'blur(80px)', opacity: 0.4, y: yMid, willChange: 'transform' }}
        animate={{ x: [0, -30, 20, 0], scale: [1, 0.96, 1.04, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg viewBox="0 0 600 600" className="h-full w-full">
          <path
            d="M446,330.5Q441,411,364,440.5Q287,470,213.5,447Q140,424,106.5,357Q73,290,105,226.5Q137,163,203,136Q269,109,336.5,124.5Q404,140,430,204.5Q456,269,446,330.5Z"
            fill="var(--bg-secondary)"
            style={{ transition: 'fill 1200ms ease-in-out' }}
          />
        </svg>
      </motion.div>

      <motion.div
        className="absolute left-[20%] bottom-[-30%] h-[65vw] w-[65vw]"
        style={{ filter: 'blur(80px)', opacity: 0.4, y: yFast, willChange: 'transform' }}
        animate={{ x: [0, 20, -30, 0], scale: [1, 1.06, 0.97, 1] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg viewBox="0 0 600 600" className="h-full w-full">
          <path
            d="M457,321Q451,392,386,431.5Q321,471,246.5,458Q172,445,134.5,382.5Q97,320,99.5,252Q102,184,153.5,137Q205,90,273,95Q341,100,399.5,141.5Q458,183,461,256.5Q464,330,457,321Z"
            fill="color-mix(in srgb, var(--bg-primary) 70%, #ffffff)"
            style={{ transition: 'fill 1200ms ease-in-out' }}
          />
        </svg>
      </motion.div>

      <div
        className="absolute inset-0 transition-opacity duration-[1200ms]"
        style={{
          backgroundColor: 'var(--ambient-tint)',
          opacity: 'var(--ambient-opacity)',
          mixBlendMode: 'multiply',
        }}
      />
    </div>
  )
}
