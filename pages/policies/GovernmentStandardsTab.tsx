
import React from 'react';
import { Divisor } from '../../types';
import {
    Clock,
    DollarSign,
    ShieldCheck,
    AlertTriangle,
    Info,
    CheckCircle2,
    Calendar,
    Scale,
    BadgePercent,
    History,
    Heart,
    Baby,
    Briefcase,
    Coins,
    AlertCircle,
    User,
    GraduationCap,
    Stethoscope,
    Users,
    FileMinus,
    CalendarCheck,
    Gift,
    ArrowRight,
    Gavel,
    BookMarked,
    Calculator,
    Check,
    ToggleLeft,
    ToggleRight,
    TrendingUp
} from 'lucide-react';
import { PolicyState, LeaveConfig, LEGAL_STANDARDS, LEAVE_TYPES_LIST } from './PolicyTypes';
import { ComplianceBadge, LegalNote, SectionTitle, getComplianceStatus } from './PolicyComponents';

interface GovernmentStandardsTabProps {
    activeTab: string;
    policies: PolicyState;
    updatePolicy: (field: keyof PolicyState, value: any) => void;
    selectedLeaveId: string;
    setSelectedLeaveId: (id: string) => void;
    currentLeaveConfig: LeaveConfig;
    updateLeaveConfig: (id: string, field: keyof LeaveConfig, value: any) => void;
    leaveSettings: Record<string, LeaveConfig>;
}

