import React, { useState } from 'react';
import { useRequest } from '../../../context/RequestContext';
import { useAuth } from '../../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown,
    ChevronUp,
    Check,
    Info,
    X,
    Clock,
    MessageSquare,
    AlertCircle,
    Calendar,
    CalendarDays,
    CheckCircle,
} from 'lucide-react';
import Modal from '../../../components/Modal';

// Mock available shifts
const AVAILABLE_SHIFTS = [
    {
        id: '1',
        name: 'Standard Regular Shift',
        time: '08:00 AM – 05:00 PM',
        workDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        hoursPerDay: 9,
        weeklyHours: 45,
    },
    {
        id: '2',
        name: 'Sales Flexi Group',
        time: '09:00 AM – 06:00 PM',
        workDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        hoursPerDay: 9,
        weeklyHours: 45,
    },
    {
        id: '3',
        name: 'Weekend Support',
        time: '09:00 AM – 06:00 PM',
        workDays: ['Sat', 'Sun'],
        hoursPerDay: 9,
        weeklyHours: 18,
    },
];

// Current shift details (mock)
const CURRENT_SHIFT = {
    code: 'Shift 9',
    timeRange: '8:00 AM – 6:00 PM',
    dailyHours: 8,         // billable work hours (excl. breaks)
    assignedDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    notes: 'Standard 8-hour workday',
};

const CURRENT_SHIFT_WEEKLY_HOURS = CURRENT_SHIFT.dailyHours * CURRENT_SHIFT.assignedDays.length;

// Cutoff period (mock: Mar 1–20 2026, today = Mar 5 2026)
const CUTOFF_START_LABEL = 'Mar 1, 2026';
const CUTOFF_END_LABEL = 'Mar 20, 2026';
const SHIFT_REQUEST_DEADLINE_DAYS = 5; // from company policy

// Derived deadline
const CUTOFF_END = new Date('2026-03-20');
const DEADLINE_DATE = new Date(CUTOFF_END);
DEADLINE_DATE.setDate(DEADLINE_DATE.getDate() - SHIFT_REQUEST_DEADLINE_DAYS);
const TODAY = new Date('2026-03-05');
const IS_REQUEST_WINDOW_OPEN = TODAY <= DEADLINE_DATE;
const DAYS_REMAINING = Math.ceil((DEADLINE_DATE.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24));
const DEADLINE_LABEL = DEADLINE_DATE.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const MOCK_SHIFT_HISTORY = [
    { id: 'sh-1', from: 'Shift 8', to: 'Shift 9', reason: 'Team Re-alignment', status: 'Approved', date: 'Jan 15, 2025', effective: 'Jan 16, 2025', scope: 'Full Cutoff' },
    { id: 'sh-2', from: 'Shift 9', to: 'Shift 8', reason: 'Personal Request', status: 'Rejected', date: 'Dec 01, 2024', effective: '-', scope: 'Single Day' }
];

