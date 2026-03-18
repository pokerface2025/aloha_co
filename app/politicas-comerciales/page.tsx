import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politicas Comerciales | ALOHA",
  description: "Politicas comerciales, compras y envios de ALOHA",
};

export default function CommercialPoliciesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Politicas Comerciales
        </h1>

        <div className="prose prose-neutral max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              1. Productos y Precios
            </h2>
            <p className="text-muted-foreground mb-4">
              Los precios se muestran en Pesos Colombianos (COP) e incluyen IVA.
              Las imagenes y descripciones son de referencia y pueden variar de
              la prenda final.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              2. Proceso de Compra
            </h2>
            <p className="text-muted-foreground mb-4">
              Al confirmar tu compra aceptas estas politicas. Nos reservamos el
              derecho de cancelar pedidos con informacion incorrecta o
              incumplimientos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              3. Pagos
            </h2>
            <p className="text-muted-foreground mb-4">
              Los pagos se procesan de forma segura a traves de proveedores
              autorizados. No almacenamos la informacion de tarjetas.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              4. Envios
            </h2>
            <p className="text-muted-foreground mb-4">
              Realizamos envios en Colombia. Los tiempos estimados son 3 a 5
              dias habiles para envio estandar y 1 a 2 dias habiles para envio
              express. El costo se informa en el checkout.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              5. Disponibilidad
            </h2>
            <p className="text-muted-foreground mb-4">
              La disponibilidad de tallas y colores es limitada. Si un producto
              se agota, te notificaremos las opciones disponibles.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
