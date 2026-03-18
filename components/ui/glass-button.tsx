import * as React from "react"

import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"

export interface GlassButtonProps extends ButtonProps {}

export const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant = "outline", ...props }, ref) => (
    <Button
      ref={ref}
      variant={variant}
      className={cn(
        "glass-panel glass-hover border-white/20 bg-white/10 text-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        className,
      )}
      {...props}
    />
  )
)

GlassButton.displayName = "GlassButton"
