import { json, error } from '../_lib/response.js';

export async function onRequestGet(context) {
  try {
    const result = await context.env.DB.prepare('SELECT 1 AS value').first();
    return json({ ok: true, database: result?.value === 1 ? 'ready' : 'unknown' });
  } catch (cause) {
    console.error('health failed', cause);
    return error('Database is not connected.', 503, 'DATABASE_NOT_READY');
  }
}
