# DESIGN_GUIDE.md — LearnD.E.

> Living design system reference. Updated when new components or tokens are added.
> Last updated: 2025-05-10

---

## Color Tokens

| Token | Tailwind / Hex | Usage |
|---|---|---|
| Background | `#080808` | Page background (slightly darker than standard `#0a0a0a`) |
| Surface | `white/4` → `white/8` | Cards, panels, hover states |
| Border | `white/5` → `white/15` | Dividers, card outlines |
| Accent | `#00e676` | CTAs, active states, progress bars, cert borders |
| Accent Dim | `#00e676/10` → `/20` | Accent backgrounds, badge fills |
| Text Primary | `text-white` | Headings, values |
| Text Secondary | `text-white/60` | Body copy, descriptions |
| Text Muted | `text-white/30` → `white/40` | Labels, captions, metadata |
| Text Disabled | `text-white/20` | Placeholders, watermarks |
| Amber | `text-amber-400` / `bg-amber-500/10` | Pending status |
| Blue | `text-blue-400` / `bg-blue-500/10` | Under Review status |
| Red | `text-red-400` / `bg-red-500/10` | Rejected / error states |
| Green (same as accent) | `text-[#00e676]` / `bg-[#00e676]/5` | Approved / success |

---

## Typography

**Font Stack:**
- Headings / Labels: `Syne` (`font-syne`) — weights 400, 500, 600, 700
- Body: `Onest` (`font-onest`) — weights 400, 500, 600 — set as default on `<body>`
- Mono: `JetBrains Mono` via KaTeX CDN (used for cert IDs, code)

**Scale in use:**
| Role | Classes | Usage |
|---|---|---|
| Page title | `font-syne font-bold text-2xl` | Dashboard h1, modal headings |
| Section heading | `font-syne font-semibold text-base` | Chapter list heading, stat labels |
| Card title | `font-medium text-white text-sm` | Submission name, chapter title |
| Body | `text-sm text-white/60` | Descriptions, card body |
| Label | `text-xs text-white/50` | Form labels, metadata |
| Micro | `text-[10px] text-white/30` | Cert watermark text, tracking-widest |
| Cert display | `font-syne font-bold text-3xl md:text-4xl` | Student name on certificate |
| Cert subheading | `font-syne font-semibold text-xl text-[#00e676]` | Course name on certificate |
| Mono cert ID | `font-mono text-sm` | Certificate ID display |

---

## Spacing

Standard Tailwind scale. Key patterns used:
- Page max-width: `max-w-3xl mx-auto px-5` (learning + dashboard)
- Staff dashboard: `max-w-6xl mx-auto px-5`
- Nav height: `h-14`
- Page top padding (after fixed nav): `pt-24` or `pt-20`
- Card inner padding: `p-4` (small) / `p-5` (standard) / `p-8 md:p-12` (certificates)
- Stack gaps: `space-y-2` (lists) / `space-y-3` (form fields) / `space-y-4` (form sections)
- Grid gaps: `gap-3` (stat cards, form grids)

---

## Border Radius

| Usage | Class |
|---|---|
| Inputs, small buttons | `rounded-xl` (16px) — used everywhere consistently |
| Cards, panels | `rounded-xl` |
| Large certificates | `rounded-2xl` |
| Pill buttons (print, back) | `rounded-full` |
| Avatar circles | `rounded-full` |
| Small badges | `rounded-lg` or `rounded-full` |

---

## Component Patterns

### Nav (fixed top)
```tsx
<nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#080808]/80 backdrop-blur-md">
  <div className="max-w-3xl mx-auto px-5 h-14 flex items-center justify-between">
    {/* content */}
  </div>
</nav>
```

### Primary Button
```tsx
<button className="px-8 py-3 bg-[#00e676] text-black font-semibold rounded-full text-sm hover:bg-[#00e676]/90 disabled:opacity-60">
  Label
</button>
// Full-width form variant:
<button className="w-full py-3.5 rounded-xl bg-[#00e676] text-black font-semibold text-sm">
  Label
</button>
```

### Ghost / Secondary Button
```tsx
<button className="px-6 py-2.5 rounded-full border border-white/10 text-white/60 text-sm hover:border-white/20">
  Label
</button>
```

