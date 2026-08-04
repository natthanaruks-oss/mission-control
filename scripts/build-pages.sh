#!/usr/bin/env bash
set -Eeuo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"
rm -rf public
mkdir -p public/icons public/lib
cp index.html app.js styles.css favicon.svg manifest.webmanifest service-worker.js _headers _routes.json public/
cp icons/*.png public/icons/
cp lib/recommendation.js public/lib/
echo "Built $(find public -type f | wc -l | tr -d ' ') public files."
