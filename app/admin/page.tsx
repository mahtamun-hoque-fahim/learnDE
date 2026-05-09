'use client'
import { useState, useEffect, useCallback } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────
type Quote = {
  id: number; text: string; author: string | null
  targetGender: string | null; targetDepartment: string | null
  priority: number; active: boolean
}

type Student = {
  id: number; name: string; email: string; studentId: string | null
  createdAt: string
  profile: {
    displayName: string; university: string; department: string
    batch: string | null; gender: string
  } | null
  chaptersRead: number; quizzesPassed: number
  hasCertificate: boolean; certificateId: string | null
}

type Tab = 'students' | 'quotes'

// ─── Admin Login ─────────────────────────────────────────────────────────────
function Login({ onLogin }: { onLogin: () => void }) {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setLoading(true); setError('')
    const res = await fetch('/api/admin/auth', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) { onLogin() }
    else { const d = await res.json(); setError(d.error || 'Invalid credentials') }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080808] px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-[#00e676]/10 border border-[#00e676]/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚙️</span>
          </div>
          <h1 className="font-syne font-bold text-xl text-white">Admin Dashboard</h1>
          <p className="text-white/40 text-sm mt-1">LearnD.E. Management</p>
        </div>
        <div className="space-y-3">
          <input type="text" placeholder="Username" value={form.username}
            onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && submit()}
            className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#00e676]/40" />
          <input type="password" placeholder="Password" value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && submit()}
            className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#00e676]/40" />
          {error && <p className="text-red-400 text-xs text-center">{error}</p>}
          <button onClick={submit} disabled={loading}
            className="w-full py-3 rounded-xl bg-[#00e676] text-black font-semibold text-sm disabled:opacity-60">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Quote Form ───────────────────────────────────────────────────────────────
const DEPTS = ['CSE', 'EEE', 'Civil', 'Mechanical', 'BBA', 'English', 'Law', 'Pharmacy', 'Architecture', 'Other']

