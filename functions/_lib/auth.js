const encoder = new TextEncoder();
const SESSION_COOKIE = 'mc_session';
const SESSION_SECONDS = 60 * 60 * 24 * 30;
const PBKDF2_ITERATIONS = 100_000;

export function randomId(prefix = '') {
  return `${prefix}${crypto.randomUUID()}`;
}

function bytesToBase64Url(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/u, '');
}

function base64UrlToBytes(value) {
  const normalized = value.replaceAll('-', '+').replaceAll('_', '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, char => char.charCodeAt(0));
}

export function randomToken(byteLength = 32) {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return bytesToBase64Url(bytes);
}

export function normalizeUserKey(value) {
  return String(value || '').trim().toLowerCase();
}

export function validateUserKey(value) {
  const key = normalizeUserKey(value);
  return /^[a-z0-9][a-z0-9._-]{2,39}$/u.test(key);
}

export function validatePasscode(value) {
  const passcode = String(value || '');
  return passcode.length >= 6 && passcode.length <= 128;
}

export async function derivePasswordHash(passcode, saltBase64Url) {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(passcode),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: base64UrlToBytes(saltBase64Url),
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );
  return bytesToBase64Url(new Uint8Array(bits));
}

export async function createPassword(passcode) {
  const salt = randomToken(16);
  return { salt, hash: await derivePasswordHash(passcode, salt) };
}

function constantTimeEqual(left, right) {
  const a = encoder.encode(left);
  const b = encoder.encode(right);
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) difference |= a[index] ^ b[index];
  return difference === 0;
}

export async function verifyPassword(passcode, salt, expectedHash) {
  const actualHash = await derivePasswordHash(passcode, salt);
  return constantTimeEqual(actualHash, expectedHash);
}

export async function sha256(value) {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value));
  return bytesToBase64Url(new Uint8Array(digest));
}

export function parseCookies(request) {
  const raw = request.headers.get('cookie') || '';
  return Object.fromEntries(
    raw.split(';').map(part => part.trim()).filter(Boolean).map(part => {
      const separator = part.indexOf('=');
      if (separator === -1) return [part, ''];
      return [part.slice(0, separator), decodeURIComponent(part.slice(separator + 1))];
    })
  );
}

export function sessionCookie(token) {
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${SESSION_SECONDS}`;
}

export function clearSessionCookie() {
  return `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
}

export async function createSession(DB, userId) {
  const token = randomToken(32);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_SECONDS * 1000).toISOString();
  await DB.prepare(`
    INSERT INTO sessions (id, user_id, token_hash, expires_at, created_at, last_seen_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(randomId('ses_'), userId, await sha256(token), expiresAt, now.toISOString(), now.toISOString()).run();
  return { token, expiresAt };
}

export async function getSession(request, DB) {
  const token = parseCookies(request)[SESSION_COOKIE];
  if (!token) return null;
  const tokenHash = await sha256(token);
  const now = new Date().toISOString();
  const row = await DB.prepare(`
    SELECT sessions.id AS session_id, sessions.expires_at,
           users.id AS user_id, users.user_key, users.language
    FROM sessions
    JOIN users ON users.id = sessions.user_id
    WHERE sessions.token_hash = ? AND sessions.expires_at > ?
  `).bind(tokenHash, now).first();
  if (!row) return null;
  DB.prepare('UPDATE sessions SET last_seen_at = ? WHERE id = ?')
    .bind(now, row.session_id).run().catch(() => {});
  return row;
}

export async function requireUser(context) {
  const session = await getSession(context.request, context.env.DB);
  if (!session) return null;
  return {
    id: session.user_id,
    userKey: session.user_key,
    language: session.language,
    sessionId: session.session_id
  };
}

export async function deleteCurrentSession(request, DB) {
  const token = parseCookies(request)[SESSION_COOKIE];
  if (!token) return;
  await DB.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(await sha256(token)).run();
}

export async function cleanExpiredSessions(DB) {
  await DB.prepare('DELETE FROM sessions WHERE expires_at <= ?').bind(new Date().toISOString()).run();
}
