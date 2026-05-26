# Admin Panel Setup - Checklist

## Steps to Get Started

- [x] Verify copilot-instructions.md exists
- [x] Project scaffolded with React + TypeScript
- [x] Tailwind CSS configured
- [ ] Install dependencies
- [ ] Run development server
- [ ] Verify project builds successfully

## Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Includes (notable)

- ✅ React 18 with TypeScript
- ✅ Vite build tool
- ✅ Tailwind CSS with responsive design
- ✅ React Router for navigation
- ✅ Sidebar navigation with collapsible menu
- ✅ Header with action buttons and logout handling
- ✅ Dashboard with stats and charts placeholder
- ✅ Users management page with data table
- ✅ Settings page with form examples
- ✅ Reusable UI components (Button, Card, StatCard)
- ✅ Lucide icons integration
- ✅ Finio API integration (via `src/utils/apiClient.ts` and Vite proxy)
- ✅ Authentication flows: register, login, OTP verify, forgot/reset
- ✅ Protected routes with `AuthContext` + `ProtectedRoute`
- ✅ Finance domain models + auto-backup (`FinanceContext` + `backup` service)

## Notes

- Dev proxy: The project is configured to proxy `/api` to the remote Finio API in `vite.config.ts` to avoid CORS during development.
- Auth & token: Tokens are persisted to localStorage and used by the API client. See `src/utils/token.ts` and `src/utils/apiClient.ts`.
- Logout: The header logout clears local finance state, removes the token, and redirects to `/login`.

## Next Steps

1. Run `npm install` to install all dependencies
2. Run `npm run dev` to start the development server
3. Open the app and test authentication flows (register → verify OTP → login)
4. Check finance pages and backups: Accounts, Transactions, Backups, Profile
5. Customize components and pages as needed
