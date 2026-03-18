"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/products"

type PaymentStatus = "pending" | "paid" | "failed" | "unknown"

type Props = {
  mode: "success" | "failed"
}

export function PaymentStatusPage({ mode }: Props) {
  const searchParams = useSearchParams()
  const reference = searchParams.get("reference")
  const [status, setStatus] = useState<PaymentStatus>("pending")
  const [subtotal, setSubtotal] = useState<number | null>(null)
  const [message, setMessage] = useState<string>(
    "Estamos confirmando tu pago con Bold. Si tarda, revisa tu correo."
  )

  const heading = useMemo(() => {
    if (mode === "failed") {
      return "Tu pago no se completó"
    }
    return "Procesando tu pago"
  }, [mode])

  useEffect(() => {
    if (!reference) {
      setStatus("unknown")
      setMessage("No pudimos encontrar tu referencia de pago.")
      return
    }

    const storageKey = `aloha:order:${reference}`
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { productsSubtotal?: number }
        if (typeof parsed.productsSubtotal === "number") {
          setSubtotal(parsed.productsSubtotal)
        }
      } catch {
        // Ignore malformed storage data.
      }
    }

    if (mode === "failed") {
      setStatus("failed")
      setMessage("El pago fue rechazado o cancelado.")
    } else {
      setStatus("paid")
      setMessage("Pago confirmado. ¡Gracias por tu compra!")
    }

    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Record<string, unknown>
        const updated = {
          ...parsed,
          status: mode === "failed" ? "failed" : "paid",
          updatedAt: new Date().toISOString(),
        }
        localStorage.setItem(storageKey, JSON.stringify(updated))
      } catch {
        // Ignore storage write failures.
      }
    }
  }, [reference, mode])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-secondary/30 rounded-2xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
          {status === "paid" ? (
            <CheckCircle className="h-8 w-8 text-primary" />
          ) : status === "failed" ? (
            <XCircle className="h-8 w-8 text-destructive" />
          ) : (
            <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
          )}
        </div>

        <h1 className="text-2xl font-semibold text-foreground mb-2">{heading}</h1>
        <p className="text-sm text-muted-foreground mb-6">{message}</p>

        {reference && (
          <div className="bg-background border border-border rounded-lg p-4 text-left mb-6">
            <p className="text-xs text-muted-foreground">Referencia del pedido</p>
            <p className="text-sm font-semibold text-foreground">{reference}</p>
            {subtotal !== null && (
              <p className="text-xs text-muted-foreground mt-2">
                Total pagado ahora: {formatPrice(subtotal)}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3">
          {status === "paid" && (
            <Button asChild>
              <Link href={`/order-confirmation?order=${reference}`}>Ver confirmación</Link>
            </Button>
          )}
          {status === "failed" && (
            <Button asChild variant="outline">
              <Link href="/checkout">Intentar de nuevo</Link>
            </Button>
          )}
          <Button asChild variant="ghost">
            <Link href="/shop">Seguir comprando</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
