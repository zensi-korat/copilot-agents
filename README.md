# Admin Panel — React + Tailwind CSS (Finio API integration)

A modern, responsive admin panel built with React, TypeScript, Vite, and Tailwind CSS.

This workspace includes an integration with the Finio API for personal finance features (accounts, transactions, categories, labels) plus authentication (email + OTP flows), protected routes, and automatic remote backups.

## Highlights

- Finio API integration via a small API client (`/api` base path with Vite proxy)
- Authentication: register, login, OTP verification, forgot/reset password
- Protected routes using `AuthContext` + `ProtectedRoute`
- Finance domain: accounts, transactions, categories, labels, and settings
- Auto-backup: local finance state syncs to remote backups with debounce
- Dev proxy to avoid CORS: Vite proxies `/api` to the Finio API in development
- TypeScript, Tailwind CSS, and Vite for a fast DX

## Features

- Modern UI with Tailwind CSS and reusable components
- Authentication & session management (token persisted in localStorage)
- Route protection (redirects to `/login` when unauthenticated)
- Finance CRUD (accounts, transactions) and category/label management
- Automatic backups to remote API and manual sync
- Admin pages: Dashboard, Users, Reports, Settings, Profile

## Project structure (high level)

```
src/
├── components/        # Reusable UI: Header, Sidebar, ProtectedRoute, etc.
├── pages/             # Pages: dashboard, auth, finance pages, users, settings
├── layouts/           # Admin layout wiring header + sidebar
├── context/           # React contexts: AuthContext, FinanceContext
├── services/          # API wrappers: auth.ts, user.ts, backup.ts
├── utils/             # apiClient.ts, token helpers
├── types/             # shared TypeScript types (finance models)
├── App.tsx            # Routing + protected route wiring
└── main.tsx           # App bootstrap (providers)
```

## Key files

- [src/utils/apiClient.ts](src/utils/apiClient.ts) — request wrapper; uses `/api` base for the Vite proxy and attaches the auth token when needed.
- [src/utils/token.ts](src/utils/token.ts) — token get/set/remove helpers (localStorage).
- [src/services/auth.ts](src/services/auth.ts) — register/login/verify/resend/forgot/reset endpoints.
- [src/services/backup.ts](src/services/backup.ts) — upload & fetch backups.
- [src/context/AuthContext.tsx](src/context/AuthContext.tsx) — `AuthProvider`, `useAuth()` and `logout()`.
- [src/context/FinanceContext.tsx](src/context/FinanceContext.tsx) — local finance state, CRUD, and auto-backup syncing.
- [src/components/ProtectedRoute.tsx](src/components/ProtectedRoute.tsx) — restricts routes to authenticated users.
- [src/components/Header.tsx](src/components/Header.tsx) — logout button now clears finance state and redirects to `/login`.
- [vite.config.ts](vite.config.ts) — contains the dev proxy mapping `/api` to the Finio API host.
- [tsconfig.app.json](tsconfig.app.json) — JSX configured (`react-jsx`) to fix editor errors.

## Getting started

### Prerequisites

- Node.js 16+ (or compatible LTS)
- npm or yarn

### Install

```bash
npm install
```

### Run (development)

```bash
npm run dev
```

The Vite dev server will start and proxy requests to `/api` to the configured remote API to avoid CORS during development.

### Build

```bash
npm run build
```

### Preview (production build)

```bash
npm run preview
```

## Developer notes

- Authentication: tokens are saved with `setToken()` and read by `apiClient.request()` when `auth: true` is passed. See `src/services/auth.ts` and `src/utils/token.ts`.
- Protected routes: `ProtectedRoute` checks `useAuth().isAuthenticated` and redirects to `/login` when false. Auth pages redirect to `/` when a user is already authenticated.
- Finance data: `FinanceContext` exposes CRUD helpers (`addAccount`, `addTransaction`, etc.) and automatically uploads a backup after a short debounce. The header's logout clears finance state before calling `logout()`.
- API host: change the Vite proxy in `vite.config.ts` or update the base path inside `src/utils/apiClient.ts` if you prefer a different setup.

## Contributing

If you want to extend the project, add routes under `src/pages/` and wire them into `src/App.tsx` inside the protected admin routes if they require authentication.

## License

MIT
