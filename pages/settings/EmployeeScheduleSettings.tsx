
import React, { useState, useMemo, useCallback } from 'react';
import {
    Calendar,
    Filter,
    Copy,
    Users,
    Building2,
    Search,
    ChevronUp,
    ChevronDown,
} from 'lucide-react';

// --- Types ---
type WorkStatus = 'O' | 'WFH' | 'H' | 'R';

interface EmployeeScheduleEntry {
    employeeId: string;
    name: string;
    department: string;
    division: string;
    section: string;
    schedule: Record<string, WorkStatus>; // key: 'YYYY-MM-DD'
}

// --- Constants ---
const WORK_STATUS_CONFIG: Record<WorkStatus, { label: string; color: string; bg: string; border: string }> = {
    O: { label: 'Office', color: 'text-indigo-700', bg: 'bg-indigo-100', border: 'border-indigo-200' },
    WFH: { label: 'WFH', color: 'text-emerald-700', bg: 'bg-emerald-100', border: 'border-emerald-200' },
    H: { label: 'Holiday', color: 'text-amber-700', bg: 'bg-amber-100', border: 'border-amber-200' },
    R: { label: 'Rest', color: 'text-slate-500', bg: 'bg-slate-100', border: 'border-slate-200' },
};

const STATUS_CYCLE: WorkStatus[] = ['O', 'WFH', 'R'];

// --- Philippine Holidays ---
const HOLIDAYS: Record<string, string> = {
    // 2024
    '2024-01-01': "New Year's Day",
    '2024-02-10': 'Chinese New Year',
    '2024-02-12': 'Chinese New Year Holiday',
    '2024-02-13': 'Chinese New Year Holiday',
    '2024-02-25': 'EDSA People Power Revolution',
    '2024-03-28': 'Maundy Thursday',
    '2024-03-29': 'Good Friday',
    '2024-03-30': 'Black Saturday',
    '2024-04-09': 'Araw ng Kagitingan',
    '2024-04-10': 'Eid\'l Fitr',
    '2024-05-01': 'Labor Day',
    '2024-06-12': 'Independence Day',
    '2024-06-17': 'Eid\'l Adha',
    '2024-08-21': 'Ninoy Aquino Day',
    '2024-08-26': 'National Heroes Day',
    '2024-11-01': "All Saints' Day",
    '2024-11-30': 'Bonifacio Day',
    '2024-12-25': 'Christmas Day',
    '2024-12-30': 'Rizal Day',
    // 2025
    '2025-01-01': "New Year's Day",
    '2025-01-29': 'Chinese New Year',
    '2025-01-30': 'Chinese New Year Holiday',
    '2025-01-31': 'Chinese New Year Holiday',
    '2025-02-25': 'EDSA People Power Revolution',
    '2025-04-17': 'Maundy Thursday',
    '2025-04-18': 'Good Friday',
    '2025-04-19': 'Black Saturday',
    '2025-04-09': 'Araw ng Kagitingan',
    '2025-05-01': 'Labor Day',
    '2025-06-12': 'Independence Day',
    '2025-08-21': 'Ninoy Aquino Day',
    '2025-08-25': 'National Heroes Day',
    '2025-11-01': "All Saints' Day",
    '2025-11-30': 'Bonifacio Day',
    '2025-12-25': 'Christmas Day',
    '2025-12-30': 'Rizal Day',
    // 2026
    '2026-01-01': "New Year's Day",
    '2026-02-17': 'Chinese New Year',
    '2026-02-18': 'Chinese New Year Holiday',
    '2026-02-19': 'Chinese New Year Holiday',
    '2026-02-25': 'EDSA People Power Revolution',
    '2026-04-09': 'Araw ng Kagitingan',
    '2026-04-02': 'Maundy Thursday',
    '2026-04-03': 'Good Friday',
    '2026-04-04': 'Black Saturday',
    '2026-05-01': 'Labor Day',
    '2026-06-12': 'Independence Day',
    '2026-08-21': 'Ninoy Aquino Day',
    '2026-08-31': 'National Heroes Day',
    '2026-11-01': "All Saints' Day",
    '2026-11-30': 'Bonifacio Day',
    '2026-12-25': 'Christmas Day',
    '2026-12-30': 'Rizal Day',
    // 2027
    '2027-01-01': "New Year's Day",
    '2027-02-06': 'Chinese New Year',
    '2027-02-07': 'Chinese New Year Holiday',
    '2027-02-08': 'Chinese New Year Holiday',
    '2027-02-25': 'EDSA People Power Revolution',
    '2027-04-09': 'Araw ng Kagitingan',
    '2027-03-25': 'Maundy Thursday',
    '2027-03-26': 'Good Friday',
    '2027-03-27': 'Black Saturday',
    '2027-05-01': 'Labor Day',
    '2027-06-12': 'Independence Day',
    '2027-08-21': 'Ninoy Aquino Day',
    '2027-08-30': 'National Heroes Day',
    '2027-11-01': "All Saints' Day",
    '2027-11-30': 'Bonifacio Day',
    '2027-12-25': 'Christmas Day',
    '2027-12-30': 'Rizal Day',
};

