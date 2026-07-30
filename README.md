# Mission Control MVP

A working browser-based prototype for daily work prioritization, focus management and management visibility.

## Included

- Production-style responsive UI aligned with the approved Mission Control mockup
- Today Command Center and Recommended Now panel
- Daily energy, capacity and uninterrupted-focus check-in
- Explainable task recommendation with a visible Priority Score and Why Now
- Must Win / Deep Focus / Quick Win / Coordination / Waiting board
- Mission intake, edit, delete and completion flow
- Focus timer with pause, resume and completion
- Blocker, reschedule, break-into-steps and manual override actions
- Workload donut, control alerts, search and mission queue table
- Browser `localStorage` persistence
- Inline SVG icon system with no external UI dependency
- Desktop, tablet and mobile navigation behavior

## Run locally

Open `index.html` directly in a modern browser, or serve the folder:

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

The MVP uses the following weighted score:

- Business Impact: 25%
- Deadline / Latest Safe Start proxy: 20%
- Consequence of Delay: 15%
- Commitment: 10%
- Dependency Unlock: 10%
- Readiness: 10%
- Cognitive Fit: 5%
- Time Fit: 5%

Hard rules reduce or remove recommendations for completed, blocked, waiting, not-ready or unclear missions.

## MVP limitation

Data is stored only in the current browser using `localStorage`. Team use, audit trails, permissions, approval workflows, calendar synchronization and multi-device access require a central backend such as Cloudflare Workers + D1.
