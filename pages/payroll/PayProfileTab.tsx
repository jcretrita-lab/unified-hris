
import React, { useState } from 'react';
import {
    Search,
    Filter,
    ChevronDown,
    User,
    Briefcase,
    Building2,
    Calendar,
    CreditCard,
    Layers,
    MoreHorizontal,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    ArrowRight,
    TrendingUp,
    TrendingDown,
    Activity,
    Clock,
    DollarSign,
    CalendarCheck,
    PieChart,
    ArrowUpRight,
    ArrowDownRight,
    Zap,
    Download,
    FileText,
    Wallet,
    Sparkles,
    History,
    AlertCircle,
    CheckCircle2,
    Sliders,
    RefreshCcw,
    UserCog,
    FileSearch,
    Info,
    ArrowRightCircle,
    ShieldCheck,
    X,
    FileMinus,
    PlusCircle,
    Hash
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Employee, EmployeeStatus } from '../../types';
import Modal from '../../components/Modal';

interface PayProfile {
    employeeId: string;
    employeeName: string;
    role: string;
    department: string;
    avatar: string;
    status: EmployeeStatus;
    payTemplate: string;
    deductionPackage: string;
    paySchedule: string;
    lastUpdated: string;
}

const MOCK_PROFILES: PayProfile[] = [
    {
        employeeId: '0192823',
        employeeName: 'Jane Doe',
        role: 'IT Developer Intern',
        department: 'IT Department',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&auto=format&fit=crop',
        status: EmployeeStatus.ACTIVE,
        payTemplate: 'Internship Base',
        deductionPackage: 'Mandatory Minimum',
        paySchedule: 'Monthly (30th)',
        lastUpdated: '2024-03-01'
    },
    {
        employeeId: '0785652',
        employeeName: 'Juan Dela Cruz',
        role: 'Senior Developer',
        department: 'IT Department',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&auto=format&fit=crop',
        status: EmployeeStatus.ACTIVE,
        payTemplate: 'Executive Grade 8',
        deductionPackage: 'Standard Full-Benefit',
        paySchedule: 'Semi-Monthly (15/30)',
        lastUpdated: '2024-02-15'
    },
    {
        employeeId: '0565543',
        employeeName: 'Louis Panganiban',
        role: 'Senior Developer',
        department: 'IT Department',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&auto=format&fit=crop',
        status: EmployeeStatus.ACTIVE,
        payTemplate: 'Standard Aligned SG-7',
        deductionPackage: 'Standard Mandatory',
        paySchedule: 'Semi-Monthly (15/30)',
        lastUpdated: '2024-03-05'
    },
    {
        employeeId: '0489545',
        employeeName: 'John Doe',
        role: 'Junior Developer',
        department: 'IT Department',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&auto=format&fit=crop',
        status: EmployeeStatus.ACTIVE,
        payTemplate: 'Junior Developer Package',
        deductionPackage: 'Standard Mandatory',
        paySchedule: 'Semi-Monthly (15/30)',
        lastUpdated: '2024-03-02'
    }
];

// --- Detailed Profile Components ---

const DetailHeader: React.FC<{ profile: PayProfile; onBack: () => void }> = ({ profile, onBack }) => (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-6">
            <button
                onClick={onBack}
                className="p-4 bg-white border-2 border-slate-100 hover:border-indigo-200 hover:text-indigo-600 rounded-[1.5rem] transition-all shadow-sm group font-black uppercase text-[10px] tracking-widest flex items-center gap-2"
            >
                <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> Back
            </button>
            <div className="flex items-center gap-4">
                <div className="relative">
                    <img className="h-20 w-20 rounded-[2rem] object-cover ring-8 ring-slate-50 shadow-2xl" src={profile.avatar} alt="" />
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 border-4 border-white w-6 h-6 rounded-full shadow-lg"></div>
                </div>
                <div>
                    <h2 className="text-3xl font-black text-slate-900 leading-none mb-2 uppercase tracking-tight">{profile.employeeName}</h2>
                    <div className="flex items-center gap-2 text-[11px] font-black text-slate-400">
                        <span className="bg-slate-900 px-3 py-1 rounded-lg text-white border border-slate-800 uppercase shadow-lg shadow-slate-200">#{profile.employeeId}</span>
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                        <span className="uppercase tracking-[0.2em]">{profile.role}</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex items-center gap-6 bg-white border-2 border-slate-100 p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                <CalendarCheck size={80} />
            </div>
            <div className="p-4 bg-indigo-600 text-white rounded-[1.8rem] shadow-lg shadow-indigo-100 relative z-10">
                <CalendarCheck size={24} />
            </div>
            <div className="relative z-10">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Financial Cycle Anchor</div>
                <div className="text-lg font-black text-slate-800 uppercase tracking-tight">{profile.paySchedule}</div>
                <div className="text-[10px] font-bold text-indigo-600 mt-1 flex items-center gap-1">
                    <History size={12} /> Cycle Horizon: Mar 01 - Mar 15, 2024
                </div>
            </div>
        </div>
    </div>
);

