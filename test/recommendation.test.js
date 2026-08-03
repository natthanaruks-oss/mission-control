import test from 'node:test';
import assert from 'node:assert/strict';
import { recommendTask, scoreTask } from '../lib/recommendation.js';

const now = new Date('2026-07-31T09:00:00+07:00');

function task(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    title: 'Task',
    dueDate: '2026-07-31',
    priority: 'normal',
    effortMinutes: 30,
    focusType: 'focus',
    status: 'active',
    createdAt: '2026-07-30T00:00:00Z',
    ...overrides
  };
}

test('completed tasks are never recommended', () => {
  const result = recommendTask([task({ status: 'done', priority: 'high' })], 30, now);
  assert.equal(result, null);
});

test('overdue high-priority task outranks a future task', () => {
  const overdue = task({ id: 'overdue', dueDate: '2026-07-30', priority: 'high' });
  const future = task({ id: 'future', dueDate: '2026-08-05', priority: 'normal' });
  assert.equal(recommendTask([future, overdue], 30, now).task.id, 'overdue');
});

test('time fit affects recommendation', () => {
  const short = task({ id: 'short', dueDate: null, effortMinutes: 15, focusType: 'quick' });
  const long = task({ id: 'long', dueDate: null, effortMinutes: 90, priority: 'normal' });
  assert.equal(recommendTask([long, short], 15, now).task.id, 'short');
});

test('score includes understandable reasons', () => {
  const scored = scoreTask(task({ priority: 'high' }), 30, now);
  assert.ok(scored.reasons.includes('dueToday'));
  assert.ok(scored.reasons.includes('highPriority'));
  assert.ok(scored.reasons.includes('fitsTime'));
});
