import "server-only"

import fs from "fs"
import path from "path"

import { computeShippingMode } from "@/lib/pricing"

export interface CustomerInput {
  name: string
  email: string
  phone: string
  city: string
  neighborhood: string
  addressLine: string
  notes?: string
}

export interface OrderRecord {
  orderReference: string
  customer: CustomerInput
  items: {
    productId: string
    quantity: number
  }[]
  productsSubtotal: number
  shippingCost: number | null
  totalDueNow: number
  shippingMode: "free" | "flat_rate"
  shippingNote: string
  status: "pending_payment" | "paid" | "failed"
  transactionId?: string
  crmError?: string
  createdAt: string
  updatedAt: string
  paidAt?: string
}

const orders = new Map<string, OrderRecord>()
let hasLoaded = false

const DATA_DIR = path.join(process.cwd(), "data")
const DATA_FILE = path.join(DATA_DIR, "orders.json")

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), "utf8")
  }
}

function loadOrdersOnce() {
  if (hasLoaded) return
  hasLoaded = true
  ensureDataFile()

  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8")
    const parsed = JSON.parse(raw) as OrderRecord[]
    parsed.forEach((order) => orders.set(order.orderReference, order))
  } catch (error) {
    console.warn("[Orders] Failed to load orders.json, starting fresh.", error)
  }
}

function persistOrders() {
  ensureDataFile()
  const data = JSON.stringify(Array.from(orders.values()), null, 2)
  fs.writeFileSync(DATA_FILE, data, "utf8")
}

export function createOrderRecord(params: {
  orderReference: string
  customer: CustomerInput
  items: { productId: string; quantity: number }[]
  productsSubtotal: number
}) {
  loadOrdersOnce()
  const shipping = computeShippingMode(params.productsSubtotal)
  const timestamp = new Date().toISOString()
  const totalDueNow = params.productsSubtotal + (shipping.shippingCost ?? 0)

  const order: OrderRecord = {
    orderReference: params.orderReference,
    customer: params.customer,
    items: params.items,
    productsSubtotal: params.productsSubtotal,
    shippingCost: shipping.shippingCost,
    shippingMode: shipping.shippingMode,
    shippingNote: shipping.shippingNote,
    totalDueNow,
    status: "pending_payment",
    createdAt: timestamp,
    updatedAt: timestamp,
  }

  orders.set(order.orderReference, order)
  persistOrders()
  return order
}

export function getOrderRecord(orderReference: string) {
  loadOrdersOnce()
  return orders.get(orderReference)
}

export function updateOrderStatus(params: {
  orderReference: string
  status: "paid" | "failed"
  transactionId?: string
  paidAt?: string
}) {
  loadOrdersOnce()
  const order = orders.get(params.orderReference)
  if (!order) return null

  const updated: OrderRecord = {
    ...order,
    status: params.status,
    transactionId: params.transactionId ?? order.transactionId,
    paidAt: params.paidAt ?? order.paidAt,
    updatedAt: new Date().toISOString(),
  }

  orders.set(order.orderReference, updated)
  persistOrders()
  return updated
}

export function isTransactionProcessed(transactionId?: string) {
  if (!transactionId) return false
  loadOrdersOnce()
  for (const order of orders.values()) {
    if (order.transactionId === transactionId) return true
  }
  return false
}

export function markTransactionProcessed(transactionId?: string) {
  if (!transactionId) return
  loadOrdersOnce()
  const order = Array.from(orders.values()).find((entry) => entry.transactionId === transactionId)
  if (!order) return
  orders.set(order.orderReference, order)
  persistOrders()
}

export function listOrders() {
  loadOrdersOnce()
  return Array.from(orders.values())
}

export function setOrderCrmError(orderReference: string, crmError: string) {
  loadOrdersOnce()
  const order = orders.get(orderReference)
  if (!order) return null

  const updated: OrderRecord = {
    ...order,
    crmError,
    updatedAt: new Date().toISOString(),
  }

  orders.set(order.orderReference, updated)
  persistOrders()
  return updated
}
