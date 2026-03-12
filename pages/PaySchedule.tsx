
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
    StickyNote,
    Building2,
    Briefcase,
    User,
    Search as SearchIcon
} from 'lucide-react';
import { PaySchedule, CutoffRange, MonthOverride } from '../types';
import Modal from '../components/Modal';

const MOCK_DIVISORS = [
    { id: 'div-1', name: '314 Days - Regular', days: 314 },
    { id: 'div-2', name: '288 Days - Compressed', days: 288 }
];

const MOCK_DEPARTMENTS = [
    { id: 'dept-ops', name: 'Operations' },
    { id: 'dept-exec', name: 'Executive' },
    { id: 'dept-it', name: 'IT' },
    { id: 'dept-hr', name: 'Human Resources' }
];

const MOCK_POSITIONS = [
    { id: 'pos-01', name: 'Software Engineer' },
    { id: 'pos-02', name: 'Account Manager' },
    { id: 'pos-03', name: 'Department Head' }
];

const MOCK_EMPLOYEES = [
    { id: 'emp-01', name: 'James Cordon' },
    { id: 'emp-02', name: 'Louis Panganiban' },
    { id: 'emp-03', name: 'Sarah Wilson' }
];

export const INITIAL_SCHEDULES: PaySchedule[] = [
    {
        id: 'ps-001',
        name: 'Corporate Employees — Semi-Monthly',
        frequency: 'Semi-Monthly',
        targetType: 'Global',
        targetId: null,
        firstCutoff: 15,
        firstPayDate: 20,
        secondCutoff: 30,
        secondPayDate: 5,
        divisorId: 'div-1',
        firstCutoffRange: { startDay: 1, endDay: 15, payDay: 20 },
        secondCutoffRange: { startDay: 16, endDay: 30, payDay: 5 },
        applyToAllMonths: true,
        monthOverrides: [],
        universalCutoffId: '0-default-1'
    },
    {
        id: 'ps-002',
        name: 'Project & Contractual Workers — Weekly',
        frequency: 'Weekly',
        targetType: 'Department',
        targetId: 'dept-ops',
        firstPayDate: 'Friday',
        divisorId: 'div-2',
        applyToAllMonths: true,
        monthOverrides: []
    },
    {
        id: 'ps-003',
        name: 'Executive & Senior Management — Monthly',
        frequency: 'Monthly',
        targetType: 'Department',
        targetId: 'dept-exec',
        firstCutoff: 31,
        firstPayDate: 31,
        divisorId: 'div-1',
        firstCutoffRange: { startDay: 1, endDay: 31, payDay: 31 },
        applyToAllMonths: true,
        monthOverrides: []
    },
    {
        id: 'ps-004',
        name: 'Daily Wage Workers — Physical Plant',
        frequency: 'Daily',
        targetType: 'Department',
        targetId: 'dept-pp',
        divisorId: 'div-1',
        applyToAllMonths: true,
        monthOverrides: [],
        dailyStartTime: '08:00',
        dailyEndTime: '17:00',
        dailyPayTime: '18:00'
    }
];

// --- Helper: get active ranges for a specific month ---
export const getActiveRanges = (schedule: PaySchedule, month: number, year: number): CutoffRange[] => {
    const override = schedule.monthOverrides?.find(o => o.month === month && o.year === year);
    if (override && override.cutoffs.length > 0) {
        return override.cutoffs;
    }

    // Default generating logic matching editor
    let cutoffs: CutoffRange[] = [];
    if (schedule.frequency === 'Semi-Monthly') {
        cutoffs = [
            ...(schedule.extraCutoffs || []),
            schedule.firstCutoffRange || { startDay: 1, endDay: 10, payDay: 15 },
            schedule.secondCutoffRange || { startDay: 11, endDay: 25, payDay: 30 }
        ];
    } else if (schedule.frequency === 'Monthly') {
        cutoffs = [
            ...(schedule.extraCutoffs || []),
            schedule.firstCutoffRange || { startDay: 1, endDay: 25, payDay: 30 }
        ];
    }
    return cutoffs;
};

