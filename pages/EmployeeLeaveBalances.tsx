
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Building2, 
  User, 
  ArrowLeft, 
  Eye, 
  Plus, 
  Calendar, 
  History,
  Check,
  X,
  Users,
  AlertCircle
} from 'lucide-react';
import Modal from '../components/Modal';

interface EmployeeBalanceItem {
  id: string;
  name: string;
  jobTitle: string;
  avatar: string;
  vlBalance: number;
  slBalance: number;
  lastReset: string;
  nextReset: string;
}

interface AdjustmentHistory {
  id: string;
  date: string;
  employees: string[];
  leaveType: string;
  amount: number;
  type: 'Credit' | 'Debit';
  reason: string;
  admin: string;
  effectiveDate: string;
}

const MOCK_BALANCES: EmployeeBalanceItem[] = [
  {
    id: 'emp-1',
    name: 'James Cordon',
    jobTitle: 'IT Developer Intern',
    avatar: 'JC',
    vlBalance: -1.0, // Simulating Negative Balance
    slBalance: 15.0,
    lastReset: 'January 1, 2025',
    nextReset: 'January 1, 2026'
  },
  {
    id: 'emp-2',
    name: 'Louis Panganiban',
    jobTitle: 'Senior Developer',
    avatar: 'LP',
    vlBalance: 4.0,
    slBalance: 13.0,
    lastReset: 'January 1, 2025',
    nextReset: 'January 1, 2026'
  },
  {
    id: 'emp-3',
    name: 'Juan Dela Cruz',
    jobTitle: 'Senior Developer',
    avatar: 'JD',
    vlBalance: 7.5,
    slBalance: 10.0,
    lastReset: 'January 1, 2025',
    nextReset: 'January 1, 2026'
  },
  {
    id: 'emp-4',
    name: 'Sarah Wilson',
    jobTitle: 'HR Manager',
    avatar: 'SW',
    vlBalance: 12.0,
    slBalance: 15.0,
    lastReset: 'January 1, 2025',
    nextReset: 'January 1, 2026'
  }
];

const MOCK_ADJUSTMENTS: AdjustmentHistory[] = [
  { id: 'adj-1', date: 'Aug 1, 2025', employees: ['James Cordon', 'Louis Panganiban'], leaveType: 'Vacation Leave', amount: 1, type: 'Credit', reason: 'Performance Reward', admin: 'Sarah Wilson', effectiveDate: 'Aug 1, 2025' },
  { id: 'adj-2', date: 'Jul 15, 2025', employees: ['Juan Dela Cruz'], leaveType: 'Sick Leave', amount: 0.5, type: 'Debit', reason: 'Adjustment Error', admin: 'Sarah Wilson', effectiveDate: 'Jul 15, 2025' },
];

