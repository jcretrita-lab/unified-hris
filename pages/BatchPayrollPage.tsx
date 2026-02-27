
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight,
  Search, 
  CheckCircle2, 
  User, 
  Clock, 
  AlertCircle, 
  Check, 
  X, 
  Layers,
  ChevronRight,
  Filter,
  DollarSign,
  TrendingUp,
  FileText,
  Building2,
  Calendar,
  Printer,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../components/Modal';
import { PayslipTemplate } from '../components/PayslipTemplate';

// --- MOCK DATA ---
const MOCK_EMPLOYEES = [
  { id: 'emp-1', name: 'James Cordon', role: 'IT Intern', dept: 'IT', avatar: 'JC', status: 'Pending', gross: 25000, net: 22000, hours: 160, lates: 2 },
  { id: 'emp-2', name: 'Louis Panganiban', role: 'Senior Dev', dept: 'IT', avatar: 'LP', status: 'Pending', gross: 65000, net: 58000, hours: 160, lates: 0 },
  { id: 'emp-3', name: 'Sarah Wilson', role: 'HR Manager', dept: 'HR', avatar: 'SW', status: 'Pending', gross: 55000, net: 49500, hours: 158, lates: 5 },
  { id: 'emp-4', name: 'Mike Brown', role: 'Payroll Lead', dept: 'Finance', avatar: 'MB', status: 'Pending', gross: 45000, net: 40000, hours: 160, lates: 0 },
  { id: 'emp-5', name: 'John Doe', role: 'Junior Dev', dept: 'IT', avatar: 'JD', status: 'Pending', gross: 35000, net: 31000, hours: 150, lates: 10 },
];

const BatchPayrollPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'selection' | 'processing'>('selection');
  
  // Selection State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  
  // Processing State
  const [activeEmpId, setActiveEmpId] = useState<string | null>(null);
  const [processedIds, setProcessedIds] = useState<Set<string>>(new Set());
  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(new Set());
  
  // Filter Logic
  const filteredList = MOCK_EMPLOYEES.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.dept.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleStartBatch = () => {
    if (selectedIds.size === 0) return;
    setStep('processing');
    setActiveEmpId(Array.from(selectedIds)[0]); // Start with first selected
  };

  const handleProcessAction = (action: 'approve' | 'flag' | 'skip') => {
    if (!activeEmpId) return;
    
    if (action === 'approve') {
        const newProcessed = new Set(processedIds);
        newProcessed.add(activeEmpId);
        setProcessedIds(newProcessed);
    } else if (action === 'flag') {
        const newFlagged = new Set(flaggedIds);
        newFlagged.add(activeEmpId);
        setFlaggedIds(newFlagged);
        // Flagged also counts as processed/visited for flow, but kept separate
    }

    // Move to next
    const idsArray = Array.from(selectedIds);
    const currentIndex = idsArray.indexOf(activeEmpId);
    if (currentIndex < idsArray.length - 1) {
        setActiveEmpId(idsArray[currentIndex + 1]);
    } else {
        alert("Batch processing complete!");
        navigate('/manage/payroll');
    }
  };

  // Helper to get active employee data
  const activeEmployee = MOCK_EMPLOYEES.find(e => e.id === activeEmpId);

  // --- SELECTION VIEW ---
  if (step === 'selection') {
    return (
      <div className="min-h-screen bg-slate-50 p-8 animate-in fade-in">
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <button 
                        onClick={() => navigate('/manage/payroll')} 
                        className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors mb-2"
                    >
                        <ArrowLeft size={16} /> Back to Payroll
                    </button>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                        Batch Payroll Process
                        <Layers className="text-indigo-600" size={24} />
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Select employees to process in this batch run.</p>
                </div>
                <button 
                    onClick={handleStartBatch}
                    disabled={selectedIds.size === 0}
                    className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Start Processing <span className="bg-white text-slate-900 px-2 py-0.5 rounded-lg text-xs">{selectedIds.size}</span> <ChevronRight size={16} />
                </button>
            </div>

            {/* Selection Table Card */}
            <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm min-h-[600px] flex flex-col">
                <div className="p-6 border-b border-slate-50 flex items-center gap-4 bg-white">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-100 outline-none"
                            placeholder="Filter employees..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50">
                        <Filter size={14} /> Filter Dept
                    </button>
                    <div className="ml-auto text-xs font-bold text-slate-400 uppercase tracking-widest">
                        {filteredList.length} Available
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50/50 text-slate-500 font-bold uppercase text-[10px] tracking-widest sticky top-0 backdrop-blur-sm">
                            <tr>
                                <th className="px-8 py-4 w-16">
                                    <div 
                                        className={`w-5 h-5 border-2 rounded flex items-center justify-center cursor-pointer transition-all ${selectedIds.size === filteredList.length && filteredList.length > 0 ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white'}`}
                                        onClick={() => {
                                            if (selectedIds.size === filteredList.length) setSelectedIds(new Set());
                                            else setSelectedIds(new Set(filteredList.map(e => e.id)));
                                        }}
                                    >
                                        {selectedIds.size === filteredList.length && <Check size={12} className="text-white" strokeWidth={4} />}
                                    </div>
                                </th>
                                <th className="px-8 py-4">Employee</th>
                                <th className="px-8 py-4">Department</th>
                                <th className="px-8 py-4 text-right">Est. Gross Pay</th>
                                <th className="px-8 py-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredList.map(emp => (
                                <tr 
                                    key={emp.id} 
                                    onClick={() => toggleSelection(emp.id)}
                                    className={`cursor-pointer transition-all group ${selectedIds.has(emp.id) ? 'bg-indigo-50/30' : 'hover:bg-slate-50'}`}
                                >
                                    <td className="px-8 py-5">
                                        <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${selectedIds.has(emp.id) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white group-hover:border-indigo-300'}`}>
                                            {selectedIds.has(emp.id) && <Check size={12} className="text-white" strokeWidth={4} />}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200">
                                                {emp.avatar}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900">{emp.name}</div>
                                                <div className="text-xs text-slate-500 font-medium">{emp.role}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold border border-slate-200">{emp.dept}</span>
                                    </td>
                                    <td className="px-8 py-5 text-right font-mono font-bold text-slate-700">
                                        ₱{emp.gross.toLocaleString()}
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className="text-[10px] font-bold uppercase tracking-wide text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100">Pending</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    );
  }

  // --- PROCESSING VIEW (WORKSPACE) ---
  const employeesQueue = Array.from(selectedIds).map(id => MOCK_EMPLOYEES.find(e => e.id === id)!).filter(Boolean);

  return (
    <div className="fixed inset-0 bg-slate-100 z-50 flex flex-col">
        {/* Top Bar */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-20">
            <div className="flex items-center gap-4">
                <button onClick={() => setStep('selection')} className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <div className="h-6 w-px bg-slate-200"></div>
                <h2 className="text-lg font-bold text-slate-900">Batch Processing</h2>
                <span className="text-xs font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-500">
                    {processedIds.size + flaggedIds.size} / {employeesQueue.length} Processed
                </span>
            </div>
            <div>
                <button onClick={() => navigate('/manage/payroll')} className="text-xs font-bold text-slate-500 hover:text-slate-900">Exit Workspace</button>
            </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar Queue */}
            <div className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 z-10">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Processing Queue</span>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {employeesQueue.map((emp, idx) => {
                        const isProcessed = processedIds.has(emp.id);
                        const isFlagged = flaggedIds.has(emp.id);
                        const isActive = activeEmpId === emp.id;
                        
                        return (
                            <div 
                                key={emp.id}
                                onClick={() => setActiveEmpId(emp.id)}
                                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                                    isActive ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-white border-transparent hover:bg-slate-50'
                                }`}
                            >
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200">
                                        {emp.avatar}
                                    </div>
                                    {isProcessed && <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 border-2 border-white"><Check size={8} strokeWidth={4} /></div>}
                                    {isFlagged && <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full p-0.5 border-2 border-white"><AlertCircle size={8} strokeWidth={4} /></div>}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className={`text-sm font-bold truncate ${isActive ? 'text-indigo-900' : 'text-slate-900'}`}>{emp.name}</div>
                                    <div className="text-[10px] text-slate-500 truncate">{emp.role}</div>
                                </div>
                                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Main Workspace */}
            <div className="flex-1 bg-slate-50 p-8 overflow-y-auto flex flex-col items-center">
                {activeEmployee ? (
                    <div className="w-full max-w-5xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        
                        {/* Employee Header */}
                        <div className="flex items-center gap-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-600 border-4 border-slate-50 shadow-sm">
                                {activeEmployee.avatar}
                            </div>
                            <div className="flex-1">
                                <h1 className="text-2xl font-extrabold text-slate-900">{activeEmployee.name}</h1>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-sm font-bold text-slate-500 flex items-center gap-1"><Building2 size={14}/> {activeEmployee.dept}</span>
                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                    <span className="text-sm font-bold text-slate-500 flex items-center gap-1"><User size={14}/> {activeEmployee.role}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Payroll Period</div>
                                <div className="text-sm font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-2">
                                    <Calendar size={14} /> Aug 06 - Aug 20, 2025
                                </div>
                            </div>
                        </div>

                        {/* Payslip View */}
                        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex justify-center">
                            <PayslipTemplate data={{
                                id: activeEmployee.id,
                                name: activeEmployee.name,
                                role: activeEmployee.role,
                                department: activeEmployee.dept,
                                netPay: activeEmployee.net,
                                payPeriod: 'Aug 06 - Aug 20, 2025'
                            }} />
                        </div>

                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">Select an employee to process</div>
                )}
            </div>
        </div>

        {/* Action Bar Footer */}
        <div className="bg-white border-t border-slate-200 p-4 px-8 z-20 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <button 
                onClick={() => handleProcessAction('skip')}
                className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all"
            >
                Skip
            </button>
            <div className="flex gap-4">
                <button 
                    onClick={() => handleProcessAction('flag')}
                    className="flex items-center gap-2 px-6 py-3 bg-amber-100 text-amber-700 rounded-xl font-bold text-sm hover:bg-amber-200 transition-all"
                >
                    <AlertCircle size={18} /> Flag Issue
                </button>
                <button 
                    onClick={() => handleProcessAction('approve')}
                    className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                >
                    Approve & Next <ArrowRight size={18} />
                </button>
            </div>
        </div>
    </div>
  );
};

export default BatchPayrollPage;
