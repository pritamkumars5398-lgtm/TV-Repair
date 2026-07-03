# Module 14 — Admin Panel (Frontend)

## Overview
Full CRM admin panel for admins and managers. Role-based access: admins see everything; managers see leads, tickets, customers, technicians (no settings/user management).

## Layout — `app/(admin)/layout.tsx`
- Dark sidebar (`bg-primary-900`), width 64 (256px), collapsible on mobile
- Topbar: global search, notification bell, user avatar + role badge
- Main content area: `bg-neutral-50`, padded

## Sidebar Menu Items
| Item | Route | Admin | Manager |
|------|-------|-------|---------|
| Dashboard | `/admin/dashboard` | ✓ | ✓ |
| Leads | `/admin/leads` | ✓ | ✓ |
| Tickets | `/admin/tickets` | ✓ | ✓ |
| Customers | `/admin/customers` | ✓ | ✓ |
| Technicians | `/admin/technicians` | ✓ | ✓ |
| Inventory | `/admin/inventory` | ✓ | ✗ |
| Invoices | `/admin/invoices` | ✓ | ✓ |
| Payments | `/admin/payments` | ✓ | ✗ |
| Reports | `/admin/reports` | ✓ | ✓ |
| Website Content | `/admin/content` | ✓ | ✗ |
| Settings | `/admin/settings` | ✓ | ✗ |

## Dashboard — `app/(admin)/dashboard/page.tsx`

### KPI Cards (top row, 6 cards)
```
New Leads Today     Active Tickets      Technicians on Field
Revenue This Month  Pending Payments    Completed Jobs Today
```
Each card: icon, value, % change vs yesterday (green ↑ / red ↓).

### Lead Kanban (`@dnd-kit/core`)
Columns: New Lead → Contacted → Inspection Scheduled → TV Received → Repair In Progress → Quality Check → Ready → Delivered → Closed
- Cards show: customer name, phone, service type, time since created
- Drag card to change status → `PUT /api/v1/admin/leads/:id`
- Overflow: columns scroll horizontally

### Charts Row
1. Revenue trend — line chart, last 30 days (Recharts)
2. Leads by source — pie chart: Website, WhatsApp, Phone, Facebook, Google
3. Ticket status distribution — donut chart

### Activity Feed (right panel)
Real-time feed of: new lead created, ticket status changed, payment received, technician assigned
Powered by Socket.io event `admin_activity`

## Leads Page — `app/(admin)/leads/page.tsx`
- Table with columns: ID, Name, Phone, Source badge, Status badge, Assigned To, Created, Actions
- Filters bar: status multiselect, source multiselect, date range, technician dropdown, search
- Bulk select + bulk actions: assign technician, change status, export
- "Add Lead" button → modal with form
- Row click → slide-over drawer (full lead detail, status history, notes, tasks)

## Tickets Page — `app/(admin)/tickets/page.tsx`
- Table: Ticket ID (TVR-format, monospace), Customer, Service, Status badge, Technician, ETA, Actions
- Assign technician: inline dropdown in table row
- Status update: click status badge → dropdown with valid next statuses
- Row click → detail modal or `/admin/tickets/[id]`

## Inventory Page — `app/(admin)/inventory/page.tsx`
- Table: Part Name, Category, SKU, Qty, Reorder Level, Unit Price, Status
- Status: "In Stock" (green) / "Low Stock" (yellow) / "Out of Stock" (red)
- Red banner at top: "3 items below reorder level" if any
- "Add Item" button, "Stock In" / "Stock Out" quick actions per row

## Reports Page — `app/(admin)/reports/page.tsx`
- Date range picker at top (affects all reports)
- Tab navigation: Leads | Revenue | Technicians | Tickets | Customers
- Each tab: chart + data table + "Export" dropdown (PDF / Excel / CSV)

## Components
- `components/admin/KpiCard.tsx`
- `components/admin/LeadKanban.tsx`
- `components/admin/LeadDrawer.tsx` (slide-over)
- `components/admin/TicketTable.tsx`
- `components/admin/StatChart.tsx` (Recharts wrapper)
- `components/admin/DataTable.tsx` (reusable sortable, filterable table)
- `components/admin/BulkActionBar.tsx`

## API Calls (Admin)
All prefixed `/api/v1/admin/`
See `backend/docs/module-14-admin/README.md` for full endpoint reference.