const ViewTab: React.FC<{
    active: 'year' | 'month' | 'cutoff';
    onChange: (v: 'year' | 'month' | 'cutoff') => void
}> = ({ active, onChange }) => (
    <div className="flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-2xl w-fit mb-10 border border-slate-200">
        {[
            { id: 'year', label: 'Fiscal Year View', icon: TrendingUp },
            { id: 'month', label: 'Monthly Cycle View', icon: Calendar },
            { id: 'cutoff', label: 'Point-in-Time Cutoff', icon: Zap }
        ].map(tab => (
            <button
                key={tab.id}
                onClick={() => onChange(tab.id as any)}
                className={`flex items-center gap-3 px-6 py-2.5 rounded-xl text-[11px] font-black transition-all duration-300 uppercase tracking-widest ${active === tab.id
                    ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200 shadow-indigo-100/50 active:scale-95'
                    : 'text-slate-500 hover:text-indigo-600 hover:bg-white/50'
                    }`}
            >
                <tab.icon size={16} /> {tab.label}
            </button>
        ))}
    </div>
);

// --- Source Investigator Modal Content ---
const SourceInvestigator: React.FC<{ type: string; label: string; onClose: () => void }> = ({ type, label, onClose }) => {
    // Context-sensitive logic for data analysis
    const isBasePay = label.includes('Base Pay');
    const isStatutory = ['SSS', 'PhilHealth', 'HDMF'].some(s => label.includes(s));
    const isInstallment = ['HMO', 'Cash Advance'].some(s => label.includes(s));

    return (
        <div className="bg-white">
            {/* Header Anchor */}
            <div className="p-8 border-b-2 border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-slate-950 text-white rounded-2xl shadow-xl shadow-slate-200">
                        <FileSearch size={22} />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Forensic Intelligence Node</div>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{label} Audit</h3>
                    </div>
                </div>
            </div>

            <div className="p-8">
                {type === 'earnings' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {isBasePay ? (
                            <>
                                <div className="bg-indigo-50/50 border-2 border-indigo-100 p-8 rounded-[2rem] relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-125 transition-transform duration-700 text-indigo-900">
                                        <Building2 size={120} />
                                    </div>
                                    <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <Zap size={12} /> Active Pay Template Vector
                                    </div>
                                    <h4 className="text-xl font-black text-slate-800 mb-2">Executive Grade 8 (Senior Management)</h4>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Master ID: TEMP-EXEC-008-G8</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: 'Basic Salary', value: '₱120,000.00', icon: Wallet },
                                        { label: 'Fixed Allowance', value: '₱15,000.00', icon: CreditCard },
                                        { label: 'Retention Bonus', value: '5% / Annum', icon: Sparkles },
                                        { label: 'Tax Status', value: 'Mixed-Comp', icon: ShieldCheck },
                                    ].map((item, i) => (
                                        <div key={i} className="p-5 bg-white border-2 border-slate-50 rounded-2xl hover:border-indigo-100 transition-all duration-300">
                                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                <item.icon size={12} className="text-indigo-400" /> {item.label}
                                            </div>
                                            <div className="text-sm font-black text-slate-800 font-mono italic">{item.value}</div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="bg-emerald-50/50 border-2 border-emerald-100 p-8 rounded-[2rem] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-125 transition-transform duration-700 text-emerald-900">
                                    <ShieldCheck size={120} />
                                </div>
                                <div className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-3">Linked Policy Authority</div>
                                <h4 className="text-xl font-black text-slate-800 mb-2">Allowance Vector: {label}</h4>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-tight italic leading-relaxed max-w-md">
                                    This earning component is automatically synthesized based on work-shift metadata and contractual eligibility benchmarks.
                                </p>
                            </div>
                        )}

                        <div className="p-6 border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-white rounded-lg border border-slate-100 text-indigo-500">
                                    <Info size={16} />
                                </div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Intelligence Narrative</span>
                            </div>
                            <p className="text-xs font-bold text-slate-600 leading-relaxed pl-4 border-l-2 border-indigo-200 py-1">
                                "The financial vector for {label} was audited for the Mar 01-15 period. System reconciliation confirmed 0.0% variance from the master enrollment anchor. Authorized by automated fiscal engine."
                            </p>
                        </div>
                    </div>
                )}

                {type === 'deductions' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className={`p-8 rounded-[2rem] relative overflow-hidden group ${isStatutory ? 'bg-indigo-50/50 border-2 border-indigo-100' : 'bg-rose-50/50 border-2 border-rose-100'}`}>
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-125 transition-transform duration-700 text-slate-900">
                                <Layers size={120} />
                            </div>
                            <div className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${isStatutory ? 'text-indigo-600' : 'text-rose-600'}`}>
                                {isStatutory ? 'Statutory Compliance Vector' : 'Active Installment Amortization'}
                            </div>
                            <h4 className="text-xl font-black text-slate-800 mb-2">{isStatutory ? `PH Government Standard Scale: ${label}` : label}</h4>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">Active Enrollment Period: FY 2024 Cycle</p>
                        </div>

                        {isInstallment ? (
                            <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 border-b border-slate-100 text-[9px] uppercase font-black tracking-widest text-slate-400">
                                        <tr>
                                            <th className="px-6 py-4">Iteration</th>
                                            <th className="px-6 py-4">Due Date</th>
                                            <th className="px-6 py-4 text-right">Value</th>
                                            <th className="px-6 py-4 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 font-bold text-slate-600 text-[10px]">
                                        {[
                                            { iter: '3 of 12', date: 'Mar 15, 2024', val: '₱850.00', status: 'Live', active: true },
                                            { iter: '4 of 12', date: 'Mar 30, 2024', val: '₱850.00', status: 'Forecasted', active: false },
                                            { iter: '5 of 12', date: 'Apr 15, 2024', val: '₱850.00', status: 'Forecasted', active: false },
                                        ].map((row, i) => (
                                            <tr key={i} className={row.active ? 'bg-indigo-50/30' : 'opacity-40 grayscale'}>
                                                <td className="px-6 py-4">{row.iter}</td>
                                                <td className="px-6 py-4">{row.date}</td>
                                                <td className="px-6 py-4 text-right font-mono italic">{row.val}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-2 py-0.5 rounded text-[8px] uppercase tracking-widest ${row.active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-200 text-slate-500'}`}>
                                                        {row.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { label: 'Employee Share', value: '₱1,125.00', color: 'text-indigo-600' },
                                    { label: 'Employer Share', value: '₱2,350.00', color: 'text-slate-400' },
                                    { label: 'Total Vector', value: '₱3,475.00', color: 'text-slate-900' },
                                ].map((item, i) => (
                                    <div key={i} className="p-4 bg-white border border-slate-100 rounded-xl">
                                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</div>
                                        <div className={`text-xs font-black font-mono italic ${item.color}`}>{item.value}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {type === 'adjustments' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-amber-50/50 border-2 border-amber-100 p-8 rounded-[2rem] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-125 transition-transform duration-700 text-amber-900">
                                <Zap size={120} />
                            </div>
                            <div className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-3">Manual Override Forensic</div>
                            <h4 className="text-xl font-black text-slate-800 mb-2">{label}</h4>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">Origin: Automated Reconciler &gt; Audit Adjustments</p>
                        </div>

                        <div className="p-8 bg-slate-950 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-bl-[5rem]"></div>
                            <div className="flex justify-between items-end mb-10 relative z-10">
                                <div>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[3px] block mb-2">Reconciled Correction</span>
                                    <span className="text-5xl font-black text-amber-400 font-mono italic">₱4,120.00</span>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                                    <PlusCircle size={28} className="text-amber-400" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 relative z-10">
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5 backdrop-blur-sm">
                                    <p className="text-[9px] text-slate-500 mb-1 font-black uppercase">Authority</p>
                                    <p className="text-white text-[11px] font-black tracking-widest">SECURE-AUTH-MASTER</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5 backdrop-blur-sm">
                                    <p className="text-[9px] text-slate-500 mb-1 font-black uppercase">Audit Seal</p>
                                    <p className="text-white text-[11px] font-black tracking-widest">MAR 08 2026 • 09:12</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Anchor */}
            <div className="p-6 bg-slate-50/80 border-t border-slate-100 flex justify-end gap-3">
                <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
                >
                    Dismiss Node
                </button>
                <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95 flex items-center gap-2">
                    Print Proof of Audit <ExternalLink size={14} />
                </button>
            </div>
        </div>
    );
};

const LedgerView: React.FC<{
    type: 'year' | 'month' | 'cutoff';
    month: number;
    cutoff: number;
}> = ({ type, month, cutoff }) => {
    const [investigation, setInvestigation] = useState<{ type: string; label: string } | null>(null);

    const formatVal = (v: number | null | undefined) => {
        if (v === null || v === undefined || v === 0) return '-';
        return v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Column Strategy: 
    // Year: Past (Jan-Feb), Present (Mar), Future (Apr-Dec)
    // Month: P1, P2 for semi-monthly context
    const getColumns = () => {
        if (type === 'year') {
            const cols: { label: string; meta: 'past' | 'present' | 'future'; type: 'value' | 'audit'; dataIdx: number }[] = [];
            monthNames.forEach((m, mIdx) => {
                const meta = mIdx < 2 ? 'past' : mIdx === 2 ? 'present' : 'future';
                cols.push({ label: 'P1', meta, type: 'value', dataIdx: mIdx * 2 });
                cols.push({ label: 'Src', meta, type: 'audit', dataIdx: mIdx * 2 });
                cols.push({ label: 'P2', meta, type: 'value', dataIdx: mIdx * 2 + 1 });
                cols.push({ label: 'Src', meta, type: 'audit', dataIdx: mIdx * 2 + 1 });
            });
            return cols;
        }
        if (type === 'month') {
            return [
                { label: 'P1', meta: 'present', type: 'value', dataIdx: month * 2 } as const,
                { label: 'Src', meta: 'present', type: 'audit', dataIdx: month * 2 } as const,
                { label: 'P2', meta: 'present', type: 'value', dataIdx: month * 2 + 1 } as const,
                { label: 'Src', meta: 'present', type: 'audit', dataIdx: month * 2 + 1 } as const,
            ];
        }
        return [
            { label: cutoff === 0 ? 'P1' : 'P2', meta: 'present', type: 'value', dataIdx: month * 2 + cutoff } as const,
            { label: 'Src', meta: 'present', type: 'audit', dataIdx: month * 2 + cutoff } as const,
        ];
    };

    const columns = getColumns();
    const dataPoints = 24; // Always maintain full fiscal timeline to avoid index out-of-bounds

    const groups: {
        name: string;
        color: string;
        sourceType: string;
        rows: {
            label: string;
            values: number[];
            forecasted: number[];
            docs: number[];
        }[];
    }[] = [
            {
                name: 'Earnings Ledger (Synthesized)',
                color: 'bg-emerald-50 text-emerald-600',
                sourceType: 'earnings',
                rows: [
                    {
                        label: 'Base Pay (Contractual)',
                        values: Array.from({ length: dataPoints }, (_, i) => (i >= 10) ? 9225 : 8750),
                        forecasted: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
                        docs: [10] // PAF Change point
                    },
                    {
                        label: 'De Minimis Benefit',
                        values: Array.from({ length: dataPoints }, () => 1500 / 2),
                        forecasted: [],
                        docs: []
                    },
                    {
                        label: 'Night Differential',
                        values: Array.from({ length: dataPoints }, (_, i) => (i % 2 === 0) ? 600 : 400),
                        forecasted: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
                        docs: []
                    },
                    {
                        label: 'Executive Allowance',
                        values: Array.from({ length: 24 }, (_, i) => (i < 4) ? 0 : 3500 / 2),
                        forecasted: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
                        docs: [4] // Addition point
                    },
                    {
                        label: 'Clothing Allowance',
                        values: Array.from({ length: 24 }, (_, i) => (i === 0 || i === 12) ? 1000 : 0),
                        forecasted: [12],
                        docs: []
                    },
                    {
                        label: 'Performance Bonus (Q4)',
                        values: Array.from({ length: 24 }, (_, i) => (i === 23) ? 25000 : 0),
                        forecasted: [23],
                        docs: []
                    },
                ]
            },
            {
                name: 'Statutory & Voluntary Deductions',
                color: 'bg-rose-50 text-rose-600',
                sourceType: 'deductions',
                rows: [
                    {
                        label: 'SSS PH-Contribution',
                        values: Array.from({ length: 24 }, () => 1125 / 2),
                        forecasted: [],
                        docs: []
                    },
                    {
                        label: 'PhilHealth Benefit',
                        values: Array.from({ length: 24 }, () => 800 / 2),
                        forecasted: [],
                        docs: []
                    },
                    {
                        label: 'HDMF Pag-IBIG Core',
                        values: Array.from({ length: 24 }, () => 100 / 2),
                        forecasted: [],
                        docs: []
                    },
                    {
                        label: 'HMO Installment Anchor',
                        values: Array.from({ length: 24 }, (_, i) => (i > 17) ? 0 : 850 / 2),
                        forecasted: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
                        docs: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17] // Active installments
                    },
                    {
                        label: 'Cash Advance Repayment',
                        values: Array.from({ length: 24 }, (_, i) => (i >= 4 && i <= 11) ? 1250 : 0),
                        forecasted: [6, 7, 8, 9, 10, 11],
                        docs: [4, 5, 6, 7, 8, 9, 10, 11] // Active installments
                    },
                    {
                        label: 'Union Preservation Fund',
                        values: Array.from({ length: 24 }, () => 200 / 2),
                        forecasted: [],
                        docs: []
                    },
                ]
            },
            {
                name: 'Transactional Recon & Adjustments',
                color: 'bg-amber-50 text-amber-600',
                sourceType: 'adjustments',
                rows: [
                    {
                        label: 'Forensic OT Correction',
                        values: Array.from({ length: 24 }, (_, i) => (i === 4) ? 4120 : 0),
                        forecasted: [],
                        docs: [4] // Adjustment event
                    },
                    {
                        label: 'Holiday Differential (Special)',
                        values: Array.from({ length: 24 }, (_, i) => (i === 2) ? 2450 : 0),
                        forecasted: [],
                        docs: []
                    },
                    {
                        label: 'Late/Undertime Deduction',
                        values: Array.from({ length: 24 }, (_, i) => (i === 5) ? 350 : (i === 0) ? 120 : 0),
                        forecasted: [],
                        docs: []
                    },
                    {
                        label: 'Tech Reimbursement',
                        values: Array.from({ length: 24 }, (_, i) => (i === 10) ? 15000 : 0),
                        forecasted: [10],
                        docs: [10] // Reimbursement event
                    },
                    {
                        label: 'Backpay Adjustment',
                        values: Array.from({ length: 24 }, (_, i) => (i === 3) ? 5200 : 0),
                        forecasted: [],
                        docs: []
                    },
                ]
            }
        ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <Modal isOpen={!!investigation} onClose={() => setInvestigation(null)} className="max-w-2xl !p-0 overflow-hidden">
                {investigation && <SourceInvestigator type={investigation.type} label={investigation.label} onClose={() => setInvestigation(null)} />}
            </Modal>

            {/* Timline Visualizer (Year Only) */}
            {type === 'year' && (
                <div className="bg-slate-950 rounded-[2.5rem] p-6 flex flex-col md:flex-row items-center justify-between text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    <div className="flex items-center gap-12 pl-6 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full bg-slate-700 border-2 border-slate-500 shadow-inner"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Historical Term</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.6)] animate-pulse"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">Active Focal Period</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full border-2 border-dashed border-slate-600"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Forecasted Horizon</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Ledger Table */}
            <div className="border-2 border-slate-300 overflow-hidden bg-white shadow-xl relative transition-all duration-500">

                <div className="overflow-x-auto custom-scrollbar">
                    <table className={`w-full text-left border-collapse ${type === 'year' ? 'min-w-[2200px]' : type === 'month' ? 'min-w-[1000px]' : 'min-w-[800px]'}`}>
                        <thead>
                            <tr className="border-b-2 border-slate-900 bg-white">
                                <th rowSpan={2} className="px-8 py-5 text-[11px] font-black text-slate-900 uppercase tracking-widest sticky left-0 z-30 bg-white border-r-2 border-slate-200 min-w-[350px] max-w-[350px]">Synthesis Account Category</th>
                                {(type === 'year' ? monthNames : [monthNames[month]]).map((m, idx) => (
                                    <th key={idx} colSpan={type === 'year' || type === 'month' ? 4 : 2} className="px-2 py-3 text-[11px] font-black text-center text-slate-900 bg-white border-r border-slate-100">
                                        {m} {type === 'cutoff' ? `(Period ${cutoff + 1})` : ''}
                                    </th>
                                ))}
                                <th rowSpan={2} className="px-8 py-5 text-[11px] font-black text-slate-900 uppercase tracking-widest text-right bg-slate-50 border-l border-slate-200 sticky right-0 z-30 min-w-[220px] max-w-[220px]">Ledger Valuation</th>
                            </tr>
                            <tr className={`${type === 'year' ? 'border-b-[3px] border-slate-900 border-dashed' : 'border-b-2 border-slate-900'} bg-white`}>
                                {columns.map((col, idx) => (
                                    <th key={idx} className={`px-2 py-2 text-[9px] font-black text-center uppercase tracking-widest border-r border-slate-100 transition-all duration-300 ${col.meta === 'present' ? 'text-indigo-600 bg-indigo-50/10' :
                                        col.meta === 'future' ? 'text-slate-400 opacity-60' : 'text-slate-400 bg-white'
                                        } ${col.type === 'audit' ? 'min-w-[50px]' : 'min-w-[90px]'} ${idx % 2 === 1 ? 'border-r-2 border-slate-200' : ''}`}>
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-slate-100">
                            {groups.map((group, gIdx) => (
                                <React.Fragment key={gIdx}>
                                    <tr className="bg-slate-50/80 group">
                                        <td className="px-8 py-3 sticky left-0 z-10 bg-slate-50 text-[12px] font-black text-slate-900 uppercase tracking-[0.2em] border-y border-slate-200 shadow-sm min-w-[350px] max-w-[350px]">
                                            {group.name}
                                        </td>
                                        <td colSpan={columns.length} className="bg-slate-50/50 border-y border-slate-200"></td>
                                        <td className="sticky right-0 z-10 bg-slate-50 border-y border-slate-200 min-w-[220px] max-w-[220px]"></td>
                                    </tr>
                                    {group.rows.map((row, rIdx) => {
                                        const rowTotal = type === 'year'
                                            ? row.values.reduce((a, b) => a + b, 0)
                                            : (type === 'month'
                                                ? row.values[month * 2] + row.values[month * 2 + 1]
                                                : row.values[month * 2 + cutoff]);
                                        return (
                                            <tr key={rIdx} className="group hover:bg-slate-50 transition-colors">
                                                <td className="px-8 py-3 sticky left-0 bg-white group-hover:bg-slate-50 transition-colors z-10 border-r-2 border-slate-200 min-w-[350px] max-w-[350px]">
                                                    <span className="text-[11px] font-bold text-slate-800 tracking-tight">{row.label}</span>
                                                </td>
                                                {columns.map((col, cIdx) => (
                                                    <td key={cIdx} className={`px-2 py-3 text-right border-r border-slate-50 transition-colors duration-300 ${col.meta === 'future' ? 'opacity-40' :
                                                        col.meta === 'present' ? 'bg-indigo-50/5' : ''
                                                        } ${col.type === 'audit' ? 'text-center' : ''} ${cIdx % 2 === 1 ? 'border-r-2 border-slate-200' : ''}`}>
                                                        {col.type === 'value' ? (
                                                            <span className={`font-mono text-[11px] ${col.meta === 'future' ? 'text-slate-400 italic' :
                                                                col.meta === 'present' ? 'text-slate-900 font-bold' : 'text-slate-600 font-semibold'
                                                                }`}>
                                                                {formatVal(row.values[col.dataIdx])}
                                                            </span>
                                                        ) : (
                                                            <div className="flex justify-center">
                                                                {row.docs.includes(col.dataIdx) && (
                                                                    <button
                                                                        onClick={() => setInvestigation({ type: group.sourceType, label: row.label })}
                                                                        className="p-1 text-slate-300 hover:text-indigo-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-100 shadow-none hover:shadow-sm active:scale-95"
                                                                        title="Forensic Audit Source"
                                                                    >
                                                                        <FileSearch size={14} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </td>
                                                ))}
                                                <td className="px-8 py-3 text-right font-mono text-[11px] font-black text-slate-900 bg-slate-50 sticky right-0 z-10 border-l border-slate-200 min-w-[220px] max-w-[220px]">
                                                    {formatVal(rowTotal)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </React.Fragment>
                            ))}

                            {/* Consolidated Grand Result */}
                            <tr className="border-t-4 border-slate-900 bg-slate-950 text-white">
                                <td className="px-8 py-6 sticky left-0 bg-slate-900 text-white z-10 border-r-2 border-slate-800 min-w-[350px] max-w-[350px]">
                                    <div className="flex flex-col">
                                        <span className="text-[12px] font-black uppercase tracking-[0.2em] leading-none mb-1 text-white">Consolidated Grand Result</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Net Computable Earnings</span>
                                    </div>
                                </td>
                                {columns.map((c, cIdx) => {
                                    if (c.type === 'audit') return <td key={cIdx} className="bg-slate-900 border-r border-slate-800"></td>;
                                    const net = groups[0].rows.reduce((a, b) => a + b.values[c.dataIdx], 0) - groups[1].rows.reduce((a, b) => a + b.values[c.dataIdx], 0);
                                    return (
                                        <td key={cIdx} className="px-2 py-6 text-right font-mono font-black bg-slate-900 border-r border-slate-800 text-[11px]">
                                            {formatVal(net)}
                                        </td>
                                    );
                                })}
                                <td className="px-8 py-6 text-right font-mono text-[16px] font-black text-emerald-400 bg-slate-900 sticky right-0 z-10 border-l-2 border-emerald-500">
                                    ₱{(
                                        (type === 'year'
                                            ? groups[0].rows.reduce((a, b) => a + b.values.reduce((x, y) => x + y, 0), 0)
                                            : (type === 'month'
                                                ? groups[0].rows.reduce((a, b) => a + (b.values[month * 2] + b.values[month * 2 + 1]), 0)
                                                : groups[0].rows.reduce((a, b) => a + b.values[month * 2 + cutoff], 0))
                                        ) - (type === 'year'
                                            ? groups[1].rows.reduce((a, b) => a + b.values.reduce((x, y) => x + y, 0), 0)
                                            : (type === 'month'
                                                ? groups[1].rows.reduce((a, b) => a + (b.values[month * 2] + b.values[month * 2 + 1]), 0)
                                                : groups[1].rows.reduce((a, b) => a + b.values[month * 2 + cutoff], 0)))
                                    ).toLocaleString()}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

// --- Main Tab Wrapper ---

const PayProfileTab: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
    const [viewType, setViewType] = useState<'year' | 'month' | 'cutoff'>('month');
    const [selectedMonth, setSelectedMonth] = useState(2); // Default to March
    const [selectedCutoff, setSelectedCutoff] = useState(0); // Default to P1
    const MotionTr = motion.tr as any;

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const filteredProfiles = MOCK_PROFILES.filter(p =>
        p.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.employeeId.includes(searchTerm)
    );

    if (selectedEmployeeId) {
        const profile = MOCK_PROFILES.find(p => p.employeeId === selectedEmployeeId);
        if (!profile) return null;

        return (
            <div className="animate-in fade-in slide-in-from-right-10 duration-700">
                <DetailHeader profile={profile} onBack={() => setSelectedEmployeeId(null)} />
                <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
                    <ViewTab active={viewType} onChange={setViewType} />

                    {viewType !== 'year' && (
                        <div className="flex items-center gap-4 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
                            <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                                <button
                                    onClick={() => setSelectedMonth(prev => Math.max(0, prev - 1))}
                                    className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <div className="px-4 py-1 text-[11px] font-black text-slate-900 uppercase tracking-widest min-w-[120px] text-center">
                                    {monthNames[selectedMonth]} 2024
                                </div>
                                <button
                                    onClick={() => setSelectedMonth(prev => Math.min(11, prev + 1))}
                                    className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>

                            {viewType === 'cutoff' && (
                                <div className="flex items-center gap-1 bg-slate-200/50 p-1 rounded-xl">
                                    {['Period 1', 'Period 2'].map((label, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedCutoff(idx)}
                                            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${selectedCutoff === idx
                                                ? 'bg-white text-indigo-600 shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700'
                                                }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <LedgerView type={viewType} month={selectedMonth} cutoff={selectedCutoff} />
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Content Filters */}
            <div className="flex flex-wrap items-center justify-between gap-6 bg-white p-2 border border-slate-100 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2">
                    <button className="bg-indigo-50 text-indigo-600 px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest flex items-center gap-3 active:scale-95 transition-all">
                        <Filter size={16} /> All Active Profiles
                    </button>
                    <button className="px-5 py-2.5 rounded-xl text-[11px] font-bold text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition-all uppercase tracking-widest flex items-center gap-3">
                        <Building2 size={16} /> By Financial Unit
                    </button>
                </div>

                <div className="relative flex-1 max-w-md group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-all duration-300" size={18} />
                    <input
                        type="text"
                        className="block w-full pl-11 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 transition-all placeholder-slate-400 font-medium text-slate-800"
                        placeholder="Search employee ID or financial metadata..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Profile Table */}
            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm relative group">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Employee</th>
                                <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Pay Template</th>
                                <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Deduction Package</th>
                                <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Pay Schedule</th>
                                <th className="px-8 py-5 text-right font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredProfiles.map((p, idx) => (
                                <MotionTr
                                    key={p.employeeId}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.08, type: 'spring', damping: 15 }}
                                    className="hover:bg-indigo-50/40 transition-all group cursor-pointer relative"
                                    onClick={() => setSelectedEmployeeId(p.employeeId)}
                                >
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="relative shrink-0">
                                                <img className="h-11 w-11 rounded-xl object-cover ring-2 ring-white shadow-sm transition-transform duration-500" src={p.avatar} alt="" />
                                                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white rounded-full bg-emerald-500 shadow-sm"></div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{p.employeeName}</div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">#{p.employeeId}</span>
                                                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-tight">{p.role}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-8 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.3)]"></div>
                                            <div>
                                                <div className="text-[11px] font-bold text-slate-800 uppercase tracking-tight leading-none mb-1">{p.payTemplate}</div>
                                                <div className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                                                    <ShieldCheck size={10} /> Live Vector
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-rose-50 text-rose-500 rounded-[10px] border border-rose-100">
                                                <Layers size={16} />
                                            </div>
                                            <div>
                                                <div className="text-[11px] font-bold text-slate-800 uppercase tracking-tight leading-none mb-1">{p.deductionPackage}</div>
                                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Mandatory</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-amber-50 text-amber-500 rounded-[10px] border border-amber-100">
                                                <Zap size={16} />
                                            </div>
                                            <div>
                                                <div className="text-[11px] font-bold text-slate-800 uppercase tracking-tight leading-none mb-1">{p.paySchedule}</div>
                                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Cycle Anchor</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right whitespace-nowrap">
                                        <span className="px-2.5 py-1 inline-flex text-[10px] font-bold rounded-lg uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end">
                                            <button className="p-2.5 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all active:scale-90">
                                                <ArrowRightCircle size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </MotionTr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer / Pagination */}
                <div className="bg-slate-50/50 px-8 py-5 flex items-center justify-between border-t border-slate-100">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-3">
                        Showing <span className="text-slate-900 font-black">{filteredProfiles.length}</span> Master Financial Vectors
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 border border-slate-200 rounded-xl bg-white text-slate-400 hover:text-slate-600 disabled:opacity-50" disabled>
                            <ChevronLeft size={18} />
                        </button>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3].map(n => (
                                <button
                                    key={n}
                                    className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all
                                        ${n === 1 ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'text-slate-500 hover:bg-white hover:shadow-sm'}`}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                        <button className="p-2 border border-slate-200 rounded-xl bg-white text-slate-400 hover:text-slate-600">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayProfileTab;
