# Task Manager

A responsive personal task manager with a standalone static version and a React/Vite implementation.

## Live app
- Standalone deployment: https://task-manager-q85c.onrender.com
- GitHub source: https://github.com/gagan76565/task-manager

## Project layout
- `index.html` — self-contained standalone app served by the current Render site
- `react-app/` — React 18 + Vite app, tests, and build configuration
- `react-app/README.md` — local development and React deployment instructions
- `react-app/QA_REPORT.md` — validation coverage and release checklist

## React app: run locally
Requirements: Node.js 18+ and npm.

```bash
cd react-app
npm install
npm run dev
```

## Test and build
```bash
cd react-app
npm test
npm run build
npm run preview
```

## Features
- Add, complete/reopen, edit, and delete tasks
- Persist tasks, goals, and theme in browser localStorage
- All / Active / Completed / Due today filters
- Search, sorting, priorities, due dates, overdue indicators, and tags
- Weekly/monthly goal notes, focus mode, and quick capture
- Keyboard shortcuts, empty states, dark theme, responsive layout, reduced-motion support

## Data and privacy
This is a local-first MVP. Tasks stay in the browser's local storage and do not sync across devices or browsers. Clearing site data can remove saved tasks. There is no authentication or backend.

## Deployment notes
The existing Render static site serves the root standalone `index.html`. To deploy the React app as a separate Render Static Site, use:
- Build command: `cd react-app && npm install && npm run build`
- Publish directory: `react-app/dist`

## PRD checklist
- [x] Add tasks
- [x] List tasks
- [x] Mark complete/incomplete
- [x] Delete tasks
- [x] Persist across refreshes
- [x] Due dates, overdue indicator, and sorting
- [x] All / Active / Completed filters
- [x] Inline editing in the React version
- [x] Priority and tags
- [x] Weekly/monthly goal notes
- [x] Natural-language quick capture
- [x] Keyboard-first shortcuts and empty states