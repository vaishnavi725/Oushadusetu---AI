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
| LLM completions (optional) | `GROK_API_KEY` on server (xAI Grok, preferred); `OPENAI_API_KEY` if no Grok key. App works with **no** AI key via deterministic fallbacks |
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

### Server-only (Phase 5 / Edge Functions)

`SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, `PHI_ENCRYPTION_KEY`, webhook secrets, `STATUS_TOKEN_PEPPER`, etc. — documented in `.env.example` for future backend work; not needed for the in-browser demo.

## Local AI routes

`vite.config.ts` registers `viteAiPlugin()` so `npm run dev` and `npm run preview` serve `/api/ai/*` without a separate process.

## Security notes for hosts

- Do not expose service-role keys in `VITE_*` variables.  
- Demo data is synthetic; still treat deployed demos as **non-production**.  
- Refresh resets mock state; do not rely on hosted demo for persistent PHI.
