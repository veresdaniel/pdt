# Product Design Talks — Handover Summary

**Product Design Talks (PDT)** is Ergomania’s public event site: event listing, event detail (programme / speakers), and attendee registration. It is a **frontend-only** app. Content, menus, events, and registrations all come from the shared **Ergomania Web API**. Navigation and footer are aligned with the main Ergomania site (`ergomania.eu` / `ergodot-fe`) so PDT feels like part of the same brand, not a separate product.

Repo: [github.com/veresdaniel/pdt](https://github.com/veresdaniel/pdt)  
Package name: `ergomania-event`  
Active development branch: **`devel`**. `main` exists but is not the live deploy branch.

---

## What the product does

| Surface | Behaviour |
|---|---|
| `/` | Detects `Accept-Language` (`hu` vs `en`) and redirects to the **upcoming event** |
| `/{lang}/` | Redirects to `/{lang}/events/` |
| `/{lang}/events/` | Event listing (upcoming vs past; PDT vs Business Breakfasts switch exists in UI) |
| `/{lang}/events/{slug}/` | Event detail + registration form |
| `/sitemap.xml`, `/robots.txt` | SEO endpoints |

Locales in the URL matcher: **`en`**, **`hu`**. Types also mention `de` / `nl` (aligned with the main site / API), but those are not routed in this app.

All routes use a **trailing slash** (`trailingSlash: 'always'`), same convention as `ergodot-fe`.

---

## Technical stack

| Layer | Choice |
|---|---|
| Framework | **Svelte 5** + **SvelteKit 2** (SSR) |
| Language | TypeScript (strict) |
| Bundler | Vite 8 |
| Styling | **Tailwind CSS 4** + some SCSS in components; PostCSS (`@tailwindcss/postcss`, Autoprefixer) |
| UI library | **`@ergodot/ui-kit`** (published as GitHub Package `@veresdaniel/ui-kit`) |
| Adapter | `@sveltejs/adapter-node` (Node server, gzip/brotli precompress) |
| Package manager | **pnpm 11.7.0** (enforced via `preinstall`: `only-allow pnpm`) |
| Runtime (CI / server) | **Node 24** |
| Process manager | **PM2** |
| Reverse proxy / TLS | **Caddy** |
| Fonts | Poppins from Azure CDN (`ergo-cdn2.azureedge.net`) |

There is no database in this repo. No auth in this frontend. i18n is a **hand-written translation object** in `src/lib/i18n/i18n.ts`, plus CMS strings for footer/nav.

---

## Architecture

```
Browser
  └── SvelteKit (SSR Node, PM2)
        ├── Server loaders (+page.server.ts / +layout.server.ts)
        │     └── Ergomania Web API  (Azure App Service)
        └── Browser-side calls (registration, city autocomplete)
              └── same API (PUBLIC_API_BASE_URL)
```

**Shared backend (not in this repo):**

| Env | API |
|---|---|
| Local | `https://localhost:5002` |
| Staging / current CI | `https://ergomania-test.azurewebsites.net` |
| Production (env file only) | `https://ergomania-webapi.azurewebsites.net` |

Language is sent as `x-language` on API requests.

**Main API surface used by PDT:**

- `GET /events` — list
- `GET /events/{slug}` — detail
- `GET /events/upcoming` — next event (home redirect)
- `GET /events/menu` — mega-menu upcoming/past
- `GET /MenuItems/GetMenuItems` — primary nav (shared with main site)
- `GET /Service/menu` — UX services mega-menu
- `GET /content/public/{page}/{component}/{index}` — CMS footer / contact persons
- `GET /autocomplete/cities?search=` — city field on registration
- `POST /event-registration` — attendee signup

**Sister site coupling:** menu items that are *not* under `/events/` are rewritten to the Ergomania site (`PUBLIC_ERGOMANIA_SITE_URL`: `https://dev.ergomania.eu` on staging, `https://ergomania.eu` on prod). Logo, footer links, and most nav items point there. PDT owns only the events URLs.

---

## Project layout

```
src/routes/          pages, sitemap, robots
src/lib/components/  Registration, Footer, EventSelector, CityAutocomplete, …
src/lib/services/    API clients (events, menus, public CMS content)
src/lib/i18n/        HU/EN copy
src/lib/models/      TypeScript models
deploy/              PM2 ecosystem, Caddy snippet, one-time server setup
.github/workflows/   GitHub Actions deploy (devel → staging only)
```

Key files for a new team:

- `src/routes/+layout.server.ts` — locale, menu, footer CMS load
- `src/routes/+layout.svelte` — `PrimaryNavigation` + Footer from ui-kit
- `src/lib/services/menu.service.ts` — nav composition
- `src/lib/components/Registration.svelte` — client-side POST
- `svelte.config.js` — Node adapter
- `.env.development` / `.env.staging` / `.env.production`

---

## How to run it locally

```sh
pnpm install
pnpm dev          # Vite; NODE_TLS_REJECT_UNAUTHORIZED=0 for local HTTPS API
pnpm check        # svelte-check
pnpm build        # production Vite mode
pnpm buildStaging # staging Vite mode
```

Access to **`@ergodot/ui-kit`** requires GitHub Packages auth for scope `@veresdaniel` (`https://npm.pkg.github.com`). CI uses `GITHUB_TOKEN`; local/CI need a PAT with `packages:read` if the token is not already set up.

Update the shared kit with `pnpm update:ui-kit`.

---

## Environments and deploy

**Staging is the only automated environment today.**

| | Staging |
|---|---|
| Trigger | Push to **`devel`** |
| Workflow | `.github/workflows/deploy.yml` → reusable `deploy-reusable.yml` |
| Build | `pnpm run buildStaging` |
| Host | `167.99.254.211` (from `deploy/setup-server.sh`) |
| Path | `/var/www/dev.productdesigntalks.eu` |
| Process | PM2 app **`pdt-dev`**, `127.0.0.1:3002` |
| Public hosts | `dev.productdesigntalks.eu`, `dev.productdesigntalks.ergomania.eu` |
| Health check | `GET /en/events/` |
| Crawlers | blocked (`VITE_ALLOW_ROBOTS=false`) |

Deploy is **build on GitHub Actions → rsync `build/` + `node_modules/` over SSH → atomic swap → PM2 restart**. `scripts/verify-server-chunks.mjs` checks adapter output before upload.

**GitHub secrets needed:** `SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY`. Setup script also mentions `GH_PAT` (ui-kit historically; current workflow uses `GITHUB_TOKEN`).

**Production is prepared in env files but not wired:** `.env.production` points at the prod API and allows robots. There is **no production GitHub Actions workflow** and no prod PM2/Caddy config in this repo yet.

---

## Known gaps

These are visible in the current code; they are not a full audit.

1. **Events listing is unfinished.** `src/routes/[lang=lang]/events/+page.server.ts` still has debug duplicates (events pushed multiple times). The listing page has **hardcoded Hungarian copy** instead of fully using API data.
2. **Footer contact form** (`ContactFormBlock`) has `onSubmit` as a TODO — it does not call the API.
3. **“Add to calendar”** on the event page is a button without behaviour.
4. **Some UI strings are still hardcoded Hungarian** on the event detail page (e.g. register CTA).
5. **README.md is still the default `sv` Svelte template** — it does not describe this product.
6. **`package-lock.json` is leftover**; pnpm is the real lockfile (`pnpm-lock.yaml`).
7. **CI always injects the test API URL** at build time, even if `buildProd` is used later.
8. Locale types include `de`/`nl`, but the route param matcher only accepts `en`/`hu`.

---

## Coordination notes

PDT is a **thin branded frontend** on top of the Ergomania API and the shared ui-kit. Almost every product change will touch at least one of:

1. **This repo** (PDT UI / routing / registration UX)
2. **Ergomania Web API** (events, registration, CMS, autocomplete)
3. **`@ergodot/ui-kit`** (nav, footer, layout primitives)
4. **`ergodot-fe` / ergomania.eu** (shared menu CMS, footer CMS, visual parity)
