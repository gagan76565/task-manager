# QA Report — React Task Manager

## Included checks
- Utility tests cover local date formatting, natural-language date capture, weekday edge cases, overdue calculation, and sort order.
- Vite production build and Vitest scripts are configured.
- Keyboard focus indicators and reduced-motion CSS are included.
- Layout breakpoints target desktop, tablet, and narrow mobile widths.

## Not yet verified
- The GitHub connector can commit the source, but this environment has no npm registry/network access, so the React production build and Vitest suite have not been executed here.
- The existing live Render site serves the root standalone HTML app. The React version is source-complete in `react-app/` but needs a separate Render static-site configuration with the build and publish paths documented in README.
- LocalStorage is browser-specific and does not provide cross-device sync or backup.

## Manual release checklist
1. Run `npm install`, `npm test`, and `npm run build` inside `react-app/`.
2. Verify task create/edit/delete/completion and reload persistence.
3. Verify filters, search, sorting, priorities, due dates, tags, and quick capture.
4. Check 320px, 375px, 430px, 768px, 1024px, and 1440px widths.
5. Test keyboard navigation, dark theme, and reduced-motion preference.
6. Deploy the React static site and verify the public URL after Render reports Live.