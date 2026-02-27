
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  Calendar,
  Edit2,
  Trash2,
  Check,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  RotateCcw,
  LayoutDashboard
} from 'lucide-react';
import Modal from '../components/Modal';

interface LeaveType {
  id: string;
  name: string;
  maxDays: number;
  minDays: number; // Minimum days to be taken at once or minimum tenure
  perEmployee: number; // Default allocation
  lastModifiedBy: string;
  lastModified: string;
  color: string;
  resetDate: string; // Automatic refresh date (MM-DD)
  resetFrequency: 'Yearly' | 'Monthly' | 'Daily' | 'Never';
}

const MOCK_LEAVES: LeaveType[] = [
  {
    id: '1',
    name: 'Vacation Leave',
    maxDays: 15,
    minDays: 1,
    perEmployee: 15,
    lastModifiedBy: 'Louis Panganiban',
    lastModified: 'Aug 8, 2025 23:56',
    color: 'bg-emerald-500',
    resetDate: '01-01',
    resetFrequency: 'Yearly'
  },
  {
    id: '2',
    name: 'Sick Leave',
    maxDays: 10,
    minDays: 1,
    perEmployee: 10,
    lastModifiedBy: 'Juan Dela Cruz',
    lastModified: 'Aug 8, 2025 12:05',
    color: 'bg-rose-500',
    resetDate: '01-01',
    resetFrequency: 'Yearly'
  },
  {
    id: '3',
    name: 'Maternity Leave',
    maxDays: 105,
    minDays: 105,
    perEmployee: 105,
    lastModifiedBy: 'HR Admin',
    lastModified: 'Jan 10, 2025 09:00',
    color: 'bg-purple-500',
    resetDate: '01-01',
    resetFrequency: 'Yearly'
  }
];

const COLORS = [
  { label: 'Emerald', value: 'bg-emerald-500' },
  { label: 'Rose', value: 'bg-rose-500' },
  { label: 'Blue', value: 'bg-blue-500' },
  { label: 'Amber', value: 'bg-amber-500' },
  { label: 'Purple', value: 'bg-purple-500' },
  { label: 'Slate', value: 'bg-slate-500' },
];

const MONTHS = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

const DAYS = Array.from({ length: 31 }, (_, i) => {
  const d = (i + 1).toString().padStart(2, '0');
  return { value: d, label: (i + 1).toString() };
});

