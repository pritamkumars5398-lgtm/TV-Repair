# TV Repair CRM — Frontend

## Project Identity
This is the **frontend** of a full-stack TV Repairing & Speaker Manufacturing business platform. It serves four user types: **Customers**, **Technicians**, **Service Managers**, and **Admins**.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **PDF**: react-pdf / jsPDF
- **Real-time**: Socket.io client
- **Maps**: Google Maps API
- **Payment UI**: Razorpay checkout

## Folder Structure
```
frontend/
├── app/                  # Next.js App Router pages
│   ├── (website)/        # Public marketing website
│   ├── (customer)/       # Customer portal (authenticated)
│   ├── (technician)/     # Technician dashboard (authenticated)
│   ├── (admin)/          # Admin/Manager panel (authenticated)
│   └── api/              # Next.js API routes (proxy layer only)
├── components/
│   ├── ui/               # shadcn/ui base components
│   ├── website/          # Marketing website components
│   ├── customer/         # Customer portal components
│   ├── technician/       # Technician dashboard components
│   ├── admin/            # Admin panel components
│   └── shared/           # Shared components (chat, notifications, etc.)
├── lib/
│   ├── api/              # API client functions (axios instances)
│   ├── hooks/            # Custom React hooks
│   ├── stores/           # Zustand stores
│   ├── utils/            # Utility functions
│   └── validations/      # Zod schemas
├── types/                # Global TypeScript types/interfaces
├── public/               # Static assets
├── docs/                 # Feature-wise documentation (see below)
├── theme.md              # Design system, colors, typography
├── CLAUDE.md             # This file
└── agent.md              # AI agent instructions
```

## Docs Structure
Each module has its own doc folder under `docs/`:
- `module-1-website/` — Public marketing pages
- `module-2-leads/` — Lead capture UI
- `module-3-service-booking/` — Booking flow
- `module-4-payments/` — Payment UI (Razorpay)
- `module-5-tickets/` — Ticket display
- `module-6-tracking/` — Repair status tracker
- `module-7-customer-portal/` — Customer dashboard
- `module-8-whatsapp/` — WhatsApp click-to-chat
- `module-9-chatbot/` — AI chatbot widget
- `module-10-technician/` — Technician dashboard
- `module-12-invoicing/` — Invoice download UI
- `module-13-analytics/` — Charts and reports
- `module-14-admin/` — Admin panel

## Key Principles
- Mobile-first, fully responsive (320px to 1920px)
- All pages must score 90+ on Lighthouse (performance, accessibility, SEO)
- No inline styles — use Tailwind utility classes only
- Use shadcn/ui components as the base; extend via `variants`
- Forms use React Hook Form + Zod; never manage form state manually
- API calls go through `lib/api/` — never call `fetch` directly in components
- Loading, error, and empty states are required for every data-driven UI
- Role-based route guards: middleware.ts handles auth redirects
- Always use `next/image` for images, `next/link` for navigation

## Environment Variables (prefix: NEXT_PUBLIC_ for client-side)
```
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
NEXT_PUBLIC_GOOGLE_MAPS_KEY=
NEXT_PUBLIC_WHATSAPP_NUMBER=
NEXT_PUBLIC_SOCKET_URL=
```

## User Roles & Routes
| Role | Base Route | Auth Required |
|------|-----------|---------------|
| Public | `/` | No |
| Customer | `/portal/` | Yes |
| Technician | `/technician/` | Yes |
| Manager | `/manager/` | Yes |
| Admin | `/admin/` | Yes |

## Coding Conventions
- File names: `kebab-case.tsx`
- Component names: `PascalCase`
- Hooks: `use-kebab-case.ts`
- Stores: `kebab-case-store.ts`
- Always export named exports from components; default export only in `page.tsx` files
- Group imports: external → internal → relative → types
