'use client'
import Link from 'next/link'
import { useState } from 'react'
import { LogoMark } from '@/app/components/Logo'

const FAQS = [
  {
    category: 'About the Course',
    items: [
      {
        q: 'What is LearnDE?',
        a: 'LearnDE is a free, interactive course on Differential Equations built specifically for BSc (Hons.) CSE 2nd-semester students. It covers 8 focused chapters, each with in-depth explanations, worked examples, and quizzes — and issues a verified certificate when you complete everything.',
      },
      {
        q: 'What textbook is this based on?',
        a: 'The entire curriculum is drawn from H.K. Dass — Engineering Mathematics, Sections 3.9–3.11 (pages 147–158). Every chapter maps directly to a specific section so you can follow along in the book.',
      },
      {
        q: 'How many chapters are there and how long will it take?',
        a: 'There are 8 chapters, ranging from 6 to 14 minutes of reading each. Most students complete the full course in around 3 hours of focused study. You can go at your own pace — progress is saved automatically.',
      },
      {
        q: 'What topics does the course cover?',
        a: 'The course covers: Introduction to DEs, Classification (ODE/PDE, order, degree), Formation of DEs, Variable Separable Method, Homogeneous Equations, Linear DEs & Integrating Factor, Bernoulli\'s Equation, and Exact Differential Equations.',
      },
    ],
  },
  {
    category: 'Access & Accounts',
    items: [
      {
        q: 'Is it free?',
        a: 'Yes — completely free, forever. No credit card, no subscription, no hidden fees. You can read every chapter and take every quiz without even creating an account. An account is only needed to save your progress and earn a certificate.',
      },
      {
        q: 'Do I need an account to read chapters?',
        a: 'No. All chapter content and quizzes are publicly readable. You only need to sign up if you want your progress tracked across sessions or if you want to apply for a certificate.',
      },
      {
        q: 'What information do I need to sign up?',
        a: 'Just your name, a university email address, and a password. You can optionally add your Student ID. We don\'t send marketing emails — your address is only used for progress notifications and certificate verification.',
      },
    ],
  },
  {
    category: 'Quizzes',
    items: [
      {
        q: 'How do the chapter quizzes work?',
        a: 'Each chapter has a quiz of 10 questions drawn from a pool of questions. The selection rotates daily using a seeded shuffle, so you\'ll see different questions each day. You need to score 60% or higher to mark a chapter as passed.',
      },
      {
        q: 'Can I retake a quiz?',
        a: 'Yes. You can retake any chapter quiz as many times as you like. Each attempt is scored independently. Your best passing attempt is the one that counts toward your certificate eligibility.',
      },
      {
        q: 'What are bonus problems?',
        a: 'After passing a chapter quiz, you unlock AI-generated bonus practice problems for that chapter. These are harder exam-prep style problems designed to deepen your understanding beyond the quiz level.',
      },
    ],
  },
  {
    category: 'Certificate',
    items: [
      {
        q: 'How do I earn my certificate?',
        a: 'To be eligible, you must: (1) create a verified account, (2) mark all 8 chapters as read, (3) pass all 8 chapter quizzes with at least 60%, and (4) submit a certificate application from your dashboard. A moderator then reviews your submission manually.',
      },
      {
        q: 'What happens during the moderator review?',
        a: 'A human moderator checks your submission and verifies your completion data. If approved, you receive two certificates: a standard Certificate of Completion, and a Personal Quote Certificate with a custom message written specifically for you. If not approved, you\'ll receive feedback explaining why.',
      },
      {
        q: 'How long does certificate review take?',
        a: 'Usually within 24–72 hours of submitting your application. You\'ll receive an email notification when your certificate status changes.',
      },
      {
        q: 'Can I share or download my certificate?',
        a: 'Yes. Once issued, both certificates are available on your /certificate page. You can print them directly from the browser (they\'re print-optimized) or use the Download PDF button.',
      },
    ],
  },
  {
    category: 'Technical',
    items: [
      {
        q: 'Why does math notation sometimes look like code (e.g., dy/dx)?',
        a: 'All mathematical expressions are rendered using KaTeX, which requires a brief moment to load. If you see plain text like "dy/dx" instead of a rendered fraction, wait a second and refresh — it\'s a loading order issue that resolves on its own.',
      },
      {
        q: 'Is my progress saved if I close the browser?',
        a: 'Yes — as long as you\'re signed in. Progress is saved to the server each time you mark a chapter as read or submit a quiz. You can resume from any device.',
      },
      {
        q: 'Who built this?',
        a: 'LearnDE was built as a focused learning tool for CSE students. It uses Next.js, Neon PostgreSQL, KaTeX for math rendering, and d3-geo for the globe on the home page. The design is intentionally minimal so the math stays front and center.',
      },
    ],
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{
      borderBottom: '1px solid var(--line)',
      overflow: 'hidden',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px 0', background: 'none', border: 'none', cursor: 'pointer',
          textAlign: 'left', gap: 16,
        }}
      >
        <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.01em', lineHeight: 1.4 }}>{q}</span>
        <span style={{
          width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--line-2)',
          display: 'grid', placeItems: 'center', flexShrink: 0, color: 'var(--muted)',
          fontSize: 18, transition: 'transform .2s, border-color .2s',
          transform: open ? 'rotate(45deg)' : 'none',
          borderColor: open ? 'var(--mint)' : 'var(--line-2)',
        }}>+</span>
      </button>
      {open && (
        <div style={{ paddingBottom: 20, paddingRight: 44 }}>
          <p style={{ fontSize: 14.5, color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>{a}</p>
        </div>
      )}
    </div>
  )
}

