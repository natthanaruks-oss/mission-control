#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

PROJECT_NAME="${MISSION_CONTROL_PROJECT_NAME:-mission-control}"
DB_NAME="${MISSION_CONTROL_DB_NAME:-mission-control-db}"
WRANGLER=(npx --yes wrangler@4.118.0)
STAGE="initialization"

on_error() {
  local exit_code=$?
  echo
  echo "ERROR: Mission Control setup failed during: $STAGE"
  echo "Exit code: $exit_code"
  echo "Authentication method remains API-token-only. No OAuth or wrangler login was used."
  exit "$exit_code"
}
trap on_error ERR

printf '\n=== Mission Control v4.3: API-token-only setup ===\n'
printf 'No OAuth. No wrangler login. No browser approval.\n'

touch .gitignore
grep -qxF '.env' .gitignore || printf '\n.env\n' >> .gitignore
grep -qxF '.wrangler/' .gitignore || printf '.wrangler/\n' >> .gitignore
grep -qxF 'public/' .gitignore || printf 'public/\n' >> .gitignore

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

if [[ -z "${CLOUDFLARE_API_TOKEN:-}" || -z "${CLOUDFLARE_ACCOUNT_ID:-}" ]]; then
  echo "ERROR: Cloudflare API Token and Account ID are required."
  exit 1
fi

umask 077
cat > .env <<ENVEOF
CLOUDFLARE_API_TOKEN=$CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID=$CLOUDFLARE_ACCOUNT_ID
MISSION_CONTROL_PROJECT_NAME=$PROJECT_NAME
MISSION_CONTROL_DB_NAME=$DB_NAME
ENVEOF
chmod 600 .env
export CLOUDFLARE_API_TOKEN CLOUDFLARE_ACCOUNT_ID
export MISSION_CONTROL_PROJECT_NAME="$PROJECT_NAME"
export MISSION_CONTROL_DB_NAME="$DB_NAME"
export FORCE_COLOR=0

STAGE="local quality checks"
echo
echo "=== Quality checks ==="
npm test
npm run check

STAGE="Cloudflare API infrastructure setup"
echo
echo "=== Ensure Cloudflare resources via API token ==="
node scripts/cloudflare-api.mjs ensure | tee /tmp/mission-control-infra.json

STAGE="D1 migrations"
echo
echo "=== Apply remote D1 migrations ==="
"${WRANGLER[@]}" d1 migrations apply "$DB_NAME" --remote

STAGE="static build"
echo
echo "=== Build minimal Pages output ==="
rm -rf public
mkdir -p public/icons public/lib
cp index.html app.js styles.css favicon.svg manifest.webmanifest service-worker.js _headers _routes.json public/
cp icons/*.png public/icons/
cp lib/recommendation.js public/lib/
printf 'Built files: '
find public -type f | wc -l | tr -d ' '

STAGE="Cloudflare Pages deployment"
echo
echo "=== Deploy to existing Pages project ==="
# Pages commands deliberately do not use --config. Wrangler reads wrangler.jsonc from this project root.
"${WRANGLER[@]}" pages deploy public \
  --project-name "$PROJECT_NAME" \
  --branch main \
  --commit-dirty=true

STAGE="production health check"
echo
echo "=== Verify production database binding ==="
APP_URL="$(node scripts/cloudflare-api.mjs project-url)"
if [[ -z "$APP_URL" ]]; then
  echo "ERROR: Production URL could not be resolved from Cloudflare API."
  exit 1
fi

HEALTH_OK=0
for attempt in $(seq 1 20); do
  RESPONSE="$(curl -fsS "$APP_URL/api/health" 2>/dev/null || true)"
  if printf '%s' "$RESPONSE" | node --input-type=module -e '
    let input = "";
    process.stdin.on("data", chunk => input += chunk);
    process.stdin.on("end", () => {
      try {
        const data = JSON.parse(input);
        process.exit(data.ok === true && data.database === "ready" ? 0 : 1);
      } catch { process.exit(1); }
    });
  '; then
    HEALTH_OK=1
    break
  fi
  echo "Waiting for deployment... ($attempt/20)"
  sleep 3
done

if [[ "$HEALTH_OK" -ne 1 ]]; then
  echo "ERROR: Deployment completed but /api/health did not confirm the D1 binding."
  echo "URL checked: $APP_URL/api/health"
  exit 1
fi

trap - ERR
echo
echo "=== Setup complete ==="
echo "Production: $APP_URL"
echo "Database: $DB_NAME"
echo "Authentication: Cloudflare API token only"
echo
echo "Next:"
echo "1. Open the Production URL and create User ID: natthanaruk"
echo "2. Run: npm run import:notion -- natthanaruk"
