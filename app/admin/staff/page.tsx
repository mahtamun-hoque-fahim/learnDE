'use client'

import { DashboardLayout, type NavItem } from '@/app/components/dashboard/DashboardLayout'
import { Card, CardHeader } from '@/app/components/dashboard/Cards'
import { Modal, ModalFooter, Button } from '@/app/components/dashboard/Modal'
import { getAdminNavItems } from '@/lib/nav-items'
import { useAuth } from '@/lib/auth-utils'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface ModeratorRow {
  id: string
  email: string
  name: string
  role: string
  createdAt: string
  displayName: string | null
  department: string | null
  active: boolean | null
}

export default function AdminStaffPage() {
  const { role, isLoading, isSignedIn } = useAuth()
  const router = useRouter()

  const [moderators, setModerators] = useState<ModeratorRow[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    displayName: '',
    department: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (isLoading) return
    if (!isSignedIn) { router.push('/login'); return }
    if (role !== 'admin') router.push('/dashboard')
  }, [isLoading, isSignedIn, role, router])

  useEffect(() => {
    if (isSignedIn && role === 'admin') void fetchModerators()
  }, [isSignedIn, role])

  async function fetchModerators() {
    setLoading(true)
    try {
      const res = await fetch('/api/staff/moderators')
      if (!res.ok) throw new Error('Failed to fetch staff')
      const json = await res.json()
      setModerators(json.moderators || [])
    } catch (err) {
      console.error(err)
      toast.error('Failed to load staff list')
    } finally {
      setLoading(false)
    }
  }

  async function handleAdd() {
    setFormError(null)
    if (!form.name || !form.email || !form.password || !form.displayName) {
      setFormError('Name, email, password, and display name are required.')
      return
    }
    if (form.password.length < 8) {
      setFormError('Password must be at least 8 characters.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/staff/moderators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const payload = await res.json()
      if (!res.ok) throw new Error(payload.error || 'Failed to create staff member')
      toast.success(`Added ${form.displayName} as staff`)
      setForm({ name: '', email: '', password: '', displayName: '', department: '' })
      setIsAddOpen(false)
      await fetchModerators()
    } catch (err: any) {
      setFormError(err?.message || 'Failed to add staff member')
    } finally {
      setSubmitting(false)
    }
  }

  const navItems: NavItem[] = getAdminNavItems()

  if (loading) {
    return (
      <DashboardLayout title="Staff" subtitle="Platform Management" navItems={navItems} role="admin">
        <div className="flex items-center justify-center min-h-[40vh] text-[#8A938E] text-[12.5px]">
          Loading staff…
        </div>
      </DashboardLayout>
    )
  }

  const inputCls =
    'w-full bg-[#070807] border border-[#2A312D] rounded-lg px-3 py-2 text-[12.5px] text-[#F3F6F4] placeholder:text-[#4A5450] focus:outline-none focus:border-[#3DF49A]'

  return (
    <>
      <DashboardLayout title="Staff" subtitle="Platform Management" navItems={navItems} role="admin">
        <Card>
          <CardHeader
            title={`Staff Members (${moderators.length})`}
            subtitle="Faculty with access to the staff console"
            action={
              <button
                onClick={() => setIsAddOpen(true)}
                className="text-[#3DF49A] hover:text-[#5BFBA8] font-semibold"
              >
                Add Staff +
              </button>
            }
          />
          {moderators.length === 0 ? (
            <div className="text-[12.5px] text-[#8A938E] py-8 text-center">
              No staff members yet. Click <span className="text-[#3DF49A]">Add Staff</span> to create one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[12.5px]">
                <thead>
                  <tr className="text-[10.5px] text-[#8A938E] uppercase tracking-[0.08em] border-b border-[#1F2421]">
                    <th className="text-left font-medium px-2 py-2.5">Display Name</th>
                    <th className="text-left font-medium px-2 py-2.5">Email</th>
                    <th className="text-left font-medium px-2 py-2.5">Department</th>
                    <th className="text-left font-medium px-2 py-2.5">Joined</th>
                    <th className="text-left font-medium px-2 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {moderators.map(m => (
                    <tr key={m.id} className="border-b border-[#1F2421] last:border-0">
                      <td className="px-2 py-3 font-semibold">
                        {m.displayName || m.name || '—'}
                      </td>
                      <td className="px-2 py-3 text-[#8A938E]">{m.email}</td>
                      <td className="px-2 py-3 text-[#8A938E]">{m.department || '—'}</td>
                      <td className="px-2 py-3 text-[#8A938E]">
                        {new Date(m.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-2 py-3">
                        <span
                          className={`text-[10.5px] px-2 py-0.5 rounded-md font-semibold ${
                            m.active === false
                              ? 'bg-[rgba(138,147,142,0.1)] text-[#8A938E]'
                              : 'bg-[rgba(61,244,154,0.11)] text-[#3DF49A]'
                          }`}
                        >
                          {m.active === false ? 'Inactive' : 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </DashboardLayout>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Staff Member">
        <div className="space-y-3.5">
          <div>
            <label className="block text-[11px] text-[#8A938E] mb-1.5">Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Dr. Jane Doe"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-[11px] text-[#8A938E] mb-1.5">Display Name</label>
            <input
              type="text"
              value={form.displayName}
              onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))}
              placeholder="Visible to students"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-[11px] text-[#8A938E] mb-1.5">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="jane@learnde.dev"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-[11px] text-[#8A938E] mb-1.5">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="8+ characters"
              className={inputCls}
            />
            <p className="text-[10.5px] text-[#4A5450] mt-1">
              The staff member will sign in with this email and password. They can change it later.
            </p>
          </div>
          <div>
            <label className="block text-[11px] text-[#8A938E] mb-1.5">Department (optional)</label>
            <input
              type="text"
              value={form.department}
              onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
              placeholder="Mathematics"
              className={inputCls}
            />
          </div>
          {formError && <p className="text-[12px] text-[#F26B6B]">{formError}</p>}
        </div>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setIsAddOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAdd} disabled={submitting}>
            {submitting ? 'Adding…' : 'Add Staff'}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}
