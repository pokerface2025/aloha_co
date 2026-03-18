import * as React from "react"

import { cn } from "@/lib/utils"
import { DialogContent } from "@/components/ui/dialog"

export interface GlassModalProps
  extends React.ComponentPropsWithoutRef<typeof DialogContent> {}

export const GlassModal = React.forwardRef<
  React.ElementRef<typeof DialogContent>,
  GlassModalProps
>(({ className, ...props }, ref) => (
  <DialogContent
    ref={ref}
    className={cn(
      "glass-panel-strong border-white/20 bg-white/15 text-foreground",
      className,
    )}
    {...props}
  />
))

GlassModal.displayName = "GlassModal"
