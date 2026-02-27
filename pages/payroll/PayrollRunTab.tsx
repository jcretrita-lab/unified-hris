
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  MoreHorizontal, 
  Building2, 
  User, 
  FilePlus, 
  PauseCircle, 
  ChevronDown, 
  Clock, 
  CheckCircle2, 
  Layers,
  AlertTriangle,
  FileText,
  CreditCard,
  Printer,
  Download,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { MOCK_PAYROLL_DATA } from './mockData';
import { PayrollItem } from './types';
import Modal from '../../components/Modal';
import { PayslipTemplate } from '../../components/PayslipTemplate';

const PayrollRunTab: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Modal State
  const [selectedPayslip, setSelectedPayslip] = useState<PayrollItem | null>(null);

  // Filter Logic
  const filteredData = MOCK_PAYROLL_DATA.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleAll = () => {
    if (selectedIds.size === filteredData.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredData.map(i => i.id)));
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Generated': return 'bg-emerald-500 text-white';
      case 'Review Needed': return 'bg-rose-500 text-white';
      case 'Ready': return 'bg-indigo-500 text-white';
      default: return 'bg-slate-400 text-white';
    }
  };

  const getAttendanceStyles = (status: string) => {
    switch (status) {
      case 'Complete': return 'text-emerald-600 font-bold';
      case 'Incomplete': return 'text-rose-600 font-bold';
      default: return 'text-slate-500';
    }
  };

  const formatCurrency = (amount: number) => {
    return `₱${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm min-h-[600px] flex flex-col"
    >
      {/* Disclaimer Banner */}
      <div className="bg-amber-50 border-b border-amber-100 px-6 py-3 flex items-center gap-3">
          <AlertTriangle size={16} className="text-amber-600 shrink-0" />
          <p className="text-xs font-bold text-amber-800">
              Note: These payroll figures are preliminary and not final until the batch process is committed. Changes to timekeeping may still affect these values.
          </p>
      </div>

      {/* Top Controls */}
      <div className="p-6 border-b border-slate-50 flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center bg-white">
          
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
              {['Shift', 'Department', 'Status'].map(filter => (
                  <button key={filter} className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-white hover:border-indigo-200 hover:text-indigo-600 transition-all group">
                      {filter === 'Shift' && <Clock size={14} />}
                      {filter === 'Department' && <Building2 size={14} />}
                      {filter === 'Status' && <Filter size={14} />}
                      {filter}
                      <ChevronDown size={12} className="ml-1 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                  </button>
              ))}
          </div>

          {/* Search and Batch Button */}
          <div className="flex items-center gap-3 w-full xl:w-auto">
              <div className="relative w-full xl:w-64">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>
              <button 
                  onClick={() => navigate('/manage/payroll/batch')}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-95 whitespace-nowrap"
              >
                  <Layers size={16} /> Batch Process
              </button>
          </div>
      </div>

      {/* Action Bar */}
      <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex flex-wrap gap-4 items-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">Action Buttons</span>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50 transition-all shadow-sm">
              <CreditCard size={16} /> Generate FBAT / Debit Advise Report
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:text-indigo-700 hover:border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm">
              <FilePlus size={16} /> Generate Payslip
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:text-amber-700 hover:border-amber-200 hover:bg-amber-50 transition-all shadow-sm">
              <PauseCircle size={16} /> Hold Payroll
          </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-50">
              <thead className="bg-slate-50/30 text-left">
                  <tr>
                      <th className="px-6 py-4 w-12">
                          <div 
                              onClick={toggleAll}
                              className={`w-5 h-5 border-2 rounded flex items-center justify-center cursor-pointer transition-all ${selectedIds.size === filteredData.length && filteredData.length > 0 ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white hover:border-slate-400'}`}
                          >
                              {selectedIds.size === filteredData.length && filteredData.length > 0 && <CheckCircle2 size={12} className="text-white" />}
                          </div>
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-slate-600 group">
                          Employee Name <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-1">↓</span>
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Attendance</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bank Details</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Net Pay</th>
                      <th className="px-6 py-4 w-10"></th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                  {filteredData.map((item) => (
                      <tr 
                          key={item.id} 
                          className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                          onClick={() => setSelectedPayslip(item)}
                      >
                          <td className="px-6 py-4" onClick={(e) => { e.stopPropagation(); toggleSelection(item.id); }}>
                              <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${selectedIds.has(item.id) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white hover:border-slate-400'}`}>
                                  {selectedIds.has(item.id) && <CheckCircle2 size={12} className="text-white" />}
                              </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200">
                                      {item.avatar}
                                  </div>
                                  <div>
                                      <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{item.name}</div>
                                      <div className="text-[10px] text-slate-500 font-medium">{item.department}</div>
                                  </div>
                              </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-sm ${getStatusStyles(item.status)}`}>
                                  {item.status}
                              </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`text-xs ${getAttendanceStyles(item.attendance)}`}>
                                  {item.attendance}
                              </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                  <div className="text-sm font-bold text-slate-700">{item.bankName}</div>
                                  <div className="text-xs font-mono text-slate-500">{item.accountNumber}</div>
                              </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                              <span className="text-sm font-mono font-bold text-slate-900">
                                  {formatCurrency(item.netPay)}
                              </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                              <button className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-white rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                  <MoreHorizontal size={18} />
                              </button>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>

      {/* Footer Pagination */}
      <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Showing {filteredData.length} Employees</span>
          <div className="flex gap-2">
              <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 disabled:opacity-50 transition-all"><ChevronLeft size={16}/></button>
              <div className="flex gap-1">
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-100">1</button>
              </div>
              <button className="flex items-center gap-1 px-3 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 text-xs font-bold transition-all">
                  Next <ChevronRight size={14}/>
              </button>
          </div>
      </div>

      {/* Payslip Detail Modal */}
      <Modal isOpen={!!selectedPayslip} onClose={() => setSelectedPayslip(null)} className="max-w-4xl">
        <div className="flex flex-col max-h-[85vh]">
             {/* Modal Header */}
             <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                   <FileText className="text-indigo-600" size={20} />
                   <h3 className="font-bold text-slate-800">Payslip Preview</h3>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all shadow-sm">
                       <Printer size={14} /> Print
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white border border-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all shadow-sm">
                       <Download size={14} /> Download
                    </button>
                    <div className="w-px h-6 bg-slate-200 mx-1"></div>
                    <button 
                        onClick={() => setSelectedPayslip(null)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>
             </div>

             {/* Modal Content - Document View */}
             <div className="flex-1 overflow-y-auto bg-gray-100 p-8 flex justify-center">
                 {selectedPayslip && (
                    <div className="shadow-xl">
                        <PayslipTemplate data={selectedPayslip} />
                    </div>
                 )}
             </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default PayrollRunTab;
