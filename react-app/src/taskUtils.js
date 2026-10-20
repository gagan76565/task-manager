export const STORAGE_KEY = 'task-manager.tasks.v1';
export const GOALS_KEY = 'task-manager.goals.v1';

export function localDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function safeRead(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function safeWrite(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function isOverdue(task, today = localDateString()) {
  return Boolean(task.dueDate && task.dueDate < today && !task.completed);
}

export function parseNaturalTask(input, now = new Date()) {
  const text = input.trim();
  const match = text.match(/\s+(today|tomorrow|next week|in\s+\d+\s+(?:days?|weeks?)|monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/i);
  if (!match) return { title: text, dueDate: '' };
  const phrase = match[1].toLowerCase();
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (phrase === 'tomorrow') date.setDate(date.getDate() + 1);
  else if (phrase === 'next week') date.setDate(date.getDate() + 7);
  else if (phrase === 'today') { /* keep today's date */ }
  else if (phrase.startsWith('in ')) {
    const [, amount, unit] = phrase.match(/in\s+(\d+)\s+(days?|weeks?)/);
    date.setDate(date.getDate() + Number(amount) * (unit.startsWith('week') ? 7 : 1));
  } else {
    const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    let delta = (weekdays.indexOf(phrase) - date.getDay() + 7) % 7;
    if (delta === 0) delta = 7;
    date.setDate(date.getDate() + delta);
  }
  return { title: text.slice(0, match.index).trim(), dueDate: localDateString(date) };
}

export function sortTasks(tasks, mode = 'due') {
  const priority = { high: 0, medium: 1, low: 2 };
  return [...tasks].sort((a, b) => {
    if (mode === 'priority') return priority[a.priority || 'medium'] - priority[b.priority || 'medium'] || (b.createdAt || 0) - (a.createdAt || 0);
    if (mode === 'created') return (b.createdAt || 0) - (a.createdAt || 0);
    return (a.dueDate || '9999-99-99').localeCompare(b.dueDate || '9999-99-99') ||
      priority[a.priority || 'medium'] - priority[b.priority || 'medium'] ||
      (b.createdAt || 0) - (a.createdAt || 0);
  });
}