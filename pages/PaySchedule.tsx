
import React, { useState, useMemo } from 'react';
import {
    CalendarRange,
    Plus,
    Trash2,
    Edit2,
    Clock,
    ChevronLeft,
    ChevronRight,
    Globe,
    Check,
    RotateCcw,
    StickyNote
} from 'lucide-react';
import { PaySchedule, CutoffRange, MonthOverride } from '../types';
import Modal from '../components/Modal';

// --- Mock Data ---
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
        divisorId: 'div-1',
        firstCutoffRange: { startDay: 1, endDay: 10, payDay: 15 },
        secondCutoffRange: { startDay: 11, endDay: 25, payDay: 30 },
        applyToAllMonths: true,
        monthOverrides: []
    },
    {
        id: '2',
        name: 'Contractors Weekly',
        frequency: 'Weekly',
        targetType: 'Global',
        targetId: null,
        firstPayDate: 'Friday',
        applyToAllMonths: true,
        monthOverrides: []
    }
];

// --- Helper: get active ranges for a specific month ---
const getActiveRanges = (schedule: PaySchedule, month: number, year: number) => {
    const override = schedule.monthOverrides?.find(o => o.month === month && o.year === year);
    if (override && override.cutoffs.length > 0) {
        return { r1: override.cutoffs[0], r2: override.cutoffs[1] as CutoffRange | undefined };
    }
    return { r1: schedule.firstCutoffRange, r2: schedule.secondCutoffRange };
};

