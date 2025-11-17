<!-- GitHub Copilot / AI agent instructions tailored for this repository -->
# VCE — Copilot Instructions (concise)

Purpose: Enable an AI coding agent to be immediately productive in this Vite + React (TS) repo.

Quick context
- Framework: Vite + React (TypeScript-first, but some legacy `.jsx` exists).
- UI primitives: `src/components/ui/*` (shadcn/radix wrappers). Use these components (e.g., `Button`, `Input`, `Label`) rather than raw markup when adding UI.
- Path alias: `@/*` maps to `./src/*` (see `tsconfig.json`). Import like `import X from "@/path/to"`.
- API base: `src/config/api.ts` exports `API_URL` from `import.meta.env.VITE_API_URL` with a localhost fallback.

Big picture architecture (short)
- Frontend-only SPA. Routes live under React Router in `src/main.tsx`/`src/App.tsx` and pages in `src/pages/*`.
- Components are grouped under `src/components/` including many UI primitives under `src/components/ui/`.
- Network calls use `fetch` and `@tanstack/react-query` for caching. Example: `src/pages/Login.tsx` calls `${API_URL}/captcha` and `${API_URL}/login` and persists `session_id` to `localStorage`.

Key files & patterns (refer to these when making changes)
- `package.json` — scripts: `npm run dev` (vite), `npm run build`, `npm run preview`, `npm run lint`.
- `tsconfig.json` — path alias `@/*` -> `src/*` (use absolute imports in new files).
- `src/config/api.ts` — single source of truth for API URL; prefer importing `API_URL` instead of hardcoding strings.
- `src/components/ui/*` — shared design-system primitives; keep new controls consistent with these.
- `src/pages/Login.tsx` — good example of network flow (captcha lifecycle, abort controller, timeout handling) and localStorage usage (`session_id`).

Conventions and code-style decisions
- Prefer the existing UI primitives and classnames/Tailwind usage to keep consistent styling.
- Mixed file extensions: mostly `.tsx` (TypeScript + JSX) but some `.jsx` components exist (e.g., `AttendanceOverviewCarousel.jsx`). When adding new components, prefer `.tsx`.
- Network calls: components often use `fetch` with JSON bodies and check `res.ok`. When adding client-server calls, follow the pattern used in `Login.tsx` (use AbortController and explicit timeout where appropriate).
- State & data-fetching: use React Query (`@tanstack/react-query`) for server state; use `useQueryClient` when invalidating queries.

Build & developer workflow
- Install: use your usual package manager (`npm install` / `pnpm install` / `yarn`). The repo has `bun.lockb` but scripts are standard Node/Vite.
- Run dev server:
  - `npm run dev`
- Build for production:
  - `npm run build`
- Preview production build:
  - `npm run preview`
- Linting:
  - `npm run lint`

Integration points & environment
- Environment variable to set at build-time: `VITE_API_URL` (used by `src/config/api.ts`).
- Static/public assets are in `public/` and `src/assets/` — prefer `import img from "@/assets/..."` for component usage.

What to watch for (repository-specific gotchas)
- Absolute imports must use the `@` alias; failing to use it may break TypeScript resolution.
- Some older components are plain `.jsx`; new code should be `.tsx` unless there's a compatibility reason.
- There is no test runner configured; avoid introducing test-related scripts unless adding configuration files.

How to make changes safely
- Keep edits minimal and local to the intended feature files. Follow the existing naming and directory patterns.
- When touching UI, reuse components from `src/components/ui/` and mirror their prop patterns.
- When adding API calls, import `API_URL` from `src/config/api.ts` and follow the `fetch` + `res.json()` + `res.ok` patterns.

Examples (copy-paste ready)
- Import API_URL:
  `import { API_URL } from "@/config/api";`
- Example endpoint call (from `Login.tsx`):
  `fetch(`${API_URL}/login`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ userid, password, session_id }) })`

If you need clarification
- Ask: mention the target symbol (function, component) and the exact file path you want changed (e.g., `src/pages/Login.tsx`). Keep target symbol and file isolated — only modify that file unless the change requires cross-file updates.

Done: create PR-style patch limited to single files when possible; prefer incremental commits.

— End of file
