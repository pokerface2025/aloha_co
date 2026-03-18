import type { OrderRecord } from "@/lib/order-store"

const CRM_WEBAPP_URL = process.env.CRM_WEBAPP_URL
const CRM_WEBAPP_TOKEN = process.env.CRM_WEBAPP_TOKEN

export async function postToCrm(payload: Record<string, unknown>) {
  if (!CRM_WEBAPP_URL || !CRM_WEBAPP_TOKEN) {
    console.warn(
      "[CRM] Missing CRM_WEBAPP_URL or CRM_WEBAPP_TOKEN. Skipping CRM logging."
    )
    return { ok: false, skipped: true }
  }

  const response = await fetch(CRM_WEBAPP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CRM_WEBAPP_TOKEN}`,
    },
    body: JSON.stringify(payload),
  })

  let errorText = ""
  if (!response.ok) {
    try {
      errorText = await response.text()
    } catch (error) {
      errorText = "Unable to read CRM response"
    }
  }

  return { ok: response.ok, status: response.status, errorText }
}

export async function postOrderCreated(order: OrderRecord) {
  return postToCrm({
    action: "order_created",
    orderReference: order.orderReference,
    status: order.status,
    productsSubtotal: order.productsSubtotal,
    shippingCost: order.shippingCost,
    totalDueNow: order.totalDueNow,
    shippingMode: order.shippingMode,
    shippingNote: order.shippingNote,
    customer: order.customer,
    items: order.items,
    createdAt: order.createdAt,
  })
}

export async function postPaymentUpdate(order: OrderRecord) {
  return postToCrm({
    action: "payment_updated",
    orderReference: order.orderReference,
    status: order.status,
    transactionId: order.transactionId,
    paidAt: order.paidAt,
    updatedAt: order.updatedAt,
    shippingCost: order.shippingCost,
    totalDueNow: order.totalDueNow,
    shippingMode: order.shippingMode,
  })
}
