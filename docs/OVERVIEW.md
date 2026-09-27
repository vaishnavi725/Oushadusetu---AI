# OushadhaSetu — Project overview

**Documentation:** [Frontend](FRONTEND.md) · [Backend (mock)](BACKEND.md) · [API & services](API.md) · [Demo guide](DEMO.md) · [Deployment](DEPLOYMENT.md) · [Testing](TESTING.md)

OushadhaSetu (*Oushadha* = medicine, *Setu* = bridge) is a **Phase 4 interactive demo** of prescription refill coordination for physician practices and pharmacies. The repository ships a React single-page application plus an **in-browser mock backend** with seeded synthetic data. Shared domain logic lives under `supabase/functions/_shared` and is covered by unit tests; a real Supabase Postgres, RLS, Auth, and Edge Functions stack is **planned (Phase 5), not required** to run or evaluate the demo today.

## The refill problem

When a refill needs provider intervention—no refills left, visit or labs required, missing information, prior authorization, or controlled-substance rules—it often moves between pharmacy, practice staff, provider, and patient over fax, phone, and portals. Work has **no clear owner**, status is opaque, and patients wait without updates. Small delays compound into medication lapses (“silent lapses”).

## Stakeholders (demo framing)

| Stakeholder | What they need in the product |
|-------------|-------------------------------|
| Pharmacy staff | Submit requests, see aligned status, confirm fulfillment without calling the practice |
| Practice staff | One queue with owner, blocker, SLA, and next action per case |
| Providers | Fast, safe clinical decisions with step-up authentication; no silent auto-approval |
| Practice admin | Policies, team, pharmacy links, audit, and failure simulation for demos |
| Patient (no login) | SMS/email updates and a token-based status page without exposing clinical detail |

All personas in the demo use **fictional organizations and example.com addresses** (see [DEMO.md](DEMO.md)).

## Winning idea: refill as a state machine

Each request becomes a **Refill Case** with:

- **One owner** (user or role) and a human-readable **next action**
- **Blockers** raised by deterministic rules (R1–R10) with rule IDs in the timeline
- Movement through a **strict state machine** (`checkTransition` in shared domain code)
- **Human approval** for clinical decisions (provider step-up MFA in the demo)
- Closure only after the **pharmacy confirms** the fulfillment path (demo models outbox, retries, and dead letters)

AI assists with intake extraction, summaries, and drafting; it does **not** replace licensed clinical authority.

## Evaluation framing

Judges and reviewers can assess:

1. **Operational clarity** — queue, case detail (“why stuck?”), provider inbox, pharmacy-scoped views  
2. **Safety** — permissions matrix, MFA for sensitive roles, injection-resistant fax handling, minimum-necessary pharmacy DTOs  
3. **Resilience** — failure simulator (pharmacy down, SMS down, quiet hours, time skip)  
4. **Explainability** — timeline “Why?” links, AI suggestions with accept/edit/reject  
5. **Code quality** — shared domain tested independently of the UI; mock engine mirrors intended server behavior  

## What is built vs not built

| Built today (Phase 4) | Not built / not claimed |
|----------------------|-------------------------|
| Full UI: landing, auth, app shell, queue, cases, pharmacy flows, analytics, settings, command center, proactive risk, agents | Production Supabase deployment as the system of record for the demo path |
| In-memory `MockEngine` + workers (outbox, SLA) using shared state machine, triage, SLA | Live SMS/email, real fax ingestion, or EHR integration |
| Mock auth + session; demo MFA code | Enterprise IdP or real TOTP provisioning |
| `RefillService` / `AuthService` interfaces; mock is default | Complete Edge Function API matching every `RefillService` method |
| Vite dev/preview AI routes via `viteAiPlugin`; Vercel `api/ai/*` handler; client fallback in `aiApiClient` | Required Groq or OpenAI (optional `GROQ_API_KEY` on the server) |
| Vitest: domain + selected UI/service tests | End-to-end browser automation suite |
| `vercel.json` SPA hosting + security headers | HIPAA/SOC 2 certification, named customers, or live production URLs |

Refreshing the browser **resets** mock data by design (no patient data persisted in browser storage).

## Repository map (high level)

- `src/features/` — pages and flows  
- `src/services/` — service layer; `VITE_USE_MOCKS` defaults to on  
- `src/services/mock/` — engine, seed, mock `RefillService`  
- `supabase/functions/_shared/` — DTOs, schemas, domain (state machine, triage, SLA, permissions)  
- `src/server/aiBackend.ts` — same-origin `/api/ai/*` handler used by Vite and Vercel  
- Root [README.md](../README.md) — quick start; root [TESTING.md](../TESTING.md) — detailed click-through QA  
