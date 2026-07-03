# TV Repair CRM — Project Tracker

> Verify this file against: (1) requirements above, (2) actual code in `frontend/` and `backend/`.
> Mark ✅ only when code exists AND works. Mark ⚠️ for partial. Mark ❌ for not started.

**Last updated**: 2026-06-26
**Current phase**: Pre-development (planning complete)

---

## LEGEND
```
✅  Done — code exists and verified
⚠️  Partial — started but incomplete
❌  Not started
🔲  Not applicable / optional
📄  Doc/prompt written — no code yet
```

---

## PLANNING FILES STATUS

| File | Status | Location |
|------|--------|----------|
| Frontend CLAUDE.md | 📄 | `frontend/CLAUDE.md` |
| Frontend agent.md | 📄 | `frontend/agent.md` |
| Frontend theme.md | 📄 | `frontend/theme.md` |
| Frontend prompt.md (5-phase) | 📄 | `frontend/prompt.md` |
| Backend CLAUDE.md | 📄 | `backend/CLAUDE.md` |
| Backend agent.md | 📄 | `backend/agent.md` |
| Backend prompt.md (5-phase) | 📄 | `backend/prompt.md` |
| TRACKER.md (this file) | 📄 | `TRACKER.md` |

### Frontend Docs
| Module Doc | Status | Location |
|-----------|--------|----------|
| Module 1 — Website | 📄 | `frontend/docs/module-1-website/README.md` |
| Module 2 — Leads | 📄 | `frontend/docs/module-2-leads/README.md` |
| Module 3 — Booking | ❌ | `frontend/docs/module-3-service-booking/README.md` |
| Module 4 — Payments | 📄 | `frontend/docs/module-4-payments/README.md` |
| Module 5 — Tickets | ❌ | `frontend/docs/module-5-tickets/README.md` |
| Module 6 — Tracking | 📄 | `frontend/docs/module-6-tracking/README.md` |
| Module 7 — Customer Portal | ❌ | `frontend/docs/module-7-customer-portal/README.md` |
| Module 8 — WhatsApp | ❌ | `frontend/docs/module-8-whatsapp/README.md` |
| Module 9 — Chatbot | ❌ | `frontend/docs/module-9-chatbot/README.md` |
| Module 10 — Technician | ❌ | `frontend/docs/module-10-technician/README.md` |
| Module 12 — Invoicing | ❌ | `frontend/docs/module-12-invoicing/README.md` |
| Module 13 — Analytics | ❌ | `frontend/docs/module-13-analytics/README.md` |
| Module 14 — Admin | 📄 | `frontend/docs/module-14-admin/README.md` |

### Backend Docs
| Module Doc | Status | Location |
|-----------|--------|----------|
| Database schema | 📄 | `backend/docs/database/README.md` |
| Auth | 📄 | `backend/docs/auth/README.md` |
| Module 4 — Payments | 📄 | `backend/docs/module-4-payments/README.md` |
| Module 5 — Tickets | 📄 | `backend/docs/module-5-tickets/README.md` |
| Module 8 — WhatsApp | 📄 | `backend/docs/module-8-whatsapp/README.md` |
| Module 11 — Inventory | ❌ | `backend/docs/module-11-inventory/README.md` |
| Module 13 — Analytics | 📄 | `backend/docs/module-13-analytics/README.md` |
| Module 14 — Admin | ❌ | `backend/docs/module-14-admin/README.md` |

---

## MODULE-BY-MODULE TRACKER

### MODULE 1 — Business Website

