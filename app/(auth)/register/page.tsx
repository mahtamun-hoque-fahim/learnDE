'use client'
import { useState } from 'react'
import Link from 'next/link'
import { LogoMark } from '@/app/components/Logo'
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

  const inputStyle: React.CSSProperties = {
    width: '100%', font: 'inherit', padding: '13px 16px', background: '#0B0F0D',
    border: '1px solid var(--line-2)', borderRadius: 10, color: 'var(--text)',
    fontSize: 14.5, outline: 'none', transition: '.15s', boxSizing: 'border-box',
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      {/* Left decorative pane */}
      <div style={{
        padding: '60px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(180deg, #050706 0%, #08120D 100%)',
        borderRight: '1px solid var(--line)',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(61,244,154,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(61,244,154,.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(800px 600px at 30% 60%, #000, transparent 70%)',
        }} />
        <div style={{ position: 'relative' }}>
          <h2 style={{ fontSize: 54, lineHeight: 1, fontWeight: 800, letterSpacing: '-0.03em', maxWidth: 480, margin: '0 0 20px' }}>
            Start your <em style={{ fontStyle: 'normal', color: 'var(--mint)' }}>journey</em><br />from dy/dx to<br />a signed certificate.
          </h2>
          <p style={{ color: 'var(--muted)', maxWidth: 420, margin: '0 0 36px' }}>
            Free forever. Save progress, take quizzes, earn a verifiable completion certificate.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {['8 interactive chapters · ~3 hours', '40+ quiz problems with instant feedback', 'No credit card · no email spam'].map(t => (
              <div key={t} style={{ display: 'flex', gap: 14, alignItems: 'center', fontSize: 14 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--mint-soft)', border: '1px solid rgba(61,244,154,.3)', display: 'grid', placeItems: 'center', color: 'var(--mint)', flexShrink: 0, fontSize: 12 }}>✓</div>
                {t}
              </div>
            ))}
          </div>
        </div>
        {/* Decorative graph */}
        <svg style={{ position: 'absolute', right: -80, bottom: -80, width: 520, height: 520, opacity: .4, pointerEvents: 'none' }} viewBox="0 0 400 400" fill="none">
          <line x1="40" y1="320" x2="360" y2="320" stroke="rgba(61,244,154,.2)" strokeWidth=".5"/>
          <line x1="40" y1="40" x2="40" y2="320" stroke="rgba(61,244,154,.2)" strokeWidth=".5"/>
          <path d="M40 320 L 100 290 L 160 240 L 220 170 L 280 100 L 340 60" stroke="#3DF49A" strokeWidth="1.4" fill="none"/>
          {[[100,290],[160,240],[220,170],[280,100],[340,60]].map(([x,y],i) => (
            <circle key={i} cx={x} cy={y} r={i===4?6:4} fill="#3DF49A"/>
          ))}
        </svg>
      </div>

      {/* Right form pane */}
      <div style={{ padding: '60px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ maxWidth: 400, width: '100%', margin: '0 auto' }}>
          <LogoMark size={34} />

          <h2 style={{ fontSize: 48, fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 8px' }}>
            Create <em style={{ fontStyle: 'normal', color: 'var(--mint)' }}>account</em>
          </h2>
          <p style={{ color: 'var(--muted)', marginBottom: 32 }}>All you need is an email. Progress saves automatically.</p>

          <form onSubmit={handleSubmit}>
            {[
              { k: 'name', label: 'Full name', type: 'text', ph: 'Your name' },
              { k: 'email', label: 'Email', type: 'email', ph: 'you@university.edu' },
              { k: 'studentId', label: 'Student ID (optional)', type: 'text', ph: 'e.g. CSE2023001' },
              { k: 'password', label: 'Password', type: 'password', ph: 'At least 8 characters' },
            ].map(({ k, label, type, ph }) => (
              <div key={k} style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.14em', color: 'var(--muted)', marginBottom: 6 }}>{label}</label>
                <input
                  type={type} value={form[k as keyof typeof form]} onChange={set(k)}
                  required={k !== 'studentId'} placeholder={ph} style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = 'var(--mint)'; e.target.style.boxShadow = '0 0 0 4px rgba(61,244,154,.08)' }}
                  onBlur={e => { e.target.style.borderColor = 'var(--line-2)'; e.target.style.boxShadow = 'none' }}
                />
              </div>
            ))}

            {error && <p style={{ color: 'var(--rose)', fontSize: 13.5, marginBottom: 12 }}>{error}</p>}

            <button type="submit" disabled={loading} style={{
              width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 6,
              padding: '15px 26px', borderRadius: 999, fontSize: 14.5, fontWeight: 600,
              background: 'var(--mint)', color: '#06160E', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? .6 : 1, transition: '.18s',
            }}>
              {loading ? 'Creating account...' : 'Create account →'}
            </button>
          </form>

          <div style={{ textAlign: 'center', fontSize: 13.5, color: 'var(--muted)', marginTop: 22 }}>
            Already have one?{' '}
            <Link href="/login" style={{ color: 'var(--mint)', textDecoration: 'none' }}>Sign in</Link>
          </div>
        </div>
      </div>

      <style>{`@media(max-width:768px){div[style*="gridTemplateColumns"]{grid-template-columns:1fr!important}div[style*="background: linear-gradient"]{display:none!important}}`}</style>
    </div>
  )
}
