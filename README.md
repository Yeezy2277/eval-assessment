# React Mini Dashboard

A tiny React + Vite dashboard that lists mocked projects, supports filtering, and lets you drill into a project via client-side routing. Data access is encapsulated in a custom `useProjects` hook that simulates an async fetch and exposes helper utilities.

## Features

- Searchable list with live result counts, sort controls, and loading skeletons.
- Quick-add composer powered by mocked mutations (`createProject`) that prepend new items.
- Detail view with inline status updates that call the hook’s `updateProjectStatus`.

## Requirements

- Node.js 20+
- npm 10+

## Getting Started

```bash
npm install
npm run dev
```

Then open the printed URL (default: http://localhost:5173) in your browser.

## Available Scripts

- `npm run dev` – start the Vite dev server.
- `npm run build` – bundle the app for production.
- `npm run preview` – preview the production build locally.
- `npm test` – run the Vitest test suite (jsdom environment).

## Testing Notes

The repository ships with a minimal test (`ProjectsPage.test.jsx`) that verifies the search filter behavior with Testing Library + Vitest. Snapshot-style a11y checks are avoided in favor of focused behavioral coverage.

Additional tests cover status updates and the quick-add flow (`ProjectDetailsPage.test.jsx`, extra cases in `ProjectsPage.test.jsx`).

## Accessibility Touches

- Controlled search input exposed via `aria-label` and `role="searchbox"`.
- Filter count and list results use `aria-live="polite"` to announce updates for assistive tech.
- Loading and error states include semantic roles (`status`, `alert`) to make state transitions clear.

