import { json, error, readJson } from '../../_lib/response.js';
import {
  cleanExpiredSessions,
  createSession,
  normalizeUserKey,
  sessionCookie,
  validatePasscode,
  validateUserKey,
  verifyPassword
} from '../../_lib/auth.js';

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

export async function onRequestPost(context) {
  try {
    const body = await readJson(context.request);
    const userKey = normalizeUserKey(body.userId);
    const passcode = String(body.passcode || '');

    if (!validateUserKey(userKey) || !validatePasscode(passcode)) {
      return error('Invalid User ID or passcode.', 401, 'INVALID_CREDENTIALS');
    }

    const user = await context.env.DB.prepare(`
      SELECT id, user_key, password_hash, password_salt, language,
             failed_attempts, locked_until
      FROM users WHERE user_key = ?
    `).bind(userKey).first();

    if (!user) return error('Invalid User ID or passcode.', 401, 'INVALID_CREDENTIALS');

    const now = new Date();
    if (user.locked_until && new Date(user.locked_until) > now) {
      return error('Too many attempts. Try again later.', 429, 'ACCOUNT_LOCKED');
    }

    const valid = await verifyPassword(passcode, user.password_salt, user.password_hash);
    if (!valid) {
      const attempts = Number(user.failed_attempts || 0) + 1;
      const lockedUntil = attempts >= MAX_FAILED_ATTEMPTS
        ? new Date(now.getTime() + LOCK_MINUTES * 60_000).toISOString()
        : null;
      await context.env.DB.prepare(`
        UPDATE users SET failed_attempts = ?, locked_until = ?, updated_at = ? WHERE id = ?
      `).bind(attempts, lockedUntil, now.toISOString(), user.id).run();
      return error(
        lockedUntil ? 'Too many attempts. Try again in 15 minutes.' : 'Invalid User ID or passcode.',
        lockedUntil ? 429 : 401,
        lockedUntil ? 'ACCOUNT_LOCKED' : 'INVALID_CREDENTIALS'
      );
    }

    await context.env.DB.prepare(`
      UPDATE users SET failed_attempts = 0, locked_until = NULL, updated_at = ? WHERE id = ?
    `).bind(now.toISOString(), user.id).run();

    const session = await createSession(context.env.DB, user.id);
    await cleanExpiredSessions(context.env.DB).catch(() => {});

    return json(
      { ok: true, user: { userId: user.user_key, language: user.language } },
      200,
      { 'set-cookie': sessionCookie(session.token) }
    );
  } catch (cause) {
    if (cause?.message === 'JSON_REQUIRED') return error('JSON body required.', 415, 'JSON_REQUIRED');
    console.error('login failed', cause);
    return error('Sign in failed. Check the database setup.', 500, 'LOGIN_FAILED');
  }
}
