# The Land of Orwen

A relaxing browser idle RPG inspired by **Land of Livia** — original world, story, and art. Travel a countryside map, wait out real-time journeys and quests, loot gear, craft gems, and keep progress in the cloud.

## Features

- Interactive map with 8 locations, 5 secret areas, and ~24 quests
- **Taverns** — pay gold and wait out a round for a chance to uncover secret locations, early map routes, and journal intel
- Strength / Dexterity / Intelligence quests plus Constitution, Wisdom, Charisma
- Equipment, auto-equip, gem crafting, and a lore symbol puzzle
- Journal story beats and a cozy campfire board
- Accessibility: Atkinson Hyperlegible, font scale, high contrast, live regions, keyboard-friendly controls
- Player saves via Cloudflare D1 (with local file fallback for `next dev`)
- Email + password accounts, plus guest mode (local-only play until you register)
- Idle auto-combat at mid/late locations — paced rounds, stance vs enemy weakness, flee/negotiate via Charisma
- Persistent health between fights; remedies and tavern rests restore HP for gold

## AdSense / public pages

Public marketing and policy pages (no login required):

- `/` — landing
- `/about`, `/privacy`, `/terms`
- `/lore` and `/lore/[slug]` — crawlable journal articles
- `/robots.txt`, `/sitemap.xml`

The game lives at `/play`. You can **Play as guest** or sign in / create an account.



```bash
npm install
npm run dev -- --port 43127
```

Open [http://127.0.0.1:43127](http://127.0.0.1:43127).

Idle pace defaults to **Swift** so waits are short for demos. Switch to Balanced or Classic in Settings.

Progress is written to:

1. `localStorage` immediately (guest and signed-in play)
2. `PUT /api/save` (debounced) when signed in — requires a session cookie; uses `.data/saves/` when D1 is unavailable, or Cloudflare D1 in production

## Accounts

Open `/play` and choose **Play as guest**, **Create account**, or **Sign in**.

- Guest progress stays on this device; create an account anytime (auth screen or Settings) to keep it in the cloud
- Passwords are bcrypt-hashed; sessions last 30 days (httpOnly cookie `orwen_session`)
- Cloud saves are bound to the account — `/api/save` rejects unauthenticated requests
- Sign out / end guest session from **Settings**
- Email verification / password reset are not included yet (no email provider configured)

Local auth data (when D1 is unavailable) lives under `.data/auth/`.

## Production: rough.co.nz

Live: [https://rough.co.nz](https://rough.co.nz) · [https://www.rough.co.nz](https://www.rough.co.nz)

The Worker is configured for custom domains **rough.co.nz** and **www.rough.co.nz** in `wrangler.jsonc`.

### Prerequisites

1. **Cloudflare account** with the zone `rough.co.nz` (add the domain in Cloudflare Dashboard → Domains, point nameservers at your registrar).
2. **Workers Paid** (~$5/mo) — the OpenNext bundle is ~1 MiB compressed and exceeds the free Worker size limit.
3. Auth in this shell:
   - `export CLOUDFLARE_API_TOKEN=...` with permissions: Account → Workers Scripts Edit, D1 Edit, Workers Routes Write (and Zone → DNS Edit if you manage records manually), **or**
   - `npx wrangler login` on a machine with a browser.

### One-shot deploy

```bash
npm run deploy:prod
```

That script will:

1. Create (or reuse) the remote D1 database `orwen-players` and write its `database_id` into `wrangler.jsonc`
2. Apply D1 migrations remotely
3. Build with OpenNext and deploy the Worker, attaching `rough.co.nz` and `www.rough.co.nz`

After a successful deploy:

- https://rough.co.nz
- https://www.rough.co.nz
- `https://land-of-orwen.<account>.workers.dev` (default workers.dev URL)

### Manual steps (same outcome)

```bash
npx wrangler login
# or: export CLOUDFLARE_API_TOKEN=...

npx wrangler d1 create orwen-players
# Paste database_id into wrangler.jsonc → d1_databases[0].database_id

npm run db:migrate:remote
npm run deploy
```

### Domain troubleshooting

| Symptom | Fix |
|--------|-----|
| Custom domain create fails | Zone `rough.co.nz` must be **Active** on the same Cloudflare account as the Worker |
| Deploy fails on size / quota | Upgrade to **Workers Paid** |
| www works, apex does not | Both patterns are in `wrangler.jsonc` `routes`; re-run deploy after the zone is Active |
| Saves empty after deploy | Confirm `database_id` is a real UUID (not `local-orwen-players`) and migrations ran |

## Cloudflare notes (general)

Local D1 (via OpenNext bindings):

```bash
npm run db:migrate:local
npm run dev
```

Player progress is stored in the `player_saves` D1 table (JSON state keyed by `player_id`). The browser also keeps a `localStorage` cache and falls back to it if the API is unreachable.

Useful scripts:

| Script | Purpose |
|--------|---------|
| `npm run dev` | Next.js local server (port 43127) |
| `npm run preview` | OpenNext + Wrangler local Worker preview |
| `npm run deploy` | Build and deploy to Cloudflare Workers |
| `npm run deploy:prod` | Create/patch D1 + migrate + deploy (incl. rough.co.nz) |
| `npm run db:migrate:local` | Apply D1 migrations locally |
| `npm run db:migrate:remote` | Apply D1 migrations remotely |
| `npm run cf-typegen` | Generate Cloudflare binding types |

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, [Watermelon UI](https://ui.watermelon.sh) components (hero, surfaces), OpenNext Cloudflare adapter, Cloudflare D1.

## License note

This is an original homage. Do not copy Land of Livia's proprietary text, artwork, audio, or trademarks.
