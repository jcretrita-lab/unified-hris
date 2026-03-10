
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
    ClipboardCheck,
    Coins,
    Heart
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
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{label}</label>
            <input
                type={type}
                className={`w-full p-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none transition-all placeholder:font-medium placeholder:text-slate-400 ${disabled ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-slate-50 focus:ring-2 focus:ring-rose-100 focus:bg-white'}`}
                placeholder={placeholder}
                value={value}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                disabled={disabled}
            />
        </div>
    );

    const SelectField = ({ label, value, field, options, className = '', disabled = false }: any) => (
        <div className={className}>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{label}</label>
            <select
                className={`w-full p-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none transition-all cursor-pointer ${disabled ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-slate-50 focus:ring-2 focus:ring-rose-100 focus:bg-white'}`}
                value={value}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                disabled={disabled}
            >
                <option value="">Select {label}</option>
                {options.map((opt: string) => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        </div>
    );

    const ToggleField = ({ label, value, field }: any) => (
        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-sm font-bold text-slate-700">{label}</span>
            <button
                onClick={() => setFormData({ ...formData, [field]: !value })}
                className={`relative w-11 h-6 transition-colors rounded-full ${value ? 'bg-rose-500' : 'bg-slate-300'}`}
            >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
        </div>
    );

    const StepContent = () => {
        switch (currentStepKey) {
            case 'SELECT':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                        {/* Search & Select */}
                        <div className="space-y-4">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">1. Select Employee</label>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-rose-100 transition-all outline-none"
                                    placeholder="Search employee by name or ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredEmployees.map(emp => (
                                    <div
                                        key={emp.id}
                                        onClick={() => setSelectedEmployee(emp)}
                                        className={`p-4 rounded-2xl border flex items-center gap-4 cursor-pointer transition-all ${selectedEmployee?.id === emp.id ? 'border-rose-500 bg-rose-50 shadow-md ring-1 ring-rose-500' : 'border-slate-100 bg-white hover:border-rose-200'}`}
                                    >
                                        <div className="relative">
                                            <img src={emp.avatar} alt="" className="w-12 h-12 rounded-xl object-cover" />
                                            {selectedEmployee?.id === emp.id && (
                                                <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                                    <Check size={12} className="text-rose-500" strokeWidth={4} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-slate-900 truncate">{emp.name}</h4>
                                            <p className="text-xs text-slate-500 truncate">{emp.role} • {emp.id}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Offboarding Type Selection */}
                        <div className="space-y-4">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">2. Type of Separation</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {OFFBOARDING_TYPES.map(type => (
                                    <div
                                        key={type.id}
                                        onClick={() => {
                                            setFormData({ ...formData, offboardingType: type.label });
                                            // Reset progress when type changes
                                            if (currentStepIdx > 0) setCurrentStepIdx(0);
                                        }}
                                        className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-3 text-center cursor-pointer transition-all ${formData.offboardingType === type.label ? 'border-rose-500 bg-rose-50 shadow-md ring-1 ring-rose-500 scale-[1.02]' : 'border-slate-100 bg-white hover:border-rose-200'}`}
                                    >
                                        <div className={`p-3 rounded-xl transition-colors ${formData.offboardingType === type.label ? 'bg-rose-500 text-white' : 'bg-slate-50 text-slate-400'}`}>
                                            {type.icon}
                                        </div>
                                        <span className={`text-[10px] font-bold leading-tight ${formData.offboardingType === type.label ? 'text-rose-900' : 'text-slate-600'}`}>{type.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {selectedEmployee && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-6 bg-slate-900 rounded-2xl text-white flex items-center gap-6 shadow-xl shadow-rose-900/10"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-2xl font-black shadow-lg shadow-rose-900/40">
                                    {selectedEmployee.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">{selectedEmployee.name}</h3>
                                    <p className="text-rose-300 font-medium text-sm">{selectedEmployee.role}</p>
                                    <div className="flex items-center gap-4 mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                        <span className="flex items-center gap-1"><Building2 size={12} /> {selectedEmployee.department}</span>
                                        <span className="flex items-center gap-1 border-l border-slate-700 pl-4"><Briefcase size={12} /> {selectedEmployee.jobType}</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                );
            case 'DETAILS':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="Last Working Day" value={formData.lastDay} field="lastDay" type="date" />
                            <InputField label="Official Separation Date" value={formData.separationDate} field="separationDate" type="date" />
                        </div>
                        <SelectField label="Primary Reason for Leaving" value={formData.reason} field="reason" options={OFFBOARDING_REASONS} />
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Detailed Reason/Comments</label>
                            <textarea
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-rose-100 focus:bg-white transition-all h-32"
                                placeholder="Describe the reason for offboarding..."
                                value={formData.detailedReason}
                                onChange={(e) => setFormData({ ...formData, detailedReason: e.target.value })}
                            />
                        </div>
                        <ToggleField label="Eligible for Rehire" value={formData.isEligibleForRehire} field="isEligibleForRehire" />
                    </div>
                );
            case 'TRANSFER':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center gap-3 text-indigo-700 mb-2">
                            <Zap size={18} />
                            <span className="text-xs font-bold">Promotion / Lateral Transfer Configuration</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="Target Department" value={formData.newDepartment} field="newDepartment" placeholder="e.g. Engineering" />
                            <InputField label="New Position/Title" value={formData.newPosition} field="newPosition" placeholder="e.g. Senior Lead" />
                            <InputField label="Effective Date of Transfer" value={formData.transferEffectiveDate} field="transferEffectiveDate" type="date" className="md:col-span-2" />
                        </div>

                        <div className="space-y-4">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Benefit Handling</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <ToggleField label="Transfer Leave Balances" value={formData.transferLeaves} field="transferLeaves" />
                                <ToggleField label="Record Accrued 13th Month" value={formData.record13thMonth} field="record13thMonth" />
                                <ToggleField label="Carry Over Years of Service" value={formData.transferTenure} field="transferTenure" />
                            </div>
                        </div>

                        <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl">
                            <div className="flex items-start gap-3">
                                <Info size={16} className="text-blue-600 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-blue-900">Internal Movement Policy</p>
                                    <p className="text-[10px] text-blue-700 leading-relaxed">
                                        Carrying over benefits ensures the employee's seniority and accrued credits remain intact in the new department.
                                        If unselected, the system will treat this as a payout event in the next step.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'BENEFICIARY':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 text-emerald-700 mb-2">
                            <Heart size={18} />
                            <span className="text-xs font-bold">Beneficiary & Estate Information</span>
                        </div>
                        <InputField label="Primary Beneficiary Full Name" value={formData.beneficiaryName} field="beneficiaryName" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="Relationship" value={formData.beneficiaryRelation} field="beneficiaryRelation" placeholder="e.g. Spouse, Child" />
                            <InputField label="Contact Number" value={formData.beneficiaryContact} field="beneficiaryContact" />
                        </div>
                    </div>
                );
            case 'CLEARANCE':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl flex items-center gap-3 text-orange-700 mb-2">
                            <ShieldOff size={18} />
                            <span className="text-xs font-bold">Departmental & Role-Based Approvals</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ToggleField label="Immediate Supervisor Clearance" value={formData.supervisorCleared} field="supervisorCleared" />
                            <ToggleField label="Asset / Company Property (Admin)" value={formData.adminPropertyReturned} field="adminPropertyReturned" />
                            <ToggleField label="IT Access & Credentials Revoked" value={formData.itAccessRevoked} field="itAccessRevoked" />
                            <ToggleField label="HR Final Records Clearance" value={formData.hrCleared} field="hrCleared" />
                        </div>
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                                Note: This step ensures that all physical and digital handovers are documented by the respective department heads.
                            </p>
                        </div>
                    </div>
                );
            case 'FINANCIAL_CLEARANCE':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3 text-blue-700 mb-2">
                            <CreditCard size={18} />
                            <span className="text-xs font-bold">Financial Audit & Liabilities</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="Remaining Loan Balance" value={formData.remainingLoanBalance} field="remainingLoanBalance" type="number" />
                            <SelectField label="HMO / Health Card Status" value={formData.hmoConsolidation} field="hmoConsolidation" options={['Cleared', 'Card Returned', 'Lost - For Deduction', 'N/A']} />
                            <SelectField label="Insurance / Benefits" value={formData.insuranceStatus} field="insuranceStatus" options={['Cancelled', 'Converted to Individual', 'Policy Transferred', 'N/A']} />
                            <InputField label="Unused Leave Credits (Days)" value={formData.leaveCreditsToConvert} field="leaveCreditsToConvert" type="number" />
                        </div>

                        <div className="mt-4 p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">Final Financial Audit Status</h4>
                                    <p className="text-xs text-slate-500">Confirm all external liabilities are reconciled</p>
                                </div>
                                <ToggleField label="Audit Complete" value={formData.isFinancialAuditComplete} field="isFinancialAuditComplete" />
                            </div>
                        </div>
                    </div>
                );
            case 'FINANCIAL':
                const isRetrenchment = formData.offboardingType === 'Retrenchment/Redundancy';
                const isRetirement = formData.offboardingType === 'Retirement';
                const showStatutoryPay = isRetrenchment || isRetirement;
                const statutoryPayLabel = isRetrenchment ? 'Separation Pay' : 'Retirement Pay';

                const lastPayTotal = Number(formData.lastSalary) +
                    Number(formData.proRated13thMonth) +
                    Number(formData.unusedLeaveConversion) +
                    Number(formData.otherEarnings) -
                    Number(formData.outstandingLoans) -
                    Number(formData.remainingLoanBalance);

                const finalTotal = lastPayTotal + Number(formData.severancePay);

                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                        {/* Section 1: Standard Last Pay (Final Settlement) */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-slate-800">
                                <FileText size={16} className="text-slate-400" />
                                <h3 className="text-xs font-black uppercase tracking-widest">1. Last Pay Breakdown</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField label="Remaining Salary (Pro-rated)" value={formData.lastSalary} field="lastSalary" type="number" />
                                <InputField
                                    label="Accrued 13th Month"
                                    value={formData.offboardingType === 'Transfer' && formData.record13thMonth ? 0 : formData.proRated13thMonth}
                                    field="proRated13thMonth"
                                    type="number"
                                    disabled={formData.offboardingType === 'Transfer' && formData.record13thMonth}
                                />
                                <InputField
                                    label="Leave Conversion"
                                    value={formData.offboardingType === 'Transfer' && formData.transferLeaves ? 0 : formData.unusedLeaveConversion}
                                    field="unusedLeaveConversion"
                                    type="number"
                                    disabled={formData.offboardingType === 'Transfer' && formData.transferLeaves}
                                />
                                <InputField label="Other Earnings" value={formData.otherEarnings} field="otherEarnings" type="number" />
                                <InputField label="Outstanding Deductions" value={formData.outstandingLoans} field="outstandingLoans" type="number" className="md:col-span-2" />
                            </div>
                            {formData.offboardingType === 'Transfer' && (formData.transferLeaves || formData.record13thMonth) && (
                                <p className="text-[10px] text-blue-600 font-bold italic">
                                    Note: Some items are {formData.transferLeaves && formData.record13thMonth ? 'both' : 'partially'} set to 0 because they are marked for Transfer/Carry-over.
                                </p>
                            )}
                        </div>

                        {/* Section 2: Statutory/Supplemental Pay (Optional based on type) */}
                        {showStatutoryPay && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-4 p-6 bg-rose-50 border border-rose-100 rounded-2xl"
                            >
                                <div className="flex items-center gap-2 text-rose-900">
                                    <DollarSign size={16} className="text-rose-400" />
                                    <h3 className="text-xs font-black uppercase tracking-widest">2. {statutoryPayLabel} (Book VI)</h3>
                                </div>
                                <InputField
                                    label={`Net ${statutoryPayLabel}`}
                                    value={formData.severancePay}
                                    field="severancePay"
                                    type="number"
                                    placeholder={`Enter computed ${statutoryPayLabel}...`}
                                />
                                <p className="text-[10px] text-rose-600 font-medium italic">
                                    Ref: Company Policy › Separation Pay Calculator. Fraction of 6 mos = 1 whole year.
                                </p>
                            </motion.div>
                        )}

                        {/* Summary Card */}
                        <div className="p-6 bg-slate-900 rounded-2xl text-white shadow-2xl shadow-rose-900/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600 rounded-full blur-[80px] opacity-10 -mr-16 -mt-16"></div>
                            <div className="relative z-10 space-y-4">
                                <div className="flex justify-between items-center text-slate-400 uppercase tracking-widest text-[10px] font-bold">
                                    <span>Total Payout Calculation</span>
                                    {showStatutoryPay && <span>Last Pay + {statutoryPayLabel}</span>}
                                </div>
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                                    <div>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Total Estimated Payout</p>
                                        <div className="text-4xl font-black text-white">
                                            ₱{finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </div>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <div className="text-[10px] flex justify-between gap-8">
                                            <span className="text-slate-500 font-bold uppercase tracking-widest">Base Last Pay:</span>
                                            <span className="text-slate-300 font-mono font-bold">₱{lastPayTotal.toLocaleString()}</span>
                                        </div>
                                        <div className="text-[10px] flex justify-between gap-8 text-rose-300">
                                            <span className="font-bold uppercase tracking-widest">Loan Deductions:</span>
                                            <span className="font-mono font-bold">- ₱{Number(formData.remainingLoanBalance).toLocaleString()}</span>
                                        </div>
                                        {showStatutoryPay && (
                                            <div className="text-[10px] flex justify-between gap-8 border-t border-slate-800 pt-1">
                                                <span className="text-rose-500 font-bold uppercase tracking-widest">{statutoryPayLabel}:</span>
                                                <span className="text-rose-400 font-mono font-bold">+ ₱{Number(formData.severancePay).toLocaleString()}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'REVIEW':
                const reviewLastPayT = Number(formData.lastSalary) + Number(formData.proRated13thMonth) + Number(formData.unusedLeaveConversion) + Number(formData.otherEarnings) - Number(formData.outstandingLoans);
                const reviewGrandT = reviewLastPayT + Number(formData.severancePay);
                const isSpecialFinal = formData.offboardingType === 'Retrenchment/Redundancy' || formData.offboardingType === 'Retirement';

                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-rose-600 shadow-xl shadow-rose-200">
                                <LogOut size={24} strokeWidth={3} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-rose-900">Final Confirmation</h3>
                                <p className="text-sm text-rose-700">Type: <strong>{formData.offboardingType}</strong></p>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-8 shadow-sm">
                            <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                                <img src={selectedEmployee?.avatar} alt="" className="w-16 h-16 rounded-2xl object-cover ring-4 ring-slate-50" />
                                <div>
                                    <h4 className="text-xl font-bold text-slate-900">{selectedEmployee?.name}</h4>
                                    <p className="text-sm text-slate-500 font-medium">{selectedEmployee?.role}</p>
                                    <span className="mt-2 inline-flex px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full uppercase tracking-tighter">
                                        ID: {selectedEmployee?.id}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Effective Date</p>
                                    <p className="text-sm text-slate-900 font-bold">{formData.offboardingType === 'Transfer' ? formData.transferEffectiveDate : (formData.separationDate || formData.lastDay) || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Total Payout</p>
                                    <p className="text-lg text-rose-600 font-black">₱{reviewGrandT.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Clearance Status</p>
                                    <p className="text-sm text-slate-900 font-bold">{(formData.supervisorCleared && formData.hrCleared) ? 'Clearing Success' : 'Pending Approvals'}</p>
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Departmental Audit</h5>
                                    <ul className="space-y-2">
                                        {[
                                            { label: 'Supervisor', val: formData.supervisorCleared },
                                            { label: 'IT Access', val: formData.itAccessRevoked },
                                            { label: 'Admin/Inventory', val: formData.adminPropertyReturned },
                                            { label: 'HR Compliance', val: formData.hrCleared }
                                        ].map(item => (
                                            <li key={item.label} className="flex items-center justify-between text-xs">
                                                <span className="text-slate-600 font-medium">{item.label}</span>
                                                {item.val ? <Check size={14} className="text-emerald-500" strokeWidth={3} /> : <X size={14} className="text-rose-500" strokeWidth={3} />}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="space-y-4">
                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Financial Audit</h5>
                                    <ul className="space-y-2 text-xs">
                                        <li className="flex justify-between"><span className="text-slate-600">Loan Dues</span> <span className="font-bold text-slate-900">₱{Number(formData.remainingLoanBalance).toLocaleString()}</span></li>
                                        <li className="flex justify-between"><span className="text-slate-600">HMO Status</span> <span className="font-bold text-slate-900">{formData.hmoConsolidation}</span></li>
                                        <li className="flex justify-between"><span className="text-slate-600">Leave Conversion</span> <span className="font-bold text-slate-900">{formData.leaveCreditsToConvert} Days</span></li>
                                        <li className="flex justify-between pt-2 border-t border-slate-200">
                                            <span className="text-slate-600 font-bold">Audit Complete</span>
                                            {formData.isFinancialAuditComplete ? <Check size={14} className="text-emerald-500" strokeWidth={3} /> : <X size={14} className="text-rose-500" strokeWidth={3} />}
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-slate-900 rounded-3xl p-6 text-white grid grid-cols-1 md:grid-cols-2 gap-8 ring-4 ring-slate-100">
                                <div className="space-y-4">
                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Separation Details</h5>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase">Reason for Separation</p>
                                            <p className="text-xs font-bold text-white">{formData.reason || 'Not Specified'}</p>
                                        </div>
                                        {formData.detailedReason && (
                                            <div>
                                                <p className="text-[10px] text-slate-500 uppercase">Detailed Remarks</p>
                                                <p className="text-[10px] text-slate-300 line-clamp-2">{formData.detailedReason}</p>
                                            </div>
                                        )}
                                        <div className="flex gap-4">
                                            <div>
                                                <p className="text-[10px] text-slate-500 uppercase">Rehire Eligibility</p>
                                                <p className="text-xs font-bold text-white">{formData.isEligibleForRehire ? 'Eligible' : 'Non-Eligible'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {formData.beneficiaryName && (
                                    <div className="space-y-4">
                                        <h5 className="text-[10px] font-black uppercase tracking-widest text-rose-400">Beneficiary Info (Estate)</h5>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-[10px] text-slate-500 uppercase">Primary Claimant</p>
                                                <p className="text-xs font-bold text-white uppercase">{formData.beneficiaryName}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <p className="text-[10px] text-slate-500 uppercase">Relation</p>
                                                    <p className="text-[10px] font-bold text-white">{formData.beneficiaryRelation}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-slate-500 uppercase">Contact</p>
                                                    <p className="text-[10px] font-bold text-white">{formData.beneficiaryContact}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {formData.offboardingType === 'Transfer' && (
                                    <div className="space-y-4">
                                        <h5 className="text-[10px] font-black uppercase tracking-widest text-blue-400">Transfer Destination</h5>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-[10px] text-slate-500 uppercase">Department</p>
                                                <p className="text-xs font-bold text-white">{formData.newDepartment}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-500 uppercase">New Position</p>
                                                <p className="text-xs font-bold text-white">{formData.newPosition}</p>
                                            </div>
                                            <div className="pt-2 border-t border-slate-800">
                                                <p className="text-[10px] text-slate-500 uppercase mb-1">Carry-over Status</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {formData.transferLeaves && <span className="text-[9px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">Leaves</span>}
                                                    {formData.record13thMonth && <span className="text-[9px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">13th Month</span>}
                                                    {formData.transferTenure && <span className="text-[9px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">Tenure</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {isSpecialFinal && (
                                <div className="p-4 border-2 border-rose-100 bg-rose-50/30 rounded-2xl flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Supplemental Calculation</span>
                                    <div className="flex gap-2">
                                        <span className="px-3 py-1 bg-white border border-rose-200 rounded-full text-[10px] font-bold text-rose-700 shadow-sm">Last Pay Payout</span>
                                        <span className="px-3 py-1 bg-rose-500 text-white rounded-full text-[10px] font-bold shadow-sm shadow-rose-200">
                                            {formData.offboardingType === 'Retrenchment/Redundancy' ? 'Separation Pay' : 'Retirement Pay'}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
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
                    <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
                        <div>
                            <h2 className="text-2xl font-extrabold text-slate-900">{activeSteps[currentStepIdx]?.title}</h2>
                            <p className="text-sm text-slate-500 font-medium mt-1">{activeSteps[currentStepIdx]?.description}</p>
                        </div>
                        <div className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm text-rose-500">
                            {activeSteps[currentStepIdx]?.icon}
                        </div>
                    </div>

                    <div className="flex-1 px-10 py-8 overflow-y-auto">
                        <StepContent />
                    </div>

                    <div className="px-10 py-6 border-t border-slate-50 flex justify-between items-center bg-white/80 backdrop-blur-sm sticky bottom-0">
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all"
                        >
                            <ArrowLeft size={16} /> {isFirstStep ? 'Cancel' : 'Back'}
                        </button>

                        <button
                            onClick={handleNext}
                            className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
                        >
                            {isLastStep ? 'Complete Process' : 'Next Step'} <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default OffboardingEmployee;