export default function FAQPage() {
  return (
    <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 80, backdropFilter: 'saturate(1.2) blur(14px)', background: 'rgba(7,8,7,.65)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--muted)', textDecoration: 'none', fontFamily: 'var(--font-mono),monospace', textTransform: 'uppercase', letterSpacing: '.14em' }}>
            ← Home
          </Link>
          <LogoMark size={30} />
          <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 999, background: 'var(--mint)', color: '#06160E', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            Get Started
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '72px 32px 120px' }}>
        {/* Header */}
        <div style={{ marginBottom: 72, maxWidth: 600 }}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.18em', color: 'var(--mint)', fontFamily: 'var(--font-mono),monospace', marginBottom: 16 }}>
            / FAQ
          </div>
          <h1 style={{ fontSize: 'clamp(44px,6vw,72px)', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: .98, margin: '0 0 20px', color: 'var(--text)' }}>
            Frequently asked<br /><em style={{ fontStyle: 'normal', color: 'var(--mint)' }}>questions.</em>
          </h1>
          <p style={{ fontSize: 16, color: 'var(--muted)', margin: 0, lineHeight: 1.6 }}>
            Everything you need to know about LearnDE, the quizzes, and the certificate.
          </p>
        </div>

        {/* FAQ sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 56 }}>
          {FAQS.map(section => (
            <div key={section.category}>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.18em', color: 'var(--mint)', fontFamily: 'var(--font-mono),monospace', marginBottom: 4 }}>
                {section.category}
              </div>
              <div>
                {section.items.map(item => (
                  <FAQItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ marginTop: 80, padding: '48px', borderRadius: 18, border: '1px solid var(--line-2)', background: 'rgba(61,244,154,.04)', textAlign: 'center' }}>
          <h3 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.025em', margin: '0 0 12px' }}>
            Still have questions?
          </h3>
          <p style={{ color: 'var(--muted)', marginBottom: 24, fontSize: 14 }}>
            Start reading — everything becomes clear once you're in the first chapter.
          </p>
          <Link href="/curriculum" style={{ display: 'inline-flex', padding: '13px 28px', borderRadius: 999, background: 'var(--mint)', color: '#06160E', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
            View curriculum →
          </Link>
        </div>
      </div>
    </div>
  )
}
