'use client'
import { useEffect, useRef, useState } from 'react'

const STATS = [
  { target: 12,  display: (n: number) => String(n).padStart(2, '0'), suffix: '',   label: 'Chapters' },
  { target: 120, display: (n: number) => String(n),                  suffix: '+',  label: 'Quiz problems' },
  { target: 5,   display: (n: number) => String(n) + 'h',            suffix: '',   label: 'Avg. completion' },
  { target: 120, display: (n: number) => String(n),                  suffix: '+',  label: 'Users' },
]

function AnimatedStat({ target, display, suffix, label, delay }: {
  target: number; display: (n: number) => string; suffix: string; label: string; delay: number
}) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect() } },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    const timer = setTimeout(() => {
      const duration = 1200
      const steps = 40
      const interval = duration / steps
      let step = 0
      const id = setInterval(() => {
        step++
        // Ease out cubic
        const progress = 1 - Math.pow(1 - step / steps, 3)
        setCount(Math.round(progress * target))
        if (step >= steps) { setCount(target); clearInterval(id) }
      }, interval)
      return () => clearInterval(id)
    }, delay)
    return () => clearTimeout(timer)
  }, [started, target, delay])

  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <div style={{
        fontSize: 30, fontWeight: 700, letterSpacing: '-.02em',
        color: 'rgba(255,255,255,.55)',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {display(count)}{suffix}
      </div>
      <div style={{
        fontSize: 11, textTransform: 'uppercase', letterSpacing: '.14em',
        color: 'rgba(255,255,255,.3)', marginTop: 6,
      }}>
        {label}
      </div>
    </div>
  )
}

export default function HeroStats() {
  return (
    <div style={{ position: 'relative', zIndex: 2, marginTop: 80, display: 'flex', gap: 52, justifyContent: 'center', flexWrap: 'wrap' }}>
      {STATS.map((s, i) => (
        <AnimatedStat key={s.label} {...s} delay={i * 120} />
      ))}
    </div>
  )
}
