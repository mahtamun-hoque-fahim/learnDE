'use client'

import { DashboardLayout, type NavItem } from '@/app/components/dashboard/DashboardLayout'
import { Card, CardHeader } from '@/app/components/dashboard/Cards'
import { UserEditModal, type User } from '@/app/components/dashboard/UserEditModal'
import { getAdminNavItems } from '@/lib/nav-items'
import { useAuth } from '@/lib/auth-utils'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useMemo } from 'react'
import toast from 'react-hot-toast'

interface UserRow extends User {
  lastActiveAt?: string | null
}

interface ApiResponse {
  stats: {
    totalUsers: number
    students: number
    staff: number
    admins: number
    activeThisWeek: number
  }
  users: UserRow[]
}

function timeAgo(iso: string | null | undefined): string {
  if (!iso) return 'Never'
  const ms = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(ms / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hr ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`
  const months = Math.floor(days / 30)
  return `${months} month${months === 1 ? '' : 's'} ago`
}

export default function AdminUsersPage() {
  const { role, isLoading, isSignedIn } = useAuth()
  const router = useRouter()

  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'staff' | 'admin'>('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (isLoading) return
    if (!isSignedIn) { router.push('/login'); return }
    if (role !== 'admin') router.push('/dashboard')
  }, [isLoading, isSignedIn, role, router])

  useEffect(() => {
    if (isSignedIn && role === 'admin') void fetchUsers()
  }, [isSignedIn, role])

  async function fetchUsers() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users')
      if (!res.ok) throw new Error('Failed to fetch users')
      const json: ApiResponse = await res.json()
      setData(json)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveUser(userId: string, updates: { role?: 'student' | 'staff' | 'admin' }) {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...updates }),
      })
      const payload = await res.json()
      if (!res.ok) throw new Error(payload.error || 'Update failed')
      toast.success('User updated')
      setIsModalOpen(false)
      setSelectedUser(null)
      await fetchUsers()
    } catch (err: any) {
      toast.error(err?.message || 'Update failed')
    }
  }

  const filteredUsers = useMemo(() => {
    if (!data) return []
    return data.users.filter(u => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false
      if (!search) return true
      const q = search.toLowerCase()
      return (
        u.name?.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
      )
    })
  }, [data, search, roleFilter])

  const navItems: NavItem[] = getAdminNavItems()

  if (loading || !data) {
    return (
      <DashboardLayout title="Users" subtitle="Platform Management" navItems={navItems} role="admin">
        <div className="flex items-center justify-center min-h-[40vh] text-[#8A938E] text-[12.5px]">
          Loading users…
        </div>
      </DashboardLayout>
    )
  }

  return (
    <>
      <DashboardLayout title="Users" subtitle="Platform Management" navItems={navItems} role="admin">
        {/* Filters */}
        <Card className="mb-5">
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, or role…"
              className="flex-1 min-w-[200px] bg-[#070807] border border-[#2A312D] rounded-lg px-3 py-2 text-[12.5px] text-[#F3F6F4] placeholder:text-[#4A5450] focus:outline-none focus:border-[#3DF49A]"
            />
            <div className="flex gap-1 bg-[#070807] border border-[#2A312D] rounded-lg p-1">
              {(['all', 'student', 'staff', 'admin'] as const).map(r => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`px-3 py-1.5 text-[11.5px] rounded-md transition-all capitalize ${
                    roleFilter === r
                      ? 'bg-[rgba(61,244,154,0.11)] text-[#3DF49A] font-semibold'
                      : 'text-[#8A938E] hover:text-[#F3F6F4]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* User table */}
        <Card>
          <CardHeader
            title={`All Users (${filteredUsers.length})`}
            subtitle={`${data.stats.totalUsers} total · ${data.stats.activeThisWeek} active this week`}
          />
          {filteredUsers.length === 0 ? (
            <div className="text-[12.5px] text-[#8A938E] py-6 text-center">
              No users match your filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[12.5px]">
                <thead>
                  <tr className="text-[10.5px] text-[#8A938E] uppercase tracking-[0.08em] border-b border-[#1F2421]">
                    <th className="text-left font-medium px-2 py-2.5">User</th>
                    <th className="text-left font-medium px-2 py-2.5">Email</th>
                    <th className="text-left font-medium px-2 py-2.5">Role</th>
                    <th className="text-left font-medium px-2 py-2.5">Last Active</th>
                    <th className="text-left font-medium px-2 py-2.5">Status</th>
                    <th className="text-right font-medium px-2 py-2.5">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="border-b border-[#1F2421] last:border-0">
                      <td className="px-2 py-3 font-semibold">{u.name || '—'}</td>
                      <td className="px-2 py-3 text-[#8A938E]">{u.email}</td>
                      <td className="px-2 py-3">
                        <span
                          className={`text-[10.5px] px-2 py-0.5 rounded-md font-semibold capitalize ${
                            u.role === 'admin'
                              ? 'bg-[rgba(242,107,107,0.1)] text-[#F26B6B]'
                              : u.role === 'staff'
                                ? 'bg-[rgba(245,168,92,0.1)] text-[#F5A85C]'
                                : 'bg-[rgba(61,244,154,0.11)] text-[#3DF49A]'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-2 py-3 text-[#8A938E]">{timeAgo(u.lastActiveAt)}</td>
                      <td className="px-2 py-3">
                        <span
                          className={`text-[10.5px] px-2 py-0.5 rounded-md font-semibold ${
                            u.active
                              ? 'bg-[rgba(61,244,154,0.11)] text-[#3DF49A]'
                              : 'bg-[rgba(138,147,142,0.1)] text-[#8A938E]'
                          }`}
                        >
                          {u.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-2 py-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedUser(u)
                            setIsModalOpen(true)
                          }}
                          className="text-[11.5px] font-semibold text-[#3DF49A] hover:text-[#5BFBA8] transition-colors"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </DashboardLayout>

      <UserEditModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedUser(null) }}
        user={selectedUser}
        onSave={handleSaveUser}
      />
    </>
  )
}
