import { NextResponse } from "next/server"

import { getOrderRecord } from "@/lib/order-store"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const reference = searchParams.get("reference")

  if (!reference) {
    return NextResponse.json({ error: "reference required" }, { status: 400 })
  }

  const order = getOrderRecord(reference)
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  return NextResponse.json({
    orderReference: order.orderReference,
    status: order.status,
    productsSubtotal: order.productsSubtotal,
    shippingMode: order.shippingMode,
    shippingNote: order.shippingNote,
    updatedAt: order.updatedAt,
    paidAt: order.paidAt,
  })
}
