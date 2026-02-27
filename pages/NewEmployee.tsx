
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
    UserPlus,
    FileText,
    DollarSign,
    ToggleLeft,
    ToggleRight,
    MapPin,
    Calendar,
    GraduationCap,
    Award,
    Users,
    Heart,
    Phone,
    Trash2,
    Plus,
    CalendarRange,
    Clock,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Network,
    Zap,
    Info
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- Types & Interfaces ---
interface PayComponent {
    id: string;
    name: string;
    type: 'Earning' | 'Deduction';
    value: number;
    isFixed: boolean;
}

interface PayTemplate {
    id: string;
    name: string;
    basePay: number;
    components: PayComponent[];
    linkedPosition?: string; // New field for autofill logic
}

interface Education { id: string; attainment: string; course: string; school: string; dateGraduated: string; }
interface Exam { id: string; dateTaken: string; name: string; rating: string; description: string; }
interface Employment { id: string; company: string; address: string; position: string; department: string; startDate: string; endDate: string; }
interface Reference { id: string; lastName: string; firstName: string; position: string; contactNo: string; business: string; address: string; }
interface Family { id: string; relationship: string; lastName: string; firstName: string; birthday: string; occupation: string; address: string; }
interface EmergencyContact { id: string; relationship: string; lastName: string; firstName: string; contactNo: string; email: string; }

// --- Constants (Matched with ProfileShared) ---
const RELIGIONS = ['Roman Catholic', 'Islam', 'Iglesia ni Cristo', 'Christian', 'Buddhism', 'Hinduism', 'Other'];
const CITIZENSHIPS = ['Filipino', 'American', 'Chinese', 'Japanese', 'Dual Citizen'];
const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const COMPLEXIONS = ['Fair', 'Light', 'Medium', 'Olive', 'Brown', 'Dark'];
const TAX_STATUSES = ['Taxable', 'Non-Taxable', 'M1', 'M2', 'S1', 'S2'];
const BANKS = ['BDO', 'BPI', 'Metrobank', 'UnionBank', 'Chinabank', 'Security Bank', 'PNB', 'Landbank'];

// --- Mock Data ---
const ORGANIZATIONAL_POSITIONS = [
    { title: 'Senior Developer', department: 'IT Department', section: 'Software Engineering', level: 'Level 4', status: 'Regular', supervisor: 'Louis Panganiban', head: 'Sarah Wilson' },
    { title: 'Junior Developer', department: 'IT Department', section: 'Software Engineering', level: 'Level 1', status: 'Probationary', supervisor: 'James Cordon', head: 'Sarah Wilson' },
    { title: 'HR Specialist', department: 'HR Department', section: 'Recruitment', level: 'Level 2', status: 'Probationary', supervisor: 'Sarah Wilson', head: 'Sarah Wilson' },
    { title: 'Payroll Officer', department: 'Finance', section: 'Payroll', level: 'Level 3', status: 'Regular', supervisor: 'Mike Brown', head: 'Mike Brown' },
    { title: 'Marketing Lead', department: 'Marketing', section: 'Digital Marketing', level: 'Level 4', status: 'Regular', supervisor: 'CEO', head: 'CEO' },
];

const MOCK_DIVISORS = [
    { id: 'div-1', name: '314 Days - Regular', days: 314 },
    { id: 'div-2', name: '288 Days - Compressed', days: 288 },
    { id: 'div-3', name: '261 Days - Standard', days: 261 }
];

const MOCK_PAY_SCHEDULES = [
    {
        id: 'ps-1',
        name: 'Regular Semi-Monthly',
        frequency: 'Semi-Monthly',
        firstCutoff: 10,
        firstPayDate: 15,
        secondCutoff: 25,
        secondPayDate: 30,
        divisorId: 'div-1',
        description: '10th & 25th Cutoff | 15th & 30th Payout'
    },
    {
        id: 'ps-2',
        name: 'Weekly Contractual',
        frequency: 'Weekly',
        firstPayDate: 'Friday',
        divisorId: 'div-3',
        description: 'Weekly payout every Friday'
    },
    {
        id: 'ps-3',
        name: 'Executive Monthly',
        frequency: 'Monthly',
        firstCutoff: 25,
        firstPayDate: 30,
        divisorId: 'div-2',
        description: '25th Cutoff | 30th Payout'
    },
];

const MOCK_PAY_TEMPLATES: PayTemplate[] = [
    {
        id: 'pt-1',
        name: 'Standard Regular Employee',
        basePay: 25000,
        linkedPosition: 'Junior Developer',
        components: [
            { id: 'pc-1', name: 'Rice Subsidy', type: 'Earning', value: 2000, isFixed: true },
            { id: 'pc-2', name: 'Clothing Allowance', type: 'Earning', value: 1000, isFixed: true },
            { id: 'pc-3', name: 'SSS Contribution', type: 'Deduction', value: 1350, isFixed: true },
            { id: 'pc-4', name: 'PhilHealth', type: 'Deduction', value: 450, isFixed: true }
        ]
    },
    {
        id: 'pt-2',
        name: 'Senior Management',
        basePay: 65000,
        linkedPosition: 'Senior Developer',
        components: [
            { id: 'pc-1', name: 'Rice Subsidy', type: 'Earning', value: 2500, isFixed: true },
            { id: 'pc-5', name: 'Car Allowance', type: 'Earning', value: 5000, isFixed: true },
            { id: 'pc-3', name: 'SSS Contribution', type: 'Deduction', value: 1350, isFixed: true },
            { id: 'pc-4', name: 'PhilHealth', type: 'Deduction', value: 900, isFixed: true }
        ]
    },
    {
        id: 'pt-3',
        name: 'Contractual / Project Based',
        basePay: 30000,
        linkedPosition: 'Payroll Officer',
        components: [
            { id: 'pc-6', name: 'Project Allowance', type: 'Earning', value: 3000, isFixed: true },
            { id: 'pc-7', name: 'Withholding Tax', type: 'Deduction', value: 1500, isFixed: true } // Simplified
        ]
    }
];

