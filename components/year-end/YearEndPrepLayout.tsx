import React, { useState } from 'react';
import {
    Search,
    Download,
    Calendar,
    Wallet,
    Calculator,
    ShieldCheck
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface YearEndPrepLayoutProps {
    children: React.ReactNode;
    activeTab: '13th' | 'tax' | 'gov';
    searchTerm: string;
    setSearchTerm: (s: string) => void;
    selectedYear: string;
    setSelectedYear: (y: string) => void;
}

const YearEndPrepLayout: React.FC<YearEndPrepLayoutProps> = ({
    children,
    activeTab,
    searchTerm,
    setSearchTerm,
    selectedYear,
    setSelectedYear
}) => {
    const navigate = useNavigate();

    const tabs = [
        { id: '13th', label: '13th Month Pay', icon: Wallet, path: '/manage/year-end/13th' },
        { id: 'tax', label: 'Tax Annualization', icon: Calculator, path: '/manage/year-end/tax' },
        { id: 'gov', label: 'Government Contributions', icon: ShieldCheck, path: '/manage/year-end/gov' },
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
                            onClick={() => navigate(tab.path)}
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

            {/* Content Area Wrap */}
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

                <div className="flex-1 flex flex-col">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default YearEndPrepLayout;