const DIVISIONS = ['Technology', 'Operations'];
const ORG_STRUCTURE: Record<string, Record<string, string[]>> = {
    Technology: {
        'IT Department': ['Development', 'Infrastructure'],
        'Product Team': ['Design', 'Research'],
    },
    Operations: {
        'HR Department': ['Recruitment', 'Employee Relations'],
        'Finance Department': ['Accounting', 'Payroll'],
    },
};

// --- Mock Data Generator ---
const generateScheduleForYear = (year: number, pattern: WorkStatus[]): Record<string, WorkStatus> => {
    const schedule: Record<string, WorkStatus> = {};
    for (let month = 0; month < 12; month++) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const dow = new Date(year, month, d).getDay();
            if (HOLIDAYS[dateStr]) {
                schedule[dateStr] = 'H';
            } else if (dow === 0 || dow === 6) {
                schedule[dateStr] = 'R';
            } else {
                schedule[dateStr] = pattern[d % pattern.length];
            }
        }
    }
    return schedule;
};

const MOCK_EMPLOYEES: EmployeeScheduleEntry[] = [
    { employeeId: 'emp-001', name: 'Sarah Wilson', department: 'IT Department', division: 'Technology', section: 'Development', schedule: generateScheduleForYear(2026, ['O', 'O', 'O', 'WFH', 'O']) },
    { employeeId: 'emp-002', name: 'Louis Panganiban', department: 'IT Department', division: 'Technology', section: 'Development', schedule: generateScheduleForYear(2026, ['O', 'O', 'WFH', 'O', 'O']) },
    { employeeId: 'emp-003', name: 'Jane Smith', department: 'IT Department', division: 'Technology', section: 'Development', schedule: generateScheduleForYear(2026, ['O', 'WFH', 'O', 'O', 'O']) },
    { employeeId: 'emp-004', name: 'John Doe', department: 'IT Department', division: 'Technology', section: 'Infrastructure', schedule: generateScheduleForYear(2026, ['O', 'O', 'O', 'O', 'O']) },
    { employeeId: 'emp-005', name: 'Mike Brown', department: 'Product Team', division: 'Technology', section: 'Design', schedule: generateScheduleForYear(2026, ['O', 'O', 'WFH', 'WFH', 'O']) },
    { employeeId: 'emp-006', name: 'Alice Guo', department: 'Product Team', division: 'Technology', section: 'Research', schedule: generateScheduleForYear(2026, ['O', 'WFH', 'WFH', 'O', 'O']) },
    { employeeId: 'emp-007', name: 'Robert Chen', department: 'HR Department', division: 'Operations', section: 'Recruitment', schedule: generateScheduleForYear(2026, ['O', 'O', 'O', 'O', 'O']) },
    { employeeId: 'emp-008', name: 'Emily Davis', department: 'HR Department', division: 'Operations', section: 'Employee Relations', schedule: generateScheduleForYear(2026, ['O', 'O', 'O', 'WFH', 'O']) },
    { employeeId: 'emp-009', name: 'David Kim', department: 'Finance Department', division: 'Operations', section: 'Accounting', schedule: generateScheduleForYear(2026, ['O', 'O', 'O', 'O', 'O']) },
    { employeeId: 'emp-010', name: 'Maria Santos', department: 'Finance Department', division: 'Operations', section: 'Payroll', schedule: generateScheduleForYear(2026, ['O', 'O', 'WFH', 'O', 'O']) },
    { employeeId: 'emp-011', name: 'James Cordon', department: 'IT Department', division: 'Technology', section: 'Development', schedule: generateScheduleForYear(2026, ['WFH', 'O', 'O', 'O', 'WFH']) },
    { employeeId: 'emp-012', name: 'Ana Reyes', department: 'HR Department', division: 'Operations', section: 'Recruitment', schedule: generateScheduleForYear(2026, ['O', 'O', 'O', 'O', 'WFH']) },
];

