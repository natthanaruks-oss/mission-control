import { createHash } from 'node:crypto';

export function normalizeUserKey(value) {
  return String(value || '').trim().toLowerCase();
}

export function sqlLiteral(value) {
  if (value === null || value === undefined || value === '') return 'NULL';
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : 'NULL';
  return `'${String(value).replaceAll("'", "''")}'`;
}

export function deterministicTaskId(userKey, task) {
  const source = [normalizeUserKey(userKey), task.title, task.createdAt || '', task.dueDate || ''].join('|');
  return `tsk_notion_${createHash('sha256').update(source).digest('hex').slice(0, 24)}`;
}

export function buildSeedSql(userId, userKey, tasks) {
  const statements = tasks.map(task => {
    const id = deterministicTaskId(userKey, task);
    return `INSERT OR IGNORE INTO tasks (
  id, user_id, title, next_action, due_date, priority, effort_minutes,
  focus_type, status, completed_at, created_at, updated_at
) VALUES (
  ${sqlLiteral(id)}, ${sqlLiteral(userId)}, ${sqlLiteral(task.title)}, ${sqlLiteral(task.nextAction)},
  ${sqlLiteral(task.dueDate)}, ${sqlLiteral(task.priority)}, ${sqlLiteral(Number(task.effortMinutes))},
  ${sqlLiteral(task.focusType)}, 'active', NULL, ${sqlLiteral(task.createdAt)}, ${sqlLiteral(task.updatedAt)}
);`;
  });
  return ['PRAGMA foreign_keys = ON;', ...statements].join('\n\n') + '\n';
}

export function findRows(value) {
  if (Array.isArray(value)) {
    for (const item of value) {
      const rows = findRows(item);
      if (rows.length) return rows;
    }
    return [];
  }
  if (!value || typeof value !== 'object') return [];
  if (Array.isArray(value.results)) return value.results;
  if (Array.isArray(value.result)) return value.result;
  for (const child of Object.values(value)) {
    const rows = findRows(child);
    if (rows.length) return rows;
  }
  return [];
}
