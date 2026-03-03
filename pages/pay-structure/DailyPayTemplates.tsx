
import React, { useState } from 'react';
import { DailyPayTemplate } from '../../types';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Check,
    X,
    DollarSign,
    ToggleLeft,
    ToggleRight,
} from 'lucide-react';
import Modal from '../../components/Modal';

const MOCK_DAILY_PAY_TEMPLATES: DailyPayTemplate[] = [
    {
        id: 'dpt-1',
        name: 'Standard Daily Worker',
        dailyRate: 610,
        targetType: 'Global',
        targetId: null,
        additionalComponents: [
            { name: 'Meal Allowance', amount: 100, type: 'earning' },
            { name: 'Transportation', amount: 75, type: 'earning' },
        ],
        isActive: true,
    },
    {
        id: 'dpt-2',
        name: 'Construction Site Rate',
        dailyRate: 750,
        targetType: 'Department',
        targetId: 'dept-ops',
        additionalComponents: [
            { name: 'Hazard Pay', amount: 150, type: 'earning' },
            { name: 'Meal Allowance', amount: 120, type: 'earning' },
            { name: 'SSS Deduction', amount: 50, type: 'deduction' },
        ],
        isActive: true,
    },
    {
        id: 'dpt-3',
        name: 'Part-Time Office Helper',
        dailyRate: 450,
        targetType: 'Position',
        targetId: 'pos-helper',
        additionalComponents: [
            { name: 'Meal Allowance', amount: 80, type: 'earning' },
        ],
        isActive: false,
    },
];

interface DailyPayTemplatesProps {
    templates: DailyPayTemplate[];
    setTemplates: React.Dispatch<React.SetStateAction<DailyPayTemplate[]>>;
}

