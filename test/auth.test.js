import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createPassword,
  normalizeUserKey,
  validatePasscode,
  validateUserKey,
  verifyPassword,
  randomToken,
  sha256
} from '../functions/_lib/auth.js';

test('user IDs are normalized and validated', () => {
  assert.equal(normalizeUserKey('  Natthanaruk.Ops  '), 'natthanaruk.ops');
  assert.equal(validateUserKey('natthanaruk.ops'), true);
  assert.equal(validateUserKey('x'), false);
  assert.equal(validateUserKey('bad space'), false);
});

test('passcodes are salted and verified', async () => {
  const password = await createPassword('secret-123');
  assert.equal(await verifyPassword('secret-123', password.salt, password.hash), true);
  assert.equal(await verifyPassword('wrong-pass', password.salt, password.hash), false);
  assert.equal(validatePasscode('12345'), false);
});

test('tokens and hashes are URL-safe', async () => {
  const token = randomToken();
  assert.match(token, /^[A-Za-z0-9_-]+$/u);
  assert.match(await sha256(token), /^[A-Za-z0-9_-]+$/u);
});
