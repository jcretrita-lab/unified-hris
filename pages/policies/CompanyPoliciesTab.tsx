
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
    Stethoscope,
    FileMinus,
    CalendarCheck,
    Gift,
    BookMarked,
    Calculator,
    Check,
    ToggleLeft,
    ToggleRight,
    Building2,
    Plus,
    Trash2,
    Edit
} from 'lucide-react';
import { PolicyState, LeaveConfig, LEGAL_STANDARDS } from './PolicyTypes';
import { ComplianceBadge, LegalNote, SectionTitle, getComplianceStatus } from './PolicyComponents';

interface CompanyPoliciesTabProps {
    activeTab: string;
    policies: PolicyState;
    updatePolicy: (field: keyof PolicyState, value: any) => void;
    // Divisor
    divisors: Divisor[];
    isAddingDivisor: boolean;
    setIsAddingDivisor: (v: boolean) => void;
    editingDivisorId: string | null;
    setEditingDivisorId: (v: string | null) => void;
    divisorForm: Partial<Divisor>;
    setDivisorForm: (v: Partial<Divisor>) => void;
    handleSaveDivisor: () => void;
    handleEditDivisor: (d: Divisor) => void;
    handleDeleteDivisor: (id: string) => void;
    // Separation calculator
    sepCalcSalary: number;
    setSepCalcSalary: (v: number) => void;
    sepCalcYears: number;
    setSepCalcYears: (v: number) => void;
    sepCalcCause: 'redundancy' | 'retrenchment' | 'disease';
    setSepCalcCause: (v: 'redundancy' | 'retrenchment' | 'disease') => void;
    sepMultiplier: number;
    sepPerYear: number;
    sepComputed: number;
    sepPayResult: number;
    // Retirement calculator
    retCalcSalary: number;
    setRetCalcSalary: (v: number) => void;
    retCalcYears: number;
    setRetCalcYears: (v: number) => void;
    retCalcAge: number;
    setRetCalcAge: (v: number) => void;
    retDivisor: number;
    retDailyRate: number;
    retPayResult: number;
    retEligible: boolean;
    retCompulsory: boolean;
    // Shift request
    shiftRequestApprovalDeadlineDays: number;
    setShiftRequestApprovalDeadlineDays: (v: number) => void;
}