const LeaveManagement: React.FC = () => {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState<LeaveType[]>(MOCK_LEAVES);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<LeaveType>>({
    name: '',
    maxDays: 0,
    minDays: 0,
    perEmployee: 0,
    color: 'bg-blue-500',
    resetDate: '01-01',
    resetFrequency: 'Yearly'
  });

  const handleOpenModal = (leave?: LeaveType) => {
    if (leave) {
      setEditingId(leave.id);
      setFormData({ ...leave });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        maxDays: 5,
        minDays: 1,
        perEmployee: 5,
        color: 'bg-blue-500',
        resetDate: '01-01', // Default Jan 1
        resetFrequency: 'Yearly'
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name) return;

    const payload: LeaveType = {
      id: editingId || Math.random().toString(36).substr(2, 9),
      name: formData.name,
      maxDays: Number(formData.maxDays),
      minDays: Number(formData.minDays),
      perEmployee: Number(formData.perEmployee),
      lastModifiedBy: 'Current User',
      lastModified: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' }),
      color: formData.color || 'bg-slate-500',
      resetDate: formData.resetDate || '01-01',
      resetFrequency: formData.resetFrequency || 'Yearly'
    };

    if (editingId) {
      setLeaves(leaves.map(l => l.id === editingId ? payload : l));
    } else {
      setLeaves([...leaves, payload]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this leave type?')) {
      setLeaves(leaves.filter(l => l.id !== id));
    }
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '-';
    // Handle MM-DD format
    if (dateStr.length === 5 && dateStr.includes('-')) {
      const [m, d] = dateStr.split('-');
      const date = new Date(2000, parseInt(m) - 1, parseInt(d));
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    }
    // Fallback for any legacy full dates
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  };

  const filteredLeaves = leaves.filter(l => l.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Extract month and day for the modal controls
  const [resetMonth, resetDay] = (formData.resetDate || '01-01').split('-');

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Leave Management
            <Calendar className="text-indigo-600" size={24} />
          </h1>
          <p className="text-slate-500 font-medium mt-1">Configure time-off policies and allocation rules.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/manage/leave-balances')}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            <LayoutDashboard size={18} className="text-slate-400" />
            View Balances
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
          >
            <Plus size={18} />
            Add Leave
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-white">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search leave types..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 outline-none text-slate-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-50">
            <thead className="bg-slate-50/40">
              <tr>
                <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Leave Name</th>
                <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Max Days / Year</th>
                <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Min. Increment</th>
                <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Default Allocation</th>
                <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Reset Frequency</th>
                <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Reset Date</th>
                <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Last Modified</th>
                <th className="px-8 py-5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLeaves.map((leave) => (
                <tr key={leave.id} className="hover:bg-slate-50/60 transition-colors group">
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${leave.color} shadow-sm`}></div>
                      <span className="text-sm font-bold text-slate-900">{leave.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                      {leave.maxDays} Days
                    </span>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-xs font-medium text-slate-500">
                    {leave.minDays > 0 ? `${leave.minDays} Day${leave.minDays > 1 ? 's' : ''}` : 'None'}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Briefcase size={14} className="text-slate-400" />
                      <span className="text-xs font-bold text-slate-700">{leave.perEmployee} Leaves</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <span className="text-xs font-medium text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                      {leave.resetFrequency}
                    </span>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                      <RotateCcw size={14} className="text-indigo-500" />
                      {formatDateDisplay(leave.resetDate)}
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-700">{leave.lastModifiedBy}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{leave.lastModified}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenModal(leave)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(leave.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-4">Showing {filteredLeaves.length} Policies</span>
          <div className="flex gap-2">
            <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 disabled:opacity-50"><ChevronLeft size={16} /></button>
            <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-900">{editingId ? 'Edit Leave Policy' : 'Create Leave Policy'}</h3>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Calendar size={20} /></div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Leave Name</label>
              <input
                className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-bold text-slate-900 transition-all"
                placeholder="e.g. Vacation Leave"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Max Days / Year</label>
                <input
                  type="number"
                  className="w-full border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-bold text-slate-900 transition-all"
                  value={formData.maxDays}
                  onChange={e => setFormData({ ...formData, maxDays: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Min Increment (Days)</label>
                <input
                  type="number"
                  className="w-full border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-bold text-slate-900 transition-all"
                  value={formData.minDays}
                  onChange={e => setFormData({ ...formData, minDays: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Default Allocation</label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-bold text-slate-900 transition-all"
                    value={formData.perEmployee}
                    onChange={e => setFormData({ ...formData, perEmployee: Number(e.target.value) })}
                  />
                  <span className="absolute right-4 top-3 text-xs font-bold text-slate-400">/ Emp</span>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Reset Frequency</label>
                <select
                  className="w-full border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-bold text-slate-900 transition-all cursor-pointer"
                  value={formData.resetFrequency}
                  onChange={e => setFormData({ ...formData, resetFrequency: e.target.value as any })}
                >
                  <option value="Yearly">Yearly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Daily">Daily</option>
                  <option value="Never">Never</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Reset Date (Recurring)</label>
              <div className="grid grid-cols-2 gap-4">
                <select
                  className="w-full border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-bold text-slate-900 transition-all cursor-pointer"
                  value={resetMonth}
                  onChange={(e) => setFormData({ ...formData, resetDate: `${e.target.value}-${resetDay}` })}
                >
                  {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
                <select
                  className="w-full border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-bold text-slate-900 transition-all cursor-pointer"
                  value={resetDay}
                  onChange={(e) => setFormData({ ...formData, resetDate: `${resetMonth}-${e.target.value}` })}
                >
                  {DAYS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 italic flex items-center gap-1">
                <RotateCcw size={10} /> Allocations will refresh automatically on this date based on frequency.
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Badge Color</label>
              <div className="flex gap-2">
                {COLORS.map(c => (
                  <button
                    key={c.label}
                    onClick={() => setFormData({ ...formData, color: c.value })}
                    className={`w-8 h-8 rounded-full ${c.value} flex items-center justify-center transition-all ${formData.color === c.value ? 'ring-4 ring-slate-100 scale-110 shadow-sm' : 'opacity-70 hover:opacity-100'}`}
                    title={c.label}
                  >
                    {formData.color === c.value && <Check size={14} className="text-white" strokeWidth={3} />}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button onClick={handleSave} className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 text-sm">
                {editingId ? 'Save Changes' : 'Create Policy'}
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

export default LeaveManagement;
