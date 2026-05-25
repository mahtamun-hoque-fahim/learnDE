import Link from 'next/link'
import Image from 'next/image'

interface LogoProps {
  variant?: 'full' | 'mark'
  href?: string
  size?: number
}

/**
 * Bare logo image — no Link wrapper, no margin.
 * Use inside <NavItem icon={...}> where the parent <a> already
 * handles navigation. Sized to fit the 15px nav icon slot by default.
 *
 * Note: the underlying SVG has fill="white" baked in, so this won't
 * inherit text-color. Active highlighting on nav items happens via
 * background/border, which is the correct affordance for a brand mark.
 */
export function LogoIcon({ size = 15 }: { size?: number }) {
  return (
    <Image
      src="/logo.svg"
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      priority
      style={{ display: 'block' }}
    />
  )
}

// Mark only — used on all inner pages
export function LogoMark({ size = 36, href = '/' }: { size?: number; href?: string }) {
  return (
    <Link href={href} style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
      <Image src="/logo.svg" alt="LearnDE" width={size} height={size} priority style={{ display: 'block' }} />
    </Link>
  )
}

// Full — logo mark + divider + "Learn" wordmark — landing page only
export function LogoFull({ size = 44, href = '/' }: { size?: number; href?: string }) {
  return (
    <Link href={href} style={{ display: 'inline-flex', alignItems: 'center', gap: 18, textDecoration: 'none', flexShrink: 0 }}>
      <Image src="/logo.svg" alt="LearnDE" width={size} height={size} priority style={{ display: 'block' }} />
      {/* vertical divider */}
      <div style={{ width: 1.5, height: size * 0.9, background: 'rgba(255,255,255,0.25)', borderRadius: 1, flexShrink: 0 }} />
      {/* wordmark */}
      <span style={{
        fontWeight: 800,
        fontSize: size * 0.62,
        letterSpacing: '-0.03em',
        color: '#fff',
        lineHeight: 1,
      }}>LearnDE</span>
    </Link>
  )
}

export default function Logo({ variant = 'mark', href = '/', size }: LogoProps) {
  if (variant === 'full') return <LogoFull href={href} size={size ?? 44} />
  return <LogoMark href={href} size={size ?? 36} />
}
