import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

// Create a single db instance that's reused
let dbInstance: ReturnType<typeof drizzle> | null = null

export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set')
  }
  
  if (!dbInstance) {
    const sql = neon(process.env.DATABASE_URL)
    dbInstance = drizzle(sql, { schema })
  }
  
  return dbInstance
}

// Export the db instance directly for Better Auth
export const db = getDb()

export * from './schema'
