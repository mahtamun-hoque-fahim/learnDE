'use client'

import { DashboardLayout, type NavItem } from '@/app/components/dashboard/DashboardLayout'
import { Card, CardHeader } from '@/app/components/dashboard/Cards'
import { Modal, ModalFooter, Button } from '@/app/components/dashboard/Modal'
import { getStaffNavItems } from '@/lib/nav-items'
import { useAuth } from '@/lib/auth-utils'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface AnnouncementRow {
  id: number
  title: string
  content: string
  targetRole: 'all' | 'student' | 'staff' | null
  publishedAt: string | null
  createdAt: string
  createdBy: string
  authorName: string | null
  authorEmail: string | null
}

function timeAgo(iso: string | null): string {
  if (!iso) return ''
  const ms = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(ms / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hr ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`
  return new Date(iso).toLocaleDateString()
}

export default function StaffAnnouncementsPage() {
  const { role, isLoading, isSignedIn, userId } = useAuth()
  const router = useRouter()

  const [items, setItems] = useState<AnnouncementRow[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [form, setForm] = useState<{ title: string; content: string; targetRole: 'all' | 'student' | 'staff' }>({
    title: '',
    content: '',
    targetRole: 'all',
  })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (isLoading) return
    if (!isSignedIn) { router.push('/login'); return }
    if (role !== 'staff' && role !== 'admin') router.push('/dashboard')
  }, [isLoading, isSignedIn, role, router])

  useEffect(() => {
    if (isSignedIn && (role === 'staff' || role === 'admin')) void fetchAnnouncements()
  }, [isSignedIn, role])

  async function fetchAnnouncements() {
    setLoading(true)
    try {
      const res = await fetch('/api/announcements')
      if (!res.ok) throw new Error('Failed to fetch announcements')
      const json = await res.json()
      setItems(json.announcements || [])
    } catch (err) {
      console.error(err)
      toast.error('Failed to load announcements')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate() {
    setFormError(null)
    if (!form.title.trim()) { setFormError('Title is required.'); return }
    if (!form.content.trim()) { setFormError('Content is required.'); return }

    setSubmitting(true)
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const payload = await res.json()
      if (!res.ok) throw new Error(payload.error || 'Failed to create announcement')
      toast.success('Announcement published')
      setForm({ title: '', content: '', targetRole: 'all' })
      setIsCreateOpen(false)
      await fetchAnnouncements()
    } catch (err: any) {
      setFormError(err?.message || 'Failed to create announcement')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this announcement? This cannot be undone.')) return
    try {
      const res = await fetch(`/api/announcements?id=${id}`, { method: 'DELETE' })
      const payload = await res.json()
      if (!res.ok) throw new Error(payload.error || 'Failed to delete')
      toast.success('Announcement deleted')
      await fetchAnnouncements()
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete')
    }
  }

  const navItems: NavItem[] = getStaffNavItems()
  const inputCls =
    'w-full bg-[#070807] border border-[#2A312D] rounded-lg px-3 py-2 text-[12.5px] text-[#F3F6F4] placeholder:text-[#4A5450] focus:outline-none focus:border-[#3DF49A]'

  if (loading) {
    return (
      <DashboardLayout title="Announcements" subtitle="Faculty Console" navItems={navItems} role={role === 'admin' ? 'admin' : 'staff'}>
        <div className="flex items-center justify-center min-h-[40vh] text-[#8A938E] text-[12.5px]">
          Loading announcements…
        </div>
      </DashboardLayout>
    )
  }

  return (
    <>
      <DashboardLayout title="Announcements" subtitle="Faculty Console" navItems={navItems} role={role === 'admin' ? 'admin' : 'staff'}>
        <Card>
          <CardHeader
            title={`Announcements (${items.length})`}
            subtitle="Messages visible to students or staff"
            action={
              <button
                onClick={() => setIsCreateOpen(true)}
                className="text-[#3DF49A] hover:text-[#5BFBA8] font-semibold"
              >
                New Announcement +
              </button>
            }
          />
          {items.length === 0 ? (
            <div className="text-[12.5px] text-[#8A938E] py-8 text-center">
              No announcements yet. Click <span className="text-[#3DF49A]">New Announcement</span> to publish one.
            </div>
          ) : (
            <div className="space-y-3">
              {items.map(a => {
                const canDelete = role === 'admin' || a.createdBy === userId
                return (
                  <div
                    key={a.id}
                    className="p-4 bg-[rgba(255,255,255,0.015)] border border-[#1F2421] rounded-lg"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="text-[13.5px] font-bold text-[#F3F6F4]">{a.title}</h3>
                          <span
                            className={`text-[9.5px] px-1.5 py-0.5 rounded uppercase tracking-wider font-bold ${
                              a.targetRole === 'staff'
                                ? 'bg-[rgba(245,168,92,0.1)] text-[#F5A85C]'
                                : a.targetRole === 'student'
                                  ? 'bg-[rgba(61,244,154,0.11)] text-[#3DF49A]'
                                  : 'bg-[rgba(91,153,251,0.1)] text-[#5B99FB]'
                            }`}
                          >
                            {a.targetRole || 'all'}
                          </span>
                        </div>
                        <p className="text-[11.5px] text-[#8A938E]">
                          {a.authorName || a.authorEmail || 'Unknown'} · {timeAgo(a.publishedAt || a.createdAt)}
                        </p>
                      </div>
                      {canDelete && (
                        <button
                          onClick={() => handleDelete(a.id)}
                          className="text-[11px] text-[#8A938E] hover:text-[#F26B6B] transition-colors flex-shrink-0"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <p className="text-[12.5px] text-[#C7CCC9] whitespace-pre-wrap leading-[1.6]">
                      {a.content}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      </DashboardLayout>

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="New Announcement" size="lg">
        <div className="space-y-3.5">
          <div>
            <label className="block text-[11px] text-[#8A938E] mb-1.5">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Quiz deadline extended"
              className={inputCls}
              maxLength={120}
            />
          </div>
          <div>
            <label className="block text-[11px] text-[#8A938E] mb-1.5">Content</label>
            <textarea
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              placeholder="The Chapter 5 quiz deadline has been extended by 48 hours…"
              rows={6}
              className={inputCls + ' resize-y'}
            />
          </div>
          <div>
            <label className="block text-[11px] text-[#8A938E] mb-1.5">Audience</label>
            <div className="flex gap-1 bg-[#070807] border border-[#2A312D] rounded-lg p-1 w-fit">
              {(['all', 'student', 'staff'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setForm(f => ({ ...f, targetRole: t }))}
                  className={`px-3 py-1.5 text-[11.5px] rounded-md transition-all capitalize ${
                    form.targetRole === t
                      ? 'bg-[rgba(61,244,154,0.11)] text-[#3DF49A] font-semibold'
                      : 'text-[#8A938E] hover:text-[#F3F6F4]'
                  }`}
                >
                  {t === 'all' ? 'Everyone' : t}
                </button>
              ))}
            </div>
          </div>
          {formError && <p className="text-[12px] text-[#F26B6B]">{formError}</p>}
        </div>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setIsCreateOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreate} disabled={submitting}>
            {submitting ? 'Publishing…' : 'Publish'}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}
