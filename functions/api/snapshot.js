const USER_KEY = 'default';
const MAX_PAYLOAD_BYTES = 900_000;
const responseHeaders = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store'
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: responseHeaders });
}

function isAuthorized(request, env) {
  const supplied = request.headers.get('x-mission-control-sync-token') || '';
  return Boolean(env.SYNC_TOKEN && supplied && supplied === env.SYNC_TOKEN);
}

function isValidPayload(payload) {
  return Boolean(
    payload &&
    Array.isArray(payload.missions) &&
    Array.isArray(payload.calendarEvents) &&
    payload.checkin && typeof payload.checkin === 'object' &&
    payload.preferences && typeof payload.preferences === 'object'
  );
}

async function getSnapshot(env) {
  return env.DB.prepare(
    'SELECT payload, revision, updated_at FROM snapshots WHERE user_key = ?'
  ).bind(USER_KEY).first();
}

async function handleGet(env) {
  const row = await getSnapshot(env);
  if (!row) return json({ ok: true, exists: false, revision: 0, payload: null, updatedAt: null });

  try {
    return json({
      ok: true,
      exists: true,
      revision: Number(row.revision || 0),
      payload: JSON.parse(row.payload),
      updatedAt: row.updated_at
    });
  } catch {
    return json({ ok: false, error: 'Stored snapshot is invalid.' }, 500);
  }
}

async function handlePut(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid JSON.' }, 400);
  }

  if (!isValidPayload(body?.payload)) {
    return json({ ok: false, error: 'Invalid snapshot schema.' }, 400);
  }

  const payload = JSON.stringify(body.payload);
  if (new TextEncoder().encode(payload).byteLength > MAX_PAYLOAD_BYTES) {
    return json({ ok: false, error: 'Snapshot is too large.' }, 413);
  }

  const current = await getSnapshot(env);
  const revision = Number(current?.revision || 0) + 1;
  const updatedAt = new Date().toISOString();

  await env.DB.prepare(`
    INSERT INTO snapshots (user_key, payload, revision, updated_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(user_key) DO UPDATE SET
      payload = excluded.payload,
      revision = excluded.revision,
      updated_at = excluded.updated_at
  `).bind(USER_KEY, payload, revision, updatedAt).run();

  return json({ ok: true, revision, updatedAt });
}

export async function onRequest(context) {
  const { request, env } = context;

  if (!env.DB) return json({ ok: false, error: 'D1 binding DB is not configured.' }, 503);
  if (!env.SYNC_TOKEN) return json({ ok: false, error: 'SYNC_TOKEN is not configured.' }, 503);
  if (!isAuthorized(request, env)) return json({ ok: false, error: 'Unauthorized.' }, 401);

  if (request.method === 'GET') return handleGet(env);
  if (request.method === 'PUT') return handlePut(request, env);
  return json({ ok: false, error: 'Method not allowed.' }, 405);
}
