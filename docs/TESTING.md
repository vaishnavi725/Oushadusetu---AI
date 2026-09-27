# Testing

## Run tests

```bash
npm test           # vitest run (CI-style)
npm run test:watch # watch mode
npm run typecheck  # tsc -b --noEmit
npm run lint       # eslint
```

Configuration lives in `vite.config.ts` (`test` block): **jsdom** environment, `src/test/setup.ts`, includes:

- `src/**/*.test.{ts,tsx}`
- `supabase/functions/_shared/**/*.test.ts`

## What automated tests cover

| Area | Files | Focus |
|------|-------|--------|
| Shared domain | `state-machine.test.ts`, `triage-rules.test.ts`, `sla.test.ts` | Transitions, triage blockers, SLA math, `homeRouteFor` / permissions |
| Mock backend | `seed.test.ts`, `mock-service.test.ts` | Seeded cases, service methods, auth scoping |
| Supabase helpers | `supabase.test.ts`, `supabase-integration.test.ts` | Client wiring (skipped or conditional when not configured) |
| AI client | `oushadha-ai.test.ts` | AI API client behavior |
| UI features | `SignInPage`, `QueuePage`, `CaseDetailPage`, `ProviderInboxPage`, `NewRequestPage`, `PatientStatusPage`, `AnalyticsPage`, `SettingsPages`, `TeamPage` | Rendering, filters, mock error/empty URL params |

Domain tests are the **contract** for Phase 5: they run without a browser database.

## Manual / exploratory QA

The repository root **[TESTING.md](../TESTING.md)** is the full click-through playbook: every page, failure simulator, MFA step-up, pharmacy isolation, patient status lockout, and `?mockError` / `?mockEmpty` conventions on `RefillService` method names.

Use that document for judge demos and regression walks; this file only summarizes automation.

## Mock fault injection (quick reference)

Append to any route while signed in:

- `?mockError=listCases` — simulated server error for that service method  
- `?mockEmpty=listCases` — empty data for that method  
- `?mockErrorType=timeout` — with `mockError`, returns timeout for non-AI methods  

AI-related methods (`extractIntake`, `getCaseSummary`, etc.) return `AI_UNAVAILABLE` when faulted.

## Status

Run `npm test` in your checkout for current pass count. Root TESTING.md may mention historical counts; trust the test run output on your machine.
