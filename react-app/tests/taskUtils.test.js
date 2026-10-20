import { describe, expect, it } from 'vitest';
import { isOverdue, localDateString, parseNaturalTask, sortTasks } from '../src/taskUtils.js';

describe('task utilities', () => {
  it('formats local calendar dates without UTC shifts', () => {
    expect(localDateString(new Date(2026, 0, 2))).toBe('2026-01-02');
  });
  it('parses relative natural-language due dates', () => {
    expect(parseNaturalTask('Call the dentist tomorrow', new Date(2026, 0, 1))).toEqual({ title: 'Call the dentist', dueDate: '2026-01-02' });
    expect(parseNaturalTask('Review notes in 2 weeks', new Date(2026, 0, 1)).dueDate).toBe('2026-01-15');
  });
  it('assigns the next weekday when that weekday is today', () => {
    expect(parseNaturalTask('Send report Friday', new Date(2026, 0, 2)).dueDate).toBe('2026-01-09');
  });
  it('does not classify completed tasks as overdue', () => {
    expect(isOverdue({ dueDate: '2026-01-01', completed: false }, '2026-01-02')).toBe(true);
    expect(isOverdue({ dueDate: '2026-01-01', completed: true }, '2026-01-02')).toBe(false);
  });
  it('sorts dated tasks first and then by priority', () => {
    const tasks = [
      { id: '1', dueDate: '', priority: 'high', createdAt: 3 },
      { id: '2', dueDate: '2026-02-01', priority: 'low', createdAt: 1 },
      { id: '3', dueDate: '2026-02-01', priority: 'high', createdAt: 2 },
    ];
    expect(sortTasks(tasks).map(task => task.id)).toEqual(['3', '2', '1']);
  });
});