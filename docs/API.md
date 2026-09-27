# API and service interfaces

## Same-origin AI HTTP API

Implemented in `src/server/aiBackend.ts`, exposed two ways:

1. **Local dev / preview** — `viteAiPlugin` middleware (`src/server/viteAiPlugin.ts`) handles paths starting with `/api/ai/`  
2. **Vercel** — `api/ai/[...path].ts` delegates to the same `handleAiApiRequest`  

The browser client is `src/services/aiApiClient.ts`. It uses `window.location.origin` as `API_BASE` and **falls back to in-browser deterministic responses** if fetch fails or returns non-OK (typical on static hosting without the serverless handler).

### Endpoints

| Method | Path | Behavior |
|--------|------|----------|
| `GET` | `/api/ai/agents` | Returns `{ agents: AgentStatusInfo[] }` from `SERVER_AGENTS` in `aiBackend.ts` |
| `GET` | `/api/ai/decisions` | If Supabase URL + anon key are configured on the server, selects from `ai_decisions` (limit 20); else `{ decisions: [] }` |
| `POST` | `/api/ai/chat` | Body: `{ question?, query?, context? }` where `context` may include `caseId`, `patientName`, `medication`. Returns an `AIMessage`-shaped JSON (text, optional `decision`, `suggestions`, `timestamp`). Keyword routing handles stuck/lapse/critical/who/next prompts; may enrich from Supabase when configured |
| `POST` | `/api/ai/approve` | Body: `decisionId`, `action` (`approved` \| `rejected` \| `overridden`), optional `note`, `caseId`, `agentName`, `recommendation`, `risk`. If Supabase configured, updates `ai_decisions`, inserts `agent_actions`, `audit_logs`, optional `case_timeline`, may touch `proactive_risks` / `refill_cases`. Response: `{ success, decisionId, status, message }` |
| `OPTIONS` | any above | CORS preflight (204) |

`callOpenAiIfConfigured` optionally calls **xAI Grok** (`GROK_API_KEY` or `XAI_API_KEY`, default model `grok-3-mini`, override via `GROK_MODEL` / `XAI_MODEL`) or **OpenAI** (`OPENAI_API_KEY`, `gpt-4o-mini`) when no Grok key is set. Server-side only; with no keys, it returns the fallback string. Chat routing in the demo is primarily **deterministic** unless extended.

### Client fallback (`aiApiClient`)

| Method | Primary | Fallback |
|--------|---------|----------|
| `ask(question, context?)` | `POST /api/ai/chat` | Local keyword branches mirroring server copy |
| `approveDecision(params)` | `POST /api/ai/approve` | Direct calls to `aiDecisionService`, `agentActionService`, `auditService`, `timelineService`, `proactiveRiskService`, and optional Supabase `refill_cases` update |
| `getAgents()` | `GET /api/ai/agents` | Static agent list (same personas as server) |

React Query keys prefixed with `ai` are not invalidated on every mock engine tick (see `BackendBridge`).

## Refill and auth service contracts

Defined in `src/services/refill-service.ts`. The UI should call **`refillService`** and **`authService`** from `@/services`, not the engine directly.

### `AuthService` (mock only today)

- `signIn`, `verifyMfa`, MFA enrollment, `signUp`, `verifyEmail`, password reset, invite accept  
- `getSession`, `signOut`, `switchDemoUser` (demo helper)  
- Results: `SignInResult` (`signed_in` \| `mfa_required` \| `mfa_enroll`)  

### `RefillService` (high level)

| Area | Methods |
|------|---------|
| Cases | `listCases`, `getCase`, `createCase`, `transitionCase`, `claimCase`, `assignCase`, `getCaseEvents`, `getCaseDiagnosis` |
| Patient matching | `searchPatients`, `confirmPatientMatch` |
| Info requests | `createInfoRequest`, `answerInfoRequest` |
| Collaboration | `addCaseNote`, `sendPatientMessage`, `completeTask`, `retryDispatch` |
| Intake / AI assist | `uploadAttachment`, `extractIntake`, `getCaseSummary`, `suggestNextAction`, `draftPatientMessage`, `recordAiOutcome` |
| Patient channel | `verifyPatientStatus`, `getDemoStatusLink` |
| Admin | `getAnalyticsSummary`, `listMembers`, `inviteMember`, `updateMemberRole`, `removeMember`, `getPolicies`, `updatePolicies`, `listLinkedOrgs`, `listPharmacyLinks`, `invitePharmacy`, `updatePharmacyLink`, `listAssignableUsers`, `listAuditLogs` |
| Ops | `getHealth`, `getSimulator`, `simulate` |

`transitionCase` and `createCase` expect **idempotency keys**; mutations respect case `version` for optimistic concurrency.

### Satellite services (Supabase-oriented)

When mocks are off, these may read/write Supabase directly while refill cases still partially map through `refillService`:

- `patientService`, `prescriptionService`, `proactiveRiskService`  
- `aiDecisionService`, `agentActionService`, `timelineService`, `auditService`  

`src/services/api-client.ts` is prepared for a future REST envelope but is unused while mocks are default.

## Errors

`ApiError` + `friendlyMessage` from `@/services` normalize codes such as `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `AI_UNAVAILABLE`, `TIMEOUT` for UI display.
