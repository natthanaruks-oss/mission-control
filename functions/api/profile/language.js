import { json, error, readJson } from '../../_lib/response.js';
import { requireUser } from '../../_lib/auth.js';

export async function onRequestPatch(context) {
  try {
    const user = await requireUser(context);
    if (!user) return error('Sign in required.', 401, 'UNAUTHORIZED');
    const body = await readJson(context.request);
    const language = body.language === 'en' ? 'en' : body.language === 'th' ? 'th' : null;
    if (!language) return error('Language must be th or en.', 400, 'INVALID_LANGUAGE');
    await context.env.DB.prepare('UPDATE users SET language = ?, updated_at = ? WHERE id = ?')
      .bind(language, new Date().toISOString(), user.id).run();
    return json({ ok: true, user: { userId: user.userKey, language } });
  } catch (cause) {
    if (cause?.message === 'JSON_REQUIRED') return error('JSON body required.', 415, 'JSON_REQUIRED');
    console.error('language update failed', cause);
    return error('Language could not be updated.', 500, 'UPDATE_FAILED');
  }
}