### Input
```tsx
<input className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#00e676]/40 transition-colors" />
```

### Textarea
```tsx
<textarea className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#00e676]/40 resize-none" />
```

### Select
```tsx
<select className="w-full px-3 py-2.5 rounded-xl bg-white/4 border border-white/10 text-white text-sm focus:outline-none">
```

### Card (standard)
```tsx
<div className="rounded-xl border border-white/8 bg-white/4 p-5">
  {/* content */}
</div>
// Hoverable:
<div className="rounded-xl border border-white/8 bg-white/3 p-4 hover:bg-white/5 hover:border-white/15 cursor-pointer transition-colors">
```

### Status Badge
```tsx
// Pending
<span className="text-xs text-amber-400 flex items-center gap-1">
  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"/> Pending
</span>
// Under Review
<span className="text-xs text-blue-400">Under Review</span>
// Approved
<span className="text-xs text-[#00e676]">Approved</span>
// Rejected
<span className="text-xs text-red-400">Rejected</span>
```

### Chip / Toggle Button (department / gender selector)
```tsx
// Active:
<button className="px-3 py-1.5 rounded-lg text-xs font-medium border bg-[#00e676] text-black border-[#00e676]">CSE</button>
// Inactive:
<button className="px-3 py-1.5 rounded-lg text-xs font-medium border bg-white/4 text-white/60 border-white/10 hover:border-white/20">CSE</button>
```

### Progress Bar
```tsx
<div className="h-2 bg-white/5 rounded-full overflow-hidden">
  <div className="h-full bg-[#00e676] rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
</div>
```

### Certificate (Completion)
```tsx
// Outer wrapper
<div className="relative rounded-2xl border-2 border-[#00e676]/25 bg-gradient-to-br from-[#00e676]/5 via-transparent to-transparent p-8 md:p-12 text-center overflow-hidden">
  {/* Corner decorations — 4x absolute divs */}
  {/* Watermark — absolute, opacity-[0.025], font-black text-[100px] rotate-[-25deg] */}
  {/* Content — relative z-10 */}
</div>
```

### Certificate (Quote)
```tsx
// Outer wrapper
<div className="relative rounded-2xl border-2 border-white/10 bg-gradient-to-br from-white/4 via-transparent to-transparent p-8 md:p-12 text-center overflow-hidden">
  {/* Corner decorations — thinner border (border not border-2) */}
  {/* Large quotation mark watermark */}
  {/* Blockquote — font-syne text-xl md:text-2xl text-white/90 */}
</div>
```

### Stat Card (staff dashboard)
```tsx
<div className="rounded-xl border border-white/8 bg-white/3 p-4">
  <div className="text-xl mb-1">{icon}</div>
  <div className="font-syne font-bold text-2xl text-[color]">{value}</div>
  <div className="text-xs text-white/40 mt-0.5">{label}</div>
</div>
```

### Avatar Circle (initials)
```tsx
<div className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center text-sm font-bold text-white/60">
  {name.charAt(0).toUpperCase()}
</div>
```

### Tab Switcher
```tsx
<div className="flex gap-1 border border-white/8 rounded-xl p-1 bg-white/2 w-fit">
  <button className="px-5 py-2 rounded-lg text-sm font-medium bg-white/10 text-white">Active</button>
  <button className="px-5 py-2 rounded-lg text-sm font-medium text-white/40 hover:text-white/60">Inactive</button>
</div>
```

### Modal Overlay
```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4 py-6 overflow-y-auto">
  <div className="w-full max-w-lg bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 my-auto">
    {/* content */}
  </div>
</div>
```

---

## Animations / Transitions

| Usage | Class |
|---|---|
| Hover borders, backgrounds | `transition-colors` |
| Progress bar fill | `transition-all duration-700` |
| Toggle switch thumb | `transition-all` |
| Everything else | `transition-colors` (default) |

No page transitions or heavy animations. Motion is minimal and purposeful.

---

## Dark Mode Notes

- Dark-first, no light mode.
- Background layers: `#080808` (page) → `white/4` (card) → `white/8` (hover/elevated)
- Never pure white text — `text-white` is the maximum (approx `#ffffff`)
- Accent `#00e676` used on dark backgrounds only
- Print styles: `print:hidden` on nav and action buttons; certificate divs render clean
