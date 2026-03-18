import { NextResponse } from "next/server"

import { getBoldServerConfig } from "@/lib/bold/config"
import { getPublicBaseUrl } from "@/lib/public-url"

export async function GET() {
  const boldConfig = getBoldServerConfig()
  const hasCrmUrl = Boolean(process.env.CRM_WEBAPP_URL)
  const hasCrmToken = Boolean(process.env.CRM_WEBAPP_TOKEN)

  const baseUrl = getPublicBaseUrl()
  const webhookUrl = baseUrl ? `${baseUrl}/api/bold/webhook` : ""

  return NextResponse.json({
    boldEnv: boldConfig.env,
    boldKeysPresent: boldConfig.isReady,
    crmUrlPresent: hasCrmUrl,
    crmTokenPresent: hasCrmToken,
    webhookUrl,
  })
}
