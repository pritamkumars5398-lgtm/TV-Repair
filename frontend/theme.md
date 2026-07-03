# Design System & Theme — TV Repair CRM Frontend

## Brand Identity
**Business**: TV Repairing & Speaker Manufacturing
**Tone**: Professional, trustworthy, modern, approachable
**Target Audience**: Middle-class households, small business owners, tech-aware customers

---

## Color Palette

### Primary (Brand Blue — trust, technology)
| Token | Hex | Usage |
|-------|-----|-------|
| `primary-50` | `#eff6ff` | Light backgrounds, hover states |
| `primary-100` | `#dbeafe` | Section backgrounds |
| `primary-200` | `#bfdbfe` | Borders, dividers |
| `primary-500` | `#3b82f6` | Primary buttons, links |
| `primary-600` | `#2563eb` | Button hover, active states |
| `primary-700` | `#1d4ed8` | Dark accents |
| `primary-900` | `#1e3a8a` | Dark headers, footers |

### Accent (Orange — energy, action, CTA)
| Token | Hex | Usage |
|-------|-----|-------|
| `accent-400` | `#fb923c` | Highlights, badges |
| `accent-500` | `#f97316` | CTA buttons, important actions |
| `accent-600` | `#ea580c` | CTA hover |

### Neutral (Slate)
| Token | Hex | Usage |
|-------|-----|-------|
| `neutral-50` | `#f8fafc` | Page background |
| `neutral-100` | `#f1f5f9` | Card backgrounds |
| `neutral-200` | `#e2e8f0` | Borders |
| `neutral-400` | `#94a3b8` | Placeholder text |
| `neutral-600` | `#475569` | Secondary text |
| `neutral-800` | `#1e293b` | Body text |
| `neutral-900` | `#0f172a` | Headings |

### Semantic Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `success` | `#22c55e` | Completed, paid, delivered |
| `warning` | `#f59e0b` | Pending, awaiting action |
| `error` | `#ef4444` | Failed, overdue, critical |
| `info` | `#06b6d4` | Informational alerts |

### Status Colors (Repair Pipeline)
| Status | Color | Hex |
|--------|-------|-----|
| New Lead | Blue | `#3b82f6` |
| Contacted | Cyan | `#06b6d4` |
| Inspection Scheduled | Violet | `#8b5cf6` |
| TV Received | Orange | `#f97316` |
| Repair In Progress | Yellow | `#eab308` |
| Quality Check | Indigo | `#6366f1` |
| Ready for Delivery | Teal | `#14b8a6` |
| Delivered | Green | `#22c55e` |
| Closed | Gray | `#94a3b8` |

---

## Typography

### Font Families
```css
--font-sans: 'Inter', system-ui, sans-serif;       /* Body, UI */
--font-display: 'Poppins', sans-serif;              /* Headings, hero */
--font-mono: 'JetBrains Mono', monospace;           /* Tracking IDs, codes */
```

### Type Scale
| Name | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| `display-2xl` | 4.5rem (72px) | 700 | 1.1 | Hero headline |
| `display-xl` | 3.75rem (60px) | 700 | 1.1 | Section hero |
| `display-lg` | 3rem (48px) | 600 | 1.2 | Page titles |
| `display-md` | 2.25rem (36px) | 600 | 1.2 | Module headings |
| `display-sm` | 1.875rem (30px) | 600 | 1.3 | Card headings |
| `text-xl` | 1.25rem (20px) | 500 | 1.5 | Subheadings |
| `text-lg` | 1.125rem (18px) | 400 | 1.6 | Body large |
| `text-md` | 1rem (16px) | 400 | 1.6 | Body default |
| `text-sm` | 0.875rem (14px) | 400 | 1.5 | Secondary text, labels |
| `text-xs` | 0.75rem (12px) | 400 | 1.4 | Captions, badges |

---

## Spacing Scale
Follow Tailwind's default spacing scale. Key landmarks:
- **4** (1rem / 16px) — base unit
- **8** (2rem) — card padding
- **12** (3rem) — section inner padding
- **16** (4rem) — section gap
- **24** (6rem) — hero padding

---

## Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| `rounded-sm` | 4px | Small badges, chips |
| `rounded-md` | 8px | Inputs, buttons |
| `rounded-lg` | 12px | Cards |
| `rounded-xl` | 16px | Feature cards, modals |
| `rounded-2xl` | 24px | Hero cards |
| `rounded-full` | 9999px | Avatar, pill badges |

---

