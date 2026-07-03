# Module 6 — Repair Status Tracking (Frontend)

## Overview
Public-facing repair tracker — no login required. Customer enters their Ticket ID to see current status and history.

## Page
`app/(website)/track/page.tsx`

## Ticket ID Format
`TVR-YYYY-NNNN` (e.g., `TVR-2026-0001`)
- Display in monospace font, uppercase, with dashes
- Input: auto-uppercase, allow dashes, max 13 chars
- Validate with regex: `/^TVR-\d{4}-\d{4}$/`

## Status Timeline
Vertical timeline component with these stages:
```
1. TV Received          — tv_received
2. Diagnosis Completed  — diagnosis_completed
3. Spare Parts Ordered  — parts_ordered (conditional, only shown if parts needed)
4. Repair In Progress   — repair_in_progress
5. Quality Testing      — quality_check
6. Ready for Delivery   — ready_for_delivery
7. Delivered            — delivered
```

### Timeline Visual Rules
- Completed step: green checkmark circle, solid green line below
- Current step: blue pulsing circle, bold text, highlighted card
- Upcoming step: gray empty circle, dashed gray line
- Each step shows: timestamp (if completed), technician note (if any)

## Component: `StatusTimeline`
```tsx
interface StatusTimelineProps {
  currentStatus: string;
  history: {
    status: string;
    note?: string;
    createdAt: string;
  }[];
}
```

## Empty / Error States
- Invalid format entered: inline input error "Please enter a valid Ticket ID (TVR-YYYY-NNNN)"
- Ticket not found: card with "No repair found for this ID" + "Book a service" CTA
- API error: "Unable to fetch status. Please try again." with retry button

## Pre-fill from URL
Support `?id=TVR-2026-0001` query param → auto-search on page load
Used when customer clicks "Track Repair" link from SMS/WhatsApp.

## Customer Portal Version
Authenticated customers see the same timeline inside `/portal/repairs/[ticketId]` 
but with additional details (technician name, phone, photos, invoice).

## API
`GET /api/v1/public/track/:ticketId`
Response:
```json
{
  "success": true,
  "data": {
    "ticketId": "TVR-2026-0001",
    "serviceType": "LED TV Repair",
    "status": "repair_in_progress",
    "statusHistory": [
      { "status": "tv_received", "note": null, "createdAt": "2026-06-20T10:00:00Z" },
      { "status": "diagnosis_completed", "note": "Backlight issue found", "createdAt": "2026-06-20T14:30:00Z" }
    ]
  }
}
```
