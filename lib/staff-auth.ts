import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { jwtVerify, SignJWT } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'learnde-secret-key-change-in-production')

export interface StaffSession {
  id: number
  username: string
  email: string
  displayName: string
  role: 'admin' | 'moderator'
}

export async function signStaffToken(payload: StaffSession) {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('8h')
    .sign(secret)
}

export async function getStaffSession(): Promise<StaffSession | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('staff-token')?.value
    if (!token) return null
    const { payload } = await jwtVerify(token, secret)
    return payload as unknown as StaffSession
  } catch { return null }
}

export async function getStaffSessionFromRequest(req: NextRequest): Promise<StaffSession | null> {
  try {
    const token = req.cookies.get('staff-token')?.value
    if (!token) return null
    const { payload } = await jwtVerify(token, secret)
    return payload as unknown as StaffSession
  } catch { return null }
}
