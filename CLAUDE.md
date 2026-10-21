# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # dev server at http://localhost:3000 (service worker disabled)
npm run build      # production build
npm start          # production server — required to exercise PWA/offline behaviour
npm run typecheck  # tsc --noEmit
```

There is no lint script and no test framework configured; `npm run typecheck` is the only
automated check. Don't invent test commands — if tests are needed, pick a runner and say so.

The service worker only registers in production **and** over HTTPS/`localhost`. To test the
installed app from a phone, tunnel (ngrok / Cloudflare Tunnel) a `npm run build && npm start`.

## Architecture

Next.js 16 App Router + React 19, TypeScript strict, Tailwind 3, Ant Design 6, TanStack Query 5.
`@/*` maps to `src/*`.

**Layering.** `src/app` holds routes only; shared UI lives in `src/components`, cross-cutting
infra in `src/lib`, and domain logic is grouped by feature in `src/features/<name>/`
(`api.ts` / `hooks.ts` / `types.ts`). New domains follow that same triple — pages should import
hooks from a feature, never call `fetch` or `api()` directly.

**Route groups.** Routes are split into two groups whose folder names don't appear in URLs:
`(auth)/` for signed-out screens (`/login`) and `(app)/` for everything behind the login.
`(app)/layout.tsx` is the only auth guard and renders `AppHeader` + `BottomNav` around every
child, so tab screens keep nav state across navigation. Sibling screens are siblings in the
tree — nest only when a screen is genuinely a detail of another (`/outages/[id]`).

**Tabs are data.** `src/lib/routes.ts` is the single source for the bottom tabs: `APP_ROUTES`
(`href`, short `label` for the nav, full `title` for the header), `HOME_ROUTE` (post-login
landing, referenced by `useLogin` and `LoginForm` instead of a hardcoded path), and
`matchRoute()`, which keeps a tab active on its sub-routes. Adding a screen means adding an
entry there, an icon in `BottomNav`'s `ICONS` map, and the folder under `(app)/`.

**Request path.** Every network call goes through `src/lib/api.ts`, which is the single place
that attaches the bearer token, sets JSON headers, parses the response, and throws `ApiError`.
A 401 clears the stored token there. Backend errors are surfaced from the response body's
`message` field, so API error text reaching the UI is already user-facing Turkish.

**Mock mode.** `src/features/auth/api.ts` short-circuits to fake responses when
`NEXT_PUBLIC_API_URL` is unset (`USE_MOCK`): any valid e-mail with a ≥6-char password logs in.
Copy `.env.example` to `.env.local` to hit a real backend. New features that need to work
before the backend exists should repeat this pattern inside their own `api.ts`.

**Auth state.** The token lives in `localStorage` via `src/lib/token-storage.ts` (deliberately
simple — swap for httpOnly cookies if the threat model demands it). There is no middleware and
no server-side guard: `(app)/layout.tsx` is a client component that `router.replace("/login")`s
from a `useEffect` when no token is present, and renders nothing until that check passes, so
protected markup never paints. `/login` does the inverse. A new protected screen inherits the
guard by living under `(app)/` — don't re-add a per-page check.

Because the guard is client-side, screens under `(app)/` can still be server components (they
are: each exports `metadata` with its own title). Only mark a screen `"use client"` when it
actually needs hooks.

**Query client.** `src/lib/query-client.ts` returns a fresh `QueryClient` per request on the
server and a singleton in the browser. Query keys are exported as a `*Keys` object per feature
(`authKeys`) — add keys there rather than inlining arrays.

**Providers.** `src/components/Providers.tsx` is the one client boundary at the root: React
Query, `AntdRegistry` (SSR style extraction), `ConfigProvider` with the theme and `tr_TR`
locale, and Ant Design's `App` wrapper so `message`/`notification`/`modal` work via hooks.
Use those hooks, not the static `message.*` imports.

## Conventions that bite

- **Tailwind preflight is off** (`tailwind.config.ts`) so it doesn't fight Ant Design's reset.
  The minimum reset lives hand-written in `src/app/globals.css` — add to it rather than
  re-enabling preflight.
- **Theme colors are duplicated** in `tailwind.config.ts` and `src/lib/theme.ts`. Changing a
  brand color means editing both.
- **16px minimum font size on inputs** (`theme.ts` `fontSize: 16`, `controlHeight: 44`). Going
  smaller makes iOS zoom the page on focus.
- **Mobile-only layout.** `MobileShell` caps every page at `max-w-app` (480px) and applies
  safe-area padding; pages render as `flex flex-1 flex-col` children and push primary actions
  to the bottom with `mt-auto` for thumb reach.
- **Service worker versioning.** After changing caching in `public/sw.js`, bump `VERSION` or
  clients keep the old caches. It intentionally ignores cross-origin (API) requests.
- **Language.** UI strings, code comments, and commit-worthy prose are Turkish; identifiers are
  English. Match that.