// --- Date Range Picker Component ---
interface DateRangePickerProps {
    label: string;
    range: CutoffRange;
    onChange: (range: CutoffRange) => void;
    color: 'amber' | 'emerald';
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ label, range, onChange, color }) => {
    const [selectingField, setSelectingField] = useState<'start' | 'end' | 'pay' | null>(null);
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    const bgColor = color === 'amber' ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200';
    const fillColor = color === 'amber' ? 'bg-amber-50' : 'bg-emerald-50';
    const activeColor = color === 'amber' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white';
    const payDotColor = color === 'amber' ? 'ring-amber-400' : 'ring-emerald-400';

    const handleDayClick = (day: number) => {
        if (selectingField === 'start') {
            onChange({ ...range, startDay: day });
            setSelectingField('end');
        } else if (selectingField === 'end') {
            onChange({ ...range, endDay: day });
            setSelectingField('pay');
        } else if (selectingField === 'pay') {
            onChange({ ...range, payDay: day });
            setSelectingField(null);
        } else {
            onChange({ ...range, startDay: day });
            setSelectingField('end');
        }
    };

    const isInRange = (day: number) => {
        const { startDay, endDay } = range;
        if (startDay <= endDay) {
            return day >= startDay && day <= endDay;
        }
        return day >= startDay || day <= endDay;
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</h4>
                <div className="flex gap-2">
                    <button
                        onClick={() => setSelectingField('start')}
                        className={`text-[10px] font-bold px-2 py-1 rounded border transition-all ${selectingField === 'start' ? activeColor + ' border-transparent' : bgColor}`}
                    >
                        Start: {range.startDay}
                    </button>
                    <button
                        onClick={() => setSelectingField('end')}
                        className={`text-[10px] font-bold px-2 py-1 rounded border transition-all ${selectingField === 'end' ? activeColor + ' border-transparent' : bgColor}`}
                    >
                        End: {range.endDay}
                    </button>
                    <button
                        onClick={() => setSelectingField('pay')}
                        className={`text-[10px] font-bold px-2 py-1 rounded border transition-all ${selectingField === 'pay' ? 'bg-indigo-500 text-white border-transparent' : 'bg-indigo-50 text-indigo-700 border-indigo-200'}`}
                    >
                        Pay: {range.payDay}
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
                {days.map(day => {
                    const inRange = isInRange(day);
                    const isStart = day === range.startDay;
                    const isEnd = day === range.endDay;
                    const isPay = day === range.payDay;

                    return (
                        <button
                            key={day}
                            onClick={() => handleDayClick(day)}
                            className={`h-9 w-full flex items-center justify-center text-xs font-bold rounded-lg transition-all relative
                                ${isPay ? 'bg-indigo-600 text-white ring-2 ' + payDotColor + ' shadow-md'
                                    : isStart || isEnd ? activeColor + ' shadow-sm'
                                        : inRange ? fillColor + ' text-slate-700'
                                            : 'text-slate-500 hover:bg-slate-100'
                                }
                                ${selectingField ? 'cursor-pointer' : 'cursor-default'}
                            `}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

// --- Mini Calendar for year-at-a-glance ---
interface MiniMonthCalendarProps {
    month: number;
    year: number;
    schedule: PaySchedule;
    override?: MonthOverride;
    onEdit?: () => void;
    isEditable?: boolean;
}

const MiniMonthCalendar: React.FC<MiniMonthCalendarProps> = ({ month, year, schedule, override, onEdit, isEditable }) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDow = new Date(year, month, 1).getDay();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const monthName = new Date(year, month, 1).toLocaleString('default', { month: 'short' });

    const hasOverride = !!override;

    // Use override ranges if present, else default
    const { r1, r2 } = hasOverride && override!.cutoffs.length > 0
        ? { r1: override!.cutoffs[0], r2: override!.cutoffs[1] as CutoffRange | undefined }
        : { r1: schedule.firstCutoffRange, r2: schedule.secondCutoffRange };

    const getDayClass = (day: number) => {
        if (schedule.frequency === 'Weekly') {
            const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const dayOfWeek = new Date(year, month, day).getDay();
            if (weekDays[dayOfWeek] === String(schedule.firstPayDate)) {
                return 'bg-emerald-500 text-white';
            }
            return '';
        }

        if (r1 && day === Math.min(r1.payDay, daysInMonth)) return 'bg-emerald-500 text-white';
        if (r2 && day === Math.min(r2.payDay, daysInMonth)) return 'bg-emerald-500 text-white';

        if (r1) {
            const s = r1.startDay, e = Math.min(r1.endDay, daysInMonth);
            if (s <= e ? (day >= s && day <= e) : (day >= s || day <= e)) return 'bg-amber-100 text-amber-800';
        }
        if (r2) {
            const s = r2.startDay, e = Math.min(r2.endDay, daysInMonth);
            if (s <= e ? (day >= s && day <= e) : (day >= s || day <= e)) return 'bg-amber-100 text-amber-800';
        }

        return '';
    };

    return (
        <div className={`relative p-3 border rounded-xl bg-white transition-shadow group ${hasOverride ? 'border-indigo-200 shadow-sm shadow-indigo-50' : 'border-slate-100 hover:shadow-md'}`}>
            {/* Month header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{monthName}</span>
                    {hasOverride && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-indigo-100 text-indigo-600 rounded text-[8px] font-bold uppercase tracking-wide">
                            Custom
                        </span>
                    )}
                </div>
                {isEditable && (
                    <button
                        onClick={onEdit}
                        className={`p-1 rounded-lg transition-all ${hasOverride ? 'text-indigo-500 hover:bg-indigo-50 opacity-100' : 'text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 opacity-0 group-hover:opacity-100'}`}
                        title={hasOverride ? 'Edit override' : 'Add month override'}
                    >
                        <Edit2 size={11} />
                    </button>
                )}
            </div>

            <div className="grid grid-cols-7 gap-px">
                {Array.from({ length: firstDow }).map((_, i) => (
                    <div key={`e-${i}`} className="h-5"></div>
                ))}
                {days.map(day => {
                    const cls = getDayClass(day);
                    return (
                        <div
                            key={day}
                            className={`h-5 flex items-center justify-center text-[9px] font-bold rounded ${cls || 'text-slate-400'}`}
                        >
                            {day}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- Main Component ---
export const PaySchedulePage: React.FC = () => {
    const [schedules, setSchedules] = useState<PaySchedule[]>(INITIAL_SCHEDULES);
    const [isCreating, setIsCreating] = useState(false);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>('1');
    const [viewDate, setViewDate] = useState(new Date());
    const [showYearView, setShowYearView] = useState(false);

    // Override editing state
    const [editingOverride, setEditingOverride] = useState<{ month: number; year: number } | null>(null);
    const [overrideEditor, setOverrideEditor] = useState<{
        firstCutoffRange: CutoffRange;
        secondCutoffRange?: CutoffRange;
        note: string;
    }>({
        firstCutoffRange: { startDay: 1, endDay: 10, payDay: 15 },
        note: ''
    });

    const [editor, setEditor] = useState<Partial<PaySchedule>>({
        name: '',
        frequency: 'Semi-Monthly',
        targetType: 'Global',
        firstCutoff: 10,
        firstPayDate: 15,
        secondCutoff: 25,
        secondPayDate: 30,
        divisorId: 'div-1',
        firstCutoffRange: { startDay: 1, endDay: 10, payDay: 15 },
        secondCutoffRange: { startDay: 11, endDay: 25, payDay: 30 },
        applyToAllMonths: true,
    });

    const selectedSchedule = useMemo(() => schedules.find(s => s.id === selectedId), [schedules, selectedId]);

    const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

    // -- Override handlers --
    const handleOpenOverrideEdit = (month: number, year: number) => {
        if (!selectedSchedule) return;
        const existing = selectedSchedule.monthOverrides?.find(o => o.month === month && o.year === year);
        if (existing && existing.cutoffs.length > 0) {
            setOverrideEditor({
                firstCutoffRange: existing.cutoffs[0],
                secondCutoffRange: existing.cutoffs[1],
                note: existing.note || ''
            });
        } else {
            setOverrideEditor({
                firstCutoffRange: selectedSchedule.firstCutoffRange || { startDay: 1, endDay: 10, payDay: 15 },
                secondCutoffRange: selectedSchedule.secondCutoffRange,
                note: ''
            });
        }
        setEditingOverride({ month, year });
    };

    const handleSaveOverride = () => {
        if (!editingOverride || !selectedSchedule) return;
        const cutoffs: CutoffRange[] = [overrideEditor.firstCutoffRange];
        if (selectedSchedule.frequency === 'Semi-Monthly' && overrideEditor.secondCutoffRange) {
            cutoffs.push(overrideEditor.secondCutoffRange);
        }
        const newOverride: MonthOverride = {
            month: editingOverride.month,
            year: editingOverride.year,
            cutoffs,
            note: overrideEditor.note || undefined
        };
        const filtered = selectedSchedule.monthOverrides?.filter(
            o => !(o.month === editingOverride.month && o.year === editingOverride.year)
        ) || [];
        const updated = { ...selectedSchedule, monthOverrides: [...filtered, newOverride] };
        setSchedules(schedules.map(s => s.id === selectedId ? updated : s));
        setEditingOverride(null);
    };

    const handleResetOverride = () => {
        if (!editingOverride || !selectedSchedule) return;
        const updated = {
            ...selectedSchedule,
            monthOverrides: selectedSchedule.monthOverrides?.filter(
                o => !(o.month === editingOverride.month && o.year === editingOverride.year)
            ) || []
        };
        setSchedules(schedules.map(s => s.id === selectedId ? updated : s));
        setEditingOverride(null);
    };

    // -- Calendar event helpers --
    const getDayEvents = (day: number) => {
        if (!selectedSchedule) return [];
        const events: { type: 'pay' | 'cutoff', label: string }[] = [];
        const maxDays = getDaysInMonth(viewDate);
        const isMatch = (target: number | undefined) => {
            if (target === undefined) return false;
            return day === Math.min(target, maxDays);
        };

        const { frequency } = selectedSchedule;
        const { r1: firstCutoffRange, r2: secondCutoffRange } = getActiveRanges(
            selectedSchedule, viewDate.getMonth(), viewDate.getFullYear()
        );

        if (frequency === 'Weekly') {
            const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const currentDayName = weekDays[new Date(viewDate.getFullYear(), viewDate.getMonth(), day).getDay()];
            if (String(selectedSchedule.firstPayDate) === currentDayName) {
                events.push({ type: 'pay', label: 'Pay Day' });
            }
        } else if (frequency === 'Semi-Monthly') {
            if (firstCutoffRange) {
                const s = firstCutoffRange.startDay;
                const e = Math.min(firstCutoffRange.endDay, maxDays);
                if (day === s) events.push({ type: 'cutoff', label: '1st Cutoff Start' });
                if (day === e) events.push({ type: 'cutoff', label: '1st Cutoff End' });
                if (isMatch(firstCutoffRange.payDay)) events.push({ type: 'pay', label: '1st Pay' });
            } else {
                if (isMatch(selectedSchedule.firstCutoff as number)) events.push({ type: 'cutoff', label: '1st Cutoff' });
                if (isMatch(selectedSchedule.firstPayDate as number)) events.push({ type: 'pay', label: '1st Pay' });
            }
            if (secondCutoffRange) {
                const s = secondCutoffRange.startDay;
                const e = Math.min(secondCutoffRange.endDay, maxDays);
                if (day === s) events.push({ type: 'cutoff', label: '2nd Cutoff Start' });
                if (day === e) events.push({ type: 'cutoff', label: '2nd Cutoff End' });
                if (isMatch(secondCutoffRange.payDay)) events.push({ type: 'pay', label: '2nd Pay' });
            } else {
                if (isMatch(selectedSchedule.secondCutoff as number)) events.push({ type: 'cutoff', label: '2nd Cutoff' });
                if (isMatch(selectedSchedule.secondPayDate as number)) events.push({ type: 'pay', label: '2nd Pay' });
            }
        } else if (frequency === 'Monthly') {
            if (firstCutoffRange) {
                if (day === firstCutoffRange.startDay) events.push({ type: 'cutoff', label: 'Cutoff Start' });
                if (day === Math.min(firstCutoffRange.endDay, maxDays)) events.push({ type: 'cutoff', label: 'Cutoff End' });
                if (isMatch(firstCutoffRange.payDay)) events.push({ type: 'pay', label: 'Pay Day' });
            } else {
                if (isMatch(selectedSchedule.firstCutoff as number)) events.push({ type: 'cutoff', label: 'Cutoff' });
                if (isMatch(selectedSchedule.firstPayDate as number)) events.push({ type: 'pay', label: 'Pay Day' });
            }
        }

        return events;
    };

    const isInCutoffRange = (day: number) => {
        if (!selectedSchedule) return false;
        const maxDays = getDaysInMonth(viewDate);
        const { r1, r2 } = getActiveRanges(selectedSchedule, viewDate.getMonth(), viewDate.getFullYear());
        const checkRange = (r?: CutoffRange) => {
            if (!r) return false;
            const s = r.startDay, e = Math.min(r.endDay, maxDays);
            return s <= e ? (day >= s && day <= e) : (day >= s || day <= e);
        };
        return checkRange(r1) || checkRange(r2);
    };

    const handleOpenCreate = () => {
        setEditor({
            name: '',
            frequency: 'Semi-Monthly',
            targetType: 'Global',
            firstCutoffRange: { startDay: 1, endDay: 10, payDay: 15 },
            secondCutoffRange: { startDay: 11, endDay: 25, payDay: 30 },
            divisorId: 'div-1',
            applyToAllMonths: true,
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
            targetType: 'Global',
            targetId: null,
            firstCutoff: editor.firstCutoffRange?.endDay || editor.firstCutoff || 15,
            firstPayDate: editor.firstCutoffRange?.payDay || editor.firstPayDate || 30,
            secondCutoff: editor.secondCutoffRange?.endDay || editor.secondCutoff,
            secondPayDate: editor.secondCutoffRange?.payDay || editor.secondPayDate,
            divisorId: editor.divisorId,
            firstCutoffRange: editor.firstCutoffRange,
            secondCutoffRange: editor.secondCutoffRange,
            applyToAllMonths: editor.applyToAllMonths ?? true,
            monthOverrides: activeId ? (schedules.find(s => s.id === activeId)?.monthOverrides || []) : [],
        };

        if (activeId) {
            setSchedules(schedules.map(s => s.id === activeId ? newSchedule : s));
        } else {
            setSchedules([...schedules, newSchedule]);
        }
        setIsCreating(false);
        if (!activeId) setSelectedId(newSchedule.id);
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Delete this schedule?")) {
            setSchedules(schedules.filter(s => s.id !== id));
            if (selectedId === id) setSelectedId(null);
        }
    };

    // Override modal label
    const overrideMonthLabel = editingOverride
        ? new Date(editingOverride.year, editingOverride.month, 1).toLocaleString('default', { month: 'long', year: 'numeric' })
        : '';
    const hasExistingOverride = editingOverride
        ? !!selectedSchedule?.monthOverrides?.find(o => o.month === editingOverride.month && o.year === editingOverride.year)
        : false;

    const currentMonthOverride = selectedSchedule?.monthOverrides?.find(
        o => o.month === viewDate.getMonth() && o.year === viewDate.getFullYear()
    );

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Pay Schedules</h1>
                <p className="text-slate-500 font-medium mt-1">Configure pay frequencies, cutoff ranges, and pay days with visual calendar.</p>
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
                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wide border ${selectedId === s.id ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                        {s.frequency}
                                    </span>
                                    {s.divisorId && (
                                        <span className="text-[10px] text-slate-400 font-bold border border-slate-200 px-2 py-0.5 rounded-lg">
                                            {MOCK_DIVISORS.find(d => d.id === s.divisorId)?.days} Days
                                        </span>
                                    )}
                                    {(s.monthOverrides?.length ?? 0) > 0 && (
                                        <span className="text-[10px] text-indigo-500 font-bold border border-indigo-100 bg-indigo-50 px-2 py-0.5 rounded-lg">
                                            {s.monthOverrides!.length} custom month{s.monthOverrides!.length > 1 ? 's' : ''}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-400 font-medium">
                                    <Globe size={14} />
                                    <span className="truncate">All Employees</span>
                                </div>
                            </div>
                        ))}
                        {schedules.length === 0 && (
                            <div className="p-8 text-center text-slate-400 italic text-sm">No schedules defined.</div>
                        )}
                    </div>
                </div>

                {/* Right Panel */}
                {selectedSchedule ? (
                    <div className="flex-1 flex flex-col bg-white relative">
                        {/* Header */}
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
                                <p className="text-sm text-slate-400 font-medium mt-1 flex items-center gap-2">
                                    {showYearView
                                        ? <>Year at a glance — {viewDate.getFullYear()} <span className="text-[10px] text-indigo-500 font-bold">• Click edit icon on any month to customize</span></>
                                        : <>Previewing <span className="text-slate-700 font-bold mx-1">{viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                                            {currentMonthOverride && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-bold">
                                                    <StickyNote size={10} /> Custom override active
                                                </span>
                                            )}
                                        </>
                                    }
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                {/* Edit current month override (single month view) */}
                                {!showYearView && selectedSchedule.frequency !== 'Weekly' && (
                                    <button
                                        onClick={() => handleOpenOverrideEdit(viewDate.getMonth(), viewDate.getFullYear())}
                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                                            currentMonthOverride
                                                ? 'bg-indigo-600 text-white border-indigo-600'
                                                : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-200 hover:text-indigo-600'
                                        }`}
                                    >
                                        <Edit2 size={13} />
                                        {currentMonthOverride ? 'Edit Override' : 'Override Month'}
                                    </button>
                                )}
                                <button
                                    onClick={() => setShowYearView(!showYearView)}
                                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                                        showYearView ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-200'
                                    }`}
                                >
                                    {showYearView ? 'Month View' : 'Year View'}
                                </button>
                                {!showYearView && (
                                    <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                                        <button onClick={handlePrevMonth} className="p-2 hover:bg-white hover:text-indigo-600 hover:shadow-sm rounded-lg transition-all text-slate-400"><ChevronLeft size={18} /></button>
                                        <span className="font-bold text-slate-700 w-32 text-center select-none text-sm">
                                            {viewDate.toLocaleString('default', { month: 'short', year: 'numeric' })}
                                        </span>
                                        <button onClick={handleNextMonth} className="p-2 hover:bg-white hover:text-indigo-600 hover:shadow-sm rounded-lg transition-all text-slate-400"><ChevronRight size={18} /></button>
                                    </div>
                                )}
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
                                Cutoff Range
                            </div>
                            {(selectedSchedule.monthOverrides?.length ?? 0) > 0 && (
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded bg-indigo-400 ring-2 ring-indigo-100"></div>
                                    Custom Override
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-8 overflow-y-auto">
                            {showYearView ? (
                                /* Year-at-a-glance: 12 mini-calendars */
                                <div className="grid grid-cols-3 lg:grid-cols-4 gap-4">
                                    {Array.from({ length: 12 }, (_, i) => {
                                        const yr = viewDate.getFullYear();
                                        const override = selectedSchedule.monthOverrides?.find(o => o.month === i && o.year === yr);
                                        return (
                                            <MiniMonthCalendar
                                                key={i}
                                                month={i}
                                                year={yr}
                                                schedule={selectedSchedule}
                                                override={override}
                                                onEdit={() => handleOpenOverrideEdit(i, yr)}
                                                isEditable={selectedSchedule.frequency !== 'Weekly'}
                                            />
                                        );
                                    })}
                                </div>
                            ) : (
                                /* Single month calendar */
                                <>
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
                                            const inRange = isInCutoffRange(day);

                                            return (
                                                <div
                                                    key={day}
                                                    className={`min-h-[100px] border rounded-2xl p-3 relative transition-all group hover:shadow-md flex flex-col justify-between
                                                        ${isToday ? 'bg-indigo-50/40 border-indigo-200'
                                                            : inRange && events.length === 0 ? 'bg-amber-50/30 border-amber-100'
                                                                : 'bg-white border-slate-100 hover:border-indigo-200'
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
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/30">
                        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                            <CalendarRange size={48} className="text-slate-200" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700 mb-2">No Schedule Selected</h3>
                        <p className="max-w-xs text-center text-sm text-slate-500 font-medium">Select a pay schedule from the list to view its calendar.</p>
                    </div>
                )}
            </div>

            {/* Create/Edit Schedule Modal */}
            <Modal isOpen={isCreating} onClose={() => setIsCreating(false)} className="max-w-3xl">
                <div className="p-8">
                    <h3 className="text-xl font-bold mb-6 text-slate-900 flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                            {activeId ? <Edit2 size={20} /> : <Plus size={20} />}
                        </div>
                        {activeId ? 'Edit Pay Schedule' : 'Create Pay Schedule'}
                    </h3>

                    <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
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

                        {/* Cutoff Range Configuration */}
                        {editor.frequency === 'Semi-Monthly' && (
                            <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100/50 space-y-6">
                                <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 uppercase tracking-wide">
                                    <Clock size={14} className="text-indigo-500" />
                                    Cutoff Ranges — Click days to set start, end, then pay day
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <DateRangePicker
                                        label="1st Cutoff Period"
                                        range={editor.firstCutoffRange || { startDay: 1, endDay: 10, payDay: 15 }}
                                        onChange={r => setEditor({ ...editor, firstCutoffRange: r })}
                                        color="amber"
                                    />
                                    <DateRangePicker
                                        label="2nd Cutoff Period"
                                        range={editor.secondCutoffRange || { startDay: 11, endDay: 25, payDay: 30 }}
                                        onChange={r => setEditor({ ...editor, secondCutoffRange: r })}
                                        color="emerald"
                                    />
                                </div>
                            </div>
                        )}

                        {editor.frequency === 'Monthly' && (
                            <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100/50">
                                <div className="flex items-center gap-2 mb-4 text-xs font-bold text-indigo-900 uppercase tracking-wide">
                                    <Clock size={14} className="text-indigo-500" />
                                    Cutoff Range
                                </div>
                                <DateRangePicker
                                    label="Monthly Cutoff Period"
                                    range={editor.firstCutoffRange || { startDay: 1, endDay: 25, payDay: 30 }}
                                    onChange={r => setEditor({ ...editor, firstCutoffRange: r })}
                                    color="amber"
                                />
                            </div>
                        )}

                        {editor.frequency === 'Weekly' && (
                            <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100/50">
                                <div className="flex items-center gap-2 mb-4 text-xs font-bold text-indigo-900 uppercase tracking-wide">
                                    <Clock size={14} className="text-indigo-500" />
                                    Weekly Pay Day
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1.5">Pay Day</label>
                                        <select
                                            className="w-full border border-indigo-100 rounded-xl p-2.5 pl-4 text-slate-900 font-bold bg-white focus:border-indigo-500 outline-none appearance-none"
                                            value={editor.firstPayDate}
                                            onChange={e => setEditor({ ...editor, firstPayDate: e.target.value })}
                                        >
                                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Apply to all months toggle */}
                        {editor.frequency !== 'Weekly' && (
                            <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${editor.applyToAllMonths ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white'}`}>
                                    {editor.applyToAllMonths && <Check size={12} className="text-white" />}
                                </div>
                                <div onClick={() => setEditor({ ...editor, applyToAllMonths: !editor.applyToAllMonths })}>
                                    <span className="text-sm font-bold text-slate-800 block">Apply to all months</span>
                                    <span className="text-[10px] text-slate-400 font-medium block">Use the same cutoff ranges for every month. Individual months can still be overridden from the year view.</span>
                                </div>
                            </label>
                        )}

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
                        </div>

                        <button onClick={handleSave} className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95 text-sm">
                            {activeId ? 'Save Changes' : 'Create Schedule'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Month Override Modal */}
            <Modal isOpen={!!editingOverride} onClose={() => setEditingOverride(null)} className="max-w-2xl">
                <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                                    <Edit2 size={20} />
                                </div>
                                Override: {overrideMonthLabel}
                            </h3>
                            <p className="text-sm text-slate-400 font-medium mt-1 ml-[52px]">
                                {hasExistingOverride
                                    ? 'This month has a custom override. Edit or reset it below.'
                                    : 'Set custom cutoff dates and pay days for this month only.'}
                            </p>
                        </div>
                        {hasExistingOverride && (
                            <button
                                onClick={handleResetOverride}
                                className="flex items-center gap-2 px-3 py-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-xs font-bold hover:bg-rose-100 transition-colors"
                            >
                                <RotateCcw size={13} />
                                Reset to Default
                            </button>
                        )}
                    </div>

                    <div className="space-y-6 max-h-[520px] overflow-y-auto pr-1">
                        {/* Range pickers */}
                        {selectedSchedule?.frequency === 'Semi-Monthly' ? (
                            <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100/50 space-y-6">
                                <div className="text-xs font-bold text-indigo-900 uppercase tracking-wide flex items-center gap-2">
                                    <Clock size={14} className="text-indigo-500" />
                                    Cutoff Ranges for {overrideMonthLabel}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <DateRangePicker
                                        label="1st Cutoff Period"
                                        range={overrideEditor.firstCutoffRange}
                                        onChange={r => setOverrideEditor({ ...overrideEditor, firstCutoffRange: r })}
                                        color="amber"
                                    />
                                    <DateRangePicker
                                        label="2nd Cutoff Period"
                                        range={overrideEditor.secondCutoffRange || { startDay: 11, endDay: 25, payDay: 30 }}
                                        onChange={r => setOverrideEditor({ ...overrideEditor, secondCutoffRange: r })}
                                        color="emerald"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100/50">
                                <div className="text-xs font-bold text-indigo-900 uppercase tracking-wide flex items-center gap-2 mb-4">
                                    <Clock size={14} className="text-indigo-500" />
                                    Cutoff Range for {overrideMonthLabel}
                                </div>
                                <DateRangePicker
                                    label="Monthly Cutoff Period"
                                    range={overrideEditor.firstCutoffRange}
                                    onChange={r => setOverrideEditor({ ...overrideEditor, firstCutoffRange: r })}
                                    color="amber"
                                />
                            </div>
                        )}

                        {/* Note */}
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Note (optional)</label>
                            <input
                                className="w-full border border-slate-200 p-3 rounded-xl text-slate-700 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                                placeholder="e.g. Shortened cutoff due to holiday"
                                value={overrideEditor.note}
                                onChange={e => setOverrideEditor({ ...overrideEditor, note: e.target.value })}
                            />
                        </div>

                        {/* Default comparison hint */}
                        {selectedSchedule && (
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-500 space-y-1">
                                <div className="font-bold text-slate-600 uppercase tracking-wide text-[10px] mb-2">Default Schedule (all other months)</div>
                                {selectedSchedule.firstCutoffRange && (
                                    <div>1st Cutoff: day {selectedSchedule.firstCutoffRange.startDay}–{selectedSchedule.firstCutoffRange.endDay}, Pay: day {selectedSchedule.firstCutoffRange.payDay}</div>
                                )}
                                {selectedSchedule.secondCutoffRange && (
                                    <div>2nd Cutoff: day {selectedSchedule.secondCutoffRange.startDay}–{selectedSchedule.secondCutoffRange.endDay}, Pay: day {selectedSchedule.secondCutoffRange.payDay}</div>
                                )}
                            </div>
                        )}

                        <div className="flex gap-3 pt-1">
                            <button
                                onClick={handleSaveOverride}
                                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 text-sm"
                            >
                                Save Override
                            </button>
                            <button
                                onClick={() => setEditingOverride(null)}
                                className="px-6 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default PaySchedulePage;