| Feature | Frontend | Backend | Notes |
|---------|----------|---------|-------|
| Home — Hero section | ❌ | N/A | Phase 1 task 1.3 |
| Home — Stats Bar | ❌ | N/A | |
| Home — Services Overview | ❌ | N/A | |
| Home — Why Choose Us | ❌ | N/A | |
| Home — How It Works | ❌ | N/A | |
| Home — Testimonials | ❌ | N/A | From DB via `/public/content/TESTIMONIALS` |
| Home — CTA Banner | ❌ | N/A | |
| Home — **Contact Information section** | ❌ | N/A | Required by spec (address/phone/email cards) |
| About Us page | ❌ | N/A | |
| Services page — TV Repair (6 services) | ❌ | N/A | |
| Services page — Pick & Drop facility | ❌ | N/A | |
| Services page — Speaker Manufacturing (4 services) | ❌ | N/A | |
| Products page — Speaker catalog | ❌ | N/A | |
| Products page — Inquiry form | ❌ | ❌ | `POST /public/inquiries` |
| Contact page — Form | ❌ | ❌ | `POST /public/leads` |
| Contact page — Google Map embed | ❌ | N/A | |
| Contact page — Click-to-Call | ❌ | N/A | |
| Contact page — WhatsApp Chat | ❌ | N/A | |
| Navbar (sticky, mobile hamburger) | ❌ | N/A | |
| Footer (4-col, social links) | ❌ | N/A | |
| WhatsApp floating button | ❌ | N/A | |
| SEO (OG tags, JSON-LD LocalBusiness) | ❌ | N/A | |
| Sitemap + robots.txt | ❌ | N/A | Phase 5 |

---

### MODULE 2 — Lead Management CRM

| Feature | Frontend | Backend | Notes |
|---------|----------|---------|-------|
| Lead source: Website form | ❌ | ❌ | |
| Lead source: WhatsApp | ❌ | ❌ | Click link → creates lead via webhook |
| Lead source: Chatbot | ❌ | ❌ | |
| Lead source: Phone Call | ❌ | ❌ | Admin manual entry |
| Lead source: Facebook Ads | ❌ | ❌ | UTM param tracking |
| Lead source: Google Ads | ❌ | ❌ | UTM param tracking |
| Lead source: Referral | ❌ | ❌ | Admin manual entry |
| Lead pipeline — all 9 stages | ❌ | ❌ | Status machine in service layer |
| Lead Kanban (drag-and-drop) | ❌ | N/A | Admin Phase 4 |
| Lead Dashboard — Total Leads KPI | ❌ | ❌ | |
| Lead Dashboard — New Leads KPI | ❌ | ❌ | |
| Lead Dashboard — Pending Leads KPI | ❌ | ❌ | |
| Lead Dashboard — Completed Jobs KPI | ❌ | ❌ | |
| Lead Dashboard — Revenue Generated KPI | ❌ | ❌ | |
| Lead Dashboard — Technician Performance KPI | ❌ | ❌ | |
| Add Lead (all 7 sources in dropdown) | ❌ | ❌ | Admin Phase 4 |
| Lead detail drawer | ❌ | ❌ | Admin Phase 4 |
| Bulk assign leads | ❌ | ❌ | |
| Export leads | ❌ | ❌ | |

---

### MODULE 3 — Customer Service Request System

| Feature | Frontend | Backend | Notes |
|---------|----------|---------|-------|
| Book TV Repair Service | ❌ | ❌ | Phase 1 booking form |
| Book Home Visit | ❌ | ❌ | Service type option |
| Book Speaker Repair | ❌ | ❌ | Service type option |
| Select Preferred Date | ❌ | ❌ | Date + time slot picker |
| Upload Product Photos | ❌ | ❌ | S3 upload |
| Describe Issue | ❌ | ❌ | Textarea |
| Pick & Drop toggle | ❌ | ❌ | Step 2 of booking |

---

### MODULE 4 — Online Payment System

| Feature | Frontend | Backend | Notes |
|---------|----------|---------|-------|
| ₹250 service visit fee | ❌ | ❌ | Razorpay order creation |
| Razorpay checkout (UPI, Card, Net Banking) | ❌ | ❌ | Via Razorpay modal |
| PhonePe (via Razorpay) | ❌ | ❌ | Native in Razorpay checkout |
| Debit Card (via Razorpay) | ❌ | ❌ | |
| Credit Card (via Razorpay) | ❌ | ❌ | |
| Net Banking (via Razorpay) | ❌ | ❌ | |
| PayU (alternative gateway) | 🔲 | 🔲 | Optional — only if client requests |
| Payment confirmation + ticket auto-creation | ❌ | ❌ | On verify-payment success |
| Technician assignment after payment | ❌ | ❌ | Manual by admin initially |
| Razorpay webhook handler | N/A | ❌ | |

