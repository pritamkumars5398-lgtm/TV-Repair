# Frontend Build Prompt — TV Repair CRM
## Phase-wise Master Prompt for Claude Agent

---

## Context (Read Before Every Phase)

You are building the **frontend** of a TV Repairing & Speaker Manufacturing business platform using:
- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** + **shadcn/ui**
- **Zustand** (state), **TanStack Query** (data fetching)
- **React Hook Form** + **Zod** (forms/validation)
- **Recharts** (charts), **Razorpay** (payments), **Socket.io** (real-time)

Always read `CLAUDE.md`, `theme.md`, and `agent.md` before writing any code.
Always read the relevant doc in `docs/<module>/` before implementing a module.
The backend API base URL is `process.env.NEXT_PUBLIC_API_URL`.

**Four user roles**: Customer (public + portal), Technician, Manager, Admin.
**Tracking ID format**: `TVR-YYYY-XXXX` (monospace, bold, primary-colored).

---

## PHASE 1 — Project Foundation & Public Website

### Goal
Set up the Next.js project, design system, and build the complete public-facing marketing website with all pages, SEO, and WhatsApp integration.

### Tasks

#### 1.1 Project Setup
```
Initialize Next.js 14 project with App Router, TypeScript, Tailwind CSS.
Install and configure: shadcn/ui, Zustand, TanStack Query, React Hook Form,
Zod, Lucide React, Recharts, sonner (toasts), next-themes.
Configure tailwind.config.ts with brand colors, fonts (Inter, Poppins,
JetBrains Mono), and custom tokens from theme.md.
Set up ESLint, Prettier, and path aliases (@/ → src/).
Create .env.example with all required environment variables.
Create lib/api/client.ts — axios instance with base URL, interceptors for
auth token (Bearer), and error handling.
Create middleware.ts for auth route protection:
  - /portal/* → requires customer JWT
  - /technician/* → requires technician JWT
  - /manager/* → requires manager JWT
  - /admin/* → requires admin JWT
```

#### 1.2 Layout & Navigation
```
Create app/(website)/layout.tsx with:
  - Sticky Navbar: logo left, nav links (Home, About, Services, Products,
    Contact), "Book Repair" CTA (accent-500) right
  - Mobile hamburger menu with slide-down drawer
  - Footer: 4-column grid (Company, Services, Quick Links, Contact), dark
    bg-neutral-900, social icons, copyright
Create shared/components/Navbar.tsx and Footer.tsx.
WhatsApp floating button: fixed bottom-right, green #25D366, opens
wa.me/{NEXT_PUBLIC_WHATSAPP_NUMBER}.
```

#### 1.3 Home Page — app/(website)/page.tsx
```
Build the following sections in order:
  1. Hero: gradient bg-primary-900→primary-500, white headline, accent
     highlight, two CTAs ("Book Repair" accent, "Track Repair" outline),
     background grid pattern
  2. Stats Bar: 4 stats (TVs Repaired, Happy Customers, Years Experience,
     Brands Supported) — white bar with shadow
  3. Services Overview: 6 service cards (LED TV, Smart TV, Motherboard,
     Screen, Speaker Manufacturing, Home Theater) — icon, title, short desc
  4. Why Choose Us: 4 feature tiles (Certified Technicians, Genuine Parts,
     Same-Day Service, Warranty on Repairs)
  5. How It Works: 4-step process (Book → Pay ₹250 → Technician Visits →
     Repair & Delivery) with connecting line
  6. Testimonials: 3-card carousel/grid with star ratings
  7. CTA Banner: "Need TV Repair?" — accent background, Book Now button
  8. Contact Information Section (required by spec):
     - Three-column row: Address card, Phone/WhatsApp card, Email/Hours card
     - Each card: icon + label + value + CTA (Call Now / WhatsApp / Email)
     - bg-primary-50 background, border-top accent-500 stripe on each card
     - This is a visible home page section, NOT just the footer
All sections use theme.md tokens. All images use next/image.
```

