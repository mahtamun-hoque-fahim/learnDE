'use client'

import { DashboardLayout, type NavItem } from '@/app/components/dashboard/DashboardLayout'
import { ComingSoon } from '@/app/components/dashboard/ComingSoon'
import { getAdminNavItems } from '@/lib/nav-items'
import { useAuth } from '@/lib/auth-utils'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Page() {
  const { role, isLoading, isSignedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return
    if (!isSignedIn) { router.push('/login'); return }
    if (role !== 'admin') router.push('/dashboard')
  }, [isLoading, isSignedIn, role, router])

  const navItems: NavItem[] = getAdminNavItems()

  return (
    <DashboardLayout
      title="Settings"
      subtitle="Platform Management"
      navItems={navItems}
      role="admin"
    >
      <ComingSoon featureName="Platform Settings" />
    </DashboardLayout>
  )
}
