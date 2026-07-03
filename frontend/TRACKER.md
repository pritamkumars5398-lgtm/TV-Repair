# Frontend Tracker — TV Repair CRM
> Mark ✅ when code exists and works. ⚠️ partial. ❌ not started. 🔲 optional.
> Verify against: this file → actual files in `frontend/` → running app.

**Last updated**: 2026-06-27
**Current phase**: Phase 3 (Technician) & Phase 4 (Admin) complete. Phase 5 next.

---

## PHASE 1 — Project Foundation & Public Website

### 1.1 Project Setup
| Task | Status | File/Notes |
|------|--------|-----------|
| Next.js 14 initialized (App Router, TypeScript) | ✅ | `package.json` |
| Tailwind CSS configured with brand tokens | ✅ | `tailwind.config.ts` |
| shadcn/ui installed and configured | ⚠️ | only `button.tsx` — no @radix-ui packages yet |
| Zustand installed | ✅ | `lib/stores/` |
| TanStack Query installed + Provider wired | ✅ | `lib/providers.tsx` → `app/layout.tsx` |
| React Hook Form + Zod installed | ✅ | `lib/validations/` |
| Lucide React, Recharts, sonner installed | ✅ | `package.json` |
| ESLint configured | ✅ | `.eslintrc.json` |
| Path alias `@/` → `./` | ✅ | `tsconfig.json` |
| `.env.example` created | ✅ | `.env.example` |
| `lib/api/axios.ts` (axios instance + interceptors) | ✅ | `lib/api/axios.ts` |
| `lib/api/client.ts` (fetcher util) | ✅ | `lib/api/client.ts` |
| `middleware.ts` (role-based route guards) | ✅ | `middleware.ts` |
| `lib/providers.tsx` (TanStack Query Provider) | ✅ | `lib/providers.tsx` |

### 1.2 Layout & Navigation
| Task | Status | File/Notes |
|------|--------|-----------|
| `app/(website)/layout.tsx` | ✅ | Navbar + Footer + WhatsApp + Chatbot |
| `Navbar.tsx` — sticky, logo, nav links, CTA | ✅ | `components/layout/Navbar.tsx` |
| Mobile hamburger menu | ✅ | inside Navbar |
| `Footer.tsx` — 4-col, dark, social icons | ✅ | `components/layout/Footer.tsx` |
| WhatsApp floating button (bottom-right) | ✅ | `components/shared/WhatsAppButton.tsx` |

### 1.3 Home Page
| Section | Status | File/Notes |
|---------|--------|-----------|
| Hero section (slideshow, 2 CTAs) | ✅ | `app/(website)/page.tsx` + `HeroSlideshow.tsx` |
| Stats Bar (4 stats) | ✅ | |
| Services Overview (8 cards) | ✅ | |
| Why Choose Us | ✅ | |
| How It Works | ✅ | |
| Testimonials (hardcoded) | ⚠️ | Not fetched from API yet |
| CTA Banner | ✅ | |
| Contact Information section | ✅ | |

### 1.4 About Us Page
| Task | Status | File/Notes |
|------|--------|-----------|
| Page created | ✅ | `app/(website)/about/page.tsx` |
| Company Profile + stats | ✅ | |
| Story section | ✅ | |
| Manufacturing Capabilities | ✅ | |
| Brands grid | ✅ | |
| Team section | ✅ | |

### 1.5 Services Page
| Task | Status | File/Notes |
|------|--------|-----------|
| Page created | ✅ | `app/(website)/services/page.tsx` |
| TV Repair services (6 cards) | ✅ | |
| Speaker / Audio services (4 cards) | ✅ | |
| Brands grid | ✅ | |
| Pick & Drop facility card | ✅ | |

### 1.6 Products Page
| Task | Status | File/Notes |
|------|--------|-----------|
| Page created | ✅ | `app/(website)/products/page.tsx` |
| Product catalog cards | ✅ | |
| Product inquiry modal | ⚠️ | Check if modal is wired to API |

### 1.7 Contact Page
| Task | Status | File/Notes |
|------|--------|-----------|
| Page created | ✅ | `app/(website)/contact/page.tsx` |
| Contact form → `POST /public/leads` | ✅ | |
| Click-to-Call + WhatsApp button | ✅ | |
| Address, hours, email display | ✅ | |
| Google Map iframe embed | ❌ | Not added yet |

