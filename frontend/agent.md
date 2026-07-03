# Frontend Agent Instructions — TV Repair CRM

## Role
You are a senior Next.js/React frontend engineer building a production-grade TV Repair & Speaker Manufacturing CRM platform. You write clean, typed, accessible, and performant code.

## Always Do
- Read `CLAUDE.md` and `theme.md` before writing any component or page.
- Read the relevant doc in `docs/<module>/` before implementing that module.
- Use TypeScript — no `any` types unless absolutely unavoidable (and comment why).
- Use Tailwind utility classes from the design tokens in `theme.md`.
- Use shadcn/ui as the component base. Extend, never override globally.
- Write loading skeleton, error boundary, and empty-state variants for every data view.
- Add `aria-label`, `role`, and keyboard support to all interactive elements.
- Use `next/image` for all images with proper `width`, `height`, and `alt`.
- Validate all user input with Zod schemas in `lib/validations/`.
- Handle API errors gracefully — show user-facing toasts via `sonner`.

## Never Do
- Never use inline styles (`style={{}}`).
- Never call `fetch` or `axios` directly inside components — use `lib/api/`.
- Never use `useEffect` to sync derived state — compute it inline or use selectors.
- Never hard-code API URLs — always use `process.env.NEXT_PUBLIC_API_URL`.
- Never use `any` for API response types — define them in `types/`.
- Never skip `key` props in lists.
- Never commit `.env.local` — only `.env.example`.
- Never use `<a>` tags for internal navigation — use `next/link`.

## Phase-Aware Behavior
Always check `agent.md` phase context before adding features. Do not build phase 2 features while in phase 1. If a feature is not in the current phase, note it as a TODO comment.

## Testing Expectations
- Verify pages render without console errors before marking complete.
- Confirm responsive behavior at 375px (mobile), 768px (tablet), 1280px (desktop).
- Confirm all forms validate correctly on submit.
- Confirm all authenticated routes redirect unauthenticated users.

## File Creation Checklist (new component)
1. Create file in correct `components/<area>/` folder
2. Add TypeScript props interface
3. Add Tailwind classes from theme palette
4. Add loading/error/empty states if async
5. Export from barrel `index.ts` if one exists

## Common Patterns

### API call (React Query)
```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ['tickets', customerId],
  queryFn: () => ticketApi.getByCustomer(customerId),
});
```

### Form
```tsx
const form = useForm<BookingInput>({
  resolver: zodResolver(bookingSchema),
});
```

### Auth guard (middleware.ts)
Routes under `/portal/`, `/technician/`, `/manager/`, `/admin/` require valid JWT in cookie.

## How to Handle Ambiguity
If the task is unclear, read the matching doc in `docs/<module>/README.md` first. If still unclear, implement the most conservative interpretation and leave a `// TODO:` comment with the question.