---

### MODULE 5 — Ticket Management System

| Feature | Frontend | Backend | Notes |
|---------|----------|---------|-------|
| Unique Tracking ID (TVR-YYYY-NNNN) | ❌ | ❌ | ID generator utility |
| Booking success page with Ticket ID | ❌ | N/A | |
| SMS notification on ticket create | N/A | ❌ | BOOKING_CONFIRMED template |
| Email notification on ticket create | N/A | ❌ | |
| WhatsApp notification on ticket create | N/A | ❌ | |

---

### MODULE 6 — Repair Status Tracking Portal

| Feature | Frontend | Backend | Notes |
|---------|----------|---------|-------|
| Public tracking page (no login) | ❌ | ❌ | `GET /public/track/:ticketId` |
| Track by Ticket ID input | ❌ | N/A | |
| Status: TV Received | ❌ | ❌ | |
| Status: Diagnosis Completed | ❌ | ❌ | |
| Status: Spare Parts Ordered | ❌ | ❌ | |
| Status: Repair In Progress | ❌ | ❌ | |
| Status: Quality Testing | ❌ | ❌ | |
| Status: Ready for Delivery | ❌ | ❌ | |
| Status: Delivered | ❌ | ❌ | |
| Live Status Timeline (vertical) | ❌ | N/A | |
| URL pre-fill (?id=TVR-XXXX) | ❌ | N/A | For SMS/WhatsApp links |

---

### MODULE 7 — Customer Communication Panel

| Feature | Frontend | Backend | Notes |
|---------|----------|---------|-------|
| Customer login (OTP) | ❌ | ❌ | Phase 2 |
| View Repair Status in portal | ❌ | ❌ | |
| Upload Documents | ❌ | ❌ | S3 upload |
| Download Invoice (PDF) | ❌ | ❌ | |
| Make Payments (from portal) | ❌ | ❌ | |
| Raise Queries | ❌ | ❌ | |
| Chat — Chat History | ❌ | ❌ | Socket.io + DB |
| Chat — File Sharing | ❌ | ❌ | S3 upload in chat |
| Chat — Image Sharing | ❌ | ❌ | |
| Chat — Repair Updates | ❌ | ❌ | System messages in chat |
| Customer dashboard stat cards | ❌ | ❌ | |
| Notification preferences toggle | ❌ | ❌ | SMS/Email/WhatsApp |

---

### MODULE 8 — WhatsApp Integration

| Feature | Frontend | Backend | Notes |
|---------|----------|---------|-------|
| Click-to-Chat button (website) | ❌ | N/A | Floating button |
| Automated: Booking Confirmed | N/A | ❌ | Template: booking_confirmed |
| Automated: TV Received | N/A | ❌ | Template: status_update |
| Automated: Repair Started | N/A | ❌ | |
| Automated: Ready for Delivery | N/A | ❌ | Template: ready_for_delivery |
| Automated: Invoice Generated | N/A | ❌ | Template: invoice_sent |
| Automated: **Payment Reminder** | N/A | ❌ | Template: payment_reminder (24h + 48h after invoice) |
| Automated: Delivery Alert | N/A | ❌ | Template: delivery_alert |
| WhatsApp inbound webhook | N/A | ❌ | Meta webhook |
| Inbound → chat message in CRM | ❌ | ❌ | |

---

### MODULE 9 — Chatbot System

| Feature | Frontend | Backend | Notes |
|---------|----------|---------|-------|
| Floating chatbot widget | ❌ | N/A | Phase 1 task 1.11 |
| FAQ: Service Charges | ❌ | N/A | Keyword match |
| FAQ: Repair Status query | ❌ | N/A | Keyword match |
| FAQ: Business Hours | ❌ | N/A | Keyword match |
| FAQ: Product Information | ❌ | N/A | Keyword match |
| FAQ: Appointment Booking | ❌ | N/A | Show "Book Now" CTA |
| Escalation to Human Agent | ❌ | N/A | Opens WhatsApp or chat |

