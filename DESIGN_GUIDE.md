# DESIGN_GUIDE.md — dy/dx Learn

> Living design system reference. Updated when new components or tokens are added.
> Last updated: 2026-05-13

---

## Brand

| | Value |
|---|---|
| Name | dy/dx Learn |
| Logo | `public/logo.svg` — custom SVG mark (dy over dx with fraction bar) |
| Logo variants | `LogoFull` (mark + divider + "Learn" wordmark) — landing page only; `LogoMark` (mark only) — all inner pages |
| Tagline | "Differential Equations. Simplified." |

---

## Color Tokens

Defined in `globals.css` as CSS custom properties.

| Token | Hex | Usage |
|---|---|---|
| `--bg` | `#070807` | Page background |
| `--bg-2` | `#0E1110` | Footer, secondary surfaces |
| `--panel` | `rgba(19,23,21,.5)` | Glassmorphism panels |
| `--line` | `#1F2421` | Primary borders, dividers |
| `--line-2` | `#2A312D` | Card borders, input borders |
| `--text` | `#F3F6F4` | Primary text |
| `--muted` | `#8A938E` | Secondary text, labels |
| `--dim` | `#5D6661` | Tertiary text, read-time |
| `--mint` | `#3DF49A` | Accent — CTAs, highlights, math color |
| `--mint-2` | `#27D685` | Darker mint hover states |
| `--mint-soft` | `rgba(61,244,154,.12)` | Accent backgrounds (badges, highlights) |
| `--rose` | `#F26B6B` | Error / wrong answer |

**Legacy aliases** (kept for Tailwind class compat):
- `--accent` = `--mint`
- `--accent-dim` = `--mint-soft`
- `--border` = `--line`
- `--surface` = `rgba(255,255,255,.03)`

---

## Background Effects

Applied globally via `body::before` and `body::after` (fixed, pointer-events: none, z-index: 0).

```css
/* Faint grid overlay */
body::before {
  background-image:
    linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px);
  background-size: 48px 48px;
  opacity: .5;
}

/* Ambient mint glow (bottom + top-right) */
body::after {
  background:
    radial-gradient(900px 600px at 50% 110%, rgba(61,244,154,.10), transparent 70%),
    radial-gradient(700px 500px at 100% -10%, rgba(61,244,154,.05), transparent 70%);
}
```

All page content lives in `position: relative; z-index: 1`.

---

## Typography

| Role | Font | Weights | Usage |
|---|---|---|---|
| Body | Plus Jakarta Sans (`--font-jakarta`) | 400, 500, 600, 700, 800 | All body text, headings, UI |
| Mono | JetBrains Mono (`--font-mono`) | 400, 500 | Chapter numbers, labels, math notation, code |

**Scale (common sizes):**

| Usage | Size | Weight |
|---|---|---|
| Hero heading | `clamp(52px, 8.5vw, 108px)` | 800 |
| Section heading | `clamp(40px, 5vw, 64px)` | 800 |
| Page title (curriculum, faq) | `clamp(44px, 6vw, 80px)` | 800 |
| Chapter title | `19–20px` | 700 |
| Article body | `15.5px` | 400 |
| Labels / eyebrows | `11px`, `letter-spacing: .16–.18em`, uppercase | 500–600 |
| Mono labels (CH 01) | `12–13px` | 600 |

**Letter spacing conventions:**
- Large headings: `-0.03em` to `-0.035em`
- Body: `0` to `-0.005em`
- Mono labels: `+0.06em` to `+0.18em`
- Eyebrows: `+0.16em` to `+0.18em`

---

## Button Variants

All buttons use `border-radius: 999px` (fully rounded pills).

| Variant | Background | Text | Border | Usage |
|---|---|---|---|---|
| Primary (`btn-primary-lg`) | `var(--mint)` | `#06160E` | none | Main CTAs (Get Started, Submit) |
| Outline (`btn-outline-lg`) | `rgba(255,255,255,.03)` | `var(--text)` | `rgba(255,255,255,.22)` | Secondary CTAs (FAQ, Explore) |
| Primary small | `var(--mint)` | `#06160E` | none | Nav Get Started, quiz submit |
| Outline small | `rgba(255,255,255,.02)` | `var(--text)` | `rgba(255,255,255,.18)` | Nav Sign in |
| Ghost mint | transparent | `var(--mint)` | `rgba(61,244,154,.3)` | Take quiz, chapter quiz |

**Hover states:**
- Primary: `background: #5BFBA8; box-shadow: 0 0 0 6–8px rgba(61,244,154,.12)`
- Outline: `border-color: rgba(255,255,255,.4); background: rgba(255,255,255,.05)`

---

## Input Fields

```css
/* Auth form inputs */
background: #0B0F0D;
border: 1px solid var(--line-2);
border-radius: 10px;
padding: 13px 16px;
font-size: 14.5px;
color: var(--text);

/* Focus */
border-color: var(--mint);
box-shadow: 0 0 0 4px rgba(61,244,154,.08);
```

