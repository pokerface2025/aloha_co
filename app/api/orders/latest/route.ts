import { NextResponse } from "next/server"

import { listOrders } from "@/lib/order-store"

export async function GET() {
  const orders = listOrders()
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)

  return NextResponse.json({ orders })
}
