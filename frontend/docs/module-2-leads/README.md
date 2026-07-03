# Module 2 — Lead Capture UI (Frontend)

## Overview
Lead capture happens through public forms on the website. No dedicated lead UI for customers — leads are created invisibly when customers submit contact/booking forms.

## Lead Entry Points
1. **Contact Page Form** — `app/(website)/contact/page.tsx`
2. **Booking Form** — `app/(website)/book/page.tsx` (Step 1 creates a lead)
3. **Product Inquiry** — `app/(website)/products/page.tsx`
4. **Chatbot** — `components/shared/ChatbotWidget.tsx`
5. **WhatsApp Click** — opens `wa.me/` link (tracked server-side)

## Lead Sources (mapped on form submit)
| Form | source value |
|------|-------------|
| Contact form | `WEBSITE` |
| Product inquiry | `WEBSITE` |
| Chatbot | `CHATBOT` |
| WhatsApp button click | `WHATSAPP` |
| UTM param `?utm_source=facebook` | `FACEBOOK` |
| UTM param `?utm_source=google` | `GOOGLE` |

## UTM Tracking
- Read UTM params from URL on page load
- Store in sessionStorage: `{ utm_source, utm_medium, utm_campaign }`
- Include in lead payload on form submit

## Contact Form Fields
```
name: string (required)
phone: string (required, 10-digit Indian mobile)
email: string (optional)
serviceType: enum (TV_REPAIR | SPEAKER_REPAIR | HOME_THEATER | PRODUCT_INQUIRY)
message: string (required, min 20 chars)
```

## Success State
After successful lead submit:
- Show success card: "We'll call you within 2 hours!"
- Hide form, show reference number (leadId or ticket ID if booking)
- WhatsApp CTA: "Message us directly"

## Admin Lead Management
See `docs/module-14-admin/README.md` for the admin lead Kanban and table.

## API
`POST /api/v1/public/leads` — no auth required
Response: `{ success: true, data: { leadId } }`
