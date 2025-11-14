# AI Assistant Guide

Welcome! This repo hosts a small Vite + React dashboard. Please follow these conventions when proposing or generating code:

## Project Layout

- `src/main.jsx` bootstraps the React app inside `<BrowserRouter>`.
- `src/pages` holds routed screens (`ProjectsPage`, `ProjectDetailsPage`).
- `src/components` contains shared UI parts (lists, form composer, skeletons).
- `src/hooks/useProjects.js` exposes the custom data hook used everywhere.

## Expectations

- Use modern React with functional components and hooks; no class components.
- Keep files in `src/` ASCII-only unless you have a strong reason otherwise.
- Stick to idiomatic ESLint+Prettier style (2 spaces, semicolons, single quotes via tooling).
- Prefer accessibility-friendly elements (labels tied to inputs, `aria-*` updates).
- When adding data logic, extend `useProjects` rather than creating duplicate stores.
- Tests live next to pages/components (`.test.jsx`) and run via `npm test`.

## Tooling

- Vite 5 powers dev/build; use `npm run dev` for local preview.
- Vitest + Testing Library for unit tests.
- Stick to npm for dependency management to avoid lockfile churn.

Happy building! If you change architectural conventions, update this file so future assistants stay in sync.


