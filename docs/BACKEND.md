# Backend (Phase 4 mock + shared domain)

There is **no required live API** to run the demo. Persistence and workers are simulated in the browser. The **authoritative business rules** for transitions, triage, SLA, and permissions live in `supabase/functions/_shared` and are imported by both the mock engine and (eventually) Edge Functions.

## Architecture today

```
UI → refillService (src/services/refillService.ts)
       → mockRefillService (default)
       → MockEngine (in-memory DB + tick workers)
            → @shared/domain/* (pure functions)
```

`src/services/index.ts` sets `USING_MOCKS` when `VITE_USE_MOCKS !== 'false'`. Auth is always `mockAuthService` in this phase.

Setting `VITE_USE_MOCKS=false` switches **some** `refillService` methods and satellite services (`aiDecisionService`, `auditService`, etc.) to read/write Supabase tables via the anon client. That path is partial and optional; the demo is designed around mocks.

## Mock engine (`src/services/mock/`)

| Module | Role |
|--------|------|
| `backend.ts` | Singleton engine, `startWorkers()` interval (4 s), change notifications |
| `seed.ts` / `buildSeededEngine()` | Loads fixtures into `MockEngine` |
| `engine.ts` | In-memory tables, `transitionCase`, outbox dispatch, SLA escalation, audit events |
| `mock-service.ts` | `RefillService` implementation: auth scoping, latency, `?mockError` / `?mockEmpty` |

**Persistence:** None. Refreshing the page re-runs `buildSeededEngine()`. Comments in `engine.ts` explicitly avoid browser storage for demo data (H7).

### Workers (simulated)

On each `tick()`:

- **Outbox worker** — sends pharmacy notifications, retries with backoff (`RETRY_BACKOFF_MIN`, max attempts), dead-letter behavior  
- **SLA worker** — compares `dueAt` to policies and business hours; escalates levels  

Interval is 4 seconds in the browser (commented as stand-in for ~60 s `pg_cron` in production).

### State machine

`supabase/functions/_shared/domain/state-machine.ts` defines transition rules **T1–T27** (`TransitionRule`: action, allowed `from` statuses, `to`, actors, optional `requiresAal2`). `checkTransition` validates actor, AAL, and state before the engine applies changes. Terminal statuses come from `TERMINAL_STATUSES` in shared types. Provider **DECIDE** routes to statuses via `DECISION_TARGETS` (approve, deny, require visit, etc.).

The mock engine calls the same `checkTransition` / `isTerminal` as a future `transition_case()` SQL function would.

### Triage

`supabase/functions/_shared/domain/triage-rules.ts` is **pure** (no I/O): `runTriage`, `matchPatient`, blocker codes **R1–R10**, suggested `TransitionAction`, priority. Blockers are grouped as clinical, data, or insurance (`CLINICAL_BLOCKERS`, etc. in types). `buildDiagnosis` / `STATUS_LABELS` in `diagnosis.ts` feed the UI “why stuck?” panel.

### SLA

`supabase/functions/_shared/domain/sla.ts` — `computeDueAt`, `slaWindowFor`, `DEFAULT_POLICIES`, `DEFAULT_BUSINESS_HOURS`, `slaState()` for on-track / at-risk / breached display.

### Permissions

`supabase/functions/_shared/domain/permissions.ts` — `can(role, permission)` matrix and `homeRouteFor`. The **server** (mock-service) enforces permissions and org scoping; the UI hides controls only for UX.

### Session and security (mock)

- `sessionStore` tracks current user, AAL (`aal1` vs `aal2` after MFA), org context  
- Mock auth validates against seeded users; MFA code is fixed in fixtures  
- Pharmacy users receive **minimum-necessary** case DTOs (`PharmacyCaseDetail`)  
- Wrong-org case IDs return **404** (not 403) to avoid leaking existence  
- Idempotency keys and optimistic `version` on case updates mirror intended API behavior  

### AI inside mock refill flow

`mock-service` uses `ai-mock.ts` for deterministic extraction/summary/draft when not throwing `AI_UNAVAILABLE` via `?mockError=extractIntake` etc.

### Demo simulator

`RefillService.getSimulator` / `simulate` — practice admin only (`simulator.use` permission): pharmacy up/down, SMS down, quiet hours, time skip, pharmacy ack, reset. Implemented on the engine, not a separate service.

### Switching mock behavior (URL query)

On any page, append:

- `?mockError=<RefillServiceMethodName>` — simulated failure (optional `mockErrorType=timeout`)  
- `?mockEmpty=<RefillServiceMethodName>` — empty list response  

Handled in `mock-service.ts` `gate()` / `isEmpty()`. AI-related method names use `AI_UNAVAILABLE`.

## Shared package layout

`supabase/functions/_shared/`:

- `domain/` — state machine, triage, SLA, permissions, confirmation hashes, diagnosis  
- `dto.ts`, `records.ts`, `types.ts`, `schemas/` — contracts shared with the frontend  

Vitest includes `supabase/functions/_shared/**/*.test.ts`.

## Phase 5 (planned Supabase backend)

Not required for the demo. Intended additions:

- Postgres schema with RLS per org/pharmacy  
- Supabase Auth replacing mock auth  
- Edge Functions implementing `RefillService` over HTTP  
- `transition_case()` in SQL calling the same shared transition rules  
- Real outbox table + scheduled workers  
- `seed.sql` aligned with `src/mocks/data/fixtures.ts`  
- Secrets in `.env.example` (service role, encryption keys, webhooks) — **server only**  

Until that ships, treat **mock engine behavior** as the reference for product logic, with shared domain tests as the contract.
