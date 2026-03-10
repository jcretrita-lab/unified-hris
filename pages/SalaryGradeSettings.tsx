
import React, { useState } from 'react';
import {
    Plus,
    Trash2,
    Check,
    X,
    ToggleLeft,
    ToggleRight,
    TrendingUp,
    Save,
    Edit2,
    Eye,
    EyeOff,
    LayoutGrid
} from 'lucide-react';
import { SalaryGrade, SalaryStep } from '../types';
import Modal from '../components/Modal';

// Mock Data
const INITIAL_GRADES: SalaryGrade[] = [
    {
        id: 'sg-01',
        code: 'SG-01',
        name: 'Entry Level I',
        type: 'RANGE',
        minSalary: 15000,
        maxSalary: 21000,
        currency: 'PHP',
        steps: [
            { id: 's1', name: 'Step 1', amount: 15000 },
            { id: 's2', name: 'Step 2', amount: 16500 },
            { id: 's3', name: 'Step 3', amount: 18000 },
            { id: 's4', name: 'Step 4', amount: 19500 },
            { id: 's5', name: 'Step 5', amount: 21000 },
        ]
    },
    {
        id: 'sg-02',
        code: 'SG-02',
        name: 'Entry Level II',
        type: 'RANGE',
        minSalary: 21000,
        maxSalary: 26000,
        currency: 'PHP',
        steps: [
            { id: 's1', name: 'Step 1', amount: 21000 },
            { id: 's2', name: 'Step 2', amount: 22500 },
            { id: 's3', name: 'Step 3', amount: 24000 },
            { id: 's4', name: 'Step 4', amount: 26000 },
        ]
    },
    {
        id: 'sg-03',
        code: 'SG-03',
        name: 'Junior Associate',
        type: 'RANGE',
        minSalary: 26000,
        maxSalary: 33000,
        currency: 'PHP',
        steps: [
            { id: 's1', name: 'Step 1', amount: 26000 },
            { id: 's2', name: 'Step 2', amount: 28000 },
            { id: 's3', name: 'Step 3', amount: 30000 },
            { id: 's4', name: 'Step 4', amount: 33000 },
        ]
    },
    {
        id: 'sg-04',
        code: 'SG-04',
        name: 'Associate',
        type: 'RANGE',
        minSalary: 33000,
        maxSalary: 42000,
        currency: 'PHP',
        steps: [
            { id: 's1', name: 'Step 1', amount: 33000 },
            { id: 's2', name: 'Step 2', amount: 36000 },
            { id: 's3', name: 'Step 3', amount: 39000 },
            { id: 's4', name: 'Step 4', amount: 42000 },
        ]
    },
    {
        id: 'sg-05',
        code: 'SG-05',
        name: 'Senior Associate',
        type: 'RANGE',
        minSalary: 42000,
        maxSalary: 57000,
        currency: 'PHP',
        steps: [
            { id: 's1', name: 'Step 1', amount: 42000 },
            { id: 's2', name: 'Step 2', amount: 46000 },
            { id: 's3', name: 'Step 3', amount: 50000 },
            { id: 's4', name: 'Step 4', amount: 54000 },
            { id: 's5', name: 'Step 5', amount: 57000 },
        ]
    },
    {
        id: 'sg-06',
        code: 'SG-06',
        name: 'Specialist I',
        type: 'RANGE',
        minSalary: 57000,
        maxSalary: 72000,
        currency: 'PHP',
        steps: [
            { id: 's1', name: 'Step 1', amount: 57000 },
            { id: 's2', name: 'Step 2', amount: 62000 },
            { id: 's3', name: 'Step 3', amount: 67000 },
            { id: 's4', name: 'Step 4', amount: 72000 },
        ]
    },
    {
        id: 'sg-07',
        code: 'SG-07',
        name: 'Specialist II',
        type: 'RANGE',
        minSalary: 72000,
        maxSalary: 95000,
        currency: 'PHP',
        steps: [
            { id: 's1', name: 'Step 1', amount: 72000 },
            { id: 's2', name: 'Step 2', amount: 80000 },
            { id: 's3', name: 'Step 3', amount: 88000 },
            { id: 's4', name: 'Step 4', amount: 95000 },
        ]
    },
    {
        id: 'sg-08',
        code: 'SG-08',
        name: 'Senior Specialist',
        type: 'RANGE',
        minSalary: 95000,
        maxSalary: 120000,
        currency: 'PHP',
        steps: [
            { id: 's1', name: 'Step 1', amount: 95000 },
            { id: 's2', name: 'Step 2', amount: 105000 },
            { id: 's3', name: 'Step 3', amount: 112000 },
            { id: 's4', name: 'Step 4', amount: 120000 },
        ]
    },
    {
        id: 'sg-09',
        code: 'SG-09',
        name: 'Lead / Principal',
        type: 'RANGE',
        minSalary: 120000,
        maxSalary: 155000,
        currency: 'PHP',
        steps: [
            { id: 's1', name: 'Step 1', amount: 120000 },
            { id: 's2', name: 'Step 2', amount: 132000 },
            { id: 's3', name: 'Step 3', amount: 143000 },
            { id: 's4', name: 'Step 4', amount: 155000 },
        ]
    },
    {
        id: 'sg-10',
        code: 'SG-10',
        name: 'Manager I',
        type: 'RANGE',
        minSalary: 155000,
        maxSalary: 195000,
        currency: 'PHP',
        steps: [
            { id: 's1', name: 'Step 1', amount: 155000 },
            { id: 's2', name: 'Step 2', amount: 168000 },
            { id: 's3', name: 'Step 3', amount: 181000 },
            { id: 's4', name: 'Step 4', amount: 195000 },
        ]
    },
    {
        id: 'sg-11',
        code: 'SG-11',
        name: 'Manager II / Sr Manager',
        type: 'RANGE',
        minSalary: 195000,
        maxSalary: 240000,
        currency: 'PHP',
        steps: [
            { id: 's1', name: 'Step 1', amount: 195000 },
            { id: 's2', name: 'Step 2', amount: 210000 },
            { id: 's3', name: 'Step 3', amount: 225000 },
            { id: 's4', name: 'Step 4', amount: 240000 },
        ]
    },
    {
        id: 'sg-12',
        code: 'SG-12',
        name: 'Director',
        type: 'RANGE',
        minSalary: 240000,
        maxSalary: 300000,
        currency: 'PHP',
        steps: [
            { id: 's1', name: 'Step 1', amount: 240000 },
            { id: 's2', name: 'Step 2', amount: 260000 },
            { id: 's3', name: 'Step 3', amount: 280000 },
            { id: 's4', name: 'Step 4', amount: 300000 },
        ]
    },
    {
        id: 'sg-13',
        code: 'SG-13',
        name: 'Senior Director',
        type: 'RANGE',
        minSalary: 300000,
        maxSalary: 380000,
        currency: 'PHP',
        steps: [
            { id: 's1', name: 'Step 1', amount: 300000 },
            { id: 's2', name: 'Step 2', amount: 330000 },
            { id: 's3', name: 'Step 3', amount: 355000 },
            { id: 's4', name: 'Step 4', amount: 380000 },
        ]
    },
    {
        id: 'sg-14',
        code: 'SG-14',
        name: 'Vice President',
        type: 'RANGE',
        minSalary: 380000,
        maxSalary: 490000,
        currency: 'PHP',
        steps: [
            { id: 's1', name: 'Step 1', amount: 380000 },
            { id: 's2', name: 'Step 2', amount: 415000 },
            { id: 's3', name: 'Step 3', amount: 452000 },
            { id: 's4', name: 'Step 4', amount: 490000 },
        ]
    },
    {
        id: 'sg-15',
        code: 'SG-15',
        name: 'C-Level / Executive',
        type: 'ALIGNED',
        minSalary: 490000,
        maxSalary: 750000,
        currency: 'PHP',
        steps: []
    },
];