// --- Date Range Picker Component ---
interface DateRangePickerProps {
    label: string;
    range: CutoffRange;
    onChange: (range: CutoffRange) => void;
    color?: 'amber' | 'emerald';
    month?: number;
    year?: number;
    disabled?: boolean;
}
export const DateRangePicker: React.FC<DateRangePickerProps> = ({ label, range, onChange, color = 'amber', month, year, disabled = false }) => {
    const [selectingField, setSelectingField] = useState<'start' | 'end' | 'pay' | null>(null);

    const currentMonthDays = typeof month === 'number' && typeof year === 'number' ? new Date(year, month + 1, 0).getDate() : 31;
    const nextMonthDays = typeof month === 'number' && typeof year === 'number' ? new Date(year, month + 2, 0).getDate() : 31;

    const m1Days = Array.from({ length: currentMonthDays }, (_, i) => i + 1);
    const m2Days = Array.from({ length: nextMonthDays }, (_, i) => i + 1);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthName = typeof month === 'number' ? monthNames[month] : 'Current Month';
    const nextMonthName = typeof month === 'number' ? monthNames[(month + 1) % 12] : 'Next Month';

    const bgColor = color === 'amber' ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200';
    const fillColor = color === 'amber' ? 'bg-amber-50' : 'bg-emerald-50';
    const activeColor = color === 'amber' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white';
    const payDotColor = color === 'amber' ? 'ring-amber-400' : 'ring-emerald-400';

    const handleDayClick = (day: number, offset: number) => {
        if (disabled) return;
        if (selectingField === 'start') {
            onChange({ ...range, startDay: day });
            setSelectingField('end');
        } else if (selectingField === 'end') {
            onChange({ ...range, endDay: day, endDayNextMonth: offset === 1 });
            setSelectingField('pay');
        } else if (selectingField === 'pay') {
            onChange({ ...range, payDay: day, payDayNextMonth: offset === 1 });
            setSelectingField(null);
        } else {
            onChange({ ...range, startDay: day });
            setSelectingField('end');
        }
    };

    const isInterMonth = range.endDayNextMonth !== undefined ? range.endDayNextMonth : range.startDay > range.endDay;

    const isInRange = (day: number, offset: number) => {
        if (!isInterMonth) {
            return offset === 0 && day >= range.startDay && day <= range.endDay;
        } else {
            return offset === 0 ? day >= range.startDay : day <= range.endDay;
        }
    };

    const isStart = (day: number, offset: number) => offset === 0 && day === range.startDay;

    // In an inter-month cutoff, the end day wraps to the second month (offset 1)
    const isEnd = (day: number, offset: number) => isInterMonth ? (offset === 1 && day === range.endDay) : (offset === 0 && day === range.endDay);

    const isPay = (day: number, offset: number) => {
        if (range.payDayNextMonth !== undefined) {
            return (offset === 1) === range.payDayNextMonth && day === range.payDay;
        }
        // if payDay < startDay, physically it was recorded as next month
        if (range.payDay < range.startDay) {
            return offset === 1 && day === range.payDay;
        }
        return offset === 0 && day === range.payDay;
    };

    const renderMonthGrid = (daysArray: number[], offset: number, monthLabel: string) => (
        <div className="flex-1 w-full min-w-[220px]">
            <div className={`text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest text-center py-1.5 rounded-lg border ${offset === 0 ? 'bg-indigo-50/50 border-indigo-100/50' : 'bg-slate-50 border-slate-100'}`}>
                {monthLabel} {typeof year === 'number' ? (offset === 0 ? year : (typeof month === 'number' && month === 11 ? year + 1 : year)) : ''}
            </div>
            <div className="grid grid-cols-7 gap-1.5 px-0.5">
                {daysArray.map(day => {
                    const inR = isInRange(day, offset);
                    const isS = isStart(day, offset);
                    const isE = isEnd(day, offset);
                    const isP = isPay(day, offset);

                    return (
                        <button
                            key={day}
                            onClick={() => handleDayClick(day, offset)}
                            className={`h-8 w-full flex items-center justify-center text-[10px] font-bold rounded-lg transition-all relative
                                ${isP ? 'bg-indigo-600 text-white ring-2 z-10 ' + payDotColor + ' shadow-md'
                                    : isS || isE ? activeColor + ' shadow-sm z-10'
                                        : inR ? fillColor + ' text-slate-800 font-black'
                                            : 'text-slate-400 hover:bg-slate-100 bg-white border border-slate-100/50'
                                }
                                ${disabled ? 'cursor-default opacity-80' : selectingField ? 'cursor-pointer hover:shadow-lg hover:border-indigo-300 hover:scale-[1.15] z-20' : 'cursor-default'}
                            `}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</h4>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => !disabled && setSelectingField('start')}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${selectingField === 'start' ? activeColor + ' border-transparent shadow-md' : bgColor} ${disabled ? 'cursor-default opacity-80' : 'cursor-pointer hover:opacity-80'}`}
                    >
                        Start: {range.startDay}
                    </button>
                    <button
                        onClick={() => !disabled && setSelectingField('end')}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${selectingField === 'end' ? activeColor + ' border-transparent shadow-md' : bgColor} ${disabled ? 'cursor-default opacity-80' : 'cursor-pointer hover:opacity-80'}`}
                    >
                        End: {range.endDay}
                    </button>
                    <button
                        onClick={() => !disabled && setSelectingField('pay')}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all shadow-sm ${selectingField === 'pay' ? 'bg-indigo-500 text-white border-transparent' : 'bg-indigo-50 text-indigo-700 border-indigo-200'} ${disabled ? 'cursor-default opacity-80' : 'cursor-pointer hover:bg-indigo-100'}`}
                    >
                        Pay: {range.payDay}
                    </button>
                </div>
            </div>

            <div className={`p-4 rounded-xl border ${disabled ? 'bg-slate-50 border-slate-100' : 'bg-white border-slate-200 shadow-sm'}`}>
                {selectingField && !disabled && (
                    <div className="mb-4 text-[10px] text-indigo-600 font-bold bg-indigo-50/80 px-4 py-2.5 rounded-lg border border-indigo-100 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            <span>Awaiting selection for new <span className="uppercase text-indigo-900 border-b border-indigo-200 ml-1">{selectingField}</span> date.</span>
                        </div>
                        <span className="text-slate-400 italic">Click a date below</span>
                    </div>
                )}

                <div className="flex gap-4 overflow-x-auto pb-1">
                    {renderMonthGrid(m1Days, 0, currentMonthName)}
                    {renderMonthGrid(m2Days, 1, nextMonthName)}
                </div>
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

    const cutoffs = getActiveRanges(schedule, month, year);

    const getDayClass = (day: number) => {
        if (schedule.frequency === 'Daily') {
            return 'bg-emerald-500 text-white';
        }

        if (schedule.frequency === 'Weekly') {
            const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const dayOfWeek = new Date(year, month, day).getDay();
            if (weekDays[dayOfWeek] === String(schedule.firstPayDate)) {
                return 'bg-emerald-500 text-white';
            }
            return '';
        }

        for (const c of cutoffs) {
            if (day === Math.min(c.payDay, daysInMonth)) return 'bg-emerald-500 text-white';
        }

        for (const c of cutoffs) {
            const s = c.startDay, e = Math.min(c.endDay, daysInMonth);
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
    const [selectedCutoffId, setSelectedCutoffId] = useState<string>('0-1');
    const [selectedViewCutoffId, setSelectedViewCutoffId] = useState<string>('0-1');
    const [viewDate, setViewDate] = useState(new Date());
    const [showYearView, setShowYearView] = useState(false);
    const [editorYear, setEditorYear] = useState<number>(new Date().getFullYear());

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
        dailyStartTime: '08:00',
        dailyEndTime: '17:00',
        dailyPayTime: '18:00',
        monthOverrides: [],
    });

    const getYearlyCutoffs = () => {
        const list: any[] = [];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        if (editor.frequency === 'Semi-Monthly' || editor.frequency === 'Monthly') {
            for (let i = 0; i < 12; i++) {
                const override = editor.monthOverrides?.find(o => o.month === i && o.year === editorYear);
                let cutoffs: CutoffRange[] = [];

                if (override && override.cutoffs && override.cutoffs.length > 0) {
                    cutoffs = override.cutoffs;
                } else {
                    if (editor.frequency === 'Semi-Monthly') {
                        cutoffs = [
                            ...(editor.extraCutoffs || []),
                            editor.firstCutoffRange || { startDay: 1, endDay: 10, payDay: 15 },
                            editor.secondCutoffRange || { startDay: 11, endDay: 25, payDay: 30 }
                        ];
                    } else if (editor.frequency === 'Monthly') {
                        cutoffs = [
                            ...(editor.extraCutoffs || []),
                            editor.firstCutoffRange || { startDay: 1, endDay: 25, payDay: 30 }
                        ];
                    }
                }

                const baseCount = editor.frequency === 'Semi-Monthly' ? 2 : 1;
                const extraCount = cutoffs.length - baseCount;

                cutoffs.forEach((c, idx) => {
                    const isExtra = idx < extraCount;
                    const defaultIdx = idx - extraCount + 1;

                    let name = 'New Cutoff';
                    if (!isExtra) {
                        const localBaseIdx = idx - extraCount;
                        if (editor.frequency === 'Semi-Monthly') {
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
    };

    const yearlyCutoffs = useMemo(getYearlyCutoffs, [editor, editorYear]);
    const activeCutoff = yearlyCutoffs.find(c => c.id === selectedCutoffId) || yearlyCutoffs[0];

    const selectedSchedule = useMemo(() => schedules.find(s => s.id === selectedId), [schedules, selectedId]);

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
    }, [selectedSchedule, viewDate]);

    const activeViewCutoff = viewYearlyCutoffs.find(c => c.id === selectedViewCutoffId) || viewYearlyCutoffs[0];

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
        const cutoffs = getActiveRanges(selectedSchedule, viewDate.getMonth(), viewDate.getFullYear());

        if (frequency === 'Daily') {
            events.push({ type: 'pay', label: 'Daily Pay' });
        } else if (frequency === 'Weekly') {
            const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const currentDayName = weekDays[new Date(viewDate.getFullYear(), viewDate.getMonth(), day).getDay()];
            if (String(selectedSchedule.firstPayDate) === currentDayName) {
                events.push({ type: 'pay', label: 'Pay Day' });
            }
        } else if (frequency === 'Semi-Monthly' || frequency === 'Monthly') {
            const baseCount = frequency === 'Semi-Monthly' ? 2 : 1;
            const extraCount = cutoffs.length - baseCount;

            cutoffs.forEach((c, idx) => {
                const s = c.startDay;
                const e = Math.min(c.endDay, maxDays);
                const isExtra = idx < extraCount;
                const defaultIdx = idx - extraCount + 1;

                let prefix = 'New';
                if (!isExtra) {
                    if (frequency === 'Semi-Monthly') {
                        prefix = defaultIdx === 1 ? '1st' : '2nd';
                    } else {
                        prefix = 'Monthly';
                    }
                }

                if (day === s) events.push({ type: 'cutoff', label: `${prefix} Start` });
                if (day === e) events.push({ type: 'cutoff', label: `${prefix} End` });
                if (isMatch(c.payDay)) events.push({ type: 'pay', label: `${prefix} Pay` });
            });
        }

        return events;
    };

    const isInCutoffRange = (day: number) => {
        if (!selectedSchedule) return false;
        const maxDays = getDaysInMonth(viewDate);
        const cutoffs = getActiveRanges(selectedSchedule, viewDate.getMonth(), viewDate.getFullYear());

        for (const c of cutoffs) {
            const s = c.startDay, e = Math.min(c.endDay, maxDays);
            if (s <= e ? (day >= s && day <= e) : (day >= s || day <= e)) return true;
        }
        return false;
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
            monthOverrides: [],
        });
        setIsCreating(true);
        setActiveId(null);
        setSelectedCutoffId('0-1');
    };

    const handleOpenEdit = (sch: PaySchedule) => {
        setEditor({ ...sch });
        setIsCreating(true);
        setActiveId(sch.id);
        setSelectedCutoffId('0-1');
    };

    const handleSave = () => {
        if (!editor.name || !editor.frequency) return;

        const newSchedule: PaySchedule = {
            id: activeId || Math.random().toString(36).substr(2, 9),
            name: editor.name!,
            frequency: editor.frequency!,
            targetType: editor.targetType || 'Global',
            targetId: editor.targetId || null,
            firstCutoff: editor.firstCutoffRange?.endDay || editor.firstCutoff || 15,
            firstPayDate: editor.firstCutoffRange?.payDay || editor.firstPayDate || 30,
            secondCutoff: editor.secondCutoffRange?.endDay || editor.secondCutoff,
            secondPayDate: editor.secondCutoffRange?.payDay || editor.secondPayDate,
            divisorId: editor.divisorId,
            firstCutoffRange: editor.firstCutoffRange,
            secondCutoffRange: editor.secondCutoffRange,
            applyToAllMonths: editor.applyToAllMonths ?? true,
            dailyStartTime: editor.dailyStartTime,
            dailyEndTime: editor.dailyEndTime,
            dailyPayTime: editor.dailyPayTime,
            monthOverrides: activeId ? (schedules.find(s => s.id === activeId)?.monthOverrides || []) : [],
            universalCutoffId: editor.universalCutoffId,
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
                                onClick={() => { setSelectedId(s.id); setSelectedViewCutoffId('0-1'); }}
                                className={`p-4 rounded-2xl cursor-pointer transition-all group relative border ${selectedId === s.id ? 'bg-white border-indigo-200 shadow-md shadow-indigo-50' : 'bg-white/50 border-transparent hover:bg-white hover:border-slate-200 hover:shadow-sm'}`}
                            >
                                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={(e) => { e.stopPropagation(); handleOpenEdit(s); }} className="p-1.5 bg-slate-100 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"><Edit2 size={14} /></button>
                                    <button onClick={(e) => handleDelete(s.id, e)} className="p-1.5 bg-slate-100 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"><Trash2 size={14} /></button>
                                    {s.frequency === 'Daily' && s.dailyStartTime && (
                                        <span className="text-[10px] text-amber-600 font-bold border border-amber-100 bg-amber-50 px-2 py-0.5 rounded-lg flex items-center gap-1">
                                            <Clock size={10} /> {s.dailyStartTime}-{s.dailyEndTime}
                                        </span>
                                    )}
                                </div>
                                <h3 className={`font-bold text-sm ${selectedId === s.id ? 'text-indigo-900' : 'text-slate-700'}`}>{s.name}</h3>
                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wide border ${selectedId === s.id ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                        {s.frequency}
                                    </span>
                                    {s.divisorId && (
                                        <span className="text-[10px] text-slate-400 font-bold border border-slate-200 px-2 py-0.5 rounded-lg">
                                            {MOCK_DIVISORS.find((d: any) => d.id === s.divisorId)?.days} Days
                                        </span>
                                    )}
                                    {s.universalCutoffId && (
                                        <span className="text-[10px] text-emerald-600 font-bold border border-emerald-100 bg-emerald-50 px-2 py-0.5 rounded-lg flex items-center gap-1">
                                            <Globe size={10} /> Universal
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-400 font-medium">
                                    {s.targetType === 'Global' && <Globe size={14} />}
                                    {s.targetType === 'Department' && <Building2 size={14} />}
                                    {s.targetType === 'Position' && <Briefcase size={14} />}
                                    {s.targetType === 'Employee' && <User size={14} />}
                                    <span className="truncate">
                                        {s.targetType === 'Global' && 'All Employees'}
                                        {s.targetType === 'Department' && (MOCK_DEPARTMENTS.find(d => d.id === s.targetId)?.name || 'Select Department')}
                                        {s.targetType === 'Position' && (MOCK_POSITIONS.find(p => p.id === s.targetId)?.name || 'Select Position')}
                                        {s.targetType === 'Employee' && (MOCK_EMPLOYEES.find(e => e.id === s.targetId)?.name || 'Select Employee')}
                                    </span>
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
                                    <span className="flex items-center gap-1.5 bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg text-[10px] font-bold border border-slate-200 uppercase tracking-wide">
                                        {selectedSchedule.targetType === 'Global' && <Globe size={12} />}
                                        {selectedSchedule.targetType === 'Department' && <Building2 size={12} />}
                                        {selectedSchedule.targetType === 'Position' && <Briefcase size={12} />}
                                        {selectedSchedule.targetType === 'Employee' && <User size={12} />}
                                        {selectedSchedule.targetType === 'Global' && 'Global'}
                                        {selectedSchedule.targetType === 'Department' && 'Department'}
                                        {selectedSchedule.targetType === 'Position' && 'Position'}
                                        {selectedSchedule.targetType === 'Employee' && 'Employee'}
                                        {selectedSchedule.targetId && (
                                            <>
                                                <span className="text-slate-300 mx-1">|</span>
                                                {selectedSchedule.targetType === 'Department' && (MOCK_DEPARTMENTS.find(d => d.id === selectedSchedule.targetId)?.name)}
                                                {selectedSchedule.targetType === 'Position' && (MOCK_POSITIONS.find(p => p.id === selectedSchedule.targetId)?.name)}
                                                {selectedSchedule.targetType === 'Employee' && (MOCK_EMPLOYEES.find(e => e.id === selectedSchedule.targetId)?.name)}
                                            </>
                                        )}
                                    </span>
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
                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${currentMonthOverride
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
                                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${showYearView ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-200'
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

                        {selectedSchedule.frequency !== 'Weekly' && selectedSchedule.frequency !== 'Daily' ? null : (
                            /* Legend only for daily/weekly grids */
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
                        )}

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto bg-slate-50 border-t border-slate-100">
                            {selectedSchedule.frequency === 'Semi-Monthly' || selectedSchedule.frequency === 'Monthly' ? (
                                <div className="flex h-full p-6 gap-6">
                                    {/* Left Panel: List of Cutoffs */}
                                    <div className="w-1/3 border border-slate-200 rounded-2xl overflow-y-auto bg-white custom-scrollbar-horizontal flex flex-col shadow-sm">
                                        <div className="sticky top-0 bg-slate-50 p-4 border-b border-slate-200 z-10 flex items-center justify-between">
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Yearly Cutoffs</span>
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
                                                        <div className="flex items-center justify-between">
                                                            <div className={`text-sm font-bold flex items-center gap-2 ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>
                                                                <Globe size={12} className={selectedSchedule.universalCutoffId === c.id ? 'text-emerald-500' : 'text-slate-300'} />
                                                                {c.name}
                                                            </div>
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
                                    <div className="w-2/3 border border-slate-200 rounded-2xl bg-white p-8 shadow-sm flex flex-col justify-center items-center">
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
                                        <div className="mt-8">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest border border-slate-100 bg-slate-50 px-3 py-1.5 rounded-lg flex items-center gap-2">
                                                <Edit2 size={12} /> Click "Edit Schedule" to modify cutoffs.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-8">
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
                                                        isEditable={selectedSchedule.frequency !== 'Weekly' && selectedSchedule.frequency !== 'Daily'}
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
            <Modal isOpen={isCreating} onClose={() => setIsCreating(false)} className="max-w-6xl">
                <div className="p-8">
                    <h3 className="text-xl font-bold mb-6 text-slate-900 flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                            {activeId ? <Edit2 size={20} /> : <Plus size={20} />}
                        </div>
                        {activeId ? 'Edit Pay Schedule' : 'Create Pay Schedule'}
                    </h3>

                    <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-2">
                        {/* Unified Configuration */}
                        <div className="bg-white space-y-10">

                            {/* Section 1: General Configuration */}
                            <div className="space-y-6">
                                <div className="grid grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Schedule Name</label>
                                        <input
                                            className="w-full border border-slate-200 p-3.5 rounded-2xl text-slate-900 text-sm font-bold bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all shadow-sm"
                                            placeholder="e.g. Regular Employees"
                                            value={editor.name}
                                            onChange={e => setEditor({ ...editor, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Frequency</label>
                                        <div className="relative">
                                            <select
                                                className="w-full border border-slate-200 p-3.5 rounded-2xl text-slate-900 text-sm font-bold bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none appearance-none transition-all cursor-pointer shadow-sm"
                                                value={editor.frequency}
                                                onChange={e => setEditor({ ...editor, frequency: e.target.value as any })}
                                            >
                                                <option value="Semi-Monthly">Semi-Monthly (Twice)</option>
                                                <option value="Monthly">Monthly (Once)</option>
                                                <option value="Weekly">Weekly</option>
                                                <option value="Daily">Daily</option>
                                            </select>
                                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" size={16} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Payroll Divisor</label>
                                        <div className="relative">
                                            <select
                                                className="w-full border border-slate-200 p-3.5 rounded-2xl text-slate-900 text-sm font-bold bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none appearance-none transition-all cursor-pointer shadow-sm"
                                                value={editor.divisorId}
                                                onChange={e => setEditor({ ...editor, divisorId: e.target.value })}
                                            >
                                                <option value="">Select a divisor...</option>
                                                {MOCK_DIVISORS.map((d: any) => (
                                                    <option key={d.id} value={d.id}>{d.name} ({d.days} days)</option>
                                                ))}
                                            </select>
                                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" size={16} />
                                        </div>
                                    </div>
                                </div>

                                {/* Row 2: Assignment Logic */}
                                <div className="grid grid-cols-4 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Assign To</label>
                                        <div className="relative">
                                            <select
                                                className="w-full border border-slate-200 p-3.5 rounded-2xl text-slate-900 text-sm font-bold bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none appearance-none transition-all cursor-pointer shadow-sm"
                                                value={editor.targetType}
                                                onChange={e => setEditor({ ...editor, targetType: e.target.value as any, targetId: null })}
                                            >
                                                <option value="Global">Global (All Employees)</option>
                                                <option value="Department">Department</option>
                                                <option value="Position">Position</option>
                                                <option value="Employee">Specific Employee</option>
                                            </select>
                                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" size={16} />
                                        </div>
                                    </div>

                                    {editor.targetType !== 'Global' && (
                                        <div className="col-span-3">
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                                                Select {editor.targetType}
                                            </label>
                                            <div className="relative">
                                                <select
                                                    className="w-full border border-slate-200 p-3.5 rounded-2xl text-slate-900 text-sm font-bold bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none appearance-none transition-all cursor-pointer shadow-sm"
                                                    value={editor.targetId || ''}
                                                    onChange={e => setEditor({ ...editor, targetId: e.target.value })}
                                                >
                                                    <option value="">Select Target...</option>
                                                    {editor.targetType === 'Department' && MOCK_DEPARTMENTS.map((d: any) => (
                                                        <option key={d.id} value={d.id}>{d.name}</option>
                                                    ))}
                                                    {editor.targetType === 'Position' && MOCK_POSITIONS.map((p: any) => (
                                                        <option key={p.id} value={p.id}>{p.name}</option>
                                                    ))}
                                                    {editor.targetType === 'Employee' && MOCK_EMPLOYEES.map((e: any) => (
                                                        <option key={e.id} value={e.id}>{e.name}</option>
                                                    ))}
                                                </select>
                                                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" size={16} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Section 2: Cutoff & Schedule Logic */}
                            <div className="space-y-6">

                                {(editor.frequency === 'Semi-Monthly' || editor.frequency === 'Monthly') && (
                                    <div className="flex gap-6 h-[400px]">
                                        {/* Left Panel: List of Cutoffs */}
                                        <div className="w-1/3 border border-slate-200 rounded-2xl overflow-y-auto bg-slate-50 custom-scrollbar-horizontal flex flex-col">
                                            <div className="sticky top-0 bg-slate-100 p-3 flex flex-row items-center justify-between border-b border-slate-200 shadow-sm z-10 group">
                                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Yearly Cutoffs</span>
                                                <button
                                                    onClick={() => {
                                                        const targetMonth = activeCutoff ? activeCutoff.month : 0;
                                                        const overrides = [...(editor.monthOverrides || [])];
                                                        const oIdx = overrides.findIndex(o => o.month === targetMonth && o.year === editorYear);

                                                        // Fallback to base schedule options if creating an override from scratch
                                                        let existingOverride = oIdx >= 0 ? { ...overrides[oIdx] } : {
                                                            month: targetMonth,
                                                            year: editorYear,
                                                            cutoffs: editor.frequency === 'Monthly'
                                                                ? [...(editor.extraCutoffs || []), editor.firstCutoffRange || { startDay: 1, endDay: 25, payDay: 30 }]
                                                                : [...(editor.extraCutoffs || []), editor.firstCutoffRange!, editor.secondCutoffRange!]
                                                        };

                                                        // Blank slate cutoff with lowest values
                                                        existingOverride.cutoffs = [{ startDay: 1, endDay: 1, payDay: 1 }, ...existingOverride.cutoffs];

                                                        if (oIdx >= 0) overrides[oIdx] = existingOverride;
                                                        else overrides.push(existingOverride);

                                                        // Force disable Apply to all months to allow custom ad-hoc overrides safely
                                                        setEditor({ ...editor, applyToAllMonths: false, monthOverrides: overrides });
                                                    }}
                                                    className="text-[10px] bg-white border border-slate-200 font-bold text-slate-600 px-2 py-1 flex items-center gap-1 rounded hover:bg-indigo-50 hover:text-indigo-600 transition-colors shadow-sm"
                                                >
                                                    <Plus size={12} /> Add
                                                </button>
                                            </div>
                                            <div className="divide-y divide-slate-100">
                                                {yearlyCutoffs.map(c => {
                                                    const isSelected = selectedCutoffId === c.id;
                                                    return (
                                                        <div
                                                            key={c.id}
                                                            onClick={() => setSelectedCutoffId(c.id)}
                                                            className={`p-4 cursor-pointer transition-all hover:bg-white group ${isSelected ? 'bg-indigo-50 border-l-4 border-indigo-600' : 'border-l-4 border-transparent'}`}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div className={`text-sm font-bold flex items-center gap-2 ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>
                                                                    <Globe size={12} className={editor.universalCutoffId === c.id ? 'text-emerald-500' : 'text-slate-300'} />
                                                                    {c.name}
                                                                </div>
                                                                <label
                                                                    className="p-1 hover:bg-white rounded transition-colors group/check"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${editor.universalCutoffId === c.id ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white group-hover/check:border-emerald-300'}`}>
                                                                        {editor.universalCutoffId === c.id && <Check size={10} className="text-white" />}
                                                                    </div>
                                                                    <input
                                                                        type="checkbox"
                                                                        className="hidden"
                                                                        checked={editor.universalCutoffId === c.id}
                                                                        onChange={() => setEditor({ ...editor, universalCutoffId: editor.universalCutoffId === c.id ? undefined : c.id })}
                                                                    />
                                                                </label>
                                                            </div>
                                                            <div className="text-xs text-slate-500 mt-1 font-medium group-hover:text-slate-700 transition-colors">
                                                                {c.monthName} {c.range.startDay} - {c.monthName} {c.range.endDay}
                                                            </div>
                                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                                                                Pay Date: {c.monthName} {c.range.payDay}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Right Panel: Calendar / Date Picker View */}
                                        <div className="w-2/3 border border-slate-200 rounded-2xl overflow-y-auto bg-white p-8">
                                            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                                                <div className="flex items-center gap-3 text-sm font-bold text-indigo-900 uppercase tracking-wide">
                                                    <CalendarRange size={18} className="text-indigo-500" />
                                                    Configure {activeCutoff?.name} ({activeCutoff?.monthName})
                                                    {editor.universalCutoffId === activeCutoff?.id && (
                                                        <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                                                            <Globe size={10} /> Universal Reference
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Apply to all months toggle - inside right panel header */}
                                                <div className="flex items-center gap-3">
                                                    <div className="flex gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                                                        <select
                                                            value={activeCutoff?.month || 0}
                                                            onChange={(e) => {
                                                                const monthInfo = yearlyCutoffs.find(c => c.month === parseInt(e.target.value) && c.cutoffIndex === 0);
                                                                if (monthInfo) setSelectedCutoffId(monthInfo.id);
                                                            }}
                                                            className="text-[10px] font-bold text-slate-600 uppercase tracking-widest bg-transparent border-none focus:ring-0 outline-none cursor-pointer"
                                                        >
                                                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => (
                                                                <option key={m} value={i}>{m}</option>
                                                            ))}
                                                        </select>
                                                        <span className="text-slate-300">|</span>
                                                        <select
                                                            value={editorYear}
                                                            onChange={(e) => setEditorYear(parseInt(e.target.value))}
                                                            className="text-[10px] font-bold text-slate-600 uppercase tracking-widest bg-transparent border-none focus:ring-0 outline-none cursor-pointer"
                                                        >
                                                            {[2024, 2025, 2026, 2027, 2028, 2029].map(y => (
                                                                <option key={y} value={y}>{y}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <label className="flex items-center gap-2 cursor-pointer group bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-white transition-colors">
                                                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider group-hover:text-indigo-600 transition-colors">Apply to all months</span>
                                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${editor.applyToAllMonths ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white'}`}>
                                                            {editor.applyToAllMonths && <Check size={10} className="text-white" />}
                                                        </div>
                                                        <input
                                                            type="checkbox"
                                                            className="hidden"
                                                            checked={editor.applyToAllMonths}
                                                            onChange={() => setEditor({ ...editor, applyToAllMonths: !editor.applyToAllMonths })}
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                            {activeCutoff && (
                                                <div className="w-full max-w-2xl mx-auto">
                                                    <DateRangePicker
                                                        label={`${activeCutoff.name} Cutoff Period`}
                                                        range={activeCutoff.range}
                                                        month={activeCutoff.month}
                                                        year={editorYear}
                                                        onChange={(newRange) => {
                                                            if (editor.applyToAllMonths) {
                                                                const numExtras = (editor.extraCutoffs || []).length;
                                                                if (activeCutoff.cutoffIndex < numExtras) {
                                                                    const extras = [...(editor.extraCutoffs || [])];
                                                                    extras[activeCutoff.cutoffIndex] = newRange;
                                                                    setEditor({ ...editor, extraCutoffs: extras });
                                                                } else if (activeCutoff.cutoffIndex === numExtras) {
                                                                    setEditor({ ...editor, firstCutoffRange: newRange });
                                                                } else if (activeCutoff.cutoffIndex === numExtras + 1 && editor.frequency === 'Semi-Monthly') {
                                                                    setEditor({ ...editor, secondCutoffRange: newRange });
                                                                }
                                                            } else {
                                                                const overrides = [...(editor.monthOverrides || [])];
                                                                const oIdx = overrides.findIndex(o => o.month === activeCutoff.month && o.year === editorYear);
                                                                let existingOverride = oIdx >= 0 ? { ...overrides[oIdx] } : {
                                                                    month: activeCutoff.month,
                                                                    year: editorYear,
                                                                    cutoffs: editor.frequency === 'Monthly'
                                                                        ? [...(editor.extraCutoffs || []), editor.firstCutoffRange || { startDay: 1, endDay: 25, payDay: 30 }]
                                                                        : [...(editor.extraCutoffs || []), editor.firstCutoffRange!, editor.secondCutoffRange!]
                                                                };

                                                                // clone cutoffs array
                                                                existingOverride.cutoffs = [...existingOverride.cutoffs];
                                                                existingOverride.cutoffs[activeCutoff.cutoffIndex] = newRange;

                                                                if (oIdx >= 0) overrides[oIdx] = existingOverride;
                                                                else overrides.push(existingOverride);

                                                                setEditor({ ...editor, monthOverrides: overrides });
                                                            }
                                                        }}
                                                        color={activeCutoff.isFirst ? 'amber' : 'emerald'}
                                                    />
                                                </div>
                                            )}
                                            <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                                                <p className="text-xs text-slate-500 font-medium">
                                                    {editor.applyToAllMonths ? (
                                                        <span className="text-amber-600 font-bold">Note: You have "Apply to all months" enabled. Editing this month will affect ALL months. Uncheck it below if you only want to change this specific month.</span>
                                                    ) : (
                                                        <span className="text-emerald-600 font-bold">Custom override active: Changes here only applied to {activeCutoff?.monthName}.</span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {editor.frequency === 'Weekly' && (
                                    <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100/50">
                                        <div className="flex items-center gap-2 mb-6 text-xs font-bold text-indigo-900 uppercase tracking-wide">
                                            <Clock size={14} className="text-indigo-500" />
                                            Weekly Pay Day
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex-1 max-w-sm">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Pay Day</label>
                                                <div className="relative">
                                                    <select
                                                        className="w-full border border-slate-200 rounded-xl p-3.5 pl-4 text-slate-900 font-bold bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none appearance-none transition-all shadow-sm"
                                                        value={editor.firstPayDate}
                                                        onChange={e => setEditor({ ...editor, firstPayDate: e.target.value })}
                                                    >
                                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => <option key={d} value={d}>{d}</option>)}
                                                    </select>
                                                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" size={16} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {editor.frequency === 'Daily' && (
                                    <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100/50 space-y-6">
                                        <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 uppercase tracking-wide">
                                            <Clock size={14} className="text-indigo-500" />
                                            Daily Cutoff & Pay Time
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Work Start</label>
                                                <input
                                                    type="time"
                                                    className="w-full border border-slate-200 p-3.5 rounded-xl text-slate-900 text-sm font-bold bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all shadow-sm"
                                                    value={editor.dailyStartTime}
                                                    onChange={e => setEditor({ ...editor, dailyStartTime: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Work End</label>
                                                <input
                                                    type="time"
                                                    className="w-full border border-slate-200 p-3.5 rounded-xl text-slate-900 text-sm font-bold bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all shadow-sm"
                                                    value={editor.dailyEndTime}
                                                    onChange={e => setEditor({ ...editor, dailyEndTime: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Pay Time</label>
                                                <input
                                                    type="time"
                                                    className="w-full border border-slate-200 p-3.5 rounded-xl text-slate-900 text-sm font-bold bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all shadow-sm"
                                                    value={editor.dailyPayTime}
                                                    onChange={e => setEditor({ ...editor, dailyPayTime: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-indigo-600 font-medium bg-white/50 p-4 rounded-xl border border-indigo-100/50 italic">
                                            Cutoff is defined per day. Pay is released daily at the specified pay time.
                                        </p>
                                    </div>
                                )}

                            </div>
                        </div>

                        <div className="pt-4 pb-2">
                            <button onClick={handleSave} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95 text-xs uppercase tracking-[0.2em]">
                                {activeId ? 'Save Changes' : 'Create Pay Schedule'}
                            </button>
                        </div>
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
