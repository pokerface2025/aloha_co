import path from 'node:path'
import { PrismaClient } from '@prisma/client'

declare global {
  var __prisma__: PrismaClient | undefined
}

function resolveDatabaseUrl() {
  const rawUrl = process.env.DATABASE_URL || 'file:./dev.db'

  if (rawUrl.startsWith('file:./')) {
    const relativePath = rawUrl.slice('file:./'.length)
    return `file:${path.resolve(process.cwd(), 'prisma', relativePath)}`
  }

  return rawUrl
}

const datasourceUrl = resolveDatabaseUrl()

export const db =
  global.__prisma__ ??
  new PrismaClient({
    ...(datasourceUrl
      ? {
          datasources: {
            db: {
              url: datasourceUrl,
            },
          },
        }
      : {}),
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  global.__prisma__ = db
}
