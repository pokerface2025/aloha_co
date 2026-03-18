import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politicas de Privacidad | ALOHA",
  description: "Politicas de privacidad y tratamiento de datos de ALOHA",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Politicas de Privacidad
        </h1>

        <div className="prose prose-neutral max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              1. Responsable del Tratamiento
            </h2>
            <p className="text-muted-foreground mb-4">
              ALOHA, con domicilio en Barranquilla, Colombia, es responsable del
              tratamiento de los datos personales que recopilamos a traves de
              nuestro sitio web.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              2. Datos que Recopilamos
            </h2>
            <p className="text-muted-foreground mb-4">
              Recopilamos los siguientes tipos de informacion:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-4">
              <li>Nombre, apellido, email y telefono</li>
              <li>Direccion de envio, ciudad y departamento</li>
              <li>Informacion de pago procesada por terceros seguros</li>
              <li>Datos de navegacion como cookies y preferencias</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              3. Finalidad del Tratamiento
            </h2>
            <p className="text-muted-foreground mb-4">
              Usamos tus datos personales para:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-4">
              <li>Procesar y enviar tus pedidos</li>
              <li>Comunicarnos sobre el estado de tu compra</li>
              <li>Ofrecer atencion y soporte al cliente</li>
              <li>Mejorar nuestros productos y servicios</li>
              <li>Cumplir obligaciones legales</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              4. Proteccion de Datos
            </h2>
            <p className="text-muted-foreground mb-4">
              Implementamos medidas tecnicas y organizativas para proteger tus
              datos personales contra acceso no autorizado, alteracion,
              divulgacion o destruccion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              5. Derechos del Titular
            </h2>
            <p className="text-muted-foreground mb-4">
              Puedes conocer, actualizar, rectificar y solicitar la supresion de
              tus datos personales. Para ejercer tus derechos, contactanos por
              nuestros canales oficiales.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              6. Cambios a esta Politica
            </h2>
            <p className="text-muted-foreground mb-4">
              ALOHA puede actualizar estas politicas en cualquier momento.
              Notificaremos los cambios relevantes en nuestro sitio web.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