---

### MODULE 10 — Technician Management

| Feature | Frontend | Backend | Notes |
|---------|----------|---------|-------|
| Technician login | ❌ | ❌ | Employee code + password |
| View Assigned Jobs | ❌ | ❌ | Phase 3 |
| Accept / Reject Job | ❌ | ❌ | |
| Update Job Status | ❌ | ❌ | |
| Upload Photos (before/after) | ❌ | ❌ | S3 upload |
| Add Repair Notes | ❌ | ❌ | |
| Create Repair Estimate | ❌ | ❌ | After diagnosis |
| Generate Service Reports (PDF) | ❌ | ❌ | |
| GPS: Live Location (optional) | 🔲 | 🔲 | Optional — confirm with client |
| GPS: Route Monitoring (optional) | 🔲 | 🔲 | Optional |
| Attendance: Check-in/out (optional) | 🔲 | 🔲 | Optional |

---

### MODULE 11 — Inventory Management

| Feature | Frontend | Backend | Notes |
|---------|----------|---------|-------|
| Track TV Spare Parts | ❌ | ❌ | Phase 4 |
| Track Speaker Components | ❌ | ❌ | |
| Track Electronic Parts | ❌ | ❌ | |
| Stock Levels display | ❌ | ❌ | |
| Low Stock Alerts (banner) | ❌ | ❌ | |
| Purchase Orders — create | ❌ | ❌ | |
| Purchase Orders — send to vendor | ❌ | ❌ | |
| Purchase Orders — receive (auto stock-in) | ❌ | ❌ | |
| Purchase Orders — PDF | ❌ | ❌ | |
| **Vendor Management — list/add/edit** | ❌ | ❌ | Required by spec |

---

### MODULE 12 — Invoice & Billing System

| Feature | Frontend | Backend | Notes |
|---------|----------|---------|-------|
| **Repair Estimate — create** | ❌ | ❌ | Separate from invoice |
| **Repair Estimate — send to customer** | ❌ | ❌ | Email + WhatsApp |
| **Repair Estimate — customer approves/rejects** | ❌ | ❌ | Portal + public URL |
| **Repair Estimate — convert to invoice** | ❌ | ❌ | |
| Tax Invoice — create | ❌ | ❌ | GST fields |
| Service Invoice — create | ❌ | ❌ | |
| Invoice — send (email + WhatsApp) | ❌ | ❌ | |
| Invoice — PDF download | ❌ | ❌ | Puppeteer |
| **Payment Receipt — auto-generate** | ❌ | ❌ | On payment capture |
| **Payment Receipt — PDF download** | ❌ | ❌ | |

---

### MODULE 13 — Reporting & Analytics

| Feature | Frontend | Backend | Notes |
|---------|----------|---------|-------|
| Daily Leads report | ❌ | ❌ | Phase 4/5 |
| Monthly Revenue report | ❌ | ❌ | |
| Technician Performance report | ❌ | ❌ | |
| Service Completion Rate report | ❌ | ❌ | |
| **Customer Satisfaction report** | ❌ | ❌ | Needs rating collection (Module 4.15) |
| Repeat Customers report | ❌ | ❌ | |
| Export — Excel | ❌ | ❌ | |
| Export — PDF | ❌ | ❌ | |
| Export — CSV | ❌ | ❌ | |
| **Customer rating collection page** (/rate) | ❌ | ❌ | Post-delivery survey |

---

### MODULE 14 — Admin Panel

| Feature | Frontend | Backend | Notes |
|---------|----------|---------|-------|
| Admin login + role detection | ❌ | ❌ | Phase 4 |
| Manage Leads | ❌ | ❌ | |
| Manage Customers | ❌ | ❌ | |
| Manage Technicians | ❌ | ❌ | |
| **Manage Services** (service catalog) | ❌ | ❌ | Add/edit/toggle active services |
| Manage Payments | ❌ | ❌ | |
| Manage Inventory | ❌ | ❌ | |
| Manage Website Content | ❌ | ❌ | |
| Role Based Access Control (RBAC) | ❌ | ❌ | Admin vs Manager permissions |
| Technician GPS map view (optional) | 🔲 | 🔲 | Optional |

