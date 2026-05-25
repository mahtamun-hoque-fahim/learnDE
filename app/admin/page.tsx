'use client'

import { DashboardLayout, type NavItem } from '@/app/components/dashboard/DashboardLayout'
import { Greeting } from '@/app/components/dashboard/Greeting'
import { StatsRow } from '@/app/components/dashboard/StatsRow'
import { Card, CardHeader } from '@/app/components/dashboard/Cards'
import { UserEditModal, type User } from '@/app/components/dashboard/UserEditModal'
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
import toast from 'react-hot-toast'

interface AdminData {
  stats: {
    totalUsers: number
    students: number
    staff: number
    admins: number
    activeThisWeek: number
    completionRate: number
    deltas: {
      totalUsers: number
      activeThisWeek: number
      staff: number
      completionRate: number
    }
  }
  users: User[]
}

function formatDelta(n: number, suffix = ''): { value: string; positive: boolean } {
  if (n === 0) return { value: 'No change', positive: true }
  const sign = n > 0 ? '+' : ''
  return { value: `${sign}${n}${suffix}`, positive: n >= 0 }
}

export default function AdminDashboard() {
  const { role, name, isLoading, isSignedIn } = useAuth()
  const router = useRouter()
  const [data, setData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && (!isSignedIn || role !== 'admin')) {
      router.push('/login')
    }
  }, [isLoading, isSignedIn, role, router])

  useEffect(() => {
    if (isSignedIn && role === 'admin') {
      fetchUsers()
    }
  }, [isSignedIn, role])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/users')
      
      if (!res.ok) {
        throw new Error('Failed to fetch users')
      }
      
      const usersData = await res.json()
      setData(usersData)
    } catch (error) {
      console.error('Users fetch error:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = (user: User) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const handleSaveUser = async (
    userId: string,
    updates: { role?: 'student' | 'staff' | 'admin'; active?: boolean }
  ) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...updates }),
      })

      if (!res.ok) {
        throw new Error('Failed to update user')
      }

      // Refresh users list
      await fetchUsers()
      
      toast.success('User updated successfully')
    } catch (error) {
      console.error('User update error:', error)
      toast.error('Failed to update user')
      throw error
    }
  }

  if (isLoading || role !== 'admin') {
    return null
  }

  if (loading || !data) {
    return (
      <DashboardLayout
        title="Admin Dashboard"
        subtitle="Platform Management"
        navItems={[]}
        role="admin"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-[#8A938E]">Loading dashboard...</div>
        </div>
      </DashboardLayout>
    )
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
    },
  ]

  const stats = [
    {
      label: 'Total Users',
      value: String(data.stats.totalUsers),
      color: 'mint' as const,
      delta: formatDelta(data.stats.deltas.totalUsers),
    },
    {
      label: 'Active This Week',
      value: String(data.stats.activeThisWeek),
      color: 'blue' as const,
      delta: formatDelta(data.stats.deltas.activeThisWeek),
    },
    {
      label: 'Staff Members',
      value: String(data.stats.staff),
      color: 'amber' as const,
      delta: formatDelta(data.stats.deltas.staff),
    },
    {
      label: 'Completion Rate',
      value: String(data.stats.completionRate),
      unit: '%',
      color: 'rose' as const,
      delta: formatDelta(data.stats.deltas.completionRate, '%'),
    },
  ]

  return (
    <>
      <DashboardLayout
        title="Admin Dashboard"
        subtitle="Platform Management"
        navItems={navItems}
        role="admin"
      >
        <Greeting 
          name={name || 'Admin'} 
          subtitle="Manage users and platform settings" 
        />

        <StatsRow stats={stats} />

        {/* User Management */}
        <Card>
          <CardHeader
            title="User Management"
            subtitle={`${data.stats.totalUsers} total users`}
            action={
              <button className="text-[#3DF49A] text-[12.5px] font-semibold hover:text-[#5BFBA8]">
                Add User +
              </button>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1F2421]">
                  <th className="text-left px-3 py-2 text-[11px] font-semibold text-[#8A938E] uppercase tracking-wide">
                    User
                  </th>
                  <th className="text-left px-3 py-2 text-[11px] font-semibold text-[#8A938E] uppercase tracking-wide">
                    Email
                  </th>
                  <th className="text-left px-3 py-2 text-[11px] font-semibold text-[#8A938E] uppercase tracking-wide">
                    Role
                  </th>
                  <th className="text-left px-3 py-2 text-[11px] font-semibold text-[#8A938E] uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-right px-3 py-2 text-[11px] font-semibold text-[#8A938E] uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.users.slice(0, 10).map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-[#1F2421] last:border-0 hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                  >
                    <td className="px-3 py-2.5">
                      <div className="text-[12.5px] font-semibold">
                        {user.name || 'Unnamed User'}
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="text-[12px] text-[#8A938E]">{user.email}</div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          user.role === 'admin'
                            ? 'bg-[rgba(242,107,107,0.12)] text-[#F26B6B]'
                            : user.role === 'staff'
                            ? 'bg-[rgba(96,168,250,0.12)] text-[#60A8FA]'
                            : 'bg-[rgba(61,244,154,0.12)] text-[#3DF49A]'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          user.active
                            ? 'bg-[rgba(61,244,154,0.12)] text-[#3DF49A]'
                            : 'bg-[rgba(255,255,255,0.05)] text-[#8A938E]'
                        }`}
                      >
                        {user.active ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <button
                        onClick={() => handleEditClick(user)}
                        className="px-2.5 py-1 bg-[rgba(255,255,255,0.05)] text-[#F3F6F4] rounded-lg font-semibold text-[11px] hover:bg-[rgba(255,255,255,0.08)] transition-colors"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data.users.length > 10 && (
            <div className="px-3 py-2.5 border-t border-[#1F2421] text-center">
              <button className="text-[#3DF49A] text-[12px] font-semibold hover:text-[#5BFBA8]">
                View all {data.users.length} users →
              </button>
            </div>
          )}
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 mt-3.5">
          <Card>
            <CardHeader title="Students" />
            <div className="text-3xl font-bold text-[#3DF49A]">
              {data.stats.students}
            </div>
            <div className="text-[11px] text-[#8A938E] mt-1">
              {data.stats.totalUsers > 0 ? Math.round((data.stats.students / data.stats.totalUsers) * 100) : 0}% of total
            </div>
          </Card>

          <Card>
            <CardHeader title="Staff Members" />
            <div className="text-3xl font-bold text-[#60A8FA]">
              {data.stats.staff}
            </div>
            <div className="text-[11px] text-[#8A938E] mt-1">
              {data.stats.totalUsers > 0 ? Math.round((data.stats.staff / data.stats.totalUsers) * 100) : 0}% of total
            </div>
          </Card>

          <Card>
            <CardHeader title="Admins" />
            <div className="text-3xl font-bold text-[#F26B6B]">
              {data.stats.admins}
            </div>
            <div className="text-[11px] text-[#8A938E] mt-1">
              {data.stats.totalUsers > 0 ? Math.round((data.stats.admins / data.stats.totalUsers) * 100) : 0}% of total
            </div>
          </Card>
        </div>
      </DashboardLayout>

      {/* User Edit Modal */}
      <UserEditModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedUser(null)
        }}
        user={selectedUser}
        onSave={handleSaveUser}
      />
    </>
  )
}
