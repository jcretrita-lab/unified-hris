import React, { useMemo, useState } from 'react';
import { CalendarRange } from 'lucide-react';
import { PaySchedule, Employee, CutoffRange } from '../../../types';
import { DateRangePicker } from '../../PaySchedule';

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
    
    // We only need the current year for employee config preview
    const viewDate = new Date();
    const [selectedViewCutoffId, setSelectedViewCutoffId] = useState<string>('0-default-1');

    const viewYearlyCutoffs = useMemo(() => {
        if (!selectedSchedule) return [];
        const list: any[] = [];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        if (selectedSchedule.frequency === 'Semi-Monthly' || selectedSchedule.frequency === 'Monthly') {
            for (let i = 0; i < 12; i++) {
                const override = selectedSchedule.monthOverrides?.find(o => o.month === i && o.year === viewDate.getFullYear());
                let cutoffs: CutoffRange[] = [];

                if (override && override.cutoffs && override.cutoffs.length > 0) {
                    cutoffs = override.cutoffs;
                } else {
                    if (selectedSchedule.frequency === 'Semi-Monthly') {
                        cutoffs = [
                            ...(selectedSchedule.extraCutoffs || []),
                            selectedSchedule.firstCutoffRange || { startDay: 1, endDay: 10, payDay: 15 },
                            selectedSchedule.secondCutoffRange || { startDay: 11, endDay: 25, payDay: 30 }
                        ];
                    } else if (selectedSchedule.frequency === 'Monthly') {
                        cutoffs = [
                            ...(selectedSchedule.extraCutoffs || []),
                            selectedSchedule.firstCutoffRange || { startDay: 1, endDay: 25, payDay: 30 }
                        ];
                    }
                }

                const baseCount = selectedSchedule.frequency === 'Semi-Monthly' ? 2 : 1;
                const extraCount = cutoffs.length - baseCount;

                cutoffs.forEach((c, idx) => {
                    const isExtra = idx < extraCount;
                    const defaultIdx = idx - extraCount + 1;
                    let name = 'New Cutoff';
                    if (!isExtra) {
                        const localBaseIdx = idx - extraCount;
                        if (selectedSchedule.frequency === 'Semi-Monthly') {
                            name = `Cutoff ${i * 2 + localBaseIdx + 1}`;
                        } else {
                            name = `Cutoff ${i + 1}`;
                        }
                    }
                    const stableIdSuffix = isExtra ? `extra-${idx}` : `default-${defaultIdx}`;

                    list.push({
                        id: `${i}-${stableIdSuffix}`,
                        name: name,
                        month: i,
                        cutoffIndex: idx,
                        isFirst: idx === 0,
                        range: c,
                        monthName: months[i]
                    });
                });
            }
        }
        return list;
    }, [selectedSchedule]);

    const activeViewCutoff = viewYearlyCutoffs.find(c => c.id === selectedViewCutoffId) || viewYearlyCutoffs[0];

    // Ensure state defaults to a valid active ID if the schedule changes
    React.useEffect(() => {
        if (viewYearlyCutoffs.length > 0 && !viewYearlyCutoffs.find(c => c.id === selectedViewCutoffId)) {
            setSelectedViewCutoffId(viewYearlyCutoffs[0].id);
        }
    }, [viewYearlyCutoffs, selectedViewCutoffId]);


    return (
        <div className="mt-6 flex flex-col gap-6">
            {/* Top Bar: Form & Access Control */}
            <div className="p-6 border border-slate-200 rounded-2xl bg-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 space-y-1">
                    <h3 className="text-lg font-bold text-slate-800">Pay Schedule Configuration</h3>
                    <p className="text-sm text-slate-500">
                        Review the detailed cutoff boundaries and pay dates for the current year.
                    </p>
                </div>

                {isEmployeeView && selectedSchedule ? (
                     <div className="p-3 px-5 bg-slate-50 border border-slate-200 rounded-xl">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Current Schedule</div>
                        <div className="text-sm font-bold text-indigo-700">{selectedSchedule.name}</div>
                    </div>
                ) : (
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <select
                            className="p-2 border border-slate-300 rounded-xl bg-white text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64"
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
                            className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-sm whitespace-nowrap"
                        >
                            Save
                        </button>
                    </div>
                )}
            </div>

            {/* Bottom Section: Dual Calendar View similar to PaySchedule.tsx */}
            <div className="flex-1 overflow-y-auto bg-slate-50 border border-slate-200 rounded-2xl">
                {selectedSchedule && (selectedSchedule.frequency === 'Semi-Monthly' || selectedSchedule.frequency === 'Monthly') ? (
                    <div className="flex flex-col md:flex-row h-[600px] p-6 gap-6">
                        {/* Left Panel: List of Cutoffs */}
                        <div className="w-full md:w-1/3 border border-slate-200 rounded-2xl overflow-y-auto bg-white custom-scrollbar-horizontal flex flex-col shadow-sm">
                            <div className="sticky top-0 bg-slate-50 p-4 border-b border-slate-200 z-10 flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{viewDate.getFullYear()} Yearly Cutoffs</span>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {viewYearlyCutoffs.map(c => {
                                    const isSelected = selectedViewCutoffId === c.id;
                                    return (
                                        <div
                                            key={c.id}
                                            onClick={() => setSelectedViewCutoffId(c.id)}
                                            className={`p-5 cursor-pointer transition-all hover:bg-slate-50 group ${isSelected ? 'bg-indigo-50 hover:bg-indigo-50 border-l-4 border-indigo-600' : 'border-l-4 border-transparent'}`}
                                        >
                                            <div className={`text-sm font-bold ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>
                                                {c.name}
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1.5 font-medium group-hover:text-slate-700 transition-colors">
                                                {c.monthName} {c.range.startDay} - {c.monthName} {c.range.endDay}
                                            </div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 bg-white px-2 py-1 rounded inline-block border border-slate-100">
                                                Pay Date: {c.monthName} {c.range.payDay}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right Panel: Calendar picker */}
                        <div className="w-full md:w-2/3 border border-slate-200 rounded-2xl bg-white p-8 shadow-sm flex flex-col justify-center items-center">
                            <div className="w-full max-w-2xl">
                                {activeViewCutoff && (
                                    <div className="flex flex-col gap-6">
                                        <div className="flex items-center gap-2 text-lg font-bold text-indigo-900 uppercase tracking-wide border-b border-slate-100 pb-4">
                                            <CalendarRange size={22} className="text-indigo-500" />
                                            Viewing {activeViewCutoff.name} ({activeViewCutoff.monthName})
                                        </div>
                                        <DateRangePicker
                                            label={`${activeViewCutoff.name} Cutoff Period`}
                                            range={activeViewCutoff.range}
                                            month={activeViewCutoff.month}
                                            year={viewDate.getFullYear()}
                                            onChange={() => { }}
                                            color={activeViewCutoff.isFirst ? 'amber' : 'emerald'}
                                            disabled={true}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 h-[400px] flex flex-col items-center justify-center text-slate-400 bg-white rounded-2xl">
                        <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                            <CalendarRange size={48} className="text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700 mb-2">{selectedSchedule ? 'View Not Supported' : 'No Schedule Selected'}</h3>
                        <p className="max-w-xs text-center text-sm text-slate-500 font-medium">
                            {selectedSchedule ? 'The Dual-Calendar view is primarily for Semi-Monthly and Monthly frequencies.' : 'Select a pay schedule from the dropdown to view its cutoffs.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PayScheduleConfig;
