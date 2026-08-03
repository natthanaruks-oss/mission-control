import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSeedSql, deterministicTaskId, findRows, sqlLiteral } from '../scripts/notion-import-lib.mjs';

const task = {
  title: "Director's review",
  nextAction: 'Send draft',
  dueDate: '2026-08-03',
  priority: 'high',
  effortMinutes: 30,
  focusType: 'focus',
  createdAt: '2026-08-03T09:00:00+07:00',
  updatedAt: '2026-08-03T10:00:00+07:00'
};

test('Notion task IDs are deterministic per account', () => {
  assert.equal(deterministicTaskId('nat.ops', task), deterministicTaskId('NAT.OPS', task));
  assert.notEqual(deterministicTaskId('nat.ops', task), deterministicTaskId('other', task));
});

test('SQL seed escapes values and includes next action', () => {
  const sql = buildSeedSql('usr_1', 'nat.ops', [task]);
  assert.match(sql, /Director''s review/u);
  assert.match(sql, /Send draft/u);
  assert.match(sql, /INSERT OR IGNORE/u);
});

test('Wrangler result rows can be located', () => {
  assert.deepEqual(findRows([{ results: [{ id: 'usr_1' }] }]), [{ id: 'usr_1' }]);
  assert.equal(sqlLiteral(null), 'NULL');
});
