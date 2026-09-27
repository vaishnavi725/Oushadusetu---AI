# Deployment

## Build

The app is a **Vite SPA**. Production output goes to `dist/`.

```bash
npm run build    # tsc -b && vite build
npm run preview  # serves dist/ locally (includes AI middleware)
```

`package.json` name: `oushadhasetu`. No separate server bundle; Node handlers are used only for Vite middleware and Vercel serverless.

## Vercel (`vercel.json`)

| Setting | Effect |
|---------|--------|
| `rewrites` | `/(.*)` except paths under `api/` → `/index.html` (client-side routing) |
| `headers` | CSP, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, HSTS, `Permissions-Policy` (camera/mic/geo disabled) |

CSP `connect-src` allows `'self'` and `https://*.supabase.co` so the browser can call Supabase when configured.

### What works without secrets

- Static hosting of `dist/` with SPA rewrite  
- Full **mock** refill/auth demo (`VITE_USE_MOCKS` unset or not `false`)  
- **AI chat UI** via `aiApiClient` **browser fallback** if `/api/ai/*` is unavailable  

### What needs configuration

| Feature | Requirement |
|---------|-------------|
| Vercel `/api/ai/*` | Deploy with `api/ai/[...path].ts` (uses Node `IncomingMessage` handler) |
| Supabase reads in AI routes | `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` available to the serverless function environment (and optionally `.env` locally) |
| LLM completions (optional) | `GROQ_API_KEY` on the server (Groq Cloud). `OPENAI_API_KEY` only if you are not using Groq. The app works with **no** AI key via built-in replies |
| Live refill data | `VITE_USE_MOCKS=false` at build time + valid Supabase project — **partial** implementation; not the default demo path |

## Environment variables

From `.env.example` (copy to `.env` for local dev). **Never** commit secrets.

### Browser-safe (`VITE_*`)

| Variable | Purpose |
|----------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL (optional for demo) |
| `VITE_SUPABASE_ANON_KEY` | Anon/publishable key only |
| `VITE_API_BASE_URL` | Reserved for future REST API base |
| `VITE_APP_ENV` | `development` \| `staging` \| `production` |
| `VITE_USE_MOCKS` | If omitted or any value except `"false"`, mocks stay **on** (`src/services/index.ts`) |

### Server-only (optional for demo)

| Variable | Fill this? | Purpose |
|----------|------------|---------|
| `GROQ_API_KEY` | Optional | Groq Cloud key from [console.groq.com](https://console.groq.com). Not xAI Grok. |
| `GROQ_MODEL` | Optional | Default `llama-3.1-8b-instant` |
| `OPENAI_API_KEY` | Skip if using Groq | Only used when `GROQ_API_KEY` is empty |

`SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, `PHI_ENCRYPTION_KEY`, webhook secrets, `STATUS_TOKEN_PEPPER`, etc. — listed in `.env.example` for a future backend. **Leave them empty** for this demo.

## Local AI routes

`vite.config.ts` registers `viteAiPlugin()` so `npm run dev` and `npm run preview` serve `/api/ai/*` without a separate process.

## Security notes for hosts

- Do not expose service-role keys in `VITE_*` variables.  
- Demo data is synthetic; still treat deployed demos as **non-production**.  
- Refresh resets mock state; do not rely on hosted demo for persistent PHI.
