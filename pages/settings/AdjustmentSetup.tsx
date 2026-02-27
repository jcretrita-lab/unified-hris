
import React, { useState } from 'react';
import { 
  Sliders, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Search,
  Banknote
} from 'lucide-react';
import { AdjustmentType } from '../../types';
import Modal from '../../components/Modal';

// Mock Data exported for reuse in PayComponents
export const MOCK_ADJUSTMENT_TYPES: AdjustmentType[] = [
  { id: 'adj-1', code: 'LATE', name: 'Late Penalty', category: 'Deduction', isTaxable: false, description: 'Deduction for tardiness beyond grace period.' },
  { id: 'adj-2', code: 'BONUS', name: 'Performance Bonus', category: 'Earning', isTaxable: true, description: 'One-time bonus for exemplary performance.' },
  { id: 'adj-3', code: 'DAMG', name: 'Damaged Equipment', category: 'Deduction', isTaxable: false, description: 'Charge for repair/replacement of company asset.' },
  { id: 'adj-4', code: 'ADVC', name: 'Salary Advance', category: 'Deduction', isTaxable: false, description: 'Repayment of salary cash advance.' },
  { id: 'adj-5', code: 'REF', name: 'Expense Refund', category: 'Earning', isTaxable: false, description: 'Reimbursement for approved out-of-pocket expenses.' },
];

const AdjustmentSetup: React.FC = () => {
  const [adjustments, setAdjustments] = useState<AdjustmentType[]>(MOCK_ADJUSTMENT_TYPES);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<AdjustmentType>>({
    code: '',
    name: '',
    category: 'Earning',
    isTaxable: false,
    description: ''
  });

  const filteredAdjustments = adjustments.filter(adj => 
    adj.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    adj.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (adj?: AdjustmentType) => {
    if (adj) {
      setEditingId(adj.id);
      setFormData({ ...adj });
    } else {
      setEditingId(null);
      setFormData({
        code: '',
        name: '',
        category: 'Earning',
        isTaxable: false,
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.code) return;

    const payload: AdjustmentType = {
      id: editingId || Math.random().toString(36).substr(2, 9),
      code: formData.code,
      name: formData.name,
      category: formData.category || 'Earning',
      isTaxable: formData.isTaxable || false,
      description: formData.description
    };

    if (editingId) {
      setAdjustments(adjustments.map(a => a.id === editingId ? payload : a));
    } else {
      setAdjustments([...adjustments, payload]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this adjustment type?')) {
      setAdjustments(adjustments.filter(a => a.id !== id));
    }
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Adjustment Types
            <Sliders className="text-indigo-600" size={24} />
          </h1>
          <p className="text-slate-500 font-medium mt-1">Configure categories for one-time pay adjustments.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
        >
          <Plus size={18} />
          Add Type
        </button>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm min-h-[600px] flex flex-col">
        <div className="p-6 border-b border-slate-50 flex items-center gap-4 bg-white">
            <div className="relative max-w-md w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search adjustments..." 
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        <div className="flex-1 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-50">
                <thead className="bg-slate-50/50 text-left">
                    <tr>
                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Code</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Name</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Taxable</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</th>
                        <th className="px-8 py-5 text-right w-24"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {filteredAdjustments.map((adj) => (
                        <tr key={adj.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => handleOpenModal(adj)}>
                            <td className="px-8 py-5 whitespace-nowrap">
                                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">{adj.code}</span>
                            </td>
                            <td className="px-8 py-5 whitespace-nowrap">
                                <span className="font-bold text-slate-900">{adj.name}</span>
                            </td>
                            <td className="px-8 py-5 whitespace-nowrap">
                                <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${adj.category === 'Earning' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                    {adj.category}
                                </span>
                            </td>
                            <td className="px-8 py-5 whitespace-nowrap">
                                {adj.isTaxable ? (
                                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-600">
                                        <Check size={12} className="text-emerald-500" /> Yes
                                    </span>
                                ) : (
                                    <span className="text-[10px] font-bold text-slate-400">No</span>
                                )}
                            </td>
                            <td className="px-8 py-5">
                                <p className="text-xs text-slate-500 truncate max-w-xs">{adj.description}</p>
                            </td>
                            <td className="px-8 py-5 text-right">
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleOpenModal(adj); }}
                                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleDelete(adj.id); }}
                                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {filteredAdjustments.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-8 py-12 text-center text-slate-400 italic">No adjustment types found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-lg">
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">{editingId ? 'Edit Adjustment Type' : 'Add Adjustment Type'}</h3>
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Sliders size={20} /></div>
            </div>

            <div className="space-y-5">
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Code</label>
                        <input 
                            className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-bold text-slate-900 transition-all uppercase"
                            placeholder="CODE"
                            value={formData.code}
                            onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                            maxLength={8}
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Name</label>
                        <input 
                            className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-bold text-slate-900 transition-all"
                            placeholder="e.g. Late Penalty"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            autoFocus
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Category</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            type="button"
                            onClick={() => setFormData({...formData, category: 'Earning'})}
                            className={`py-3 rounded-xl border text-sm font-bold transition-all ${formData.category === 'Earning' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                        >
                            Earning
                        </button>
                        <button 
                            type="button"
                            onClick={() => setFormData({...formData, category: 'Deduction'})}
                            className={`py-3 rounded-xl border text-sm font-bold transition-all ${formData.category === 'Deduction' ? 'bg-rose-50 border-rose-200 text-rose-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                        >
                            Deduction
                        </button>
                    </div>
                </div>

                <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.isTaxable ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white'}`}>
                        {formData.isTaxable && <Check size={12} className="text-white" />}
                    </div>
                    <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={formData.isTaxable} 
                        onChange={e => setFormData({...formData, isTaxable: e.target.checked})} 
                    />
                    <div>
                        <span className="text-sm font-bold text-slate-800 block">Taxable Item</span>
                        <span className="text-[10px] text-slate-400 font-medium block">Include this in taxable income calculations.</span>
                    </div>
                </label>

                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Description</label>
                    <textarea 
                        className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-medium text-slate-900 transition-all resize-none h-24"
                        placeholder="Brief description..."
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div className="pt-4 flex gap-3">
                    <button onClick={handleSave} disabled={!formData.name || !formData.code} className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 text-sm disabled:opacity-50">
                        {editingId ? 'Save Changes' : 'Create Type'}
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

export default AdjustmentSetup;
