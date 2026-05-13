'use client'

import { DashboardLayout, type NavItem } from '@/app/components/dashboard/DashboardLayout'
import { Greeting } from '@/app/components/dashboard/Greeting'
import { StatsRow } from '@/app/components/dashboard/StatsRow'
import { Card, CardHeader } from '@/app/components/dashboard/Cards'
import {
  IconHome,
  IconUsers,
  IconStaff,
  IconBook,
  IconAnalytics,
  IconSettings,
} from '@/app/components/dashboard/Icons'
import { useAuth } from '@/lib/auth-utils'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const { role, name, isLoading, isSignedIn } = useAuth()
  const router = useRouter()
  const [toggles, setToggles] = useState({
    registration: true,
    logging: true,
    autoCerts: true,
    maintenance: false,
  })

  useEffect(() => {
    if (!isLoading && (!isSignedIn || role !== 'admin')) {
      router.push('/auth/sign-in')
    }
  }, [isLoading, isSignedIn, role, router])

  if (isLoading || role !== 'admin') {
    return null
  }

  const navItems: NavItem[] = [
    {
      label: 'Overview',
      href: '/admin',
      icon: <IconHome />,
      active: true,
    },
    {
      label: 'Users',
      href: '/admin?tab=users',
      icon: <IconUsers />,
    },
    {
      label: 'Staff',
      href: '/admin?tab=staff',
      icon: <IconStaff />,
    },
    {
      label: 'Courses',
      href: '/admin?tab=courses',
      icon: <IconBook />,
    },
    {
      label: 'Analytics',
      href: '/admin?tab=analytics',
      icon: <IconAnalytics />,
    },
    {
      label: 'Settings',
      href: '/admin?tab=settings',
      icon: <IconSettings />,
      badge: '3',
      badgeColor: 'red',
    },
  ]

  const stats = [
    {
      label: 'Total Users',
      value: '245',
      color: 'mint' as const,
      delta: { value: '+12', positive: true },
    },
    {
      label: 'Active This Week',
      value: '67',
      color: 'blue' as const,
      delta: { value: '27%', positive: true },
    },
    {
      label: 'Staff Members',
      value: '8',
      color: 'amber' as const,
      delta: { value: '+1', positive: true },
    },
    {
      label: 'Completion Rate',
      value: '62',
      unit: '%',
      color: 'rose' as const,
      delta: { value: '+3%', positive: true },
    },
  ]

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <DashboardLayout
      title="Admin Dashboard"
      subtitle="LearnDE Platform"
      navItems={navItems}
      role="admin"
    >
      {/* Greeting */}
      <Greeting 
        name={name || 'Administrator'} 
        subtitle="Platform health: All systems operational" 
      />

      {/* Stats */}
      <StatsRow stats={stats} />

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Users Table */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Recent Users"
              action={<a href="/admin?tab=users" className="text-[#3DF49A]">View all →</a>}
            />
            <div className="space-y-2">
              {[
                { id: 1, name: 'Ananya Sharma', email: 'ananya@example.com', role: 'Student', status: 'Active' },
                { id: 2, name: 'Dr. Rohit Das', email: 'rohit@example.com', role: 'Faculty', status: 'Active' },
                { id: 3, name: 'Priya Kapoor', email: 'priya@example.com', role: 'Student', status: 'Active' },
                { id: 4, name: 'Admin User', email: 'admin@example.com', role: 'Administrator', status: 'Active' },
                { id: 5, name: 'Raj Patel', email: 'raj@example.com', role: 'Student', status: 'Inactive' },
              ].map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between px-3 py-2.25 border-b border-[#1F2421] last:border-0 hover:bg-[rgba(255,255,255,0.02)] transition-colors cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px] font-semibold">{user.name}</div>
                    <div className="text-[11px] text-[#8A938E]">{user.email}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        user.role === 'Administrator'
                          ? 'bg-[rgba(245,168,92,0.1)] text-[#F5A85C]'
                          : user.role === 'Faculty'
                            ? 'bg-[rgba(96,168,250,0.1)] text-[#60A8FA]'
                            : 'bg-[rgba(61,244,154,0.1)] text-[#3DF49A]'
                      }`}
                    >
                      {user.role}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        user.status === 'Active'
                          ? 'bg-[rgba(61,244,154,0.1)] text-[#3DF49A]'
                          : 'bg-[rgba(74,84,80,0.4)] text-[#8A938E]'
                      }`}
                    >
                      {user.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="space-y-3.5">
          <Card>
            <CardHeader title="Platform Health" />
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[11px] text-[#8A938E]">Database</span>
                  <span className="text-[11px] font-semibold text-[#3DF49A]">98%</span>
                </div>
                <div className="h-2 bg-[#1F2421] rounded-full overflow-hidden">
                  <div className="h-full w-[98%] bg-[#3DF49A] rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[11px] text-[#8A938E]">API Response</span>
                  <span className="text-[11px] font-semibold text-[#60A8FA]">142ms</span>
                </div>
                <div className="h-2 bg-[#1F2421] rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-[#60A8FA] rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[11px] text-[#8A938E]">Email Delivery</span>
                  <span className="text-[11px] font-semibold text-[#F5A85C]">94%</span>
                </div>
                <div className="h-2 bg-[#1F2421] rounded-full overflow-hidden">
                  <div className="h-full w-[94%] bg-[#F5A85C] rounded-full" />
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Actions" />
            <div className="space-y-2">
              <button className="w-full py-2 text-[12px] font-semibold text-[#3DF49A] hover:text-[#5BFBA8] transition-colors rounded-lg hover:bg-[rgba(61,244,154,0.08)]">
                Generate Report
              </button>
              <button className="w-full py-2 text-[12px] font-semibold text-[#60A8FA] hover:text-[#7FB3FF] transition-colors rounded-lg hover:bg-[rgba(96,168,250,0.08)]">
                Backup Database
              </button>
              <button className="w-full py-2 text-[12px] font-semibold text-[#F5A85C] hover:text-[#FCBB6F] transition-colors rounded-lg hover:bg-[rgba(245,168,92,0.08)]">
                Send Test Email
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* System Settings */}
      <Card className="mt-3.5">
        <CardHeader title="System Settings" />
        <div className="space-y-3">
          {[
            { id: 'registration', label: 'Open registration', desc: 'Allow new student sign-ups' },
            { id: 'logging', label: 'Activity logging', desc: 'Track all user actions' },
            { id: 'autoCerts', label: 'Auto-issue certificates', desc: 'On 100% course completion' },
            { id: 'maintenance', label: 'Maintenance mode', desc: 'Suspend public access' },
          ].map((setting) => (
            <div key={setting.id} className="flex items-center justify-between py-3 border-b border-[#1F2421] last:border-0">
              <div>
                <div className="text-[12px] font-semibold">{setting.label}</div>
                <div className="text-[11px] text-[#8A938E]">{setting.desc}</div>
              </div>
              <button
                onClick={() => handleToggle(setting.id as keyof typeof toggles)}
                className={`relative w-11 h-6 rounded-full transition-all ${
                  toggles[setting.id as keyof typeof toggles]
                    ? 'bg-[#3DF49A]'
                    : 'bg-[#2A312D]'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${
                    toggles[setting.id as keyof typeof toggles]
                      ? 'translate-x-5'
                      : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>
    </DashboardLayout>
  )
}
