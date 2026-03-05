
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
                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-right">Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { name: 'Marcus Villanueva', dept: 'Engineering', status: 'Regular', deadline: 'Apr 04, 2026', badge: 'bg-emerald-50 text-emerald-600' },
                { name: 'Elena Rossi', dept: 'Marketing', status: 'Extended (Mutual)', deadline: 'May 04, 2026', badge: 'bg-indigo-50 text-indigo-600', note: 'Performance Review Extension' },
                { name: 'Samuel Kim', dept: 'Operations', status: 'Regular', deadline: 'Apr 10, 2026', badge: 'bg-emerald-50 text-emerald-600' },
                { name: 'Maria Santos', dept: 'Finance', status: 'Extended (Maternity)', deadline: 'Jul 15, 2026', badge: 'bg-amber-50 text-amber-600', note: 'RA 11210 Tolling Applied' },
                { name: 'Jasmine Wright', dept: 'Product', hire: 'Oct 12, 2025', deadline: 'Apr 12, 2026', status: 'Regular', badge: 'bg-emerald-50 text-emerald-600' },
              ].map((emp, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-900">{emp.name}</div>
                    {emp.note && <div className="text-[9px] text-slate-400 font-medium italic">{emp.note}</div>}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{emp.dept}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${emp.badge}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-amber-600 font-bold text-right">{emp.deadline}</td>
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
    actionLink: { label: 'File Correction', url: '/monitor/attendance' }
  },
  'n11': {
    id: 'n11',
    type: 'Warning',
    category: 'Timekeeping',
    title: 'Late Attendance: John Doe',
    timestamp: 'August 28, 2025 • 9:45 AM',
    sender: { name: 'Timekeeping Bot', role: 'Automated', isSystem: true },
    body: (
      <div className="space-y-4">
        <p className="text-slate-600 leading-relaxed">
          <strong>John Doe</strong> was detected as late on <strong>August 28, 2025</strong>.
        </p>
        <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">Scheduled Time</p>
              <p className="text-sm font-bold text-slate-800">9:00 AM</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">Actual Time</p>
              <p className="text-sm font-bold text-slate-800">9:45 AM</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">Late By</p>
              <p className="text-sm font-bold text-rose-600">45 minutes</p>
            </div>
          </div>
        </div>
        <p className="text-slate-600 leading-relaxed">
          Department: <strong>IT Department</strong>
        </p>
      </div>
    ),
    actionLink: { label: 'View Attendance Record', url: '/monitor/attendance' },
    metadata: [
      { label: 'Date', value: 'Aug 28, 2025' },
      { label: 'Department', value: 'IT Department' }
    ]
  },
  'n12': {
    id: 'n12',
    type: 'Info',
    category: 'Payroll',
    title: 'Salary Updated',
    timestamp: 'August 28, 2025 • 10:00 AM',
    sender: { name: 'Payroll System', role: 'Automated', isSystem: true },
    body: (
      <div className="space-y-4">
        <p className="text-slate-600 leading-relaxed">
          Your base salary has been updated effective <strong>September 01, 2025</strong>.
        </p>
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Previous Salary</p>
              <p className="text-sm font-bold text-slate-800">₱ 35,000.00</p>
            </div>
            <div className="text-2xl text-slate-300">→</div>
            <div className="text-right">
              <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide">New Salary</p>
              <p className="text-sm font-bold text-emerald-600">₱ 45,000.00</p>
            </div>
          </div>
        </div>
        <p className="text-slate-600 leading-relaxed">
          Please contact HR if you have any questions regarding this update.
        </p>
      </div>
    ),
    actionLink: { label: 'View Pay Structure', url: '/manage/payroll' },
    metadata: [
      { label: 'Effective Date', value: 'Sep 01, 2025' },
      { label: 'Adjustment Type', value: 'Salary Increase' }
    ]
  },
  'n13': {
    id: 'n13',
    type: 'Error',
    category: 'Payroll',
    title: 'Bank Details Required',
    timestamp: 'August 28, 2025 • 10:30 AM',
    sender: { name: 'Payroll System', role: 'Automated', isSystem: true },
    body: (
      <div className="space-y-4">
        <p className="text-slate-600 leading-relaxed">
          Your bank details are missing from the system. Please update your bank information to ensure timely salary disbursement.
        </p>
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl">
          <p className="text-sm font-bold text-rose-800">
            ⚠️ Action Required
          </p>
          <p className="text-xs text-rose-700 mt-1">
            Without valid bank details, your salary cannot be credited to your account.
          </p>
        </div>
        <p className="text-slate-600 leading-relaxed">
          Please update your bank information in your employee profile as soon as possible to avoid delays in your salary payment.
        </p>
      </div>
    ),
    actionLink: { label: 'Update Bank Details', url: '/manage/employee' },
    metadata: [
      { label: 'Required By', value: 'Sep 01, 2025 (Payroll Date)' },
      { label: 'Status', value: 'Missing' }
    ]
  },
  'n6': {
    id: 'n6',
    type: 'Success',
    category: 'HR Core',
    title: 'Profile Update Approved',
    timestamp: 'August 28, 2025 • 10:15 AM',
    sender: { name: 'Alex Thompson', role: 'HR Manager', avatar: 'AT', isSystem: false },
    body: (
      <div className="space-y-4">
        <p className="text-slate-600 leading-relaxed">
          Good news! Your profile update request has been approved by <strong>Alex Thompson</strong>.
        </p>
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
          <p className="text-sm font-bold text-emerald-800">Changes Approved:</p>
          <ul className="text-xs text-slate-600 mt-2 space-y-1">
            <li>• Phone Number: Updated</li>
            <li>• Address: Updated</li>
            <li>• Emergency Contact: Updated</li>
          </ul>
        </div>
        <p className="text-slate-600 leading-relaxed">
          Your profile has been updated with the new information. Thank you!
        </p>
      </div>
    ),
    actionLink: { label: 'View Profile', url: '/my-profile' }
  },
  'n7': {
    id: 'n7',
    type: 'Warning',
    category: 'HR Core',
    title: 'Probation Ending Soon',
    timestamp: 'August 26, 2025 • 9:00 AM',
    sender: { name: 'HR System', role: 'Automated', isSystem: true },
    body: (
      <div className="space-y-4">
        <p className="text-slate-600 leading-relaxed">
          Your probation period will end on <strong>September 30, 2025</strong>. Please prepare for your evaluation.
        </p>
        <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">Start Date</p>
              <p className="text-sm font-bold text-slate-800">July 01, 2025</p>
            </div>
            <div className="text-2xl text-slate-300">→</div>
            <div className="text-right">
              <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">End Date</p>
              <p className="text-sm font-bold text-amber-600">Sep 30, 2025</p>
            </div>
          </div>
        </div>
        <p className="text-slate-600 leading-relaxed">
          Please coordinate with your manager regarding your performance evaluation and any required documents.
        </p>
      </div>
    ),
    actionLink: { label: 'View Evaluation Details', url: '/my-profile/evaluations' },
    metadata: [
      { label: 'Days Remaining', value: '33 days' },
      { label: 'Department', value: 'IT Department' }
    ]
  },
  'n8': {
    id: 'n8',
    type: 'Warning',
    category: 'System',
    title: 'Suspicious Login Attempt',
    timestamp: 'August 27, 2025 • 2:30 PM',
    sender: { name: 'Security Watchdog', role: 'Automated', isSystem: true },
    body: (
      <div className="space-y-4">
        <p className="text-slate-600 leading-relaxed">
          We detected a suspicious login attempt on your account from <strong>Quezon City, Philippines</strong>.
        </p>
        <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
          <p className="text-sm font-bold text-amber-800">Suspicious Activity Details:</p>
          <ul className="text-xs text-slate-600 mt-2 space-y-1">
            <li>• Location: Quezon City, Philippines</li>
            <li>• IP Address: 203.XXX.XXX.XXX</li>
            <li>• Device: Unknown Device</li>
            <li>• Time: August 27, 2025 2:30 PM</li>
          </ul>
        </div>
        <p className="text-slate-600 leading-relaxed">
          If this was you, you can ignore this notification. If you did not attempt to log in, please secure your account immediately by changing your password.
        </p>
      </div>
    ),
    actionLink: { label: 'Review Activity Logs', url: '/monitor/audit-logs' },
    metadata: [
      { label: 'Risk Level', value: 'Medium' },
      { label: 'Status', value: 'Flagged' }
    ]
  },
  'n9': {
    id: 'n9',
    type: 'Info',
    category: 'System',
    title: 'New Device Login',
    timestamp: 'August 26, 2025 • 8:45 PM',
    sender: { name: 'Security Watchdog', role: 'Automated', isSystem: true },
    body: (
      <div className="space-y-4">
        <p className="text-slate-600 leading-relaxed">
          Your account was accessed from a new device: <strong>Windows 11 - Chrome</strong>.
        </p>
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
          <p className="text-sm font-bold text-blue-800">Device Information:</p>
          <ul className="text-xs text-slate-600 mt-2 space-y-1">
            <li>• Device: Windows 11 - Chrome</li>
            <li>• Browser: Chrome 115.0</li>
            <li>• Location: Manila, Philippines</li>
            <li>• Time: August 26, 2025 8:45 PM</li>
          </ul>
        </div>
        <p className="text-slate-600 leading-relaxed">
          If this was you, you can ignore this message. If you don't recognize this device, please change your password immediately.
        </p>
      </div>
    ),
    actionLink: { label: 'Manage Devices', url: '/monitor/security/devices' }
  },
  'n10': {
    id: 'n10',
    type: 'Error',
    category: 'System',
    title: 'Multiple Failed Login Attempts',
    timestamp: 'August 26, 2025 • 6:10 PM',
    sender: { name: 'Security Watchdog', role: 'Automated', isSystem: true },
    body: (
      <div className="space-y-4">
        <p className="text-slate-600 leading-relaxed">
          Multiple failed login attempts were detected on your account. This could indicate a brute-force attack attempt.
        </p>
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl">
          <p className="text-sm font-bold text-rose-800">Security Alert:</p>
          <ul className="text-xs text-slate-600 mt-2 space-y-1">
            <li>• Failed Attempts: 5</li>
            <li>• Time Window: August 26, 2025 6:00 PM - 6:10 PM</li>
            <li>• IP Address: 203.XXX.XXX.XXX</li>
            <li>• Location: Unknown</li>
          </ul>
        </div>
        <p className="text-slate-600 leading-relaxed">
          Your account is currently secure. We recommend changing your password to prevent unauthorized access.
        </p>
      </div>
    ),
    actionLink: { label: 'Secure Your Account', url: '/monitor/security' },
    metadata: [
      { label: 'Risk Level', value: 'High' },
      { label: 'Account Status', value: 'Secure' }
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
