"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Package, Truck, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order") || "ALO-XXXXX";
  const deedName = searchParams.get("deedName");

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            ¡Gracias por tu compra!
          </h1>
          <p className="text-muted-foreground">
            Tu pedido ha sido confirmado y está siendo preparado.
          </p>
        </div>

        {/* Order Info Card */}
        <div className="bg-secondary/30 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
            <div>
              <p className="text-sm text-muted-foreground">Número de pedido</p>
              <p className="text-lg font-semibold text-foreground">{orderId}</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/track-order?order=${orderId}`}>
                Rastrear pedido
              </Link>
            </Button>
          </div>
          {deedName && (
            <div className="mb-4 space-y-2 rounded-xl border border-white/30 bg-white/60 px-4 py-3 text-sm text-muted-foreground">
              <p>
                Certificando su Título de Propiedad a nombre de{' '}
                <span className="text-foreground">{deedName}</span>...
              </p>
              <p>
                Su título digital será despachado junto con su guía de seguimiento una vez la
                pieza pase el control de calidad.
              </p>
            </div>
          )}

          {/* Timeline */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">Pedido confirmado</p>
                <p className="text-sm text-muted-foreground">
                  Hemos recibido tu pedido y estamos procesándolo
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <Package className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-muted-foreground">En preparación</p>
                <p className="text-sm text-muted-foreground">
                  Te notificaremos cuando esté listo para envío
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <Truck className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-muted-foreground">En camino</p>
                <p className="text-sm text-muted-foreground">
                  Tiempo estimado de entrega: 3-5 días hábiles
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-background border border-border rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            ¿Qué sigue?
          </h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </span>
              <span>
                Recibirás un email de confirmación con los detalles de tu pedido
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </span>
              <span>
                Te enviaremos el número de guía cuando tu pedido sea despachado
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                3
              </span>
              <span>
                Podrás rastrear tu pedido en tiempo real desde nuestra página
              </span>
            </li>
          </ul>
        </div>

        {/* Contact Support */}
        <div className="text-center mb-8">
          <p className="text-muted-foreground mb-4">
            ¿Tienes preguntas sobre tu pedido?
          </p>
          <Button variant="outline" asChild>
            <a
              href="https://wa.me/573001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Escríbenos por WhatsApp
            </a>
          </Button>
        </div>

        {/* Continue Shopping */}
        <div className="text-center">
          <Button asChild size="lg">
            <Link href="/shop">Seguir comprando</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
