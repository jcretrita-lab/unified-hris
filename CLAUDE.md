# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server
npm run lint       # TypeScript type-check only (tsc --noEmit) — no ESLint
npm run build      # tsc + vite build (see Known Issues below)
npm run preview    # Serve the production build
```

> **Known build issue:** `tsconfig.json` includes only `src/*`, but the actual runtime entry is `index.tsx` at the repo root (not `src/index.tsx`). Running `npm run build` fails on type errors referencing `src/App` (which doesn't exist). The dev server works fine via `npm run dev`. There is no test runner configured.

## Architecture

This is a fully client-side, mock-data HRIS SPA. There is no backend, no API client, and no persistence layer. Actions that would mutate data use `alert()`/`confirm()` and local `useState`.

### Entry point & providers

`index.tsx` (root) → `App.tsx` wraps everything in:
- `AuthProvider` (context/AuthContext.tsx) — mock email-based auth, no password
- `RequestProvider` (context/RequestContext.tsx)
- `HashRouter` — all URLs use `#/` hash routing

### Shell

`components/Layout.tsx` renders the sidebar nav and top bar around `AnimatedRoutes`. Page transitions use Framer Motion (`AnimatePresence`/`PageWrapper`).

### Route guarding

`ProtectedRoute` in `App.tsx` enforces role logic:
- Unauthenticated → `/login`
- `Employee` role is hard-restricted to `/manage/employee/:id`, `/monitor/notifications*`, and `/my-profile`
- All other authenticated roles get full access

### Mock login credentials (no password required)

| Email | Role |
|---|---|
| `admin@company.com` | Superadmin |
| `hradmin@company.com` | HR Admin |
| `payroll@company.com` | HR Payroll Personnel |
| `attendance@company.com` | HR Attendance Personnel |
| `approver@company.com` | Approver |
| `recruiter@company.com` | HR Recruiter |
| `jane@company.com` | Employee (employeeId: `0192823`) |
| Any other email | Employee (guest) |

## Folder structure

```
App.tsx              # All route definitions
types.ts             # Core shared TypeScript interfaces (Employee, User, PaySchedule, Formula, etc.)
config/route.ts      # SEGMENT_LABELS — single source of truth for breadcrumb/search labels
context/             # AuthContext, BreadcrumbContext, RequestContext
hooks/               # useDebounce
model/               # Profile.ts — extended employee profile interfaces (ExtendedProfile, Education, etc.)
viewmodel/           # useProfileViewModel.ts — MVVM pattern for employee profile tab
components/          # Layout, Breadcrumb, Modal, PayslipTemplate, TimekeepingFileTemplate
pages/               # All page components
pages/settings/      # Settings sub-pages (RoleManagement, PermissionsPage, NotificationSettings, etc.)
pages/payroll/       # Payroll sub-tab components (PayrollRunTab, LeaveConversionTab, YearEndTab, mockData.ts)
pages/pay-structure/ # Pay structure sub-components (PayComponents, PayTemplates, FormulaBuilder, etc.)
pages/employee-detail/ # Employee detail tab components (ProfileTab, PayrollTab, ScheduleTab, etc.)
pages/payroll-detail/  # Payroll detail sub-tabs
```

## State management conventions

- All state is component-local `useState`/`useMemo` — no Redux, Zustand, or other global store.
- `RequestContext` manages the approval/request queue shared across pages.
- `BreadcrumbContext` feeds the `Breadcrumb` component with dynamic label overrides for ID-based routes.
- The `model/` + `viewmodel/` pattern is currently used only for the employee profile tab; everything else is self-contained in page files.

## Adding new routes

1. Import the page component in `App.tsx`.
2. Add a `<Route>` inside `AnimatedRoutes` wrapped in `<ProtectedRoute><PageWrapper>`.
3. Add the URL segment → display name mapping in `config/route.ts` (`SEGMENT_LABELS`) so the breadcrumb and global search pick it up.

## Key domain types (`types.ts`)

`Employee`, `User`, `RoleSetup`, `PaySchedule`, `Divisor`, `Formula`, `LookupTable`, `PayComponent`, `AdjustmentType`, `OrgUnit`, `OrgUnitType`, `SalaryGrade`, `Rank`, `SubRank`, `Position`, `PayTemplate`, `DailyPayTemplate`, `VersionHistory`.

## Known technical gaps (from SYSTEM_DOCUMENTATION.md)

- `lint` is TypeScript-only; no ESLint rule checking.
- `AttendanceMonitor` heatmap view is a placeholder.
- Legacy duplicates exist: `pages/RoleManagement.tsx` and `pages/PermissionsPage.tsx` (root-level) vs the active `pages/settings/` versions.
- `README.md` and `index.html` contain stale AI Studio / import-map artifacts.