function QuoteForm({ initial, onSave, onCancel }: {
  initial?: Partial<Quote>; onSave: (q: Partial<Quote>) => void; onCancel: () => void
}) {
  const [form, setForm] = useState<Partial<Quote>>({
    text: '', author: '', targetGender: null, targetDepartment: null, priority: 0, active: true,
    ...initial,
  })
  const set = (k: keyof Quote, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg bg-[#111] border border-white/10 rounded-2xl p-6">
        <h2 className="font-syne font-semibold text-white mb-5">
          {initial?.id ? 'Edit Quote' : 'New Quote'}
        </h2>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-white/50 mb-1 block">Quote Text *</label>
            <textarea rows={3} value={form.text ?? ''} onChange={e => set('text', e.target.value)}
              placeholder="Enter an inspiring quote..."
              className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#00e676]/40 resize-none" />
          </div>
          <div>
            <label className="text-xs text-white/50 mb-1 block">Author (optional)</label>
            <input type="text" value={form.author ?? ''} onChange={e => set('author', e.target.value)}
              placeholder="e.g. Albert Einstein"
              className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#00e676]/40" />
          </div>
          {/* Targeting */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/50 mb-1 block">Target Gender</label>
              <select value={form.targetGender ?? ''} onChange={e => set('targetGender', e.target.value || null)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/4 border border-white/10 text-white text-sm focus:outline-none focus:border-[#00e676]/40">
                <option value="">All genders</option>
                <option value="male">Male only</option>
                <option value="female">Female only</option>
                <option value="other">Other only</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1 block">Target Department</label>
              <select value={form.targetDepartment ?? ''} onChange={e => set('targetDepartment', e.target.value || null)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/4 border border-white/10 text-white text-sm focus:outline-none focus:border-[#00e676]/40">
                <option value="">All departments</option>
                {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-xs text-white/50 mb-1 block">Priority (higher = preferred)</label>
              <input type="number" value={form.priority ?? 0} onChange={e => set('priority', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/4 border border-white/10 text-white text-sm focus:outline-none focus:border-[#00e676]/40" />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <button onClick={() => set('active', !form.active)}
                className={`w-10 h-5 rounded-full transition-colors relative ${form.active ? 'bg-[#00e676]' : 'bg-white/10'}`}>
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${form.active ? 'left-5' : 'left-0.5'}`} />
              </button>
              <span className="text-xs text-white/50">{form.active ? 'Active' : 'Disabled'}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 text-sm">
            Cancel
          </button>
          <button onClick={() => onSave(form)} className="flex-1 py-2.5 rounded-xl bg-[#00e676] text-black font-semibold text-sm">
            Save Quote
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false)
  const [tab, setTab] = useState<Tab>('students')
  const [students, setStudents] = useState<Student[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [loadingQuotes, setLoadingQuotes] = useState(false)
  const [quoteForm, setQuoteForm] = useState<{ open: boolean; initial?: Partial<Quote> }>({ open: false })
  const [search, setSearch] = useState('')
  const [filterGender, setFilterGender] = useState('')
  const [filterDept, setFilterDept] = useState('')

  const loadStudents = useCallback(async () => {
    setLoadingStudents(true)
    const res = await fetch('/api/admin/students')
    if (res.ok) { const d = await res.json(); setStudents(d.students) }
    setLoadingStudents(false)
  }, [])

  const loadQuotes = useCallback(async () => {
    setLoadingQuotes(true)
    const res = await fetch('/api/admin/quotes')
    if (res.ok) { const d = await res.json(); setQuotes(d.quotes) }
    setLoadingQuotes(false)
  }, [])

  useEffect(() => {
    if (authed) { loadStudents(); loadQuotes() }
  }, [authed, loadStudents, loadQuotes])

  const logout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    setAuthed(false)
  }

  const saveQuote = async (form: Partial<Quote>) => {
    const method = form.id ? 'PUT' : 'POST'
    const res = await fetch('/api/admin/quotes', {
      method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
    })
    if (res.ok) { setQuoteForm({ open: false }); loadQuotes() }
  }

  const deleteQuote = async (id: number) => {
    if (!confirm('Delete this quote?')) return
    await fetch('/api/admin/quotes', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }),
    })
    loadQuotes()
  }

  if (!authed) return <Login onLogin={() => setAuthed(true)} />

  const filteredStudents = students.filter(s => {
    const q = search.toLowerCase()
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
      || s.profile?.university?.toLowerCase().includes(q) || s.profile?.department?.toLowerCase().includes(q)
    const matchGender = !filterGender || s.profile?.gender === filterGender
    const matchDept = !filterDept || s.profile?.department === filterDept
    return matchSearch && matchGender && matchDept
  })

  const stats = {
    total: students.length,
    withProfile: students.filter(s => s.profile).length,
    withCert: students.filter(s => s.hasCertificate).length,
    active: students.filter(s => s.chaptersRead > 0 || s.quizzesPassed > 0).length,
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {quoteForm.open && (
        <QuoteForm
          initial={quoteForm.initial}
          onSave={saveQuote}
          onCancel={() => setQuoteForm({ open: false })}
        />
      )}

      {/* Top nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-white/5 bg-[#080808]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-syne font-bold text-base">
              Learn<span className="text-[#00e676]">D.E.</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#00e676]/10 text-[#00e676] text-xs font-medium border border-[#00e676]/20">
              Admin
            </span>
          </div>
          <button onClick={logout} className="text-xs text-white/30 hover:text-white/60 transition-colors">
            Sign out
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-5 pt-20 pb-16">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Total Students', value: stats.total, icon: '👥' },
            { label: 'Active Learners', value: stats.active, icon: '📖' },
            { label: 'Profiles Filled', value: stats.withProfile, icon: '📝' },
            { label: 'Certificates Issued', value: stats.withCert, icon: '🎓' },
          ].map(s => (
            <div key={s.label} className="rounded-xl border border-white/8 bg-white/3 p-4">
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="font-syne font-bold text-2xl text-white">{s.value}</div>
              <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border border-white/8 rounded-xl p-1 bg-white/2 w-fit">
          {(['students', 'quotes'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                tab === t ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
              }`}>
              {t === 'students' ? '👥 Students' : '💬 Quotes'}
            </button>
          ))}
        </div>

        {/* ── Students tab ── */}
        {tab === 'students' && (
          <div>
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-5">
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, email, university..."
                className="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl bg-white/4 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#00e676]/40" />
              <select value={filterGender} onChange={e => setFilterGender(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-white/4 border border-white/10 text-white text-sm focus:outline-none">
                <option value="">All genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <select value={filterDept} onChange={e => setFilterDept(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-white/4 border border-white/10 text-white text-sm focus:outline-none">
                <option value="">All depts</option>
                {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <button onClick={loadStudents} className="px-4 py-2.5 rounded-xl border border-white/10 text-white/50 text-sm hover:text-white hover:border-white/20">
                ↻ Refresh
              </button>
            </div>

            <div className="text-xs text-white/30 mb-3">{filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}</div>

            {loadingStudents ? (
              <div className="text-white/30 text-sm text-center py-16">Loading...</div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-white/30 text-sm text-center py-16">No students found.</div>
            ) : (
              <div className="space-y-2">
                {filteredStudents.map(s => (
                  <div key={s.id} className="rounded-xl border border-white/8 bg-white/3 p-4 hover:bg-white/5 transition-colors">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-full bg-[#00e676]/10 border border-[#00e676]/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-[#00e676]">
                        {(s.profile?.displayName ?? s.name).charAt(0).toUpperCase()}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-white text-sm">{s.profile?.displayName ?? s.name}</span>
                          {s.profile?.gender && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-white/40">
                              {s.profile.gender === 'male' ? '👨' : s.profile.gender === 'female' ? '👩' : '🧑'} {s.profile.gender}
                            </span>
                          )}
                          {s.hasCertificate && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-[#00e676]/10 text-[#00e676] border border-[#00e676]/20">
                              🎓 Certified
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-white/30 mt-0.5">{s.email}</div>
                        {s.profile && (
                          <div className="text-xs text-white/40 mt-1">
                            {s.profile.university} · {s.profile.department}
                            {s.profile.batch ? ` · ${s.profile.batch}` : ''}
                          </div>
                        )}
                        {!s.profile && (
                          <div className="text-xs text-amber-500/60 mt-1">⚠ Profile not filled</div>
                        )}
                      </div>

                      {/* Progress */}
                      <div className="text-right flex-shrink-0">
                        <div className="text-xs text-white/30 mb-1">Progress</div>
                        <div className="font-mono text-sm text-white">
                          {s.chaptersRead}/8 <span className="text-white/30">read</span>
                        </div>
                        <div className="font-mono text-sm text-white">
                          {s.quizzesPassed}/8 <span className="text-white/30">passed</span>
                        </div>
                        {s.certificateId && (
                          <div className="font-mono text-[10px] text-white/20 mt-1 max-w-[140px] truncate">
                            {s.certificateId}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Quotes tab ── */}
        {tab === 'quotes' && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-sm text-white/40">
                  Quotes are assigned to students on certificate generation based on their gender and department.
                </p>
              </div>
              <button
                onClick={() => setQuoteForm({ open: true })}
                className="px-4 py-2.5 rounded-xl bg-[#00e676] text-black font-semibold text-sm flex-shrink-0">
                + New Quote
              </button>
            </div>

            {/* Legend */}
            <div className="flex gap-4 mb-5 flex-wrap text-xs text-white/30">
              <span>🎯 Targeted quote = shown only to matching students</span>
              <span>🌐 General quote = shown when no targeted quote matches</span>
              <span>Higher priority = preferred over lower priority</span>
            </div>

            {loadingQuotes ? (
              <div className="text-white/30 text-sm text-center py-16">Loading...</div>
            ) : quotes.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-4xl mb-3">💬</div>
                <p className="text-white/40 text-sm mb-4">No quotes yet. Add your first quote!</p>
                <button onClick={() => setQuoteForm({ open: true })}
                  className="px-6 py-2.5 rounded-full bg-[#00e676] text-black font-semibold text-sm">
                  + Add Quote
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {quotes
                  .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
                  .map(q => (
                    <div key={q.id} className={`rounded-xl border p-4 transition-colors ${q.active ? 'border-white/8 bg-white/3' : 'border-white/4 bg-white/1 opacity-50'}`}>
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          {/* Targeting badges */}
                          <div className="flex gap-1.5 flex-wrap mb-2">
                            {q.targetGender ? (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                🎯 {q.targetGender}
                              </span>
                            ) : (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/30">
                                🌐 all genders
                              </span>
                            )}
                            {q.targetDepartment ? (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                🎯 {q.targetDepartment}
                              </span>
                            ) : (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/30">
                                🌐 all depts
                              </span>
                            )}
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/30">
                              Priority: {q.priority}
                            </span>
                            {!q.active && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">
                                Disabled
                              </span>
                            )}
                          </div>
                          <p className="text-white/80 text-sm italic leading-relaxed">
                            &ldquo;{q.text}&rdquo;
                          </p>
                          {q.author && (
                            <p className="text-[#00e676]/50 text-xs mt-1">— {q.author}</p>
                          )}
                        </div>
                        {/* Actions */}
                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            onClick={() => setQuoteForm({ open: true, initial: q })}
                            className="px-3 py-1.5 rounded-lg text-xs text-white/50 border border-white/10 hover:border-white/20 hover:text-white transition-colors">
                            Edit
                          </button>
                          <button
                            onClick={() => deleteQuote(q.id)}
                            className="px-3 py-1.5 rounded-lg text-xs text-red-400/60 border border-red-500/10 hover:border-red-500/20 hover:text-red-400 transition-colors">
                            Del
                          </button>
                        </div>
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
