import "server-only"

type BoldEnvironment = "TEST" | "LIVE"

const ENV_VAR_MAP = {
  TEST: {
    identity: "BOLD_TEST_IDENTITY_KEY",
    secret: "BOLD_TEST_SECRET_KEY",
  },
  LIVE: {
    identity: "BOLD_LIVE_IDENTITY_KEY",
    secret: "BOLD_LIVE_SECRET_KEY",
  },
} as const

function assertServerOnly() {
  if (typeof window !== "undefined") {
    throw new Error(
      "Bold secret keys can only be accessed on the server. Do NOT import server Bold config in client components."
    )
  }
}

function normalizeEnv(rawEnv?: string): BoldEnvironment {
  const normalized = rawEnv?.toUpperCase().trim()
  if (normalized === "LIVE") return "LIVE"
  if (normalized === "TEST") return "TEST"

  if (normalized) {
    console.warn(
      `[Bold] Invalid BOLD_ENV value "${rawEnv}". Expected "TEST" or "LIVE". Defaulting to TEST.`
    )
  }

  return "TEST"
}

function warnMissingKeys(env: BoldEnvironment, missingVars: string[]) {
  if (missingVars.length === 0) return

  const lines = missingVars
    .map((name) => `- ${name}=PASTE_THE_${name}_VALUE_HERE`)
    .join("\n")

  console.warn(
    `[Bold] Missing ${env} keys.\nPaste the missing keys into .env.local:\n${lines}\n`
  )
}

export type BoldServerConfig = {
  env: BoldEnvironment
  identityKey: string
  secretKey: string
  isReady: boolean
}

export function getBoldServerConfig(): BoldServerConfig {
  assertServerOnly()

  const env = normalizeEnv(process.env.BOLD_ENV)
  const envVars = ENV_VAR_MAP[env]
  const identityKey = process.env[envVars.identity]?.trim() || ""
  const secretKey = process.env[envVars.secret]?.trim() || ""

  const missing: string[] = []
  if (!identityKey) missing.push(envVars.identity)
  if (!secretKey) missing.push(envVars.secret)

  warnMissingKeys(env, missing)

  return {
    env,
    identityKey,
    secretKey,
    isReady: missing.length === 0,
  }
}

export function getBoldPublicIdentityKey(): { env: BoldEnvironment; identityKey: string } {
  assertServerOnly()

  const env = normalizeEnv(process.env.BOLD_ENV)
  const envVars = ENV_VAR_MAP[env]
  const identityKey = process.env[envVars.identity]?.trim() || ""

  if (!identityKey) {
    warnMissingKeys(env, [envVars.identity])
  }

  return { env, identityKey }
}
