import { NextResponse } from "next/server"

import { postToCrm } from "@/lib/crm"

export async function POST() {
  const payload = {
    action: "order_created",
    orderReference: `ALOHA-CRM-TEST-${Date.now()}`,
    status: "pending_payment",
    productsSubtotal: 123456,
    shippingMode: "pay_on_delivery",
    shippingNote: "Se paga contra entrega; depende del transportador.",
    customer: {
      name: "Test CRM",
      email: "test@aloha.local",
      phone: "+57 300 000 0000",
      city: "Barranquilla",
      neighborhood: "Riomar",
      addressLine: "Calle 1 #2-3",
      notes: "Prueba CRM",
    },
    items: [{ productId: "crm_test_product", quantity: 1 }],
    createdAt: new Date().toISOString(),
    source: "diagnostics",
  }

  const result = await postToCrm(payload)
  return NextResponse.json({
    ok: result.ok,
    status: result.status,
    skipped: result.skipped,
    errorText: result.errorText || "",
  })
}