const GovernmentStandardsTab: React.FC<GovernmentStandardsTabProps> = ({
    activeTab, policies, updatePolicy,
    selectedLeaveId, setSelectedLeaveId,
    currentLeaveConfig, updateLeaveConfig, leaveSettings
}) => {

    const getProbationStatus = () => {
        const value = policies.probationaryDays;
        const standard = LEGAL_STANDARDS.PROBATIONARY_DAYS;
        if (policies.isApprenticeshipEnabled && value <= 730) {
            return { status: 'compliant', msg: 'Compliant (Apprentice)', citation: 'Art. 61' };
        }
        if (policies.isProbationExtensionEnabled && value > standard) {
            return { status: 'compliant', msg: 'Compliant (By Agreement)', citation: 'Mariwasa Doctrine' };
        }
        if (policies.isTollingEnabled && value > standard) {
            return { status: 'compliant', msg: 'Compliant (Tolled)', citation: 'RA 11210' };
        }
        return { ...getComplianceStatus(value, standard, 'max'), citation: 'Art. 296' };
    };

    return (
        <>
                            {activeTab === 'Book3' && (
                                <div className="space-y-10">

                                    {/* 1. Work Hours & Attendance */}
                                    <div>
                                        <SectionTitle
                                            icon={Clock}
                                            title="Work Hours & Attendance"
                                            description="Standards for normal hours, breaks, and lateness policies."
                                            citation="Art. 83-85"
                                        />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div className="p-5 border border-slate-200 rounded-2xl bg-white">
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Normal Hours of Work</label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        className="w-24 p-2.5 border border-slate-300 rounded-lg font-bold text-slate-900 text-center bg-white"
                                                        value={policies.normalHours}
                                                        onChange={(e) => updatePolicy('normalHours', Number(e.target.value))}
                                                    />
                                                    <span className="text-xs font-bold text-slate-500">Hours / Day</span>
                                                </div>
                                                <ComplianceBadge {...getComplianceStatus(policies.normalHours, LEGAL_STANDARDS.NORMAL_HOURS, 'max')} citation="Art. 83" />
                                            </div>
                                            <div className="p-5 border border-slate-200 rounded-2xl bg-white">
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Meal Break Duration</label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        className="w-24 p-2.5 border border-slate-300 rounded-lg font-bold text-slate-900 text-center bg-white"
                                                        value={policies.mealBreakMinutes}
                                                        onChange={(e) => updatePolicy('mealBreakMinutes', Number(e.target.value))}
                                                    />
                                                    <span className="text-xs font-bold text-slate-500">Minutes</span>
                                                </div>
                                                <ComplianceBadge {...getComplianceStatus(policies.mealBreakMinutes, LEGAL_STANDARDS.MEAL_BREAK_MINUTES, 'min')} citation="Art. 85" />
                                            </div>
                                            <div className="p-5 border border-slate-200 rounded-2xl bg-white">
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Grace Period</label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        className="w-24 p-2.5 border border-slate-300 rounded-lg font-bold text-slate-900 text-center bg-white"
                                                        value={policies.gracePeriod}
                                                        onChange={(e) => updatePolicy('gracePeriod', Number(e.target.value))}
                                                    />
                                                    <span className="text-xs font-bold text-slate-500">Minutes</span>
                                                </div>
                                                <label className="flex items-center gap-2 mt-3 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                        checked={policies.deductGracePeriod}
                                                        onChange={(e) => updatePolicy('deductGracePeriod', e.target.checked)}
                                                    />
                                                    <span className="text-xs text-slate-600">Deduct from work hours if exceeded</span>
                                                </label>
                                                <ComplianceBadge status="neutral" msg="Management Prerogative" citation="Jurisprudence" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full h-px bg-slate-100"></div>

                                    {/* 2. Premium Pay Matrix */}
                                    <div>
                                        <SectionTitle
                                            icon={CalendarCheck}
                                            title="Premium Pay Matrix"
                                            description="Additional compensation rates for holidays, rest days, and special non-working days."
                                            citation="Art. 91-94"
                                        />

                                        <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden">
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-widest border-b border-slate-200">
                                                    <tr>
                                                        <th className="px-6 py-4">Work Day Type</th>
                                                        <th className="px-6 py-4">Basic Pay (%)</th>
                                                        <th className="px-6 py-4 text-center">Premium (%)</th>
                                                        <th className="px-6 py-4 text-right">Total Pay (%)</th>
                                                        <th className="px-6 py-4 text-center">Compliance</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 bg-white">
                                                    {/* Regular Holiday */}
                                                    <tr className="hover:bg-indigo-50/20 transition-colors">
                                                        <td className="px-6 py-4 font-bold text-slate-700">Regular Holiday</td>
                                                        <td className="px-6 py-4 text-slate-500">100%</td>
                                                        <td className="px-6 py-4 text-center">
                                                            <div className="flex items-center justify-center gap-1 text-indigo-600 font-bold">
                                                                + <input
                                                                    className="w-12 text-center border-b border-indigo-200 focus:border-indigo-600 outline-none bg-transparent"
                                                                    value={policies.regularHolidayRate}
                                                                    onChange={(e) => updatePolicy('regularHolidayRate', Number(e.target.value))}
                                                                /> %
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-right font-bold text-slate-900">{100 + policies.regularHolidayRate}%</td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${policies.regularHolidayRate < LEGAL_STANDARDS.PREMIUM_REGULAR_HOLIDAY ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                                {policies.regularHolidayRate < LEGAL_STANDARDS.PREMIUM_REGULAR_HOLIDAY ? 'Sub-standard' : 'Compliant'}
                                                            </span>
                                                        </td>
                                                    </tr>

                                                    {/* Special Holiday */}
                                                    <tr className="hover:bg-indigo-50/20 transition-colors">
                                                        <td className="px-6 py-4 font-bold text-slate-700">Special Non-Working</td>
                                                        <td className="px-6 py-4 text-slate-500">No Work, No Pay</td>
                                                        <td className="px-6 py-4 text-center">
                                                            <div className="flex items-center justify-center gap-1 text-indigo-600 font-bold">
                                                                + <input
                                                                    className="w-12 text-center border-b border-indigo-200 focus:border-indigo-600 outline-none bg-transparent"
                                                                    value={policies.specialHolidayRate}
                                                                    onChange={(e) => updatePolicy('specialHolidayRate', Number(e.target.value))}
                                                                /> %
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-right font-bold text-slate-900">{100 + policies.specialHolidayRate}%</td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${policies.specialHolidayRate < LEGAL_STANDARDS.PREMIUM_SPECIAL_HOLIDAY ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                                {policies.specialHolidayRate < LEGAL_STANDARDS.PREMIUM_SPECIAL_HOLIDAY ? 'Sub-standard' : 'Compliant'}
                                                            </span>
                                                        </td>
                                                    </tr>

                                                    {/* Rest Day */}
                                                    <tr className="hover:bg-indigo-50/20 transition-colors">
                                                        <td className="px-6 py-4 font-bold text-slate-700">Rest Day (Worked)</td>
                                                        <td className="px-6 py-4 text-slate-500">100%</td>
                                                        <td className="px-6 py-4 text-center">
                                                            <div className="flex items-center justify-center gap-1 text-indigo-600 font-bold">
                                                                + <input
                                                                    className="w-12 text-center border-b border-indigo-200 focus:border-indigo-600 outline-none bg-transparent"
                                                                    value={policies.otRestDayRate}
                                                                    onChange={(e) => updatePolicy('otRestDayRate', Number(e.target.value))}
                                                                /> %
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-right font-bold text-slate-900">{100 + policies.otRestDayRate}%</td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${policies.otRestDayRate < LEGAL_STANDARDS.PREMIUM_REST_DAY ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                                {policies.otRestDayRate < LEGAL_STANDARDS.PREMIUM_REST_DAY ? 'Sub-standard' : 'Compliant'}
                                                            </span>
                                                        </td>
                                                    </tr>

                                                    {/* Night Diff */}
                                                    <tr className="hover:bg-indigo-50/20 transition-colors bg-slate-50/50">
                                                        <td className="px-6 py-4 font-bold text-slate-700">Night Differential</td>
                                                        <td className="px-6 py-4 text-slate-500">Hourly Rate</td>
                                                        <td className="px-6 py-4 text-center">
                                                            <div className="flex items-center justify-center gap-1 text-indigo-600 font-bold">
                                                                + <input
                                                                    className="w-12 text-center border-b border-indigo-200 focus:border-indigo-600 outline-none bg-transparent"
                                                                    value={policies.nightDiffRate}
                                                                    onChange={(e) => updatePolicy('nightDiffRate', Number(e.target.value))}
                                                                /> %
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-right font-bold text-slate-900">1{policies.nightDiffRate}%</td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${policies.nightDiffRate < LEGAL_STANDARDS.NIGHT_DIFF_RATE ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                                {policies.nightDiffRate < LEGAL_STANDARDS.NIGHT_DIFF_RATE ? 'Sub-standard' : 'Compliant'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="w-full h-px bg-slate-100"></div>

                                    {/* 3. Monetary Benefits & De Minimis */}
                                    <div>
                                        <SectionTitle
                                            icon={Gift}
                                            title="Benefits & De Minimis"
                                            description="Tax-exempt allowances ceilings based on TRAIN Law."
                                            citation="RR 11-2018 / TRAIN Law"
                                        />
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                                            <div className="p-5 border border-slate-200 rounded-2xl bg-white">
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Rice Subsidy Cap</label>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-slate-400 font-bold">₱</span>
                                                    <input
                                                        type="number"
                                                        className="w-full p-2 border-b border-slate-200 font-bold text-lg text-slate-900 outline-none focus:border-indigo-500 bg-white"
                                                        value={policies.riceSubsidyCap}
                                                        onChange={(e) => updatePolicy('riceSubsidyCap', Number(e.target.value))}
                                                    />
                                                    <span className="text-xs font-bold text-slate-400">/ Mo</span>
                                                </div>
                                                <ComplianceBadge {...getComplianceStatus(policies.riceSubsidyCap, LEGAL_STANDARDS.DEMINIMIS_RICE, 'exact')} citation="RR 11-2018" />
                                            </div>

                                            <div className="p-5 border border-slate-200 rounded-2xl bg-white">
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Clothing Allowance</label>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-slate-400 font-bold">₱</span>
                                                    <input
                                                        type="number"
                                                        className="w-full p-2 border-b border-slate-200 font-bold text-lg text-slate-900 outline-none focus:border-indigo-500 bg-white"
                                                        value={policies.clothingAllowanceCap}
                                                        onChange={(e) => updatePolicy('clothingAllowanceCap', Number(e.target.value))}
                                                    />
                                                    <span className="text-xs font-bold text-slate-400">/ Yr</span>
                                                </div>
                                                <ComplianceBadge {...getComplianceStatus(policies.clothingAllowanceCap, LEGAL_STANDARDS.DEMINIMIS_CLOTHING, 'exact')} citation="RR 11-2018" />
                                            </div>

                                            <div className="p-5 border border-slate-200 rounded-2xl bg-white">
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Laundry Allowance</label>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-slate-400 font-bold">₱</span>
                                                    <input
                                                        type="number"
                                                        className="w-full p-2 border-b border-slate-200 font-bold text-lg text-slate-900 outline-none focus:border-indigo-500 bg-white"
                                                        value={policies.laundryAllowanceCap}
                                                        onChange={(e) => updatePolicy('laundryAllowanceCap', Number(e.target.value))}
                                                    />
                                                    <span className="text-xs font-bold text-slate-400">/ Mo</span>
                                                </div>
                                                <ComplianceBadge {...getComplianceStatus(policies.laundryAllowanceCap, LEGAL_STANDARDS.DEMINIMIS_LAUNDRY, 'exact')} citation="RR 11-2018" />
                                            </div>

                                        </div>

                                        <div className="mt-6 p-5 border border-slate-200 rounded-2xl bg-white flex items-center justify-between">
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm">13th Month Pay Basis</h4>
                                                <p className="text-xs text-slate-500">Computation for mandatory year-end benefit.</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => updatePolicy('thirteenthMonthBasis', 'Basic Pay')}
                                                    className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${policies.thirteenthMonthBasis === 'Basic Pay' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-slate-500 border-slate-200'}`}
                                                >
                                                    Basic Pay Earned
                                                </button>
                                                <button
                                                    onClick={() => updatePolicy('thirteenthMonthBasis', 'Total Earnings')}
                                                    className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${policies.thirteenthMonthBasis === 'Total Earnings' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-slate-500 border-slate-200'}`}
                                                >
                                                    Total Earnings
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            )}
                            {/* --- BOOKS I & II: PRE-EMPLOYMENT & HRD --- */}
                            {activeTab === 'Book1_2' && (
                                <div className="space-y-8">
                                    <SectionTitle
                                        icon={GraduationCap}
                                        title="Probation & Training"
                                        description="Standards for probationary employment and apprenticeship programs."
                                        citation="Book I & II"
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2 p-10 border border-slate-200 rounded-[32px] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
                                            <div className="flex flex-col lg:flex-row gap-12">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-4 mb-8">
                                                        <div className="p-3 bg-indigo-600/10 rounded-2xl text-indigo-600 ring-4 ring-indigo-50">
                                                            <Clock size={24} />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-xl font-black text-slate-900 tracking-tight">Probationary Standards</h4>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <span className="text-xs text-slate-400 font-medium">Labor Code Art. 296 Compliance</span>
                                                                <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                                                                <span className="text-xs text-indigo-600 font-bold uppercase tracking-widest text-[10px]">Statutory</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="bg-slate-50 border border-slate-100 p-8 rounded-[24px] mb-10 group transition-all hover:bg-white hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5">
                                                        <div className="flex flex-col md:flex-row items-center gap-6">
                                                            <div className="flex-1">
                                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Maximum Allowed Period</label>
                                                                <div className="flex items-center gap-4">
                                                                    <div className="relative">
                                                                        <input
                                                                            type="number"
                                                                            className="w-32 p-4 border-2 border-slate-200 rounded-2xl font-black text-slate-900 text-2xl text-center bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                                                                            value={policies.probationaryDays}
                                                                            onChange={(e) => updatePolicy('probationaryDays', Number(e.target.value))}
                                                                        />
                                                                        <div className="absolute -top-3 -right-3 bg-indigo-600 text-white text-[9px] px-2 py-1 rounded-lg font-black shadow-lg shadow-indigo-200">CODE Art 296</div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-lg font-black text-slate-900">Days <span className="text-slate-400">/ 180</span></div>
                                                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Calendar Days Only</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="w-full md:w-fit">
                                                                <ComplianceBadge {...getProbationStatus()} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Exception Scenarios Container */}
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-6">
                                                            <Scale size={18} className="text-slate-400" />
                                                            <h5 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Legal Exceptions & Scenarios</h5>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                                            {/* Performance Extension */}
                                                            <div className={`p-5 rounded-[20px] border-2 transition-all group relative overflow-hidden ${policies.isProbationExtensionEnabled ? 'bg-indigo-50 border-indigo-200 shadow-md ring-4 ring-indigo-500/5' : 'bg-white border-slate-100 hover:border-slate-300'}`}>
                                                                <div className="flex items-center justify-between relative z-10 mb-4">
                                                                    <div className={`p-2 rounded-lg ${policies.isProbationExtensionEnabled ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                                        <TrendingUp size={16} />
                                                                    </div>
                                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                                        <input
                                                                            type="checkbox"
                                                                            className="sr-only peer"
                                                                            checked={policies.isProbationExtensionEnabled}
                                                                            onChange={e => updatePolicy('isProbationExtensionEnabled', e.target.checked)}
                                                                        />
                                                                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                                                                    </label>
                                                                </div>
                                                                <div className="relative z-10">
                                                                    <h6 className={`text-xs font-black uppercase tracking-wider mb-2 ${policies.isProbationExtensionEnabled ? 'text-indigo-900' : 'text-slate-800'}`}>Performance Ext.</h6>
                                                                    <p className="text-[10px] text-slate-500 leading-relaxed font-bold">Requires mutual written agreement for a second evaluation.</p>
                                                                </div>
                                                                <div className="mt-4 pt-3 border-t border-indigo-100/50 flex justify-between items-center relative z-10">
                                                                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-tighter">Mariwasa SC</span>
                                                                </div>
                                                            </div>

                                                            {/* Apprenticeship */}
                                                            <div className={`p-5 rounded-[20px] border-2 transition-all group relative overflow-hidden ${policies.isApprenticeshipEnabled ? 'bg-emerald-50 border-emerald-200 shadow-md ring-4 ring-emerald-500/5' : 'bg-white border-slate-100 hover:border-slate-300'}`}>
                                                                <div className="flex items-center justify-between relative z-10 mb-4">
                                                                    <div className={`p-2 rounded-lg ${policies.isApprenticeshipEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                                        <GraduationCap size={16} />
                                                                    </div>
                                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                                        <input
                                                                            type="checkbox"
                                                                            className="sr-only peer"
                                                                            checked={policies.isApprenticeshipEnabled}
                                                                            onChange={e => updatePolicy('isApprenticeshipEnabled', e.target.checked)}
                                                                        />
                                                                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                                                                    </label>
                                                                </div>
                                                                <div className="relative z-10">
                                                                    <h6 className={`text-xs font-black uppercase tracking-wider mb-2 ${policies.isApprenticeshipEnabled ? 'text-emerald-900' : 'text-slate-800'}`}>Apprentice Prog.</h6>
                                                                    <p className="text-[10px] text-slate-500 leading-relaxed font-bold">Programs exceeding 6 months for specialized technical trades.</p>
                                                                </div>
                                                                <div className="mt-4 pt-3 border-t border-emerald-100/50 flex justify-between items-center relative z-10">
                                                                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-tighter">Art. 61 / TESDA</span>
                                                                </div>
                                                            </div>

                                                            {/* Tolling */}
                                                            <div className={`p-5 rounded-[20px] border-2 transition-all group relative overflow-hidden ${policies.isTollingEnabled ? 'bg-amber-50 border-amber-200 shadow-md ring-4 ring-amber-500/5' : 'bg-white border-slate-100 hover:border-slate-300'}`}>
                                                                <div className="flex items-center justify-between relative z-10 mb-4">
                                                                    <div className={`p-2 rounded-lg ${policies.isTollingEnabled ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                                        <AlertCircle size={16} />
                                                                    </div>
                                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                                        <input
                                                                            type="checkbox"
                                                                            className="sr-only peer"
                                                                            checked={policies.isTollingEnabled}
                                                                            onChange={e => updatePolicy('isTollingEnabled', e.target.checked)}
                                                                        />
                                                                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                                                                    </label>
                                                                </div>
                                                                <div className="relative z-10">
                                                                    <h6 className={`text-xs font-black uppercase tracking-wider mb-2 ${policies.isTollingEnabled ? 'text-amber-900' : 'text-slate-800'}`}>Absence Tolling</h6>
                                                                    <p className="text-[10px] text-slate-500 leading-relaxed font-bold">Suspends clock for Maternity (105d) or prolonged medical leaves.</p>
                                                                </div>
                                                                <div className="mt-4 pt-3 border-t border-amber-100/50 flex justify-between items-center relative z-10">
                                                                    <span className="text-[9px] font-black text-amber-500 uppercase tracking-tighter">RA 11210 / Tolling</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="w-full lg:w-72 bg-slate-900 p-8 rounded-[24px] text-white overflow-hidden relative shadow-2xl">
                                                    <div className="absolute top-0 right-0 p-8 opacity-5">
                                                        <Gavel size={150} />
                                                    </div>
                                                    <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Statutory Framework</h5>
                                                    <div className="space-y-8 relative z-10">
                                                        <div className="flex gap-4">
                                                            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30">
                                                                <Check size={12} className="text-emerald-400" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[11px] font-black text-white leading-tight mb-1 uppercase tracking-wider">Performance Disclosure</p>
                                                                <p className="text-[10px] text-slate-400 leading-relaxed">Reasonable standards must be communicated at <strong>Day 1</strong> of hire.</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-4">
                                                            <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/30">
                                                                <Check size={12} className="text-blue-400" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[11px] font-black text-white leading-tight mb-1 uppercase tracking-wider">Automatic Status</p>
                                                                <p className="text-[10px] text-slate-400 leading-relaxed">Employees are regularized by operation of law after <strong>6 months</strong> of service.</p>
                                                            </div>
                                                        </div>
                                                        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                                                            <div className="flex items-center gap-2 text-rose-400 mb-2">
                                                                <AlertTriangle size={14} />
                                                                <span className="text-[10px] font-black uppercase tracking-widest">Termination Guard</span>
                                                            </div>
                                                            <p className="text-[10px] text-slate-300 leading-relaxed font-bold italic">
                                                                "Pregnant employees or those on leave are protected against non-regularization based on absence."
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6 border border-slate-200 rounded-2xl bg-white hover:border-indigo-200 transition-colors">
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Apprentice Wage</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    className="w-20 p-2.5 border border-slate-300 rounded-lg font-bold text-slate-900 text-center bg-white"
                                                    value={policies.apprenticeWagePercent}
                                                    onChange={(e) => updatePolicy('apprenticeWagePercent', Number(e.target.value))}
                                                />
                                                <span className="text-sm font-bold text-slate-700">% of Minimum Wage</span>
                                            </div>
                                            <ComplianceBadge {...getComplianceStatus(policies.apprenticeWagePercent, LEGAL_STANDARDS.APPRENTICE_WAGE_PERCENT, 'min')} citation="Art. 61/75" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* --- BOOK IV & V: HEALTH & LABOR RELATIONS --- */}
                            {activeTab === 'Book4_5' && (
                                <div className="space-y-8">
                                    <SectionTitle
                                        icon={Stethoscope}
                                        title="Health, Safety & Labor Relations"
                                        description="Medical services and grievance machinery standards."
                                        citation="Book IV & V"
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-6 bg-white border border-slate-200 rounded-2xl">
                                            <h4 className="font-bold text-slate-900 mb-4">Medical Services (Art. 163)</h4>
                                            <div className="space-y-3">
                                                <label className="flex items-center justify-between p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                                                    <span className="text-sm font-medium text-slate-700">Provide Emergency Dental</span>
                                                    <input
                                                        type="checkbox"
                                                        checked={policies.provideDental}
                                                        onChange={(e) => updatePolicy('provideDental', e.target.checked)}
                                                        className="w-5 h-5 accent-indigo-600 bg-white"
                                                    />
                                                </label>
                                                <label className="flex items-center justify-between p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                                                    <span className="text-sm font-medium text-slate-700">Provide Emergency Medical</span>
                                                    <input
                                                        type="checkbox"
                                                        checked={policies.provideMedical}
                                                        onChange={(e) => updatePolicy('provideMedical', e.target.checked)}
                                                        className="w-5 h-5 accent-indigo-600 bg-white"
                                                    />
                                                </label>
                                            </div>
                                            <LegalNote text="Required if > 50 employees" />
                                        </div>

                                        <div className="p-6 bg-white border border-slate-200 rounded-2xl">
                                            <h4 className="font-bold text-slate-900 mb-2">Grievance Machinery (Art. 260)</h4>
                                            <p className="text-xs text-slate-500 mb-4">Required timeline for settling disputes in organized establishments.</p>

                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    className="w-20 p-2.5 border border-slate-300 rounded-lg font-bold text-slate-900 text-center bg-white"
                                                    value={policies.grievanceResolutionDays}
                                                    onChange={(e) => updatePolicy('grievanceResolutionDays', Number(e.target.value))}
                                                />
                                                <span className="text-sm font-bold text-slate-700">Days to Resolve</span>
                                            </div>
                                            <ComplianceBadge {...getComplianceStatus(policies.grievanceResolutionDays, LEGAL_STANDARDS.GRIEVANCE_SETTLEMENT_DAYS, 'max')} citation="Art. 260" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* --- BOOK VI: POST-EMPLOYMENT --- */}
                            {activeTab === 'Book6' && (
                                <div className="space-y-8">
                                    <SectionTitle
                                        icon={Briefcase}
                                        title="Termination & Retirement"
                                        description="Security of tenure, separation pay, and retirement benefits."
                                        citation="Book VI"
                                    />

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <div className="p-6 bg-white border border-slate-200 rounded-2xl">
                                            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                <Coins size={18} className="text-indigo-600" /> Separation Pay
                                            </h4>

                                            <div className="space-y-6">
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Authorized Causes (Redundancy)</label>
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            className="w-20 p-2.5 border border-slate-300 rounded-lg font-bold text-slate-900 text-center bg-white"
                                                            value={policies.separationPayRedundancy}
                                                            step="0.5"
                                                            onChange={(e) => updatePolicy('separationPayRedundancy', Number(e.target.value))}
                                                        />
                                                        <span className="text-sm font-bold text-slate-700">Month / Year of Service</span>
                                                    </div>
                                                    <ComplianceBadge {...getComplianceStatus(policies.separationPayRedundancy, LEGAL_STANDARDS.SEPARATION_PAY_REDUNDANCY, 'min')} citation="Art. 298" />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Disease / Illness</label>
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            className="w-20 p-2.5 border border-slate-300 rounded-lg font-bold text-slate-900 text-center bg-white"
                                                            value={policies.separationPayDisease}
                                                            step="0.5"
                                                            onChange={(e) => updatePolicy('separationPayDisease', Number(e.target.value))}
                                                        />
                                                        <span className="text-sm font-bold text-slate-700">Month / Year of Service</span>
                                                    </div>
                                                    <ComplianceBadge {...getComplianceStatus(policies.separationPayDisease, LEGAL_STANDARDS.SEPARATION_PAY_DISEASE, 'min')} citation="Art. 299" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6 bg-white border border-slate-200 rounded-2xl">
                                            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                <FileMinus size={18} className="text-rose-600" /> Termination Notice
                                            </h4>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Notice Period</label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        className="w-20 p-2.5 border border-slate-300 rounded-lg font-bold text-slate-900 text-center bg-white"
                                                        value={policies.noticePeriodDays}
                                                        onChange={(e) => updatePolicy('noticePeriodDays', Number(e.target.value))}
                                                    />
                                                    <span className="text-sm font-bold text-slate-700">Days Before Termination</span>
                                                </div>
                                                <ComplianceBadge {...getComplianceStatus(policies.noticePeriodDays, 30, 'min')} citation="Art. 297/298" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Retirement Pay — full-width standalone card */}
                                    <div className="p-6 bg-white border border-slate-200 rounded-2xl">
                                        <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                            <Coins size={18} className="text-emerald-600" /> Retirement Pay Configuration
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Pay Multiplier</label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        className="w-20 p-2.5 border border-slate-300 rounded-lg font-bold text-slate-900 text-center bg-white"
                                                        value={policies.retirementPayMultiplier}
                                                        step="0.5"
                                                        onChange={(e) => updatePolicy('retirementPayMultiplier', Number(e.target.value))}
                                                    />
                                                    <span className="text-sm font-bold text-slate-700">Days / Year</span>
                                                </div>
                                                <ComplianceBadge {...getComplianceStatus(policies.retirementPayMultiplier, LEGAL_STANDARDS.RETIREMENT_PAY_MULTIPLIER, 'min')} citation="Art. 302" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Optional Retirement Age</label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        className="w-20 p-2.5 border border-slate-300 rounded-lg font-bold text-slate-900 text-center bg-white"
                                                        value={policies.retirementAgeMin}
                                                        onChange={(e) => updatePolicy('retirementAgeMin', Number(e.target.value))}
                                                    />
                                                    <span className="text-sm font-bold text-slate-700">Years Old</span>
                                                </div>
                                                <ComplianceBadge {...getComplianceStatus(policies.retirementAgeMin, LEGAL_STANDARDS.RETIREMENT_AGE_MIN, 'exact')} citation="Art. 302" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Compulsory Retirement Age</label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        className="w-20 p-2.5 border border-slate-300 rounded-lg font-bold text-slate-900 text-center bg-white"
                                                        value={policies.retirementAgeMax}
                                                        onChange={(e) => updatePolicy('retirementAgeMax', Number(e.target.value))}
                                                    />
                                                    <span className="text-sm font-bold text-slate-700">Years Old</span>
                                                </div>
                                                <ComplianceBadge {...getComplianceStatus(policies.retirementAgeMax, LEGAL_STANDARDS.RETIREMENT_AGE_MAX, 'exact')} citation="Art. 302" />
                                            </div>
                                        </div>
                                        <LegalNote text="½ month salary = 15 days basic pay + 1/12 of 13th month pay (2.5 days) + 5 SIL days = 22.5 days total. Minimum 5 years of service required (RA 7641)." />
                                    </div>
                                </div>
                            )}
                            {/* --- MASTER LEAVE SETUP --- */}
                            {activeTab === 'Special' && (
                                <div className="space-y-8">
                                    <SectionTitle
                                        icon={BookMarked}
                                        title="Master Leave Setup"
                                        description="Unified configuration for statutory and company leave benefits, including monetization, eligibility, and accrual policies."
                                        citation="Labor Code / Special Laws"
                                    />

                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[700px]">
                                        {/* Left Panel: Leave Picker */}
                                        <div className="lg:col-span-4 space-y-4">
                                            <div className="bg-slate-900 rounded-[2.5rem] p-6 shadow-xl relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                                    <Calendar size={120} className="text-white" />
                                                </div>
                                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 relative z-10">Select Leave Type</h4>

                                                <div className="space-y-2 relative z-10">
                                                    {LEAVE_TYPES_LIST.map(leave => (
                                                        <button
                                                            key={leave.id}
                                                            onClick={() => setSelectedLeaveId(leave.id)}
                                                            className={`w-full text-left p-4 rounded-2xl flex items-center justify-between transition-all group ${selectedLeaveId === leave.id
                                                                ? 'bg-white text-slate-900 shadow-lg'
                                                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className={`p-2 rounded-xl ${selectedLeaveId === leave.id ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500 group-hover:bg-slate-700'}`}>
                                                                    <leave.icon size={18} />
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-black text-inherit">{leave.name}</div>
                                                                    <div className="flex items-center gap-2 mt-0.5">
                                                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${selectedLeaveId === leave.id ? 'bg-slate-100 text-slate-600' : 'bg-slate-800 text-slate-500'}`}>
                                                                            {leave.code}
                                                                        </span>
                                                                        {leave.isStatutory && <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Statutory</span>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <ArrowRight size={16} className={`transition-transform ${selectedLeaveId === leave.id ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`} />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-[2rem]">
                                                <h5 className="text-xs font-black text-indigo-900 uppercase tracking-widest mb-2">Policy Note</h5>
                                                <p className="text-[11px] text-indigo-700/70 leading-relaxed font-medium">
                                                    Standardizing these settings ensures consistency across automated payroll and leave management components.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Right Panel: Configuration */}
                                        <div className="lg:col-span-8">
                                            <div className="bg-white border-2 border-slate-100 rounded-[3.5rem] p-16 shadow-sm min-h-full">
                                                {/* Panel Header */}
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-16 pb-12 border-b-2 border-slate-50">
                                                    <div className="flex items-center gap-8 text-left">
                                                        <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center text-white shadow-2xl ${currentLeaveConfig.color.replace('text', 'bg')} transform -rotate-3 hover:rotate-0 transition-transform duration-500`}>
                                                            <currentLeaveConfig.icon size={44} />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-5">
                                                                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{currentLeaveConfig.name}</h3>
                                                                <span className="text-[11px] font-black bg-slate-100 text-slate-500 px-5 py-2 rounded-full uppercase tracking-[0.25em] border border-slate-200">{currentLeaveConfig.code}</span>
                                                            </div>
                                                            <div className="flex items-center gap-3 mt-3">
                                                                <div className="p-1.5 bg-slate-100 rounded-lg">
                                                                    <BookMarked size={16} className="text-slate-400" />
                                                                </div>
                                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em]">{currentLeaveConfig.citation}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-8 bg-slate-50 px-8 py-5 rounded-[2rem] border border-slate-100">
                                                        <div className="text-right">
                                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Benefit Status</div>
                                                            <div className={`text-xs font-black tracking-[0.2em] ${currentLeaveConfig.enabled ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                                {currentLeaveConfig.enabled ? 'ACTIVE' : 'DISABLED'}
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => updateLeaveConfig(selectedLeaveId, 'enabled', !currentLeaveConfig.enabled)}
                                                            className={`w-16 h-9 rounded-full relative transition-all duration-500 ${currentLeaveConfig.enabled ? 'bg-emerald-500 shadow-xl shadow-emerald-100' : 'bg-slate-300'}`}
                                                        >
                                                            <div className={`absolute top-1 w-7 h-7 bg-white rounded-full shadow-md transition-all duration-500 ease-spring ${currentLeaveConfig.enabled ? 'left-8' : 'left-1'}`} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className={`space-y-20 transition-all duration-700 ${currentLeaveConfig.enabled ? 'opacity-100 scale-100' : 'opacity-20 scale-[0.98] pointer-events-none'}`}>

                                                    {/* Row 1: Credits & Accrual */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-left">
                                                        <div className="space-y-10">
                                                            <div className="flex items-center gap-4 mb-2">
                                                                <div className="p-2.5 bg-indigo-50 rounded-2xl shadow-sm">
                                                                    <CalendarCheck size={22} className="text-indigo-600" />
                                                                </div>
                                                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Allowance & Accrual</h4>
                                                            </div>

                                                            <div className="bg-slate-50/50 rounded-[3rem] p-12 space-y-10 border border-slate-100 shadow-inner">
                                                                <div>
                                                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-5">Annual Leave Credits</label>
                                                                    <div className="flex items-center gap-6">
                                                                        <input
                                                                            type="number"
                                                                            className="w-32 p-6 bg-white border-2 border-slate-200 rounded-[1.5rem] text-4xl font-black text-slate-900 focus:border-indigo-500 focus:ring-8 focus:ring-indigo-50 outline-none transition-all shadow-sm"
                                                                            value={currentLeaveConfig.days}
                                                                            onChange={(e) => updateLeaveConfig(selectedLeaveId, 'days', Number(e.target.value))}
                                                                        />
                                                                        <div>
                                                                            <div className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">Days / Year</div>
                                                                            <div className="text-[11px] font-bold text-slate-400 mt-2 tracking-tight">Main statutory benefit</div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div>
                                                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-5">Accrual Strategy</label>
                                                                    <div className="grid grid-cols-1 gap-3">
                                                                        {['Immediate', 'Monthly', 'Yearly', 'Upon regularization'].map(policy => (
                                                                            <button
                                                                                key={policy}
                                                                                onClick={() => updateLeaveConfig(selectedLeaveId, 'accrualPolicy', policy)}
                                                                                className={`p-6 rounded-2xl border-2 text-xs font-black text-left transition-all ${currentLeaveConfig.accrualPolicy === policy ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xl shadow-indigo-100 translate-x-2' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
                                                                            >
                                                                                <div className="flex items-center justify-between">
                                                                                    {policy}
                                                                                    {currentLeaveConfig.accrualPolicy === policy && (
                                                                                        <div className="bg-white/20 p-1 rounded-full">
                                                                                            <Check size={16} className="text-white" />
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-10">
                                                            <div className="flex items-center gap-4 mb-2">
                                                                <div className="p-2.5 bg-amber-50 rounded-2xl shadow-sm">
                                                                    <History size={22} className="text-amber-600" />
                                                                </div>
                                                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Retention & Limits</h4>
                                                            </div>

                                                            <div className="bg-slate-50/50 rounded-[3rem] p-12 space-y-12 border border-slate-100 shadow-inner">
                                                                <div>
                                                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-5">Accumulation Cap</label>
                                                                    <div className="flex items-center gap-6">
                                                                        <input
                                                                            type="number"
                                                                            className="w-32 p-6 bg-white border-2 border-slate-200 rounded-[1.5rem] text-4xl font-black text-slate-900 focus:border-indigo-500 focus:ring-8 focus:ring-indigo-50 outline-none transition-all shadow-sm"
                                                                            value={currentLeaveConfig.maxAccrued}
                                                                            onChange={(e) => updateLeaveConfig(selectedLeaveId, 'maxAccrued', Number(e.target.value))}
                                                                        />
                                                                        <div>
                                                                            <div className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">Max Days</div>
                                                                            <div className="text-[11px] font-bold text-slate-400 mt-2 tracking-tight">Total audit accumulation</div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-6">
                                                                    <div className="relative group">
                                                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 pr-2">Expiration Frequency</label>
                                                                        <select
                                                                            className="w-full p-6 bg-white border-2 border-slate-200 rounded-[1.5rem] font-black text-slate-800 focus:border-indigo-500 outline-none appearance-none cursor-pointer shadow-sm transition-all"
                                                                            value={currentLeaveConfig.expiration}
                                                                            onChange={(e) => updateLeaveConfig(selectedLeaveId, 'expiration', e.target.value)}
                                                                        >
                                                                            <option>Never</option>
                                                                            <option>Every Year-End</option>
                                                                            <option>After 12 Months</option>
                                                                        </select>
                                                                        <div className="absolute right-6 bottom-6 pointer-events-none text-slate-400">
                                                                            <ArrowRight size={18} className="rotate-90" />
                                                                        </div>
                                                                    </div>

                                                                    <button
                                                                        onClick={() => updateLeaveConfig(selectedLeaveId, 'isForfeited', !currentLeaveConfig.isForfeited)}
                                                                        className={`w-full p-8 rounded-[1.5rem] border-2 flex items-center justify-between transition-all group ${currentLeaveConfig.isForfeited ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-md translate-y-[-2px]' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                                                                    >
                                                                        <div className="flex items-center gap-5">
                                                                            <div className={`p-3 rounded-2xl transition-colors ${currentLeaveConfig.isForfeited ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                                                                                {currentLeaveConfig.isForfeited ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                                                                            </div>
                                                                            <div className="text-left">
                                                                                <span className="text-xs font-black uppercase tracking-[0.15em] block">Unused Credits</span>
                                                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 leading-none">Auto-Forfeiture Policy</span>
                                                                            </div>
                                                                        </div>
                                                                        <span className={`text-[10px] font-black uppercase tracking-widest px-5 py-2 rounded-full ${currentLeaveConfig.isForfeited ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                                                            {currentLeaveConfig.isForfeited ? 'FORFEITED' : 'RETAINED'}
                                                                        </span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Row 2: Eligibility & Filing */}
                                                    <div className="border-t-2 border-slate-50 pt-20">
                                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 text-left">
                                                            <div className="lg:col-span-8 space-y-10">
                                                                <div className="flex items-center gap-4 mb-2">
                                                                    <div className="p-2.5 bg-purple-50 rounded-2xl shadow-sm">
                                                                        <Users size={22} className="text-purple-600" />
                                                                    </div>
                                                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Eligibility Matrix</h4>
                                                                </div>
                                                                <div className="flex flex-wrap gap-4 p-2 relative">
                                                                    {['Regular', 'Probationary', 'Full-time', 'Part-time', 'Male', 'Female', 'Solo Parent', 'Married'].map(tag => (
                                                                        <button
                                                                            key={tag}
                                                                            onClick={() => {
                                                                                const exists = currentLeaveConfig.eligibility.includes(tag);
                                                                                const newVal = exists
                                                                                    ? currentLeaveConfig.eligibility.filter((t: string) => t !== tag)
                                                                                    : [...currentLeaveConfig.eligibility, tag];
                                                                                updateLeaveConfig(selectedLeaveId, 'eligibility', newVal);
                                                                            }}
                                                                            className={`px-8 py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all border-2 ${currentLeaveConfig.eligibility.includes(tag) ? 'bg-indigo-600 border-indigo-600 text-white shadow-[0_15px_40px_rgba(79,70,229,0.25)] scale-110 z-10' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
                                                                        >
                                                                            {tag}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                                <div className="flex items-center gap-3 pl-3">
                                                                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></div>
                                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em]">Selected groups are automatically entitled to this benefit.</p>
                                                                </div>
                                                            </div>
                                                            <div className="lg:col-span-4 space-y-10">
                                                                <div className="flex items-center gap-4 mb-2">
                                                                    <div className="p-2.5 bg-rose-50 rounded-2xl shadow-sm">
                                                                        <Clock size={22} className="text-rose-600" />
                                                                    </div>
                                                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Filing Constraints</h4>
                                                                </div>
                                                                <div className="bg-rose-50/50 rounded-[3rem] p-12 border border-rose-100 flex flex-col items-center shadow-inner">
                                                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6 text-center w-full">Max Filed Per Month</label>
                                                                    <div className="flex items-center gap-6">
                                                                        <input
                                                                            type="number"
                                                                            className="w-28 p-6 bg-white border-2 border-rose-200 rounded-[2rem] text-4xl font-black text-rose-600 focus:border-rose-500 focus:ring-8 focus:ring-rose-50 outline-none transition-all shadow-sm text-center"
                                                                            value={currentLeaveConfig.maxFiledPerMonth}
                                                                            onChange={(e) => updateLeaveConfig(selectedLeaveId, 'maxFiledPerMonth', Number(e.target.value))}
                                                                        />
                                                                        <div className="text-[11px] font-black text-rose-400 uppercase tracking-[0.2em] leading-tight">Days<br />Limit</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Row 3: Monetization Setup */}
                                                    <div className="bg-slate-900 rounded-[4rem] p-20 text-white shadow-2xl relative overflow-hidden text-left mt-10">
                                                        <div className="absolute top-0 right-0 p-32 opacity-[0.02] transform rotate-12 scale-150 pointer-events-none">
                                                            <DollarSign size={500} />
                                                        </div>

                                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 mb-20 relative z-10 border-b border-white/10 pb-16">
                                                            <div className="flex items-center gap-10">
                                                                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-[2rem] shadow-[0_25px_60px_rgba(79,70,229,0.3)] flex items-center justify-center transform hover:rotate-6 transition-transform duration-500">
                                                                    <Coins size={44} className="text-white" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-4xl font-black tracking-tighter">Monetization Engine</h4>
                                                                    <p className="text-base text-indigo-400/80 font-bold uppercase tracking-[0.3em] mt-2">Cash Conversion Rules & Policy</p>
                                                                </div>
                                                            </div>

                                                            <button
                                                                onClick={() => updateLeaveConfig(selectedLeaveId, 'monetizationEnabled', !currentLeaveConfig.monetizationEnabled)}
                                                                className={`flex items-center gap-6 px-12 py-6 rounded-[3rem] border transition-all duration-500 ${currentLeaveConfig.monetizationEnabled ? 'bg-indigo-600 border-indigo-400 shadow-[0_30px_70px_rgba(79,70,229,0.4)]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                                                            >
                                                                <span className={`text-xs font-black uppercase tracking-[0.25em] ${currentLeaveConfig.monetizationEnabled ? 'text-white' : 'text-slate-500'}`}>
                                                                    {currentLeaveConfig.monetizationEnabled ? 'MONETIZATION ACTIVE' : 'NO CASH VALUE'}
                                                                </span>
                                                                <div className="relative">
                                                                    <div className={`w-16 h-8 rounded-full transition-colors ${currentLeaveConfig.monetizationEnabled ? 'bg-indigo-400' : 'bg-slate-800'}`}></div>
                                                                    <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-2xl transition-all duration-500 ease-spring ${currentLeaveConfig.monetizationEnabled ? 'translate-x-[2rem]' : 'translate-x-0'}`}></div>
                                                                </div>
                                                            </button>
                                                        </div>

                                                        {currentLeaveConfig.monetizationEnabled ? (
                                                            <div className="space-y-20 relative z-10 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                                                                    <div className="space-y-6">
                                                                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] mb-3">Computation Basis</label>
                                                                        <div className="flex flex-col gap-3">
                                                                            {['Daily Rate', 'Monthly Rate'].map(b => (
                                                                                <button
                                                                                    key={b}
                                                                                    onClick={() => updateLeaveConfig(selectedLeaveId, 'monetizationBasis', b as 'Daily Rate' | 'Monthly Rate')}
                                                                                    className={`p-6 rounded-2xl border-2 font-black text-[11px] uppercase tracking-widest transition-all ${currentLeaveConfig.monetizationBasis === b ? 'bg-white text-slate-900 border-white shadow-2xl scale-105 z-10' : 'bg-transparent border-white/10 text-slate-500 hover:border-white/30'}`}
                                                                                >
                                                                                    {b}
                                                                                </button>
                                                                            ))}
                                                                        </div>
                                                                    </div>

                                                                    <div className="space-y-6">
                                                                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] mb-3">Cash Value Rate</label>
                                                                        <div className="flex items-center gap-6 bg-white/5 p-4 rounded-[2.5rem] border border-white/10 focus-within:border-indigo-400 transition-all shadow-inner group">
                                                                            <input
                                                                                type="number"
                                                                                className="w-full p-6 bg-transparent text-5xl font-black text-white outline-none text-center"
                                                                                value={currentLeaveConfig.monetizationRate}
                                                                                onChange={(e) => updateLeaveConfig(selectedLeaveId, 'monetizationRate', Number(e.target.value))}
                                                                            />
                                                                            <span className="text-4xl font-black text-indigo-400 pr-10 group-focus-within:animate-pulse">%</span>
                                                                        </div>
                                                                    </div>

                                                                    <div className="space-y-6">
                                                                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] mb-3">Max Conversion</label>
                                                                        <div className="flex items-center gap-6 bg-white/5 p-4 rounded-[2.5rem] border border-white/10 focus-within:border-indigo-400 transition-all shadow-inner group">
                                                                            <input
                                                                                type="number"
                                                                                className="w-full p-6 bg-transparent text-5xl font-black text-white outline-none text-center"
                                                                                value={currentLeaveConfig.monetizationMaxDays}
                                                                                onChange={(e) => updateLeaveConfig(selectedLeaveId, 'monetizationMaxDays', Number(e.target.value))}
                                                                            />
                                                                            <span className="text-xs font-black text-slate-500 uppercase tracking-[0.25em] pr-10">Days</span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center bg-indigo-600/10 p-16 rounded-[4rem] border border-indigo-500/20 shadow-inner">
                                                                    <div className="flex items-center gap-10">
                                                                        <div className="p-6 bg-indigo-500/20 rounded-[2rem] shadow-2xl border border-indigo-500/20">
                                                                            <Calculator size={50} className="text-indigo-300" />
                                                                        </div>
                                                                        <div>
                                                                            <div className="text-[12px] font-black text-indigo-300 uppercase tracking-[0.3em] mb-3">Policy Calculation</div>
                                                                            <div className="text-xl font-bold font-mono text-indigo-100 flex items-center gap-4">
                                                                                <span className="bg-white/10 px-4 py-2 rounded-xl">Rate</span>
                                                                                <span className="text-indigo-500 font-black">×</span>
                                                                                <span className="bg-white/10 px-4 py-2 rounded-xl">{currentLeaveConfig.monetizationRate}%</span>
                                                                                <span className="text-indigo-500 font-black">×</span>
                                                                                <span className="bg-white/10 px-4 py-2 rounded-xl">{currentLeaveConfig.monetizationMaxDays}d</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="lg:text-right">
                                                                        <div className="text-[12px] font-black text-indigo-300 uppercase tracking-[0.3em] mb-3">Estimated Value</div>
                                                                        <div className="text-7xl font-black text-white tracking-tighter shadow-indigo-500/20">
                                                                            ₱ <span className="text-indigo-100 italic transition-colors">{(1500 * (currentLeaveConfig.monetizationRate / 100) * currentLeaveConfig.monetizationMaxDays).toLocaleString()}</span>
                                                                        </div>
                                                                        <div className="text-[11px] font-bold text-slate-500 mt-5 italic flex items-center lg:justify-end gap-4 opacity-70">
                                                                            <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                                                                            Calculated on sample ₱1,500 Daily Rate
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Global Tax Exemption */}
                                                                <div className="bg-gradient-to-r from-amber-500/10 to-transparent rounded-[4rem] p-12 border border-dashed border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-12">
                                                                    <div className="flex gap-10 items-center">
                                                                        <div className="p-6 bg-amber-500/10 rounded-[2rem] border border-amber-500/10 shadow-xl">
                                                                            <Scale size={40} className="text-amber-500 shrink-0" />
                                                                        </div>
                                                                        <div className="text-left">
                                                                            <h5 className="text-2xl font-black text-white tracking-tight">Global Tax Exemption Limit</h5>
                                                                            <p className="text-sm text-slate-500 leading-relaxed max-w-sm mt-3 font-medium">
                                                                                Converted leave credits within this de minimis limit are non-taxable (Revenue Regulation 1-2015).
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-8 bg-white/5 px-10 py-6 rounded-[2rem] border border-white/10 group focus-within:border-amber-500 transition-all shadow-inner">
                                                                        <input
                                                                            type="number"
                                                                            className="w-24 bg-transparent text-5xl font-black text-amber-500 text-center outline-none"
                                                                            value={policies.leaveConversionTaxExemptDays}
                                                                            onChange={(e) => updatePolicy('leaveConversionTaxExemptDays', Number(e.target.value))}
                                                                        />
                                                                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] shrink-0">Days Limit</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="py-32 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-1000">
                                                                <div className="w-32 h-32 rounded-[2.5rem] bg-white/5 flex items-center justify-center mb-12 border border-white/10 shadow-2xl transform -rotate-6">
                                                                    <FileMinus size={64} className="text-slate-700" />
                                                                </div>
                                                                <h5 className="text-4xl font-black text-white mb-5 tracking-tight">Non-Monetizable Benefit</h5>
                                                                <p className="text-base text-slate-500 max-w-lg mx-auto leading-relaxed font-medium">This policy is strictly for employee time-off and does not accrue any cash conversion value according to current company standards.</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
        </>
    );
};

export default GovernmentStandardsTab;
