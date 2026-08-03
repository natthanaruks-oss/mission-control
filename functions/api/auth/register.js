import { json, error, readJson } from '../../_lib/response.js';
import {
  cleanExpiredSessions,
  createPassword,
  createSession,
  normalizeUserKey,
  randomId,
  sessionCookie,
  validatePasscode,
  validateUserKey
} from '../../_lib/auth.js';

export async function onRequestPost(context) {
  try {
    const body = await readJson(context.request);
    const userKey = normalizeUserKey(body.userId);
    const passcode = String(body.passcode || '');
    const language = body.language === 'en' ? 'en' : 'th';

    if (!validateUserKey(userKey)) {
      return error('User ID must be 3–40 characters using letters, numbers, dot, dash or underscore.', 400, 'INVALID_USER_ID');
    }
    if (!validatePasscode(passcode)) {
      return error('Passcode must contain at least 6 characters.', 400, 'INVALID_PASSCODE');
    }

    const existing = await context.env.DB.prepare('SELECT id FROM users WHERE user_key = ?').bind(userKey).first();
    if (existing) return error('This User ID is already in use.', 409, 'USER_EXISTS');

    const now = new Date().toISOString();
    const userId = randomId('usr_');
    const password = await createPassword(passcode);

    await context.env.DB.prepare(`
      INSERT INTO users (
        id, user_key, password_hash, password_salt, language,
        failed_attempts, locked_until, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, 0, NULL, ?, ?)
    `).bind(userId, userKey, password.hash, password.salt, language, now, now).run();

    const session = await createSession(context.env.DB, userId);
    await cleanExpiredSessions(context.env.DB).catch(() => {});

    return json(
      { ok: true, user: { userId: userKey, language } },
      201,
      { 'set-cookie': sessionCookie(session.token) }
    );
  } catch (cause) {
    if (cause?.message === 'JSON_REQUIRED') return error('JSON body required.', 415, 'JSON_REQUIRED');
    console.error('register failed', cause);
    return error('Account could not be created. Check the database setup.', 500, 'REGISTER_FAILED');
  }
}
