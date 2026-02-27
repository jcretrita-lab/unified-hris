
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Mail, 
  Phone, 
  CheckCircle2, 
  X, 
  ChevronDown, 
  ChevronUp,
  Briefcase,
  Building2,
  CalendarDays,
  User,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data for specific employee
const MOCK_DETAILS = {
  id: 'emp-1',
  name: 'James Cordon',
  role: 'IT Developer Intern',
  department: 'IT Department',
  email: 'james.c@company.com',
  phone: '+1 (555) 123-4567',
  avatar: 'JC',
  status: 'Active',
  currentShift: {
    code: 'Shift 8',
    time: '8:00 AM - 6:00 PM',
    hours: 9,
    cutoff: 'Aug 6 - Aug 20',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    notes: 'Standard Internship Shift'
  },
  history: [
     { id: 'sh-1', from: 'Shift 8', to: 'Shift 9', reason: 'Team Re-alignment', status: 'Approved', date: 'Jan 15, 2025', effective: 'Jan 16, 2025' },
     { id: 'sh-2', from: 'Shift 9', to: 'Shift 8', reason: 'School Schedule Conflict', status: 'Rejected', date: 'Dec 01, 2024', effective: '-' }
  ]
};

const EmployeeScheduleDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expandedHistory, setExpandedHistory] = useState<string | null>(null);
  const MotionDiv = motion.div as any;

  // Use mock data (in real app, fetch based on ID)
  const employee = MOCK_DETAILS;

  // Helper for Mini Calendar (reused logic)
  const renderMiniCalendar = () => {
      const days = Array.from({ length: 31 }, (_, i) => i + 1);
      const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
      const highlightedDays = [6, 7, 8, 9, 10, 13, 14, 15, 16, 17, 20]; // Mock workdays
      
      return (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-slate-900">August 2025</span>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Work Day</span>
                  </div>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekDays.map(d => <div key={d} className="text-center text-[10px] font-bold text-slate-400 uppercase">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                  <div /><div /> {/* Offset for start of month */}
                  {days.map(d => {
                      const isHighlighted = highlightedDays.includes(d);
                      return (
                          <div key={d} className={`h-8 w-full flex items-center justify-center text-xs font-bold rounded-lg transition-all ${isHighlighted ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-600 hover:bg-slate-50'}`}>
                              {d}
                          </div>
                      );
                  })}
              </div>
          </div>
      );
  };

  return (
    <div className="space-y-8 animate-in fade-in">
        {/* Navigation */}
        <div>
            <button 
                onClick={() => navigate('/manage/schedule')}
                className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors mb-4 group"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back to Schedule List
            </button>
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Schedule Details</h1>
                    <p className="text-slate-500 font-medium mt-1">Viewing shift configuration for {employee.name}.</p>
                </div>
                <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                    Assign New Shift
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Employee Info */}
            <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                    <div className="flex flex-col items-center text-center mb-6">
                        <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-600 mb-4 border-4 border-white shadow-md">
                            {employee.avatar}
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">{employee.name}</h2>
                        <p className="text-sm text-slate-500 font-medium">{employee.role}</p>
                        <span className="mt-2 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-xs font-bold uppercase tracking-wide">
                            {employee.status}
                        </span>
                    </div>
                    
                    <div className="space-y-4 pt-6 border-t border-slate-100">
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                            <Building2 size={16} className="text-slate-400" />
                            {employee.department}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                            <Mail size={16} className="text-slate-400" />
                            {employee.email}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                            <Phone size={16} className="text-slate-400" />
                            {employee.phone}
                        </div>
                    </div>
                </div>

                {renderMiniCalendar()}
            </div>

            {/* Right Column: Shift Details & History */}
            <div className="lg:col-span-2 space-y-8">
                {/* Current Shift Card */}
                <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Clock size={20} className="text-indigo-600" /> Current Configuration
                        </h3>
                        <span className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-indigo-100 uppercase tracking-wider">Active</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Shift Code</label>
                            <div className="text-2xl font-bold text-slate-900">{employee.currentShift.code}</div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Schedule Time</label>
                            <div className="text-xl font-medium text-slate-700 font-mono">{employee.currentShift.time}</div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Daily Work Hours</label>
                            <div className="text-base font-bold text-slate-700">{employee.currentShift.hours} Hours</div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Work Days</label>
                            <div className="flex gap-1.5">
                                {employee.currentShift.days.map(d => (
                                    <span key={d} className="px-2 py-1 bg-slate-100 rounded text-xs font-bold text-slate-600">{d}</span>
                                ))}
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Notes</label>
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-600 italic">
                                "{employee.currentShift.notes}"
                            </div>
                        </div>
                    </div>
                </div>

                {/* Shift History */}
                <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <History size={20} className="text-indigo-600" /> Shift History
                    </h3>
                    <div className="space-y-4">
                        {employee.history.map((hist) => (
                            <div key={hist.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md">
                                <button 
                                    onClick={() => setExpandedHistory(expandedHistory === hist.id ? null : hist.id)}
                                    className="w-full flex items-center justify-between p-5 hover:bg-slate-50/50 transition-colors group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${hist.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                            {hist.status === 'Approved' ? <CheckCircle2 size={18} /> : <X size={18} />}
                                        </div>
                                        <div className="text-left">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="text-sm font-bold text-slate-900">Change to {hist.to}</h4>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${hist.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                                                    {hist.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 font-medium">Applied on {hist.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs font-bold text-slate-400">Effective: {hist.effective}</span>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${expandedHistory === hist.id ? 'bg-slate-100 text-slate-600' : 'text-slate-300'}`}>
                                            {expandedHistory === hist.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                        </div>
                                    </div>
                                </button>
                                
                                <AnimatePresence>
                                    {expandedHistory === hist.id && (
                                        <MotionDiv initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="border-t border-slate-100">
                                            <div className="p-6 bg-slate-50/30 grid grid-cols-2 gap-6">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Previous Shift</label>
                                                    <p className="text-sm font-bold text-slate-700">{hist.from}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Requested Shift</label>
                                                    <p className="text-sm font-bold text-indigo-700">{hist.to}</p>
                                                </div>
                                                <div className="col-span-2 space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reason</label>
                                                    <p className="text-sm text-slate-600 italic">"{hist.reason}"</p>
                                                </div>
                                            </div>
                                        </MotionDiv>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default EmployeeScheduleDetail;