Labels: `11px`, `uppercase`, `letter-spacing: .14em`, `color: var(--muted)`.

---

## Component Patterns

### Nav (all pages)
- `position: sticky; top: 0`
- `backdrop-filter: saturate(1.2) blur(14px); background: rgba(7,8,7,.65)`
- `border-bottom: 1px solid var(--line)`
- Height: `64px` (inner pages) or `~75px` (landing)

### Cards / Panels
- `border: 1px solid var(--line-2); border-radius: 12–18px`
- Background: `rgba(255,255,255,.02)` or `#0B0F0D` (darker math areas)
- Padding: `18–32px`

### Chapter Row (homepage + curriculum)
- Grid: `80px 1fr auto auto 44px`
- Padding: `26px 28px`
- CH label: mint mono, `12–13px`, `letter-spacing: .06–.08em`
- Arrow circle: 36×36, `border: 1px solid var(--line-2)` → on hover: `bg: var(--mint); color: #06160E`

### Math Blocks (`KatexBlock`)
- `div` (not span), `display: block`
- `background: #0B0F0D; border: 1px solid var(--line-2); border-left: 2px solid var(--mint)`
- `border-radius: 10px; padding: 20px 16px; text-align: center`
- Color: `var(--mint)`

### Quiz Cards
- `border-radius: 18px; padding: 28px 32px`
- `background: linear-gradient(180deg, #0B0F0D, #0A0C0B)`
- `box-shadow: 0 20px 40px -20px rgba(0,0,0,.5)`
- Question number: mint mono, `letter-spacing: .1em`
- Answer bullet: 30×30 circle, letter A/B/C/D in mono

### Certificate
- Outer container: `border: 1px solid var(--line-2); border-radius: 18px`
- `background: radial-gradient(ellipse at 50% 0%, #0E1411 0%, rgba(7,9,8,.57) 100%), #07090A`
- Corner marks: 34×34, `border: 1.5px solid var(--mint)` (4 corners, L-shape)
- Name gradient: `linear-gradient(180deg, #fff, #9BFFC8)` on `-webkit-background-clip: text`
- Seal: 104×104 circle, dashed inner ring, `border: 1.5px solid var(--mint)`

### FAQ Accordion
- Question row: `padding: 20px 0; border-bottom: 1px solid var(--line)`
- Toggle button: 28×28 circle, `+` rotates 45° on open
- Answer: `font-size: 14.5px; color: var(--muted); line-height: 1.7`

### Auth Split-Pane
- Grid: `1.05fr 1fr`
- Left pane: `background: linear-gradient(180deg, #050706 0%, #08120D 100%)`; decorative grid overlay
- Right pane: centered form, max-width 400px

### Globe (Landing hero)
- Canvas element, `position: absolute; left: 50%; bottom: -(size × 0.73)`
- Rotates at 0.06°/frame on the longitude axis
- Bangladesh (ISO 50) highlighted: `fillStyle: rgba(61,244,154,.55); shadowColor: rgba(61,244,154,.9); shadowBlur: 18`
- Country borders: `rgba(200,225,212,.28); lineWidth: 0.7`
- Graticule: `rgba(150,175,160,.08); lineWidth: 0.35`

### Logo Variants
- `LogoFull`: SVG mark (44px) + vertical divider (`1.5px, rgba(255,255,255,.25)`) + "Learn" (`font-size: 33px, weight: 800`)
- `LogoMark`: SVG mark only (size prop, default 36px)

---

## Spacing

| Name | Value | Usage |
|---|---|---|
| xs | 4–6px | Icon gaps, tight labels |
| sm | 8–12px | Button icon gaps, small card padding |
| md | 16–20px | Card gaps, section gaps |
| lg | 28–32px | Card padding, section padding |
| xl | 48–56px | Page section padding |
| 2xl | 80–120px | Hero padding, major section gaps |

---

## Borders & Radius

| Context | Radius |
|---|---|
| Buttons, pills | `999px` |
| Cards, panels | `12–18px` |
| Badges, mono tags | `6px` |
| Input fields | `10px` |
| Number badges | `8–12px` |
| Certificate | `18px` |

---

## Transitions & Animation

| Property | Duration | Easing |
|---|---|---|
| Color / background | `0.15–0.2s` | linear |
| Box shadow (hover glow) | `0.18s` | linear |
| Border color | `0.15s` | linear |
| Progress bar fill | `0.6s ease` | ease |
| Globe rotation | 60fps, `0.06°/frame` | — |
| FAQ toggle rotation | `0.2s` | linear |
| Page fade-in | `0.35s` | ease |

---

## Dark Mode

Dark-first. No light mode. Background is `#070807` (near-black with slight green tint).

All text on dark: `var(--text)` (`#F3F6F4`) for primary, `var(--muted)` (`#8A938E`) for secondary, `var(--dim)` (`#5D6661`) for tertiary.

Selection: `background: var(--mint); color: #000`

Scrollbar: 4px, `rgba(255,255,255,.1)` thumb, transparent track.
