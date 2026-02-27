
# HRIS System Documentation

Last updated: February 16, 2026  
Codebase scope: `C:\Users\joshu\Documents\unified-hris`

## 1. System Snapshot
This repository is a mock-data HRIS SPA covering Core HR, attendance, payroll, approvals, reporting, and system configuration.  
Stack in `package.json`: React 18, TypeScript 5, React Router 6 (`HashRouter`), Tailwind CSS, Framer Motion, Lucide icons, D3, Vite 5.

## 2. Runtime Architecture
- Entry/runtime is currently split:
  - `index.html` loads `/index.tsx` (repo root, working runtime path).
  - `tsconfig.json` includes only `src/*`, where `src/index.tsx` imports `./App` (missing), causing TypeScript build failure.
- App shell: `App.tsx` + `components/Layout.tsx` + `context/AuthContext.tsx`.
- State model: component-local `useState/useMemo` with in-file constants; no API client, no persistence layer.

## 3. Auth, Roles, and Route Guarding
- `AuthContext` uses email-based mock login for roles: `Superadmin`, `HR Admin`, `HR Payroll Personnel`, `HR Attendance Personnel`, `Approver`, `HR Recruiter`, `Employee`.
- Unknown emails default to `Employee`.
- `ProtectedRoute` behavior:
  - Unauthenticated users -> `/login`.
  - `Employee` role is hard-restricted to `/manage/employee/:id`, `/monitor/notifications*`, and `/my-profile`.
- Root redirect:
  - unauthenticated -> `/login`
  - employee -> `/my-profile` -> `/manage/employee/{employeeId}`
  - others -> `/dashboard`

## 4. Route Surface (Implemented)
- Public/onboarding: `/login`, `/new-organization`.
- Profile: `/my-profile`, `/manage/employee`, `/manage/employee/new`, `/manage/employee/:id`.
- Schedule/leave: `/manage/schedule`, `/manage/schedule/:id`, `/manage/leave-balances`, `/manage/leave-balances/:id`, `/manage/leave-request/:id`.
- Payroll/comp: `/manage/payroll`, `/manage/payroll/batch`, `/manage/payroll/:id`, `/manage/pay-schedule`, `/manage/pay-structure`.
- Monitoring: `/monitor/attendance`, `/monitor/attendance/overtime/:id`, `/monitor/attendance/dtr/:id`, `/monitor/approvals`, `/monitor/approvals/:id`, `/monitor/reports`, `/monitor/reports/:id`, `/monitor/notifications`, `/monitor/notifications/:id`, `/monitor/audit-logs`.
- Settings: `/settings/overview`, `/settings/roles`, `/settings/users`, `/settings/permissions`, `/settings/ranks`, `/settings/salary-grade`, `/settings/structure`, `/settings/approvals`, `/settings/audit`, `/settings/shift`, `/settings/leave`, `/settings/holiday`, `/settings/policies`, `/settings/employee-fields`, `/settings/notifications`, `/settings/adjustments`.

## 5. Functional Modules
- Dashboard (`pages/Dashboard.tsx`): role-specific dashboards with configurable widgets.
- Employee lifecycle (`EmployeeList`, `EmployeeDetail`, `NewEmployee`): directory, detail tabs, multi-step onboarding wizard.
- Attendance/timekeeping (`AttendanceMonitor`, `TimekeepingDetail`, `OvertimeDetail`): DTR table, OT queue, summary records, override editing/hold flow.
- Payroll (`PayrollManagement`, `PayrollRunTab`, `LeaveConversionTab`, `YearEndTab`, `PayrollDetail`, `BatchPayrollPage`): run queue, payslip preview, leave cash conversion, annualization/13th-month drilldowns, batch workspace.
- Compensation engine (`PayStructure` + `pay-structure/*`): pay components, templates, formula builder, lookup tables, version history/restore flows.
- Organization/comp settings (`OrgStructurePage`, `RankSettings`, `SalaryGradeSettings`, `PaySchedule`): D3 hierarchy, rank/sub-rank, aligned/range grades, global pay schedules.
- Governance (`ApprovalSetup`, `ApprovalList`, `ApprovalDetail`, `ReportsPage`, `ReportDetail`, `AuditLogs`, `AuditLogSettings`, `NotificationCenter`, `NotificationDetail`).
- System settings (`pages/settings/*`): role matrix, protocol matrix, user management, employee field schema editor, adjustment types, notification rule/template editor with simulation.
- Policy engine (`PoliciesPage`): Philippine labor-code-focused policy and leave monetization controls.

## 6. Setup Feature Deep Dive
### 6.1 Role Overview
- Entry point: `/settings/overview` (`pages/settings/SettingsOverview.tsx`).
- Purpose: role-aware setup navigation layer that exposes only modules relevant to the logged-in role.
- Behavior:
  - Maps each setup card to a route, description, icon, and allowed role list.
  - Filters visible cards by current `AuthContext` role before render.
  - Acts as the control tower for configuration workflows (roles, permissions, users, approvals, notifications, audits, policies, etc.).

