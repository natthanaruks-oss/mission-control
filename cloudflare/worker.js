/**
 * Mission Control Phase 3 API foundation.
 * This file is intentionally not connected to the Phase 2 frontend yet.
 * Protect the Worker with Cloudflare Access and configure SYNC_TOKEN before use.
 */

const JSON_HEADERS = { 'content-type': 'application/json; charset=utf-8' };

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...JSON_HEADERS, ...extraHeaders }
  });
}

function isAuthorized(request, env) {
  if (!env.SYNC_TOKEN) return false;
  return request.headers.get('x-mission-control-sync-token') === env.SYNC_TOKEN;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/health') {
      return json({ ok: true, service: 'mission-control-api', phase: 3 });
    }

    if (!isAuthorized(request, env)) {
      return json({ ok: false, error: 'Unauthorized' }, 401);
    }

    if (url.pathname === '/api/snapshot' && request.method === 'GET') {
      const [missions, events, preferences] = await Promise.all([
        env.DB.prepare('SELECT * FROM missions ORDER BY updated_at DESC').all(),
        env.DB.prepare('SELECT * FROM calendar_events ORDER BY start_at ASC').all(),
        env.DB.prepare('SELECT * FROM user_preferences WHERE user_key = ?').bind('default').first()
      ]);
      return json({
        ok: true,
        missions: missions.results,
        calendarEvents: events.results,
        preferences: preferences || null
      });
    }

    return json({ ok: false, error: 'Not found' }, 404);
  }
};
