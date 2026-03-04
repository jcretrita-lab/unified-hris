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
    AlertCircle
} from 'lucide-react';
import Modal from '../../../components/Modal';

// Mock available shifts from ShiftManagement
const AVAILABLE_SHIFTS = [
    { id: '1', name: 'Standard Regular Shift', time: '08:00 AM - 05:00 PM' },
    { id: '2', name: 'Sales Flexi Group', time: '09:00 AM - 06:00 PM' },
    { id: '3', name: 'Weekend Support', time: '09:00 AM - 06:00 PM' },
];

const MOCK_SHIFT_HISTORY = [
    { id: 'sh-1', from: 'Shift 8', to: 'Shift 9', reason: 'Team Re-alignment', status: 'Approved', date: 'Jan 15, 2025', effective: 'Jan 16, 2025' },
    { id: 'sh-2', from: 'Shift 9', to: 'Shift 8', reason: 'Personal Request', status: 'Rejected', date: 'Dec 01, 2024', effective: '-' }
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
            reason: r.shiftReason || ''
        }));

    const fullHistory = [...globalShiftRequests, ...MOCK_SHIFT_HISTORY];
    const [requestData, setRequestData] = useState({
        shiftId: '',
        reason: ''
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
            shiftFromName: 'Shift 8', // Current shift name
            shiftToId: requestData.shiftId,
            shiftToName: targetShift?.name || 'New Shift',
            shiftReason: requestData.reason,
        });

        setIsChangeShiftModalOpen(false);
        setRequestData({ shiftId: '', reason: '' });
        alert('Shift change request submitted successfully!');
    };

    const renderMiniCalendar = (title: string, highlightedDays: number[], activeClass: string, startRange?: number, endRange?: number) => {
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
                        return (
                            <div key={d} className={`h-8 w-full flex items-center justify-center text-xs font-bold rounded-lg transition-all ${isHighlighted ? activeClass : isInRange ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Current Cutoff Card (Left) */}
                <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Current Cutoff</h3>
                    {renderMiniCalendar('July 2025', [6, 20], 'bg-indigo-600 text-white', 6, 20)}
                </div>

                <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-900">Shift Information</h3>
                        <button
                            onClick={() => setIsChangeShiftModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
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
                                <tr><td className="px-6 py-4 font-bold text-slate-900">Shift Code</td><td className="px-6 py-4 text-slate-600">Shift 9</td></tr>
                                <tr><td className="px-6 py-4 font-bold text-slate-900">Time Range</td><td className="px-6 py-4 text-slate-600">8:00 AM - 6:00 PM</td></tr>
                                <tr><td className="px-6 py-4 font-bold text-slate-900">Total Hours</td><td className="px-6 py-4 text-slate-600">8 hours</td></tr>
                                <tr><td className="px-6 py-4 font-bold text-slate-900">Cut-Off</td><td className="px-6 py-4 text-slate-600">July 6 - Aug 20</td></tr>
                                <tr><td className="px-6 py-4 font-bold text-slate-900">Assigned Days</td><td className="px-6 py-4 text-slate-600">Mon, Tue, Wed, Thu, Fri</td></tr>
                                <tr><td className="px-6 py-4 font-bold text-slate-900">Notes</td><td className="px-6 py-4 text-slate-600">Standard 8-hour workday</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Shift Change Request Section */}
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-8">Current Shift Change Request</h3>
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
                            <div><h4 className="text-sm font-bold text-slate-900">Acceptance</h4><p className="text-xs text-slate-500">Pending final approval</p></div>
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

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Target Shift</label>
                            <select
                                className="w-full border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-bold text-slate-900 transition-all"
                                value={requestData.shiftId}
                                onChange={(e) => setRequestData({ ...requestData, shiftId: e.target.value })}
                            >
                                <option value="">-- Choose a Shift --</option>
                                {AVAILABLE_SHIFTS.map(shift => (
                                    <option key={shift.id} value={shift.id}>{shift.name} ({shift.time})</option>
                                ))}
                            </select>
                        </div>

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
                            <strong>Note:</strong> Shift change requests are subject to approval by your immediate supervisor and HR department.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={handleSubmitRequest}
                            disabled={!requestData.shiftId || !requestData.reason}
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
