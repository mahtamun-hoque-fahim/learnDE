'use client'

import { DashboardLayout, type NavItem } from '@/app/components/dashboard/DashboardLayout'
import { ComingSoon } from '@/app/components/dashboard/ComingSoon'
import { getStudentNavItems } from '@/lib/nav-items'
import { useAuth } from '@/lib/auth-utils'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProgressPage() {
  const { isLoading, isSignedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isSignedIn) router.push('/login')
  }, [isLoading, isSignedIn, router])

  const navItems: NavItem[] = getStudentNavItems()

  return (
    <DashboardLayout
      title="Progress"
      subtitle="Your learning timeline"
      navItems={navItems}
      role="student"
    >
      <ComingSoon featureName="Detailed Progress" description="A timeline view of chapter reads and quiz attempts is in the works. For now, check the main dashboard." />
    </DashboardLayout>
  )
}
