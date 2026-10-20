# QA Report — React Task Manager

## Verified
- GitHub Actions CI passed: [Run #2](https://github.com/gagan76565/task-manager/actions/runs/39419259180).
- The CI job installed dependencies, ran the utility test suite, and completed the production Vite build.
- Utility tests cover local date formatting, natural-language due-date capture, weekday edge cases, overdue calculation, and task sort order.
- Render completed the React static-site deployment with status **Live**: https://task-manager-react-8up6.onrender.com
- The original standalone deployment remains available at https://task-manager-q85c.onrender.com
- Keyboard focus indicators and reduced-motion CSS are included.
- Layout breakpoints target desktop, tablet, and narrow mobile widths.

## Limitations
- Task, goal, and theme data are stored in browser localStorage. They do not sync across devices and can be lost if browser site data is cleared.
- No account, server database, or cloud backup is included.
- A web-based smoke test could not be completed through the available browser inspection tool, so live visual/interaction verification should still be performed manually.

## Manual release checklist
1. Open the React deployment and add a task with a due date, priority, and tags.
2. Reload and verify task and goal persistence.
3. Verify filters, search, sorting, completion, editing, and deletion.
4. Try quick capture with `Call the dentist tomorrow` and `Send report Friday`.
5. Check 320px, 375px, 430px, 768px, 1024px, and 1440px widths.
6. Test keyboard navigation, dark theme, and reduced-motion preference.