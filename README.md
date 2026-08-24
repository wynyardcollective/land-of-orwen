# The Land of Orwen

A relaxing browser idle RPG inspired by **Land of Livia** — original world, story, and art. Travel a countryside map, wait out real-time journeys and quests, loot gear, craft gems, and keep progress in the cloud.

## Features

- Interactive map with 8 locations and ~24 quests
- Strength / Dexterity / Intelligence quests plus Constitution, Wisdom, Charisma
- Equipment, auto-equip, gem crafting, and a lore symbol puzzle
- Journal story beats and a cozy campfire board
- Accessibility: Atkinson Hyperlegible, font scale, high contrast, live regions, keyboard-friendly controls
- Player saves via Cloudflare D1 (with local file fallback for `next dev`)

## Local development

```bash
npm install
npm run dev -- --port 43127
```

Open [http://127.0.0.1:43127](http://127.0.0.1:43127).

Idle pace defaults to **Swift** so waits are short for demos. Switch to Balanced or Classic in Settings.

Progress is written to:

1. `localStorage` immediately
2. `PUT /api/save` (debounced) — uses `.data/saves/` when D1 is unavailable, or Cloudflare D1 in production

## Cloudflare deploy

Requires a Cloudflare account with **Workers Paid** (or otherwise enough Worker size quota). The OpenNext bundle is typically ~1 MiB compressed, which exceeds the free 1 MiB Worker limit.

```bash
npx wrangler login
# or export CLOUDFLARE_API_TOKEN=...

# Create a remote D1 database once
npx wrangler d1 create orwen-players
# Copy the returned database_id into wrangler.jsonc → d1_databases[0].database_id

# Apply migrations
npm run db:migrate:remote

# Build with OpenNext and deploy
npm run deploy
```

Local D1 (via `next.dev` + OpenNext bindings):

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
| `npm run db:migrate:local` | Apply D1 migrations locally |
| `npm run db:migrate:remote` | Apply D1 migrations remotely |
| `npm run cf-typegen` | Generate Cloudflare binding types |

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, OpenNext Cloudflare adapter, Cloudflare D1.

## License note

This is an original homage. Do not copy Land of Livia's proprietary text, artwork, audio, or trademarks.
