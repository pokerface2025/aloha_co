import * as React from "react"

import { cn } from "@/lib/utils"

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "glass-panel rounded-2xl text-foreground",
        className,
      )}
      {...props}
    />
  )
)

GlassCard.displayName = "GlassCard"
