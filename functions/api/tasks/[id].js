import { json, error, readJson } from '../../_lib/response.js';
import { requireUser } from '../../_lib/auth.js';

const PRIORITIES = new Set(['high', 'normal']);
const EFFORTS = new Set([15, 30, 60, 90]);
const FOCUS_TYPES = new Set(['focus', 'quick', 'contact']);
const STATUSES = new Set(['active', 'done']);

function cleanTitle(value) {
  return String(value || '').trim().replace(/\s+/gu, ' ').slice(0, 160);
}

function cleanNextAction(value) {
  return String(value || '').trim().replace(/\s+/gu, ' ').slice(0, 300);
}

function cleanDueDate(value) {
  if (value === null || value === '') return null;
  const dueDate = String(value);
  return /^\d{4}-\d{2}-\d{2}$/u.test(dueDate) ? dueDate : undefined;
}

function mapTask(row) {
  return {
    id: row.id,
    title: row.title,
    nextAction: row.next_action || '',
    dueDate: row.due_date,
    priority: row.priority,
    effortMinutes: row.effort_minutes,
    focusType: row.focus_type,
    status: row.status,
    completedAt: row.completed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function onRequestPatch(context) {
  try {
    const user = await requireUser(context);
    if (!user) return error('Sign in required.', 401, 'UNAUTHORIZED');
    const taskId = context.params.id;
    const current = await context.env.DB.prepare(`
      SELECT * FROM tasks WHERE id = ? AND user_id = ?
    `).bind(taskId, user.id).first();
    if (!current) return error('Task not found.', 404, 'TASK_NOT_FOUND');

    const body = await readJson(context.request);
    const next = {
      title: body.title === undefined ? current.title : cleanTitle(body.title),
      nextAction: body.nextAction === undefined ? (current.next_action || '') : cleanNextAction(body.nextAction),
      dueDate: body.dueDate === undefined ? current.due_date : cleanDueDate(body.dueDate),
      priority: body.priority === undefined ? current.priority : body.priority,
      effortMinutes: body.effortMinutes === undefined ? current.effort_minutes : Number(body.effortMinutes),
      focusType: body.focusType === undefined ? current.focus_type : body.focusType,
      status: body.status === undefined ? current.status : body.status
    };

    if (!next.title) return error('Task title is required.', 400, 'TITLE_REQUIRED');
    if (next.dueDate === undefined) return error('Invalid due date.', 400, 'INVALID_DUE_DATE');
    if (!PRIORITIES.has(next.priority)) return error('Invalid priority.', 400, 'INVALID_PRIORITY');
    if (!EFFORTS.has(next.effortMinutes)) return error('Invalid effort.', 400, 'INVALID_EFFORT');
    if (!FOCUS_TYPES.has(next.focusType)) return error('Invalid task type.', 400, 'INVALID_FOCUS_TYPE');
    if (!STATUSES.has(next.status)) return error('Invalid status.', 400, 'INVALID_STATUS');

    const now = new Date().toISOString();
    const completedAt = next.status === 'done'
      ? (current.completed_at || now)
      : null;

    await context.env.DB.prepare(`
      UPDATE tasks
      SET title = ?, next_action = ?, due_date = ?, priority = ?, effort_minutes = ?,
          focus_type = ?, status = ?, completed_at = ?, updated_at = ?
      WHERE id = ? AND user_id = ?
    `).bind(
      next.title, next.nextAction, next.dueDate, next.priority, next.effortMinutes,
      next.focusType, next.status, completedAt, now, taskId, user.id
    ).run();

    const updated = await context.env.DB.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?')
      .bind(taskId, user.id).first();
    return json({ ok: true, task: mapTask(updated) });
  } catch (cause) {
    if (cause?.message === 'JSON_REQUIRED') return error('JSON body required.', 415, 'JSON_REQUIRED');
    console.error('task update failed', cause);
    return error('Task could not be updated.', 500, 'TASK_UPDATE_FAILED');
  }
}

export async function onRequestDelete(context) {
  try {
    const user = await requireUser(context);
    if (!user) return error('Sign in required.', 401, 'UNAUTHORIZED');
    const result = await context.env.DB.prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?')
      .bind(context.params.id, user.id).run();
    if (!result.meta?.changes) return error('Task not found.', 404, 'TASK_NOT_FOUND');
    return json({ ok: true });
  } catch (cause) {
    console.error('task delete failed', cause);
    return error('Task could not be deleted.', 500, 'TASK_DELETE_FAILED');
  }
}
