#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

DB_NAME="mission-control-db"
PROJECT_NAME="mission-control"
WRANGLER=(npx --yes wrangler@latest)

printf '\n=== Mission Control: Cloudflare setup ===\n'

touch .gitignore
grep -qxF '.env' .gitignore || printf '\n.env\n' >> .gitignore

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

if [[ -z "${CLOUDFLARE_API_TOKEN:-}" ]]; then
  read -rsp "Cloudflare API Token: " CLOUDFLARE_API_TOKEN
  printf '\n'
fi
if [[ -z "${CLOUDFLARE_ACCOUNT_ID:-}" ]]; then
  read -rp "Cloudflare Account ID: " CLOUDFLARE_ACCOUNT_ID
fi

if [[ -z "$CLOUDFLARE_API_TOKEN" || -z "$CLOUDFLARE_ACCOUNT_ID" ]]; then
  echo "ERROR: API Token and Account ID are required."
  exit 1
fi

cat > .env <<ENVEOF
CLOUDFLARE_API_TOKEN=$CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID=$CLOUDFLARE_ACCOUNT_ID
ENVEOF
chmod 600 .env
export CLOUDFLARE_API_TOKEN CLOUDFLARE_ACCOUNT_ID

echo
echo "Cloudflare credentials loaded."

get_db_id() {
  "${WRANGLER[@]}" d1 list --json | node --input-type=module -e '
    import fs from "node:fs";
    const name = process.argv[1];
    const input = fs.readFileSync(0, "utf8").trim();
    if (!input) process.exit(0);
    const parsed = JSON.parse(input);
    const rows = Array.isArray(parsed) ? parsed : (parsed.result || parsed.databases || []);
    const match = rows.find(row => row.name === name);
    if (match) process.stdout.write(match.uuid || match.id || "");
  ' "$DB_NAME"
}

echo
echo "=== D1 database ==="
DB_ID="$(get_db_id)"
if [[ -z "$DB_ID" ]]; then
  "${WRANGLER[@]}" d1 create "$DB_NAME"
  DB_ID="$(get_db_id)"
fi

if [[ -z "$DB_ID" ]]; then
  echo "ERROR: Could not find or create $DB_NAME."
  exit 1
fi

cat > wrangler.toml <<EOF_TOML
name = "$PROJECT_NAME"
pages_build_output_dir = "."
compatibility_date = "2026-07-31"
send_metrics = false

[[d1_databases]]
binding = "DB"
database_name = "$DB_NAME"
database_id = "$DB_ID"
EOF_TOML

echo "Database: $DB_NAME"
echo "Database ID: $DB_ID"

echo
echo "=== Apply remote migrations ==="
"${WRANGLER[@]}" d1 migrations apply "$DB_NAME" --remote

echo
echo "=== Quality checks ==="
npm test
npm run check

echo
echo "Setup complete."
echo "Next: git add -A && git commit -m 'Add mobile account sync' && git push origin main"
