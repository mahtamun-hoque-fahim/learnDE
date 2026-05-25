import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth-server'
import { auth } from '@/lib/auth-better'
import { getDb } from '@/lib/db'
import { users, staffProfiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

/**
 * GET /api/staff/moderators — admin-only listing of staff users.
 * POST /api/staff/moderators — admin-only creation of a new staff member
 *   via Better Auth sign-up + role promotion + staff_profiles row.
 */

async function requireAdmin() {
  const session = await getServerSession()
  if (!session || session.user.role !== 'admin') return null
  return session
}

export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Admin only' }, { status: 403 })

  const db = getDb()
  if (!db) return NextResponse.json({ moderators: [] })

  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      createdAt: users.createdAt,
      displayName: staffProfiles.displayName,
      department: staffProfiles.department,
      active: staffProfiles.active,
    })
    .from(users)
    .leftJoin(staffProfiles, eq(staffProfiles.userId, users.id))
    .where(eq(users.role, 'staff'))

  return NextResponse.json({ moderators: rows })
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Admin only' }, { status: 403 })

  const db = getDb()
  if (!db) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  const { email, password, name, displayName, department } = await req.json()
  if (!email || !password || !name || !displayName) {
    return NextResponse.json({ error: 'email, password, name, displayName required' }, { status: 400 })
  }

  // Create the user via Better Auth so the password hash is correct (scrypt).
  let newUserId: string
  try {
    const result = await auth.api.signUpEmail({
      body: { email, password, name },
      headers: req.headers,
    })
    newUserId = result.user.id
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Sign-up failed' }, { status: 409 })
  }

  // Promote to staff role + create staff_profiles row.
  await db.update(users).set({ role: 'staff' }).where(eq(users.id, newUserId))
  await db.insert(staffProfiles).values({
    id: crypto.randomUUID(),
    userId: newUserId,
    displayName,
    department: department || null,
    active: true,
  })

  return NextResponse.json({ ok: true, id: newUserId })
}
