import "server-only"

import nodemailer from "nodemailer"

import type { OrderRecord } from "@/lib/order-store"
import { getProductById, formatPrice } from "@/lib/products"

type NotifyResult = {
  ok: boolean
  skipped?: boolean
  error?: string
}

function getSmtpConfig() {
  const host = process.env.NOTIFY_SMTP_HOST
  const port = Number(process.env.NOTIFY_SMTP_PORT || "0")
  const user = process.env.NOTIFY_SMTP_USER
  const pass = process.env.NOTIFY_SMTP_PASS
  const from = process.env.NOTIFY_EMAIL_FROM

  if (!host || !port || !user || !pass || !from) {
    console.warn("[Notify] Email not configured, skipping.")
    return null
  }

  return { host, port, user, pass, from }
}

function buildItemSummary(order: OrderRecord) {
  const lines = order.items.map((item) => {
    const product = getProductById(item.productId)
    const name = product?.name || item.productId
    return `• ${name} x ${item.quantity}`
  })

  return lines.join("\n")
}

function buildShippingReminder(order: OrderRecord) {
  if (order.shippingMode === "free") {
    return "Envío gratis (subtotal de productos ≥ 150.000 COP)."
  }
  return "El envío se paga contra entrega; depende del transportador."
}

export async function notifyPaymentReceived(order: OrderRecord): Promise<NotifyResult> {
  const smtp = getSmtpConfig()
  if (!smtp) {
    return { ok: false, skipped: true }
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.port === 465,
      auth: {
        user: smtp.user,
        pass: smtp.pass,
      },
    })

    const subject = "¡Pago recibido! Tu pedido ALOHA está confirmado"
    const body = [
      `Hola ${order.customer.name},`,
      "",
      "¡Gracias! Confirmamos que recibimos tu pago.",
      "",
      `Pedido: ${order.orderReference}`,
      `Total pagado ahora: ${formatPrice(order.productsSubtotal)}`,
      "",
      "Resumen de productos:",
      buildItemSummary(order),
      "",
      "Envío:",
      buildShippingReminder(order),
      "",
      "Si tienes preguntas, responde a este correo y con gusto te ayudamos.",
      "",
      "Equipo ALOHA",
    ].join("\n")

    await transporter.sendMail({
      from: smtp.from,
      to: order.customer.email,
      subject,
      text: body,
    })

    return { ok: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Email send failed"
    console.warn("[Notify] Email send failed:", message)
    return { ok: false, error: message }
  }
}

// Placeholder for future WhatsApp provider integration.
export async function notifyPaymentReceivedWhatsApp(_order: OrderRecord): Promise<NotifyResult> {
  return { ok: false, skipped: true }
}
