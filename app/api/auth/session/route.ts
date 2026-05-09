import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete('auth-token')
  return res
}

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ user: null })
  return NextResponse.json({ user: session })
}