#### 1.4 About Us Page — app/(website)/about/page.tsx
```
Sections:
  1. Hero banner with page title
  2. Company Profile with stats
  3. Vision & Mission (two cards side by side)
  4. Manufacturing Capabilities (bullet list with icons)
  5. Repair Expertise section
  6. Team section (placeholder cards)
Add OG meta tags and JSON-LD schema for LocalBusiness.
```

#### 1.5 Services Page — app/(website)/services/page.tsx
```
Two main sections:
  A. TV Repair Services:
     - LED TV Repair, Smart TV Repair, Motherboard/Power Supply Repair,
       Screen Replacement, Backlight Repair, Scratch Remover/Polarizer Change
     - "All Brands Supported" badge
     - Pick & Drop facility card
  B. Speaker Manufacturing:
     - Speaker Manufacturing, Onsite Warranty, Audio System Installation,
       Home Theater Installation
Each service: icon, title, description, starting price (if known), CTA.
Service grid: 3 columns desktop, 2 tablet, 1 mobile.
```

#### 1.6 Products Page — app/(website)/products/page.tsx
```
Speaker product catalog:
  - Product card: image, name, specifications, price range, "Get Quote" button
  - Filter bar: category filter
  - Inquiry modal form: name, phone, email, product interest, message
  - Form submits to POST /api/inquiries
```

#### 1.7 Contact Page — app/(website)/contact/page.tsx
```
Two-column layout:
  Left: Contact form (name, phone, email, service type dropdown, message)
    - Submits to POST /api/leads
    - Show success confirmation with reference number on submit
  Right:
    - Google Map iframe embed
    - Click-to-Call button
    - WhatsApp Chat button
    - Address, hours, email
```

#### 1.8 Service Booking Page — app/(website)/book/page.tsx
```
Multi-step booking form (3 steps):
  Step 1 — Service Details:
    - Customer name, phone, email
    - Service type (TV Repair / Speaker Repair / Home Visit / Speaker Install)
    - Preferred date + time slot picker
    - Issue description (textarea)
    - Photo upload (max 5 images, 5MB each)
  Step 2 — Address:
    - Full address, area/locality, city, pincode
    - Pickup option toggle (pick & drop vs home visit)
  Step 3 — Payment:
    - Order summary
    - ₹250 service visit charge display
    - Razorpay checkout button (handles UPI, Cards, Net Banking, PhonePe,
      Debit/Credit — all via Razorpay checkout modal)
    - Note: PayU is an alternative gateway (not implemented by default;
      switch to PayU SDK only if client specifically requests it)
    - On payment success → redirect to /booking/success?ticketId=TVR-XXXX
Progress bar at top showing current step.
Form state persisted in Zustand across steps.
```

#### 1.9 Booking Success Page — app/(website)/booking/success/page.tsx
```
Show:
  - Animated checkmark (green)
  - "Booking Confirmed!" heading
  - Ticket ID in TVR-YYYY-XXXX format (monospace, prominent)
  - Summary: service type, date, address
  - "Track Your Repair" CTA → /track
  - "Go Home" link
```

#### 1.10 Repair Tracking Page — app/(website)/track/page.tsx
```
Public tracking (no login required):
  - Search bar: enter Tracking ID (TVR-YYYY-XXXX)
  - On submit: GET /api/tickets/track?id=TVR-XXXX
  - Show vertical timeline with all statuses, current status highlighted:
    TV Received → Diagnosis → Spare Parts Ordered → Repair In Progress →
    Quality Testing → Ready for Delivery → Delivered
  - Each step: timestamp, description, technician note (if any)
  - "Contact Us" button if stuck status
```

