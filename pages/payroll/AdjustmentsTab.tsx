import React, { useState, useMemo } from 'react';
import {
    Search,
    ChevronRight,
    User,
    Layers,
    X,
    Plus,
    Trash2,
    Check,
    Sliders,
    DollarSign,
    Briefcase,
    AlertCircle,
    Calendar,
    CalendarCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_ADJUSTMENT_TYPES } from '../settings/AdjustmentSetup';

// Mock Employees
const MOCK_EMPLOYEES = [
    { id: 'emp-1', name: 'James Cordon', jobTitle: 'IT Developer Intern', avatar: 'JC', department: 'IT', cutoffRange: 'Mar 11 - Mar 25, 2026', payDate: 'Mar 31, 2026' },
    { id: 'emp-2', name: 'Louis Panganiban', jobTitle: 'Senior Developer', avatar: 'LP', department: 'IT', cutoffRange: 'Mar 11 - Mar 25, 2026', payDate: 'Mar 31, 2026' },
    { id: 'emp-3', name: 'Juan Dela Cruz', jobTitle: 'Senior Developer', avatar: 'JD', department: 'IT', cutoffRange: 'Mar 11 - Mar 25, 2026', payDate: 'Mar 31, 2026' },
    { id: 'emp-4', name: 'Sarah Wilson', jobTitle: 'HR Manager', avatar: 'SW', department: 'HR', cutoffRange: 'Mar 11 - Mar 25, 2026', payDate: 'Mar 31, 2026' },
    // Adding a different cutoff range for Michael to show multiple cutoff handling
    { id: 'emp-5', name: 'Michael Chang', jobTitle: 'QA Engineer', avatar: 'MC', department: 'IT', cutoffRange: 'Mar 01 - Mar 15, 2026', payDate: 'Mar 20, 2026' },
];

interface QueuedAdjustment {
    id: string;
    employeeId: string;
    employeeName: string;
    employeeAvatar: string;
    adjustmentTypeId: string;
    adjustmentName: string;
    type: 'earning' | 'deduction';
    isTaxable: boolean;
    amount: number;
    effectiveDate: string;
    // Loan specifics
    isLoan: boolean;
    loanPrincipalAmount?: number;
    loanInstallmentAmount?: number;
}

