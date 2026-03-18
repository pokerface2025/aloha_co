import type { Metadata } from "next";
import Link from "next/link";
import { RefreshCw, Clock, MessageCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Devoluciones y Cambios | ALOHA",
  description: "Politica de devoluciones y cambios de ALOHA",
};

export default function ReturnsAndExchangesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Devoluciones y Cambios
        </h1>
        <p className="text-muted-foreground mb-12">
          Tu satisfaccion es nuestra prioridad. Si no estas 100% feliz con tu
          compra, estamos aqui para ayudarte.
        </p>

        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          <div className="flex items-start gap-4 p-4 bg-secondary/30 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">30 dias</h3>
              <p className="text-sm text-muted-foreground">
                Tienes 30 dias desde la entrega para solicitar un cambio o
                devolucion.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-secondary/30 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <RefreshCw className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Cambios gratis</h3>
              <p className="text-sm text-muted-foreground">
                Los cambios de talla o color son completamente gratis.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-secondary/30 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Condiciones</h3>
              <p className="text-sm text-muted-foreground">
                El producto debe estar sin usar, con etiquetas y empaque
                original.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-secondary/30 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Facil proceso</h3>
              <p className="text-sm text-muted-foreground">
                Escribenos por WhatsApp y te guiamos paso a paso.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-secondary/30 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Como solicitar un cambio o devolucion
          </h2>
          <ol className="list-decimal list-inside text-muted-foreground space-y-2">
            <li>Contactanos por WhatsApp con tu numero de pedido.</li>
            <li>Comparte el motivo y las fotos si aplica.</li>
            <li>Te enviaremos instrucciones de envio y confirmacion.</li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild>
            <a
              href="https://wa.me/573001234567"
              target="_blank"
              rel="noopener noreferrer"
            >
              Escribenos por WhatsApp
            </a>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/shop">Volver a la tienda</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
