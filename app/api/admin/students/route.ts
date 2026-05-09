import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'
import { getDb } from '@/lib/db'
import { users, studentProfiles, quizAttempts, progress, certificates } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  const admin = await getAdminSession()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  if (!db) return NextResponse.json({ students: [] })

  const allUsers = await db.select().from(users)
  const allProfiles = await db.select().from(studentProfiles)
  const allProgress = await db.select().from(progress)
  const allAttempts = await db.select().from(quizAttempts)
  const allCerts = await db.select().from(certificates)

  const students = allUsers.map(u => {
    const profile = allProfiles.find(p => p.userId === u.id) ?? null
    const userProgress = allProgress.filter(p => p.userId === u.id && p.completed)
    const userAttempts = allAttempts.filter(a => a.userId === u.id && a.passed)
    const cert = allCerts.find(c => c.userId === u.id) ?? null
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      studentId: u.studentId,
      createdAt: u.createdAt,
      profile,
      chaptersRead: userProgress.length,
      quizzesPassed: userAttempts.length,
      hasCertificate: !!cert,
      certificateId: cert?.certificateId ?? null,
    }
  })

  return NextResponse.json({ students })
}
