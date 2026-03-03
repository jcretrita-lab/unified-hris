/**
 * Shared route configuration — single source of truth for URL segment labels.
 *
 * Used by:
 *   - components/Breadcrumb.tsx  — renders the navigation trail
 *   - components/Layout.tsx      — builds global search items from route paths
 *
 * Every static route segment defined in App.tsx should have an entry here.
 * Dynamic ID segments (e.g. ":id") are intentionally absent; they fall back
 * to "Details" in the breadcrumb and are excluded from the global search.
 */
export const SEGMENT_LABELS: Record<string, string> = {
  // Top-level
  dashboard: 'Dashboard',

  // /manage/* — namespace prefix itself is hidden (see HIDDEN_SEGMENTS)
  employee: 'Employees',
  schedule: 'Schedules',
  'leave-balances': 'Leave Balances',
  'leave-request': 'Leave Request',
  payroll: 'Payroll',
  batch: 'Batch Processing',
  'pay-schedule': 'Pay Schedule',
  'pay-structure': 'Pay Structure',
  new: 'New Employee',

  // /monitor/* — namespace prefix itself is hidden (see HIDDEN_SEGMENTS)
  'audit-logs': 'Audit Logs',
  approvals: 'Approvals',
  notifications: 'Notifications',
  attendance: 'Attendance',
  overtime: 'Overtime',
  dtr: 'Timekeeping',
  reports: 'Reports',

  // /settings/*
  settings: 'Settings',
  overview: 'Overview',
  roles: 'Role Management',
  users: 'User Management',
  permissions: 'Permissions',
  ranks: 'Ranks',
  'salary-grade': 'Salary Grade',
  structure: 'Org Structure',
  shift: 'Shift Management',
  leave: 'Leave Management',
  holiday: 'Holiday Management',
  policies: 'Policies',
  'employee-fields': 'Employee Fields',
  adjustments: 'Adjustments',
  audit: 'Audit Logs',
};

/**
 * URL namespace segments that exist only to group routes and have no
 * page of their own. Skipped in breadcrumb rendering and ignored when
 * building global search item labels.
 */
export const HIDDEN_SEGMENTS = new Set(['manage', 'monitor']);
