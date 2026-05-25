import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { certificates, certSubmissions } from '@/lib/db/schema'
import { getServerSession } from '@/lib/auth-server'
import { eq } from 'drizzle-orm'

// Lightweight read endpoint kept for backwards compat with the dashboard.
// Primary submission/cert data is served from /api/submissions.
export async function GET() {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ eligible: false, reason: 'Not signed in' })

  const db = getDb()
  if (!db) return NextResponse.json({ eligible: false })

  const userId = session.user.id
  const [cert] = await db.select().from(certificates).where(eq(certificates.userId, userId)).limit(1)
  const [sub] = await db.select().from(certSubmissions).where(eq(certSubmissions.userId, userId)).limit(1)
  return NextResponse.json({ eligible: !!cert, certificate: cert ?? null, submission: sub ?? null })
}
