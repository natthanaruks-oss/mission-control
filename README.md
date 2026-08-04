# Mission Control v4.3 — API-Token-Only

Minimal iPhone-first task list with Thai/English, User ID login, D1 sync, and Notion task import.

## Fixed deployment rule

Cloudflare operations use only:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- Cloudflare REST API and Wrangler CLI using those environment variables

The project never runs `wrangler login`, OAuth, browser approval, Cloudflare Access, or manual Dashboard setup.

## One-step Codespace setup

```bash
npm run setup
```

The command is idempotent and will:

1. Run automated tests and JavaScript checks.
2. Find or create `mission-control-db` through the Cloudflare API.
3. Find or create the existing `mission-control` Pages project through the Cloudflare API.
4. Write the root `wrangler.jsonc` with the D1 binding `DB`.
5. Apply remote D1 migrations.
6. Build only the public mobile assets into `public/`.
7. Deploy to Pages without passing a custom Wrangler config path.
8. Verify `/api/health` confirms the D1 binding.

After setup succeeds:

1. Open the Production URL printed by the command.
2. Create User ID `natthanaruk`.
3. Import the supplied active Notion tasks:

```bash
npm run import:notion -- natthanaruk
```

## Git safety

- `.env` is ignored and contains the API token.
- `public/` is generated and ignored.
- `private-import/` is ignored and remains local.
- `wrangler.jsonc` contains resource IDs but no secret and may be committed.