const ShiftInformation: React.FC = () => {
    const { requests, submitShiftRequest } = useRequest();
    const { user } = useAuth();

    const [expandedShiftHistory, setExpandedShiftHistory] = useState<string | null>(null);
    const [isChangeShiftModalOpen, setIsChangeShiftModalOpen] = useState(false);

    // Merge global requests into history
    const globalShiftRequests = requests
        .filter(r => r.type === 'Shift Change')
        .map(r => ({
            id: r.id,
            from: r.shiftFromName || 'Default Shift',
            to: r.shiftToName || 'New Shift',
            status: r.status as any,
            date: new Date(r.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            effective: 'Next Cutoff',
            reason: r.shiftReason || '',
            scope: 'Full Cutoff',
        }));

    const fullHistory = [...globalShiftRequests, ...MOCK_SHIFT_HISTORY];

    const [requestData, setRequestData] = useState({
        shiftId: '',
        reason: '',
        changeType: 'full_cutoff' as 'full_cutoff' | 'single_day',
        targetDate: '',
    });

    const MotionDiv = motion.div as any;

    const handleSubmitRequest = () => {
        const targetShift = AVAILABLE_SHIFTS.find(s => s.id === requestData.shiftId);

        submitShiftRequest({
            type: 'Shift Change',
            employeeId: user?.employeeId || 'emp-jane',
            employeeName: user?.name || 'Jane Doe',
            employeeRole: 'Employee',
            employeeAvatar: user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'JD',
            departmentName: 'Product Team',
            managerName: 'Alex Thompson',
            submittedAt: new Date().toISOString(),
            shiftFromName: CURRENT_SHIFT.code,
            shiftToId: requestData.shiftId,
            shiftToName: targetShift?.name || 'New Shift',
            shiftReason: requestData.reason,
        });

        setIsChangeShiftModalOpen(false);
        setRequestData({ shiftId: '', reason: '', changeType: 'full_cutoff', targetDate: '' });
        alert('Shift change request submitted successfully!');
    };

    const isSubmitDisabled =
        !requestData.shiftId ||
        !requestData.reason ||
        (requestData.changeType === 'single_day' && !requestData.targetDate);

    const renderMiniCalendar = (title: string, highlightedDays: number[], activeClass: string, startRange?: number, endRange?: number, deadlineDay?: number) => {
        const days = Array.from({ length: 31 }, (_, i) => i + 1);
        const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

        return (
            <div className="w-full">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-slate-900">{title}</span>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {weekDays.map(d => <div key={d} className="text-center text-[10px] font-bold text-slate-400 uppercase">{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    <div /><div />
                    {days.map(d => {
                        const isHighlighted = highlightedDays.includes(d);
                        const isInRange = startRange && endRange ? (d > startRange && d < endRange) : false;
                        const isDeadline = d === deadlineDay;
                        return (
                            <div
                                key={d}
                                title={isDeadline ? `Deadline: ${DEADLINE_LABEL}` : undefined}
                                className={`h-8 w-full flex flex-col items-center justify-center text-xs font-bold rounded-lg transition-all relative ${isHighlighted ? activeClass : isInRange ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                {d}
                                {isDeadline && !isHighlighted && (
                                    <span className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-amber-400" />
                                )}
                            </div>
                        );
                    })}
                </div>
                {deadlineDay && (
                    <div className="flex items-center gap-1.5 mt-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block shrink-0" />
                        <span className="text-[10px] text-slate-500 font-medium">Request deadline: <strong className="text-amber-600">{DEADLINE_LABEL}</strong></span>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Current Cutoff Card (Left) */}
                <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Current Cutoff</h3>
                    {renderMiniCalendar('March 2026', [1, 20], 'bg-indigo-600 text-white', 1, 20, 15)}
                </div>

                <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-900">Shift Information</h3>
                        <button
                            onClick={() => IS_REQUEST_WINDOW_OPEN && setIsChangeShiftModalOpen(true)}
                            disabled={!IS_REQUEST_WINDOW_OPEN}
                            className={`flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-100 active:scale-95 ${!IS_REQUEST_WINDOW_OPEN ? 'opacity-50 cursor-not-allowed shadow-none' : 'hover:bg-indigo-700'}`}
                        >
                            <MessageSquare size={14} />
                            Change Shift
                        </button>
                    </div>
                    <div className="border border-slate-100 rounded-2xl overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-left">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest">Detail</th>
                                    <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest">Current Shift</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr><td className="px-6 py-4 font-bold text-slate-900">Shift Code</td><td className="px-6 py-4 text-slate-600">{CURRENT_SHIFT.code}</td></tr>
                                <tr><td className="px-6 py-4 font-bold text-slate-900">Time Range</td><td className="px-6 py-4 text-slate-600">{CURRENT_SHIFT.timeRange}</td></tr>
                                <tr>
                                    <td className="px-6 py-4 font-bold text-slate-900">Daily Hours</td>
                                    <td className="px-6 py-4 text-slate-600">{CURRENT_SHIFT.dailyHours} hours</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 font-bold text-slate-900">Weekly Total</td>
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-indigo-600">{CURRENT_SHIFT_WEEKLY_HOURS} hours</span>
                                        <span className="text-xs text-slate-400 ml-2">{CURRENT_SHIFT.dailyHours}h × {CURRENT_SHIFT.assignedDays.length} days</span>
                                    </td>
                                </tr>
                                <tr><td className="px-6 py-4 font-bold text-slate-900">Cut-Off</td><td className="px-6 py-4 text-slate-600">{CUTOFF_START_LABEL} – {CUTOFF_END_LABEL}</td></tr>
                                <tr>
                                    <td className="px-6 py-4 font-bold text-slate-900">Assigned Days</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 flex-wrap">
                                            {CURRENT_SHIFT.assignedDays.map(day => (
                                                <span key={day} className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">{day}</span>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                                <tr><td className="px-6 py-4 font-bold text-slate-900">Notes</td><td className="px-6 py-4 text-slate-600">{CURRENT_SHIFT.notes}</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Shift Request Eligibility Banner */}
            {IS_REQUEST_WINDOW_OPEN ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-6 py-4 flex items-center gap-4">
                    <CheckCircle size={20} className="text-emerald-600 shrink-0" />
                    <div>
                        <p className="text-sm font-bold text-emerald-800">Shift Change Request Available</p>
                        <p className="text-xs text-emerald-600 mt-0.5">
                            Submit by <strong>{DEADLINE_LABEL}</strong> ({DAYS_REMAINING} day{DAYS_REMAINING !== 1 ? 's' : ''} remaining) — at least {SHIFT_REQUEST_DEADLINE_DAYS} days before cutoff ends.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsChangeShiftModalOpen(true)}
                        className="ml-auto px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shrink-0"
                    >
                        Request Now
                    </button>
                </div>
            ) : (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl px-6 py-4 flex items-center gap-4">
                    <AlertCircle size={20} className="text-rose-600 shrink-0" />
                    <div>
                        <p className="text-sm font-bold text-rose-800">Request Window Closed</p>
                        <p className="text-xs text-rose-600 mt-0.5">
                            The deadline ({DEADLINE_LABEL}) for this cutoff period has passed. Requests must be submitted at least {SHIFT_REQUEST_DEADLINE_DAYS} days before the cutoff ends ({CUTOFF_END_LABEL}).
                        </p>
                    </div>
                </div>
            )}

            {/* Shift Change Request Section */}
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900">Current Shift Change Request</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock size={14} className="text-amber-500" />
                        <span>Expires: <strong className="text-amber-600">{DEADLINE_LABEL}</strong></span>
                    </div>
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl p-8 mb-8">
                    <div className="relative">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full"></div>
                        <div className="absolute top-1/2 left-0 w-1/2 h-1 bg-slate-900 -translate-y-1/2 rounded-full transition-all duration-500"></div>
                        <div className="relative flex justify-between">
                            <div className="flex flex-col items-center gap-3"><div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white z-10 shadow-lg shadow-slate-200"><Check size={14} strokeWidth={3} /></div><span className="text-xs font-bold text-slate-900">Submission</span></div>
                            <div className="flex flex-col items-center gap-3"><div className="w-8 h-8 rounded-full bg-white border-[3px] border-slate-900 flex items-center justify-center text-slate-900 z-10 shadow-lg shadow-slate-200"><div className="w-2.5 h-2.5 bg-slate-900 rounded-full animate-pulse"></div></div><span className="text-xs font-bold text-slate-900">Approval</span></div>
                            <div className="flex flex-col items-center gap-3"><div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-white z-10"></div><span className="text-xs font-bold text-slate-300">Acceptance</span></div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-500"><Info size={18} /></div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900">Acceptance</h4>
                                <p className="text-xs text-slate-500">Pending final approval</p>
                            </div>
                        </div>
                        <div className="space-y-2 mt-2">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Scope</span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">Full Cutoff</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={12} className="text-amber-500" />
                                <span className="text-[10px] text-amber-600 font-bold">Must be approved by {DEADLINE_LABEL}</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-slate-100">
                        <h4 className="text-sm font-bold text-slate-900 mb-2">Shift Change Request Details</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">Requesting to move to <strong>Shift 8</strong> starting next cutoff due to personal transportation changes.</p>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Shift Change History</h3>
                <div className="space-y-4">
                    {fullHistory.map((hist) => (
                        <div key={hist.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md">
                            <button
                                onClick={() => setExpandedShiftHistory(expandedShiftHistory === hist.id ? null : hist.id)}
                                className="w-full flex items-center justify-between p-5 hover:bg-slate-50/50 transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${hist.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : hist.status === 'Rejected' ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                        {hist.status === 'Approved' ? <Check size={18} /> : hist.status === 'Rejected' ? <X size={18} /> : <Clock size={18} />}
                                    </div>
                                    <div className="text-left">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="text-sm font-bold text-slate-900">Change to {hist.to}</h4>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${hist.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : hist.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}>
                                                {hist.status}
                                            </span>
                                            {hist.scope && (
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-50 text-slate-500 border border-slate-200">
                                                    {hist.scope}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 font-medium">Applied on {hist.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-bold text-slate-400">Effective: {hist.effective}</span>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${expandedShiftHistory === hist.id ? 'bg-slate-100 text-slate-600' : 'text-slate-300'}`}>
                                        {expandedShiftHistory === hist.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    </div>
                                </div>
                            </button>

                            <AnimatePresence>
                                {expandedShiftHistory === hist.id && (
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

            {/* Shift Change Request Modal */}
            <Modal isOpen={isChangeShiftModalOpen} onClose={() => setIsChangeShiftModalOpen(false)}>
                <div className="p-6 space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">Request Shift Change</h3>
                        <p className="text-sm text-slate-500">Submit a request to change your current work schedule.</p>
                    </div>

                    {/* Expiration notice */}
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex items-center gap-3">
                        <Clock size={16} className="text-amber-600 shrink-0" />
                        <p className="text-xs text-amber-800 font-medium">
                            This request must be approved by <strong>{DEADLINE_LABEL}</strong> — {DAYS_REMAINING} day{DAYS_REMAINING !== 1 ? 's' : ''} remaining before the cutoff ends.
                        </p>
                    </div>

                    <div className="space-y-5">
                        {/* Change Scope */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Change Scope</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRequestData({ ...requestData, changeType: 'full_cutoff', targetDate: '' })}
                                    className={`p-4 rounded-2xl border-2 text-left transition-all ${requestData.changeType === 'full_cutoff' ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}
                                >
                                    <Calendar size={16} className={requestData.changeType === 'full_cutoff' ? 'text-indigo-600' : 'text-slate-400'} />
                                    <div className="mt-2">
                                        <span className="text-sm font-bold text-slate-800 block">Full Cutoff</span>
                                        <span className="text-xs text-slate-500">Apply for the entire pay period</span>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRequestData({ ...requestData, changeType: 'single_day' })}
                                    className={`p-4 rounded-2xl border-2 text-left transition-all ${requestData.changeType === 'single_day' ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}
                                >
                                    <CalendarDays size={16} className={requestData.changeType === 'single_day' ? 'text-indigo-600' : 'text-slate-400'} />
                                    <div className="mt-2">
                                        <span className="text-sm font-bold text-slate-800 block">Single Day</span>
                                        <span className="text-xs text-slate-500">Apply for one specific day only</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Target Date (single day only) */}
                        {requestData.changeType === 'single_day' && (
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Target Date</label>
                                <input
                                    type="date"
                                    min="2026-03-01"
                                    max="2026-03-20"
                                    className="w-full border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-bold text-slate-900 transition-all"
                                    value={requestData.targetDate}
                                    onChange={(e) => setRequestData({ ...requestData, targetDate: e.target.value })}
                                />
                                <p className="text-xs text-slate-400 mt-1.5">Must be within the current cutoff period ({CUTOFF_START_LABEL} – {CUTOFF_END_LABEL})</p>
                            </div>
                        )}

                        {/* Target Shift */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Target Shift</label>
                            <select
                                className="w-full border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-bold text-slate-900 transition-all"
                                value={requestData.shiftId}
                                onChange={(e) => setRequestData({ ...requestData, shiftId: e.target.value })}
                            >
                                <option value="">-- Choose a Shift --</option>
                                {AVAILABLE_SHIFTS.map(shift => (
                                    <option key={shift.id} value={shift.id}>
                                        {shift.name} ({shift.time}) · {shift.weeklyHours}h/week
                                    </option>
                                ))}
                            </select>
                            {requestData.shiftId && (() => {
                                const s = AVAILABLE_SHIFTS.find(x => x.id === requestData.shiftId);
                                return s ? (
                                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                                        {s.workDays.map(d => (
                                            <span key={d} className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">{d}</span>
                                        ))}
                                        <span className="text-[10px] text-slate-400 font-bold">{s.hoursPerDay}h/day · {s.weeklyHours}h/week</span>
                                    </div>
                                ) : null;
                            })()}
                        </div>

                        {/* Reason */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Reason for Change</label>
                            <textarea
                                className="w-full border border-slate-200 p-4 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-medium text-slate-700 transition-all min-h-[120px]"
                                placeholder="Please provide a detailed reason for this shift change request..."
                                value={requestData.reason}
                                onChange={(e) => setRequestData({ ...requestData, reason: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3 text-amber-800">
                        <AlertCircle size={20} className="shrink-0" />
                        <p className="text-xs leading-relaxed">
                            <strong>Note:</strong> Shift change requests are subject to approval by your immediate supervisor and HR department. Requests for the current period must be approved by <strong>{DEADLINE_LABEL}</strong>.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={handleSubmitRequest}
                            disabled={isSubmitDisabled}
                            className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            Submit Request
                        </button>
                        <button
                            onClick={() => setIsChangeShiftModalOpen(false)}
                            className="px-6 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ShiftInformation;
