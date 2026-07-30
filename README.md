# Mission Control — Phase 2

A bilingual focus, priority and execution management application for daily work planning.

## Phase 2 functions

- Thai / English interface with saved language preference
- Today Command Center and explainable `Recommended Now`
- Daily energy and focus-capacity check-in
- Mission intake, edit, delete, block, complete and manual override
- Focus timer
- Operational calendar with:
  - Day view
  - Week view
  - Month view
  - Year overview
- Create, edit and delete calendar events
- Schedule a Mission into a focus block without changing its original deadline
- Calendar items for meetings, focus blocks, reviews, reminders and Mission deadlines
- Unscheduled Mission list and visible-period workload summary
- JSON data export/import
- Local activity history for Phase 3 migration
- Browser `localStorage` persistence
- Responsive desktop, tablet and mobile layout

## Calendar design decision

The detailed working views are **Day, Week and Month**. The Year view is an executive overview showing workload density by month rather than a detailed daily planner. This avoids overloading the screen while still supporting annual planning.

## Run in Codespace

```bash
cd /workspaces/mission-control
python -m http.server 8080 --bind 0.0.0.0
```

Open Port `8080` from the Codespace **PORTS** tab.

## Deploy to Cloudflare Pages

- Framework preset: **None**
- Build command: leave blank
- Build output directory: `/`
- Root directory: `/`

All frontend file paths are relative and the application remains a static deployment.

## Recommendation model

- Business Impact: 25%
- Deadline / Latest Safe Start proxy: 20%
- Consequence of Delay: 15%
- Commitment: 10%
- Dependency Unlock: 10%
- Readiness: 10%
- Cognitive Fit: 5%
- Time Fit: 5%

Blocked, waiting, completed, not-ready or unclear Missions are excluded or materially reduced before recommendation.

## Data limitation

Phase 2 stores data in the current browser. Different users and devices do not share the same data yet.

The next-phase foundation is included in:

- `PHASE-3.md`
- `cloudflare/schema.sql`
- `cloudflare/worker.js`
- `cloudflare/wrangler.toml.example`

Do not deploy the Worker publicly before authentication, secrets and data-governance controls are approved.
