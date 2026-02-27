
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight,
  Check, 
  CalendarDays, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Eye
} from 'lucide-react';

const MOCK_LEAVE_DATA = {
  id: 'lr-55',
  type: 'Vacation Leave',
  status: 'Approved',
  employee: {
    name: 'James Cordon',
    department: 'IT Department',
    role: 'IT Developer Intern',
    manager: 'Louis Panganiban'
  },
  timeline: [
    { id: 1, title: '1. Submit Leave', description: 'Submitted Leave Request', timestamp: 'August 10, 2025 10:09:07 AM', status: 'completed' },
    { id: 2, title: '2. IT Department Approval', description: 'Approved by Louis Panganiban', timestamp: 'August 11, 2025 11:54:45 PM', status: 'completed' },
    { id: 3, title: '3. HR Approval', description: 'Approved by Alex Thompson', timestamp: 'August 12, 2025 9:45:34 AM', status: 'completed' },
    { id: 4, title: '4. Application Result', description: 'Updated Employee Schedule', timestamp: 'August 12, 2025 11:45:34 PM', status: 'completed' }
  ],
  details: {
    leaveDates: { start: '2025-08-24', end: '2025-08-26', days: 3 },
    reason: 'Family Vacation',
    attachment: 'flight_itinerary.pdf'
  }
};

const EmployeeLeaveDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = MOCK_LEAVE_DATA; // In real app, fetch by ID

  const Timeline = () => (
    <div className="flex items-start w-full border-b border-slate-200 bg-slate-50/50">
        {data.timeline.map((step, idx) => (
            <div key={step.id} className="flex-1 p-4 border-r border-slate-200 last:border-none relative group min-h-[100px]">
                <div className="flex items-start gap-3">
                    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${step.status === 'completed' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                        {step.status === 'completed' ? <Check size={12} strokeWidth={4} /> : step.id}
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
                        <p className="text-xs text-slate-500 font-medium mt-1">{step.description}</p>
                        {step.timestamp && (
                            <p className="text-[10px] text-slate-400 mt-2 font-mono">{step.timestamp}</p>
                        )}
                    </div>
                </div>
                {step.status === 'completed' && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500"></div>}
            </div>
        ))}
    </div>
  );

  const LeaveCalendar = () => {
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const selectedDays = [24, 25, 26];
    
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <button className="p-1 text-slate-400 hover:text-slate-600"><ArrowLeft size={16} /></button>
                <span className="text-sm font-bold text-slate-900">August 2025</span>
                <button className="p-1 text-slate-400 hover:text-slate-600"><ArrowRight size={16} /></button>
            </div>
            <div className="grid grid-cols-7 gap-2 mb-2">
                {weekDays.map(d => <div key={d} className="text-center text-xs font-bold text-slate-400 uppercase">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2">
                <div /><div /><div /><div /><div />
                {days.map(d => {
                    const isSelected = selectedDays.includes(d);
                    return (
                        <div 
                            key={d} 
                            className={`
                                h-10 w-full flex items-center justify-center text-sm font-bold rounded-lg
                                ${isSelected ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-700 hover:bg-slate-50'}
                            `}
                        >
                            {d}
                        </div>
                    );
                })}
            </div>
        </div>
    );
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Request Details</h1>
        <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors px-3 py-2 rounded-xl hover:bg-slate-100"
        >
            <ArrowLeft size={16} />
            Back
        </button>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        
        {/* Timeline Header */}
        <div className="px-8 py-6 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">{data.type}</h2>
            <span className="text-xs font-mono text-slate-400">ID: {data.id}</span>
        </div>
        <Timeline />

        {/* Content Area */}
        <div className="flex-1 p-8 bg-slate-50/30">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                
                {/* Left Panel: Calendar */}
                <div className="w-full lg:w-1/3 space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <CalendarDays size={20} className="text-indigo-600" />
                        Leave Dates
                    </h3>
                    <LeaveCalendar />
                </div>

                {/* Right Panel: Request Details */}
                <div className="w-full lg:w-2/3 space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <FileText size={20} className="text-indigo-600" />
                        Application Details
                    </h3>

                    {/* Status Banner */}
                    <div className="p-4 rounded-xl border-l-4 flex items-center gap-4 shadow-sm bg-emerald-50 border-emerald-500 text-emerald-900">
                        <CheckCircle2 size={24} className="text-emerald-600" />
                        <span className="text-2xl font-bold tracking-tight">{data.status}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Name</label>
                            <div className="p-3 bg-slate-50 rounded-xl text-sm font-bold text-slate-700">{data.employee.name}</div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Department</label>
                            <div className="p-3 bg-slate-50 rounded-xl text-sm font-bold text-slate-700">{data.employee.department}</div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Manager</label>
                            <div className="p-3 bg-slate-50 rounded-xl text-sm font-bold text-slate-700">{data.employee.manager}</div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Leave Type</label>
                            <div className="p-3 bg-slate-50 rounded-xl text-sm font-bold text-slate-700">{data.type}</div>
                        </div>
                        <div className="col-span-full space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reason for Leave</label>
                            <div className="p-4 bg-slate-50 rounded-xl text-sm font-medium text-slate-600 italic">
                                "{data.details.reason}"
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dates</label>
                            <div className="p-3 bg-slate-50 rounded-xl text-sm font-bold text-slate-700 flex flex-col">
                                <span>August 24, 2025</span>
                                <span>August 25, 2025</span>
                                <span>August 26, 2025</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">File Attachment</label>
                            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between group cursor-pointer hover:bg-slate-100 transition-colors">
                                <span className="text-sm font-bold text-slate-600">{data.details.attachment}</span>
                                <div className="flex items-center gap-2 text-xs font-bold text-indigo-600">
                                    <Eye size={14} /> View File
                                </div>
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

export default EmployeeLeaveDetail;