const EmployeeLeaveBalances: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'New' | 'History'>('New');
  
  // Adjustment Form State
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [adjustmentForm, setAdjustmentForm] = useState({
    leaveType: 'Vacation Leave',
    type: 'Credit' as 'Credit' | 'Debit',
    amount: 0,
    effectiveDate: new Date().toISOString().split('T')[0],
    reason: ''
  });

  const filteredBalances = MOCK_BALANCES.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleEmployeeSelection = (id: string) => {
    if (selectedEmployees.includes(id)) {
      setSelectedEmployees(selectedEmployees.filter(empId => empId !== id));
    } else {
      setSelectedEmployees([...selectedEmployees, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === MOCK_BALANCES.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(MOCK_BALANCES.map(e => e.id));
    }
  };

  const handleSaveAdjustment = () => {
    if (selectedEmployees.length === 0 || adjustmentForm.amount <= 0 || !adjustmentForm.reason) return;
    alert("Adjustment processed successfully!");
    setIsAdjustmentModalOpen(false);
    setSelectedEmployees([]);
    setAdjustmentForm({
        leaveType: 'Vacation Leave',
        type: 'Credit',
        amount: 0,
        effectiveDate: new Date().toISOString().split('T')[0],
        reason: ''
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button 
            onClick={() => navigate('/manage/schedule')}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors mb-2 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Employee Leave Information
          </button>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Leave Balances</h1>
          <p className="text-slate-500 font-medium mt-1">Overview of remaining vacation and sick leave credits.</p>
        </div>
        <div className="px-4 py-2 bg-slate-100 rounded-xl border border-slate-200 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-bold text-slate-600">Current Cycle: 2025</span>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm min-h-[600px] flex flex-col">
        
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-50 flex flex-col lg:flex-row gap-4 items-center justify-between bg-white">
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <button 
                    onClick={() => {
                        setModalTab('New');
                        setIsAdjustmentModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95"
                >
                    <Plus size={14} /> Leave Balance Adjustment
                </button>
                <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-white hover:border-indigo-200 hover:text-indigo-600 transition-all">
                    <User size={14} /> Role
                    <ChevronLeft className="-rotate-90 ml-1 text-slate-300" size={12} />
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-white hover:border-indigo-200 hover:text-indigo-600 transition-all">
                    <Building2 size={14} /> Department
                    <ChevronLeft className="-rotate-90 ml-1 text-slate-300" size={12} />
                </button>
            </div>

            <div className="relative w-full lg:max-w-xs">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-50">
                <thead className="bg-slate-50/20 text-left">
                    <tr>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-slate-600 group">
                            Employee Name <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-1">↓</span>
                        </th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">VL Balance</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">SL Balance</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Leave Reset</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Next Leave Reset</th>
                        <th className="px-6 py-4 w-10"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {filteredBalances.map((item) => (
                        <tr 
                            key={item.id} 
                            onClick={() => navigate(`/manage/leave-balances/${item.id}`)}
                            className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                        >
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200">
                                        {item.avatar}
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{item.name}</div>
                                        <div className="text-[10px] text-slate-500 font-medium">{item.jobTitle}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-1.5">
                                    <span className={`text-sm font-mono font-bold ${item.vlBalance < 0 ? 'text-rose-600' : 'text-indigo-600'}`}>
                                        {item.vlBalance.toFixed(1)}
                                    </span>
                                    {item.vlBalance < 0 && (
                                        <span title="Negative Balance (Overdraft)" className="text-rose-500 cursor-help">
                                            <AlertCircle size={12} />
                                        </span>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`text-sm font-mono font-bold ${item.slBalance < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                    {item.slBalance.toFixed(1)}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-xs font-medium text-slate-600">{item.lastReset}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-xs font-medium text-slate-600">{item.nextReset}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white transition-all shadow-sm">
                                    <Eye size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Showing {filteredBalances.length} Employees</span>
            <div className="flex gap-2">
                <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 disabled:opacity-50 transition-all"><ChevronLeft size={16}/></button>
                <div className="flex gap-1">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-100">1</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-slate-500 text-xs font-bold transition-all">2</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-slate-500 text-xs font-bold transition-all">3</button>
                    <div className="w-8 h-8 flex items-center justify-center text-slate-400 text-xs font-bold">...</div>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-slate-500 text-xs font-bold transition-all">11</button>
                </div>
                <button className="flex items-center gap-1 px-3 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 transition-all text-xs font-bold">
                    Next <ChevronRight size={14}/>
                </button>
            </div>
        </div>
      </div>

      {/* Manual Adjustment Modal */}
      <Modal isOpen={isAdjustmentModalOpen} onClose={() => setIsAdjustmentModalOpen(false)} className="max-w-4xl">
        <div className="flex flex-col h-[700px] bg-white">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                <div className="flex gap-4 items-center">
                    <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm text-indigo-600">
                        <Plus size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Leave Balance Adjustment</h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">Manage and adjust leave balances manually.</p>
                    </div>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button 
                        onClick={() => setModalTab('New')}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${modalTab === 'New' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        New Adjustment
                    </button>
                    <button 
                        onClick={() => setModalTab('History')}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${modalTab === 'History' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <History size={12} /> History
                    </button>
                </div>
            </div>

            {modalTab === 'New' && (
                <div className="flex-1 flex overflow-hidden">
                    {/* Left: Employee Selection */}
                    <div className="w-1/3 border-r border-slate-100 bg-slate-50/50 flex flex-col">
                        <div className="p-4 border-b border-slate-100">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Select Employees</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                <input 
                                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500"
                                    placeholder="Filter list..."
                                />
                            </div>
                            <div className="flex justify-between items-center mt-3">
                                <span className="text-[10px] font-bold text-indigo-600">{selectedEmployees.length} Selected</span>
                                <button onClick={handleSelectAll} className="text-[10px] font-bold text-slate-500 hover:text-slate-800 underline">
                                    {selectedEmployees.length === MOCK_BALANCES.length ? 'Deselect All' : 'Select All'}
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-1">
                            {MOCK_BALANCES.map(emp => (
                                <div 
                                    key={emp.id}
                                    onClick={() => toggleEmployeeSelection(emp.id)}
                                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${selectedEmployees.includes(emp.id) ? 'bg-white border-indigo-500 shadow-sm' : 'bg-transparent border-transparent hover:bg-white hover:border-slate-200'}`}
                                >
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedEmployees.includes(emp.id) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white'}`}>
                                        {selectedEmployees.includes(emp.id) && <Check size={10} className="text-white" strokeWidth={3} />}
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                        {emp.avatar}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-xs font-bold text-slate-900 truncate">{emp.name}</div>
                                        <div className="text-[10px] text-slate-500 truncate">{emp.jobTitle}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Adjustment Form */}
                    <div className="flex-1 p-8 overflow-y-auto">
                        <div className="space-y-6 max-w-lg mx-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Leave Type</label>
                                    <select 
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                                        value={adjustmentForm.leaveType}
                                        onChange={e => setAdjustmentForm({...adjustmentForm, leaveType: e.target.value})}
                                    >
                                        <option>Vacation Leave</option>
                                        <option>Sick Leave</option>
                                        <option>Emergency Leave</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Effective Date</label>
                                    <input 
                                        type="date"
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                                        value={adjustmentForm.effectiveDate}
                                        onChange={e => setAdjustmentForm({...adjustmentForm, effectiveDate: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 text-center">Adjustment Amount</label>
                                <div className="flex items-center justify-center gap-4">
                                    <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
                                        <button 
                                            onClick={() => setAdjustmentForm({...adjustmentForm, type: 'Credit'})}
                                            className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${adjustmentForm.type === 'Credit' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                                        >
                                            Credit (+)
                                        </button>
                                        <button 
                                            onClick={() => setAdjustmentForm({...adjustmentForm, type: 'Debit'})}
                                            className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${adjustmentForm.type === 'Debit' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                                        >
                                            Debit (-)
                                        </button>
                                    </div>
                                    <div className="relative w-32">
                                        <input 
                                            type="number" 
                                            min="0"
                                            step="0.5"
                                            className={`w-full p-3 text-center text-lg font-bold outline-none border rounded-xl focus:ring-2 ${adjustmentForm.type === 'Credit' ? 'text-emerald-600 border-emerald-200 focus:ring-emerald-100' : 'text-rose-600 border-rose-200 focus:ring-rose-100'}`}
                                            value={adjustmentForm.amount}
                                            onChange={e => setAdjustmentForm({...adjustmentForm, amount: parseFloat(e.target.value)})}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 pointer-events-none">Days</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Reason / Remarks</label>
                                <textarea 
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 min-h-[100px] resize-none"
                                    placeholder="e.g. Performance Bonus, System Correction..."
                                    value={adjustmentForm.reason}
                                    onChange={e => setAdjustmentForm({...adjustmentForm, reason: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {modalTab === 'History' && (
                <div className="flex-1 overflow-auto p-6 bg-slate-50/30">
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-bold text-[10px] uppercase tracking-widest border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 min-w-[140px]">Date Adjusted</th>
                                        <th className="px-6 py-4 min-w-[140px]">Effective Date</th>
                                        <th className="px-6 py-4 min-w-[200px]">Employees</th>
                                        <th className="px-6 py-4 min-w-[140px]">Leave Type</th>
                                        <th className="px-6 py-4 text-right min-w-[100px]">Amount</th>
                                        <th className="px-6 py-4 min-w-[200px]">Reason</th>
                                        <th className="px-6 py-4 min-w-[140px]">Admin</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {MOCK_ADJUSTMENTS.map(adj => (
                                        <tr key={adj.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-slate-600 text-xs align-top">{adj.date}</td>
                                            <td className="px-6 py-4 font-mono text-slate-600 text-xs align-top">{adj.effectiveDate}</td>
                                            <td className="px-6 py-4 align-top">
                                                <div className="flex flex-col gap-1">
                                                    {adj.employees.slice(0, 2).map(e => <span key={e} className="text-xs font-bold text-slate-700 truncate">{e}</span>)}
                                                    {adj.employees.length > 2 && <span className="text-[10px] text-slate-400">+{adj.employees.length - 2} more</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 text-xs align-top">{adj.leaveType}</td>
                                            <td className={`px-6 py-4 text-right font-bold align-top ${adj.type === 'Credit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {adj.type === 'Credit' ? '+' : '-'}{adj.amount}
                                            </td>
                                            <td className="px-6 py-4 text-xs text-slate-500 italic align-top">
                                                <p className="line-clamp-2" title={adj.reason}>{adj.reason}</p>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-bold text-indigo-600 align-top">{adj.admin}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="p-5 border-t border-slate-100 flex justify-between items-center bg-white">
                <div className="text-xs text-slate-400 font-medium">
                    {modalTab === 'New' && (
                        <span>Applying to <strong>{selectedEmployees.length}</strong> employee(s)</span>
                    )}
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setIsAdjustmentModalOpen(false)}
                        className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-all"
                    >
                        Close
                    </button>
                    {modalTab === 'New' && (
                        <button 
                            onClick={handleSaveAdjustment}
                            disabled={selectedEmployees.length === 0 || adjustmentForm.amount <= 0 || !adjustmentForm.reason}
                            className="px-8 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Save Adjustment
                        </button>
                    )}
                </div>
            </div>
        </div>
      </Modal>
    </div>
  );
};

export default EmployeeLeaveBalances;
