# Mission Control — Phase 3 Lite

Phase 2 plus a simple manual Cloud Backup.

## Included

- Thai / English
- Day / Week / Month / Year Calendar
- Mission recommendation and Focus Timer
- Local JSON backup
- Cloud Backup / Restore through Cloudflare Pages Functions + D1

## Intentionally not included yet

- Multi-user workflow
- Roles and permissions
- Automatic background sync
- External calendar integration

This keeps the system simple and avoids silent data conflicts.

## Local UI test

```bash
python -m http.server 8080 --bind 0.0.0.0
```

Cloud Backup does not run through Python HTTP Server. It works after the Pages Functions and D1 binding are deployed.

## Cloudflare setup

1. Create D1:

```bash
npx wrangler d1 create mission-control-db
```

2. Apply the schema:

```bash
npx wrangler d1 execute mission-control-db --remote --file=./migrations/0001_create_snapshot.sql
```

3. In the existing Cloudflare Pages project, add:

- D1 binding: `DB`
- Encrypted secret: `SYNC_TOKEN`

4. Push the repository to `main` so Pages deploys the `/functions` directory.

5. Open Mission Control → Settings → Cloud Backup. Enter the same `SYNC_TOKEN`, then use:

- **Test**
- **Back Up Now**
- **Restore**

Protect the Pages application with Cloudflare Access before storing business data.

## Checks

```bash
npm test
npm run check
```
