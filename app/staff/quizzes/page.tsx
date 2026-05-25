'use client'

import { DashboardLayout, type NavItem } from '@/app/components/dashboard/DashboardLayout'
import { ComingSoon } from '@/app/components/dashboard/ComingSoon'
import { getStaffNavItems } from '@/lib/nav-items'
import { useAuth } from '@/lib/auth-utils'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Page() {
  const { role, isLoading, isSignedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return
    if (!isSignedIn) { router.push('/login'); return }
    if (role !== 'staff' && role !== 'admin') router.push('/dashboard')
  }, [isLoading, isSignedIn, role, router])

  const navItems: NavItem[] = getStaffNavItems()

  return (
    <DashboardLayout
      title="Quizzes"
      subtitle="Faculty Console"
      navItems={navItems}
      role="staff"
    >
      <ComingSoon featureName="Quiz Authoring" />
    </DashboardLayout>
  )
}