## Shadows
```css
--shadow-sm:  0 1px 2px rgba(0,0,0,0.05);
--shadow-md:  0 4px 6px -1px rgba(0,0,0,0.1);
--shadow-lg:  0 10px 15px -3px rgba(0,0,0,0.1);
--shadow-xl:  0 20px 25px -5px rgba(0,0,0,0.1);
--shadow-card: 0 2px 8px rgba(0,0,0,0.08);
```

---

## Component Styles

### Buttons
```
Primary:   bg-primary-600  hover:bg-primary-700  text-white  rounded-md  px-6 py-2.5
Secondary: border-primary-600 text-primary-600 hover:bg-primary-50  rounded-md  px-6 py-2.5
CTA:       bg-accent-500 hover:bg-accent-600 text-white rounded-md px-8 py-3 font-semibold
Ghost:     text-neutral-600 hover:bg-neutral-100 rounded-md
Danger:    bg-error hover:bg-red-600 text-white rounded-md
```

### Cards
```
Default: bg-white rounded-lg shadow-card p-6 border border-neutral-200
Hover:   hover:shadow-md hover:border-primary-200 transition-all duration-200
Feature: bg-white rounded-xl shadow-lg p-8 border border-neutral-100
```

### Inputs
```
Base:    border border-neutral-200 rounded-md px-3 py-2 text-neutral-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500
Error:   border-error focus:ring-error
Disabled: bg-neutral-100 cursor-not-allowed
```

### Badges / Status Pills
```
New:     bg-blue-100 text-blue-700 text-xs font-medium rounded-full px-2.5 py-0.5
Success: bg-green-100 text-green-700
Warning: bg-yellow-100 text-yellow-700
Error:   bg-red-100 text-red-700
```

---

## Layout Grid
- Max width: `1280px` (xl container)
- Gutter: `24px` on mobile, `32px` on tablet, `48px` on desktop
- Columns: 1 (mobile) → 2 (tablet) → 3–4 (desktop)

---

## Website Sections (Public Pages)

### Navbar
- Sticky, white background, `shadow-sm` on scroll
- Logo left, nav links center, CTA button right ("Book Service" — accent-500)
- Mobile: hamburger menu, slide-down drawer

### Hero Section
- Gradient: `from-primary-900 via-primary-700 to-primary-500`
- White headline, accent-400 highlight text
- Two CTAs: "Book Repair" (accent) + "View Services" (outline white)
- Background: subtle grid or dot pattern overlay

### Section Headers
- Small overline: `text-accent-500 text-sm font-semibold uppercase tracking-wider`
- Main title: `text-neutral-900 text-display-md font-display`
- Subtitle: `text-neutral-600 text-lg`

### Footer
- Dark: `bg-neutral-900 text-neutral-400`
- Four columns: Company, Services, Quick Links, Contact
- Bottom bar: copyright + social links

---

## Dashboard Theme (CRM Panels)

### Sidebar
```
bg-primary-900 text-white w-64
Active item: bg-primary-700 text-white rounded-lg
Hover item: bg-primary-800
Icon: w-5 h-5 mr-3 text-primary-300
```

### Topbar
```
bg-white border-b border-neutral-200 h-16 px-6
Right: notification bell, avatar, role badge
```

### Stat Cards
```
bg-white rounded-xl p-6 shadow-card
Icon container: bg-primary-50 rounded-lg p-3
Value: text-display-sm font-bold text-neutral-900
Label: text-sm text-neutral-500
Trend up: text-success, trend down: text-error
```

### Data Tables
```
Header: bg-neutral-50 text-neutral-500 text-xs font-semibold uppercase
Row: border-b border-neutral-100 hover:bg-neutral-50
Cell: text-sm text-neutral-700
```

---

## Tracking ID Style
```
Font: font-mono
Style: text-primary-700 bg-primary-50 rounded px-2 py-1 text-sm font-bold tracking-widest
Example: TVR-2026-0001
```

---

## Responsive Breakpoints
| Name | Min Width | Usage |
|------|-----------|-------|
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

---

## Animation Guidelines
- Use `transition-all duration-200` for hover effects
- Use `animate-spin` for loading spinners
- Use `animate-pulse` for skeleton loaders
- Page transitions: subtle fade (`opacity-0` → `opacity-100`, 150ms)
- Avoid heavy animations that degrade performance on low-end mobile

---

## Icon Library
Use **Lucide React** icons exclusively. Size conventions:
- Navigation: `w-5 h-5`
- Stat cards: `w-6 h-6`
- Hero/feature: `w-8 h-8` or `w-10 h-10`
- Inline text: `w-4 h-4`
