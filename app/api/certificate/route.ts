import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { certificates, certSubmissions } from '@/lib/db/schema'
import { getSessionFromRequest } from '@/lib/auth'
import { eq } from 'drizzle-orm'

// Simple redirect: certificate data now comes from /api/submissions
// This route exists for backwards compatibility
export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ eligible: false, reason: 'Not signed in' })
  const db = getDb()
  if (!db) return NextResponse.json({ eligible: false })
  const [cert] = await db.select().from(certificates).where(eq(certificates.userId, session.id)).limit(1)
  const [sub] = await db.select().from(certSubmissions).where(eq(certSubmissions.userId, session.id)).limit(1)
  return NextResponse.json({ eligible: !!cert, certificate: cert ?? null, submission: sub ?? null })
}
