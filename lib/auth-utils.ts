import { useUser } from '@clerk/nextjs'
import { useCallback } from 'react'

export type UserRole = 'student' | 'staff' | 'admin'

/**
 * Custom hook to get current user with role
 */
export function useAuth() {
  const { user, isLoaded, isSignedIn } = useUser()

  const role = user?.publicMetadata?.role as UserRole | undefined
  const userId = user?.id
  const email = user?.primaryEmailAddress?.emailAddress
  const name = user?.fullName || user?.primaryEmailAddress?.emailAddress?.split('@')[0] || 'User'

  const isStudent = role === 'student'
  const isStaff = role === 'staff'
  const isAdmin = role === 'admin'

  return {
    user,
    isLoaded,
    isSignedIn,
    userId,
    email,
    name,
    role,
    isStudent,
    isStaff,
    isAdmin,
  }
}

/**
 * Custom hook to check if user has permission for action
 */
export function useCanAccess() {
  const { role } = useAuth()

  const canAccessStudent = useCallback(
    () => ['student', 'staff', 'admin'].includes(role || ''),
    [role]
  )

  const canAccessStaff = useCallback(
    () => ['staff', 'admin'].includes(role || ''),
    [role]
  )

  const canAccessAdmin = useCallback(
    () => role === 'admin',
    [role]
  )

  return {
    canAccessStudent,
    canAccessStaff,
    canAccessAdmin,
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
