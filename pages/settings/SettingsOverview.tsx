
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Users, 
  Wallet, 
  Clock, 
  FileCheck, 
  Building2, 
  BellRing, 
  History, 
  Briefcase, 
  Lock,
  UserCog,
  Calendar,
  ClipboardList,
  Sliders
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const SettingsOverview: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role || 'Employee';

  const settingsModules = [
    {
      title: 'Organization Structure',
      description: 'Define company hierarchy, departments, and positions.',
      icon: <Building2 size={24} />,
      path: '/settings/structure',
      color: 'bg-blue-50 text-blue-600',
      roles: ['Superadmin', 'HR Admin', 'HR Recruiter']
    },
    {
      title: 'Employee Fields',
      description: 'Customize the data fields captured in employee profiles.',
      icon: <ClipboardList size={24} />,
      path: '/settings/employee-fields',
      color: 'bg-indigo-50 text-indigo-600',
      roles: ['Superadmin', 'HR Admin']
    },
    {
      title: 'Role Management',
      description: 'Configure access levels and permission groups.',
      icon: <ShieldCheck size={24} />,
      path: '/settings/roles',
      color: 'bg-rose-50 text-rose-600',
      roles: ['Superadmin']
    },
    {
      title: 'Permission Protocols',
      description: 'Set granular view, edit, and delete rights.',
      icon: <Lock size={24} />,
      path: '/settings/permissions',
      color: 'bg-rose-50 text-rose-600',
      roles: ['Superadmin']
    },
    {
      title: 'User Management',
      description: 'Manage system logins, passwords, and MFA.',
      icon: <UserCog size={24} />,
      path: '/settings/users',
      color: 'bg-slate-50 text-slate-600',
      roles: ['Superadmin', 'HR Admin']
    },
    {
      title: 'Payroll Structure',
      description: 'Manage salary grades, components, and tax tables.',
      icon: <Wallet size={24} />,
      path: '/manage/pay-structure',
      color: 'bg-emerald-50 text-emerald-600',
      roles: ['Superadmin', 'HR Admin', 'HR Payroll Personnel']
    },
    {
      title: 'Salary Grades',
      description: 'Define standardized pay bands and steps.',
      icon: <Briefcase size={24} />,
      path: '/settings/salary-grade',
      color: 'bg-emerald-50 text-emerald-600',
      roles: ['Superadmin', 'HR Admin', 'HR Payroll Personnel']
    },
    {
      title: 'Adjustment Types',
      description: 'Configure types for one-time pay adjustments.',
      icon: <Sliders size={24} />,
      path: '/settings/adjustments',
      color: 'bg-emerald-50 text-emerald-600',
      roles: ['Superadmin', 'HR Admin', 'HR Payroll Personnel']
    },
    {
      title: 'Ranks & Levels',
      description: 'Configure job levels and hierarchy ranking.',
      icon: <Users size={24} />,
      path: '/settings/ranks',
      color: 'bg-emerald-50 text-emerald-600',
      roles: ['Superadmin', 'HR Admin', 'HR Payroll Personnel']
    },
    {
      title: 'Shift Management',
      description: 'Create work schedules and time policies.',
      icon: <Clock size={24} />,
      path: '/settings/shift',
      color: 'bg-amber-50 text-amber-600',
      roles: ['Superadmin', 'HR Admin', 'HR Attendance Personnel']
    },
    {
      title: 'Leave Policies',
      description: 'Configure leave types, credits, and accruals.',
      icon: <Calendar size={24} />,
      path: '/settings/leave',
      color: 'bg-amber-50 text-amber-600',
      roles: ['Superadmin', 'HR Admin', 'HR Attendance Personnel']
    },
    {
      title: 'Approval Workflows',
      description: 'Set up reviewer chains for requests.',
      icon: <FileCheck size={24} />,
      path: '/settings/approvals',
      color: 'bg-purple-50 text-purple-600',
      roles: ['Superadmin', 'HR Admin']
    },
    {
      title: 'Notifications',
      description: 'Configure system alerts and email triggers.',
      icon: <BellRing size={24} />,
      path: '/settings/notifications',
      color: 'bg-cyan-50 text-cyan-600',
      roles: ['Superadmin', 'HR Admin']
    },
    {
      title: 'Audit Logs',
      description: 'View system security logs and history.',
      icon: <History size={24} />,
      path: '/settings/audit',
      color: 'bg-slate-50 text-slate-600',
      roles: ['Superadmin']
    }
  ];

  const allowedModules = settingsModules.filter(mod => mod.roles.includes(role));

  return (
    <div className="space-y-8 pb-20 animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            System Configuration
            <SettingsIcon size={24} className="text-indigo-600" />
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage global settings, policies, and system behavior.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {allowedModules.map((mod, idx) => (
          <motion.div
            key={mod.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => navigate(mod.path)}
            className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-indigo-200 transition-all cursor-pointer group flex flex-col h-full"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl transition-transform group-hover:scale-110 ${mod.color}`}>
                {mod.icon}
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-700 transition-colors mb-2">{mod.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{mod.description}</p>
          </motion.div>
        ))}
      </div>
      
      {allowedModules.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 border-dashed">
              <ShieldCheck className="mx-auto h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-900">Access Restricted</h3>
              <p className="text-slate-500">You do not have permission to access system configurations.</p>
          </div>
      )}
    </div>
  );
};

// Simple internal icon to avoid import issues
const SettingsIcon = ({ size, className }: { size: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

export default SettingsOverview;
