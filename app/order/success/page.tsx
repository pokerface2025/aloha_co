import { Suspense } from "react"
import { PaymentStatusPage } from "@/components/checkout/payment-status-page"

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <PaymentStatusPage mode="success" />
    </Suspense>
  )
}