#### 1.11 Chatbot Widget — components/shared/ChatbotWidget.tsx
```
MODULE 9 requirement — 24x7 AI Chatbot.
Floating chat bubble (bottom-left, primary-600 bg, chat icon).
Widget panel (320px wide, slides up):
  Header: "TV Repair Assistant" + minimize button
  Message thread: bot messages (left, neutral-100 bg) + user messages (right, primary-100 bg)
  Input: text field + send button

Pre-programmed FAQ responses (no external AI needed in Phase 1 — use keyword matching):
  Keywords → response:
  "charges" | "price" | "cost" → "Service visit fee is ₹250. Repair cost depends on
    diagnosis. We'll share an estimate before starting."
  "status" | "track" | "repair" → "Enter your Ticket ID at [Track Repair link] or
    login to your portal to see live status."
  "hours" | "time" | "open" → "We're open Mon–Sat, 9am–7pm. Emergency repairs
    available on Sunday with prior appointment."
  "book" | "appointment" | "visit" → Show "Book Now" button → /book
  "speaker" | "product" → "We manufacture premium speakers. View our catalog at [Products link]"
  "warranty" | "guarantee" → "We offer 30-day warranty on all repairs and onsite warranty on new speakers."
  default → "I didn't understand that. Would you like to talk to a human agent?" +
    "Chat with Agent" button (opens WhatsApp or escalates to Socket.io chat)

Escalation to human:
  "Chat with Agent" button → if customer logged in: opens portal chat panel;
  if not logged in: opens WhatsApp wa.me link.

State: widget open/close persisted in sessionStorage.
Chatbot does NOT require backend API in Phase 1 (purely frontend FAQ).
Phase 2+ (optional): integrate with backend chatbot API for dynamic answers.
```

### Phase 1 Deliverables Checklist
- [ ] Next.js project initialized, all dependencies installed
- [ ] tailwind.config.ts with full brand tokens
- [ ] middleware.ts with role-based route guards
- [ ] Navbar, Footer, WhatsApp floating button
- [ ] Home page — all 8 sections (including Contact Information section)
- [ ] About Us page
- [ ] Services page (TV + Speaker)
- [ ] Products page with inquiry form
- [ ] Contact page with map + form
- [ ] Multi-step booking form with Razorpay (UPI/Cards/NetBanking via Razorpay modal)
- [ ] Booking success page
- [ ] Public repair tracking page
- [ ] Chatbot widget (FAQ keyword matching + human escalation)
- [ ] OG tags and basic SEO on all public pages
- [ ] Responsive at 375px, 768px, 1280px

---

## PHASE 2 — Customer Portal

### Goal
Build the authenticated customer dashboard where customers manage their bookings, track repairs, chat with service team, download invoices, and make payments.

### Tasks

#### 2.1 Authentication Pages
```
app/(customer)/login/page.tsx:
  - Phone + OTP login (primary)
  - Email + password (secondary)
  - "New customer? Book a service" link
app/(customer)/register/page.tsx:
  - Name, phone, email, password
  - OTP verification step
Auth state: store JWT in httpOnly cookie via API route; Zustand for UI state.
```

#### 2.2 Customer Portal Layout
```
app/(customer)/layout.tsx:
  - Sidebar: My Repairs, Make Payment, Download Invoice, Raise Query, Profile
  - Mobile: bottom navigation bar (4 items)
  - Topbar: greeting ("Hello, [Name]"), notification bell
```

#### 2.3 Customer Dashboard — app/(customer)/dashboard/page.tsx
```
Stat cards row:
  - Active Repairs, Completed Repairs, Pending Payments, Total Spent
Recent repairs table:
  - Ticket ID, Service, Status badge, Date, Action ("View Details")
Quick actions:
  - "Book New Service", "Track Repair", "Raise Query"
```

#### 2.4 My Repairs — app/(customer)/repairs/page.tsx
```
List of all customer tickets with filters:
  - Status filter (All / Active / Completed / Cancelled)
  - Date range filter
Each ticket card: ID, device, issue summary, status badge, last updated, CTA
Click → /portal/repairs/[ticketId]
```

#### 2.5 Repair Detail — app/(customer)/repairs/[ticketId]/page.tsx
```
Full repair detail view:
  - Ticket ID, device info, issue description
  - Status timeline (same as public tracker but richer)
  - Technician info (name, photo, phone)
  - Uploaded photos (customer uploaded + technician uploaded)
  - Repair notes from technician
  - Estimate and invoice section
  - Payment history
  - "Chat with Service Team" button → opens chat panel
```

#### 2.6 Chat Panel — components/customer/ChatPanel.tsx
```
Real-time chat (Socket.io):
  - Message list with timestamps
  - Text input + send button
  - File/image attachment (upload to S3, show preview)
  - "Service team typically replies in 2 hours" note
  - Read receipts (single/double tick)
Socket events: join_room(ticketId), send_message, receive_message, typing
```

