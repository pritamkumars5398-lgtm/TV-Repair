# Module 1 — Public Business Website (Frontend)

## Overview
The public marketing website. No authentication required. Serves potential customers who arrive via Google, Facebook Ads, or word-of-mouth.

## Pages
| Route | File | Description |
|-------|------|-------------|
| `/` | `app/(website)/page.tsx` | Home page |
| `/about` | `app/(website)/about/page.tsx` | About us |
| `/services` | `app/(website)/services/page.tsx` | TV Repair + Speaker services |
| `/products` | `app/(website)/products/page.tsx` | Speaker product catalog |
| `/contact` | `app/(website)/contact/page.tsx` | Contact + map |
| `/book` | `app/(website)/book/page.tsx` | Service booking multi-step form |
| `/booking/success` | `app/(website)/booking/success/page.tsx` | Post-payment confirmation |
| `/track` | `app/(website)/track/page.tsx` | Public repair tracker |

## Shared Layout
- File: `app/(website)/layout.tsx`
- Includes: Navbar, Footer, WhatsApp floating button
- Navbar: sticky, becomes white on scroll
- WhatsApp button: fixed bottom-right, links to `wa.me/{WHATSAPP_NUMBER}`

## SEO Requirements
- Title template: `{Page} | TV Repair & Speaker Manufacturing`
- OG image: `public/og-image.jpg` (1200×630)
- JSON-LD `LocalBusiness` schema on home + contact page
- Canonical URLs on all pages
- Sitemap generated via `next-sitemap`

## Key Components
- `components/website/HeroSection.tsx`
- `components/website/ServiceCard.tsx`
- `components/website/StatsBar.tsx`
- `components/website/TestimonialGrid.tsx`
- `components/website/HowItWorks.tsx`
- `components/website/BookingForm/` — multi-step wizard

## API Calls
| Action | Endpoint |
|--------|----------|
| Submit lead/contact form | `POST /api/v1/public/leads` |
| Submit product inquiry | `POST /api/v1/public/inquiries` |
| Initiate booking | `POST /api/v1/public/bookings` |
| Verify payment | `POST /api/v1/public/bookings/verify-payment` |
| Track repair | `GET /api/v1/public/track/:ticketId` |
| Fetch testimonials | `GET /api/v1/public/content/TESTIMONIALS` |

## Design Notes
- Hero: gradient `from-primary-900 to-primary-500`, white text
- All CTAs: accent-500 (`#f97316`) background
- Section background alternates: `white` / `neutral-50`
- Service cards: hover scale + shadow transition (200ms)
- Mobile: hamburger nav, single-column layouts
