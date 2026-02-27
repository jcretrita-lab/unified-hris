
import React, { useState, useEffect, useRef } from 'react';
import { useRequest } from '../../../context/RequestContext';
import { useAuth } from '../../../context/AuthContext';
import {
    ArrowLeft,
    ArrowRight,
    Check,
    Info,
    Plane,
    Stethoscope,
    Plus,
    List,
    Calendar,
    Eye,
    AlertCircle,
    Trash2,
    CalendarDays,
    Clock,
    ArrowDown,
    X,
    ChevronLeft,
    ChevronRight,
    Coffee,
    Flag,
    Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../../../components/Modal';

// --- MOCK DATA ---
const INITIAL_LEAVE_REQUESTS = [
    {
        id: 'lr-1',
        type: 'Vacation Leave',
        dates: ['August 24, 2025', 'August 25, 2025', 'August 26, 2025'],
        dateObjects: [24, 25, 26],
        reason: 'I want to have a vacation with my family',
        status: 'Pending Approval',
        reasonStatus: 'Waiting for HR Approval',
        appliedDate: 'August 24, 2025',
        notes: "This is employee's first leave",
        credits: 3.0,
        balanceAfter: 2.0
    },
    {
        id: 'lr-2',
        type: 'Sick Leave',
        dates: ['July 10, 2025'],
        dateObjects: [10],
        reason: 'Not feeling well',
        status: 'Approved',
        reasonStatus: 'Approved by Manager',
        appliedDate: 'July 10, 2025',
        notes: "-",
        credits: 1.0,
        balanceAfter: 14.0
    },
    {
        id: 'lr-3',
        type: 'Vacation Leave',
        // Exact string format matching toLocaleDateString('en-US')
        dates: ['February 26, 2026'],
        dateObjects: [26],
        reason: 'Personal appointment',
        status: 'Approved',
        reasonStatus: 'Approved by Manager',
        appliedDate: 'February 20, 2026',
        notes: "-",
        credits: 1.0,
        balanceAfter: 13.0
    }
];

// Detailed Attendance Database for Conflict Simulation
const MOCK_ATTENDANCE_DB: Record<string, { timeIn: string, timeOut: string, status: string, shift: string }> = {
    '2025-08-01': { timeIn: '07:55 AM', timeOut: '05:01 PM', status: 'Present', shift: '08:00 - 17:00' },
    '2025-08-04': { timeIn: '08:00 AM', timeOut: '05:00 PM', status: 'Present', shift: '08:00 - 17:00' },
    '2025-08-05': { timeIn: '08:15 AM', timeOut: '05:15 PM', status: 'Late', shift: '08:00 - 17:00' }
};

const MOCK_HOLIDAYS: Record<string, string> = {
    '2025-08-21': 'Ninoy Aquino Day',
    '2025-08-25': 'National Heroes Day',
    '2026-02-17': 'Chinese New Year', // Correctly set to 2026
};

const EMPLOYEE_SHIFT = {
    start: '08:00',
    end: '17:00',
    breakDuration: 1 // hours
};

interface LeaveEntry {
    id: string;
    startDate: string;
    endDate: string;
    isPartialDay: boolean;
    startTime: string;
    endTime: string;
    credits: number;
    breakdown: any[];
}

interface DateInfo {
    type: 'Attendance' | 'Holiday' | 'RestDay' | 'ApprovedLeave' | 'Available';
    details?: any;
    label: string;
}

// --- Custom Date Picker Component ---
const DatePicker = ({
    label,
    value,
    onChange,
    minDate,
    attendanceDb,
    existingRequests,
    setHoveredDateInfo
}: {
    label: string;
    value: string;
    onChange: (date: string) => void;
    minDate?: string;
    attendanceDb: Record<string, any>;
    existingRequests: typeof INITIAL_LEAVE_REQUESTS;
    setHoveredDateInfo: (data: { date: string, info: DateInfo, x: number, y: number } | null) => void;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(new Date());
    const containerRef = useRef<HTMLDivElement>(null);

    // Sync viewDate with value when opened or value changes
    useEffect(() => {
        if (value) setViewDate(new Date(value));
    }, [value, isOpen]);

    // Click outside listener
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
    const startDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const handleDayClick = (d: number) => {
        const dateStr = `${viewDate.getFullYear()}-${(viewDate.getMonth() + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
        onChange(dateStr);
        setIsOpen(false);
    };

    const handlePrevMonth = (e: React.MouseEvent) => {
        e.stopPropagation();
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    };

    const handleNextMonth = (e: React.MouseEvent) => {
        e.stopPropagation();
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    // Helper to check for existing approved leave on a date
    const getApprovedLeaveOnDate = (date: Date) => {
        // Must match format in INITIAL_LEAVE_REQUESTS dates array
        const formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        return existingRequests.find(req =>
            req.status === 'Approved' && req.dates.includes(formattedDate)
        );
    };

    return (
        <div className="relative" ref={containerRef}>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{label}</label>
            <div
                className="w-full border border-slate-200 p-2.5 rounded-xl bg-white text-sm font-bold text-slate-800 flex items-center justify-between cursor-pointer hover:border-indigo-300 transition-colors shadow-sm active:bg-slate-50"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={!value ? 'text-slate-400 font-medium' : ''}>
                    {value ? new Date(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Select Date'}
                </span>
                <Calendar size={16} className="text-indigo-500" />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-[60] p-4 w-80"
                    >
                        {/* Calendar Header */}
                        <div className="flex justify-between items-center mb-4">
                            <button onClick={handlePrevMonth} className="p-1 hover:bg-slate-100 rounded text-slate-500"><ChevronLeft size={16} /></button>
                            <span className="text-sm font-bold text-slate-800">{viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                            <button onClick={handleNextMonth} className="p-1 hover:bg-slate-100 rounded text-slate-500"><ChevronRight size={16} /></button>
                        </div>

                        {/* Days Header */}
                        <div className="grid grid-cols-7 mb-2">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                                <div key={d} className="text-center text-[10px] font-bold text-slate-400 uppercase">{d}</div>
                            ))}
                        </div>

                        {/* Days Grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} />)}
                            {days.map(d => {
                                const currentD = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
                                const dateStr = `${currentD.getFullYear()}-${(currentD.getMonth() + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
                                const isSelected = value === dateStr;
                                const isBeforeMin = minDate && currentD < new Date(minDate);

                                // 1. Attendance Check
                                const attendanceLog = attendanceDb[dateStr];

                                // 2. Holiday Check
                                const holidayName = MOCK_HOLIDAYS[dateStr];

                                // 3. Rest Day Check
                                const dayOfWeek = currentD.getDay();
                                const isRestDay = dayOfWeek === 0 || dayOfWeek === 6; // Sun or Sat

                                // 4. Approved Leave Check
                                const approvedLeave = getApprovedLeaveOnDate(currentD);

                                // Determine Status
                                let dateInfo: DateInfo = { type: 'Available', label: 'Available' };
                                let isDisabled = false;
                                let styleClass = 'text-slate-700 hover:bg-slate-100';

                                if (attendanceLog) {
                                    dateInfo = { type: 'Attendance', label: 'Present', details: attendanceLog };
                                    isDisabled = true;
                                    styleClass = 'bg-slate-100 text-slate-400 line-through decoration-slate-400 cursor-not-allowed';
                                } else if (holidayName) {
                                    dateInfo = { type: 'Holiday', label: 'Holiday', details: holidayName };
                                    isDisabled = true;
                                    styleClass = 'bg-rose-50 text-rose-400 border border-rose-100 cursor-not-allowed';
                                } else if (approvedLeave) {
                                    dateInfo = { type: 'ApprovedLeave', label: 'On Leave', details: approvedLeave.type };
                                    isDisabled = true;
                                    styleClass = 'bg-purple-50 text-purple-400 border border-purple-100 cursor-not-allowed';
                                } else if (isRestDay) {
                                    dateInfo = { type: 'RestDay', label: 'Rest Day' };
                                    isDisabled = true;
                                    styleClass = 'bg-amber-50 text-amber-400 border border-amber-100 cursor-not-allowed';
                                }

                                if (isBeforeMin) {
                                    isDisabled = true;
                                    styleClass = 'opacity-30 cursor-not-allowed';
                                }

                                if (isSelected) {
                                    styleClass = 'bg-indigo-600 text-white shadow-md';
                                }

                                return (
                                    <button
                                        key={d}
                                        type="button"
                                        onClick={() => !isDisabled && handleDayClick(d)}
                                        disabled={isDisabled}
                                        onMouseEnter={(e) => {
                                            if (isDisabled && !isBeforeMin) {
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                setHoveredDateInfo({
                                                    date: dateStr,
                                                    info: dateInfo,
                                                    x: rect.left + rect.width / 2,
                                                    y: rect.top - 8
                                                });
                                            }
                                        }}
                                        onMouseLeave={() => setHoveredDateInfo(null)}
                                        className={`
                                        h-9 w-9 rounded-lg text-xs font-bold flex items-center justify-center transition-all relative
                                        ${styleClass}
                                    `}
                                    >
                                        {d}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-400"></div><span className="text-[9px] text-slate-500 uppercase font-bold">Holiday</span></div>
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-400"></div><span className="text-[9px] text-slate-500 uppercase font-bold">Rest Day</span></div>
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-purple-400"></div><span className="text-[9px] text-slate-500 uppercase font-bold">Leave</span></div>
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-300"></div><span className="text-[9px] text-slate-500 uppercase font-bold">Present</span></div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const LeaveRequests: React.FC = () => {
    const { submitLeaveRequest } = useRequest();
    const { user } = useAuth();
    // Leave States
    const [requests, setRequests] = useState(INITIAL_LEAVE_REQUESTS);
    const [leaveViewMode, setLeaveViewMode] = useState<'table' | 'calendar'>('calendar');
    const [selectedLeaveRequest, setSelectedLeaveRequest] = useState<any | null>(null);

    // Current Balances State
    const [balances, setBalances] = useState({
        vacation: 5.0,
        sick: 15.0,
        emergency: 3.0,
        maternity: 105.0,
        paternity: 7.0
    });

    // Modals
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false); // Detail View
    const [isAddLeaveModalOpen, setIsAddLeaveModalOpen] = useState(false); // Create View

    // Add Leave Form State
    const [leaveType, setLeaveType] = useState('Vacation Leave');
    const [leaveReason, setLeaveReason] = useState('');
    const [leaveEntries, setLeaveEntries] = useState<LeaveEntry[]>([]);

    // Current Entry Input State
    const [currentEntry, setCurrentEntry] = useState({
        startDate: '',
        endDate: '',
        isPartialDay: false,
        startTime: '',
        endTime: ''
    });

    // Calculated for current entry input
    const [currentEntryBreakdown, setCurrentEntryBreakdown] = useState<any[]>([]);
    const [currentEntryCredits, setCurrentEntryCredits] = useState(0);

    // Tooltip State for DatePicker Constraints
    const [hoveredDateInfo, setHoveredDateInfo] = useState<{ date: string, info: DateInfo, x: number, y: number } | null>(null);

    // Tooltip State for Calendar View Attendance
    const [hoveredAttendance, setHoveredAttendance] = useState<{ date: string, data: any, x: number, y: number } | null>(null);

    // Initialize selection
    if (!selectedLeaveRequest && requests.length > 0) {
        setSelectedLeaveRequest(requests[0]);
    }

    // --- Smart Duration Calculation ---
    const calculateCredits = (startStr: string, endStr: string, isPartial: boolean, startT: string, endT: string) => {
        if (!startStr || !endStr) return { credits: 0, breakdown: [] };

        const start = new Date(startStr);
        const end = new Date(endStr);

        if (end < start) return { credits: 0, breakdown: [] };

        let calculatedCredits = 0;
        let dayBreakdown = [];

        if (isPartial && startStr === endStr && startT && endT) {
            const t1 = new Date(`2000-01-01T${startT}`);
            const t2 = new Date(`2000-01-01T${endT}`);

            const diffMs = t2.getTime() - t1.getTime();
            let diffHrs = diffMs / (1000 * 60 * 60);
            if (diffHrs > 5) diffHrs -= 1; // Break deduction

            let credits = diffHrs / 8;
            if (credits < 0) credits = 0;
            if (credits > 1) credits = 1;

            const dateString = start.toISOString().split('T')[0];
            const attendanceLog = MOCK_ATTENDANCE_DB[dateString];
            const isRestDay = start.getDay() === 0 || start.getDay() === 6;
            const isHoliday = !!MOCK_HOLIDAYS[dateString];

            if (attendanceLog || isRestDay || isHoliday) {
                // Basic conflict check
                dayBreakdown.push({ date: dateString, credits: 0, status: 'conflict', log: attendanceLog ? 'Attendance Log' : 'Non-working Day' });
                calculatedCredits = 0;
            } else {
                dayBreakdown.push({ date: dateString, credits: parseFloat(credits.toFixed(2)), status: 'valid' });
                calculatedCredits = parseFloat(credits.toFixed(2));
            }
        } else {
            let loopDate = new Date(start);
            while (loopDate <= end) {
                const dayOfWeek = loopDate.getDay();
                const dateString = loopDate.toISOString().split('T')[0];
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                const attendanceLog = MOCK_ATTENDANCE_DB[dateString];
                const isHoliday = !!MOCK_HOLIDAYS[dateString];

                if (isWeekend) {
                    dayBreakdown.push({ date: dateString, credits: 0, status: 'weekend' });
                } else if (isHoliday) {
                    dayBreakdown.push({ date: dateString, credits: 0, status: 'holiday', name: MOCK_HOLIDAYS[dateString] });
                } else if (attendanceLog) {
                    dayBreakdown.push({ date: dateString, credits: 0, status: 'conflict', log: attendanceLog });
                } else {
                    dayBreakdown.push({ date: dateString, credits: 1.0, status: 'valid' });
                    calculatedCredits += 1.0;
                }
                loopDate.setDate(loopDate.getDate() + 1);
            }
        }
        return { credits: calculatedCredits, breakdown: dayBreakdown };
    };

    // Effect to update current entry preview
    useEffect(() => {
        const { credits, breakdown } = calculateCredits(
            currentEntry.startDate,
            currentEntry.endDate,
            currentEntry.isPartialDay,
            currentEntry.startTime,
            currentEntry.endTime
        );
        setCurrentEntryCredits(credits);
        setCurrentEntryBreakdown(breakdown);
    }, [currentEntry]);

    const handleAddEntry = () => {
        if (currentEntryCredits > 0) {
            const newEntry: LeaveEntry = {
                id: Math.random().toString(36).substr(2, 9),
                ...currentEntry,
                credits: currentEntryCredits,
                breakdown: currentEntryBreakdown
            };
            setLeaveEntries([...leaveEntries, newEntry]);
            // Reset inputs
            setCurrentEntry({ startDate: '', endDate: '', isPartialDay: false, startTime: '', endTime: '' });
        }
    };

    const handleRemoveEntry = (id: string) => {
        setLeaveEntries(leaveEntries.filter(e => e.id !== id));
    };

    // Derived Balance Logic
    const totalRequestCredits = leaveEntries.reduce((acc, curr) => acc + curr.credits, 0);

    const getCurrentBalance = () => {
        switch (leaveType) {
            case 'Vacation Leave': return balances.vacation;
            case 'Sick Leave': return balances.sick;
            case 'Emergency Leave': return balances.emergency;
            case 'Maternity Leave': return balances.maternity;
            case 'Paternity Leave': return balances.paternity;
            default: return 0;
        }
    };

    const currentBalance = getCurrentBalance();
    const projectedBalance = currentBalance - totalRequestCredits;
    const isNegative = projectedBalance < 0;

    const handleDayClick = (day: number) => {
        const req = requests.find(r => r.dateObjects.includes(day));
        if (req) setSelectedLeaveRequest(req);
    };

    const handleTableEyeClick = (req: any) => {
        setSelectedLeaveRequest(req);
        setIsLeaveModalOpen(true);
    };

    const handleAddSubmit = () => {
        if (leaveEntries.length === 0 || !leaveReason) return;

        // Update local balances
        if (leaveType === 'Vacation Leave') setBalances({ ...balances, vacation: projectedBalance });
        if (leaveType === 'Sick Leave') setBalances({ ...balances, sick: projectedBalance });

        // Flatten all dates from all entries
        let allDates: string[] = [];
        let allDateObjects: number[] = [];

        leaveEntries.forEach(entry => {
            entry.breakdown.filter(b => b.status === 'valid').forEach(b => {
                const d = new Date(b.date);
                allDates.push(d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
                allDateObjects.push(d.getDate());
            });
        });

        const newRequest = {
            type: leaveType as any,
            dates: allDates,
            dateObjects: allDateObjects,
            reason: leaveReason,
            appliedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            credits: totalRequestCredits,
            balanceAfter: projectedBalance,
            // Global store fields
            employeeId: user?.employeeId || 'emp-jane',
            employeeName: user?.name || 'Jane Doe',
            employeeRole: 'Employee',
            employeeAvatar: user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'JD',
            departmentName: 'Product Team',
            managerName: 'Alex Thompson', // Default manager
            submittedAt: new Date().toISOString(),
            leaveType: leaveType,
            leaveDates: allDates,
            leaveDateObjects: allDateObjects,
            leaveCredits: totalRequestCredits,
            leaveBalanceAfter: projectedBalance,
            leaveReason: leaveReason
        };

        const globalRequest = submitLeaveRequest(newRequest);

        setRequests([globalRequest as any, ...requests]);
        setIsAddLeaveModalOpen(false);
        alert('Leave request submitted successfully and is now pending approval.');

        // Reset form
        setLeaveType('Vacation Leave');
        setLeaveReason('');
        setLeaveEntries([]);
        setCurrentEntry({ startDate: '', endDate: '', isPartialDay: false, startTime: '', endTime: '' });
    };

    const renderLeaveCalendar = () => {
        const days = Array.from({ length: 31 }, (_, i) => i + 1);
        const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

        const requestMap = new Map();
        requests.forEach(req => {
            req.dateObjects.forEach((d: number) => requestMap.set(d, req));
        });

        return (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm w-full h-full flex flex-col relative">
                <div className="flex items-center justify-between mb-6">
                    <button className="p-1 text-slate-400 hover:text-slate-600"><ArrowLeft size={16} /></button>
                    <span className="text-sm font-bold text-slate-900">August 2025</span>
                    <button className="p-1 text-slate-400 hover:text-slate-600"><ArrowRight size={16} /></button>
                </div>
                <div className="grid grid-cols-7 gap-2 mb-2">
                    {weekDays.map(d => <div key={d} className="text-center text-xs font-bold text-slate-400 uppercase">{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-2 flex-1">
                    <div /><div /><div /><div /><div />
                    {days.map(d => {
                        const req = requestMap.get(d);
                        const isSelected = selectedLeaveRequest && selectedLeaveRequest.dateObjects.includes(d);

                        // Attendance check for August 2025
                        const dateStr = `2025-08-${d.toString().padStart(2, '0')}`;
                        const attendanceLog = MOCK_ATTENDANCE_DB[dateStr];

                        const statusColor = req ? (req.status === 'Approved' ? 'bg-purple-500' : req.status === 'Rejected' ? 'bg-rose-500' : 'bg-indigo-300') : '';

                        return (
                            <div key={d} className="relative group/day">
                                <button
                                    onClick={() => handleDayClick(d)}
                                    disabled={!req && !attendanceLog} // Disabled if no req AND no attendance, but attendance means it's blocked
                                    onMouseEnter={(e) => {
                                        if (attendanceLog) {
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            setHoveredAttendance({
                                                date: dateStr,
                                                data: attendanceLog,
                                                x: rect.left + rect.width / 2,
                                                y: rect.top - 10
                                            });
                                        }
                                    }}
                                    onMouseLeave={() => setHoveredAttendance(null)}
                                    className={`h-full w-full flex items-center justify-center text-xs font-bold rounded-lg relative transition-all 
                                    ${req ? 'text-white shadow-sm hover:scale-105' : 'text-slate-700 hover:bg-slate-50'} 
                                    ${req ? statusColor : ''} 
                                    ${isSelected && req ? 'ring-2 ring-offset-2 ring-indigo-500 z-10' : ''}
                                    ${attendanceLog ? 'bg-slate-50 text-slate-300 line-through decoration-rose-400 decoration-2 cursor-not-allowed opacity-80' : ''}
                                `}
                                >
                                    {d}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Tooltip Portal for Attendance */}
                <AnimatePresence>
                    {hoveredAttendance && (
                        <motion.div
                            initial={{ opacity: 0, y: 5, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 5, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="fixed z-[70] bg-white rounded-xl shadow-xl border border-slate-100 p-4 w-64 pointer-events-none"
                            style={{ left: hoveredAttendance.x, top: hoveredAttendance.y, transform: 'translate(-50%, -100%)' }}
                        >
                            <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-50">
                                <span className="text-xs font-bold text-slate-500">{new Date(hoveredAttendance.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${hoveredAttendance.data.status === 'Late' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                    {hoveredAttendance.data.status}
                                </span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400 font-medium">Shift</span>
                                    <span className="text-slate-700 font-bold">{hoveredAttendance.data.shift}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400 font-medium">Time In</span>
                                    <span className="text-slate-700 font-bold font-mono">{hoveredAttendance.data.timeIn}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400 font-medium">Time Out</span>
                                    <span className="text-slate-700 font-bold font-mono">{hoveredAttendance.data.timeOut}</span>
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-white border-r border-b border-slate-100 rotate-45"></div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in">

            <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Remaining Leaves</h3>
                    <div className="flex gap-6">
                        <div className="flex items-center gap-4">
                            <div className="text-4xl font-bold text-indigo-600 flex items-center gap-2">
                                <Plane className="text-indigo-400" size={32} />
                                {balances.vacation.toFixed(1)}
                            </div>
                            <span className="text-sm font-bold text-slate-600">Vacation Leave</span>
                        </div>
                        <div className="w-px h-12 bg-slate-200"></div>
                        <div className="flex items-center gap-4">
                            <div className="text-4xl font-bold text-emerald-600 flex items-center gap-2">
                                <Stethoscope className="text-emerald-400" size={32} />
                                {balances.sick.toFixed(1)}
                            </div>
                            <span className="text-sm font-bold text-slate-600">Sick Leave</span>
                        </div>
                    </div>
                </div>
                <div>
                    <button
                        onClick={() => setIsAddLeaveModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-sm font-bold transition-all mt-6 md:mt-0"
                    >
                        <Plus size={18} /> Add Leave Request
                    </button>
                </div>
            </div>

            <div className="w-full h-px bg-slate-100"></div>

            <div className="flex justify-end">
                <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button
                        onClick={() => setLeaveViewMode('table')}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${leaveViewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <List size={14} /> Table View
                    </button>
                    <button
                        onClick={() => setLeaveViewMode('calendar')}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${leaveViewMode === 'calendar' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Calendar size={14} /> Calendar View
                    </button>
                </div>
            </div>

            {leaveViewMode === 'table' && (
                <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                    <div className="p-5 border-b border-slate-50">
                        <h3 className="text-lg font-bold text-slate-900">Leave Requests</h3>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-500 text-white font-bold text-[10px] uppercase tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Leave Type</th>
                                <th className="px-6 py-4">Dates</th>
                                <th className="px-6 py-4 text-center">Credits Used</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {requests.map(req => (
                                <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-slate-700">{req.type}</td>
                                    <td className="px-6 py-4 text-slate-600">
                                        <div className="flex flex-col gap-0.5">
                                            {req.dates.map((d: string, i) => <span key={i}>{d}</span>)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center font-mono font-bold text-slate-600">{req.credits.toFixed(1)}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide border ${req.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : req.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleTableEyeClick(req)}
                                            className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white transition-all shadow-sm"
                                        >
                                            <Eye size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {requests.length === 0 && (
                                <tr><td colSpan={5} className="text-center py-8 text-slate-400 italic">No leave requests found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {leaveViewMode === 'calendar' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
                    <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-slate-900">Leave Calendar</h3>
                            <div className="flex gap-4 text-xs font-bold">
                                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div> Approved</div>
                                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-indigo-300"></div> Pending</div>
                                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-slate-400 opacity-50"></div> Occupied/Past</div>
                            </div>
                        </div>
                        <div className="flex-1 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                            {renderLeaveCalendar()}
                        </div>
                    </div>

                    {/* Detail Panel - Enhanced Card Look */}
                    <div className="flex flex-col h-full">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Info size={20} className="text-indigo-600" /> Leave Description
                        </h3>
                        {selectedLeaveRequest ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm flex-1 flex flex-col relative overflow-hidden"
                            >
                                {/* Status Header Strip */}
                                <div className={`absolute top-0 left-0 right-0 h-2 ${selectedLeaveRequest.status === 'Approved' ? 'bg-emerald-500' : 'bg-indigo-400'}`}></div>

                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 leading-tight">{selectedLeaveRequest.type}</h2>
                                        <span className="text-xs text-slate-500 font-medium">{selectedLeaveRequest.reasonStatus}</span>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide ${selectedLeaveRequest.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-indigo-50 text-indigo-700 border-indigo-100'}`}>
                                        {selectedLeaveRequest.status}
                                    </span>
                                </div>

                                <div className="space-y-6 flex-1">
                                    {/* Key Stats Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Total Credits</span>
                                            <span className="text-2xl font-extrabold text-slate-800">{selectedLeaveRequest.credits.toFixed(1)} <span className="text-sm text-slate-400 font-medium">Days</span></span>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Applied On</span>
                                            <span className="text-sm font-bold text-slate-700 mt-1 block">{selectedLeaveRequest.appliedDate}</span>
                                        </div>
                                    </div>

                                    {/* Date List */}
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                                            <CalendarDays size={14} className="text-slate-400" /> Requested Dates
                                        </h4>
                                        <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                                            {selectedLeaveRequest.dates.map((d: string, i: number) => (
                                                <div key={i} className="flex items-center justify-between text-sm p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                                                    <span className="font-medium text-slate-600">{d}</span>
                                                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Full Day</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Balance Info */}
                                    <div className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm flex items-center justify-between">
                                        <div>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Balance After</span>
                                            <span className="text-xl font-bold text-slate-900">{selectedLeaveRequest.balanceAfter.toFixed(1)}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Before</span>
                                            <span className="text-sm font-medium text-slate-500">{(selectedLeaveRequest.balanceAfter + selectedLeaveRequest.credits).toFixed(1)}</span>
                                        </div>
                                    </div>

                                    {/* Reason Area */}
                                    <div className="mt-auto pt-4 border-t border-slate-100">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Reason</span>
                                        <p className="text-sm text-slate-600 italic leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            "{selectedLeaveRequest.reason}"
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm flex-1 flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                                    <Calendar size={32} />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900">No Selection</h3>
                                <p className="text-xs text-slate-400 mt-1 max-w-[200px]">Select a date on the calendar to view full leave details.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Detail View Modal (Read Only) */}
            <Modal isOpen={isLeaveModalOpen} onClose={() => setIsLeaveModalOpen(false)} className="max-w-xl">
                {selectedLeaveRequest && (
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
                            <h3 className="text-xl font-bold text-slate-900">{selectedLeaveRequest.type}</h3>
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100">{selectedLeaveRequest.status}</span>
                        </div>
                        <div className="space-y-4">
                            <div><label className="text-[10px] font-bold text-slate-400 uppercase">Dates</label><p className="text-sm font-bold">{selectedLeaveRequest.dates.join(', ')}</p></div>
                            <div><label className="text-[10px] font-bold text-slate-400 uppercase">Credits</label><p className="text-sm font-mono font-bold">{selectedLeaveRequest.credits.toFixed(1)}</p></div>
                            <div><label className="text-[10px] font-bold text-slate-400 uppercase">Reason</label><p className="text-sm italic">"{selectedLeaveRequest.reason}"</p></div>
                        </div>
                        <div className="mt-8 flex justify-end"><button onClick={() => setIsLeaveModalOpen(false)} className="px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold">Close</button></div>
                    </div>
                )}
            </Modal>

            {/* Add Leave Request Modal - Enhanced */}
            <Modal isOpen={isAddLeaveModalOpen} onClose={() => setIsAddLeaveModalOpen(false)} className="max-w-5xl">
                <div className="flex h-[750px] bg-white overflow-hidden">

                    {/* Left Side: Builder */}
                    <div className="w-[45%] bg-slate-50 border-r border-slate-200 p-8 flex flex-col overflow-y-auto">
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <Plus size={20} className="text-indigo-600" /> New Request
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">Select dates to build your leave application.</p>
                        </div>

                        <div className="space-y-6 flex-1">
                            {/* Leave Type */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Leave Type</label>
                                <select
                                    className="w-full border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 text-sm font-bold text-slate-700 shadow-sm"
                                    value={leaveType}
                                    onChange={e => setLeaveType(e.target.value)}
                                >
                                    <option value="Vacation Leave">Vacation Leave</option>
                                    <option value="Sick Leave">Sick Leave</option>
                                    <option value="Emergency Leave">Emergency Leave</option>
                                </select>
                            </div>

                            {/* Date Builder Card */}
                            <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-sm relative">
                                <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none"></div>
                                </div>

                                <h4 className="text-sm font-bold text-indigo-900 mb-4 flex items-center gap-2 relative z-10">
                                    <CalendarDays size={16} /> Date Selection
                                </h4>

                                <div className="space-y-4 relative z-10">
                                    <div>
                                        <DatePicker
                                            label="Start Date"
                                            value={currentEntry.startDate}
                                            onChange={(date) => setCurrentEntry({ ...currentEntry, startDate: date })}
                                            attendanceDb={MOCK_ATTENDANCE_DB}
                                            existingRequests={requests}
                                            setHoveredDateInfo={setHoveredDateInfo}
                                        />
                                    </div>
                                    <div>
                                        <DatePicker
                                            label="End Date"
                                            value={currentEntry.endDate}
                                            onChange={(date) => setCurrentEntry({ ...currentEntry, endDate: date })}
                                            minDate={currentEntry.startDate}
                                            attendanceDb={MOCK_ATTENDANCE_DB}
                                            existingRequests={requests}
                                            setHoveredDateInfo={setHoveredDateInfo}
                                        />
                                    </div>

                                    {/* Partial Day Toggle */}
                                    {currentEntry.startDate && currentEntry.startDate === currentEntry.endDate && (
                                        <div className="pt-2 border-t border-slate-100 animate-in fade-in">
                                            <label className="flex items-center gap-2 cursor-pointer mb-3">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 accent-indigo-600"
                                                    checked={currentEntry.isPartialDay}
                                                    onChange={(e) => setCurrentEntry({ ...currentEntry, isPartialDay: e.target.checked })}
                                                />
                                                <span className="text-xs font-bold text-slate-600">Partial Day (Time-based)</span>
                                            </label>

                                            {currentEntry.isPartialDay && (
                                                <div className="space-y-3 pl-6">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="text-[10px] font-bold text-slate-400 block mb-1">Start</label>
                                                            <input
                                                                type="time"
                                                                min={EMPLOYEE_SHIFT.start} max={EMPLOYEE_SHIFT.end}
                                                                className="w-full p-2 rounded-lg border border-slate-200 bg-white text-xs font-bold shadow-sm outline-none focus:ring-2 focus:ring-indigo-100"
                                                                value={currentEntry.startTime}
                                                                onChange={(e) => setCurrentEntry({ ...currentEntry, startTime: e.target.value })}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] font-bold text-slate-400 block mb-1">End</label>
                                                            <input
                                                                type="time"
                                                                min={currentEntry.startTime || EMPLOYEE_SHIFT.start} max={EMPLOYEE_SHIFT.end}
                                                                className="w-full p-2 rounded-lg border border-slate-200 bg-white text-xs font-bold shadow-sm outline-none focus:ring-2 focus:ring-indigo-100"
                                                                value={currentEntry.endTime}
                                                                onChange={(e) => setCurrentEntry({ ...currentEntry, endTime: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>
                                                    <p className="text-[10px] text-indigo-500 font-medium italic">Shift: {EMPLOYEE_SHIFT.start} - {EMPLOYEE_SHIFT.end}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <button
                                        onClick={handleAddEntry}
                                        disabled={!currentEntry.startDate || !currentEntry.endDate || currentEntryCredits === 0}
                                        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all text-xs shadow-lg shadow-indigo-200 active:scale-95 disabled:opacity-50 disabled:shadow-none mt-2"
                                    >
                                        Add to Request (+{currentEntryCredits.toFixed(2)} days)
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Summary & Submit */}
                    <div className="flex-1 p-8 flex flex-col bg-white overflow-hidden">
                        <div className="flex justify-between items-center mb-6 shrink-0">
                            <h3 className="text-xl font-bold text-slate-900">Request Summary</h3>
                            <div className="text-right">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Duration</span>
                                <span className="text-2xl font-extrabold text-indigo-600">{totalRequestCredits.toFixed(2)} <span className="text-sm text-slate-400 font-medium">Days</span></span>
                            </div>
                        </div>

                        {/* List of Added Dates */}
                        <div className="flex-1 overflow-y-auto mb-6 pr-2">
                            {leaveEntries.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50 text-center p-8">
                                    <Calendar size={48} className="text-slate-200 mb-4" />
                                    <p className="text-sm font-bold text-slate-400">No dates added yet</p>
                                    <p className="text-xs text-slate-400 mt-1">Use the panel on the left to add dates to your request.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {leaveEntries.map((entry) => (
                                        <div key={entry.id} className="flex justify-between items-center p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-slate-300 transition-all group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-col flex items-center justify-center text-xs font-bold border border-indigo-100">
                                                    {new Date(entry.startDate).getDate()}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-800">
                                                        {new Date(entry.startDate).toLocaleDateString('en-US', { month: 'short' })}
                                                        {entry.startDate !== entry.endDate && ` - ${new Date(entry.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                                                    </div>
                                                    <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">
                                                        {entry.isPartialDay ? `${entry.startTime} - ${entry.endTime}` : 'Full Day'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="font-mono text-sm font-bold text-slate-600">{entry.credits.toFixed(2)} days</span>
                                                <button onClick={() => handleRemoveEntry(entry.id)} className="text-slate-300 hover:text-rose-500 transition-colors p-1.5 hover:bg-rose-50 rounded-lg">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer Section */}
                        <div className="shrink-0 space-y-6 pt-6 border-t border-slate-100">
                            {/* Balance Impact Card */}
                            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                                <div className="grid grid-cols-3 divide-x divide-slate-200">
                                    <div className="px-4 text-center">
                                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current</span>
                                        <span className="text-lg font-mono font-bold text-slate-700">{currentBalance.toFixed(2)}</span>
                                    </div>
                                    <div className="px-4 text-center">
                                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Less</span>
                                        <span className="text-lg font-mono font-bold text-amber-500">-{totalRequestCredits.toFixed(2)}</span>
                                    </div>
                                    <div className="px-4 text-center">
                                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Projected</span>
                                        <span className={`text-lg font-mono font-bold ${isNegative ? 'text-rose-600' : 'text-emerald-600'}`}>
                                            {projectedBalance.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                                {isNegative && (
                                    <div className="mt-3 text-center text-xs font-bold text-rose-500 bg-rose-50 py-1.5 rounded-lg border border-rose-100 flex items-center justify-center gap-2">
                                        <AlertCircle size={14} /> Insufficient Leave Balance
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Reason for Leave</label>
                                <textarea
                                    className="w-full border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 text-sm font-medium text-slate-900 h-24 resize-none"
                                    placeholder="Please describe..."
                                    value={leaveReason}
                                    onChange={e => setLeaveReason(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleAddSubmit}
                                    disabled={leaveEntries.length === 0 || !leaveReason || isNegative}
                                    className="flex-1 py-3.5 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    Submit Request
                                </button>
                                <button
                                    onClick={() => setIsAddLeaveModalOpen(false)}
                                    className="px-6 py-3.5 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tooltip Portal for Date Constraints */}
                <AnimatePresence>
                    {hoveredDateInfo && (
                        <motion.div
                            initial={{ opacity: 0, y: 5, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 5, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="fixed z-[70] bg-white rounded-xl shadow-2xl border border-slate-100 p-4 w-60 pointer-events-none"
                            style={{ left: hoveredDateInfo.x, top: hoveredDateInfo.y, transform: 'translate(-50%, -100%)' }}
                        >
                            <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-50">
                                <span className="text-xs font-bold text-slate-500">{new Date(hoveredDateInfo.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${hoveredDateInfo.info.type === 'RestDay' ? 'bg-amber-50 text-amber-600' :
                                    hoveredDateInfo.info.type === 'Holiday' ? 'bg-rose-50 text-rose-600' :
                                        hoveredDateInfo.info.type === 'ApprovedLeave' ? 'bg-purple-50 text-purple-600' :
                                            hoveredDateInfo.info.type === 'Attendance' ? 'bg-slate-100 text-slate-600' :
                                                'bg-emerald-50 text-emerald-600'
                                    }`}>
                                    {hoveredDateInfo.info.type === 'RestDay' ? 'Rest Day' :
                                        hoveredDateInfo.info.type === 'Holiday' ? 'Holiday' :
                                            hoveredDateInfo.info.type === 'ApprovedLeave' ? 'On Leave' :
                                                hoveredDateInfo.info.type === 'Attendance' ? 'Present' : 'Available'}
                                </span>
                            </div>

                            <div className="space-y-1.5">
                                {hoveredDateInfo.info.type === 'Holiday' && (
                                    <div className="text-xs font-bold text-rose-700 flex items-center gap-2">
                                        <Flag size={12} /> {hoveredDateInfo.info.details}
                                    </div>
                                )}
                                {hoveredDateInfo.info.type === 'RestDay' && (
                                    <div className="text-xs font-medium text-amber-700 italic">
                                        Scheduled Rest Day (Weekend)
                                    </div>
                                )}
                                {hoveredDateInfo.info.type === 'ApprovedLeave' && (
                                    <div className="text-xs font-bold text-purple-700 flex items-center gap-2">
                                        <Briefcase size={12} /> {hoveredDateInfo.info.details}
                                    </div>
                                )}
                                {hoveredDateInfo.info.type === 'Attendance' && (
                                    <div className="bg-slate-50 p-2 rounded text-[10px] font-mono text-slate-600">
                                        <div className="flex justify-between"><span>IN:</span> <strong>{hoveredDateInfo.info.details.timeIn}</strong></div>
                                        <div className="flex justify-between"><span>OUT:</span> <strong>{hoveredDateInfo.info.details.timeOut}</strong></div>
                                    </div>
                                )}

                                {/* Instructions */}
                                <div className="pt-2 mt-2 border-t border-slate-50 text-[10px] text-slate-400 italic">
                                    {hoveredDateInfo.info.type !== 'Available' ? 'Date is unavailable for leave requests.' : 'Click to select this date.'}
                                </div>
                            </div>

                            {/* Arrow */}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-white border-r border-b border-slate-100 rotate-45"></div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Modal>
        </div>
    );
};

export default LeaveRequests;