#### 2.7 Payments — app/(customer)/payments/page.tsx
```
List of all payment transactions:
  - Amount, status (Paid/Pending/Failed), date, receipt download
Pending payment section:
  - Show unpaid estimates, "Pay Now" → Razorpay checkout
Payment success → refresh list and show toast
```

#### 2.8 Invoice Download — app/(customer)/invoices/page.tsx
```
List all invoices linked to customer:
  - Invoice number, ticket ID, amount, date, "Download PDF" button
PDF download: GET /api/invoices/[id]/pdf → triggers file download
```

#### 2.9 Raise Query — app/(customer)/queries/page.tsx
```
Query form: subject, related ticket (dropdown), message, file attachment
Query list: showing previous queries and replies
Status: Open / In Progress / Resolved
```

#### 2.10 Customer Profile — app/(customer)/profile/page.tsx
```
Edit: name, email, phone, address
Change password section
Notification preferences (SMS / Email / WhatsApp toggles)
```

### Phase 2 Deliverables Checklist
- [ ] Login and register pages with OTP flow
- [ ] Customer portal layout (sidebar + mobile bottom nav)
- [ ] Customer dashboard with stat cards
- [ ] My Repairs list with filters
- [ ] Repair detail with timeline and technician info
- [ ] Real-time chat panel (Socket.io)
- [ ] Payments list and Razorpay integration
- [ ] Invoice download (PDF)
- [ ] Raise query form
- [ ] Customer profile settings

---

## PHASE 3 — Technician Dashboard

### Goal
Build the technician-facing web app where technicians view assigned jobs, accept/reject, update repair status, upload photos, add notes, and generate service reports.

### Tasks

#### 3.1 Technician Auth
```
app/(technician)/login/page.tsx — employee code + password login
```

#### 3.2 Technician Layout
```
app/(technician)/layout.tsx:
  Sidebar: My Jobs, Today's Schedule, Job History, Profile
  Mobile-optimized (most technicians on phone)
```

#### 3.3 Technician Dashboard — app/(technician)/dashboard/page.tsx
```
Today's summary: assigned jobs, completed today, pending
Job queue list with priority badges
Quick status update buttons per job
```

#### 3.4 Job Detail — app/(technician)/jobs/[ticketId]/page.tsx
```
Customer info (name, phone, address with map link)
Device and issue details
Action buttons:
  - "Accept Job" / "Reject Job" (if new)
  - Status update dropdown (Inspection Done / Repair Started / Parts Needed /
    Completed)
  - "Add Repair Note" (textarea)
  - Photo upload (before/after device photos)
  - "Generate Service Report" button → PDF
  - "Mark Ready for Delivery"
Parts needed form: part name, estimated cost → sends to manager for approval
```

#### 3.5 Job History — app/(technician)/jobs/history/page.tsx
```
All completed jobs with filters (date range, status)
Performance summary: jobs this month, avg completion time, rating
```

#### 3.6 GPS Tracking — Optional (MODULE 10 requirement)
```
Only build if client confirms GPS tracking is needed.
Technician can share live location:
  - "Share My Location" toggle in technician dashboard topbar
  - Uses browser Geolocation API (watchPosition)
  - Sends coordinates to POST /api/v1/technician/location every 30 seconds while active
  - Manager/Admin sees technician pins on Google Maps in app/(admin)/map/page.tsx
    (Google Maps JS API, pin per active technician, click → technician info)
Attendance tracking:
  - "Check In" button (stores location + timestamp) when technician starts work
  - "Check Out" button at end of day
  - Attendance history in technician profile
```

### Phase 3 Deliverables Checklist
- [ ] Technician login
- [ ] Technician dashboard with today's jobs
- [ ] Job detail with full workflow actions
- [ ] Repair estimate creation (after diagnosis)
- [ ] Photo upload (before/after)
- [ ] Repair notes and parts request
- [ ] Job history with performance stats
- [ ] GPS tracking (optional — confirm with client before building)

---

## PHASE 4 — Admin & Manager Panel

### Goal
Build the full CRM admin panel with lead management, ticket management, technician assignment, inventory, invoicing, and analytics.

### Tasks

