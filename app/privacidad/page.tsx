import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad | ALOHA",
  description: "Política de privacidad y tratamiento de datos de ALOHA",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Política de Privacidad
        </h1>

        <div className="prose prose-neutral max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              1. Responsable del Tratamiento
            </h2>
            <p className="text-muted-foreground mb-4">
              ALOHA, con domicilio en Barranquilla, Colombia, es responsable del
              tratamiento de los datos personales que recopilamos a través de
              nuestro sitio web quieromialoha.com.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              2. Datos que Recopilamos
            </h2>
            <p className="text-muted-foreground mb-4">
              Recopilamos los siguientes tipos de información:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-4">
              <li>
                Información de identificación: nombre, apellido, email, teléfono
              </li>
              <li>Información de envío: dirección, ciudad, departamento</li>
              <li>Información de pago: procesada de forma segura por Bold</li>
              <li>
                Información de navegación: cookies, dirección IP, preferencias
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              3. Finalidad del Tratamiento
            </h2>
            <p className="text-muted-foreground mb-4">
              Utilizamos tus datos personales para:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-4">
              <li>Procesar y enviar tus pedidos</li>
              <li>Comunicarnos contigo sobre el estado de tu compra</li>
              <li>Enviarte información promocional (con tu consentimiento)</li>
              <li>Mejorar nuestros productos y servicios</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              4. Protección de Datos
            </h2>
            <p className="text-muted-foreground mb-4">
              Implementamos medidas de seguridad técnicas y organizativas para
              proteger tus datos personales contra acceso no autorizado,
              alteración, divulgación o destrucción. Los pagos son procesados de
              forma segura a través de Bold, cumpliendo con los estándares PCI
              DSS.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              5. Derechos del Titular
            </h2>
            <p className="text-muted-foreground mb-4">
              De acuerdo con la Ley 1581 de 2012, tienes derecho a:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-4">
              <li>Conocer tus datos personales</li>
              <li>Actualizar y rectificar tus datos</li>
              <li>Solicitar prueba de la autorización</li>
              <li>Revocar la autorización y/o solicitar la supresión</li>
              <li>Presentar quejas ante la SIC</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              6. Cookies
            </h2>
            <p className="text-muted-foreground mb-4">
              Utilizamos cookies para mejorar tu experiencia de navegación,
              analizar el tráfico del sitio y personalizar el contenido. Puedes
              configurar tu navegador para rechazar cookies, aunque esto puede
              afectar algunas funcionalidades del sitio.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              7. Contacto
            </h2>
            <p className="text-muted-foreground">
              Para ejercer tus derechos o resolver dudas sobre esta política,
              contáctanos:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-2">
              <li>Email: privacidad@quieromialoha.com</li>
              <li>WhatsApp: +57 300 123 4567</li>
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
