
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Building2, 
  Briefcase, 
  Clock, 
  User, 
  LayoutGrid,
  Shield,
  Upload,
  Plus,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Steps Configuration
const STEPS = [
  { id: 1, title: 'System Setup', icon: <Shield size={18} />, description: 'Define roles & permissions' },
  { id: 2, title: 'Company Setup', icon: <Building2 size={18} />, description: 'Organization details' },
  { id: 3, title: 'Pay Structure', icon: <Briefcase size={18} />, description: 'Salary & tax config' },
  { id: 4, title: 'Timekeeping', icon: <Clock size={18} />, description: 'Shifts & leave policies' },
  { id: 5, title: 'User Setup', icon: <User size={18} />, description: 'Create superadmin' },
];

const NewOrganization: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // System
    enabledModules: ['Core HR', 'Payroll', 'Timekeeping'],
    auditEnabled: true,
    // Company
    companyName: '',
    industry: 'Technology',
    departments: ['HR', 'IT', 'Finance'],
    // Pay
    currency: 'PHP',
    payFrequency: 'Semi-Monthly',
    // Time
    defaultShiftStart: '09:00',
    defaultShiftEnd: '18:00',
    workDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    // User
    adminName: '',
    adminEmail: '',
    adminPassword: ''
  });

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
    else handleSubmit();
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
    else navigate('/login');
  };

  const handleSubmit = () => {
    // Simulate API submission
    setTimeout(() => {
        alert("Organization Created! Redirecting to login...");
        navigate('/login');
    }, 1000);
  };

  const StepContent = () => {
    switch (currentStep) {
        case 1:
            return (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 max-w-4xl mx-auto">
                    <div className="bg-indigo-50 border border-indigo-100 p-8 rounded-2xl flex items-start gap-5">
                        <div className="p-4 bg-white rounded-xl shadow-sm text-indigo-600">
                            <LayoutGrid size={28} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-indigo-900">Module Configuration</h3>
                            <p className="text-indigo-700 mt-2 leading-relaxed">Select the core modules you want to enable for your workspace. These can be changed later in the system settings.</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {['Core HR', 'Payroll', 'Timekeeping'].map(mod => (
                            <label key={mod} className={`flex items-center p-5 border rounded-2xl cursor-pointer transition-all ${formData.enabledModules.includes(mod) ? 'border-indigo-500 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-500' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
                                <input 
                                    type="checkbox" 
                                    className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    checked={formData.enabledModules.includes(mod)}
                                    onChange={(e) => {
                                        const newMods = e.target.checked 
                                            ? [...formData.enabledModules, mod]
                                            : formData.enabledModules.filter(m => m !== mod);
                                        setFormData({...formData, enabledModules: newMods});
                                    }}
                                />
                                <span className={`ml-4 font-bold text-lg ${formData.enabledModules.includes(mod) ? 'text-indigo-900' : 'text-slate-600'}`}>{mod}</span>
                            </label>
                        ))}
                    </div>

                    <div className="border-t border-slate-100 pt-8">
                        <h4 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider">Default Security Roles</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { name: 'Superadmin', desc: 'Full system access.' },
                                { name: 'HR Admin', desc: 'Manage employees & payroll.' },
                                { name: 'Employee', desc: 'Self-service portal access.' }
                            ].map(role => (
                                <div key={role.name} className="flex flex-col gap-2 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                                    <div className="flex justify-between items-start">
                                        <Shield size={20} className="text-indigo-500" />
                                        <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold uppercase tracking-wide">Auto</span>
                                    </div>
                                    <div className="mt-2">
                                        <div className="text-base font-bold text-slate-800">{role.name}</div>
                                        <div className="text-xs text-slate-500 mt-1">{role.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        case 2: 
            return (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 max-w-3xl mx-auto">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Company Name</label>
                            <input 
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-slate-900 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-300"
                                placeholder="e.g. Acme Corp"
                                value={formData.companyName}
                                onChange={e => setFormData({...formData, companyName: e.target.value})}
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Industry</label>
                            <select 
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-900 focus:ring-2 focus:ring-indigo-100 outline-none transition-all cursor-pointer"
                                value={formData.industry}
                                onChange={e => setFormData({...formData, industry: e.target.value})}
                            >
                                <option>Technology</option>
                                <option>Finance</option>
                                <option>Healthcare</option>
                                <option>Retail</option>
                                <option>Manufacturing</option>
                            </select>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-8">
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Initial Departments</label>
                            <button className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors" onClick={() => setFormData({...formData, departments: [...formData.departments, 'New Dept']})}>
                                <Plus size={14} /> Add Department
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {formData.departments.map((dept, idx) => (
                                <div key={idx} className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm group hover:border-indigo-200 hover:shadow-md transition-all">
                                    <span className="text-sm font-bold text-slate-700">{dept}</span>
                                    <button 
                                        onClick={() => setFormData({...formData, departments: formData.departments.filter((_, i) => i !== idx)})}
                                        className="text-slate-300 hover:text-rose-500 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl border-2 border-slate-200 border-dashed p-12 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-100 hover:border-indigo-300 hover:text-indigo-500 transition-all cursor-pointer group">
                        <div className="p-4 bg-white rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                            <Upload size={32} />
                        </div>
                        <span className="text-sm font-bold">Upload Company Logo</span>
                        <span className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</span>
                    </div>
                </div>
            );
        case 3:
            return (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 max-w-4xl mx-auto">
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Base Currency</label>
                            <select 
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-900 focus:ring-2 focus:ring-indigo-100 outline-none"
                                value={formData.currency}
                                onChange={e => setFormData({...formData, currency: e.target.value})}
                            >
                                <option value="PHP">PHP (Philippine Peso)</option>
                                <option value="USD">USD (US Dollar)</option>
                                <option value="SGD">SGD (Singapore Dollar)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Pay Frequency</label>
                            <select 
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-900 focus:ring-2 focus:ring-indigo-100 outline-none"
                                value={formData.payFrequency}
                                onChange={e => setFormData({...formData, payFrequency: e.target.value})}
                            >
                                <option>Semi-Monthly</option>
                                <option>Monthly</option>
                                <option>Weekly</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                        <h4 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Briefcase size={20} className="text-indigo-600" /> Default Components
                        </h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    <span className="text-sm font-bold text-emerald-900">Basic Salary</span>
                                </div>
                                <span className="text-xs font-bold bg-white px-3 py-1.5 rounded-lg text-emerald-600 shadow-sm border border-emerald-100">Fixed Amount</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    <span className="text-sm font-bold text-emerald-900">Overtime Pay</span>
                                </div>
                                <span className="text-xs font-bold bg-white px-3 py-1.5 rounded-lg text-emerald-600 shadow-sm border border-emerald-100">Standard Formula</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-rose-50 border border-rose-100 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                    <span className="text-sm font-bold text-rose-900">Tax Deduction</span>
                                </div>
                                <span className="text-xs font-bold bg-white px-3 py-1.5 rounded-lg text-rose-600 shadow-sm border border-rose-100">Graduated Table</span>
                            </div>
                        </div>
                        <div className="mt-6 p-4 bg-slate-50 rounded-xl text-center border border-slate-100">
                            <p className="text-xs text-slate-500">You can configure complex formulas, custom allowances, and tiered tax tables later in System Settings.</p>
                        </div>
                    </div>
                </div>
            );
        case 4:
            return (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 max-w-4xl mx-auto">
                    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Clock size={20} className="text-indigo-600"/> Default Shift Schedule
                            </h4>
                            <div className="text-xs bg-slate-100 px-3 py-1.5 rounded-lg font-bold text-slate-500 uppercase tracking-wide">Global Default</div>
                        </div>
                        <div className="grid grid-cols-2 gap-8 mb-8">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Start Time</label>
                                <input type="time" className="w-full border p-3 rounded-xl font-bold text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 ring-indigo-100 bg-slate-50 text-lg" value={formData.defaultShiftStart} onChange={e => setFormData({...formData, defaultShiftStart: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2">End Time</label>
                                <input type="time" className="w-full border p-3 rounded-xl font-bold text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 ring-indigo-100 bg-slate-50 text-lg" value={formData.defaultShiftEnd} onChange={e => setFormData({...formData, defaultShiftEnd: e.target.value})} />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-3">Work Days</label>
                            <div className="flex gap-3">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                    <button 
                                        key={day}
                                        onClick={() => {
                                            const newDays = formData.workDays.includes(day) 
                                                ? formData.workDays.filter(d => d !== day)
                                                : [...formData.workDays, day];
                                            setFormData({...formData, workDays: newDays});
                                        }}
                                        className={`w-12 h-12 rounded-xl text-xs font-bold transition-all ${formData.workDays.includes(day) ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                    >
                                        {day.substring(0,3)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="p-6 border border-emerald-200 bg-emerald-50/50 rounded-2xl flex items-center justify-between">
                            <div>
                                <h5 className="font-bold text-emerald-900 text-base mb-1">Vacation Leave</h5>
                                <p className="text-xs text-emerald-700">Standard annual allocation</p>
                            </div>
                            <div className="text-2xl font-bold text-emerald-600">15 <span className="text-xs text-emerald-400 font-medium uppercase">Days</span></div>
                        </div>
                        <div className="p-6 border border-rose-200 bg-rose-50/50 rounded-2xl flex items-center justify-between">
                            <div>
                                <h5 className="font-bold text-rose-900 text-base mb-1">Sick Leave</h5>
                                <p className="text-xs text-rose-700">Standard annual allocation</p>
                            </div>
                            <div className="text-2xl font-bold text-rose-600">10 <span className="text-xs text-rose-400 font-medium uppercase">Days</span></div>
                        </div>
                    </div>
                </div>
            );
        case 5:
            return (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 max-w-md mx-auto">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6 text-white shadow-2xl shadow-indigo-200 ring-8 ring-slate-50">
                            <User size={40} />
                        </div>
                        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Superadmin</h3>
                        <p className="text-slate-500 mt-2">This user will have full access to the organization configuration.</p>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Full Name</label>
                            <input 
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                placeholder="John Doe"
                                value={formData.adminName}
                                onChange={e => setFormData({...formData, adminName: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
                            <input 
                                type="email"
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                placeholder="john@company.com"
                                value={formData.adminEmail}
                                onChange={e => setFormData({...formData, adminEmail: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Password</label>
                            <input 
                                type="password"
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                placeholder="••••••••"
                                value={formData.adminPassword}
                                onChange={e => setFormData({...formData, adminPassword: e.target.value})}
                            />
                        </div>
                    </div>
                </div>
            );
        default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        {/* Main Card */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-[1600px] bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 overflow-hidden flex flex-col md:flex-row h-[90vh] border border-slate-100"
        >
            {/* Left Sidebar - Stepper */}
            <div className="w-full md:w-96 bg-slate-900 p-10 text-white flex flex-col justify-between relative overflow-hidden shrink-0">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600 rounded-full blur-[120px] opacity-20 -mr-20 -mt-20 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-600 rounded-full blur-[120px] opacity-10 -ml-20 -mb-20 pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-900/50">
                            <ShieldCheck size={28} className="text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-xl leading-none">HRIS</h1>
                            <span className="text-xs text-indigo-300 font-medium uppercase tracking-widest mt-1 block">Onboarding Wizard</span>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {STEPS.map((step, idx) => (
                            <div key={step.id} className="relative group">
                                {idx !== STEPS.length - 1 && (
                                    <div className={`absolute left-5 top-10 w-0.5 h-12 ${step.id < currentStep ? 'bg-emerald-500' : 'bg-slate-800'}`}></div>
                                )}
                                <div className="flex items-start gap-5">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 transition-all duration-500
                                        ${step.id < currentStep ? 'bg-emerald-500 border-emerald-500 text-white' : 
                                          step.id === currentStep ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-900 scale-110' : 
                                          'bg-slate-800 border-slate-700 text-slate-500'}`}>
                                        {step.id < currentStep ? <Check size={16} strokeWidth={3} /> : <span className="text-sm font-bold">{step.id}</span>}
                                    </div>
                                    <div className={`transition-opacity duration-300 ${step.id === currentStep ? 'opacity-100' : 'opacity-60'}`}>
                                        <h4 className="text-base font-bold xl:text-lg">{step.title}</h4>
                                        <p className="text-xs text-slate-400 mt-1">{step.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 text-xs text-slate-500 font-medium">
                    © 2025 HRIS Platform
                </div>
            </div>

            {/* Right Content */}
            <div className="flex-1 flex flex-col h-full bg-white relative">
                {/* Content Header */}
                <div className="px-12 py-10 border-b border-slate-50 flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{STEPS[currentStep - 1].title}</h2>
                        <p className="text-slate-500 font-medium mt-2 text-lg">Step {currentStep} of 5</p>
                    </div>
                    <div className="hidden md:block">
                        <div className="p-4 bg-slate-50 rounded-2xl text-slate-400">
                            {STEPS[currentStep - 1].icon}
                        </div>
                    </div>
                </div>

                {/* Form Area */}
                <div className="flex-1 px-12 py-10 overflow-y-auto">
                    <StepContent />
                </div>

                {/* Footer Navigation */}
                <div className="px-12 py-8 border-t border-slate-50 flex justify-between items-center bg-white/80 backdrop-blur-sm sticky bottom-0">
                    <button 
                        onClick={handleBack}
                        className="flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all"
                    >
                        <ArrowLeft size={18} /> {currentStep === 1 ? 'Cancel' : 'Back'}
                    </button>
                    
                    <button 
                        onClick={handleNext}
                        className="flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold text-base hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
                    >
                        {currentStep === 5 ? 'Complete Setup' : 'Next Step'} <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </motion.div>
    </div>
  );
};

export default NewOrganization;