#### 4.1 Admin Auth
```
app/(admin)/login/page.tsx — email + password, 2FA optional
Role check: admin, manager — different sidebar items per role
```

#### 4.2 Admin Layout
```
app/(admin)/layout.tsx:
  Sidebar (dark, bg-primary-900):
    Dashboard, Leads, Tickets, Customers, Technicians, Services,
    Inventory, Invoices, Payments, Reports, Settings, Website Content
  Topbar: global search, notifications, admin avatar + role badge
```

#### 4.3 Admin Dashboard — app/(admin)/dashboard/page.tsx
```
Top stat cards (8) — matches spec "Lead Dashboard" KPIs:
  Row 1: Total Leads, New Leads Today, Pending Leads, Completed Jobs Today
  Row 2: Revenue Generated (month), Technician Performance (avg jobs/day),
          Active Tickets, Pending Payments
  Each card: icon, value, % change vs previous period (↑ green / ↓ red)
Lead pipeline Kanban (drag-and-drop columns):
  New → Contacted → Inspection Scheduled → TV Received →
  Repair In Progress → Quality Check → Ready → Delivered → Closed
  Use @dnd-kit/core for drag-and-drop
Recent activity feed (right panel)
Charts row:
  - Revenue trend (line chart, last 30 days)
  - Leads by source (pie chart: Website, WhatsApp, Phone, Facebook, Google)
  - Ticket status distribution (donut chart)
```

#### 4.4 Leads Management — app/(admin)/leads/page.tsx
```
Full lead table with columns:
  ID, Name, Phone, Source, Status, Assigned To, Created At, Actions
Filters: status, source, date range, assigned technician, search
Bulk actions: assign technician, change status, export
"Add Lead" modal: name, phone, email, source (dropdown including all 7
  sources: Website, WhatsApp, Chatbot, Phone Call, Facebook Ads,
  Google Ads, Referral), service type, notes
Lead detail drawer (slide-over from right):
  Full lead info, status timeline, notes, task list, communication log
```

#### 4.5 Ticket Management — app/(admin)/tickets/page.tsx
```
Ticket table: ID, Customer, Service, Status, Technician, ETA, Actions
Filters: status, technician, date range
Click ticket → detail modal or route
Assign/reassign technician dropdown
Update status, add manager notes
```

#### 4.6 Customer Management — app/(admin)/customers/page.tsx
```
Customer table: name, phone, email, total tickets, last service, actions
Search, filter by activity
Customer detail: full profile, ticket history, payment history, chat history
```

#### 4.7 Technician Management — app/(admin)/technicians/page.tsx
```
Technician cards/table: name, active jobs, completed this month, rating
Add technician form: name, phone, email, skill set, joining date
Technician detail: profile, assigned jobs, performance chart
```

#### 4.8 Inventory — app/(admin)/inventory/page.tsx
```
Parts table: part name, category (TV Spare Parts / Speaker Components /
  Electronic Parts), quantity, reorder level, unit price, supplier, actions
Low stock alert banner (red) if any item below reorder level
"Add Stock" modal, "Stock In" / "Stock Out" buttons per row
Stock movement history table (date, type, qty, linked ticket)
"Create Purchase Order" button → PO form: vendor dropdown, items list,
  expected delivery date → generates PO document (PDF download)
```

#### 4.8b Vendor Management — app/(admin)/vendors/page.tsx
```
MODULE 11 requirement — Vendor Management.
Vendor table: vendor name, contact person, phone, email, category (parts supplier /
  component supplier), total orders, last order date, actions
"Add Vendor" modal: name, contact, phone, email, address, supply category
Vendor detail: profile + purchase order history
Vendor dropdown feeds into "Create Purchase Order" form in Inventory.
```

