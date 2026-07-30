import test from 'node:test';
import assert from 'node:assert/strict';
import { onRequest as snapshotHandler } from '../functions/api/snapshot.js';
import { onRequest as healthHandler } from '../functions/api/health.js';

class MockDB {
  constructor() {
    this.row = null;
  }

  prepare(sql) {
    const db = this;
    return {
      bind(...args) {
        return {
          async first() {
            if (/SELECT/i.test(sql)) return db.row;
            return null;
          },
          async run() {
            if (/INSERT INTO snapshots/i.test(sql)) {
              const [, payload, revision, updatedAt] = args;
              db.row = { payload, revision, updated_at: updatedAt };
            }
            return { success: true };
          }
        };
      }
    };
  }
}

const validPayload = {
  schemaVersion: 3,
  missions: [],
  calendarEvents: [],
  checkin: { energy: 'High' },
  preferences: { language: 'th' },
  activityLog: []
};

function context(method, env, body) {
  return {
    request: new Request('https://example.com/api/snapshot', {
      method,
      headers: {
        'content-type': 'application/json',
        'x-mission-control-sync-token': 'test-token'
      },
      body: body ? JSON.stringify(body) : undefined
    }),
    env
  };
}

test('health endpoint responds', async () => {
  const response = healthHandler();
  assert.equal(response.status, 200);
  assert.equal((await response.json()).ok, true);
});

test('snapshot requires token', async () => {
  const response = await snapshotHandler({
    request: new Request('https://example.com/api/snapshot'),
    env: { DB: new MockDB(), SYNC_TOKEN: 'test-token' }
  });
  assert.equal(response.status, 401);
});

test('empty cloud returns exists false', async () => {
  const response = await snapshotHandler(context('GET', { DB: new MockDB(), SYNC_TOKEN: 'test-token' }));
  const data = await response.json();
  assert.equal(response.status, 200);
  assert.equal(data.exists, false);
});

test('PUT then GET round-trips snapshot', async () => {
  const DB = new MockDB();
  const env = { DB, SYNC_TOKEN: 'test-token' };

  const putResponse = await snapshotHandler(context('PUT', env, { payload: validPayload }));
  const putData = await putResponse.json();
  assert.equal(putResponse.status, 200);
  assert.equal(putData.revision, 1);

  const getResponse = await snapshotHandler(context('GET', env));
  const getData = await getResponse.json();
  assert.equal(getData.exists, true);
  assert.deepEqual(getData.payload, validPayload);
});

test('invalid payload is rejected', async () => {
  const response = await snapshotHandler(context('PUT', { DB: new MockDB(), SYNC_TOKEN: 'test-token' }, { payload: { missions: [] } }));
  assert.equal(response.status, 400);
});