---

## INFRASTRUCTURE STATUS

| Item | Status | Notes |
|------|--------|-------|
| Frontend project initialized | ❌ | Next.js 14, TypeScript, Tailwind |
| Backend project initialized | ❌ | Node.js 20, Express, TypeScript |
| MySQL database set up | ❌ | |
| Prisma schema + migration | ❌ | All models including new ones |
| Redis configured | ❌ | OTP, cache, rate limiting |
| AWS S3 configured | ❌ | Photos, PDFs |
| Razorpay configured | ❌ | |
| WhatsApp Business API configured | ❌ | Meta account + approved templates |
| SMS gateway configured | ❌ | MSG91 or Fast2SMS |
| Email service configured | ❌ | SendGrid or Nodemailer |
| Bull queues set up | ❌ | notification + pdf queues |
| Socket.io configured | ❌ | /chat namespace |
| Docker / docker-compose | ❌ | Phase 5 |
| CI/CD (GitHub Actions) | ❌ | Phase 5 |
| Hosting (AWS / DigitalOcean) | ❌ | Phase 5 |

---

## WHAT WAS MISSING FROM ORIGINAL PROMPT (Fixed on 2026-06-26)

These items were in the client requirements but were absent from the initial prompts. All have been added:

| # | Gap | Where Fixed |
|---|-----|-------------|
| 1 | Home page "Contact Information" section | `frontend/prompt.md` Phase 1 task 1.3 section 8 |
| 2 | Module 9 Chatbot widget — entire module was missing | `frontend/prompt.md` Phase 1 task 1.11 |
| 3 | GPS Tracking (Module 10, optional) | `frontend/prompt.md` Phase 3 task 3.6 |
| 4 | PayU as alternative gateway (noted) | `frontend/prompt.md` Phase 1 task 1.8 |
| 5 | WhatsApp Payment Reminders | `backend/prompt.md` Phase 5 notification templates |
| 6 | Vendor Management (Module 11) | `frontend/prompt.md` task 4.8b + `backend/prompt.md` task 4.5b |
| 7 | Repair Estimate as separate document before Invoice | `frontend/prompt.md` task 4.9 + `backend/prompt.md` task 4.6 |
| 8 | Payment Receipt (auto-generated PDF) | `frontend/prompt.md` task 4.9 + `backend/prompt.md` task 4.7b |
| 9 | Manage Services in Admin panel (Module 14) | `frontend/prompt.md` task 4.14 + `backend/prompt.md` task 4.7c |
| 10 | Lead Dashboard KPIs: "Total Leads" + "Pending Leads" | `frontend/prompt.md` task 4.3 (now 8 KPI cards) |
| 11 | Customer Satisfaction data collection mechanism | `frontend/prompt.md` task 4.15 + `backend/prompt.md` task 4.8b |
| 12 | All 7 lead sources in Admin "Add Lead" form | `frontend/prompt.md` task 4.4 |
| 13 | Vendor, Estimate, CustomerRating, Service, GPS models | `backend/prompt.md` Phase 1 Prisma schema |
| 14 | Purchase Orders full flow (create/send/receive) | `backend/prompt.md` task 4.5c |
| 15 | Delivery Alert WhatsApp notification | `backend/prompt.md` Phase 5 templates |

---

## HOW TO USE THIS TRACKER

**When you complete a feature:**
1. Change ❌ to ✅ in the relevant row
2. Update "Last updated" date at the top
3. If it's partial, use ⚠️ and add a note

**To verify a feature is done — check THREE things:**
1. This tracker says ✅
2. The file exists in `frontend/` or `backend/` (use `find` or the IDE)
3. The feature actually works when you run the app

**To check what's left:**
```bash
grep -c "❌" TRACKER.md
```