#### 4.9 Estimates & Invoices — app/(admin)/invoices/page.tsx
```
MODULE 12 requirement — Repair Estimate + Tax Invoice + Service Invoice + Payment Receipt.

Tabs: Estimates | Invoices | Receipts

ESTIMATES TAB:
  - List: estimate number, customer, ticket, estimated amount, status (Draft/Sent/Approved/Rejected)
  - "Create Estimate" → select ticket, add line items (labor + parts), tax %, total
  - Send to customer (email + WhatsApp) — customer can approve/reject from portal
  - On customer approval → "Convert to Invoice" button

INVOICES TAB:
  - List: invoice number, customer, ticket, amount, status (Draft/Sent/Paid/Cancelled), date
  - "Create Invoice" → from approved estimate or manually
  - Invoice detail: line items, tax breakdown, customer info, payment status
  - "Send Invoice" button (email + WhatsApp with PDF link)
  - Download PDF (Tax Invoice format with GST fields)

RECEIPTS TAB:
  - Auto-generated when payment is CAPTURED
  - List: receipt number, customer, invoice, amount, payment method, date
  - Download PDF receipt (shows payment ID, method, timestamp)

PDF format for each:
  - Company letterhead (logo, name, address, GST number)
  - Document type clearly labeled (ESTIMATE / TAX INVOICE / PAYMENT RECEIPT)
```

#### 4.9b Repair Estimate in Technician Flow
```
In Phase 3 job detail (3.4), after diagnosis:
  Add "Create Estimate" button → inline form:
    - Labor charge, parts list with costs, estimated completion date
  Submits to POST /api/v1/technician/jobs/:ticketId/estimate
  Customer receives WhatsApp + email notification to approve/reject
  Technician sees "Awaiting Approval" badge on job card
```

#### 4.10 Payments — app/(admin)/payments/page.tsx
```
Payment table: transaction ID, customer, amount, method (UPI/Card/NetBanking),
  gateway (Razorpay/PayU), status, date
Revenue summary: today, this week, this month
Export to CSV/Excel
Refund action (manual)
"Download Receipt" button per payment row → PDF
```

#### 4.11 Reports & Analytics — app/(admin)/reports/page.tsx
```
Date range picker at top.
Report cards (each expandable with chart):
  1. Daily Leads Report (bar chart) — with source breakdown
  2. Monthly Revenue (line chart) — actual vs previous month
  3. Technician Performance (table + bar chart) — jobs, avg time, rating
  4. Service Completion Rate (donut) — on-time vs delayed
  5. Customer Satisfaction (star rating avg + distribution) — requires Module 4.15
  6. Repeat Customers (count + list) — customers with 2+ tickets
Export buttons: PDF, Excel, CSV — per report
```

#### 4.14 Manage Services — app/(admin)/services/page.tsx
```
MODULE 14 requirement — "Manage Services".
Service catalog table:
  - Service name, category (TV Repair / Speaker / Installation),
    base price, estimated duration, is_active toggle, actions
"Add Service" modal:
  - name, category, description, base_price, estimated_duration_hours,
    is_pickup_available toggle, is_active toggle
Edit/Delete per service.
Services feed into:
  - Booking form service type dropdown (only active services shown)
  - Services page on website (content-managed)
Changes → POST/PUT/DELETE /api/v1/admin/services
```

#### 4.15 Customer Satisfaction Collection
```
MODULE 13 requirement — Customer Satisfaction report needs a data source.
After ticket status → "delivered":
  System queues a satisfaction survey notification (SMS + WhatsApp):
  "Rate your repair experience: [1 star link] [2] [3] [4] [5 star link]"
  Each link → /rate?ticketId=TVR-XXXX&rating=N (no login required)

Rating page: app/(website)/rate/page.tsx
  - Shows ticket summary (device, service type)
  - Star rating selector (1–5)
  - Optional comment textarea
  - Submit → POST /api/v1/public/ratings
  - Thank you confirmation after submit

Admin sees satisfaction data in Reports → Customer Satisfaction tab.
```

#### 4.13 Settings — app/(admin)/settings/page.tsx
```
Tabs:
  - General: business name, address, contact, working hours
  - Notifications: SMS template editor, email template editor, 
    WhatsApp template editor (including Payment Reminder template)
  - Payment: Razorpay keys, PayU keys (alternative), service visit fee (₹250)
  - Users & Roles: add admin/manager users, set permissions (RBAC)
  - Integrations: WhatsApp API config, SMS gateway config, chatbot config
```

