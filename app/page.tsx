import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { CHAPTERS } from '@/lib/chapters'
import Globe from './components/Globe'
import { LogoFull, LogoMark } from './components/Logo'

export default async function HomePage() {
  const session = await getSession()

  const chapters = CHAPTERS.map((ch, i) => ({
    n: String(ch.order).padStart(2, '0'),
    t: ch.title,
    d: ch.summary || '',
    ref: ch.ref || '',
    slug: ch.slug,
    time: [8, 6, 9, 11, 12, 14, 10, 13][i] + ' min',
  }))

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>

      {/* ===== NAV ===== */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 80, backdropFilter: 'saturate(1.2) blur(14px)', background: 'rgba(7,8,7,.65)', borderBottom: '1px solid var(--line)' }}>
        <div className="nav-inner">
          {/* Landing page: full logo (mark + divider + Learn) */}
          <LogoFull size={40} />

          {/* Right side only — no center nav links */}
          <div className="nav-right">
            {session ? (
              <>
                <Link href="/dashboard" className="btn-outline">Dashboard</Link>
                <Link href="/learn" className="btn-primary">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                  Continue
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-outline">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="3.5"/><path d="M4.5 19.5c1.5-3.5 4.5-5 7.5-5s6 1.5 7.5 5"/></svg>
                  Sign in
                </Link>
                <Link href="/register" className="btn-primary">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <div className="hero">
        {/* Real animated geo-wireframe globe */}
        <Globe size={1400} />

        <div className="hero-inner">
          <h1 className="hero-h1">
            <span className="hero-accent">Differential Equations.</span>
            <span>Simplified.</span>
          </h1>
          <p className="hero-sub">
            <span className="hero-star">*</span>Learn for free. Sign up to track your progress.
          </p>
          <div className="hero-cta">
            <Link href="/faq" className="btn-outline-lg">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 4 2c-.7.5-1.5 1-1.5 2"/><circle cx="12" cy="16.5" r=".5" fill="currentColor"/></svg>
              FAQ
            </Link>
            <Link href="/register" className="btn-primary-lg">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
              Get Started
            </Link>
          </div>
        </div>

        <div className="hero-stats">
          {[['08','Chapters'],['42+','Quiz problems'],['3h','Avg. completion'],['1','Certificate']].map(([n,l]) => (
            <div key={l} className="hero-stat">
              <div className="hero-stat-n">{n}</div>
              <div className="hero-stat-l">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== FEATURE STRIP ===== */}
      <div className="strip">
        <div className="strip-inner">
          <span>Reference · <b>H.K. Dass · Engineering Mathematics</b></span>
          <span className="sep">/</span>
          <span>Sections <b>3.9–3.11</b></span>
          <span className="sep">/</span>
          <span>Interactive · <b>quizzes</b> after every chapter</span>
          <span className="sep">/</span>
          <span>Free · <b>forever</b></span>
        </div>
      </div>

      {/* ===== CHAPTER LIST ===== */}
      <div className="chapters-wrap">
        <div className="section-head">
          <div>
            <div className="sec-tag">/ Curriculum</div>
            <h2>From first <em>derivative</em><br/>to a signed certificate.</h2>
          </div>
          <p className="sec-note">Eight focused chapters that build on each other — read, work an example, take the quiz, move on.</p>
        </div>
        <div className="chapter-list">
          {chapters.map((ch) => (
            <Link key={ch.slug} href={`/learn/${ch.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
              <div className="chap">
                <div className="chap-num">CH {ch.n}</div>
                <div className="chap-body">
                  <div className="chap-t">{ch.t}</div>
                  <div className="chap-d">{ch.d}</div>
                </div>
                {ch.ref && <div className="chap-ref">{ch.ref}</div>}
                <div className="chap-time">{ch.time}</div>
                <div className="chap-arr">→</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ===== CTA ===== */}
      <div className="closer">
        <h3>Ready to start <em>chapter one?</em></h3>
        <p>No credit card. No email required to read. Sign up only when you want to save your progress.</p>
        <div className="closer-cta">
          <Link href="/curriculum" className="btn-primary-lg">Start Learning →</Link>
          <Link href="/register" className="btn-outline-lg">Create account</Link>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="foot">
        <div className="foot-inner">
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <LogoMark size={24} />
            <span>© 2026 dy/dx Learn · Built for CSE 2nd Semester</span>
          </div>
          <div className="foot-links">
            {['About','Curriculum','Reference'].map(l => <Link key={l} href="/">{l}</Link>)}
          </div>
        </div>
      </footer>

      <style>{`
        .nav-inner { max-width:1280px;margin:0 auto;padding:18px 32px;display:flex;align-items:center;justify-content:space-between }
        .brand-link { display:flex;align-items:center;gap:12px;text-decoration:none;color:inherit }
        .brand-mark { width:38px;height:38px;border:1.5px solid var(--text);border-radius:10px;display:grid;place-items:center;position:relative;font-family:var(--font-mono),monospace;font-size:11px;font-weight:500;flex-shrink:0 }
        .brand-mark-inner { display:flex;flex-direction:column;align-items:flex-start;gap:1px }
        .brand-mark-inner i { font-style:normal;line-height:1 }
        .brand-mark-inner i:last-child { border-top:1.2px solid var(--text);padding-top:1px;margin-top:1px }
        .brand-dot { position:absolute;color:var(--mint);font-size:18px;right:3px;top:-1px }
        .brand-name { font-weight:700;font-size:17px;letter-spacing:-0.02em }
        .nav-right { display:flex;gap:10px;align-items:center }

        .btn-primary { display:inline-flex;align-items:center;gap:8px;padding:11px 20px;border-radius:999px;font-size:13.5px;font-weight:600;background:var(--mint);color:#06160E;text-decoration:none;transition:.18s;white-space:nowrap;border:none }
        .btn-primary:hover { background:#5BFBA8;box-shadow:0 0 0 6px rgba(61,244,154,.12) }
        .btn-outline { display:inline-flex;align-items:center;gap:8px;padding:11px 20px;border-radius:999px;font-size:13.5px;font-weight:600;border:1px solid rgba(255,255,255,.18);color:var(--text);background:rgba(255,255,255,.02);text-decoration:none;transition:.18s;white-space:nowrap }
        .btn-outline:hover { border-color:rgba(255,255,255,.4);background:rgba(255,255,255,.05) }
        .btn-primary-lg { display:inline-flex;align-items:center;gap:8px;padding:15px 28px;border-radius:999px;font-size:14.5px;font-weight:600;background:var(--mint);color:#06160E;text-decoration:none;transition:.18s;white-space:nowrap;border:none }
        .btn-primary-lg:hover { background:#5BFBA8;box-shadow:0 0 0 8px rgba(61,244,154,.12) }
        .btn-outline-lg { display:inline-flex;align-items:center;gap:8px;padding:15px 28px;border-radius:999px;font-size:14.5px;font-weight:600;border:1px solid rgba(255,255,255,.22);color:var(--text);background:rgba(255,255,255,.03);text-decoration:none;transition:.18s;white-space:nowrap }
        .btn-outline-lg:hover { border-color:rgba(255,255,255,.45);background:rgba(255,255,255,.06) }

        .hero { position:relative;min-height:calc(100vh - 75px);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 32px 100px;text-align:center;overflow:hidden }
        .hero-inner { position:relative;z-index:2;max-width:920px }
        .hero-h1 { font-weight:800;font-size:clamp(52px,8.5vw,108px);line-height:.98;letter-spacing:-0.035em;margin:0 0 22px }
        .hero-accent { color:var(--mint);display:block }
        .hero-sub { color:var(--muted);font-size:16px;margin:0 0 36px;letter-spacing:.01em }
        .hero-star { color:var(--mint);margin-right:4px }
        .hero-cta { display:flex;gap:14px;justify-content:center;flex-wrap:wrap }
        .hero-stats { position:relative;z-index:2;margin-top:80px;display:flex;gap:52px;justify-content:center;flex-wrap:wrap }
        .hero-stat { text-align:center }
        .hero-stat-n { font-size:30px;font-weight:700;letter-spacing:-.02em;color:var(--mint) }
        .hero-stat-l { font-size:11px;text-transform:uppercase;letter-spacing:.14em;color:var(--muted);margin-top:6px }

        .strip { border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:24px 0;background:rgba(255,255,255,.015) }
        .strip-inner { max-width:1280px;margin:0 auto;padding:0 32px;display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap;font-size:13px;color:var(--muted) }
        .strip-inner b { color:var(--text);font-weight:600 }
        .sep { color:var(--dim) }

        .chapters-wrap { max-width:1280px;margin:0 auto;padding:120px 32px 80px }
        .section-head { display:flex;justify-content:space-between;align-items:flex-end;gap:32px;flex-wrap:wrap;margin-bottom:48px }
        .section-head h2 { font-size:clamp(40px,5vw,64px);font-weight:800;letter-spacing:-0.035em;line-height:.95;margin:0;max-width:680px }
        .section-head h2 em { font-style:normal;color:var(--mint) }
        .sec-note { max-width:340px;color:var(--muted);margin:0 }
        .sec-tag { display:inline-block;font-size:11px;text-transform:uppercase;letter-spacing:.16em;color:var(--mint);margin-bottom:16px }

        .chapter-list { display:flex;flex-direction:column;gap:1px;background:var(--line);border:1px solid var(--line);border-radius:20px;overflow:hidden }
        .chap { display:grid;grid-template-columns:80px 1fr auto auto 44px;align-items:center;gap:20px;padding:26px 28px;background:var(--bg);transition:.2s;cursor:pointer }
        .chap:hover { background:#0D120F }
        .chap:hover .chap-arr { background:var(--mint);color:#06160E;border-color:var(--mint) }
        .chap-num { font-family:var(--font-mono),monospace;font-size:12px;color:var(--mint);letter-spacing:.08em;font-weight:600;white-space:nowrap }
        .chap-body { min-width:0 }
        .chap-t { font-size:17px;font-weight:700;letter-spacing:-0.015em;color:var(--text);margin-bottom:5px }
        .chap-d { font-weight:400;color:var(--muted);font-size:13px;letter-spacing:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap }
        .chap-ref { font-size:11px;color:var(--mint);font-family:var(--font-mono),monospace;background:var(--mint-soft);border:1px solid rgba(61,244,154,.2);padding:4px 10px;border-radius:6px;white-space:nowrap }
        .chap-time { font-size:12px;color:var(--dim);font-family:var(--font-mono),monospace;white-space:nowrap;text-align:right }
        .chap-arr { width:36px;height:36px;border-radius:50%;border:1px solid var(--line-2);display:grid;place-items:center;color:var(--muted);transition:.2s;flex-shrink:0;justify-self:end }

        .closer { max-width:1280px;margin:0 auto;padding:80px 32px 120px;text-align:center }
        .closer h3 { font-size:clamp(36px,4vw,56px);font-weight:800;letter-spacing:-0.03em;margin:0 0 16px }
        .closer h3 em { font-style:normal;color:var(--mint) }
        .closer p { color:var(--muted);max-width:540px;margin:0 auto 28px }
        .closer-cta { display:flex;gap:12px;justify-content:center;flex-wrap:wrap }

        .foot { border-top:1px solid var(--line);padding:40px 0;background:var(--bg-2) }
        .foot-inner { max-width:1280px;margin:0 auto;padding:0 32px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:18px;font-size:12.5px;color:var(--muted) }
        .foot-links { display:flex;gap:18px }
        .foot-links a { color:var(--muted);text-decoration:none }
        .foot-links a:hover { color:var(--text) }

        @media(max-width:768px){
          .chap { grid-template-columns:auto 1fr auto !important }
          .chap-ref,.chap-time { display:none !important }
          .chap-body .chap-d { display:none }
          .hero-h1 { font-size:clamp(38px,11vw,72px) }
          .hero-stats { gap:28px }
          .strip-inner { flex-direction:column;align-items:flex-start;gap:8px }
          .strip-inner .sep { display:none }
        }
      `}</style>
    </div>
  )
}
