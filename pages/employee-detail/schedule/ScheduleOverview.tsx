
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  Clock, 
  CalendarDays
} from 'lucide-react';

const ScheduleOverview: React.FC = () => {
  const [scheduleViewMode, setScheduleViewMode] = useState<'Day' | 'Week' | 'Month'>('Week');
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
  const MotionDiv = motion.div as any;

  const renderScheduleGrid = () => {
      if (scheduleViewMode === 'Day') {
          return (
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                  <div className="flex divide-x divide-slate-100 border-b border-slate-100">
                      <div className="w-20 p-4 bg-slate-50 text-xs font-bold text-slate-500 flex items-center justify-center">Time</div>
                      <div className="flex-1 p-4 bg-slate-50 text-xs font-bold text-slate-500 text-center uppercase tracking-widest">Wednesday, Aug 06</div>
                  </div>
                  <div className="divide-y divide-slate-50 relative">
                      {Array.from({ length: 13 }).map((_, i) => { 
                          const hour = i + 6;
                          const isWorkHour = hour >= 8 && hour < 17;
                          return (
                              <div key={i} className="flex divide-x divide-slate-50 h-16 group hover:bg-slate-50/50">
                                  <div className="w-20 p-2 text-xs font-medium text-slate-400 text-center flex items-start justify-center pt-3">
                                      {hour > 12 ? hour - 12 : hour} {hour >= 12 ? 'PM' : 'AM'}
                                  </div>
                                  <div className="flex-1 relative">
                                      {isWorkHour && (
                                          <div className="absolute inset-x-2 inset-y-1 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-center">
                                              <span className="text-xs font-bold text-indigo-700">Work Shift</span>
                                          </div>
                                      )}
                                  </div>
                              </div>
                          );
                      })}
                  </div>
              </div>
          );
      }

      if (scheduleViewMode === 'Month') {
          return (
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                  <div className="grid grid-cols-7 divide-x divide-slate-100 bg-slate-50 border-b border-slate-200">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                          <div key={d} className="p-3 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">{d}</div>
                      ))}
                  </div>
                  <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 bg-white">
                      {Array.from({ length: 35 }).map((_, i) => {
                          const day = i - 4; 
                          const isValid = day > 0 && day <= 31;
                          const isWeekend = (i % 7 === 0) || (i % 7 === 6);
                          return (
                              <div key={i} className={`min-h-[100px] p-2 ${!isValid ? 'bg-slate-50/50' : ''}`}>
                                  {isValid && (
                                      <>
                                          <span className={`text-xs font-bold ${isWeekend ? 'text-slate-400' : 'text-slate-700'}`}>{day}</span>
                                          {!isWeekend && (
                                              <div className="mt-2 text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-1 rounded border border-emerald-100 font-bold truncate">
                                                  8:00 AM - 5:00 PM
                                              </div>
                                          )}
                                      </>
                                  )}
                              </div>
                          );
                      })}
                  </div>
              </div>
          );
      }

      // Week View
      return (
        <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-8 divide-x divide-slate-100 bg-slate-50 border-b border-slate-200">
                <div className="p-4 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">Date</div>
                {['6 AM', '8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM'].map(t => (
                <div key={t} className="p-4 text-center text-xs font-bold text-slate-400">{t}</div>
                ))}
            </div>
            <div className="divide-y divide-slate-100">
                {[
                { day: 'WED', date: 'Aug 06', type: 'Work', label: 'Full Day / Onsite', time: '8:00 AM - 6:00 PM', color: 'bg-emerald-100 border-emerald-200 text-emerald-800' },
                { day: 'THU', date: 'Aug 07', type: 'Work', label: 'Full Day / WFH', time: '8:00 AM - 6:00 PM', color: 'bg-amber-100 border-amber-200 text-amber-800' },
                { day: 'FRI', date: 'Aug 08', type: 'Work', label: 'Full Day / Onsite', time: '8:00 AM - 6:00 PM', color: 'bg-emerald-100 border-emerald-200 text-emerald-800' },
                { day: 'SAT', date: 'Aug 09', type: 'Leave', label: 'On Leave - Maternal', time: 'All Day', color: 'bg-purple-100 border-purple-200 text-purple-800' },
                { day: 'SUN', date: 'Aug 10', type: 'Holiday', label: 'National Holiday', time: 'All Day', color: 'bg-blue-100 border-blue-200 text-blue-800' },
                { day: 'MON', date: 'Aug 11', type: 'Work', label: 'Full Day / Onsite', time: '8:00 AM - 6:00 PM', color: 'bg-emerald-100 border-emerald-200 text-emerald-800' },
                ].map((row, i) => (
                <div key={i} className="grid grid-cols-8 divide-x divide-slate-50 min-h-[80px] group hover:bg-slate-50 transition-colors">
                    <div className="p-4 flex flex-col justify-center items-center">
                    <span className="text-[10px] font-bold text-slate-400">{row.day}</span>
                    <span className="text-sm font-bold text-slate-800">{row.date}</span>
                    </div>
                    {row.type === 'Work' ? (
                    <>
                        <div className="col-span-1"></div>
                        <div className="col-span-5 p-2 relative">
                        <div className={`w-full h-full rounded-xl border ${row.color} p-3 flex flex-col justify-center shadow-sm`}>
                            <span className="text-xs font-bold">{row.label}</span>
                            <span className="text-[10px] opacity-80 font-mono mt-1">{row.time}</span>
                        </div>
                        </div>
                        <div className="col-span-1"></div>
                    </>
                    ) : (
                    <div className="col-span-7 p-2 relative">
                        <div className={`w-full h-full rounded-xl border ${row.color} p-3 flex items-center shadow-sm`}>
                        <span className="text-xs font-bold">{row.label}</span>
                        </div>
                    </div>
                    )}
                </div>
                ))}
            </div>
        </div>
      );
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm animate-in fade-in">
      {/* Calendar Controls */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div className="flex gap-12">
            <div>
                <span className="text-xs text-slate-500 font-bold">Current Shift</span>
                <div className="flex items-center gap-2 mt-1 text-xl font-bold text-slate-800">
                    <Clock className="text-indigo-600" />
                    8:00 AM - 6:00 PM
                </div>
                <div className="text-xs text-slate-400 mt-1">Assigned as <span className="text-indigo-600 font-bold">Shift 8</span></div>
            </div>
            <div>
                <span className="text-xs text-slate-500 font-bold">Current Cutoff</span>
                <div className="flex items-center gap-2 mt-1 text-xl font-bold text-slate-800">
                    <CalendarDays className="text-indigo-600" />
                    July 6 - Aug 20
                </div>
            </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
                onClick={() => setIsViewDropdownOpen(!isViewDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm w-36 justify-between"
            >
              {scheduleViewMode} View <ChevronDown size={14} />
            </button>
            
            <AnimatePresence>
                {isViewDropdownOpen && (
                    <MotionDiv 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute right-0 top-full mt-2 w-36 bg-white border border-slate-100 rounded-xl shadow-xl z-20 overflow-hidden"
                    >
                        {['Day', 'Week', 'Month'].map(view => (
                            <button 
                                key={view} 
                                onClick={() => { setScheduleViewMode(view as any); setIsViewDropdownOpen(false); }}
                                className={`w-full text-left px-4 py-3 text-xs font-bold hover:bg-slate-50 transition-colors ${scheduleViewMode === view ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600'}`}
                            >
                                {view} View
                            </button>
                        ))}
                    </MotionDiv>
                )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Dynamic Grid Rendering */}
      {renderScheduleGrid()}
    </div>
  );
};

export default ScheduleOverview;
