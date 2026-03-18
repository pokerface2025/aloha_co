"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

type LatestOrdersResponse = {
  orders: {
    orderReference: string
    status: string
    productsSubtotal: number
    shippingMode: string
    updatedAt: string
    crmError?: string
  }[]
}

type BoldDiagnostics = {
  boldEnv: string
  boldApiBaseUrlPresent: boolean
  boldApiBaseUrl: string
  boldIdentityKeyPresent: boolean
  crmConfigured: boolean
  webhookBaseUrlPresent: boolean
  publicWebhookUrl: string
}

export function DiagnosticsPanel() {
  const [crmResult, setCrmResult] = useState<string>("")
  const [ordersResult, setOrdersResult] = useState<LatestOrdersResponse | null>(null)
  const [boldDiagnostics, setBoldDiagnostics] = useState<BoldDiagnostics | null>(null)
  const [error, setError] = useState<string>("")

  const loadBoldDiagnostics = async () => {
    try {
      const response = await fetch("/api/diagnostics/bold")
      const data = (await response.json()) as BoldDiagnostics
      if (!response.ok) {
        throw new Error("No se pudo cargar el diagnóstico de Bold.")
      }
      setBoldDiagnostics(data)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error inesperado"
      setError(msg)
    }
  }

  const handleTestCrm = async () => {
    setError("")
    setCrmResult("Probando CRM...")
    try {
      const response = await fetch("/api/crm/test", { method: "POST" })
      const data = await response.json()
      if (!response.ok || !data.ok) {
        throw new Error(data?.errorText || "CRM test failed")
      }
      setCrmResult("CRM OK ✅")
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error inesperado"
      setCrmResult("")
      setError(msg)
    }
  }

  const handleLatestOrders = async () => {
    setError("")
    setOrdersResult(null)
    try {
      const response = await fetch("/api/orders/latest")
      const data = (await response.json()) as LatestOrdersResponse
      if (!response.ok) {
        throw new Error(data as unknown as string)
      }
      setOrdersResult(data)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error inesperado"
      setError(msg)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-semibold">Diagnostics</h1>

      <div className="rounded-md border border-border p-4 text-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium">Bold diagnostics</span>
          <Button variant="outline" size="sm" onClick={loadBoldDiagnostics}>
            Refresh
          </Button>
        </div>
        {boldDiagnostics ? (
          <div className="space-y-1">
            <p>Bold mode: {boldDiagnostics.boldEnv}</p>
            <p>Bold API base configured: {boldDiagnostics.boldApiBaseUrlPresent ? "Yes" : "No"}</p>
            <p>Bold API base URL: {boldDiagnostics.boldApiBaseUrl}</p>
            <p>Bold identity key present: {boldDiagnostics.boldIdentityKeyPresent ? "Yes" : "No"}</p>
            <p>CRM configured: {boldDiagnostics.crmConfigured ? "Yes" : "No"}</p>
            <p>Webhook base URL present: {boldDiagnostics.webhookBaseUrlPresent ? "Yes" : "No"}</p>
            <p>
              Webhook URL to paste into Bold:{" "}
              {boldDiagnostics.publicWebhookUrl || "Set WEBHOOK_BASE_URL"}
            </p>
          </div>
        ) : (
          <p className="text-muted-foreground">Click Refresh to load diagnostics.</p>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={handleTestCrm}>Test CRM</Button>
        <Button variant="outline" onClick={handleLatestOrders}>
          Show latest 5 orders
        </Button>
      </div>

      {crmResult && (
        <div className="rounded-md border border-border p-4 text-sm">
          {crmResult}
        </div>
      )}

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {ordersResult && (
        <div className="rounded-md border border-border p-4 text-sm space-y-3">
          <p className="font-medium">Latest orders</p>
          {ordersResult.orders.length === 0 && <p>No orders yet.</p>}
          {ordersResult.orders.map((order) => (
            <div key={order.orderReference} className="border-t border-border pt-3">
              <p>
                <span className="font-medium">{order.orderReference}</span> —{" "}
                {order.status}
              </p>
              <p>Subtotal: {order.productsSubtotal} COP</p>
              <p>Shipping: {order.shippingMode}</p>
              <p>Updated: {order.updatedAt}</p>
              {order.crmError && (
                <p className="text-destructive">CRM error: {order.crmError}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
