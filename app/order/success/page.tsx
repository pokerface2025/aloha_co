import { Suspense } from "react"
import { PaymentStatusPage } from "@/components/checkout/payment-status-page"

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={null}>
      <PaymentStatusPage mode="success" />
    </Suspense>
  )
}
