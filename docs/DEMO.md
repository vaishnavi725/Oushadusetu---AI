# Running the demo

## Prerequisites

- **Node.js 20+**
- From repo root:

```bash
npm install
npm run dev
```

Open [http://localhost:5173/sign-in](http://localhost:5173/sign-in) (or `/` for the landing page).

| Script | Purpose |
|--------|---------|
| `npm run dev` | Vite dev server + `/api/ai/*` middleware |
| `npm run build` / `npm run preview` | Production bundle; preview also serves AI middleware |
| `npm test` | Vitest (see [TESTING.md](TESTING.md)) |

## Credentials

| Setting | Value |
|---------|--------|
| Password (all demo users) | `Refill!2026` |
| MFA code (when challenged) | `123456` |

Users with `mfaEnrolled: true` in fixtures must pass MFA after password sign-in unless the demo pill uses “Switch without MFA (aal1)”.

## Demo users (from `src/mocks/data/fixtures.ts`)

| Key | Name | Email | Role | Organization |
|-----|------|-------|------|----------------|
| admin | Priya Shah | admin@lakeside.example.com | practice_admin (MFA) | Lakeside Family Medicine |
| rao | Dr. Anika Rao | dr.rao@lakeside.example.com | provider (MFA) | Lakeside Family Medicine |
| chen | Marcus Chen, NP | np.chen@lakeside.example.com | provider (MFA) | Lakeside Family Medicine |
| jordan | Jordan Ellis | staff@lakeside.example.com | practice_staff | Lakeside Family Medicine |
| sam | Sam Okafor | ma@lakeside.example.com | practice_staff | Lakeside Family Medicine |
| lena | Lena Novak | admin@citycare.example.com | pharmacy_admin (MFA) | CityCare Pharmacy |
| omar | Omar Haddad | tech@citycare.example.com | pharmacy_staff | CityCare Pharmacy |
| grace | Grace Kim, PharmD | rph@greenleaf.example.com | pharmacy_staff | GreenLeaf Pharmacy |

### Organizations (synthetic)

| ID | Name | Type |
|----|------|------|
| org-lfm | Lakeside Family Medicine | practice |
| org-citycare | CityCare Pharmacy | pharmacy |
| org-greenleaf | GreenLeaf Pharmacy | pharmacy |

## Role home routes (after sign-in / MFA)

| Role | Lands on |
|------|----------|
| provider | `/provider/inbox` |
| pharmacy_admin, pharmacy_staff | `/pharmacy/requests` |
| practice_admin, practice_staff | `/queue` |

## What resets on refresh

- All cases, assignments, simulator toggles, and session **except** what you stored outside the app  
- Mock database is **in-memory only** (no `localStorage` seed)  
- You must sign in again  

## Demo affordances

- **Demo pill** (bottom left when signed in): switch user/role instantly; optional aal1 bypass for MFA demos  
- **Failure simulator** (sidebar, Priya / `practice_admin`): pharmacy down, SMS down, quiet hours, time skip  
- **Sample faxes** on pharmacy new request: normal (`SAMPLE_FAX` — Maria Lopez / Metformin) and injection test (`INJECTION_FAX`)  

## Happy-path click-through (~60 seconds)

1. Sign in as **Omar** (`tech@citycare.example.com`).  
2. Go to **New request** → **Use sample fax** → **Read fax with AI** → confirm amber fields → send to Lakeside.  
3. Switch demo user to **Dr. Rao** → **Provider inbox** → open **Maria Lopez** (urgent / no refills) → **Approve** → confirm order (step-up MFA if at aal1).  
4. Switch to **Omar** → **Requests** → open Maria’s case → pharmacy steps: confirm receipt → start filling → ready → dispensed until case completes.  

Optional: open the same case as **Jordan** from **Queue** to see full practice timeline, blockers, and “Open patient status page (demo)”.

## Patient status

From a practice case, open the demo status link → `/status/:token`. Enter patient DOB (shown on case for demo). Wrong DOB increments lockout; correct DOB shows tracker **without drug names**.

## Deeper QA

Page-by-page scenarios, simulator tests, and `?mockError` / `?mockEmpty` switches are documented in the repository root [TESTING.md](../TESTING.md).
