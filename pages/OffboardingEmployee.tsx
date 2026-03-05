
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User,
    ArrowRight,
    ArrowLeft,
    Check,
    Building2,
    Briefcase,
    CreditCard,
    UserMinus,
    FileText,
    DollarSign,
    Calendar,
    Search,
    Clock,
    ChevronLeft,
    ChevronRight,
    Zap,
    Info,
    X,
    Trash2,
    LogOut,
    ShieldOff,
    ShieldCheck,
    ClipboardCheck,
    Coins,
    Heart,
    Wallet,
    Package,
    UserCheck,
    AlertTriangle,
    Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Employee, EmployeeStatus } from '../types';

// --- Types & Interfaces ---
interface OffboardingModule {
    id: string;
    title: string;
    icon: React.ReactNode;
    description: string;
}

const MODULES: Record<string, OffboardingModule> = {
    SELECT: { id: 'SELECT', title: 'Employee Selection', icon: <User size={18} />, description: 'Search and select member' },
    DETAILS: { id: 'DETAILS', title: 'Offboarding Details', icon: <LogOut size={18} />, description: 'Reason and last day' },
    TRANSFER: { id: 'TRANSFER', title: 'Transfer Details', icon: <Zap size={18} />, description: 'New position & effective date' },
    CLEARANCE: { id: 'CLEARANCE', title: 'Department Clearance', icon: <ShieldOff size={18} />, description: 'Role-based approvals' },
    FINANCIAL_CLEARANCE: { id: 'FINANCIAL_CLEARANCE', title: 'Financial Clearance', icon: <CreditCard size={18} />, description: 'Loans, HMO & final audit' },
    FINANCIAL: { id: 'FINANCIAL', title: 'Final Settlement', icon: <Coins size={18} />, description: 'Breakdown of final payments' },
    BENEFICIARY: { id: 'BENEFICIARY', title: 'Beneficiary Info', icon: <Heart size={18} />, description: 'Payer & claimant details' },
    REVIEW: { id: 'REVIEW', title: 'Review & Confirm', icon: <ClipboardCheck size={18} />, description: 'Finalize processing' },
};

const TYPE_STEP_MAP: Record<string, string[]> = {
    'Resignation': ['SELECT', 'DETAILS', 'CLEARANCE', 'FINANCIAL_CLEARANCE', 'FINANCIAL', 'REVIEW'],
    'Transfer': ['SELECT', 'TRANSFER', 'CLEARANCE', 'FINANCIAL_CLEARANCE', 'FINANCIAL', 'REVIEW'],
    'End of Contract': ['SELECT', 'DETAILS', 'CLEARANCE', 'FINANCIAL_CLEARANCE', 'FINANCIAL', 'REVIEW'],
    'Termination': ['SELECT', 'DETAILS', 'CLEARANCE', 'FINANCIAL_CLEARANCE', 'FINANCIAL', 'REVIEW'],
    'Retrenchment/Redundancy': ['SELECT', 'DETAILS', 'CLEARANCE', 'FINANCIAL_CLEARANCE', 'FINANCIAL', 'REVIEW'],
    'Retirement': ['SELECT', 'DETAILS', 'CLEARANCE', 'FINANCIAL_CLEARANCE', 'FINANCIAL', 'REVIEW'],
    'Death': ['SELECT', 'DETAILS', 'BENEFICIARY', 'FINANCIAL_CLEARANCE', 'FINANCIAL', 'REVIEW'],
    'Default': ['SELECT', 'DETAILS', 'CLEARANCE', 'FINANCIAL_CLEARANCE', 'FINANCIAL', 'REVIEW']
};