const CompanyPoliciesTab: React.FC<CompanyPoliciesTabProps> = (props) => {
    const {
        activeTab, policies, updatePolicy,
        divisors, isAddingDivisor, setIsAddingDivisor, editingDivisorId, setEditingDivisorId,
        divisorForm, setDivisorForm, handleSaveDivisor, handleEditDivisor, handleDeleteDivisor,
        sepCalcSalary, setSepCalcSalary, sepCalcYears, setSepCalcYears, sepCalcCause, setSepCalcCause,
        sepMultiplier, sepPerYear, sepComputed, sepPayResult,
        retCalcSalary, setRetCalcSalary, retCalcYears, setRetCalcYears, retCalcAge, setRetCalcAge,
        retDivisor, retDailyRate, retPayResult, retEligible, retCompulsory,
        shiftRequestApprovalDeadlineDays, setShiftRequestApprovalDeadlineDays
    } = props;

    return (
        <>
                            {activeTab === 'Divisor' && (
                                <div className="space-y-8">
                                    <SectionTitle
                                        icon={Calculator}
                                        title="Divisor Configuration"
                                        description="Set the number of working days per year used for daily rate computations."
                                        citation="Internal Policy"
                                    />

                                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                                        <div className="flex justify-between items-center mb-6">
                                            <h4 className="text-sm font-bold text-slate-700 uppercase tracking-widest">Available Divisors</h4>
                                            <button
                                                onClick={() => { setIsAddingDivisor(true); setEditingDivisorId(null); setDivisorForm({ name: '', days: 0 }); }}
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-all"
                                            >
                                                <Plus size={14} /> Add Divisor
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {divisors.map(d => (
                                                <div key={d.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center group hover:border-blue-300 transition-all">
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-900">{d.name}</div>
                                                        <div className="text-xl font-black text-blue-600 mt-1">{d.days} <span className="text-xs font-bold text-slate-400">Days</span></div>
                                                    </div>
                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => handleEditDivisor(d)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit size={16} /></button>
                                                        <button onClick={() => handleDeleteDivisor(d.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {isAddingDivisor && (
                                            <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-2xl animate-in zoom-in-95 duration-200">
                                                <h5 className="font-bold text-blue-900 mb-4">{editingDivisorId ? 'Edit' : 'New'} Divisor Settings</h5>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-blue-800 uppercase tracking-widest mb-1.5">Label / Name</label>
                                                        <input
                                                            className="w-full p-2.5 bg-white border border-blue-200 rounded-lg outline-none focus:ring-2 ring-blue-500/20 text-sm font-bold text-slate-900"
                                                            placeholder="e.g. 314 Days - Regular"
                                                            value={divisorForm.name}
                                                            onChange={e => setDivisorForm({ ...divisorForm, name: e.target.value })}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-blue-800 uppercase tracking-widest mb-1.5">Days Per Year</label>
                                                        <input
                                                            type="number"
                                                            className="w-full p-2.5 bg-white border border-blue-200 rounded-lg outline-none focus:ring-2 ring-blue-500/20 text-sm font-bold text-slate-900"
                                                            placeholder="e.g. 314"
                                                            value={divisorForm.days || ''}
                                                            onChange={e => setDivisorForm({ ...divisorForm, days: Number(e.target.value) })}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex gap-3">
                                                    <button onClick={handleSaveDivisor} className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-md shadow-blue-200">Save Divisor</button>
                                                    <button onClick={() => setIsAddingDivisor(false)} className="flex-1 py-2.5 bg-white border border-blue-200 text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-50">Cancel</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-indigo-900 rounded-2xl p-6 text-white relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-10">
                                            <Info size={100} />
                                        </div>
                                        <h4 className="font-bold text-lg mb-2 relative z-10 flex items-center gap-2">
                                            <Info size={20} className="text-indigo-400" /> Computation Note
                                        </h4>
                                        <p className="text-sm text-indigo-100/80 leading-relaxed mb-4 relative z-10">
                                            The divisor is crucial for converting monthly salary to daily/hourly rates.
                                            <strong> 314 days</strong> is typically used for employees working Monday-Saturday (excluding holidays).
                                            <strong> 261 days</strong> or <strong> 258 days</strong> are common for Monday-Friday schedules.
                                        </p>
                                        <div className="bg-white/10 p-4 rounded-xl relative z-10 font-mono text-xs">
                                            Daily Rate = (Monthly Salary * 12) / Divisor
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* --- COMPANY: WORKS & WAGES --- */}
                            {activeTab === 'Works' && (
                                <div className="space-y-10">
                                    <SectionTitle
                                        icon={Clock}
                                        title="Company Work Configuration"
                                        description="Custom work hours and attendance rules specific to your organization."
                                        citation="Company Handbook"
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="p-6 border border-slate-200 rounded-2xl bg-white hover:border-blue-200 transition-colors">
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Normal Hours</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    className="w-20 p-2.5 border border-slate-300 rounded-lg font-bold text-slate-900 text-center bg-white"
                                                    value={policies.normalHours}
                                                    onChange={(e) => updatePolicy('normalHours', Number(e.target.value))}
                                                />
                                                <span className="text-sm font-bold text-slate-700">Hours / Day</span>
                                            </div>
                                            <p className="mt-4 text-[10px] text-slate-400 italic">Target default: 9 hours for company policy.</p>
                                        </div>

                                        <div className="p-6 border border-slate-200 rounded-2xl bg-white hover:border-blue-200 transition-colors">
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Meal Break</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    className="w-20 p-2.5 border border-slate-300 rounded-lg font-bold text-slate-900 text-center bg-white"
                                                    value={policies.mealBreakMinutes}
                                                    onChange={(e) => updatePolicy('mealBreakMinutes', Number(e.target.value))}
                                                />
                                                <span className="text-sm font-bold text-slate-700">Minutes</span>
                                            </div>
                                        </div>

                                        <div className="p-6 border border-slate-200 rounded-2xl bg-white hover:border-blue-200 transition-colors flex flex-col justify-between">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Work Week Mode</label>
                                                <label className="flex items-center gap-2 cursor-pointer mt-2">
                                                    <input
                                                        type="checkbox"
                                                        className="w-5 h-5 accent-blue-600 rounded"
                                                        checked={policies.nonCompressedWorkWeek}
                                                        onChange={(e) => updatePolicy('nonCompressedWorkWeek', e.target.checked)}
                                                    />
                                                    <span className="text-sm font-bold text-slate-700">Non-compressed week</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Work Schedule Type Selection (MR1) */}
                                    <div className="p-8 border border-slate-200 rounded-3xl bg-slate-50">
                                        <div className="flex items-center gap-3 mb-6">
                                            <Calendar size={24} className="text-indigo-600" />
                                            <div>
                                                <h4 className="font-bold text-slate-900">Work Schedule Type</h4>
                                                <p className="text-xs text-slate-500">Select the work schedule type for your organization.</p>
                                            </div>
                                        </div>

                                        {/* Radio Cards */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                            {([
                                                { value: 'Standard', label: 'Standard', desc: 'Regular 5-day work week with fixed daily hours.' },
                                                { value: 'Compressed', label: 'Compressed', desc: 'Fewer work days with longer daily hours to complete weekly requirement.' },
                                                { value: 'Flexible', label: 'Flexible', desc: 'Employees choose start/end times within a minimum hours requirement.' },
                                            ] as const).map(opt => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => updatePolicy('workScheduleType', opt.value)}
                                                    className={`p-5 rounded-2xl border-2 text-left transition-all ${policies.workScheduleType === opt.value
                                                        ? 'border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-100'
                                                        : 'border-slate-200 bg-white hover:border-slate-300'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${policies.workScheduleType === opt.value
                                                            ? 'border-indigo-600 bg-indigo-600'
                                                            : 'border-slate-300'
                                                            }`}>
                                                            {policies.workScheduleType === opt.value && <Check size={12} className="text-white" />}
                                                        </div>
                                                        <span className={`text-sm font-bold ${policies.workScheduleType === opt.value ? 'text-indigo-700' : 'text-slate-700'}`}>{opt.label}</span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-500 leading-relaxed">{opt.desc}</p>
                                                </button>
                                            ))}
                                        </div>

                                        {/* Conditional Sections */}
                                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
                                            {/* Standard Config */}
                                            {policies.workScheduleType === 'Standard' && (
                                                <div className="flex items-center gap-4">
                                                    <label className="text-sm font-bold text-slate-700">Standard Daily Hours</label>
                                                    <input
                                                        type="number"
                                                        step="0.5"
                                                        className="w-20 p-2.5 border border-slate-300 rounded-lg font-bold text-slate-900 text-center bg-white"
                                                        value={policies.standardDailyHours}
                                                        onChange={(e) => updatePolicy('standardDailyHours', Number(e.target.value))}
                                                    />
                                                    <span className="text-sm text-slate-500">hours/day</span>
                                                </div>
                                            )}

                                            {/* Compressed Config */}
                                            {policies.workScheduleType === 'Compressed' && (
                                                <div className="space-y-5">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="flex items-center gap-4">
                                                            <label className="text-sm font-bold text-slate-700">6th Day</label>
                                                            <select
                                                                className="flex-1 p-2.5 border border-slate-300 rounded-lg font-bold text-slate-900 bg-white appearance-none"
                                                                value={policies.sixthDay}
                                                                onChange={(e) => updatePolicy('sixthDay', e.target.value)}
                                                            >
                                                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                                                                    <option key={d} value={d}>{d}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <label className="text-sm font-bold text-slate-700">Compressed Daily Hours</label>
                                                            <input
                                                                type="number"
                                                                step="0.5"
                                                                className="w-20 p-2.5 border border-slate-300 rounded-lg font-bold text-slate-900 text-center bg-white"
                                                                value={policies.compressedDailyHours}
                                                                onChange={(e) => updatePolicy('compressedDailyHours', Number(e.target.value))}
                                                            />
                                                            <span className="text-sm text-slate-500">hrs</span>
                                                        </div>
                                                    </div>

                                                    {/* Holiday Auto-Decompression Toggle */}
                                                    <div className="border border-amber-200 bg-amber-50 rounded-xl p-5">
                                                        <label className="flex items-center gap-3 cursor-pointer">
                                                            <button
                                                                onClick={() => updatePolicy('holidayDecompressionEnabled', !policies.holidayDecompressionEnabled)}
                                                                className="shrink-0"
                                                            >
                                                                {policies.holidayDecompressionEnabled ? (
                                                                    <ToggleRight size={28} className="text-amber-600" />
                                                                ) : (
                                                                    <ToggleLeft size={28} className="text-slate-300" />
                                                                )}
                                                            </button>
                                                            <div>
                                                                <span className="text-sm font-bold text-slate-800 block">Holiday Auto-Decompression</span>
                                                                <span className="text-[11px] text-slate-500 block mt-0.5">When the 6th day falls on a holiday, automatically switch compressed employees to standard schedules.</span>
                                                            </div>
                                                        </label>
                                                        {policies.holidayDecompressionEnabled && (
                                                            <div className="mt-4 p-4 bg-white rounded-lg border border-amber-200 text-xs text-amber-800 font-medium italic">
                                                                Preview: "The 6th day ({policies.sixthDay}) is a holiday on [DATE]. Compressed employees will switch to standard {policies.standardDailyHours}-hour schedules."
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Flexible Config */}
                                            {policies.workScheduleType === 'Flexible' && (
                                                <div className="flex items-center gap-4">
                                                    <label className="text-sm font-bold text-slate-700">Minimum Daily Hours</label>
                                                    <input
                                                        type="number"
                                                        step="0.5"
                                                        className="w-20 p-2.5 border border-slate-300 rounded-lg font-bold text-slate-900 text-center bg-white"
                                                        value={policies.flexibleMinimumHours}
                                                        onChange={(e) => updatePolicy('flexibleMinimumHours', Number(e.target.value))}
                                                    />
                                                    <span className="text-sm text-slate-500">hours/day minimum</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Shift Request Expiration Policy */}
                                    <div className="p-8 border border-slate-200 rounded-3xl bg-slate-50">
                                        <div className="flex items-center gap-3 mb-6">
                                            <Clock size={24} className="text-amber-600" />
                                            <div>
                                                <h4 className="font-bold text-slate-900">Shift Request Approval Deadline</h4>
                                                <p className="text-xs text-slate-500">Set the number of days before the next cutoff that a shift change request must be approved, otherwise it expires automatically.</p>
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                                            <div className="flex items-center gap-4">
                                                <label className="text-sm font-bold text-slate-700">Deadline (days before cutoff)</label>
                                                <input
                                                    type="number"
                                                    min={1}
                                                    max={30}
                                                    className="w-20 p-2.5 border border-slate-300 rounded-lg font-bold text-slate-900 text-center bg-white"
                                                    value={shiftRequestApprovalDeadlineDays}
                                                    onChange={(e) => setShiftRequestApprovalDeadlineDays(Number(e.target.value))}
                                                />
                                                <span className="text-sm text-slate-500">days</span>
                                            </div>
                                            <p className="mt-3 text-[10px] text-slate-400 italic">
                                                Shift change requests not approved within {shiftRequestApprovalDeadlineDays} days will automatically expire.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Mirrored Premiums for Company */}
                                    <div className="p-8 border border-slate-200 rounded-3xl bg-slate-50">
                                        <div className="flex items-center gap-3 mb-6">
                                            <BadgePercent size={24} className="text-blue-600" />
                                            <div>
                                                <h4 className="font-bold text-slate-900">Custom Premium Rates</h4>
                                                <p className="text-xs text-slate-500">Define if company premiums differ from statutory minimums.</p>
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-bold text-slate-700">Overtime (Regular)</span>
                                                        <div className="flex items-center gap-2">
                                                            <input type="number" className="w-16 p-1 border-b border-slate-300 text-right font-bold text-blue-700" value={policies.otRegularRate} onChange={(e) => updatePolicy('otRegularRate', Number(e.target.value))} />
                                                            <span className="text-xs font-bold text-slate-400">%</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-bold text-slate-700">Night Differential</span>
                                                        <div className="flex items-center gap-2">
                                                            <input type="number" className="w-16 p-1 border-b border-slate-300 text-right font-bold text-blue-700" value={policies.nightDiffRate} onChange={(e) => updatePolicy('nightDiffRate', Number(e.target.value))} />
                                                            <span className="text-xs font-bold text-slate-400">%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-bold text-slate-700">Rest Day Premium</span>
                                                        <div className="flex items-center gap-2">
                                                            <input type="number" className="w-16 p-1 border-b border-slate-300 text-right font-bold text-blue-700" value={policies.otRestDayRate} onChange={(e) => updatePolicy('otRestDayRate', Number(e.target.value))} />
                                                            <span className="text-xs font-bold text-slate-400">%</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-bold text-slate-700">Regular Holiday</span>
                                                        <div className="flex items-center gap-2">
                                                            <input type="number" className="w-16 p-1 border-b border-slate-300 text-right font-bold text-blue-700" value={policies.regularHolidayRate} onChange={(e) => updatePolicy('regularHolidayRate', Number(e.target.value))} />
                                                            <span className="text-xs font-bold text-slate-400">%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* --- COMPANY: SPECIAL LAWS --- */}
                            {activeTab === 'Special' && (
                                <div className="space-y-8">
                                    <SectionTitle
                                        icon={Heart}
                                        title="Extended Benefits"
                                        description="Additional leaves and benefits provided by the company beyond minimal requirements."
                                        citation="Corporate Policy"
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {[
                                            { label: 'Service Incentive Leave', key: 'serviceIncentiveLeave', icon: Calendar, color: 'text-slate-400' },
                                            { label: 'Maternity Leave', key: 'maternityLeave', icon: Baby, color: 'text-pink-400' },
                                            { label: 'Paternity Leave', key: 'paternityLeave', icon: Baby, color: 'text-blue-400' },
                                            { label: 'Solo Parent Leave', key: 'soloParentLeave', icon: User, color: 'text-amber-400' },
                                            { label: 'VAWC Leave', key: 'vawcLeave', icon: ShieldCheck, color: 'text-purple-400' },
                                            { label: 'Magna Carta (Surgery)', key: 'magnaCartaLeave', icon: Heart, color: 'text-rose-400' },
                                        ].map((item) => (
                                            <div key={item.key} className="p-5 border border-slate-200 rounded-2xl bg-white hover:border-blue-200 transition-colors">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <item.icon size={16} className={item.color} />
                                                    <span className="text-sm font-bold text-slate-800">{item.label}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        className="w-16 p-1 border-b border-slate-300 font-bold text-lg text-center outline-none focus:border-blue-500 bg-white"
                                                        value={(policies as any)[item.key]}
                                                        onChange={(e) => updatePolicy(item.key as any, Number(e.target.value))}
                                                    />
                                                    <span className="text-xs text-slate-500 font-bold">Days</span>
                                                </div>
                                                <p className="mt-3 text-[10px] text-slate-400 italic">Overrides statutory min.</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="w-full h-px bg-slate-100 my-10"></div>

                                    <SectionTitle
                                        icon={DollarSign}
                                        title="Leave Monetization"
                                        description="Company-specific rules for leave encashment."
                                        citation="Company Handbook Section 5"
                                    />

                                    <div className="bg-white border border-slate-200 rounded-3xl p-8">
                                        <div className="flex flex-col md:flex-row gap-8 items-start">
                                            <div className="flex-1">
                                                <h4 className="font-bold text-slate-900 text-sm mb-2">Tax-Exempt Monetization Limit</h4>
                                                <p className="text-xs text-slate-500 mb-6 max-w-md">Maximum number of SIL/Vacation days that can be converted to cash tax-free.</p>
                                                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 w-fit">
                                                    <input
                                                        type="number"
                                                        className="w-20 p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 text-center"
                                                        value={policies.leaveConversionTaxExemptDays}
                                                        onChange={(e) => updatePolicy('leaveConversionTaxExemptDays', Number(e.target.value))}
                                                    />
                                                    <span className="text-sm font-bold text-slate-700">Days / Year</span>
                                                </div>
                                            </div>
                                            <div className="w-full md:w-80 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                                                <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider mb-2">
                                                    <Info size={14} /> Compliance Note
                                                </div>
                                                <p className="text-[11px] text-blue-600 leading-relaxed font-medium">
                                                    Under RR 11-2018, monetization of unused SIL of up to 10 days is considered De Minimis and is tax-exempt. Excess will be taxed.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* --- COMPANY: SEPARATION & RETIREMENT CALCULATOR --- */}
                            {activeTab === 'PostEmployment' && (
                                <div className="space-y-10">

                                    {/* === SEPARATION PAY === */}
                                    <SectionTitle
                                        icon={Coins}
                                        title="Separation Pay Calculator"
                                        description="Compute statutory separation pay based on cause and years of service. Multipliers are configurable in Government Standards › Book VI."
                                        citation="Art. 298-299"
                                    />

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {/* Inputs */}
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Cause of Separation</label>
                                                <div className="space-y-2">
                                                    {([
                                                        { value: 'redundancy', label: 'Redundancy / Labor-Saving Device', desc: `${policies.separationPayRedundancy} month/year (Art. 298)` },
                                                        { value: 'retrenchment', label: 'Retrenchment / Closure (No Serious Losses)', desc: `${policies.separationPayDisease} month/year (Art. 298)` },
                                                        { value: 'disease', label: 'Disease / Illness', desc: `${policies.separationPayDisease} month/year (Art. 299)` },
                                                    ] as const).map(cause => (
                                                        <button
                                                            key={cause.value}
                                                            onClick={() => setSepCalcCause(cause.value)}
                                                            className={`flex items-center justify-between w-full p-4 rounded-xl border text-left transition-all ${sepCalcCause === cause.value ? 'bg-indigo-50 border-indigo-300 shadow-sm' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
                                                        >
                                                            <div>
                                                                <div className={`text-sm font-bold ${sepCalcCause === cause.value ? 'text-indigo-900' : 'text-slate-700'}`}>{cause.label}</div>
                                                                <div className="text-[10px] text-slate-400 font-medium mt-0.5">{cause.desc}</div>
                                                            </div>
                                                            {sepCalcCause === cause.value && <Check size={16} className="text-indigo-600 shrink-0 ml-3" />}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Monthly Basic Salary</label>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₱</span>
                                                        <input
                                                            type="number"
                                                            min={0}
                                                            className="w-full pl-7 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                                                            value={sepCalcSalary}
                                                            onChange={(e) => setSepCalcSalary(Number(e.target.value))}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Years of Service</label>
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                                                        value={sepCalcYears}
                                                        onChange={(e) => setSepCalcYears(Number(e.target.value))}
                                                    />
                                                </div>
                                            </div>
                                            <LegalNote text="A fraction of at least 6 months of service is considered one (1) whole year. Minimum separation pay is one (1) month salary." />
                                        </div>

                                        {/* Result */}
                                        <div className="flex flex-col gap-4">
                                            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl p-6 text-white relative overflow-hidden flex-1">
                                                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                                    <Coins size={100} />
                                                </div>
                                                <div className="relative z-10 space-y-4">
                                                    <div>
                                                        <div className="text-xs text-indigo-300 font-bold uppercase tracking-widest mb-1">Formula</div>
                                                        <div className="font-mono text-xs text-indigo-200 bg-white/10 px-3 py-2 rounded-lg">
                                                            max(₱{sepCalcSalary.toLocaleString()}, {sepMultiplier} × {sepCalcYears} yrs × ₱{sepCalcSalary.toLocaleString()})
                                                        </div>
                                                    </div>
                                                    <div className="border-t border-white/10 pt-4 space-y-2">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-slate-400">Rate per year</span>
                                                            <span className="font-bold text-white">₱ {sepPerYear.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-slate-400">Computed ({sepCalcYears} yrs)</span>
                                                            <span className="font-bold text-white">₱ {sepComputed.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                                        </div>
                                                        {sepComputed < sepCalcSalary && (
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-amber-400 text-xs">Minimum applied (1 month)</span>
                                                                <span className="font-bold text-amber-300">₱ {sepCalcSalary.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="border-t border-white/10 pt-4">
                                                        <div className="text-xs text-indigo-300 font-bold uppercase tracking-widest mb-1">Total Separation Pay</div>
                                                        <div className="text-3xl font-black text-white tracking-tight">
                                                            ₱ {sepPayResult.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
                                                <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" />
                                                <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
                                                    Preview only. Actual computation uses configured multipliers from Government Standards › Book VI.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full h-px bg-slate-100"></div>

                                    {/* === RETIREMENT PAY === */}
                                    <SectionTitle
                                        icon={Briefcase}
                                        title="Retirement Pay Calculator"
                                        description="Compute statutory retirement pay (RA 7641). Requires minimum 5 years of service and age ≥ 60. Multiplier and age thresholds are set in Government Standards › Book VI."
                                        citation="RA 7641 / Art. 302"
                                    />

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {/* Inputs */}
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Monthly Basic Salary</label>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₱</span>
                                                        <input
                                                            type="number"
                                                            min={0}
                                                            className="w-full pl-7 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                                                            value={retCalcSalary}
                                                            onChange={(e) => setRetCalcSalary(Number(e.target.value))}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Years of Service</label>
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                                                        value={retCalcYears}
                                                        onChange={(e) => setRetCalcYears(Number(e.target.value))}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Employee Age</label>
                                                <input
                                                    type="number"
                                                    min={0}
                                                    className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                                                    value={retCalcAge}
                                                    onChange={(e) => setRetCalcAge(Number(e.target.value))}
                                                />
                                            </div>

                                            {/* Eligibility checks */}
                                            <div className="space-y-2">
                                                <div className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-bold ${retCalcYears >= 5 ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
                                                    {retCalcYears >= 5 ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                                                    {retCalcYears >= 5 ? `${retCalcYears} years — Service requirement met (min. 5)` : `${retCalcYears} yr(s) — Below minimum service (5 years required)`}
                                                </div>
                                                <div className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-bold ${retEligible ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
                                                    {retEligible ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                                                    {retCompulsory
                                                        ? `Age ${retCalcAge} — Compulsory Retirement (≥ ${policies.retirementAgeMax})`
                                                        : retEligible
                                                            ? `Age ${retCalcAge} — Optional Retirement (≥ ${policies.retirementAgeMin})`
                                                            : `Age ${retCalcAge} — Below minimum retirement age (${policies.retirementAgeMin})`
                                                    }
                                                </div>
                                            </div>

                                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                                    <Info size={11} /> Divisor Used
                                                </div>
                                                <div className="font-mono text-xs text-slate-700 font-bold">{divisors[0]?.name || '314 Days'}</div>
                                                <div className="text-[10px] text-slate-400 mt-1">
                                                    Daily Rate = (₱{retCalcSalary.toLocaleString()} × 12) ÷ {retDivisor} = ₱{retDailyRate.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / day
                                                </div>
                                            </div>

                                            <LegalNote text="½ month salary = 15 days basic pay + 1/12 of 13th month (2.5 days) + 5 SIL days = 22.5 days. Fraction ≥ 6 months = 1 whole year (RA 7641)." />
                                        </div>

                                        {/* Result */}
                                        <div className="flex flex-col gap-4">
                                            <div className={`bg-gradient-to-br rounded-2xl p-6 text-white relative overflow-hidden flex-1 ${retEligible ? 'from-emerald-900 to-slate-900' : 'from-slate-700 to-slate-900'}`}>
                                                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                                    <Briefcase size={100} />
                                                </div>
                                                <div className="relative z-10 space-y-4">
                                                    <div>
                                                        <div className="text-xs text-emerald-300 font-bold uppercase tracking-widest mb-1">Formula</div>
                                                        <div className="font-mono text-xs text-emerald-100 bg-white/10 px-3 py-2 rounded-lg">
                                                            (₱{retCalcSalary.toLocaleString()} × 12 ÷ {retDivisor}) × {policies.retirementPayMultiplier} days × {retCalcYears} yrs
                                                        </div>
                                                    </div>
                                                    <div className="border-t border-white/10 pt-4 space-y-2">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-slate-400">Daily rate</span>
                                                            <span className="font-bold text-white">₱ {retDailyRate.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-slate-400">Pay/year ({policies.retirementPayMultiplier} days)</span>
                                                            <span className="font-bold text-white">₱ {(retDailyRate * policies.retirementPayMultiplier).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-slate-400">× {retCalcYears} years</span>
                                                            <span className="font-bold text-white">₱ {retPayResult.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                                        </div>
                                                    </div>
                                                    <div className="border-t border-white/10 pt-4">
                                                        <div className="text-xs text-emerald-300 font-bold uppercase tracking-widest mb-1">Total Retirement Pay</div>
                                                        <div className={`text-3xl font-black tracking-tight ${retEligible ? 'text-white' : 'text-slate-400'}`}>
                                                            {retEligible
                                                                ? `₱ ${retPayResult.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                                                : 'Not Eligible'
                                                            }
                                                        </div>
                                                        {!retEligible && <p className="text-xs text-slate-400 mt-1">Employee does not meet minimum service or age requirements.</p>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start gap-3">
                                                <Info size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                                                <p className="text-[10px] text-emerald-800 leading-relaxed font-medium">
                                                    Multiplier ({policies.retirementPayMultiplier} days) and age thresholds (optional: {policies.retirementAgeMin}, compulsory: {policies.retirementAgeMax}) are set in Government Standards › Book VI.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
        </>
    );
};

export default CompanyPoliciesTab;
