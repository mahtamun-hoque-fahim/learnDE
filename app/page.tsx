import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { CHAPTERS } from '@/lib/chapters'

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

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 80, backdropFilter: 'saturate(1.2) blur(14px)', background: 'rgba(7,8,7,.6)', borderBottom: '1px solid var(--line)' }}>
        <div className="nav-inner">
          <Link href="/" className="brand-link">
            <div className="brand-mark">
              <span className="brand-mark-inner"><i>dy</i><i>dx</i></span>
              <span className="brand-dot">·</span>
            </div>
            <span className="brand-name">dy/dx</span>
          </Link>
          <div className="nav-links">
            <Link href="/">Overview</Link>
            <Link href="/learn">Chapters</Link>
            <Link href="/learn">Quizzes</Link>
          </div>
          <div className="nav-right">
            {session ? (
              <>
                <Link href="/dashboard" className="btn-outline">Dashboard</Link>
                <Link href="/learn" className="btn-primary">Continue →</Link>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-outline">Sign in</Link>
                <Link href="/register" className="btn-primary">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div className="hero">
        <svg className="hero-paths" viewBox="0 0 1920 900" preserveAspectRatio="none" aria-hidden="true">
          <path d="M 580 -50 Q 600 250 350 420 T 480 880" stroke="rgba(255,255,255,.18)" strokeWidth="1.2" fill="none"/>
          <path d="M 1280 -50 Q 1260 280 1500 480 T 1380 880" stroke="rgba(255,255,255,.18)" strokeWidth="1.2" fill="none"/>
          <path d="M 700 -50 Q 720 200 870 320 L 870 500 L 1100 500 L 1100 880" stroke="rgba(255,255,255,.12)" strokeWidth="1" fill="none"/>
        </svg>
        <svg className="hero-globe" viewBox="-700 -700 1400 1400" aria-hidden="true">
          <defs>
            <radialGradient id="g1" cx="0" cy="0" r="700" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#0B0F0D" stopOpacity="0"/>
              <stop offset=".85" stopColor="#000" stopOpacity=".5"/>
            </radialGradient>
          </defs>
          <circle r="640" fill="url(#g1)"/>
          <g stroke="rgba(160,180,170,.18)" strokeWidth=".5" fill="none">
            <ellipse rx="640" ry="640"/><ellipse rx="640" ry="220"/><ellipse rx="640" ry="440"/>
            <ellipse rx="220" ry="640"/><ellipse rx="440" ry="640"/>
          </g>
        </svg>
        <div className="hero-inner">
          <div className="badge-pill"><span className="pip"/><span>BSc(Hons.) CSE · 2nd Semester · 8 chapters</span></div>
          <h1 className="hero-h1"><span className="hero-accent">Differential Equations.</span><span>Simplified.</span></h1>
          <p className="hero-sub"><span className="hero-star">*</span>Learn for free. Sign up to track your progress.</p>
          <div className="hero-cta">
            <Link href="/learn" className="btn-outline-lg">Explore chapters</Link>
            <Link href="/register" className="btn-primary-lg">Get Started →</Link>
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

      {/* STRIP */}
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

      {/* CHAPTER LIST */}
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
                <div className="chap-t">{ch.t}<span className="chap-d">{ch.d}</span></div>
                <div className="chap-ref">{ch.ref || '—'}</div>
                <div className="chap-time">{ch.time}</div>
                <div className="chap-arr">→</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="closer">
        <h3>Ready to start <em>chapter one?</em></h3>
        <p>No credit card. No email required to read. Sign up only when you want to save your progress.</p>
        <div className="closer-cta">
          <Link href="/learn" className="btn-primary-lg">Start Learning →</Link>
          <Link href="/register" className="btn-outline-lg">Create account</Link>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="foot">
        <div className="foot-inner">
          <span>© 2026 dy/dx · Built for CSE 2nd Semester</span>
          <div className="foot-links">
            {['About','Curriculum','Reference'].map(l => <Link key={l} href="/">{l}</Link>)}
          </div>
        </div>
      </footer>

      <style>{`
        .nav-inner { max-width:1280px;margin:0 auto;padding:18px 32px;display:flex;align-items:center;gap:28px }
        .brand-link { display:flex;align-items:center;gap:12px;text-decoration:none;color:inherit }
        .brand-mark { width:38px;height:38px;border:1.5px solid var(--text);border-radius:10px;display:grid;place-items:center;position:relative;font-family:var(--font-mono),monospace;font-size:11px;font-weight:500;flex-shrink:0 }
        .brand-mark-inner { display:flex;flex-direction:column;align-items:flex-start;gap:1px }
        .brand-mark-inner i { font-style:normal;line-height:1 }
        .brand-mark-inner i:last-child { border-top:1.2px solid var(--text);padding-top:1px;margin-top:1px }
        .brand-dot { position:absolute;color:var(--mint);font-size:18px;right:3px;top:-1px }
        .brand-name { font-weight:700;font-size:17px;letter-spacing:-0.02em }
        .nav-links { display:flex;gap:6px;margin-left:14px }
        .nav-links a { font-size:13px;padding:8px 14px;border-radius:999px;color:var(--muted);text-decoration:none;transition:.15s }
        .nav-links a:hover { color:var(--text);background:rgba(255,255,255,.04) }
        .nav-right { margin-left:auto;display:flex;gap:10px;align-items:center }
        .btn-primary { display:inline-flex;align-items:center;gap:8px;padding:11px 20px;border-radius:999px;font-size:13.5px;font-weight:600;background:var(--mint);color:#06160E;text-decoration:none;transition:.18s;white-space:nowrap }
        .btn-primary:hover { background:#5BFBA8;box-shadow:0 0 0 6px rgba(61,244,154,.12) }
        .btn-outline { display:inline-flex;align-items:center;gap:8px;padding:11px 20px;border-radius:999px;font-size:13.5px;font-weight:600;border:1px solid rgba(255,255,255,.18);color:var(--text);background:rgba(255,255,255,.02);text-decoration:none;transition:.18s;white-space:nowrap }
        .btn-outline:hover { border-color:rgba(255,255,255,.4);background:rgba(255,255,255,.05) }
        .btn-primary-lg { display:inline-flex;align-items:center;gap:8px;padding:15px 26px;border-radius:999px;font-size:14.5px;font-weight:600;background:var(--mint);color:#06160E;text-decoration:none;transition:.18s;white-space:nowrap }
        .btn-primary-lg:hover { background:#5BFBA8;box-shadow:0 0 0 6px rgba(61,244,154,.12) }
        .btn-outline-lg { display:inline-flex;align-items:center;gap:8px;padding:15px 26px;border-radius:999px;font-size:14.5px;font-weight:600;border:1px solid rgba(255,255,255,.18);color:var(--text);background:rgba(255,255,255,.02);text-decoration:none;transition:.18s;white-space:nowrap }
        .btn-outline-lg:hover { border-color:rgba(255,255,255,.4);background:rgba(255,255,255,.05) }
        
        .hero { position:relative;min-height:calc(100vh - 79px);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 32px 100px;text-align:center;overflow:hidden }
        .hero-paths { position:absolute;inset:0;pointer-events:none;z-index:0;width:100%;height:100% }
        .hero-globe { position:absolute;left:50%;bottom:-340px;transform:translateX(-50%);width:1400px;height:1400px;pointer-events:none;opacity:.55;z-index:0 }
        .hero-inner { position:relative;z-index:2;max-width:920px }
        .badge-pill { display:inline-flex;align-items:center;gap:8px;padding:6px 14px;border-radius:999px;border:1px solid var(--line-2);background:rgba(255,255,255,.02);font-size:12px;color:var(--muted);margin-bottom:36px }
        .pip { width:6px;height:6px;border-radius:50%;background:var(--mint);box-shadow:0 0 10px var(--mint);display:inline-block;flex-shrink:0 }
        .hero-h1 { font-weight:800;font-size:clamp(56px,9vw,116px);line-height:.98;letter-spacing:-0.035em;margin:0 0 22px }
        .hero-accent { color:var(--mint);display:block }
        .hero-sub { color:var(--muted);font-size:16px;margin:0 0 36px;letter-spacing:.01em }
        .hero-star { color:var(--mint);margin-right:4px }
        .hero-cta { display:flex;gap:14px;justify-content:center;flex-wrap:wrap }
        .hero-stats { position:relative;z-index:2;margin-top:80px;display:flex;gap:48px;justify-content:center;flex-wrap:wrap }
        .hero-stat { text-align:center }
        .hero-stat-n { font-size:28px;font-weight:700;letter-spacing:-.02em;color:var(--mint) }
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
        
        .chapter-list { display:grid;grid-template-columns:1fr;gap:1px;background:var(--line);border:1px solid var(--line);border-radius:18px;overflow:hidden }
        .chap { display:grid;grid-template-columns:80px 1fr auto auto auto;align-items:center;gap:24px;padding:24px 28px;background:var(--bg);cursor:pointer;transition:.2s }
        .chap:hover { background:#0F1311 }
        .chap:hover .chap-arr { background:var(--mint);color:#06160E;border-color:var(--mint) }
        .chap-num { font-family:var(--font-mono),monospace;font-size:13px;color:var(--mint);letter-spacing:.04em }
        .chap-t { font-size:20px;font-weight:600;letter-spacing:-0.015em;color:var(--text) }
        .chap-d { display:block;font-weight:400;color:var(--muted);font-size:13.5px;margin-top:4px;letter-spacing:0 }
        .chap-time { font-size:12px;color:var(--muted);font-family:var(--font-mono),monospace;min-width:64px;text-align:right }
        .chap-ref { font-size:11px;color:var(--mint);font-family:var(--font-mono),monospace;background:var(--mint-soft);border:1px solid rgba(61,244,154,.2);padding:4px 8px;border-radius:6px;min-width:84px;text-align:center }
        .chap-arr { width:36px;height:36px;border-radius:50%;border:1px solid var(--line-2);display:grid;place-items:center;color:var(--muted);transition:.2s;flex-shrink:0 }
        
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
        
        @media (max-width:768px) {
          .nav-links { display:none }
          .chap { grid-template-columns:auto 1fr auto !important }
          .chap-time,.chap-ref { display:none !important }
          .hero-h1 { font-size:clamp(40px,12vw,80px) }
        }
      `}</style>
    </div>
  )
}
