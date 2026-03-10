
import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    ArrowLeft,
    ArrowRight,
    ShieldCheck,
    Building2,
    Wallet,
    Calendar,
    Calculator,
    Download,
    TrendingDown,
    Info,
    CheckCircle2,
    Filter,
    Edit2,
    Save,
    RotateCcw,
    Plus,
    Sliders,
    X as CloseIcon
} from 'lucide-react';
import { MOCK_ADJUSTMENT_TYPES } from './settings/AdjustmentSetup';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_YEAR_END_DATA, generate13thMonthHistory } from './payroll/mockData';
import Modal from '../components/Modal';
import { INITIAL_SCHEDULES, getActiveRanges } from './PaySchedule';

const YearEndBatch13thPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const stage = new URLSearchParams(location.search).get('stage') || 'assumed'; // 'assumed' or 'actual'
    const [employees] = useState(MOCK_YEAR_END_DATA);
    const [activeId, setActiveId] = useState<string>(employees[0]?.id || '');
    const [processedIds, setProcessedIds] = useState<Set<string>>(new Set());
    const [overrides, setOverrides] = useState<Record<string, number>>({});

    const activeEmployee = employees.find(e => e.id === activeId);

    // Get the current history for the active employee
    const monthlyHistory = useMemo(() => {
        if (!activeEmployee) return [];
        return generate13thMonthHistory(activeEmployee.ytdGross, activeEmployee.id, stage === 'assumed');
    }, [activeEmployee, activeId, stage]);

    const formatCurrency = (amount: number) => {
        const val = amount || 0;
        return `₱${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const handleComplete = (id: string) => {
        setProcessedIds(prev => new Set([...prev, id]));
        const nextIndex = employees.findIndex(e => e.id === activeId) + 1;
        if (nextIndex < employees.length) {
            setActiveId(employees[nextIndex].id);
        } else {
            alert("All employees have been reviewed!");
            navigate('/manage/year-end-prep');
        }
    };

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // --- Cutoff details for assumed/actual ---
    const defaultSchedule = INITIAL_SCHEDULES[0];
    const currentYear = 2026;
    // Assumed: Nov (index 10), 2nd cutoff (index 1)
    // Actual: Jan next year (index 0), 1st cutoff (index 0)
    const cutoffMonth: number = stage === 'assumed' ? 10 : 0;
    const cutoffIdx = stage === 'assumed' ? 1 : 0;
    const cutoffYear = stage === 'assumed' ? currentYear : currentYear + 1;

    const cutoffDetail = useMemo(() => {
        const ranges = getActiveRanges(defaultSchedule, cutoffMonth, cutoffYear);
        const range = ranges[cutoffIdx] || ranges[0];
        if (!range) return null;

        const payMonth = range.payDayNextMonth ? (cutoffMonth + 1) % 12 : cutoffMonth;
        const payYear = (range.payDayNextMonth && cutoffMonth === 11) ? cutoffYear + 1 : cutoffYear;
        const formattedPayDate = `${months[payMonth]} ${range.payDay}, ${payYear}`;

        const endMonth = range.endDayNextMonth ? (cutoffMonth + 1) % 12 : cutoffMonth;
        const formattedRange = `${months[cutoffMonth]} ${range.startDay} – ${months[endMonth]} ${range.endDay}`;

        return {
            month: months[cutoffMonth],
            year: cutoffYear,
            cutoff: cutoffIdx + 1,
            range: formattedRange,
            payDate: formattedPayDate
        };
    }, [defaultSchedule, cutoffMonth, cutoffYear, cutoffIdx, months]);

    // Which months (0-indexed) are editable?
    // For assumed (Nov cutoff): only Nov (10) and Dec (11) are editable
    // For actual (Jan next year cutoff): all months editable since it's the reconciliation
    const firstEditableMonth = stage === 'assumed' ? cutoffMonth : 0;

    const rowGroups = [
        {
            name: 'Earnings',
            rows: [
                { label: 'Basic Salary', key: 'basicPay', color: 'text-slate-900', isDeduction: false },
                { label: 'Holiday Pay', key: 'leaves', color: 'text-slate-600', isDeduction: false },
                { label: 'Night Diff (ND2)', key: 'nd2', color: 'text-slate-600', isDeduction: false },
                { label: 'Overtime Pay (OT 1.00)', key: 'otherEarnings', color: 'text-slate-600', isDeduction: false },
                { label: 'Rest Day OT', key: 'restDayOt', color: 'text-slate-600', isDeduction: false },
                { label: 'Attendance Bonus', key: 'bonus', color: 'text-emerald-600', isDeduction: false },
                { label: 'Salary Differential', key: 'salaryDifferential', color: 'text-indigo-600', isDeduction: false },
                { label: 'Other Taxable', key: 'otherTaxable', color: 'text-slate-600', isDeduction: false },
                { label: 'Absences (LWOP)', key: 'absences', color: 'text-rose-600', isDeduction: true },
                { label: 'Late / Undertime', key: 'lateUndertime', color: 'text-rose-600', isDeduction: true },
            ]
        },
        {
            name: 'Deductions',
            rows: [
                { label: 'SSS Contribution', key: 'sss', color: 'text-slate-500', isDeduction: true },
                { label: 'PhilHealth', key: 'philhealth', color: 'text-slate-500', isDeduction: true },
                { label: 'Pag-IBIG Contribution', key: 'pagibig', color: 'text-slate-500', isDeduction: true },
                { label: 'Withholding Tax', key: 'tax', color: 'text-rose-400', isDeduction: true },
            ]
        }
    ];

    const formatVal = (v: any, isDeduction?: boolean) => {
        if (!v || v === 0) return '-';
        return `${isDeduction ? '-' : ''}${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    if (!activeEmployee) {
        return (
            <div className="fixed inset-0 bg-slate-50 flex items-center justify-center z-[110]">
                <div className="text-center p-12 bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Wallet size={32} className="text-slate-400" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Initializing Workspace...</h3>
                    <p className="text-sm text-slate-500 font-medium mt-3 leading-relaxed">
                        We're setting up the 13th month batch environment.
                    </p>
                    <button
                        onClick={() => navigate('/manage/year-end/13th')}
                        className="mt-8 w-full py-3 bg-slate-900 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
                    >
                        Return to Preparation
                    </button>
                </div>
            </div>
        );
    }

    const totalEarnedBasic = monthlyHistory.reduce((acc: number, curr: any) => acc + curr.earnedBasic, 0);
    const calculated13th = totalEarnedBasic / 12;

    const current13thVal = overrides[activeId] !== undefined ? overrides[activeId] : calculated13th;

    return (
        <div className="fixed inset-0 bg-slate-100 z-[100] flex flex-col h-screen overflow-hidden text-slate-900">
            {/* Top Bar Header */}
            <div className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm shrink-0 z-30">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/manage/year-end/13th')}
                        className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200 group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div className="h-10 w-px bg-slate-200"></div>
                    <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            13th Month Adjustment Ledger
                            <span className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100">
                                {stage === 'assumed' ? 'Assumed' : 'Actual'}
                            </span>
                        </h2>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Workspace: Review and verify monthly earnings for the final 13th month payout</span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Progress</span>
                        <div className="flex items-center gap-3">
                            <div className="w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-indigo-600"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(processedIds.size / employees.length) * 100}%` }}
                                />
                            </div>
                            <span className="text-xs font-black text-slate-700">{processedIds.size} / {employees.length}</span>
                        </div>
                    </div>
                    <button onClick={() => navigate('/manage/year-end/13th')} className="bg-rose-50 text-rose-600 px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-[0.1em] hover:bg-rose-600 hover:text-white transition-all border border-rose-100">Close & Save Draft</button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar - Employee Queue */}
                <div className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Employee Queue</span>
                        <Filter size={14} className="text-slate-300" />
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                        {employees.map((emp) => {
                            const isActive = activeId === emp.id;
                            const isProcessed = processedIds.has(emp.id);
                            return (
                                <button
                                    key={emp.id}
                                    onClick={() => {
                                        setActiveId(emp.id);
                                    }}
                                    className={`flex items-center gap-4 p-4 rounded-2xl w-full text-left transition-all border-l-4 ${isActive
                                        ? 'bg-slate-900 border-indigo-600 text-white shadow-xl scale-[1.02] active:scale-95'
                                        : 'bg-white border-transparent hover:bg-slate-50 text-slate-700 hover:border-slate-100'
                                        }`}
                                >
                                    <div className="relative">
                                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-black border-2 ${isActive ? 'bg-white/20 border-white/40 text-white' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
                                            {emp.avatar}
                                        </div>
                                        {isProcessed && (
                                            <div className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-0.5 border-2 border-white shadow-sm">
                                                <CheckCircle2 size={12} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className={`text-sm font-black truncate ${isActive ? 'text-white' : 'text-slate-900'}`}>{emp.name}</div>
                                        <div className="text-[10px] font-bold truncate opacity-60 uppercase tracking-widest text-slate-500">{emp.role}</div>
                                    </div>
                                    {isActive && <ChevronRight size={18} className="text-white opacity-40 ml-auto" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content Workspace */}
                <div className="flex-1 bg-slate-50 p-8 overflow-y-auto flex flex-col items-center">
                    <div className="w-full max-w-[95%] animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">

                        {/* Simplified Accounting Header */}
                        <div className="bg-white border border-slate-200 rounded-none shadow-sm flex flex-col md:flex-row items-stretch divide-x divide-slate-100">
                            {/* Employee Identity */}
                            <div className="p-6 flex items-center gap-6 flex-1 min-w-[400px]">
                                <div className="w-20 h-20 rounded-[2rem] bg-slate-50 border border-slate-200 flex items-center justify-center text-3xl font-black text-slate-400">
                                    {activeEmployee.avatar}
                                </div>
                                <div className="flex-1">
                                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                        {activeEmployee.name}
                                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg font-mono tracking-tighter uppercase">{activeEmployee.id}</span>
                                    </h1>
                                    <div className="flex items-center gap-3 mt-1.5">
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Building2 size={12} /> {activeEmployee.department}</span>
                                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><ShieldCheck size={12} /> Regular Full-time</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payout Calculation Snapshot */}
                            <div className="p-6 bg-slate-50 flex flex-col justify-center min-w-[300px] gap-1">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Verified Payout Value</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-black text-indigo-600 tracking-tighter">{formatCurrency(current13thVal)}</span>
                                    {overrides[activeId] !== undefined && (
                                        <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">[Manual Override]</span>
                                    )}
                                </div>
                                {cutoffDetail && (
                                    <div className="text-[9px] font-bold text-slate-400 mt-1 flex items-center gap-1.5">
                                        <Calendar size={10} className="text-slate-300" />
                                        {cutoffDetail.month} {cutoffDetail.year} · Cutoff {cutoffDetail.cutoff} ({cutoffDetail.range}) · Pay: {cutoffDetail.payDate}
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="p-6 flex items-center gap-3">
                                <div className="h-full px-8 bg-slate-50 border border-slate-200 text-slate-400 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm cursor-not-allowed">
                                    <ShieldCheck size={14} /> Records Verified
                                </div>
                            </div>
                        </div>

                        {/* Accounting Style Ledger Table */}
                        <div className="bg-white border-2 border-slate-300 overflow-hidden mb-20 text-slate-900 font-sans shadow-2xl">
                            <div className="p-8 border-b-4 border-slate-900 bg-white">
                                <h3 className="text-2xl font-black uppercase tracking-tighter">2026 Payroll Ledger</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Reference ID: {activeEmployee.id} | Year-End Ledger Verification</p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[1800px]">
                                    <thead className="bg-white">
                                        <tr className="border-b-2 border-slate-900 bg-white shadow-[0_4px_12px_-4px_rgba(0,0,0,0.1)]">
                                            <th rowSpan={2} className="px-6 py-4 text-[11px] font-black text-slate-900 uppercase tracking-widest sticky left-0 top-0 bg-white z-40 border-r-2 border-slate-200 min-w-[250px]">Description</th>
                                            {months.map(m => (
                                                <th key={m} colSpan={2} className="px-2 py-2 text-[11px] font-black text-slate-900 text-center bg-white">{m}</th>
                                            ))}
                                            <th rowSpan={2} className="px-8 py-4 text-[11px] font-black text-slate-900 uppercase tracking-widest text-right bg-slate-50 border-l border-slate-200 sticky right-0 z-30">Total</th>
                                        </tr>
                                        <tr className="border-b-[3px] border-slate-900 border-dashed bg-white">
                                            {months.map(m => (
                                                <React.Fragment key={`${m}-periods`}>
                                                    <th className="px-2 py-2 text-[9px] font-black text-slate-400 text-center border-r border-slate-100 bg-white">1st</th>
                                                    <th className="px-2 py-2 text-[9px] font-black text-slate-400 text-center border-r-2 border-slate-200 bg-white">2nd</th>
                                                </React.Fragment>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {rowGroups.map((group, gIdx) => (
                                            <React.Fragment key={gIdx}>
                                                {/* Group Header Row */}
                                                <tr className="bg-slate-50 group hover:bg-slate-100 transition-colors">
                                                    <td className="px-8 py-3 text-[12px] font-black text-slate-900 uppercase tracking-[0.2em] border-y border-slate-200 sticky left-0 z-10 bg-slate-50 shadow-sm flex items-center justify-between group">
                                                        <span>{group.name}</span>
                                                    </td>
                                                    <td colSpan={25} className="bg-slate-50/50 border-y border-slate-200"></td>
                                                </tr>
                                                {group.rows.map((row, rIdx) => {
                                                    let rowTotal = 0;
                                                    monthlyHistory.forEach((m: any) => {
                                                        rowTotal += (m.p1[row.key] || 0) + (m.p2[row.key] || 0);
                                                    });

                                                    return (
                                                        <tr key={rIdx} className="group hover:bg-slate-50 transition-colors">
                                                            <td className="px-8 py-3 sticky left-0 bg-white group-hover:bg-slate-50 transition-colors z-10 border-r-2 border-slate-200">
                                                                <span className="text-[11px] font-bold text-slate-800 tracking-tight">{row.label}</span>
                                                            </td>
                                                            {monthlyHistory.map((m: any, mIdx: number) => (
                                                                <React.Fragment key={`${mIdx}-${rIdx}`}>
                                                                    <td className="px-2 py-3 text-right font-mono text-[11px] border-r border-slate-50">
                                                                        <span className={m.p1[row.key] === 0 ? 'text-slate-300' : (row as any).color || 'text-slate-900'}>{formatVal(m.p1[row.key] || 0, row.isDeduction)}</span>
                                                                    </td>
                                                                    <td className="px-2 py-3 text-right font-mono text-[11px] border-r-2 border-slate-200">
                                                                        <span className={m.p2[row.key] === 0 ? 'text-slate-300' : (row as any).color || 'text-slate-900'}>{formatVal(m.p2[row.key] || 0, row.isDeduction)}</span>
                                                                    </td>
                                                                </React.Fragment>
                                                            ))}
                                                            <td className="px-8 py-3 text-right font-mono text-[11px] font-black text-slate-900 bg-slate-50 border-l border-slate-200">
                                                                {formatVal(rowTotal, row.isDeduction)}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                                {/* Group Total Row */}
                                                <tr className="bg-slate-200 border-t-2 border-slate-900">
                                                    <td className="px-8 py-4 sticky left-0 bg-slate-200 z-10 border-r-2 border-slate-300 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                                                        <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{group.name} Total</span>
                                                    </td>
                                                    {monthlyHistory.map((m: any, mIdx: number) => {
                                                        const p1Sum = group.rows.reduce((acc: number, r) => acc + (r.isDeduction ? -(m.p1[r.key] || 0) : (m.p1[r.key] || 0)), 0);
                                                        const p2Sum = group.rows.reduce((acc: number, r) => acc + (r.isDeduction ? -(m.p2[r.key] || 0) : (m.p2[r.key] || 0)), 0);
                                                        return (
                                                            <React.Fragment key={`${mIdx}-group-sum`}>
                                                                <td className="px-2 py-4 text-right font-mono text-[11px] font-black text-slate-900 border-r border-slate-300">{formatVal(p1Sum)}</td>
                                                                <td className="px-2 py-4 text-right font-mono text-[11px] font-black text-slate-900 border-r-2 border-slate-400">{formatVal(p2Sum)}</td>
                                                            </React.Fragment>
                                                        );
                                                    })}
                                                    <td className="px-8 py-4 text-right font-mono text-[12px] font-black text-white bg-slate-900 border-l border-slate-900">
                                                        {formatVal(monthlyHistory.reduce((acc: number, m: any) => acc + group.rows.reduce((rAcc: number, r) => rAcc + (r.isDeduction ? -(m.p1[r.key] || 0) - (m.p2[r.key] || 0) : (m.p1[r.key] || 0) + (m.p2[r.key] || 0)), 0), 0))}
                                                    </td>
                                                </tr>
                                            </React.Fragment>
                                        ))}

                                        {/* Summarized Separator */}
                                        <tr className="border-t-4 border-slate-900">
                                            <td className="px-6 py-8 sticky left-0 bg-slate-900 text-white z-10 border-r-2 border-slate-800">
                                                <div className="flex flex-col">
                                                    <span className="text-[12px] font-black uppercase tracking-[0.2em] leading-none mb-1">Grand Total Result</span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Net Computable Earnings</span>
                                                </div>
                                            </td>
                                            {monthlyHistory.map((m: any, mIdx: number) => (
                                                <React.Fragment key={`${mIdx}-total-row`}>
                                                    <td className="px-2 py-6 text-right font-mono text-[11px] font-black text-slate-900 bg-slate-50 border-r border-slate-200">
                                                        {formatVal(m.p1.earnedBasic)}
                                                    </td>
                                                    <td className="px-2 py-6 text-right font-mono text-[11px] font-black text-slate-900 bg-slate-50 border-r-2 border-slate-300">
                                                        {formatVal(m.p2.earnedBasic)}
                                                    </td>
                                                </React.Fragment>
                                            ))}
                                            <td className="px-8 py-6 text-right font-mono text-[16px] font-black text-indigo-700 bg-slate-100 border-l-2 border-indigo-700">
                                                {formatCurrency(totalEarnedBasic)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Info Banner */}
                            <div className="bg-slate-50 p-6 flex items-center gap-4 border-t border-slate-200">
                                <Info className="text-slate-400 shrink-0" size={18} />
                                <div className="flex-1">
                                    <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-wider">
                                        13th Month Computation Rule: 1/12 of total basic salary. Excludes overtime/bonuses unless integrated in company policy.
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 bg-slate-100 px-4 py-2 border border-slate-200">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">PD 851 COMPLIANT</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Global Actions Bar */}
            <div className="h-24 bg-white border-t border-slate-200 px-10 flex items-center justify-between shrink-0 shadow-[0_-8px_24px_-4px_rgba(0,0,0,0.05)] z-40">
                <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                        {employees.slice(0, 5).map((e, i) => (
                            <div key={i} className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-500 shadow-sm relative z-[5-i]">
                                {e.avatar}
                            </div>
                        ))}
                    </div>
                    <p className="text-xs font-bold text-slate-400 ml-2">Reviewing list for <span className="text-slate-900">13th Month 2026 Batch</span></p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            const currentIndex = employees.findIndex(e => e.id === activeId);
                            if (currentIndex < employees.length - 1) setActiveId(employees[currentIndex + 1].id);
                        }}
                        className="px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
                    >
                        Skip
                    </button>
                    <button
                        onClick={() => handleComplete(activeId)}
                        className="flex items-center gap-3 px-12 py-3 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 group shadow-sm"
                    >
                        Process Next Employee
                        <ArrowRight size={16} className="group-hover:translate-x-1 whitespace-nowrap" />
                    </button>
                </div>
            </div>

        </div>
    );
};

export default YearEndBatch13thPage;

const ChevronRight = ({ size, className }: { size: number, className: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6" /></svg>
);
