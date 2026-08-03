import { json, error, readJson } from '../../_lib/response.js';
import { randomId, requireUser } from '../../_lib/auth.js';

const PRIORITIES = new Set(['high', 'normal']);
const EFFORTS = new Set([15, 30, 60, 90]);
const FOCUS_TYPES = new Set(['focus', 'quick', 'contact']);

function cleanTitle(value) {
  return String(value || '').trim().replace(/\s+/gu, ' ').slice(0, 160);
}

function cleanNextAction(value) {
  return String(value || '').trim().replace(/\s+/gu, ' ').slice(0, 300);
}

function cleanDueDate(value) {
  if (value === null || value === undefined || value === '') return null;
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

export async function onRequestGet(context) {
  try {
    const user = await requireUser(context);
    if (!user) return error('Sign in required.', 401, 'UNAUTHORIZED');
    const rows = await context.env.DB.prepare(`
      SELECT id, title, next_action, due_date, priority, effort_minutes, focus_type,
             status, completed_at, created_at, updated_at
      FROM tasks
      WHERE user_id = ?
      ORDER BY
        CASE status WHEN 'active' THEN 0 ELSE 1 END,
        CASE WHEN due_date IS NULL THEN 1 ELSE 0 END,
        due_date ASC,
        CASE priority WHEN 'high' THEN 0 ELSE 1 END,
        updated_at DESC
    `).bind(user.id).all();
    return json({ ok: true, tasks: (rows.results || []).map(mapTask) });
  } catch (cause) {
    console.error('task list failed', cause);
    return error('Tasks could not be loaded.', 500, 'TASK_LIST_FAILED');
  }
}

export async function onRequestPost(context) {
  try {
    const user = await requireUser(context);
    if (!user) return error('Sign in required.', 401, 'UNAUTHORIZED');
    const body = await readJson(context.request);
    const title = cleanTitle(body.title);
    const nextAction = cleanNextAction(body.nextAction);
    const dueDate = cleanDueDate(body.dueDate);
    const priority = PRIORITIES.has(body.priority) ? body.priority : 'normal';
    const effortMinutes = EFFORTS.has(Number(body.effortMinutes)) ? Number(body.effortMinutes) : 30;
    const focusType = FOCUS_TYPES.has(body.focusType) ? body.focusType : 'focus';

    if (!title) return error('Task title is required.', 400, 'TITLE_REQUIRED');
    if (dueDate === undefined) return error('Invalid due date.', 400, 'INVALID_DUE_DATE');

    const now = new Date().toISOString();
    const id = randomId('tsk_');
    await context.env.DB.prepare(`
      INSERT INTO tasks (
        id, user_id, title, next_action, due_date, priority, effort_minutes,
        focus_type, status, completed_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', NULL, ?, ?)
    `).bind(id, user.id, title, nextAction, dueDate, priority, effortMinutes, focusType, now, now).run();

    return json({
      ok: true,
      task: { id, title, nextAction, dueDate, priority, effortMinutes, focusType, status: 'active', completedAt: null, createdAt: now, updatedAt: now }
    }, 201);
  } catch (cause) {
    if (cause?.message === 'JSON_REQUIRED') return error('JSON body required.', 415, 'JSON_REQUIRED');
    console.error('task create failed', cause);
    return error('Task could not be created.', 500, 'TASK_CREATE_FAILED');
  }
}
