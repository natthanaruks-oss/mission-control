# Mission Control — Mobile Account Version

A minimal, iPhone-first task application for answering one question:

> What should I do now?

## What changed

- Mobile-first interface for iPhone and desktop browsers
- Quick task creation with only four decisions: title, due date, effort, and type
- One clear **Do now** recommendation based on due date, priority, and available time
- Simple views: **Today / Upcoming / Done**
- Thai and English
- User ID + Passcode account
- Automatic D1 storage by user account
- Same tasks after signing in on another device
- PWA support for **Add to Home Screen** on iPhone
- No sample or mock missions
- Legacy mock data in old `localStorage` keys is cleared once by Version 4

## Data model

Every task is stored with an internal `user_id`. All read, update, and delete queries require the authenticated user ID, so one account cannot access another account's tasks.

Authentication uses:

- PBKDF2-SHA-256 password hashing with a random salt
- HttpOnly, Secure, SameSite=Lax session cookies
- 30-day sessions
- Five failed attempts trigger a 15-minute lock

## Codespace installation

Upload `mission-control-phase4-mobile.zip` into:

```text
/workspaces/mission-control
```

Then run:

```bash
cd /workspaces/mission-control || exit 1
set -e

rm -rf /tmp/mission-control-phase4
mkdir -p /tmp/mission-control-phase4

unzip -q mission-control-phase4-mobile.zip \
  -d /tmp/mission-control-phase4

APP_ROOT="$(find /tmp/mission-control-phase4 \
  -type f -name package.json -printf '%h\n' | head -n 1)"

test -n "$APP_ROOT" || {
  echo "ERROR: package.json not found in ZIP"
  exit 1
}

rsync -av --delete \
  --exclude='.git/' \
  --exclude='.github/' \
  --exclude='.devcontainer/' \
  --exclude='*.zip' \
  "$APP_ROOT/" ./

rm -rf /tmp/mission-control-phase4
rm -f mission-control-phase4-mobile.zip

npm test
npm run check
git status --short
```

## Cloudflare setup from Codespace

No `wrangler login`, OAuth, or Cloudflare Dashboard setup is required.

The script asks once for:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

The API Token needs **Account → D1 → Edit** permission. It may be the same API Token used for other projects. The values are stored only in `.env`, which is excluded from Git.

Run:

```bash
cd /workspaces/mission-control
bash scripts/setup-cloudflare.sh
```

The script will:

1. Reuse or create `mission-control-db`
2. Create `wrangler.toml` with binding `DB`
3. Apply D1 migrations remotely
4. Run tests and syntax checks

Then release:

```bash
git add -A
git commit -m "Add mobile account sync"
git push origin main
```

The existing Cloudflare Pages Git integration will deploy from `main`.

## First use

After the Cloudflare deployment succeeds:

1. Open the production URL
2. Select **Create a new account**
3. Enter a User ID and Passcode
4. Add tasks
5. Sign in with the same account on iPhone or another browser

## iPhone installation

In Safari:

1. Open the production URL
2. Tap **Share**
3. Tap **Add to Home Screen**

## Local development

After `wrangler.toml` exists:

```bash
npx wrangler@latest d1 migrations apply mission-control-db --local
npm run dev
```

Open the URL shown by Wrangler. A plain `python -m http.server` cannot run the `/api` Pages Functions.

## Current limitation

Version 4 intentionally stays small. It does not yet include email recovery, password reset, team assignment, a complex calendar, attachments, or notifications.

## Notion task import (Version 4.1)

This package contains a private, Git-ignored seed prepared from the supplied Notion **Priority Work List** export.

Import scope:

- 13 open items: Not Started, In Progress, and In Review
- 119 completed historical items are intentionally skipped to keep the iPhone list clean
- Thai Buddhist dates are converted to ISO dates
- Priority, effort, and task type are mapped to the mobile data model
- Existing `Next Action` values are retained as an optional **Next step**
- Deterministic task IDs prevent duplicates if the import command is run again

The seed is stored under `private-import/`, which is excluded from Git. Do not remove the `private-import/` rule from `.gitignore`.

### Import into an existing User ID

First deploy Version 4.1 and create the account in the production app. Then run from Codespace:

```bash
cd /workspaces/mission-control
npm run import:notion -- YOUR_USER_ID
```

The command will:

1. Apply any outstanding D1 migration
2. Find the matching account by User ID
3. Insert the 13 active Notion tasks into that account
4. Ignore tasks already imported previously

Refresh the iPhone app after the command completes.