const STEPS = [
    { id: 1, title: 'Personnel Details', icon: <User size={18} />, description: 'Basic bio & contact info' },
    { id: 2, title: 'Employment', icon: <Briefcase size={18} />, description: 'IDs, dates & schedule' },
    { id: 3, title: 'Pay Template', icon: <DollarSign size={18} />, description: 'Salary configuration' },
    { id: 4, title: 'Org Structure', icon: <Network size={18} />, description: 'Position & hierarchy' },
    { id: 5, title: 'Financial & Gov', icon: <FileText size={18} />, description: 'Bank & Tax details' },
    { id: 6, title: 'Other Details', icon: <GraduationCap size={18} />, description: 'Education & history' },
    { id: 7, title: 'Pay Schedule', icon: <CalendarRange size={18} />, description: 'Frequency & cutoff' },
    { id: 8, title: 'Review & Onboard', icon: <Check size={18} />, description: 'Verify details' },
];

const NewEmployee: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [viewDate, setViewDate] = useState(new Date());

    // Form State
    const [formData, setFormData] = useState({
        // --- Personal ---
        firstName: '',
        middleName: '',
        lastName: '',
        nickname: '',
        dob: '',
        gender: 'Male',
        maritalStatus: 'Single',
        bloodType: '',
        nationality: 'Filipino',
        citizenship: '',
        religion: '',
        birthPlace: '',
        complexion: '',
        height: '',
        weight: '',
        personalEmail: '',
        mobileNumber: '',

        // Address - Current
        currentStreet: '',
        currentBarangay: '',
        currentCity: '',
        currentProvince: '',

        // Address - Permanent
        permanentStreet: '',
        permanentBarangay: '',
        permanentCity: '',
        permanentProvince: '',

        // --- Employment ---
        employeeId: 'EMP-' + Math.floor(1000 + Math.random() * 9000),
        proximityId: '',
        companyEmail: '',
        companyName: 'Nexus Corp', // Default
        department: '',
        section: '',
        position: '',
        jobLevel: '',
        employmentStatus: '',
        workSchedule: 'Mon-Fri, 9:00 AM - 6:00 PM',
        immediateSupervisor: '',
        departmentHead: '',

        // Dates
        dateHired: '',
        dateProbationary: '',
        dateRegularization: '',
        dateOfContract: '',
        contractEndDate: '',

        // --- Financial ---
        bankName: '',
        accountNumber: '',
        accountHolder: '',
        sss: '',
        tin: '',
        philhealth: '',
        pagibig: '',
        taxStatus: 'Taxable',
        taxExempted: false,
        tax10: false,

        // --- Other Details ---
        education: [] as Education[],
        exams: [] as Exam[],
        employmentHistory: [] as Employment[],
        references: [] as Reference[],
        family: [] as Family[],
        emergencyContacts: [] as EmergencyContact[],

        // --- Pay Schedule ---
        payScheduleId: '',

        // --- Pay Template ---
        payTemplateId: '',
        customizePay: false,
        customBasePay: 0,
        customComponents: [] as PayComponent[]
    });

    // --- Calendar Helpers ---
    const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

    const getDayEvents = (day: number, schedule: any) => {
        if (!schedule) return [];
        const events = [];
        const maxDays = getDaysInMonth(viewDate);
        const isMatch = (target: any) => {
            if (target === undefined) return false;
            if (typeof target === 'number') {
                // Adjust for month end if cutoff is e.g. 30th but month has 28 days
                const effectiveTarget = Math.min(target, maxDays);
                return day === effectiveTarget;
            }
            return false;
        };

        const { frequency, firstCutoff, firstPayDate, secondCutoff, secondPayDate } = schedule;

        if (frequency === 'Weekly') {
            const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const currentDayName = weekDays[new Date(viewDate.getFullYear(), viewDate.getMonth(), day).getDay()];
            if (String(firstPayDate) === currentDayName) {
                events.push({ type: 'pay', label: 'Pay Day' });
            }
        } else if (frequency === 'Semi-Monthly') {
            if (isMatch(firstCutoff)) events.push({ type: 'cutoff', label: '1st Cutoff' });
            if (isMatch(firstPayDate)) events.push({ type: 'pay', label: '1st Pay' });
            if (isMatch(secondCutoff)) events.push({ type: 'cutoff', label: '2nd Cutoff' });
            if (isMatch(secondPayDate)) events.push({ type: 'pay', label: '2nd Pay' });
        } else if (frequency === 'Monthly') {
            if (isMatch(firstCutoff)) events.push({ type: 'cutoff', label: 'Cutoff' });
            if (isMatch(firstPayDate)) events.push({ type: 'pay', label: 'Pay Day' });
        }
        return events;
    };

    const handleNext = () => {
        if (currentStep < 8) setCurrentStep(currentStep + 1);
        else handleSubmit();
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
        else navigate('/manage/employee');
    };

    const handleSubmit = () => {
        // Simulate API submission
        setTimeout(() => {
            alert("Employee Onboarded Successfully!");
            navigate('/manage/employee');
        }, 1000);
    };

    const handleTemplateChange = (templateId: string) => {
        const template = MOCK_PAY_TEMPLATES.find(t => t.id === templateId);
        if (template) {
            // Prepare autofill for org structure if linked position exists
            let orgUpdates = {};
            if (template.linkedPosition) {
                const linkedPos = ORGANIZATIONAL_POSITIONS.find(p => p.title === template.linkedPosition);
                if (linkedPos) {
                    orgUpdates = {
                        position: linkedPos.title,
                        department: linkedPos.department,
                        section: linkedPos.section,
                        jobLevel: linkedPos.level,
                        employmentStatus: linkedPos.status,
                        immediateSupervisor: linkedPos.supervisor,
                        departmentHead: linkedPos.head
                    };
                }
            }

            setFormData({
                ...formData,
                payTemplateId: templateId,
                customBasePay: template.basePay,
                customComponents: [...template.components], // Clone
                ...orgUpdates
            });
        } else {
            setFormData({
                ...formData,
                payTemplateId: '',
                customBasePay: 0,
                customComponents: []
            });
        }
    };

    const handleComponentChange = (id: string, value: number) => {
        const updated = formData.customComponents.map(c => c.id === id ? { ...c, value } : c);
        setFormData({ ...formData, customComponents: updated });
    };

    const handlePositionChange = (title: string) => {
        const matchedPosition = ORGANIZATIONAL_POSITIONS.find(p => p.title === title);

        if (matchedPosition) {
            setFormData({
                ...formData,
                position: title,
                companyName: 'Nexus Corp', // Default
                department: matchedPosition.department,
                section: matchedPosition.section,
                jobLevel: matchedPosition.level,
                employmentStatus: matchedPosition.status,
                immediateSupervisor: matchedPosition.supervisor,
                departmentHead: matchedPosition.head
            });
        } else {
            setFormData({
                ...formData,
                position: title,
                // If cleared, reset or keep? Keeping previous for now or could reset.
            });
        }
    };

    // --- List Handlers for Step 4 ---
    const addItem = (field: keyof typeof formData, item: any) => {
        setFormData({ ...formData, [field]: [...(formData[field] as any[]), item] });
    };

    const removeItem = (field: keyof typeof formData, id: string) => {
        setFormData({ ...formData, [field]: (formData[field] as any[]).filter((i: any) => i.id !== id) });
    };

    const updateItem = (field: keyof typeof formData, id: string, key: string, value: string) => {
        const updatedList = (formData[field] as any[]).map((item: any) =>
            item.id === id ? { ...item, [key]: value } : item
        );
        setFormData({ ...formData, [field]: updatedList });
    };

    // Reusable Input Field
    const InputField = ({ label, value, field, type = 'text', placeholder = '', className = '', disabled = false }: any) => (
        <div className={className}>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{label}</label>
            <input
                type={type}
                className={`w-full p-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none transition-all placeholder:font-medium placeholder:text-slate-400 ${disabled ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-slate-50 focus:ring-2 focus:ring-indigo-100 focus:bg-white'}`}
                placeholder={placeholder}
                value={value}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                disabled={disabled}
            />
        </div>
    );

    const SelectField = ({ label, value, field, options, className = '', disabled = false, onChange }: any) => (
        <div className={className}>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{label}</label>
            <select
                className={`w-full p-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none transition-all cursor-pointer ${disabled ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-slate-50 focus:ring-2 focus:ring-indigo-100 focus:bg-white'}`}
                value={value}
                onChange={onChange ? onChange : (e) => setFormData({ ...formData, [field]: e.target.value })}
                disabled={disabled}
            >
                <option value="">Select {label}</option>
                {options.map((opt: string) => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        </div>
    );

    const GenericTable = ({ title, icon, columns, data, onAdd, onRemove, fields, listKey }: any) => (
        <div className="mb-8">
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                {icon} {title}
            </h4>
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-widest border-b border-slate-200">
                            <tr>
                                {columns.map((col: string, i: number) => <th key={i} className="px-4 py-3">{col}</th>)}
                                <th className="px-4 py-3 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.map((item: any) => (
                                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                    {fields.map((field: string, fIdx: number) => (
                                        <td key={fIdx} className="p-2">
                                            <input
                                                className="w-full bg-transparent border-b border-transparent focus:border-indigo-500 outline-none py-1 transition-colors text-slate-700 font-medium"
                                                placeholder={columns[fIdx]}
                                                value={item[field]}
                                                onChange={(e) => updateItem(listKey, item.id, field, e.target.value)}
                                            />
                                        </td>
                                    ))}
                                    <td className="p-2 text-right">
                                        <button onClick={() => removeItem(listKey, item.id)} className="text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                                    </td>
                                </tr>
                            ))}
                            {data.length === 0 && (
                                <tr>
                                    <td colSpan={columns.length + 1} className="px-4 py-6 text-center text-slate-400 italic">No records added.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <button
                    onClick={onAdd}
                    className="w-full py-3 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-500 hover:text-indigo-600 hover:bg-slate-50 border-t border-slate-100 transition-all uppercase tracking-wider"
                >
                    <Plus size={12} /> Add Item
                </button>
            </div>
        </div>
    );

    // Helper Components for Review Step
    const ReviewItem = ({ label, value, fullWidth }: any) => (
        <div className={fullWidth ? 'col-span-2' : ''}>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
            <p className="font-medium text-slate-700">{value || '-'}</p>
        </div>
    );

    const ReviewListSection = ({ title, items, render }: any) => (
        <div>
            <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{title}</h5>
            {items.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                    {items.map((item: any, idx: number) => (
                        <li key={idx} className="leading-relaxed">{render(item)}</li>
                    ))}
                </ul>
            ) : (
                <p className="text-xs text-slate-400 italic">No records provided.</p>
            )}
        </div>
    );

    const StepContent = () => {
        switch (currentStep) {
            case 1: // Personnel Details (Formerly Personal)
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                        {/* Basic Info */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-2 text-indigo-900 font-bold border-b border-indigo-100 pb-2">
                                <User size={18} /> Basic Information
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <InputField label="First Name" value={formData.firstName} field="firstName" placeholder="e.g. John" />
                                <InputField label="Middle Name" value={formData.middleName} field="middleName" placeholder="e.g. Q" />
                                <InputField label="Last Name" value={formData.lastName} field="lastName" placeholder="e.g. Doe" />
                                <InputField label="Nickname" value={formData.nickname} field="nickname" placeholder="e.g. Johnny" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <InputField label="Date of Birth" value={formData.dob} field="dob" type="date" />
                                <SelectField label="Gender" value={formData.gender} field="gender" options={['Male', 'Female', 'Other']} />
                                <SelectField label="Marital Status" value={formData.maritalStatus} field="maritalStatus" options={['Single', 'Married', 'Widowed', 'Separated']} />
                                <SelectField label="Blood Type" value={formData.bloodType} field="bloodType" options={BLOOD_TYPES} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <InputField label="Nationality" value={formData.nationality} field="nationality" />
                                <SelectField label="Citizenship" value={formData.citizenship} field="citizenship" options={CITIZENSHIPS} />
                                <SelectField label="Religion" value={formData.religion} field="religion" options={RELIGIONS} />
                                <InputField label="Birth Place" value={formData.birthPlace} field="birthPlace" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <InputField label="Height (cm)" value={formData.height} field="height" />
                                <InputField label="Weight (kg)" value={formData.weight} field="weight" />
                                <SelectField label="Complexion" value={formData.complexion} field="complexion" options={COMPLEXIONS} />
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-2 text-indigo-900 font-bold border-b border-indigo-100 pb-2">
                                <MapPin size={18} /> Contact & Address
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField label="Personal Email" value={formData.personalEmail} field="personalEmail" type="email" placeholder="john.doe@gmail.com" />
                                <InputField label="Mobile Number" value={formData.mobileNumber} field="mobileNumber" placeholder="+63 912 345 6789" />
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Current Address</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField label="Street / Unit / Building" value={formData.currentStreet} field="currentStreet" className="md:col-span-2" />
                                    <InputField label="Barangay" value={formData.currentBarangay} field="currentBarangay" />
                                    <InputField label="City / Municipality" value={formData.currentCity} field="currentCity" />
                                    <InputField label="Province" value={formData.currentProvince} field="currentProvince" />
                                </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Permanent Address</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField label="Street / Unit / Building" value={formData.permanentStreet} field="permanentStreet" className="md:col-span-2" />
                                    <InputField label="Barangay" value={formData.permanentBarangay} field="permanentBarangay" />
                                    <InputField label="City / Municipality" value={formData.permanentCity} field="permanentCity" />
                                    <InputField label="Province" value={formData.permanentProvince} field="permanentProvince" />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 2: // Employment
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-center gap-3 text-indigo-700">
                            <Briefcase size={18} />
                            <span className="text-xs font-bold">Assignment Identifiers & Schedule</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <InputField label="Employee ID" value={formData.employeeId} field="employeeId" />
                            <InputField label="Proximity ID" value={formData.proximityId} field="proximityId" />
                            <InputField label="Company Email" value={formData.companyEmail} field="companyEmail" type="email" placeholder="john.doe@company.com" />
                        </div>

                        <div className="w-full h-px bg-slate-100"></div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <InputField label="Date Hired" value={formData.dateHired} field="dateHired" type="date" />
                            <InputField label="Date Probationary" value={formData.dateProbationary} field="dateProbationary" type="date" />
                            <InputField label="Date Regularization" value={formData.dateRegularization} field="dateRegularization" type="date" />
                            <InputField label="Date of Contract" value={formData.dateOfContract} field="dateOfContract" type="date" />
                        </div>

                        <InputField label="Work Schedule" value={formData.workSchedule} field="workSchedule" />
                    </div>
                );
            case 3: // Pay Template (Moved from 6)
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Select Pay Template</label>
                                <div className="space-y-3">
                                    {MOCK_PAY_TEMPLATES.map(template => (
                                        <div
                                            key={template.id}
                                            onClick={() => handleTemplateChange(template.id)}
                                            className={`p-4 border rounded-2xl cursor-pointer transition-all ${formData.payTemplateId === template.id ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600 shadow-md' : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm'}`}
                                        >
                                            <div className="flex justify-between items-center mb-1">
                                                <span className={`font-bold text-sm ${formData.payTemplateId === template.id ? 'text-indigo-900' : 'text-slate-700'}`}>{template.name}</span>
                                                {formData.payTemplateId === template.id && <Check size={16} className="text-indigo-600" strokeWidth={3} />}
                                            </div>
                                            <span className="text-xs font-mono font-bold text-slate-500">Base: ₱{template.basePay.toLocaleString()}</span>
                                            {template.linkedPosition && (
                                                <div className="mt-2 text-[10px] text-indigo-600 bg-indigo-100/50 px-2 py-1 rounded inline-flex items-center gap-1 font-bold border border-indigo-100">
                                                    <Zap size={10} />
                                                    Auto-assigns: {template.linkedPosition}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {formData.payTemplateId && (
                                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                                    <div className="flex justify-between items-center mb-6">
                                        <h4 className="text-sm font-bold text-slate-900">Compensation Breakdown</h4>
                                        <button
                                            onClick={() => setFormData({ ...formData, customizePay: !formData.customizePay })}
                                            className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                                        >
                                            {formData.customizePay ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                                            {formData.customizePay ? 'Customized' : 'Default Values'}
                                        </button>
                                    </div>

                                    {formData.customizePay && (
                                        <div className="mb-6 p-3 bg-amber-50 border border-amber-100 rounded-xl flex gap-3 items-start">
                                            <Info size={16} className="text-amber-600 mt-0.5 shrink-0" />
                                            <p className="text-xs text-amber-700 leading-relaxed">
                                                <strong>Note:</strong> Customizing values here will create a new employee-specific pay template configuration reflected in the Pay Structure setup.
                                            </p>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        <div className={`p-3 rounded-xl border ${formData.customizePay ? 'bg-white border-indigo-200' : 'bg-slate-50 border-slate-100'}`}>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Basic Salary</label>
                                            {formData.customizePay ? (
                                                <input
                                                    type="number"
                                                    className="w-full bg-transparent font-mono font-bold text-slate-800 outline-none border-b border-indigo-200 focus:border-indigo-600"
                                                    value={formData.customBasePay}
                                                    onChange={e => setFormData({ ...formData, customBasePay: parseFloat(e.target.value) })}
                                                />
                                            ) : (
                                                <span className="font-mono font-bold text-slate-800">₱{formData.customBasePay.toLocaleString()}</span>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Components</label>
                                            {formData.customComponents.map(comp => (
                                                <div key={comp.id} className="flex justify-between items-center text-sm py-2 border-b border-dashed border-slate-100">
                                                    <span className={`${comp.type === 'Earning' ? 'text-emerald-700' : 'text-rose-700'}`}>{comp.name}</span>
                                                    {formData.customizePay ? (
                                                        <input
                                                            type="number"
                                                            className="w-24 text-right bg-slate-50 rounded px-2 py-1 font-mono text-xs font-bold outline-none focus:ring-1 ring-indigo-500"
                                                            value={comp.value}
                                                            onChange={e => handleComponentChange(comp.id, parseFloat(e.target.value))}
                                                        />
                                                    ) : (
                                                        <span className="font-mono font-bold text-slate-600">₱{comp.value.toLocaleString()}</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                            <span className="text-xs font-bold text-slate-900 uppercase">Gross Estimate</span>
                                            <span className="text-lg font-mono font-bold text-indigo-600">
                                                ₱{(formData.customBasePay + formData.customComponents.filter(c => c.type === 'Earning').reduce((acc, c) => acc + c.value, 0)).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 4: // Org Structure (New Step)
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-center gap-3 text-indigo-700">
                            <Network size={18} />
                            <span className="text-xs font-bold">Position & Hierarchy Assignment</span>
                        </div>

                        {/* Position Selection (Driver) */}
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                            <SelectField
                                label="Position / Title"
                                value={formData.position}
                                field="position"
                                options={ORGANIZATIONAL_POSITIONS.map(p => p.title)}
                                onChange={(e: any) => handlePositionChange(e.target.value)}
                                className="w-full"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="Company Name" value={formData.companyName} field="companyName" disabled={true} />
                            <InputField label="Department" value={formData.department} field="department" disabled={true} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <InputField label="Section" value={formData.section} field="section" disabled={true} />
                            <InputField label="Job Level" value={formData.jobLevel} field="jobLevel" disabled={true} />
                            <InputField label="Employment Status" value={formData.employmentStatus} field="employmentStatus" disabled={true} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="Immediate Supervisor" value={formData.immediateSupervisor} field="immediateSupervisor" disabled={true} />
                            <InputField label="Department Head" value={formData.departmentHead} field="departmentHead" disabled={true} />
                        </div>
                    </div>
                );
            case 5: // Financial & Gov (Moved from 3)
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                        {/* Financial */}
                        <div>
                            <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <CreditCard size={16} className="text-emerald-600" /> Financial Details
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <SelectField label="Bank Name" value={formData.bankName} field="bankName" options={BANKS} />
                                <InputField label="Account Number" value={formData.accountNumber} field="accountNumber" />
                                <InputField label="Account Holder" value={formData.accountHolder} field="accountHolder" placeholder="Same as employee name" />
                            </div>
                        </div>

                        <div className="w-full h-px bg-slate-100"></div>

                        {/* Government */}
                        <div>
                            <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <FileText size={16} className="text-blue-600" /> Government IDs & Tax
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <InputField label="SSS Number" value={formData.sss} field="sss" />
                                <InputField label="TIN" value={formData.tin} field="tin" />
                                <InputField label="PhilHealth" value={formData.philhealth} field="philhealth" />
                                <InputField label="Pag-IBIG / HDMF" value={formData.pagibig} field="pagibig" />
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <SelectField label="Tax Status" value={formData.taxStatus} field="taxStatus" options={TAX_STATUSES} />
                                    <div className="flex items-end">
                                        <label className="flex items-center gap-3 p-3 border bg-white border-slate-200 rounded-xl w-full cursor-pointer hover:border-indigo-300 transition-colors">
                                            <input type="checkbox" checked={formData.taxExempted} onChange={e => setFormData({ ...formData, taxExempted: e.target.checked })} className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                                            <span className="text-xs font-bold text-slate-700">Tax Exempted</span>
                                        </label>
                                    </div>
                                    <div className="flex items-end">
                                        <label className="flex items-center gap-3 p-3 border bg-white border-slate-200 rounded-xl w-full cursor-pointer hover:border-indigo-300 transition-colors">
                                            <input type="checkbox" checked={formData.tax10} onChange={e => setFormData({ ...formData, tax10: e.target.checked })} className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                                            <span className="text-xs font-bold text-slate-700">Subj. to 10% Tax</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 6: // Other Details (Moved from 4)
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                        <GenericTable
                            title="Educational Background" icon={<GraduationCap size={18} className="text-indigo-600" />}
                            columns={['Educational Attainment', 'Course', 'School', 'Date Graduated']}
                            fields={['attainment', 'course', 'school', 'dateGraduated']}
                            data={formData.education} listKey="education"
                            onAdd={() => addItem('education', { id: Date.now().toString(), attainment: '', course: '', school: '', dateGraduated: '' })}
                            onRemove={removeItem}
                        />
                        <GenericTable
                            title="Exam / Seminars" icon={<Award size={18} className="text-amber-600" />}
                            columns={['Date Taken', 'Exam / Seminar', 'Rating', 'Description']}
                            fields={['dateTaken', 'name', 'rating', 'description']}
                            data={formData.exams} listKey="exams"
                            onAdd={() => addItem('exams', { id: Date.now().toString(), dateTaken: '', name: '', rating: '', description: '' })}
                            onRemove={removeItem}
                        />
                        <GenericTable
                            title="Previous Employment" icon={<Briefcase size={18} className="text-blue-600" />}
                            columns={['Company', 'Address', 'Position', 'Department', 'Date Started', 'Date Resigned']}
                            fields={['company', 'address', 'position', 'department', 'startDate', 'endDate']}
                            data={formData.employmentHistory} listKey="employmentHistory"
                            onAdd={() => addItem('employmentHistory', { id: Date.now().toString(), company: '', address: '', position: '', department: '', startDate: '', endDate: '' })}
                            onRemove={removeItem}
                        />
                        <GenericTable
                            title="References" icon={<Users size={18} className="text-emerald-600" />}
                            columns={['Last Name', 'First Name', 'Position', 'Contact No.', 'Business', 'Address']}
                            fields={['lastName', 'firstName', 'position', 'contactNo', 'business', 'address']}
                            data={formData.references} listKey="references"
                            onAdd={() => addItem('references', { id: Date.now().toString(), lastName: '', firstName: '', position: '', contactNo: '', business: '', address: '' })}
                            onRemove={removeItem}
                        />
                        <GenericTable
                            title="Family Information" icon={<Heart size={18} className="text-rose-600" />}
                            columns={['Relationship', 'Last Name', 'First Name', 'Birthday', 'Occupation', 'Address']}
                            fields={['relationship', 'lastName', 'firstName', 'birthday', 'occupation', 'address']}
                            data={formData.family} listKey="family"
                            onAdd={() => addItem('family', { id: Date.now().toString(), relationship: '', lastName: '', firstName: '', birthday: '', occupation: '', address: '' })}
                            onRemove={removeItem}
                        />
                        <GenericTable
                            title="Emergency Contact" icon={<Phone size={18} className="text-slate-600" />}
                            columns={['Relationship', 'Last Name', 'First Name', 'Contact Number', 'Email']}
                            fields={['relationship', 'lastName', 'firstName', 'contactNo', 'email']}
                            data={formData.emergencyContacts} listKey="emergencyContacts"
                            onAdd={() => addItem('emergencyContacts', { id: Date.now().toString(), relationship: '', lastName: '', firstName: '', contactNo: '', email: '' })}
                            onRemove={removeItem}
                        />
                    </div>
                );
            case 7: // Pay Schedule (Moved from 5)
                const selectedSchedule = MOCK_PAY_SCHEDULES.find(s => s.id === formData.payScheduleId);
                return (
                    <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-8 duration-500">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <CalendarRange size={20} className="text-indigo-600" /> Assign Pay Schedule
                        </h3>

                        <div className="flex flex-col lg:flex-row gap-8 h-full">
                            {/* List Selection */}
                            <div className="w-full lg:w-1/3 space-y-3">
                                {MOCK_PAY_SCHEDULES.map(schedule => (
                                    <div
                                        key={schedule.id}
                                        onClick={() => setFormData({ ...formData, payScheduleId: schedule.id })}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all relative group ${formData.payScheduleId === schedule.id
                                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 scale-[1.02]'
                                            : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-200 hover:shadow-md'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className={`font-bold text-sm ${formData.payScheduleId === schedule.id ? 'text-white' : 'text-slate-900'}`}>{schedule.name}</h4>
                                            {formData.payScheduleId === schedule.id && <Check size={16} className="text-white" />}
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${formData.payScheduleId === schedule.id
                                                ? 'bg-white/20 text-white border-white/20'
                                                : 'bg-slate-100 text-slate-500 border-slate-200'
                                                }`}>
                                                {schedule.frequency}
                                            </span>
                                            {schedule.divisorId && (
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${formData.payScheduleId === schedule.id
                                                    ? 'bg-white/10 text-white border-white/20'
                                                    : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                                                    }`}>
                                                    {MOCK_DIVISORS.find(d => d.id === schedule.divisorId)?.days} Days
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Preview Pane */}
                            <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-200 p-4 md:p-6 flex flex-col relative overflow-y-auto min-h-[400px]">
                                {selectedSchedule ? (
                                    <div className="relative z-10 w-full max-w-md mx-auto">
                                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                                        <Clock size={20} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-bold text-slate-900">{selectedSchedule.name}</h4>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <p className="text-xs text-slate-500 font-medium">{selectedSchedule.description}</p>
                                                            <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold border border-indigo-100">
                                                                Divisor: {MOCK_DIVISORS.find(d => d.id === selectedSchedule.divisorId)?.name}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-2 mt-4">
                                                    <button onClick={handlePrevMonth} className="p-1 hover:bg-slate-50 rounded text-slate-400 hover:text-indigo-600"><ChevronLeft size={16} /></button>
                                                    <span className="text-xs font-bold text-slate-700">{viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                                                    <button onClick={handleNextMonth} className="p-1 hover:bg-slate-50 rounded text-slate-400 hover:text-indigo-600"><ChevronRight size={16} /></button>
                                                </div>
                                            </div>

                                            <div className="p-6">
                                                {/* Mini Calendar Grid */}
                                                <div className="grid grid-cols-7 gap-2 mb-2 text-center">
                                                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                                                        <div key={d} className="text-[10px] font-bold text-slate-400 uppercase">{d}</div>
                                                    ))}
                                                </div>
                                                <div className="grid grid-cols-7 gap-2">
                                                    {Array.from({ length: getFirstDayOfMonth(viewDate) }).map((_, i) => <div key={`empty-${i}`} />)}
                                                    {Array.from({ length: getDaysInMonth(viewDate) }).map((_, i) => {
                                                        const day = i + 1;
                                                        const events = getDayEvents(day, selectedSchedule);
                                                        const isPay = events.some(e => e.type === 'pay');
                                                        const isCutoff = events.some(e => e.type === 'cutoff');

                                                        return (
                                                            <div key={day} className={`aspect-square flex flex-col items-center justify-center rounded-lg text-xs font-bold border ${isPay ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                                                                isCutoff ? 'bg-amber-50 border-amber-200 text-amber-700' :
                                                                    'bg-white border-transparent text-slate-600'
                                                                }`}>
                                                                {day}
                                                                <div className="flex gap-0.5 mt-0.5">
                                                                    {isPay && <div className="w-1 h-1 rounded-full bg-emerald-500"></div>}
                                                                    {isCutoff && <div className="w-1 h-1 rounded-full bg-amber-500"></div>}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                <div className="flex gap-4 justify-center mt-6 text-[10px] font-bold uppercase tracking-wide">
                                                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Pay Date</div>
                                                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Cutoff</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center text-slate-400">
                                        <CalendarRange size={48} className="mx-auto mb-4 opacity-20" />
                                        <p className="text-sm font-medium">Select a schedule from the list to view details.</p>
                                    </div>
                                )}

                                {/* Decorative Background Elements */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>
                            </div>
                        </div>
                    </div>
                );
            case 8: // Review
                const scheduleForReview = MOCK_PAY_SCHEDULES.find(s => s.id === formData.payScheduleId);
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 pb-10">
                        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-sm">
                                <Check size={24} strokeWidth={3} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-emerald-900">Ready to Onboard</h3>
                                <p className="text-sm text-emerald-700">Please review the details below before finalizing the employee creation.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            {/* Column 1 */}
                            <div className="space-y-6">
                                {/* Personal Details Card */}
                                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                                        <User size={16} className="text-indigo-600" />
                                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Personnel Details</h4>
                                    </div>
                                    <div className="p-6 grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                                        <ReviewItem label="Full Name" value={`${formData.firstName} ${formData.middleName} ${formData.lastName}`} />
                                        <ReviewItem label="Nickname" value={formData.nickname} />
                                        <ReviewItem label="Date of Birth" value={formData.dob} />
                                        <ReviewItem label="Gender" value={formData.gender} />
                                        <ReviewItem label="Marital Status" value={formData.maritalStatus} />
                                        <ReviewItem label="Blood Type" value={formData.bloodType} />
                                        <ReviewItem label="Nationality" value={formData.nationality} />
                                        <ReviewItem label="Religion" value={formData.religion} />
                                        <div className="col-span-2 border-t border-slate-100 my-2"></div>
                                        <ReviewItem label="Email" value={formData.personalEmail} />
                                        <ReviewItem label="Mobile" value={formData.mobileNumber} />
                                        <div className="col-span-2">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Address</p>
                                            <p className="font-medium text-slate-700">{formData.currentStreet}, {formData.currentBarangay}, {formData.currentCity}, {formData.currentProvince}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Employment Details Card */}
                                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                                        <Briefcase size={16} className="text-indigo-600" />
                                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Employment Information</h4>
                                    </div>
                                    <div className="p-6 grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                                        <ReviewItem label="Employee ID" value={formData.employeeId} />
                                        <ReviewItem label="Company Email" value={formData.companyEmail} />
                                        <ReviewItem label="Department" value={formData.department} />
                                        <ReviewItem label="Position" value={formData.position} />
                                        <ReviewItem label="Employment Status" value={formData.employmentStatus} />
                                        <ReviewItem label="Date Hired" value={formData.dateHired} />
                                        <ReviewItem label="Work Schedule" value={formData.workSchedule} fullWidth />
                                    </div>
                                </div>
                            </div>

                            {/* Column 2 */}
                            <div className="space-y-6">
                                {/* Compensation & Schedule Card */}
                                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                                        <DollarSign size={16} className="text-indigo-600" />
                                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Compensation & Benefits</h4>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        {scheduleForReview && (
                                            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl mb-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-0.5">Pay Schedule</span>
                                                        <span className="font-bold text-indigo-900 text-sm">{scheduleForReview.name}</span>
                                                    </div>
                                                    <span className="text-xs font-bold bg-white text-indigo-600 px-2 py-0.5 rounded border border-indigo-100">{scheduleForReview.frequency}</span>
                                                </div>
                                                <div className="flex gap-4 text-xs">
                                                    {scheduleForReview.frequency === 'Semi-Monthly' && (
                                                        <>
                                                            <div className="flex flex-col">
                                                                <span className="text-[9px] font-bold text-indigo-400 uppercase">Cutoffs</span>
                                                                <span className="text-indigo-800 font-bold">{(scheduleForReview as any).firstCutoff}th & {(scheduleForReview as any).secondCutoff}th</span>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[9px] font-bold text-indigo-400 uppercase">Payouts</span>
                                                                <span className="text-indigo-800 font-bold">{(scheduleForReview as any).firstPayDate}th & {(scheduleForReview as any).secondPayDate}th</span>
                                                            </div>
                                                        </>
                                                    )}
                                                    {scheduleForReview.frequency === 'Monthly' && (
                                                        <>
                                                            <div className="flex flex-col">
                                                                <span className="text-[9px] font-bold text-indigo-400 uppercase">Cutoff</span>
                                                                <span className="text-indigo-800 font-bold">{(scheduleForReview as any).firstCutoff}th</span>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[9px] font-bold text-indigo-400 uppercase">Payout</span>
                                                                <span className="text-indigo-800 font-bold">{(scheduleForReview as any).firstPayDate}th</span>
                                                            </div>
                                                        </>
                                                    )}
                                                    {scheduleForReview.frequency === 'Weekly' && (
                                                        <div className="flex flex-col">
                                                            <span className="text-[9px] font-bold text-indigo-400 uppercase">Payout Day</span>
                                                            <span className="text-indigo-800 font-bold">{scheduleForReview.firstPayDate}</span>
                                                        </div>
                                                    )}
                                                    {(scheduleForReview as any).divisorId && (
                                                        <div className="flex flex-col">
                                                            <span className="text-[9px] font-bold text-indigo-400 uppercase">Divisor</span>
                                                            <span className="text-indigo-800 font-bold">{MOCK_DIVISORS.find(d => d.id === (scheduleForReview as any).divisorId)?.days} Days</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <span className="text-sm font-bold text-slate-600">Basic Salary</span>
                                            <span className="text-base font-mono font-bold text-slate-900">₱{formData.customBasePay.toLocaleString()}</span>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Allowances</p>
                                            {formData.customComponents.filter(c => c.type === 'Earning').map(c => (
                                                <div key={c.id} className="flex justify-between text-sm">
                                                    <span className="text-slate-600">{c.name}</span>
                                                    <span className="font-mono font-bold text-emerald-600">+₱{c.value.toLocaleString()}</span>
                                                </div>
                                            ))}
                                            {formData.customComponents.filter(c => c.type === 'Earning').length === 0 && <p className="text-xs text-slate-400 italic">None</p>}
                                        </div>
                                        <div className="space-y-2 border-t border-slate-100 pt-2">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fixed Deductions</p>
                                            {formData.customComponents.filter(c => c.type === 'Deduction').map(c => (
                                                <div key={c.id} className="flex justify-between text-sm">
                                                    <span className="text-slate-600">{c.name}</span>
                                                    <span className="font-mono font-bold text-rose-600">-₱{c.value.toLocaleString()}</span>
                                                </div>
                                            ))}
                                            {formData.customComponents.filter(c => c.type === 'Deduction').length === 0 && <p className="text-xs text-slate-400 italic">None</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Financial & Gov Card */}
                                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                                        <FileText size={16} className="text-indigo-600" />
                                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Financial & Government</h4>
                                    </div>
                                    <div className="p-6 grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                                        <ReviewItem label="Bank Name" value={formData.bankName} />
                                        <ReviewItem label="Account Number" value={formData.accountNumber} />
                                        <ReviewItem label="TIN" value={formData.tin} />
                                        <ReviewItem label="SSS No." value={formData.sss} />
                                        <ReviewItem label="PhilHealth" value={formData.philhealth} />
                                        <ReviewItem label="Pag-IBIG" value={formData.pagibig} />
                                        <ReviewItem label="Tax Status" value={formData.taxStatus} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Other Details - Full Width */}
                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                                <GraduationCap size={16} className="text-indigo-600" />
                                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Additional Information</h4>
                            </div>
                            <div className="p-6 space-y-6">
                                <ReviewListSection title="Education" items={formData.education} render={(i: any) => `${i.attainment} - ${i.course} (${i.school})`} />
                                <ReviewListSection title="Work History" items={formData.employmentHistory} render={(i: any) => `${i.position} at ${i.company} (${i.startDate} - ${i.endDate})`} />
                                <ReviewListSection title="References" items={formData.references} render={(i: any) => `${i.firstName} ${i.lastName} - ${i.position} (${i.contactNo})`} />
                                <ReviewListSection title="Emergency Contacts" items={formData.emergencyContacts} render={(i: any) => `${i.firstName} ${i.lastName} (${i.relationship}) - ${i.contactNo}`} />
                            </div>
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="min-h-full bg-slate-50 flex items-center justify-center p-0 md:p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col md:flex-row h-[85vh] border border-slate-100"
            >
                {/* Left Sidebar - Stepper (Dark Theme) */}
                <div className="w-full md:w-80 bg-slate-900 p-8 text-white flex flex-col justify-between relative overflow-hidden shrink-0">
                    {/* Background Decor */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600 rounded-full blur-[100px] opacity-10 -ml-20 -mb-20 pointer-events-none"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-900/50">
                                <UserPlus size={24} className="text-white" />
                            </div>
                            <div>
                                <h1 className="font-bold text-lg leading-none">New Employee</h1>
                                <span className="text-[10px] text-indigo-300 font-medium uppercase tracking-widest">Onboarding Wizard</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {STEPS.map((step, idx) => (
                                <div key={step.id} className="relative group">
                                    {idx !== STEPS.length - 1 && (
                                        <div className={`absolute left-4 top-8 w-0.5 h-10 ${step.id < currentStep ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
                                    )}
                                    <div className="flex items-start gap-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 transition-all duration-500
                                        ${step.id < currentStep ? 'bg-emerald-500 border-emerald-500 text-white' :
                                                step.id === currentStep ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-900' :
                                                    'bg-slate-800 border-slate-700 text-slate-500'}`}>
                                            {step.id < currentStep ? <Check size={14} strokeWidth={3} /> : step.id}
                                        </div>
                                        <div className={`transition-opacity duration-300 ${step.id === currentStep ? 'opacity-100' : 'opacity-60'}`}>
                                            <h4 className="text-sm font-bold">{step.title}</h4>
                                            <p className="text-[10px] text-slate-400">{step.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10 text-xs text-slate-500 font-medium">
                        Step {currentStep} of 8
                    </div>
                </div>

                {/* Right Content */}
                <div className="flex-1 flex flex-col h-full bg-white relative">
                    {/* Content Header */}
                    <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-extrabold text-slate-900">{STEPS[currentStep - 1].title}</h2>
                            <p className="text-sm text-slate-500 font-medium mt-1">{STEPS[currentStep - 1].description}</p>
                        </div>
                        <div className="hidden md:block text-slate-200">
                            {STEPS[currentStep - 1].icon}
                        </div>
                    </div>

                    {/* Form Area */}
                    <div className="flex-1 px-10 py-8 overflow-y-auto">
                        <StepContent />
                    </div>

                    {/* Footer Navigation */}
                    <div className="px-10 py-6 border-t border-slate-50 flex justify-between items-center bg-white/80 backdrop-blur-sm sticky bottom-0">
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all"
                        >
                            <ArrowLeft size={16} /> {currentStep === 1 ? 'Cancel' : 'Back'}
                        </button>

                        <button
                            onClick={handleNext}
                            className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
                        >
                            {currentStep === 8 ? 'Onboard Employee' : 'Next Step'} <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// Helper Components
const ReviewItem = ({ label, value, fullWidth }: any) => (
    <div className={fullWidth ? 'col-span-2' : ''}>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="font-medium text-slate-700">{value || '-'}</p>
    </div>
);

const ReviewListSection = ({ title, items, render }: any) => (
    <div>
        <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{title}</h5>
        {items.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                {items.map((item: any, idx: number) => (
                    <li key={idx} className="leading-relaxed">{render(item)}</li>
                ))}
            </ul>
        ) : (
            <p className="text-xs text-slate-400 italic">No records provided.</p>
        )}
    </div>
);

export default NewEmployee;
