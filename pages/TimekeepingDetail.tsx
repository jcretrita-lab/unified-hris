
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Eye,
  CheckCircle2,
  Lock,
  Unlock,
  AlertTriangle,
  History as HistoryIcon,
  X,
  Fingerprint,
  MonitorSmartphone,
  Settings2,
  Check,
  AlertCircle,
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../components/Modal';
import { useBreadcrumb } from '../context/BreadcrumbContext';

const SimpleStepper = ({ steps }: { steps: { title: string; subtitle: string; status: 'completed' | 'current' | 'pending'; date?: string }[] }) => {
    return (
        <div className="flex items-center justify-between w-full max-w-2xl mx-auto mb-10 mt-2 px-4">
            {steps.map((step, idx) => (
                <React.Fragment key={idx}>
                    <div className="flex flex-col items-center relative min-w-[100px]">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`w-6 h-6 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${
                            step.status === 'completed' ? 'bg-emerald-500 text-white shadow-sm' :
                            step.status === 'current' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 ring-4 ring-indigo-50' :
                            'bg-white text-slate-300 border border-slate-200'
                        }`}>
                            {step.status === 'completed' ? <Check size={14} strokeWidth={3} /> : <span className="text-[9px] font-bold">{idx + 1}</span>}
                        </motion.div>
                        <div className="mt-2.5 flex flex-col items-center text-center">
                            <span className={`text-[9px] font-bold uppercase tracking-widest ${step.status === 'pending' ? 'text-slate-300' : 'text-slate-900'}`}>{step.title}</span>
                            <span className="text-[9px] text-slate-500 font-bold mt-0.5">{step.subtitle}</span>
                            {step.date && <span className="text-[8px] text-slate-400 font-mono mt-0.5">{step.date}</span>}
                        </div>
                    </div>
                    {idx < steps.length - 1 && (
                        <div className="flex-1 h-[2px] bg-slate-100 mx-[-1px] relative -mt-11 z-0 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }} 
                                animate={{ width: step.status === 'completed' ? '100%' : '0%' }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                                className="h-full bg-emerald-500"
                            />
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

// Mock Data Types
interface DtrLog {
  id: string;
  date: string;
  day: string;
  shift: string;
  timeIn: string;
  dateOut: string;
  timeOut: string;
  isRestDay: boolean;
  isWorkSchedule: boolean;
  isHoliday: boolean;
  hasFile: boolean;
  source: string;
  remarks?: string;
  adjustment?: {
    id: string;
    timeIn: string;
    timeOut: string;
    remarks: string;
    source: string;
  };
  lastModifiedBy?: string;
  lastModifiedAt?: string;
}

const SourceBadge = ({ source }: { source: string }) => {
    switch (source) {
        case 'Biometric': return <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[9px] font-bold uppercase tracking-tight"><Fingerprint size={10} /> Biometric</span>;
        case 'ODTR': return <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-purple-50 text-purple-600 text-[9px] font-bold uppercase tracking-tight"><MonitorSmartphone size={10} /> ODTR</span>;
        case 'Attendance Adjustment Record': return <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 text-[9px] font-bold uppercase tracking-tight"><Settings2 size={10} /> Adjustment</span>;
        default: return null;
    }
};

interface DtrOvertime {
  id: string;
  dateIn: string;
  dateOut: string;
  timeIn: string;
  timeOut: string;
  isApproved: boolean;
  hasFile: boolean;
}

const MOCK_DTR_LOGS: DtrLog[] = [
  { id: '1', date: 'August 1, 2025', day: 'Fri', shift: '8:00 AM - 5:00 PM', timeIn: '07:55 AM', dateOut: 'August 1, 2025', timeOut: '05:02 PM', isRestDay: false, isWorkSchedule: true, isHoliday: false, hasFile: true, source: 'Biometric', remarks: 'Regular Tap in/out' },
  { id: '2', date: 'August 2, 2025', day: 'Sat', shift: 'Rest Day', timeIn: '--:--', dateOut: '--:--', timeOut: '--:--', isRestDay: true, isWorkSchedule: false, isHoliday: false, hasFile: false, source: 'Biometric' },
  { id: '3', date: 'August 3, 2025', day: 'Sun', shift: 'Rest Day', timeIn: '--:--', dateOut: '--:--', timeOut: '--:--', isRestDay: true, isWorkSchedule: false, isHoliday: false, hasFile: false, source: 'Biometric' },
  { id: '4', date: 'August 4, 2025', day: 'Mon', shift: '8:00 AM - 5:00 PM', timeIn: '08:02 AM', dateOut: 'August 4, 2025', timeOut: '05:10 PM', isRestDay: false, isWorkSchedule: true, isHoliday: false, hasFile: true, source: 'Biometric', remarks: 'Regular Tap in/out' },
  { id: '5', date: 'August 5, 2025', day: 'Tue', shift: '8:00 AM - 5:00 PM', timeIn: '07:45 AM', dateOut: 'August 5, 2025', timeOut: '05:15 PM', isRestDay: false, isWorkSchedule: true, isHoliday: false, hasFile: true, source: 'Biometric', remarks: 'Regular Tap in/out' },
  { id: '6', date: 'August 6, 2025', day: 'Wed', shift: '8:00 AM - 5:00 PM', timeIn: '8:00:00 AM', dateOut: 'August 6, 2025', timeOut: '5:00:00 PM', isRestDay: false, isWorkSchedule: true, isHoliday: false, hasFile: true, source: 'Biometric', remarks: 'Regular Tap in/out', lastModifiedBy: 'System', lastModifiedAt: '2025-08-06 17:30' },
  { id: '7', date: 'August 7, 2025', day: 'Thu', shift: '8:00 AM - 5:00 PM', timeIn: '8:05:00 AM', dateOut: 'August 7, 2025', timeOut: '5:10:00 PM', isRestDay: false, isWorkSchedule: true, isHoliday: false, hasFile: true, source: 'Biometric', remarks: 'Regular Tap in/out', lastModifiedBy: 'Admin Jane', lastModifiedAt: '2025-08-08 09:12' },
  { id: '8', date: 'August 8, 2025', day: 'Fri', shift: '8:00 AM - 5:00 PM', timeIn: '8:00:00 AM', dateOut: 'August 8, 2025', timeOut: '5:00:00 PM', isRestDay: false, isWorkSchedule: true, isHoliday: false, hasFile: true, source: 'Biometric', remarks: 'Regular Tap in/out' },
  { id: '9', date: 'August 9, 2025', day: 'Sat', shift: 'Rest Day', timeIn: '--:--', dateOut: '--:--', timeOut: '--:--', isRestDay: true, isWorkSchedule: false, isHoliday: false, hasFile: false, source: 'Biometric' },
  { id: '10', date: 'August 10, 2025', day: 'Sun', shift: 'Rest Day', timeIn: '--:--', dateOut: '--:--', timeOut: '--:--', isRestDay: true, isWorkSchedule: false, isHoliday: false, hasFile: false, source: 'Biometric' },
  { id: '11', date: 'August 11, 2025', day: 'Mon', shift: '8:00 AM - 5:00 PM', timeIn: '08:30 AM', dateOut: 'August 11, 2025', timeOut: '05:30 PM', isRestDay: false, isWorkSchedule: true, isHoliday: false, hasFile: true, source: 'ODTR', remarks: 'Work from Home (Approved)' },
  { id: '12', date: 'August 12, 2025', day: 'Tue', shift: '8:00 AM - 5:00 PM', timeIn: '07:58 AM', dateOut: 'August 12, 2025', timeOut: '05:02 PM', isRestDay: false, isWorkSchedule: true, isHoliday: false, hasFile: true, source: 'Biometric', remarks: 'Regular Tap' },
  { 
    id: '13', 
    date: 'August 13, 2025', 
    day: 'Wed', 
    shift: '8:00 AM - 5:00 PM', 
    timeIn: '07:59 AM', 
    dateOut: 'August 13, 2025', 
    timeOut: '--:--', 
    isRestDay: false, 
    isWorkSchedule: true, 
    isHoliday: false, 
    hasFile: true, 
    source: 'Biometric', 
    remarks: 'No tap out recorded',
    adjustment: {
      id: 'adj-1',
      timeIn: '07:59 AM',
      timeOut: '05:05 PM',
      remarks: 'Forgot to tap out; adjusted by manager',
      source: 'Attendance Adjustment Record'
    }
  },
  { id: '14', date: 'August 14, 2025', day: 'Thu', shift: '8:00 AM - 5:00 PM', timeIn: '08:05 AM', dateOut: 'August 14, 2025', timeOut: '05:15 PM', isRestDay: false, isWorkSchedule: true, isHoliday: false, hasFile: true, source: 'Biometric', remarks: 'Regular Tap in/out' },
  { id: '15', date: 'August 15, 2025', day: 'Fri', shift: '8:00 AM - 5:00 PM', timeIn: '07:50 AM', dateOut: 'August 15, 2025', timeOut: '05:00 PM', isRestDay: false, isWorkSchedule: true, isHoliday: false, hasFile: true, source: 'Biometric', remarks: 'Regular Tap in/out' },
];

const MOCK_OT_LOGS: DtrOvertime[] = [
  { id: 'ot-1', dateIn: 'August 6, 2025', dateOut: 'August 6, 2025', timeIn: '5:00:00 PM', timeOut: '7:00:00 PM', isApproved: true, hasFile: true },
  { id: 'ot-2', dateIn: 'August 7, 2025', dateOut: 'August 7, 2025', timeIn: '6:00:00 PM', timeOut: '10:00:00 PM', isApproved: true, hasFile: true },
  { id: 'ot-3', dateIn: 'August 8, 2025', dateOut: 'August 9, 2025', timeIn: '10:00:00 PM', timeOut: '6:00:00 AM', isApproved: true, hasFile: true },
];

const MOCK_EMPLOYEES = [
    { id: 'EMP1001', name: 'Louis Panganiban', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&auto=format&fit=crop' },
    { id: 'EMP1002', name: 'Maria Santos', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&auto=format&fit=crop' },
    { id: 'EMP1003', name: 'Juan Dela Cruz', avatar: 'https://images.unsplash.com/photo-1542343633-ce3256525ee7?w=100&h=100&auto=format&fit=crop' },
    { id: 'EMP1004', name: 'Sarah Wilson', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&auto=format&fit=crop' },
    { id: 'EMP1005', name: 'Michael Chen', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&auto=format&fit=crop' }
];

const TimekeepingDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { setPageTitle } = useBreadcrumb();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [showAuditHistory, setShowAuditHistory] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{title: string, date: string, source: string} | null>(null);

  React.useEffect(() => {
    setPageTitle('Timekeeping Summary');
  }, [setPageTitle]);

  // Local state to manage edits
  const [logs, setLogs] = useState<DtrLog[]>(MOCK_DTR_LOGS);
  const [otLogs, setOtLogs] = useState<DtrOvertime[]>(MOCK_OT_LOGS);

  // Find current employee in list
  const currentEmployeeIndex = MOCK_EMPLOYEES.findIndex(e => e.id === id) !== -1 
    ? MOCK_EMPLOYEES.findIndex(e => e.id === id) 
    : 0;

  const currentEmployee = MOCK_EMPLOYEES[currentEmployeeIndex];

  // Navigation handlers
  const handlePrev = () => {
    if (currentEmployeeIndex > 0) {
      navigate(`/monitor/attendance/timekeeping/${MOCK_EMPLOYEES[currentEmployeeIndex - 1].id}`);
    }
  };

  const handleNext = () => {
    if (currentEmployeeIndex < MOCK_EMPLOYEES.length - 1) {
      navigate(`/monitor/attendance/timekeeping/${MOCK_EMPLOYEES[currentEmployeeIndex + 1].id}`);
    }
  };

  // Mock Employee Data
  const employee = {
    id: currentEmployee.id,
    name: currentEmployee.name,
    shift: '3',
    timeRange: '8:00 AM - 5:00 PM'
  };

  const handleLogChange = (id: string, field: keyof DtrLog, value: any) => {
    if (!isEditMode) return;
    setLogs(logs.map(log => log.id === id ? { ...log, [field]: value } : log));
  };

  const handleOtChange = (id: string, field: keyof DtrOvertime, value: any) => {
    if (!isEditMode) return;
    setOtLogs(otLogs.map(ot => ot.id === id ? { ...ot, [field]: value } : ot));
  };

  return (
    <div className="space-y-8 pb-24">
      {/* Back Header */}
      <div className={`p-4 rounded-xl flex items-center justify-between shadow-lg transition-colors duration-500 border border-white/10 ${isEditMode ? 'bg-amber-600' : 'bg-slate-900'}`}>
        <div className="flex items-center gap-8">
            <button
                onClick={() => navigate('/monitor/attendance')}
                className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors group"
            >
                <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
                Back to Summary
            </button>

            {isEditMode && (
                <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-lg text-[10px] font-black uppercase tracking-widest animate-pulse border border-white/10">
                    <AlertTriangle size={12} />
                    Override Mode
                </div>
            )}
        </div>

        <div className="flex items-center gap-6">
            <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest hidden md:block">
                Employee {employee.id}
            </div>
            
            <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl border border-white/5">
                <button 
                    onClick={handlePrev}
                    disabled={currentEmployeeIndex === 0}
                    className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all active:scale-95 group ${currentEmployeeIndex === 0 ? 'opacity-20 cursor-not-allowed text-white/30' : 'hover:bg-white/10 text-white'}`}
                >
                    <ChevronLeft size={16} />
                </button>
                <div className="h-4 w-px bg-white/10 mx-1"></div>
                <button 
                    onClick={handleNext}
                    disabled={currentEmployeeIndex === MOCK_EMPLOYEES.length - 1}
                    className={`flex items-center gap-2 pl-3 pr-2 h-9 rounded-lg transition-all active:scale-95 group ${currentEmployeeIndex === MOCK_EMPLOYEES.length - 1 ? 'opacity-20 cursor-not-allowed text-white/30' : 'hover:bg-white/10 text-white'}`}
                >
                    <span className="text-[10px] font-bold uppercase tracking-wider">Next</span>
                    <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
            </div>
        </div>
      </div>

      {/* Main Container */}
      <div className={`bg-white border rounded-3xl shadow-sm p-8 min-h-[800px] relative transition-all duration-300 ${isEditMode ? 'border-amber-400 ring-4 ring-amber-50' : 'border-slate-100'}`}>

        {/* Info Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end gap-6 mb-10 pb-8 border-b border-slate-100">
          <div className="flex flex-col md:flex-row items-center gap-8 w-full">
            <div className="w-24 h-24 rounded-2xl bg-indigo-50 border-4 border-white shadow-xl flex items-center justify-center relative overflow-hidden shrink-0 rotate-3 transform transition-transform hover:rotate-0">
               <img src={currentEmployee.avatar} alt="avatar" className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1">
                <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Employee ID</span>
                <span className="text-xl font-medium text-slate-600">{employee.id}</span>
                </div>
                <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Employee Name</span>
                <span className="text-xl font-bold text-slate-900">{employee.name}</span>
                </div>
                <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Shift</span>
                <span className="text-xl font-medium text-slate-600">{employee.shift}</span>
                </div>
                <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Time Range</span>
                <span className="text-xl font-medium text-slate-600">{employee.timeRange}</span>
                </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className={`flex items-center gap-3 cursor-pointer select-none transition-opacity ${isEditMode ? 'opacity-100' : 'opacity-60 cursor-not-allowed'}`}>
              <div
                className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${isOnHold ? 'bg-slate-900 border-slate-900' : 'border-slate-300 bg-white'}`}
                onClick={() => isEditMode && setIsOnHold(!isOnHold)}
              >
                {isOnHold && <CheckCircle2 size={14} className="text-white" />}
              </div>
              <span className="text-sm font-bold text-slate-700">On Hold</span>
            </label>

            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 ${isEditMode ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
            >
              {isEditMode ? <Unlock size={16} /> : <Lock size={16} />}
              {isEditMode ? 'Exit Override' : 'Override Records'}
            </button>
          </div>
        </div>

        {/* Main DTR Table */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-bold text-slate-800">Timekeeping Summary</h3>
              {isEditMode && <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200">Editable</span>}
            </div>
            <button
              onClick={() => setShowAuditHistory(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all"
            >
              <HistoryIcon size={16} />
              Audit History
            </button>
          </div>
          <div className={`border rounded-2xl overflow-hidden transition-colors ${isEditMode ? 'border-amber-200' : 'border-slate-200'}`}>
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">Date</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 text-center">Day</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 text-center">Shift</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 text-center">In</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 text-center">Out</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 text-left">Remarks</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 text-center">RestDay</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 text-center">Schedule</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 text-center">Holiday</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 text-center">Data Source</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 text-center">Files</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {logs.map((log) => (
                  <React.Fragment key={log.id}>
                    <tr className={`transition-colors ${isEditMode ? 'hover:bg-amber-50/30' : 'hover:bg-slate-50'} ${log.isRestDay ? 'opacity-50' : ''} ${log.adjustment ? 'bg-slate-50/50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700 text-left">{log.date}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-500 font-medium text-center">{log.day}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-[11px] font-medium text-center">
                        {isEditMode ? (
                          <input
                            className="bg-white border border-slate-300 rounded px-2 py-1 font-bold text-slate-800 font-mono text-[10px] w-full focus:ring-2 focus:ring-amber-500 outline-none"
                            value={log.shift}
                            onChange={(e) => handleLogChange(log.id, 'shift', e.target.value)}
                          />
                        ) : (
                          <span className={`px-2 py-1 rounded-lg text-[10px] font-bold font-mono whitespace-nowrap ${log.isRestDay ? 'text-amber-600 bg-amber-50 border border-amber-100' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                            {log.shift}
                          </span>
                        )}
                      </td>
                      <td className={`px-4 py-4 whitespace-nowrap font-mono text-xs font-bold text-center ${log.adjustment ? 'text-slate-400 line-through decoration-rose-500/50 decoration-2' : ''}`}>
                        {isEditMode ? (
                          <input
                            className="bg-white border border-slate-300 rounded px-2 py-1 font-bold text-slate-800 font-mono w-full focus:ring-2 focus:ring-amber-500 outline-none"
                            value={log.timeIn}
                            onChange={(e) => handleLogChange(log.id, 'timeIn', e.target.value)}
                          />
                        ) : (
                          <span className="text-slate-700 font-mono">{log.timeIn}</span>
                        )}
                      </td>
                      <td className={`px-4 py-4 whitespace-nowrap font-mono text-xs font-bold text-center ${log.adjustment ? 'text-slate-400 line-through decoration-rose-500/50 decoration-2' : ''}`}>
                        {isEditMode ? (
                          <input
                            className="bg-white border border-slate-300 rounded px-2 py-1 font-bold text-slate-800 font-mono w-full focus:ring-2 focus:ring-amber-500 outline-none"
                            value={log.timeOut}
                            onChange={(e) => handleLogChange(log.id, 'timeOut', e.target.value)}
                          />
                        ) : (
                          <span className="text-slate-700 font-mono">{log.timeOut}</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-left">
                          {isEditMode ? (
                              <input
                              className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-600 w-full focus:ring-2 focus:ring-amber-500 outline-none"
                              value={log.remarks || ''}
                              onChange={(e) => handleLogChange(log.id, 'remarks', e.target.value)}
                              />
                          ) : (
                              <div className={`text-xs ${log.adjustment ? 'text-slate-400 italic' : 'text-slate-600'}`}>{log.remarks || '-'}</div>
                          )}
                      </td>

                      {/* Interactive Checkboxes */}
                      <td className="px-6 py-4 text-center">
                        <label className={`w-5 h-5 mx-auto rounded border flex items-center justify-center transition-all ${isEditMode ? 'cursor-pointer hover:border-amber-500' : 'cursor-default'} ${log.isRestDay ? 'bg-slate-800 border-slate-800' : 'bg-white border-slate-300'}`}>
                          <input
                            type="checkbox"
                            className="hidden"
                            disabled={!isEditMode}
                            checked={log.isRestDay}
                            onChange={(e) => handleLogChange(log.id, 'isRestDay', e.target.checked)}
                          />
                          {log.isRestDay && <CheckCircle2 size={14} className="text-white" />}
                        </label>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <label className={`w-5 h-5 mx-auto rounded border flex items-center justify-center transition-all ${isEditMode ? 'cursor-pointer hover:border-amber-500' : 'cursor-default'} ${log.isWorkSchedule ? 'bg-slate-800 border-slate-800' : 'bg-white border-slate-300'}`}>
                          <input
                            type="checkbox"
                            className="hidden"
                            disabled={!isEditMode}
                            checked={log.isWorkSchedule}
                            onChange={(e) => handleLogChange(log.id, 'isWorkSchedule', e.target.checked)}
                          />
                          {log.isWorkSchedule && <CheckCircle2 size={14} className="text-white" />}
                        </label>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <label className={`w-5 h-5 mx-auto rounded border flex items-center justify-center transition-all ${isEditMode ? 'cursor-pointer hover:border-amber-500' : 'cursor-default'} ${log.isHoliday ? 'bg-slate-800 border-slate-800' : 'bg-white border-slate-300'}`}>
                          <input
                            type="checkbox"
                            className="hidden"
                            disabled={!isEditMode}
                            checked={log.isHoliday}
                            onChange={(e) => handleLogChange(log.id, 'isHoliday', e.target.checked)}
                          />
                          {log.isHoliday && <CheckCircle2 size={14} className="text-white" />}
                        </label>
                      </td>

                      {/* Data Source */}
                      <td className="px-6 py-4 text-center">
                          <SourceBadge source={log.source} />
                      </td>

                      {/* Files */}
                      <td className="px-6 py-4 text-center">
                        {log.hasFile ? (
                          <button 
                            onClick={() => setSelectedDocument({ title: log.source === 'Biometric' ? 'Biometrics Log' : log.source === 'ODTR' ? 'ODTR Form' : 'Adjustment Form', date: log.date, source: log.source })}
                            className="p-1.5 bg-slate-100 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                        ) : <span className="text-slate-200">-</span>}
                      </td>
                    </tr>
                    {log.adjustment && (
                      <tr className="bg-indigo-50/30 border-t-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)] hover:bg-indigo-50/50 transition-colors relative">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-700 relative">
                              <div className="absolute top-0 left-8 w-px h-full bg-indigo-200/50 -translate-y-full"></div>
                              <div className="flex items-center gap-2 pl-4"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div><span className="text-[10px] uppercase font-black text-indigo-400 tracking-widest">Adjusted</span></div>
                          </td>
                          <td className="px-4 py-4"></td>
                          <td className="px-4 py-4"></td>
                          <td className="px-4 py-4 whitespace-nowrap font-mono text-xs font-bold text-indigo-700 text-center bg-white shadow-[0_0_10px_rgba(0,0,0,0.02)] rounded-lg scale-90 border border-indigo-50">{log.adjustment.timeIn}</td>
                          <td className="px-4 py-4 whitespace-nowrap font-mono text-xs font-bold text-indigo-700 text-center bg-white shadow-[0_0_10px_rgba(0,0,0,0.02)] rounded-lg scale-90 border border-indigo-50">{log.adjustment.timeOut}</td>
                          <td className="px-4 py-4"><div className="text-xs font-bold text-indigo-600 flex items-center gap-1.5 "><AlertCircle size={14} className="text-indigo-400" /> {log.adjustment.remarks}</div></td>
                          <td className="px-6 py-4"></td>
                          <td className="px-6 py-4"></td>
                          <td className="px-6 py-4"></td>
                          <td className="px-6 py-4 text-center flex items-center justify-center h-full pt-4"><SourceBadge source={log.adjustment.source} /></td>
                          <td className="px-6 py-4 text-center">
                              <button 
                                  onClick={() => setSelectedDocument({ title: 'Attendance Adjustment Form', date: log.date, source: log.adjustment!.source })}
                                  className="p-1.5 text-indigo-400 hover:text-indigo-700 hover:bg-indigo-100/50 rounded-lg transition-colors inline-flex"
                              >
                                  <Eye size={16} />
                              </button>
                          </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Overtime Section */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-2xl font-bold text-slate-800">Overtime</h3>
            {isEditMode && <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200">Editable</span>}
          </div>
          <div className={`border rounded-2xl overflow-hidden transition-colors ${isEditMode ? 'border-amber-200' : 'border-slate-200'}`}>
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-bold text-slate-800">Date In</th>
                  <th className="px-6 py-4 font-bold text-slate-800">Date Out</th>
                  <th className="px-6 py-4 font-bold text-slate-800">Time In</th>
                  <th className="px-6 py-4 font-bold text-slate-800">Time Out</th>
                  <th className="px-6 py-4 font-bold text-slate-800 text-center">Approved</th>
                  <th className="px-6 py-4 font-bold text-slate-800 text-center">Files</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {otLogs.map((ot) => (
                  <tr key={ot.id} className={`transition-colors ${isEditMode ? 'hover:bg-amber-50/30' : 'hover:bg-slate-50'}`}>
                    <td className="px-6 py-4 font-bold text-slate-700">
                      {isEditMode ? (
                        <input
                          className="bg-white border border-slate-300 rounded px-2 py-1 font-bold text-slate-700 w-full focus:ring-2 focus:ring-amber-500 outline-none"
                          value={ot.dateIn}
                          onChange={(e) => handleOtChange(ot.id, 'dateIn', e.target.value)}
                        />
                      ) : (
                        ot.dateIn
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700">
                      {isEditMode ? (
                        <input
                          className="bg-white border border-slate-300 rounded px-2 py-1 font-bold text-slate-700 w-full focus:ring-2 focus:ring-amber-500 outline-none"
                          value={ot.dateOut}
                          onChange={(e) => handleOtChange(ot.id, 'dateOut', e.target.value)}
                        />
                      ) : (
                        ot.dateOut
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800 font-mono">
                      {isEditMode ? (
                        <input
                          className="bg-white border border-slate-300 rounded px-2 py-1 font-bold text-slate-800 font-mono w-full focus:ring-2 focus:ring-amber-500 outline-none"
                          value={ot.timeIn}
                          onChange={(e) => handleOtChange(ot.id, 'timeIn', e.target.value)}
                        />
                      ) : (
                        ot.timeIn
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800 font-mono">
                      {isEditMode ? (
                        <input
                          className="bg-white border border-slate-300 rounded px-2 py-1 font-bold text-slate-800 font-mono w-full focus:ring-2 focus:ring-amber-500 outline-none"
                          value={ot.timeOut}
                          onChange={(e) => handleOtChange(ot.id, 'timeOut', e.target.value)}
                        />
                      ) : (
                        ot.timeOut
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <label className={`w-5 h-5 mx-auto rounded border flex items-center justify-center transition-all ${isEditMode ? 'cursor-pointer hover:border-amber-500' : 'cursor-default'} ${ot.isApproved ? 'bg-slate-800 border-slate-800' : 'bg-white border-slate-300'}`}>
                        <input
                          type="checkbox"
                          className="hidden"
                          disabled={!isEditMode}
                          checked={ot.isApproved}
                          onChange={(e) => handleOtChange(ot.id, 'isApproved', e.target.checked)}
                        />
                        {ot.isApproved && <CheckCircle2 size={14} className="text-white" />}
                      </label>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {ot.hasFile ? (
                        <button className="p-1.5 bg-slate-100 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                          <Eye size={16} />
                        </button>
                      ) : <span className="text-slate-200">-</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-12 flex justify-end gap-4">
          <button className="px-8 py-3 bg-white border border-rose-200 text-rose-600 rounded-xl font-bold text-sm hover:bg-rose-50 transition-all shadow-sm">
            Hold Payroll
          </button>
          <button className="px-8 py-3 bg-black text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg active:scale-95">
            Process Record
          </button>
        </div>

      </div>

      {/* Document Modal */}
      <AnimatePresence>
          {selectedDocument && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                      <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden border border-slate-100 flex flex-col"
                      >
                          <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50 shrink-0">
                              <div className="flex items-center gap-3">
                                  <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                                      <FileText size={20} />
                                  </div>
                                  <div>
                                      <h3 className="text-base font-bold text-slate-900">{selectedDocument.title}</h3>
                                      <p className="text-xs font-medium text-slate-500">{selectedDocument.date} • Reference Document</p>
                                  </div>
                              </div>
                              <button
                                  onClick={() => setSelectedDocument(null)}
                                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                              >
                                  <X size={20} />
                              </button>
                          </div>
                          
                          <div className="flex-1 overflow-y-auto bg-white p-8 text-left">
                              {/* Stepper Section */}
                              <div className="mb-10">
                                  {selectedDocument.source === 'Biometric' && (
                                      <SimpleStepper steps={[
                                          { title: 'Submitted', subtitle: 'Auto-Record', status: 'completed', date: selectedDocument.date },
                                          { title: 'System Approval', subtitle: 'Step 1/1', status: 'completed', date: selectedDocument.date },
                                          { title: 'HR Verified', subtitle: 'HR Specialist', status: 'completed', date: selectedDocument.date }
                                      ]} />
                                  )}
                                  {selectedDocument.source === 'ODTR' && (
                                      <SimpleStepper steps={[
                                          { title: 'Submitted', subtitle: 'Employee Log', status: 'completed', date: selectedDocument.date },
                                          { title: 'Supervisor', subtitle: 'Step 1/2', status: 'completed', date: selectedDocument.date },
                                          { title: 'Dept Head', subtitle: 'Step 2/2', status: 'current' },
                                          { title: 'HR Verified', subtitle: 'Pending', status: 'pending' }
                                      ]} />
                                  )}
                                  {selectedDocument.source === 'Attendance Adjustment Record' && (
                                      <SimpleStepper steps={[
                                          { title: 'Submitted', subtitle: 'Adjustment Form', status: 'completed', date: selectedDocument.date },
                                          { title: 'Superior', subtitle: 'Step 1/2', status: 'current' },
                                          { title: 'Dept Head', subtitle: 'Step 2/2', status: 'pending' },
                                          { title: 'HR Verified', subtitle: 'Pending', status: 'pending' }
                                      ]} />
                                  )}
                              </div>

                              {/* Data Table Section */}
                              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                  {selectedDocument.source === 'Attendance Adjustment Record' ? (
                                      <table className="min-w-full divide-y divide-slate-100">
                                          <thead className="bg-slate-50/50 text-left">
                                              <tr>
                                                  <th className="px-6 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-left pl-10">Date & Type</th>
                                                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Original Log</th>
                                                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Adjustment</th>
                                                  <th className="px-6 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-left">Remarks</th>
                                              </tr>
                                          </thead>
                                          <tbody className="divide-y divide-slate-50">
                                              <tr className="hover:bg-slate-50/50 transition-colors text-xs">
                                                  <td className="px-6 py-4 pl-10">
                                                      <div className="text-slate-700 font-bold mb-1">{selectedDocument.date}</div>
                                                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50 text-amber-600 text-[9px] font-bold uppercase tracking-tight"><AlertCircle size={10} /> Missing Bio Out</span>
                                                  </td>
                                                  <td className="px-4 py-4 text-center">
                                                      <div className="flex gap-2 justify-center">
                                                          <span className="px-2 py-0.5 bg-slate-100 text-slate-400 rounded-md font-mono text-[10px] decoration-slate-300 line-through">IN: 07:59 AM</span>
                                                          <span className="px-2 py-0.5 bg-slate-100 text-slate-400 rounded-md font-mono text-[10px] decoration-slate-300 line-through">OUT: --:--</span>
                                                      </div>
                                                  </td>
                                                  <td className="px-4 py-4 text-center">
                                                      <div className="flex gap-2 justify-center">
                                                          <span className="px-2 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm rounded-md font-mono text-[10px] font-bold text-center w-20">07:59 AM</span>
                                                          <span className="px-2 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm rounded-md font-mono text-[10px] font-bold text-center w-20">05:05 PM</span>
                                                      </div>
                                                  </td>
                                                  <td className="px-6 py-4 text-slate-600 max-w-[200px] italic">Forgot to tap out; adjusted by manager</td>
                                              </tr>
                                          </tbody>
                                      </table>
                                  ) : (
                                      <table className="min-w-full divide-y divide-slate-100">
                                          <thead className="bg-slate-50/50 text-left">
                                              <tr>
                                                  <th className="px-6 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-left pl-10">Date</th>
                                                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-left">Shift</th>
                                                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">In</th>
                                                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Out</th>
                                                  <th className="px-6 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-left">Remarks</th>
                                              </tr>
                                          </thead>
                                          <tbody className="divide-y divide-slate-50 font-bold">
                                              <tr className="hover:bg-slate-50/50 transition-colors text-xs text-left">
                                                  <td className="px-6 py-3 text-slate-700 pl-10">{selectedDocument.date}</td>
                                                  <td className="px-4 py-3 text-slate-500 font-medium">8:00 AM - 5:00 PM</td>
                                                  <td className="px-4 py-3 font-mono text-slate-700 text-center">08:00 AM</td>
                                                  <td className="px-4 py-3 font-mono text-slate-700 text-center">05:00 PM</td>
                                                  <td className="px-6 py-3 text-slate-600 italic font-medium">Regular log entry</td>
                                              </tr>
                                          </tbody>
                                      </table>
                                  )}
                              </div>
                          </div>

                          <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end shrink-0">
                              <button
                                  onClick={() => setSelectedDocument(null)}
                                  className="px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
                              >
                                  Close Viewer
                              </button>
                          </div>
                      </motion.div>
              </div>
          )}
      </AnimatePresence>

      {/* Audit History Modal */}
      <Modal isOpen={showAuditHistory} onClose={() => setShowAuditHistory(false)} className="max-w-2xl">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                <HistoryIcon size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Audit History</h3>
                <p className="text-xs text-slate-500 font-medium">Tracking all manual overrides and record adjustments</p>
              </div>
            </div>
            <button onClick={() => setShowAuditHistory(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="py-12 text-center">
            <HistoryIcon size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-500 font-bold">No history available for this period.</p>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default TimekeepingDetail;
