import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones | ALOHA",
  description: "Términos y condiciones de uso de ALOHA",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Términos y Condiciones
        </h1>

        <div className="prose prose-neutral max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              1. Información General
            </h2>
            <p className="text-muted-foreground mb-4">
              Bienvenido a ALOHA (quieromialoha.com). Al acceder y utilizar
              nuestro sitio web, aceptas cumplir con estos términos y
              condiciones. ALOHA es una marca de ropa casual premium con sede en
              Barranquilla, Colombia.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              2. Productos y Precios
            </h2>
            <p className="text-muted-foreground mb-4">
              Todos los precios mostrados en nuestro sitio web están en Pesos
              Colombianos (COP) e incluyen el IVA correspondiente. Nos
              reservamos el derecho de modificar los precios sin previo aviso.
              Las imágenes de los productos son representativas y pueden variar
              ligeramente del producto real.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              3. Proceso de Compra
            </h2>
            <p className="text-muted-foreground mb-4">
              Al realizar una compra en ALOHA, confirmas que eres mayor de edad
              y que la información proporcionada es veraz y completa. Nos
              reservamos el derecho de cancelar pedidos si detectamos
              irregularidades o información incorrecta.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              4. Envíos
            </h2>
            <p className="text-muted-foreground mb-4">
              Realizamos envíos a todo el territorio colombiano. Los tiempos de
              entrega varían según la ubicación: 3-5 días hábiles para envío
              estándar y 1-2 días hábiles para envío express. El envío es gratis
              para compras mayores a $150.000 COP.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              5. Devoluciones y Cambios
            </h2>
            <p className="text-muted-foreground mb-4">
              Aceptamos devoluciones y cambios dentro de los 30 días posteriores
              a la compra, siempre que el producto se encuentre en perfectas
              condiciones, sin usar y con todas sus etiquetas. Para iniciar un
              proceso de devolución, contáctanos por WhatsApp o email.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              6. Propiedad Intelectual
            </h2>
            <p className="text-muted-foreground mb-4">
              Todo el contenido de este sitio web, incluyendo pero no limitado a
              textos, gráficos, logos, imágenes, y software, es propiedad de
              ALOHA y está protegido por las leyes de propiedad intelectual de
              Colombia.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              7. Contacto
            </h2>
            <p className="text-muted-foreground">
              Si tienes preguntas sobre estos términos y condiciones, puedes
              contactarnos a través de:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-2">
              <li>Email: hola@quieromialoha.com</li>
              <li>WhatsApp: +57 300 123 4567</li>
              <li>Dirección: Barranquilla, Colombia</li>
            </ul>
          </section>

          <p className="text-sm text-muted-foreground mt-8">
            Última actualización: Enero 2026
          </p>
        </div>
      </div>
    </div>
  );
}
