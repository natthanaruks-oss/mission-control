import { json, error } from '../../_lib/response.js';
import { requireUser } from '../../_lib/auth.js';

export async function onRequestGet(context) {
  try {
    const user = await requireUser(context);
    if (!user) return error('Sign in required.', 401, 'UNAUTHORIZED');
    return json({ ok: true, user: { userId: user.userKey, language: user.language } });
  } catch (cause) {
    console.error('me failed', cause);
    return error('Account service is not ready.', 500, 'ACCOUNT_FAILED');
  }
}
