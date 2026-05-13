'use client'
import { useState, useEffect, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────
type Submission = {
  id: number; userId: number; displayName: string; university: string
  department: string; batch?: string | null; gender: string; phone?: string | null
  studentIdNo?: string | null; note?: string | null; status: string
  reviewedBy?: number | null; reviewNote?: string | null; reviewedAt?: string | null
  quoteText?: string | null; quoteAuthor?: string | null; submittedAt: string
  userEmail?: string; userName?: string
  chaptersRead: number; quizzesPassed: number; certificateId?: string | null
  reviewerName?: string | null
}
type Moderator = { id: number; username: string; email: string; displayName: string; role: string; active: boolean; createdAt: string }
type Tab = 'submissions' | 'moderators'
type StaffInfo = { role: string; displayName: string }

// ─── Login ────────────────────────────────────────────────────────────────────
function Login({ onLogin }: { onLogin: (info: StaffInfo) => void }) {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false)
  const submit = async () => {
    setLoading(true); setError('')
    const res = await fetch('/api/staff/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) {
      const d = await res.json()
      onLogin({ role: d.role, displayName: form.username })
    } else { const d = await res.json(); setError(d.error || 'Invalid credentials') }
    setLoading(false)
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080808] px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-[#00e676]/10 border border-[#00e676]/20 flex items-center justify-center mx-auto mb-4 text-2xl">⚙️</div>
          <h1 className="font-syne font-bold text-xl text-white">Staff Portal</h1>
          <p className="text-white/40 text-sm mt-1">LearnDE — Admin & Moderator Access</p>
        </div>
        <div className="space-y-3">
          <input type="text" placeholder="Username" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} onKeyDown={e => e.key === 'Enter' && submit()} className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#00e676]/40"/>
          <input type="password" placeholder="Password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} onKeyDown={e => e.key === 'Enter' && submit()} className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#00e676]/40"/>
          {error && <p className="text-red-400 text-xs text-center">{error}</p>}
          <button onClick={submit} disabled={loading} className="w-full py-3 rounded-xl bg-[#00e676] text-black font-semibold text-sm disabled:opacity-60">{loading ? 'Logging in...' : 'Login'}</button>
        </div>
      </div>
    </div>
  )
}