const formatCurrency = (amount: number) => {
    return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const AdjustmentsTab: React.FC = () => {
    // --- State ---
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

    // Batch Queue
    const [batchQueue, setBatchQueue] = useState<QueuedAdjustment[]>([]);

    // Form State
    const [adjustmentForm, setAdjustmentForm] = useState({
        adjustmentTypeId: '',
        name: '',
        type: 'earning' as 'earning' | 'deduction',
        isTaxable: false,
        amount: 0,
        effectiveDate: new Date().toISOString().split('T')[0],
        deductionCategory: '', // 'loan', 'standard', etc.
        loanPrincipalAmount: 0,
        loanInstallmentAmount: 0,
        loanStartDate: '',
        loanEndDate: ''
    });

    const filteredEmployees = useMemo(() => {
        if (!searchTerm) return MOCK_EMPLOYEES;
        return MOCK_EMPLOYEES.filter(emp =>
            emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    // Cutoff Reference Logic
    const activeCutoffReference = useMemo(() => {
        if (selectedEmployees.length === 0) return null;

        const selected = MOCK_EMPLOYEES.filter(e => selectedEmployees.includes(e.id));
        const first = selected[0];

        const isSame = selected.every(e => e.cutoffRange === first.cutoffRange && e.payDate === first.payDate);

        if (isSame) {
            return { cutoffRange: first.cutoffRange, payDate: first.payDate, isMultiple: false };
        } else {
            return { isMultiple: true };
        }
    }, [selectedEmployees]);

    // --- Handlers ---
    const toggleEmployeeSelection = (id: string) => {
        if (selectedEmployees.includes(id)) {
            setSelectedEmployees(selectedEmployees.filter(empId => empId !== id));
        } else {
            setSelectedEmployees([...selectedEmployees, id]);
        }
    };

    const handleSelectAll = () => {
        if (selectedEmployees.length === filteredEmployees.length) {
            setSelectedEmployees([]);
        } else {
            setSelectedEmployees(filteredEmployees.map(e => e.id));
        }
    };

    const handleAdjustmentTypeSelect = (id: string) => {
        const adj = MOCK_ADJUSTMENT_TYPES.find(a => a.id === id);
        if (adj) {
            setAdjustmentForm({
                ...adjustmentForm,
                adjustmentTypeId: id,
                name: adj.name,
                type: adj.category === 'Earning' ? 'earning' : 'deduction',
                isTaxable: adj.isTaxable || false,
                amount: 0 // Reset amount when changing type
            });
        } else {
            setAdjustmentForm({
                ...adjustmentForm,
                adjustmentTypeId: '',
                name: '',
                amount: 0
            });
        }
    };

    const handleAddToBatch = () => {
        if (selectedEmployees.length === 0 || !adjustmentForm.adjustmentTypeId || adjustmentForm.amount <= 0) {
            if (adjustmentForm.deductionCategory !== 'loan' || adjustmentForm.loanInstallmentAmount <= 0) {
                return;
            }
        }

        const isLoan = adjustmentForm.type === 'deduction' && adjustmentForm.deductionCategory === 'loan';
        const activeAmount = isLoan ? adjustmentForm.loanInstallmentAmount : adjustmentForm.amount;

        const newItems: QueuedAdjustment[] = selectedEmployees.map(empId => {
            const emp = MOCK_EMPLOYEES.find(e => e.id === empId)!;
            return {
                id: Math.random().toString(36).substr(2, 9),
                employeeId: emp.id,
                employeeName: emp.name,
                employeeAvatar: emp.avatar,
                adjustmentTypeId: adjustmentForm.adjustmentTypeId,
                adjustmentName: adjustmentForm.name,
                type: adjustmentForm.type,
                isTaxable: adjustmentForm.isTaxable,
                amount: activeAmount,
                effectiveDate: adjustmentForm.effectiveDate,
                isLoan,
                loanPrincipalAmount: isLoan ? adjustmentForm.loanPrincipalAmount : undefined,
                loanInstallmentAmount: isLoan ? adjustmentForm.loanInstallmentAmount : undefined,
            };
        });

        setBatchQueue([...batchQueue, ...newItems]);

        // Reset selection and form amount after adding
        setSelectedEmployees([]);
        setAdjustmentForm({
            ...adjustmentForm,
            amount: 0,
            loanPrincipalAmount: 0,
            loanInstallmentAmount: 0,
        });
    };

    const handleRemoveFromQueue = (id: string) => {
        setBatchQueue(batchQueue.filter(item => item.id !== id));
    };

    const handleProcessBatch = () => {
        alert(`Successfully processed ${batchQueue.length} adjustment(s)!`);
        setBatchQueue([]);
    };

    const totalEarnings = batchQueue.filter(i => i.type === 'earning').reduce((acc, i) => acc + i.amount, 0);
    const totalDeductions = batchQueue.filter(i => i.type === 'deduction').reduce((acc, i) => acc + i.amount, 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-220px)] min-h-[750px] bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100/60"
        >
            {/* Left Panel: Employee Selection */}
            <div className="w-full lg:w-[35%] bg-white border border-slate-200/60 rounded-3xl overflow-hidden flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative">
                <div className="p-6 border-b border-slate-100 bg-white z-10 relative">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                                <User size={18} strokeWidth={2.5} />
                            </div>
                            Select Employees
                        </h3>
                    </div>

                    <div className="relative mb-4 group">
                        <input
                            type="text"
                            placeholder="Find by name or role..."
                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-400 placeholder:font-medium shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    </div>

                    <div className="flex justify-between items-center px-1">
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-black text-white bg-indigo-600 px-2.5 py-1 rounded-lg uppercase tracking-widest shadow-sm shadow-indigo-200">
                                {selectedEmployees.length}
                            </span>
                            <span className="text-xs font-bold text-slate-500">Selected</span>
                        </div>
                        <button
                            onClick={handleSelectAll}
                            className="text-[11px] font-bold text-slate-500 hover:text-indigo-600 uppercase tracking-widest transition-colors bg-slate-50 hover:bg-indigo-50 px-3 py-1.5 rounded-lg"
                        >
                            {selectedEmployees.length === filteredEmployees.length ? 'Deselect All' : 'Select All'}
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50/50 relative">
                    {/* Top gradient blur for smooth scrolling */}
                    <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-slate-50/50 to-transparent z-10 pointer-events-none" />

                    {filteredEmployees.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 px-6 text-center">
                            <div className="w-16 h-16 bg-white border border-slate-200 rounded-full flex items-center justify-center mb-4 text-slate-300 shadow-sm">
                                <Search size={24} />
                            </div>
                            <h4 className="text-sm font-bold text-slate-600 mb-1">No employees found</h4>
                            <p className="text-xs text-slate-500">Try adjusting your search criteria</p>
                        </div>
                    ) : (
                        filteredEmployees.map(emp => {
                            const isSelected = selectedEmployees.includes(emp.id);
                            return (
                                <motion.div
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    key={emp.id}
                                    onClick={() => toggleEmployeeSelection(emp.id)}
                                    className={`p-3.5 rounded-2xl cursor-pointer transition-all flex items-center gap-4 border-2 ${isSelected ? 'bg-indigo-50/50 border-indigo-500 shadow-sm' : 'bg-white border-transparent hover:border-slate-200 shadow-sm'}`}
                                >
                                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors shrink-0 ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white'}`}>
                                        <AnimatePresence>
                                            {isSelected && (
                                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                                    <Check size={12} className="text-white" strokeWidth={4} />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200 shrink-0">
                                        {emp.avatar}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className={`text-sm font-bold truncate transition-colors ${isSelected ? 'text-indigo-900' : 'text-slate-900'}`}>{emp.name}</h4>
                                        <p className="text-xs text-slate-500 truncate flex items-center gap-1.5 mt-0.5"><Briefcase size={12} className="text-slate-400" />{emp.jobTitle}</p>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Right Panel: Scrollable Container for both Configuration & Queue */}
            <div className="flex-1 overflow-y-auto h-full pr-2 pb-2 custom-scrollbar flex flex-col gap-6">

                {/* Top: Adjustment Configuration */}
                <div className="bg-white border border-slate-200/60 rounded-3xl p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] shrink-0 flex flex-col relative w-full">
                    <h3 className="text-lg font-extrabold text-slate-900 mb-6 flex items-center gap-3">
                        <div className="p-2.5 bg-amber-50 text-amber-500 rounded-xl shadow-[inset_0_2px_4px_rgba(245,158,11,0.1)]">
                            <Sliders size={20} />
                        </div>
                        Configure Adjustment
                    </h3>

                    <div className="space-y-6">
                        {/* Adjustment Selection */}
                        <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/60 focus-within:ring-4 ring-indigo-500/10 focus-within:border-indigo-300 transition-all">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                Adjustment Component
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full bg-white border border-slate-200 pl-4 pr-10 py-3.5 rounded-xl outline-none focus:border-indigo-500 text-sm font-bold text-slate-900 cursor-pointer shadow-sm appearance-none transition-all"
                                    value={adjustmentForm.adjustmentTypeId}
                                    onChange={(e) => handleAdjustmentTypeSelect(e.target.value)}
                                >
                                    <option value="" disabled>Select an adjustment type...</option>
                                    {MOCK_ADJUSTMENT_TYPES.map(adj => (
                                        <option key={adj.id} value={adj.id}>
                                            {adj.name} — ({adj.category})
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <ChevronRight size={16} className="rotate-90" />
                                </div>
                            </div>
                        </div>

                        {/* Config Summary Cards */}
                        <div className="flex gap-4">
                            <div className={`flex-1 flex flex-col justify-center items-center gap-1.5 p-3 border rounded-2xl w-full bg-slate-50/50 opacity-90 transition-colors ${adjustmentForm.type ? (adjustmentForm.type === 'earning' ? 'border-emerald-200/60 shadow-sm bg-emerald-50/30' : 'border-rose-200/60 shadow-sm bg-rose-50/30') : 'border-slate-200'}`}>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</span>
                                <div className="flex items-center gap-1.5">
                                    <div className={`w-2 h-2 rounded-full shadow-sm ${adjustmentForm.type === 'earning' ? 'bg-emerald-500' : adjustmentForm.type === 'deduction' ? 'bg-rose-500' : 'bg-slate-300'}`} />
                                    <span className={`text-sm font-bold capitalize ${adjustmentForm.type === 'earning' ? 'text-emerald-700' : adjustmentForm.type === 'deduction' ? 'text-rose-700' : 'text-slate-500'}`}>{adjustmentForm.type || '--'}</span>
                                </div>
                            </div>
                            <div className={`flex-1 flex flex-col justify-center items-center gap-1.5 p-3 border rounded-2xl w-full bg-slate-50/50 opacity-90 transition-colors ${adjustmentForm.isTaxable ? 'border-amber-200/60 shadow-sm bg-amber-50/30' : 'border-slate-200'}`}>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tax</span>
                                <div className="flex items-center gap-1.5">
                                    {adjustmentForm.isTaxable ? (
                                        <span className="text-sm font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-100">Taxable</span>
                                    ) : (
                                        <span className="text-sm font-bold text-slate-500">Non-Taxable</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Scheduling & Effective Date Box */}
                        <div className="border border-slate-200/60 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 rounded-2xl p-5 bg-white shadow-sm transition-all flex flex-col gap-4">
                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2.5">Effective Date</label>
                                <input
                                    type="date"
                                    className="w-full bg-slate-50/50 border border-slate-200/80 px-4 py-3 rounded-xl text-base font-bold text-slate-900 outline-none hover:bg-slate-50 focus:bg-white focus:border-indigo-500 transition-all cursor-pointer"
                                    value={adjustmentForm.effectiveDate}
                                    onChange={e => setAdjustmentForm({ ...adjustmentForm, effectiveDate: e.target.value })}
                                />
                            </div>

                            <AnimatePresence>
                                {activeCutoffReference && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                        animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                        className="pt-4 border-t border-slate-100"
                                    >
                                        {!activeCutoffReference.isMultiple ? (
                                            <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between bg-indigo-50/50 rounded-xl p-4 border border-indigo-100/60 w-full overflow-hidden">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2.5 bg-white rounded-lg border border-indigo-100/60 text-indigo-600 shadow-sm shrink-0">
                                                        <Calendar size={18} strokeWidth={2.5} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500/80 mb-0.5">Active Cutoff Range</p>
                                                        <p className="text-sm font-bold text-indigo-900 truncate max-w-[150px] sm:max-w-[180px] md:max-w-full">{activeCutoffReference.cutoffRange}</p>
                                                    </div>
                                                </div>
                                                <div className="h-10 w-px bg-indigo-200/60 hidden xl:block shrink-0" />
                                                <div className="flex items-center gap-3 pr-2">
                                                    <div className="p-2.5 bg-white rounded-lg border border-emerald-100/60 text-emerald-600 shadow-sm shrink-0">
                                                        <CalendarCheck size={18} strokeWidth={2.5} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-0.5">Target Pay Date</p>
                                                        <p className="text-sm font-bold text-emerald-800">{activeCutoffReference.payDate}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3 bg-amber-50/50 rounded-xl p-4 border border-amber-100/60">
                                                <div className="p-2.5 bg-white rounded-lg border border-amber-100/60 text-amber-500 shadow-sm shrink-0">
                                                    <AlertCircle size={18} strokeWidth={2.5} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-amber-900">Multiple Cutoffs Detected</p>
                                                    <p className="text-[11px] font-medium text-amber-700/80 mt-0.5">Selected employees have different cutoff ranges or pay dates. Adjustments may apply on varying schedules.</p>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Amount or Loan Configuration */}
                        {adjustmentForm.type === 'deduction' && (
                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2.5">
                                    Deduction Class
                                </label>
                                <div className="relative">
                                    <select
                                        className="w-full bg-white border border-slate-200 pl-4 pr-10 py-3.5 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-sm font-bold shadow-sm appearance-none transition-all"
                                        value={adjustmentForm.deductionCategory}
                                        onChange={(e) => setAdjustmentForm({ ...adjustmentForm, deductionCategory: e.target.value })}
                                    >
                                        <option value="">Standard Deduction</option>
                                        <option value="loan">Company Loan</option>
                                        <option value="government">Government Mandated</option>
                                        <option value="other">Other Setup</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <ChevronRight size={16} className="rotate-90" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {adjustmentForm.deductionCategory === 'loan' ? (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="border border-indigo-100 bg-indigo-50/40 p-5 rounded-2xl shadow-[inset_0_2px_10px_rgba(99,102,241,0.02)] mt-4">
                                <div className="text-xs font-black text-indigo-700 uppercase tracking-widest flex items-center gap-2 mb-4">
                                    <Briefcase size={14} /> Loan Repayment Config
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-2">Total Principal Amount</label>
                                        <div className="relative group">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 group-focus-within:text-indigo-500 transition-colors">₱</span>
                                            <input
                                                type="number"
                                                className="w-full bg-white border border-slate-200 pl-9 pr-4 py-3 rounded-xl text-base font-bold shadow-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900"
                                                value={adjustmentForm.loanPrincipalAmount || ''}
                                                placeholder="0.00"
                                                onChange={(e) => setAdjustmentForm({ ...adjustmentForm, loanPrincipalAmount: Number(e.target.value) })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-2">Installment per Cutoff</label>
                                        <div className="relative group">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 group-focus-within:text-indigo-500 transition-colors">₱</span>
                                            <input
                                                type="number"
                                                className="w-full bg-white border border-slate-200 pl-9 pr-4 py-3 rounded-xl text-base font-bold shadow-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-rose-600"
                                                value={adjustmentForm.loanInstallmentAmount || ''}
                                                placeholder="0.00"
                                                onChange={(e) => setAdjustmentForm({ ...adjustmentForm, loanInstallmentAmount: Number(e.target.value) })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="pt-2">
                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2.5">Input Amount</label>
                                <div className="relative group">
                                    <div className={`absolute left-5 top-1/2 -translate-y-1/2 text-lg font-black transition-colors ${adjustmentForm.type === 'earning' ? 'text-emerald-500 group-focus-within:text-emerald-600' : 'text-rose-500 group-focus-within:text-rose-600'}`}>
                                        ₱
                                    </div>
                                    <input
                                        type="number"
                                        min="0"
                                        className={`w-full bg-white border border-slate-200 pl-11 pr-4 py-4 rounded-2xl text-2xl font-black outline-none focus:ring-4 transition-all shadow-sm ${adjustmentForm.type === 'earning' ? 'text-emerald-700 bg-emerald-50/10 focus:ring-emerald-500/10 focus:border-emerald-400' : adjustmentForm.type === 'deduction' ? 'text-rose-700 bg-rose-50/10 focus:ring-rose-500/10 focus:border-rose-400' : 'text-slate-900 bg-slate-50/50'}`}
                                        placeholder="0.00"
                                        value={adjustmentForm.amount || ''}
                                        onChange={(e) => setAdjustmentForm({ ...adjustmentForm, amount: parseFloat(e.target.value) })}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="pt-4 pb-1">
                            <button
                                onClick={handleAddToBatch}
                                disabled={selectedEmployees.length === 0 || !adjustmentForm.adjustmentTypeId || (adjustmentForm.deductionCategory === 'loan' ? adjustmentForm.loanInstallmentAmount <= 0 : adjustmentForm.amount <= 0)}
                                className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-[0_8px_20px_rgb(15,23,42,0.15)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none hover:-translate-y-0.5"
                            >
                                Queue {selectedEmployees.length > 0 ? `${selectedEmployees.length} ` : ''}Adjustments <Plus size={18} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom: Batch Queue List */}
                <div className="bg-white border border-slate-200/60 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col shrink-0 min-h-[300px]">
                    <div className="px-6 py-5 border-b border-slate-100 bg-white rounded-t-3xl flex justify-between items-center shrink-0 z-10 sticky top-0">
                        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2.5">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                <Layers size={16} strokeWidth={2.5} />
                            </div>
                            Batch Queue
                            <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full ml-1">
                                {batchQueue.length}
                            </span>
                        </h3>
                        {batchQueue.length > 0 && (
                            <div className="flex gap-3">
                                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 shadow-sm">
                                    + {formatCurrency(totalEarnings)}
                                </span>
                                <span className="text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100 shadow-sm">
                                    - {formatCurrency(totalDeductions)}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="p-4 bg-slate-50/50 flex-1">
                        <AnimatePresence>
                            {batchQueue.length === 0 ? (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full min-h-[150px] flex flex-col items-center justify-center text-slate-400">
                                    <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mb-4 text-slate-300 shadow-sm">
                                        <Layers size={24} />
                                    </div>
                                    <p className="text-sm font-bold text-slate-600">Queue is empty</p>
                                    <p className="text-xs font-medium mt-1">Select employees and configure an adjustment above to batch them here.</p>
                                </motion.div>
                            ) : (
                                <div className="space-y-3">
                                    {batchQueue.map((item) => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                                            key={item.id}
                                            className="flex items-center justify-between p-4 bg-white border border-slate-200/80 rounded-xl shadow-[0_2px_8px_rgb(0,0,0,0.02)] hover:border-indigo-200/80 hover:shadow-[0_4px_12px_rgb(99,102,241,0.05)] transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0 border border-slate-200">
                                                    {item.employeeAvatar}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-sm font-bold text-slate-900 truncate mb-1">{item.employeeName}</div>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${item.type === 'earning' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                                            {item.type === 'earning' ? 'Earning' : 'Deduction'}
                                                        </span>
                                                        <span className="text-[11px] font-bold text-slate-600 truncate max-w-[150px]">{item.adjustmentName}</span>
                                                        {item.isLoan && <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200 text-[9px] font-black uppercase tracking-widest">Loan Inst.</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-5 pl-4 shrink-0">
                                                <span className={`font-mono font-black text-base tracking-tight ${item.type === 'earning' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                    {item.type === 'earning' ? '+' : '-'}{formatCurrency(item.amount)}
                                                </span>
                                                <button
                                                    onClick={() => handleRemoveFromQueue(item.id)}
                                                    className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none"
                                                    title="Remove from queue"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="p-5 border-t border-slate-100 bg-white/90 backdrop-blur-md rounded-b-3xl shrink-0 z-10 sticky bottom-0">
                        <button
                            onClick={handleProcessBatch}
                            disabled={batchQueue.length === 0}
                            className="w-full flex items-center justify-center gap-2.5 py-4 bg-indigo-600 text-white rounded-2xl text-sm font-extrabold hover:bg-indigo-700 transition-all shadow-[0_8px_20px_rgb(79,70,229,0.25)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none hover:-translate-y-0.5"
                        >
                            Process Batch & Commit <Check size={18} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AdjustmentsTab;
