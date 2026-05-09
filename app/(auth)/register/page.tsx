'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', studentId: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      router.push('/dashboard')
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="font-syne font-bold text-2xl">
            Learn<span className="text-[#00e676]">D.E.</span>
          </Link>
          <p className="text-white/40 text-sm mt-2">Create your free account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Your name' },
            { key: 'email', label: 'Email', type: 'email', placeholder: 'you@university.edu' },
            { key: 'studentId', label: 'Student ID (optional)', type: 'text', placeholder: 'e.g. CSE2023001' },
            { key: 'password', label: 'Password', type: 'password', placeholder: 'Min 6 characters' },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label className="block text-xs text-white/50 mb-1.5">{label}</label>
              <input
                type={type}
                value={form[key as keyof typeof form]}
                onChange={set(key)}
                required={key !== 'studentId'}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00e676]/50"
                placeholder={placeholder}
              />
            </div>
          ))}

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00e676] text-black font-semibold py-2.5 rounded-lg text-sm disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-white/40 text-sm mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[#00e676] hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
