import { getProductById } from "@/lib/products"

export interface CartItemInput {
  productId: string
  variantSku?: string
  quantity: number
}

export interface LineItem {
  productId: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

let pricingValidated = false

export function computeSubtotal(items: CartItemInput[]) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Cart items required")
  }

  const lineItems: LineItem[] = items.map((item) => {
    if (!item.productId || item.quantity <= 0) {
      throw new Error("Invalid cart item")
    }

    const product = getProductById(item.productId)
    if (!product) {
      throw new Error(`Product not found: ${item.productId}`)
    }

    const lineTotal = product.price * item.quantity
    return {
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: product.price,
      lineTotal,
    }
  })

  const subtotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0)
  return { subtotal, lineItems }
}

export function computeShippingMode(subtotal: number) {
  if (subtotal >= 150000) {
    return {
      shippingCost: 0,
      shippingMode: "free" as const,
      shippingNote: "Envío gratis",
    }
  }

  return {
    shippingCost: 15000,
    shippingMode: "flat_rate" as const,
    shippingNote: "Envío $15.000 COP",
  }
}

export function validateShippingRulesOnce() {
  if (pricingValidated) return
  pricingValidated = true

  const testLow = 149999
  const testHigh = 150000
  const low = computeShippingMode(testLow)
  const high = computeShippingMode(testHigh)

  if (low.shippingCost !== 15000 || low.shippingMode !== "flat_rate") {
    console.warn("[Pricing] rule check failed for subtotal 149999")
  }
  if (high.shippingCost !== 0 || high.shippingMode !== "free") {
    console.warn("[Pricing] rule check failed for subtotal 150000")
  }
}