// ─── Review Modal ─────────────────────────────────────────────────────────────
function ReviewModal({ sub, onClose, onDone }: { sub: Submission; onClose: () => void; onDone: () => void }) {
  const [action, setAction] = useState<'approve' | 'reject' | ''>('')
  const [quoteText, setQuoteText] = useState(sub.quoteText ?? '')
  const [quoteAuthor, setQuoteAuthor] = useState(sub.quoteAuthor ?? '')
  const [reviewNote, setReviewNote] = useState(sub.reviewNote ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    if (!action) return
    if (action === 'approve' && !quoteText.trim()) { setError('Quote is required for approval.'); return }
    if (action === 'reject' && !reviewNote.trim()) { setError('Please provide a reason for rejection.'); return }
    setLoading(true); setError('')
    const res = await fetch('/api/staff/submissions', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ submissionId: sub.id, action, quoteText: quoteText || undefined, quoteAuthor: quoteAuthor || undefined, reviewNote: reviewNote || undefined }) })
    if (res.ok) { onDone() } else { const d = await res.json(); setError(d.error || 'Something went wrong.') }
    setLoading(false)
  }

  const markUnderReview = async () => {
    await fetch('/api/staff/submissions', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ submissionId: sub.id, action: 'under_review' }) })
    onDone()
  }

  const statusColor: Record<string, string> = { pending: 'text-amber-400', under_review: 'text-blue-400', approved: 'text-[#00e676]', rejected: 'text-red-400' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4 py-6 overflow-y-auto">
      <div className="w-full max-w-lg bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-syne font-semibold text-white">{sub.displayName}</h2>
            <p className="text-xs text-white/40 mt-0.5">{sub.userEmail}</p>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white text-xl leading-none">×</button>
        </div>

        {/* Student Info */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[['University', sub.university], ['Department', sub.department], ['Batch', sub.batch || '—'], ['Gender', sub.gender], ['Student ID', sub.studentIdNo || '—'], ['Phone', sub.phone || '—']].map(([l, v]) => (
            <div key={l} className="p-3 rounded-lg bg-white/4 border border-white/6">
              <div className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">{l}</div>
              <div className="text-sm text-white">{v}</div>
            </div>
          ))}
        </div>

        {/* Coursework stats */}
        <div className="flex gap-3 mb-4">
          <div className={`flex-1 p-3 rounded-lg border text-center ${sub.chaptersRead === 8 ? 'border-[#00e676]/20 bg-[#00e676]/5' : 'border-white/8 bg-white/4'}`}>
            <div className={`text-xl font-bold font-syne ${sub.chaptersRead === 8 ? 'text-[#00e676]' : 'text-white'}`}>{sub.chaptersRead}/8</div>
            <div className="text-[10px] text-white/40 mt-0.5">Chapters read</div>
          </div>
          <div className={`flex-1 p-3 rounded-lg border text-center ${sub.quizzesPassed === 8 ? 'border-[#00e676]/20 bg-[#00e676]/5' : 'border-white/8 bg-white/4'}`}>
            <div className={`text-xl font-bold font-syne ${sub.quizzesPassed === 8 ? 'text-[#00e676]' : 'text-white'}`}>{sub.quizzesPassed}/8</div>
            <div className="text-[10px] text-white/40 mt-0.5">Quizzes passed</div>
          </div>
          <div className="flex-1 p-3 rounded-lg border border-white/8 bg-white/4 text-center">
            <div className={`text-sm font-semibold font-syne ${statusColor[sub.status] ?? 'text-white'}`}>{sub.status.replace('_', ' ')}</div>
            <div className="text-[10px] text-white/40 mt-0.5">Status</div>
          </div>
        </div>

        {/* Student note */}
        {sub.note && (
          <div className="p-3 rounded-lg bg-white/4 border border-white/8 mb-4">
            <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Student Note</div>
            <p className="text-sm text-white/60 italic">{sub.note}</p>
          </div>
        )}

        {/* Already approved */}
        {sub.status === 'approved' && (
          <div className="p-4 rounded-xl bg-[#00e676]/5 border border-[#00e676]/20 text-center">
            <p className="text-[#00e676] font-medium text-sm">✓ Already Approved</p>
            {sub.certificateId && <p className="text-white/30 text-xs mt-1 font-mono">{sub.certificateId}</p>}
            {sub.quoteText && <p className="text-white/50 text-xs mt-2 italic">&ldquo;{sub.quoteText}&rdquo;</p>}
          </div>
        )}

        {/* Review actions — only for non-approved */}
        {sub.status !== 'approved' && (
          <>
            {sub.status === 'pending' && (
              <button onClick={markUnderReview} className="w-full py-2 rounded-lg border border-blue-500/20 text-blue-400 text-sm hover:bg-blue-500/5 mb-3">
                🔍 Mark as Under Review
              </button>
            )}

            {/* Action selector */}
            <div className="flex gap-2 mb-4">
              <button onClick={() => setAction('approve')} className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${action === 'approve' ? 'bg-[#00e676] text-black border-[#00e676]' : 'border-white/10 text-white/50 hover:border-white/20'}`}>✓ Approve</button>
              <button onClick={() => setAction('reject')} className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${action === 'reject' ? 'bg-red-500 text-white border-red-500' : 'border-white/10 text-white/50 hover:border-white/20'}`}>✗ Reject</button>
            </div>

            {action === 'approve' && (
              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Personal Quote <span className="text-[#00e676]">*</span> <span className="text-white/25">(will appear on their quote certificate)</span></label>
                  <textarea rows={3} value={quoteText} onChange={e => setQuoteText(e.target.value)} placeholder="Write a meaningful, personal quote for this student..." className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#00e676]/40 resize-none"/>
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Quote Author <span className="text-white/25">(optional — your name or a reference)</span></label>
                  <input type="text" value={quoteAuthor} onChange={e => setQuoteAuthor(e.target.value)} placeholder="e.g. Your Name, or leave blank" className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#00e676]/40"/>
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Internal note <span className="text-white/25">(optional, not shown to student)</span></label>
                  <input type="text" value={reviewNote} onChange={e => setReviewNote(e.target.value)} placeholder="Any internal notes..." className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#00e676]/40"/>
                </div>
              </div>
            )}

            {action === 'reject' && (
              <div className="mb-4">
                <label className="text-xs text-white/50 mb-1 block">Reason for rejection <span className="text-red-400">*</span> <span className="text-white/25">(sent to student)</span></label>
                <textarea rows={3} value={reviewNote} onChange={e => setReviewNote(e.target.value)} placeholder="e.g. Quiz scores don't match. Please retake the Chapter 3 quiz and resubmit." className="w-full px-4 py-3 rounded-xl bg-white/4 border border-red-500/20 text-white placeholder-white/20 text-sm focus:outline-none focus:border-red-500/40 resize-none"/>
              </div>
            )}

            {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

            {action && (
              <button onClick={submit} disabled={loading} className={`w-full py-3 rounded-xl font-semibold text-sm disabled:opacity-60 ${action === 'approve' ? 'bg-[#00e676] text-black' : 'bg-red-500 text-white'}`}>
                {loading ? 'Processing...' : action === 'approve' ? '✓ Approve & Issue Certificate' : '✗ Reject Submission'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ─── Add Moderator Modal ──────────────────────────────────────────────────────
function AddModeratorModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [form, setForm] = useState({ username: '', email: '', password: '', displayName: '', role: 'moderator' })
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false)
  const submit = async () => {
    setLoading(true); setError('')
    const res = await fetch('/api/staff/moderators', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) { onDone() } else { const d = await res.json(); setError(d.error || 'Failed') }
    setLoading(false)
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-[#0f0f0f] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-syne font-semibold text-white">Add Staff Member</h2>
          <button onClick={onClose} className="text-white/30 hover:text-white text-xl">×</button>
        </div>
        <div className="space-y-3">
          {[['displayName','Display Name','e.g. Dr. Rahman'],['username','Username','login username'],['email','Email','staff@email.com'],['password','Password','min 8 characters']].map(([k,l,p]) => (
            <div key={k}>
              <label className="text-xs text-white/50 mb-1 block">{l}</label>
              <input type={k === 'password' ? 'password' : 'text'} placeholder={p} value={(form as Record<string,string>)[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#00e676]/40"/>
            </div>
          ))}
          <div>
            <label className="text-xs text-white/50 mb-1 block">Role</label>
            <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/10 text-white text-sm focus:outline-none">
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <div className="flex gap-2 pt-1">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 text-sm">Cancel</button>
            <button onClick={submit} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-[#00e676] text-black font-semibold text-sm disabled:opacity-60">{loading ? 'Adding...' : 'Add Member'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Staff Dashboard ─────────────────────────────────────────────────────
export default function StaffDashboard() {
  const [staffInfo, setStaffInfo] = useState<StaffInfo | null>(null)
  const [tab, setTab] = useState<Tab>('submissions')
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [moderators, setModerators] = useState<Moderator[]>([])
  const [loadingSubs, setLoadingSubs] = useState(false)
  const [loadingMods, setLoadingMods] = useState(false)
  const [reviewing, setReviewing] = useState<Submission | null>(null)
  const [addingMod, setAddingMod] = useState(false)
  const [filterStatus, setFilterStatus] = useState('')
  const [search, setSearch] = useState('')

  const loadSubs = useCallback(async () => {
    setLoadingSubs(true)
    const r = await fetch('/api/staff/submissions')
    if (r.ok) { const d = await r.json(); setSubmissions(d.submissions) }
    setLoadingSubs(false)
  }, [])

  const loadMods = useCallback(async () => {
    setLoadingMods(true)
    const r = await fetch('/api/staff/moderators')
    if (r.ok) { const d = await r.json(); setModerators(d.moderators) }
    setLoadingMods(false)
  }, [])

  useEffect(() => {
    if (staffInfo) { loadSubs(); if (staffInfo.role === 'admin') loadMods() }
  }, [staffInfo, loadSubs, loadMods])

  const logout = async () => { await fetch('/api/staff/auth', { method: 'DELETE' }); setStaffInfo(null) }

  const toggleMod = async (id: number, active: boolean, role?: string) => {
    await fetch('/api/staff/moderators', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, active, role }) })
    loadMods()
  }

  if (!staffInfo) return <Login onLogin={setStaffInfo} />

  const filteredSubs = submissions.filter(s => {
    const q = search.toLowerCase()
    const matchSearch = !q || s.displayName.toLowerCase().includes(q) || s.userEmail?.toLowerCase().includes(q) || s.university?.toLowerCase().includes(q)
    const matchStatus = !filterStatus || s.status === filterStatus
    return matchSearch && matchStatus
  })

  const counts = { pending: submissions.filter(s => s.status === 'pending').length, under_review: submissions.filter(s => s.status === 'under_review').length, approved: submissions.filter(s => s.status === 'approved').length, rejected: submissions.filter(s => s.status === 'rejected').length }

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {reviewing && <ReviewModal sub={reviewing} onClose={() => setReviewing(null)} onDone={() => { setReviewing(null); loadSubs() }} />}
      {addingMod && <AddModeratorModal onClose={() => setAddingMod(false)} onDone={() => { setAddingMod(false); loadMods() }} />}

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-white/5 bg-[#080808]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-syne font-bold">Learn<span className="text-[#00e676]">D.E.</span></span>
            <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${staffInfo.role === 'admin' ? 'bg-[#00e676]/10 text-[#00e676] border-[#00e676]/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
              {staffInfo.role === 'admin' ? '★ Admin' : 'Moderator'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/30 hidden sm:block">{staffInfo.displayName}</span>
            <button onClick={logout} className="text-xs text-white/30 hover:text-white/60">Sign out</button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-5 pt-20 pb-16">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Pending', value: counts.pending, color: 'text-amber-400', icon: '⏳' },
            { label: 'Under Review', value: counts.under_review, color: 'text-blue-400', icon: '🔍' },
            { label: 'Approved', value: counts.approved, color: 'text-[#00e676]', icon: '✓' },
            { label: 'Rejected', value: counts.rejected, color: 'text-red-400', icon: '✗' },
          ].map(s => (
            <div key={s.label} className="rounded-xl border border-white/8 bg-white/3 p-4 cursor-pointer hover:bg-white/5" onClick={() => setFilterStatus(filterStatus === s.label.toLowerCase().replace(' ', '_') ? '' : s.label.toLowerCase().replace(' ', '_'))}>
              <div className="text-xl mb-1">{s.icon}</div>
              <div className={`font-syne font-bold text-2xl ${s.color}`}>{s.value}</div>
              <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs (admin gets moderator tab) */}
        <div className="flex gap-1 mb-6 border border-white/8 rounded-xl p-1 bg-white/2 w-fit">
          <button onClick={() => setTab('submissions')} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'submissions' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}>
            📋 Submissions
          </button>
          {staffInfo.role === 'admin' && (
            <button onClick={() => setTab('moderators')} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'moderators' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}>
              👥 Staff
            </button>
          )}
        </div>

        {/* ── Submissions ── */}
        {tab === 'submissions' && (
          <div>
            <div className="flex flex-wrap gap-3 mb-5">
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, university..." className="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl bg-white/4 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#00e676]/40"/>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2.5 rounded-xl bg-white/4 border border-white/10 text-white text-sm focus:outline-none">
                <option value="">All statuses</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <button onClick={loadSubs} className="px-4 py-2.5 rounded-xl border border-white/10 text-white/50 text-sm hover:text-white">↻</button>
            </div>

            <div className="text-xs text-white/30 mb-3">{filteredSubs.length} submission{filteredSubs.length !== 1 ? 's' : ''}</div>

            {loadingSubs ? (
              <div className="text-white/30 text-sm text-center py-16">Loading...</div>
            ) : filteredSubs.length === 0 ? (
              <div className="text-white/30 text-sm text-center py-16">No submissions found.</div>
            ) : (
              <div className="space-y-2">
                {filteredSubs.map(s => {
                  const statusStyle: Record<string, { dot: string; text: string; label: string }> = {
                    pending:      { dot: 'bg-amber-400', text: 'text-amber-400', label: 'Pending' },
                    under_review: { dot: 'bg-blue-400',  text: 'text-blue-400',  label: 'Under Review' },
                    approved:     { dot: 'bg-[#00e676]', text: 'text-[#00e676]', label: 'Approved' },
                    rejected:     { dot: 'bg-red-400',   text: 'text-red-400',   label: 'Rejected' },
                  }
                  const ss = statusStyle[s.status] ?? statusStyle.pending
                  const courseworkOk = s.chaptersRead === 8 && s.quizzesPassed === 8
                  return (
                    <div key={s.id} onClick={() => setReviewing(s)} className="rounded-xl border border-white/8 bg-white/3 p-4 hover:bg-white/5 hover:border-white/15 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center flex-shrink-0 text-sm font-bold text-white/60">
                          {s.displayName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-white text-sm">{s.displayName}</span>
                            <span className={`text-xs font-medium flex items-center gap-1 ${ss.text}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${ss.dot}`}/>
                              {ss.label}
                            </span>
                            {!courseworkOk && <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400">⚠ Incomplete</span>}
                          </div>
                          <div className="text-xs text-white/30 mt-0.5">{s.userEmail}</div>
                          <div className="text-xs text-white/40 mt-0.5">{s.university} · {s.department}{s.batch ? ` · ${s.batch}` : ''}</div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-xs text-white/30">{s.chaptersRead}/8 read · {s.quizzesPassed}/8 passed</div>
                          <div className="text-[10px] text-white/20 mt-1">{new Date(s.submittedAt).toLocaleDateString()}</div>
                          {s.reviewerName && <div className="text-[10px] text-white/20">by {s.reviewerName}</div>}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Staff (admin only) ── */}
        {tab === 'moderators' && staffInfo.role === 'admin' && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-white/40">Manage moderators and admins who can review submissions.</p>
              <button onClick={() => setAddingMod(true)} className="px-4 py-2.5 rounded-xl bg-[#00e676] text-black font-semibold text-sm flex-shrink-0">+ Add Member</button>
            </div>
            {loadingMods ? <div className="text-white/30 text-sm text-center py-16">Loading...</div> : (
              <div className="space-y-2">
                {moderators.map(m => (
                  <div key={m.id} className="rounded-xl border border-white/8 bg-white/3 p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center text-sm font-bold text-white/60">{m.displayName.charAt(0)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-white text-sm">{m.displayName}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${m.role === 'admin' ? 'bg-[#00e676]/10 text-[#00e676]' : 'bg-blue-500/10 text-blue-400'}`}>
                          {m.role}
                        </span>
                        {!m.active && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400">Suspended</span>}
                      </div>
                      <div className="text-xs text-white/30 mt-0.5">{m.email} · @{m.username}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => toggleMod(m.id, !m.active, m.role)} className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${m.active ? 'border-red-500/20 text-red-400 hover:bg-red-500/5' : 'border-[#00e676]/20 text-[#00e676] hover:bg-[#00e676]/5'}`}>
                        {m.active ? 'Suspend' : 'Restore'}
                      </button>
                      <button onClick={() => toggleMod(m.id, m.active, m.role === 'admin' ? 'moderator' : 'admin')} className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/40 hover:text-white">
                        {m.role === 'admin' ? '→ Mod' : '→ Admin'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
