import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  Table as TableIcon, 
  LayoutGrid, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Plus,
  Filter,
  Download,
  CalendarDays,
  User,
  Building2,
  FileText,
  ChevronDown,
  Check,
  Timer,
  Moon
} from 'lucide-react';

// --- MOCK DATA ---

type AttendanceStatus = 'present' | 'late' | 'absent' | 'leave' | 'holiday' | 'pending' | 'overtime';

interface DailyRecord {
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  timeIn?: string;
  timeOut?: string;
  hours?: number;
  scheduledIn?: string;
  scheduledOut?: string;
  scheduledHours?: number;
  note?: string;
  overtimeHours?: number;
}

const ATTENDANCE_DATA: DailyRecord[] = [
  { 
    date: '2025-08-01', 
    status: 'present', 
    timeIn: '07:55 AM', 
    timeOut: '05:01 PM', 
    hours: 8, 
    scheduledIn: '08:00 AM', 
    scheduledOut: '05:00 PM', 
    scheduledHours: 8 
  },
  { 
    date: '2025-08-04', 
    status: 'overtime', 
    timeIn: '08:00 AM', 
    timeOut: '08:30 PM', 
    hours: 11.5, 
    scheduledIn: '08:00 AM', 
    scheduledOut: '05:00 PM', 
    scheduledHours: 8,
    overtimeHours: 3.5
  },
  { 
    date: '2025-08-05', 
    status: 'late', 
    timeIn: '09:15 AM', 
    timeOut: '06:15 PM', 
    hours: 8, // Worked full hours but late in
    scheduledIn: '08:00 AM', 
    scheduledOut: '05:00 PM', 
    scheduledHours: 8 
  },
  { 
    date: '2025-08-06', 
    status: 'present', 
    timeIn: '07:58 AM', 
    timeOut: '05:05 PM', 
    hours: 8, 
    scheduledIn: '08:00 AM', 
    scheduledOut: '05:00 PM', 
    scheduledHours: 8 
  },
  { 
    date: '2025-08-07', 
    status: 'leave', 
    timeIn: '-', 
    timeOut: '-', 
    hours: 0, 
    scheduledIn: '08:00 AM', 
    scheduledOut: '05:00 PM', 
    scheduledHours: 8,
    note: 'Sick Leave (Approved)' 
  },
  { 
    date: '2025-08-08', 
    status: 'absent', 
    timeIn: '-', 
    timeOut: '-', 
    hours: 0, 
    scheduledIn: '08:00 AM', 
    scheduledOut: '05:00 PM', 
    scheduledHours: 8 
  },
  { 
    date: '2025-08-11', 
    status: 'present', 
    timeIn: '08:00 AM', 
    timeOut: '05:00 PM', 
    hours: 8, 
    scheduledIn: '08:00 AM', 
    scheduledOut: '05:00 PM', 
    scheduledHours: 8 
  },
  { 
    date: '2025-08-12', 
    status: 'pending', 
    timeIn: '-', 
    timeOut: '-', 
    hours: 0, 
    scheduledIn: '08:00 AM', 
    scheduledOut: '05:00 PM', 
    scheduledHours: 8 
  },
  { 
    date: '2025-08-25', 
    status: 'holiday', 
    timeIn: '-', 
    timeOut: '-', 
    hours: 0, 
    scheduledIn: '08:00 AM', 
    scheduledOut: '05:00 PM', 
    scheduledHours: 8,
    note: 'National Heroes Day' 
  },
  {
    date: '2025-10-01',
    status: 'present',
    timeIn: '07:33 AM',
    timeOut: '06:01 PM',
    hours: 10.00,
    scheduledIn: '08:00 AM',
    scheduledOut: '06:00 PM',
    scheduledHours: 10.00
  },
  {
    date: '2025-10-02',
    status: 'late',
    timeIn: '08:30 AM',
    timeOut: '06:01 PM',
    hours: 9.30,
    scheduledIn: '08:00 AM',
    scheduledOut: '06:00 PM',
    scheduledHours: 10.00
  }
];

