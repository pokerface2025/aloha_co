import { Suspense } from "react"
import { PaymentStatusPage } from "@/components/checkout/payment-status-page"

export default function OrderFailedPage() {
  return (
    <Suspense fallback={null}>
      <PaymentStatusPage mode="failed" />
    </Suspense>
  )
}