### 1.8 Service Booking Page (Multi-step)
| Task | Status | File/Notes |
|------|--------|-----------|
| Page created | ✅ | `app/(website)/book/page.tsx` |
| Progress bar (3 steps) | ✅ | |
| Step 1 — Customer info + service + date/time + description | ✅ | |
| Step 1 — Photo upload (max 5) | ✅ | |
| Step 2 — Address + Pick & Drop toggle | ✅ | |
| Step 3 — Order summary + ₹250 charge | ✅ | |
| Step 3 — Razorpay checkout | ✅ | |
| Form state in Zustand | ✅ | `lib/stores/booking-store.ts` |

### 1.9 Booking Success Page
| Task | Status | File/Notes |
|------|--------|-----------|
| Page created | ✅ | `app/(website)/booking/success/page.tsx` |
| Ticket ID display + service summary | ✅ | |
| Track Repair CTA | ✅ | |

### 1.10 Repair Tracking Page (Public)
| Task | Status | File/Notes |
|------|--------|-----------|
| Page created | ✅ | `app/(website)/track/page.tsx` |
| Ticket ID search + URL pre-fill | ✅ | |
| Vertical status timeline (7 stages) | ✅ | |
| Timestamp + technician note per step | ✅ | |
| Empty / error states | ✅ | |

### 1.11 Chatbot Widget
| Task | Status | File/Notes |
|------|--------|-----------|
| Floating chat bubble + slide-up panel | ✅ | `components/shared/ChatbotWidget.tsx` |
| FAQ keyword responses | ✅ | |
| Escalation to WhatsApp | ✅ | |

### Phase 1 SEO & Performance
| Task | Status | File/Notes |
|------|--------|-----------|
| OG tags on all public pages | ⚠️ | Metadata defined in layout; no OG image yet |
| JSON-LD LocalBusiness schema | ❌ | Not added |
| All images use `next/image` | ✅ | |
| Responsive: 375px, 768px, 1280px | ✅ | Tailwind responsive classes throughout |

---

## PHASE 2 — Customer Portal

### 2.1 Auth Pages
| Task | Status | File/Notes |
|------|--------|-----------|
| Login page (Phone + OTP) | ✅ | `app/portal/login/page.tsx` |
| Register page (Name, phone, email, OTP) | ✅ | `app/portal/register/page.tsx` |
| Auth state in Zustand (persisted) | ✅ | `lib/stores/auth-store.ts` |

### 2.2 Customer Portal Layout
| Task | Status | File/Notes |
|------|--------|-----------|
| Portal layout | ✅ | `app/portal/layout.tsx` |
| Sidebar (desktop) | ✅ | Dashboard, Repairs, Payments, Invoices, Queries, Profile |
| Mobile slide-over sidebar | ✅ | |
| Topbar (greeting + notification bell) | ✅ | |

### 2.3 Customer Dashboard
| Task | Status | File/Notes |
|------|--------|-----------|
| Dashboard page | ✅ | `app/portal/dashboard/page.tsx` |
| Stat cards (Active, Completed, Pending, Spent) | ✅ | |
| Recent repairs table | ✅ | |
| Quick action buttons | ✅ | |

### 2.4 My Repairs
| Task | Status | File/Notes |
|------|--------|-----------|
| Repairs list page | ✅ | `app/portal/repairs/page.tsx` |
| Status filter + search | ✅ | |

### 2.5 Repair Detail
| Task | Status | File/Notes |
|------|--------|-----------|
| Repair detail page | ✅ | `app/portal/repairs/[ticketId]/page.tsx` |
| Status timeline | ✅ | |
| Technician info + address | ✅ | |
| Issue description + repair notes | ✅ | |
| Estimate + invoice section | ✅ | |

### 2.6 Payments
| Task | Status | File/Notes |
|------|--------|-----------|
| Payments page | ✅ | `app/portal/payments/page.tsx` |
| Pending payment cards + Pay Now (Razorpay) | ✅ | |
| Transaction history list | ✅ | |

### 2.7 Invoices
| Task | Status | File/Notes |
|------|--------|-----------|
| Invoices page | ✅ | `app/portal/invoices/page.tsx` |
| Invoice list + PDF download | ✅ | |

