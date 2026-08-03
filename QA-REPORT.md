# Mission Control 4.1 — QA Report

## Scope

- iPhone-first account-based task app retained
- Optional Next step added without changing the quick-create flow
- One-time Codespace import prepared from the supplied Notion Priority Work List
- 13 active items included; 119 completed historical items skipped
- Thai Buddhist dates converted to ISO dates
- Repeat imports are idempotent through deterministic task IDs

## Automated checks

- `npm test`: 10/10 passed
- `npm run check`: passed

## Data controls

- Notion seed is stored under `private-import/`
- `private-import/` is excluded by `.gitignore`
- Seed data is not served by the application after normal Git deployment
- Import requires an existing authenticated account in the D1 `users` table
- Every imported task is assigned to that account's internal `user_id`

## Intentional exclusions

- 119 completed Notion tasks are not imported to avoid cluttering the mobile Done view
- Notion page bodies and Notes are not imported
- No sample or mock tasks are created automatically
