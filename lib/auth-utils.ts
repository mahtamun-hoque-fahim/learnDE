'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export type UserRole = 'student' | 'staff' | 'admin'

export interface AuthSession {
  user: {
    id: string
    name: string | null
    email: string
    emailVerified: boolean
    image: string | null
    role: UserRole
    createdAt: Date
  }
  expiresAt: Date
}

/**
 * Custom hook to get current user session
 * Uses Better Auth session from HTTP-only cookies
 */
export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Fetch session from Better Auth
    const fetchSession = async () => {
      try {
        const response = await fetch('/api/auth/get-session')
        
        if (response.ok) {
          const data = await response.json()
          setSession(data.session)
          setIsSignedIn(true)
        } else {
          setSession(null)
          setIsSignedIn(false)
        }
      } catch (error) {
        console.error('Failed to fetch session:', error)
        setSession(null)
        setIsSignedIn(false)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSession()
  }, [])

  const user = session?.user
  const role = user?.role as UserRole | undefined
  const userId = user?.id
  const email = user?.email
  const name = user?.name || user?.email?.split('@')[0] || 'User'

  const isStudent = role === 'student'
  const isStaff = role === 'staff'
  const isAdmin = role === 'admin'

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setSession(null)
      setIsSignedIn(false)
      router.push('/auth/sign-in')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return {
    session,
    user,
    isLoading,
    isSignedIn,
    userId,
    email,
    name,
    role,
    isStudent,
    isStaff,
    isAdmin,
    logout,
  }
}

/**
 * Custom hook to check if user has permission for action
 */
export function useCanAccess() {
  const { role } = useAuth()

  const canAccessStudent = () => ['student', 'staff', 'admin'].includes(role || '')
  const canAccessStaff = () => ['staff', 'admin'].includes(role || '')
  const canAccessAdmin = () => role === 'admin'
  const hasRole = (requiredRole: UserRole | UserRole[]) => {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    return roles.includes(role || '')
  }

  return {
    canAccessStudent,
    canAccessStaff,
    canAccessAdmin,
    hasRole,
  }
}

/**
 * Get user display name with initials
 */
export function getUserInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Get avatar color class based on role
 */
export function getAvatarColor(role: UserRole | undefined): string {
  switch (role) {
    case 'student':
      return 'bg-[rgba(61,244,154,0.11)] text-[#3DF49A]'
    case 'staff':
      return 'bg-[rgba(96,168,250,0.11)] text-[#60A8FA]'
    case 'admin':
      return 'bg-[rgba(245,168,92,0.11)] text-[#F5A85C]'
    default:
      return 'bg-[#2A312D] text-[#8A938E]'
  }
}

/**
 * Get role display label
 */
export function getRoleLabel(role: UserRole | undefined): string {
  switch (role) {
    case 'student':
      return 'Student'
    case 'staff':
      return 'Faculty'
    case 'admin':
      return 'Administrator'
    default:
      return 'User'
  }
}

/**
 * Check if user has completed all requirements for certification
 */
export async function canUserCertify(userId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/student/can-certify?userId=${userId}`)
    if (response.ok) {
      const data = await response.json()
      return data.canCertify
    }
    return false
  } catch (error) {
    console.error('Error checking certification eligibility:', error)
    return false
  }
}
