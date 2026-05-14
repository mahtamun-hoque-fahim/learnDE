# DESIGN_GUIDE.md — LearnDE

> Design system specification for LearnDE platform.  
> Last updated: 2026-05-14

---

## Color Tokens

### Primary Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-mint` | `#3DF49A` | Primary accent, CTAs, success states |
| `--color-blue` | `#60A8FA` | Info states, links, secondary actions |
| `--color-amber` | `#F5A85C` | Warning states, pending badges |
| `--color-rose` | `#F26B6B` | Danger states, error messages, delete actions |

### Background Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-primary` | `#070807` | Main background |
| `--bg-secondary` | `#0F0F0F` | Card backgrounds |
| `--bg-tertiary` | `#1F2421` | Borders, dividers |
| `--bg-hover` | `rgba(255,255,255,0.02)` | Hover states |
| `--bg-active` | `rgba(255,255,255,0.04)` | Active/pressed states |

### Text Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--text-primary` | `#F3F6F4` | Primary text |
| `--text-secondary` | `#8A938E` | Secondary text, labels |
| `--text-tertiary` | `#6B7470` | Tertiary text, timestamps |

### Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--success-bg` | `rgba(61,244,154,0.12)` | Success message backgrounds |
| `--success-border` | `rgba(61,244,154,0.2)` | Success borders |
| `--success-text` | `#3DF49A` | Success text |
| `--error-bg` | `rgba(242,107,107,0.12)` | Error backgrounds |
| `--error-border` | `rgba(242,107,107,0.2)` | Error borders |
| `--error-text` | `#F26B6B` | Error text |
| `--warning-bg` | `rgba(245,168,92,0.12)` | Warning backgrounds |
| `--warning-border` | `rgba(245,168,92,0.2)` | Warning borders |
| `--warning-text` | `#F5A85C` | Warning text |
| `--info-bg` | `rgba(96,168,250,0.12)` | Info backgrounds |
| `--info-border` | `rgba(96,168,250,0.2)` | Info borders |
| `--info-text` | `#60A8FA` | Info text |

---

## Typography

### Font Families

```css
--font-jakarta: 'Plus Jakarta Sans', Helvetica, system-ui, sans-serif;
--font-mono: 'JetBrains Mono', 'Courier New', monospace;
```

**Primary**: Plus Jakarta Sans (UI, headings, body)  
**Code**: JetBrains Mono (code blocks, monospace data)

**Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold)

### Font Sizes

| Size | Rem | Pixels | Usage |
|------|-----|--------|-------|
| `text-[10px]` | 0.625rem | 10px | Tiny labels, badges |
| `text-[10.5px]` | 0.656rem | 10.5px | Timestamps |
| `text-[11px]` | 0.688rem | 11px | Secondary text in tables |
| `text-[11.5px]` | 0.719rem | 11.5px | Button text (small) |
| `text-[12px]` | 0.75rem | 12px | Table data |
| `text-[12.5px]` | 0.781rem | 12.5px | Cards, compact text |
| `text-[13px]` | 0.813rem | 13px | Form labels |
| `text-[15px]` | 0.938rem | 15px | Body text (base) |
| `text-[18px]` | 1.125rem | 18px | Subheadings |
| `text-[20px]` | 1.25rem | 20px | Card titles |
| `text-[24px]` | 1.5rem | 24px | Page titles |
| `text-3xl` | 1.875rem | 30px | Stats numbers |

**Base size**: 15px (`font-size: 15px` on body)  
**Line height**: 1.5 (default)  
**Letter spacing**: -0.005em (default, tighter than browser default)

---

## Spacing Scale

Based on 4px grid:

| Token | Value | Usage |
|-------|-------|-------|
| `0.5` | 2px | Micro spacing |
| `1` | 4px | Tight spacing |
| `1.5` | 6px | Compact spacing |
| `2` | 8px | Small gaps |
| `2.5` | 10px | Default gap |
| `3` | 12px | Medium padding |
| `3.5` | 14px | Card spacing |
| `4` | 16px | Large padding |
| `5` | 20px | Section spacing |
| `6` | 24px | Page margins |
| `8` | 32px | Large sections |

