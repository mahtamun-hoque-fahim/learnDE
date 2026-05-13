'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LogoMark } from '@/app/components/Logo'

type Sub = { status: string; displayName: string; university: string; department: string; batch?: string; gender: string; submittedAt: string }
type Cert = { certificateId: string; issuedAt: string; quoteText?: string; quoteAuthor?: string; profileSnapshot?: Record<string, string> }


export default function CertificatePage() {
  const [sub, setSub] = useState<Sub | null>(null)
  const [cert, setCert] = useState<Cert | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/submissions').then(r => r.json()).then(d => {
      setSub(d.submission)
      setCert(d.certificate)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ color: 'var(--muted)', fontSize: 13, fontFamily: 'var(--font-mono),monospace', animation: 'pulse 2s infinite' }}>Loading...</div>
    </div>
  )

  const Nav = () => (
    <nav style={{ position: 'sticky', top: 0, zIndex: 80, backdropFilter: 'saturate(1.2) blur(14px)', background: 'rgba(7,8,7,.6)', borderBottom: '1px solid var(--line)' }} className="print:hidden">
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '18px 32px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--muted)', textDecoration: 'none' }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          Dashboard
        </Link>
        <div style={{ marginLeft: 'auto' }}>
          <LogoMark size={30} />
        </div>
      </div>
    </nav>
  )

  if (!cert) return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <Nav />
      <div style={{ padding: '80px 32px', maxWidth: 540, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 20 }}>🔒</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 12px' }}>Certificate Not Issued Yet</h1>
        <p style={{ color: 'var(--muted)', marginBottom: 28 }}>
          Your submission is {sub?.status === 'under_review' ? 'under review' : 'pending review'}.
          You&apos;ll be notified by email once it&apos;s approved.
        </p>
        <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 20px', borderRadius: 999, border: '1px solid rgba(255,255,255,.18)', color: 'var(--text)', background: 'rgba(255,255,255,.02)', textDecoration: 'none', fontSize: 13.5, fontWeight: 600 }}>← Back to Dashboard</Link>
      </div>
    </div>
  )

  const profile = (cert.profileSnapshot ?? sub) as Record<string, string>
  const issuedDate = new Date(cert.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const certId = cert.certificateId

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <Nav />

      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '64px 32px 120px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap', marginBottom: 36 }} className="print:hidden">
          <div>
            <h2 style={{ fontSize: 56, fontWeight: 800, letterSpacing: '-0.03em', margin: 0 }}>
              Your <em style={{ fontStyle: 'normal', color: 'var(--mint)' }}>certificate</em>
            </h2>
            <p style={{ margin: '10px 0 0', color: 'var(--muted)', maxWidth: 480 }}>
              Verified & approved. Two certificates are issued upon completion.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => window.print()} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 20px', borderRadius: 999, border: '1px solid rgba(255,255,255,.18)', color: 'var(--text)', background: 'rgba(255,255,255,.02)', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}>
              Print Both
            </button>
            <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 20px', borderRadius: 999, background: 'var(--mint)', color: '#06160E', border: 'none', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}>
              Download PDF ↓
            </button>
          </div>
        </div>

        {/* ── Certificate 1: Completion ── */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.14em', color: 'var(--muted)', marginBottom: 12, fontFamily: 'var(--font-mono),monospace' }} className="print:hidden">① Certificate of Completion</p>

          <div id="cert-completion" style={{
            background: 'radial-gradient(ellipse at 50% 0%, #0E1411 0%, rgba(7,9,8,.57) 100%), #07090A',
            border: '1px solid var(--line-2)', padding: '72px 80px', borderRadius: 18,
            position: 'relative', overflow: 'hidden',
            boxShadow: '0 60px 120px -40px rgba(0,0,0,.6), inset 0 0 0 1px rgba(255,255,255,.02)',
          }}>
            {/* Grid overlay */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(61,244,154,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(61,244,154,.04) 1px, transparent 1px)', backgroundSize: '32px 32px', maskImage: 'radial-gradient(900px 600px at 50% 50%, #000, transparent 75%)', pointerEvents: 'none' }} />

            {/* Corner marks */}
            {[
              { top: 22, left: 22, borderRight: 0, borderBottom: 0 },
              { top: 22, right: 22, borderLeft: 0, borderBottom: 0 },
              { bottom: 22, left: 22, borderRight: 0, borderTop: 0 },
              { bottom: 22, right: 22, borderLeft: 0, borderTop: 0 },
            ].map((s, i) => (
              <div key={i} style={{ position: 'absolute', width: 34, height: 34, border: '1.5px solid var(--mint)', ...s }} />
            ))}

            <div style={{ position: 'relative' }}>
              {/* Top row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 50 }}>
                <LogoMark size={30} />
                <div style={{ fontFamily: 'var(--font-mono),monospace', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.16em' }}>No. {certId}</div>
              </div>

              {/* Body */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-mono),monospace', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.28em', color: 'var(--mint)', marginBottom: 24 }}>— Certificate of Completion —</div>
                <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 20, letterSpacing: '.04em' }}>This is to certify that</p>
                <h1 style={{ fontSize: 'clamp(48px,7vw,96px)', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.04em', margin: '0 0 18px', background: 'linear-gradient(180deg, #fff, #9BFFC8)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                  {profile.displayName}
                </h1>
                <div style={{ width: 96, height: 2, background: 'var(--mint)', margin: '0 auto 26px', boxShadow: '0 0 12px var(--mint)' }} />
                <p style={{ fontSize: 14.5, maxWidth: 560, margin: '0 auto 18px', color: 'var(--muted)', lineHeight: 1.65 }}>
                  has successfully completed every chapter, passed all eight quizzes, and demonstrated working command of
                </p>
                <p style={{ fontSize: 24, color: 'var(--text)', fontWeight: 700, letterSpacing: '-.015em', margin: 0 }}>
                  <em style={{ fontStyle: 'normal', color: 'var(--mint)' }}>Differential Equations</em> — first order, first degree.
                </p>
                {profile.university && (
                  <p style={{ marginTop: 12, color: 'var(--muted)', fontSize: 13 }}>{profile.university} · {profile.department}</p>
                )}
              </div>

              {/* Footer */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 48, marginTop: 72, alignItems: 'end' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ paddingBottom: 8, borderBottom: '1px solid var(--line-2)', fontSize: 18, fontWeight: 600, letterSpacing: '-.01em' }}>Course Faculty</div>
                  <div style={{ fontFamily: 'var(--font-mono),monospace', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.14em', color: 'var(--muted)', marginTop: 8 }}>Authorized Signatory</div>
                </div>
                <div style={{ width: 104, height: 104, border: '1.5px solid var(--mint)', borderRadius: '50%', display: 'grid', placeItems: 'center', textAlign: 'center', color: 'var(--mint)', fontFamily: 'var(--font-mono),monospace', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', position: 'relative', lineHeight: 1.4 }}>
                  <div style={{ position: 'absolute', inset: 6, border: '1px dashed rgba(61,244,154,.5)', borderRadius: '50%' }} />
                  dy/dx<br/>2026
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ paddingBottom: 8, borderBottom: '1px solid var(--line-2)', fontSize: 18, fontWeight: 600, letterSpacing: '-.01em' }}>{issuedDate}</div>
                  <div style={{ fontFamily: 'var(--font-mono),monospace', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.14em', color: 'var(--muted)', marginTop: 8 }}>Date Issued</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Certificate 2: Quote ── */}
        {cert.quoteText && (
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.14em', color: 'var(--muted)', marginBottom: 12, fontFamily: 'var(--font-mono),monospace' }} className="print:hidden">② Personal Quote Certificate</p>
            <div id="cert-quote" style={{
              background: 'radial-gradient(ellipse at 50% 0%, #0E1411 0%, rgba(7,9,8,.57) 100%), #07090A',
              border: '1px solid var(--line-2)', padding: '72px 80px', borderRadius: 18,
              position: 'relative', overflow: 'hidden',
              boxShadow: '0 60px 120px -40px rgba(0,0,0,.6)',
            }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(61,244,154,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(61,244,154,.03) 1px, transparent 1px)', backgroundSize: '32px 32px', maskImage: 'radial-gradient(900px 600px at 50% 50%, #000, transparent 75%)', pointerEvents: 'none' }} />
              {[{ top: 22, left: 22, borderRight: 0, borderBottom: 0 }, { top: 22, right: 22, borderLeft: 0, borderBottom: 0 }, { bottom: 22, left: 22, borderRight: 0, borderTop: 0 }, { bottom: 22, right: 22, borderLeft: 0, borderTop: 0 }].map((s, i) => (
                <div key={i} style={{ position: 'absolute', width: 34, height: 34, border: '1px solid rgba(255,255,255,.2)', ...s }} />
              ))}
              <div style={{ position: 'relative', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-mono),monospace', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.28em', color: 'var(--muted)', marginBottom: 32 }}>— Personal Quote Certificate —</div>
                <div style={{ fontSize: 64, opacity: .15, lineHeight: 1, marginBottom: 24 }}>&ldquo;</div>
                <blockquote style={{ fontSize: 'clamp(18px,2.5vw,24px)', fontWeight: 700, lineHeight: 1.4, letterSpacing: '-.01em', maxWidth: 600, margin: '0 auto 24px', color: 'var(--text)' }}>
                  {cert.quoteText}
                </blockquote>
                {cert.quoteAuthor && <p style={{ color: 'var(--mint)', fontSize: 14, marginBottom: 40 }}>— {cert.quoteAuthor}</p>}
                <div style={{ borderTop: '1px solid var(--line-2)', paddingTop: 24, marginTop: 8 }}>
                  <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 6 }}>Personally written for</p>
                  <p style={{ fontWeight: 700, fontSize: 18, margin: '0 0 4px' }}>{profile.displayName}</p>
                  <p style={{ color: 'var(--dim)', fontSize: 12 }}>{profile.university} · {profile.department}</p>
                  <p style={{ color: 'var(--dim)', fontSize: 11, marginTop: 12, fontFamily: 'var(--font-mono),monospace' }}>Issued {issuedDate} · {certId}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
