
import React, { useState } from 'react';
import { Divisor } from '../types';
import {
    BookOpen,
    Clock,
    DollarSign,
    Save,
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
    ArrowLeftRight,
    Check,
    ToggleLeft,
    ToggleRight,
    Building2,
    Plus,
    Trash2,
    Edit
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types & Constants ---

// COMPREHENSIVE LABOR CODE STANDARDS (Philippines)
const LEGAL_STANDARDS = {
    // Book I & II: Pre-Employment & HRD
    PROBATIONARY_DAYS: 180, // Art. 296 (formerly 281)
    APPRENTICE_WAGE_PERCENT: 75, // Art. 61 & 75

    // Book III: Conditions of Employment
    NORMAL_HOURS: 8, // Art 83
    MEAL_BREAK_MINUTES: 60, // Art 85
    NIGHT_DIFF_RATE: 10, // Art 86
    OT_REGULAR: 25, // Art 87
    OT_REST_DAY: 30, // Art 87 (Plus 30% of rest day rate)

    // Holiday Pay (Art 93-94)
    PREMIUM_SPECIAL_HOLIDAY: 30, // 30% premium
    PREMIUM_REGULAR_HOLIDAY: 100, // 100% premium (Double pay)
    PREMIUM_REST_DAY: 30, // 30% premium

    REST_DAY_FREQ: 6, // Art 91
    SIL_DAYS: 5, // Art 95
    SERVICE_CHARGE_DIST: 100, // Art 96 (RA 11360)

    // De Minimis (TRAIN Law / RR 11-2018)
    DEMINIMIS_RICE: 2000,
    DEMINIMIS_CLOTHING: 6000, // Annual
    DEMINIMIS_LAUNDRY: 300,

    // Book IV: Health, Safety & Social Welfare
    DENTAL_SERVICES_THRESHOLD: 50, // Art. 163 (Req dental if > 50 employees)

    // Book V: Labor Relations
    GRIEVANCE_SETTLEMENT_DAYS: 7, // Art. 260 (Typical CBA timeline)

    // Book VI: Post-Employment
    SEPARATION_PAY_REDUNDANCY: 1.0, // Art. 298 (1 month per year)
    SEPARATION_PAY_DISEASE: 0.5, // Art. 299 (1/2 month per year)
    RETIREMENT_AGE_MIN: 60, // Art 302
    RETIREMENT_AGE_MAX: 65, // Art 302
    RETIREMENT_PAY_MULTIPLIER: 22.5, // Art 302

    // Special Laws
    MATERNITY_DAYS: 105, // RA 11210
    PATERNITY_DAYS: 7, // RA 8187
    SOLO_PARENT_DAYS: 7, // RA 8972
    VAWC_DAYS: 10, // RA 9262
    MAGNA_CARTA_WOMEN_DAYS: 60, // RA 9710
};

interface PolicyState {
    // Book I & II
    probationaryDays: number;
    apprenticeWagePercent: number;

    // Book III
    normalHours: number;
    mealBreakMinutes: number;
    isMealBreakCompensated: boolean;
    gracePeriod: number; // Minutes
    deductGracePeriod: boolean;

    // Premiums & Holiday Pay
    nightDiffRate: number;
    otRegularRate: number;
    otRestDayRate: number;
    specialHolidayRate: number;
    regularHolidayRate: number;

    serviceChargeDistribution: number;
    thirteenthMonthBasis: 'Basic Pay' | 'Total Earnings';
    serviceIncentiveLeave: number;

    // De Minimis (Tax Exempt Ceilings)
    riceSubsidyCap: number;
    clothingAllowanceCap: number;
    laundryAllowanceCap: number;
    leaveConversionTaxExemptDays: number;

    // Book IV
    provideDental: boolean;
    provideMedical: boolean;

    // Book V
    grievanceResolutionDays: number;

    // Book VI
    separationPayRedundancy: number;
    separationPayDisease: number;
    retirementAgeMin: number;
    retirementAgeMax: number;
    retirementPayMultiplier: number;
    noticePeriodDays: number;

    // Special Laws
    maternityLeave: number;
    paternityLeave: number;
    soloParentLeave: number;
    vawcLeave: number;
    magnaCartaLeave: number;
    nonCompressedWorkWeek: boolean;
}

const INITIAL_STATE: PolicyState = {
    // Book I & II
    probationaryDays: 180,
    apprenticeWagePercent: 75,

    // Book III
    normalHours: 8,
    mealBreakMinutes: 60,
    isMealBreakCompensated: false,
    gracePeriod: 15,
    deductGracePeriod: true,

    nightDiffRate: 10,
    otRegularRate: 25,
    otRestDayRate: 30,
    specialHolidayRate: 30,
    regularHolidayRate: 100,

    serviceChargeDistribution: 100,
    thirteenthMonthBasis: 'Basic Pay',
    serviceIncentiveLeave: 5,

    riceSubsidyCap: 2000,
    clothingAllowanceCap: 6000,
    laundryAllowanceCap: 300,
    leaveConversionTaxExemptDays: 10,

    // Book IV
    provideDental: false,
    provideMedical: true,

    // Book V
    grievanceResolutionDays: 7,

    // Book VI
    separationPayRedundancy: 1.0,
    separationPayDisease: 0.5,
    retirementAgeMin: 60,
    retirementAgeMax: 65,
    retirementPayMultiplier: 22.5,
    noticePeriodDays: 30,

    // Special Laws
    maternityLeave: 105,
    paternityLeave: 7,
    soloParentLeave: 7,
    vawcLeave: 10,
    magnaCartaLeave: 60,
    nonCompressedWorkWeek: false
};

// Leave Monetization Types
interface LeaveConfig {
    id: string;
    enabled: boolean;
    maxDays: number;
    rate: number;
    basis: 'Daily Rate' | 'Monthly Rate';
}

const LEAVE_TYPES_LIST = [
    { id: 'sil', name: 'Service Incentive Leave', code: 'SIL', isStatutory: true },
    { id: 'vl', name: 'Vacation Leave', code: 'VL', isStatutory: false },
    { id: 'sl', name: 'Sick Leave', code: 'SL', isStatutory: false },
    { id: 'el', name: 'Emergency Leave', code: 'EL', isStatutory: false },
];

const INITIAL_LEAVE_CONFIGS: Record<string, LeaveConfig> = {
    'sil': { id: 'sil', enabled: true, maxDays: 5, rate: 100, basis: 'Daily Rate' },
    'vl': { id: 'vl', enabled: true, maxDays: 10, rate: 100, basis: 'Daily Rate' },
    'sl': { id: 'sl', enabled: false, maxDays: 0, rate: 100, basis: 'Daily Rate' },
    'el': { id: 'el', enabled: false, maxDays: 0, rate: 100, basis: 'Daily Rate' },
};

const PoliciesPage: React.FC = () => {
    const [primaryTab, setPrimaryTab] = useState<'Government' | 'Company'>('Government');
    const [activeTab, setActiveTab] = useState<string>('Book3');
    const [policies, setPolicies] = useState<PolicyState>(INITIAL_STATE);

    // Divisor Setup State
    const [divisors, setDivisors] = useState<Divisor[]>([
        { id: 'div-1', name: '314 Days - Regular', days: 314 },
        { id: 'div-2', name: '288 Days - Compressed', days: 288 }
    ]);
    const [isAddingDivisor, setIsAddingDivisor] = useState(false);
    const [editingDivisorId, setEditingDivisorId] = useState<string | null>(null);
    const [divisorForm, setDivisorForm] = useState<Partial<Divisor>>({ name: '', days: 0 });
    const [hasChanges, setHasChanges] = useState(false);

    // Leave Monetization State
    const [selectedLeaveId, setSelectedLeaveId] = useState<string>('sil');
    const [leaveSettings, setLeaveSettings] = useState<Record<string, LeaveConfig>>(INITIAL_LEAVE_CONFIGS);

    // --- Helpers ---
    const updatePolicy = (field: keyof PolicyState, value: any) => {
        setPolicies(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    const updateLeaveConfig = (id: string, field: keyof LeaveConfig, value: any) => {
        setLeaveSettings(prev => ({
            ...prev,
            [id]: { ...prev[id], [field]: value }
        }));
        setHasChanges(true);
    };

    const handleSaveDivisor = () => {
        if (!divisorForm.name || !divisorForm.days) return;

        if (editingDivisorId) {
            setDivisors(divisors.map(d => d.id === editingDivisorId ? { ...d, ...divisorForm } as Divisor : d));
        } else {
            const newDivisor: Divisor = {
                id: Math.random().toString(36).substr(2, 9),
                name: divisorForm.name,
                days: divisorForm.days
            };
            setDivisors([...divisors, newDivisor]);
        }

        setIsAddingDivisor(false);
        setEditingDivisorId(null);
        setDivisorForm({ name: '', days: 0 });
    };

    const handleEditDivisor = (divisor: Divisor) => {
        setDivisorForm(divisor);
        setEditingDivisorId(divisor.id);
        setIsAddingDivisor(true);
    };

    const handleDeleteDivisor = (id: string) => {
        if (confirm('Delete this divisor?')) {
            setDivisors(divisors.filter(d => d.id !== id));
        }
    };

    const currentLeaveConfig = leaveSettings[selectedLeaveId];

    const getComplianceStatus = (
        value: number,
        standard: number,
        type: 'min' | 'max' | 'exact' = 'min'
    ) => {
        if (type === 'min') {
            if (value < standard) return { status: 'risk', msg: `Below Legal Min (${standard})` };
            if (value === standard) return { status: 'compliant', msg: 'Compliant' };
            return { status: 'generous', msg: 'Above Standard' };
        }
        if (type === 'exact') {
            if (value === standard) return { status: 'compliant', msg: 'Compliant' };
            if (value < standard) return { status: 'risk', msg: `Non-Compliant (Legal: ${standard})` };
            return { status: 'generous', msg: 'Above Standard' };
        }
        if (type === 'max') {
            if (value > standard) return { status: 'risk', msg: `Exceeds Legal Max (${standard})` };
            return { status: 'compliant', msg: 'Compliant' };
        }
        return { status: 'neutral', msg: '' };
    };

    const ComplianceBadge = ({ status, msg, citation }: { status: string, msg: string, citation?: string }) => {
        if (!msg) return null;

        let color = 'bg-slate-100 text-slate-500 border-slate-200';
        let icon = <Info size={12} />;

        if (status === 'risk') {
            color = 'bg-rose-50 text-rose-600 border-rose-100';
            icon = <AlertTriangle size={12} />;
        } else if (status === 'compliant') {
            color = 'bg-emerald-50 text-emerald-600 border-emerald-100';
            icon = <CheckCircle2 size={12} />;
        } else if (status === 'generous') {
            color = 'bg-blue-50 text-blue-600 border-blue-100';
            icon = <ShieldCheck size={12} />;
        }

        return (
            <div className={`flex items-center justify-between p-2 rounded-lg border text-[10px] font-bold uppercase tracking-wide w-full mt-2 ${color}`}>
                <div className="flex items-center gap-2">
                    {icon}
                    <span>{msg}</span>
                </div>

                {citation && (
                    <div className="relative group cursor-help">
                        <Info size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />

                        {/* Tooltip */}
                        <div className="absolute bottom-full right-0 mb-2 w-max max-w-[200px] hidden group-hover:block z-10">
                            <div className="bg-slate-800 text-white text-[10px] rounded-lg py-2 px-3 shadow-xl font-medium normal-case border border-slate-700">
                                <div className="flex items-center gap-1.5 mb-0.5 opacity-70">
                                    <BookMarked size={10} />
                                    <span className="uppercase tracking-wider text-[9px] font-bold">Legal Reference</span>
                                </div>
                                <span className="font-mono text-xs">{citation}</span>
                                {/* Arrow */}
                                <div className="absolute top-full right-1.5 -mt-1 border-4 border-transparent border-t-slate-800"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const LegalNote = ({ text }: { text: string }) => (
        <div className="flex gap-2 items-start text-[10px] text-slate-400 italic mt-2">
            <Gavel size={12} className="mt-0.5 shrink-0" />
            <span>{text}</span>
        </div>
    );

    const SectionTitle = ({ icon: Icon, title, description, citation }: any) => (
        <div className="mb-6">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3 mb-1">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Icon size={20} /></div>
                    <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                </div>
                {citation && (
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200" title="Legal Basis">
                        {citation}
                    </span>
                )}
            </div>
            <p className="text-xs text-slate-500 ml-12 max-w-2xl">{description}</p>
        </div>
    );

    return (
        <div className="space-y-8 pb-20 animate-in fade-in">

            {/* Header with Compliance Score */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                        Policy Governance
                        <Scale className="text-indigo-600" size={24} />
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Configure business rules in compliance with the <span className="text-indigo-600 font-bold">Labor Code of the Philippines</span>.</p>
                </div>

                <div className="flex items-center gap-4 bg-white p-2 pr-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="h-12 w-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-200">
                        A+
                    </div>
                    <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Compliance Score</div>
                        <div className="text-sm font-bold text-slate-800">100% Compliant</div>
                    </div>
                </div>
            </div>

            {/* Primary Tab Switcher */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit">
                <button
                    onClick={() => setPrimaryTab('Government')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${primaryTab === 'Government' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <ShieldCheck size={18} /> Government Standards
                </button>
                <button
                    onClick={() => setPrimaryTab('Company')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${primaryTab === 'Company' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Building2 size={18} /> Company Policies
                </button>
            </div>

            {/* Main Interface */}
            <div className="flex flex-col lg:flex-row gap-8">

                {/* Navigation Sidebar */}
                <div className="w-full lg:w-72 flex flex-col gap-2">
                    {primaryTab === 'Government' ? (
                        [
                            { id: 'Book1_2', icon: GraduationCap, label: 'Book I-II: Recruitment' },
                            { id: 'Book3', icon: Clock, label: 'Book III: Work & Wages' },
                            { id: 'Book4_5', icon: Stethoscope, label: 'Book IV-V: Health & Relations' },
                            { id: 'Book6', icon: Briefcase, label: 'Book VI: Post-Employment' },
                            { id: 'Special', icon: Heart, label: 'Special Laws & Leaves' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-3 px-4 py-4 rounded-xl text-sm font-bold transition-all text-left ${activeTab === tab.id
                                    ? 'bg-slate-900 text-white shadow-md'
                                    : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
                                    }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))
                    ) : (
                        [
                            { id: 'Divisor', icon: Calculator, label: 'Divisor Setup' },
                            { id: 'Works', icon: Clock, label: 'Works & Wages' },
                            { id: 'Special', icon: Heart, label: 'Special Laws & Leaves' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-3 px-4 py-4 rounded-xl text-sm font-bold transition-all text-left ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
                                    }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))
                    )}

                    <div className="mt-6 bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
                        <h4 className="text-xs font-bold text-indigo-900 mb-2 flex items-center gap-2">
                            <History size={14} /> Effectivity
                        </h4>
                        <p className="text-[10px] text-indigo-700 leading-relaxed">
                            Changes made here will apply to <strong>future</strong> payroll runs generated after today.
                        </p>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm min-h-[600px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${primaryTab}-${activeTab}`}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* --- COMPANY: DIVISOR SETUP --- */}
                            {primaryTab === 'Company' && activeTab === 'Divisor' && (
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
                            {primaryTab === 'Company' && activeTab === 'Works' && (
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
                            {primaryTab === 'Company' && activeTab === 'Special' && (
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

                            {/* --- GOVERNMENT SECTIONS --- */}
                            {primaryTab === 'Government' && activeTab === 'Book3' && (
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
                            {primaryTab === 'Government' && activeTab === 'Book1_2' && (
                                <div className="space-y-8">
                                    <SectionTitle
                                        icon={GraduationCap}
                                        title="Probation & Training"
                                        description="Standards for probationary employment and apprenticeship programs."
                                        citation="Book I & II"
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-6 border border-slate-200 rounded-2xl bg-white hover:border-indigo-200 transition-colors">
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Max Probationary Period</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    className="w-20 p-2.5 border border-slate-300 rounded-lg font-bold text-slate-900 text-center bg-white"
                                                    value={policies.probationaryDays}
                                                    onChange={(e) => updatePolicy('probationaryDays', Number(e.target.value))}
                                                />
                                                <span className="text-sm font-bold text-slate-700">Days</span>
                                            </div>
                                            <ComplianceBadge {...getComplianceStatus(policies.probationaryDays, LEGAL_STANDARDS.PROBATIONARY_DAYS, 'max')} citation="Art. 296" />
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
                            {primaryTab === 'Government' && activeTab === 'Book4_5' && (
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
                            {primaryTab === 'Government' && activeTab === 'Book6' && (
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

                                            <div className="mt-6 pt-6 border-t border-slate-100">
                                                <h5 className="font-bold text-slate-800 text-sm mb-2">Retirement Calculation</h5>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        className="w-20 p-2.5 border border-slate-300 rounded-lg font-bold text-slate-900 text-center bg-white"
                                                        value={policies.retirementPayMultiplier}
                                                        step="0.5"
                                                        onChange={(e) => updatePolicy('retirementPayMultiplier', Number(e.target.value))}
                                                    />
                                                    <span className="text-sm font-bold text-slate-700">Days / Year of Service</span>
                                                </div>
                                                <ComplianceBadge {...getComplianceStatus(policies.retirementPayMultiplier, LEGAL_STANDARDS.RETIREMENT_PAY_MULTIPLIER, 'min')} citation="Art. 302" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --- SPECIAL LAWS & LEAVE MONETIZATION --- */}
                            {primaryTab === 'Government' && activeTab === 'Special' && (
                                <div className="space-y-8">
                                    <SectionTitle
                                        icon={Heart}
                                        title="Statutory Leave Benefits"
                                        description="Mandatory leave credits prescribed by Special Laws."
                                        citation="Various RAs"
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {/* SIL */}
                                        <div className="p-5 border border-slate-200 rounded-2xl bg-white hover:shadow-md transition-shadow">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Calendar size={16} className="text-slate-400" />
                                                <span className="text-sm font-bold text-slate-800">Service Incentive Leave</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input type="number" className="w-16 p-1 border-b border-slate-300 font-bold text-lg text-center outline-none focus:border-indigo-500 bg-white" value={policies.serviceIncentiveLeave} onChange={(e) => updatePolicy('serviceIncentiveLeave', Number(e.target.value))} />
                                                <span className="text-xs text-slate-500 font-bold">Days</span>
                                            </div>
                                            <ComplianceBadge {...getComplianceStatus(policies.serviceIncentiveLeave, LEGAL_STANDARDS.SIL_DAYS)} citation="Art. 95" />
                                        </div>

                                        {/* Maternity */}
                                        <div className="p-5 border border-slate-200 rounded-2xl bg-white hover:shadow-md transition-shadow">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Baby size={16} className="text-pink-400" />
                                                <span className="text-sm font-bold text-slate-800">Expanded Maternity</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input type="number" className="w-16 p-1 border-b border-slate-300 font-bold text-lg text-center outline-none focus:border-indigo-500 bg-white" value={policies.maternityLeave} onChange={(e) => updatePolicy('maternityLeave', Number(e.target.value))} />
                                                <span className="text-xs text-slate-500 font-bold">Days (Paid)</span>
                                            </div>
                                            <ComplianceBadge {...getComplianceStatus(policies.maternityLeave, LEGAL_STANDARDS.MATERNITY_DAYS)} citation="RA 11210" />
                                        </div>

                                        {/* Paternity */}
                                        <div className="p-5 border border-slate-200 rounded-2xl bg-white hover:shadow-md transition-shadow">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Baby size={16} className="text-blue-400" />
                                                <span className="text-sm font-bold text-slate-800">Paternity Leave</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input type="number" className="w-16 p-1 border-b border-slate-300 font-bold text-lg text-center outline-none focus:border-indigo-500 bg-white" value={policies.paternityLeave} onChange={(e) => updatePolicy('paternityLeave', Number(e.target.value))} />
                                                <span className="text-xs text-slate-500 font-bold">Days (Paid)</span>
                                            </div>
                                            <ComplianceBadge {...getComplianceStatus(policies.paternityLeave, LEGAL_STANDARDS.PATERNITY_DAYS)} citation="RA 8187" />
                                        </div>

                                        {/* Solo Parent */}
                                        <div className="p-5 border border-slate-200 rounded-2xl bg-white hover:shadow-md transition-shadow">
                                            <div className="flex items-center gap-2 mb-2">
                                                <User size={16} className="text-amber-400" />
                                                <span className="text-sm font-bold text-slate-800">Solo Parent Leave</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input type="number" className="w-16 p-1 border-b border-slate-300 font-bold text-lg text-center outline-none focus:border-indigo-500 bg-white" value={policies.soloParentLeave} onChange={(e) => updatePolicy('soloParentLeave', Number(e.target.value))} />
                                                <span className="text-xs text-slate-500 font-bold">Days (Paid)</span>
                                            </div>
                                            <ComplianceBadge {...getComplianceStatus(policies.soloParentLeave, LEGAL_STANDARDS.SOLO_PARENT_DAYS)} citation="RA 8972" />
                                        </div>

                                        {/* VAWC */}
                                        <div className="p-5 border border-slate-200 rounded-2xl bg-white hover:shadow-md transition-shadow">
                                            <div className="flex items-center gap-2 mb-2">
                                                <ShieldCheck size={16} className="text-purple-400" />
                                                <span className="text-sm font-bold text-slate-800">VAWC Leave</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input type="number" className="w-16 p-1 border-b border-slate-300 font-bold text-lg text-center outline-none focus:border-indigo-500 bg-white" value={policies.vawcLeave} onChange={(e) => updatePolicy('vawcLeave', Number(e.target.value))} />
                                                <span className="text-xs text-slate-500 font-bold">Days (Paid)</span>
                                            </div>
                                            <ComplianceBadge {...getComplianceStatus(policies.vawcLeave, LEGAL_STANDARDS.VAWC_DAYS)} citation="RA 9262" />
                                        </div>

                                        {/* Magna Carta Women */}
                                        <div className="p-5 border border-slate-200 rounded-2xl bg-white hover:shadow-md transition-shadow">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Heart size={16} className="text-rose-400" />
                                                <span className="text-sm font-bold text-slate-800">Magna Carta (Surgery)</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input type="number" className="w-16 p-1 border-b border-slate-300 font-bold text-lg text-center outline-none focus:border-indigo-500 bg-white" value={policies.magnaCartaLeave} onChange={(e) => updatePolicy('magnaCartaLeave', Number(e.target.value))} />
                                                <span className="text-xs text-slate-500 font-bold">Days (Paid)</span>
                                            </div>
                                            <ComplianceBadge {...getComplianceStatus(policies.magnaCartaLeave, LEGAL_STANDARDS.MAGNA_CARTA_WOMEN_DAYS)} citation="RA 9710" />
                                        </div>
                                    </div>

                                    <div className="w-full h-px bg-slate-100 my-8"></div>

                                    <SectionTitle
                                        icon={DollarSign}
                                        title="Leave Monetization Formula"
                                        description="Configuration for converting unused leave credits to cash value per leave type."
                                        citation="Art. 95 / RR 1-2015"
                                    />

                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
                                        {/* Left Panel: Leave Type List */}
                                        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col">
                                            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Select Leave Type</h4>
                                            </div>
                                            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                                                {LEAVE_TYPES_LIST.map(leave => (
                                                    <button
                                                        key={leave.id}
                                                        onClick={() => setSelectedLeaveId(leave.id)}
                                                        className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-all group ${selectedLeaveId === leave.id
                                                            ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                                                            : 'bg-white border-transparent hover:bg-slate-50'
                                                            }`}
                                                    >
                                                        <div>
                                                            <div className={`text-sm font-bold ${selectedLeaveId === leave.id ? 'text-indigo-900' : 'text-slate-700'}`}>{leave.name}</div>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{leave.code}</span>
                                                                {leave.isStatutory && <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Statutory</span>}
                                                            </div>
                                                        </div>
                                                        {leaveSettings[leave.id].enabled ? (
                                                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200"></div>
                                                        ) : (
                                                            <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Right Panel: Configuration */}
                                        <div className="lg:col-span-8 space-y-6">
                                            <div className="bg-white border border-slate-200 rounded-2xl p-6 h-full flex flex-col relative overflow-hidden">
                                                <div className="flex justify-between items-center mb-6 z-10 relative">
                                                    <div>
                                                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                                            <ArrowLeftRight size={16} className="text-indigo-600" />
                                                            Configuring: <span className="text-indigo-700 underline decoration-indigo-200 underline-offset-4">{LEAVE_TYPES_LIST.find(l => l.id === selectedLeaveId)?.name}</span>
                                                        </h4>
                                                    </div>
                                                    <label className={`flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-lg border transition-all ${currentLeaveConfig.enabled ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                                                        <span className={`text-xs font-bold ${currentLeaveConfig.enabled ? 'text-emerald-700' : 'text-slate-500'}`}>
                                                            {currentLeaveConfig.enabled ? 'Monetization Active' : 'Monetization Disabled'}
                                                        </span>
                                                        <div className="relative">
                                                            <input
                                                                type="checkbox"
                                                                className="sr-only"
                                                                checked={currentLeaveConfig.enabled}
                                                                onChange={(e) => updateLeaveConfig(selectedLeaveId, 'enabled', e.target.checked)}
                                                            />
                                                            <div className={`w-8 h-4 rounded-full shadow-inner transition-colors ${currentLeaveConfig.enabled ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                                                            <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${currentLeaveConfig.enabled ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                                        </div>
                                                    </label>
                                                </div>

                                                <div className={`space-y-6 transition-opacity duration-300 ${currentLeaveConfig.enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Computation Basis</label>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <button
                                                                onClick={() => updateLeaveConfig(selectedLeaveId, 'basis', 'Daily Rate')}
                                                                className={`py-3 rounded-xl text-xs font-bold border transition-all ${currentLeaveConfig.basis === 'Daily Rate' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                                            >
                                                                Daily Rate
                                                            </button>
                                                            <button
                                                                onClick={() => updateLeaveConfig(selectedLeaveId, 'basis', 'Monthly Rate')}
                                                                className={`py-3 rounded-xl text-xs font-bold border transition-all ${currentLeaveConfig.basis === 'Monthly Rate' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                                            >
                                                                Monthly Rate
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-6">
                                                        <div>
                                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Max Convertible Days</label>
                                                            <div className="relative">
                                                                <input
                                                                    type="number"
                                                                    className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                                                                    value={currentLeaveConfig.maxDays}
                                                                    onChange={(e) => updateLeaveConfig(selectedLeaveId, 'maxDays', Number(e.target.value))}
                                                                />
                                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Days</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Cash Value Rate</label>
                                                            <div className="relative">
                                                                <input
                                                                    type="number"
                                                                    className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                                                                    value={currentLeaveConfig.rate}
                                                                    onChange={(e) => updateLeaveConfig(selectedLeaveId, 'rate', Number(e.target.value))}
                                                                />
                                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">%</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Preview Card */}
                                                    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-xl p-6 text-white relative overflow-hidden mt-4">
                                                        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                                            <Calculator size={80} />
                                                        </div>
                                                        <div className="relative z-10 flex justify-between items-end">
                                                            <div>
                                                                <div className="text-xs text-indigo-300 font-bold mb-1">Preview Calculation</div>
                                                                <div className="text-[10px] text-indigo-200">
                                                                    Based on Daily Rate: ₱1,000
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-2xl font-bold text-white tracking-tight">
                                                                    ₱ {(1000 * (currentLeaveConfig.rate / 100) * currentLeaveConfig.maxDays).toLocaleString()}
                                                                </div>
                                                                <div className="text-[10px] text-indigo-400 mt-1">Total Conversion Value</div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-4">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex gap-2">
                                                                <Info size={14} className="text-slate-400 mt-0.5" />
                                                                <div>
                                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Tax Exemption Note</span>
                                                                    <p className="text-[10px] text-slate-500 leading-relaxed">
                                                                        Converted leave credits exceeding <strong>{policies.leaveConversionTaxExemptDays} days</strong> are subject to withholding tax unless total benefits are below the PHP 90,000 threshold.
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right shrink-0 ml-4">
                                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Legal Basis</span>
                                                                <span className="text-xs text-indigo-600 font-medium">RR 1-2015</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div >

            </div >

            {/* Sticky Footer */}
            < div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 md:pl-72 z-20 flex justify-end items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]" >
                <div className="flex gap-4">
                    <button
                        onClick={() => setPolicies(INITIAL_STATE)}
                        className="px-6 py-2.5 text-slate-500 hover:text-slate-700 font-bold text-sm transition-colors"
                    >
                        Reset to Standard
                    </button>
                    <button
                        disabled={!hasChanges}
                        className="px-8 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Save size={18} /> Save Policy
                    </button>
                </div>
            </div >
        </div >
    );
};

export default PoliciesPage;
