import React, { useState } from 'react';
import {
    Search,
    Download,
    Calculator,
    Wallet,
    Info,
    ShieldCheck,
    TrendingDown,
    FileText,
    ChevronRight,
    MoreHorizontal,
    Layers,
    Filter,
    CheckCircle2,
    Building2,
    Calendar,
    ArrowRight,
    Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_YEAR_END_DATA, generate13thMonthHistory } from './payroll/mockData';
import Modal from '../components/Modal';

import { useNavigate } from 'react-router-dom';

const YearEndPrepPage: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'13th' | 'tax' | 'gov'>('13th');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState('2026');

    const filteredData = MOCK_YEAR_END_DATA.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedEmployeeData = MOCK_YEAR_END_DATA.find(d => d.id === selectedEmpId);
    const monthlyHistory = selectedEmployeeData ? generate13thMonthHistory(selectedEmployeeData.ytdGross, selectedEmployeeData.id) : [];

    const formatCurrency = (amount: number) => {
        return `₱${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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

    const taxRowGroups = [
        {
            name: 'Taxable Income Details',
            rows: [
                { label: 'Basic Salary', key: 'basicPay', color: 'text-slate-900', isDeduction: false },
                { label: 'Other Taxable Income', key: 'otherTaxable', color: 'text-slate-600', isDeduction: false },
                { label: 'Salary Differential', key: 'salaryDifferential', color: 'text-indigo-600', isDeduction: false },
            ]
        },
        {
            name: 'Tax Payments & Deductions',
            rows: [
                { label: 'SSS (Employee Share)', key: 'sss', color: 'text-slate-500', isDeduction: true },
                { label: 'PhilHealth (Employee Share)', key: 'philhealth', color: 'text-slate-500', isDeduction: true },
                { label: 'Pag-IBIG (Employee Share)', key: 'pagibig', color: 'text-slate-500', isDeduction: true },
                { label: 'Withholding Tax Paid', key: 'tax', color: 'text-rose-600', isDeduction: true },
            ]
        }
    ];

    const formatVal = (v: number, isDeduction?: boolean) => {
        if (v === 0) return '-';
        return `${isDeduction ? '-' : ''}${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const monthsLong = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const tabs = [
        { id: '13th', label: '13th Month Pay', icon: Wallet },
        { id: 'tax', label: 'Tax Annualization', icon: Calculator },
        { id: 'gov', label: 'Govt Contributions', icon: ShieldCheck },
    ] as const;

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Year-End Preparation</h1>
                    <p className="text-slate-500 font-medium mt-1">Finalize annual earnings, tax reconciliation, and statutory reports.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm">
                        <Download size={18} /> Export All
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200">
                        Generate BIR 2316
                    </button>
                </div>
            </div>

            {/* Main Tabs */}
            <div className="border-b border-slate-100">
                <nav className="flex gap-10">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 pb-4 text-sm font-bold transition-all relative ${activeTab === tab.id
                                ? 'text-indigo-600 border-b-2 border-indigo-600'
                                : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content Area */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col min-h-[600px]">
                {/* Search & Meta */}
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search employees..."
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="h-8 w-px bg-slate-100"></div>
                        <div className="relative group/year">
                            <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg group-hover/year:border-indigo-300 group-hover/year:bg-white transition-all cursor-pointer shadow-sm min-w-[110px]">
                                <Calendar size={13} className="text-indigo-600" />
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Fiscal Year</span>
                                    <span className="text-[11px] font-black text-slate-900 leading-none">{selectedYear}</span>
                                </div>
                                <div className="ml-auto pointer-events-none text-slate-400 group-hover/year:text-indigo-500 transition-colors group-hover/year:rotate-180 transition-transform duration-300">
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                </div>
                            </div>

                            {/* Premium Custom Dropdown Menu */}
                            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl opacity-0 invisible group-hover/year:opacity-100 group-hover/year:visible transition-all duration-200 z-50 overflow-hidden transform origin-top scale-95 group-hover/year:scale-100 py-2">
                                <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 mb-1">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Select Period</span>
                                </div>
                                {['2026', '2025', '2024', '2023'].map((year) => (
                                    <button
                                        key={year}
                                        onClick={() => setSelectedYear(year)}
                                        className={`w-full flex items-center justify-between px-4 py-2.5 text-[11px] font-bold transition-all hover:bg-indigo-50 group/item ${selectedYear === year ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-600 hover:text-indigo-600'}`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <div className={`w-1.5 h-1.5 rounded-full transition-all ${selectedYear === year ? 'bg-indigo-600 scale-125' : 'bg-slate-300 group-hover/item:bg-indigo-400'}`}></div>
                                            <span>Fiscal Year {year}</span>
                                        </div>
                                        {selectedYear === year && (
                                            <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse"></div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status:</span>
                        <span className="px-3 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-full text-[10px] font-black uppercase tracking-wider">In Progress</span>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex-1"
                    >
                        {/* 13th Month Tab */}
                        {activeTab === '13th' && (
                            <div className="flex-1 flex flex-col">
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
                                            <Layers size={16} /> Batch Process Assumed (Dec)
                                        </button>
                                        <button
                                            onClick={() => navigate('/manage/year-end-prep/batch-13th?stage=actual')}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-indigo-600 transition-all shadow-lg active:scale-95 uppercase tracking-widest"
                                        >
                                            <Layers size={16} /> Batch Process Actual (Jan)
                                        </button>
                                    </div>
                                </div>

                                <table className="min-w-full divide-y divide-slate-100 border-collapse">
                                    <thead className="bg-slate-50/80 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                        <tr className="border-b border-slate-200">
                                            <th rowSpan={2} className="px-8 py-5 border-r border-slate-100">Employee</th>
                                            <th colSpan={3} className="px-6 py-3 text-center border-r border-slate-100 bg-slate-100/50 text-slate-600">13th Month Assumed (Dec)</th>
                                            <th colSpan={3} className="px-6 py-3 text-center border-r border-slate-100 bg-indigo-50/30 text-indigo-600">13th Month Actual (Jan)</th>
                                            <th rowSpan={2} className="px-6 py-5 text-right bg-slate-50 italic">Adjustment</th>
                                        </tr>
                                        <tr>
                                            <th className="px-4 py-3 text-right font-black border-r border-slate-100">Amount</th>
                                            <th className="px-4 py-3 text-center font-black border-r border-slate-100">Status</th>
                                            <th className="px-4 py-3 text-center border-r border-slate-100"></th>
                                            <th className="px-4 py-3 text-right font-black border-r border-slate-100">Amount</th>
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
                                                    <td className="px-4 py-4 text-right font-mono text-sm text-slate-600 font-bold border-r border-slate-50 bg-slate-50/20">
                                                        {formatCurrency(item.assumedThirteenthMonth)}
                                                    </td>
                                                    <td className="px-4 py-4 text-center border-r border-slate-50 bg-slate-50/20">
                                                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tight ${item.assumedStatus === 'Finalized' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                                                            {item.assumedStatus}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-center border-r border-slate-50 bg-slate-50/20">
                                                        <button onClick={() => setSelectedEmpId(item.id)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-100 shadow-none hover:shadow-sm">
                                                            <FileText size={14} />
                                                        </button>
                                                    </td>
                                                    {/* Actual Section */}
                                                    <td className="px-4 py-4 text-right font-mono text-sm text-indigo-700 font-black border-r border-slate-50 bg-indigo-50/10">
                                                        {formatCurrency(item.actualThirteenthMonth)}
                                                    </td>
                                                    <td className="px-4 py-4 text-center border-r border-slate-50 bg-indigo-50/10">
                                                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tight ${item.actualStatus === 'Finalized' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-500'}`}>
                                                            {item.actualStatus}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-center border-r border-slate-50 bg-indigo-50/10">
                                                        <button onClick={() => setSelectedEmpId(item.id)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-100 shadow-none hover:shadow-sm">
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
                            </div>
                        )}

                        {/* Tax Annualization Tab */}
                        {activeTab === 'tax' && (
                            <div className="flex flex-col flex-1"> {/* Added a wrapper div here */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm shrink-0">
                                    <div className="flex items-center gap-6">
                                        <div className="p-4 bg-indigo-50 text-indigo-600 rounded-[1.5rem] shadow-inner">
                                            <Calculator size={32} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Tax Annualization</h2>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Year-End Tax Reconciliation (1604-C)</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right px-6 border-r border-slate-100 hidden lg:block">
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Tax (Assumed)</div>
                                            <div className="text-xl font-black text-slate-900">₱ 1,425,000.00</div>
                                        </div>
                                        <div className="text-right px-6 border-r border-slate-100 hidden lg:block">
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Tax (Actual)</div>
                                            <div className="text-xl font-black text-emerald-600">₱ 1,450,000.00</div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => navigate('/manage/year-end-batch-tax?stage=assumed')}
                                                className="flex items-center gap-2 px-6 py-3.5 bg-white border-2 border-slate-900 text-slate-900 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 shadow-lg shadow-slate-100"
                                            >
                                                <Calculator size={16} /> Batch Process Assumed (Dec)
                                            </button>
                                            <button
                                                onClick={() => navigate('/manage/year-end-batch-tax?stage=actual')}
                                                className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-2xl shadow-slate-200"
                                            >
                                                <ShieldCheck size={16} /> Batch Process Actual (Jan)
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Tax Table */}
                                <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm flex-1 flex flex-col">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                                <th rowSpan={2} className="pl-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Employee Information</th>
                                                <th colSpan={3} className="px-6 py-4 text-[11px] font-black text-center text-slate-400 uppercase tracking-widest border-l border-slate-100 bg-indigo-50/20">Tax Assumed (Dec)</th>
                                                <th colSpan={3} className="px-6 py-4 text-[11px] font-black text-center text-slate-400 uppercase tracking-widest border-l border-slate-100 bg-emerald-50/20">Tax Actual (Jan)</th>
                                                <th rowSpan={2} className="px-6 py-6 text-[11px] font-black text-center text-slate-400 uppercase tracking-widest border-l border-slate-100">Adjustment</th>
                                            </tr>
                                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                                {/* Assumed */}
                                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right border-l border-slate-100">Amount</th>
                                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Action</th>
                                                {/* Actual */}
                                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right border-l border-slate-100">Amount</th>
                                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {filteredData.map((item) => (
                                                <tr key={item.id} className="hover:bg-slate-50/80 transition-all group">
                                                    <td className="pl-10 py-5">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-xs font-black text-white shadow-xl">
                                                                {item.avatar}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-black text-slate-900">{item.name}</div>
                                                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.role}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    {/* Assumed */}
                                                    <td className="px-6 py-5 text-right font-mono text-sm font-black text-slate-900 border-l border-slate-50">
                                                        {formatCurrency(item.assumedTax)}
                                                    </td>
                                                    <td className="px-6 py-5 text-center">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${item.assumedTaxStatus === 'Finalized'
                                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                            : 'bg-amber-50 text-amber-600 border-amber-100'
                                                            }`}>
                                                            {item.assumedTaxStatus}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5 text-center px-6">
                                                        <button
                                                            onClick={() => setSelectedEmpId(item.id)}
                                                            className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-indigo-100 shadow-sm"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                    </td>
                                                    {/* Actual */}
                                                    <td className="px-6 py-5 text-right font-mono text-sm font-black text-indigo-600 border-l border-slate-50 bg-indigo-50/5">
                                                        {formatCurrency(item.actualTax)}
                                                    </td>
                                                    <td className="px-6 py-5 text-center">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${item.actualTaxStatus === 'Finalized'
                                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                            : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                                                            }`}>
                                                            {item.actualTaxStatus}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5 text-center px-6">
                                                        <button
                                                            onClick={() => setSelectedEmpId(item.id)}
                                                            className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-indigo-100 shadow-sm"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                    </td>
                                                    {/* Adjustment */}
                                                    <td className={`px-6 py-5 text-right font-mono text-sm font-black border-l border-slate-50 ${(item.actualTax - item.assumedTax) > 0 ? 'text-rose-600 bg-rose-50/30' :
                                                        (item.actualTax - item.assumedTax) < 0 ? 'text-emerald-600 bg-emerald-50/30' : 'text-slate-400'
                                                        }`}>
                                                        {formatCurrency(item.actualTax - item.assumedTax)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Govt Contributions Tab */}
                        {activeTab === 'gov' && (
                            <table className="min-w-full divide-y divide-slate-50">
                                <thead className="bg-slate-50/50 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                    <tr>
                                        <th className="px-8 py-5">Employee</th>
                                        <th className="px-6 py-5 text-right">SSS (ER+EE)</th>
                                        <th className="px-6 py-5 text-right">PhilHealth (ER+EE)</th>
                                        <th className="px-6 py-5 text-right">Pag-IBIG (ER+EE)</th>
                                        <th className="px-6 py-5 text-right">WISP+</th>
                                        <th className="px-6 py-5 text-center">Annual Totals</th>
                                        <th className="px-6 py-5"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredData.map((item) => {
                                        // Mock gov numbers
                                        const sssTotal = item.ytdGross * 0.045;
                                        const phTotal = item.ytdGross * 0.015;
                                        const piTotal = 2400 * 12; // Flat mock
                                        return (
                                            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-8 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                                                            {item.avatar}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-slate-900">{item.name}</div>
                                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Regular Full-time</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono text-sm text-slate-600">
                                                    {formatCurrency(sssTotal)}
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono text-sm text-slate-600">
                                                    {formatCurrency(phTotal)}
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono text-sm text-slate-600">
                                                    {formatCurrency(piTotal)}
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono text-sm text-slate-600">
                                                    ₱ 4,800.00
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="font-bold text-slate-900 text-sm">
                                                        {formatCurrency(sssTotal + phTotal + piTotal + 4800)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                                        <FileText size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Modal for Details (Copied/Reused from YearEndTab) */}
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
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-6">
                            {/* --- 13th Month Detail (Only if in 13th tab) --- */}
                            {activeTab === '13th' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                            <Wallet className="text-indigo-600" size={20} />
                                            13th Month Pay Computation
                                        </h4>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reference: Fiscal Year {selectedYear}</div>
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
                            )}

                            {activeTab === 'tax' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                            <Calculator className="text-indigo-600" size={20} />
                                            Tax Annualization Ledger
                                        </h4>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reference: Fiscal Year {selectedYear}</div>
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
                                                    {taxRowGroups.map((group, gIdx) => (
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
                                                                                    <span className={m.p1[row.key] === 0 ? 'text-slate-300' : (row as any).color}>{formatVal(m.p1[row.key] || 0, row.isDeduction)}</span>
                                                                                </td>
                                                                                <td className="px-2 py-3 text-right font-mono border-r-2 border-slate-200">
                                                                                    <span className={m.p2[row.key] === 0 ? 'text-slate-300' : (row as any).color}>{formatVal(m.p2[row.key] || 0, row.isDeduction)}</span>
                                                                                </td>
                                                                            </React.Fragment>
                                                                        ))}
                                                                        <td className="px-8 py-3 text-right font-mono font-black text-slate-900 bg-slate-50 border-l border-slate-200">
                                                                            {formatVal(rowTotal, row.isDeduction)}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </React.Fragment>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-indigo-900 rounded-[2rem] p-8 text-white shadow-2xl">
                                            <div className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-4">Total Taxable Income</div>
                                            <div className="text-4xl font-black">{formatCurrency(selectedEmployeeData?.ytdGross || 0)}</div>
                                            <div className="text-[10px] text-indigo-400 font-bold mt-2 uppercase tracking-tight italic">Consolidated YTD Salary</div>
                                        </div>
                                        <div className="bg-rose-900 rounded-[2rem] p-8 text-white shadow-2xl">
                                            <div className="text-[10px] font-black text-rose-300 uppercase tracking-widest mb-4">Total Tax Withheld</div>
                                            <div className="text-4xl font-black">{formatCurrency((selectedEmployeeData?.actualTax || 0) * 0.95)}</div>
                                            <div className="text-[10px] text-rose-400 font-bold mt-2 uppercase tracking-tight italic">Total Monthly Remittances</div>
                                        </div>
                                        <div className={`rounded-[2rem] p-8 text-white shadow-2xl ${(selectedEmployeeData?.actualTax || 0) > (selectedEmployeeData?.assumedTax || 0) ? 'bg-rose-600' : 'bg-emerald-600'}`}>
                                            <div className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-4">{(selectedEmployeeData?.actualTax || 0) > (selectedEmployeeData?.assumedTax || 0) ? 'Annual Payable' : 'Annual Refund'}</div>
                                            <div className="text-4xl font-black">{formatCurrency(Math.abs((selectedEmployeeData?.actualTax || 0) - (selectedEmployeeData?.assumedTax || 0)))}</div>
                                            <div className="text-[10px] text-white/50 font-bold mt-2 uppercase tracking-tight italic">Year-End Reconciliation Result</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3 shrink-0">
                            <button onClick={() => setSelectedEmpId(null)} className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">Close</button>
                            <button className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2">
                                <Download size={16} /> Export Detail
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
        </div >
    );
};

// --- END ---
export default YearEndPrepPage;

const X: React.FC<{ size?: number, className?: string }> = ({ size = 24, className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
);
