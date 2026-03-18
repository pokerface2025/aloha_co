import type { Metadata } from "next";
import { OrderConfirmationContent } from "@/components/checkout/order-confirmation-content";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Pedido Confirmado | ALOHA",
  description: "Tu pedido ha sido confirmado exitosamente",
};

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
