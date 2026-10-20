import { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, Check, CheckCheck, Circle, Clock3, ListTodo, Moon, Plus, Search, Sun, Target, Trash2, X } from 'lucide-react';
import { GOALS_KEY, STORAGE_KEY, isOverdue, localDateString, parseNaturalTask, safeRead, safeWrite, sortTasks } from './taskUtils.js';

const filters = [
  { id: 'all', label: 'All tasks', Icon: ListTodo },
  { id: 'active', label: 'Active', Icon: Circle },
  { id: 'completed', label: 'Completed', Icon: CheckCheck },
  { id: 'today', label: 'Due today', Icon: CalendarDays },
];
const makeId = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const stored = safeRead(STORAGE_KEY, []);
    return Array.isArray(stored) ? stored : [];
  });
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('due');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [composerOpen, setComposerOpen] = useState(false);
  const [quickCapture, setQuickCapture] = useState(false);
  const [draft, setDraft] = useState({ title: '', dueDate: '', priority: 'medium', tags: '' });
  const [editing, setEditing] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPriority, setEditPriority] = useState('medium');
  const [theme, setTheme] = useState(() => safeRead('task-manager.theme.v1', 'light'));
  const [focusMode, setFocusMode] = useState(false);
  const [toast, setToast] = useState('');
  const [storageWarning, setStorageWarning] = useState(false);
  const [goals, setGoals] = useState(() => ({ week: '', month: '', ...safeRead(GOALS_KEY, {}) }));
  const inputRef = useRef(null);
  const today = localDateString();

  useEffect(() => { setStorageWarning(!safeWrite(STORAGE_KEY, tasks) || !safeWrite(GOALS_KEY, goals)); }, [tasks, goals]);
  useEffect(() => { safeWrite('task-manager.theme.v1', theme); document.documentElement.dataset.theme = theme; }, [theme]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    if (composerOpen) inputRef.current?.focus();
  }, [composerOpen, quickCapture]);
  useEffect(() => {
    const onKey = event => {
      const target = event.target;
      const typing = target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault(); document.querySelector('#task-search')?.focus();
      } else if (!typing && event.key.toLowerCase() === 'n') {
        setComposerOpen(true); setQuickCapture(false);
      } else if (event.key === 'Escape') {
        setComposerOpen(false); setEditing(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const active = tasks.filter(task => !task.completed);
  const completed = tasks.filter(task => task.completed);
  const overdue = active.filter(task => isOverdue(task, today));
  const visible = useMemo(() => {
    let list = sortTasks(tasks, sort);
    if (filter === 'active') list = list.filter(task => !task.completed);
    if (filter === 'completed') list = list.filter(task => task.completed);
    if (filter === 'today') list = list.filter(task => task.dueDate === today && !task.completed);
    if (focusMode) list = list.filter(task => !task.completed).slice(0, 3);
    if (priorityFilter !== 'all') list = list.filter(task => task.priority === priorityFilter);
    const term = query.trim().toLowerCase();
    if (term) list = list.filter(task => task.title.toLowerCase().includes(term) || task.tags.some(tag => tag.toLowerCase().includes(term)));
    return list;
  }, [tasks, sort, filter, today, focusMode, priorityFilter, query]);

  function addTask(event) {
    event.preventDefault();
    const parsed = quickCapture ? parseNaturalTask(draft.title) : { title: draft.title.trim(), dueDate: draft.dueDate };
    if (!parsed.title) { setToast('Enter a task title first.'); inputRef.current?.focus(); return; }
    const task = {
      id: makeId(), title: parsed.title, completed: false, createdAt: Date.now(),
      completedAt: null, dueDate: parsed.dueDate || draft.dueDate || '',
      priority: draft.priority, tags: draft.tags.split(',').map(tag => tag.trim().replace(/^#/, '')).filter(Boolean).slice(0, 8),
    };
    setTasks(current => [task, ...current]);
    setDraft({ title: '', dueDate: '', priority: 'medium', tags: '' });
    setComposerOpen(false); setQuickCapture(false); setFilter('all'); setToast('Task added');
  }
  function toggleTask(task) {
    setTasks(current => current.map(item => item.id === task.id ? { ...item, completed: !item.completed, completedAt: !item.completed ? Date.now() : null } : item));
    setToast(task.completed ? 'Task reopened' : 'Task completed');
  }
  function updateTask(task, changes) {
    setTasks(current => current.map(item => item.id === task.id ? { ...item, ...changes } : item));
    setEditing(null); setToast('Task updated');
  }
  function deleteTask(task) {
    if (!window.confirm(`Delete “${task.title}”?`)) return;
    setTasks(current => current.filter(item => item.id !== task.id));
    setToast('Task deleted');
  }
  function clearCompleted() {
    if (!completed.length || !window.confirm(`Clear ${completed.length} completed task(s)?`)) return;
    setTasks(current => current.filter(task => !task.completed));
    setToast('Completed tasks cleared');
  }

  return <div className="app-shell">
    <header className="topbar">
      <a className="brand" href="#" aria-label="Task Manager home"><span className="brand-mark"><CheckCheck size={20} /></span><span><b>Task Manager</b><small>Make room for what matters.</small></span></a>
      <div className="top-actions"><button className="button quiet" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">{theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}<span>Theme</span></button><button className="button primary" onClick={() => { setComposerOpen(true); setQuickCapture(false); }}><Plus size={17} /> New task <kbd>N</kbd></button></div>
    </header>
    <div className="workspace">
      <aside className="sidebar">
        <section className="panel nav-panel"><p className="eyebrow">Workspace</p>{filters.map(({ id, label, Icon }) => <button key={id} className={filter === id ? 'nav-item selected' : 'nav-item'} onClick={() => setFilter(id)}><Icon size={17} /><span>{label}</span><span className="nav-count">{id === 'all' ? tasks.length : id === 'active' ? active.length : id === 'completed' ? completed.length : active.filter(task => task.dueDate === today).length}</span></button>)}</section>
        <section className="panel goals-panel"><div className="panel-title"><Target size={17} /><h2>Goals</h2></div><label>Weekly focus<input value={goals.week} maxLength={120} onChange={event => setGoals(current => ({ ...current, week: event.target.value }))} placeholder="What would make this week a win?" /></label><label>Monthly focus<input value={goals.month} maxLength={120} onChange={event => setGoals(current => ({ ...current, month: event.target.value }))} placeholder="What do you want to move forward?" /></label><p className="muted">Saved in this browser, automatically.</p></section>
        <section className="panel tip-panel"><p className="eyebrow">Quick tip</p><p>Use <kbd>N</kbd> to capture a task, or <kbd>Ctrl K</kbd> to jump to search.</p></section>
      </aside>
      <main className="main-content">
        <div className="page-heading"><div><p className="eyebrow">{new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())}</p><h1>{focusMode ? 'Focus mode' : filters.find(item => item.id === filter)?.label}</h1><p className="muted">A clear next step is enough.</p></div><button className={focusMode ? 'button selected-focus' : 'button'} onClick={() => setFocusMode(value => !value)}><Clock3 size={16} />{focusMode ? 'Exit focus' : 'Focus mode'}</button></div>
        <section className="stats-grid"><article className="panel stat"><span>Total tasks</span><strong>{tasks.length}</strong><small>In your list</small></article><article className="panel stat"><span>Completed</span><strong>{completed.length}</strong><small>{tasks.length ? Math.round(completed.length / tasks.length * 100) : 0}% complete</small></article><article className={overdue.length ? 'panel stat overdue-stat' : 'panel stat'}><span>Overdue</span><strong>{overdue.length}</strong><small>Needs attention</small></article></section>
        {composerOpen && <form className="panel composer" onSubmit={addTask}>
          <div className="composer-header"><h2><Plus size={17} /> Capture a task</h2><div className="composer-modes"><button type="button" className={!quickCapture ? 'mode active-mode' : 'mode'} onClick={() => setQuickCapture(false)}>Details</button><button type="button" className={quickCapture ? 'mode active-mode' : 'mode'} onClick={() => setQuickCapture(true)}>Quick capture</button><button type="button" className="icon-button" aria-label="Close task form" onClick={() => setComposerOpen(false)}><X size={16} /></button></div></div>
          <input ref={inputRef} className="title-input" value={draft.title} onChange={event => setDraft(current => ({ ...current, title: event.target.value }))} placeholder={quickCapture ? 'e.g. Call the dentist tomorrow' : 'What needs to get done?'} maxLength={180} required aria-label="Task title" />
          {quickCapture && <p className="muted helper">Understands today, tomorrow, weekdays, next week, and “in 3 days”. Parsed locally.</p>}
          <div className="composer-fields"><label>Due date<input type="date" value={draft.dueDate} onChange={event => setDraft(current => ({ ...current, dueDate: event.target.value }))} /></label><label>Priority<select value={draft.priority} onChange={event => setDraft(current => ({ ...current, priority: event.target.value }))}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label><label className="tags-field">Tags<input value={draft.tags} onChange={event => setDraft(current => ({ ...current, tags: event.target.value }))} placeholder="Work, Personal" /></label><button className="button primary create-button" type="submit"><Plus size={16} /> Add task</button></div>
        </form>}
        {storageWarning && <div className="storage-warning">Browser storage is unavailable or full. Changes may not survive refresh.</div>}
        <section className="task-section">
          <div className="task-heading"><div><h2>Tasks <span className="count-badge">{visible.length}</span></h2><p className="muted">Select a task to mark it complete.</p></div><button className="button quiet" onClick={clearCompleted} disabled={!completed.length}><Trash2 size={15} /> Clear completed</button></div>
          <div className="task-toolbar"><label className="search-field"><Search size={16} /><input id="task-search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search tasks or tags..." /><kbd>Ctrl K</kbd></label><select aria-label="Sort tasks" value={sort} onChange={event => setSort(event.target.value)}><option value="due">Due date</option><option value="created">Recently added</option><option value="priority">Priority</option></select><select aria-label="Filter by priority" value={priorityFilter} onChange={event => setPriorityFilter(event.target.value)}><option value="all">Any priority</option><option value="high">High priority</option><option value="medium">Medium priority</option><option value="low">Low priority</option></select></div>
          {visible.length ? <div className="task-list">{visible.map(task => <article className={task.completed ? 'task-row is-complete' : 'task-row'} key={task.id}>
            <button className={task.completed ? 'task-check checked' : 'task-check'} onClick={() => toggleTask(task)} aria-label={task.completed ? `Mark ${task.title} incomplete` : `Mark ${task.title} complete`}>{task.completed && <Check size={14} />}</button>
            <div className="task-details">{editing === task.id ? <form className="inline-edit" onSubmit={event => { event.preventDefault(); if (editTitle.trim()) updateTask(task, { title: editTitle.trim(), priority: editPriority }); }}><input autoFocus aria-label="Edit task title" value={editTitle} onChange={event => setEditTitle(event.target.value)} maxLength={180} required /><select aria-label="Edit task priority" value={editPriority} onChange={event => setEditPriority(event.target.value)}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select><button className="icon-button" aria-label="Save edit"><Check size={15} /></button><button type="button" className="icon-button" aria-label="Cancel edit" onClick={() => setEditing(null)}><X size={15} /></button></form> : <><button className="task-title" onDoubleClick={() => { setEditing(task.id); setEditTitle(task.title); setEditPriority(task.priority); }} title="Double-click to edit">{task.title}</button><div className="task-meta">{task.dueDate && <span className={isOverdue(task, today) ? 'due overdue' : task.dueDate === today && !task.completed ? 'due today' : 'due'}><CalendarDays size={13} />{isOverdue(task, today) ? 'Overdue · ' : 'Due '}{task.dueDate}</span>}{task.tags.map(tag => <span className="tag" key={tag}>#{tag}</span>)}<span className={`priority priority-${task.priority}`}>{task.priority} priority</span></div></>}</div>
            <button className="icon-button delete-button" aria-label={`Delete ${task.title}`} onClick={() => deleteTask(task)}><Trash2 size={16} /></button>
          </article>)}</div> : <div className="panel empty-state"><div className="empty-symbol">✦</div><h3>{query ? 'No matching tasks' : filter === 'completed' ? 'Nothing completed yet' : filter === 'today' ? 'Nothing due today' : 'A clear space to start'}</h3><p>{query ? 'Try another search term or clear your search.' : 'Add one small task to get started. You can organize it later.'}</p>{query && <button className="button" onClick={() => setQuery('')}>Clear search</button>}{!query && <button className="button primary" onClick={() => setComposerOpen(true)}><Plus size={16} /> Add a task</button>}</div>}
          <div className="task-footer"><span>{active.length} active · {completed.length} completed</span><span><span className="status-dot" /> Changes saved locally</span></div>
        </section>
      </main>
    </div>
    <div className={toast ? 'toast visible' : 'toast'} role="status">{toast}</div>
  </div>;
}