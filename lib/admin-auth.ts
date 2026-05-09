import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

const ADMIN_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'learnde-admin-secret-2025')

export async function getAdminSession() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin-token')?.value
    if (!token) return null
    const { payload } = await jwtVerify(token, ADMIN_SECRET)
    if (payload.role !== 'admin') return null
    return payload as { id: number; username: string; role: string }
  } catch {
    return null
  }
}