**Consistency**: Always use multiples of 4px for predictable layouts.

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded` | 4px | Badges, tiny elements |
| `rounded-md` | 6px | Small cards |
| `rounded-lg` | 8px | Buttons, inputs |
| `rounded-xl` | 12px | Cards |
| `rounded-2xl` | 18px | Large cards |
| `rounded-full` | 9999px | Avatars, pills |

**Default for cards**: 12px  
**Default for buttons**: 8px

---

## Component Patterns

### Button

**Variants**:

**Primary**:
```tsx
className="bg-[#3DF49A] text-[#06160E] hover:bg-[#5BFBA8]"
```

**Secondary**:
```tsx
className="bg-[rgba(255,255,255,0.05)] text-[#F3F6F4] hover:bg-[rgba(255,255,255,0.08)]"
```

**Danger**:
```tsx
className="bg-[#F26B6B] text-white hover:bg-[#F47A7A]"
```

**Ghost**:
```tsx
className="bg-transparent text-[#8A938E] hover:bg-[rgba(255,255,255,0.05)]"
```

**Sizes**:
- Small: `px-2.5 py-1 text-[11px]`
- Medium: `px-3 py-1.5 text-[11.5px]`
- Large: `px-4 py-2 text-[12.5px]`

**Default**: Medium size, rounded-lg, font-semibold, transition-colors

---

### Badge

**Status Badges**:

**Success** (Read, Passed, Active, Approved):
```tsx
className="px-2 py-0.5 rounded text-[10px] font-semibold 
           bg-[rgba(61,244,154,0.12)] text-[#3DF49A]"
```

**Info** (Reading, Under Review):
```tsx
className="px-2 py-0.5 rounded text-[10px] font-semibold 
           bg-[rgba(96,168,250,0.12)] text-[#60A8FA]"
```

**Warning** (Pending):
```tsx
className="px-2 py-0.5 rounded text-[10px] font-semibold 
           bg-[rgba(245,168,92,0.12)] text-[#F5A85C]"
```

**Error** (Failed, Rejected, Suspended):
```tsx
className="px-2 py-0.5 rounded text-[10px] font-semibold 
           bg-[rgba(242,107,107,0.12)] text-[#F26B6B]"
```

**Neutral** (Unread, Untaken):
```tsx
className="px-2 py-0.5 rounded text-[10px] font-semibold 
           bg-[rgba(255,255,255,0.05)] text-[#8A938E]"
```

---

### Card

**Base Card**:
```tsx
className="bg-[#0F0F0F] border border-[#1F2421] rounded-xl p-4"
```

**Card with hover**:
```tsx
className="bg-[#0F0F0F] border border-[#1F2421] rounded-xl p-4 
           hover:bg-[rgba(255,255,255,0.02)] transition-colors cursor-pointer"
```

**Card header**:
```tsx
<div className="flex items-center justify-between mb-3">
  <h3 className="text-[13px] font-semibold">Title</h3>
  <span className="text-[11px] text-[#8A938E]">Subtitle</span>
</div>
```

---

### Modal

**Backdrop**:
```tsx
className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
```

**Modal Container**:
```tsx
className="fixed inset-0 flex items-center justify-center z-50 p-4"
```

**Modal Content** (medium size):
```tsx
className="bg-[#0F0F0F] border border-[#1F2421] rounded-xl 
           w-full max-w-md max-h-[90vh] overflow-hidden
           shadow-2xl"
```

**Sizes**:
- Small: `max-w-sm` (384px)
- Medium: `max-w-md` (448px)
- Large: `max-w-lg` (512px)
- XLarge: `max-w-2xl` (672px)

**Modal Header**:
```tsx
className="px-5 py-4 border-b border-[#1F2421]"
```

**Modal Body**:
```tsx
className="px-5 py-4 overflow-y-auto"
```

**Modal Footer**:
```tsx
className="px-5 py-4 border-t border-[#1F2421] 
           flex items-center justify-end gap-2"
```

---

### Input

**Text Input**:
```tsx
className="w-full px-3 py-2 bg-[rgba(255,255,255,0.04)] 
           border border-[#1F2421] rounded-lg text-[13px]
           focus:outline-none focus:border-[#3DF49A] transition-colors"
```

**Textarea**:
```tsx
className="w-full px-3 py-2 bg-[rgba(255,255,255,0.04)] 
           border border-[#1F2421] rounded-lg text-[13px] resize-none
           focus:outline-none focus:border-[#3DF49A] transition-colors"
```

**Label**:
```tsx
className="block text-[12.5px] font-semibold mb-1.5"
```

---

### Table

**Table Container**:
```tsx
className="overflow-x-auto"
```

**Table**:
```tsx
className="w-full"
```

**Table Header**:
```tsx
<thead>
  <tr className="border-b border-[#1F2421]">
    <th className="text-left px-3 py-2 text-[11px] font-semibold 
                   text-[#8A938E] uppercase tracking-wide">
      Column
    </th>
  </tr>
</thead>
```

**Table Row**:
```tsx
<tr className="border-b border-[#1F2421] last:border-0 
               hover:bg-[rgba(255,255,255,0.02)] transition-colors">
```

**Table Cell**:
```tsx
<td className="px-3 py-2.5 text-[12.5px]">Data</td>
```

---

### Toast Notifications

**Success Toast**:
```tsx
style={{
  background: '#0D1A0D',
  color: '#3DF49A',
  border: '1px solid rgba(61, 244, 154, 0.2)',
  borderRadius: '12px',
  padding: '12px 16px',
}}
```

**Error Toast**:
```tsx
style={{
  background: '#1A0D0D',
  color: '#F26B6B',
  border: '1px solid rgba(242, 107, 107, 0.2)',
  borderRadius: '12px',
  padding: '12px 16px',
}}
```

**Loading Toast**:
```tsx
style={{
  background: '#0D0D1A',
  color: '#60A8FA',
  border: '1px solid rgba(96, 168, 250, 0.2)',
  borderRadius: '12px',
  padding: '12px 16px',
}}
```

**Position**: Top-right  
**Duration**: 4s (success), 5s (error)

---

## Animation & Transitions

### Default Transition
```css
transition: all 0.2s ease-in-out;
```

### Hover States
- Buttons: `hover:bg-[lighter-shade]`
- Cards: `hover:bg-[rgba(255,255,255,0.02)]`
- Links: `hover:text-[#3DF49A]`

### Modal Animations
- Enter: Fade in + scale up (0.95 → 1)
- Exit: Fade out + scale down (1 → 0.95)
- Duration: 200ms

### Loading States
- Spinner: Rotate 360deg, 1s linear infinite
- Skeleton: Pulse opacity 0.5 ↔ 1, 2s ease-in-out infinite

---

## Dark Mode Notes

LearnDE is **dark-first** by design. No light mode planned.

**Philosophy**: Dark backgrounds reduce eye strain for long reading sessions, making it ideal for educational content.

**Contrast ratios**: All text meets WCAG AA standards for readability.

---

## Accessibility

### Focus States
All interactive elements have visible focus rings:
```css
focus:outline-none focus:ring-2 focus:ring-[#3DF49A] focus:ring-offset-2 focus:ring-offset-[#070807]
```

### Color Contrast
- Primary text (#F3F6F4) on dark bg: 15:1 ratio
- Secondary text (#8A938E) on dark bg: 8:1 ratio
- Accent colors meet AA standards

### Keyboard Navigation
- All modals closable with ESC
- Tab order follows visual order
- Focus traps in modals

---

## Implementation Notes

### Tailwind CSS
LearnDE uses Tailwind CSS 4 with custom configuration for exact pixel values.

**Custom colors**:
```js
colors: {
  mint: '#3DF49A',
  blue: '#60A8FA',
  amber: '#F5A85C',
  rose: '#F26B6B',
}
```

**Custom font sizes**: Use `text-[Xpx]` for precise sizing.

### Global Styles
Applied in `globals.css`:
```css
body {
  font-family: var(--font-jakarta), Helvetica, system-ui, sans-serif;
  font-size: 15px;
  line-height: 1.5;
  letter-spacing: -0.005em;
}
```

---

**Last Updated**: 2026-05-14  
**Design System Version**: 1.0  
**Theme**: Dark-first
