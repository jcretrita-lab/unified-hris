
import React, { useState } from 'react';
import { 
  Search, 
  MoreHorizontal, 
  Download, 
  Calculator, 
  CalendarRange,
  Wallet,
  X,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import Modal from '../../components/Modal';
import { MOCK_YEAR_END_DATA, generate13thMonthHistory } from './mockData';

const YearEndTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalConfig, setModalConfig] = useState<{ type: '13th' | 'tax' | 'gov' | null, empId: string | null }>({ type: null, empId: null });

  const filteredYearEnd = MOCK_YEAR_END_DATA.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedEmployeeData = MOCK_YEAR_END_DATA.find(d => d.id === modalConfig.empId);
  const monthlyHistory = selectedEmployeeData ? generate13thMonthHistory(selectedEmployeeData.ytdGross) : [];

  const closeModal = () => setModalConfig({ type: null, empId: null });

  const formatCurrency = (amount: number) => {
    return `₱${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <>
    <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm min-h-[600px] flex flex-col"
    >
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Calculator size={20} className="text-indigo-600"/> 
                    Annualization & 13th Month
                </h2>
                <p className="text-xs text-slate-500 mt-1">Review YTD totals, tax reconciliation, and bonuses.</p>
            </div>
            <div className="relative w-full md:w-72">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                  type="text" 
                  placeholder="Search employees..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  />
            </div>
        </div>

        <div className="flex-1 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-50">
                <thead className="bg-slate-50/50 text-left">
                    <tr>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Employee</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">YTD Gross</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Taxable Income</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Tax Due vs Withheld</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">13th Month Pay</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                        <th className="px-6 py-4 w-10"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {filteredYearEnd.map((item) => {
                        const taxDiff = item.taxWithheld - item.taxDue;
                        return (
                            <tr 
                                key={item.id} 
                                className="hover:bg-slate-50/80 transition-colors group"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200">
                                            {item.avatar}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{item.name}</div>
                                            <div className="text-[10px] text-slate-500 font-medium">{item.role}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right font-mono text-sm text-slate-700 font-medium">
                                    {formatCurrency(item.ytdGross)}
                                </td>
                                <td className="px-6 py-4 text-right font-mono text-sm text-slate-700 font-medium">
                                    {formatCurrency(item.ytdTaxable)}
                                </td>
                                
                                {/* Interactive Cells */}
                                <td className="px-6 py-4 text-right cursor-pointer hover:bg-slate-100" onClick={() => setModalConfig({ type: 'tax', empId: item.id })}>
                                    <div className="flex flex-col items-end">
                                        <span className={`text-xs font-bold ${taxDiff < 0 ? 'text-rose-600' : taxDiff > 0 ? 'text-emerald-600' : 'text-slate-600'} border-b border-dashed border-slate-300`}>
                                            {taxDiff > 0 ? '+' : ''}{formatCurrency(taxDiff)}
                                        </span>
                                        <span className="text-[10px] text-slate-400">Due: {formatCurrency(item.taxDue)}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right cursor-pointer hover:bg-slate-100" onClick={() => setModalConfig({ type: '13th', empId: item.id })}>
                                    <span className="font-mono text-sm font-bold text-indigo-600 border-b border-dashed border-indigo-200">
                                        {formatCurrency(item.thirteenthMonth)}
                                    </span>
                                </td>
                                
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${
                                        item.status === 'Balanced' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                        item.status === 'Refund Due' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 
                                        'bg-rose-50 text-rose-600 border-rose-100'
                                    }`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-white rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    </motion.div>

    {/* Dynamic Modal */}
    <Modal isOpen={!!modalConfig.type} onClose={closeModal} className="max-w-4xl">
        {selectedEmployeeData && (
            <div className="flex flex-col max-h-[85vh] overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex justify-between items-start shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-700 shadow-sm">
                            {selectedEmployeeData.avatar}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">{selectedEmployeeData.name}</h3>
                            <p className="text-xs text-slate-500 font-medium">{selectedEmployeeData.role} • {selectedEmployeeData.department}</p>
                        </div>
                    </div>
                    <button 
                        onClick={closeModal}
                        className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                    
                    {/* --- 13th Month View --- */}
                    {modalConfig.type === '13th' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                                <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <Wallet className="text-indigo-600" size={20} />
                                    13th Month Pay Computation
                                </h4>
                                <div className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-100 font-bold">
                                    Formula: (Total Basic Salary Earned) ÷ 12
                                </div>
                                </div>

                                {/* Monthly Breakdown Table */}
                                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                                    <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                                        <table className="w-full text-sm text-left relative">
                                            <thead className="bg-slate-50 text-slate-500 font-bold text-[10px] uppercase tracking-widest border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                                                <tr>
                                                    <th className="px-6 py-3 bg-slate-50">Month</th>
                                                    <th className="px-6 py-3 bg-slate-50">Payroll Period</th>
                                                    <th className="px-6 py-3 text-right bg-slate-50">Basic Salary</th>
                                                    <th className="px-6 py-3 text-right text-rose-600 bg-slate-50">Less: Absences/Late</th>
                                                    <th className="px-6 py-3 text-right text-indigo-700 bg-slate-50">Net Basic Earned</th>
                                                    <th className="px-6 py-3 text-center bg-slate-50">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {monthlyHistory.map((m, idx) => (
                                                    <tr key={idx} className="hover:bg-slate-50/50">
                                                        <td className="px-6 py-3 font-bold text-slate-700">{m.month}</td>
                                                        <td className="px-6 py-3 text-slate-500 text-xs">{m.period}</td>
                                                        <td className="px-6 py-3 text-right font-mono">{formatCurrency(m.basicPay)}</td>
                                                        <td className="px-6 py-3 text-right font-mono text-rose-500">
                                                        {m.absences > 0 ? `(${formatCurrency(m.absences)})` : '-'}
                                                        </td>
                                                        <td className="px-6 py-3 text-right font-mono font-bold text-slate-800">{formatCurrency(m.earnedBasic)}</td>
                                                        <td className="px-6 py-3 text-center">
                                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${m.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                                                {m.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot className="sticky bottom-0 z-10 bg-slate-50 font-bold border-t border-slate-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
                                            <tr>
                                                <td className="px-6 py-4 text-slate-800 bg-slate-50" colSpan={4}>Total Basic Salary Earned (Year-to-Date)</td>
                                                <td className="px-6 py-4 text-right text-indigo-700 font-mono text-base bg-slate-50">{formatCurrency(monthlyHistory.reduce((acc, curr) => acc + curr.earnedBasic, 0))}</td>
                                                <td className="bg-slate-50"></td>
                                            </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>

                                {/* Final Computation Box */}
                                <div className="bg-indigo-900 text-white rounded-2xl p-6 flex justify-between items-center shadow-lg">
                                    <div>
                                        <div className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">Final Calculation</div>
                                        <div className="text-sm opacity-80">{formatCurrency(monthlyHistory.reduce((acc, curr) => acc + curr.earnedBasic, 0))} ÷ 12 Months</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">13th Month Pay</div>
                                        <div className="text-3xl font-mono font-bold">{formatCurrency(selectedEmployeeData.thirteenthMonth)}</div>
                                    </div>
                                </div>
                        </div>
                    )}

                    {/* --- Tax View --- */}
                    {modalConfig.type === 'tax' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 h-full flex flex-col">
                                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex-1">
                                <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <Calculator className="text-emerald-500" size={20} /> 
                                    Tax Annualization Details
                                </h4>
                                
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm p-3 bg-slate-50 rounded-lg">
                                        <span className="text-slate-600 font-medium">Total Taxable Income (YTD)</span>
                                        <span className="font-mono font-bold text-slate-800">{formatCurrency(selectedEmployeeData.ytdTaxable)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm p-3 bg-white border border-slate-100 rounded-lg">
                                        <span className="text-slate-600 font-medium">Annual Tax Due (Based on Table)</span>
                                        <span className="font-mono font-bold text-slate-800">{formatCurrency(selectedEmployeeData.taxDue)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm p-3 bg-white border border-slate-100 rounded-lg">
                                        <span className="text-slate-600 font-medium">Less: Total Tax Withheld</span>
                                        <span className="font-mono font-bold text-slate-600">({formatCurrency(selectedEmployeeData.taxWithheld)})</span>
                                    </div>
                                    
                                    <div className={`flex justify-between items-center mt-6 pt-6 border-t-2 border-dashed ${selectedEmployeeData.status === 'Refund Due' ? 'border-emerald-100 bg-emerald-50/50 p-4 rounded-xl' : selectedEmployeeData.status === 'Tax Payable' ? 'border-rose-100 bg-rose-50/50 p-4 rounded-xl' : 'border-slate-100 p-4 bg-slate-50/50 rounded-xl'}`}>
                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                            {selectedEmployeeData.status === 'Refund Due' ? 'Tax Refund Amount' : selectedEmployeeData.status === 'Tax Payable' ? 'Additional Tax Payable' : 'Result'}
                                        </span>
                                        <span className={`text-2xl font-mono font-extrabold ${selectedEmployeeData.status === 'Refund Due' ? 'text-emerald-600' : selectedEmployeeData.status === 'Tax Payable' ? 'text-rose-600' : 'text-slate-600'}`}>
                                            {formatCurrency(Math.abs(selectedEmployeeData.taxWithheld - selectedEmployeeData.taxDue))}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-6 flex items-center gap-2 text-xs text-slate-400 bg-slate-50 p-3 rounded-lg">
                                    <Info size={14} />
                                    <span>Tax calculation based on BIR Revised Withholding Tax Table (2025).</span>
                                </div>
                            </div>
                            </div>
                    )}

                </div>

                <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3 shrink-0">
                    <button onClick={closeModal} className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">Close</button>
                    {modalConfig.type === '13th' && (
                        <button className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-lg active:scale-95 flex items-center gap-2">
                            <Download size={16} /> Export Computation
                        </button>
                    )}
                </div>
            </div>
        )}
    </Modal>
    </>
  );
};

export default YearEndTab;
