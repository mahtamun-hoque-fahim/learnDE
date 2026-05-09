'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const DEPARTMENTS = ['CSE', 'EEE', 'Civil', 'Mechanical', 'BBA', 'English', 'Law', 'Pharmacy', 'Architecture', 'Other']

export default function ProfilePage() {
  const router = useRouter()
  const [form, setForm] = useState({ displayName: '', university: '', department: '', batch: '', gender: '' })
  const [loading, setLoading] = useState(false)
  const [prefilled, setPrefilled] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Pre-fill from session name and existing profile
    const init = async () => {
      const [sessRes, profRes] = await Promise.all([
        fetch('/api/auth/session'),
        fetch('/api/profile'),
      ])
      const sess = await sessRes.json()
      const prof = await profRes.json()
      if (prof.profile) {
        setForm({
          displayName: prof.profile.displayName,
          university: prof.profile.university,
          department: prof.profile.department,
          batch: prof.profile.batch ?? '',
          gender: prof.profile.gender,
        })
        setPrefilled(true)
      } else if (sess.user?.name) {
        setForm(f => ({ ...f, displayName: sess.user.name }))
      }
    }
    init()
  }, [])

  const submit = async () => {
    if (!form.displayName || !form.university || !form.department || !form.gender) {
      setError('Please fill all required fields.')
      return
    }
    setLoading(true)
    setError('')
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      router.push('/certificate')
    } else {
      const d = await res.json()
      setError(d.error || 'Something went wrong.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#080808]/80 backdrop-blur-md">
        <div className="max-w-xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="text-sm text-white/50 hover:text-white flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Dashboard
          </Link>
          <span className="font-syne text-sm text-white/40">Your Profile</span>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-5 max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-[#00e676]/10 border border-[#00e676]/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎓</span>
          </div>
          <h1 className="font-syne font-bold text-2xl text-white mb-2">
            {prefilled ? 'Update Your Profile' : 'Almost there!'}
          </h1>
          <p className="text-white/40 text-sm leading-relaxed">
            {prefilled
              ? 'Update your details below — your certificate will reflect them.'
              : 'Tell us a bit about yourself. This will appear on your certificate and personalize your experience.'}
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Display Name */}
          <div>
            <label className="block text-xs text-white/50 mb-1.5 font-medium">
              Full Name <span className="text-[#00e676]">*</span>
            </label>
            <input
              type="text"
              value={form.displayName}
              onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))}
              placeholder="As it should appear on your certificate"
              className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#00e676]/40 transition-colors"
            />
          </div>

          {/* University */}
          <div>
            <label className="block text-xs text-white/50 mb-1.5 font-medium">
              University / Institution <span className="text-[#00e676]">*</span>
            </label>
            <input
              type="text"
              value={form.university}
              onChange={e => setForm(f => ({ ...f, university: e.target.value }))}
              placeholder="e.g. BRAC University, BUET, DIU..."
              className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#00e676]/40 transition-colors"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs text-white/50 mb-1.5 font-medium">
              Department <span className="text-[#00e676]">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {DEPARTMENTS.map(dept => (
                <button
                  key={dept}
                  onClick={() => setForm(f => ({ ...f, department: dept }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    form.department === dept
                      ? 'bg-[#00e676] text-black border-[#00e676]'
                      : 'bg-white/4 text-white/60 border-white/10 hover:border-white/20'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
            {form.department === 'Other' && (
              <input
                type="text"
                placeholder="Specify your department"
                className="mt-2 w-full px-4 py-3 rounded-xl bg-white/4 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#00e676]/40"
                onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
              />
            )}
          </div>

          {/* Batch */}
          <div>
            <label className="block text-xs text-white/50 mb-1.5 font-medium">
              Batch / Year <span className="text-white/30 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={form.batch}
              onChange={e => setForm(f => ({ ...f, batch: e.target.value }))}
              placeholder="e.g. Spring 2024, Batch 49..."
              className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#00e676]/40 transition-colors"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs text-white/50 mb-1.5 font-medium">
              I identify as <span className="text-[#00e676]">*</span>
            </label>
            <div className="flex gap-2">
              {[
                { value: 'male', label: '👨 Male' },
                { value: 'female', label: '👩 Female' },
                { value: 'other', label: '🧑 Other' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setForm(f => ({ ...f, gender: opt.value }))}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-all ${
                    form.gender === opt.value
                      ? 'bg-[#00e676] text-black border-[#00e676]'
                      : 'bg-white/4 text-white/60 border-white/10 hover:border-white/20'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={submit}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#00e676] text-black font-semibold text-sm hover:bg-[#00e676]/90 transition-colors disabled:opacity-60 mt-2"
          >
            {loading ? 'Saving...' : prefilled ? 'Update & View Certificate →' : 'Generate My Certificate →'}
          </button>
        </div>
      </div>
    </div>
  )
}
