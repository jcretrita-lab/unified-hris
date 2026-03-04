
import React, { useState } from 'react';
import { DailyPayTemplate, PayComponent } from '../../types';
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
    PackagePlus,
} from 'lucide-react';
import Modal from '../../components/Modal';

const MOCK_DAILY_PAY_TEMPLATES: DailyPayTemplate[] = [
    {
        id: 'dpt-1',
        name: 'Standard Daily Worker',
        dailyRate: 645,
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
        name: 'Construction & Field Site Rate',
        dailyRate: 800,
        targetType: 'Department',
        targetId: 'dept-ops',
        additionalComponents: [
            { name: 'Hazard Pay', amount: 150, type: 'earning' },
            { name: 'Meal Allowance', amount: 120, type: 'earning' },
        ],
        isActive: true,
    },
    {
        id: 'dpt-3',
        name: 'Part-Time Office Support',
        dailyRate: 500,
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
    components: PayComponent[];
}

const DailyPayTemplates: React.FC<DailyPayTemplatesProps> = ({ templates, setTemplates, components }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // ── Create modal ──────────────────────────────────────────────────────────
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createForm, setCreateForm] = useState<{ name: string; dailyRate: number; targetType: 'Global' | 'Department' | 'Position'; targetId: string | null; isActive: boolean }>({
        name: '',
        dailyRate: 0,
        targetType: 'Global',
        targetId: null,
        isActive: true,
    });

    // ── Edit / manage-components modal ────────────────────────────────────────
    const [editingTemplate, setEditingTemplate] = useState<DailyPayTemplate | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedComponentId, setSelectedComponentId] = useState('');

    // ── Show/Hide Deductions ──────────────────────────────────────────────────────
    const [showDeductions, setShowDeductions] = useState(false);

    const filtered = templates.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // ── Handlers: Create ──────────────────────────────────────────────────────
    const handleOpenCreate = () => {
        setCreateForm({ name: '', dailyRate: 0, targetType: 'Global', targetId: null, isActive: true });
        setIsCreateModalOpen(true);
    };

    const handleCreate = () => {
        if (!createForm.name || !createForm.dailyRate) return;
        const newTemplate: DailyPayTemplate = {
            id: `dpt-${Date.now()}`,
            name: createForm.name,
            dailyRate: createForm.dailyRate,
            targetType: createForm.targetType,
            targetId: createForm.targetId,
            additionalComponents: [],
            isActive: createForm.isActive,
        };
        setTemplates([...templates, newTemplate]);
        setIsCreateModalOpen(false);
    };

    // ── Handlers: Edit / Components ───────────────────────────────────────────
    const handleOpenEdit = (t: DailyPayTemplate) => {
        setEditingTemplate({ ...t, additionalComponents: [...t.additionalComponents] });
        setSelectedComponentId('');
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = () => {
        if (!editingTemplate) return;
        setTemplates(templates.map(t => t.id === editingTemplate.id ? editingTemplate : t));
        setIsEditModalOpen(false);
    };

    const handleAddComponent = () => {
        if (!selectedComponentId || !editingTemplate) return;
        const comp = components.find(c => c.id === selectedComponentId);
        if (!comp) return;
        // Prevent duplicates
        if (editingTemplate.additionalComponents.some(c => c.name === comp.name)) {
            setSelectedComponentId('');
            return;
        }
        setEditingTemplate({
            ...editingTemplate,
            additionalComponents: [
                ...editingTemplate.additionalComponents,
                { name: comp.name, amount: comp.fixedValue || 0, type: comp.type },
            ],
        });
        setSelectedComponentId('');
    };

    const handleRemoveComponent = (index: number) => {
        if (!editingTemplate) return;
        setEditingTemplate({
            ...editingTemplate,
            additionalComponents: editingTemplate.additionalComponents.filter((_, i) => i !== index),
        });
    };

    // ── Handlers: Delete / Toggle ─────────────────────────────────────────────
    const handleDelete = (id: string) => {
        if (confirm('Delete this daily pay template?')) {
            setTemplates(templates.filter(t => t.id !== id));
        }
    };

    const handleToggleActive = (id: string) => {
        setTemplates(templates.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t));
    };

    const getTotalDaily = (t: DailyPayTemplate) => {
        const earnings = t.additionalComponents.filter(c => c.type === 'earning').reduce((sum, c) => sum + c.amount, 0);
        const deductions = t.additionalComponents.filter(c => c.type === 'deduction').reduce((sum, c) => sum + c.amount, 0);
        return t.dailyRate + earnings - deductions;
    };

    // Only show active, non-system pay components as options
    const availableComponents = components.filter(c => !c.isArchived && !c.isSystem);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
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

                <div className="flex items-center gap-3">
                    {/* Deduction Components Toggle */}
                    <button
                        onClick={() => setShowDeductions(!showDeductions)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${
                            showDeductions
                                ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-md shadow-rose-100'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                    >
                        {showDeductions ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                        Deductions {showDeductions ? 'ON' : 'OFF'}
                    </button>

                    <button
                        onClick={handleOpenCreate}
                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95"
                    >
                        <Plus size={16} />
                        New Template
                    </button>
                </div>
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
                                        {t.additionalComponents
                                            .filter(c => showDeductions || c.type === 'earning')
                                            .map((c, i) => (
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
                                        {t.additionalComponents.filter(c => showDeductions || c.type === 'earning').length === 0 && (
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
                                        <button onClick={() => handleOpenEdit(t)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Edit & Manage Components">
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

            {/* ── Create Modal (no component adding) ── */}
            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} className="max-w-xl">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xl font-bold text-slate-900">Create Daily Pay Template</h3>
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                            <DollarSign size={20} />
                        </div>
                    </div>
                    <p className="text-sm text-slate-500 font-medium mb-6">Define the base daily rate and target. You can assign pay components after the template is created.</p>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Template Name</label>
                            <input
                                className="w-full border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-bold text-slate-900"
                                placeholder="e.g. Field Operations Daily Rate"
                                value={createForm.name}
                                onChange={e => setCreateForm({ ...createForm, name: e.target.value })}
                                autoFocus
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Daily Rate (₱)</label>
                                <input
                                    type="number"
                                    className="w-full border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-bold text-slate-900"
                                    value={createForm.dailyRate || ''}
                                    onChange={e => setCreateForm({ ...createForm, dailyRate: Number(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Target Type</label>
                                <select
                                    className="w-full border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 text-sm font-bold text-slate-900 appearance-none"
                                    value={createForm.targetType}
                                    onChange={e => setCreateForm({ ...createForm, targetType: e.target.value as any })}
                                >
                                    <option value="Global">Global</option>
                                    <option value="Department">Department</option>
                                    <option value="Position">Position</option>
                                </select>
                            </div>
                        </div>

                        <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 flex items-center gap-3">
                            <PackagePlus size={16} className="text-indigo-500 shrink-0" />
                            <p className="text-xs font-medium text-indigo-700">Pay components can be assigned after the template is saved, using the <span className="font-bold">Edit</span> action.</p>
                        </div>

                        <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                            <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center ${createForm.isActive ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white'}`}
                                onClick={() => setCreateForm({ ...createForm, isActive: !createForm.isActive })}
                            >
                                {createForm.isActive && <Check size={12} className="text-white" />}
                            </div>
                            <span className="text-sm font-bold text-slate-800">Active</span>
                        </label>

                        <div className="pt-2 flex gap-3">
                            <button
                                onClick={handleCreate}
                                disabled={!createForm.name || !createForm.dailyRate}
                                className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 text-sm disabled:opacity-50"
                            >
                                Create Template
                            </button>
                            <button onClick={() => setIsCreateModalOpen(false)} className="px-6 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* ── Edit Modal (with component picker from PayComponent list) ── */}
            {editingTemplate && (
                <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} className="max-w-xl">
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Edit Daily Pay Template</h3>
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                                <Edit2 size={20} />
                            </div>
                        </div>

                        <div className="space-y-5 max-h-[520px] overflow-y-auto pr-1">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Template Name</label>
                                <input
                                    className="w-full border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-bold text-slate-900"
                                    value={editingTemplate.name}
                                    onChange={e => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Daily Rate (₱)</label>
                                    <input
                                        type="number"
                                        className="w-full border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-bold text-slate-900"
                                        value={editingTemplate.dailyRate}
                                        onChange={e => setEditingTemplate({ ...editingTemplate, dailyRate: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Target Type</label>
                                    <select
                                        className="w-full border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 text-sm font-bold text-slate-900 appearance-none"
                                        value={editingTemplate.targetType}
                                        onChange={e => setEditingTemplate({ ...editingTemplate, targetType: e.target.value as any })}
                                    >
                                        <option value="Global">Global</option>
                                        <option value="Department">Department</option>
                                        <option value="Position">Position</option>
                                    </select>
                                </div>
                            </div>

                            {/* Component Picker */}
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <PackagePlus size={14} className="text-indigo-500" /> Pay Components
                                </h4>

                                {editingTemplate.additionalComponents.length > 0 && (
                                    <div className="space-y-2 mb-4">
                                        {editingTemplate.additionalComponents.map((comp, i) => (
                                            <div key={i} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${comp.type === 'earning' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                                        {comp.type === 'earning' ? '+' : '−'}
                                                    </span>
                                                    <span className="text-sm font-bold text-slate-700">{comp.name}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-mono font-bold text-slate-600">₱{comp.amount.toLocaleString()}</span>
                                                    <button onClick={() => handleRemoveComponent(i)} className="text-slate-300 hover:text-rose-500 transition-colors">
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <select
                                        className="flex-1 border border-slate-200 p-2.5 rounded-xl bg-white text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 appearance-none"
                                        value={selectedComponentId}
                                        onChange={e => setSelectedComponentId(e.target.value)}
                                    >
                                        <option value="">— Select a pay component —</option>
                                        {availableComponents.map(c => (
                                            <option key={c.id} value={c.id}>
                                                [{c.type === 'earning' ? '+' : '−'}] {c.name}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={handleAddComponent}
                                        disabled={!selectedComponentId}
                                        className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-40 font-bold text-sm"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>

                            <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                                <div
                                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${editingTemplate.isActive ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white'}`}
                                    onClick={() => setEditingTemplate({ ...editingTemplate, isActive: !editingTemplate.isActive })}
                                >
                                    {editingTemplate.isActive && <Check size={12} className="text-white" />}
                                </div>
                                <span className="text-sm font-bold text-slate-800">Active</span>
                            </label>

                            <div className="pt-2 flex gap-3">
                                <button onClick={handleSaveEdit} className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 text-sm">
                                    Save Changes
                                </button>
                                <button onClick={() => setIsEditModalOpen(false)} className="px-6 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export { MOCK_DAILY_PAY_TEMPLATES };
export default DailyPayTemplates;
