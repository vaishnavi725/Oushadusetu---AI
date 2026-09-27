# OushadhaSetu

**From refill request to resolution — without losing anyone along the way.**

OushadhaSetu is an autonomous refill-resolution operating system for physician practices and pharmacies. It treats every stuck prescription as a living workflow: one case, one owner, one next step, and a human still in control of clinical decisions.

<p align="left">
  <a href="#about">About</a> ·
  <a href="#demo">Demo</a> ·
  <a href="#run-locally">Run locally</a> ·
  <a href="#environment-variables">Environment</a> ·
  <a href="#deploy-on-vercel">Deploy</a> ·
  <a href="#documentation">Docs</a>
</p>

---

## About

**Oushadha** means medicine. **Setu** means bridge. The product is the operating layer that sits between patient, pharmacy, provider, nurse, practice staff, insurance, and the EHR — the places a refill actually gets stuck.

Most refill tools stop at a status label such as *Pending approval*. That is not useful. Everyone already knows it is pending. OushadhaSetu answers the operational questions:

| Question | What the system shows |
|----------|------------------------|
| What is happening now? | Current state of the refill case |
| What is missing? | The exact gap (visit, signature, coverage, identity) |
| What is blocking progress? | Root cause, not a generic “pending” |
| Who can fix it? | Named owner and role |
| What should happen next? | Next action, urgency, and message |
| Did it happen? | Timeline, audit, and a new state |

AI investigates, drafts, and routes. Licensed humans approve, reject, or override. Nothing clinical is sent without that gate.

This repository is the **interactive demo**: a React application with a full in-browser mock backend (seeded cases, state machine, SLA workers, MFA). You can evaluate the product without a live EHR or a paid model.

Further reading: [docs/OVERVIEW.md](docs/OVERVIEW.md) · [FLOWS.md](FLOWS.md) · [TESTING.md](TESTING.md)

---

## What it does

- Turns each stuck refill into a **Refill Case** with owner, blocker, due time, and next action  
- Moves cases through a strict **state machine** (shared domain in `supabase/functions/_shared`)  
- Uses **deterministic triage rules** for blockers; AI only assists (extract, summarise, draft)  
- Requires **provider MFA** for clinical decisions  
- Keeps patients off the login wall — they get SMS/email and a **secure status page**  
- Aligns pharmacy and practice on the same case, without chasing faxes  

---

## Demo

All demo users share password **`Refill!2026`**. MFA code: **`123456`**.

| Name | Email | Role | Lands on |
|------|-------|------|----------|
| Priya Shah | `admin@lakeside.example.com` | Practice admin (MFA) | `/queue` |
| Dr. Anika Rao | `dr.rao@lakeside.example.com` | Provider (MFA) | `/provider/inbox` |
| Marcus Chen, NP | `np.chen@lakeside.example.com` | Provider | `/provider/inbox` |
| Jordan Ellis | `staff@lakeside.example.com` | Practice staff | `/queue` |
| Sam Okafor | `ma@lakeside.example.com` | Practice staff | `/queue` |
| Lena Novak | `admin@citycare.example.com` | Pharmacy admin (MFA) | `/pharmacy/requests` |
| Omar Haddad | `tech@citycare.example.com` | Pharmacy staff | `/pharmacy/requests` |
| Grace Kim, PharmD | `rph@greenleaf.example.com` | Pharmacy staff | `/pharmacy/requests` |

Refreshing the browser resets demo data. The mock database is in memory only.

---

## Run locally

Requires **Node 20+**.

```bash
npm install
npm run dev      # http://localhost:5173
npm test
npm run build    # production bundle → dist/
```

Optional local Groq (same names as Vercel): copy `.env.example` to `.env` and set `GROQ_API_KEY`. Leave it blank and the demo still runs.

---

## Environment variables

For a **hackathon / demo deploy you can leave almost everything empty.** The app uses the in-browser mock unless you explicitly turn it off.

### Fill these on Vercel (Groq)

| Name | Required? | What to put |
|------|-----------|-------------|
| `GROQ_API_KEY` | No | API key from [console.groq.com](https://console.groq.com/keys) — **Groq**, not xAI Grok |
| `GROQ_MODEL` | No | Leave blank. Default is `llama-3.1-8b-instant` (free-tier friendly) |

Get a key: create a Groq account → **API Keys** → create key → paste into Vercel as `GROQ_API_KEY`. Do not commit it. Do not prefix it with `VITE_`.

### Leave these empty

| Name | Why |
|------|-----|
| `VITE_USE_MOCKS` | Do **not** set this to `false`. The demo needs mocks. |
| `OPENAI_API_KEY` | Skip. You are on Groq. |
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` | Optional later. Not needed for the mock demo. |
| `SUPABASE_SERVICE_ROLE_KEY` and other server secrets in `.env.example` | Future production backend. Empty for this deploy. |

---

## Deploy on Vercel

1. Import [github.com/vaishnavi725/Oushadusetu---AI](https://github.com/vaishnavi725/Oushadusetu---AI) at [vercel.com/new](https://vercel.com/new).  
2. Keep defaults: **Vite**, build `npm run build`, output `dist`.  
3. In **Environment Variables**, add only `GROQ_API_KEY` if you have a Groq key.  
4. Deploy. Client routes are rewritten to `index.html`; `/api/ai/*` is served by the serverless function.

---

## Stack

| Layer | Choice |
|-------|--------|
| UI | React 18, TypeScript, Vite 6, Tailwind CSS v4, Motion |
| Routing / data | React Router v6 data router, TanStack Query, React Hook Form + Zod |
| Demo backend | In-browser mock engine (`src/services/mock`) |
| Domain | Shared state machine, triage, SLA (`supabase/functions/_shared`) |
| Optional LLM | Groq OpenAI-compatible chat API (server only) |

---

## Documentation

| Guide | Contents |
|-------|----------|
| [docs/OVERVIEW.md](docs/OVERVIEW.md) | Product, stakeholders, built vs planned |
| [docs/FRONTEND.md](docs/FRONTEND.md) | Routes and screens |
| [docs/BACKEND.md](docs/BACKEND.md) | Mock engine and domain rules |
| [docs/API.md](docs/API.md) | `/api/ai` and service contracts |
| [docs/DEMO.md](docs/DEMO.md) | Click-through walkthrough |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Hosting and headers |
| [docs/TESTING.md](docs/TESTING.md) | How tests are run |

---

## Status

This is a **Phase 4 demo**: frontend plus in-browser mock. Synthetic organisations and `example.com` emails only. Not for clinical use. A production Supabase deployment is optional and is not required to try the product.
