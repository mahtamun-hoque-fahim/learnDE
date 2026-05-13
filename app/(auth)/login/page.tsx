'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
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
            Welcome <em style={{ fontStyle: 'normal', color: 'var(--mint)' }}>back.</em><br />Pick up<br />where you<br />left off.
          </h2>
          <p style={{ color: 'var(--muted)', maxWidth: 420, margin: '0 0 36px' }}>
            Your last session is saved. Continue from where you stopped.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {['Progress saved across devices', 'Quiz scores & streaks tracked', 'Certificate ready when you finish'].map(t => (
              <div key={t} style={{ display: 'flex', gap: 14, alignItems: 'center', fontSize: 14 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--mint-soft)', border: '1px solid rgba(61,244,154,.3)', display: 'grid', placeItems: 'center', color: 'var(--mint)', flexShrink: 0, fontSize: 12 }}>✓</div>
                {t}
              </div>
            ))}
          </div>
        </div>
        <svg style={{ position: 'absolute', right: -80, bottom: -80, width: 520, height: 520, opacity: .4, pointerEvents: 'none' }} viewBox="0 0 400 400" fill="none">
          <circle cx="200" cy="200" r="180" stroke="rgba(61,244,154,.3)" strokeWidth=".6"/>
          <circle cx="200" cy="200" r="130" stroke="rgba(61,244,154,.2)" strokeWidth=".6"/>
          <circle cx="200" cy="200" r="80" stroke="rgba(61,244,154,.15)" strokeWidth=".6"/>
          <path d="M40 320 Q 150 100, 360 200" stroke="rgba(61,244,154,.5)" strokeWidth="1" fill="none"/>
        </svg>
      </div>

      {/* Right form pane */}
      <div style={{ padding: '60px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ maxWidth: 400, width: '100%', margin: '0 auto' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit', marginBottom: 40 }}>
            <div style={{ width: 32, height: 32, border: '1.5px solid var(--text)', borderRadius: 8, display: 'grid', placeItems: 'center', position: 'relative', fontFamily: 'var(--font-mono),monospace', fontSize: 9, flexShrink: 0 }}>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 1 }}><i style={{ fontStyle: 'normal', lineHeight: 1 }}>dy</i><i style={{ fontStyle: 'normal', lineHeight: 1, borderTop: '1px solid var(--text)', paddingTop: 1, marginTop: 1 }}>dx</i></span>
              <span style={{ position: 'absolute', color: 'var(--mint)', fontSize: 14, right: 2, top: -2 }}>·</span>
            </div>
            <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em' }}>dy/dx</span>
          </Link>

          <h2 style={{ fontSize: 48, fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 8px' }}>
            Sign <em style={{ fontStyle: 'normal', color: 'var(--mint)' }}>in</em>
          </h2>
          <p style={{ color: 'var(--muted)', marginBottom: 32 }}>Continue your learning track.</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.14em', color: 'var(--muted)', marginBottom: 6 }}>Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="you@university.edu"
                style={{ width: '100%', font: 'inherit', padding: '13px 16px', background: '#0B0F0D', border: '1px solid var(--line-2)', borderRadius: 10, color: 'var(--text)', fontSize: 14.5, outline: 'none', transition: '.15s', boxSizing: 'border-box' }}
                onFocus={e => { e.target.style.borderColor = 'var(--mint)'; e.target.style.boxShadow = '0 0 0 4px rgba(61,244,154,.08)' }}
                onBlur={e => { e.target.style.borderColor = 'var(--line-2)'; e.target.style.boxShadow = 'none' }}
              />
            </div>
            <div style={{ marginBottom: 22 }}>
              <label style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.14em', color: 'var(--muted)', marginBottom: 6 }}>Password</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="••••••••••"
                style={{ width: '100%', font: 'inherit', padding: '13px 16px', background: '#0B0F0D', border: '1px solid var(--line-2)', borderRadius: 10, color: 'var(--text)', fontSize: 14.5, outline: 'none', transition: '.15s', boxSizing: 'border-box' }}
                onFocus={e => { e.target.style.borderColor = 'var(--mint)'; e.target.style.boxShadow = '0 0 0 4px rgba(61,244,154,.08)' }}
                onBlur={e => { e.target.style.borderColor = 'var(--line-2)'; e.target.style.boxShadow = 'none' }}
              />
            </div>

            {error && <p style={{ color: 'var(--rose)', fontSize: 13.5, marginBottom: 12 }}>{error}</p>}

            <button type="submit" disabled={loading} style={{
              width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center',
              padding: '15px 26px', borderRadius: 999, fontSize: 14.5, fontWeight: 600,
              background: 'var(--mint)', color: '#06160E', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? .6 : 1, transition: '.18s',
            }}>
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>

          <div style={{ textAlign: 'center', fontSize: 13.5, color: 'var(--muted)', marginTop: 22 }}>
            New here?{' '}
            <Link href="/register" style={{ color: 'var(--mint)', textDecoration: 'none' }}>Create an account</Link>
          </div>
          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <Link href="/learn" style={{ fontSize: 12, color: 'var(--dim)', textDecoration: 'none' }}>Continue without account →</Link>
          </div>
        </div>
      </div>

      <style>{`@media(max-width:768px){div[style*="gridTemplateColumns"]{grid-template-columns:1fr!important}div[style*="background: linear-gradient"]{display:none!important}}`}</style>
    </div>
  )
}
