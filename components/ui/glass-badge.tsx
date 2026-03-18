import * as React from "react"

import { cn } from "@/lib/utils"

export interface GlassBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const GlassBadge = React.forwardRef<HTMLSpanElement, GlassBadgeProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/20 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm",
        className,
      )}
      {...props}
    />
  )
)

GlassBadge.displayName = "GlassBadge"
