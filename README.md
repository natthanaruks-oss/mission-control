# Mission Control MVP

A functional browser-based prototype for daily work prioritization and focus management.

## Included

- Today Command Center
- Daily energy/capacity check-in
- Explainable task recommendation
- Business-priority and focus-fit scoring
- Must Win / Deep Focus / Quick Win / Coordination / Waiting board
- Mission intake and editing
- Focus timer
- Blocker, reschedule, override and completion actions
- Workload and control alerts
- Browser `localStorage` persistence
- Responsive desktop layout

## Run locally

Open `index.html` directly in a browser, or serve the folder:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Deploy to Cloudflare Pages

1. Upload this folder to a GitHub repository.
2. In Cloudflare Pages, connect the repository.
3. Framework preset: **None**.
4. Build command: leave blank.
5. Build output directory: `/`.
6. Deploy.

## Recommendation model

The MVP uses a weighted score:

- Business Impact: 25%
- Deadline / Latest Safe Start proxy: 20%
- Consequence of Delay: 15%
- Commitment: 10%
- Dependency Unlock: 10%
- Readiness: 10%
- Cognitive Fit: 5%
- Time Fit: 5%

Hard rules reduce or remove recommendations for completed, blocked, waiting, not-ready, or unclear missions.

## Important MVP limitation

Data is stored only in the current browser using `localStorage`. For team use, audit trails, permissions, approval workflows and multi-device access, connect the UI to a backend such as Cloudflare Workers + D1 in the next phase.
