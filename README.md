
# User Management SPA

A modern, responsive Single Page Application for managing users with full CRUD, built on React and the JSONPlaceholder API, featuring robust validation, error handling, and smooth UX patterns.

### Highlights
- CRUD for users with form validation, toasts, loading/empty states, and client‑side routing.
- Clean, accessible UI using Tailwind with responsive layouts and keyboard‑friendly components.
- Performance‑minded with code splitting, Suspense, and optimized re‑renders.

## Demo and Status
- Local dev: http://localhost:5173 (default Vite port).
- API is non‑persistent (JSONPlaceholder), writes are simulated and reset across sessions.

## Tech Stack
- React 19, React Router DOM 7, Vite 7.
- Tailwind CSS 4, PostCSS, ESLint.
- JSONPlaceholder for mock REST endpoints.

## Features
- User list, detail, create, edit, delete.
- Real‑time form validation: name, email, phone (IN + international formats).
- Toast notifications, graceful error boundaries, empty/loading UX.
- Custom hooks: async state, user data, and context‑based toasts.
- Lazy routes and Suspense for snappy navigation.

## Screenshots
- Home: list with actions and empty/loading states.
- Create/Edit: validated forms with inline errors and disabled submit during pending.
- Detail: normalized user view with fallbacks.

## Getting Started

### Prerequisites
- Node.js 18+ and npm or yarn.

### Installation
```bash
# clone and enter
cd user-management-app

# install
npm install
```


### Development
```bash
npm run dev
```
- App will start on the port printed by Vite (5173 by default).

### Production
```bash
# build
npm run build

# preview local production build
npm run preview
```
- Output is generated to dist/.

## Available Scripts
- npm run dev: Start Vite dev server with HMR.
- npm run build: Production build (minified, code‑split).
- npm run preview: Preview built app locally.
- npm run lint: Lint source with ESLint (if configured).
- npm run format: Format code with Prettier (if configured).

## Environment and Config
- No secrets required; API is public.
- Optional: create .env for Vite variables (e.g., VITE_API_BASE_URL).
- Defaults to https://jsonplaceholder.typicode.com if not provided.

## Project Structure
```
user-management-app/
├── public/                 # Static assets
├── src/
│   ├── app/                # App shell and routing
│   │   ├── App.jsx
│   │   ├── Layout.jsx
│   │   └── routes.jsx
│   ├── components/         # Reusable UI (Button, Input, Toast, Spinner, etc.)
│   ├── context/            # ErrorBoundary, ToastProvider
│   ├── features/
│   │   └── users/          # api, mappers, validations
│   ├── hooks/              # use-async, use-users
│   ├── pages/              # Home, UserCreate, UserDetail, UserEdit, NotFound
│   ├── styles/             # index.css
│   └── utils/              # constants, errors, http, persisted-users
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```


## API Integration
- GET /users — list users.
- GET /users/:id — user details.
- POST /users — create (non‑persistent).
- PUT /users/:id — update (non‑persistent).
- DELETE /users/:id — delete (non‑persistent).

Note: JSONPlaceholder is a fake REST API; write operations succeed but do not persist.

## Validation Rules
- Name: required.
- Email: required and valid format.
- Phone: required; supports:
  - Indian 10‑digit starting 6–9.
  - +91 followed by 10 digits.
  - API‑style formats like “1‑770‑736‑8031 x56442”.
  - General 7–15 digits.

## Architecture Notes

### State and Data
- Custom hooks: use-users for fetching/mutating, use-async for pending/error states.
- Local storage for optional persisted user overlays when API lacks persistence.

### Error Handling
- ErrorBoundary wraps routes to capture render errors.
- HTTP layer normalizes API/network errors into user‑friendly messages.
- Inline form errors with accessible hints.

### Performance
- Route‑level code splitting with React.lazy.
- Suspense for loading fallbacks.
- Memoized components and stable callbacks to reduce re‑renders.

## Accessibility
- Semantic HTML, labeled inputs, and ARIA attributes for toasts and form errors.
- Keyboard navigation: focus states, logical tab order, and actionable controls.
- Color‑contrast‑aware Tailwind tokens for readable UI.

## Testing
- Suggested: Vitest + React Testing Library for components, hooks, and routing.
- Mock service worker (MSW) for API simulation beyond JSONPlaceholder.
- Include basic tests for:
  - List render and empty state.
  - Form validation and submit flows.
  - Error boundary fallback UI.

## Deployment
- Static hosting on Vercel/Netlify/GitHub Pages from dist/.
- Ensure base path in Vite config if deploying on a subpath.
- Set cache headers for immutable assets; serve index.html without caching.

## Browser Support
- Latest Chrome, Firefox, Safari, and Edge.

## Roadmap
- Replace mock API with real backend (Node/Express or .NET), add persistence.
- Pagination, search, and sort for users.
- Role‑based access and authentication.
- E2E tests with Playwright.

## Maintenance
- Commit style: conventional commits (feat:, fix:, chore:).
- CI: lint, type check (if TS), unit tests on PRs.
- Issue templates for bugs/feature requests in private tracker.

## License
Private repository — not licensed for public use.

## Contact
For access or issues, contact the maintainer directly.
