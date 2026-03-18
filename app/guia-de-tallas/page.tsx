import type { Metadata } from "next";
import { Ruler, MessageCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";

export const metadata: Metadata = {
  title: "Guía de Tallas | ALOHA",
  description: "Encuentra tu talla perfecta con nuestra guía de medidas",
};

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <GlassCard className="glass-panel-strong p-10 text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-6">
            <Ruler className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Guía de Tallas
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Encuentra tu talla perfecta. Nuestras camisetas tienen un fit
            regular-relaxed, diseñado para ser cómodo sin ser holgado.
          </p>
        </GlassCard>

        {/* Size Chart */}
        <GlassCard className="p-8 mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Tabla de medidas (cm)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-white/25">
                  <th className="border border-border px-4 py-3 text-left font-semibold text-foreground">
                    Talla
                  </th>
                  <th className="border border-border px-4 py-3 text-center font-semibold text-foreground">
                    Pecho
                  </th>
                  <th className="border border-border px-4 py-3 text-center font-semibold text-foreground">
                    Largo
                  </th>
                  <th className="border border-border px-4 py-3 text-center font-semibold text-foreground">
                    Hombro
                  </th>
                  <th className="border border-border px-4 py-3 text-center font-semibold text-foreground">
                    Manga
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border px-4 py-3 font-medium text-foreground">
                    XS
                  </td>
                  <td className="border border-border px-4 py-3 text-center text-muted-foreground">
                    86-91
                  </td>
                  <td className="border border-border px-4 py-3 text-center text-muted-foreground">
                    66
                  </td>
                  <td className="border border-border px-4 py-3 text-center text-muted-foreground">
                    42
                  </td>
                  <td className="border border-border px-4 py-3 text-center text-muted-foreground">
                    18
                  </td>
                </tr>
                <tr className="bg-white/15">
                  <td className="border border-border px-4 py-3 font-medium text-foreground">
                    S
                  </td>
                  <td className="border border-border px-4 py-3 text-center text-muted-foreground">
                    91-96
                  </td>
                  <td className="border border-border px-4 py-3 text-center text-muted-foreground">
                    68
                  </td>
                  <td className="border border-border px-4 py-3 text-center text-muted-foreground">
                    44
                  </td>
                  <td className="border border-border px-4 py-3 text-center text-muted-foreground">
                    19
                  </td>
                </tr>
                <tr>
                  <td className="border border-border px-4 py-3 font-medium text-foreground">
                    M
                  </td>
                  <td className="border border-border px-4 py-3 text-center text-muted-foreground">
                    96-101
                  </td>
                  <td className="border border-border px-4 py-3 text-center text-muted-foreground">
                    70
                  </td>
                  <td className="border border-border px-4 py-3 text-center text-muted-foreground">
                    46
                  </td>
                  <td className="border border-border px-4 py-3 text-center text-muted-foreground">
                    20
                  </td>
                </tr>
                <tr className="bg-white/15">
                  <td className="border border-border px-4 py-3 font-medium text-foreground">
                    L
                  </td>
                  <td className="border border-border px-4 py-3 text-center text-muted-foreground">
                    101-106
                  </td>
                  <td className="border border-border px-4 py-3 text-center text-muted-foreground">
                    72
                  </td>
                  <td className="border border-border px-4 py-3 text-center text-muted-foreground">
                    48
                  </td>
                  <td className="border border-border px-4 py-3 text-center text-muted-foreground">
                    21
                  </td>
                </tr>
                <tr>
                  <td className="border border-border px-4 py-3 font-medium text-foreground">
                    XL
                  </td>
                  <td className="border border-border px-4 py-3 text-center text-muted-foreground">
                    106-111
                  </td>
                  <td className="border border-border px-4 py-3 text-center text-muted-foreground">
                    74
                  </td>
                  <td className="border border-border px-4 py-3 text-center text-muted-foreground">
                    50
                  </td>
                  <td className="border border-border px-4 py-3 text-center text-muted-foreground">
                    22
                  </td>
                </tr>
                <tr className="bg-white/15">
                  <td className="border border-border px-4 py-3 font-medium text-foreground">
                    2XL
                  </td>
                  <td className="border border-border px-4 py-3 text-center text-muted-foreground">
                    111-116
                  </td>
                  <td className="border border-border px-4 py-3 text-center text-muted-foreground">
                    76
                  </td>
                  <td className="border border-border px-4 py-3 text-center text-muted-foreground">
                    52
                  </td>
                  <td className="border border-border px-4 py-3 text-center text-muted-foreground">
                    23
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* How to Measure */}
        <GlassCard className="p-8 mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            ¿Cómo tomar tus medidas?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <GlassCard className="p-6">
              <h3 className="font-semibold text-foreground mb-2">Pecho</h3>
              <p className="text-sm text-muted-foreground">
                Mide alrededor de la parte más ancha del pecho, pasando la cinta
                por debajo de los brazos y sobre los omóplatos.
              </p>
            </GlassCard>
            <GlassCard className="p-6">
              <h3 className="font-semibold text-foreground mb-2">Largo</h3>
              <p className="text-sm text-muted-foreground">
                Mide desde el punto más alto del hombro (junto al cuello) hasta
                el borde inferior de la camiseta.
              </p>
            </GlassCard>
            <GlassCard className="p-6">
              <h3 className="font-semibold text-foreground mb-2">Hombro</h3>
              <p className="text-sm text-muted-foreground">
                Mide de un extremo del hombro al otro, pasando por la parte
                trasera del cuello.
              </p>
            </GlassCard>
            <GlassCard className="p-6">
              <h3 className="font-semibold text-foreground mb-2">Manga</h3>
              <p className="text-sm text-muted-foreground">
                Mide desde la costura del hombro hasta el borde de la manga.
              </p>
            </GlassCard>
          </div>
        </GlassCard>

        {/* Fit Recommendations */}
        <GlassCard className="p-8 mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Recomendaciones de fit
          </h2>
          <div className="space-y-4">
            <GlassCard className="p-4">
              <h3 className="font-medium text-foreground mb-2">
                Para un fit regular
              </h3>
              <p className="text-sm text-muted-foreground">
                Elige tu talla habitual. Nuestras camisetas ya tienen un corte
                ligeramente relajado que es cómodo sin ser holgado.
              </p>
            </GlassCard>
            <GlassCard className="p-4">
              <h3 className="font-medium text-foreground mb-2">
                Para un fit más ajustado
              </h3>
              <p className="text-sm text-muted-foreground">
                Si prefieres un look más ceñido, considera bajar una talla. Ten
                en cuenta que el algodón puede encoger ligeramente con el primer
                lavado.
              </p>
            </GlassCard>
            <GlassCard className="p-4">
              <h3 className="font-medium text-foreground mb-2">
                Para un fit oversized
              </h3>
              <p className="text-sm text-muted-foreground">
                Si te gusta el estilo oversized, sube una o dos tallas. Esto te
                dará ese look relajado y moderno que está muy de moda.
              </p>
            </GlassCard>
          </div>
        </GlassCard>

        {/* Between Sizes */}
        <GlassCard className="p-8 mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            ¿Entre dos tallas?
          </h2>
          <p className="text-muted-foreground mb-4">
            Si estás entre dos tallas, te recomendamos elegir la talla más
            grande para mayor comodidad. Recuerda que siempre puedes hacer
            cambios gratis si no te queda perfecta.
          </p>
          <p className="text-sm text-muted-foreground">
            También puedes usar nuestro recomendador de talla en cada producto,
            que te sugiere la talla ideal basándose en tu peso y altura.
          </p>
        </GlassCard>

        {/* CTA */}
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            ¿Aún tienes dudas sobre tu talla?
          </p>
          <GlassButton asChild>
            <a
              href="https://wa.me/573001234567?text=Hola!%20Necesito%20ayuda%20con%20mi%20talla"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Pregúntanos por WhatsApp
            </a>
          </GlassButton>
        </div>
      </div>
    </div>
  );
}