### 6.2 Notifications
- Entry point: `/settings/notifications` (`pages/settings/NotificationSettings.tsx`).
- Purpose: define who gets notified, when, through which channel, and with what message.
- Behavior:
  - Rule catalog grouped by module (Core HR, Time & Attendance, Payroll, System, etc.).
  - Per-rule channel switches: in-app and email delivery.
  - Role targeting via recipient role assignment modal.
  - Template editor for email + in-app content with variable tokens (`{{employee_name}}`, `{{date}}`, etc.).
  - Trigger metadata management (`Event-Based`, `Schedule-Based`, `One-Time`) and severity typing.
  - Built-in simulation preview to validate rendered content before saving.

### 6.3 Approvals
- Entry point: `/settings/approvals` (`pages/ApprovalSetup.tsx`).
- Purpose: configure approval workflows by feature and organizational scope.
- Behavior:
  - Workflow records include feature target, auto-reject days, unit type/target, and effectivity dates.
  - Supports ordered approver chain setup with add/remove controls.
  - Supports advanced reviewer coverage: delegate (representative) and co-approver assignment.
  - Separate tab for managing which employees are assigned to a workflow setup.
  - Uses searchable employee picker with department filters for approvers/assignees.

### 6.4 Policies & Rules
- Entry point: `/settings/policies` (`pages/PoliciesPage.tsx`).
- Purpose: central policy governance and labor compliance controls.
- Behavior:
  - Structured tabs aligned to labor domains (Book I/II/III/IV/V/VI + Special Laws).
  - Configurable rules for hours, breaks, premiums, holiday rates, deductions, probation, grievance timelines, and retirement/separation computations.
  - Benefit/tax policy controls including de minimis limits and 13th month basis.
  - Compliance badges compare configured values vs legal baselines for risk/compliance visibility.
  - Leave monetization configuration per leave type (enabled state, max days, rate, basis, tax-exempt threshold setting).

### 6.5 User Management
- Entry point: `/settings/users` (`pages/UserManagement.tsx`).
- Purpose: administer system account lifecycle.
- Behavior:
  - User directory with search, role filter, status indicator, and security status (MFA on/off).
  - Create flow issues pending-invite accounts with role assignment.
  - Edit flow updates role/status for existing accounts.
  - Security actions include password reset and lock/unlock handling messaging.

### 6.6 Permissions
- Entry point: `/settings/permissions` (`pages/settings/PermissionsPage.tsx`).
- Purpose: define permission protocols with multi-dimensional access logic.
- Behavior:
  - Protocol list view for role-oriented access profiles.
  - Editor supports per-module policy definition across:
    - authority level,
    - allowed actions,
    - scope boundaries,
    - lifecycle states.
  - Live policy statement sentence builder reflects selected combinations.
  - Expandable per-module configuration panels for granular control.

### 6.7 Reports
- Entry point: `/monitor/reports` (`pages/ReportsPage.tsx`).
- Purpose: provide standard and custom report definitions for HR operations and audits.
- Behavior:
  - Standard reports are immutable templates; custom reports are user-created and deletable.
  - Search + type tabs (`All`, `Standard`, `Custom`) for report discovery.
  - Custom report creation captures title, category, and description, then routes to detail configuration.
  - Category model spans Core HR, Time & Attendance, Payroll, and System datasets.

### 6.8 Audit Logs
- Setup entry point: `/settings/audit` (`pages/AuditLogSettings.tsx`).
- Monitoring entry point: `/monitor/audit-logs` (`pages/AuditLogs.tsx`).
- Purpose: govern audit collection policy and inspect recorded system events.
- Behavior:
  - Configuration layer:
    - global logging master switch,
    - retention period policy,
    - module/event rule toggles with severity classification,
    - reset defaults and explicit save workflow.
  - Monitoring layer:
    - searchable/filterable event ledger (module/action),
    - export action,
    - row-level event inspector with actor, resource, metadata, and field-level change diffs.

## 7. Domain Models
Key shared types in `types.ts`: `Employee`, `User`, `RoleSetup`, `PaySchedule`, `Formula`, `LookupTable`, `PayComponent`, `AdjustmentType`, `OrgUnit`, `OrgUnitType`, `SalaryGrade`, `Rank`, `Position`, `PayTemplate`.

## 8. Known Technical Gaps
- `lint` is currently TypeScript-only (`tsc --noEmit`) and does not run ESLint rule-based checks.
- Data is entirely mock/transient; many actions use `alert()`/`confirm()`.
- `AttendanceMonitor` heatmap view is placeholder text; wildcard route renders "Page under development".
- Legacy duplication exists (`pages/RoleManagement.tsx` and `pages/PermissionsPage.tsx` vs active `pages/settings/*` versions).
- `README.md` and `index.html` still contain AI Studio/import-map-era artifacts not aligned with installed package versions.
