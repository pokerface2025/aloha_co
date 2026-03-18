import { NextResponse } from "next/server"

import {
  getOrderRecord,
  isTransactionProcessed,
  markTransactionProcessed,
  setOrderCrmError,
  updateOrderStatus,
} from "@/lib/order-store"
import { postPaymentUpdate } from "@/lib/crm"
import { notifyPaymentReceived } from "@/lib/notify"
import { getPublicBaseUrl } from "@/lib/public-url"

interface BoldWebhookBody {
  reference?: string
  status?: "paid" | "failed" | string
  transactionId?: string
  paidAt?: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as BoldWebhookBody
    const reference = body.reference || (body as { orderReference?: string }).orderReference

    if (!reference) {
      return NextResponse.json({ error: "reference required" }, { status: 400 })
    }

    const publicBaseUrl = getPublicBaseUrl(request)
    if (publicBaseUrl) {
      console.info(`[Bold Webhook] Use this URL in Bold: ${publicBaseUrl}/api/bold/webhook`)
    }

    console.info(
      `[Bold Webhook] reference=${reference} status=${body.status ?? "unknown"} transactionId=${
        body.transactionId ?? "n/a"
      }`
    )

    const order = getOrderRecord(reference)
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    if (isTransactionProcessed(body.transactionId)) {
      return NextResponse.json({ ok: true, duplicate: true })
    }

    // TODO: Verify Bold webhook authenticity/integrity if Bold provides a signature method.
    const rawStatus = (body.status || "").toLowerCase()
    const normalizedStatus =
      rawStatus === "paid" ||
      rawStatus === "approved" ||
      rawStatus === "success" ||
      rawStatus === "completed"
        ? "paid"
        : rawStatus === "failed" ||
            rawStatus === "rejected" ||
            rawStatus === "declined" ||
            rawStatus === "canceled"
          ? "failed"
          : "pending"

    if (order.status === "paid" && order.transactionId && order.transactionId === body.transactionId) {
      return NextResponse.json({ ok: true, duplicate: true })
    }

    if (normalizedStatus === "pending") {
      return NextResponse.json({ ok: true, status: "pending" })
    }
    const updated = updateOrderStatus({
      orderReference: reference,
      status: normalizedStatus,
      transactionId: body.transactionId,
      paidAt: body.paidAt,
    })

    if (!updated) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    markTransactionProcessed(body.transactionId)
    const crmResult = await postPaymentUpdate(updated)
    if (!crmResult.ok && !crmResult.skipped) {
      const errorSummary = `CRM error ${crmResult.status}: ${crmResult.errorText || "unknown"}`
      setOrderCrmError(updated.orderReference, errorSummary)
    }

    if (normalizedStatus === "paid") {
      await notifyPaymentReceived(updated)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