const PAST_ODTR_RECORDS = [
  { id: 1, date: 'July 25, 2025', status: 'Pending', range: 'July 25, 2025' },
  { id: 2, date: 'July 10, 2025', status: 'Approved', range: 'July 10, 2025' },
  { id: 3, date: 'June 15, 2025', status: 'Approved', range: 'June 15, 2025' },
];

const AttendanceTab: React.FC = () => {
  const [viewMode, setViewMode] = useState<'year' | 'month' | 'list'>('year');
  const [currentDate, setCurrentDate] = useState(new Date(2025, 7, 1)); // August 2025
  const [expandedRecord, setExpandedRecord] = useState<number | null>(null);
  const MotionDiv = motion.div as any;
  
  // Hover Card State
  const [hoveredData, setHoveredData] = useState<{ record: DailyRecord; x: number; y: number } | null>(null);

  // Helper to get status color
  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case 'present': return 'bg-emerald-600'; // Darker for small squares
      case 'overtime': return 'bg-indigo-600';
      case 'late': return 'bg-amber-400';
      case 'absent': return 'bg-rose-500';
      case 'leave': return 'bg-purple-500';
      case 'holiday': return 'bg-pink-500';
      case 'pending': return 'bg-sky-400';
      default: return 'bg-slate-200';
    }
  };

  const getStatusLabel = (status: AttendanceStatus) => {
    switch (status) {
      case 'present': return 'On Time';
      case 'overtime': return 'Overtime';
      case 'late': return 'Undertime';
      case 'absent': return 'Absent';
      case 'leave': return 'On Leave';
      case 'holiday': return 'Holiday';
      case 'pending': return 'Pending Approval';
      default: return '';
    }
  };

  const handleMouseEnterNode = (e: React.MouseEvent, record: DailyRecord) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // Calculate position: center above the node.
    // NOTE: For fixed positioning, we use the viewport coordinates (rect.left, rect.top) directly.
    // We do NOT add window.scrollY, as 'fixed' is relative to the viewport window, not the document.
    const x = rect.left + rect.width / 2;
    const y = rect.top; 
    setHoveredData({ record, x, y });
  };

  const handleMouseLeaveNode = () => {
    setHoveredData(null);
  };

  // --- HOVER CARD COMPONENT ---
  const AttendanceHoverCard = ({ data, x, y }: { data: DailyRecord, x: number, y: number }) => {
    const formattedDate = new Date(data.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    
    let badgeStyle = 'bg-slate-100 text-slate-600';
    let label = 'Unknown';
    let accentColor = 'text-slate-900';

    switch (data.status) {
      case 'present':
        badgeStyle = 'bg-emerald-100 text-emerald-700';
        label = 'On Time';
        accentColor = 'text-emerald-600';
        break;
      case 'late':
        badgeStyle = 'bg-amber-100 text-amber-700';
        label = 'Undertime';
        accentColor = 'text-amber-600';
        break;
      case 'absent':
        badgeStyle = 'bg-rose-100 text-rose-700';
        label = 'Absent';
        accentColor = 'text-rose-600';
        break;
      case 'leave':
        badgeStyle = 'bg-purple-100 text-purple-700';
        label = 'On Leave';
        accentColor = 'text-purple-600';
        break;
      case 'holiday':
        badgeStyle = 'bg-pink-100 text-pink-700';
        label = 'Holiday';
        accentColor = 'text-pink-600';
        break;
      case 'overtime':
        badgeStyle = 'bg-indigo-100 text-indigo-700';
        label = 'Overtime';
        accentColor = 'text-indigo-600';
        break;
      case 'pending':
        badgeStyle = 'bg-sky-100 text-sky-700';
        label = 'Pending Approval';
        accentColor = 'text-sky-600';
        break;
    }

    return (
      <div 
        className="fixed z-50 w-72 bg-white rounded-xl shadow-2xl border border-slate-100 pointer-events-none transform -translate-x-1/2 -translate-y-full mt-[-12px]"
        style={{ left: x, top: y }}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-50 flex justify-between items-center">
          <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide flex items-center gap-1.5 ${badgeStyle}`}>
            {data.status === 'present' && <CheckCircle2 size={12} />}
            {data.status === 'late' && <Clock size={12} />}
            {data.status === 'absent' && <XCircle size={12} />}
            {data.status === 'leave' && <CalendarDays size={12} />}
            {data.status === 'holiday' && <Check size={12} />}
            {data.status === 'overtime' && <Timer size={12} />}
            {label}
          </div>
          <span className="text-xs font-bold text-slate-500">{formattedDate}</span>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          
          {data.note && (
            <div className="bg-slate-50 p-2.5 rounded-lg text-xs text-slate-600 italic border border-slate-100 mb-2">
              "{data.note}"
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* Scheduled Column */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div> Scheduled
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium">Time In</span>
                  <span className="font-bold text-slate-700">{data.scheduledIn || '8:00 AM'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium">Time Out</span>
                  <span className="font-bold text-slate-700">{data.scheduledOut || '5:00 PM'}</span>
                </div>
                <div className="flex justify-between text-xs pt-1.5 border-t border-slate-50 mt-1">
                  <span className="text-slate-400 font-bold">Total Hours</span>
                  <span className="font-bold text-slate-900">{data.scheduledHours?.toFixed(2) || '8.00'}</span>
                </div>
              </div>
            </div>

            {/* Actual Column */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <div className={`w-1.5 h-1.5 rounded-full ${data.status === 'absent' ? 'bg-rose-500' : 'bg-emerald-500'}`}></div> Actual
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium">Time In</span>
                  <span className={`font-bold ${data.status === 'late' ? 'text-amber-600' : 'text-slate-700'}`}>
                    {data.timeIn !== '-' ? data.timeIn : '-------'}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium">Time Out</span>
                  <span className="font-bold text-slate-700">
                    {data.timeOut !== '-' ? data.timeOut : '-------'}
                  </span>
                </div>
                <div className="flex justify-between text-xs pt-1.5 border-t border-slate-50 mt-1">
                  <span className="text-slate-400 font-bold">Total Hours</span>
                  <span className={`font-bold ${accentColor}`}>
                    {data.hours !== undefined ? data.hours.toFixed(2) : '0.00'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Overtime Extra */}
          {data.overtimeHours && data.overtimeHours > 0 && (
             <div className="bg-indigo-50 rounded-lg p-2.5 flex justify-between items-center border border-indigo-100">
                <div className="flex items-center gap-2">
                   <div className="p-1 bg-white rounded text-indigo-600 shadow-sm"><Timer size={10} /></div>
                   <span className="text-xs font-bold text-indigo-900">Overtime Hours</span>
                </div>
                <span className="text-sm font-mono font-bold text-indigo-700">{data.overtimeHours.toFixed(2)}</span>
             </div>
          )}
        </div>
        
        {/* Arrow at bottom */}
        <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-white border-r border-b border-slate-100"></div>
      </div>
    );
  };

  // --- RENDERERS ---

  const renderLegend = () => (
    <div className="flex flex-wrap gap-x-6 gap-y-2 items-center">
      {['present', 'late', 'absent', 'leave', 'holiday', 'pending'].map((status) => (
        <div key={status} className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded ${getStatusColor(status as AttendanceStatus)}`}></div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{getStatusLabel(status as AttendanceStatus)}</span>
        </div>
      ))}
    </div>
  );

  const renderYearHeatmap = () => {
    const year = 2025;
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    
    // Helper to format date key
    const getDateKey = (date: Date) => {
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    };

    // Generate weeks array
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];
    
    // Align start to the preceding Sunday if Jan 1 is not Sunday
    const startOffset = startDate.getDay();
    let currentDateIterator = new Date(startDate);
    currentDateIterator.setDate(currentDateIterator.getDate() - startOffset);

    // Iterate until we cover the whole year
    // We add a safety break to prevent infinite loops if something goes wrong
    let safety = 0;
    while ((currentDateIterator <= endDate || currentWeek.length > 0) && safety < 400) {
        currentWeek.push(new Date(currentDateIterator));
        
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
            if (currentDateIterator > endDate) break;
        }
        currentDateIterator.setDate(currentDateIterator.getDate() + 1);
        safety++;
    }

    return (
        <div className="w-full overflow-x-auto mt-6 pb-2">
            <div className="min-w-[800px] select-none">
                {/* Headers */}
                <div className="flex pl-8 mb-4 h-4 relative">
                    {weeks.map((week, wIdx) => {
                        const firstDay = week.find(d => d.getDate() === 1);
                        if (firstDay && firstDay.getFullYear() === year) {
                            return (
                                <div key={wIdx} className="absolute text-xs font-bold text-slate-400 uppercase" style={{ left: `calc(${wIdx * 16}px + ${wIdx * 4}px)` }}>
                                    {firstDay.toLocaleString('default', { month: 'short' })}
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
                
                <div className="flex">
                    {/* Y-Axis Labels */}
                    <div className="flex flex-col justify-between pr-2 py-[2px] text-[10px] font-bold text-slate-300 h-[110px] w-8 text-right">
                        <span></span>
                        <span>Mon</span>
                        <span></span>
                        <span>Wed</span>
                        <span></span>
                        <span>Fri</span>
                        <span></span>
                    </div>

                    {/* Heatmap Grid */}
                    <div className="flex gap-1">
                        {weeks.map((week, wIdx) => (
                            <div key={wIdx} className="flex flex-col gap-1">
                                {week.map((day, dIdx) => {
                                    const dateKey = getDateKey(day);
                                    const isCurrentYear = day.getFullYear() === year;
                                    
                                    // Find record or mock
                                    let record = ATTENDANCE_DATA.find(r => r.date === dateKey);
                                    
                                    // Mock Generator to populate the view for demo
                                    if (!record && isCurrentYear && day < new Date('2025-10-15')) {
                                        const isWeekend = dIdx === 0 || dIdx === 6;
                                        if (!isWeekend) {
                                            // Seeded randomish based on date for consistency during re-renders
                                            const seed = day.getDate() + day.getMonth(); 
                                            const rand = (seed % 100) / 100;
                                            
                                            let mockStatus: AttendanceStatus = 'present';
                                            if (rand > 0.85) mockStatus = 'late';
                                            if (rand > 0.95) mockStatus = 'leave';
                                            if (rand > 0.98) mockStatus = 'absent';
                                            
                                            // Specific holidays mock
                                            if ((day.getMonth() === 0 && day.getDate() === 1) || (day.getMonth() === 11 && day.getDate() === 25)) {
                                                mockStatus = 'holiday';
                                            }

                                            record = { 
                                                date: dateKey, 
                                                status: mockStatus, 
                                                timeIn: '08:00 AM', 
                                                timeOut: '05:00 PM', 
                                                hours: 8 
                                            };
                                        }
                                    }

                                    if (!isCurrentYear) {
                                        return <div key={dIdx} className="w-4 h-4 rounded-sm bg-transparent" />;
                                    }

                                    return (
                                        <div 
                                            key={dIdx}
                                            className={`w-4 h-4 rounded-sm transition-all relative cursor-pointer ${record ? getStatusColor(record.status) : 'bg-slate-100 hover:bg-slate-200'}`}
                                            onMouseEnter={(e) => record && handleMouseEnterNode(e, record)}
                                            onMouseLeave={handleMouseLeaveNode}
                                        />
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
  };

  const renderMonthView = () => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    
    return (
      <div className="w-full">
        <div className="grid grid-cols-7 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center text-xs font-bold text-slate-400 uppercase py-2">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} className="min-h-[80px]" />)}
          {days.map(d => {
            const dateStr = `2025-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
            const record = ATTENDANCE_DATA.find(r => r.date === dateStr);
            const isToday = d === 25; // Mock today

            return (
              <div 
                key={d} 
                className={`min-h-[100px] border rounded-xl p-2 relative group transition-all hover:shadow-md cursor-pointer ${
                  record ? 'bg-white border-slate-200' : 'bg-slate-50/50 border-slate-100'
                } ${isToday ? 'ring-2 ring-indigo-500 ring-offset-1' : ''}`}
                onMouseEnter={(e) => record && handleMouseEnterNode(e, record)}
                onMouseLeave={handleMouseLeaveNode}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-sm font-bold ${isToday ? 'text-indigo-600' : 'text-slate-700'}`}>{d}</span>
                  {record && (
                    <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(record.status)}`}></div>
                  )}
                </div>
                
                {record ? (
                  <div className="mt-4 space-y-1">
                    {record.status === 'present' || record.status === 'late' || record.status === 'overtime' ? (
                      <>
                        <div className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded w-fit">IN: {record.timeIn}</div>
                        <div className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded w-fit">OUT: {record.timeOut}</div>
                      </>
                    ) : (
                      <div className={`text-[10px] font-bold uppercase tracking-wider mt-2 px-2 py-1 rounded w-fit ${
                        record.status === 'holiday' ? 'bg-pink-50 text-pink-600' : 
                        record.status === 'absent' ? 'bg-rose-50 text-rose-600' : 
                        record.status === 'leave' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {record.status}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded hover:bg-indigo-100 transition-colors w-full">
                       + Add Log
                     </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderListView = () => (
    <div className="border border-slate-200 rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left">
          <tr>
            <th className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-widest">Date</th>
            <th className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-widest">Status</th>
            <th className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-widest">Time In</th>
            <th className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-widest">Time Out</th>
            <th className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-widest text-right">Hours</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {ATTENDANCE_DATA.map((record, i) => (
            <tr key={i} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-bold text-slate-700">{record.date}</td>
              <td className="px-6 py-4">
                <span className={`flex items-center gap-2 text-xs font-bold uppercase ${
                  record.status === 'present' ? 'text-emerald-600' : 
                  record.status === 'late' ? 'text-amber-600' : 
                  record.status === 'absent' ? 'text-rose-600' : 
                  'text-slate-500'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(record.status)}`}></div>
                  {record.status}
                </span>
              </td>
              <td className="px-6 py-4 font-mono text-slate-600">{record.timeIn}</td>
              <td className="px-6 py-4 font-mono text-slate-600">{record.timeOut}</td>
              <td className="px-6 py-4 text-right font-bold text-slate-800">{record.hours?.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in relative">
      
      {/* Attendance Overview Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm relative z-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Attendance Overview</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-indigo-600 tracking-tight">117.5</span>
              <span className="text-xl font-bold text-slate-400">/ 120 Days</span>
            </div>
            <p className="text-xs text-slate-500 font-bold mt-2 uppercase tracking-wide">Assigned as <span className="text-indigo-600">Shift 8</span></p>
          </div>

          <div className="flex flex-col items-end gap-4">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button onClick={() => setViewMode('year')} className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${viewMode === 'year' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                <LayoutGrid size={14} /> Year
              </button>
              <button onClick={() => setViewMode('month')} className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${viewMode === 'month' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                <CalendarIcon size={14} /> Month
              </button>
              <button onClick={() => setViewMode('list')} className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                <TableIcon size={14} /> List
              </button>
            </div>
            {viewMode === 'month' && (
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1">
                <button className="p-1 hover:bg-slate-100 rounded text-slate-500"><ChevronLeft size={16} /></button>
                <span className="text-xs font-bold text-slate-700 w-24 text-center">August 2025</span>
                <button className="p-1 hover:bg-slate-100 rounded text-slate-500"><ChevronRight size={16} /></button>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Attendance Legend</div>
          {renderLegend()}
        </div>

        {/* Dynamic View Content */}
        <div className="min-h-[300px]">
          {viewMode === 'year' && renderYearHeatmap()}
          {viewMode === 'month' && renderMonthView()}
          {viewMode === 'list' && renderListView()}
        </div>
      </div>

      {/* Online Daily Tracking Record (ODTR) Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900">Current Online Daily Tracking Record</h3>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95">
            <Plus size={16} /> Add ODTR
          </button>
        </div>

        {/* Progress Stepper Card */}
        <div className="bg-white border border-slate-100 rounded-3xl p-10 shadow-sm">
          <div className="relative max-w-3xl mx-auto mb-12">
            {/* Connecting Lines */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full"></div>
            <div className="absolute top-1/2 left-0 w-1/2 h-1 bg-indigo-600 -translate-y-1/2 rounded-full transition-all duration-1000 ease-out"></div>
            
            {/* Steps */}
            <div className="relative flex justify-between">
              {/* Step 1: Submission */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center z-10 shadow-lg shadow-slate-200 ring-4 ring-white">
                  <Check size={18} strokeWidth={3} />
                </div>
                <span className="text-xs font-bold text-slate-900">Submission</span>
              </div>

              {/* Step 2: Approval */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white border-[3px] border-indigo-600 text-indigo-600 flex items-center justify-center z-10 shadow-lg shadow-indigo-100 ring-4 ring-white">
                  <div className="w-3 h-3 bg-indigo-600 rounded-full animate-pulse"></div>
                </div>
                <span className="text-xs font-bold text-indigo-600">Approval</span>
              </div>

              {/* Step 3: Acceptance */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center z-10 ring-4 ring-white">
                  <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                </div>
                <span className="text-xs font-bold text-slate-300">Acceptance</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Acceptance Status Box */}
            <div className="lg:col-span-1 bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col justify-center">
               <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Pending Approval</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Stage 2 of 3</p>
                  </div>
               </div>
               <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    <span>Submitted by You</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-900 font-bold">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                    <span>Waiting for HR Manager</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                    <span>Waiting for IT Manager</span>
                  </div>
               </div>
            </div>

            {/* ODTR Details Box */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-0 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                    <h4 className="text-sm font-bold text-slate-800">ODTR Details</h4>
                    <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-lg text-[10px] font-bold uppercase border border-amber-100">Pending Review</span>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-2 gap-8 mb-6">
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Status</label>
                            <div className="flex items-center gap-2">
                                <AlertCircle size={16} className="text-amber-500" />
                                <span className="text-lg font-bold text-slate-900">Pending</span>
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Date Created</label>
                            <div className="flex items-center gap-2">
                                <CalendarDays size={16} className="text-slate-400" />
                                <span className="text-sm font-bold text-slate-700">July 25, 2025</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Department Manager</label>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">JD</div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">John Doe</p>
                                    <p className="text-[10px] text-slate-500">IT Department Lead</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">HR Approver</label>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">?</div>
                                <div>
                                    <p className="text-sm font-bold text-slate-400 italic">Pending Assignment</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Past ODTR Records (History) */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Past Online Daily Tracking Records</h3>
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="space-y-4">
                {PAST_ODTR_RECORDS.map((record) => (
                    <div key={record.id} className="border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-all group">
                        <button 
                            onClick={() => setExpandedRecord(expandedRecord === record.id ? null : record.id)}
                            className="w-full flex items-center justify-between p-5 bg-white hover:bg-slate-50/50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                    record.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                                }`}>
                                    <Clock size={20} />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-bold text-slate-900 text-sm">{record.date}</h4>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">Range: {record.range}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                                    record.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                }`}>
                                    {record.status}
                                </span>
                                <div className={`p-1 rounded-full transition-transform duration-300 ${expandedRecord === record.id ? 'rotate-180 bg-slate-200' : ''}`}>
                                    <ChevronDown size={16} className="text-slate-400" />
                                </div>
                            </div>
                        </button>
                        
                        <AnimatePresence>
                            {expandedRecord === record.id && (
                                <MotionDiv 
                                    initial={{ height: 0 }} 
                                    animate={{ height: 'auto' }} 
                                    exit={{ height: 0 }} 
                                    className="overflow-hidden bg-slate-50/50 border-t border-slate-100"
                                >
                                    <div className="p-6 grid grid-cols-2 gap-6 text-sm">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Time In</label>
                                            <p className="font-mono font-bold text-slate-700">08:00 AM</p>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Time Out</label>
                                            <p className="font-mono font-bold text-slate-700">05:00 PM</p>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Reason</label>
                                            <p className="text-slate-600 italic">"Forgot to clock out due to urgent client meeting off-site."</p>
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

      {/* Render Portal/Floating Tooltip if Hovered */}
      <AnimatePresence>
        {hoveredData && (
          <MotionDiv
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <AttendanceHoverCard data={hoveredData.record} x={hoveredData.x} y={hoveredData.y} />
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AttendanceTab;