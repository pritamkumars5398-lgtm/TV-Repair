# Module 4 — Payment UI (Frontend)

## Overview
Two payment scenarios: (1) ₹250 service visit fee at booking, (2) repair invoice payment from customer portal.

## Scenario 1 — Booking Payment (Public, ₹250)

### Flow
1. User completes 3-step booking form (`/book`)
2. Step 3 shows order summary + "Pay ₹250 to Confirm" button
3. On click → `POST /api/v1/public/bookings` → get `razorpayOrderId`
4. Open Razorpay checkout modal (window.Razorpay)
5. On payment success → `POST /api/v1/public/bookings/verify-payment`
6. On verify success → redirect to `/booking/success?ticketId=TVR-XXXX`

### Razorpay Checkout Config
```ts
const options = {
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  amount: 25000, // paise
  currency: "INR",
  name: "TV Repair Service",
  description: "Service Visit Fee",
  order_id: razorpayOrderId,
  handler: async (response) => {
    // call verify-payment endpoint
  },
  prefill: { name, email, contact: phone },
  theme: { color: "#2563eb" }, // primary-600
};
new window.Razorpay(options).open();
```

Load Razorpay script: `https://checkout.razorpay.com/v1/checkout.js`
Use `next/script` with `strategy="lazyOnload"` on the booking page.

## Scenario 2 — Repair Invoice Payment (Customer Portal)

### Flow
1. Customer sees unpaid invoice in `/portal/payments`
2. Clicks "Pay Now" → `POST /api/v1/customer/payments/order`
3. Opens Razorpay modal
4. On success → `POST /api/v1/customer/payments/verify`
5. Invoice status updates to PAID, toast shown

## Payment Status Badges
```
PENDING:  bg-yellow-100 text-yellow-700  "Pending"
CAPTURED: bg-green-100  text-green-700   "Paid"
FAILED:   bg-red-100    text-red-700     "Failed"
REFUNDED: bg-gray-100   text-gray-700    "Refunded"
```

## Error Handling
- Payment cancelled by user → show dismissible warning toast (not error)
- Payment failed → show error toast with "Retry Payment" button
- Network error during verify → show "Contact us with your payment ID" message
- Never auto-retry payment verification (risk of double-charge)

## Components
- `components/shared/RazorpayButton.tsx` — reusable button that triggers checkout
- `components/customer/PaymentList.tsx` — transaction history table
- `components/customer/InvoiceCard.tsx` — pending invoice with pay button
