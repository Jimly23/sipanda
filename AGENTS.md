# AGENTS.md

SIPANDA: Laravel 12 JSON API (`backend/`) + React 19/Vite/TypeScript SPA (`frontend/`). Two independent projects; no root package, workspace, CI, or test suite beyond Laravel examples.

## Layout

- `backend/` — Laravel API only. Real routes are in `routes/api.php`; `routes/web.php` is just the welcome page. The Vite/Tailwind/Blade setup under `backend/resources` is boilerplate, not the product UI.
- `frontend/` — all UI. Entry: `src/main.tsx` → `src/App.tsx`. Routes: `/login`, `/dashboard`, `/divisi`, `/parameters`, `/kandidat`, `/spk`, `/spk/:sessionId`.
- Split business logic lives in `backend/app/Services/`; controllers stay thin. Persist results in `hasil_pms` (one row per candidate × division).

## Setup

Backend (from `backend/`):

```powershell
composer install
Copy-Item .env.example .env
php artisan key:generate
New-Item database/database.sqlite   # .env.example defaults to sqlite
php artisan migrate --seed
php artisan serve                    # http://localhost:8000
```

Seeded login: `admin@sipanda.com` / `password`. Auth is Sanctum **bearer token** (not cookies); `frontend/src/api/axios.ts` reads `localStorage token` and redirects to `/login` on 401.

Frontend (from `frontend/`):

```powershell
npm install
npm run dev
```

`frontend/.env` is committed and points at production (`https://sipanda.jimlyassidqi.my.id/api`). To hit a local API, create `frontend/.env.local` with `VITE_API_URL=http://localhost:8000/api` (Vite gives `.env.local` precedence; `*.local` is gitignored).

## Commands

- Frontend: `npm run dev`, `npm run build` (= `tsc -b && vite build`), `npm run lint`. No test script.
- Backend: `php artisan test` (alias `vendor/bin/phpunit`), single test `php artisan test --filter=Name` or `php artisan test tests/Feature/X.php`, format `vendor/bin/pint`.
- `composer dev` also starts Vite, queue listener, and Pail; it assumes `npm install` inside `backend/`. For API work, `php artisan serve` is enough.

## Gotchas

- `phpunit.xml` has `DB_CONNECTION`/`DB_DATABASE` commented out, so tests run against the configured sqlite file, and the example tests do not use `RefreshDatabase`. Uncomment/point to `:memory:` before adding DB tests.
- `frontend/tsconfig.app.json` enables `noUnusedLocals`, `noUnusedParameters`, and `verbatimModuleSyntax`: use `import type` for types and remove unused symbols, or `npm run build` fails even when `npm run lint` passes.
- `GET /api/export/excel/{session}` intentionally returns JSON `{ sheets, session }`; the browser builds the `.xlsx` with `xlsx` + `file-saver` (`src/hooks/useExport.ts`). Only the PDF endpoint streams a file.
- Candidate Excel import is heading-row based with aliases (`nim`/`id_kandidat`, `K1`–`K5`, `pilihan_divisi_1`/`pilihan_1`, …). The download template 404s until `backend/storage/app/templates/template_kandidat.xlsx` exists.
- CORS origins are hardcoded in `backend/config/cors.php` (`localhost:5173`, Netlify prod) plus `FRONTEND_URL`; add new origins there.
- Domain invariants: parameters are K1–K5 competencies + K6/K7 division preferences; all candidate values and target values use a 1–10 scale, GAP is raw `nilai - target`, and only one preference criterion (K6 for choice 1, K7 for choice 2, K6=0 for cross-division) is active per division and always counted as CF; final score is 60% CF + 40% SF; the GAP→weight table (clamped -4..+4) is in `GapMappingService`. The 4 stages (all-to-all scoring → preference ranking → duplicate detection → under-quota cross-division) are in `ProfileMatchingService`; don't "simplify" these without checking with the user.
- Follow `backend/.editorconfig` (4 spaces PHP, LF); frontend uses 2 spaces. No Prettier config, so match surrounding style. Frontend conventions: one hook per resource in `src/hooks/`, shared response types in `src/types/index.ts`, API calls through `src/api/axios.ts`.
