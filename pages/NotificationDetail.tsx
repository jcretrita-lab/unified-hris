
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
  MailOpen
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
  'n1': {
    id: 'n1',
    type: 'Success',
    category: 'Payroll',
    title: 'Payslip Generated: Aug 01 - Aug 15',
    timestamp: 'August 16, 2025 • 9:00 AM',
    sender: { name: 'Payroll System', role: 'Automated', isSystem: true },
    body: (
      <div className="space-y-4">
        <p className="text-slate-600 leading-relaxed">
          Your payslip for the payroll period <strong>August 1 to August 15, 2025</strong> has been successfully generated and is now available for viewing.
        </p>
        <p className="text-slate-600 leading-relaxed">
          The net pay amount of <strong className="text-emerald-600">₱16,430.00</strong> will be credited to your registered bank account on <strong>August 15, 2025</strong>.
        </p>
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 italic">
          Note: If you have any disputes regarding your attendance or deductions, please file a dispute ticket within 3 days of receiving this notification.
        </div>
      </div>
    ),
    actionLink: { label: 'View Payslip Details', url: '/manage/payroll/pay-001' },
    metadata: [
        { label: 'Reference', value: 'PAY-2025-08-A' },
        { label: 'Cycle', value: 'Semi-Monthly' }
    ]
  },
  'n2': {
    id: 'n2',
    type: 'Success',
    category: 'Timekeeping',
    title: 'Leave Request Approved',
    timestamp: 'August 14, 2025 • 2:30 PM',
    sender: { name: 'Alex Thompson', role: 'HR Manager', avatar: 'AT', isSystem: false },
    body: (
      <div className="space-y-4">
        <p className="text-slate-600 leading-relaxed">
          Good news! Your vacation leave request has been approved by your manager.
        </p>
        <ul className="list-disc list-inside text-slate-600 space-y-1 ml-2">
            <li><strong>Type:</strong> Vacation Leave</li>
            <li><strong>Dates:</strong> Sep 20 - Sep 22, 2025</li>
            <li><strong>Duration:</strong> 3 Days</li>
        </ul>
        <p className="text-slate-600 leading-relaxed">
            Your leave credits have been deducted accordingly. Enjoy your time off!
        </p>
      </div>
    ),
    actionLink: { label: 'View Request Status', url: '/manage/leave-request/lr-55' }
  },
  'n3': {
    id: 'n3',
    type: 'Warning',
    category: 'Timekeeping',
    title: 'Action Required: Pending Overtime Approval',
    timestamp: 'August 13, 2025 • 4:30 PM',
    sender: { name: 'Timekeeping Bot', role: 'Automated', isSystem: true },
    body: (
      <div className="space-y-4">
        <p className="text-slate-600 leading-relaxed">
          James Cordon has submitted an overtime request that has been pending for <strong>24 hours</strong>. 
          Please review and take action to ensure accurate payroll processing.
        </p>
        <div className="flex items-center gap-4 p-4 bg-amber-50 border border-amber-100 rounded-xl">
             <div className="flex-1">
                 <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">Request Details</p>
                 <p className="text-sm font-bold text-slate-800 mt-1">3.5 Hours • Aug 04, 2025</p>
                 <p className="text-xs text-slate-500 italic">"Urgent Bug Fixes"</p>
             </div>
        </div>
      </div>
    ),
    actionLink: { label: 'Review Request', url: '/monitor/attendance/overtime/ot-1' }
  },
  'n4': {
    id: 'n4',
    type: 'Info',
    category: 'System',
    title: 'Scheduled System Maintenance',
    timestamp: 'August 10, 2025 • 10:00 AM',
    sender: { name: 'IT Support', role: 'System Admin', isSystem: true },
    body: (
      <div className="space-y-4">
        <p className="text-slate-600 leading-relaxed">
          Please be advised that the HRIS platform will undergo scheduled maintenance to upgrade our server infrastructure.
        </p>
        <p className="text-slate-600 leading-relaxed">
          <strong>Schedule:</strong> Saturday, Aug 30 from 10:00 PM to 12:00 AM.
        </p>
        <p className="text-slate-600 leading-relaxed">
          During this time, the system will be inaccessible. Offline biometric logs will be synced automatically once the connection is restored.
        </p>
      </div>
    )
  },
  'n5': {
    id: 'n5',
    type: 'Error',
    category: 'Timekeeping',
    title: 'Attendance Discrepancy Detected',
    timestamp: 'August 23, 2025 • 6:00 PM',
    sender: { name: 'Attendance Watchdog', role: 'Automated', isSystem: true },
    body: (
      <div className="space-y-4">
        <p className="text-slate-600 leading-relaxed">
          Our system detected a missing <strong>Time-Out</strong> record for today, August 23, 2025.
        </p>
        <p className="text-slate-600 leading-relaxed">
          If you forgot to clock out, please file an <strong>Official Daily Time Record (ODTR) Correction</strong> request immediately to avoid being marked as "Undertime" or "Half-day".
        </p>
      </div>
    ),
    actionLink: { label: 'File Correction', url: '/monitor/attendance' }
  }
};

const NotificationDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isArchived, setIsArchived] = useState(false);

  // Fallback if ID not found (simulate generic)
  const data = (id && MOCK_DETAILS[id]) ? MOCK_DETAILS[id] : MOCK_DETAILS['n1'];

  const getTypeStyles = (type: NotificationType) => {
    switch(type) {
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
