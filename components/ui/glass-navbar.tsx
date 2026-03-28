"use client"

import * as React from "react"
import { useMotionValueEvent, useScroll } from "framer-motion"

import { cn } from "@/lib/utils"

export interface GlassNavbarProps extends React.HTMLAttributes<HTMLElement> {}

export function GlassNavbar({ className, ...props }: GlassNavbarProps) {
  const { scrollY } = useScroll()
  const [isScrolled, setIsScrolled] = React.useState(false)

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 8)
  })

  return (
    <header
      className={cn(
        "glass-navbar sticky top-0 z-50 border border-transparent bg-transparent transition-all",
        isScrolled &&
          "is-scrolled border-white/20 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.5)]",
        className,
      )}
      {...props}
    />
  )
}
