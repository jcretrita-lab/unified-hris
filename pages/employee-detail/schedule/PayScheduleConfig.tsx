import React from 'react';
import { PaySchedule, Employee } from '../../../types';

interface PayScheduleConfigProps {
    isEmployeeView: boolean;
    empData: Employee;
    paySchedules: PaySchedule[];
    onScheduleChange: (scheduleId: string) => void;
    onSave: () => void;
}

const PayScheduleConfig: React.FC<PayScheduleConfigProps> = ({
    isEmployeeView,
    empData,
    paySchedules,
    onScheduleChange,
    onSave
}) => {
    const selectedSchedule = paySchedules.find(ps => ps.id === empData.payScheduleId);

    // Calendar logic matching the current month for visual preview
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDow = new Date(year, month, 1).getDay();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Helper to figure out if a day falls on a Pay Date or Cutoff Range
    const getDayClass = (day: number) => {
        if (!selectedSchedule) return 'text-slate-400';

        // Exact Pay Dates
        if (day === selectedSchedule.firstPayDate || day === selectedSchedule.secondPayDate) {
            return 'bg-emerald-500 text-white shadow-sm ring-2 ring-emerald-200';
        }

        // Cutoff ranges (e.g. 1 to 15, or 16 to 30)
        // First cutoff logic
        const firstCutEnd = selectedSchedule.firstCutoff || 15;
        if (day >= 1 && day <= firstCutEnd) {
            return 'bg-amber-100 text-amber-800 font-bold';
        }

        // Second cutoff logic
        const secondCutEnd = selectedSchedule.secondCutoff || daysInMonth; // default to end of month if undefined
        if (day > firstCutEnd && day <= secondCutEnd) {
            return 'bg-indigo-50 text-indigo-700 font-bold';
        }

        return 'text-slate-500 font-medium';
    };

    return (
        <div className="p-8 mt-6 border border-slate-200 rounded-2xl bg-white flex flex-col md:flex-row gap-8">

            {/* Left Column: Form & Access Control */}
            <div className="flex-1 space-y-4">
                <h3 className="text-lg font-bold text-slate-800">Pay Schedule Configuration</h3>
                <p className="text-sm text-slate-500">
                    This dictates the cutoff boundaries and specific pay dates for this employee.
                </p>

                {isEmployeeView && selectedSchedule ? (
                    <div className="mt-4 p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                        <div className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                            {selectedSchedule.name}
                        </div>
                        <div className="text-sm text-slate-600">
                            <span className="font-bold text-amber-600">Cutoff 1:</span> 1st to {selectedSchedule.firstCutoff} • <span className="font-bold text-emerald-600">Pay Date:</span> {selectedSchedule.firstPayDate}
                        </div>
                        {selectedSchedule.secondCutoff && (
                            <div className="text-sm text-slate-600">
                                <span className="font-bold text-indigo-600">Cutoff 2:</span> {selectedSchedule.firstCutoff! + 1} to {selectedSchedule.secondCutoff} • <span className="font-bold text-emerald-600">Pay Date:</span> {selectedSchedule.secondPayDate}
                            </div>
                        )}
                        <p className="text-xs text-slate-400 italic mt-4">
                            * Note: Your pay schedule is fixed and assigned by Human Resources.
                        </p>
                    </div>
                ) : (
                    <div className="mt-4 space-y-4">
                        <select
                            className="w-full p-3 border border-slate-300 rounded-xl bg-white text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={empData.payScheduleId || ''}
                            onChange={(e) => onScheduleChange(e.target.value)}
                        >
                            <option value="">Select Pay Schedule</option>
                            {paySchedules.map((ps) => (
                                <option key={ps.id} value={ps.id}>{ps.name}</option>
                            ))}
                        </select>
                        <button
                            onClick={onSave}
                            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md"
                        >
                            Save Configuration
                        </button>
                    </div>
                )}
            </div>

            {/* Right Column: Visual Calendar Preview */}
            {selectedSchedule && (
                <div className="w-full md:w-72 border border-slate-200 rounded-xl p-4 bg-white shadow-sm h-fit">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center mb-4">
                        {currentDate.toLocaleString('default', { month: 'short' })} Preview
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: firstDow }).map((_, i) => (
                            <div key={`empty-${i}`} className="h-8"></div>
                        ))}
                        {days.map(day => (
                            <div
                                key={day}
                                className={`h-8 flex flex-col items-center justify-center text-[11px] rounded transition-all ${getDayClass(day)}`}
                                title={`Day ${day}`}
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase">
                            <div className="w-3 h-3 bg-emerald-500 rounded"></div> Pay Date
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase">
                            <div className="w-3 h-3 bg-amber-100 rounded"></div> Cutoff 1 Range
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase">
                            <div className="w-3 h-3 bg-indigo-50 rounded"></div> Cutoff 2 Range
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PayScheduleConfig;
