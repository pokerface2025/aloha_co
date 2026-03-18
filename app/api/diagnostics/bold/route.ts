import { NextResponse } from "next/server"

import { getBoldServerConfig } from "@/lib/bold/config"
import { getPublicBaseUrl } from "@/lib/public-url"

export async function GET() {
  const boldConfig = getBoldServerConfig()
  const publicBaseUrl = getPublicBaseUrl()
  const apiBaseUrl = process.env.BOLD_API_BASE_URL?.trim() || "https://integrations.api.bold.co"

  return NextResponse.json({
    boldEnv: boldConfig.env,
    boldApiBaseUrlPresent: Boolean(process.env.BOLD_API_BASE_URL),
    boldApiBaseUrl: apiBaseUrl,
    boldIdentityKeyPresent: Boolean(boldConfig.identityKey),
    crmConfigured: Boolean(process.env.CRM_WEBAPP_URL && process.env.CRM_WEBAPP_TOKEN),
    webhookBaseUrlPresent: Boolean(process.env.WEBHOOK_BASE_URL || process.env.APP_BASE_URL),
    publicWebhookUrl: publicBaseUrl ? `${publicBaseUrl}/api/bold/webhook` : "",
  })
}