const EmployeeScheduleSettings: React.FC = () => {
    const [employees, setEmployees] = useState<EmployeeScheduleEntry[]>(MOCK_EMPLOYEES);
    const [viewDate, setViewDate] = useState(new Date(2026, 2, 1)); // March 2026
    const [selectedYear, setSelectedYear] = useState(2026);
    const [filterDivision, setFilterDivision] = useState<string>('');
    const [filterDepartment, setFilterDepartment] = useState<string>('');
    const [filterSection, setFilterSection] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');

    // Range selection state
    const [rangeStart, setRangeStart] = useState<{ empId: string; date: string } | null>(null);
    const [showStatusDropdown, setShowStatusDropdown] = useState<{ empId: string; dates: string[]; x: number; y: number } | null>(null);

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const handleSelectMonth = (selectedMonth: number) => {
        setViewDate(new Date(selectedYear, selectedMonth, 1));
    };

    const handleYearChange = (newYear: number) => {
        setSelectedYear(newYear);
        setViewDate(new Date(newYear, month, 1));
    };

    // Build date strings for the month
    const dates = useMemo(() => {
        return Array.from({ length: daysInMonth }, (_, i) => {
            const d = i + 1;
            return `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        });
    }, [year, month, daysInMonth]);

    // Get week of month (W1-W4)
    const getWeekOfMonth = (dateStr: string) => {
        const parts = dateStr.split('-');
        const dayOfMonth = parseInt(parts[2]);
        return Math.floor((dayOfMonth - 1) / 7) + 1;
    };

    const dayAbbreviations = ['SU', 'M', 'T', 'W', 'TH', 'F', 'SA'];

    // Available departments based on division filter
    const availableDepartments = useMemo(() => {
        if (!filterDivision) return Object.values(ORG_STRUCTURE).flatMap(d => Object.keys(d));
        return Object.keys(ORG_STRUCTURE[filterDivision] || {});
    }, [filterDivision]);

    const availableSections = useMemo(() => {
        if (!filterDepartment) return [];
        for (const div of Object.values(ORG_STRUCTURE)) {
            if (div[filterDepartment]) return div[filterDepartment];
        }
        return [];
    }, [filterDepartment]);

    // Filter employees
    const filteredEmployees = useMemo(() => {
        return employees.filter(emp => {
            if (filterDivision && emp.division !== filterDivision) return false;
            if (filterDepartment && emp.department !== filterDepartment) return false;
            if (filterSection && emp.section !== filterSection) return false;
            if (searchTerm && !emp.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
            return true;
        });
    }, [employees, filterDivision, filterDepartment, filterSection, searchTerm]);

    // Group by department
    const groupedByDept = useMemo(() => {
        const groups: Record<string, EmployeeScheduleEntry[]> = {};
        filteredEmployees.forEach(emp => {
            if (!groups[emp.department]) groups[emp.department] = [];
            groups[emp.department].push(emp);
        });
        return groups;
    }, [filteredEmployees]);

    // Click handler for cycling status
    const handleCellClick = (empId: string, dateStr: string, event: React.MouseEvent) => {
        if (event.shiftKey && rangeStart && rangeStart.empId === empId) {
            // Range selection
            const startIdx = dates.indexOf(rangeStart.date);
            const endIdx = dates.indexOf(dateStr);
            const [from, to] = startIdx <= endIdx ? [startIdx, endIdx] : [endIdx, startIdx];
            const selectedDates = dates.slice(from, to + 1);
            setShowStatusDropdown({
                empId,
                dates: selectedDates,
                x: event.clientX,
                y: event.clientY,
            });
            setRangeStart(null);
            return;
        }

        // Regular click: cycle status
        setRangeStart({ empId, date: dateStr });
        setEmployees(prev => prev.map(emp => {
            if (emp.employeeId !== empId) return emp;
            const currentStatus = emp.schedule[dateStr] || 'O';
            if (currentStatus === 'H') return emp; // Don't cycle holidays
            const currentIdx = STATUS_CYCLE.indexOf(currentStatus);
            const nextStatus = STATUS_CYCLE[(currentIdx + 1) % STATUS_CYCLE.length];
            return {
                ...emp,
                schedule: { ...emp.schedule, [dateStr]: nextStatus },
            };
        }));
    };

    // Apply status to range
    const applyStatusToRange = (status: WorkStatus) => {
        if (!showStatusDropdown) return;
        const { empId, dates: selectedDates } = showStatusDropdown;
        setEmployees(prev => prev.map(emp => {
            if (emp.employeeId !== empId) return emp;
            const newSchedule = { ...emp.schedule };
            selectedDates.forEach(d => {
                if (newSchedule[d] !== 'H') { // Don't override holidays
                    newSchedule[d] = status;
                }
            });
            return { ...emp, schedule: newSchedule };
        }));
        setShowStatusDropdown(null);
    };

    // Copy month pattern
    const [showCopyModal, setShowCopyModal] = useState(false);
    const [copyTargetMonths, setCopyTargetMonths] = useState<number[]>([]);

    const handleCopyMonth = () => {
        if (copyTargetMonths.length === 0) return;

        setEmployees(prev => prev.map(emp => {
            const newSchedule = { ...emp.schedule };
            // Get current month's pattern by day-of-week
            const pattern: Record<number, WorkStatus> = {};
            dates.forEach(d => {
                const dow = new Date(d + 'T00:00:00').getDay();
                if (emp.schedule[d] && emp.schedule[d] !== 'H') {
                    pattern[dow] = emp.schedule[d];
                }
            });

            copyTargetMonths.forEach(targetMonth => {
                const targetDays = new Date(year, targetMonth + 1, 0).getDate();
                for (let dd = 1; dd <= targetDays; dd++) {
                    const dateStr = `${year}-${String(targetMonth + 1).padStart(2, '0')}-${String(dd).padStart(2, '0')}`;
                    if (HOLIDAYS[dateStr]) {
                        newSchedule[dateStr] = 'H';
                    } else {
                        const dow = new Date(year, targetMonth, dd).getDay();
                        newSchedule[dateStr] = pattern[dow] || (dow === 0 || dow === 6 ? 'R' : 'O');
                    }
                }
            });

            return { ...emp, schedule: newSchedule };
        }));

        setShowCopyModal(false);
        setCopyTargetMonths([]);
    };

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <div className="space-y-8 min-h-screen overflow-y-auto pr-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                        Employee Schedule
                        <Calendar className="text-indigo-600" size={24} />
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Manage employee work status schedules across departments.</p>
                </div>
                <button
                    onClick={() => setShowCopyModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95"
                >
                    <Copy size={16} />
                    Copy Month
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Filter size={16} className="text-slate-400" />
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Filters</span>
                    </div>

                    <div className="relative max-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                            type="text"
                            placeholder="Search name..."
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-100"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <select
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none appearance-none"
                        value={filterDivision}
                        onChange={e => { setFilterDivision(e.target.value); setFilterDepartment(''); setFilterSection(''); }}
                    >
                        <option value="">All Divisions</option>
                        {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>

                    <select
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none appearance-none"
                        value={filterDepartment}
                        onChange={e => { setFilterDepartment(e.target.value); setFilterSection(''); }}
                    >
                        <option value="">All Departments</option>
                        {availableDepartments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>

                    {availableSections.length > 0 && (
                        <select
                            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none appearance-none"
                            value={filterSection}
                            onChange={e => setFilterSection(e.target.value)}
                        >
                            <option value="">All Sections</option>
                            {availableSections.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    )}
                </div>
            </div>

            {/* Month & Year Navigation */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                {/* Year Selector */}
                <div className="flex items-center justify-center gap-4 mb-6">
                    <button
                        onClick={() => handleYearChange(selectedYear - 1)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
                        title="Previous year"
                    >
                        <ChevronUp size={20} />
                    </button>
                    <span className="text-xl font-bold text-slate-900 min-w-[80px] text-center">{selectedYear}</span>
                    <button
                        onClick={() => handleYearChange(selectedYear + 1)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
                        title="Next year"
                    >
                        <ChevronDown size={20} />
                    </button>
                </div>

                {/* Month Cards Grid */}
                <div className="grid grid-cols-6 gap-2">
                    {monthNames.map((name, i) => {
                        const isSelected = month === i && year === selectedYear;
                        return (
                            <button
                                key={i}
                                onClick={() => handleSelectMonth(i)}
                                className={`py-1.5 px-1 rounded-lg text-xs font-semibold border transition-all ${
                                    isSelected
                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow shadow-indigo-100'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50'
                                }`}
                            >
                                {name.slice(0, 3)}
                            </button>
                        );
                    })}
                </div>

                {/* Legend */}
                <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-4 flex-wrap">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Legend:</span>
                    {Object.entries(WORK_STATUS_CONFIG).map(([key, cfg]) => (
                        <div key={key} className="flex items-center gap-1.5">
                            <div className={`w-6 h-6 rounded flex items-center justify-center text-[9px] font-bold ${cfg.bg} ${cfg.color} border ${cfg.border}`}>{key}</div>
                            <span className="text-[10px] font-bold text-slate-500">{cfg.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Schedule Tables per Department */}
            <div className="space-y-6">
                {Object.entries(groupedByDept).map(([dept, deptEmployees]) => (
                    <div key={dept} className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                            <Building2 size={16} className="text-indigo-600" />
                            <h3 className="text-sm font-bold text-slate-900">{dept}</h3>
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                {deptEmployees.length} employees
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="sticky left-0 z-10 bg-white px-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest min-w-[180px] border-r border-slate-100">
                                            Employee
                                        </th>
                                        {dates.map((dateStr, i) => {
                                            const d = i + 1;
                                            const dow = new Date(dateStr + 'T00:00:00').getDay();
                                            const isWeekend = dow === 0 || dow === 6;
                                            const isHoliday = !!HOLIDAYS[dateStr];
                                            const weekNum = i === 0 || new Date(dateStr + 'T00:00:00').getDay() === 1 ? `W${getWeekOfMonth(dateStr)}` : '';

                                            return (
                                                <th
                                                    key={dateStr}
                                                    className={`px-1 py-2 text-center min-w-[36px] ${isWeekend ? 'bg-slate-50' : ''} ${isHoliday ? 'bg-amber-50' : ''}`}
                                                >
                                                    {weekNum && (
                                                        <div className="text-[8px] font-bold text-indigo-400 mb-0.5">{weekNum}</div>
                                                    )}
                                                    <div className="text-[10px] font-bold text-slate-500">{d}</div>
                                                    <div className={`text-[8px] font-bold ${isWeekend ? 'text-slate-400' : 'text-slate-300'}`}>
                                                        {dayAbbreviations[dow]}
                                                    </div>
                                                </th>
                                            );
                                        })}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {deptEmployees.map(emp => (
                                        <tr key={emp.employeeId} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="sticky left-0 z-10 bg-white px-4 py-3 border-r border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">
                                                        {emp.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-bold text-slate-900">{emp.name}</div>
                                                        <div className="text-[9px] text-slate-400">{emp.section}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            {dates.map(dateStr => {
                                                const status = emp.schedule[dateStr] || 'O';
                                                const cfg = WORK_STATUS_CONFIG[status];
                                                const dow = new Date(dateStr + 'T00:00:00').getDay();
                                                const isWeekend = dow === 0 || dow === 6;

                                                const isHoliday = !!HOLIDAYS[dateStr];

                                                return (
                                                    <td
                                                        key={dateStr}
                                                        className={`px-1 py-1.5 text-center ${isWeekend ? 'bg-slate-50/50' : ''}`}
                                                    >
                                                        <div className="flex flex-col items-center gap-0.5">
                                                            <button
                                                                onClick={(e) => handleCellClick(emp.employeeId, dateStr, e)}
                                                                className={`w-7 h-7 rounded flex items-center justify-center text-[9px] font-bold transition-all hover:scale-110 hover:shadow-sm ${cfg.bg} ${cfg.color} border ${cfg.border}`}
                                                                title={`${emp.name} - ${dateStr}: ${cfg.label}${HOLIDAYS[dateStr] ? ` (${HOLIDAYS[dateStr]})` : ''}. Click to cycle, Shift+click for range select.`}
                                                            >
                                                                {status}
                                                            </button>
                                                            {isHoliday && status !== 'H' && (
                                                                <div className="w-7 h-4 rounded flex items-center justify-center text-[8px] font-bold bg-yellow-100 text-yellow-700 border border-yellow-300">
                                                                    H
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}

                {filteredEmployees.length === 0 && (
                    <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center">
                        <Users size={48} className="mx-auto text-slate-200 mb-4" />
                        <h3 className="text-lg font-bold text-slate-700 mb-2">No Employees Found</h3>
                        <p className="text-sm text-slate-500">Adjust your filters to see employee schedules.</p>
                    </div>
                )}
            </div>

            {/* Status Dropdown for Range Selection */}
            {showStatusDropdown && (
                <div
                    className="fixed z-50 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 space-y-1"
                    style={{ left: showStatusDropdown.x, top: showStatusDropdown.y }}
                >
                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Apply to {showStatusDropdown.dates.length} days
                    </div>
                    {STATUS_CYCLE.map(status => {
                        const cfg = WORK_STATUS_CONFIG[status];
                        return (
                            <button
                                key={status}
                                onClick={() => applyStatusToRange(status)}
                                className={`w-full px-3 py-2 rounded-lg text-left text-xs font-bold flex items-center gap-2 transition-colors hover:bg-slate-50 ${cfg.color}`}
                            >
                                <div className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold ${cfg.bg} border ${cfg.border}`}>
                                    {status}
                                </div>
                                {cfg.label}
                            </button>
                        );
                    })}
                    <button
                        onClick={() => setShowStatusDropdown(null)}
                        className="w-full px-3 py-2 rounded-lg text-left text-xs font-bold text-slate-400 hover:bg-slate-50"
                    >
                        Cancel
                    </button>
                </div>
            )}

            {/* Copy Month Modal */}
            {showCopyModal && (
                <div className="fixed inset-0 bg-black/30 z-40 flex items-center justify-center" onClick={() => setShowCopyModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Copy Month Pattern</h3>
                        <p className="text-sm text-slate-500 mb-6">
                            Copy the current month's schedule pattern ({viewDate.toLocaleString('default', { month: 'long' })}) to other months.
                        </p>

                        <div className="grid grid-cols-4 gap-2 mb-6">
                            {monthNames.map((name, i) => {
                                const isCurrent = i === month;
                                const isSelected = copyTargetMonths.includes(i);
                                return (
                                    <button
                                        key={i}
                                        disabled={isCurrent}
                                        onClick={() => {
                                            setCopyTargetMonths(prev =>
                                                prev.includes(i) ? prev.filter(m => m !== i) : [...prev, i]
                                            );
                                        }}
                                        className={`p-3 rounded-xl text-xs font-bold border-2 transition-all ${
                                            isCurrent
                                                ? 'bg-indigo-50 border-indigo-200 text-indigo-600 cursor-not-allowed'
                                                : isSelected
                                                    ? 'bg-indigo-600 border-indigo-600 text-white'
                                                    : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-200'
                                        }`}
                                    >
                                        {name}
                                        {isCurrent && <div className="text-[8px] mt-0.5">Current</div>}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleCopyMonth}
                                disabled={copyTargetMonths.length === 0}
                                className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Copy to {copyTargetMonths.length} Month{copyTargetMonths.length !== 1 ? 's' : ''}
                            </button>
                            <button
                                onClick={() => setShowCopyModal(false)}
                                className="px-6 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeScheduleSettings;