const MOCK_EMPLOYEES: Employee[] = [
    { id: '0192823', name: 'Jane Doe', role: 'IT Developer Intern', department: 'IT Department', email: 'jane@gmail.com', status: EmployeeStatus.ACTIVE, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&auto=format&fit=crop', phone: '09123456789', jobType: 'Internship' },
    { id: '0489545', name: 'John Doe', role: 'Junior Developer', department: 'IT Department', email: 'johndoe@gmail.com', status: EmployeeStatus.ACTIVE, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&auto=format&fit=crop', phone: '09453728483', jobType: 'Full-Time' },
    { id: '0992341', name: 'Marcus Villanueva', role: 'Senior Developer', department: 'Engineering', email: 'marcus@gmail.com', status: EmployeeStatus.ACTIVE, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&auto=format&fit=crop', phone: '09123456781', jobType: 'Full-time' },
];

const OFFBOARDING_TYPES = [
    { id: 'resignation', label: 'Resignation', icon: <LogOut size={16} /> },
    { id: 'transfer', label: 'Transfer', icon: <Briefcase size={16} /> },
    { id: 'eoc', label: 'End of Contract', icon: <Calendar size={16} /> },
    { id: 'termination', label: 'Termination', icon: <ShieldOff size={16} /> },
    { id: 'redundancy', label: 'Retrenchment/Redundancy', icon: <Trash2 size={16} /> },
    { id: 'retirement', label: 'Retirement', icon: <Clock size={16} /> },
    { id: 'death', label: 'Death', icon: <X size={16} /> },
];

const OFFBOARDING_REASONS = [
    'Better Opportunity',
    'Personal Reasons',
    'Relocation',
    'Health Issues',
    'Career Change',
    'Performance Issues',
    'Violation of Policy',
    'Project Completion',
    'Strategic Downsizing',
    'Standard Retirement',
    'Legacy Reasons'
];

const OffboardingEmployee: React.FC = () => {
    const navigate = useNavigate();
    const [currentStepIdx, setCurrentStepIdx] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        offboardingType: '',
        lastDay: '',
        separationDate: '',
        reason: '',
        detailedReason: '',
        isEligibleForRehire: true,

        // Transfer Specific
        newDepartment: '',
        newPosition: '',
        transferEffectiveDate: '',
        transferLeaves: true,
        record13thMonth: true,
        transferTenure: true,

        // Beneficiary (Death)
        beneficiaryName: '',
        beneficiaryRelation: '',
        beneficiaryContact: '',

        // Clearance
        supervisorCleared: false,
        itAccessRevoked: false,
        adminPropertyReturned: false,
        hrCleared: false,

        // Financial Clearance Audit
        remainingLoanBalance: 0,
        hmoConsolidation: 'Cleared',
        insuranceStatus: 'Cancelled',
        accrued13thMonthCalc: 0,
        leaveCreditsToConvert: 0,
        isFinancialAuditComplete: false,

        // Final Pay
        lastSalary: 0,
        proRated13thMonth: 0,
        unusedLeaveConversion: 0,
        severancePay: 0,
        otherEarnings: 0,
        outstandingLoans: 0,
        taxAdjustments: 0
    });

    const activeStepKeys = selectedEmployee && formData.offboardingType
        ? (TYPE_STEP_MAP[formData.offboardingType] || TYPE_STEP_MAP['Default'])
        : ['SELECT'];

    const currentStepKey = activeStepKeys[currentStepIdx] || 'SELECT';
    const activeSteps = activeStepKeys.map(key => MODULES[key]);
    const isFirstStep = currentStepIdx === 0;
    const isLastStep = currentStepIdx === activeSteps.length - 1;

    const handleNext = () => {
        if (currentStepKey === 'SELECT') {
            if (!selectedEmployee) {
                alert("Please select an employee first.");
                return;
            }
            if (!formData.offboardingType) {
                alert("Please select the type of offboarding.");
                return;
            }
        }
        if (!isLastStep) setCurrentStepIdx(currentStepIdx + 1);
        else handleSubmit();
    };

    const handleBack = () => {
        if (!isFirstStep) setCurrentStepIdx(currentStepIdx - 1);
        else navigate('/manage/employee');
    };

    const handleSubmit = () => {
        setTimeout(() => {
            alert(`Employee ${selectedEmployee?.name} Processed Successfully!`);
            navigate('/manage/employee');
        }, 1000);
    };

    const filteredEmployees = MOCK_EMPLOYEES.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.id.includes(searchTerm)
    );

    const InputField = ({ label, value, field, type = 'text', placeholder = '', className = '', disabled = false }: any) => (
        <div className={className}>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">{label}</label>
            <div className="relative group">
                <input
                    type={type}
                    className={`w-full p-4 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 outline-none transition-all duration-300 placeholder:font-medium placeholder:text-slate-400 
                        ${disabled ? 'bg-slate-50 text-slate-400 cursor-not-allowed opacity-60' : 'bg-white hover:border-slate-300 focus:border-rose-300 focus:ring-4 focus:ring-rose-500/5'}`}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    disabled={disabled}
                />
                {!disabled && <div className="absolute inset-0 rounded-2xl border-2 border-rose-500/0 group-focus-within:border-rose-500/10 pointer-events-none transition-all duration-300" />}
            </div>
        </div>
    );

    const SelectField = ({ label, value, field, options, className = '', disabled = false }: any) => (
        <div className={className}>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">{label}</label>
            <div className="relative group">
                <select
                    className={`w-full p-4 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 outline-none transition-all duration-300 cursor-pointer appearance-none
                        ${disabled ? 'bg-slate-50 text-slate-400 cursor-not-allowed opacity-60' : 'bg-white hover:border-slate-300 focus:border-rose-300 focus:ring-4 focus:ring-rose-500/5'}`}
                    value={value}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    disabled={disabled}
                >
                    <option value="">Select {label}</option>
                    {options.map((opt: string) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronRight size={16} className="rotate-90" />
                </div>
                {!disabled && <div className="absolute inset-0 rounded-2xl border-2 border-rose-500/0 group-focus-within:border-rose-500/10 pointer-events-none transition-all duration-300" />}
            </div>
        </div>
    );

    const ToggleField = ({ label, value, field }: any) => (
        <label className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-[24px] cursor-pointer hover:bg-slate-50 hover:border-slate-200 transition-all duration-300 group shadow-sm hover:shadow-md">
            <div className="flex flex-col">
                <span className="text-sm font-black text-slate-800 tracking-tight">{label}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{value ? 'Active / Enabled' : 'Disabled'}</span>
            </div>
            <button
                type="button"
                onClick={() => setFormData({ ...formData, [field]: !value })}
                className={`relative w-14 h-8 transition-all duration-500 rounded-full p-1 ${value ? 'bg-rose-500 shadow-lg shadow-rose-200' : 'bg-slate-200'}`}
            >
                <div className={`w-6 h-6 bg-white rounded-full transition-all duration-500 shadow-sm ${value ? 'translate-x-[1.5rem]' : 'translate-x-0'}`} />
            </button>
        </label>
    );

    const StepContent = () => {
        switch (currentStepKey) {
            case 'SELECT':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700 max-w-4xl mx-auto pb-10">
                        {/* Search & Select */}
                        <div className="space-y-5">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Stage 01: Identification & Workflow</label>
                            <div className="relative group">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors" size={20} />
                                <input
                                    type="text"
                                    className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-[24px] text-sm font-bold shadow-sm focus:ring-4 focus:ring-rose-500/5 focus:border-rose-300 transition-all outline-none"
                                    placeholder="Execute search by Personnel Name or Serial ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredEmployees.map(emp => (
                                    <motion.div
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        key={emp.id}
                                        onClick={() => setSelectedEmployee(emp)}
                                        className={`p-5 rounded-[28px] border-2 cursor-pointer transition-all duration-300 flex items-center gap-5 relative overflow-hidden group 
                                            ${selectedEmployee?.id === emp.id ? 'border-rose-500 bg-rose-50/30' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                                    >
                                        <div className="relative shrink-0">
                                            <img src={emp.avatar} alt="" className="w-14 h-14 rounded-[20px] object-cover ring-4 ring-white shadow-sm" />
                                            {selectedEmployee?.id === emp.id && (
                                                <div className="absolute -top-2 -right-2 bg-rose-500 rounded-full p-1.5 shadow-lg border-2 border-white">
                                                    <Check size={10} className="text-white" strokeWidth={5} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 pr-4">
                                            <h4 className="font-black text-slate-900 text-sm tracking-tight truncate">{emp.name}</h4>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider truncate mb-1">{emp.role}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-black">ID: {emp.id}</span>
                                                <span className="text-[9px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-black uppercase">Active</span>
                                            </div>
                                        </div>
                                        <div className={`absolute right-0 top-0 h-full w-1 transition-all duration-300 ${selectedEmployee?.id === emp.id ? 'bg-rose-500' : 'bg-transparent group-hover:bg-slate-200'}`} />
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Offboarding Type Selection */}
                        <div className="space-y-5">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Stage 02: Classification</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {OFFBOARDING_TYPES.map(type => (
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        key={type.id}
                                        onClick={() => {
                                            setFormData({ ...formData, offboardingType: type.label });
                                            if (currentStepIdx > 0) setCurrentStepIdx(0);
                                        }}
                                        className={`p-6 rounded-[32px] border-2 flex flex-col items-center justify-center gap-4 text-center cursor-pointer transition-all duration-300 relative overflow-hidden
                                            ${formData.offboardingType === type.label ? 'border-rose-500 bg-rose-500 text-white shadow-xl shadow-rose-200' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                                    >
                                        <div className={`p-4 rounded-[20px] transition-all duration-300 ${formData.offboardingType === type.label ? 'bg-white/20 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
                                            {React.cloneElement(type.icon as React.ReactElement, { size: 24, strokeWidth: 2.5 })}
                                        </div>
                                        <span className={`text-[11px] font-black leading-tight uppercase tracking-widest ${formData.offboardingType === type.label ? 'text-white' : 'text-slate-600'}`}>
                                            {type.label.split('/')[0]}
                                        </span>
                                        {formData.offboardingType === type.label && (
                                            <div className="absolute top-2 right-2">
                                                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {selectedEmployee && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mt-8 p-10 bg-slate-900 rounded-[40px] text-white flex flex-col md:flex-row items-center gap-10 shadow-2xl shadow-slate-200 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
                                    <UserMinus size={120} />
                                </div>
                                <div className="relative">
                                    <img src={selectedEmployee.avatar} alt="" className="w-24 h-24 rounded-[32px] object-cover ring-8 ring-white/10" />
                                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-2 rounded-2xl border-4 border-slate-900 shadow-xl">
                                        <ShieldCheck size={20} className="text-white" />
                                    </div>
                                </div>
                                <div className="text-center md:text-left relative z-10">
                                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                                        <h3 className="text-3xl font-black tracking-tight">{selectedEmployee.name}</h3>
                                        <span className="inline-block px-3 py-1 bg-white/10 text-rose-300 text-[10px] font-black rounded-full border border-white/10 uppercase tracking-widest">
                                            {selectedEmployee.id}
                                        </span>
                                    </div>
                                    <p className="text-slate-400 font-bold text-lg mb-6">{selectedEmployee.role}</p>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[10px] text-slate-500 font-black uppercase tracking-widest">
                                        <div className="flex items-center gap-2 bg-white/5 py-2 px-4 rounded-2xl border border-white/5">
                                            <Building2 size={14} className="text-rose-400" /> {selectedEmployee.department}
                                        </div>
                                        <div className="flex items-center gap-2 bg-white/5 py-2 px-4 rounded-2xl border border-white/5">
                                            <Briefcase size={14} className="text-rose-400" /> {selectedEmployee.jobType}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                );
            case 'DETAILS':
                return (
                    <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700 max-w-2xl mx-auto py-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <InputField label="Operational Last Day" value={formData.lastDay} field="lastDay" type="date" />
                            <InputField label="Official Status Cessation" value={formData.separationDate} field="separationDate" type="date" />
                        </div>
                        <SelectField label="Administrative Protocol Root" value={formData.reason} field="reason" options={OFFBOARDING_REASONS} />
                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Case Narrative & Additional Remarks</label>
                            <textarea
                                className="w-full p-6 bg-white border border-slate-200 rounded-[32px] text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-rose-500/5 focus:border-rose-300 hover:border-slate-300 transition-all h-40 shadow-sm"
                                placeholder="Provide comprehensive context regarding this personnel separation event..."
                                value={formData.detailedReason}
                                onChange={(e) => setFormData({ ...formData, detailedReason: e.target.value })}
                            />
                        </div>
                        <ToggleField label="Post-Separation Rehire Eligibility" value={formData.isEligibleForRehire} field="isEligibleForRehire" />
                    </div>
                );
            case 'TRANSFER':
                return (
                    <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700 max-w-2xl mx-auto py-6">
                        <div className="p-6 bg-slate-900 rounded-[32px] flex items-center gap-5 text-white shadow-xl shadow-slate-200">
                            <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20">
                                <Zap size={24} className="text-white" />
                            </div>
                            <div>
                                <h4 className="font-black text-sm uppercase tracking-tight">Internal Transition Audit</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Protocol-104: Lateral Movement Adjustment</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <InputField label="Destination Department" value={formData.newDepartment} field="newDepartment" placeholder="e.g. Strategic Growth" />
                            <InputField label="Succession Title" value={formData.newPosition} field="newPosition" placeholder="e.g. Lead Technologist" />
                            <InputField label="Transition Effective Date" value={formData.transferEffectiveDate} field="transferEffectiveDate" type="date" className="md:col-span-2" />
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Benefit Inheritance Parameters</label>
                            <ToggleField label="Migrate PTO/Leave Balance" value={formData.transferLeaves} field="transferLeaves" />
                            <ToggleField label="Preserve 13th Month Accrual" value={formData.record13thMonth} field="record13thMonth" />
                            <ToggleField label="Synthesize Service Seniority" value={formData.transferTenure} field="transferTenure" />
                        </div>
                    </div>
                );
            case 'BENEFICIARY':
                return (
                    <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700 max-w-2xl mx-auto py-6">
                        <div className="p-6 bg-slate-900 rounded-[32px] flex items-center gap-5 text-white shadow-xl shadow-slate-200">
                            <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20">
                                <Heart size={24} className="text-white" />
                            </div>
                            <div>
                                <h4 className="font-black text-sm uppercase tracking-tight">Estate & Legal Beneficiary Audit</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Protocol-902: Settlement Disbursement Agent</p>
                            </div>
                        </div>
                        <InputField label="Designated Primary Recipient" value={formData.beneficiaryName} field="beneficiaryName" placeholder="Legal Name of Claimant" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <InputField label="Kinship/Legal Relation" value={formData.beneficiaryRelation} field="beneficiaryRelation" placeholder="e.g. Spouse / Next of Kin" />
                            <InputField label="Authorization Contact" value={formData.beneficiaryContact} field="beneficiaryContact" placeholder="+63 900 000 0000" />
                        </div>
                    </div>
                );
            case 'CLEARANCE':
                return (
                    <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700 max-w-2xl mx-auto py-6">
                        <div className="p-6 bg-slate-900 rounded-[32px] flex items-center gap-5 text-white shadow-xl shadow-slate-200">
                            <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20">
                                <ShieldOff size={24} className="text-white" />
                            </div>
                            <div>
                                <h4 className="font-black text-sm uppercase tracking-tight">Operational Divestment Checklist</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Protocol-401: Asset & Access Recovery Audit</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <ToggleField label="Line Manager Approval Protocol" value={formData.supervisorCleared} field="supervisorCleared" />
                            <ToggleField label="Physical Asset Recovery Confirmed" value={formData.adminPropertyReturned} field="adminPropertyReturned" />
                            <ToggleField label="Directory & IAM Access Revocation" value={formData.itAccessRevoked} field="itAccessRevoked" />
                            <ToggleField label="HR Registry Audit Completion" value={formData.hrCleared} field="hrCleared" />
                        </div>
                    </div>
                );
            case 'FINANCIAL_CLEARANCE':
                return (
                    <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700 max-w-2xl mx-auto py-6">
                        <div className="p-6 bg-slate-900 rounded-[32px] flex items-center gap-5 text-white shadow-xl shadow-slate-200">
                            <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20">
                                <CreditCard size={24} className="text-white" />
                            </div>
                            <div>
                                <h4 className="font-black text-sm uppercase tracking-tight">Financial Liability Audit</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Protocol-505: Treasury & Benefits Reconciliation</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <InputField label="Secured Loan Balance Recovery" value={formData.remainingLoanBalance} field="remainingLoanBalance" type="number" />
                            <SelectField label="Medical Benefits (HMO) Status" value={formData.hmoConsolidation} field="hmoConsolidation" options={['Cleared', 'Card Returned', 'Lost - For Deduction', 'N/A']} />
                            <SelectField label="Policy / Insurance Termination" value={formData.insuranceStatus} field="insuranceStatus" options={['Cancelled', 'Converted to Individual', 'Policy Transferred', 'N/A']} />
                            <InputField label="Accrued Unused Leave Allotment" value={formData.leaveCreditsToConvert} field="leaveCreditsToConvert" type="number" />
                        </div>

                        <div className="mt-4 p-10 bg-white border border-slate-100 rounded-[40px] shadow-lg shadow-slate-100/50 flex flex-col items-center text-center space-y-6">
                            <div className={`p-5 rounded-[32px] transition-all duration-500 ${formData.isFinancialAuditComplete ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-200' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                                <ShieldCheck size={48} strokeWidth={2.5} />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-xl font-black text-slate-900 tracking-tight">Final Financial Integrity Verification</h4>
                                <p className="text-xs text-slate-500 font-medium max-w-[280px]">Ensure all external liabilities, HMO cards, and insurance policies are reconciled before issuing the last pay statement.</p>
                            </div>
                            <div className="w-full pt-4">
                                <ToggleField label="Financial Audit Integrity Check" value={formData.isFinancialAuditComplete} field="isFinancialAuditComplete" />
                            </div>
                        </div>
                    </div>
                );
            case 'FINANCIAL':
                const isRetrenchment = formData.offboardingType === 'Retrenchment/Redundancy';
                const isRetirement = formData.offboardingType === 'Retirement';

                // Core Data - Wire to formData for dynamic updates
                const basicSalary1 = Number(formData.lastSalary) / 2 || 260.00;
                const basicSalary2 = Number(formData.lastSalary) / 2 || 260.00;
                const lastPayrollTotal = basicSalary1 + basicSalary2;

                const totalBasicFor13th = 3640.00;
                const thirteenthMonthTotal = Number(formData.proRated13thMonth) || 390.00;

                const serviceCharge = Number(formData.otherEarnings) || 419.45;
                const otherIncomeTotal = serviceCharge;

                const taxRefundGross = 4680.00;
                const govDeductionsTotal = 512.00;

                const sssContri = 250.00;
                const philHealthContri = 312.00;
                const pagIbigContri = 200.00;
                const totalFinalDeductions = sssContri + philHealthContri + pagIbigContri + Number(formData.outstandingLoans) + Number(formData.remainingLoanBalance);

                const grossSettlement = lastPayrollTotal + thirteenthMonthTotal + otherIncomeTotal;
                const netPay = grossSettlement - totalFinalDeductions;

                return (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-700 max-w-4xl mx-auto pb-20">
                        <div className="bg-white p-12 shadow-[0_40px_100px_rgba(0,0,0,0.08)] border border-slate-200 min-h-[1050px] font-mono text-[11px] text-slate-800 leading-relaxed relative overflow-hidden ring-1 ring-slate-100">

                            {/* Security Stamp overlay */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 pointer-events-none opacity-[0.03] select-none">
                                <div className="border-[15px] border-slate-900 px-16 py-8 rounded-[60px] flex flex-col items-center">
                                    <span className="text-[12rem] font-black tracking-tighter leading-none">OFFICIALLY</span>
                                    <span className="text-[12rem] font-black tracking-tighter leading-none">PROCESSED</span>
                                </div>
                            </div>

                            {/* Paper Texture/Header Decoration */}
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-900 opacity-90"></div>

                            {/* Simple Header */}
                            <div className="text-center mb-12">
                                <h1 className="text-3xl font-black tracking-tight text-slate-900">Last Pay of <span className="text-rose-600">{selectedEmployee?.name}</span></h1>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-2">Official Settlement Summary</p>
                            </div>

                            {/* LAST PAYROLL SECTION */}
                            <div className="grid grid-cols-12 mb-10">
                                <div className="col-span-3 font-bold uppercase tracking-widest text-[9px]">A. LAST PAYROLL</div>
                                <div className="col-span-9 space-y-8">
                                    {/* Period 1 */}
                                    <div className="grid grid-cols-9">
                                        <div className="col-span-6">
                                            <div className="font-bold underline mb-1">(Period 1: 01 - 15)</div>
                                            <div className="flex justify-between pr-8"><span>Basic Salary</span> <span>{basicSalary1.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                                            <div className="flex justify-between pr-8 text-slate-400"><span>Absences</span> <span>(0.00)</span></div>
                                            <div className="flex justify-between pr-8 text-slate-400"><span>Lates / Undertime</span> <span>(0.00)</span></div>
                                        </div>
                                        <div className="col-span-3 text-right flex flex-col justify-end">
                                            <div className="font-bold border-t border-slate-200 pt-1">{basicSalary1.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                                        </div>
                                    </div>

                                    {/* Period 2 */}
                                    <div className="grid grid-cols-9">
                                        <div className="col-span-6">
                                            <div className="font-bold underline mb-1">(Period 2: 16 - 28)</div>
                                            <div className="flex justify-between pr-8"><span>Basic Salary</span> <span>{basicSalary2.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                                            <div className="flex justify-between pr-8"><span>Incentives / Adhoc</span> <span>0.00</span></div>
                                        </div>
                                        <div className="col-span-3 text-right flex flex-col justify-end">
                                            <div className="font-bold border-t border-slate-200 pt-1">{basicSalary2.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>

                                            <div className="grid grid-cols-2 mt-4 font-black h-6 border-t-2 border-slate-900 pt-1">
                                                <div className="text-right">{lastPayrollTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                                                <div className="text-right">{lastPayrollTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 13TH MONTH SECTION */}
                            <div className="grid grid-cols-12 mb-10">
                                <div className="col-span-3 font-bold uppercase tracking-widest text-[9px]">B. 13TH MONTH</div>
                                <div className="col-span-9">
                                    <div className="grid grid-cols-9">
                                        <div className="col-span-6 space-y-1">
                                            <div className="flex justify-between pr-8"><span>Accrued Basis</span> <span>{totalBasicFor13th.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                                            <div className="flex justify-between pr-8"><span>Annual Factor</span> <span>/ 12.00</span></div>
                                        </div>
                                        <div className="col-span-3 text-right flex flex-col justify-end">
                                            <div className="font-black h-6 flex justify-between items-center mt-1 border-t-2 border-slate-900 pt-1">
                                                <span></span>
                                                <div className="grid grid-cols-2 w-full">
                                                    <div className="text-right">{thirteenthMonthTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                                                    <div className="text-right">{thirteenthMonthTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* OTHER INCOME SECTION */}
                            <div className="grid grid-cols-12 mb-10">
                                <div className="col-span-3 font-bold uppercase tracking-widest text-[9px]">C. ADJUSTMENTS</div>
                                <div className="col-span-9">
                                    <div className="grid grid-cols-9">
                                        <div className="col-span-6">
                                            <div className="flex justify-between pr-8"><span>Service Charge Allotment</span> <span>{serviceCharge.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                                            <div className="flex justify-between pr-8"><span>Leave Encashment</span> <span>0.00</span></div>
                                        </div>
                                        <div className="col-span-3 text-right flex flex-col justify-end">
                                            <div className="font-black h-6 flex justify-between items-center mt-1 border-t-2 border-slate-900 pt-1">
                                                <span></span>
                                                <div className="grid grid-cols-2 w-full">
                                                    <div className="text-right">{otherIncomeTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                                                    <div className="text-right">{otherIncomeTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* GROSS / NET PAY SECTION */}
                            <div className="space-y-4 pt-10 border-t-4 border-slate-900">
                                <div className="grid grid-cols-12">
                                    <div className="col-span-3 font-bold text-xs uppercase">TOTAL GROSS</div>
                                    <div className="col-span-9 text-right font-black text-sm border-b-2 border-slate-900 pb-1">
                                        PHP {grossSettlement.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </div>
                                </div>

                                <div className="grid grid-cols-12 mt-6">
                                    <div className="col-span-3 font-bold text-rose-600 uppercase tracking-widest text-[9px]">D. LESS DEDUCTIONS</div>
                                    <div className="col-span-9 grid grid-cols-9">
                                        <div className="col-span-6 space-y-1">
                                            <div className="flex justify-between pr-8"><span>SSS / PhilHealth / Pag-IBIG</span> <span>{govDeductionsTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                                            <div className="flex justify-between pr-8"><span>Outstanding Loans / Dues</span> <span>{(Number(formData.outstandingLoans) + Number(formData.remainingLoanBalance)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                                        </div>
                                        <div className="col-span-3 text-right space-y-1 flex flex-col justify-end">
                                            <div className="font-bold border-t border-slate-200 pt-1 text-rose-600 tracking-tighter">
                                                ({totalFinalDeductions.toLocaleString(undefined, { minimumFractionDigits: 2 })})
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-12 pt-12">
                                    <div className="col-span-3 flex flex-col">
                                        <span className="font-black text-lg tracking-tighter uppercase">NET PAY</span>
                                        <span className="text-[8px] text-slate-400 font-bold uppercase italic">Final Settlement Amount</span>
                                    </div>
                                    <div className="col-span-9 text-right">
                                        <div className="inline-block bg-slate-900 text-white px-16 py-3 font-black text-2xl tracking-tighter shadow-2xl">
                                            {netPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Official Signature Lines */}
                            <div className="mt-24 grid grid-cols-3 gap-12 grayscale">
                                <div className="space-y-4">
                                    <div className="border-b border-slate-900 h-8 flex items-end justify-center font-bold text-[10px]">
                                        AUDIT_ADMIN_BOT
                                    </div>
                                    <div className="text-[8px] font-black uppercase text-center tracking-widest text-slate-400">Prepared By</div>
                                </div>
                                <div className="space-y-4">
                                    <div className="border-b border-slate-900 h-8"></div>
                                    <div className="text-[8px] font-black uppercase text-center tracking-widest text-slate-400">Checked / Verified By</div>
                                </div>
                                <div className="space-y-4">
                                    <div className="border-b border-slate-900 h-8"></div>
                                    <div className="text-[8px] font-black uppercase text-center tracking-widest text-slate-400">Noted / Received By</div>
                                </div>
                            </div>

                            {/* Verification Footer */}
                            <div className="mt-20 pt-8 border-t border-slate-100 flex justify-between items-center opacity-30 grayscale">
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full border border-slate-900 flex items-center justify-center font-bold">QR</div>
                                    <div className="text-[7px] max-w-[200px] leading-[1.2]">
                                        Document digitally signed and authenticated. Valid only with official corporate seal for redundancy claims.
                                    </div>
                                </div>
                                <div className="text-[7px] font-bold">PAGE 01 / 01</div>
                            </div>
                        </div>

                        {/* Wizard Context Notification */}
                        <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-4">
                            <div className="p-2 bg-emerald-500 rounded-lg text-white">
                                <ShieldCheck size={18} />
                            </div>
                            <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">
                                The statement above is dynamically linked to your current offboarding workflow.
                            </p>
                        </div>
                    </div>
                );
            case 'REVIEW':
                const reviewLastPayT = Number(formData.lastSalary) + Number(formData.proRated13thMonth) + Number(formData.unusedLeaveConversion) + Number(formData.otherEarnings) - Number(formData.outstandingLoans) - Number(formData.remainingLoanBalance) - 762;
                const reviewGrandT = reviewLastPayT + Number(formData.severancePay);
                const isSpecialFinal = formData.offboardingType === 'Retrenchment/Redundancy' || formData.offboardingType === 'Retirement';

                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700 max-w-4xl mx-auto pb-20">
                        {/* Final Payout Hero Section */}
                        <div className="bg-slate-900 rounded-[32px] p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>

                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-[24px] flex items-center justify-center border border-white/20">
                                        <Wallet size={32} className="text-rose-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black tracking-tight text-white mb-1">Final Settlement Payout</h3>
                                        <p className="text-sm text-slate-400 font-medium">Verified Net Amount for Disbursement</p>
                                    </div>
                                </div>
                                <div className="text-left md:text-right">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-rose-400 mb-1">Grand Total (PHP)</div>
                                    <div className="text-5xl font-black tracking-tighter text-white">
                                        {reviewGrandT.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Summary Details Grid */}
                        <div className="bg-white border border-slate-200 rounded-[32px] p-10 space-y-12 shadow-sm">
                            {/* Employee Identity */}
                            <div className="flex items-center gap-8 pb-8 border-b border-slate-100">
                                <div className="relative">
                                    <img src={selectedEmployee?.avatar} alt="" className="w-20 h-20 rounded-[24px] object-cover ring-4 ring-slate-50" />
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full"></div>
                                </div>
                                <div>
                                    <h4 className="text-2xl font-black text-slate-900 tracking-tight">{selectedEmployee?.name}</h4>
                                    <p className="text-slate-500 font-bold text-sm">{selectedEmployee?.role}</p>
                                    <div className="mt-2 flex gap-3">
                                        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-slate-200">
                                            ID: {selectedEmployee?.id}
                                        </span>
                                        <span className="px-3 py-1 bg-rose-50 text-rose-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-rose-100">
                                            {formData.offboardingType}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                {/* Audits & Checks */}
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-4 bg-rose-500 rounded-full"></div>
                                            <h5 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Departmental Clearances</h5>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3">
                                            {[
                                                { label: 'Asset Recovery', val: formData.adminPropertyReturned, icon: Package },
                                                { label: 'Digital Access', val: formData.itAccessRevoked, icon: ShieldOff },
                                                { label: 'Supervisor Audit', val: formData.supervisorCleared, icon: UserCheck }
                                            ].map(item => (
                                                <div key={item.label} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group transition-all">
                                                    <div className="flex items-center gap-3">
                                                        <item.icon size={16} className="text-slate-400" />
                                                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">{item.label}</span>
                                                    </div>
                                                    {item.val ?
                                                        <div className="bg-emerald-500/10 p-1.5 rounded-lg"><Check size={14} className="text-emerald-500" strokeWidth={4} /></div> :
                                                        <div className="bg-rose-500/10 p-1.5 rounded-lg"><X size={14} className="text-rose-500" strokeWidth={4} /></div>
                                                    }
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
                                            <h5 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Financial Verification</h5>
                                        </div>
                                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-slate-500 font-medium">Outstanding Balances</span>
                                                <span className="font-black text-rose-600">₱{Number(formData.remainingLoanBalance).toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-slate-500 font-medium">Leave Conversion Status</span>
                                                <span className="font-black text-slate-800 uppercase tracking-tighter">{formData.leaveCreditsToConvert} CALENDAR DAYS</span>
                                            </div>
                                            <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Audit Integrity</span>
                                                {formData.isFinancialAuditComplete ?
                                                    <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 uppercase tracking-widest"><ShieldCheck size={14} /> CERTIFIED</span> :
                                                    <span className="flex items-center gap-1.5 text-[10px] font-black text-rose-600 uppercase tracking-widest"><AlertTriangle size={14} /> PENDING</span>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Separation Overview */}
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-4 bg-slate-900 rounded-full"></div>
                                            <h5 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Exit Information</h5>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-2 gap-8">
                                                <div className="group">
                                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1.5 group-hover:text-rose-500 transition-colors">Separation Date</p>
                                                    <p className="text-sm text-slate-900 font-black tracking-tight">{formData.separationDate || formData.lastDay || '-'}</p>
                                                </div>
                                                <div className="group">
                                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1.5 group-hover:text-rose-500 transition-colors">Rehire Policy</p>
                                                    <p className="text-sm text-slate-900 font-black tracking-tight">{formData.isEligibleForRehire ? 'ELIGIBLE' : 'NON-ELIGIBLE'}</p>
                                                </div>
                                            </div>

                                            <div className="p-6 bg-slate-50 rounded-3xl border border-dotted border-slate-300">
                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Administrative Reason</p>
                                                <p className="text-xs font-bold text-slate-800 leading-relaxed mb-1">{formData.reason || 'N/A'}</p>
                                                {formData.detailedReason && (
                                                    <p className="text-[10px] text-slate-500 italic line-clamp-3">"{formData.detailedReason}"</p>
                                                )}
                                            </div>

                                            {formData.beneficiaryName && (
                                                <div className="p-6 bg-rose-50 rounded-3xl border border-rose-100 space-y-4 relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 p-4 opacity-10"><Heart size={48} className="text-rose-500" /></div>
                                                    <h6 className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Beneficiary Designation</h6>
                                                    <div className="space-y-3 relative z-10">
                                                        <div>
                                                            <p className="text-[9px] text-rose-400 font-black uppercase">Primary Recipient</p>
                                                            <p className="text-xs font-black text-rose-900 uppercase tracking-tight">{formData.beneficiaryName}</p>
                                                        </div>
                                                        <div className="flex gap-12">
                                                            <div>
                                                                <p className="text-[9px] text-rose-400 font-black uppercase">Relationship</p>
                                                                <p className="text-[10px] font-bold text-rose-800">{formData.beneficiaryRelation}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[9px] text-rose-400 font-black uppercase">Contact</p>
                                                                <p className="text-[10px] font-bold text-rose-800">{formData.beneficiaryContact}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Special Notification for Supplemental Pay */}
                        {isSpecialFinal && (
                            <div className="bg-gradient-to-r from-rose-500 to-rose-600 rounded-3xl p-6 text-white shadow-xl shadow-rose-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                                        <Star size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-sm uppercase tracking-tight">Supplemental Compensation Applied</h4>
                                        <p className="text-[10px] text-rose-100 font-medium opacity-80 uppercase tracking-widest">
                                            {formData.offboardingType === 'Retrenchment/Redundancy' ? 'Redundancy Separation Pay Calculated' : 'Early Retirement Benefit Package Included'}
                                        </p>
                                    </div>
                                </div>
                                <div className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 font-black text-xs">
                                    PHP {Number(formData.severancePay).toLocaleString()}
                                </div>
                            </div>
                        )}
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="min-h-full bg-slate-50 flex items-center justify-center p-0 md:p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col md:flex-row h-[85vh] border border-slate-100"
            >
                {/* Stepper */}
                <div className="w-full md:w-80 bg-slate-900 p-8 text-white flex flex-col justify-between relative overflow-hidden shrink-0">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20 pointer-events-none"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="p-2 bg-rose-600 rounded-lg shadow-lg shadow-rose-900/50">
                                <UserMinus size={24} className="text-white" />
                            </div>
                            <div>
                                <h1 className="font-bold text-lg leading-none">Employee Separation</h1>
                                <span className="text-[10px] text-rose-300 font-medium uppercase tracking-widest">
                                    {formData.offboardingType ? `${formData.offboardingType} Workflow` : 'Offboarding Wizard'}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {activeSteps.map((step, idx) => (
                                <div key={step.id} className="relative group">
                                    {idx !== activeSteps.length - 1 && (
                                        <div className={`absolute left-4 top-8 w-0.5 h-10 ${idx < currentStepIdx ? 'bg-rose-500' : 'bg-slate-700'}`}></div>
                                    )}
                                    <div className="flex items-start gap-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 transition-all duration-500
                                        ${idx < currentStepIdx ? 'bg-rose-500 border-rose-500 text-white' :
                                                idx === currentStepIdx ? 'bg-slate-100 border-white text-slate-900 shadow-lg shadow-white/10' :
                                                    'bg-slate-800 border-slate-700 text-slate-500'}`}>
                                            {idx < currentStepIdx ? <Check size={14} strokeWidth={3} /> : idx + 1}
                                        </div>
                                        <div className={`transition-opacity duration-300 ${idx === currentStepIdx ? 'opacity-100' : 'opacity-60'}`}>
                                            <h4 className="text-sm font-bold">{step.title}</h4>
                                            <p className="text-[10px] text-slate-400">{step.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col h-full bg-white relative">
                    <div className="px-12 py-10 border-b border-slate-100 flex justify-between items-center bg-white">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] bg-slate-100 text-slate-500 font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
                                    Step 0{currentStepIdx + 1} of 0{activeSteps.length}
                                </span>
                                <div className="h-px w-8 bg-slate-200"></div>
                                <span className="text-[10px] text-rose-500 font-black uppercase tracking-[0.2em]">{formData.offboardingType || 'UNSPECIFIED'}</span>
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{activeSteps[currentStepIdx]?.title}</h2>
                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{activeSteps[currentStepIdx]?.description}</p>
                        </div>
                        <div className="w-14 h-14 bg-slate-50 rounded-[20px] border border-slate-100 flex items-center justify-center text-slate-700 shadow-sm">
                            {activeSteps[currentStepIdx]?.icon}
                        </div>
                    </div>

                    <div className="flex-1 px-12 py-10 overflow-y-auto bg-slate-50/10">
                        <StepContent />
                    </div>

                    <div className="px-12 py-8 border-t border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky bottom-0 z-20">
                        <button
                            onClick={handleBack}
                            className={`flex items-center gap-3 px-8 py-4 rounded-[20px] font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300
                                ${isFirstStep ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200' : 'text-slate-500 hover:bg-slate-100 border border-slate-200'}`}
                        >
                            <ArrowLeft size={14} strokeWidth={3} /> {isFirstStep ? 'Exit Wizard' : 'Go Back'}
                        </button>

                        <div className="flex items-center gap-4">
                            {!isLastStep && <span className="text-[9px] text-slate-300 font-bold uppercase tracking-widest hidden md:block">Requires Verification</span>}
                            <button
                                onClick={handleNext}
                                className="flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-[20px] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-800 transition-all duration-300 shadow-2xl shadow-slate-200 active:scale-95 group border-b-4 border-slate-950"
                            >
                                {isLastStep ? 'Finalize & Sign' : 'Proceed to Next'}
                                <ArrowRight size={14} strokeWidth={3} className="transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default OffboardingEmployee;
