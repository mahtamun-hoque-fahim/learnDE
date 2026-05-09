'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const DEPARTMENTS = ['CSE', 'EEE', 'Civil', 'Mechanical', 'BBA', 'English', 'Law', 'Pharmacy', 'Architecture', 'Other']

export default function CertRegistrationPage() {
  const router = useRouter()
  const [existing, setExisting] = useState<{ status: string; displayName?: string } | null>(null)
  const [form, setForm] = useState({ displayName: '', university: '', department: '', batch: '', gender: '', phone: '', studentIdNo: '', note: '' })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    const init = async () => {
      const [sessRes, subRes] = await Promise.all([fetch('/api/auth/session'), fetch('/api/submissions')])
      const sess = await sessRes.json()
      const sub = await subRes.json()
      if (sub.submission && sub.submission.status !== 'rejected') {
        setExisting(sub.submission)
      } else {
        setForm(f => ({ ...f, displayName: sess.user?.name ?? '' }))
        if (sub.submission?.status === 'rejected') setExisting(sub.submission) // show rejection notice
      }
      setLoading(false)
    }
    init()
  }, [])

  const submit = async () => {
    if (!form.displayName || !form.university || !form.department || !form.gender) { setError('Please fill all required fields.'); return }
    setSubmitting(true); setError('')
    const res = await fetch('/api/submissions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) { setDone(true) }
    else { const d = await res.json(); setError(d.error || 'Something went wrong.') }
    setSubmitting(false)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-white/30 text-sm animate-pulse">Loading...</div></div>

  // Already submitted (not rejected)
  if (existing && existing.status !== 'rejected') {
    const statusMap: Record<string, { label: string; color: string; icon: string; desc: string }> = {
      pending: { label: 'Pending Review', color: 'text-amber-400', icon: '⏳', desc: 'Your submission is in the queue. It typically takes 3 days to verify, but may take up to a week during busy periods.' },
      under_review: { label: 'Under Review', color: 'text-blue-400', icon: '🔍', desc: 'A moderator is currently reviewing your coursework. You\'ll be notified by email once a decision is made.' },
      approved: { label: 'Approved!', color: 'text-[#00e676]', icon: '🎓', desc: 'Your certificate has been issued. Head to your dashboard to view and download it.' },
    }
    const st = statusMap[existing.status] ?? statusMap.pending
    return (
      <div className="min-h-screen">
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#080808]/80 backdrop-blur-md">
          <div className="max-w-xl mx-auto px-5 h-14 flex items-center"><Link href="/dashboard" className="text-sm text-white/50 hover:text-white flex items-center gap-1.5"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>Dashboard</Link></div>
        </nav>
        <div className="pt-24 pb-16 px-5 max-w-xl mx-auto text-center">
          <div className="text-5xl mb-4">{st.icon}</div>
          <h1 className={`font-syne font-bold text-2xl mb-2 ${st.color}`}>{st.label}</h1>
          <p className="text-white/40 text-sm leading-relaxed max-w-sm mx-auto mb-8">{st.desc}</p>
          {existing.status === 'approved'
            ? <Link href="/dashboard" className="px-8 py-3 bg-[#00e676] text-black font-semibold rounded-full text-sm inline-block">View Certificate →</Link>
            : <div className="p-4 rounded-xl border border-white/8 bg-white/4 text-left max-w-sm mx-auto"><p className="text-xs text-white/30">Submitted as: <span className="text-white/60">{existing.displayName}</span></p></div>
          }
        </div>
      </div>
    )
  }

  // Submitted successfully
  if (done) return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#080808]/80 backdrop-blur-md">
        <div className="max-w-xl mx-auto px-5 h-14 flex items-center"><Link href="/dashboard" className="text-sm text-white/50 hover:text-white flex items-center gap-1.5"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>Dashboard</Link></div>
      </nav>
      <div className="pt-24 pb-16 px-5 max-w-xl mx-auto text-center">
        <div className="text-5xl mb-4">📬</div>
        <h1 className="font-syne font-bold text-2xl text-white mb-2">Request Submitted!</h1>
        <p className="text-white/40 text-sm leading-relaxed max-w-sm mx-auto mb-8">
          Your coursework will be reviewed by our team. This typically takes <strong className="text-white/70">less than 3 days</strong>, but may take up to a week during busy periods.<br /><br />
          You&apos;ll receive an email once your certificate is ready.
        </p>
        <Link href="/dashboard" className="px-8 py-3 bg-[#00e676] text-black font-semibold rounded-full text-sm inline-block">Back to Dashboard</Link>
      </div>
    </div>
  )

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#080808]/80 backdrop-blur-md">
        <div className="max-w-xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="text-sm text-white/50 hover:text-white flex items-center gap-1.5"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>Dashboard</Link>
          <span className="font-syne text-sm text-white/40">Certificate Registration</span>
        </div>
      </nav>

      <div className="pt-20 pb-16 px-5 max-w-xl mx-auto">
        {/* Rejection notice */}
        {existing?.status === 'rejected' && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/5">
            <p className="text-red-400 text-sm font-medium mb-1">Previous submission was not approved</p>
            <p className="text-red-400/60 text-xs">Please correct any issues and resubmit.</p>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#00e676]/10 border border-[#00e676]/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎓</span>
          </div>
          <h1 className="font-syne font-bold text-2xl text-white mb-2">Apply for Certificate</h1>
          <p className="text-white/40 text-sm leading-relaxed max-w-sm mx-auto">
            Fill in your details below. Our team will verify your coursework and issue your certificate within <strong className="text-white/70">3 days</strong> (up to a week at peak times).
          </p>
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs text-white/50 mb-1.5 font-medium">Full Name <span className="text-[#00e676]">*</span> <span className="text-white/25 font-normal">(as on certificate)</span></label>
            <input type="text" value={form.displayName} onChange={e => set('displayName', e.target.value)} placeholder="Your full name" className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#00e676]/40 transition-colors"/>
          </div>

          {/* University */}
          <div>
            <label className="block text-xs text-white/50 mb-1.5 font-medium">University / Institution <span className="text-[#00e676]">*</span></label>
            <input type="text" value={form.university} onChange={e => set('university', e.target.value)} placeholder="e.g. BRAC University, BUET, DIU..." className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#00e676]/40 transition-colors"/>
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs text-white/50 mb-1.5 font-medium">Department <span className="text-[#00e676]">*</span></label>
            <div className="flex flex-wrap gap-2">
              {DEPARTMENTS.map(d => (
                <button key={d} onClick={() => set('department', d)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${form.department === d ? 'bg-[#00e676] text-black border-[#00e676]' : 'bg-white/4 text-white/60 border-white/10 hover:border-white/20'}`}>{d}</button>
              ))}
            </div>
          </div>

          {/* Row: Batch + Student ID */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/50 mb-1.5 font-medium">Batch / Year</label>
              <input type="text" value={form.batch} onChange={e => set('batch', e.target.value)} placeholder="e.g. Spring 2024" className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#00e676]/40"/>
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5 font-medium">Student ID</label>
              <input type="text" value={form.studentIdNo} onChange={e => set('studentIdNo', e.target.value)} placeholder="e.g. 21301234" className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#00e676]/40"/>
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs text-white/50 mb-1.5 font-medium">I identify as <span className="text-[#00e676]">*</span></label>
            <div className="flex gap-2">
              {[{ v: 'male', l: '👨 Male' }, { v: 'female', l: '👩 Female' }, { v: 'other', l: '🧑 Other' }].map(o => (
                <button key={o.v} onClick={() => set('gender', o.v)} className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-all ${form.gender === o.v ? 'bg-[#00e676] text-black border-[#00e676]' : 'bg-white/4 text-white/60 border-white/10 hover:border-white/20'}`}>{o.l}</button>
              ))}
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs text-white/50 mb-1.5 font-medium">Phone <span className="text-white/25 font-normal">(optional)</span></label>
            <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+880..." className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#00e676]/40"/>
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs text-white/50 mb-1.5 font-medium">Note to reviewer <span className="text-white/25 font-normal">(optional)</span></label>
            <textarea rows={3} value={form.note} onChange={e => set('note', e.target.value)} placeholder="Anything you want to tell the reviewer..." className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#00e676]/40 resize-none"/>
          </div>

          {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

          <button onClick={submit} disabled={submitting} className="w-full py-3.5 rounded-xl bg-[#00e676] text-black font-semibold text-sm hover:bg-[#00e676]/90 disabled:opacity-60">
            {submitting ? 'Submitting...' : 'Submit Certificate Request →'}
          </button>

          <p className="text-center text-xs text-white/20 pb-2">
            By submitting, you confirm that all information is accurate. Our team will verify your quiz and reading records.
          </p>
        </div>
      </div>
    </div>
  )
}
