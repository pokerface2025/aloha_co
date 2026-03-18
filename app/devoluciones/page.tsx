import type { Metadata } from "next";
import Link from "next/link";
import { RefreshCw, Clock, MessageCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Devoluciones y Cambios | ALOHA",
  description: "Política de devoluciones y cambios de ALOHA",
};

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Devoluciones y Cambios
        </h1>
        <p className="text-muted-foreground mb-12">
          Tu satisfacción es nuestra prioridad. Si no estás 100% feliz con tu
          compra, estamos aquí para ayudarte.
        </p>

        {/* Key Points */}
        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          <div className="flex items-start gap-4 p-4 bg-secondary/30 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">30 días</h3>
              <p className="text-sm text-muted-foreground">
                Tienes 30 días desde la entrega para solicitar un cambio o
                devolución
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-secondary/30 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <RefreshCw className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                Cambios gratis
              </h3>
              <p className="text-sm text-muted-foreground">
                Los cambios de talla o color son completamente gratis
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-secondary/30 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                Condiciones
              </h3>
              <p className="text-sm text-muted-foreground">
                El producto debe estar sin usar, con etiquetas y en empaque
                original
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-secondary/30 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                Fácil proceso
              </h3>
              <p className="text-sm text-muted-foreground">
                Solo escríbenos por WhatsApp y te guiamos paso a paso
              </p>
            </div>
          </div>
        </div>

        {/* Process Steps */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            ¿Cómo hacer un cambio o devolución?
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-semibold text-sm">
                1
              </span>
              <div>
                <h3 className="font-medium text-foreground">Contáctanos</h3>
                <p className="text-sm text-muted-foreground">
                  Escríbenos por WhatsApp al +57 300 123 4567 o por email a
                  hola@quieromialoha.com indicando tu número de pedido y el
                  motivo de la solicitud.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-semibold text-sm">
                2
              </span>
              <div>
                <h3 className="font-medium text-foreground">
                  Recibe tu guía de envío
                </h3>
                <p className="text-sm text-muted-foreground">
                  Te enviaremos una guía prepagada para que puedas devolver el
                  producto sin costo. También puedes dejarlo en nuestro punto de
                  recogida en Barranquilla.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-semibold text-sm">
                3
              </span>
              <div>
                <h3 className="font-medium text-foreground">
                  Procesamos tu solicitud
                </h3>
                <p className="text-sm text-muted-foreground">
                  Una vez recibamos el producto, procesaremos tu cambio o
                  reembolso en un plazo de 3-5 días hábiles. Los reembolsos se
                  realizan al mismo método de pago original.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Preguntas frecuentes
          </h2>
          <div className="space-y-4">
            <div className="p-4 border border-border rounded-xl">
              <h3 className="font-medium text-foreground mb-2">
                ¿Puedo cambiar por otra talla si no me queda?
              </h3>
              <p className="text-sm text-muted-foreground">
                ¡Claro! Los cambios de talla son gratis. Solo contáctanos y te
                ayudamos con el proceso.
              </p>
            </div>

            <div className="p-4 border border-border rounded-xl">
              <h3 className="font-medium text-foreground mb-2">
                ¿Cuánto tarda el reembolso?
              </h3>
              <p className="text-sm text-muted-foreground">
                Una vez recibamos el producto, procesamos el reembolso en 3-5
                días hábiles. Dependiendo de tu banco, puede tomar 5-10 días
                adicionales en reflejarse.
              </p>
            </div>

            <div className="p-4 border border-border rounded-xl">
              <h3 className="font-medium text-foreground mb-2">
                ¿Qué pasa si el producto llegó dañado?
              </h3>
              <p className="text-sm text-muted-foreground">
                Si tu producto llegó con algún defecto, te enviamos uno nuevo
                sin costo adicional. Solo envíanos fotos del daño por WhatsApp.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center p-8 bg-secondary/30 rounded-2xl">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            ¿Necesitas ayuda?
          </h2>
          <p className="text-muted-foreground mb-6">
            Estamos disponibles de lunes a sábado de 8am a 6pm
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <a
                href="https://wa.me/573001234567"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="mailto:hola@quieromialoha.com">Enviar email</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
