function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function dateDistance(dateKey, todayKey) {
  if (!dateKey) return null;
  const start = new Date(`${todayKey}T00:00:00`);
  const end = new Date(`${dateKey}T00:00:00`);
  return Math.round((end - start) / 86_400_000);
}

export function scoreTask(task, availableMinutes = 30, now = new Date()) {
  if (!task || task.status !== 'active') return null;
  const today = localDateKey(now);
  const distance = dateDistance(task.dueDate, today);
  let score = task.priority === 'high' ? 55 : 20;
  const reasons = [];

  if (distance !== null && distance < 0) {
    score += 110;
    reasons.push('overdue');
  } else if (distance === 0) {
    score += 90;
    reasons.push('dueToday');
  } else if (distance === 1) {
    score += 45;
    reasons.push('dueTomorrow');
  } else if (distance !== null && distance <= 7) {
    score += 20;
    reasons.push('dueSoon');
  }

  if (task.priority === 'high') reasons.push('highPriority');

  const effort = Number(task.effortMinutes || 30);
  if (effort <= availableMinutes) {
    score += 35;
    reasons.push('fitsTime');
  } else {
    score -= Math.min(30, Math.ceil((effort - availableMinutes) / 15) * 5);
  }

  if (task.focusType === 'quick' && availableMinutes <= 30) score += 12;
  if (task.focusType === 'contact' && distance !== null && distance <= 0) score += 8;

  return { task, score, reasons, distance };
}

export function recommendTask(tasks, availableMinutes = 30, now = new Date()) {
  const ranked = (Array.isArray(tasks) ? tasks : [])
    .map(task => scoreTask(task, availableMinutes, now))
    .filter(Boolean)
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      const leftDate = left.task.dueDate || '9999-12-31';
      const rightDate = right.task.dueDate || '9999-12-31';
      if (leftDate !== rightDate) return leftDate.localeCompare(rightDate);
      return String(left.task.createdAt || '').localeCompare(String(right.task.createdAt || ''));
    });
  return ranked[0] || null;
}

export { localDateKey };