### 2.8 Queries
| Task | Status | File/Notes |
|------|--------|-----------|
| Queries page | ✅ | `app/portal/queries/page.tsx` |
| New query form | ✅ | |
| Thread view + reply | ✅ | |

### 2.9 Customer Profile
| Task | Status | File/Notes |
|------|--------|-----------|
| Profile page | ✅ | `app/portal/profile/page.tsx` |
| Edit name, email, address | ✅ | |

---

## PHASE 3 — Technician Dashboard

| Task | Status | File/Notes |
|------|--------|-----------|
| Technician login (OTP) | ✅ | `app/technician/login/page.tsx` |
| Technician layout (sidebar + topbar) | ✅ | `app/technician/layout.tsx` |
| Dashboard (stats + active jobs) | ✅ | `app/technician/dashboard/page.tsx` |
| Jobs list (filter: active/all/completed) | ✅ | `app/technician/jobs/page.tsx` |
| Job detail page | ✅ | `app/technician/jobs/[ticketId]/page.tsx` |
| Update job status | ✅ | |
| Add repair note | ✅ | |
| Create estimate | ✅ | |
| Photo upload (before/after) | ✅ | |

---

## PHASE 4 — Admin & Manager Panel

### Layout & Auth
| Task | Status | File/Notes |
|------|--------|-----------|
| Admin/Manager login + role selection | ✅ | `app/admin/login/page.tsx` |
| Admin layout (sidebar + topbar) | ✅ | `app/admin/layout.tsx` |
| Role-aware sidebar (admin vs manager items) | ✅ | |

### Dashboard
| Task | Status | File/Notes |
|------|--------|-----------|
| 6 KPI cards | ✅ | `app/admin/dashboard/page.tsx` |
| Revenue trend chart (Recharts line) | ✅ | |
| Leads by source chart (pie) | ✅ | |
| Quick links row | ✅ | |

### Lead Management
| Task | Status | File/Notes |
|------|--------|-----------|
| Leads table + search + status filter | ✅ | `app/admin/leads/page.tsx` |
| Add Lead modal | ✅ | |
| Inline status update | ✅ | |
| Pagination | ✅ | |

### Ticket Management
| Task | Status | File/Notes |
|------|--------|-----------|
| Tickets table + search + status filter | ✅ | `app/admin/tickets/page.tsx` |
| Inline status update | ✅ | |
| Pagination | ✅ | |

### Other CRM Modules
| Task | Status | File/Notes |
|------|--------|-----------|
| Customer management table | ✅ | `app/admin/customers/page.tsx` |
| Technician management (cards + add modal) | ✅ | `app/admin/technicians/page.tsx` |
| Inventory table + stock in/out | ✅ | `app/admin/inventory/page.tsx` |
| Low stock alert banner | ✅ | |

### Billing & Payments
| Task | Status | File/Notes |
|------|--------|-----------|
| Invoices page (stub with table) | ✅ | `app/admin/invoices/page.tsx` |
| Payments table + status filter | ✅ | `app/admin/payments/page.tsx` |

### Reports
| Task | Status | File/Notes |
|------|--------|-----------|
| Reports page (tabbed: Revenue/Leads/Technicians) | ✅ | `app/admin/reports/page.tsx` |
| Revenue line chart + summary cards | ✅ | |
| Leads bar chart | ✅ | |
| Date range picker | ✅ | |

---

## PHASE 5 — Polish & Deployment

| Task | Status | File/Notes |
|------|--------|-----------|
| Google Map iframe on Contact page | ❌ | |
| JSON-LD LocalBusiness schema | ❌ | |
| OG image (`public/og-image.jpg`) | ❌ | |
| Lighthouse 90+ on all public pages | ❌ | |
| WebP images + lazy loading | ✅ | `next/image` used throughout |
| next/font (Inter + Poppins) | ⚠️ | Currently via Google Fonts @import |
| Suspense + loading.tsx per segment | ❌ | |
| Global error.tsx + not-found.tsx | ❌ | |
| Unit tests (Zod schemas) | ❌ | |
| Cypress E2E (booking flow) | ❌ | |
| Dockerfile | ❌ | |
| GitHub Actions CI/CD | ❌ | |

---

## HOW TO USE
```
# Count remaining tasks
grep -c "❌" frontend/TRACKER.md

# Find all incomplete tasks
grep "❌" frontend/TRACKER.md
```
When a task is done: change `❌` → `✅`, update "Last updated" date.