const currencyInputStyle = `
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
`;

const SensitiveValue = ({ showAll, value, className }: { showAll: boolean, value?: number, className?: string }) => {
    if (value === undefined) return <span>-</span>;
    if (showAll) return <span className={className}>₱{value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>;
    return <span className={`blur-[4px] select-none text-slate-300 ${className}`}>XXXXXX</span>;
};

const SalaryGradeSettings: React.FC = () => {
    const [grades, setGrades] = useState<SalaryGrade[]>(INITIAL_GRADES);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingGradeId, setEditingGradeId] = useState<string | null>(null);
    const [isAlignedRate, setIsAlignedRate] = useState(false);
    const [gradeForm, setGradeForm] = useState<Partial<SalaryGrade>>({ currency: 'PHP' });

    // Global visibility toggle for values
    const [showAllValues, setShowAllValues] = useState(false);

    // Steps Management State
    const [activeStepGradeId, setActiveStepGradeId] = useState<string | null>(null);
    const [editingSteps, setEditingSteps] = useState<SalaryStep[]>([]);
    const [newStep, setNewStep] = useState<Partial<SalaryStep>>({ name: '', amount: 0 });

    // --- Grade CRUD ---

    const handleStartAdd = () => {
        setGradeForm({ currency: 'PHP', code: '', name: '', minSalary: 0, maxSalary: 0 });
        setIsAlignedRate(false);
        setEditingGradeId(null);
        setIsFormOpen(true);
    };

    const handleStartEdit = (grade: SalaryGrade) => {
        setGradeForm({ ...grade });
        setIsAlignedRate(grade.type === 'ALIGNED');
        setEditingGradeId(grade.id);
        setIsFormOpen(true);
    };

    const handleSaveGrade = () => {
        if (!gradeForm.code || !gradeForm.minSalary) return;

        const max = isAlignedRate ? gradeForm.minSalary : gradeForm.maxSalary;
        if (!max && !isAlignedRate) return;

        const gradePayload: SalaryGrade = {
            id: editingGradeId || Math.random().toString(36).substr(2, 9),
            code: gradeForm.code,
            name: gradeForm.name || '',
            type: isAlignedRate ? 'ALIGNED' : 'RANGE',
            minSalary: Number(gradeForm.minSalary),
            maxSalary: Number(max),
            currency: gradeForm.currency || 'PHP',
            steps: editingGradeId ? (grades.find(g => g.id === editingGradeId)?.steps || []) : []
        };

        if (editingGradeId) {
            setGrades(grades.map(g => g.id === editingGradeId ? gradePayload : g));
        } else {
            setGrades([...grades, gradePayload]);
        }

        setIsFormOpen(false);
        setEditingGradeId(null);
        setGradeForm({ currency: 'PHP' });
    };

    const handleDelete = (id: string) => {
        if (confirm('Delete this salary grade? Positions assigned to this grade will need updating.')) {
            setGrades(grades.filter(g => g.id !== id));
        }
    };

    // --- Step Handlers ---
    const openStepManager = (grade: SalaryGrade) => {
        setActiveStepGradeId(grade.id);
        setEditingSteps(grade.steps ? JSON.parse(JSON.stringify(grade.steps)) : []);

        const nextNum = (grade.steps?.length || 0) + 1;
        const lastAmount = grade.steps && grade.steps.length > 0 ? grade.steps[grade.steps.length - 1].amount : (grade.minSalary || 0);
        setNewStep({ name: `Step ${nextNum}`, amount: lastAmount + 500 });
    };

    const renumberSteps = (steps: SalaryStep[]): SalaryStep[] => {
        return steps.map((s, idx) => ({
            ...s,
            name: `Step ${idx + 1}`
        }));
    };

    const handleAddStep = () => {
        if (!newStep.amount) return;
        const step: SalaryStep = {
            id: Math.random().toString(36).substr(2, 9),
            name: `Step`, // Temporary, will be renumbered
            amount: Number(newStep.amount)
        };

        // Add and Renumber
        const updatedSteps = renumberSteps([...editingSteps, step]);
        setEditingSteps(updatedSteps);

        // Prepare next
        setNewStep({ name: `Step ${updatedSteps.length + 1}`, amount: Number(newStep.amount) + 500 });
    };

    const handleEditStepChange = (id: string, field: keyof SalaryStep, value: any) => {
        setEditingSteps(editingSteps.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const handleDeleteStep = (stepId: string) => {
        // Remove and Renumber
        const remaining = editingSteps.filter(s => s.id !== stepId);
        const renumbered = renumberSteps(remaining);
        setEditingSteps(renumbered);
        setNewStep({ name: `Step ${renumbered.length + 1}`, amount: newStep.amount });
    };

    const handleSaveSteps = () => {
        if (!activeStepGradeId) return;
        setGrades(grades.map(g => {
            if (g.id === activeStepGradeId) {
                return { ...g, steps: editingSteps };
            }
            return g;
        }));
        setActiveStepGradeId(null);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Salary Grade Configuration</h1>
                <p className="text-slate-500 font-medium mt-1">Define pay bands, aligned rates, and longevity steps.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col h-[650px] overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center bg-white gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <LayoutGrid size={20} className="text-indigo-600" /> Grades & Steps
                        </h2>
                        <p className="text-xs text-slate-500 font-medium mt-1">Manage standard compensation tables.</p>
                    </div>
                    {!isFormOpen && (
                        <button
                            onClick={handleStartAdd}
                            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all text-xs font-bold shadow-lg shadow-indigo-200 active:scale-95"
                        >
                            <Plus size={16} /> Add Grade
                        </button>
                    )}
                </div>
                <style>{currencyInputStyle}</style>

                <div className="flex-1 overflow-auto bg-slate-50/30 p-6">
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-widest border-b border-slate-200 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-4">Grade Code</th>
                                    <th className="px-6 py-4">Description</th>
                                    <th className="px-6 py-4 text-center">Structure</th>
                                    <th className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => setShowAllValues(!showAllValues)}>
                                            <span>Salary Range</span>
                                            {showAllValues ? <Eye size={14} /> : <EyeOff size={14} />}
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {isFormOpen && (
                                    <tr className="bg-indigo-50/50 animate-in fade-in">
                                        <td className="px-6 py-4">
                                            <input
                                                autoFocus
                                                placeholder="e.g. SG-1"
                                                className="w-full border-b-2 border-indigo-200 bg-transparent py-1.5 outline-none text-indigo-900 font-bold text-sm focus:border-indigo-500 transition-all"
                                                value={gradeForm.code || ''}
                                                onChange={e => setGradeForm({ ...gradeForm, code: e.target.value })}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                placeholder="e.g. Entry Level"
                                                className="w-full border-b-2 border-indigo-200 bg-transparent py-1.5 outline-none text-slate-700 font-medium text-sm focus:border-indigo-500 transition-all"
                                                value={gradeForm.name || ''}
                                                onChange={e => setGradeForm({ ...gradeForm, name: e.target.value })}
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-center text-xs text-slate-400">
                                            --
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center justify-end gap-3 mb-1">
                                                    <span className={`text-[10px] font-bold uppercase cursor-pointer transition-colors ${!isAlignedRate ? 'text-indigo-600' : 'text-slate-400'}`} onClick={() => setIsAlignedRate(false)}>Range</span>
                                                    <button onClick={() => setIsAlignedRate(!isAlignedRate)} className="text-slate-300 hover:text-indigo-600 transition-colors">
                                                        {isAlignedRate ? <ToggleRight size={24} className="text-purple-600" /> : <ToggleLeft size={24} className="text-indigo-600" />}
                                                    </button>
                                                    <span className={`text-[10px] font-bold uppercase cursor-pointer transition-colors ${isAlignedRate ? 'text-purple-600' : 'text-slate-400'}`} onClick={() => setIsAlignedRate(true)}>Aligned Rate</span>
                                                </div>
                                                <div className="flex items-center justify-end gap-2">
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">₱</span>
                                                        <input
                                                            type="text"
                                                            inputMode="decimal"
                                                            placeholder={isAlignedRate ? "Amount" : "Min"}
                                                            className="w-32 text-right border border-indigo-200 rounded-lg pl-7 pr-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 bg-white font-mono font-bold text-sm transition-all"
                                                            value={gradeForm.minSalary || ''}
                                                            onChange={e => {
                                                                const val = e.target.value.replace(/[^0-9.]/g, '');
                                                                if (val.split('.').length <= 2) setGradeForm({ ...gradeForm, minSalary: val as any });
                                                            }}
                                                            onBlur={e => {
                                                                const val = parseFloat(e.target.value);
                                                                if (!isNaN(val)) setGradeForm({ ...gradeForm, minSalary: val.toFixed(2) as any });
                                                            }}
                                                        />
                                                    </div>
                                                    {!isAlignedRate && (
                                                        <>
                                                            <span className="text-slate-400 font-bold">-</span>
                                                            <div className="relative">
                                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">₱</span>
                                                                <input
                                                                    type="text"
                                                                    inputMode="decimal"
                                                                    placeholder="Max"
                                                                    className="w-32 text-right border border-indigo-200 rounded-lg pl-7 pr-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 bg-white font-mono font-bold text-sm transition-all"
                                                                    value={gradeForm.maxSalary || ''}
                                                                    onChange={e => {
                                                                        const val = e.target.value.replace(/[^0-9.]/g, '');
                                                                        if (val.split('.').length <= 2) setGradeForm({ ...gradeForm, maxSalary: val as any });
                                                                    }}
                                                                    onBlur={e => {
                                                                        const val = parseFloat(e.target.value);
                                                                        if (!isNaN(val)) setGradeForm({ ...gradeForm, maxSalary: val.toFixed(2) as any });
                                                                    }}
                                                                />
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={handleSaveGrade} className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                                                    <Check size={16} />
                                                </button>
                                                <button onClick={() => setIsFormOpen(false)} className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}

                                {grades.map(grade => {
                                    const isFixed = grade.type === 'ALIGNED' || grade.minSalary === grade.maxSalary;
                                    const hasSteps = grade.steps && grade.steps.length > 0;
                                    if (editingGradeId === grade.id) return null;

                                    return (
                                        <tr key={grade.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-6 py-4 font-bold text-slate-800">{grade.code}</td>
                                            <td className="px-6 py-4 text-slate-600 font-medium">{grade.name}</td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => openStepManager(grade)}
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${hasSteps ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200 hover:text-slate-600'}`}
                                                >
                                                    <TrendingUp size={12} />
                                                    {hasSteps ? `${grade.steps!.length} Steps` : 'No Steps'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono font-bold text-slate-700">
                                                {isFixed ? (
                                                    <div className="flex justify-end">
                                                        <SensitiveValue
                                                            showAll={showAllValues}
                                                            value={grade.minSalary}
                                                            className="text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100 text-xs"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-end gap-2 text-xs">
                                                        <SensitiveValue showAll={showAllValues} value={grade.minSalary} />
                                                        <span className="text-slate-300 mx-1">→</span>
                                                        <SensitiveValue showAll={showAllValues} value={grade.maxSalary} />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleStartEdit(grade)}
                                                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                        title="Edit Grade"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(grade.id)}
                                                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                                        title="Delete Grade"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Step Manager Modal */}
                <Modal isOpen={!!activeStepGradeId} onClose={() => setActiveStepGradeId(null)}>
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Manage Steps</h3>
                                <p className="text-xs text-slate-500 font-medium mt-1">Configure incremental levels for this grade.</p>
                            </div>
                            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                                <TrendingUp size={20} />
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden mb-6 max-h-64 overflow-y-auto shadow-inner">
                            {editingSteps.length === 0 ? (
                                <div className="p-8 text-center text-slate-400 italic text-xs font-bold uppercase tracking-wider">No steps defined yet.</div>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest sticky top-0">
                                        <tr>
                                            <th className="px-5 py-3 text-left">Step Label</th>
                                            <th className="px-5 py-3 text-right">Total Amount</th>
                                            <th className="w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200/50">
                                        {editingSteps.map((step, idx) => (
                                            <tr key={step.id || idx} className="bg-white group hover:bg-indigo-50/30 transition-colors">
                                                <td className="px-5 py-2">
                                                    <input
                                                        readOnly // Enforce naming convention
                                                        className="w-full border border-transparent rounded px-2 py-1 bg-transparent text-slate-700 font-bold text-xs cursor-default focus:outline-none"
                                                        value={step.name}
                                                    />
                                                </td>
                                                <td className="px-5 py-2 text-right">
                                                    <div className="relative inline-block w-full">
                                                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-[10px]">₱</span>
                                                        <input
                                                            type="text"
                                                            inputMode="decimal"
                                                            className="w-full text-right border border-transparent hover:border-slate-200 focus:border-indigo-500 rounded pl-5 pr-2 py-1 bg-transparent focus:bg-white outline-none font-mono font-bold text-slate-600 transition-colors text-xs"
                                                            value={step.amount}
                                                            onChange={(e) => {
                                                                const val = e.target.value.replace(/[^0-9.]/g, '');
                                                                if (val.split('.').length <= 2) handleEditStepChange(step.id, 'amount', val as any);
                                                            }}
                                                            onBlur={e => {
                                                                const val = parseFloat(e.target.value);
                                                                if (!isNaN(val)) handleEditStepChange(step.id, 'amount', val.toFixed(2) as any);
                                                            }}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-5 py-2 text-right">
                                                    <button onClick={() => handleDeleteStep(step.id)} className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all p-1 hover:bg-rose-50 rounded"><X size={14} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Add Step Form */}
                        <div className="flex gap-3 items-end bg-white p-4 rounded-2xl border border-slate-200 mb-6 shadow-sm">
                            <div className="flex-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Next Step</label>
                                <input
                                    disabled
                                    className="w-full border border-slate-100 rounded-xl p-2.5 text-xs font-bold outline-none bg-slate-50 text-slate-500"
                                    value={`Step ${editingSteps.length + 1}`}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Amount</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">₱</span>
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        className="w-full border border-slate-200 rounded-xl pl-8 pr-3 py-2.5 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 bg-white text-slate-900 transition-all font-mono"
                                        placeholder="0.00"
                                        value={newStep.amount || ''}
                                        onChange={e => {
                                            const val = e.target.value.replace(/[^0-9.]/g, '');
                                            if (val.split('.').length <= 2) setNewStep({ ...newStep, amount: val as any });
                                        }}
                                        onBlur={e => {
                                            const val = parseFloat(e.target.value);
                                            if (!isNaN(val)) setNewStep({ ...newStep, amount: val.toFixed(2) as any });
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleAddStep();
                                        }}
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleAddStep}
                                disabled={!newStep.amount}
                                className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-200 active:scale-95 transition-all"
                            >
                                <Plus size={18} />
                            </button>
                        </div>

                        <button
                            onClick={handleSaveSteps}
                            className="w-full bg-slate-900 text-white py-3.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Save size={16} /> Save Configuration
                        </button>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default SalaryGradeSettings;
