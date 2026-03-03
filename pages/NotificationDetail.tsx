
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  Info,
  XCircle,
  User,
  Shield,
  Briefcase,
  ExternalLink,
  Archive,
  Trash2,
  MailOpen,
  TrendingUp,
  ShieldAlert,
  Calendar,
  CalendarCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- Types ---
type NotificationType = 'Info' | 'Success' | 'Warning' | 'Error';

interface NotificationDetailData {
  id: string;
  type: NotificationType;
  category: 'System' | 'Payroll' | 'Timekeeping' | 'HR Core';
  title: string;
  body: React.ReactNode; // Can be string or JSX
  timestamp: string;
  sender: {
    name: string;
    role: string;
    avatar?: string;
    isSystem: boolean;
  };
  actionLink?: {
    label: string;
    url: string;
  };
  metadata?: {
    label: string;
    value: string;
  }[];
}

// --- Mock Data ---
const MOCK_DETAILS: Record<string, NotificationDetailData> = {
  'n0': {
    id: 'n0',
    type: 'Warning',
    category: 'HR Core',
    title: 'Probationary Period Alert: 5th Month Reached',
    timestamp: 'Today • 9:00 AM',
    sender: { name: 'HR System', role: 'Automated Compliance', isSystem: true },
    body: (
      <div className="space-y-6">
        <p className="text-slate-600 leading-relaxed">
          The following <strong>12 employees</strong> have officially entered their <strong>5th month of probation</strong> as of today. Per company policy and Labor Code standards, a performance evaluation must be completed before the end of the 6th month to determine regularization status.
        </p>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider">Employee</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider">Department</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider">Hire Date</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider">Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { name: 'Marcus Villanueva', dept: 'Engineering', hire: 'Oct 04, 2025', deadline: 'Apr 04, 2026' },
                { name: 'Elena Rossi', dept: 'Marketing', hire: 'Oct 04, 2025', deadline: 'Apr 04, 2026' },
                { name: 'Samuel Kim', dept: 'Operations', hire: 'Oct 10, 2025', deadline: 'Apr 10, 2026' },
                { name: 'Jasmine Wright', dept: 'Product', hire: 'Oct 12, 2025', deadline: 'Apr 12, 2026' },
              ].map((emp, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-900">{emp.name}</td>
                  <td className="px-4 py-3 text-slate-600">{emp.dept}</td>
                  <td className="px-4 py-3 text-slate-600">{emp.hire}</td>
                  <td className="px-4 py-3 text-amber-600 font-bold">{emp.deadline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
          <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-800 leading-relaxed">
            <strong>Next Steps:</strong> Coordinate with Department Heads to initiate the "Regularization Review" workflow. Ensure evaluation forms are uploaded by the deadline.
          </div>
        </div>
      </div>
    ),
    actionLink: { label: 'Start Evaluation Workflow', url: '/manage/employees' },
    metadata: [
      { label: 'Priority', value: 'High' },
      { label: 'Policy Ref', value: 'HR-REG-001' }
    ]
  },
  'hr-1': {
    id: 'hr-1',
    type: 'Success',
    category: 'HR Core',
    title: 'New Hire: Isabella Stewart',
    timestamp: '2 hours ago',
    sender: { name: 'HR Recruiter', role: 'Talent Acquisition', isSystem: false, avatar: 'IS' },
    body: (
      <div className="space-y-6">
        <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-indigo-200">IS</div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Isabella Stewart</h3>
            <p className="text-sm font-medium text-indigo-600">Senior Frontend Developer</p>
            <p className="text-xs text-slate-500 mt-1">Engineering • Full-time • Remote</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border border-slate-100 rounded-xl bg-white">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Onboarding Status</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[25%]"></div>
              </div>
              <span className="text-xs font-bold text-slate-700">25%</span>
            </div>
          </div>
          <div className="p-4 border border-slate-100 rounded-xl bg-white text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Start Date</p>
            <p className="text-sm font-bold text-slate-900">Sep 01, 2025</p>
          </div>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          Isabella Stewart has successfully completed the pre-employment requirements. Please ensure her workstation and system credentials are ready by next Monday.
        </p>
      </div>
    ),
    actionLink: { label: 'View Employee Profile', url: '/manage/employee' },
    metadata: [
      { label: 'Onboarding ID', value: 'OB-2025-442' },
      { label: 'Referral', value: 'Internal - Alex T.' }
    ]
  },
  'ta-1': {
    id: 'ta-1',
    type: 'Warning',
    category: 'Timekeeping',
    title: 'Leave Request Received: Michael Bay',
    timestamp: '3 hours ago',
    sender: { name: 'Michael Bay', role: 'UI/UX Designer', isSystem: false, avatar: 'MB' },
    body: (
      <div className="space-y-6">
        <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100">
          <div className="flex justify-between items-start mb-4">
            <span className="px-3 py-1 bg-white rounded-lg text-amber-700 text-xs font-bold border border-amber-200 shadow-sm italic">Vacation Leave</span>
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Pending Approval</span>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-[10px] font-bold text-amber-900/40 uppercase tracking-widest mb-1">Duration</p>
              <p className="text-2xl font-black text-amber-900">3.0 <span className="text-sm font-bold">Days</span></p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-amber-900/40 uppercase tracking-widest mb-1">Balance Remaining</p>
              <p className="text-lg font-bold text-amber-900">12.5 Days</p>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-4 bg-white/50 p-3 rounded-xl border border-amber-200/50">
            <Calendar className="text-amber-600" size={16} />
            <div className="text-sm font-bold text-amber-900">Aug 28, 2025 — Aug 30, 2025</div>
          </div>
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Reason for Leave</h4>
          <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 italic">
            "Family outing to Tagaytay. Will be offline for the duration of the trip."
          </p>
        </div>
      </div>
    ),
    actionLink: { label: 'Review & Respond', url: '/monitor/approvals' },
    metadata: [
      { label: 'Request ID', value: 'LR-2025-098' },
      { label: 'Sub-Category', value: 'Personal' }
    ]
  },
  'pay-4': {
    id: 'pay-4',
    type: 'Error',
    category: 'Payroll',
    title: 'CRITICAL: Payroll Processing Failed',
    timestamp: '5 hours ago',
    sender: { name: 'Payroll Engine', role: 'System Service', isSystem: true },
    body: (
      <div className="space-y-6">
        <div className="p-6 bg-rose-50 rounded-2xl border border-rose-100">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="text-rose-600" size={24} />
            <h3 className="text-lg font-bold text-rose-900">Bank Transfer Error - Group A</h3>
          </div>
          <p className="text-xs text-rose-800 leading-relaxed">
            The disbursement for 45 employees was rejected by the bank API due to a <strong>checksum mismatch</strong>.
          </p>
        </div>
        <div className="bg-slate-900 rounded-xl p-4 font-mono text-[11px] text-emerald-400 border-l-4 border-rose-500 overflow-x-auto">
          <p>ERROR 502: Bad Gateway</p>
          <p>PATH: /api/v2/disburse/BPI-001</p>
          <p>MSG: Batch ID (BT-9922-A) failed validation. Checksum expected: 0x9B1.. found: 0x8A2..</p>
        </div>
      </div>
    ),
    actionLink: { label: 'Go to Payroll Console', url: '/manage/payroll' },
    metadata: [
      { label: 'Batch ID', value: 'BT-9922-A' },
      { label: 'Affected', value: '45 Employees' }
    ]
  },
  'sys-1': {
    id: 'sys-1',
    type: 'Error',
    category: 'System',
    title: 'Security Alert: Failed Login Attempts',
    timestamp: 'Yesterday',
    sender: { name: 'Guardian AI', role: 'Security Ops', isSystem: true },
    body: (
      <div className="space-y-6">
        <div className="flex items-center gap-4 p-5 bg-rose-50 border border-rose-100 rounded-2xl">
          <ShieldAlert className="text-rose-600" size={32} />
          <div>
            <h4 className="font-bold text-rose-900">Potential Brute-force Detected</h4>
            <p className="text-xs text-rose-700">Account: <strong>admin_ryuji@unified-hr.com</strong></p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border border-slate-100 rounded-xl bg-white text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Source IP</p>
            <p className="text-sm font-black text-slate-900">192.168.1.102</p>
          </div>
          <div className="p-4 border border-slate-100 rounded-xl bg-white text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Location</p>
            <p className="text-sm font-bold text-slate-900">Quezon City, PH</p>
          </div>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          The account has been <strong>temporarily locked</strong> for 30 minutes following 10 consecutive failed login attempts.
        </p>
      </div>
    ),
    actionLink: { label: 'Review Security Logs', url: '/settings/security' },
    metadata: [
      { label: 'Severity', value: 'Critical' },
      { label: 'Status', value: 'Account Locked' }
    ]
  },
  'pay-5': {
    id: 'pay-5',
    type: 'Info',
    category: 'Payroll',
    title: 'Salary Updated: Performance Merit',
    timestamp: 'Aug 24, 2025',
    sender: { name: 'HR Admin', role: 'Compensation Dept', isSystem: false, avatar: 'HR' },
    body: (
      <div className="space-y-6">
        <p className="text-slate-600 text-sm italic">
          Congratulations! Based on your Q3 performance review, a merit increase has been approved for your role.
        </p>
        <div className="grid grid-cols-3 items-center gap-4 border border-slate-100 rounded-2xl p-6 bg-slate-50 shadow-inner">
          <div className="text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Previous</p>
            <p className="text-lg font-bold text-slate-500 line-through">₱45,000</p>
          </div>
          <div className="flex justify-center text-indigo-400">
            <TrendingUp size={24} />
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">New Salary</p>
            <p className="text-2xl font-black text-indigo-600">₱49,500</p>
          </div>
        </div>
        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
          <p className="text-xs text-indigo-800 leading-relaxed">
            <strong>Effectivity:</strong> September 01, 2025. This change will be reflected in your first payroll for September.
          </p>
        </div>
      </div>
    ),
    actionLink: { label: 'View Pay Structure', url: '/manage/payroll' },
    metadata: [
      { label: 'Change Type', value: 'Performance Increase' },
      { label: 'Approved By', value: 'Director S. G.' }
    ]
  },
  'ta-11': {
    id: 'ta-11',
    type: 'Error',
    category: 'Timekeeping',
    title: 'Absence Alert: David Miller',
    timestamp: 'Aug 23, 2025',
    sender: { name: 'Attendance Watchdog', role: 'Automated Monitoring', isSystem: true },
    body: (
      <div className="space-y-6">
        <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <CalendarCheck className="text-rose-600" size={24} />
            <h3 className="text-lg font-bold text-rose-900">Unexplained Absence</h3>
          </div>
          <p className="text-xs text-rose-800 leading-relaxed">
            Employee <strong>David Miller</strong> (Operations) failed to log in for his scheduled shift on <strong>August 23, 2025</strong>. No leave request was found.
          </p>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed italic border-l-4 border-slate-200 pl-4 py-2">
          Action required: Contact the supervisor to confirm status.
        </p>
      </div>
    ),
    actionLink: { label: 'View Attendance Records', url: '/monitor/attendance' },
    metadata: [
      { label: 'Employee ID', value: 'EMP-009' }
    ]
  }
};

const NotificationDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isArchived, setIsArchived] = useState(false);

  // Fallback if ID not found (simulate generic)
  const data = (id && MOCK_DETAILS[id]) ? MOCK_DETAILS[id] : MOCK_DETAILS['n1'];

  const getTypeStyles = (type: NotificationType) => {
    switch (type) {
      case 'Success': return { bg: 'bg-emerald-50', border: 'border-emerald-100', icon: <CheckCircle2 className="text-emerald-600" size={24} />, text: 'text-emerald-800' };
      case 'Warning': return { bg: 'bg-amber-50', border: 'border-amber-100', icon: <AlertCircle className="text-amber-600" size={24} />, text: 'text-amber-800' };
      case 'Error': return { bg: 'bg-rose-50', border: 'border-rose-100', icon: <XCircle className="text-rose-600" size={24} />, text: 'text-rose-800' };
      default: return { bg: 'bg-blue-50', border: 'border-blue-100', icon: <Info className="text-blue-600" size={24} />, text: 'text-blue-800' };
    }
  };

  const style = getTypeStyles(data.type);

  const handleArchive = () => {
    setIsArchived(true);
    setTimeout(() => navigate('/monitor/notifications'), 800);
  };

  if (isArchived) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-slate-400">
        <Archive size={48} className="mb-4 text-slate-300" />
        <p className="font-bold">Notification Archived</p>
        <button onClick={() => navigate('/monitor/notifications')} className="mt-4 text-indigo-600 hover:underline text-sm font-bold">Return to list</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/monitor/notifications')}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors group bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Notifications
        </button>
        <div className="flex gap-2">
          <button
            onClick={handleArchive}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all shadow-sm"
          >
            <Archive size={16} /> Archive
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-50 hover:border-rose-200 transition-all shadow-sm">
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">

        {/* Left Column: Context / Metadata */}
        <div className="w-full md:w-80 bg-slate-50/50 border-r border-slate-100 p-8 flex flex-col gap-8">

          {/* Status Card */}
          <div className={`p-6 rounded-2xl border ${style.bg} ${style.border} flex flex-col items-center text-center gap-3`}>
            <div className="p-3 bg-white rounded-full shadow-sm">
              {style.icon}
            </div>
            <div>
              <h2 className={`text-lg font-bold ${style.text}`}>{data.type}</h2>
              <p className="text-xs font-medium opacity-80 uppercase tracking-wider">{data.category} Alert</p>
            </div>
          </div>

          {/* Sender Info */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">From</h4>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow-sm ${data.sender.isSystem ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-600'}`}>
                {data.sender.isSystem ? <Shield size={16} /> : (data.sender.avatar || <User size={16} />)}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{data.sender.name}</p>
                <p className="text-xs text-slate-500 font-medium">{data.sender.role}</p>
              </div>
            </div>
          </div>

          {/* Metadata List */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Details</h4>

            <div className="flex items-start gap-3">
              <Clock size={16} className="text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-700">Received</p>
                <p className="text-xs text-slate-500">{data.timestamp}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Briefcase size={16} className="text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-700">Module</p>
                <p className="text-xs text-slate-500">{data.category}</p>
              </div>
            </div>

            {data.metadata && data.metadata.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <Info size={16} className="text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-700">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Content Body */}
        <div className="flex-1 p-10 flex flex-col">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-6">
              <MailOpen size={18} className="text-indigo-500" />
              <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Message Contents</span>
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900 mb-8 leading-tight">{data.title}</h1>

            <div className="prose prose-slate max-w-none text-sm">
              {data.body}
            </div>
          </div>

          {data.actionLink && (
            <div className="mt-12 pt-8 border-t border-slate-100">
              <button
                onClick={() => navigate(data.actionLink!.url)}
                className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95 group"
              >
                {data.actionLink.label}
                <ExternalLink size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default NotificationDetail;
