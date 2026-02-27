
import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import EmployeeList from './pages/EmployeeList';
import EmployeeDetail from './pages/EmployeeDetail';
import RoleManagement from './pages/settings/RoleManagement';
import { PaySchedulePage } from './pages/PaySchedule';
import { PayStructure } from './pages/PayStructure';
import RankSettingsPage from './pages/RankSettings';
import SalaryGradeSettings from './pages/SalaryGradeSettings';
import OrgStructurePage from './pages/OrgStructurePage';
import PermissionsPage from './pages/settings/PermissionsPage';
import ApprovalSetupPage from './pages/ApprovalSetup';
import AuditLogsPage from './pages/AuditLogs';
import AuditLogSettings from './pages/AuditLogSettings';
import ShiftManagement from './pages/ShiftManagement';
import LeaveManagement from './pages/LeaveManagement';
import HolidayManagement from './pages/HolidayManagement';
import PoliciesPage from './pages/PoliciesPage';
import ApprovalList from './pages/ApprovalList';
import ApprovalDetail from './pages/ApprovalDetail';
import EmployeeSchedule from './pages/EmployeeSchedule';
import EmployeeScheduleDetail from './pages/EmployeeScheduleDetail';
import EmployeeLeaveBalances from './pages/EmployeeLeaveBalances';
import EmployeeLeaveBalanceDetail from './pages/EmployeeLeaveBalanceDetail';
import EmployeeLeaveDetail from './pages/EmployeeLeaveDetail';
import PayrollManagement from './pages/PayrollManagement';
import PayrollDetail from './pages/PayrollDetail';
import BatchPayrollPage from './pages/BatchPayrollPage';
import AttendanceMonitor from './pages/AttendanceMonitor';
import OvertimeDetail from './pages/OvertimeDetail';
import TimekeepingDetail from './pages/TimekeepingDetail';
import UserManagement from './pages/UserManagement';
import NewOrganization from './pages/NewOrganization';
import NewEmployee from './pages/NewEmployee';
import ReportsPage from './pages/ReportsPage';
import ReportDetail from './pages/ReportDetail';
import EmployeeFieldsSetup from './pages/settings/EmployeeFieldsSetup';
import NotificationSettings from './pages/settings/NotificationSettings';
import NotificationCenter from './pages/NotificationCenter';
import NotificationDetail from './pages/NotificationDetail';
import SettingsOverview from './pages/settings/SettingsOverview';
import AdjustmentSetup from './pages/settings/AdjustmentSetup';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RequestProvider } from './context/RequestContext';


// Guard Component
const ProtectedRoute = ({ children, requiredRole }: { children?: React.ReactNode, requiredRole?: 'Superadmin' | 'Employee' }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role Logic
  if (user?.role === 'Employee') {
    // Employees can only access specific profile routes, NOTIFICATIONS, and dashboards is handled by router logic
    const allowedPath = `/my-profile`;
    if (!location.pathname.startsWith('/manage/employee/') && !location.pathname.startsWith('/monitor/notifications') && location.pathname !== allowedPath) {
      return <Navigate to={allowedPath} replace />;
    }
  }

  return <>{children}</>;
};

// Redirect Handler for Root
const RootRedirect = () => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (user?.role === 'Employee') {
    return <Navigate to="/my-profile" replace />;
  }
  return <Navigate to="/dashboard" replace />;
}

// Special Component to redirect "My Profile" to the specific ID
const MyProfileRedirect = () => {
  const { user } = useAuth();
  if (user?.employeeId) {
    return <Navigate to={`/manage/employee/${user.employeeId}`} replace />;
  }
  return <div>Error: No employee record found for this user.</div>;
}

const PageWrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const MotionDiv = motion.div as any;
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {children}
    </MotionDiv>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />

        {/* Public Onboarding Route */}
        <Route path="/new-organization" element={<PageWrapper><NewOrganization /></PageWrapper>} />

        {/* Special Employee Route */}
        <Route path="/my-profile" element={<ProtectedRoute><MyProfileRedirect /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><PageWrapper><Dashboard /></PageWrapper></ProtectedRoute>} />
        <Route path="/manage/employee" element={<ProtectedRoute><PageWrapper><EmployeeList /></PageWrapper></ProtectedRoute>} />
        <Route path="/manage/employee/new" element={<ProtectedRoute><PageWrapper><NewEmployee /></PageWrapper></ProtectedRoute>} />

        {/* Shared Route (Admin sees all, Employee sees self via protection logic) */}
        <Route path="/manage/employee/:id" element={<ProtectedRoute><PageWrapper><EmployeeDetail /></PageWrapper></ProtectedRoute>} />

        {/* Schedule & Leave Management Routes */}
        <Route path="/manage/schedule" element={<ProtectedRoute><PageWrapper><EmployeeSchedule /></PageWrapper></ProtectedRoute>} />
        <Route path="/manage/schedule/:id" element={<ProtectedRoute><PageWrapper><EmployeeScheduleDetail /></PageWrapper></ProtectedRoute>} />
        <Route path="/manage/leave-balances" element={<ProtectedRoute><PageWrapper><EmployeeLeaveBalances /></PageWrapper></ProtectedRoute>} />
        <Route path="/manage/leave-balances/:id" element={<ProtectedRoute><PageWrapper><EmployeeLeaveBalanceDetail /></PageWrapper></ProtectedRoute>} />
        <Route path="/manage/leave-request/:id" element={<ProtectedRoute><PageWrapper><EmployeeLeaveDetail /></PageWrapper></ProtectedRoute>} />

        <Route path="/manage/payroll" element={<ProtectedRoute><PageWrapper><PayrollManagement /></PageWrapper></ProtectedRoute>} />
        <Route path="/manage/payroll/batch" element={<ProtectedRoute><PageWrapper><BatchPayrollPage /></PageWrapper></ProtectedRoute>} />
        <Route path="/manage/payroll/:id" element={<ProtectedRoute><PageWrapper><PayrollDetail /></PageWrapper></ProtectedRoute>} />

        <Route path="/manage/pay-schedule" element={<ProtectedRoute><PageWrapper><PaySchedulePage /></PageWrapper></ProtectedRoute>} />
        <Route path="/manage/pay-structure" element={<ProtectedRoute><PageWrapper><PayStructure /></PageWrapper></ProtectedRoute>} />
        <Route path="/monitor/audit-logs" element={<ProtectedRoute><PageWrapper><AuditLogsPage /></PageWrapper></ProtectedRoute>} />
        <Route path="/monitor/approvals" element={<ProtectedRoute><PageWrapper><ApprovalList /></PageWrapper></ProtectedRoute>} />
        <Route path="/monitor/approvals/:id" element={<ProtectedRoute><PageWrapper><ApprovalDetail /></PageWrapper></ProtectedRoute>} />
        <Route path="/monitor/notifications" element={<ProtectedRoute><PageWrapper><NotificationCenter /></PageWrapper></ProtectedRoute>} />
        <Route path="/monitor/notifications/:id" element={<ProtectedRoute><PageWrapper><NotificationDetail /></PageWrapper></ProtectedRoute>} />

        {/* Attendance Routes */}
        <Route path="/monitor/attendance" element={<ProtectedRoute><PageWrapper><AttendanceMonitor /></PageWrapper></ProtectedRoute>} />
        <Route path="/monitor/attendance/overtime/:id" element={<ProtectedRoute><PageWrapper><OvertimeDetail /></PageWrapper></ProtectedRoute>} />
        <Route path="/monitor/attendance/dtr/:id" element={<ProtectedRoute><PageWrapper><TimekeepingDetail /></PageWrapper></ProtectedRoute>} />

        <Route path="/monitor/reports" element={<ProtectedRoute><PageWrapper><ReportsPage /></PageWrapper></ProtectedRoute>} />
        <Route path="/monitor/reports/:id" element={<ProtectedRoute><PageWrapper><ReportDetail /></PageWrapper></ProtectedRoute>} />

        {/* Settings Routes */}
        <Route path="/settings/overview" element={<ProtectedRoute><PageWrapper><SettingsOverview /></PageWrapper></ProtectedRoute>} />
        <Route path="/settings/roles" element={<ProtectedRoute><PageWrapper><RoleManagement /></PageWrapper></ProtectedRoute>} />
        <Route path="/settings/users" element={<ProtectedRoute><PageWrapper><UserManagement /></PageWrapper></ProtectedRoute>} />
        <Route path="/settings/permissions" element={<ProtectedRoute><PageWrapper><PermissionsPage /></PageWrapper></ProtectedRoute>} />
        <Route path="/settings/ranks" element={<ProtectedRoute><PageWrapper><RankSettingsPage /></PageWrapper></ProtectedRoute>} />
        <Route path="/settings/salary-grade" element={<ProtectedRoute><PageWrapper><SalaryGradeSettings /></PageWrapper></ProtectedRoute>} />
        <Route path="/settings/structure" element={<ProtectedRoute><PageWrapper><OrgStructurePage /></PageWrapper></ProtectedRoute>} />
        <Route path="/settings/approvals" element={<ProtectedRoute><PageWrapper><ApprovalSetupPage /></PageWrapper></ProtectedRoute>} />
        <Route path="/settings/audit" element={<ProtectedRoute><PageWrapper><AuditLogSettings /></PageWrapper></ProtectedRoute>} />
        <Route path="/settings/shift" element={<ProtectedRoute><PageWrapper><ShiftManagement /></PageWrapper></ProtectedRoute>} />
        <Route path="/settings/leave" element={<ProtectedRoute><PageWrapper><LeaveManagement /></PageWrapper></ProtectedRoute>} />
        <Route path="/settings/holiday" element={<ProtectedRoute><PageWrapper><HolidayManagement /></PageWrapper></ProtectedRoute>} />
        <Route path="/settings/policies" element={<ProtectedRoute><PageWrapper><PoliciesPage /></PageWrapper></ProtectedRoute>} />
        <Route path="/settings/employee-fields" element={<ProtectedRoute><PageWrapper><EmployeeFieldsSetup /></PageWrapper></ProtectedRoute>} />
        <Route path="/settings/notifications" element={<ProtectedRoute><PageWrapper><NotificationSettings /></PageWrapper></ProtectedRoute>} />
        <Route path="/settings/adjustments" element={<ProtectedRoute><PageWrapper><AdjustmentSetup /></PageWrapper></ProtectedRoute>} />
        <Route path="*" element={<PageWrapper><div className="p-8 text-gray-500">Page under development</div></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <RequestProvider>
        <HashRouter>
          <Layout>
            <AnimatedRoutes />
          </Layout>
        </HashRouter>
      </RequestProvider>
    </AuthProvider>
  );
};

export default App;
