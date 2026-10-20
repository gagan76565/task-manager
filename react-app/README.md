# Task Manager — React app

Responsive personal task manager built with React 18 and Vite. The repository root also contains a self-contained `index.html` version used by the current static deployment; this React project lives in `react-app/`.

## Features
- Create, complete/reopen, inline-edit, and delete tasks
- Local browser persistence for tasks, goals, and theme
- All, Active, Completed, and Due today filters
- Search task titles and tags; sort by due date, creation date, or priority
- Due dates, overdue indicators, priorities, and comma-separated tags
- Weekly/monthly goal notes
- Natural-language quick capture for today, tomorrow, weekdays, next week, and relative days/weeks
- Keyboard shortcuts: N for new task and Ctrl/⌘+K for search
- Focus mode, empty states, storage warnings, dark theme, reduced-motion support
- No account or backend required

## Run locally
Node.js 18+ recommended.

```bash
cd react-app
npm install
npm run dev
```

## Test and production build
```bash
npm test
npm run build
npm run preview
```

## Data design
Tasks and goal notes are stored in localStorage. This keeps the MVP simple and private, but data does not sync between browsers or devices and can be lost if browser site data is cleared. No credentials or task content are sent to an application backend.

## Deployment
The React version is deployed at https://task-manager-react-8up6.onrender.com. Its Render Static Site settings are:
- Build command: `cd react-app && npm install && npm run build`
- Publish directory: `react-app/dist`

The root-level standalone version remains deployed separately at https://task-manager-q85c.onrender.com.