const DailyPayTemplates: React.FC<DailyPayTemplatesProps> = ({ templates, setTemplates }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<DailyPayTemplate>>({
        name: '',
        dailyRate: 0,
        targetType: 'Global',
        targetId: null,
        additionalComponents: [],
        isActive: true,
    });
    const [newComponentName, setNewComponentName] = useState('');
    const [newComponentAmount, setNewComponentAmount] = useState(0);
    const [newComponentType, setNewComponentType] = useState<'earning' | 'deduction'>('earning');

    const filtered = templates.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenModal = (template?: DailyPayTemplate) => {
        if (template) {
            setEditingId(template.id);
            setFormData({ ...template });
        } else {
            setEditingId(null);
            setFormData({
                name: '',
                dailyRate: 0,
                targetType: 'Global',
                targetId: null,
                additionalComponents: [],
                isActive: true,
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!formData.name || !formData.dailyRate) return;

        const payload: DailyPayTemplate = {
            id: editingId || `dpt-${Date.now()}`,
            name: formData.name!,
            dailyRate: formData.dailyRate!,
            targetType: formData.targetType || 'Global',
            targetId: formData.targetId || null,
            additionalComponents: formData.additionalComponents || [],
            isActive: formData.isActive ?? true,
        };

        if (editingId) {
            setTemplates(templates.map(t => t.id === editingId ? payload : t));
        } else {
            setTemplates([...templates, payload]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('Delete this daily pay template?')) {
            setTemplates(templates.filter(t => t.id !== id));
        }
    };

    const handleToggleActive = (id: string) => {
        setTemplates(templates.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t));
    };

    const addComponent = () => {
        if (!newComponentName || !newComponentAmount) return;
        setFormData({
            ...formData,
            additionalComponents: [
                ...(formData.additionalComponents || []),
                { name: newComponentName, amount: newComponentAmount, type: newComponentType },
            ],
        });
        setNewComponentName('');
        setNewComponentAmount(0);
        setNewComponentType('earning');
    };

    const removeComponent = (index: number) => {
        setFormData({
            ...formData,
            additionalComponents: formData.additionalComponents?.filter((_, i) => i !== index),
        });
    };

    const getTotalDaily = (t: DailyPayTemplate) => {
        const earnings = t.additionalComponents.filter(c => c.type === 'earning').reduce((sum, c) => sum + c.amount, 0);
        const deductions = t.additionalComponents.filter(c => c.type === 'deduction').reduce((sum, c) => sum + c.amount, 0);
        return t.dailyRate + earnings - deductions;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search templates..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 outline-none text-slate-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95"
                >
                    <Plus size={16} />
                    New Template
                </button>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                <table className="min-w-full divide-y divide-slate-50">
                    <thead className="bg-slate-50/40">
                        <tr>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Template Name</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Daily Rate</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Target</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Components</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Net Daily</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 text-right"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filtered.map(t => (
                            <tr key={t.id} className="hover:bg-slate-50/60 transition-colors group">
                                <td className="px-6 py-4">
                                    <span className="text-sm font-bold text-slate-900">{t.name}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-mono font-bold text-slate-700">₱{t.dailyRate.toLocaleString()}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-500 border border-slate-200">
                                        {t.targetType}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {t.additionalComponents.map((c, i) => (
                                            <span
                                                key={i}
                                                className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                                    c.type === 'earning'
                                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                        : 'bg-rose-50 text-rose-600 border-rose-100'
                                                }`}
                                            >
                                                {c.name}
                                            </span>
                                        ))}
                                        {t.additionalComponents.length === 0 && (
                                            <span className="text-[10px] text-slate-300 italic">None</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-mono font-bold text-indigo-700">₱{getTotalDaily(t).toLocaleString()}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <button onClick={() => handleToggleActive(t.id)} className="flex items-center gap-1.5">
                                        {t.isActive ? (
                                            <ToggleRight size={20} className="text-emerald-500" />
                                        ) : (
                                            <ToggleLeft size={20} className="text-slate-300" />
                                        )}
                                        <span className={`text-[10px] font-bold uppercase ${t.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                                            {t.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleOpenModal(t)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                                            <Edit2 size={14} />
                                        </button>
                                        <button onClick={() => handleDelete(t.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-sm italic">
                                    No daily pay templates found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Create/Edit Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-xl">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-slate-900">
                            {editingId ? 'Edit Daily Pay Template' : 'Create Daily Pay Template'}
                        </h3>
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                            <DollarSign size={20} />
                        </div>
                    </div>

                    <div className="space-y-5 max-h-[500px] overflow-y-auto pr-2">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Template Name</label>
                            <input
                                className="w-full border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-bold text-slate-900"
                                placeholder="e.g. Standard Daily Worker"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Daily Rate (₱)</label>
                                <input
                                    type="number"
                                    className="w-full border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-bold text-slate-900"
                                    value={formData.dailyRate}
                                    onChange={e => setFormData({ ...formData, dailyRate: Number(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Target Type</label>
                                <select
                                    className="w-full border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 text-sm font-bold text-slate-900 appearance-none"
                                    value={formData.targetType}
                                    onChange={e => setFormData({ ...formData, targetType: e.target.value as any })}
                                >
                                    <option value="Global">Global</option>
                                    <option value="Department">Department</option>
                                    <option value="Position">Position</option>
                                </select>
                            </div>
                        </div>

                        {/* Additional Components */}
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Additional Components</h4>

                            {formData.additionalComponents && formData.additionalComponents.length > 0 && (
                                <div className="space-y-2 mb-4">
                                    {formData.additionalComponents.map((comp, i) => (
                                        <div key={i} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                                            <div className="flex items-center gap-3">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                                    comp.type === 'earning' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                                }`}>
                                                    {comp.type === 'earning' ? '+' : '-'}
                                                </span>
                                                <span className="text-sm font-bold text-slate-700">{comp.name}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-mono font-bold text-slate-600">₱{comp.amount.toLocaleString()}</span>
                                                <button onClick={() => removeComponent(i)} className="text-slate-300 hover:text-rose-500">
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-2">
                                <input
                                    className="flex-1 border border-slate-200 p-2 rounded-lg text-xs font-bold text-slate-700 outline-none"
                                    placeholder="Component name"
                                    value={newComponentName}
                                    onChange={e => setNewComponentName(e.target.value)}
                                />
                                <input
                                    type="number"
                                    className="w-24 border border-slate-200 p-2 rounded-lg text-xs font-bold text-slate-700 outline-none"
                                    placeholder="Amount"
                                    value={newComponentAmount || ''}
                                    onChange={e => setNewComponentAmount(Number(e.target.value))}
                                />
                                <select
                                    className="border border-slate-200 p-2 rounded-lg text-xs font-bold text-slate-700 outline-none appearance-none"
                                    value={newComponentType}
                                    onChange={e => setNewComponentType(e.target.value as any)}
                                >
                                    <option value="earning">Earning</option>
                                    <option value="deduction">Deduction</option>
                                </select>
                                <button
                                    onClick={addComponent}
                                    className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                        </div>

                        <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.isActive ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white'}`}>
                                {formData.isActive && <Check size={12} className="text-white" />}
                            </div>
                            <span className="text-sm font-bold text-slate-800" onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}>Active</span>
                        </label>

                        <div className="pt-4 flex gap-3">
                            <button onClick={handleSave} className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 text-sm">
                                {editingId ? 'Save Changes' : 'Create Template'}
                            </button>
                            <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export { MOCK_DAILY_PAY_TEMPLATES };
export default DailyPayTemplates;
