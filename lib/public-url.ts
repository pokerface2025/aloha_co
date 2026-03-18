import "server-only"

export function getPublicBaseUrl(request?: Request) {
  const preferred = process.env.WEBHOOK_BASE_URL?.trim()
  if (preferred) return preferred

  const appBase = process.env.APP_BASE_URL?.trim()
  if (appBase) return appBase

  if (!request) return ""

  const origin = request.headers.get("origin")
  if (origin) return origin

  const host = request.headers.get("host")
  if (!host) return ""

  const protocol = host.startsWith("localhost") ? "http" : "https"
  return `${protocol}://${host}`
}
