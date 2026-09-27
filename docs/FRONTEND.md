# Frontend architecture

The UI is a **React 18** single-page application built with **Vite 6**, **TypeScript**, **Tailwind CSS v4** (`@tailwindcss/vite`), **React Router v6** (data router), **TanStack Query**, **React Hook Form + Zod**, **Motion** (`motion/react`), **Lucide** icons, and **Recharts** on analytics pages.

Path alias `@shared` points at `supabase/functions/_shared` so the UI imports the same permissions and types as the intended backend.

## Design notes

- **Clinical, light surfaces** — white/glass sidebars, soft gray backgrounds (`src/index.css` ice/surface tokens).  
- **Brand** — primary **indigo** and secondary **violet** in theme tokens; **teal** accents on auth and landing marketing components.  
- **Typography** — Inter (UI), Manrope (display), JetBrains Mono (labels/case IDs).  
- **Motion** — page transitions and drawer animations via Motion; respect reduced-motion where configured.  
- **Accessibility** — skip link, semantic routes, form validation messages; patient status page limits PHI on screen.

Global styles and tokens: `src/index.css`. Shared UI: `src/components/ui/`. Feature pages: `src/features/<name>/`.

## Application shell

Authenticated routes render inside `AppShell` (`src/app/AppShell.tsx`):

- Role-filtered sidebar navigation  
- Health poll via `refillService.getHealth()`  
- **Oushadha AI** helper (chat) — `OushadhaAIHelper`  
- **Demo role switcher** (bottom) — instant persona change  
- **Failure simulator** drawer — `practice_admin` only (`SimulatorDrawer`)  
- Offline banner when `navigator.onLine` is false  

`BackendBridge` invalidates React Query caches when the mock engine ticks or emits events (excluding `health` and `ai` keys).

## Routing

Defined in `src/app/router.tsx`. Lazy-loaded feature pages sit behind `Suspense` with a spinner fallback.

### Public / auth

| Path | Page | Notes |
|------|------|--------|
| `/`, `/landing` | Landing | Marketing story, ROI, walkthrough |
| `/login`, `/sign-in` | Sign in | Demo account shortcuts |
| `/sign-up` | Sign up | Demo verify link |
| `/verify-email` | Verify email | |
| `/accept-invite` | Accept invite | |
| `/forgot-password`, `/reset-password` | Password recovery | Demo tokens in UI |
| `/mfa` | MFA challenge | After sign-in when MFA enrolled |
| `/status/:token` | Patient status | No login; DOB gate |

### Authenticated (`RequireAuth` + `AppShell`)

| Path | Feature | Role guard |
|------|---------|------------|
| `/dashboard` | Dashboard | All signed-in roles (nav) |
| `/queue` | Refill queue | Practice roles |
| `/command-center` | Command center | All signed-in (nav) |
| `/proactive-risk` | Proactive risk | Practice + pharmacy admin (nav) |
| `/agents` | AI agent activity | Admin/provider/pharmacy admin (nav) |
| `/cases/new` | Phone intake | `practice_admin`, `practice_staff`, `provider` |
| `/cases/:caseId` | Case detail | Scoped by org in service layer |
| `/provider/inbox`, `/provider/inbox/:caseId` | Provider inbox | `provider` |
| `/pharmacy/requests` | Pharmacy list | Pharmacy roles |
| `/pharmacy/requests/new` | New fax/request | Pharmacy roles |
| `/analytics` | Analytics | `practice_admin`, `provider`, `pharmacy_admin` |
| `/settings/profile` | Profile | All |
| `/settings/team` | Team | `practice_admin`, `pharmacy_admin` |
| `/settings/pharmacies` | Pharmacy links | `practice_admin`, `pharmacy_admin` |
| `/settings/policies` | Policies | `practice_admin` |
| `/settings/audit` | Audit log | `practice_admin`, `pharmacy_admin` |

### Other

| Path | Page |
|------|------|
| `/error` | Crash screen (demo) |
| `*` | Not found |

`RequireRole` redirects unauthorized roles with a friendly message and link to `homeRouteFor(role)`.

## Feature areas (by folder)

| Folder | Purpose |
|--------|---------|
| `landing/` | Product narrative, refill console demo, pilot form |
| `auth/` | Sign-in, MFA, invite, password flows |
| `dashboard/` | Role-aware KPIs; notes when Supabase live mode is off |
| `queue/` | Filterable practice queue, claim, URL-synced filters |
| `command-center/` | Operational overview |
| `cases/` | Case detail, digital twin, diagnosis, actions, timeline |
| `provider-inbox/` | Provider decision panel, step-up MFA |
| `pharmacy/` | Pharmacy request list |
| `intake/` | New pharmacy request (`NewRequestPage`), phone intake |
| `patient-status/` | Public tracker |
| `analytics/` | Charts and north-star metrics |
| `proactive/` | Silent-lapse style risk list |
| `agents/` | Agent status/decisions UI |
| `settings/` | Profile, team, pharmacies, policies, audit |

## Data loading

- Services imported from `@/services` (`src/services/index.ts`).  
- `USING_MOCKS` is true unless `VITE_USE_MOCKS === 'false'`.  
- Auth is always `mockAuthService` in Phase 4; refill operations go through `refillService` (mock with optional Supabase overrides for some methods when mocks are off).  
- Query client handles 401 via `setUnauthenticatedHandler` from auth context.

## Post-sign-in home routes

From `homeRouteFor` in `@shared/domain/permissions.ts`:

| Role | Default route |
|------|----------------|
| `provider` | `/provider/inbox` |
| `pharmacy_admin`, `pharmacy_staff` | `/pharmacy/requests` |
| `practice_admin`, `practice_staff` | `/queue` |

Dashboard and command center are available from navigation but are not the default landing path.
