import { NextResponse } from "next/server"

import { computeSubtotal, type CartItemInput, computeShippingMode, validateShippingRulesOnce } from "@/lib/pricing"
import { createOrderRecord } from "@/lib/order-store"
import { postOrderCreated } from "@/lib/crm"

interface CreateOrderBody {
  items: CartItemInput[]
  customer: {
    name: string
    email: string
    phone: string
    city: string
    neighborhood: string
    addressLine: string
    notes?: string
  }
}

function generateOrderReference() {
  const now = new Date()
  const y = now.getFullYear().toString()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  const d = String(now.getDate()).padStart(2, "0")
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `ALOHA-${y}${m}${d}-${suffix}`
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateOrderBody
    if (!body?.items?.length) {
      return NextResponse.json({ error: "Items required" }, { status: 400 })
    }

    if (!body.customer?.name || !body.customer?.email || !body.customer?.phone) {
      return NextResponse.json({ error: "Customer fields required" }, { status: 400 })
    }

    const { subtotal } = computeSubtotal(body.items)
    const shipping = computeShippingMode(subtotal)
    const totalDueNow = subtotal + (shipping.shippingCost ?? 0)
    validateShippingRulesOnce()
    const orderReference = generateOrderReference()

    const order = createOrderRecord({
      orderReference,
      customer: body.customer,
      items: body.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      productsSubtotal: subtotal,
    })

    console.info(
      `[Pricing] subtotal=${subtotal} shipping=${shipping.shippingCost ?? 0} total=${totalDueNow}`
    )
    console.info(`[Orders] created order=${order.orderReference} subtotal=${subtotal}`)

    await postOrderCreated(order)

    return NextResponse.json({
      orderReference,
      productsSubtotal: subtotal,
      shippingCost: shipping.shippingCost,
      totalDueNow,
      shippingMode: shipping.shippingMode,
      shippingNote: shipping.shippingNote,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
