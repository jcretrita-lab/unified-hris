
import React, { useState, useMemo } from 'react';
import {
    CalendarRange,
    Plus,
    Trash2,
    Edit2,
    Clock,
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Info,
    Building,
    Briefcase,
    Globe
} from 'lucide-react';
import { PaySchedule } from '../types';
import Modal from '../components/Modal';

// --- Mock Data ---
const MOCK_DEPARTMENTS = [
    { id: 'dept-1', name: 'IT Department' },
    { id: 'dept-2', name: 'HR Department' },
    { id: 'dept-3', name: 'Sales Department' },
    { id: 'dept-4', name: 'Marketing' },
];

const MOCK_POSITIONS = [
    { id: 'pos-1', title: 'Senior Developer', deptId: 'dept-1' },
    { id: 'pos-2', title: 'Junior Developer', deptId: 'dept-1' },
    { id: 'pos-3', title: 'HR Manager', deptId: 'dept-2' },
    { id: 'pos-4', title: 'Sales Representative', deptId: 'dept-3' },
];

const MOCK_DIVISORS = [
    { id: 'div-1', name: '314 Days - Regular', days: 314 },
    { id: 'div-2', name: '288 Days - Compressed', days: 288 }
];

const INITIAL_SCHEDULES: PaySchedule[] = [
    {
        id: '1',
        name: 'Regular Employees',
        frequency: 'Semi-Monthly',
        targetType: 'Global',
        targetId: null,
        firstCutoff: 10,
        firstPayDate: 15,
        secondCutoff: 25,
        secondPayDate: 30,
        divisorId: 'div-1'
    },
    {
        id: '2',
        name: 'Contractors Weekly',
        frequency: 'Weekly',
        targetType: 'Global', // Changed to Global as per new requirement
        targetId: null,
        firstPayDate: 'Friday'
    }
];

