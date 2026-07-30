# Phase 3 — Team Data and Governance Foundation

Phase 2 remains a browser-based application. Phase 3 will convert Mission Control into a shared operational system.

## Foundation already included

- Frontend data access is centralized through a storage adapter instead of direct scattered reads.
- Local activity history records create, update, schedule, block, start and completion actions.
- JSON export/import supports backup and controlled migration.
- D1 schema draft is included under `cloudflare/schema.sql`.
- A protected Worker API starter is included under `cloudflare/worker.js`.

## Recommended implementation order

1. **Authentication and identity**
   - Cloudflare Access or approved corporate identity provider.
   - Resolve the authenticated user on the backend; do not trust Owner entered in the browser.

2. **Central database**
   - Missions, calendar events, user preferences and activity logs in D1.
   - Preserve `created_at`, `updated_at`, completion evidence and change traceability.

3. **API integration**
   - Replace the local storage adapter with an authenticated API adapter.
   - Keep local cache only for performance and temporary offline support.

4. **Team workflow**
   - Role separation: Admin, Manager, Member and Viewer.
   - Team Workload, reassignment, shared project views and management alerts.

5. **Calendar integration**
   - Add Google Calendar / Microsoft 365 integration only after OAuth, permission and data-sharing approval.
   - Internal Mission Control events should remain distinguishable from external calendar events.

## Control requirements before production

- Do not expose the Worker publicly without authentication.
- Store secrets as Worker secrets, never in JavaScript or Git.
- Define data retention, backup and restore ownership.
- Add validation and optimistic concurrency to prevent one user overwriting another user's changes.
- Record all material changes in an immutable audit trail.
