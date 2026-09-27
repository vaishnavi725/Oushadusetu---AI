# OushadhaSetu

Autonomous prescription refill resolution for physician practices and pharmacies—one shared case, one owner, one next step.

## The problem

When a refill needs provider intervention (no refills left, visit required, labs overdue, missing information, or insurance blocks), it bounces between pharmacy, practice staff, and patient over phone, fax, and portals. No one owns the work end to end, status is opaque, and patients are left waiting without updates.

## What it does

OushadhaSetu (*Oushadha* = medicine, *Setu* = bridge) turns each stuck refill into a **Refill Case** with a single owner, a defined next action, and a due time. Cases move through a strict state machine. Deterministic rules surface blockers; AI assists with extraction and drafting; **providers retain clinical authority** (including step-up MFA for decisions). Patients do not log in—they receive SMS/email and a secure status page. Pharmacies and practices see aligned status without chasing each other.

## Demo accounts

All demo users share password **`Refill!2026`**. MFA challenge code: **`123456`**.

| Key | Name | Email | Role | Organization |
|-----|------|-------|------|----------------|
| admin | Priya Shah | admin@lakeside.example.com | practice_admin (MFA) | Lakeside Family Medicine |
| rao | Dr. Anika Rao | dr.rao@lakeside.example.com | provider (MFA) | Lakeside Family Medicine |
| chen | Marcus Chen, NP | np.chen@lakeside.example.com | provider (covering) | Lakeside Family Medicine |
| jordan | Jordan Ellis | staff@lakeside.example.com | practice_staff | Lakeside Family Medicine |
| sam | Sam Okafor | ma@lakeside.example.com | practice_staff | Lakeside Family Medicine |
| lena | Lena Novak | admin@citycare.example.com | pharmacy_admin (MFA) | CityCare Pharmacy |
| omar | Omar Haddad | tech@citycare.example.com | pharmacy_staff | CityCare Pharmacy |
| grace | Grace Kim, PharmD | rph@greenleaf.example.com | pharmacy_staff | GreenLeaf Pharmacy |

**Home routes after sign-in:** providers → `/provider/inbox`; practice staff and practice admins → `/queue`; pharmacy roles → `/pharmacy/requests`.

Step-by-step click paths: [FLOWS.md](FLOWS.md). Test and QA notes: [TESTING.md](TESTING.md).

## Run locally

Requires **Node 20+**.

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # Vitest unit/component tests
npm run lint
npm run typecheck
npm run build    # production build → dist/
npm run preview  # serve dist/ locally
```

Refreshing the browser resets demo data—the in-browser mock database is in-memory only (no persistent patient data in browser storage).

## Repository structure (brief)

- `src/features/` — application pages and flows
- `src/services/` — service layer; mock implementation used by default
- `src/services/mock/` — in-browser mock engine, seed data, and workers
- `supabase/functions/_shared/` — shared domain logic (state machine, triage, SLA, schemas) used by the mock and intended for a future API
- `vercel.json` — SPA hosting configuration

## Stack

- **Frontend:** React 18, TypeScript, Vite 6, Tailwind CSS v4, React Router v6 (data router), TanStack Query, React Hook Form + Zod, Motion, Lucide icons
- **Tests:** Vitest, React Testing Library, jsdom
- **Planned backend (not required for the demo):** Supabase (Postgres, Auth, Edge Functions)—see `.env.example` for future env vars

## Deploy

This project is a **Vite single-page application**. `vercel.json` rewrites non-API routes to `index.html` and sets security headers (CSP, HSTS, and related policies).

By default the app uses an **in-browser mock backend**. Mocks stay enabled unless `VITE_USE_MOCKS` is explicitly set to `"false"` (see `src/services/index.ts`). You can run and evaluate the full demo **without** configuring Supabase or any live API.

## Status

The interactive demo runs entirely on the mock engine with seeded synthetic data (example.com emails, fictional organizations). A production Supabase deployment is optional for trying the product locally or on a static host.
