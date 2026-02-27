
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ChevronRight, 
  User, 
  Layers, 
  X, 
  ArrowRightLeft, 
  Coins,
  Plus,
  Trash2,
  Check
} from 'lucide-react';
import { motion } from 'framer-motion';
import { MOCK_CONVERSION_DB } from './mockData';
import { LeaveConversionItem } from './types';

const LeaveConversionTab: React.FC = () => {
  // --- Conversion State ---
  const [conversionSearch, setConversionSearch] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [conversionForm, setConversionForm] = useState({ vl: 0, sl: 0 });
  const [batchQueue, setBatchQueue] = useState<LeaveConversionItem[]>([]);

  // Filter for Conversion Search
  const filteredConversionCandidates = useMemo(() => {
      if (!conversionSearch) return MOCK_CONVERSION_DB;
      const queuedIds = new Set(batchQueue.map(item => item.id));
      return MOCK_CONVERSION_DB.filter(item => 
          !queuedIds.has(item.id) && 
          (item.name.toLowerCase().includes(conversionSearch.toLowerCase()) || 
           item.role.toLowerCase().includes(conversionSearch.toLowerCase()))
      );
  }, [conversionSearch, batchQueue]);

  const activeConversionEmployee = MOCK_CONVERSION_DB.find(e => e.id === selectedEmployeeId);

  // --- Conversion Handlers ---
  const handleAddToBatch = () => {
      if (!activeConversionEmployee) return;
      const totalCash = (conversionForm.vl * activeConversionEmployee.dailyRate) + (conversionForm.sl * activeConversionEmployee.dailyRate);
      
      const newItem: LeaveConversionItem = {
          ...activeConversionEmployee,
          vlToConvert: conversionForm.vl,
          slToConvert: conversionForm.sl,
          totalCashValue: totalCash,
          status: 'Pending'
      };

      setBatchQueue([...batchQueue, newItem]);
      
      // Reset
      setSelectedEmployeeId(null);
      setConversionForm({ vl: 0, sl: 0 });
      setConversionSearch('');
  };

  const handleRemoveFromQueue = (id: string) => {
      setBatchQueue(batchQueue.filter(item => item.id !== id));
  };

  const handleProcessBatch = () => {
      alert(`Successfully processed ${batchQueue.length} conversions!`);
      setBatchQueue([]);
  };

  const formatCurrency = (amount: number) => {
    return `₱${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row gap-6 h-[700px]"
    >
         {/* Left Panel: Search & Select */}
         <div className="w-full lg:w-1/3 bg-white border border-slate-100 rounded-3xl overflow-hidden flex flex-col shadow-sm">
            <div className="p-5 border-b border-slate-50">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Search size={16} className="text-indigo-600" /> Employee Search
                </h3>
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Type name or role..." 
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all placeholder:text-slate-400 placeholder:font-medium"
                        value={conversionSearch}
                        onChange={(e) => setConversionSearch(e.target.value)}
                    />
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {filteredConversionCandidates.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 px-6 text-center">
                        <User size={32} className="mb-2 opacity-20" />
                        <p className="text-xs font-medium">
                            {conversionSearch ? 'No employees found.' : 'Search for an employee to start conversion.'}
                        </p>
                    </div>
                ) : (
                    filteredConversionCandidates.map(emp => (
                        <div 
                            key={emp.id} 
                            onClick={() => {
                                setSelectedEmployeeId(emp.id);
                                setConversionForm({ vl: 0, sl: 0 }); // Reset form on select
                            }}
                            className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${selectedEmployeeId === emp.id ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-100'}`}
                        >
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200 shrink-0">
                                {emp.avatar}
                            </div>
                            <div className="min-w-0">
                                <h4 className={`text-sm font-bold truncate ${selectedEmployeeId === emp.id ? 'text-indigo-900' : 'text-slate-900'}`}>{emp.name}</h4>
                                <p className="text-[10px] text-slate-500 truncate">{emp.role}</p>
                            </div>
                            {selectedEmployeeId === emp.id && <ChevronRight size={16} className="ml-auto text-indigo-500" />}
                        </div>
                    ))
                )}
            </div>
         </div>

         {/* Right Panel: Workspace & Queue */}
         <div className="flex-1 flex flex-col gap-6 h-full overflow-hidden">
            
            {/* Conversion Work Area */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm shrink-0">
                {activeConversionEmployee ? (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                         <div className="flex justify-between items-start mb-6">
                             <div className="flex items-center gap-4">
                                 <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-lg font-bold shadow-lg shadow-indigo-200">
                                     {activeConversionEmployee.avatar}
                                 </div>
                                 <div>
                                     <h2 className="text-lg font-bold text-slate-900">{activeConversionEmployee.name}</h2>
                                     <p className="text-xs text-slate-500 font-medium">{activeConversionEmployee.role} • {activeConversionEmployee.department}</p>
                                     <div className="mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
                                         <Coins size={10} /> Daily Rate: {formatCurrency(activeConversionEmployee.dailyRate)}
                                     </div>
                                 </div>
                             </div>
                             <button onClick={() => setSelectedEmployeeId(null)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
                                 <X size={18} />
                             </button>
                         </div>

                         <div className="grid grid-cols-2 gap-6 mb-6">
                             <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 relative group focus-within:ring-2 ring-indigo-500 focus-within:border-indigo-500 transition-all">
                                 <div className="flex justify-between items-center mb-2">
                                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vacation Leave</label>
                                     <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded text-slate-500 border border-slate-200">Max: {activeConversionEmployee.vlBalance}</span>
                                 </div>
                                 <input 
                                    type="number"
                                    min="0"
                                    max={activeConversionEmployee.vlBalance}
                                    className="w-full bg-transparent text-2xl font-bold text-slate-900 outline-none placeholder:text-slate-300"
                                    placeholder="0"
                                    value={conversionForm.vl || ''}
                                    onChange={e => setConversionForm({...conversionForm, vl: Math.min(Number(e.target.value), activeConversionEmployee.vlBalance)})}
                                 />
                                 <p className="text-xs text-emerald-600 font-bold mt-1">
                                    + {formatCurrency(conversionForm.vl * activeConversionEmployee.dailyRate)}
                                 </p>
                             </div>
                             <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 relative group focus-within:ring-2 ring-indigo-500 focus-within:border-indigo-500 transition-all">
                                 <div className="flex justify-between items-center mb-2">
                                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sick Leave</label>
                                     <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded text-slate-500 border border-slate-200">Max: {activeConversionEmployee.slBalance}</span>
                                 </div>
                                 <input 
                                    type="number"
                                    min="0"
                                    max={activeConversionEmployee.slBalance}
                                    className="w-full bg-transparent text-2xl font-bold text-slate-900 outline-none placeholder:text-slate-300"
                                    placeholder="0"
                                    value={conversionForm.sl || ''}
                                    onChange={e => setConversionForm({...conversionForm, sl: Math.min(Number(e.target.value), activeConversionEmployee.slBalance)})}
                                 />
                                 <p className="text-xs text-emerald-600 font-bold mt-1">
                                    + {formatCurrency(conversionForm.sl * activeConversionEmployee.dailyRate)}
                                 </p>
                             </div>
                         </div>

                         <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                             <div>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Cash Value</p>
                                 <p className="text-xl font-bold text-indigo-700">
                                     {formatCurrency(
                                        (conversionForm.vl * activeConversionEmployee.dailyRate) + 
                                        (conversionForm.sl * activeConversionEmployee.dailyRate)
                                     )}
                                 </p>
                             </div>
                             <button 
                                onClick={handleAddToBatch}
                                disabled={conversionForm.vl === 0 && conversionForm.sl === 0}
                                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                             >
                                 Add to Batch <Plus size={16} />
                             </button>
                         </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-slate-300 border-2 border-dashed border-slate-100 rounded-xl">
                        <ArrowRightLeft size={32} className="mb-2 opacity-50" />
                        <p className="text-sm font-medium text-slate-400">Select an employee to calculate conversion</p>
                    </div>
                )}
            </div>

            {/* Batch Queue */}
            <div className="flex-1 bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm flex flex-col">
                <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Layers size={14} /> Batch Queue ({batchQueue.length})
                    </h3>
                    {batchQueue.length > 0 && <span className="text-xs font-bold text-emerald-600">Total: {formatCurrency(batchQueue.reduce((acc, item) => acc + (item.totalCashValue || 0), 0))}</span>}
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                    {batchQueue.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-300">
                            <p className="text-xs italic">No items queued for processing.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {batchQueue.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-slate-200 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                            {item.avatar}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-900">{item.name}</div>
                                            <div className="text-[10px] text-slate-500">
                                                VL: <span className="font-bold text-slate-700">{item.vlBalance} <span className="text-slate-400">→</span> {item.vlBalance - (item.vlToConvert || 0)}</span> • SL: <span className="font-bold text-slate-700">{item.slBalance} <span className="text-slate-400">→</span> {item.slBalance - (item.slToConvert || 0)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-mono font-bold text-sm text-emerald-600">{formatCurrency(item.totalCashValue || 0)}</span>
                                        <button 
                                            onClick={() => handleRemoveFromQueue(item.id)}
                                            className="text-slate-300 hover:text-rose-500 p-1 rounded hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="p-4 border-t border-slate-50 bg-white">
                    <button 
                        onClick={handleProcessBatch}
                        disabled={batchQueue.length === 0}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Process Batch <Check size={16} />
                    </button>
                </div>
            </div>
         </div>
    </motion.div>
  );
};

export default LeaveConversionTab;
