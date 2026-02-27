
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Check, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  X,
  FileText,
  Calendar,
  Timer
} from 'lucide-react';

// Mock Data Types
interface OvertimeDetailData {
  id: string;
  type: 'Overtime Request';
  status: 'Approved' | 'Rejected' | 'Pending';
  employee: {
    name: string;
    department: string;
    role: string;
    manager: string;
    avatar: string;
  };
  timeline: {
    id: number;
    title: string;
    description?: string;
    timestamp?: string;
    status: 'completed' | 'current' | 'pending';
  }[];
  details: {
    date: string;
    shift: string;
    plannedClockOut: string;
    actualClockOut: string;
    duration: number;
    reason: string;
    attachment?: string;
  };
}

const MOCK_DATA: Record<string, OvertimeDetailData> = {
  'ot-1': {
    id: 'ot-1',
    type: 'Overtime Request',
    status: 'Approved',
    employee: {
      name: 'James Cordon',
      department: 'IT Department',
      role: 'IT Developer Intern',
      manager: 'Louis Panganiban',
      avatar: 'JC'
    },
    timeline: [
      { id: 1, title: '1. Request Submitted', description: 'Overtime Request Logged', timestamp: 'August 04, 2025 09:00 PM', status: 'completed' },
      { id: 2, title: '2. Team Lead Review', description: 'Approved by Louis Panganiban', timestamp: 'August 05, 2025 09:30 AM', status: 'completed' },
      { id: 3, title: '3. Final Approval', description: 'Processed by System', timestamp: 'August 05, 2025 10:00 AM', status: 'completed' }
    ],
    details: {
      date: 'August 04, 2025',
      shift: '8:00 AM - 5:00 PM',
      plannedClockOut: '05:00 PM',
      actualClockOut: '08:30 PM',
      duration: 3.5,
      reason: 'Urgent Bug Fixes for Production release cycle.'
    }
  },
  'ot-2': {
    id: 'ot-2',
    type: 'Overtime Request',
    status: 'Pending',
    employee: {
      name: 'Louis Panganiban',
      department: 'IT Department',
      role: 'Senior Developer',
      manager: 'Sarah Wilson',
      avatar: 'LP'
    },
    timeline: [
      { id: 1, title: '1. Request Submitted', description: 'Overtime Request Logged', timestamp: 'August 05, 2025 07:15 PM', status: 'completed' },
      { id: 2, title: '2. Manager Review', description: 'Pending Approval from Sarah Wilson', timestamp: '', status: 'current' },
      { id: 3, title: '3. Final Approval', description: 'Pending', timestamp: '', status: 'pending' }
    ],
    details: {
      date: 'August 05, 2025',
      shift: '8:00 AM - 5:00 PM',
      plannedClockOut: '05:00 PM',
      actualClockOut: '07:00 PM',
      duration: 2.0,
      reason: 'Server Maintenance and Upgrades'
    }
  }
};

const OvertimeDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Fallback to ot-1 if id not found (mock logic)
  const data = MOCK_DATA[id || 'ot-1'] || MOCK_DATA['ot-1'];

  const Timeline = () => (
    <div className="flex items-start w-full border-b border-slate-200 bg-slate-50/50">
        {data.timeline.map((step, idx) => (
            <div key={step.id} className="flex-1 p-6 border-r border-slate-200 last:border-none relative group min-h-[100px]">
                <div className="flex items-start gap-3">
                    <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${step.status === 'completed' ? 'bg-emerald-500 text-white' : step.status === 'current' ? 'bg-indigo-500 text-white animate-pulse' : 'bg-slate-200 text-slate-400'}`}>
                        {step.status === 'completed' ? <Check size={14} strokeWidth={4} /> : step.id}
                    </div>
                    <div>
                        <h4 className={`text-sm font-bold ${step.status === 'pending' ? 'text-slate-400' : 'text-slate-900'}`}>{step.title}</h4>
                        <p className="text-xs text-slate-500 font-medium mt-1">{step.description}</p>
                        {step.timestamp && (
                            <p className="text-[10px] text-slate-400 mt-2 font-mono">{step.timestamp}</p>
                        )}
                    </div>
                </div>
                {/* Progress Bar Line at bottom of active steps */}
                {step.status === 'completed' && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500"></div>}
                {step.status === 'current' && <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-500"></div>}
            </div>
        ))}
    </div>
  );

  const TimeSummaryCard = () => (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock size={16} className="text-indigo-600"/> Time Summary
            </h3>
            <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">{data.details.date}</span>
        </div>
        
        <div className="space-y-6">
            {/* Visual Shift Bar */}
            <div className="relative pt-4">
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                    <div className="w-[70%] bg-slate-300 h-full"></div> {/* Standard Shift */}
                    <div className="w-[30%] bg-indigo-500 h-full relative"></div> {/* Overtime */}
                </div>
                <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wide">
                    <span>In</span>
                    <span>Standard Out</span>
                    <span className="text-indigo-600">Actual Out</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Standard Shift</label>
                    <div className="font-bold text-slate-700 text-sm mt-1">{data.details.shift}</div>
                </div>
                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                    <label className="text-[10px] font-bold text-indigo-400 uppercase">Overtime Duration</label>
                    <div className="font-bold text-indigo-700 text-lg mt-1 flex items-center gap-1">
                        <Timer size={16} /> {data.details.duration} hrs
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center text-sm border-t border-slate-100 pt-4">
                <div className="flex flex-col">
                    <span className="text-slate-500 font-medium">Clock Out</span>
                    <span className="font-bold text-slate-900">{data.details.actualClockOut}</span>
                </div>
                <div className="text-right">
                    <span className="text-xs text-slate-400">Exceeded standard by</span>
                    <div className="text-emerald-600 font-bold">+{data.details.duration} hrs</div>
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Overtime Request</h1>
        <button 
            onClick={() => navigate('/monitor/attendance')}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors px-3 py-2 rounded-xl hover:bg-slate-100"
        >
            <ArrowLeft size={16} />
            Back to Attendance
        </button>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        
        {/* Detail Header */}
        <div className="px-8 py-6 border-b border-slate-200 flex justify-between items-center bg-white">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                    <TrendingUp size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-900">{data.type}</h2>
                    <span className="text-xs font-mono text-slate-400">Reference ID: {data.id}</span>
                </div>
            </div>
            {/* Action Buttons if Pending */}
            {data.status === 'Pending' && (
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 rounded-xl font-bold text-sm transition-all flex items-center gap-2">
                        <X size={16} /> Reject
                    </button>
                    <button className="px-5 py-2.5 bg-slate-900 text-white hover:bg-emerald-600 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95 flex items-center gap-2">
                        <CheckCircle2 size={16} /> Approve
                    </button>
                </div>
            )}
        </div>
        
        <Timeline />

        {/* Content Area */}
        <div className="flex-1 p-8 bg-slate-50/30">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                
                {/* Left Panel: Summary */}
                <div className="w-full lg:w-1/3 space-y-6">
                    <TimeSummaryCard />
                </div>

                {/* Right Panel: Request Details */}
                <div className="w-full lg:w-2/3 space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <FileText size={20} className="text-indigo-600" />
                        Application Details
                    </h3>

                    {/* Status Banner */}
                    <div className={`p-4 rounded-xl border-l-4 flex items-center gap-4 shadow-sm 
                        ${data.status === 'Approved' ? 'bg-emerald-50 border-emerald-500 text-emerald-900' : 
                          data.status === 'Rejected' ? 'bg-rose-50 border-rose-500 text-rose-900' : 
                          'bg-amber-50 border-amber-500 text-amber-900'}`}>
                        {data.status === 'Approved' && <CheckCircle2 size={24} className="text-emerald-600" />}
                        {data.status === 'Rejected' && <X size={24} className="text-rose-600" />}
                        {data.status === 'Pending' && <Clock size={24} className="text-amber-600" />}
                        <div>
                            <span className="text-xl font-bold tracking-tight block">{data.status}</span>
                            <span className="text-xs font-medium opacity-80">
                                {data.status === 'Pending' ? 'This request is awaiting review.' : `This request has been ${data.status.toLowerCase()}.`}
                            </span>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Employee Name</label>
                            <div className="flex items-center gap-3 mt-1">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                                    {data.employee.avatar}
                                </div>
                                <div className="font-bold text-slate-700 text-sm">{data.employee.name}</div>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Department</label>
                            <div className="font-bold text-slate-700 text-sm p-2 bg-slate-50 rounded-lg border border-slate-100">{data.employee.department}</div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</label>
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                <Calendar size={16} className="text-slate-400"/> {data.details.date}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Approving Manager</label>
                            <div className="font-bold text-slate-700 text-sm">{data.employee.manager}</div>
                        </div>
                        <div className="col-span-full space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reason for Overtime</label>
                            <div className="p-4 bg-slate-50 rounded-xl text-sm font-medium text-slate-600 italic border border-slate-100">
                                "{data.details.reason}"
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OvertimeDetail;
