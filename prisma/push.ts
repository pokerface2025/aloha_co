import path from 'node:path'
import { mkdir } from 'node:fs/promises'
import { PrismaClient } from '@prisma/client'

function resolveDatabaseUrl() {
  const rawUrl = process.env.DATABASE_URL || 'file:./dev.db'

  if (rawUrl.startsWith('file:./')) {
    const relativePath = rawUrl.slice('file:./'.length)
    return `file:${path.resolve(process.cwd(), 'prisma', relativePath)}`
  }

  return rawUrl
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: resolveDatabaseUrl(),
    },
  },
})

const statements = [
  'PRAGMA foreign_keys=ON',
  `CREATE TABLE IF NOT EXISTS "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "ProductVariant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "sku" TEXT NOT NULL UNIQUE,
    CONSTRAINT "ProductVariant_productId_fkey"
      FOREIGN KEY ("productId") REFERENCES "Product" ("id")
      ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS "ProductImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ProductImage_productId_fkey"
      FOREIGN KEY ("productId") REFERENCES "Product" ("id")
      ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  'CREATE INDEX IF NOT EXISTS "Product_active_createdAt_idx" ON "Product"("active", "createdAt")',
  'CREATE INDEX IF NOT EXISTS "ProductVariant_productId_idx" ON "ProductVariant"("productId")',
  'CREATE INDEX IF NOT EXISTS "ProductVariant_size_color_idx" ON "ProductVariant"("size", "color")',
  'CREATE INDEX IF NOT EXISTS "ProductImage_productId_sortOrder_idx" ON "ProductImage"("productId", "sortOrder")',
]

async function main() {
  await mkdir(path.resolve(process.cwd(), 'prisma'), { recursive: true })

  for (const statement of statements) {
    await prisma.$executeRawUnsafe(statement)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
    console.log('Prisma-compatible SQLite schema is ready.')
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