#### 4.12 Website Content Management — app/(admin)/content/page.tsx
```
Edit: testimonials, team members, service descriptions, product catalog
Image upload for products
No-code content editing with preview
Changes → PATCH /api/admin/content/[section]
```

#### 4.13 Settings — app/(admin)/settings/page.tsx
```
Tabs:
  - General: business name, address, contact, working hours
  - Notifications: SMS template editor, email template editor, 
    WhatsApp template editor
  - Payment: Razorpay keys, service visit fee (currently ₹250)
  - Users & Roles: add admin/manager users, set permissions
  - Integrations: WhatsApp API config, SMS gateway config
```

### Phase 4 Deliverables Checklist
- [ ] Admin login with role detection
- [ ] Admin sidebar + layout (role-aware menu, includes Services)
- [ ] Dashboard with 8 KPI cards, Kanban, and charts
- [ ] Lead management (all 7 sources in Add Lead form, Kanban, bulk actions)
- [ ] Ticket management
- [ ] Customer management
- [ ] Technician management
- [ ] Service catalog management (add/edit/toggle active)
- [ ] Inventory management with low stock alerts + purchase orders
- [ ] Vendor management (add/list/link to PO)
- [ ] Estimates (create, send, approve flow)
- [ ] Invoices (create from estimate or manual, send, PDF — Tax Invoice format)
- [ ] Payment receipts (auto-generated, downloadable PDF)
- [ ] Payment management with export + receipt download
- [ ] Reports & analytics (all 6 reports + customer satisfaction)
- [ ] Customer satisfaction rating page (/rate)
- [ ] Website content management
- [ ] Settings (templates including payment reminder, Razorpay + PayU keys, RBAC)

---

## PHASE 5 — Polish, Performance & Deployment

### Tasks

#### 5.1 Performance
```
Run Lighthouse audit on all public pages → target 90+ on all scores.
Optimize images: WebP format, correct sizes, lazy loading.
Add next/font for Inter and Poppins (eliminate FOUT).
Code-split admin routes with dynamic imports.
Add React.Suspense + loading.tsx for all route segments.
```

#### 5.2 SEO
```
Complete metadata in app/layout.tsx (title template, description, OG tags).
Add JSON-LD LocalBusiness schema on home and contact pages.
Add sitemap.xml (next-sitemap package).
Add robots.txt.
All images have meaningful alt text.
```

#### 5.3 Accessibility
```
Audit with axe-core DevTools.
All interactive elements have aria-label.
Focus traps in modals and drawers.
Skip-to-main-content link.
Color contrast passes WCAG AA.
```

#### 5.4 Error Handling
```
Global error.tsx and not-found.tsx in app router.
API error handling in lib/api/client.ts → maps HTTP status to user messages.
Sentry integration for error tracking (optional).
```

#### 5.5 Testing
```
Unit tests for Zod schemas in lib/validations/.
Integration tests for booking flow with MSW (mock service worker).
Cypress E2E: home page → book service → payment → success page.
```

#### 5.6 Deployment
```
Dockerfile for Next.js standalone output.
Docker Compose (frontend service).
Environment variables documented in .env.example.
Nginx config for reverse proxy (if self-hosted).
CI/CD: GitHub Actions → build, lint, test → deploy to AWS/DigitalOcean.
```

### Phase 5 Deliverables Checklist
- [ ] All public pages score 90+ on Lighthouse
- [ ] Complete SEO with sitemap and schema
- [ ] Accessibility audit passed
- [ ] Global error boundaries and 404 page
- [ ] Unit + integration + E2E tests
- [ ] Dockerfile and deployment config
- [ ] GitHub Actions CI/CD pipeline

---

## How to Use This Prompt

**Start a new phase**: Paste this file content into Claude + specify the phase:
> "I am starting Phase 2. Read the context section and Phase 2 tasks. Begin with task 2.1 Authentication Pages."

**Resume mid-phase**: 
> "We completed 2.1 and 2.2. Continue with 2.3 Customer Dashboard."

**Debug a component**:
> "The ChatPanel in Phase 2 task 2.6 is not connecting to Socket.io. Read components/customer/ChatPanel.tsx and debug."

**Always provide**:
1. Which phase and task
2. What is already built (if resuming)
3. Any API endpoint responses (paste from backend)
