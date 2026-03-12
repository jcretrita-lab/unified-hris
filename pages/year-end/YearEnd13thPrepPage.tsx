import React, { useState, useMemo } from 'react';
import {
    Wallet,
    Layers,
    FileText,
    TrendingDown,
    X as CloseIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MOCK_YEAR_END_DATA, generate13thMonthHistory } from '../payroll/mockData';
import Modal from '../../components/Modal';
import YearEndPrepLayout from '../../components/year-end/YearEndPrepLayout';
import { INITIAL_SCHEDULES, getActiveRanges } from '../PaySchedule';

const YearEnd13thPrepPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedYear, setSelectedYear] = useState('2026');
    const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);
    const [detailStage, setDetailStage] = useState<'assumed' | 'actual'>('assumed');

    const filteredData = MOCK_YEAR_END_DATA.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedEmployeeData = MOCK_YEAR_END_DATA.find(d => d.id === selectedEmpId);
    const monthlyHistory = selectedEmployeeData ? generate13thMonthHistory(selectedEmployeeData.ytdGross, selectedEmployeeData.id, detailStage === 'assumed') : [];

    // Derive cutoff details from default pay schedule (ps-001)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = Number(selectedYear) || new Date().getFullYear();
    const defaultSchedule = INITIAL_SCHEDULES[0];

    // Hard-coded policy config: assumed = Nov Cutoff 2, actual = Jan (next year) Cutoff 1
    // In a real app this would be read from the saved policy state
    const assumedMonth = 10; // November (0-indexed)
    const assumedCutoffIdx = 1; // 2nd cutoff
    const actualMonth = 0; // January
    const actualYear = currentYear + 1;
    const actualCutoffIdx = 0; // 1st cutoff

    const assumedCutoffDetail = useMemo(() => {
        const ranges = getActiveRanges(defaultSchedule, assumedMonth, currentYear);
        const range = ranges[assumedCutoffIdx] || ranges[0];
        if (!range) return null;
        let rangeText = `Day ${range.startDay} – ${range.endDay}`;
        if (range.endDayNextMonth) rangeText = `Day ${range.startDay} – ${range.endDay} (Next Mo)`;
        let payText = `Day ${range.payDay}`;
        if (range.payDayNextMonth) payText = `Day ${range.payDay} (Next Mo)`;
        return { month: monthNames[assumedMonth], year: currentYear, cutoff: assumedCutoffIdx + 1, range: rangeText, payDate: payText };
    }, [defaultSchedule, currentYear]);

    const actualCutoffDetail = useMemo(() => {
        const ranges = getActiveRanges(defaultSchedule, actualMonth, actualYear);
        const range = ranges[actualCutoffIdx] || ranges[0];
        if (!range) return null;
        let rangeText = `Day ${range.startDay} – ${range.endDay}`;
        if (range.endDayNextMonth) rangeText = `Day ${range.startDay} – ${range.endDay} (Next Mo)`;
        let payText = `Day ${range.payDay}`;
        if (range.payDayNextMonth) payText = `Day ${range.payDay} (Next Mo)`;
        return { month: monthNames[actualMonth], year: actualYear, cutoff: actualCutoffIdx + 1, range: rangeText, payDate: payText };
    }, [defaultSchedule, actualYear]);

    const formatCurrency = (amount: number) => {
        const val = amount || 0;
        return `₱${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const formatVal = (v: any, isDeduction?: boolean) => {
        if (!v || v === 0) return '-';
        return `${isDeduction ? '-' : ''}${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const month13thRowGroups = [
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

    const monthsLong = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const isPartial = selectedYear === '2025';
    const partialCount = 2;
    const partialHeaders = ['Dec 1', 'Dec 15'];

    return (
        <YearEndPrepLayout
            activeTab="13th"
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
        >
            <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col"
            >
                {/* Action Bar / Batch Button */}
                <div className="px-8 py-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Eligibility</span>
                            <span className="text-sm font-bold text-slate-900">{filteredData.length} Employees</span>
                        </div>
                        <div className="w-px h-8 bg-slate-200"></div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total 13th Month (Assumed)</span>
                            <span className="text-sm font-bold text-slate-600">₱{filteredData.reduce((acc, curr) => acc + curr.assumedThirteenthMonth, 0).toLocaleString()}</span>
                        </div>
                        <div className="w-px h-8 bg-slate-200"></div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total 13th Month (Actual)</span>
                            <span className="text-sm font-black text-indigo-600">₱{filteredData.reduce((acc, curr) => acc + curr.actualThirteenthMonth, 0).toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/manage/year-end-prep/batch-13th?stage=assumed')}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-900 text-slate-900 rounded-xl text-xs font-black hover:bg-slate-50 transition-all shadow-sm active:scale-95 uppercase tracking-widest"
                        >
                            <Layers size={16} /> Batch Process Assumed
                        </button>
                        <button
                            onClick={() => navigate('/manage/year-end-prep/batch-13th?stage=actual')}
                            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-indigo-600 transition-all shadow-lg active:scale-95 uppercase tracking-widest"
                        >
                            <Layers size={16} /> Batch Process Actual
                        </button>
                    </div>
                </div>

                <table className="min-w-full divide-y divide-slate-100 border-collapse">
                    <thead className="bg-slate-50/80 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        <tr className="border-b border-slate-200">
                            <th rowSpan={2} className="px-8 py-5 border-r border-slate-100">Employee</th>
                            <th colSpan={isPartial ? 2 + partialCount : 3} className="px-6 py-3 text-center border-r border-slate-100 bg-slate-100/50 text-slate-600">
                                <div>13th Month Assumed</div>
                                {assumedCutoffDetail && (
                                    <div className="text-[9px] font-medium text-slate-400 mt-0.5 normal-case tracking-normal">
                                        {assumedCutoffDetail.month} {assumedCutoffDetail.year} · Cutoff {assumedCutoffDetail.cutoff} ({assumedCutoffDetail.range}) · Pay: {assumedCutoffDetail.payDate}
                                    </div>
                                )}
                            </th>
                            <th colSpan={isPartial ? 2 + partialCount : 3} className="px-6 py-3 text-center border-r border-slate-100 bg-indigo-50/30 text-indigo-600">
                                <div>13th Month Actual</div>
                                {actualCutoffDetail && (
                                    <div className="text-[9px] font-medium text-indigo-400 mt-0.5 normal-case tracking-normal">
                                        {actualCutoffDetail.month} {actualCutoffDetail.year} · Cutoff {actualCutoffDetail.cutoff} ({actualCutoffDetail.range}) · Pay: {actualCutoffDetail.payDate}
                                    </div>
                                )}
                            </th>
                            <th rowSpan={2} className="px-6 py-5 text-right bg-slate-50 italic">Adjustment</th>
                        </tr>
                        <tr>
                            {isPartial ? (
                                <>
                                    {partialHeaders.map((h, i) => (
                                        <th key={`assumed-${i}`} className="px-4 py-3 text-center font-black border-r border-slate-100 text-[9px] text-slate-500">{h}</th>
                                    ))}
                                </>
                            ) : (
                                <th className="px-4 py-3 text-right font-black border-r border-slate-100">Amount</th>
                            )}
                            <th className="px-4 py-3 text-center font-black border-r border-slate-100">Status</th>
                            <th className="px-4 py-3 text-center border-r border-slate-100"></th>

                            {isPartial ? (
                                <>
                                    {partialHeaders.map((h, i) => (
                                        <th key={`actual-${i}`} className="px-4 py-3 text-center font-black border-r border-slate-100 text-[9px] text-indigo-500/70">{h}</th>
                                    ))}
                                </>
                            ) : (
                                <th className="px-4 py-3 text-right font-black border-r border-slate-100">Amount</th>
                            )}
                            <th className="px-4 py-3 text-center font-black border-r border-slate-100">Status</th>
                            <th className="px-4 py-3 text-center border-r border-slate-100"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredData.map((item) => {
                            const adjustment = item.actualThirteenthMonth - item.assumedThirteenthMonth;
                            return (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-4 whitespace-nowrap border-r border-slate-50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-xs font-bold text-indigo-600 border border-indigo-100 shadow-sm">
                                                {item.avatar}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{item.name}</div>
                                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{item.role}</div>
                                            </div>
                                        </div>
                                    </td>
                                    {/* Assumed Section */}
                                    {isPartial ? (
                                        <>
                                            {Array.from({ length: partialCount }).map((_, i) => (
                                                <td key={`assumed-val-${i}`} className="px-4 py-4 text-right font-mono text-[11px] text-slate-500 font-bold border-r border-slate-50 bg-slate-50/20">
                                                    {formatCurrency(item.assumedThirteenthMonth / partialCount)}
                                                </td>
                                            ))}
                                        </>
                                    ) : (
                                        <td className="px-4 py-4 text-right font-mono text-sm text-slate-600 font-bold border-r border-slate-50 bg-slate-50/20">
                                            {formatCurrency(item.assumedThirteenthMonth)}
                                        </td>
                                    )}
                                    <td className="px-4 py-4 text-center border-r border-slate-50 bg-slate-50/20">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tight ${item.assumedStatus === 'Finalized' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                                            {item.assumedStatus}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-center border-r border-slate-50 bg-slate-50/20">
                                        <button onClick={() => { setSelectedEmpId(item.id); setDetailStage('assumed'); }} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-100 shadow-none hover:shadow-sm">
                                            <FileText size={14} />
                                        </button>
                                    </td>
                                    {/* Actual Section */}
                                    {isPartial ? (
                                        <>
                                            {Array.from({ length: partialCount }).map((_, i) => (
                                                <td key={`actual-val-${i}`} className="px-4 py-4 text-right font-mono text-[11px] text-indigo-400 font-bold border-r border-slate-50 bg-indigo-50/10">
                                                    {formatCurrency(item.actualThirteenthMonth / partialCount)}
                                                </td>
                                            ))}
                                        </>
                                    ) : (
                                        <td className="px-4 py-4 text-right font-mono text-sm text-indigo-700 font-black border-r border-slate-50 bg-indigo-50/10">
                                            {formatCurrency(item.actualThirteenthMonth)}
                                        </td>
                                    )}
                                    <td className="px-4 py-4 text-center border-r border-slate-50 bg-indigo-50/10">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tight ${item.actualStatus === 'Finalized' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-500'}`}>
                                            {item.actualStatus}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-center border-r border-slate-50 bg-indigo-50/10">
                                        <button onClick={() => { setSelectedEmpId(item.id); setDetailStage('actual'); }} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-100 shadow-none hover:shadow-sm">
                                            <FileText size={14} />
                                        </button>
                                    </td>
                                    {/* Adjustment */}
                                    <td className="px-6 py-4 text-right bg-slate-50">
                                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${adjustment > 0 ? 'text-emerald-600 bg-emerald-50' : adjustment < 0 ? 'text-rose-600 bg-rose-50' : 'text-slate-400 bg-slate-100'}`}>
                                            {adjustment === 0 ? '-' : (adjustment > 0 ? '+' : '') + formatCurrency(adjustment)}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </motion.div>

            {/* Modal for Details */}
            <Modal isOpen={!!selectedEmpId} onClose={() => setSelectedEmpId(null)} className="max-w-[95vw]">
                {selectedEmployeeData && (
                    <div className="flex flex-col max-h-[85vh] overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex justify-between items-start shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-700 shadow-sm">
                                    {selectedEmployeeData?.avatar}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">{selectedEmployeeData?.name}</h3>
                                    <p className="text-xs text-slate-500 font-medium">{selectedEmployeeData?.role} • {selectedEmployeeData?.department}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedEmpId(null)}
                                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <CloseIcon size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-6">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <Wallet className="text-indigo-600" size={20} />
                                        13th Month Pay Computation ({detailStage === 'assumed' ? 'Assumed' : 'Actual'})
                                    </h4>
                                    <div className="flex items-center gap-4">
                                        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                                            <button
                                                onClick={() => setDetailStage('assumed')}
                                                className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${detailStage === 'assumed' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                            >
                                                Assumed
                                            </button>
                                            <button
                                                onClick={() => setDetailStage('actual')}
                                                className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${detailStage === 'actual' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                            >
                                                Actual
                                            </button>
                                        </div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reference: Fiscal Year {selectedYear}</div>
                                    </div>
                                </div>

                                <div className="border-2 border-slate-300 overflow-hidden bg-white shadow-xl">
                                    <div className="overflow-x-auto custom-scrollbar-horizontal pb-4">
                                        <table className="w-full text-left border-collapse min-w-[2200px]">
                                            <thead className="bg-white">
                                                <tr className="border-b-2 border-slate-900 bg-white">
                                                    <th rowSpan={2} className="px-6 py-4 text-[11px] font-black text-slate-900 uppercase tracking-widest sticky left-0 top-0 bg-white z-20 border-r-2 border-slate-200 min-w-[250px]">Description</th>
                                                    {monthsLong.map(m => (
                                                        <th key={m} colSpan={2} className="px-2 py-2 text-[11px] font-black text-slate-900 text-center bg-white">{m}</th>
                                                    ))}
                                                    <th rowSpan={2} className="px-8 py-4 text-[11px] font-black text-slate-900 uppercase tracking-widest text-right bg-slate-50 border-l border-slate-200 sticky right-0 z-10">Total</th>
                                                </tr>
                                                <tr className="border-b-[3px] border-slate-900 border-dashed bg-white">
                                                    {monthsLong.map(m => (
                                                        <React.Fragment key={`${m}-periods`}>
                                                            <th className="px-2 py-2 text-[9px] font-black text-slate-400 text-center border-r border-slate-100 bg-white">1st</th>
                                                            <th className="px-2 py-2 text-[9px] font-black text-slate-400 text-center border-r-2 border-slate-200 bg-white">2nd</th>
                                                        </React.Fragment>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 text-[11px]">
                                                {month13thRowGroups.map((group, gIdx) => (
                                                    <React.Fragment key={gIdx}>
                                                        <tr className="bg-slate-50 group hover:bg-slate-100 transition-colors">
                                                            <td className="px-8 py-3 text-[12px] font-black text-slate-900 uppercase tracking-[0.2em] border-y border-slate-200 sticky left-0 z-10 bg-slate-50 shadow-sm">
                                                                {group.name}
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
                                                                        <span className="font-bold text-slate-800 tracking-tight">{row.label}</span>
                                                                    </td>
                                                                    {monthlyHistory.map((m: any, mIdx) => (
                                                                        <React.Fragment key={`${mIdx}-${rIdx}`}>
                                                                            <td className="px-2 py-3 text-right font-mono border-r border-slate-50">
                                                                                <span className={m.p1[row.key] === 0 ? 'text-slate-300' : row.color}>{formatVal(m.p1[row.key] || 0, row.isDeduction)}</span>
                                                                            </td>
                                                                            <td className="px-2 py-3 text-right font-mono border-r-2 border-slate-200">
                                                                                <span className={m.p2[row.key] === 0 ? 'text-slate-300' : row.color}>{formatVal(m.p2[row.key] || 0, row.isDeduction)}</span>
                                                                            </td>
                                                                        </React.Fragment>
                                                                    ))}
                                                                    <td className="px-8 py-3 text-right font-mono font-black text-slate-900 bg-slate-50 border-l border-slate-200">
                                                                        {formatVal(rowTotal, row.isDeduction)}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                        <tr className="bg-slate-200 border-t-2 border-slate-900">
                                                            <td className="px-8 py-4 sticky left-0 bg-slate-200 z-10 border-r-2 border-slate-300 shadow-[2px_0_5px_rgba(0,0,0,0.05)] text-[11px] font-black text-slate-900 uppercase tracking-widest">{group.name} Total</td>
                                                            {monthlyHistory.map((m: any, mIdx) => {
                                                                const p1Sum = group.rows.reduce((acc, r) => acc + (r.isDeduction ? -(m.p1[r.key] || 0) : (m.p1[r.key] || 0)), 0);
                                                                const p2Sum = group.rows.reduce((acc, r) => acc + (r.isDeduction ? -(m.p2[r.key] || 0) : (m.p2[r.key] || 0)), 0);
                                                                return (
                                                                    <React.Fragment key={`${mIdx}-group-sum`}>
                                                                        <td className="px-2 py-4 text-right font-mono font-black text-slate-900 border-r border-slate-300">{formatVal(p1Sum)}</td>
                                                                        <td className="px-2 py-4 text-right font-mono font-black text-slate-900 border-r-2 border-slate-400">{formatVal(p2Sum)}</td>
                                                                    </React.Fragment>
                                                                );
                                                            })}
                                                            <td className="px-8 py-4 text-right font-mono text-[12px] font-black text-white bg-slate-900 border-l border-slate-900">
                                                                {formatVal(monthlyHistory.reduce((acc, m: any) => acc + group.rows.reduce((rAcc, r) => rAcc + (r.isDeduction ? -(m.p1[r.key] || 0) - (m.p2[r.key] || 0) : (m.p1[r.key] || 0) + (m.p2[r.key] || 0)), 0), 0))}
                                                            </td>
                                                        </tr>
                                                    </React.Fragment>
                                                ))}
                                                <tr className="border-t-4 border-slate-900 bg-slate-950 text-white">
                                                    <td className="px-6 py-6 sticky left-0 bg-slate-900 text-white z-10 border-r-2 border-slate-800">
                                                        <div className="flex flex-col">
                                                            <span className="text-[12px] font-black uppercase tracking-[0.2em] leading-none mb-1 text-white">Grand Total Result</span>
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Net Computable Earnings</span>
                                                        </div>
                                                    </td>
                                                    {monthlyHistory.map((m: any, mIdx) => (
                                                        <React.Fragment key={`${mIdx}-total-row`}>
                                                            <td className="px-2 py-6 text-right font-mono font-black bg-slate-900 border-r border-slate-800">
                                                                {formatVal(m.p1.earnedBasic)}
                                                            </td>
                                                            <td className="px-2 py-6 text-right font-mono font-black bg-slate-900 border-r-2 border-slate-800">
                                                                {formatVal(m.p2.earnedBasic)}
                                                            </td>
                                                        </React.Fragment>
                                                    ))}
                                                    <td className="px-8 py-6 text-right font-mono text-[16px] font-black text-emerald-400 bg-slate-900 border-l-2 border-emerald-500">
                                                        {formatCurrency(monthlyHistory.reduce((acc, curr: any) => acc + curr.earnedBasic, 0))}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                                    <div className="absolute top-0 right-0 p-10 opacity-5">
                                        <TrendingDown size={180} />
                                    </div>
                                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                                        <div className="text-center md:text-left">
                                            <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-3">Mathematical Formula</div>
                                            <div className="text-3xl font-black tracking-tight">{formatCurrency(monthlyHistory.reduce((acc, curr) => acc + curr.earnedBasic, 0))} <span className="text-indigo-400 mx-2">/</span> 12</div>
                                            <div className="text-[10px] text-slate-400 font-bold mt-2 italic">*As per Presidential Decree No. 851 Guidelines</div>
                                        </div>
                                        <div className="h-20 w-px bg-white/10 hidden md:block"></div>
                                        <div className="text-center md:text-right">
                                            <div className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-3">Projected 13th Month</div>
                                            <div className="text-5xl font-black text-white tracking-tighter shadow-sm">{formatCurrency(selectedEmployeeData?.thirteenthMonth || 0)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3 shrink-0">
                            <button onClick={() => setSelectedEmpId(null)} className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">Close</button>
                            <button className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2">
                                <FileText size={16} /> Export Detail
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
            <style>{`
                .custom-scrollbar-horizontal::-webkit-scrollbar {
                    height: 12px;
                }
                .custom-scrollbar-horizontal::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 6px;
                }
                .custom-scrollbar-horizontal::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 6px;
                    border: 3px solid #f1f5f9;
                }
                .custom-scrollbar-horizontal::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </YearEndPrepLayout>
    );
};

export default YearEnd13thPrepPage;
