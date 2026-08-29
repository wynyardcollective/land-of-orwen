#!/usr/bin/env bash
# One-shot: ensure D1 exists, migrate, build + deploy rough to Cloudflare
# including custom domains rough.co.nz / www.rough.co.nz from wrangler.jsonc.
#
# Auth (pick one):
#   export CLOUDFLARE_API_TOKEN=...
#   npx wrangler login
#
# Requires Workers Paid — OpenNext bundle exceeds free 1 MiB limit.

set -euo pipefail
cd "$(dirname "$0")/.."

CONFIG="wrangler.jsonc"
DB_NAME="rough-players"
PLACEHOLDER_ID="local-rough-players"

echo "==> Checking Cloudflare auth..."
if [[ -z "${CLOUDFLARE_API_TOKEN:-}" && -z "${CLOUDFLARE_API_KEY:-}" ]]; then
  WHOAMI_OUT="$(npx wrangler whoami 2>&1 || true)"
  if echo "$WHOAMI_OUT" | grep -qi 'not authenticated'; then
    echo "$WHOAMI_OUT"
    echo ""
    echo "ERROR: Not authenticated with Cloudflare."
    echo "  In this cloud agent, set:"
    echo "    export CLOUDFLARE_API_TOKEN=<token>"
    echo "  Token needs: Workers Scripts Edit, D1 Edit, Workers Routes Write,"
    echo "  and the zone rough.co.nz on the same account."
    echo "  Or on your laptop: npx wrangler login && npm run deploy:prod"
    exit 1
  fi
  echo "$WHOAMI_OUT"
else
  echo "    Using CLOUDFLARE_API_TOKEN / API_KEY from environment"
  npx wrangler whoami
fi

echo "==> Ensuring D1 database '$DB_NAME' exists..."
CURRENT_ID="$(node -e "
  const fs=require('fs');
  const t=fs.readFileSync('$CONFIG','utf8').replace(/\\/\\/[^\n]*/g,'');
  const j=JSON.parse(t);
  console.log(j.d1_databases[0].database_id);
")"

if [[ "$CURRENT_ID" == "$PLACEHOLDER_ID" ]]; then
  EXISTING="$(npx wrangler d1 list --json 2>/dev/null | node -e "
    let s='';
    process.stdin.on('data', d => s += d);
    process.stdin.on('end', () => {
      try {
        const rows = JSON.parse(s);
        const hit = (Array.isArray(rows) ? rows : []).find(r => r.name === '$DB_NAME');
        console.log(hit ? (hit.uuid || hit.id || '') : '');
      } catch {
        console.log('');
      }
    });
  " || true)"

  if [[ -n "${EXISTING:-}" ]]; then
    DB_ID="$EXISTING"
    echo "    Found existing D1: $DB_ID"
  else
    echo "    Creating D1 '$DB_NAME'..."
    set +e
    CREATE_OUT="$(npx wrangler d1 create "$DB_NAME" 2>&1)"
    CREATE_RC=$?
    set -e
    echo "$CREATE_OUT"
    if [[ $CREATE_RC -ne 0 ]]; then
      echo "ERROR: wrangler d1 create failed."
      exit 1
    fi
    DB_ID="$(echo "$CREATE_OUT" | node -e "
      let s='';
      process.stdin.on('data', d => s += d);
      process.stdin.on('end', () => {
        const m = s.match(/database_id[^\"']*[\"']([0-9a-f-]{36})[\"']/i)
          || s.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/);
        console.log(m ? m[1] : '');
      });
    ")"
    if [[ -z "$DB_ID" ]]; then
      echo "ERROR: Could not parse database_id from wrangler d1 create output."
      exit 1
    fi
  fi

  node -e "
    const fs = require('fs');
    let t = fs.readFileSync('$CONFIG', 'utf8');
    t = t.replace(/\"database_id\":\\s*\"[^\"]+\"/, '\"database_id\": \"$DB_ID\"');
    fs.writeFileSync('$CONFIG', t);
    console.log('    Patched $CONFIG database_id -> $DB_ID');
  "
else
  echo "    Using configured database_id: $CURRENT_ID"
fi

echo "==> Applying remote D1 migrations..."
npm run db:migrate:remote

echo "==> Building OpenNext + deploying Worker..."
npm run deploy

echo ""
echo "Deploy finished."
echo "  Apex:  https://rough.co.nz"
echo "  WWW:   https://www.rough.co.nz"
echo "  Also:  https://rough.<your-subdomain>.workers.dev"
echo ""
echo "If custom domains fail: add rough.co.nz as a Cloudflare zone,"
echo "wait for Active, then re-run. Workers Paid is required for this bundle size."
