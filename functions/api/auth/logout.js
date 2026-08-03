import { json } from '../../_lib/response.js';
import { clearSessionCookie, deleteCurrentSession } from '../../_lib/auth.js';

export async function onRequestPost(context) {
  try {
    await deleteCurrentSession(context.request, context.env.DB);
  } catch (cause) {
    console.error('logout cleanup failed', cause);
  }
  return json({ ok: true }, 200, { 'set-cookie': clearSessionCookie() });
}