export const PaySchedulePage: React.FC = () => {
    const [schedules, setSchedules] = useState<PaySchedule[]>(INITIAL_SCHEDULES);
    const [isCreating, setIsCreating] = useState(false);
    const [activeId, setActiveId] = useState<string | null>(null); // For Editing
    const [selectedId, setSelectedId] = useState<string | null>('1'); // For Viewing
    const [viewDate, setViewDate] = useState(new Date());

    // Form State
    const [editor, setEditor] = useState<Partial<PaySchedule>>({
        name: '',
        frequency: 'Semi-Monthly',
        targetType: 'Global',
        firstCutoff: 10,
        firstPayDate: 15,
        secondCutoff: 25,
        secondPayDate: 30,
        divisorId: 'div-1'
    });

    // --- Helpers ---
    const selectedSchedule = useMemo(() => schedules.find(s => s.id === selectedId), [schedules, selectedId]);

    // --- Calendar Logic ---
    const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

    const getDayEvents = (day: number) => {
        if (!selectedSchedule) return [];
        const events: { type: 'pay' | 'cutoff', label: string }[] = [];
        const maxDays = getDaysInMonth(viewDate);

        // Helper to check match with clamping
        const isMatch = (target: number | undefined) => {
            if (target === undefined) return false;
            // Standard clamping: if target is 30, and maxDays is 28, then 28 is the match.
            const effectiveTarget = Math.min(target, maxDays);
            return day === effectiveTarget;
        };

        const { frequency, firstCutoff, firstPayDate, secondCutoff, secondPayDate } = selectedSchedule;

        if (frequency === 'Weekly') {
            const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const currentDayName = weekDays[new Date(viewDate.getFullYear(), viewDate.getMonth(), day).getDay()];
            if (String(firstPayDate) === currentDayName) {
                events.push({ type: 'pay', label: 'Pay Day' });
            }
        } else if (frequency === 'Semi-Monthly') {
            if (isMatch(firstCutoff as number)) events.push({ type: 'cutoff', label: '1st Cutoff' });
            if (isMatch(firstPayDate as number)) events.push({ type: 'pay', label: '1st Pay' });
            if (isMatch(secondCutoff as number)) events.push({ type: 'cutoff', label: '2nd Cutoff' });
            if (isMatch(secondPayDate as number)) events.push({ type: 'pay', label: '2nd Pay' });
        } else if (frequency === 'Monthly') {
            if (isMatch(firstCutoff as number)) events.push({ type: 'cutoff', label: 'Cutoff' });
            if (isMatch(firstPayDate as number)) events.push({ type: 'pay', label: 'Pay Day' });
        }

        return events;
    };

    // --- Actions ---

    const handleOpenCreate = () => {
        setEditor({
            name: '',
            frequency: 'Semi-Monthly',
            targetType: 'Global',
            firstCutoff: 10,
            firstPayDate: 15,
            secondCutoff: 25,
            secondPayDate: 30,
            divisorId: 'div-1'
        });
        setIsCreating(true);
        setActiveId(null);
    };

    const handleOpenEdit = (sch: PaySchedule) => {
        setEditor({ ...sch });
        setIsCreating(true);
        setActiveId(sch.id);
    };

    const handleSave = () => {
        if (!editor.name || !editor.frequency) return;

        const newSchedule: PaySchedule = {
            id: activeId || Math.random().toString(36).substr(2, 9),
            name: editor.name!,
            frequency: editor.frequency!,
            targetType: 'Global', // Always Global
            targetId: null,
            firstCutoff: editor.firstCutoff || 15,
            firstPayDate: editor.firstPayDate || 30,
            secondCutoff: editor.secondCutoff,
            secondPayDate: editor.secondPayDate,
            divisorId: editor.divisorId
        };

        if (activeId) {
            setSchedules(schedules.map(s => s.id === activeId ? newSchedule : s));
        } else {
            setSchedules([...schedules, newSchedule]);
        }
        setIsCreating(false);
        // If we just edited the selected one, or created a new one, update view
        if (!activeId) setSelectedId(newSchedule.id);
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Delete this schedule?")) {
            setSchedules(schedules.filter(s => s.id !== id));
            if (selectedId === id) setSelectedId(null);
        }
    };

    const getTargetDescription = (s: PaySchedule) => {
        return 'All Employees'; // Simplified as per removal of "Applicable To"
    };

    const getTargetIcon = (type: string) => {
        return <Globe size={14} />; // Always Global
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Pay Schedules</h1>
                <p className="text-slate-500 font-medium mt-1">Configure pay frequencies and cutoff dates.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 h-[700px] flex overflow-hidden">

                {/* Sidebar List */}
                <div className="w-80 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0">
                    <div className="p-6 border-b border-slate-200 bg-white">
                        <button
                            onClick={handleOpenCreate}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 active:scale-95"
                        >
                            <Plus size={18} /> New Schedule
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {schedules.map(s => (
                            <div
                                key={s.id}
                                onClick={() => setSelectedId(s.id)}
                                className={`p-4 rounded-2xl cursor-pointer transition-all group relative border ${selectedId === s.id ? 'bg-white border-indigo-200 shadow-md shadow-indigo-50' : 'bg-white/50 border-transparent hover:bg-white hover:border-slate-200 hover:shadow-sm'}`}
                            >
                                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={(e) => { e.stopPropagation(); handleOpenEdit(s); }} className="p-1.5 bg-slate-100 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"><Edit2 size={14} /></button>
                                    <button onClick={(e) => handleDelete(s.id, e)} className="p-1.5 bg-slate-100 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"><Trash2 size={14} /></button>
                                </div>
                                <h3 className={`font-bold text-sm ${selectedId === s.id ? 'text-indigo-900' : 'text-slate-700'}`}>{s.name}</h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wide border ${selectedId === s.id ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                        {s.frequency}
                                    </span>
                                    {s.divisorId && (
                                        <span className="text-[10px] text-slate-400 font-bold border border-slate-200 px-2 py-0.5 rounded-lg">
                                            {MOCK_DIVISORS.find(d => d.id === s.divisorId)?.days} Days
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-400 font-medium">
                                    {getTargetIcon(s.targetType)}
                                    <span className="truncate">{getTargetDescription(s)}</span>
                                </div>
                            </div>
                        ))}
                        {schedules.length === 0 && (
                            <div className="p-8 text-center text-slate-400 italic text-sm">No schedules defined. Create one to get started.</div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Calendar Preview */}
                {selectedSchedule ? (
                    <div className="flex-1 flex flex-col bg-white relative">
                        {/* Calendar Header */}
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white z-10">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                    {selectedSchedule.name}
                                    <div className="h-4 w-px bg-slate-300"></div>
                                    <span className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <Clock size={16} />
                                        {selectedSchedule.frequency}
                                    </span>
                                </h2>
                                <p className="text-sm text-slate-400 font-medium mt-1">Previewing dates for <span className="text-slate-700">{viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span></p>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                                <button onClick={handlePrevMonth} className="p-2 hover:bg-white hover:text-indigo-600 hover:shadow-sm rounded-lg transition-all text-slate-400"><ChevronLeft size={18} /></button>
                                <span className="font-bold text-slate-700 w-32 text-center select-none text-sm">
                                    {viewDate.toLocaleString('default', { month: 'short', year: 'numeric' })}
                                </span>
                                <button onClick={handleNextMonth} className="p-2 hover:bg-white hover:text-indigo-600 hover:shadow-sm rounded-lg transition-all text-slate-400"><ChevronRight size={18} /></button>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="px-6 py-3 bg-slate-50/50 border-b border-slate-100 flex gap-6 text-xs font-bold text-slate-500 uppercase tracking-wide">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100"></div>
                                Pay Date
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-amber-500 ring-2 ring-amber-100"></div>
                                Cutoff Date
                            </div>
                        </div>

                        {/* Calendar Grid */}
                        <div className="flex-1 p-8 overflow-y-auto">
                            <div className="grid grid-cols-7 gap-4 mb-4">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                                    <div key={d} className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{d}</div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-3">
                                {Array.from({ length: getFirstDayOfMonth(viewDate) }).map((_, i) => (
                                    <div key={`empty-${i}`} className="min-h-[100px] bg-slate-50/30 rounded-2xl border border-transparent"></div>
                                ))}
                                {Array.from({ length: getDaysInMonth(viewDate) }).map((_, i) => {
                                    const day = i + 1;
                                    const events = getDayEvents(day);
                                    const isToday = new Date().toDateString() === new Date(viewDate.getFullYear(), viewDate.getMonth(), day).toDateString();

                                    return (
                                        <div
                                            key={day}
                                            className={`min-h-[100px] border rounded-2xl p-3 relative transition-all group hover:shadow-md flex flex-col justify-between ${isToday ? 'bg-indigo-50/40 border-indigo-200' : 'bg-white border-slate-100 hover:border-indigo-200'
                                                }`}
                                        >
                                            <div className={`text-sm font-bold ${isToday ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`}>{day}</div>
                                            <div className="space-y-1.5 mt-2">
                                                {events.map((evt, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1.5 shadow-sm ${evt.type === 'pay'
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                                            : 'bg-amber-50 text-amber-700 border border-amber-100'
                                                            }`}
                                                    >
                                                        <div className={`w-1.5 h-1.5 rounded-full ${evt.type === 'pay' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                                        {evt.label}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/30">
                        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                            <CalendarRange size={48} className="text-slate-200" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700 mb-2">No Schedule Selected</h3>
                        <p className="max-w-xs text-center text-sm text-slate-500 font-medium">Select a pay schedule from the list to view its calendar, cutoff dates, and pay days.</p>
                    </div>
                )}
            </div>

            {/* Configuration Modal */}
            <Modal isOpen={isCreating} onClose={() => setIsCreating(false)}>
                <div className="p-8">
                    <h3 className="text-xl font-bold mb-6 text-slate-900 flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                            {activeId ? <Edit2 size={20} /> : <Plus size={20} />}
                        </div>
                        {activeId ? 'Edit Pay Schedule' : 'Create Pay Schedule'}
                    </h3>

                    <div className="space-y-6">
                        {/* Name & Frequency */}
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Schedule Name</label>
                                <input
                                    className="w-full border border-slate-200 p-3 rounded-xl text-slate-900 text-sm font-bold bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="e.g. Regular Employees"
                                    value={editor.name}
                                    onChange={e => setEditor({ ...editor, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Frequency</label>
                                <div className="relative">
                                    <select
                                        className="w-full border border-slate-200 p-3 rounded-xl text-slate-900 text-sm font-bold bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none appearance-none transition-all cursor-pointer"
                                        value={editor.frequency}
                                        onChange={e => setEditor({ ...editor, frequency: e.target.value as any })}
                                    >
                                        <option value="Semi-Monthly">Semi-Monthly (Twice)</option>
                                        <option value="Monthly">Monthly (Once)</option>
                                        <option value="Weekly">Weekly</option>
                                    </select>
                                    <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" size={16} />
                                </div>
                            </div>
                        </div>

                        {/* Cutoff Configuration */}
                        <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100/50">
                            <div className="flex items-center gap-2 mb-4 text-xs font-bold text-indigo-900 uppercase tracking-wide">
                                <Clock size={14} className="text-indigo-500" />
                                Cutoff & Pay Dates
                            </div>

                            {editor.frequency === 'Semi-Monthly' && (
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1.5">1st Cutoff Day</label>
                                            <div className="relative">
                                                <input type="number" className="w-full border border-indigo-100 rounded-xl p-2.5 pl-4 text-slate-900 font-bold bg-white focus:border-indigo-500 outline-none" value={editor.firstCutoff} onChange={e => setEditor({ ...editor, firstCutoff: Number(e.target.value) })} />
                                                <span className="absolute right-3 top-2.5 text-[10px] font-bold text-slate-400 uppercase">th of month</span>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1.5">1st Pay Day</label>
                                            <div className="relative">
                                                <input type="number" className="w-full border border-indigo-100 rounded-xl p-2.5 pl-4 text-slate-900 font-bold bg-white focus:border-indigo-500 outline-none" value={editor.firstPayDate} onChange={e => setEditor({ ...editor, firstPayDate: Number(e.target.value) })} />
                                                <span className="absolute right-3 top-2.5 text-[10px] font-bold text-slate-400 uppercase">th of month</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1.5">2nd Cutoff Day</label>
                                            <div className="relative">
                                                <input type="number" className="w-full border border-indigo-100 rounded-xl p-2.5 pl-4 text-slate-900 font-bold bg-white focus:border-indigo-500 outline-none" value={editor.secondCutoff || 25} onChange={e => setEditor({ ...editor, secondCutoff: Number(e.target.value) })} />
                                                <span className="absolute right-3 top-2.5 text-[10px] font-bold text-slate-400 uppercase">th of month</span>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1.5">2nd Pay Day</label>
                                            <div className="relative">
                                                <input type="number" className="w-full border border-indigo-100 rounded-xl p-2.5 pl-4 text-slate-900 font-bold bg-white focus:border-indigo-500 outline-none" value={editor.secondPayDate || 30} onChange={e => setEditor({ ...editor, secondPayDate: Number(e.target.value) })} />
                                                <span className="absolute right-3 top-2.5 text-[10px] font-bold text-slate-400 uppercase">th of month</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {editor.frequency === 'Monthly' && (
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1.5">Cutoff Day</label>
                                        <div className="relative">
                                            <input type="number" className="w-full border border-indigo-100 rounded-xl p-2.5 pl-4 text-slate-900 font-bold bg-white focus:border-indigo-500 outline-none" value={editor.firstCutoff} onChange={e => setEditor({ ...editor, firstCutoff: Number(e.target.value) })} />
                                            <span className="absolute right-3 top-2.5 text-[10px] font-bold text-slate-400 uppercase">th of month</span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1.5">Pay Day</label>
                                        <div className="relative">
                                            <input type="number" className="w-full border border-indigo-100 rounded-xl p-2.5 pl-4 text-slate-900 font-bold bg-white focus:border-indigo-500 outline-none" value={editor.firstPayDate} onChange={e => setEditor({ ...editor, firstPayDate: Number(e.target.value) })} />
                                            <span className="absolute right-3 top-2.5 text-[10px] font-bold text-slate-400 uppercase">th of month</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {editor.frequency === 'Weekly' && (
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1.5">Pay Day (Weekly)</label>
                                        <div className="relative">
                                            <select className="w-full border border-indigo-100 rounded-xl p-2.5 pl-4 text-slate-900 font-bold bg-white focus:border-indigo-500 outline-none appearance-none" value={editor.firstPayDate} onChange={e => setEditor({ ...editor, firstPayDate: e.target.value })}>
                                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => <option key={d} value={d}>{d}</option>)}
                                            </select>
                                            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" size={16} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Divisor Selection */}
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Payroll Divisor</label>
                            <div className="relative">
                                <select
                                    className="w-full border border-slate-200 p-3 rounded-xl text-slate-900 text-sm font-bold bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none appearance-none transition-all cursor-pointer"
                                    value={editor.divisorId}
                                    onChange={e => setEditor({ ...editor, divisorId: e.target.value })}
                                >
                                    <option value="">Select a divisor...</option>
                                    {MOCK_DIVISORS.map(d => (
                                        <option key={d.id} value={d.id}>{d.name} ({d.days} days)</option>
                                    ))}
                                </select>
                                <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" size={16} />
                            </div>
                            <p className="mt-2 text-[10px] text-slate-500 italic">This divisor will be used for daily/hourly rate conversions for this schedule.</p>
                        </div>

                        <button onClick={handleSave} className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95 text-sm">
                            {activeId ? 'Save Changes' : 'Create Schedule'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default PaySchedulePage;
