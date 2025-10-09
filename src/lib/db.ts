import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient | undefined

export function getDb(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient()
    // In development, store on global to prevent hot-reload issues
    if (process.env.NODE_ENV !== 'production') {
      ;(globalThis as any).prisma = prisma
    }
  }
  return prisma
}